import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// 优先使用 node-canvas 真实渲染；不可用时退回内置 Canvas 2D mock，
// 用于验证渲染链路逻辑（paint 流程、视口变换、命中、排序），不校验像素输出。
let realCanvas = null;
try {
  realCanvas = (await import('canvas')).default;
} catch {
  realCanvas = null;
}

/**
 * 极简 Canvas 2D context mock：接受任意属性赋值，记录调用序列。
 * 模拟真实 canvas 的 save/restore 语义：restore 会把样式属性恢复为
 * save 时的状态（用于捕获"样式被整体跳过 → context 保持默认黑"类 bug）。
 */
const createContextMock = () => {
  const calls = [];
  const saved = [];
  const style = {}; // 模拟 context 样式状态（save/restore 作用域）
  const STYLE_PROPS = [
    'fillStyle', 'strokeStyle', 'lineWidth', 'globalAlpha',
    'shadowBlur', 'shadowOffsetX', 'shadowOffsetY', 'shadowColor',
    'textAlign', 'textBaseline', 'font', 'miterLimit',
    'lineDashOffset', 'globalCompositeOperation', 'filter'
  ];
  const ctx = {
    _calls: calls,
    canvas: null,
    measureText(text) {
      const s = String(text);
      return { width: s.length * 8, actualBoundingBoxLeft: 0, actualBoundingBoxRight: s.length * 8, height: 12 };
    },
    createLinearGradient() { return { addColorStop() {} }; },
    createRadialGradient() { return { addColorStop() {} }; },
    save() { saved.push(Object.assign({}, style)); },
    restore() {
      const s = saved.pop();
      for(const k in style) delete style[k];
      Object.assign(style, s || {});
    }
  };
  return new Proxy(ctx, {
    get(target, prop) {
      if(prop in target) return target[prop];
      if(STYLE_PROPS.indexOf(prop) >= 0) return style[prop];
      return (...args) => { target._calls.push([prop, ...args]); };
    },
    set(target, prop, value) {
      if(STYLE_PROPS.indexOf(prop) >= 0) {
        style[prop] = value;
        target._calls.push([prop, value]);
      }
      else {
        target[prop] = value;
      }
      return true;
    }
  });
};

class MockCanvas {
  constructor(w, h) {
    this._width = w;
    this._height = h;
    this.ctx = createContextMock();
    this.ctx.canvas = this;
    this.style = {};
  }
  getContext() { return this.ctx; }
  getBoundingClientRect() { return { left: 0, top: 0, width: this._width, height: this._height }; }
  addEventListener() {}
  removeEventListener() {}
  get width() { return this._width; }
  set width(v) { this._width = v; }
  get height() { return this._height; }
  set height(v) { this._height = v; }
}

const Canvas = realCanvas || MockCanvas;

const makeGraph = async () => {
  const canvas = new Canvas(800, 600);
  const { jmGraph, jmRect, jmCircle, jmLabel, jmLine } = await import('../index.js');
  const graph = new jmGraph(canvas, { width: 800, height: 600, autoRefresh: false });
  return { canvas, graph, jmRect, jmCircle, jmLabel, jmLine };
};

describe('jmGraph 渲染集成', () => {
  test('构造 + 添加图形 + redraw 全链路', async () => {
    const { graph, jmRect } = await makeGraph();
    const rect = new jmRect({ position: { x: 100, y: 100 }, width: 100, height: 60, style: { fill: '#f00' } });
    graph.children.add(rect);
    graph.redraw();
    assert.equal(rect.graph, graph);
    assert.ok(rect.absoluteBounds.left >= 100);
    // 清屏被调用
    const calls = graph.canvas.ctx._calls;
    assert.ok(calls.some(c => c[0] === 'clearRect'));
  });

  test('连续 redraw 后样式保持（快照恢复不丢 context 样式）', async () => {
    const { graph, jmRect } = await makeGraph();
    const rect = new jmRect({ position: { x: 10, y: 10 }, width: 50, height: 50, style: { fill: '#f00', stroke: '#00f', lineWidth: 2 } });
    graph.children.add(rect);
    graph.redraw();
    const ctx = graph.canvas.ctx;
    const before = ctx._calls.length;
    graph.redraw(); // 第二次：样式未变，应通过快照恢复重写 context
    const writes = ctx._calls.slice(before);
    assert.ok(writes.some(c => c[0] === 'fillStyle' && c[1] === '#f00'),
      '第二次绘制必须仍写入 fillStyle（回归：样式整体跳过导致全黑）');
    assert.ok(writes.some(c => c[0] === 'strokeStyle' && c[1] === '#00f'));
    assert.ok(writes.some(c => c[0] === 'lineWidth' && c[1] === 2));
  });

  test('setZoom 后视口与坐标转换一致', async () => {
    const { graph } = await makeGraph();
    graph.setZoom(2, 400, 300);
    assert.equal(graph.viewport.scaleFactor, 2);
    assert.equal(graph.scaleFactor, 2); // 旧 API 兼容
    const w = graph.screenToWorld({ x: 0, y: 0 });
    assert.ok(Math.abs(w.x * 2 + graph.translation.x) < 1e-6);
  });

  test('fitView 缩放内容并居中', async () => {
    const { graph, jmRect } = await makeGraph();
    const rect = new jmRect({ position: { x: 0, y: 0 }, width: 400, height: 300, style: { fill: '#0f0' } });
    graph.children.add(rect);
    graph.fitView(0);
    assert.ok(graph.viewport.scaleFactor > 1.5);
    const center = graph.worldToScreen({ x: 200, y: 150 });
    assert.ok(Math.abs(center.x - 400) < 2);
    assert.ok(Math.abs(center.y - 300) < 2);
  });

  test('pan + zoom 后命中索引仍可用', async () => {
    const { graph, jmRect } = await makeGraph();
    const rect = new jmRect({ position: { x: 100, y: 100 }, width: 100, height: 60, style: { fill: '#00f' }, interactive: true });
    graph.children.add(rect);
    graph.pan(50, 30);
    graph.setZoom(2, 0, 0);
    graph._syncHitIndex();
    // 世界坐标点 (150,130) 在 rect 内，应命中
    assert.ok(rect.checkPoint({ x: 150, y: 130 }));
    assert.ok(graph.hitIndex.size >= 1);
  });

  test('批量添加 + 惰性排序', async () => {
    const { graph, jmRect } = await makeGraph();
    const shapes = [];
    for(let i = 0; i < 20; i++) {
      shapes.push(new jmRect({ position: { x: i * 30, y: 0 }, width: 20, height: 20, style: { fill: '#000' } }));
    }
    graph.children.addAll(shapes);
    assert.equal(graph.children.length, 20);
    // add 后未立即排序，绘制时才排序
    assert.equal(graph.__childrenSortDirty, true);
    graph.redraw();
    assert.equal(graph.__childrenSortDirty, false);
  });

  test('toSVG 递归包含嵌套图形', async () => {
    const { graph, jmRect } = await makeGraph();
    const inner = new jmRect({ position: { x: 10, y: 10 }, width: 20, height: 20, style: { fill: '#000' } });
    const outer = new jmRect({ position: { x: 0, y: 0 }, width: 50, height: 50, style: { fill: '#f00' } });
    outer.children.add(inner);
    graph.children.add(outer);
    const svg = graph.toSVG();
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('</svg>'));
  });

  test('事件命中链路：raiseEvent + 索引过滤', async () => {
    const { graph, jmRect } = await makeGraph();
    // getEventPosition 依赖 document，注入最小环境
    globalThis.document = globalThis.document || {
      documentElement: { scrollLeft: 0, scrollTop: 0 },
      body: { scrollLeft: 0, scrollTop: 0 },
      createElement: () => ({ getBoundingClientRect: () => ({ left: 0, top: 0 }) })
    };
    let hit = null;
    const rect = new jmRect({ position: { x: 100, y: 100 }, width: 100, height: 60, style: { fill: '#00f' }, interactive: true });
    rect.bind('mousedown', () => { hit = 'rect'; });
    graph.children.add(rect);
    graph.redraw(); // 事件命中依赖绘制后的 absoluteBounds
    graph.raiseEvent('mousedown', {
      position: { offsetX: 150, offsetY: 130 },
      button: 0, cancel: false
    });
    assert.equal(hit, 'rect');
  });
});

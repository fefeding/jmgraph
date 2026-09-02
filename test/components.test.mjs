import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// 优先使用 node-canvas 真实渲染；不可用时退回内置 mock（同 smoke.test.mjs）
let realCanvas = null;
try {
  realCanvas = (await import('canvas')).default;
} catch {
  realCanvas = null;
}

/**
 * 极简 Canvas 2D context mock（同 smoke.test.mjs，measureText 宽度 = 字符数 * 8）
 */
const createContextMock = () => {
  const calls = [];
  const saved = [];
  const style = {};
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
      for (const k in style) delete style[k];
      Object.assign(style, s || {});
    }
  };
  return new Proxy(ctx, {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (STYLE_PROPS.indexOf(prop) >= 0) return style[prop];
      return (...args) => { target._calls.push([prop, ...args]); };
    },
    set(target, prop, value) {
      if (STYLE_PROPS.indexOf(prop) >= 0) {
        style[prop] = value;
        target._calls.push([prop, value]);
      } else {
        target[prop] = value;
      }
      return true;
    }
  });
};

class MockCanvas {
  constructor(w, h) {
    this._w = w;
    this._h = h;
    this.ctx = createContextMock();
    this.ctx.canvas = this;
    this.style = {};
    this.listeners = {};
    this.childNodes = [];
  }
  getContext() { return this.ctx; }
  getBoundingClientRect() { return { left: 0, top: 0, width: this._w, height: this._h }; }
  addEventListener(type, fn) {
    (this.listeners[type] = this.listeners[type] || []).push(fn);
  }
  removeEventListener(type, fn) {
    const a = this.listeners[type];
    if (a) {
      const i = a.indexOf(fn);
      if (i >= 0) a.splice(i, 1);
    }
  }
  get width() { return this._w; }
  set width(v) { this._w = v; }
  get height() { return this._h; }
  set height(v) { this._h = v; }
}

const Canvas = realCanvas || MockCanvas;

// ---------- 环境桩 ----------

/** 全局 document stub：createElement('canvas') 返回 MockCanvas，事件可被捕获 */
function installDom() {
  const docListeners = {};
  globalThis.document = {
    documentElement: { scrollLeft: 0, scrollTop: 0 },
    body: { scrollLeft: 0, scrollTop: 0 },
    activeElement: null,
    createElement: (tag) => {
      if (tag === 'canvas') return new Canvas(800, 600);
      return { style: {}, click() {}, appendChild() {}, removeChild() {} };
    },
    addEventListener(type, fn) {
      (docListeners[type] = docListeners[type] || []).push(fn);
    },
    removeEventListener(type, fn) {
      const a = docListeners[type];
      if (a) {
        const i = a.indexOf(fn);
        if (i >= 0) a.splice(i, 1);
      }
    },
    getElementById: () => null
  };
  return docListeners;
}

function cleanupDom() {
  delete globalThis.document;
  delete globalThis.window;
}

/** 容器元素 mock */
function makeContainer() {
  const el = { _w: 800, _h: 600, childNodes: [], style: {}, appendChild(c) { el.childNodes.push(c); } };
  Object.defineProperties(el, {
    clientWidth: { get() { return el._w; } },
    clientHeight: { get() { return el._h; } },
    offsetWidth: { get() { return el._w; } },
    offsetHeight: { get() { return el._h; } }
  });
  return el;
}

const basicStages = () => ([
  { id: 'fetch', type: 'fetch', name: '拉取用户数据', inputs: [], outputs: ['users'], dependsOn: [], _pos: { x: 40, y: 80 } },
  { id: 'transform', type: 'transform', name: '数据清洗', inputs: [{ from: 'fetch.users' }], outputs: ['clean'], dependsOn: ['fetch'], _pos: { x: 420, y: 80 } }
]);

/**
 * 创建挂载好的组件
 * @param {object} [opts]
 * @returns {{ fg: import('../src/components/index.js').FlowGraphComponent, container: object, docListeners: object, graph: object }}
 */
function mountComponent(opts) {
  const docListeners = installDom();
  const { createFlowGraph } = cmp;
  const container = makeContainer();
  const options = Object.assign({ stages: basicStages(), mode: 'edit', graphOptions: { autoRefresh: false } }, opts || {});
  const fg = createFlowGraph(container, options);
  const graph = fg.graph;
  assert.ok(graph, 'mount 后应存在底层实例');
  return { fg, container, docListeners, graph };
}

// 延迟到模块加载后导入（与 document 无关，但保证先定义上面工具）
import * as cmp from '../src/components/index.js';

const { FlowGraphComponent, ComponentBase, normalizeOptions, DEFAULT_OPTIONS, validateStages, measureContainer } = cmp;
const { computeLevels, computeLayout, edgeLabel, anchor, NODE_TYPES, STATUS_META, typeColor } = cmp;

// 层/节点/连线查询工具
function layerOf(graph, name) {
  let found = null;
  graph.children.each((i, el) => { if (el.name === name) found = el; });
  return found;
}
function nodesOf(fg) {
  const L = layerOf(fg.graph, 'nodes');
  const arr = [];
  if (L) L.children.each((i, el) => arr.push(el));
  return arr;
}
function nodeOf(fg, id) {
  return nodesOf(fg).find(n => n.stage && n.stage.id === id) || null;
}
function edgesOf(fg) {
  const L = layerOf(fg.graph, 'edges');
  const arr = [];
  if (L) L.children.each((i, el) => arr.push(el));
  return arr;
}
function fireCanvas(fg, evtType, payload) {
  const listeners = fg.graph.canvas.listeners || {};
  const fns = listeners[evtType] || [];
  assert.ok(fns.length > 0, `canvas 应注册了 ${evtType} 监听`);
  fns.forEach(fn => fn(payload));
}
function fireDoc(docListeners, evtType, payload) {
  const fns = docListeners[evtType] || [];
  assert.ok(fns.length > 0, `document 应注册了 ${evtType} 监听`);
  fns.forEach(fn => fn(payload));
}

// ---------- 纯函数 ----------

describe('components 纯函数', () => {
  test('normalizeOptions 合并默认值并纠错', () => {
    const o = normalizeOptions(null);
    assert.equal(o.mode, 'view');
    assert.ok(Array.isArray(o.stages));
    const o2 = normalizeOptions({ mode: 'hack', onSelect: 'not-a-fn' });
    assert.equal(o2.mode, 'view');
    assert.equal(o2.onSelect, null);
    assert.equal(o2.autoFit, true);
  });

  test('DEFAULT_OPTIONS 含全部公开回调', () => {
    ['onSelect', 'onChange', 'onEdgeClick', 'onNodeEdit', 'onContextMenu', 'onLog', 'onReady', 'onError'].forEach(k => {
      assert.ok(k in DEFAULT_OPTIONS, `DEFAULT_OPTIONS 缺少 ${k}`);
    });
  });

  test('validateStages 检查 id 存在性', () => {
    assert.equal(validateStages([{ id: 'a' }]).valid, true);
    assert.equal(validateStages([{ id: 'a' }, { id: 'a' }]).warnings.length, 1);
    assert.equal(validateStages('nope').valid, false);
  });

  test('measureContainer 兜底尺寸', () => {
    assert.deepEqual(measureContainer(null, { width: 320, height: 240 }), { width: 320, height: 240 });
  });

  test('computeLevels 计算 DAG 层级', () => {
    const levels = computeLevels([
      { id: 'a', dependsOn: [] },
      { id: 'b', dependsOn: ['a'] },
      { id: 'c', dependsOn: ['a'] },
      { id: 'd', dependsOn: ['b', 'c'] }
    ]);
    assert.equal(levels.get('a'), 0);
    assert.equal(levels.get('b'), 1);
    assert.equal(levels.get('c'), 1);
    assert.equal(levels.get('d'), 2);
  });

  test('computeLayout 返回 idToPos 与 levels', () => {
    const { idToPos, levels } = computeLayout([
      { id: 'a', dependsOn: [] },
      { id: 'b', dependsOn: ['a'] }
    ]);
    assert.ok(idToPos.a && typeof idToPos.a.x === 'number');
    assert.equal(levels.get('a'), 0);
    assert.equal(levels.get('b'), 1);
  });

  test('edgeLabel 依据 inputs.from 前缀生成标签', () => {
    const stages = [
      { id: 'fetch', outputs: ['users', 'meta'] },
      { id: 't', inputs: [{ from: 'fetch.users' }, { from: 'fetch.meta' }] }
    ];
    assert.equal(edgeLabel(stages, 'fetch', 't'), 'users / meta');
    assert.equal(edgeLabel(stages, 'fetch', 'none'), '');
  });

  test('anchor 返回边界上的锚点', () => {
    const b = { left: 0, top: 0, right: 100, bottom: 60, width: 100, height: 60 };
    assert.deepEqual(anchor(b, 'right'), { x: 100, y: 30 });
    assert.deepEqual(anchor(b, 'left'), { x: 0, y: 30 });
  });

  test('NODE_TYPES / STATUS_META / typeColor 元数据齐全', () => {
    assert.ok(NODE_TYPES.length >= 5);
    ['fetch', 'script', 'transform', 'custom', 'agent'].forEach(t => {
      assert.ok(NODE_TYPES.some(x => x.type === t), `缺少节点类型 ${t}`);
    });
    assert.ok(STATUS_META.success && STATUS_META.failed && STATUS_META.running);
    assert.equal(typeof typeColor.fetch, 'string');
  });
});

// ---------- 组件生命周期 ----------

describe('FlowGraphComponent 生命周期', () => {
  test('mount 后就绪事件 + 节点/连线渲染', () => {
    let ready = null;
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: basicStages(), graphOptions: { autoRefresh: false } });
    fg.on('ready', inst => { ready = inst; });
    const inst = fg.mount(container);
    assert.equal(ready, fg);
    assert.equal(inst, fg.instance);
    assert.equal(fg.mounted, true);
    assert.equal(fg.state, 'mounted');
    assert.equal(fg.errors.length, 0);
    assert.equal(nodesOf(fg).length, 2);
    assert.equal(edgesOf(fg).length, 1);
    fg.destroy();
    assert.equal(fg.mounted, false);
    assert.equal(fg.destroy(), undefined, 'destroy 幂等');
    cleanupDom();
  });

  test('构造参数可省略 / 非法配置不崩溃', () => {
    const doc = installDom();
    const fg = new FlowGraphComponent(null);
    const container = makeContainer();
    fg.mount(container);
    assert.equal(nodesOf(fg).length, 0);
    fg.update(null); // 不崩溃
    fg.update({ mode: 'edit' });
    fg.destroy();
    cleanupDom();
  });

  test('update({stages}) 增量重建', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: basicStages(), graphOptions: { autoRefresh: false } });
    fg.mount(container);
    assert.equal(nodesOf(fg).length, 2);
    const extra = basicStages().concat([{ id: 'script', type: 'script', dependsOn: ['fetch'], inputs: [{ from: 'fetch.users' }] }]);
    fg.update({ stages: extra });
    assert.equal(nodesOf(fg).length, 3);
    fg.destroy();
    cleanupDom();
  });

  test('mount 幂等：重复 mount 不重建', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: basicStages(), graphOptions: { autoRefresh: false } });
    fg.mount(container);
    const first = fg.instance;
    fg.mount(container);
    assert.equal(fg.instance, first);
    fg.destroy();
    cleanupDom();
  });
});

// ---------- 数据操作 ----------

describe('FlowGraphComponent 数据操作', () => {
  test('addStage 返回新 id 并触发 change/select', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: [], mode: 'edit', graphOptions: { autoRefresh: false } });
    const changes = [];
    const selects = [];
    fg.on('change', s => changes.push(s));
    fg.on('select', id => selects.push(id));
    fg.mount(container);
    const id = fg.addStage('script');
    assert.match(id, /^script_\d+$/);
    assert.equal(nodesOf(fg).length, 1);
    assert.equal(selects[selects.length - 1], id);
    assert.equal(changes.length, 1);
    assert.equal(changes[0][0].id, id);
    // change 事件返回的是快照，改动不影响内部
    changes[0][0].name = 'HACK';
    assert.equal(nodeOf(fg, id).stage.name, undefined);
    fg.destroy();
    cleanupDom();
  });

  test('removeStage 清理依赖引用', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: basicStages(), graphOptions: { autoRefresh: false } });
    fg.mount(container);
    let changed = null;
    fg.on('change', s => { changed = s; });
    fg.removeStage('fetch');
    assert.equal(nodesOf(fg).length, 1);
    assert.equal(fg.getSelected(), null);
    // transform 的 dependsOn / inputs 引用被清理
    const t = changed.find(s => s.id === 'transform');
    assert.deepEqual(t.dependsOn, []);
    assert.deepEqual(t.inputs, []);
    fg.destroy();
    cleanupDom();
  });

  test('renameStage 修正依赖与选中态，重复名返回 false', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: basicStages(), graphOptions: { autoRefresh: false } });
    fg.mount(container);
    fg.select('fetch');
    const ok = fg.renameStage('fetch', 'pull');
    assert.equal(ok, true);
    const stages = fg.getStages();
    assert.equal(stages.find(s => s.id === 'pull').name, '拉取用户数据');
    const t = stages.find(s => s.id === 'transform');
    assert.deepEqual(t.dependsOn, ['pull']);
    assert.equal(t.inputs[0].from, 'pull.users');
    assert.equal(fg.getSelected(), 'pull');
    assert.equal(fg.renameStage('pull', 'transform'), false, '重名应失败');
    fg.destroy();
    cleanupDom();
  });

  test('updateStage 同步节点名称', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: basicStages(), graphOptions: { autoRefresh: false } });
    fg.mount(container);
    fg.updateStage('fetch', { name: '改名后' });
    const node = nodeOf(fg, 'fetch');
    assert.equal(node.nameText.text, '改名后');
    fg.destroy();
    cleanupDom();
  });

  test('getStages 返回隔离快照', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: basicStages(), graphOptions: { autoRefresh: false } });
    fg.mount(container);
    const snap = fg.getStages();
    snap[0].name = 'MUTATE';
    snap[0]._pos = { x: 999, y: 999 };
    snap[0].dependsOn.push('x');
    assert.notEqual(fg.getStages()[0].name, 'MUTATE');
    assert.notEqual(fg.getStages()[0]._pos.x, 999);
    assert.deepEqual(fg.getStages()[0].dependsOn, []);
    fg.destroy();
    cleanupDom();
  });
});

// ---------- 交互：选中 / 连线 / 右键 / 键盘 ----------

describe('FlowGraphComponent 交互', () => {
  test('点击节点触发 select（含视图双击不误删）', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: basicStages(), mode: 'edit', graphOptions: { autoRefresh: false } });
    let sel = 'none';
    let edit = null;
    fg.on('select', id => { sel = id; });
    fg.on('nodeEdit', id => { edit = id; });
    fg.mount(container);
    const node = nodeOf(fg, 'fetch');
    node.__movedDist = 0;
    node.emit('click', {});
    assert.equal(sel, 'fetch');
    assert.equal(fg.getSelected(), 'fetch');
    node.emit('dblclick', {});
    assert.equal(edit, 'fetch');
    fg.destroy();
    cleanupDom();
  });

  test('点击连线触发 edgeClick', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: basicStages(), graphOptions: { autoRefresh: false } });
    let clicked = null;
    fg.on('edgeClick', e => { clicked = e; });
    fg.mount(container);
    const edge = edgesOf(fg)[0];
    assert.ok(edge, '应存在连线');
    edge.emit('click', {});
    assert.ok(clicked);
    assert.equal(clicked.source, 'fetch');
    assert.equal(clicked.target, 'transform');
    fg.destroy();
    cleanupDom();
  });

  test('右键命中节点返回 node 信息', () => {
    const doc = installDom();
    const container = makeContainer();
    let info = null;
    const fg = new FlowGraphComponent({
      stages: basicStages(),
      graphOptions: { autoRefresh: false },
      onContextMenu: i => { info = i; }
    });
    fg.mount(container);
    fg.resetView(); // 视图归零，让 client 坐标 == 世界坐标，便于断言
    // 画布左上角是节点 fetch 所在区域（节点 _pos {40,80}，宽高 168x66）
    fireCanvas(fg, 'contextmenu', { clientX: 120, clientY: 110, preventDefault() {} });
    assert.ok(info, 'onContextMenu 应被触发');
    assert.equal(info.type, 'node');
    assert.equal(info.id, 'fetch');
    assert.equal(typeof info.x, 'number');
    assert.equal(typeof info.clientX, 'number');
    fg.destroy();
    cleanupDom();
  });

  test('右键空白画布返回 pane 信息', () => {
    const doc = installDom();
    const container = makeContainer();
    let info = null;
    const fg = new FlowGraphComponent({
      stages: basicStages(),
      graphOptions: { autoRefresh: false },
      onContextMenu: i => { info = i; }
    });
    fg.mount(container);
    fg.resetView();
    // 远离节点的空白区域（右上角）
    fireCanvas(fg, 'contextmenu', { clientX: 780, clientY: 40, preventDefault() {} });
    assert.ok(info);
    assert.equal(info.type, 'pane');
    assert.equal(info.id, null);
    assert.equal(info.stage, null);
    fg.destroy();
    cleanupDom();
  });

  test('view 模式 Delete 不删除；edit 模式 Delete 删除选中', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: basicStages(), mode: 'view', graphOptions: { autoRefresh: false } });
    fg.mount(container);
    fg.select('fetch');
    const nodes = () => nodesOf(fg).length;
    fireDoc(doc, 'keydown', { key: 'Delete', preventDefault() {} });
    assert.equal(nodes(), 2, 'view 模式 Delete 不应删除节点');
    fg.setMode('edit');
    fireDoc(doc, 'keydown', { key: 'Delete', preventDefault() {} });
    assert.equal(nodes(), 1, 'edit 模式 Delete 应删除选中节点');
    assert.equal(nodeOf(fg, 'fetch'), null);
    fg.destroy();
    cleanupDom();
  });

  test('Esc 取消选中；输入框聚焦时快捷键不拦截', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: basicStages(), mode: 'edit', graphOptions: { autoRefresh: false } });
    fg.mount(container);
    fg.select('fetch');
    assert.equal(fg.getSelected(), 'fetch');
    // 模拟输入框聚焦
    globalThis.document.activeElement = { tagName: 'INPUT' };
    fireDoc(doc, 'keydown', { key: 'Delete', preventDefault() {} });
    assert.equal(fg.getSelected(), 'fetch', '输入框聚焦时不应拦截');
    assert.equal(nodesOf(fg).length, 2);
    globalThis.document.activeElement = null;
    fireDoc(doc, 'keydown', { key: 'Escape', preventDefault() {} });
    assert.equal(fg.getSelected(), null, 'Esc 应取消选中');
    fg.destroy();
    cleanupDom();
  });

  test('destroy 解绑 contextmenu/keydown 监听', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: basicStages(), graphOptions: { autoRefresh: false } });
    fg.mount(container);
    const canvas = fg.graph.canvas;
    const beforeCanvas = (canvas.listeners.contextmenu || []).length;
    const beforeDoc = (doc.keydown || []).length;
    assert.equal(beforeCanvas, 1, 'contextmenu 仅由 flow 组件绑定');
    assert.ok(beforeDoc >= 1, 'document 上应存在 keydown 监听（含引擎自身的）');
    fg.destroy();
    assert.equal((canvas.listeners.contextmenu || []).length, 0, 'destroy 后 contextmenu 应解绑');
    assert.ok((doc.keydown || []).length < beforeDoc, 'destroy 后 keydown 监听应减少');
    cleanupDom();
  });
});

// ---------- 名称省略 ----------

describe('节点名称省略号', () => {
  test('短名称原样显示', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: [{ id: 'a', type: 'fetch', name: '短名', _pos: { x: 20, y: 20 } }], graphOptions: { autoRefresh: false } });
    fg.mount(container);
    assert.equal(nodeOf(fg, 'a').nameText.text, '短名');
    fg.destroy();
    cleanupDom();
  });

  test('长名称按像素省略号截断', () => {
    const doc = installDom();
    const container = makeContainer();
    const longName = '这是一个非常非常非常非常非常非常长的节点名称用来测试省略号行为是否正确';
    const fg = new FlowGraphComponent({ stages: [{ id: 'a', type: 'fetch', name: longName, _pos: { x: 20, y: 20 } }], graphOptions: { autoRefresh: false } });
    fg.mount(container);
    const text = nodeOf(fg, 'a').nameText.text;
    assert.ok(text.endsWith('…'), `应带省略号，实际: ${text}`);
    assert.ok(text.length < longName.length, '应被截断');
    fg.destroy();
    cleanupDom();
  });

  test('无名称时回退到 id', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: [{ id: 'no-name-node', type: 'fetch', _pos: { x: 20, y: 20 } }], graphOptions: { autoRefresh: false } });
    fg.mount(container);
    assert.equal(nodeOf(fg, 'no-name-node').nameText.text, 'no-name-node');
    fg.destroy();
    cleanupDom();
  });
});

// ---------- 运行态 ----------

describe('运行态与视图', () => {
  test('setRunStatus / getRunStatus / resetRun', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: basicStages(), graphOptions: { autoRefresh: false } });
    fg.mount(container);
    fg.setRunStatus({ fetch: 'running' });
    assert.deepEqual(fg.getRunStatus(), { fetch: 'running' });
    fg.resetRun();
    assert.deepEqual(fg.getRunStatus(), {});
    fg.destroy();
    cleanupDom();
  });

  test('run() 单节点执行并结束', async () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: [{ id: 'solo', type: 'script' }], graphOptions: { autoRefresh: false } });
    fg.mount(container);
    const logs = [];
    fg.on('log', (m, l) => logs.push(l || 'info'));
    await fg.run();
    assert.equal(fg.isRunning(), false);
    const status = fg.getRunStatus()['solo'];
    assert.ok(['success', 'failed'].includes(status), `状态应为 success/failed，实际 ${status}`);
    assert.ok(logs.includes('info') || logs.length > 0);
    fg.destroy();
    cleanupDom();
  });

  test('zoomIn/zoomOut/zoomOut 后 resetView 还原', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: basicStages(), graphOptions: { autoRefresh: false } });
    fg.mount(container);
    fg.resetView();
    const base = fg.graph.scaleFactor;
    fg.zoomIn();
    assert.ok(fg.graph.scaleFactor > base);
    fg.zoomOut();
    fg.zoomOut();
    assert.ok(fg.graph.scaleFactor < base);
    fg.resetView();
    assert.ok(Math.abs(fg.graph.scaleFactor - 1) < 1e-9);
    fg.destroy();
    cleanupDom();
  });

  test('setMode 切换 editable', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: basicStages(), mode: 'view', graphOptions: { autoRefresh: false } });
    fg.mount(container);
    assert.equal(nodeOf(fg, 'fetch').editable, false);
    assert.equal(fg.setMode('edit'), 'edit');
    assert.equal(nodeOf(fg, 'fetch').editable, true);
    assert.equal(fg.setMode('view'), 'view');
    assert.equal(nodeOf(fg, 'fetch').editable, false);
    fg.destroy();
    cleanupDom();
  });

  test('移动结束写入 _pos 并触发 change', () => {
    const doc = installDom();
    const container = makeContainer();
    const fg = new FlowGraphComponent({ stages: basicStages(), graphOptions: { autoRefresh: false } });
    fg.mount(container);
    let changed = null;
    fg.on('change', s => { changed = s; });
    const node = nodeOf(fg, 'fetch');
    node.__movedDist = 0;
    node.position.x += 30;
    node.position.y += 20;
    node.emit('moveend', {});
    assert.ok(changed, 'moveend 应触发 change');
    const stage = changed.find(s => s.id === 'fetch');
    assert.equal(stage._pos.x, node.position.x);
    assert.equal(stage._pos.y, node.position.y);
    fg.destroy();
    cleanupDom();
  });
});

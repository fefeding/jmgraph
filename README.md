# jmGraph

[![npm version](https://img.shields.io/npm/v/jmgraph.svg)](https://www.npmjs.com/package/jmgraph)
[![npm downloads](https://img.shields.io/npm/dm/jmgraph.svg)](https://www.npmjs.com/package/jmgraph)
[![License: MIT](https://img.shields.io/npm/l/jmgraph.svg)](https://github.com/fefeding/jmgraph/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/fefeding/jmgraph.svg?branch=master)](https://travis-ci.org/fefeding/jmgraph)

基于 Canvas 的简单画图组件，让你用类似于 DOM 的方式，在 Canvas 上画图。

## ✨ 特性

- 🎨 **简单易用** - 类似 DOM 的 API 设计，学习成本低
- 🚀 **高性能** - 基于 Canvas 原生渲染，支持大量图形
- 📱 **跨平台** - 支持浏览器、Node.js 和微信小程序
- 🎯 **丰富图形** - 内置矩形、圆形、线条、箭头、贝塞尔曲线等常用图形
- 🎭 **事件系统** - 完整的鼠标和触摸事件支持
- 🔧 **可扩展** - 支持自定义图形控件
- 🌈 **样式丰富** - 支持渐变、阴影、透明度、滤镜、虚线、混合模式等样式
- 🖼️ **边框系统** - 完整的 border 支持（宽度/样式/颜色），四角独立圆角
- ✂️ **裁剪遮罩** - 支持 clipPath 裁剪路径和 mask 遮罩效果
- 📐 **图层管理** - 支持多图层操作，包括创建、切换、删除图层
- 🔍 **缩放平移** - 支持画布缩放和平移操作
- 📤 **导出功能** - 支持导出为 PNG、JPEG 和 SVG 格式
- 📝 **文本换行** - 支持文本自动换行显示

## 📦 安装

### npm

```bash
npm install jmgraph
```

### yarn

```bash
yarn add jmgraph
```

### CDN

直接下载 `dist/jmgraph.min.js` 并在 HTML 中引用：

```html
<script type="text/javascript" src="../dist/jmgraph.min.js"></script>
```

## 🚀 快速开始

> **注意**：`g.createShape()` 创建图形后会**自动添加到当前活动图层**，无需手动调用 `g.children.add()`。若设置了 `autoRefresh: true`（默认值），画布会自动刷新，也无需手动调用 `g.redraw()`。

### ES6 模块方式

```html
<script type="module">
  import jmGraph from "jmgraph";
  
  const container = document.getElementById('mycanvas_container');
  const g = jmGraph(container, {
    width: 800,
    height: 600,
    autoRefresh: true,
    style: {
      fill: '#000'
    }
  });
</script>
```

### CommonJS 方式

```javascript
const jmGraph = require('jmgraph');

const g = jmGraph.create('mycanvas_container', {
  width: 800,
  height: 600,
  style: {
    fill: '#000'
  }
});
```

### 绘制一个矩形

```javascript
const style = {
  stroke: '#46BF86',
  lineWidth: 2,
  shadow: '0,0,10,#fff'
};

const rect = g.createShape('rect', {
  style: style,
  position: {x: 100, y: 100},
  width: 100,
  height: 100
});

// createShape 会自动将图形添加到当前活动图层，无需手动 g.children.add()
// 如果 autoRefresh 为 true（默认），也不需要手动调用 g.redraw()
```

## 📚 文档

- [在线示例](https://fefeding.github.io/jmgraph/example/index.html)
- [新特性示例](https://fefeding.github.io/jmgraph/example/new-features.html)
- [样式扩展特性](https://fefeding.github.io/jmgraph/example/style-extension-demo.html)
- [基于 jmGraph 的图表库](https://github.com/fefeding/jmchart)
- [性能极限测试](https://fefeding.github.io/jmgraph/example/perf-test.html)

## 🎨 样式说明

jmGraph 支持简化的样式名称和原生 Canvas 样式：

| 简化名称 | 原生名称 | 说明 |
| :- | :- | :- |
| fill | fillStyle | 填充颜色、渐变或模式 |
| stroke | strokeStyle | 描边颜色、渐变或模式 |
| shadow | - | 阴影，格式：'0,0,10,#fff' |
| shadow.blur | shadowBlur | 阴影模糊级别 |
| shadow.x | shadowOffsetX | 阴影水平偏移 |
| shadow.y | shadowOffsetY | 阴影垂直偏移 |
| shadow.color | shadowColor | 阴影颜色 |
| lineWidth | lineWidth | 线条宽度 |
| miterLimit | miterLimit | 最大斜接长度 |
| font | font | 字体 |
| fontSize | font | 字体大小 |
| fontFamily | font | 字体名称 |
| opacity | globalAlpha | 透明度 |
| textAlign | textAlign | 文本水平对齐 |
| textBaseline | textBaseline | 文本垂直对齐 |
| lineJoin | lineJoin | 线条连接样式 |
| lineCap | lineCap | 线条端点样式 |
| maxWidth | maxWidth | 文本最大宽度（用于自动换行） |
| lineDash | - | 自定义虚线模式，数组或字符串格式，如 `[10, 5]` 或 `'10,5'` |
| lineDashOffset | lineDashOffset | 虚线偏移量 |
| filter | filter | CSS 滤镜效果，如 `'blur(3px) grayscale(50%)'` 或对象 `{ blur: 3, brightness: 1.2 }` |
| globalCompositeOperation | globalCompositeOperation | 混合模式，如 `multiply`、`screen`、`overlay` |
| border | - | 边框系统，对象 `{ width, style, color }` 或字符串 `'2px solid #ff0000'` |
| clipPath | - | 裁剪路径，传入图形控件实例 |
| mask | - | 遮罩效果，传入图形控件实例 |

### 渐变 (jmGradient)

jmGraph 支持完整的 CSS 渐变语法，通过 `jmGradient` 类实现。支持线性渐变和径向渐变。

#### 支持的格式

```javascript
// 1. 角度格式（deg/rad/grad/turn）
'linear-gradient(180deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%)'
'linear-gradient(0.5turn, #10b981, #3b82f6)'
'linear-gradient(3.14159rad, #f59e0b, #ef4444)'

// 2. 方向关键词
'linear-gradient(to top, #e94560, #00d4ff)'
'linear-gradient(to right, #ffd93d, #e94560)'
'linear-gradient(to top right, #8b5cf6, #f59e0b)'

// 3. 坐标格式（x1 y1 x2 y2）—— 注意：坐标之间用空格分隔，不要用逗号
'linear-gradient(50% 0 50% 100%, rgba(36,159,218,0) 1, rgba(36,159,218,0.8) 0)'

// 4. 径向渐变
'radial-gradient(circle, #e94560, #8b5cf6)'
'radial-gradient(ellipse at top, #06b6d4, #8b5cf6)'
'radial-gradient(50% 50% 100% 50% 50% 0%, #ffd93d 0%, #f59e0b 100%)'
```

#### 使用方式

```javascript
// 方式一：直接使用字符串（最简单）
const rect = g.createShape('rect', {
    position: {x: 100, y: 100}, width: 200, height: 100,
    style: { fill: 'linear-gradient(180deg, #e94560 0%, #00d4ff 100%)' }
});

// 方式二：使用 jmGradient 对象
import { jmGradient } from 'jmgraph';
const gradient = new jmGradient({
    type: 'linear',
    x1: '50%', y1: '0%',
    x2: '50%', y2: '100%',
    stops: [
        { offset: 0, color: 'rgba(36,159,218,0)' },
        { offset: 1, color: 'rgba(36,159,218,0.8)' }
    ]
});

const rect2 = g.createShape('rect', {
    position: {x: 100, y: 220}, width: 200, height: 100,
    style: { fill: gradient }
});

// 方式三：使用 createLinearGradient / createRadialGradient 便捷方法
const linearGradient = g.createLinearGradient(0, 0, 0, 100);
linearGradient.addStop(0, '#e94560');
linearGradient.addStop(1, '#00d4ff');

const radialGradient = g.createRadialGradient(100, 100, 0, 100, 100, 50);
radialGradient.addStop(0, '#ffd93d');
radialGradient.addStop(1, '#f59e0b');
```

#### 偏移量格式

偏移量（offset）表示颜色在渐变中的位置，支持三种写法：

```javascript
// 小数（0~1）—— 0 表示渐变起点，1 表示渐变终点
'linear-gradient(180deg, #e94560 0, #00d4ff 0.5, #8b5cf6 1)'

// 百分比（0%~100%）
'linear-gradient(180deg, #e94560 0%, #00d4ff 50%, #8b5cf6 100%)'

// 省略偏移量（首尾自动为 0 和 1，中间均匀分布）
'linear-gradient(180deg, #e94560, #00d4ff, #8b5cf6)'
// 等价于 'linear-gradient(180deg, #e94560 0, #00d4ff 0.5, #8b5cf6 1)'
```

> **注意**：偏移量 `1` 和 `100%` 是等价的，都表示渐变终点。偏移量会自动归一化到 0~1 范围。

#### 颜色格式支持

支持多种颜色格式：

```javascript
// hex
'linear-gradient(180deg, #e94560 0%, #00d4ff 100%)'

// rgba —— 逗号后有无空格均可
'linear-gradient(180deg, rgba(233,69,96,0.8) 0%, rgba(0,212,255,0.8) 100%)'
'linear-gradient(180deg, rgba(233, 69, 96, 0.8) 0%, rgba(0, 212, 255, 0.8) 100%)'

// hsl/hsla
'linear-gradient(180deg, hsl(345, 82%, 62%) 0%, hsl(191, 100%, 50%) 100%)'

// 命名颜色
'linear-gradient(to top, red, blue, green)'

// transparent
'linear-gradient(180deg, transparent, rgba(233,69,96,0.7))'
```

#### 坐标格式说明

坐标参数支持多种形式：

```javascript
// 百分比（推荐）—— 相对于控件边界尺寸计算
x1: '50%'  // 控件宽度的一半

// 小数（0~1）—— 自动乘以控件尺寸，效果等同于百分比
x1: 0.5    // 同 '50%'

// 绝对像素值
x1: 100    // 固定 100 像素位置
```

#### 常见错误与注意事项

<details>
<summary><b>点击展开常见问题</b></summary>

1. **坐标分隔符错误**：坐标格式中坐标之间用**空格**分隔，不要用逗号

```javascript
// 正确
'linear-gradient(50% 0 50% 100%, rgba(36,159,218,0) 1, rgba(36,159,218,0.8) 0)'

// 错误 - 坐标之间不能有逗号
'linear-gradient(50%, 0, 50%, 100%, rgba(36,159,218,0) 1, ...)'
```

2. **颜色停止点之间必须有逗号**：颜色停止点用逗号分隔

```javascript
// 正确
'linear-gradient(180deg, #e94560 0%, #00d4ff 100%)'

// 错误 - 颜色停止点之间缺少逗号
'linear-gradient(180deg #e94560 0% #00d4ff 100%)'
```

3. **rgba 透明度为 0 时必须写完整**：不能只写 `rgba(r,g,b, 0)` 而不写颜色值

```javascript
// 正确
'linear-gradient(50% 0 50% 100%, rgba(36,159,218,0) 1, rgba(36,159,218,0.8) 0)'

// rgba 中透明度参数是最后一个值，逗号后可以有空格
'rgba(36,159,218, 0)'   // 正确
'rgba(36,159,218,0)'     // 正确
'rgba(36, 159, 218, 0)'  // 正确
```

4. **渐变至少需要 2 个颜色停止点**

```javascript
// 正确 - 至少 2 个颜色
'linear-gradient(180deg, #e94560 0%, #00d4ff 100%)'

// 错误 - 只有 1 个颜色，无法产生渐变效果
'linear-gradient(180deg, #e94560)'
```

5. **多行渐变字符串**：支持换行符

```javascript
// 正确 - 多行字符串也能正常解析
`linear-gradient(50% 0 50% 100%,
  rgba(36,159,218,0) 1,
  rgba(36,159,218,0.8) 0)`
```

6. **addStop 偏移量范围**：使用 `addStop()` 方法时，偏移量必须在 0~1 之间

```javascript
// 正确
gradient.addStop(0, '#e94560');
gradient.addStop(0.5, '#00d4ff');
gradient.addStop(1, '#8b5cf6');

// 错误 - 偏移量超出 0~1 范围会被自动裁剪并输出警告
gradient.addStop(1.5, '#e94560');  // 会被调整为 1
gradient.addStop(-0.5, '#e94560'); // 会被调整为 0
```

</details>

### filter 滤镜

支持 CSS 标准滤镜，可用值包括：

| 滤镜 | 说明 | 示例 |
| :- | :- | :- |
| blur | 模糊 | `'blur(3px)'` |
| grayscale | 灰度 (0-1) | `'grayscale(100%)'` |
| sepia | 怀旧 (0-1) | `'sepia(80%)'` |
| brightness | 亮度 (数值) | `'brightness(1.5)'` |
| contrast | 对比度 (数值) | `'contrast(2)'` |
| saturate | 饱和度 (数值) | `'saturate(1.5)'` |
| hue-rotate | 色相旋转 (deg) | `'hue-rotate(90deg)'` |
| invert | 反转 (0-1) | `'invert(100%)'` |
| opacity | 不透明度 (0-1) | `'opacity(0.5)'` |

支持字符串格式、对象格式或 `jmFilter` 实例：

```javascript
// 字符串格式（多个滤镜组合）
style: { fill: '#e94560', filter: 'blur(1px) brightness(1.2) saturate(1.5)' }

// 对象格式
style: { fill: '#00d4ff', filter: { blur: 3, grayscale: 0.5 } }

// 使用 jmFilter 类
import { jmFilter } from 'jmgraph';
const f = new jmFilter({ blur: 2, brightness: 1.3 });
style: { fill: '#ffd93d', filter: f }
```

### lineDash 自定义虚线

通过 `lineDash` 定义自定义虚线模式，替代原有的 `lineType: 'dotted'`：

```javascript
// 等间距虚线
style: { stroke: '#00d4ff', lineWidth: 2, lineDash: [10, 5] }

// 字符串格式
style: { stroke: '#ff6b6b', lineWidth: 2, lineDash: '10, 5, 2, 5' }

// 带偏移量
style: { stroke: '#ffd93d', lineWidth: 2, lineDash: [10, 10], lineDashOffset: 5 }
```


### borderRadius 四角独立圆角

`radius` 属性支持数字（四角相同）和对象格式（四角独立）：

```javascript
// 统一圆角（向后兼容）
g.createShape('rect', { position: {x: 20, y: 20}, width: 200, height: 80, radius: 20,
    style: { fill: '#e94560' }
});

// 四角独立圆角
g.createShape('rect', { position: {x: 20, y: 130}, width: 200, height: 80,
    radius: { topLeft: 30, topRight: 5, bottomRight: 30, bottomLeft: 5 },
    style: { fill: '#00d4ff' }
});

// 通过 style.borderRadius 设置
g.createShape('rect', { position: {x: 20, y: 240}, width: 200, height: 80,
    style: { fill: '#00ff88', borderRadius: { topLeft: 40, topRight: 0, bottomRight: 0, bottomLeft: 40 } }
});
```

### globalCompositeOperation 混合模式

支持 Canvas 标准混合模式：

```javascript
// multiply 混合
g.createShape('circle', { center: {x: 120, y: 120}, radius: 60, style: { fill: '#e94560' } });
g.createShape('circle', { center: {x: 170, y: 120}, radius: 60,
    style: { fill: '#00d4ff', globalCompositeOperation: 'multiply' }
});
```

### clipPath 裁剪路径

传入一个图形控件实例作为裁剪区域：

```javascript
// 创建裁剪区域（圆形）
const clipCircle = g.createShape('circle', {
    center: {x: 300, y: 200}, radius: 80,
    style: { close: true }
});
clipCircle.initPoints();

// 被裁剪的矩形，只在圆形区域内可见
g.createShape('rect', {
    position: {x: 180, y: 120}, width: 240, height: 160, radius: 12,
    style: {
        fill: 'linear-gradient(0 0 240 160, #e94560 0, #00d4ff 1)',
        clipPath: clipCircle
    }
});
```

## 🎯 内置图形

### 矩形 (Rect)

```javascript
const rect = g.createShape('rect', {
  style: style,
  position: {x: 100, y: 100},
  width: 100,
  height: 100
});
```

### 圆形/椭圆 (Arc)

```javascript
const arc = g.createShape('arc', {
  style: style,
  center: {x: 100, y: 150},
  width: 120,
  height: 80
});
```

### 线条 (Line)

```javascript
const line = g.createLine(
  {x: 10, y: 200},
  {x: 80, y: 120},
  style
);
```

### 箭头 (Arrow)

```javascript
const arrow = g.createShape('arrow', {
  style: style,
  start: {x: 150, y: 120},
  end: {x: 160, y: 150}
});
```

### 贝塞尔曲线 (Bezier)

```javascript
const bezier = g.createShape('bezier', {
  style: style,
  points: [p0, p1, p2, p3, p4]
});
```

### 图片 (Image)

```javascript
const img = g.createShape('image', {
  style: {src: 'image.png'},
  position: {x: 100, y: 100}
});
img.canMove(true);
```

### 文字 (Label)

```javascript
const label = g.createShape('label', {
  style: {
    stroke: '#effaaa',
    fill: '#fff',
    textAlign: 'center',
    textBaseline: 'middle',
    fontSize: 24,
    fontFamily: 'Arial',
    maxWidth: 200 // 文本最大宽度，超过会自动换行
  },
  position: {x: 200, y: 150},
  text: '这是一段测试文本，展示文本换行功能',
  width: 200,
  height: 100
});
```

### 椭圆 (Ellipse)

```javascript
const ellipse = g.createShape('ellipse', {
  style: style,
  center: {x: 100, y: 150},
  width: 120,
  height: 80
});
```

### 多边形 (Polygon)

```javascript
const polygon = g.createShape('polygon', {
  style: style,
  center: {x: 100, y: 150},
  sides: 6, // 边数
  radius: 50 // 半径
});
```

### 星形 (Star)

```javascript
const star = g.createShape('star', {
  style: style,
  center: {x: 100, y: 150},
  points: 5, // 顶点数
  radius: 50, // 外半径
  innerRadius: 25 // 内半径
});
```

## 🎮 事件系统

### 事件绑定

```javascript
const shape = g.createShape('rect', {...});

shape.bind('mouseover', function(evt) {
  this.style.stroke = 'rgba(39,72,188,0.5)';
  this.cursor('pointer');
  this.needUpdate = true;
});
```

### 支持的事件

| 事件名称 | 说明 | 回调参数 |
| :- | :- | :- |
| mousedown | 鼠标按下 | - |
| mousemove | 鼠标移动 | {target, position} |
| mouseover | 鼠标移入 | {target} |
| mouseleave | 鼠标移出 | {target} |
| mouseup | 鼠标松开 | - |
| click | 鼠标点击 | - |
| dblclick | 鼠标双击 | - |
| touchstart | 触摸开始 | {position} |
| touchmove | 触摸移动 | {position} |
| touchend | 触摸结束 | {position} |

## 🔧 自定义控件

大多数控件继承 `jmPath` 即可，通过实现 `initPoints` 方法来绘制自定义图形：

```javascript
import {jmPath} from "jmgraph";

class CustomShape extends jmPath {
  constructor(params) {
    super(params);
    this.center = params.center || {x: 0, y: 0};
    this.radius = params.radius || 0;
  }

  initPoints() {
    const location = this.getLocation();
    const cx = location.center.x;
    const cy = location.center.y;
    
    this.points = [];
    this.points.push({x: cx - this.radius, y: cy - this.radius});
    this.points.push({x: cx + this.radius, y: cy + this.radius});
    
    return this.points;
  }
}
```

## 📱 微信小程序支持

jmGraph 支持微信小程序，详情请参考 [mini-jmchart](https://github.com/fefeding/mini-jmchart)。

### 使用方法

```javascript
const jmGraph = require('../../utils/jmgraph');

const g = jmGraph.create('mycanvas', {
  style: {fill: '#000'},
  width: 400,
  height: 600
});

this.canvastouchstart = function (...arg) {
  return g.eventHandler.touchStart(...arg);
}
this.canvastouchmove = function (...arg) {
  return g.eventHandler.touchMove(...arg);
}
this.canvastouchend = function (...arg) {
  return g.eventHandler.touchEnd(...arg);
}
```

## 🔍 缩放平移功能

### 设置缩放

```javascript
// 设置缩放因子，以指定点为中心
// 缩放因子，1为原始大小
// x, y 缩放中心坐标
g.setZoom(1.5, 400, 300);
```

### 平移画布

```javascript
// 平移画布
// dx, dy 平移距离
g.pan(100, 50);
```

### 重置视图

```javascript
// 重置缩放和平移
g.resetTransform();
```

### 自适应视图

```javascript
// 根据画布内容自动缩放并居中（留白比例 0-0.9，默认 0.15）
g.fitView(0.15);
```

### 坐标转换

```javascript
// 屏幕坐标 → 世界坐标（图形坐标）
const world = g.screenToWorld({x: 400, y: 300});

// 世界坐标 → 屏幕坐标
const screen = g.worldToScreen({x: 100, y: 100});
```

### 缩放范围限制

```javascript
const g = jmGraph('canvas', {
  minZoom: 0.5,   // 最小缩放，默认 0.1
  maxZoom: 4      // 最大缩放，默认 10
});
```

缩放和平移统一由 `g.viewport`（`jmViewport`）管理，`scaleFactor` / `translation` 仍可直接读写。

## 🚀 性能与架构优化

本版本对性能与架构做了全面重构，核心思路是「职责单一、可替换、按需计算」。

### 架构组件化

| 模块 | 职责 |
| :- | :- |
| `jmViewport` | 统一管理缩放、平移、坐标转换与视口剔除，`graph.viewport` 可独立使用与测试 |
| `jmSpatialIndex` | 均匀网格空间索引，加速事件命中，`graph.hitIndex`（`option.hitIndex === false` 可关闭） |
| `jmRenderer` / `Canvas2DRenderer` | 渲染器抽象，隔离画布变换与清屏，WebGL 渲染器可基于同一接口扩展 |
| `jmPlatform` | 平台适配层，统一处理浏览器 / 微信小程序 / Node 的环境差异 |

### 性能优化

- **脏标记缓存**：控件位置或尺寸变化时仅标记 `__boundsDirty`，绘制时按需重算，避免每帧重复计算边界
- **批量操作 + 惰性排序**：`children.addAll([...])` 批量添加控件，排序延迟到绘制前统一执行
- **刷新节流**：`refresh()` 通过 `requestAnimationFrame` 合并多帧刷新，避免重复绘制
- **事件命中优化**：启用空间索引后，命中测试只遍历事件点所在网格单元（及相邻单元）的候选控件
- **文本测量缓存**：字体、内容不变时复用 `measureText` 结果，避免逐帧测量
- **高清屏适配**：`option.dprScale` 支持高清屏渲染，`false` 关闭，数字指定倍数，默认自动

## 📐 图层管理

### 创建图层

```javascript
// 创建新图层
// name 图层名称
// options 图层选项
const layer = g.createLayer('My Layer', {
  visible: true,
  locked: false
});
```

### 切换图层

```javascript
// 切换到指定图层
// layer 图层名称或图层对象
g.setActiveLayer('My Layer');
```

### 获取图层

```javascript
// 获取所有图层
const layers = g.getLayers();

// 获取指定名称的图层
const layer = g.getLayer('My Layer');

// 获取当前活动图层
const activeLayer = g.getActiveLayer();
```

### 移除图层

```javascript
// 移除指定图层
// layer 图层名称或图层对象
const success = g.removeLayer('My Layer');
```

### 图层操作

```javascript
// 将形状添加到指定图层
// shape 形状对象
// layer 图层名称或图层对象，默认为当前活动图层
g.addShapeToLayer(shape, 'My Layer');

// 从图层中移除形状
// shape 形状对象
g.removeShapeFromLayer(shape);
```

## 📤 导出功能

### 导出为 PNG

```javascript
// 导出为 PNG 图片
// fileName 文件名
// format 图片格式，默认为 image/png
// quality 图片质量，0-1之间
g.exportToPNG('my-graph', 'image/png', 0.9);
```

### 导出为 JPEG

```javascript
// 导出为 JPEG 图片
// fileName 文件名
// quality 图片质量，0-1之间
g.exportToJPEG('my-graph', 0.8);
```

### 导出为 SVG

```javascript
// 导出为 SVG
// fileName 文件名
g.exportToSVG('my-graph');
```

## 🗑️ 销毁实例

当不再需要 jmGraph 实例时，调用 `destroy()` 释放资源（如事件监听、动画帧等）：

```javascript
const g = jmGraph('mycanvas', { ... });

// 使用完毕后销毁
g.destroy();

// 销毁后可通过 destroyed 标志判断状态
if (g.destroyed) {
  console.log('实例已销毁');
}
```

> `destroy()` 会内部调用 `eventHandler.destroy()` 清除所有事件绑定，并设置 `destroyed = true` 标记。调用后不应再使用该实例。

## 📝 文本换行

当文本长度超过 `maxWidth` 时，会自动换行显示：

```javascript
const label = g.createShape('label', {
  style: {
    fill: '#333',
    fontSize: 14,
    fontFamily: 'Arial',
    textAlign: 'center',
    maxWidth: 200 // 文本最大宽度，超过会自动换行
  },
  position: {x: 200, y: 150},
  text: '这是一段测试文本，当文本长度超过最大宽度时，会自动换行显示。',
  width: 200,
  height: 100
});
```

## 🧩 流程图组件

内置基于 jmGraph 的工作流流程图（DAG）组件，**原生 JS 实现、零框架依赖**，不绑定任何 UI 框架。

- [组件使用文档](src/components/README.md)
- [流程图组件示例（仓库内完整 demo）](example/flow-graph.html)
- [第三方使用示例（CDN 直引，开箱即用）](example/flow-graph-cdn.html)

本组件**随 `jmgraph` 包一起发布**，第三方 `npm install jmgraph` 后通过子路径引入：

```js
// 子路径（推荐，等价）
import { createFlowGraph } from 'jmgraph/components';
// 或完整源码子路径
import { createFlowGraph } from 'jmgraph/src/components';
const fg = createFlowGraph('#app', { stages });
```

> 组件不在根入口 `jmgraph` 中导出，必须用上述子路径。Vue / React 等框架请在业务侧自行封装（挂载 `new FlowGraphComponent(o).mount(el)`、数据走 `update(patch)`、卸载 `destroy()`），详见组件文档「框架封装示例」「第三方最小可运行示例」。

## 🛠️ 开发

### 构建

```bash
npm run build
```

### 运行示例

```bash
npm run dev
```

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 💬 讨论

- [GitHub Issues](https://github.com/fefeding/jmgraph/issues) - 报告 Bug 和功能请求
- [GitHub Discussions](https://github.com/fefeding/jmgraph/discussions) - 问题和讨论

## 🙏 致谢

感谢所有为本项目做出贡献的开发者！

## 🔗 相关项目

- [jmChart](https://github.com/fefeding/jmchart) - 基于 jmGraph 的图表库
- [mini-jmchart](https://github.com/fefeding/mini-jmchart) - 微信小程序图表库

## 📮 联系方式

- 作者: jiamao
- 邮箱: haofefe@163.com
- 主页: https://fefeding.github.io/jmgraph/

---

如果这个项目对你有帮助，请给个 ⭐️ Star！

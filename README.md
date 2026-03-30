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
- 🌈 **样式丰富** - 支持渐变、阴影、透明度等样式

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

### ES6 模块方式

```html
<script type="module">
  import jmGraph from "jmgraph";
  
  const container = document.getElementById('mycanvas_container');
  const g = new jmGraph(container, {
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

g.children.add(rect);
g.redraw();
```

## 📚 文档

- [在线示例](https://fefeding.github.io/jmgraph/example/index.html)
- [基于 jmGraph 的图表库](https://github.com/fefeding/jmchart)

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
    fontFamily: 'Arial'
  },
  position: {x: 200, y: 150},
  text: 'Hello World',
  width: 120,
  height: 80
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

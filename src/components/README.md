# jmGraph 流程图组件

基于 jmGraph 的「工作流流程图（DAG）」组件。原生 JavaScript 实现，**零框架依赖**：不绑定 Vue / React，使用方在业务侧自行封装即可。

## 设计理念

- **只做原生实现**：`createFlowGraph` 返回的是 `FlowGraphComponent` 实例，面向 DOM 容器，命令式 API。
- **框架无关**：所有逻辑、状态、生命周期都收敛在 `FlowGraphComponent`（`core/ComponentBase.js`）中。
- **使用方自封装**：Vue / React 等框架只需把「挂载 / 更新 / 卸载」映射到组件 API（`new` + `mount(el)`、数据走 `update(patch)`、`destroy()`），无需引入额外适配层。

## 发布与引入（第三方使用）

本组件**随 `jmgraph` 包一起发布**，不需要单独安装。组件源码位于 `jmgraph/src/components`，包已通过 `exports` 暴露子路径，因此第三方项目可直接引入。

> 组件既可经根入口 `jmgraph` 直接导入（见「方式零」），也可经下面的子路径导入。根入口已随 `npm run build` 一并把组件构建进 `dist/jmgraph.js` / `jmgraph.min.js`（UMD 全局 `jmGraph.createFlowGraph` 可用）。

### 1. 安装

```bash
npm install jmgraph   # 或 pnpm add jmgraph / yarn add jmgraph
```

### 2. 引入路径（Node / 打包器）

`jmgraph` 提供了两条等价的子路径（指向同一文件）：

```js
// 方式零：直接从根入口导入（随包主入口一并构建，UMD/ESM 均可用）
import jmGraph, { createFlowGraph, FlowGraphComponent } from 'jmgraph';
// 推荐：简短子路径
import { createFlowGraph, FlowGraphComponent } from 'jmgraph/components';
// 等价：完整源码子路径
import { createFlowGraph } from 'jmgraph/src/components';
```

### 3. CDN / ESM 直引（无需打包，浏览器 `<script type=module>`）

```html
<!-- 方式一：jsDelivr 直接指向包内文件 -->
<script type="module">
  import { createFlowGraph } from 'https://cdn.jsdelivr.net/npm/jmgraph/src/components/index.js';
</script>

<!-- 方式二：esm.sh 自动处理依赖解析（推荐给纯前端原型） -->
<script type="module">
  import { createFlowGraph } from 'https://esm.sh/jmgraph/components';
</script>
```

### 4. 底层元数据（自定义面板 / 图例用）

```js
import { NODE_TYPES, STATUS_META, typeColor } from 'jmgraph/components';
```

> 已移除 `components/vue`、`components/react` 子入口。框架用户请参考文末「框架封装示例」自行实现。

## 快速开始

```html
<div id="app" style="width: 800px; height: 600px;"></div>

<script type="module">
  import { createFlowGraph } from 'jmgraph/src/components';

  const stages = [
    { id: 'fetch_user', type: 'fetch', inputs: [], outputs: ['user'], dependsOn: [] },
    { id: 'normalize',  type: 'transform', inputs: [{ from: 'fetch_user.user' }], outputs: ['rows'], dependsOn: ['fetch_user'] },
    { id: 'score',      type: 'script', inputs: [{ from: 'normalize.rows' }], outputs: ['scores'], dependsOn: ['normalize'] }
  ];

  const fg = createFlowGraph('#app', {
    stages,
    mode: 'view',
    onSelect: id => console.log('selected:', id),
    onError: (err, ctx) => console.error(ctx, err)
  });

  // fg 是 FlowGraphComponent 实例，可用全部命令式方法 + 事件订阅
  fg.autoLayout();
  fg.fit();
</script>
```

## 第三方最小可运行示例

把下面内容保存为 `index.html`，**直接用浏览器打开即可**（通过 esm.sh 从 npm 拉取 `jmgraph`，无需本地安装）。这就是「其它项目利用 jmgraph 包使用本组件」的最小形态：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <title>jmGraph FlowGraph - 第三方使用示例</title>
  <style>
    html, body { margin: 0; height: 100%; }
    #app { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    // 第三方项目：直接 import 已发布的 jmgraph 包的组件子路径
    import { createFlowGraph, STATUS_META } from 'https://esm.sh/jmgraph/components';

    const stages = [
      { id: 'fetch_user', type: 'fetch',     inputs: [],                          outputs: ['user'],  dependsOn: [] },
      { id: 'normalize',  type: 'transform', inputs: [{ from: 'fetch_user.user' }], outputs: ['rows'],  dependsOn: ['fetch_user'] },
      { id: 'score',      type: 'script',    inputs: [{ from: 'normalize.rows' }],  outputs: ['scores'],dependsOn: ['normalize'] }
    ];

    const fg = createFlowGraph('#app', {
      stages,
      mode: 'edit',                          // 'view' 只读 | 'edit' 可编辑（拖拽/连线）
      onSelect: id => console.log('选中:', id),
      onError: (err, ctx) => console.error(ctx, err)
    });

    // 命令式 API 全部可用
    fg.autoLayout();
    fg.fit();

    // 模拟运行状态
    setTimeout(() => fg.setRunStatus({
      fetch_user: 'success', normalize: 'running', score: 'pending'
    }), 800);
  </script>
</body>
</html>
```

如果使用本地构建工具（Vite / Webpack / Rspack 等），把上面 `import` 换成：

```js
import { createFlowGraph } from 'jmgraph/components';
```

即可，其余代码完全一致。

## 配置项（`options`）

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `stages` | `Array` | `[]` | 流程节点数据 |
| `mode` | `'view' \| 'edit'` | `'view'` | 交互模式：`view` 只读可平移/缩放；`edit` 可拖动节点、拖连接点建边、增删 |
| `autoFit` | `boolean` | `true` | 挂载后自动适应视图 |
| `autoResize` | `boolean` | `true` | 基于 `ResizeObserver` 自动监听容器尺寸变化并 `resize` |
| `width` / `height` | `number \| null` | `null` | 初始画布尺寸，缺省取容器尺寸 |
| `graphOptions` | `object \| null` | `null` | 透传给底层 `jmGraph` 构造参数（如 `dprScale` / `hitIndex` / `minZoom`） |
| `layout` | `object \| null` | `null` | 布局参数（`{ vGap, hGap, pad }`） |
| `onSelect` | `(id: string\|null) => void` | — | 选中节点变化 |
| `onChange` | `(stages: Array) => void` | — | 数据变化（增删改） |
| `onEdgeClick` | `(edge: {source,target}) => void` | — | 点击连线 |
| `onNodeEdit` | `(id: string) => void` | — | 触发节点重命名 / 编辑 |
| `onLog` | `(msg: string, level?: string) => void` | — | 运行日志 |
| `onReady` | `(instance) => void` | — | 实例就绪（可拿到完整 api） |
| `onError` | `(err: Error, ctx: string) => void` | — | 内部异常上报（不冒泡到宿主应用） |

## 实例 API

返回值为 `FlowGraphComponent` 实例。

### 数据

| 方法 | 说明 |
| --- | --- |
| `getStages()` | 获取当前 stages 副本 |
| `setStages(stages)` | 全量替换并重建 |
| `addStage(type, worldPos?)` | 新增节点（返回新 id） |
| `removeStage(id)` | 删除节点及其依赖引用 |
| `renameStage(id, newId)` | 重命名（自动修正依赖） |
| `updateStage(id, patch)` | 局部更新单个节点 |

### 运行态

| 方法 | 说明 |
| --- | --- |
| `setRunStatus(map)` / `getRunStatus()` | 设置 / 获取运行状态映射 `{ [id]: 'success' \| 'running' \| ... }` |
| `run()` | 模拟执行（拓扑序逐节点推进，返回 Promise） |
| `isRunning()` | 是否正在执行 |
| `resetRun()` | 重置运行状态 |

### 视图

| 方法 | 说明 |
| --- | --- |
| `autoLayout()` | 自动分层布局 |
| `fit(padding?)` | 适应视图 |
| `zoomIn()` / `zoomOut()` | 放大 / 缩小 |
| `resetView()` | 1:1 复位 |
| `getZoom()` | 当前缩放比例 |
| `exportPNG(name?)` | 导出 PNG |
| `resize(width?, height?)` | 手动重算画布尺寸 |
| `attachMinimap(canvas)` | 绑定小地图 canvas |

### 选中 / 模式

| 方法 | 说明 |
| --- | --- |
| `select(id)` / `getSelected()` | 选中 / 当前选中 id |
| `nodeAt(world)` | 命中测试：世界坐标 → 节点 |
| `setMode(mode)` / `getMode()` | 切换 / 读取交互模式 |

### 生命周期

| 方法 | 说明 |
| --- | --- |
| `mount(container)` | 挂载到容器（原生 `createFlowGraph` 内部已调用） |
| `update(partial)` | 增量同步配置（stages / mode 变化走增量，不重建画布） |
| `destroy()` | 销毁：释放画布、监听与定时器 |

### 逃生舱

- `fg.graph`：底层 `jmGraph` 实例，可用全部原生能力（`screenToWorld`、`getPosition`、`registerShape` 等）。

## 事件

除 `onXxx` 配置回调外，所有事件均可通过 `fg.on(evt, fn)` 订阅（回调经错误边界包裹，互不影响）：

| 事件 | 参数 |
| --- | --- |
| `select` | `id` |
| `change` | `stages` |
| `edgeClick` | `edge` |
| `nodeEdit` | `id` |
| `ready` | `instance` |
| `log` | `msg, level` |
| `error` | `err, context` |

```js
const off = fg.on('select', id => renderDetail(id));
// off() 取消订阅
```

## 运行状态（runStatus）

`runStatus` 由外部驱动（如对接真实执行引擎）。组件内置 `run()` 为本地模拟：

```js
fg.setRunStatus({ fetch_user: 'running', score: 'success' });
```

状态值见 `STATUS_META`：`idle / pending / running / success / failed / skipped`。

## 进阶

### 子类化

```js
import { FlowGraphComponent } from 'jmgraph/src/components';

class MyFlow extends FlowGraphComponent {
  _afterMount() {
    super._afterMount();
    // 自定义挂载后逻辑
  }
}
const fg = new MyFlow({ stages });
fg.mount('#app');
```

### 高级渲染参数

```js
createFlowGraph('#app', {
  stages,
  graphOptions: { dprScale: true, hitIndex: true, minZoom: 0.2, maxZoom: 8 }
});
```

## 框架封装示例

组件不提供 Vue / React 适配，下面是推荐的自封装写法（官方示例 `example/flow-graph.html` 即原生用法）。

### Vue 3

```vue
<script setup>
import { ref, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue';
import { FlowGraphComponent } from 'jmgraph/src/components';

const props = defineProps({ stages: Array, mode: { default: 'view' } });
const emit = defineEmits(['select', 'change']);
const el = ref(null);
const comp = shallowRef(null);

onMounted(() => {
  comp.value = new FlowGraphComponent({ stages: props.stages, mode: props.mode });
  comp.value.mount(el.value);
  comp.value.on('select', id => emit('select', id));
  comp.value.on('change', s => emit('change', s));
});
onBeforeUnmount(() => comp.value && comp.value.destroy());

// props 变化增量同步，不重建画布
watch(() => props.stages, v => comp.value && comp.value.update({ stages: v }), { deep: true });
watch(() => props.mode, v => comp.value && comp.value.update({ mode: v }));
</script>

<template>
  <div ref="el" class="jm-flow-graph" style="width:100%;height:100%"></div>
</template>
```

### React

```jsx
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { FlowGraphComponent } from 'jmgraph/src/components';

export const FlowGraph = forwardRef(function FlowGraph(props, ref) {
  const { stages = [], mode = 'view', onSelect, onChange } = props;
  const elRef = useRef(null);
  const compRef = useRef(null);

  useEffect(() => {
    const c = new FlowGraphComponent({ stages, mode });
    c.mount(elRef.current);
    c.on('select', id => onSelect && onSelect(id));
    c.on('change', s => onChange && onChange(s));
    compRef.current = c;
    return () => c.destroy();
  }, []);

  useEffect(() => { compRef.current && compRef.current.update({ stages }); }, [stages]);
  useEffect(() => { compRef.current && compRef.current.update({ mode }); }, [mode]);

  useImperativeHandle(ref, () => ({
    autoLayout: () => compRef.current && compRef.current.autoLayout(),
    getGraph: () => compRef.current && compRef.current.graph
  }));

  return <div ref={elRef} className="jm-flow-graph" style={{ width: '100%', height: '100%' }} />;
});
```

## 运行示例

```bash
npm run dev
# 浏览器打开 example/flow-graph.html
```

该示例完整演示：拖拽添加节点、连接点建边、右键菜单、自动布局、缩放 / 平移 / 小地图、运行状态模拟与导出 PNG。

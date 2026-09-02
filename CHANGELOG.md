# Changelog

本文件记录 `jmgraph` 各版本的向后兼容行为变化。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。

## Unreleased

### Added

- 组件新增官方 TypeScript 类型声明 `src/components/index.d.ts`；`jmgraph/components` 子路径经 `exports.types` 自动命中。
- 组件新增 `onContextMenu` 配置项与 `contextMenu` 事件：右键命中节点 / 连线 / 空白画布时回调
  `{ type, id, stage, edge, x, y, clientX, clientY }`（canvas 原生菜单已自动屏蔽）。
- 组件新增内置键盘快捷键：`Delete`（`edit` 模式删除选中节点）、`Esc`（取消选中）；
  焦点位于输入框 / 可编辑区域时不拦截。
- 组件新增 flow 行为测试覆盖（`test/components.test.mjs`）：生命周期、数据增删改、
  点击选中 / 连线点击 / 右键命中 / 键盘快捷键、名称省略号、运行态、模式切换、快照隔离等。

### Changed

- 节点名称显示由「按 24 字符截断」改为基于 `measureText` 的像素级单行省略号（`…`），
  中英文混合名称不再出现截断不均或意外换行。
- `getStages()` 与 `change` 事件现在返回 stages 快照副本（`dependsOn` / `inputs` / `outputs` / `config` / `_pos` 均浅拷贝），
  宿主直接修改返回值不会污染内部模型。
- `removeStage` 现在同时清理其他节点对该节点的 `inputs.from`（形如 `${id}.port`）引用，避免留下孤儿输入。
- `renameStage` 现在同时改写其他节点 `inputs.from` 的 `${oldId}.` 前缀，与 `dependsOn` 的修正保持一致。
- 空白画布右键不再触发平移（`mousedown` 对右键按钮放行）。

### Fixed

- 事件绑定生命周期：组件 `destroy()` 时解绑自挂的 `contextmenu` / `keydown` DOM 监听，避免重复挂载泄漏。
- `example/flow-graph.html` 右键菜单改为订阅组件 `onContextMenu` 事件，移除重复的 `nodeAt` / `screenToWorld` 手动换算（移动端长按仍自行换算坐标）。

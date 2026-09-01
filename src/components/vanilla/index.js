/**
 * @fileoverview 原生 JS 适配层
 *
 * 面向无框架的页面 / Web Components / 传统项目。
 * 返回值是 `FlowGraphComponent` 实例，兼具三类能力：
 * - 命令式方法：`fg.autoLayout()`、`fg.fit()`、`fg.setStages(...)` …
 * - 事件订阅：`fg.on('select', id => {})`
 * - 逃生舱：`fg.graph` 直连底层 jmGraph 实例
 *
 * 本入口是**唯一的官方适配层**，不提供 Vue / React 版本：
 * 框架用户请自行封装——挂载时 `new FlowGraphComponent(options)` + `mount(el)`，
 * 卸载时 `destroy()`，数据变化走 `update(patch)`（增量更新，不重建画布）。
 *
 * @example 最简接入
 * ```js
 * import { createFlowGraph } from 'jmgraph/src/components';
 * const fg = createFlowGraph('#app', { stages });
 * ```
 *
 * @example 完整配置
 * ```js
 * const fg = createFlowGraph('#app', {
 *   stages,
 *   mode: 'edit',
 *   onSelect: id => console.log(id),
 *   onError: (err, ctx) => report(err),
 *   graphOptions: { dprScale: true }
 * });
 * fg.on('change', stages => save(stages));
 * ```
 *
 * @module components/vanilla
 * @license MIT
 */
import { FlowGraphComponent } from '../flow/FlowGraphComponent.js';

/**
 * 创建流程图组件（原生 JS）
 *
 * @param {string|HTMLElement} container 容器（CSS 选择器或 DOM 元素）
 * @param {object} [options] 组件配置，见 `core/normalize.DEFAULT_OPTIONS`
 * @return {FlowGraphComponent} 组件实例；挂载失败时仍返回实例，
 *   可通过 `instance.errors` 或 `onError` 获取原因，不会抛异常中断页面
 */
export function createFlowGraph(container, options) {
	const comp = new FlowGraphComponent(options);
	comp.mount(container);
	return comp;
}

export default createFlowGraph;

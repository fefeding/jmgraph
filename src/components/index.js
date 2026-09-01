/**
 * @fileoverview jmGraph 官方组件入口（原生 JS，框架无关）
 *
 * 提供开箱即用的流程图组件。Vue / React / Svelte 等框架使用者请
 * **基于本入口自行封装**，组件已暴露完整的生命周期契约：
 * - 挂载：`createFlowGraph(el, opts)` → 返回实例
 * - 更新：`instance.update({ stages, mode })`（增量同步，不重建画布）
 * - 卸载：`instance.destroy()`（幂等，释放画布与监听）
 * - 事件：`instance.on('select', fn)` / 配置里传 `onSelect`
 *
 * 三个层次的 API，按需取用：
 * 1. **快速接入**：一行 `createFlowGraph('#app', { stages })`
 * 2. **常规控制**：实例方法 `autoLayout()` / `fit()` / `setStages()` …
 * 3. **深度定制**：`instance.graph` 直连底层 jmGraph 实例，用其全部原生能力
 *
 * 健壮性契约（所有对外接口均遵守）：
 * - 非法输入降级为默认值并上报，**不抛异常中断宿主应用**
 * - 用户回调抛错被错误边界捕获，互不影响
 * - 生命周期幂等，销毁后任何操作安全返回
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
 *   mode: 'edit',                       // 'view' 只读 | 'edit' 可编辑
 *   autoFit: true,                      // 挂载后自动适应视图
 *   onSelect: id => openPanel(id),
 *   onChange: stages => persist(stages),
 *   onError: (err, ctx) => report(err),
 *   graphOptions: { dprScale: true }    // 透传底层 jmGraph
 * });
 * fg.on('change', stages => save(stages));
 * fg.autoLayout();
 * fg.graph;                             // 底层 jmGraph 实例
 * ```
 *
 * @module components
 * @license MIT
 */
import { FlowGraphComponent } from './flow/FlowGraphComponent.js';

// ---- 基础设施 ----
export { ComponentBase, STATE } from './core/ComponentBase.js';
export {
	DEFAULT_OPTIONS,
	normalizeOptions,
	resolveContainer,
	validateStages,
	measureContainer
} from './core/normalize.js';

// ---- 组件类（可子类化扩展）----
export { FlowGraphComponent };

// ---- 工厂函数 ----

/**
 * 创建并挂载流程图组件
 *
 * @param {string|HTMLElement} container 容器（CSS 选择器或 DOM 元素）
 * @param {object} [options] 组件配置，见 `DEFAULT_OPTIONS`
 * @return {FlowGraphComponent} 组件实例
 *
 * 即便挂载失败（如容器不存在）也**返回实例而非抛异常**，
 * 失败原因可通过 `instance.errors` 或 `options.onError` 获取。
 */
export function createFlowGraph(container, options) {
	const comp = new FlowGraphComponent(options);
	comp.mount(container);
	return comp;
}

// ---- 底层能力（高级场景）----
export {
	/** 底层工厂：返回原始 api，无生命周期托管，适合自行管理实例 */
	createFlowGraph as createFlowGraphCore,
	NODE_TYPES,
	STATUS_META,
	typeColor,
	computeLevels,
	computeLayout,
	edgeLabel,
	anchor,
	FlowNode,
	FlowEdge,
	FlowGrid
} from './flow/flow-graph.js';

export default createFlowGraph;

/**
 * @fileoverview FlowGraph 组件：框架无关的流程图控制器
 *
 * 在 `createFlowGraph()` 之上补齐工程化能力，可被原生 JS 直接集成；
 * Vue / React 等框架由使用方基于本类自行封装：
 * - 生命周期托管（mount / update / destroy）
 * - 配置热更新：stages / mode 变化时增量同步，不重建画布
 * - 事件统一为 `on(evt, fn)`，回调受错误边界保护
 * - 常用 API 代理 + `graph` 逃生舱直连底层 jmGraph 实例
 *
 * @module components/flow/FlowGraphComponent
 * @license MIT
 */
import { ComponentBase } from '../core/ComponentBase.js';
import { measureContainer } from '../core/normalize.js';
import { createFlowGraph } from './flow-graph.js';

export class FlowGraphComponent extends ComponentBase {
	/**
	 * 创建底层流程图实例
	 * @protected
	 * @return {object} createFlowGraph 返回的 api
	 */
	_createInstance() {
		const o = this._opts;
		const size = measureContainer(this._container, { width: o.width, height: o.height });

		return createFlowGraph(this._container, {
			stages: o.stages,
			mode: o.mode,
			width: o.width || size.width,
			height: o.height || size.height,
			layout: o.layout,
			graphOptions: o.graphOptions,
			debug: o.debug,

			// 统一转为组件事件：既走 on(evt)，也触发 onXxx 配置回调
			onSelect: id => this.emit('select', id),
			onChange: stages => this.emit('change', stages),
			onEdgeClick: edge => this.emit('edgeClick', edge),
			onNodeEdit: id => this.emit('nodeEdit', id),
			// 事件名用 contextMenu：emit 自动映射到 onContextMenu 配置回调
			onContextMenu: info => this.emit('contextMenu', info),
			onLog: (msg, level) => this.emit('log', msg, level)
		});
	}

	/** 挂载收尾：自动适应视图 + 派发 ready @protected */
	_afterMount() {
		if (this._opts.autoFit && this._instance) {
			this._safe('autoFit', () => this._instance.fit());
		}
		this._safe('ready', () => this.emit('ready', this));
	}

	// ==================== 配置同步 ====================

	_applyMode(mode) {
		this._call('setMode', mode);
	}

	_applyUpdate(prev, next) {
		// 运行态状态图：由外部驱动（如对接真实执行引擎）
		if (next.runStatus && next.runStatus !== prev.runStatus) {
			this._call('setRunStatus', next.runStatus);
		}
	}

	// ==================== API 代理 ====================

	/**
	 * 安全调用底层实例方法
	 *
	 * 未挂载 / 方法不存在 / 调用异常都不会抛到宿主应用，
	 * 而是统一走 onError 上报，返回 undefined。
	 * @protected
	 * @param {string} method 方法名
	 * @param {...any} args
	 * @return {any}
	 */
	_call(method, ...args) {
		const inst = this._instance;
		if (!inst) {
			this._report(new Error(`"${method}" called before mount`), method);
			return undefined;
		}
		if (typeof inst[method] !== 'function') {
			this._report(new Error(`"${method}" is not supported by the instance`), method);
			return undefined;
		}
		return this._safe(method, () => inst[method].apply(inst, args));
	}

	// ---- 数据 ----
	/** 获取当前 stages 副本 */
	getStages() { return this._call('getStages'); }
	/** 全量替换 stages */
	setStages(stages) { this._opts.stages = stages; return this._call('setStages', stages); }
	/** 新增节点 */
	addStage(type, position) { return this._call('addStage', type, position); }
	/** 删除节点 */
	removeStage(id) { return this._call('removeStage', id); }
	/** 重命名节点 */
	renameStage(id, newId) { return this._call('renameStage', id, newId); }
	/** 局部更新节点 */
	updateStage(id, patch) { return this._call('updateStage', id, patch); }

	// ---- 运行态 ----
	/** 设置运行状态映射 { [id]: 'success' | 'running' | ... } */
	setRunStatus(map) { return this._call('setRunStatus', map); }
	/** 获取运行状态映射 */
	getRunStatus() { return this._call('getRunStatus'); }
	/** 模拟执行流程（拓扑序逐节点推进） */
	run() { return this._call('run'); }
	/** 是否正在执行 */
	isRunning() { return this._call('isRunning'); }
	/** 重置运行状态 */
	resetRun() { return this._call('resetRun'); }

	// ---- 视图 ----
	/** 自动分层布局 */
	autoLayout() { return this._call('autoLayout'); }
	/** 适应视图 */
	fit(padding) { return this._call('fit', padding); }
	/** 放大 */
	zoomIn() { return this._call('zoomIn'); }
	/** 缩小 */
	zoomOut() { return this._call('zoomOut'); }
	/** 1:1 复位 */
	resetView() { return this._call('resetView'); }
	/** 手动重算画布尺寸（容器尺寸变化时默认由 autoResize 自动触发，少数场景可手动调用） */
	resize(width, height) { return this._call('resize', width, height); }
	/** 当前缩放比例 */
	getZoom() { return this._call('getZoom'); }
	/** 导出 PNG */
	exportPNG(name) { return this._call('exportPNG', name); }
	/** 绑定小地图 canvas */
	attachMinimap(canvas) { return this._call('attachMinimap', canvas); }

	// ---- 选中 ----
	/** 选中节点 */
	select(id) { return this._call('select', id); }
	/** 当前选中 id */
	getSelected() { return this._call('getSelected'); }
	/** 命中测试：世界坐标 -> 节点 */
	nodeAt(world) { return this._call('nodeAt', world); }

	// ---- 模式 ----
	/** 设置模式，返回实际生效值 */
	setMode(mode) {
		const actual = this._call('setMode', mode);
		if (actual) this._opts.mode = actual;
		return actual;
	}
	/** 当前模式 */
	getMode() { return this._call('getMode'); }

	/**
	 * 底层 jmGraph 实例（高级逃生舱）
	 *
	 * 拿到它即可使用 jmGraph 全部原生能力（自定义图形、事件绑定、
	 * 渲染管线参数等），用于组件 API 未覆盖的复杂场景。
	 * @return {object|null}
	 */
	get graph() {
		return this._instance ? this._instance.graph : null;
	}
}

export default FlowGraphComponent;

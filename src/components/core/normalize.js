/**
 * @fileoverview 组件配置规范化与校验
 *
 * 目标：让下游组件拿到的永远是「合法、完整、隔离」的配置对象，
 * 即便调用方传入 `null`、错误类型或互相冲突的参数，也不会崩溃。
 *
 * 设计原则：
 * - **宽容输入**：类型不对就纠正为默认值，而不是抛异常
 * - **隔离修改**：对 stages 等输入数据做浅拷贝，避免外部对象被组件内部改写
 * - **可观测**：校验问题以 warnings 数组返回，交由 onError / 控制台处理
 *
 * @module components/core/normalize
 * @license MIT
 */
import jmPlatform from '../../core/jmPlatform.js';

/**
 * 组件默认配置
 *
 * 调用方只需传 `stages`，其余保持默认即可获得可用的流程图。
 */
export const DEFAULT_OPTIONS = {
	/** 流程节点数据（stage 数组） */
	stages: [],
	/** 交互模式：'view' 只读（可平移/缩放/自动布局）| 'edit' 可编辑（拖动/增删/连线） */
	mode: 'view',
	/** 挂载后自动适应视图 */
	autoFit: true,
	/** 自动监听容器尺寸变化并 resize（基于 ResizeObserver） */
	autoResize: true,
	/** 画布初始宽度，缺省时取容器宽度 */
	width: null,
	/** 画布初始高度，缺省时取容器高度 */
	height: null,
	/** 透传给底层 jmGraph 构造函数的参数（高级场景） */
	graphOptions: null,
	/** 布局参数：分层间距 */
	layout: null,

	// ---- 回调 ----
	/** @type {(id: string|null) => void} 选中节点变化 */
	onSelect: null,
	/** @type {(stages: Array) => void} 数据变化（增删改） */
	onChange: null,
	/** @type {(edge: {source:string, target:string}) => void} 点击连线 */
	onEdgeClick: null,
	/** @type {(id: string) => void} 触发节点重命名/编辑 */
	onNodeEdit: null,
	/** @type {(msg: string, level?: string) => void} 运行日志 */
	onLog: null,
	/** @type {(instance: object) => void} 实例就绪（可拿到完整 api） */
	onReady: null,
	/** @type {(error: Error, context: string) => void} 内部异常上报 */
	onError: null
};

/** 合法的交互模式 */
const VALID_MODES = ['view', 'edit'];

/**
 * 解析挂载容器
 *
 * 支持：CSS 选择器字符串 / DOM 元素 / 类数组（jQuery 风格）。
 * 无法解析时返回 null，由调用方决定上报还是降级。
 *
 * @param {string|HTMLElement|ArrayLike} target 容器
 * @return {HTMLElement|null}
 */
export function resolveContainer(target) {
	if (!target) return null;
	if (typeof target === 'string') {
		const doc = jmPlatform.getDocument();
		if (!doc) return null;
		try {
			return doc.querySelector(target);
		} catch (e) {
			return null;
		}
	}
	// 类数组（如 jQuery 对象）取首项
	if (target.length != null && !target.nodeType) return target[0] || null;
	return target;
}

/**
 * 校验 stages 数组
 *
 * 只做「必要」校验：id 存在且唯一。其余字段缺失按可选处理，
 * 避免因数据不完整直接拒绝渲染（宽容输入原则）。
 *
 * @param {Array} stages
 * @return {{ valid: boolean, warnings: string[] }}
 */
export function validateStages(stages) {
	const warnings = [];
	if (!Array.isArray(stages)) {
		return { valid: false, warnings: ['stages 必须是数组，已按空数组处理'] };
	}
	const seen = new Set();
	stages.forEach((s, i) => {
		if (!s || typeof s !== 'object') {
			warnings.push(`stages[${i}] 不是对象，已忽略`);
			return;
		}
		if (s.id == null || s.id === '') {
			warnings.push(`stages[${i}] 缺少 id，可能导致布局/连线异常`);
			return;
		}
		if (seen.has(s.id)) {
			warnings.push(`stages[${i}] 的 id "${s.id}" 重复`);
		}
		seen.add(s.id);
	});
	return { valid: true, warnings };
}

/**
 * 规范化组件配置
 *
 * @param {object} [options] 用户配置
 * @return {object} 合并默认值并校验后的配置（stages 已浅拷贝隔离）
 */
export function normalizeOptions(options) {
	const o = Object.assign({}, DEFAULT_OPTIONS, options || {});

	// mode：非法值回落 'view'
	if (VALID_MODES.indexOf(o.mode) === -1) o.mode = 'view';

	// stages：非数组回落空数组，并浅拷贝隔离外部引用
	if (!Array.isArray(o.stages)) o.stages = [];
	o.stages = o.stages.map(s => (s && typeof s === 'object' ? Object.assign({}, s) : s));

	// 布尔/数值项类型纠正
	o.autoFit = o.autoFit !== false;
	o.autoResize = o.autoResize !== false;

	// 回调：非函数一律置 null，避免调用时报错
	[
		'onSelect', 'onChange', 'onEdgeClick',
		'onNodeEdit', 'onLog', 'onReady', 'onError'
	].forEach(k => {
		if (typeof o[k] !== 'function') o[k] = null;
	});

	return o;
}

/**
 * 取容器的可用尺寸
 *
 * @param {HTMLElement} el
 * @param {object} [fallback] 容器无尺寸时的兜底值
 * @return {{ width: number, height: number }}
 */
export function measureContainer(el, fallback) {
	const fb = fallback || {};
	const w = el && el.clientWidth;
	const h = el && el.clientHeight;
	return {
		width: Math.max(1, w || fb.width || 800),
		height: Math.max(1, h || fb.height || 600)
	};
}

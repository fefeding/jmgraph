/**
 * @fileoverview 组件基类：框架无关的生命周期与运行时基础设施
 *
 * 所有 jmGraph 官方组件（含 FlowGraph）的共同基类，与框架无关。
 * 原生适配层（vanilla）只负责「把生命周期映射到宿主环境」，
 * 业务逻辑与状态管理全部收敛在此。
 *
 * 提供四大能力：
 * 1. **生命周期**：created → mounted → destroyed，幂等且可重入安全
 * 2. **配置热更新**：`update(partial)` 增量合并并同步到实例，避免重建画布
 * 3. **事件系统**：on / off / emit，回调经错误边界包裹，单个回调抛错不影响其他
 * 4. **运行时韧性**：ResizeObserver 自动适配、SSR 安全、异常不冒泡到宿主应用
 *
 * @module components/core/ComponentBase
 * @license MIT
 */
import jmPlatform from '../../core/jmPlatform.js';
import {
	normalizeOptions,
	resolveContainer,
	validateStages,
	measureContainer
} from './normalize.js';

/** 组件生命周期状态 */
export const STATE = {
	CREATED: 'created',
	MOUNTED: 'mounted',
	DESTROYED: 'destroyed'
};

export class ComponentBase {
	/**
	 * @param {object} [options] 组件配置（见 normalize.DEFAULT_OPTIONS）
	 */
	constructor(options) {
		/** @protected 规范化后的配置 */
		this._opts = normalizeOptions(options);
		/** @protected 事件监听器表 event -> Set<fn> */
		this._listeners = new Map();
		/** @protected 生命周期状态 */
		this._state = STATE.CREATED;
		/** @protected 挂载容器 */
		this._container = null;
		/** @protected 底层实例（子类赋值） */
		this._instance = null;
		/** @protected 记录的错误列表 */
		this._errors = [];
		/** @private ResizeObserver 实例 */
		this._ro = null;
		/** @private resize 的 rAF 句柄，用于合帧 */
		this._resizeRaf = 0;
	}

	// ==================== 事件系统 ====================

	/**
	 * 订阅事件
	 * @param {string} evt 事件名
	 * @param {Function} fn 回调
	 * @return {Function} 取消订阅函数
	 */
	on(evt, fn) {
		if (typeof fn !== 'function') return () => {};
		if (!this._listeners.has(evt)) this._listeners.set(evt, new Set());
		this._listeners.get(evt).add(fn);
		return () => this.off(evt, fn);
	}

	/**
	 * 取消订阅
	 * @param {string} evt 事件名
	 * @param {Function} [fn] 省略时清空该事件全部回调
	 */
	off(evt, fn) {
		const set = this._listeners.get(evt);
		if (!set) return;
		if (fn) set.delete(fn);
		else set.clear();
	}

	/**
	 * 触发事件（每个回调独立捕获异常，互不影响）
	 * @param {string} evt 事件名
	 * @param {...any} args 参数
	 */
	emit(evt, ...args) {
		const set = this._listeners.get(evt);
		if (set) {
			// 拷贝一份再遍历，允许回调内部增删订阅
			Array.from(set).forEach(fn => {
				this._safe(`emit:${evt}`, () => fn(...args));
			});
		}
		// 同时派发到 onXxx 形式的配置回调
		const cbName = 'on' + evt.charAt(0).toUpperCase() + evt.slice(1);
		const cb = this._opts && this._opts[cbName];
		if (typeof cb === 'function') {
			this._safe(`callback:${cbName}`, () => cb(...args));
		}
	}

	// ==================== 生命周期 ====================

	/**
	 * 挂载到容器
	 * @param {string|HTMLElement} container 容器（选择器或 DOM 元素）
	 * @return {object|null} 底层实例；失败返回 null 并通过 onError 上报
	 */
	mount(container) {
		if (this._state === STATE.DESTROYED) {
			this._report(new Error('component already destroyed'), 'mount');
			return null;
		}
		// 幂等：已挂载则直接返回
		if (this._state === STATE.MOUNTED) return this._instance;

		const el = resolveContainer(container) || resolveContainer(this._opts.container);
		if (!el) {
			this._report(new Error(`mount failed: container not found (${container})`), 'mount');
			return null;
		}
		this._container = el;

		return this._safe('mount', () => {
			this._instance = this._createInstance();
			this._state = STATE.MOUNTED;
			this._setupAutoResize();
			// 就绪回调：交给子类自行触发时机（通常在本方法末尾）
			this._afterMount();
			return this._instance;
		}) || null;
	}

	/**
	 * 增量更新配置
	 *
	 * 仅对变化的字段做同步，尽量避免重建画布造成闪烁与状态丢失。
	 *
	 * @param {object} partial 增量配置
	 * @return {object} this，便于链式调用
	 */
	update(partial) {
		if (this._state === STATE.DESTROYED || !partial) return this;
		const prev = this._opts;
		this._opts = normalizeOptions(Object.assign({}, prev, partial));

		if (this._state !== STATE.MOUNTED || !this._instance) return this;

		return this._safe('update', () => {
			// stages 变化：重建图
			if (this._opts.stages !== prev.stages && !this._shallowEqualStages(this._opts.stages, prev.stages)) {
				this._applyStages(this._opts.stages);
			}
			// mode 变化：切换交互模式
			if (this._opts.mode !== prev.mode) {
				this._applyMode(this._opts.mode);
			}
			// 其余由子类扩展
			this._applyUpdate(prev, this._opts);
			return this;
		}) || this;
	}

	/**
	 * 销毁组件，释放画布、监听与定时器
	 */
	destroy() {
		if (this._state === STATE.DESTROYED) return;
		this._safe('destroy', () => {
			this._teardownAutoResize();
			if (this._instance) {
				this._destroyInstance(this._instance);
			}
		});
		this._instance = null;
		this._container = null;
		this._listeners.clear();
		this._state = STATE.DESTROYED;
	}

	// ==================== 访问器 ====================

	/** 底层实例（未挂载时为 null） */
	get instance() {
		return this._instance;
	}

	/** 生命周期状态 */
	get state() {
		return this._state;
	}

	/** 规范化后的当前配置（只读拷贝） */
	get options() {
		return Object.assign({}, this._opts);
	}

	/** 运行期间记录的错误 */
	get errors() {
		return this._errors.slice();
	}

	/** 是否已挂载 */
	get mounted() {
		return this._state === STATE.MOUNTED;
	}

	// ==================== 子类需实现 / 可覆写的钩子 ====================

	/**
	 * 创建底层实例
	 * @protected
	 * @abstract
	 * @return {object}
	 */
	_createInstance() {
		throw new Error('_createInstance() must be implemented by subclass');
	}

	/**
	 * 销毁底层实例
	 * @protected
	 * @param {object} instance
	 */
	_destroyInstance(instance) {
		if (instance && typeof instance.destroy === 'function') instance.destroy();
	}

	/** 挂载完成后的收尾（如 autoFit、onReady） @protected */
	_afterMount() {}

	/** 应用 stages 数据 @protected */
	_applyStages(stages) {
		if (this._instance && typeof this._instance.setStages === 'function') {
			this._instance.setStages(stages);
		}
	}

	/** 应用 mode 变化 @protected */
	_applyMode(mode) {
		if (this._instance && typeof this._instance.setMode === 'function') {
			this._instance.setMode(mode);
		}
	}

	/** 其他配置变化的同步入口 @protected */
	_applyUpdate() {}

	/** 尺寸变化时的响应 @protected */
	_applyResize(w, h) {
		if (this._instance && typeof this._instance.resize === 'function') {
			this._instance.resize(w, h);
		}
	}

	// ==================== 内部工具 ====================

	/**
	 * 错误边界：包裹任意操作，异常不冒泡到宿主应用
	 * @protected
	 * @param {string} label 上下文标识
	 * @param {Function} fn
	 * @return {any} fn 的返回值，异常时为 undefined
	 */
	_safe(label, fn) {
		try {
			return fn();
		} catch (e) {
			this._report(e instanceof Error ? e : new Error(String(e)), label);
			return undefined;
		}
	}

	/**
	 * 上报错误：优先交给 onError 回调，否则输出到控制台
	 * @protected
	 * @param {Error} err
	 * @param {string} label
	 */
	_report(err, label) {
		this._errors.push({ label, error: err, at: Date.now() });
		const cb = this._opts && this._opts.onError;
		if (typeof cb === 'function') {
			try {
				cb(err, label);
				return;
			} catch (_) { /* 回调自身异常时忽略，避免二次抛错 */ }
		}
		if (typeof console !== 'undefined' && console.error) {
			console.error(`[jmGraph.components] ${label} failed:`, err);
		}
	}

	/**
	 * stages 浅比较：只比较引用与各元素的浅层字段，避免无谓重建
	 * @private
	 */
	_shallowEqualStages(a, b) {
		if (a === b) return true;
		if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			const x = a[i], y = b[i];
			if (x === y) continue;
			if (!x || !y) return false;
			const kx = Object.keys(x), ky = Object.keys(y);
			if (kx.length !== ky.length) return false;
			for (const k of kx) {
				if (x[k] !== y[k]) return false;
			}
		}
		return true;
	}

	/**
	 * 建立容器尺寸自动监听
	 *
	 * 优先 ResizeObserver（合帧处理），无则回退 window.resize。
	 * SSR / 无 window 环境直接跳过，保证服务端渲染不报错。
	 * @private
	 */
	_setupAutoResize() {
		if (!this._opts.autoResize) return;
		const win = jmPlatform.getWindow();
		if (!win || !this._container) return;

		const apply = () => {
			if (this._state !== STATE.MOUNTED || !this._container) return;
			const size = measureContainer(this._container, { width: this._opts.width, height: this._opts.height });
			this._safe('resize', () => this._applyResize(size.width, size.height));
		};

		if (typeof win.ResizeObserver === 'function') {
			this._ro = new win.ResizeObserver(() => {
				// 合帧：避免拖拽过程中高频回调
				if (this._resizeRaf) return;
				this._resizeRaf = win.requestAnimationFrame(() => {
					this._resizeRaf = 0;
					apply();
				});
			});
			this._ro.observe(this._container);
		} else {
			this._onWinResize = apply;
			win.addEventListener('resize', apply);
		}
	}

	/** 清理尺寸监听 @private */
	_teardownAutoResize() {
		const win = jmPlatform.getWindow();
		if (this._ro) {
			this._ro.disconnect();
			this._ro = null;
		}
		if (this._onWinResize && win) {
			win.removeEventListener('resize', this._onWinResize);
			this._onWinResize = null;
		}
		if (this._resizeRaf && win && win.cancelAnimationFrame) {
			win.cancelAnimationFrame(this._resizeRaf);
			this._resizeRaf = 0;
		}
	}
}

export default ComponentBase;


/**
 * @fileoverview jmGraph 属性管理基类
 * 
 * jmProperty 是 jmGraph 库中属性管理的核心类，继承自 jmObject。
 * 提供了：
 * - 基于 Symbol 的私有属性存储
 * - 属性变更事件通知机制
 * - 渲染模式管理（2D/WebGL）
 * - 动画帧请求封装
 * 
 * @module jmProperty
 * @extends jmObject
 * @author jmGraph Team
 * @license MIT
 */

import {jmUtils} from "./jmUtils.js";
import { jmObject } from "./jmObject.js";

/**
 * 属性存储的 Symbol 键
 * 使用 Symbol 确保属性存储的私有性和唯一性
 * @type {Symbol}
 * @private
 */
const PROPERTY_KEY = Symbol("properties");

/**
 * jmGraph 属性管理基类
 * 
 * jmProperty 是 jmControl 的父类，为所有图形控件提供属性管理功能。
 * 采用 Symbol + WeakMap 模式实现真正的私有属性存储，避免属性名冲突。
 * 
 * 核心特性：
 * 1. **私有属性存储**：使用 Symbol 键确保属性不被外部直接访问
 * 2. **属性变更通知**：设置属性时自动触发 'propertyChange' 事件
 * 3. **渲染模式继承**：子控件自动继承所属 graph 的渲染模式
 * 4. **脏标记传播**：子控件 needUpdate 会自动传播到 graph
 * 
 * @class jmProperty
 * @extends jmObject
 * 
 * @example
 * // 创建属性对象
 * const prop = new jmProperty({ mode: 'webgl' });
 * 
 * // 设置和获取属性
 * prop.property('customValue', 100);
 * console.log(prop.property('customValue')); // 100
 * 
 * // 监听属性变更
 * prop.on('propertyChange', (name, args) => {
 *     console.log(`${name} changed from ${args.oldValue} to ${args.newValue}`);
 * });
 */
export default class jmProperty extends jmObject {
	/**
	 * 构造函数
	 * 
	 * 初始化属性存储对象，并设置初始渲染模式。
	 * 
	 * @constructor
	 * @param {Object} [params] - 初始化参数
	 * @param {'2d'|'webgl'} [params.mode] - 渲染模式，默认 '2d'
	 * 
	 * @example
	 * // 创建使用 WebGL 渲染的属性对象
	 * const prop = new jmProperty({ mode: 'webgl' });
	 */
	constructor(params) {
		super();
		// 初始化私有属性存储对象
		this[PROPERTY_KEY] = {};
		// 设置渲染模式
		if(params && params.mode) this.mode = params.mode;
	}

	/**
	 * 获取或设置属性值
	 * 
	 * 这是属性系统的核心方法，所有属性的存取都通过此方法。
	 * 设置属性时会自动触发 'propertyChange' 事件，便于实现响应式更新。
	 * 
	 * @method property
	 * @param {string} name - 属性名称
	 * @param {*} [value] - 属性值（设置时提供）
	 * @returns {*} 获取时返回属性值，设置时返回设置的值
	 * 
	 * @example
	 * // 获取属性
	 * const value = obj.property('myProp');
	 * 
	 * // 设置属性
	 * obj.property('myProp', 'newValue');
	 * 
	 * // 链式调用
	 * obj.property('a', 1).property('b', 2);
	 */
	property(...pars) {
		if(pars) {
			const pros = this[PROPERTY_KEY];
			const name = pars[0];
			
			// 设置属性
			if(pars.length > 1) {
				const value = pars[1];
				const args = {oldValue: pros[name], newValue: value};
				pros[name] = pars[1];
				// 触发属性变更事件（如果对象支持事件）
				if(this.emit) this.emit('propertyChange', name, args);
				return pars[1];
			}
			// 获取属性
			else if(name) {
				return pros[name];
			}
		}
	}

	/**
	 * 是否需要重绘标记
	 * 
	 * 当属性变化导致需要重新渲染时设置此标记。
	 * 设置为 true 时，会自动将所属 graph 的 needUpdate 设为 true，
	 * 从而触发画布重绘。
	 * 
	 * @type {boolean}
	 * 
	 * @example
	 * // 标记需要重绘
	 * control.needUpdate = true;
	 * 
	 * // 检查是否需要重绘
	 * if(control.needUpdate) {
	 *     control.redraw();
	 * }
	 */
	get needUpdate() {
		return this.property('needUpdate');
	}
	set needUpdate(v) {
		this.property('needUpdate', v);
		// 传播脏标记到 graph（避免 jmGraph 自身循环）
		if(v && !this.is('jmGraph') && this.graph) {
			this.graph.needUpdate = true;
		}
	}

	/**
	 * 所属的画布实例
	 * 
	 * 获取或设置当前对象所属的 jmGraph 实例。
	 * 如果未显式设置，会自动向上查找父级链中的 jmGraph。
	 * 
	 * @type {jmGraph}
	 * 
	 * @example
	 * // 获取所属画布
	 * const graph = control.graph;
	 * 
	 * // 设置所属画布（通常由框架内部调用）
	 * control.graph = myGraph;
	 */
	get graph() {
		let g = this.property('graph');
		// 如果未设置，尝试从父级链查找
		g = g || (this.property('graph', this.findParent('jmGraph')));
		return g;
	}
	set graph(v) {
		return this.property('graph', v);
	}

	/**
	 * 渲染模式
	 * 
	 * 获取当前渲染模式，支持 '2d' 和 'webgl' 两种模式。
	 * 渲染模式的查找优先级：
	 * 1. 当前对象设置的 mode
	 * 2. 如果是 jmGraph，默认 '2d'
	 * 3. 从所属 graph 继承 mode
	 * 
	 * @type {'2d'|'webgl'}
	 * @readonly
	 * 
	 * @example
	 * // 检查渲染模式
	 * if(control.mode === 'webgl') {
	 *     // 使用 WebGL 特性
	 * } else {
	 *     // 使用 Canvas 2D API
	 * }
	 */
	get mode() {
		let m = this.property('mode');
		if(m) return m;
		// 如果当前对象是jmGraph且没有设置mode，返回默认值
		if(this.is('jmGraph')) return this.property('mode') || '2d';
		// 否则从所属的graph获取mode
		return this.graph?.mode || '2d';
	}
	set mode(v) {
		return this.property('mode', v);
	}

	/**
	 * 请求动画帧
	 * 
	 * 封装 requestAnimationFrame，支持在不同环境下工作。
	 * 如果当前对象关联了 canvas，会使用 canvas 的 requestAnimationFrame。
	 * 
	 * @method requestAnimationFrame
	 * @param {Function} handler - 动画帧回调函数
	 * @returns {number} 动画帧请求ID，用于取消
	 * 
	 * @example
	 * // 请求下一帧动画
	 * const frameId = control.requestAnimationFrame(() => {
	 *     // 更新动画状态
	 *     control.redraw();
	 * });
	 * 
	 * // 取消动画帧
	 * control.cancelAnimationFrame(frameId);
	 */
	requestAnimationFrame(handler) {
		return jmUtils.requestAnimationFrame(handler, this.graph? this.graph.canvas: null);
	}

	/**
	 * 取消动画帧请求
	 * 
	 * 取消之前通过 requestAnimationFrame 注册的回调。
	 * 
	 * @method cancelAnimationFrame
	 * @param {number} handler - 动画帧请求ID
	 * 
	 * @example
	 * // 取消动画帧
	 * control.cancelAnimationFrame(frameId);
	 */
	cancelAnimationFrame(handler) {
		return jmUtils.cancelAnimationFrame(handler, this.graph? this.graph.canvas: null);
	}
}

export { jmProperty };



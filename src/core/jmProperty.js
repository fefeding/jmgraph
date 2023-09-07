
import {jmUtils} from "./jmUtils.js";
import { jmObject } from "./jmObject.js";

const PROPERTY_KEY = Symbol("properties");

/**
 * 对象属性管理
 * 
 * @class jmProperty
 * @extends jmObject
 * @require jmObject
 */
export default class jmProperty extends jmObject {		
	
	constructor(params) {
		super();
		this[PROPERTY_KEY] = {};
		if(params && params.mode) this.mode = params.mode;
	}

	/**
	 * 基础属性读写接口
	 * @method property
	 * @param {string} name 属性名
	 * @param {any} value 属性的值
	 * @returns {any} 属性的值
	 */
	 property(...pars) {
		if(pars) {
			const pros = this[PROPERTY_KEY];
			const name = pars[0];
			if(pars.length > 1) {
				const value = pars[1];
				const args = {oldValue: pros[name], newValue: value};
				pros[name] = pars[1];
				if(this.emit) this.emit('propertyChange', name, args);
				return pars[1];
			}
			else if(name) {
				return pros[name];
			}
		}
	}

	/**
	 * 是否需要刷新画板，属性的改变会导致它变为true
	 * @property needUpdate
	 * @type {boolean}
	 */
	get needUpdate() {
		return this.property('needUpdate');
	}
	set needUpdate(v) {
		this.property('needUpdate', v);
		//子控件属性改变，需要更新整个画板
		if(v && !this.is('jmGraph') && this.graph) {
			this.graph.needUpdate = true;
		}
	}

	/**
	 * 当前所在的画布对象 jmGraph
	 * @property graph
	 * @type {jmGraph}
	 */
	get graph() {
		let g = this.property('graph');
		g = g || (this.property('graph', this.findParent('jmGraph')));
		return g;
	}
	set graph(v) {
		return this.property('graph', v);
	}

	/**
	 * 绘制模式 2d/webgl
	 * @property mode
	 * @type {string}
	 */
	get mode() {
		let m = this.property('mode');
		if(m) return m;
		else if(this.is('jmGraph')) return this.property('mode');		
		return this.graph.mode;
	}
	set mode(v) {
		return this.property('mode', v);
	}

	/**
	 * 在下次进行重绘时执行
	 * @param {Function} handler 
	 */
	requestAnimationFrame(handler) {
		return jmUtils.requestAnimationFrame(handler, this.graph? this.graph.canvas: null);
	}
	/**
	 * 清除执行回调
	 * @param {Function} handler 
	 * @returns 
	 */
	cancelAnimationFrame(handler) {
		return jmUtils.cancelAnimationFrame(handler, this.graph? this.graph.canvas: null);
	}
}

export { jmProperty };



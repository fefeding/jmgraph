import { jmObject } from "./jmObject.js";
/**
 * 对象属性管理
 * 
 * @class jmProperty
 * @require jmObject
 */
class jmProperty extends jmObject {		
	
	constructor() {
		super();
		this.__properties = {};
		this.__eventHandles = {};
	}

	/**
	 * 基础属性读写接口
	 * @method __pro
	 * @param {string} name 属性名
	 * @param {any} value 属性的值
	 * @returns {any} 属性的值
	 */
	__pro(...pars) {
		if(pars) {
			let name = pars[0];
			if(pars.length > 1) {
				let value = pars[1];
				let args = {oldValue: this.__properties[name], newValue: value};
				this.__properties[name] = pars[1];
				if(this.emit) this.emit('propertyChange', name, args);
				return pars[1];
			}
			else if(pars.length == 1) {
				return this.__properties[name];
			}
		}
	}

	/**
	 * 是否需要刷新画板，属性的改变会导致它变为true
	 * @property needUpdate
	 * @type {boolean}
	 */
	get needUpdate() {
		return this.__pro('needUpdate');
	}
	set needUpdate(v) {
		this.__pro('needUpdate', v);
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
		let g = this.__pro('graph');
		g = g || (this.__pro('graph', this.findParent('jmGraph')));
		return g;
	}
	set graph(v) {
		return this.__pro('graph', v);
	}
}

export { jmProperty };



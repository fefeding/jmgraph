import {jmControl} from "./jmControl.js";
/**
 * 基础路径,大部分图型的基类
 * 指定一系列点，画出图形
 *
 * @class jmPath
 * @extends jmControl
 * @param {object} params 路径参数 points=所有描点
 */

class jmPath extends jmControl {	

	constructor(params, t='jmPath') {
		super(params, t);		
		this.points = params && params.points ? params.points : [];	
		
	}
	
	/**
	 * 描点集合
	 * point格式：{x:0,y:0,m:true}
	 * @property points
	 * @type {array}
	 */
	get points() {
		let s = this.__pro('points');
		return s;
	}
	set points(v) {
		this.needUpdate = true;
		return this.__pro('points', v);
	}
}

export { jmPath };

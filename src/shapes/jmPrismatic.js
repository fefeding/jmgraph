/**
 * @fileoverview jmPrismatic 棱形类
 * 
 * jmPrismatic 提供了棱形（菱形）图形的绘制功能。
 * 棱形是一个四边形，其对角线互相垂直平分。
 * 
 * 主要功能：
 * - 棱形绘制
 * - 支持填充和描边
 * - 自定义宽高
 * 
 * @module jmPrismatic
 * @author jmGraph Team
 * @license MIT
 */

import {jmPath} from "../core/jmPath.js";

/**
 * 棱形类
 * 
 * 绘制棱形（菱形）图形，继承自 jmPath。
 * 棱形由中心点、宽度和高度定义。
 *
 * @class jmPrismatic
 * @extends jmPath
 * @param {object} params 参数
 * @param {object} [params.center] 棱形中心点 {x, y}
 * @param {number} [params.width] 棱形宽度
 * @param {number} [params.height] 棱形高度
 * 
 * @example
 * // 创建棱形
 * const prismatic = graph.createShape('prismatic', {
 *     center: {x: 200, y: 200},
 *     width: 100,
 *     height: 80,
 *     style: { fill: '#ff0000', stroke: '#000' }
 * });
 */
export default class jmPrismatic extends jmPath {	
	
	constructor(params, t='jmPrismatic') {
		params.isRegular = true;// 规则的
		
		super(params, t);
		this.style.close = typeof this.style.close == 'undefined'? true : this.style.close;

		this.center = params.center || {x:0,y:0};
		this.width = params.width || 0;

		//this.on('PropertyChange',this.initPoints);
		this.height = params.height  || 0;
	}
	
	/**
	 * 中心点
	 * point格式：{x:0,y:0,m:true}
	 * @property center
	 * @type {point}
	 */
	get center() {
		return this.property('center');
	}
	set center(v) {
		this.needUpdate = true;
		return this.property('center', v);
	}
	
	/**
	 * 初始化图形点
	 * 计算棱形顶点
	 * 
	 * @method initPoints
	 * @private
	 */
	initPoints() {		
		let location = this.getLocation();
		let mw = location.width / 2;
		let mh = location.height / 2;
		
		this.points = [];
		this.points.push({x:location.center.x - mw, y:location.center.y});
		this.points.push({x:location.center.x, y:location.center.y + mh});
		this.points.push({x:location.center.x + mw, y:location.center.y});
		this.points.push({x:location.center.x, y:location.center.y - mh});
	}
}

export { jmPrismatic };
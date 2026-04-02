/**
 * @fileoverview jmLine 直线类
 * 
 * jmLine 提供了直线图形的绘制功能，支持实线和虚线。
 * 虚线支持自定义间隔长度。
 * 
 * 主要功能：
 * - 直线绘制
 * - 虚线模式
 * - 自定义虚线间隔
 * 
 * @module jmLine
 * @author jmGraph Team
 * @license MIT
 */

import {jmPath} from "../core/jmPath.js";

/**
 * 直线类
 * 
 * 绘制从起点到终点的直线，支持实线和虚线两种模式。
 *
 * @class jmLine
 * @extends jmPath
 * @param {object} params 直线参数
 * @param {object} [params.start] 起始点 {x, y}
 * @param {object} [params.end] 结束点 {x, y}
 * @param {string} [params.lineType='solid'] 线类型：'solid'=实线，'dotted'=虚线
 * @param {number} [params.dashLength=4] 虚线间隔长度
 * 
 * @example
 * // 创建实线
 * const line = graph.createShape('line', {
 *     start: {x: 0, y: 0},
 *     end: {x: 100, y: 100},
 *     style: { stroke: '#000', lineWidth: 2 }
 * });
 * 
 * // 创建虚线
 * const dottedLine = graph.createShape('line', {
 *     start: {x: 0, y: 0},
 *     end: {x: 100, y: 100},
 *     lineType: 'dotted',
 *     dashLength: 5,
 *     style: { stroke: '#000' }
 * });
 */
export default class jmLine extends jmPath {	
	
	constructor(params, t='jmLine') {
		
		params.isRegular = true;// 规则的

		super(params, t);

		this.start = params.start || {x:0,y:0};
		this.end = params.end || {x:0,y:0};
		this.style.lineType = this.style.lineType || 'solid';
		this.style.dashLength = this.style.dashLength || 4;
		this.style.close = false;
	}	

	/**
	 * 控制起始点
	 * 
	 * @property start
	 * @for jmLine
	 * @type {point}
	 */
	get start() {
		return this.property('start');
	}
	set start(v) {
		this.needUpdate = true;
		return this.property('start', v);
	}

	/**
	 * 控制结束点
	 * 
	 * @property end
	 * @for jmLine
	 * @type {point}
	 */
	get end() {
		return this.property('end');
	}
	set end(v) {
		this.needUpdate = true;
		return this.property('end', v);
	}

	/**
	 * 初始化图形点,如呆为虚线则根据跳跃间隔描点
	 * @method initPoints
	 * @private
	 */
	initPoints() {	
		const start = this.start;
		const end = this.end;
		this.points = [];	
		this.points.push(start);

		if(this.style.lineType === 'dotted') {			
			let dx = end.x - start.x;
			let dy = end.y - start.y;
			const lineLen = Math.sqrt(dx * dx + dy * dy);
			dx = dx / lineLen;
			dy = dy / lineLen;
			let dottedstart = false;

			const dashLen = this.style.dashLength || 5;
			const dottedsp = dashLen / 2;
			for(let l=dashLen; l<=lineLen;) {
				const p = {
					x: start.x + dx * l, 
					y: start.y + dy * l
				};
				if(dottedstart === false) {					
					l += dottedsp;
				}
				else {				
					p.m = true;// 移动到当时坐标
					l += dashLen;
				}
				this.points.push(p);
				dottedstart = !dottedstart;				
			}
		}
		this.points.push(end);
		return this.points;
	}
}

export { jmLine };
/**
 * @fileoverview jmCircle 圆形类
 * 
 * jmCircle 提供了圆形图形的绘制功能。
 * 继承自 jmArc，可以绘制完整的圆或部分圆弧。
 * 
 * 主要功能：
 * - 圆形绘制
 * - 支持填充和描边
 * - 支持 WebGL 和 Canvas 2D 模式
 * 
 * @module jmCircle
 * @author jmGraph Team
 * @license MIT
 */

import {jmArc} from "./jmArc.js";

/**
 * 圆形类
 * 
 * 绘制圆形图形，继承自 jmArc。
 * 可以通过 center 和 radius 指定圆心和半径，
 * 也可以通过 width 和 height 指定圆的尺寸。
 *
 * @class jmCircle
 * @extends jmArc
 * @param {object} params 圆的参数
 * @param {object} [params.center] 圆心坐标 {x, y}
 * @param {number} [params.radius] 圆半径（优先使用）
 * @param {number} [params.width] 圆宽度（无 radius 时使用）
 * @param {number} [params.height] 圆高度（无 radius 时使用）
 * 
 * @example
 * // 创建圆形
 * const circle = graph.createShape('circle', {
 *     center: {x: 200, y: 200},
 *     radius: 50,
 *     style: { fill: '#ff0000', stroke: '#000' }
 * });
 */
export default class jmCircle extends jmArc {		
	
	constructor(params, t='jmCircle') {
		params.isRegular = true;// 规则的
		super(params, t);		
	}
	/**
	 * 初始化图形点
	 * 
	 * @method initPoint
	 * @private
	 * @for jmCircle
	 */
	initPoints() {		
		if(this.graph.mode === 'webgl') {
			return super.initPoints();
		}	
		let location = this.getLocation();
		
		if(!location.radius) {
			location.radius = Math.min(location.width , location.height) / 2;
		}
		this.points = [];
		this.points.push({x:location.center.x - location.radius,y:location.center.y - location.radius});
		this.points.push({x:location.center.x + location.radius,y:location.center.y - location.radius});
		this.points.push({x:location.center.x + location.radius,y:location.center.y + location.radius});
		this.points.push({x:location.center.x - location.radius,y:location.center.y + location.radius});
	}

	/**
	 * 重写基类画图，此处为画一个完整的圆 
	 *
	 * @method draw
	 */
	draw() {
		if(this.graph.mode === 'webgl') {
			return super.draw();
		}
		let bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;	
		let location = this.getLocation();
		
		if(!location.radius) {
			location.radius = Math.min(location.width , location.height) / 2;
		}
		let start = this.startAngle;
		let end = this.endAngle;
		let anticlockwise = this.anticlockwise;
		//context.arc(x,y,r,sAngle,eAngle,counterclockwise);
		this.context.arc(location.center.x + bounds.left,location.center.y + bounds.top, location.radius, start,end,anticlockwise);
	}
}

export { jmCircle };

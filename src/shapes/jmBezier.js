/**
 * @fileoverview jmBezier 贝塞尔曲线类
 * 
 * jmBezier 提供了 N 阶贝塞尔曲线的绘制功能。
 * 通过控制点定义曲线形状，支持任意阶数的贝塞尔曲线。
 * 
 * 主要功能：
 * - N 阶贝塞尔曲线
 * - 控制点管理
 * - 曲线平移
 * 
 * @module jmBezier
 * @author jmGraph Team
 * @license MIT
 */

import {jmPath} from "../core/jmPath.js";

/**
 * 贝塞尔曲线类
 * 
 * 绘制 N 阶贝塞尔曲线，参数 points 中为控制点。
 * 支持 2 阶（二次贝塞尔）、3 阶（三次贝塞尔）及更高阶曲线。
 *
 * @class jmBezier
 * @extends jmPath
 * @param {object} params 参数
 * @param {array} [params.points] 控制点数组 [{x, y}, ...]
 * 
 * @example
 * // 创建二次贝塞尔曲线（3个控制点）
 * const quadBezier = graph.createShape('bezier', {
 *     points: [
 *         {x: 100, y: 100},  // 起点
 *         {x: 200, y: 50},   // 控制点
 *         {x: 300, y: 100}   // 终点
 *     ],
 *     style: { stroke: '#000', lineWidth: 2 }
 * });
 * 
 * // 创建三次贝塞尔曲线（4个控制点）
 * const cubicBezier = graph.createShape('bezier', {
 *     points: [
 *         {x: 100, y: 100},  // 起点
 *         {x: 150, y: 50},   // 控制点1
 *         {x: 250, y: 50},   // 控制点2
 *         {x: 300, y: 100}   // 终点
 *     ],
 *     style: { stroke: '#ff0000' }
 * });
 */ 
export default class jmBezier extends jmPath {	
	
	constructor(params, t='jmBezier') {
		// 参数初始化
		params = params || {};
		
		// 曲线默认不封闭
		if(!params.style) params.style = {};
		if(typeof params.style.close !== true) {
			params.style.close = false;
		}

		super(params, t);
		this.cpoints = params.points || [];
	}	
	
	/**
	 * 控制点
	 *
	 * @property cpoints
	 * @for jmBezier
	 * @type {array}
	 */
	get cpoints() {
		return this.property('cpoints');
	}
	set cpoints(v) {
		this.needUpdate = true;
		return this.property('cpoints', v);
	}
	
	/**
	 * 初始化图形点
	 *
	 * @method initPoints
	 * @private
	 */
	initPoints() {
		
		this.points = [];
		
		let cps = this.cpoints;
		for(let t = 0;t <= 1;t += 0.01) {
			let p = this.getPoint(cps,t);
			this.points.push(p);
		}	
		this.points.push(cps[cps.length - 1]);
		return this.points;
	}

	/**
	 * 根据控制点和参数t生成贝塞尔曲线轨迹点
	 *
	 * @method getPoint
	 * @param {array} ps 控制点集合
	 * @param {number} t 参数(0-1)
	 * @return {array} 所有轨迹点的数组
	 */
	getPoint(ps, t) {
		if(ps.length == 1) return ps[0];
		if(ps.length == 2) {					
			let p = {};
			p.x = (ps[1].x - ps[0].x) * t + ps[0].x;
			p.y = (ps[1].y - ps[0].y) * t + ps[0].y;
			return p;	
		}
		if(ps.length > 2) {
			let nps = [];
			for(let i = 0;i < ps.length - 1;i++) {
				let p = this.getPoint([ps[i],ps[i+1]],t);
				if(p) nps.push(p);
			}
			return this.getPoint(nps,t);
		}
	}

	/**
	 * 对控件进行平移
	 * 遍历控件所有描点或位置，设置其偏移量。
	 *
	 * @method offset
	 * @param {number} x x轴偏移量
	 * @param {number} y y轴偏移量
	 * @param {boolean} [trans] 是否传递,监听者可以通过此属性是否决定是否响应移动事件,默认=true
	 */
	offset(x, y, trans) {	
		let p = this.cpoints;
		if(p) {			
			let len = p.length;
			for(let i=0; i < len;i++) {
				p[i].x += x;
				p[i].y += y;
			}		
			
			//触发控件移动事件	
			this.emit('move',{
				offsetX: x,
				offsetY: y,
				trans: trans
			});
			this.getLocation(true);	//重置
		}
	}
}

export { jmBezier };
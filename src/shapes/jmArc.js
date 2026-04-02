/**
 * @fileoverview jmArc 圆弧类
 * 
 * jmArc 提供了圆弧图形的绘制功能。
 * 可以绘制完整的圆、部分圆弧或扇形。
 * 
 * 主要功能：
 * - 圆弧绘制
 * - 扇形绘制（isFan=true）
 * - 顺时针/逆时针绘制
 * - 支持 WebGL 和 Canvas 2D 模式
 * 
 * @module jmArc
 * @author jmGraph Team
 * @license MIT
 */

import {jmPath} from "../core/jmPath.js";

/**
 * 圆弧类
 * 
 * 绘制圆弧或扇形图形，继承自 jmPath。
 * 支持设置圆心、半径、起始角度和结束角度。
 *
 * @class jmArc
 * @extends jmPath
 * @param {object} params 圆弧参数
 * @param {object} [params.center] 圆弧中心点 {x, y}
 * @param {number} [params.radius] 圆弧半径
 * @param {number} [params.start=0] 圆弧起始角度（弧度）
 * @param {number} [params.end=Math.PI*2] 圆弧结束角度（弧度）
 * @param {boolean} [params.anticlockwise=false] 绘制方向：false=顺时针，true=逆时针
 * @param {boolean} [params.isFan=false] 是否绘制为扇形
 * 
 * @example
 * // 创建圆弧
 * const arc = graph.createShape('arc', {
 *     center: {x: 200, y: 200},
 *     radius: 50,
 *     start: 0,
 *     end: Math.PI,
 *     style: { stroke: '#000' }
 * });
 * 
 * // 创建扇形
 * const fan = graph.createShape('arc', {
 *     center: {x: 200, y: 200},
 *     radius: 50,
 *     start: 0,
 *     end: Math.PI / 2,
 *     isFan: true,
 *     style: { fill: '#ff0000' }
 * });
 */
export default class jmArc extends jmPath {

	constructor(params, t='jmArc') {
		if(!params) params = {};
		params.isRegular = params.isRegular === false? false: true;// 规则的
		params.needCut = params.needCut === true? true: false;// 规则的
		
		super(params, t);

		this.center = params.center || {x:0,y:0};
		this.radius = params.radius || 0;

		this.startAngle = params.start || params.startAngle || 0;
		this.endAngle = params.end || params.endAngle || Math.PI * 2;		

		this.anticlockwise = params.anticlockwise  || 0;

		this.isFan = !!params.isFan;
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
	 * 半径
	 * @property radius
	 * @type {number}
	 */
	get radius() {
		return this.property('radius');
	}
	set radius(v) {
		this.needUpdate = true;
		return this.property('radius', v);
	}

	/**
	 * 扇形起始角度
	 * @property startAngle
	 * @type {number}
	 */
	get startAngle() {
		return this.property('startAngle');
	}
	set startAngle(v) {
		this.needUpdate = true;
		return this.property('startAngle', v);
	}

	/**
	 * 扇形结束角度
	 * @property endAngle
	 * @type {number}
	 */
	get endAngle() {
		return this.property('endAngle');
	}
	set endAngle(v) {
		this.needUpdate = true;
		return this.property('endAngle', v);
	}

	/**
	 * 可选。规定应该逆时针还是顺时针绘图
	 * false  顺时针，true 逆时针
	 * @property anticlockwise
	 * @type {boolean}
	 */
	get anticlockwise() {
		return this.property('anticlockwise');
	}
	set anticlockwise(v) {
		this.needUpdate = true;
		return this.property('anticlockwise', v);
	}


	/**
	 * 初始化图形点
	 * 
	 * @method initPoint
	 * @private
	 * @for jmArc
	 */
	initPoints() {
		let location = this.getLocation();//获取位置参数
		let mw = 0;
		let mh = 0;
		let cx = location.center.x ;
		let cy = location.center.y ;
		//如果设定了半径。则以半径为主	
		if(location.radius) {
			mw = mh = location.radius;
		}
		else {
			mw = location.width / 2;
			mh = location.height / 2;
		}	
		
		let start = this.startAngle;
		let end = this.endAngle;

		if((mw == 0 && mh == 0) || start == end) return;

		let anticlockwise = this.anticlockwise;
		let step = 1 / Math.max(mw, mh);

		//如果是逆时针绘制，则角度为负数，并且结束角为2Math.PI-end
		if(anticlockwise) {
			let p2 =  Math.PI * 2;
			start = p2 - start;
			end = p2 - end;
		}
		if(start > end) step = -step;

		// 预计算需要的点数量
		let pointCount = Math.ceil(Math.abs(end - start) / Math.abs(step)) + 1;
		if(this.isFan) pointCount++;

		// 复用已有数组，避免每帧分配；大小变化时才重建
		if(!this.points || this.points.length !== pointCount) {
			this.points = new Array(pointCount);
			for(let i = 0; i < pointCount; i++) {
				this.points[i] = { x: 0, y: 0 };
			}
		}

		let idx = 0;
		if(this.isFan) {
			this.points[idx].x = location.center.x;
			this.points[idx].y = location.center.y;
			idx++;
		}
		
		//椭圆方程x=a*cos(r) ,y=b*sin(r)	
		for(let r=start;;r += step) {	
			if(step > 0 && r > end) r = end;
			else if(step < 0 && r < end) r = end;

			this.points[idx].x = Math.cos(r) * mw + cx;
			this.points[idx].y = Math.sin(r) * mh + cy;
			idx++;

			if(r == end) break;
		}
		return this.points;
	}
}

export { jmArc };
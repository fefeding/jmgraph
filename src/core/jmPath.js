/**
 * @fileoverview jmPath 路径基类
 * 
 * jmPath 是大部分图形的基类，提供了基于点序列的路径绘制能力。
 * 所有需要通过点序列定义形状的图形（如多边形、线条、贝塞尔曲线等）
 * 都可以继承此类。
 * 
 * 主要功能：
 * - 点序列管理（points 属性）
 * - SVG 导出支持（toSVG 方法）
 * - 路径闭合控制
 * 
 * @module jmPath
 * @author jmGraph Team
 * @license MIT
 */

import {jmControl} from "./jmControl.js";

/**
 * 基础路径类
 * 
 * 大部分图形的基类，通过指定一系列点来画出图形。
 * 支持开放路径和闭合路径，支持 SVG 导出。
 * 
 * @class jmPath
 * @extends jmControl
 * 
 * @param {Object} params 路径参数
 * @param {Array<Object>} [params.points] 点序列，每个点格式：{x:0, y:0, m:false}
 * @param {string} [t='jmPath'] 类型标识
 * 
 * @example
 * // 创建自定义路径
 * const path = new jmPath({
 *     points: [
 *         {x: 0, y: 0},
 *         {x: 100, y: 0},
 *         {x: 100, y: 100},
 *         {x: 0, y: 100}
 *     ],
 *     style: {
 *         fill: '#ff0000',
 *         stroke: '#000000',
 *         close: true  // 闭合路径
 *     }
 * });
 */
export default class jmPath extends jmControl {	

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
		let s = this.property('points');
		return s;
	}
	set points(v) {
		this.needUpdate = true;
		return this.property('points', v);
	}

	/**
	 * 转换为SVG路径
	 * 
	 * @method toSVG
	 * @return {string} SVG路径字符串
	 */
	toSVG() {
		if(!this.points || this.points.length === 0) return '';
		
		let pathData = '';
		const points = this.points;
		
		// 移动到起点
		pathData += `M ${points[0].x} ${points[0].y}`;
		
		// 绘制路径
		for(let i = 1; i < points.length; i++) {
			const p = points[i];
			if(p.m) {
				// 移动到新位置
				pathData += ` M ${p.x} ${p.y}`;
			} else {
				// 直线到
				pathData += ` L ${p.x} ${p.y}`;
			}
		}
		
		// 如果是封闭路径
		if(this.style && this.style.close) {
			pathData += ' Z';
		}
		
		// 构建SVG元素
		let svg = '<path d="' + pathData + '"';
		
		// 添加样式
		if(this.style) {
			if(this.style.fill) {
				svg += ' fill="' + this.style.fill + '"';
			}
			if(this.style.stroke) {
				svg += ' stroke="' + this.style.stroke + '"';
			}
			if(this.style.lineWidth) {
				svg += ' stroke-width="' + this.style.lineWidth + '"';
			}
			if(this.style.opacity) {
				svg += ' opacity="' + this.style.opacity + '"';
			}
		}
		
		svg += '/>';
		return svg;
	}	
	
}

export { jmPath };

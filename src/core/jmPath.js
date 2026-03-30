import {jmControl} from "./jmControl.js";
/**
 * 基础路径,大部分图型的基类
 * 指定一系列点，画出图形
 *
 * @class jmPath
 * @extends jmControl
 * @param {object} params 路径参数 points=所有描点
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

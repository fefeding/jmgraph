/**
 * @fileoverview jmShadow 阴影类
 * 
 * jmShadow 提供了图形阴影效果的创建和管理功能。
 * 支持设置阴影的偏移、模糊程度和颜色。
 * 
 * 主要功能：
 * - 阴影偏移设置（x, y）
 * - 模糊程度设置（blur）
 * - 阴影颜色设置（color）
 * - 字符串解析和序列化
 * 
 * @module jmShadow
 * @author jmGraph Team
 * @license MIT
 */

import {jmUtils} from "./jmUtils.js";

/**
 * 阴影类
 * 
 * 用于创建图形的阴影效果。阴影可以应用于任何图形控件。
 * 
 * @class jmShadow
 * 
 * @param {number|string} x 横坐标偏移量，或阴影字符串格式 'x,y,blur,color'
 * @param {number} [y] 纵坐标偏移量
 * @param {number} [blur] 模糊值
 * @param {string} [color] 阴影颜色
 * 
 * @example
 * // 创建阴影
 * const shadow = new jmShadow(5, 5, 10, 'rgba(0,0,0,0.5)');
 * 
 * // 从字符串创建
 * const shadow = new jmShadow('5, 5, 10, rgba(0,0,0,0.5)');
 * 
 * // 应用到图形
 * rect.style.shadow = shadow;
 */
export default class jmShadow {
	constructor(x, y, blur, color) {
		if(typeof x == 'string' && !y && !blur && !color) {
			this.fromString(x);
		}
		else {
			this.x = x;
			this.y = y;
			this.blur = blur;
			this.color = color;
		}
	}
	/**
	 * 根据字符串格式转为阴影
	 * @method fromString
	 * @param {string} s 阴影字符串 x,y,blur,color
	 */
	fromString(s) {
		if(!s) return;
		let ms = s.match(/\s*([^,]+)\s*,\s*([^,]+)\s*(,[^,]+)?\s*(,[\s\S]+)?\s*/i);
		if(ms) {
			this.x = ms[1]||0;
			this.y = ms[2]||0;
			if(ms[3]) {
				ms[3] = jmUtils.trim(ms[3],', ');
				//如果第三位是颜色格式，则表示为颜色
				if(ms[3].indexOf('#')===0 || /^rgb/i.test(ms[3])) {
					this.color = ms[3];
				}
				else {
					this.blur = jmUtils.trim(ms[3],', ');
				}
			}
			if(ms[4]) {
				this.color = jmUtils.trim(ms[4],', ');
			}
		}
		return this;
	}

	/**
	 * 转为字符串格式 x,y,blur,color
	 * @method toString
	 * @returns {string} 阴影字符串
	 */
	toString() {
		let s = this.x + ',' + this.y;
		if(this.blur) s += ',' + this.blur;
		if(this.color) s += ',' + this.color;
		return s;
	}
}

export { jmShadow };
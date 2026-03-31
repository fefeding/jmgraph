import {jmUtils} from "./jmUtils.js";

/**
 * 边框系统辅助类
 * 支持完整的边框属性: 宽度、样式、颜色，支持四个角独立圆角
 *
 * @class jmBorder
 * @param {string|object} opt 边框参数
 *   字符串格式: "2px solid #ff0000" (width style color)
 *   对象格式: { width: 2, style: 'solid', color: '#ff0000', radius: 8 }
 *   对象格式(四角独立): { radius: { topLeft: 8, topRight: 8, bottomRight: 4, bottomLeft: 4 } }
 */
export default class jmBorder {
	constructor(opt) {
		this.width = 0;
		this.style = 'solid';      // solid | dashed | dotted | none
		this.color = '#000000';
		this.radius = 0;           // 可以是数字或 { topLeft, topRight, bottomRight, bottomLeft }

		if(typeof opt === 'string') {
			this.fromString(opt);
		}
		else if(opt && typeof opt === 'object') {
			if(opt.width !== undefined) this.width = Number(opt.width) || 0;
			if(opt.style) this.style = opt.style.toLowerCase();
			if(opt.color) this.color = opt.color;
			if(opt.radius !== undefined) {
				if(typeof opt.radius === 'number') {
					this.radius = opt.radius;
				}
				else if(typeof opt.radius === 'object') {
					this.radius = {
						topLeft: Number(opt.radius.topLeft) || 0,
						topRight: Number(opt.radius.topRight) || 0,
						bottomRight: Number(opt.radius.bottomRight) || 0,
						bottomLeft: Number(opt.radius.bottomLeft) || 0
					};
				}
			}
		}
	}

	/**
	 * 从字符串格式解析边框
	 * 格式: "2px solid #ff0000" 或 "width style color"
	 * @param {string} s 边框字符串
	 */
	fromString(s) {
		if(!s || typeof s !== 'string') return;
		const parts = s.trim().split(/\s+/);
		for(let i = 0; i < parts.length; i++) {
			const part = parts[i];
			// 解析宽度
			if(/^[\d.]+/.test(part)) {
				this.width = parseFloat(part) || 0;
			}
			// 解析样式
			else if(['solid', 'dashed', 'dotted', 'none', 'double', 'groove', 'ridge', 'inset', 'outset'].indexOf(part.toLowerCase()) > -1) {
				this.style = part.toLowerCase();
			}
			// 解析颜色
			else if(part.indexOf('#') === 0 || /^rgb/i.test(part) || /^[a-zA-Z]+$/.test(part)) {
				this.color = part;
			}
		}
	}

	/**
	 * 转换为字符串格式 "width style color"
	 * @returns {string}
	 */
	toString() {
		if(this.width === 0 || this.style === 'none') return 'none';
		return `${this.width}px ${this.style} ${this.color}`;
	}

	/**
	 * 获取规范化的圆角值（四个角独立）
	 * 如果radius是数字则四角相同，如果是对象则直接返回
	 * @returns {object} { topLeft, topRight, bottomRight, bottomLeft }
	 */
	getNormalizedRadius() {
		if(typeof this.radius === 'number') {
			const r = Math.max(0, this.radius);
			return { topLeft: r, topRight: r, bottomRight: r, bottomLeft: r };
		}
		if(typeof this.radius === 'object' && this.radius !== null) {
			return {
				topLeft: Math.max(0, Number(this.radius.topLeft) || 0),
				topRight: Math.max(0, Number(this.radius.topRight) || 0),
				bottomRight: Math.max(0, Number(this.radius.bottomRight) || 0),
				bottomLeft: Math.max(0, Number(this.radius.bottomLeft) || 0)
			};
		}
		return { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 };
	}

	/**
	 * 获取边框占用的总宽度（只考虑均匀边框）
	 * @returns {number}
	 */
	getBorderWidth() {
		return this.width;
	}

	/**
	 * 检查边框是否可见
	 * @returns {boolean}
	 */
	isVisible() {
		return this.width > 0 && this.style !== 'none';
	}

	/**
	 * 将border样式映射为Canvas的lineDash
	 * solid → [] (实线)
	 * dashed → [width * 3, width * 2]
	 * dotted → [width, width * 2]
	 * @returns {number[]|null}
	 */
	toLineDash() {
		const w = Math.max(1, this.width);
		switch(this.style) {
			case 'dashed':
				return [w * 3, w * 2];
			case 'dotted':
				return [w, w * 2];
			case 'double':
				return [w, w * 0.5, w, w * 0.5];
			default:
				return null; // 实线不需要lineDash
		}
	}
}

export { jmBorder };

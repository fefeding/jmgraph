/**
 * @fileoverview jmFilter 滤镜类
 * 
 * jmFilter 提供了 CSS 滤镜效果的管理和应用功能。
 * 支持多种滤镜效果，可以组合使用。
 * 
 * 支持的滤镜：
 * - blur: 模糊效果
 * - grayscale: 灰度效果
 * - sepia: 复古效果
 * - brightness: 亮度调节
 * - contrast: 对比度调节
 * - saturate: 饱和度调节
 * - hue-rotate: 色相旋转
 * - invert: 反色效果
 * - opacity: 透明度调节
 * 
 * @module jmFilter
 * @author jmGraph Team
 * @license MIT
 */

import {jmUtils} from "./jmUtils.js";

/**
 * CSS 滤镜效果类
 * 
 * 支持的滤镜: blur, grayscale, sepia, brightness, contrast, saturate, hue-rotate, invert, opacity
 *
 * @class jmFilter
 * @param {string|object} opt 滤镜参数
 *   字符串格式: "blur(2px) grayscale(50%) brightness(1.2)"
 *   对象格式: { blur: 2, grayscale: 0.5, brightness: 1.2 }
 * 
 * @example
 * // 从字符串创建
 * const filter = new jmFilter('blur(2px) grayscale(50%)');
 * 
 * // 从对象创建
 * const filter = new jmFilter({
 *     blur: 2,
 *     grayscale: 0.5,
 *     brightness: 1.2
 * });
 * 
 * // 应用到图形
 * shape.style.filter = filter;
 */
export default class jmFilter {
	constructor(opt) {
		this.filters = [];

		if(typeof opt === 'string') {
			this.fromString(opt);
		}
		else if(opt && typeof opt === 'object') {
			for(let k in opt) {
				if(k === 'constructor' || k === 'filters') continue;
				this.addFilter(k, opt[k]);
			}
		}
	}

	/**
	 * 添加单个滤镜
	 * @param {string} name 滤镜名称 (blur, grayscale, sepia, brightness, contrast, saturate, hue-rotate, invert, opacity)
	 * @param {number|string} value 滤镜值
	 */
	addFilter(name, value) {
		name = name.toLowerCase().trim();
		if(typeof value === 'string') {
			value = parseFloat(value);
		}
		if(isNaN(value)) return;

		// 规范化滤镜名称
		const normalized = {
			'blur': 'blur',
			'grayscale': 'grayscale',
			'greyscale': 'grayscale',
			'sepia': 'sepia',
			'brightness': 'brightness',
			'contrast': 'contrast',
			'saturate': 'saturate',
			'hue-rotate': 'hueRotate',
			'hueRotate': 'hueRotate',
			'invert': 'invert',
			'opacity': 'opacity'
		}[name];

		if(!normalized) return;

		// 检查是否已有同名滤镜，有则更新
		const existing = this.filters.find(f => f.name === normalized);
		if(existing) {
			existing.value = value;
		}
		else {
			this.filters.push({ name: normalized, value: value });
		}
	}

	/**
	 * 从字符串格式解析滤镜
	 * 格式: "blur(2px) grayscale(50%) brightness(1.2)"
	 * @param {string} s 滤镜字符串
	 */
	fromString(s) {
		if(!s || typeof s !== 'string') return;
		// 匹配 filterName(value) 模式
		const regex = /([a-zA-Z-]+)\s*\(\s*([^)]+)\s*\)/g;
		let match;
		while((match = regex.exec(s)) !== null) {
			const name = match[1];
			const valueStr = match[2].replace(/[a-z%]+$/i, '').trim();
			const value = parseFloat(valueStr);
			if(!isNaN(value)) {
				this.addFilter(name, value);
			}
		}
	}

	/**
	 * 转换为CSS filter字符串格式
	 * @returns {string}
	 */
	toString() {
		return this.filters.map(f => {
			switch(f.name) {
				case 'blur':
					return `blur(${f.value}px)`;
				case 'hueRotate':
					return `hue-rotate(${f.value}deg)`;
				default:
					return `${f.name}(${f.value})`;
			}
		}).join(' ');
	}

	/**
	 * 转换为Canvas context.filter可用的字符串
	 * @returns {string}
	 */
	toCanvasFilter() {
		if(this.filters.length === 0) return 'none';
		return this.toString();
	}

	/**
	 * 检查是否有指定名称的滤镜
	 * @param {string} name 滤镜名称
	 * @returns {boolean}
	 */
	has(name) {
		return this.filters.some(f => f.name === name);
	}

	/**
	 * 获取指定滤镜的值
	 * @param {string} name 滤镜名称
	 * @returns {number|undefined}
	 */
	get(name) {
		const f = this.filters.find(f => f.name === name);
		return f ? f.value : undefined;
	}

	/**
	 * 移除指定滤镜
	 * @param {string} name 滤镜名称
	 */
	remove(name) {
		const index = this.filters.findIndex(f => f.name === name);
		if(index > -1) {
			this.filters.splice(index, 1);
		}
	}

	/**
	 * 清空所有滤镜
	 */
	clear() {
		this.filters = [];
	}
}

export { jmFilter };

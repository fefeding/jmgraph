/**
 * @fileoverview jmLabel 文本标签类
 * 
 * jmLabel 提供了文本显示功能。
 * 支持单行和多行文本，支持自动换行。
 * 
 * 主要功能：
 * - 文本绘制
 * - 自动换行
 * - 文本对齐（水平/垂直）
 * - 字体样式设置
 * 
 * @module jmLabel
 * @author jmGraph Team
 * @license MIT
 */

import {jmControl} from "../core/jmControl.js";

/**
 * 文本标签类
 * 
 * 显示文字控件，支持多种文本样式和对齐方式。
 *
 * @class jmLabel
 * @extends jmControl
 * @param {object} params 参数
 * @param {string} [params.text=''] 显示的文字内容
 * @param {object} [params.center] 文本中心点坐标
 * @param {object} [params.style] 样式对象
 * @param {string} [params.style.font] 字体样式
 * @param {string} [params.style.textAlign='left'] 水平对齐方式
 * @param {string} [params.style.textBaseline='middle'] 垂直对齐方式
 * @param {number} [params.style.maxWidth] 最大宽度（用于自动换行）
 * 
 * @example
 * // 创建文本标签
 * const label = graph.createShape('label', {
 *     position: {x: 100, y: 100},
 *     text: 'Hello World',
 *     style: {
 *         fill: '#000',
 *         font: '20px Arial',
 *         textAlign: 'center'
 *     }
 * });
 */
export default class jmLabel extends jmControl {

	constructor(params, t) {
		params = params || {};
		params.isRegular = true;// 规则的
		super(params, t||'jmLabel');

		this.style.font = this.style.font || "15px Arial";
		this.style.fontFamily = this.style.fontFamily || 'Arial';
		this.style.fontSize = this.style.fontSize || 15;

		// 显示不同的 textAlign 值
		//文字水平对齐
		this.style.textAlign = this.style.textAlign || 'left';
		//文字垂直对齐
		this.style.textBaseline = this.style.textBaseline || 'middle';
		this.text = params.text || params.value || '';

		this.center = params.center || null;
	}

	/**
	 * 显示的内容
	 * @property text
	 * @type {string}
	 */
	get text() {
		return this.property('text');
	}
	set text(v) {
		this.needUpdate = true;
		return this.property('text', v);
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
	 * 当前位置左上角
	 * @property position
	 * @type {point}
	 */
	get position() {
		return this.property('position');
	}
	set position(v) {
		this.needUpdate = true;
		return this.property('position', v);
	}

	/**
	 * 在基础的getLocation上，再加上一个特殊的center处理
	 * 
	 * @method getLocation
	 * @returns {Object}
	 */
	getLocation() {
		let location = super.getLocation();
		let size = this.testSize();	
		
		location.width = location.width || size.width;
		location.height = location.height || size.height;	

		//如果没有指定位置，但指定了中心，则用中心来计算坐标
		if(!location.left && !location.top && location.center) {
			location.left = location.center.x - location.width / 2;
			location.top = location.center.y - location.height / 2;
		}
		return location;
	}

	/**
	 * 初始化图形点,主要用于限定控件边界。
	 *
	 * @method initPoints
	 * @return {array} 所有边界点数组
	 * @private
	 */
	/**
	 * 生成文本尺寸缓存 key（text/字体/换行宽度任一变化时缓存自动失效）
	 * @private
	 */
	_sizeCacheKey() {
		return (this.text||'') + '|' + (this.style.font||'') + '|' + (this.style.fontSize||'') +
			'|' + (this.style.fontFamily||'') + '|' + (this.style.maxWidth||'');
	}

	initPoints() {	
		// 仅在文本或字体相关属性变化时失效测量缓存，避免每帧重复 measureText
		const key = this._sizeCacheKey();
		if(this.__size && this.__sizeKey !== key) {
			this.__size = null;
		}
		this.__sizeKey = key;
		let location = this.getLocation();

		this.points = [{x: location.left, y: location.top}];
		this.points.push({x: location.left + location.width, y: location.top});
		this.points.push({x: location.left + location.width, y: location.top + location.height});
		this.points.push({x: location.left, y: location.top + location.height});
		return this.points;
	}

	/**
	 * 测试获取文本所占大小
	 * 计算文本渲染所需的宽度和高度，支持自动换行
	 * 
	 * @method testSize
	 * @return {object} 含文本大小的对象 {width, height}
	 */
	testSize() {
		// 使用缓存提高性能，避免重复计算（key 变化时缓存已由 initPoints 失效）
		if(this.__size && this.__sizeKey === this._sizeCacheKey()) return this.__size;

		if(this.webglControl) {
			this.__size = this.webglControl.testSize(this.text, this.style);
		}
		else {
			this.context.save && this.context.save();
			
			// 设置字体样式用于测量
			this.setStyle({
				font: this.style.font || (this.style.fontSize + 'px ' + this.style.fontFamily)
			});
			
			// 计算文本尺寸
			if(this.style.maxWidth && this.text) {
				// 文本换行处理
				const lines = this.wrapText(this.text, this.style.maxWidth);
				let maxWidth = 0;
				
				// 找出最宽的一行
				for(let line of lines) {
					const width = this.context.measureText(line).width;
					if(width > maxWidth) maxWidth = width;
				}
				
				// 计算总高度（行数 × 行高）
				const lineHeight = this.style.lineHeight || this.style.fontSize * 1.2;
				this.__size = {
					width: maxWidth,
					height: lineHeight * lines.length
				};
			}
			else {
				// 单行文本
				this.__size = this.context.measureText ?
								this.context.measureText(this.text) :
								{width: 15};
				this.__size.height = this.style.fontSize ? this.style.fontSize : 15;
			}
			
			this.context.restore && this.context.restore();
		}

		// 设置默认宽高
		if(!this.width) this.width = this.__size.width;
		if(!this.height) this.height = this.__size.height;

		this.__sizeKey = this._sizeCacheKey();
		return this.__size;
	}

	/**
	 * 文本换行处理
	 * 根据最大宽度将文本分割成多行
	 * 支持中英文混合文本，优先在空格处换行
	 * 
	 * @method wrapText
	 * @param {string} text 文本内容
	 * @param {number} maxWidth 最大宽度（像素）
	 * @return {array} 换行后的文本数组
	 */
	wrapText(text, maxWidth) {
		// 参数验证
		if(!text || !maxWidth) return [text || ''];
		
		// 检查缓存，避免重复计算
		const cacheKey = `${text}_${maxWidth}`;
		if(this.__wrapTextCache && this.__wrapTextCache.key === cacheKey) {
			return this.__wrapTextCache.lines;
		}
		
		const lines = [];
		
		// 先按换行符分割
		const paragraphs = text.split('\n');
		
		for(let paragraph of paragraphs) {
			// 如果段落为空，添加空行
			if(!paragraph) {
				lines.push('');
				continue;
			}
			
			// 按空格分割单词
			const words = paragraph.split(' ');
			let currentLine = words[0];
			
			for(let i = 1; i < words.length; i++) {
				const word = words[i];
				const testLine = currentLine + ' ' + word;
				const metrics = this.context.measureText(testLine);
				const testWidth = metrics.width;
				
				if(testWidth <= maxWidth) {
					// 当前行还能容纳这个单词
					currentLine = testLine;
				} else {
					// 当前行已满，保存当前行并开始新行
					if(currentLine) lines.push(currentLine);
					currentLine = word;
				}
			}
			
			// 添加最后一行
			if(currentLine) lines.push(currentLine);
		}
		
		// 缓存结果
		this.__wrapTextCache = {
			key: cacheKey,
			lines: lines
		};
		
		return lines;
	}

	/**
	 * 根据位置偏移画字符串
	 * 
	 * @method draw
	 */
	draw() {
		
		//获取当前控件的绝对位置
		let bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
		const size = this.testSize();
		let location = this.location;
		let x = location.left + bounds.left;
		let y = location.top + bounds.top;
		//通过文字对齐方式计算起始X位置
		switch(this.style.textAlign) {
			case 'right': {
				x += location.width;
				break;
			}
			case 'center': {
				x += location.width / 2;
				break;
			}
		}
		//通过垂直对齐方式计算起始Y值
		switch(this.style.textBaseline) {
			case 'bottom': {
				y += location.height;
				break;
			}
			case 'hanging':
			case 'alphabetic':
			case 'middle' : {
				y += location.height/2;
				break;
			}

		}

		let txt = this.text;
		if(typeof txt !== 'undefined') {
			// webgl方式
			if(this.webglControl) {
				this.webglControl.draw(this.points, bounds);
				this.webglControl.drawText(txt, x, y, location);
			}
			else if(this.style.fill && this.context.fillText) {
				if(this.style.maxWidth) {
					// 绘制换行文本
					const lines = this.wrapText(txt, this.style.maxWidth);
					const lineHeight = this.style.fontSize;
					// 调整起始Y位置以支持垂直对齐
					const startY = y - (lines.length - 1) * lineHeight / 2;
					
					for(let i = 0; i < lines.length; i++) {
						const lineY = startY + i * lineHeight;
						this.context.fillText(lines[i], x, lineY);
					}
				}
				else {
					this.context.fillText(txt,x,y);
				}
			}
			else if(this.context.strokeText) {
				if(this.style.maxWidth) {
					// 绘制换行文本
					const lines = this.wrapText(txt, this.style.maxWidth);
					const lineHeight = this.style.fontSize;
					// 调整起始Y位置以支持垂直对齐
					const startY = y - (lines.length - 1) * lineHeight / 2;
					
					for(let i = 0; i < lines.length; i++) {
						const lineY = startY + i * lineHeight;
						this.context.strokeText(lines[i], x, lineY);
					}
				}
				else {
					this.context.strokeText(txt,x,y);
				}
			}
		}
	}

	endDraw() {
		if(this.mode === '2d') {
			super.endDraw();
		}
	}
}

export { jmLabel };
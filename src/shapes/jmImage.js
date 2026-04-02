/**
 * @fileoverview jmImage 图片类
 * 
 * jmImage 提供了图片显示功能。
 * 支持从 URL 或 Image 对象加载图片，支持图片裁剪和缩放。
 * 
 * 主要功能：
 * - 图片加载和显示
 * - 图片裁剪
 * - 图片缩放
 * - 支持 WebGL 和 Canvas 2D 模式
 * 
 * @module jmImage
 * @author jmGraph Team
 * @license MIT
 */

import {jmControl} from "../core/jmControl.js";

/**
 * 图片类
 * 
 * 显示图片控件，支持从 URL 或 Image 对象加载图片。
 * 支持图片裁剪和缩放功能。
 *
 * @class jmImage
 * @extends jmControl
 * @param {object} params 控件参数
 * @param {string|HTMLImageElement} [params.image] 图片源地址或图片对象
 * @param {object} [params.position] 图片位置 {x, y}
 * @param {number} [params.width] 图片显示宽度
 * @param {number} [params.height] 图片显示高度
 * @param {object} [params.sourcePosition] 图片裁剪起始位置 {x, y}
 * @param {number} [params.sourceWidth] 图片裁剪宽度
 * @param {number} [params.sourceHeight] 图片裁剪高度
 * 
 * @example
 * // 从 URL 加载图片
 * const img = graph.createShape('image', {
 *     image: 'path/to/image.png',
 *     position: {x: 100, y: 100},
 *     width: 200,
 *     height: 150
 * });
 * 
 * // 裁剪图片
 * const croppedImg = graph.createShape('image', {
 *     image: 'path/to/sprite.png',
 *     position: {x: 100, y: 100},
 *     sourcePosition: {x: 0, y: 0},
 *     sourceWidth: 50,
 *     sourceHeight: 50,
 *     width: 100,
 *     height: 100
 * });
 */
export default class jmImage extends jmControl {

	constructor(params, t) {
		params = params || {};
		params.isRegular = true;// 规则的
		super(params, t||'jmImage');

		this.style.fill = this.fill || 'transparent';//默认指定一个fill，为了可以鼠标选中

		this.sourceWidth = params.sourceWidth;
		this.sourceHeight = params.sourceHeight;
		this.sourcePosition = params.sourcePosition;
		this.image = params.image || this.style.image;
	}

	/**
	 * 画图开始剪切位置
	 *
	 * @property sourcePosition
	 * @type {point}
	 */
	get sourcePosition() {
		return this.property('sourcePosition');
	}
	set sourcePosition(v) {
		return this.property('sourcePosition', v);
	}

	/**
	 * 被剪切宽度
	 *
	 * @property sourceWidth
	 * @type {number}
	 */
	get sourceWidth() {
		return this.property('sourceWidth');
	}
	set sourceWidth(v) {
		this.needUpdate = true;
		return this.property('sourceWidth', v);
	}

	/**
	 * 被剪切高度
	 *
	 * @method sourceHeight
	 * @type {number}
	 */
	get sourceHeight() {
		return this.property('sourceHeight');
	}
	set sourceHeight(v) {
		this.needUpdate = true;
		return this.property('sourceHeight', v);
	}

	/**
	 * 设定要绘制的图像或其它多媒体对象，可以是图片地址，或图片image对象
	 *
	 * @method image
	 * @type {img}
	 */
	get image() {
		return this.property('image');
	}
	set image(v) {
		this.needUpdate = true;
		return this.property('image', v);
	}

	/**
	 * 重写控件绘制
	 * 根据父边界偏移和此控件参数绘制图片
	 *
	 * @method draw
	 */
	draw() {	
		try {			
			const img = this.getImage();	
			this.drawImg(img);
		}
		catch(e) {
			console.error && console.error(e);
		}
	}

	// 绘制
	drawImg(img) {
		if(!img || !img.complete) {
			console.warn('image is empty');
			return;
		}
		let bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
		if(!bounds) bounds = this.parent && this.parent.getAbsoluteBounds?this.parent.getAbsoluteBounds():this.getAbsoluteBounds();

		let p = this.getLocation();		

		let sp = this.sourcePosition;
		let sw = this.sourceWidth;
		let sh = this.sourceHeight;

		const ctx = this.webglControl || this.context;
		if(this.webglControl) {
			ctx.setParentBounds && ctx.setParentBounds(bounds);
			const localBounds = this.getBounds();
			// 给图片给定顶点
			ctx.draw([
				{
					x: localBounds.left,
					y: localBounds.top
				},
				{
					x: localBounds.left + localBounds.width,
					y: localBounds.top
				},
				{
					x: localBounds.left + localBounds.width,
					y: localBounds.top + localBounds.height
				},
				 {
					x: localBounds.left, 
					y: localBounds.top + localBounds.height
				 }
			], bounds);
			ctx.drawImage(img, localBounds.left, localBounds.top, localBounds.width, localBounds.height);
			return;
		}

		// 计算绝对定位
		p.left += bounds.left;
		p.top += bounds.top;

		if(sp || typeof sw != 'undefined' || typeof sh != 'undefined') {	
			if(typeof sw == 'undefined') sw= p.width || img.width || 0;
			if(typeof sh == 'undefined') sh= p.height || img.height || 0;
			sp = sp || {x:0, y:0};			

			if(p.width && p.height) ctx.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,p.width,p.height);
			else if(p.width) {
				ctx.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,p.width,sh);
			}		
			else if(p.height) {
				ctx.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,sw,p.height);
			}		
			else ctx.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,sw,sh);		
		}
		else if(p) {
			if(p.width && p.height) ctx.drawImage(img,p.left,p.top,p.width,p.height);
			else if(p.width) ctx.drawImage(img,p.left,p.top,p.width,img.height);
			else if(p.height) ctx.drawImage(img,p.left,p.top,img.width,p.height);
			else ctx.drawImage(img,p.left,p.top);
		}
		else {
			ctx.drawImage(img);
		}
	}

	/**
	 * 获取当前控件的边界 
	 * 
	 * @method getBounds
	 * @return {object} 边界对象(left,top,right,bottom,width,height)
	 */
	getBounds(isReset) {
		//如果当次计算过，则不重复计算
		if(this.bounds && !isReset) return this.bounds;
		let rect = {};
		let img = this.getImage() || {
			width: 0,
			height: 0
		};
		let p = this.getLocation();
		let w = p.width || img.width;
		let h = p.height || img.height;
		rect.left = p.left; 
		rect.top = p.top; 
		rect.right = p.left + w; 
		rect.bottom = p.top + h; 
		rect.width = w;
		rect.height = h;
		return this.bounds=rect;
	}

	getLocation() {
		const img = this.getImage();
		const loc = super.getLocation();
		// 如果指定了宽度，但没有指定高宽，则等比缩放
		if(loc.width && !loc.height) {
			loc.height = loc.width / img.width * img.height;
		}
		else if(loc.height && !loc.width) {
			loc.width = loc.height / img.height * img.width;
		}
		return loc;
	}

	/**
	 * img对象
	 *
	 * @method getImage
	 * @return {img} 图片对象
	 */
	getImage() {
		const src = this.image || this.style.src || this.style.image;
		if(this.__img && this.__img.src && this.__img.src.indexOf(src) != -1) {
			return this.__img;
		}
		else if(src && src.src) {
			this.__img = src;
		}
		else if(typeof document !== 'undefined' && document.createElement) {
			this.__img = document.createElement('img');
			this.__img.onload = ()=>{
				this.needUpdate = true;
			};
			if(src && typeof src == 'string') this.__img.src = src;
		}
		else if(this.graph.isWXMiniApp && this.graph.canvas && typeof src === 'string') {
			// 图片对象
			this.__img = this.graph.canvas.createImage();
			this.__img.onload = ()=>{
				this.needUpdate = true;
			};
			// 设置图片src
			this.__img.src = src;
		}
		else {
			this.__img = src;
		}
		if(this.__img) this.image = this.__img.src;
		return this.__img;
	}
}

export { jmImage };
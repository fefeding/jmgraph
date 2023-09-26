import {jmControl} from "../core/jmControl.js";
/**
 * 图片控件，继承自jmControl
 * params参数中image为指定的图片源地址或图片img对象，
 * postion=当前控件的位置，width=其宽度，height=高度，sourcePosition=从当前图片中展示的位置，sourceWidth=从图片中截取的宽度,sourceHeight=从图片中截取的高度。
 * 
 * @class jmImage
 * @extends jmControl
 * @param {object} params 控件参数
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
	getBounds() {
		let rect = {};
		let img = this.getImage();
		let p = this.getLocation();
		let w = p.width || img.width;
		let h = p.height || img.height;
		rect.left = p.left; 
		rect.top = p.top; 
		rect.right = p.left + w; 
		rect.bottom = p.top + h; 
		rect.width = w;
		rect.height = h;
		return rect;
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
		//this.image = this.__img.src;
		return this.__img;
	}
}

export { jmImage };
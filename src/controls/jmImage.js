/**
 * 图片控件，继承自jmControl
 * params参数中image为指定的图片源地址或图片img对象，
 * postion=当前控件的位置，width=其宽度，height=高度，sourcePosition=从当前图片中展示的位置，sourceWidth=从图片中截取的宽度,sourceHeight=从图片中截取的高度。
 * 
 * @class jmImage
 * @for jmGraph
 * @module jmGraph
 * @require jmControl
 * @param {jmGraph} graph 当前画布
 * @param {object} params 控件参数
 */
function jmImage(graph,params) {
	var style = params && params.style ? params.style : {};
	style.fill = style.fill || 'transparent';//默认指定一个fill，为了可以鼠标选中
	this.graph = graph;
	
	/**
	 * 要使用的图像的宽度。（伸展或缩小图像）
	 *
	 * @method width
	 * @type {number}
	 */
	this.width = params.width;
	/**
	 * 要使用的图像的高度。（伸展或缩小图像）
	 *
	 * @method height
	 * @type {number}
	 */
	this.height = params.height;

	this.type = 'jmImage';
	this.position = params.position || {x:0,y:0};
	this.sourceWidth = params.sourceWidth;
	this.sourceHeight = params.sourceHeight;
	this.sourcePosition = params.sourcePosition;
	this.image = params.image || style.image;
	this.initializing(graph.context, style);
}

jmUtils.extend(jmImage, jmControl);//继承基础图形

/**
 * 画图开始剪切位置
 *
 * @property sourcePosition
 * @type {point}
 */
jmUtils.createProperty(jmImage.prototype, 'sourcePosition');

/**
 * 被剪切宽度
 *
 * @property sourceWidth
 * @type {number}
 */
jmUtils.createProperty(jmImage.prototype, 'sourceWidth');

/**
 * 被剪切高度
 *
 * @method sourceHeight
 * @type {number}
 */
jmUtils.createProperty(jmImage.prototype, 'sourceHeight');

/**
 * 设定要绘制的图像或其它多媒体对象，可以是图片地址，或图片image对象
 *
 * @method image
 * @type {number}
 */
jmUtils.createProperty(jmImage.prototype, 'image');

/**
 * 重写控件绘制
 * 根据父边界偏移和此控件参数绘制图片
 *
 * @method draw
 */
jmImage.prototype.draw = function() {	
	try {
		var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
	    if(!bounds) bounds = this.parent && this.parent.getAbsoluteBounds?this.parent.getAbsoluteBounds():this.getAbsoluteBounds();
		var p = this.getLocation();
		p.left += bounds.left;
		p.top += bounds.top;
		
		var sp = this.sourcePosition;
		var sw = this.sourceWidth;
		var sh = this.sourceHeight;
		var img = this.getImage();
			
		if(sp || typeof sw != 'undefined' || typeof sh != 'undefined') {	
			if(typeof sw == 'undefined') sw= p.width || img.width || 0;
			if(typeof sh == 'undefined') sh= p.height || img.height || 0;
			sp = sp || {x:0, y:0};

			if(p.width && p.height) this.context.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,p.width,p.height);
			else if(p.width) {
				this.context.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,p.width,sh);
			}		
			else if(p.height) {
				this.context.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,sw,p.height);
			}		
			else this.context.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,sw,sh);		
		}
		else if(p) {
			if(p.width && p.height) this.context.drawImage(img,p.left,p.top,p.width,p.height);
			else if(p.width) this.context.drawImage(img,p.left,p.top,p.width,img.height);
			else if(p.height) this.context.drawImage(img,p.left,p.top,img.width,p.height);
			else this.context.drawImage(img,p.left,p.top);
		}
		else {
			this.context.drawImage(img);
		}
	}
	catch(e) {
		console.error && console.error(e);
	}
}

/**
 * 获取当前控件的边界 
 * 
 * @method getBounds
 * @return {object} 边界对象(left,top,right,bottom,width,height)
 */
jmImage.prototype.getBounds = function() {
	var rect = {};
	var img = this.getImage();
	var p = this.getLocation();
	var w = p.width || img.width;
	var h = p.height || img.height;
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
jmImage.prototype.getImage = function() {
	var src = this.image || this.style.src || this.style.image;
	if(this.__img && this.__img.src && this.__img.src.indexOf(src) != -1) {
		return this.__img;
	}
	else if(src && src.src) {
		this.__img = src;
	}
	else if(document && document.createElement) {
		this.__img = document.createElement('img');
		if(src && typeof src == 'string') this.__img.src = src;
	}
	else {
		this.__img = src;
	}
	return this.__img;
}

if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['image'] = jmImage;
}
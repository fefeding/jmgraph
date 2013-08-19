/**
 * 图片控件，继承自jmControl
 * params参数中image为指定的图片源地址或图片img对象，
 * postion=当前控件的位置，width=其宽度，height=高度，sposition=从当前图片中展示的位置，swidth=从图片中截取的宽度,sheight=从图片中截取的高度。
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
	
	this.graph = graph;
	this.width(params.width);
	this.height(params.height);
	this.type = 'jmImage';
	this.position(params.position || {x:0,y:0});
	this.sourceWidth(params.swidth);
	this.sourceHeight(params.sheight);
	this.sourcePosition(params.sposition);
	this.image(params.image || style.image);
	this.initializing(graph.context,style);
}

jmUtils.extend(jmImage,jmControl);//继承基础图形

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
		
		var sp = this.sourcePosition();
		var sw = this.sourceWidth();
		var sh = this.sourceHeight();
		var img = this.image();
		if(sw || sh) {
			if(!sw) sw= p.width;
			if(!sh) sh= p.height;
			if(!sp) sp= {x:0,y:0};
		}
		if(sp) {		
			if(p.width && p.height) this.context.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,p.width,p.height);
			else if(p.width) {
				this.context.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,p.width,img.height);
			}		
			else if(p.height) {
				this.context.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,img.width,p.height);
			}		
			else this.context.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top);		
		}
		else if(p) {
			if(p.width && p.height) this.context.drawImage(img,p.left,p.top,p.width,p.height);
			else if(p.width) this.context.drawImage(img,p.left,p.top,p.width,img.height);
			else if(p.height) this.context.drawImage(img,p.left,p.top,img.width,p.height);
			else this.context.drawImage(img,p.left,p.top);
		}
		else {
			this.context.drawImage(this.image());
		}
	}
	catch(e) {
		console.log(e);
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
	var img = this.image();
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
 * 设定要绘制的图像或其它多媒体对象
 *
 * @method image
 * @param {string/img} [img] 图片路径或图片控件对象
 * @return {img} 图片对象
 */
jmImage.prototype.image = function(img) {
	if(img && typeof img == 'string') {
		var g = document.createElement('img');
		g.src = img;
		img = g;
	}
	return this.setValue('image',img);
}

/**
 * 画图的起始位置
 *
 * @method position
 * @param {point} [p] 图片绘制的位置
 * @return {point} 当前图片位置
 */
jmImage.prototype.position = function(p) {
	return this.setValue('position',p);
}

/**
 * 画图开始剪切位置
 *
 * @method sourcePosition
 * @param {point} [p] 目标图片截取的位置
 * @return {point} 当前截取位置
 */
jmImage.prototype.sourcePosition = function(p) {
	return this.setValue('sourcePosition',p);
}

/**
 * 被剪切宽度
 *
 * @method sourceWidth
 * @param {number} [w] 图片剪切宽度
 * @return {number} 剪切宽度
 */
jmImage.prototype.sourceWidth = function(w) {
	return this.setValue('sourceWidth',w);
}

/**
 * 被剪切高度
 *
 * @method sourceHeight
 * @param {number} h 图片剪切高度
 * @return {number} 当前被剪切高度
 */
jmImage.prototype.sourceHeight = function(h) {
	return this.setValue('sourceHeight',h);
}



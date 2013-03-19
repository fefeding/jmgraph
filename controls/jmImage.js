/**
* 图片控件
*/

var jmImage = (function() {	
	function __constructor(graph,params) {
		var style = params && params.style ? params.style : null;
		this.initializing(graph.context,style);
		this.graph = graph;
		this.width(params.width);
		this.height(params.height);
		this.position(params.position);
		this.sourceWidth(params.swidth);
		this.sourceHeight(params.sheight);
		this.sourcePosition(params.sposition);
		this.image(params.image);
	}
	jmUtils.extend(__constructor,jmControl);//继承基础图形
	return __constructor;
})();

/**
* 开始画图
*/
jmImage.prototype.draw = function() {	
	var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
    if(!bounds) bounds = this.parent && this.parent.getAbsoluteBounds?this.parent.getAbsoluteBounds():this.getAbsoluteBounds();
	var p = jmUtils.clone(this.position() || {x:0,y:0});
	p.x += bounds.left;
	p.y += bounds.top;
	var w = this.width();
	var h = this.height();
	var sp = this.sourcePosition();
	var sw = this.sourceWidth();
	var sh = this.sourceHeight();
	var img = this.image();
	if(sw || sh) {
		if(!sw) sw= w;
		if(!sh) sh= h;
		if(!sp) sp= {x:0,y:0};
	}
	if(sp) {		
		if(w && h) this.context.drawImage(img,sp.x,sp.y,sw,sh,p.x,p.y,w,h);
		else if(w) {
			this.context.drawImage(img,sp.x,sp.y,sw,sh,p.x,p.y,w,img.height);
		}		
		else if(h) {
			this.context.drawImage(img,sp.x,sp.y,sw,sh,p.x,p.y,img.width,h);
		}		
		else this.context.drawImage(img,sp.x,sp.y,sw,sh,p.x,p.y);		
	}
	else if(p) {
		if(w && h) this.context.drawImage(img,p.x,p.y,w,h);
		else if(w) this.context.drawImage(img,p.x,p.y,w,img.height);
		else if(h) this.context.drawImage(img,p.x,p.y,img.width,h);
		else this.context.drawImage(img,p.x,p.y);
	}
	else {
		this.context.drawImage(this.image());
	}
}

/**
* 获取当前控件的边界
*/
jmImage.prototype.getBounds = function() {
	var rect = {};
	var img = this.image();
	var p = this.position();
	var w = this.width() || img.width;
	var h = this.height() || img.height;
	rect.left = p.x; 
	rect.top = p.y; 
	rect.right = p.x + w; 
	rect.bottom = p.y + h; 
	rect.width = w;
	rect.height = h;
	return rect;
}

/**
* 要绘制的图像或其它多媒体对象
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
*/
jmImage.prototype.position = function(p) {
	return this.setValue('position',p);
}

/**
* 画图开始剪切位置
*/
jmImage.prototype.sourcePosition = function(p) {
	return this.setValue('sourcePosition',p);
}

/**
* 被剪切宽度
*/
jmImage.prototype.sourceWidth = function(w) {
	return this.setValue('sourceWidth',w);
}

/**
* 被剪切高度
*/
jmImage.prototype.sourceHeight = function(h) {
	return this.setValue('sourceHeight',h);
}
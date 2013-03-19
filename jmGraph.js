
/**
* 家猫画图类库
*/
var jmGraph = (function() {
	//定义图形类型缓存
	var __jmShapesCache = jmUtils.cache.add('jm_graph_shapes',{});

	function __constructor(canvas) {
		if(!canvas || !canvas.getContext) {
			throw new Error('错误的canvas参数');
		}
		this.canvas = canvas;
		var context = canvas.getContext('2d');
		this.initializing(context);
		initShapes.call(this);
		
		//绑定事件
		this.eventHandler = new jmEvents(this,this.canvas);
	}

	/**
	* 注册图型类型
	*/
	__constructor.prototype.registerShape = function(name,shape) {
		if(!__jmShapesCache[name]) {
			__jmShapesCache[name] = shape;
		}
	}

	/**
	* 创建图形
	*/
	__constructor.prototype.createShape = function(name,args) {
		if(__jmShapesCache[name]) {
			return new __jmShapesCache[name](this,args);
		}
	}

	/**
	* 初始化默认图型
	*/
	function initShapes() {
		if(typeof jmLine !== 'undefined') this.registerShape('line',jmLine);
		if(typeof jmPath !== 'undefined') this.registerShape('path',jmPath);
		if(typeof jmRect !== 'undefined') this.registerShape('rect',jmRect);
		if(typeof jmCircle !== 'undefined') this.registerShape('circle',jmCircle);
		if(typeof jmArc !== 'undefined') this.registerShape('arc',jmArc);
		if(typeof jmHArc !== 'undefined') this.registerShape('harc',jmHArc);
		if(typeof jmPrismatic !== 'undefined') this.registerShape('prismatic',jmPrismatic);
		if(typeof jmImage !== 'undefined') {
			this.registerShape('image',jmImage);
			this.registerShape('img',jmImage);
		}
		if(typeof jmBezier !== 'undefined') {
			this.registerShape('bezier',jmBezier);
		}
		if(typeof jmArraw !== 'undefined') this.registerShape('arraw',jmArraw);
		if(typeof jmArrawLine !== 'undefined') this.registerShape('arrawline',jmArrawLine);
	}	

	jmUtils.extend(__constructor,jmControl);//继承基础控件
	return __constructor;
})();

/**
* 设定画布的样式
*/
jmGraph.prototype.setStyle = function(name,style) {
	if(typeof name === 'object') {
		for(var k in name) {
			this.canvas.style[k] = name[k];	
		}
	}
	else if(name && style) {
		this.canvas.style[name] = style;	
	}
}

/**
* 生成线性渐变对象
*/
jmGraph.prototype.createLinearGradient = function(x1,y1,x2,y2) {
	var gradient = new jmGradient({type:'linear',x1:x1,y1:y1,x2:x2,y2:y2});
	return gradient;
}

/**
* 生成放射渐变对象
*/
jmGraph.prototype.createRadialGradient = function(x1,y1,r1,x2,y2,r2) {	
	var gradient = new jmGradient({type:'radial',x1:x1,y1:y1,r1:r1,x2:x2,y2:y2,r2:r2});
	return gradient;
}

/**
* 重新刷新整个画板
*/
jmGraph.prototype.refresh = function() {	
	//加入动画，触发redraw，会导致多次refresh只redraw一次
	this.animate(function() {
		return false;
	},10);
	//this.redraw();
}

/**
* 重新刷新整个画板
*/
jmGraph.prototype.redraw = function() {	
	this.clear();
	this.paint();
}

/**
* 清除画布
*/
jmGraph.prototype.clear = function(w,h) {
	//this.canvas.width = this.canvas.width;
	if(w && h) {
		this.canvas.width = w;
		this.canvas.height = h;
	}
	else {
		w = this.canvas.width;
		h = this.canvas.height;
		if(this.scaleSize) {
			w = w / this.scaleSize.x;
			h = h / this.scaleSize.y;
		}
	}
	this.context.clearRect(0,0,w,h);
}

/**
* 生成直线
*/
jmGraph.prototype.createPath = function(points,style) {
	var path = this.createShape('path',{points:points,style:style});
	return path;
}

/**
* 生成直线
*/
jmGraph.prototype.createLine = function(start,end,style) {
	var line = this.createShape('line',{start:start,end:end,style:style});
	return line;
}

/**
* 获取当前控件的边界
*/
jmGraph.prototype.getBounds = function() {
	var rect = {};	
	rect.left = 0; 
	rect.top = 0; 
	rect.right = this.canvas.width; 
	rect.bottom = this.canvas.height; 
	rect.width = rect.right - rect.left;
	rect.height = rect.bottom - rect.top;
	return rect;
}

/**
* 缩小
*/
jmGraph.prototype.zoomOut = function() {
	this.scale(0.9 ,0.9);
}

/**
* 放大
*/
jmGraph.prototype.zoomIn = function() {		
	this.scale(1.1 ,1.1);
}

/**
* 大小复原
*/
jmGraph.prototype.zoomActual = function() {
	if(this.scaleSize) {
		this.scale(1 / this.scaleSize.x ,1 / this.scaleSize.y);	
	}
	else {
		this.scale(1 ,1);	
	}	
}

/**
* 放大缩小
*/
jmGraph.prototype.scale = function(dx,dy) {
	if(!this.normalSize) {
		this.normalSize = {width:this.canvas.width,height:this.canvas.height};		
	}
	
	this.context.scale(dx,dy);
	if(!this.scaleSize) {
		this.scaleSize = {x:dx,y:dy};
	}
	else {
		this.scaleSize = {x:dx * this.scaleSize.x,y:dy * this.scaleSize.y};
	}
	this.refresh();
}

/**
* 保存为base64图形数据
*/
jmGraph.prototype.toDataURL = function() {
	var data = this.canvas.toDataURL();
	return data;
}
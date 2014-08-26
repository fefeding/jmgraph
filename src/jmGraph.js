
/**
 * jmGraph画图类库
 * 对canvas画图api进行二次封装，使其更易调用，省去很多重复的工作。
 *
 * @module jmGraph
 * @class jmGraph
 * @param {element} canvas 标签canvas
 * @require jmControl
 */
function jmGraph(canvas,w,h) {
	/*if(!canvas || !canvas.getContext) {
		throw 'canvas error';
	}*/
	this.type = 'jmGraph';
	/**
	 * 当前支持的画图类型 svg/canvas
	 *
	 * @property mode
	 * @type {string}
	 */
	this.mode = 'canvas';//jmUtils.checkSupportedMode();

	if(typeof canvas === 'string') {
		canvas = document.getElementById(canvas);
	}
	if(this.mode == 'canvas') {	
		if(canvas.tagName != 'CANVAS') {
			var cn = document.createElement('canvas');
			canvas.appendChild(cn);
			cn.width = canvas.clientWidth;
			cn.height = canvas.clientHeight;
			canvas = cn;
			
			
		}		
		this.canvas = canvas;
		if(w) this.width(w);
		if(h) this.height(h);	

		//当为ie9以下版本时，采用excanvas初始化canvas
		if(typeof G_vmlCanvasManager != 'undefined') {
			G_vmlCanvasManager.init_(document);
		}
		this.context = canvas.getContext('2d');	

			
	}
	else {
		this.context = new jmSVG(canvas,w,h);			
		this.canvas = this.context.paper;		
	}
	this.initializing(this.context);

	/**
	 * 初始化默认图形
	 * 
	 * @method initShapes
	 * @private
	 */
	(function initShapes() {
		if(typeof jmLine !== 'undefined') this.registerShape('line',jmLine);
		if(typeof jmPath !== 'undefined') this.registerShape('path',jmPath);
		if(typeof jmRect !== 'undefined') this.registerShape('rect',jmRect);
		if(typeof jmCircle !== 'undefined') this.registerShape('circle',jmCircle);
		if(typeof jmArc !== 'undefined') this.registerShape('arc',jmArc);
		if(typeof jmHArc !== 'undefined') this.registerShape('harc',jmHArc);
		if(typeof jmPrismatic !== 'undefined') this.registerShape('prismatic',jmPrismatic);
		if(typeof jmLabel !== 'undefined') this.registerShape('label',jmLabel);
		if(typeof jmImage !== 'undefined') {
			this.registerShape('image',jmImage);
			this.registerShape('img',jmImage);
		}
		if(typeof jmBezier !== 'undefined') {
			this.registerShape('bezier',jmBezier);
		}
		if(typeof jmArraw !== 'undefined') this.registerShape('arraw',jmArraw);
		if(typeof jmArrawLine !== 'undefined') this.registerShape('arrawline',jmArrawLine);
		if(typeof jmResize !== 'undefined') this.registerShape('resize',jmResize);
		if(typeof jmTooltip !== 'undefined') this.registerShape('tooltip',jmTooltip);
	}).call(this);
	
	//绑定事件
	this.eventHandler = new jmEvents(this,this.canvas.canvas || this.canvas);
}

//继承基础控件
jmUtils.extend(jmGraph,jmControl);	

/**
 * 注册图形类型,图形类型必需有统一的构造函数。参数为画布句柄和参数对象。
 *
 * @method registerShape 
 * @param {string} name 控件图形名称
 * @param {class} shape 图形控件类型
 */
jmGraph.prototype.registerShape = function(name,shape) {
	name = 'jmGraph.shapes.' + name;
	if(!jmUtils.cache.get(name)) {
		jmUtils.cache.set(name , shape);
	}
}

/**
 * 从已注册的图形类创建图形
 * 简单直观创建对象
 *
 * @method createShape 
 * @param {string} name 注册控件的名称
 * @param {object} args 实例化控件的参数
 * @return {object} 已实例化控件的对象
 */
jmGraph.prototype.createShape = function(name,args) {
	name = 'jmGraph.shapes.' + name;
	var shape = jmUtils.cache.get(name);
	if(shape) {
		if(!args) args = {};
		args.mode = this.mode;
		var obj = new shape(this,args);
		return obj;
	}
}

/**
 * 检查是否支持的浏览器
 *
 * @method isSurportedBrowser
 * @return {boolean} true=支持，false=不支持
 */
jmGraph.prototype.isSupportedBrowser = function() {
	var browser = jmUtils.browser();
	return !browser.msie || browser.ver > 8.0;
}

/**
 * 生成阴影对象
 *
 * @method createShadow
 * @param {number} x x偏移量
 * @param {number} y y偏移量
 * @param {number} blur 模糊值
 * @param {string} color 颜色
 * @return {jmShadow} 阴影对象
 */
jmGraph.prototype.createShadow = function(x,y,blur,color) {
	var sh = new jmShadow(x,y,blur,color);
	return sh;
}

/**
 * 生成线性渐变对象
 *
 * @method createLinearGradient
 * @param {number} x1 线性渐变起始点X坐标
 * @param {number} y1 线性渐变起始点Y坐标
 * @param {number} x2 线性渐变结束点X坐标
 * @param {number} y2 线性渐变结束点Y坐标
 * @return {jmGradient} 线性渐变对象
 */
jmGraph.prototype.createLinearGradient = function(x1,y1,x2,y2) {
	var gradient = new jmGradient({type:'linear',x1:x1,y1:y1,x2:x2,y2:y2});
	return gradient;
}

/**
 * 生成放射渐变对象
 *
 * @method createRadialGradient
 * @param {number} x1 放射渐变小圆中心X坐标
 * @param {number} y1 放射渐变小圆中心Y坐标
 * @param {number} r1 放射渐变小圆半径
 * @param {number} x2 放射渐变大圆中心X坐标
 * @param {number} y2 放射渐变大圆中心Y坐标
 * @param {number} r2 放射渐变大圆半径
 * @return {jmGradient} 放射渐变对象
 */
jmGraph.prototype.createRadialGradient = function(x1,y1,r1,x2,y2,r2) {	
	var gradient = new jmGradient({type:'radial',x1:x1,y1:y1,r1:r1,x2:x2,y2:y2,r2:r2});
	return gradient;
}

/**
 * 重新刷新整个画板
 * 以加入动画事件触发延时10毫秒刷新，保存最尽的调用只刷新一次，加强性能的效果。
 *
 * @method refresh
 */
jmGraph.prototype.refresh = function() {	
	//加入动画，触发redraw，会导致多次refresh只redraw一次
	this.animate(function() {
		return false;
	},100,'jmgraph_refresh');
	//this.redraw();
}

/**
 * 重新刷新整个画板
 * 此方法直接重画，与refresh效果类似
 *
 * @method redraw
 * @param {number} [w] 清除画布的宽度
 * @param {number} [h] 清除画布的高度
 */
jmGraph.prototype.redraw = function(w,h) {	
	this.clear(w,h);
	this.paint();
}

/**
 * 清除画布
 * 
 * @method clear
 * @param {number} [w] 清除画布的宽度
 * @param {number} [h] 清除画布的高度
 */
jmGraph.prototype.clear = function(w,h) {
	//this.canvas.width = this.canvas.width;
	if(w && h) {
		//this.zoomActual();//恢复比例缩放
		this.canvas.width = w;
		this.canvas.height = h;
		//保留原有缩放比例
		if(this.scaleSize) {
			if(this.context.scale) this.context.scale(this.scaleSize.x,this.scaleSize.y);
		}
	}
	else {
		w = this.canvas.width;
		h = this.canvas.height;
		if(this.scaleSize) {
			w = w / this.scaleSize.x;
			h = h / this.scaleSize.y;
		}
	}
	if(this.context.clearRect) this.context.clearRect(0,0,w,h);
}

/**
* 设置画布样式，此处只是设置其css样式
*
* @method css
* @param {string} name 样式名
* @param {string} value 样式值
*/
jmGraph.prototype.css = function(name,value) {
	if(this.canvas) {
		this.canvas.style[name] = value;
	}
}

/**
 * 生成路径对象
 *
 * @method createPath
 * @param {array} points 路径中的描点集合
 * @param {style} style 当前路径的样式
 * @return {jmPath} 路径对象jmPath
 */
jmGraph.prototype.createPath = function(points,style) {
	var path = this.createShape('path',{points:points,style:style});
	return path;
}

/**
 * 生成直线
 * 
 * @method createLine
 * @param {point} start 直线的起点
 * @param {point} end 直线的终点
 * @param {style} 直线的样式
 * @return {jmLine} 直线对象
 */
jmGraph.prototype.createLine = function(start,end,style) {
	var line = this.createShape('line',{start:start,end:end,style:style});
	return line;
}

/**
 * 重写获取当前控件的边界
 * 
 * @method getBounds
 * @return {object} 当前画布的边界 {left,top,right,bottom,width,height}
 */
jmGraph.prototype.getBounds = function() {
	var rect = {};	
	rect.left = 0; 
	rect.top = 0; 
	if(typeof this.canvas.width === 'function') {
		rect.right = this.canvas.width(); 
	}
	else {
		rect.right = this.canvas.width; 
	}
	
	if(typeof this.canvas.height === 'function') {
		rect.bottom = this.canvas.height(); 
	}
	else {
		rect.bottom = this.canvas.height; 
	}
	rect.width = rect.right;
	rect.height = rect.bottom;
	return rect;
}

/**
 * 获取当前画布在浏览器中的绝对定位
 *
 * @method getPosition
 * @return {postion} 返回定位坐标
 */
jmGraph.prototype.getPosition = function() {
	var p = jmUtils.getElementPosition(this.canvas.canvas || this.canvas);
	p.width = this.canvas.width;
	p.height = this.canvas.height;
	p.right = p.left + p.width;
	p.bottom = p.top + p.height;
	return p;
}

/**
 * 检 查坐标是否落在当前控件区域中..true=在区域内
 * graph需要特殊处理，因为它是相对为整个页面的，接收所有事件再分发相对于它本身的子控件。
 *
 * @method checkPoint
 * @param {point} p 位置参数
 * @return {boolean} 当前位置如果在区域内则为true,否则为false。
 */
jmGraph.prototype.checkPoint = function(p) {	
	var position = this.getPosition();

	if(p.pageX > position.right || p.pageX < position.left) {
		return false;
	}
	if(p.pageY > position.bottom || p.pageY < position.top) {
		return false;
	}	
	return true;
}

/**
 * 缩小整个画布按比例0.9
 * 
 * @method zoomOut
 */
jmGraph.prototype.zoomOut = function() {
	this.scale(0.9 ,0.9);
}

/**
 * 放大 每次增大0.1的比例
 * 
 * @method zoomIn
 */
jmGraph.prototype.zoomIn = function() {		
	this.scale(1.1 ,1.1);
}

/**
 * 大小复原
 * 
 * @method zoomActual
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
 * 宽度
 * 
 * @method width
 */
jmGraph.prototype.width = function(w) {
	//if(this.mode == 'canvas') {
		if(typeof w !== 'undefined') this.canvas.width = w;
		return this.canvas.width;
	//}
	//else {
		//if(typeof w !== 'undefined') this.canvas.width(w);
		//return this.canvas.width();
	//}
}

/**
 * 高度
 * 
 * @method width
 */
jmGraph.prototype.height = function(h) {
	//if(this.mode == 'canvas') {
		if(typeof h !== 'undefined') this.canvas.height = h;
		return this.canvas.height;
	//}
	//else {
		//if(typeof h !== 'undefined') this.canvas.height(h);
		//return this.canvas.height();
	//}
}

/**
 * 放大缩小画布
 * 
 * @method scale
 * @param {number} dx 缩放X轴比例
 * @param {number} dy 缩放Y轴比例
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
 * 
 * @method toDataURL
 * @return {string} 当前画布图的base64字符串
 */
jmGraph.prototype.toDataURL = function() {
	var data = this.canvas.toDataURL?this.canvas.toDataURL():'';
	return data;
}


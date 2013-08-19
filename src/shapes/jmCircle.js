/**
 * 画完整的圆
 *
 * @class jmCircle
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 画布
 * @param {object} params 圆的参数:center=圆中心,radius=圆半径,优先取此属性，如果没有则取宽和高,width=圆宽,height=圆高
 */

function jmCircle(graph,params) {
	if(!params) params = {};
	/**
	 * 当前对象类型名jmCircle
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmCircle';
	this.points = params.points || [];
	var style = params.style || {};
	
	this.graph = graph;
		
	this.center(params.center || {x:0,y:0});
	this.width(params.width || 0);

	//this.on('PropertyChange',this.initPoints);
	this.height(params.height  || 0);
	this.radius(params.radius  || 0);

	this.initializing(graph.context,style);
}
jmUtils.extend(jmCircle,jmPath);//继承path图形

/**
 * 初始化图形点
 * 
 * @method initPoint
 * @private
 * @for jmCircle
 */
jmCircle.prototype.initPoints = function() {	
	/*var mw = this.width() / 2;
	var mh = this.height() / 2;
	var center = this.center();
	var cx = center.x ;//+ bounds.left;
	var cy = center.y ;//+ bounds.top;
	var r1 =  mw * mw;
	var r2 = mh * mh;
	this.points = [];
	for(var x = -mw;x <= mw; x += 0.1) {
		var y = Math.sqrt((1 - (x * x) / r1)) * mh;
		this.points.push({x:x + cx,y:y + cy});
	}
	for(var i= this.points.length - 1;i >= 0;i--) {
		var p = this.points[i];
		this.points.push({x:p.x ,y:cy * 2 - p.y});
	}*/
	var location = this.getLocation();
	
	if(!location.radius) {
		location.radius = Math.min(location.width , location.height) / 2;
	}
	this.points = [];
	this.points.push({x:location.center.x - location.radius,y:location.center.y - location.radius});
	this.points.push({x:location.center.x + location.radius,y:location.center.y - location.radius});
	this.points.push({x:location.center.x + location.radius,y:location.center.y + location.radius});
	this.points.push({x:location.center.x - location.radius,y:location.center.y + location.radius});
}

/**
 * 重写基类画图，此处为画一个完整的圆 
 *
 * @method draw
 */
jmCircle.prototype.draw = function() {
	var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;	
	var location = this.getLocation();
	
	if(!location.radius) {
		location.radius = Math.min(location.width , location.height) / 2;
	}
	if(!this.mode || this.mode == 'canvas') {
		this.context.arc(location.center.x + bounds.left,location.center.y + bounds.top,location.radius,0,Math.PI * 2);
	}
	else {
		if(!this.svgShape) {
			this.svgShape = this.context.create('circle',this);
			this.setStyle();
			this.svgShape.appendTo(this.graph.canvas);
		}	
		this.svgShape.setStyle(this);		
		this.svgShape.attr({
			cx:location.center.x + bounds.left,
			cy:location.center.y + bounds.top,
			r:location.radius
		});
	}
}

/**
* 获取当前控件的边界

jmCircle.prototype.getBounds = function() {
	this.initPoints();
	return this.base.getBounds.call(this);
}*/

/**
 * 设定或获取中心点
 * 
 * @method center
 * @for jmCircle
 * @param {point} p 中心参数
 * @return {point} 当前中心点
 */
jmCircle.prototype.center = function(p) {
	return this.setValue('center',p);
}

/**
 * 设定或获取半径
 * 
 * @method radius
 * @for jmCircle
 * @param {number} p 半径
 * @return {number} 当前半径
 */
jmCircle.prototype.radius = function(p) {
	return this.setValue('radius',p);
}




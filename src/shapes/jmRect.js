/**
 * 画矩形
 *
 * @class jmRect
 * @for jmGraph
 * @param {jmGraph} graph 画布
 * @param {object} params 参数 position=矩形左上角顶点坐标,width=宽，height=高,radius=边角弧度
 */
 
function jmRect(graph,params) {
	if(!params) params = {};
	/**
	 * 当前对象类型名jmRect
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmRect';
	this.points = params.points || [];
	var style = params.style || {};
	style.close = true;
	
	this.graph = graph;
	
	this.position(params.position || {x:0,y:0});
	this.width(params.width || 0);
	this.height(params.height  || 0);
	this.radius(params.radius || style.radius || 0);

	this.initializing(graph.context,style);
}
jmUtils.extend(jmRect,jmPath);//jmPath

/**
 * 获取当前控件的边界
 *
 * @method getBounds
 * @return {bound} 当前控件边界
 */
jmRect.prototype.getBounds = function() {
	 var rect = {};
    this.initPoints();
    var p = this.getLocation();
    rect.left = p.left; 
    rect.top = p.top; 
    
    rect.right = p.x + p.width; 
    rect.bottom = p.y + p.height; 
    
    rect.width = rect.right - rect.left;
    rect.height = rect.bottom - rect.top;
    return rect;
}

/**
 * 重写检查坐标是否在区域内
 *
 * @method checkPoint
 * @param {point} p 待检查的坐标
 * @return {boolean} 如果在则返回true,否则返回false
 */
jmRect.prototype.checkPoint = function(p) {	
	//生成当前坐标对应的父级元素的相对位置
	var abounds = this.bounds || this.getBounds();

	if(p.x > abounds.right || p.x < abounds.left) {
		return false;
	}
	if(p.y > abounds.bottom || p.y < abounds.top) {
		return false;
	}
	
	return true;
}

/**
 * 初始化图形点
 * 如果有边角弧度则类型圆绝计算其描点
 * 
 * @method initPoints
 * @private
 */
jmRect.prototype.initPoints = function() {
	var location = this.getLocation();	
	var p1 = {x:location.left,y:location.top};
	var p2 = {x:location.left + location.width,y:location.top};
	var p3 = {x:location.left + location.width,y:location.top + location.height};
	var p4 = {x:location.left,y:location.top + location.height};
	
	//如果有边界弧度则借助圆弧对象计算描点
	if(location.radius && location.radius < location.width/2 && location.radius < location.height/2) {
		var q = Math.PI / 2;
		var arc = this.graph.createShape('arc',{radius:location.radius,anticlockwise:false});
		arc.center({x:location.left + location.radius,y:location.top+location.radius});
		arc.startAngle(Math.PI);
		arc.endAngle(Math.PI + q);
		var ps1 = arc.initPoints();
		
		arc = this.graph.createShape('arc',{radius:location.radius,anticlockwise:false});
		arc.center({x:p2.x - location.radius,y:p2.y + location.radius});
		arc.startAngle(Math.PI + q);
		arc.endAngle(Math.PI * 2);
		var ps2 = arc.initPoints();
		
		arc = this.graph.createShape('arc',{radius:location.radius,anticlockwise:false});
		arc.center({x:p3.x - location.radius,y:p3.y - location.radius});
		arc.startAngle(0);
		arc.endAngle(q);
		var ps3 = arc.initPoints();
		
		arc = this.graph.createShape('arc',{radius:location.radius,anticlockwise:false});
		arc.center({x:p4.x + location.radius,y:p4.y - location.radius});
		arc.startAngle(q);
		arc.endAngle(Math.PI);
		var ps4 = arc.initPoints();
		this.points = ps1.concat(ps2,ps3,ps4);
	}
	else {
		this.points = [];
		this.points.push(p1);
		this.points.push(p2);
		this.points.push(p3);
		this.points.push(p4);
	}		
	
	return this.points;
}

/**
* 开始矩形
*//*
jmRect.prototype.draw = function() {
	var p = this.position();	
	if(p) {
		//获取当前控件的绝对位置
		//var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
		
		var w = this.width();
		var h = this.height();
		var p2 = {x:p.x + w,y:p.y};
		var p3 = {x:p.x + w,y:p.y + h};
		var p4 = {x:p.x,y:p.y + h};
		this.points = [];
		this.points.push(p);
		this.points.push(p2);
		this.points.push(p3);
		this.points.push(p4);
		//this.points.push(p1);

		this.context.moveTo(p.x,p.y );		
		this.context.lineTo(p2.x,p2.y);
		this.context.lineTo(p3.x,p3.y);
		this.context.lineTo(p4.x,p4.y);
		//this.context.lineTo(p1.x,p1.y);
	}		
}*/

/**
 * 圆角半径
 *
 * @method radius
 * @param {number} r 边角圆弧半径
 * @return {number} 当前圆角半径
 */
jmRect.prototype.radius = function(r) {
	return this.setValue('radius',r);
}


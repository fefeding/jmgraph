/**
 * 画规则的圆弧
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
		
	this.center = params.center || {x:0,y:0};
	this.radius = params.radius || 0;

	this.startAngle = params.start || params.startAngle || 0;
	this.endAngle = params.end || params.endAngle || Math.PI * 2;

	this.width = params.width || 0;
	this.height = params.height  || 0;

	this.anticlockwise = params.anticlockwise  || 0;

	this.initializing(graph.context,style);
}
jmUtils.extend(jmCircle, jmArc);//继承path图形

/**
 * 初始化图形点
 * 
 * @method initPoint
 * @private
 * @for jmCircle
 */
jmCircle.prototype.initPoints = function() {	
	
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
	var start = this.startAngle;
	var end = this.endAngle;
	var anticlockwise = this.anticlockwise;
	//context.arc(x,y,r,sAngle,eAngle,counterclockwise);
	this.context.arc(location.center.x + bounds.left,location.center.y + bounds.top, location.radius, start,end,anticlockwise);
}

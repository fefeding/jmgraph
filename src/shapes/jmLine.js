import jmPath from "./jmPath";
/**
 * 画一条直线
 *
 * @class jmLine
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 当前画布
 * @param {object} params 直线参数:start=起始点,end=结束点,lineType=线类型(solid=实线，dotted=虚线),dashLength=虚线间隔(=4)
 */

function jmLine(graph,params) {
	if(!params) params = {};
	/**
	 * 当前对象类型名jmLine
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmLine';
	this.points = params.points || [];
	var style = params.style || {};
	
	this.graph = graph;
		
	this.start = params.start || {x:0,y:0};
	this.end = params.end || {x:0,y:0};
	//this.points.push(this.start);
	//this.points.push(this.end);

	style.lineType = style.lineType || 'solid';
	style.dashLength = style.dashLength || 4;
	this.initializing(graph.context,style);
}
jmUtils.extend(jmLine, jmPath);//继承path图形

/**
 * 控制起始点
 * 
 * @property start
 * @for jmLine
 * @type {point}
 */
jmUtils.createProperty(jmLine.prototype, 'start');

/**
 * 控制结束点
 * 
 * @property end
 * @for jmLine
 * @type {point}
 */
jmUtils.createProperty(jmLine.prototype, 'end');

/**
 * 初始化图形点,如呆为虚线则根据跳跃间隔描点
 * @method initPoints
 * @private
 */
jmLine.prototype.initPoints = function() {	
	var start = this.start;
	var end = this.end;
	this.points = [];	
	this.points.push(start);

	if(this.style.lineType === 'dotted') {			
		var dx = end.x - start.x;
		var dy = end.y - start.y;
		var lineLen = Math.sqrt(dx * dx + dy * dy);
		dx = dx / lineLen;
		dy = dy / lineLen;
		var dottedstart = false;

		var dashLen = this.style.dashLength || 5;
		var dottedsp = dashLen / 2;
		for(var l=dashLen; l<=lineLen;) {
			if(dottedstart == false) {
				this.points.push({x:start.x + dx * l,y:start.y+ dy * l});
				l += dottedsp;
			}
			else {				
				this.points.push({x:start.x + dx * l,y:start.y+ dy * l,m:true});
				l += dashLen;
			}
			dottedstart = !dottedstart;				
		}
	}
	this.points.push(end);
	return this.points;
}

/**
* 开始画图
*//*
jmLine.prototype.draw = function() {	
	
	//获取当前控件的绝对位置
	var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
	var startx = this.start.x + bounds.left;
	var starty = this.start.y + bounds.top;
	this.context.moveTo(startx,starty);
	
	if(this.style.lineType === 'dotted') {			
		var dx = this.end.x - this.start.x;
		var dy = this.end.y - this.start.y;
		var lineLen = Math.sqrt(dx * dx + dy * dy);
		dx = dx / lineLen;
		dy = dy / lineLen;
		var dottedstart = false;
		var dottedsp = this.style.dashLength / 2;
		for(var l=this.style.dashLength; l<=lineLen;) {
			if(dottedstart == false) {
				this.context.lineTo(startx + dx * l,starty+ dy * l);
				l += dottedsp;
			}
			else {
				this.context.moveTo(startx + dx * l,starty+ dy * l);
				l += this.style.dashLength;
			}
			dottedstart = !dottedstart;				
		}
		this.context.lineTo(this.end.x+ bounds.left,this.end.y + bounds.top);		
	}
	else {			
		this.context.lineTo(this.end.x+ bounds.left,this.end.y + bounds.top);
	}
		
}*/



if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['line'] = jmLine;
}
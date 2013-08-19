/**
 * 画空心圆弧,继承自jmPath
 *
 * @class jmHArc
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 画布
 * @param {object} params 空心圆参数:minRadius=中心小圆半径,maxRadius=大圆半径,start=起始角度,end=结束角度,anticlockwise=是否为顺时针
 */

function jmHArc(graph,params) {
	if(!params) params = {};
	/**
	 * 当前对象类型名jmHarc
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmHArc';
	this.points = params.points || [];
	var style = params.style || {};
	
	this.graph = graph;
		
	this.center(params.center || {x:0,y:0});
	this.minRadius(params.minRadius || style.minRadius || 0);
	this.maxRadius(params.maxRadius || style.maxRadius || 0);

	this.startAngle(params.start  || 0);
	this.endAngle(params.end  || Math.PI * 2);

	this.width(params.width || 0);
	this.height(params.height  || 0);

	this.anticlockwise(params.anticlockwise  || 0);

	this.initializing(graph.context,style);
}
jmUtils.extend(jmHArc,jmPath);//jmPath

/**
 * 初始化图形点
 *
 * @method initPoints
 * @private
 */
jmHArc.prototype.initPoints = function() {	
	var location = this.getLocation();	
	//如果设定了半径。则以半径为主
	var minr = this.minRadius();
	var maxr = this.maxRadius();
	
	var start = this.startAngle();
	var end = this.endAngle();
	var anticlockwise = this.anticlockwise();
	var minps = [];
	var maxps = [];
	//椭圆方程x=a*cos(r) ,y=b*sin(r)
	for(var r=start;r<=end;r += 0.1) {
		var rr = anticlockwise?-r:r;
		var cos = Math.cos(rr);
		var sin = Math.sin(rr);
		var p1 = {
			x : cos * minr + location.center.x,
			y : sin * minr + location.center.y
		};
		var p2 = {
			x : cos * maxr + location.center.x,
			y : sin * maxr + location.center.y
		};
		minps.push(p1);
		maxps.push(p2);
	}
	
	maxps.reverse();//大圆逆序
	if(!this.style || !this.style.close) {
		maxps[0].m = true;//开始画大圆时表示为移动
	}		
	this.points = minps.concat(maxps);
}

/**
* 获取当前控件的边界

jmHArc.prototype.getBounds = function() {
	this.initPoints();
	return this.base.getBounds.call(this);
}*/

/**
 * 设定或获取中心点
 * 
 * @method center
 * @for jmHArc
 * @param {point} p 中心点坐标
 * @return {point} 当前中心点坐标
 */
jmHArc.prototype.center = function(p) {
	return this.setValue('center',p);
}

/**
 * 设定或获取内空心圆半径
 * 
 * @method minRadius
 * @for jmHArc
 * @param {number} r 内空心圆半径
 * @return {number} 当前内空心圆半径
 */
jmHArc.prototype.minRadius = function(r) {
	return this.setValue('minRadius',r);
}

/**
 * 设定或获取外空心圆半径
 * 
 * @method maxRadius
 * @for jmHArc
 * @param {number} r 外空心圆半径
 * @return {number} 当前外空心圆半径
 */
jmHArc.prototype.maxRadius = function(r) {
	return this.setValue('maxRadius',r);
}

/**
 * 设定或获取起始角度
 * 
 * @method startAngle
 * @for jmHArc
 * @param {number} a 起始角度
 * @return {number} 当前起始角度
 */
jmHArc.prototype.startAngle = function(a) {
	return this.setValue('startAngle',a);
}

/**
 * 设定或获取结束角度
 * 
 * @method endAngle
 * @for jmHArc
 * @param {number} a 结束角度
 * @return {number} 当前结束角度
 */
jmHArc.prototype.endAngle = function(a) {
	return this.setValue('endAngle',a);
}

/**
 * 设定或获取是否顺时针画
 * 
 * @method anticlockwise
 * @for jmHArc
 * @param {number} a 是否顺时针画
 * @return {number} 当前是否顺时针画
 */
jmHArc.prototype.anticlockwise = function(a) {
	return this.setValue('anticlockwise',a);
}


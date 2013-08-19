/**
 * 圆弧图型 继承自jmPath
 * 参数params说明:center=当前圆弧中心,radius=圆弧半径,start=圆弧起始角度,end=圆弧结束角度,anticlockwise=是否为顺时针
 *
 * @class jmArc
 * @for jmGraph
 * @require jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 画布
 * @param {object} params 圆弧参数
 */

function jmArc(graph,params) {
	if(!params) params = {};
	this.points = params.points || [];
	var style = params.style || {};
	/**
	 * 当前对象类型名
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmArc';
	this.graph = graph;
		
	this.center(params.center || {x:0,y:0});
	this.radius(params.radius || 0);

	this.startAngle(params.start  || 0);
	this.endAngle(params.end  || Math.PI * 2);

	this.width(params.width || 0);
	this.height(params.height  || 0);

	this.anticlockwise(params.anticlockwise  || 0);

	this.initializing(graph.context,style);

	//this.on('PropertyChange',this.initPoints);
	//this.base = new jmCircle.prototype.constructor.superClass(graph,params);
}
jmUtils.extend(jmArc,jmPath);//jmPath

/**
 * 初始化图形点
 * 
 * @method initPoint
 * @private
 * @for jmArc
 */
jmArc.prototype.initPoints = function() {
	var location = this.getLocation();//获取位置参数
	var mw = 0;
	var mh = 0;
	var cx = location.center.x ;//+ bounds.left;
	var cy = location.center.y ;//+ bounds.top;
	//如果设定了半径。则以半径为主	
	if(location.radius) {
		mw = mh = location.radius;
	}
	else {
		mw = location.width / 2;
		mh = location.height / 2;
	}
	
	var start = this.startAngle();
	var end = this.endAngle();
	var anticlockwise = this.anticlockwise();
	this.points = [];
	//椭圆方程x=a*cos(r) ,y=b*sin(r)
	if(start < end) {
		for(var r=start;r<=end;r += 0.01) {
			var rr = anticlockwise?-r:r;
			var p = {
				x : Math.cos(rr) * mw + cx,
				y : Math.sin(rr) * mh + cy
			};
			this.points.push(p);
		}
	}
	else {
		for(var r=start;r >= end;r -= 0.01) {
			var rr = anticlockwise?-r:r;
			var p = {
				x : Math.cos(rr) * mw + cx,
				y : Math.sin(rr) * mh + cy
			};
			this.points.push(p);
		}
	}
	return this.points;
}

/**
 * 设定或获取中心点
 * 
 * @method center
 * @for jmArc
 * @param {point} p 中心参数
 * @return {point} 当前中心点
 */
jmArc.prototype.center = function(p) {
	return this.setValue('center',p);
}

/**
 * 设定或获取半径
 *
 * @method radius
 * @for jmArc
 * @param {number} r 半径
 * @return {number} 当前半径
 */
jmArc.prototype.radius = function(r) {
	return this.setValue('radius',r);
}

/**
 * 设定或获取起始角度
 *
 * @method startAngle
 * @for jmArc
 * @param {number} r 角度
 * @return {number} 当前起始角度
 */
jmArc.prototype.startAngle = function(a) {
	return this.setValue('startAngle',a);
}

/**
 * 设定或获取结束角度
 *
 * @method endAngle
 * @for jmArc
 * @param {number} r 角度
 * @return {number} 当前结束角度
 */
jmArc.prototype.endAngle = function(a) {
	return this.setValue('endAngle',a);
}

/**
 * 设定或获取是否顺时针画
 *
 * @method anticlockwise
 * @for jmArc
 * @param {boolean} a true=顺时针,false=逆时针
 * @return {boolean} 当前是否为顺时针
 */
jmArc.prototype.anticlockwise = function(a) {
	return this.setValue('anticlockwise',a);
}






/**
 * 圆弧图型 继承自jmPath
 * 参数params说明:center=当前圆弧中心,radius=圆弧半径,start=圆弧起始角度,end=圆弧结束角度,anticlockwise=  false  顺时针，true 逆时针
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
		
	this.center = params.center || {x:0,y:0};
	this.radius = params.radius || 0;

	this.startAngle = params.start || params.startAngle || 0;
	this.endAngle = params.end || params.endAngle || Math.PI * 2;

	this.width = params.width || 0;
	this.height = params.height  || 0;

	this.anticlockwise = params.anticlockwise  || 0;

	this.initializing(graph.context,style);
}
jmUtils.extend(jmArc, jmPath);//jmPath

/**
 * 中心点
 * point格式：{x:0,y:0,m:true}
 * @property center
 * @type {point}
 */
jmUtils.createProperty(jmArc.prototype, 'center');

/**
 * 半径
 * @property radius
 * @type {number}
 */
jmUtils.createProperty(jmArc.prototype, 'radius', 0);

/**
 * 扇形起始角度
 * @property startAngle
 * @type {number}
 */
jmUtils.createProperty(jmArc.prototype, 'startAngle', 0);

/**
 * 扇形结束角度
 * @property endAngle
 * @type {number}
 */
jmUtils.createProperty(jmArc.prototype, 'endAngle', 2*Math.PI);

/**
 * 可选。规定应该逆时针还是顺时针绘图
 * false  顺时针，true 逆时针
 * @property anticlockwise
 * @type {boolean}
 */
jmUtils.createProperty(jmArc.prototype, 'anticlockwise', false);


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
	
	var start = this.startAngle;
	var end = this.endAngle;
	var anticlockwise = this.anticlockwise;
	this.points = [];
	var step = 1/Math.max(mw,mh);

	//如果是逆时针绘制，则角度为负数，并且结束角为2Math.PI-end
	if(anticlockwise) {
		var p2 =  Math.PI*2;
		start = p2 - start;
		end = p2 - end;
	}
	if(start > end) step = -step;
	
	//椭圆方程x=a*cos(r) ,y=b*sin(r)	
	for(var r=start;;r += step) {
		if(step > 0 && r >= end) break;
		else if(step < 0 && r <= end) break;
		
		var p = {
			x : Math.cos(r) * mw + cx,
			y : Math.sin(r) * mh + cy
		};
		this.points.push(p);
	}
	return this.points;
}

if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['arc'] = jmArc;
}
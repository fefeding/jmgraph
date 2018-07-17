/**
 * 画空心圆弧,继承自jmPath
 *
 * @class jmHArc
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 画布
 * @param {object} params 空心圆参数:minRadius=中心小圆半径,maxRadius=大圆半径,start=起始角度,end=结束角度,anticlockwise=false  顺时针，true 逆时针
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
		
	this.center = params.center || {x:0,y:0};
	this.minRadius = params.minRadius || style.minRadius || 0;
	this.maxRadius = params.maxRadius || style.maxRadius || 0;

	this.startAngle = params.start || params.startAngle || 0;
	this.endAngle = params.end || params.endAngle || Math.PI * 2;

	this.width = params.width || 0;
	this.height = params.height  || 0;

	this.anticlockwise = params.anticlockwise  || 0;

	this.initializing(graph.context,style);
}
jmUtils.extend(jmHArc, jmPath);//jmPath

/**
 * 中心点
 * point格式：{x:0,y:0,m:true}
 * @property center
 * @type {point}
 */
jmUtils.createProperty(jmHArc.prototype, 'center');

/**
 * 设定或获取内空心圆半径
 * 
 * @property minRadius
 * @for jmHArc
 * @type {number} 
 */
jmUtils.createProperty(jmHArc.prototype, 'minRadius');

/**
 * 设定或获取外空心圆半径
 * 
 * @property maxRadius
 * @for jmHArc
 * @type {number} 
 */
jmUtils.createProperty(jmHArc.prototype, 'maxRadius');

/**
 * 扇形起始角度
 * @property startAngle
 * @type {number}
 */
jmUtils.createProperty(jmHArc.prototype, 'startAngle', 0);

/**
 * 扇形结束角度
 * @property endAngle
 * @type {number}
 */
jmUtils.createProperty(jmHArc.prototype, 'endAngle', 2*Math.PI);

/**
 * 可选。规定应该逆时针还是顺时针绘图
 * False  顺时针，true 逆时针
 * @property anticlockwise
 * @type {boolean}
 */
jmUtils.createProperty(jmHArc.prototype, 'anticlockwise', false);

/**
 * 初始化图形点
 *
 * @method initPoints
 * @private
 */
jmHArc.prototype.initPoints = function() {	
	var location = this.getLocation();	
	//如果设定了半径。则以半径为主
	var minr = this.minRadius;
	var maxr = this.maxRadius;
	
	var start = this.startAngle;
	var end = this.endAngle;
	var anticlockwise = this.anticlockwise;

	//如果是逆时针绘制，则角度为负数，并且结束角为2Math.PI-end
	if(anticlockwise) {
		var p2 =  Math.PI*2;
		start = p2 - start;
		end = p2 - end;
	}

	var step = 0.1;
	if(start > end) step = -step;

	var minps = [];
	var maxps = [];
	//椭圆方程x=a*cos(r) ,y=b*sin(r)
	for(var r=start;;r += step) {
		if(step > 0 && r >= end) break;
		else if(step < 0 && r <= end) break;

		var cos = Math.cos(r);
		var sin = Math.sin(r);
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
/**
* 画空心圆弧
*/

var jmHArc = (function () {
	function __constructor(graph,params) {
		if(!params) params = {};
		this.points = params.points || [];
		var style = params.style || {};
		this.initializing(graph.context,style);
		this.graph = graph;
			
		this.center(params.center || {x:0,y:0});
		this.minRadius(params.minRadius || 0);
		this.maxRadius(params.maxRadius || 0);

		this.startAngle(params.start  || 0);
		this.endAngle(params.end  || 0);

		this.width(params.width || 0);
		this.height(params.height  || 0);

		this.anticlockwise(params.anticlockwise  || 0);

		//this.on('PropertyChange',this.initPoints);
		this.base = new jmCircle.prototype.constructor.superClass(graph,params);
	}
	jmUtils.extend(__constructor,jmPath);//jmPath
	return __constructor;
})();

/**
* 初始化图形点
*/
jmHArc.prototype.initPoints = function() {	
	var center = this.center();	
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
			x : cos * minr + center.x,
			y : sin * minr + center.y
		};
		var p2 = {
			x : cos * maxr + center.x,
			y : sin * maxr + center.y
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
* 设定或获取宽度
*/
jmHArc.prototype.center = function(p) {
	return this.setValue('center',p);
}

/**
* 设定或获取内空心圆半径
*/
jmHArc.prototype.minRadius = function(r) {
	return this.setValue('minRadius',r);
}

/**
* 设定或获取外空心圆半径
*/
jmHArc.prototype.maxRadius = function(r) {
	return this.setValue('maxRadius',r);
}

/**
* 设定或获取起启角度
*/
jmHArc.prototype.startAngle = function(a) {
	return this.setValue('startAngle',a);
}

/**
* 设定或获取结束角度
*/
jmHArc.prototype.endAngle = function(a) {
	return this.setValue('endAngle',a);
}

/**
* 设定或获取是否顺时针画
*/
jmHArc.prototype.anticlockwise = function(a) {
	return this.setValue('anticlockwise',a);
}
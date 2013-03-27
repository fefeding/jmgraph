/**
* 画圆
*/

var jmCircle = (function () {
	function __constructor(graph,params) {
		if(!params) params = {};
		this.points = params.points || [];
		var style = params.style || {};
		this.initializing(graph.context,style);
		this.graph = graph;
			
		this.center(params.center || {x:0,y:0});
		this.width(params.width || 0);

		//this.on('PropertyChange',this.initPoints);
		this.height(params.height  || 0);
		this.radius(params.radius  || 0);

		//this.base = new jmCircle.prototype.constructor.superClass(context,params);
	}
	jmUtils.extend(__constructor,jmPath);//继承path图形
	return __constructor;
})();

/**
* 生成中心点
*/
jmCircle.prototype.getCenter = function() {
	var center = this.center();
	var x = center.x;
	var y = center.y;

	if(jmUtils.checkPercent(x)) {
		x = jmUtils.percentToNumber(x);
		if(this.parent && this.parent.bounds) {
			x = this.parent.bounds.width * x;
		}
	}
	if(jmUtils.checkPercent(y)) {
		y = jmUtils.percentToNumber(y);
		if(this.parent && this.parent.bounds) {
			y = this.parent.bounds.height * y;
		}
	}
	return {x:x,y:y};
}

/**
* 初始化图形点
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
	
	var center = this.getCenter();
	var r = this.radius();
	if(!r) {
		r = Math.min(this.width() , this.height()) / 2;
	}
	this.points = [];
	this.points.push({x:center.x - r,y:center.y - r});
	this.points.push({x:center.x + r,y:center.y - r});
	this.points.push({x:center.x + r,y:center.y + r});
	this.points.push({x:center.x - r,y:center.y + r});
}

/**
* 画图
*/
jmCircle.prototype.draw = function() {
	var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;	
	var center = this.getCenter();
	var r = this.radius();
	if(!r) {
		r = Math.min(this.width() , this.height()) / 2;
	}
	this.context.arc(center.x + bounds.left,center.y + bounds.top,r,0,Math.PI * 2);
}

/**
* 获取当前控件的边界

jmCircle.prototype.getBounds = function() {
	this.initPoints();
	return this.base.getBounds.call(this);
}*/

/**
* 设定或获取宽度
*/
jmCircle.prototype.center = function(p) {
	return this.setValue('center',p);
}

/**
* 半径
*/
jmCircle.prototype.radius = function(p) {
	return this.setValue('radius',p);
}


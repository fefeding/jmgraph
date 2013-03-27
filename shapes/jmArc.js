/**
* 画圆弧
*/

var jmArc = (function () {
	function __constructor(graph,params) {
		if(!params) params = {};
		this.points = params.points || [];
		var style = params.style || {};
		this.initializing(graph.context,style);
		this.graph = graph;
			
		this.center(params.center || {x:0,y:0});
		this.radius(params.radius || 0);

		this.startAngle(params.start  || 0);
		this.endAngle(params.end  || Math.PI * 2);

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
* 生成中心点
*/
jmArc.prototype.getCenter = function() {
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
jmArc.prototype.initPoints = function() {
	var mw = this.width() / 2;
	var mh = this.height() / 2;
	var center = this.getCenter();
	var cx = center.x ;//+ bounds.left;
	var cy = center.y ;//+ bounds.top;
	//如果设定了半径。则以半径为主
	var radius = this.radius();	
	if(radius) {
		mw = mh = radius;
	}
	
	var start = this.startAngle();
	var end = this.endAngle();
	var anticlockwise = this.anticlockwise();
	this.points = [];
	//椭圆方程x=a*cos(r) ,y=b*sin(r)
	if(start < end) {
		for(var r=start;r<=end;r += 0.1) {
			var rr = anticlockwise?-r:r;
			var p = {
				x : Math.cos(rr) * mw + cx,
				y : Math.sin(rr) * mh + cy
			};
			this.points.push(p);
		}
	}
	else {
		for(var r=start;r >= end;r -= 0.1) {
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
* 获取当前控件的边界

jmArc.prototype.getBounds = function() {
	this.initPoints();
	return this.base.getBounds.call(this);
}*/

/**
* 获取当前控件的边界

jmArc.prototype.getBounds = function() {
	var rect = {};
	
	var center = this.center();
	var radius = this.radius();

	if(!rect.left) rect.left = center.x - radius; 
	if(!rect.top) rect.top = center.y - radius; 
	if(!rect.right) rect.right = center.x + radius; 
	if(!rect.bottom) rect.bottom = center.y + radius; 
	rect.width = rect.right - rect.left;
	rect.height = rect.bottom - rect.top;
	return rect;
}

*/
/**
* 设定或获取宽度
*/
jmArc.prototype.center = function(p) {
	return this.setValue('center',p);
}

/**
* 设定或获取半径
*/
jmArc.prototype.radius = function(r) {
	return this.setValue('radius',r);
}

/**
* 设定或获取起启角度
*/
jmArc.prototype.startAngle = function(a) {
	return this.setValue('startAngle',a);
}

/**
* 设定或获取结束角度
*/
jmArc.prototype.endAngle = function(a) {
	return this.setValue('endAngle',a);
}

/**
* 设定或获取是否顺时针画
*/
jmArc.prototype.anticlockwise = function(a) {
	return this.setValue('anticlockwise',a);
}



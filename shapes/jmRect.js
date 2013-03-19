/**
* 画矩形
*/

var jmRect = (function () {
	function __constructor(graph,params) {
		if(!params) params = {};
		this.points = params.points || [];
		var style = params.style || {};
		style.close = true;
		this.initializing(graph.context,style);
		this.graph = graph;
		
		this.position(params.position || {x:0,y:0});
		this.width(params.width || 0);
		this.height(params.height  || 0);
		this.radius(params.radius || 0);
	}
	jmUtils.extend(__constructor,jmPath);//jmPath
	return __constructor;
})();

/**
* 获取当前控件的边界
*/
jmRect.prototype.getBounds = function() {
	var rect = {};
	this.initPoints();
	var p = this.position();
	rect.left = p.x; 
	rect.top = p.y; 
	rect.right = p.x + this.width(); 
	rect.bottom = p.y + this.height(); 
	rect.width = rect.right - rect.left;
	rect.height = rect.bottom - rect.top;
	return rect;
}

/**
* 初始化图形点
*/
jmRect.prototype.initPoints = function() {
	var p = this.position();	
	if(p) {		
		var w = this.width();
		var h = this.height();
		var p2 = {x:p.x + w,y:p.y};
		var p3 = {x:p.x + w,y:p.y + h};
		var p4 = {x:p.x,y:p.y + h};
		var r = this.radius() || this.style.radius;
		
		if(r && r < w/2 && r < h/2) {
			var q = Math.PI / 2;
			var arc = new jmArc(this.context,{radius:r,anticlockwise:false});
			arc.center({x:p.x + r,y:p.y+r});
			arc.startAngle(Math.PI);
			arc.endAngle(Math.PI + q);
			var ps1 = arc.initPoints();
			
			//this.points.push({x:p.x + r,y:p.y});

			//this.points.push({x:p2.x - r,y:p2.y});
			arc.center({x:p2.x - r,y:p2.y+r});
			arc.startAngle(Math.PI + q);
			arc.endAngle(Math.PI * 2);
			var ps2 = arc.initPoints();
			
			//this.points.push({x:p3.x,y:p3.y - r});
			arc.center({x:p3.x - r,y:p3.y - r});
			arc.startAngle(0);
			arc.endAngle(q);
			var ps3 = arc.initPoints();
			
			//this.points.push({x:p4.x + r,y:p4.y});
			arc.center({x:p4.x + r,y:p4.y - r});
			arc.startAngle(q);
			arc.endAngle(Math.PI);
			var ps4 = arc.initPoints();
			this.points = ps1.concat(ps2,ps3,ps4);
		}
		else {
			this.points = [];
			this.points.push(p);
			this.points.push(p2);
			this.points.push(p3);
			this.points.push(p4);
		}		
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
* 设定或获取是否顺时针画
*/
jmRect.prototype.position = function(p) {
	return this.setValue('position',p);
}

/**
* 圆角半径
*/
jmRect.prototype.radius = function(r) {
	return this.setValue('radius',r);
}
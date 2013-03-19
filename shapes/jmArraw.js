
/**
* 画箭头
*/

var jmArraw = (function () {
	function __constructor(graph,params) {
		if(!params) params = {};
		this.points = params.points || [];
		var style = params.style || {};
		this.initializing(graph.context,style);
		this.graph = graph;
		
		this.angle(params.angle  || 0);
		this.start(params.start  || 0);
		this.end(params.end  || 0);
		this.offsetX(params.offsetX || 6);
		this.offsetY(params.offsetY || 12);
	}
	jmUtils.extend(__constructor,jmPath);//jmPath
	return __constructor;
})();

/**
* 初始化图形点
*/
jmArraw.prototype.initPoints = function() {	
	var rotate = this.angle();
	var start = this.start();
	var end = this.end();
	if(!end) return;
	//计算箭头指向角度
	if(!rotate) {
		rotate = Math.atan2(end.y - start.y,end.x - start.x);
	}
	this.points = [];
	var offx = this.offsetX();
	var offy = this.offsetY();
	//箭头相对于线的偏移角度
	var r = Math.atan2(offx,offy);
	var r1 = rotate + r;
    var rsin = Math.sin(r1);
    var rcos = Math.cos(r1);
    var sq = Math.sqrt(offx * offx  + offy * offy);
    var ystep = rsin * sq;
    var xstep = rcos * sq;

    this.points.push(end);
    var p1 = {x:end.x - xstep,y:end.y - ystep};
    this.points.push(p1);

    var r2 = rotate - r;
    rsin = Math.sin(r2);
    rcos = Math.cos(r2);
    ystep = rsin * sq;
    xstep = rcos * sq;

    this.points.push(end);
    var p2 = {x:end.x - xstep,y:end.y - ystep};
    this.points.push(p2);
	return this.points;
}


/**
* 控制起始点
*/
jmArraw.prototype.start = function(p) {
	return this.setValue('start',p);
}

/**
* 控制结束点
*/
jmArraw.prototype.end = function(p) {
	return this.setValue('end',p);
}

/**
* 箭头角度
*/
jmArraw.prototype.angle = function(p) {
	return this.setValue('angle',p);
}

/**
* 箭头X偏移量
*/
jmArraw.prototype.offsetX = function(p) {
	return this.setValue('offsetX',p);
}
/**
* 箭头Y偏移量
*/
jmArraw.prototype.offsetY = function(p) {
	return this.setValue('offsetY',p);
}
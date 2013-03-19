/**
* 带箭头的直线
*/

var jmArrowLine = (function() {
	function __constructor(graph,params) {
		if(!params) params = {};
		this.points = params.points || [];
		var style = params.style || {};
		this.initializing(graph.context,style);
		this.graph = graph;
		
		this.start = params.start || (params.start={x:0,y:0});
		this.end = params.end || (params.end={x:0,y:0});
		
		this.line = graph.createShape('line',params) ;
		this.arraw = graph.createShape('arraw',params);
	}
	jmUtils.extend(__constructor,jmPath);//jmPath
	return __constructor;	
})();

/**
* 初始化图形点
*/
jmArrowLine.prototype.initPoints = function() {	
	this.points = this.line.initPoints();
	this.points = this.points.concat(this.arraw.initPoints());
	return this.points;
}
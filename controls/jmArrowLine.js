/**
 * 带箭头的直线,继承jmPath
 *
 * @class jmArrowLine
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 当前画布
 * @param {object} params 生成当前直线的参数对象，(style=当前线条样式,start=直线起始点,end=直线终结点)
 */

var jmArrowLine = (function() {
	function __constructor(graph,params) {
		if(!params) params = {};
		this.points = params.points || [];
		var style = params.style || {};
		this.initializing(graph.context,style);
		this.graph = graph;
		this.type = 'jmArrowLine';
		this.start = params.start || (params.start={x:0,y:0});
		this.end = params.end || (params.end={x:0,y:0});
		
		this.line = graph.createShape('line',params) ;
		this.arraw = graph.createShape('arraw',params);
	}
	jmUtils.extend(__constructor,jmPath);//jmPath
	return __constructor;	
})();

/**
 * 初始化直线和箭头描点
 *
 * @method initPoints
 * @private
 */
jmArrowLine.prototype.initPoints = function() {	
	this.points = this.line.initPoints();
	this.points = this.points.concat(this.arraw.initPoints());
	return this.points;
}
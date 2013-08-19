/**
 * 带箭头的直线,继承jmPath
 *
 * @class jmArrawLine
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 当前画布
 * @param {object} params 生成当前直线的参数对象，(style=当前线条样式,start=直线起始点,end=直线终结点)
 */	
function jmArrawLine(graph,params) {
	if(!params) params = {};
	this.points = params.points || [];
	var style = params.style || {};
	style.lineJoin = 'miter';
	
	this.graph = graph;
	this.type = 'jmArrawLine';
	this.start = params.start || (params.start={x:0,y:0});
	this.end = params.end || (params.end={x:0,y:0});

	this.initializing(graph.context,style);
	
	this.line = graph.createShape('line',params) ;
	this.arraw = graph.createShape('arraw',params);
}
jmUtils.extend(jmArrawLine,jmPath);//jmPath


/**
 * 初始化直线和箭头描点
 *
 * @method initPoints
 * @private
 */
jmArrawLine.prototype.initPoints = function() {	
	this.points = this.line.initPoints();
	if(this.arrawVisible !== false) {
		this.points = this.points.concat(this.arraw.initPoints());
	}
	return this.points;
}


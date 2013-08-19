/**
 * 画棱形
 *
 * @class jmPrismatic
 * @for jmGraph
 * @param {jmGraph} graph 画布
 * @param {object} params 参数 center=棱形中心点，width=棱形宽,height=棱形高
 */

function jmPrismatic(graph,params) {
	if(!params) params = {};
	/**
	 * 当前对象类型名jmPrismatic
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmPrismatic';
	this.points = params.points || [];
	var style = params.style || {};
	
	this.graph = graph;
		
	this.center(params.center || {x:0,y:0});
	this.width(params.width || 0);

	//this.on('PropertyChange',this.initPoints);
	this.height(params.height  || 0);

	this.initializing(graph.context,style);
}
jmUtils.extend(jmPrismatic,jmPath);//继承path图形


/**
 * 初始化图形点
 * 计算棱形顶点
 * 
 * @method initPoints
 * @private
 */
jmPrismatic.prototype.initPoints = function() {
	/*//获取当前控件的绝对位置
	var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
    if(!bounds) bounds = this.parent && this.parent.getAbsoluteBounds?this.parent.getAbsoluteBounds():this.getAbsoluteBounds();
	if(!bounds) bounds= {left:0,top:0,right:0,bottom:0};
*/
	var location = this.getLocation();
	var mw = location.width / 2;
	var mh = location.height / 2;
	
	this.points = [];
	this.points.push({x:location.center.x - mw,y:location.center.y});
	this.points.push({x:location.center.x,y:location.center.y + mh});
	this.points.push({x:location.center.x + mw,y:location.center.y});
	this.points.push({x:location.center.x,y:location.center.y - mh});
}

/**
 * 设定或获取宽度
 *
 * @method center
 * @param {point} p 图形中心点
 * @return {point} 当前中心坐标
 */
jmPrismatic.prototype.center = function(p) {
	return this.setValue('center',p);
}


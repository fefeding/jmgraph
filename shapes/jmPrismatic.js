/**
* 画棱形
*/

var jmPrismatic = (function () {
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

		//this.base = new jmPrismatic.prototype.constructor.superClass(context,params);
	}
	jmUtils.extend(__constructor,jmPath);//继承path图形
	return __constructor;
})();

/**
* 初始化图形点
*/
jmPrismatic.prototype.initPoints = function() {
	/*//获取当前控件的绝对位置
	var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
    if(!bounds) bounds = this.parent && this.parent.getAbsoluteBounds?this.parent.getAbsoluteBounds():this.getAbsoluteBounds();
	if(!bounds) bounds= {left:0,top:0,right:0,bottom:0};
*/
	var mw = this.width() / 2;
	var mh = this.height() / 2;
	var center = this.center();
	var cx = center.x;// + bounds.left;
	var cy = center.y;// + bounds.top;
	
	this.points = [];
	this.points.push({x:cx - mw,y:cy});
	this.points.push({x:cx,y:cy + mh});
	this.points.push({x:cx + mw,y:cy});
	this.points.push({x:cx,y:cy - mh});
}

/**
* 开始画图

jmPrismatic.prototype.draw = function() {
	this.base.draw.call(this);
}
*/
/**
* 设定或获取宽度
*/
jmPrismatic.prototype.center = function(p) {
	return this.setValue('center',p);
}
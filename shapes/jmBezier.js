/**
 * 贝塞尔曲线,继承jmPath
 * N阶，参数points中为控制点
 *
 * @class jmBezier
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 画布
 * @param {object} params 参数
 */

var jmBezier = (function () {
	function __constructor(graph,params) {
		if(!params) params = {};
		/**
		 * 当前对象类型名
		 *
		 * @property type
		 * @type string
		 */
		this.type = 'jmBezier';
		this.points = params.points || [];
		var style = params.style || {};
		this.initializing(graph.context,style);
		this.graph = graph;
		this.cpoints(params.points);
		//this.base = new jmBezier.prototype.constructor.superClass(graph,params);
	}
	jmUtils.extend(__constructor,jmPath);//继承path图形
	return __constructor;
})();

/**
 * 初始化图形点
 *
 * @method initPoints
 * @private
 */
jmBezier.prototype.initPoints = function() {
	//获取当前控件的绝对位置
	//var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
    //if(!bounds) bounds = this.parent && this.parent.getAbsoluteBounds?this.parent.getAbsoluteBounds():this.getAbsoluteBounds();
	
	this.points = [];
	
	var cps = this.cpoints();
	/*var newps = cps;
	if(bounds) {
		newps = [];
		for(var i in cps) {
			if(cps[i]) {
				var np = {x:cps[i].x + bounds.left,y:cps[i].y + bounds.top};
				newps.push(np);	
			}	
		}	
	}*/
	for(var t = 0;t <= 1;t += 0.01) {
		var p = this.getPoint(cps,t);
		this.points.push(p);
	}	
	this.points.push(cps[cps.length - 1]);
}

/**
 * 根据控制点和参数t生成贝塞尔曲线轨迹点
 *
 * @method getPoint
 * @param {array} ps 控制点集合
 * @param {number} t 参数(0-1)
 * @return {array} 所有轨迹点的数组
 */
jmBezier.prototype.getPoint = function(ps,t) {
	if(ps.length == 1) return ps[0];
	if(ps.length == 2) {					
		var p = {};
		p.x = (ps[1].x - ps[0].x) * t + ps[0].x;
		p.y = (ps[1].y - ps[0].y) * t + ps[0].y;
		return p;	
	}
	if(ps.length > 2) {
		var nps = [];
		for(var i = 0;i < ps.length - 1;i++) {
			var p = this.getPoint([ps[i],ps[i+1]],t);
			if(p) nps.push(p);
		}
		return this.getPoint(nps,t);
	}
}

/**
* 获取当前控件的边界

jmBezier.prototype.getBounds = function() {
	this.initPoints();
	return this.base.getBounds.call(this);
}*/

/**
 * 控制点
 *
 * @method cpoints
 * @param {array} p 所有控制点
 * @return {array} 当前控制点集合
 */
jmBezier.prototype.cpoints = function(p) {
	return this.setValue('cpoints',p);
}



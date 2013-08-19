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
 
function jmBezier(graph,params) {
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
	
	this.graph = graph;
	this.cpoints(this.points);
	this.initializing(graph.context,style);
}
jmUtils.extend(jmBezier,jmPath);//继承path图形

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
	return this.points;
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
 * 对控件进行平移
 * 遍历控件所有描点或位置，设置其偏移量。
 *
 * @method offset
 * @param {number} x x轴偏移量
 * @param {number} y y轴偏移量
 * @param {boolean} [trans] 是否传递,监听者可以通过此属性是否决定是否响应移动事件,默认=true
 */
jmBezier.prototype.offset = function(x,y,trans) {	
	var p = this.cpoints();
	if(p) {			
		var len = p.length;
		for(var i=0; i < len;i++) {
			p[i].x += x;
			p[i].y += y;
		}		
		
		//触发控件移动事件	
		this.emit('move',{offsetX:x,offsetY:y,trans:trans});
		this.getLocation(true);	//重置
		this.graph.refresh();
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





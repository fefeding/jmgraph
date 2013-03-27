/**
* 基础路径
* 指定一系列点，画出图形
*/

var jmPath = (function() {	
	function __constructor(graph,params) {
		var style = params && params.style ? params.style : null;
		this.initializing(graph.context,style);
		this.graph = graph;
		this.points = params && params.points ? params.points : [];
	}
	jmUtils.extend(__constructor,jmShape);//继承基础图形
	return __constructor;
})();

/**
* 重写检查坐标是否在区域内
*/
jmPath.prototype.checkPoint = function(p) {	
	var w = this.style['lineWidth'] || 1;

	//如果当前路径不是实心的
	//就只用判断点是否在边上即可	
	if(this.points.length > 2 && (!this.style['fill'] || this.style['stroke'])) {
		var i = 0;
		var count = this.points.length;
		for(var j = i+1; j <= count; j = (++i + 1)) {
			//如果j超出最后一个
			//则当为封闭图形时跟第一点连线处理.否则直接返回false
			if(j == count) {
				if(this.style.close) {
					var r = jmUtils.pointInPolygon(p,[this.points[i],this.points[0]],w);
					if(r) return true;
				}
			} 
			else {
				//判断是否在点i,j连成的线上
				var s = jmUtils.pointInPolygon(p,[this.points[i],this.points[j]],w);
				if(s) return true;
			}			
		}
		//不是封闭的图形，则直接返回
		if(!this.style['fill']) return false;
	}

	var r = jmUtils.pointInPolygon(p,this.points,w);
	return r;
}
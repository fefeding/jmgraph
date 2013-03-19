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
* 开始画控件
*/
jmPath.prototype.beginDraw = function() {
	this.context.beginPath();		
}

/**
* 结束画控件
*/
jmPath.prototype.endDraw = function() {
	//如果当前为封闭路径
	if(this.style.close) {
		this.context.closePath();
	}
	
	if(this.style['fill']) {
		this.context.fill();
	}
	if(this.style['stroke'] || !this.style['fill']) {
		this.context.stroke();
	}		
}

/**
* 开始画图
*/
jmPath.prototype.draw = function() {	
	if(this.points.length > 0) {
		//获取当前控件的绝对位置
		var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
		this.context.moveTo(this.points[0].x + bounds.left,this.points[0].y + bounds.top);
		var len = this.points.length;
		
		for(var i=1; i < len;i++) {
			var p = this.points[i];
			if(p.m) {
				this.context.moveTo(p.x + bounds.left,p.y + bounds.top);
			}
			else {
				this.context.lineTo(p.x+ bounds.left,p.y + bounds.top);
			}			
		}
	}	
}

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
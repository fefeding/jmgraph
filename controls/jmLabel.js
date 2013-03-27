var jmLabel = (function() {
	function __constructor(graph,params) {
		if(!params) params = {};		
		var style = params.style || {};
		style.font = style.font || "15px Arial";
		// 显示不同的 textAlign 值
//ctx.textAlign="start";
//ctx.textAlign="end";
//ctx.textAlign="left";
//ctx.textAlign="center";
//ctx.textAlign="right";
		style.textAlign = style.textAlign || 'left';
		this.initializing(graph.context,style);
		this.graph = graph;
		this.value = params.value;
		this.position(params.position || {x:0,y:0});
		this.width(params.width || 0);
		this.height(params.height  || 0);
	}
	jmUtils.extend(__constructor,jmControl);//jmPath
	return __constructor;	
})();

/**
* 初始化图形点
*/
jmLabel.prototype.initPoints = function() {	
	var p = this.position();
	var w = this.width();
	var h = this.height();
	this.points = [p];
	this.points.push({x:p.x + w,y:p.y});
	this.points.push({x:p.x + w,y:p.y + h});
	this.points.push({x:p.x,y:p.y + h});
	return this.points;
}

/**
* 画字符串
*/
jmLabel.prototype.draw = function() {	
	if(this.value) {
		//获取当前控件的绝对位置
		var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
		var textSize = this.context.measureText(this.value);
		textSize.height = 15;
		if(this.style.font) {
			var sz = this.style.font.match(/\d+/);
			if(sz && Number(sz)) {
				textSize.height = sz;
			}
		}
		var p = this.position();
		var w = this.width();
		var h = this.height();
		var x = p.x + bounds.left;
		var y = p.y + bounds.top + h / 2 + textSize.height / 2;
		switch(this.style.textAlign) {
			case 'right': {
				x += w;
				break;
			}
			case 'center': {
				x += w / 2;
				break;
			}
		}
		if(this.style.fill) {
			if(this.style.maxWidth) {
				this.context.fillText(this.value,x,y,this.style.maxWidth);
			}
			else {
				this.context.fillText(this.value,x,y);
			}
		}
		else {
			if(this.style.maxWidth) {
				this.context.strokeText(this.value,x,y,this.style.maxWidth);
			}
			else {
				this.context.strokeText(this.value,x,y);
			}
		}

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

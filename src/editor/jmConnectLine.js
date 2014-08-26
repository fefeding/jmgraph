/**
 * 二元素之间的连线,继承自jmPath
 * 连线参数:from=起始元素，to=目标元素,value=连线值
 *
 * @class jmConnectLine
 * @for jmEditor
 * @module jmEditor
 * @param {jmGraph} graph 当前画布
 * @param {object} params 连线参数
 */

function jmConnectLine(graph,params) {
	this.graph = graph;
	this.editor = params.editor;
	this.id = params.id;
	this.from = params.from;
	this.to = params.to;
	this.selected = false;
	this.points = params.points || [];
	var style = params.style || {
						stroke:this.editor.defaultStyle.connectLine.stroke,
						lineWidth:this.editor.defaultStyle.connectLine.lineWidth,
						zIndex :1
					};
	this.type = "jmConnectLine";
	//style.fill = 'transparent';
	style.close = false;
	this.initializing(graph.context,style);

	params = jmUtils.extend({
				start:params.from.outPos2,
				end:params.to.inPos					
				},params);
	
	var arrawstyle = jmUtils.clone(params.style);
	arrawstyle.fill = style.stroke;
	params.style = arrawstyle;
	this.arraw = graph.createShape('arraw',params);	
	this.children.add(this.arraw);

	var fontstyle = this.style.fontStyle || this.editor.defaultStyle.font;
	this.label = this.graph.createShape('label',{style:fontstyle});
	//当连线建立时，同时加入标签
	this.on('add',function(obj) {
		obj.children.add(obj.label);
	});
	this.on('beginDraw',function(obj) {
		var bounds = obj.bounds;
		obj.label.width(bounds.width);
		obj.label.height(bounds.height);
	});

	/**
	 * 当前是否为选中状态
	 *
	 * @property selected
	 * @for jmConnectLine
	 */
	this.selected = false;
}

jmUtils.extend(jmConnectLine,jmPath);

/**
 * 初始化图形点,通过元素出口和入口计算最佳连线路径
 *
 * @method initPoints 
 * @for jmConnectLine
 * @return {array} 所有描点集合
 */
jmConnectLine.prototype.initPoints = function() {	
	var start = this.from.pos4;
	var end = this.to.pos2;
	var toposition = this.to.position();
	var frompostion = this.from.position();
	//节点在目标节点左边
	if(frompostion.x + this.from.width() < toposition.x) {
		start = this.from.pos3;
		var offy = toposition.y - frompostion.y - this.from.height();
		//节点在目标节点上边
		if(offy > 0) {
			if(offy > 30) {
				start = this.from.pos4;
			}
			else {
				start = this.from.pos3;
			}
			end = this.to.pos2;
		}
		//目标节点在起始节点上边
		else if(frompostion.y > toposition.y + this.to.height()) {
			end = this.to.pos4;
		}
		else {
			end = this.to.pos1;
		}		
	}
	//如果起始在结束右边
	else if(frompostion.x > toposition.x + this.to.width()) {	
		start = this.from.pos1;	
		var offy = toposition.y - frompostion.y - this.from.height();
		if(offy > 0) {
			if(offy > 30) {
				start = this.from.pos4;
			}
			else {
				start = this.from.pos1;
			}
			end = this.to.pos2;
		}
		else if(frompostion.y > toposition.y + this.to.height()) {			
			end = this.to.pos4;
		}
		else {
			end = this.to.pos3;
		}	
		
	}
	else if(frompostion.y > toposition.y + this.to.height()) {
		start = this.from.pos1;
		end = this.to.pos1;
	}
	
	this.points =this.getPoints(start,end);
	return this.points;
}

/**
 * 给定开始点与结束点，计算连线路径
 *
 * @method getPoints
 * @for jmConnectLine
 * @private
 */
jmConnectLine.prototype.getPoints = function(start,end) {
	//获取二点的方位，1=left,2=top,3=right,=bottom	
	function getDirection(s,e) {
		if(s.x == e.x) {
			return s.y > e.y?4:2;//垂直方向
		}
		if(s.y == e.y) {
			return s.x > e.x?3:1;//水平方向
		}
		if(s.x > e.x) {
			return s.y > e.y?3412:3214;//起始点x,y都大于结束点则为左上右下
		}
		else {
			return s.y > e.y?1432:1234;//起始点X小于结束点，Y大于结束点则为右下右上
		}
	}	
	var xOffset = 30;
	var yOffset = 30;
	var points = [start];
	if(start == this.from.pos1) {
		switch (end) {
			case this.to.pos1 : {
				var p1x = Math.min(start.x - xOffset,end.x - xOffset);
				var p1 = {x:p1x,y:start.y};
				points.push(p1);
				var p2 = {x:p1x,y:end.y};
				points.push(p2);
				break;
			}
			case this.to.pos2 : {	
				var p1 = {x:end.x,y:start.y};
				points.push(p1);			
				break;
			}
			case this.to.pos3 : {
				var p1 = {x:(start.x - end.x)/2 + end.x,y:start.y};
				points.push(p1);
				var p2 = {x:p1.x,y:end.y};
				points.push(p2);
				break;
			}
			case this.to.pos4 : {
				var p1 = {x:end.x,y:start.y};
				points.push(p1);
				break;
			}
		}
	}
	else if(start == this.from.pos2) {
		switch (end) {
			case this.to.pos1 : {				
				var p1 = {x:start.x,y:end.y};
				points.push(p1);
				break;
			}
			case this.to.pos2 : {	
				var p1 = {x:start.x,y:Math.min(start.y - yOffset,end.y - yOffset)};
				points.push(p1);			
				break;
			}
			case this.to.pos3 : {
				var p1 = {x:start.x,y:end.y};
				points.push(p1);
				break;
			}
			case this.to.pos4 : {
				var p1 = {x:start.x,y:(start.y - end.y) / 2 + end.y};
				points.push(p1);
				var p2 = {x:end.x,y:p1.y};
				points.push(p2);
				break;
			}
		}
	}
	else if(start == this.from.pos3) {
		switch (end) {
			case this.to.pos1 : {				
				var p1 = {x:(end.x - start.x) / 2 + start.x,y:start.y};
				points.push(p1);
				var p2 = {x:p1.x,y:end.y};
				points.push(p2);
				break;
			}
			case this.to.pos2 : {	
				var p1 = {x:end.x,y:start.y};
				points.push(p1);			
				break;
			}
			case this.to.pos3 : {
				var p1 = {x:Math.max(start.x + xOffset,end.x + xOffset),y:start.y};
				points.push(p1);
				var p2 = {x:p1.x,y:end.y};
				points.push(p2);
				break;
			}
			case this.to.pos4 : {
				var p1 = {x:end.x,y:start.y};
				points.push(p1);
				break;
			}
		}
	}
	else if(start == this.from.pos4) {
		switch (end) {
			case this.to.pos1 : {				
				var p1 = {x:start.x,y:end.y};
				points.push(p1);		
				break;
			}
			case this.to.pos2 : {	
				var p1 = {x:start.x,y:Math.max((end.y - start.y) / 2 + start.y,end.y - yOffset)};
				points.push(p1);	
				var p2 = {x:end.x,y:p1.y};
				points.push(p2);	
				break;
			}
			case this.to.pos3 : {
				var p1 = {x:start.x,y:end.y};
				points.push(p1);
				break;
			}
			case this.to.pos4 : {
				var p1 = {x:start.x,y:Math.max(start.y + xOffset,end.y + xOffset)};
				points.push(p1);
				var p2 = {x:end.x,y:p1.y};
				points.push(p2);
				break;
			}
		}
	}
	points.push(end);

	var from = jmUtils.clone(points[points.length - 2]);
	var to = jmUtils.clone(end);
	var minx;
	var miny;
	for(var i=0;i<points.length;i++) {
		var p = points[i];
		minx = Math.min(minx || p.x,p.x);
		miny = Math.min(miny || p.y,p.y);
	}
	from.x -= minx;
	to.x -= minx;
	from.y -= miny;
	to.y -= miny;
	this.arraw.start(from);    
    this.arraw.end(to);
    this.arraw.style.stroke = this.arraw.style.fill = this.style.stroke;
    //实心箭头
	//points = points.concat(this.arraw.initPoints(false));
	return points;
}

/**
 * 选择当前连线
 *
 * @method value
 * @for jmConnectLine
 * @return {string} 当前连线的值
 */
jmConnectLine.prototype.select = function(b) {
	if(typeof b !== 'undefined') {
		var changed = false;
		if(b && this.selected == false) {
			this.style.stroke = this.style && this.style.selectedStroke?this.style.selectedStroke:this.editor.defaultStyle.connectLine.overStroke;
			this.style.zIndex = 10;
			this.selected = true;
			changed = true;
		}		
		else if(this.selected == true) {
			this.style.stroke = this.style && this.style.normalStroke?this.style.normalStroke:this.editor.defaultStyle.connectLine.stroke;
			this.style.zIndex = 1;
			this.selected = false;
			changed = true;
		}
		if(changed) {
			this.editor.emit('select',this,b);
			this.graph.refresh();
		}
		
	}
}

/**
 * 当前连线标签值
 *
 * @method value
 * @for jmConnectLine
 * @return {string} 当前连线的值
 */
jmConnectLine.prototype.value = function(v) {
	if(typeof v !== 'undefined') this.label.value = v;
	return this.label.value;
}

/**
 * 移除当前连线
 *
 * @method remove
 * @for jmConnectLine
 */
jmConnectLine.prototype.remove = function(r) {
	if(r) return;
	//从起始元素中移除
	if(this.from) {
		this.from.connects.remove(this);
	}
	//从目标元素中移除
	if(this.to) {
		this.to.connects.remove(this);
	}
	if(this.editor) {
		this.editor.connects.remove(this);
	}
	//从编辑器中移除
	this.graph.children.remove(this);
}
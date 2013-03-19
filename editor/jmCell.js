
/**
* 流程编辑器单元
*/
var jmCell = (function () {
	function __constructor(option) {
		option.padding = option.padding || {left:8,top:8,right:8,bottom:8};
		this.option = option;
		this.position = option.position || (option.position = {x:0,y:0});		
		this.resizable = option.resizable === false?false:true;
		
		this.graph = option.graph;
		this.editor = option.editor;
		this.style = this.editor.styles[option.style] || option.style;
		if(typeof this.style.resizable != 'undefined') this.resizable = this.style.resizable;		
	}
	return __constructor;
})();

/**
* 生成节点元素
*/
jmCell.prototype.create = function() {
	this.connects = new jmUtils.list();
	this.rect = this.graph.createShape('rect',{
				position:this.option.position,
				width:this.option.width,
				height:this.option.height,
				style:{
					stroke:'transparent',
					fill:'transparent',
					close:true,
					zIndex:100
				}});
	
	var w = this.option.width;
	var h = this.option.height;
	this.center = {x:w / 2,y:h / 2};
	
	if(this.option.shape) {	
		var params = jmUtils.extend({
			style:this.style,
			width:w,
			height:h,
			center:this.center,
			position:{x:this.option.padding.left || 0,y:this.option.padding.top || 0}
		},this.option);
		this.shape = this.graph.createShape(this.option.shape,params);		
	}

	//创建连线拉动点
	var centerArcSzie = 8;
	var bg = this.graph.createRadialGradient(centerArcSzie / 2,centerArcSzie / 2,0,centerArcSzie / 2,centerArcSzie / 2,centerArcSzie);
		bg.addStop(0,'rgb(0,255,0)');
		bg.addStop(1,'rgb(5,149,5)');		

	this.connArc = this.graph.createShape('circle',{
		center:jmUtils.clone(this.center),
		start:0,
		end:Math.PI * 2,
		width:centerArcSzie,
		height:centerArcSzie,
		radius:centerArcSzie,
		style:{
			fill:bg,
			close:true,
			zIndex:200
		}});
	this.connArc.visible = false;	
	//带箭头的连线，用来拖动连接对象
	this.connectLine = new jmArrowLine(this.graph,{start:this.center,end:this.connArc.center(),
		style:{
			stroke:'rgb(59,111,41)',
			lineWidth:1,
			lineType: "dotted",
			dashLength :6,
			zIndex:300
		}});
	this.connectLine.visible = false;
	this.rect.children.add(this.connectLine);

	this.resizeRects = [];
	if(this.resizable) {
		for(var i = 0;i<8;i++) {
			//生成改变大小方块
			var r = this.graph.createShape('rect',{
					position:{x:-5,y:-5},
					width:10,
					height:10,
					style:{
						stroke:'transparent',
						fill:'transparent',
						close:true,
						zIndex:100
					}});
			r.index = i;
			this.resizeRects.push(r);	
			this.rect.children.add(r);
		}	
	}	
}

/**
* 添加当前元素到画布中
*/
jmCell.prototype.add = function() {
	this.create();
	this.graph.children.add(this.rect);
	this.rect.canMove(true);
	var rectCursors = ['w-resize','nw-resize','n-resize','ne-resize','e-resize','se-resize','s-resize','sw-resize'];
	var _this = this;
	var minSize = 20;
	for(var i in this.resizeRects) {
		this.resizeRects[i].canMove(true);
		this.resizeRects[i].on('move',function(arg) {
			if(this.index == 0) {				
				var w = _this.rect.width() - arg.offsetX;
				if(w > minSize) {
					_this.rect.width(w);
					_this.option.position.x += arg.offsetX;
				}				
			}
			else if(this.index == 1) {
				var w = _this.rect.width() - arg.offsetX;
				if(w > minSize) {
					_this.rect.width(w);
					_this.option.position.x += arg.offsetX;
				}
				var h = _this.rect.height() - arg.offsetY;
				if(h > minSize) {
					_this.rect.height(h);
					_this.option.position.y += arg.offsetY;
				}			
			}
			else if(this.index == 2) {				
				var h = _this.rect.height() - arg.offsetY;
				if(h > minSize) {
					_this.rect.height(h);
					_this.option.position.y += arg.offsetY;
				}			
			}
			else if(this.index == 3) {
				var w = _this.rect.width() + arg.offsetX;
				if(w > minSize) {
					_this.rect.width(w);
				}
				var h = _this.rect.height() - arg.offsetY;
				if(h > minSize) {
					_this.rect.height(h);
					_this.option.position.y += arg.offsetY;
				}			
			}
			else if(this.index == 4) {
				var w = _this.rect.width() + arg.offsetX;
				if(w > minSize) {
					_this.rect.width(w);
				}					
			}
			else if(this.index == 5) {
				var w = _this.rect.width() + arg.offsetX;
				if(w > minSize) {
					_this.rect.width(w);
				}
				var h = _this.rect.height() + arg.offsetY;
				if(h > minSize) {
					_this.rect.height(h);
				}			
			}
			else if(this.index == 6) {
				var h = _this.rect.height() + arg.offsetY;
				if(h > minSize) {
					_this.rect.height(h);
				}			
			}
			else if(this.index == 7) {
				var w = _this.rect.width() - arg.offsetX;
				if(w > minSize) {
					_this.rect.width(w);
					_this.option.position.x += arg.offsetX;
				}
				var h = _this.rect.height() + arg.offsetY;
				if(h > minSize) {
					_this.rect.height(h);
				}			
			}			
			_this.resize();
		});
		//鼠标指针
		this.resizeRects[i].bind('mousemove',function() {
			this.cursor(rectCursors[this.index]);
		});
		this.resizeRects[i].bind('mouseleave',function() {
			this.cursor('default');
		});
	}
	if(this.shape) this.rect.children.add(this.shape);	
	
	//当有连线拉到当前元素上时，连接这二个元素
	this.rect.bind('mouseup',function() {
		var from = _this.editor.connectFrom;
		if(from) {
			if(from != _this) {
				from.connect(_this);//连接二个节点
			}			
			_this.editor.connectFrom = null;
		}
	});
	//选择当前节点
	this.rect.bind('mousedown',function() {
		if(!_this.editor.connectFrom) {
			//选择当前节点
			_this.editor.selectAll(false);
			_this.select(true);
			return false;//阻断事件冒泡，防止消选
		}		
	});
	this.rect.on('move',function(args) {
		_this.initPosition();//重新定位
	});
	this.rect.bind('mousemove',function() {		
		_this.connArc.visible = true;	
		_this.graph.refresh();			
	});
	this.rect.bind('mouseleave',function() {
		if(!_this.editor.connectFrom) {
			_this.connArc.visible = false;
			_this.graph.refresh();
		}		
	});
	
	this.rect.children.add(this.connArc);	
	this.connArc.canMove(true);
	//开始移动连线
	this.connArc.on('movestart',function(args) {
		_this.editor.connectFrom = _this;
		_this.connectLine.visible = true;
	});
	//结束移动时归位
	this.connArc.on('moveend',function(args) {
		var arccenter = _this.connArc.center();
		arccenter.x = _this.center.x;
		arccenter.y = _this.center.y;
		_this.editor.connectFrom = null;
		_this.connectLine.visible = false;
		_this.connArc.visible = false;
		_this.graph.refresh();
	});
	this.resize();
}

/**
* 大小改变
*/
jmCell.prototype.resize = function() {
	var w = this.rect.width();
	var h = this.rect.height();	
	if(this.option.padding) {
		w = w - (this.option.padding.left || 0) - (this.option.padding.right || 0);
		h = h - (this.option.padding.top || 0) - (this.option.padding.bottom || 0);
		this.center.x = w/2 + (this.option.padding.left || 0);
		this.center.y = h/2 + (this.option.padding.top || 0);
	}
	else {
		this.center.x = w / 2;
		this.center.y = h / 2;
	}
	this.connArc.center().x = this.center.x;
	this.connArc.center().y = this.center.y;
	if(this.shape) {
		this.shape.width(w);
		this.shape.height(h);
	}
	this.initPosition();
}

/**
* 重新初始化各位置
*/
jmCell.prototype.initPosition = function() {

	//定义四个线路口
	if(!this.pos1) this.pos1 = {};
	this.pos1.x = this.option.position.x;
	this.pos1.y = this.option.position.y + this.rect.height() / 2;

	if(!this.pos2) this.pos2 = {};
	this.pos2.x = this.option.position.x + this.rect.width() / 2;
	this.pos2.y = this.option.position.y;

	if(!this.pos3) this.pos3 = {};
	this.pos3.x = this.option.position.x + this.rect.width();
	this.pos3.y = this.pos1.y;

	if(!this.pos4) this.pos4 = {};
	this.pos4.x = this.pos2.x;
	this.pos4.y = this.option.position.y + this.rect.height();
	
	if(this.resizeRects && this.resizeRects.length > 7) {
		this.resizeRects[0].position().x = -5;
		this.resizeRects[0].position().y = this.rect.height() / 2 - 5; 
		this.resizeRects[1].position().x = -5;
		this.resizeRects[1].position().y = -5; 
		this.resizeRects[2].position().x = this.rect.width() / 2 - 5;
		this.resizeRects[2].position().y = -5; 
		this.resizeRects[3].position().x = this.rect.width() - 5;
		this.resizeRects[3].position().y = -5; 
		this.resizeRects[4].position().x = this.resizeRects[3].position().x;
		this.resizeRects[4].position().y = this.resizeRects[0].position().y; 
		this.resizeRects[5].position().x = this.resizeRects[4].position().x;
		this.resizeRects[5].position().y = this.rect.height() - 5; 
		this.resizeRects[6].position().x = this.resizeRects[2].position().x;
		this.resizeRects[6].position().y = this.resizeRects[5].position().y; 
		this.resizeRects[7].position().x = -5;
		this.resizeRects[7].position().y = this.resizeRects[5].position().y;
	}
}

/**
* 选择当前节点
*/
jmCell.prototype.select = function(b) {
	if(b === false) {
		this.rect.style.stroke = 'transparent';		
		this.selected = false;		
	}
	else {
		this.rect.style.stroke = 'rgb(0,255,0)';
		this.selected = true;		
	}
	for(var i in this.resizeRects) {
		this.resizeRects[i].visible = b !== false;
		this.resizeRects[i].style.stroke = this.resizeRects[i].visible ?'rgb(0,255,0)':'transparent';
	}
	this.graph.refresh();
}

/**
* 连接到目标节点
*/
jmCell.prototype.connect = function(to) {
	//查找相同的连线，如果存在则不重连
	var line  = this.connects.get(function(l) {
		return (l.from == this && l.to == to);
	});
	if(!line) {
		line = this.graph.createShape('cellConnectLine',{from:this,to:to});	
		this.connects.add(line);
		this.graph.children.add(line);

		line.bind('mouseover',function() {
			this.style.stroke = 'red';
			this.style.zIndex = 200;
			this.graph.refresh();
		});
		line.bind('mouseleave',function() {
			this.style.stroke = 'rgb(59,255,41)';
			this.style.zIndex = 1;
			this.graph.refresh();
		});
	}
}

/**
* 二元素之间的连线
*/
var jmConnectLine = (function() { 
	function __constructor(graph,params) {
		this.graph = graph;
		this.from = params.from;
		this.to = params.to;
		this.points = params.points || [];
		var style = params.style || {
							stroke:'rgb(59,255,41)',
							lineWidth:2,
							zIndex :1
						};

		this.initializing(graph.context,style);

		params = jmUtils.extend({
					start:params.from.outPos2,
					end:params.to.inPos					
					},params);
		
		this.arraw = graph.createShape('arraw',params);		
	}
	jmUtils.extend(__constructor,jmPath);
	return __constructor;
})();

/**
* 初始化图形点
*/
jmConnectLine.prototype.initPoints = function() {
	
	var start = this.from.pos4;
	var end = this.to.pos2;
	//节点在目标节点左边
	if(this.from.position.x + this.from.rect.width() < this.to.position.x) {
		start = this.from.pos3;
		//节点在目标节点上边
		if(this.from.position.y + this.from.rect.height() < this.to.position.y) {
			end = this.to.pos2;
		}
		else if(this.from.position.y > this.to.position.y + this.to.rect.height()) {
			end = this.to.pos4;
		}
		else {
			end = this.to.pos1;
		}		
	}
	else if(this.from.position.x > this.to.position.x + this.to.rect.width()) {
		start = this.from.pos1;
		if(this.from.position.y + this.from.rect.height() < this.to.position.y) {
			end = this.to.pos2;
		}
		else if(this.from.position.y > this.to.position.y + this.to.rect.height()) {
			end = this.to.pos4;
		}
		else {
			end = this.to.pos3;
		}	
		
	}
	else if(this.from.position.y > this.to.position.y + this.to.rect.height()) {
		start = this.from.pos2;
		end = this.to.pos4;
	}
	
	this.points =this.getPoints(start,end);  
	return this.points;
}

/**
* 给定开始点与结束点，计算连线路径
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
	var pointOffset = 20;
	var points = [start];
	if(start == this.from.pos1) {
		switch (end) {
			case this.to.pos1 : {
				var p1x = Math.min(start.x - pointOffset,end.x - pointOffset);
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
				var p1 = {x:start.x,y:Math.min(start.y - pointOffset,end.y - pointOffset)};
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
				var p1 = {x:Math.max(start.x + pointOffset,end.x + pointOffset),y:start.y};
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
				var p1 = {x:start.x,y:(end.y - start.y) / 2 + start.y};
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
				var p1 = {x:start.x,y:Math.max(start.y + pointOffset,end.y + pointOffset)};
				points.push(p1);
				var p2 = {x:end.x,y:p1.y};
				points.push(p2);
				break;
			}
		}
	}
	points.push(end);
	this.arraw.start(points[points.length - 2]);    
    this.arraw.end(end);
	points = points.concat(this.arraw.initPoints());
	return points;
}
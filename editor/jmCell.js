
/**
 * 流程编辑器单元,继承自jmControl
 * 参数说明:resizable=是否可改变大小，connectable=是否可连线,value =当前显示字符串,position=单元位置,editor=当前单元所属编辑器,graph=画布,style=样式对象或名称
 * 
 * @class jmCell
 * @for jmEditor
 * @module jmEditor
 * @param {object} option 参数
 */
var jmCell = (function () {
	function __constructor(option) {		
		this.option = option;			
		this.type = 'jmCell';
		this.value(option.value || '');
		this.graph = option.graph;
		this.editor = option.editor;		
		this.styleName = option.style;		
		this.setStyle(this.styleName);
		option.position = option.position || {x:0,y:0};

		//如果从样式中取大小，则重新定位
		if(option.width) {
			this.width(option.width);
		}
		else if(this.style.width) {
			this.width(this.style.width);
			option.position.x -= this.style.width / 2;
		}
		if(option.height) {
			this.height(option.height);
		}
		else if(this.style.height) {
			this.height(this.style.height);
			option.position.y -= this.style.height / 2;
		}
		this.position(option.position);	

		/**
		 * 当前元素是否已被选择
		 *
		 * @property selected
		 * @type boolean
		 */
		this.selected = false;
		this.initializing(this.graph.context,this.style);
		//已option参数为准
		if(typeof option.resizable != 'undefined') {
			this.resizable = option.resizable;
		}
		if(typeof option.connectable != 'undefined') {
			this.connectable = option.connectable;
		}
		else {
			this.connectable = this.editor.connectable;
		}		
	}
	jmUtils.extend(__constructor,jmControl);//继承属性绑定
	return __constructor;
})();

/**
 * 初始化当前元素样式
 *
 * @method setStyle
 * @for jmCell
 * @param {object} style 样式
 */
jmCell.prototype.setStyle = function(style) {
	if(style) {
		var mpstyle = this.editor.styles[style]
		 if(mpstyle) {
		 	this.styleName = style;
		 	this.style = jmUtils.clone(mpstyle);
		 }
		 else {
		 	this.style = jmUtils.clone(style);
		 	mpstyle = style;
		 }
		if(typeof this.style.resizable != 'undefined') {
			this.resizable = this.style.resizable;	
		}
		this.style.zIndex = this.style.zIndex || 1000;
		this.fontStyle = mpstyle.fontStyle || jmEditorDefaultStyle.font;
		this.style.padding = this.style.padding || {left:8,top:8,right:8,bottom:8};
		if(this.label) {
			this.label.style = this.fontStyle;
		}
		if(this.shape) {
			mpstyle.zIndex = 0;
			this.shape.style = mpstyle;
		}
	}	
}

/**
 * 生成节点元素
 * 并生成基础子控件,包括图形，边界，拖放标识和连线等
 *
 * @method create
 * @for jmCell
 * @private
 */
jmCell.prototype.create = function() {
	this.connects = new jmUtils.list();
	var w = this.width();
	var h = this.height();
	this.center = {x:w / 2,y:h / 2};
	var borderStyle;
	if(this.style.borderStyle) {
		borderStyle = this.style.borderStyle;
	}
	else {
		borderStyle = {
					stroke:this.style.borderStroke || jmEditorDefaultStyle.cellBorder.stroke,
					fill:'transparent',
					//大小改变拖放边框样式
					rectStroke:this.style.borderStroke || jmEditorDefaultStyle.cellBorder.stroke,
					close:true
				};
	}
	this.rect = this.graph.createShape('resize',{
				width:w,
				height:h,
				movable:false,
				resizable:this.resizable,
				style:borderStyle});

	this.rect.visible = false;
	var shape = this.option.shape || this.style.shape;
	if(shape) {	
		var params = jmUtils.extend({
			style:this.style,
			width:'90%',
			height:'90%',
			center:this.center,
			position:{x:'5%',y:'5%'}
		},this.option);
		this.shape = this.graph.createShape(shape,params);		
	}

	if(this.connectable) {
		//创建连线拉动点
		var centerArcSzie = 8;
		var bg = this.graph.createRadialGradient(centerArcSzie / 2,centerArcSzie / 2,0,centerArcSzie / 2,centerArcSzie / 2,centerArcSzie);
			bg.addStop(0,'rgb(0,255,0)');
			bg.addStop(1,'rgb(5,149,5)');		
		//连接拖动圆点
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
			style:jmEditorDefaultStyle.dragLine});

		this.connectLine.visible = false;	
		this.children.add(this.connectLine);
	}
	
	//当前节点字符串为示控件
	this.label = this.graph.createShape('label',{
		style:this.fontStyle,
		width:'100%',
		height:'100%',
		value : this.value()
	});
	this.setStyle(this.styleName);	
}

/**
 * 添加当前元素到画布中
 *
 * @method add
 * @for jmCell
 */
jmCell.prototype.add = function() {
	this.create();
	this.children.add(this.rect);	
	this.graph.children.add(this);
	//如果可以移动
	if(this.editor.movable) {
		this.canMove(true);
	}
	
	if(this.shape) this.children.add(this.shape);	
	
	if(this.connectable) {
		//当有连线拉到当前元素上时，连接这二个元素
		this.bind('mouseup',function() {
			var from = this.editor.connectFrom;
			if(from) {
				if(from != this) {
					from.connect(this);//连接二个节点
					this.editor.save();//保存状态
				}			
				this.editor.connectFrom = null;
				//return false;
			}
		});
		this.bind('mousemove',function() {
			this.connArc.visible = true;	
			this.graph.refresh();			
		});
		this.bind('mouseleave',function() {		
			if(!this.editor.connectFrom) {
				this.connArc.visible = false;
				this.graph.refresh();
			}		
		});
		
		this.children.add(this.connArc);	
		this.connArc.canMove(true);
		//开始移动连线
		this.connArc.on('movestart',function(args) {
			var _this = self;
			_this.editor.connectFrom = _this;
			_this.connectLine.visible = true;
		});
		//结束移动时归位
		this.connArc.on('moveend',function(args) {
			var _this = self;
			var arccenter = _this.connArc.center();
			arccenter.x = _this.center.x;
			arccenter.y = _this.center.y;
			_this.editor.connectFrom = null;
			_this.connectLine.visible = false;
			_this.connArc.visible = false;
			_this.graph.refresh();
		});
	}
	
	//选择当前节点
	this.bind('mousedown',function(evt) {
		if(!this.editor.connectFrom) {
			if(!evt.ctrlKey) {//如果没有按下ctrl健则取消其它的选择
				//选择当前节点
				this.editor.selectAll(false,this.id);
			}			
			this.select(true);
			return false;//阻断事件冒泡，防止消选
		}		
	});

	//如果当前节点被移动，则重新定位子元素
	this.on('move',function(args) {
		self.initPosition();//重新定位
	});	

	this.children.add(this.label);	
	this.resize();

	//监听大小改变
	var self = this;
	this.rect.on('resize',function(px,py,dx,dy) {
		var _this = self;
		_this.position().x += px;
		_this.position().y += py;
		var w = _this.width() + dx;
		var h = _this.height() + dy;
		_this.width(w);
		_this.height(h);
		_this.resize();
	});
}

/**
* 设置一个标识
* 例如用来做状态标识等
*
* @method setOverlay
* @param {string} src 图片地址
* @param {number} w 图片宽
* @param {nubmer} h 图片高度
* @param {string} tooltip 标识信息描述
*/
jmCell.prototype.setOverlay = function(src,w,h,tooltip) {
	if(!this.overlay) {
		/*this.overlay = this.graph.createShape('img',
			{style:this.style,position:{x:this.width(),y:this.height()},image:src,width:0});
		this.children.add(this.overlay);*/

		this.overlay = document.createElement('img');
		this.overlay.style.position = 'absolute';
		var bounds = this.getAbsoluteBounds();
		var graphpostion = this.graph.getPosition();
		this.overlay.style.top = (graphpostion.top + bounds.bottom) + 'px';
		this.overlay.style.left = (graphpostion.left + bounds.right)+ 'px';
		this.overlay.style.border = '0';
		document.body.appendChild(this.overlay);
	}
	if(src) {
		this.overlay.src = src;
		this.overlay.width = w;
		this.overlay.height = h;
		this.overlay.title = tooltip;
		/*this.overlay.width(w);
		this.overlay.height(h);		
		this.overlay.image(src).title = tooltip;
		this.overlay.visible = true;*/
	}
	else {
		this.overlay.visible = false;
	}
	return this.overlay;
}

/**
 * 大小改变事件
 * 重置各元素大小和位置
 *
 * @method resize
 * @for jmCell
 * @private
 */
jmCell.prototype.resize = function() {
	var w = this.width();
	var h = this.height();	

	var center = this.center;
	//如果设有padding
	//则计算大小减去padding大小
	if(this.style.padding) {
		w = w - (this.style.padding.left || 0) - (this.style.padding.right || 0);
		h = h - (this.style.padding.top || 0) - (this.style.padding.bottom || 0);
		center.x = w/2 + (this.style.padding.left || 0);
		center.y = h/2 + (this.style.padding.top || 0);
	}
	else {
		center.x = w / 2;
		center.y = h / 2;
	}
	if(this.connArc) {
		this.connArc.center().x = center.x;
		this.connArc.center().y = center.y;
	}
	this.initPosition();
}

/**
 * 重新初始化各位置
 * 
 * @method initPosition
 * @for jmCell
 * @private
 */
jmCell.prototype.initPosition = function() {

	var p = this.position();
	//定义四个线路口
	if(!this.pos1) this.pos1 = {};
	this.pos1.x = p.x;
	this.pos1.y = p.y + this.height() / 2;

	if(!this.pos2) this.pos2 = {};
	this.pos2.x = p.x + this.width() / 2;
	this.pos2.y = p.y;

	if(!this.pos3) this.pos3 = {};
	this.pos3.x = p.x + this.width();
	this.pos3.y = this.pos1.y;

	if(!this.pos4) this.pos4 = {};
	this.pos4.x = this.pos2.x;
	this.pos4.y = p.y + this.height();

	this.rect.width(this.width());
	this.rect.height(this.height());
	
	//如果已设定标识信息，则定位
	if(this.overlay) {
		if(this.overlay.tagName == 'IMG') {
			var bounds = this.getAbsoluteBounds();
			var graphpostion = this.graph.getPosition();
			this.overlay.style.top = (graphpostion.top + bounds.bottom) + 'px';
			this.overlay.style.left = (graphpostion.left + bounds.right)+ 'px';			
		}
		else {
			var op = this.overlay.position();
			op.x = this.width();
			op.y = this.height();
		}
	}
}

/**
 * 选择当前节点
 *
 * @method select
 * @for jmCell
 * @param {boolean} b 选择或消选当前元素
 * @return {boolean} 是否被选择
 */
jmCell.prototype.select = function(b) {
	var changed = false;//是否改变了选择状态
	if(b === false && this.selected === true) {
		//this.rect.style.stroke = 'transparent';	
		this.rect.visible = false;	
		this.selected = false;	
		changed = true;	
	}
	else if(b === true && !this.selected) {
		this.selected = true;	
		this.rect.visible = true;	
		changed = true;		
	}
	if(changed) {		
		this.graph.refresh();
		//触发选择事件
		this.emit('select',this.selected);
	}	
}

/**
 * 连接到目标节点
 * 
 * @method connect
 * @for jmCell
 * @param {jmCell} to 要连接到的元素
 * @param {number} id 指定当前连线的id
 * @param {string} [value] 当前连线显示的字符值
 */
jmCell.prototype.connect = function(to,id,value) {
	//查找相同的连线，如果存在则不重连
	var line  = this.connects.get(function(l) {
		return (l.from == this && l.to == to);
	});
	if(!line) {
		id = id || this.editor.maxId();
		line = this.graph.createShape('cellConnectLine',{
			id:id,
			from:this,
			to:to,
			style:jmUtils.clone(this.style.connectLine),
			editor:this.editor
		});	
		
		this.connects.add(line);
		to.connects.add(line);
		line.value(value);
		this.graph.children.add(line);
		this.editor.connects.add(line);//记录到编辑器中

		//连线鼠标进入控件
		line.bind('mouseover',function() {	
			if(!this.selected)	 {
				var overstroke = this.style && this.style.overStroke?this.style.overStroke:jmEditorDefaultStyle.connectLine.overStroke;
				this.style.stroke = overstroke;
				this.style.zIndex = 2000;
				this.graph.refresh();
			}			
		});
		//连线鼠标离开控件
		line.bind('mouseleave',function() {
			if(!this.selected) {
				var stroke = this.style && this.style.normalStroke?this.style.normalStroke:jmEditorDefaultStyle.connectLine.stroke;
				this.style.stroke = stroke;
				this.style.zIndex = 1;
				this.graph.refresh();
			}			
		});
		//当按下鼠标时选择当前线
		line.bind('mousedown',function() {	
			this.editor.selectAll(false);
			this.select(!this.selected);			
			return false;
		});
	}
}

/**
 * 返回或设置当前元素的值 
 *
 * @method value
 * @for jmCell
 * @param {string} [v] 元素显示的值
 * @return {string} 当前的值
 */
jmCell.prototype.value = function(v) {
	if(typeof v !== 'undefined') {
		if(this.label) {
			this.label.value = v;
		}
		return this.setValue('value',v);
	}
	return this.getValue('value');
}

/**
 * 设定或获取中心点
 * 
 * @method center
 * @for jmHArc
 * @param {point} p 中心点坐标
 * @return {point} 当前中心点坐标
 */
jmCell.prototype.center = function(p) {
	return this.setValue('center',p);
}

/**
 * 从编辑器中移除当前节点
 *
 * @method remove
 * @for jmCell
 */
jmCell.prototype.remove = function() {
	if(this.editor) {
		this.editor.cells.remove(this);	
		this.graph.children.remove(this);	
	}
	//并移除它的连线
	this.connects.each(function(i,c) {
		c.remove();	
	},true);
}

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
var jmConnectLine = (function() { 
	function __constructor(graph,params) {
		this.graph = graph;
		this.editor = params.editor;
		this.id = params.id;
		this.from = params.from;
		this.to = params.to;
		this.points = params.points || [];
		var style = params.style || {
							stroke:jmEditorDefaultStyle.connectLine.stroke,
							lineWidth:jmEditorDefaultStyle.connectLine.lineWidth,
							zIndex :1
						};
		this.type = "jmConnectLine";
		style.fill = 'transparent';
		this.initializing(graph.context,style);

		params = jmUtils.extend({
					start:params.from.outPos2,
					end:params.to.inPos					
					},params);
		
		this.arraw = graph.createShape('arraw',params);	

		var fontstyle = this.style.fontStyle || jmEditorDefaultStyle.font;
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
	jmUtils.extend(__constructor,jmPath);
	return __constructor;
})();

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
		//节点在目标节点上边
		if(frompostion.y + this.from.height() < toposition.y) {
			end = this.to.pos2;
		}
		else if(frompostion.y > toposition.y + this.to.height()) {
			end = this.to.pos4;
		}
		else {
			end = this.to.pos1;
		}		
	}
	else if(frompostion.x > toposition.x + this.to.width()) {
		start = this.from.pos1;
		if(frompostion.y + this.from.height() < toposition.y) {
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
		start = this.from.pos2;
		end = this.to.pos4;
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
    //实心箭头
	points = points.concat(this.arraw.initPoints(false));
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
		if(b) {
			this.style.stroke = this.style && this.style.selectedStroke?this.style.selectedStroke:jmEditorDefaultStyle.connectLine.overStroke;
			this.style.zIndex = 2000;
			this.selected = true;
		}		
		else {
			this.style.stroke = this.style && this.style.normalStroke?this.style.normalStroke:jmEditorDefaultStyle.connectLine.stroke;
			this.style.zIndex = 1;
			this.selected = false;
		}
		this.editor.emit('select',this,b);
	}	
	this.graph.refresh();
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
jmConnectLine.prototype.remove = function() {
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
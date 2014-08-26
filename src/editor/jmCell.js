
/**
 * 流程编辑器单元,继承自jmControl
 * 参数说明:resizable=是否可改变大小，connectable=是否可连线,value =当前显示字符串,position=单元位置,editor=当前单元所属编辑器,graph=画布,style=样式对象或名称
 * 
 * @class jmCell
 * @for jmEditor
 * @module jmEditor
 * @param {object} option 参数
 */

function jmCell(option) {		
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
	else if(typeof this.style.resizable != 'undefined') {
		this.resizable = this.style.resizable;			
	}
	
	if(typeof option.connectable != 'undefined') {
		this.connectable = option.connectable;
	}
	else if(typeof this.style.connectable != 'undefined') {
		this.connectable = this.style.connectable;			
	}	
	else {
		this.connectable = this.editor.connectable;
	}	
}

jmUtils.extend(jmCell,jmControl);//继承属性绑定	

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
		this.fontStyle = mpstyle.fontStyle || this.editor.defaultStyle.font;
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
					stroke:this.style.borderStroke || this.editor.defaultStyle.cellBorder.stroke,
					//fill:'transparent',
					//大小改变拖放边框样式
					rectStroke:this.style.borderStroke || this.editor.defaultStyle.cellBorder.stroke,
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
			width:'94%',
			height:'94%',
			center:this.center,
			position:{x:'3%',y:'3%'}
		},this.option);
		this.shape = this.graph.createShape(shape,params);		
	}

	if(this.connectable) {
		//创建连线拉动点
		var centerArcSzie = 8;
		var bg = this.graph.createRadialGradient(centerArcSzie / 2,centerArcSzie / 2,0,centerArcSzie / 2,centerArcSzie / 2,centerArcSzie);
			bg.addStop(0,'#00FF00');
			bg.addStop(1,'#059505');		
		//连接拖动圆点
		this.connArc = this.graph.createShape('arc',{
			center:{x:'50%',y:'50%'},			
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
		this.connectLine = this.graph.createShape('arrawline',{
			start:this.center,
			end:this.connArc.center(),
			offsetX: 6,
			offsetY: 12,
			style:this.editor.defaultStyle.dragLine
		});

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
	
	//单击选当前元素
	this.bind('mousedown',function(evt) {			
		//if(evt.button == 1) {
			//如果没有按下ctrl健，且没有被选中，则清除其它选中
			if(!evt.ctrlKey && !this.selected) {
				this.editor.selectAll(false,this.id);
			}				
			//选择当前节点		
			if(!this.selected) this.select(true);
			evt.cancel = true;
		//}
	});
	
	//当有连线拉到当前元素上时，连接这二个元素
		this.bind('mouseup',function(evt) {
			var from = this.editor.connectFrom;
			if(from) {
				if(from != this) {
					//连接二个节点
					if(from.connect(this) !== false)
					{
						this.editor.save();//保存状态
					}
				}			
				this.editor.connectFrom = null;
				//return false;
			}			
		});

	if(this.connectable) {		
		this.bind('mousemove',function() {
			this.connArc.visible = true;	
			this.graph.refresh();			
		});
		this.bind('mouseleave',function() {		
			if(this.editor.connectFrom != this) {
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
			arccenter.x = '50%';
			arccenter.y = '50%';
			_this.editor.connectFrom = null;
			_this.connectLine.visible = false;
			_this.connArc.visible = false;
			_this.graph.refresh();
		});
	}

	//如果当前节点被移动，则重新定位子元素
	this.on('move',function(args) {
		this.initPosition();//重新定位
		//this.moved = true;//标识已被移动
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
		var top = bounds.bottom;
		var left = bounds.right;

		if(this.style && this.style.overlay && this.style.overlay.margin) {
			if(this.style.overlay.margin.left) {
				left += this.style.overlay.margin.left;				
			}
			if(this.style.overlay.margin.top) {
				top += this.style.overlay.margin.top;
			}
		}

		this.overlay.style.top = top + 'px';
		this.overlay.style.left = left + 'px';
		this.overlay.style.border = '0';
		this.editor.container.appendChild(this.overlay);
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
			var top = bounds.bottom;
			var left = bounds.right;

			if(this.style && this.style.overlay && this.style.overlay.margin) {
				if(this.style.overlay.margin.left) {
					left += this.style.overlay.margin.left;				
				}
				if(this.style.overlay.margin.top) {
					top += this.style.overlay.margin.top;
				}
			}

			this.overlay.style.top = top + 'px';
			this.overlay.style.left = left + 'px';		
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
 * @param {boolean} [raiseEvent=true] 是否触发选择事件
 * @return {boolean} 是否被选择
 */
jmCell.prototype.select = function(b,raiseEvent) {
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
		if(raiseEvent !== false) {
			this.emit('select',this.selected);
		}		
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
		//检查元素是否可连接
		if(this.editor.validConnect && !this.editor.validConnect(this,to)) {
			return false;
		}

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
		line.bind('mousedown',function(evt) {
			var b = this.selected;	
			if(!evt.ctrlKey && !this.selected) {
				this.editor.selectAll(false,this.id);
			}
			
			this.select(!b);			
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
jmCell.prototype.remove = function(r) {
	if(r) return;
	if(this.editor) {
		this.editor.cells.remove(this);	
		this.graph.children.remove(this);	
		if(this.overlay && this.overlay.parentElement) {
			this.overlay.parentElement.removeChild(this.overlay);
		}
	}
	//并移除它的连线
	this.connects.each(function(i,c) {
		c.remove();	
	},true);
}




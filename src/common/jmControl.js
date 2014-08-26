/**
 * 控件基础对象
 * 控件的基础属性和方法
 *
 * @class jmControl
 * @module jmGraph
 * @for jmGraph
 */	
function jmControl() {

};
//继承属性绑定
jmUtils.extend(jmControl,jmProperty);

/**
 * 初始化对象，设定样式，初始化子控件对象
 * 此方法为所有控件需调用的方法
 *
 * @method initializing
 * @for jmControl
 * @param {canvas} context 当前画布
 * @param {style} style 当前控件的样式
 */
jmControl.prototype.initializing = function(context,style) {
	this.context = context;
	this.style = style || {};
	//this.style.fill = this.style.fill || 'transparent';
	this.visible = true;

	//如果不是html5模式，则生成非hmtl5元素
	var mode = this.mode || (this.mode = this.graph.mode);
	if(mode !== 'canvas' && !this.svgShape && this.type !== 'jmGraph') {
		this.svgShape = this.context.create('path',this);
		//this.svgShape.appendTo(this.graph.canvas);
	}

	var self = this;
	//定义子元素集合
	this.children = (function() {
		var lst = new jmUtils.list();
		var oadd = lst.add;
		//当把对象添加到当前控件中时，设定其父节点
		lst.add = function(obj) {
			if(typeof obj === 'object') {
				if(obj.parent && obj.parent != self && obj.parent.children) {
					obj.parent.children.remove(obj);//如果有父节点则从其父节点中移除
				}
				obj.parent = self;
				//如果存在先移除
				if(this.contain(obj)) {
					this.oremove(obj);
				}
				oadd.call(this,obj);
				obj.emit('add',obj);
				return obj;
			}
		};
		lst.oremove= lst.remove;
		//当把对象从此控件中移除时，把其父节点置为空
		lst.remove = function(obj) {
			if(typeof obj === 'object') {				
				obj.parent = null;
				obj.remove(true);
				this.oremove(obj);
			}
		};
		/**
		 * 根据控件zIndex排序，越大的越高
		 */
		lst.sort = function() {
			var levelItems = {};
			//提取zindex大于0的元素
			lst.each(function(i,obj) {
				var zindex = obj.zIndex;
				if(!zindex && obj.style && obj.style.zIndex) {
					zindex = Number(obj.style.zIndex);
				}
				if(zindex) {
					var items = levelItems[zindex] || (levelItems[zindex] = []);
					items.push(obj);					
				}
			});
			
			for(var index in levelItems) {
				oadd.call(this,levelItems[index]);
			}
		}
		lst.clear = function() {
			lst.each(function(i,obj) {
				this.remove(obj);
			},true);
		}
		return lst;
	})();
} 

/**
 * 设置鼠标指针
 * 
 * @method cursor
 * @for jmControl
 * @param {string} cur css鼠标指针标识,例如:pointer,move等
 */
jmControl.prototype.cursor = function(cur) {
	if(this.svgShape) {
		this.svgShape.css('cursor',cur);
	}
	else {
		var graph = this.graph || this.findParent('jmGraph');
		if(graph) {		
			graph.css('cursor',cur);		
		}
	}	
}

/**
 * 设定样式到context
 * 处理样式映射，转换渐变和阴影对象为标准canvas属性
 * 
 * @method setStyle
 * @for jmControl
 * @private
 * @param {style} style 样式对象，如:{fill:'black',stroke:'red'}
 */
jmControl.prototype.setStyle = function(style) {
	style = style || this.style;
	if(!style) return;

	/**
	 * 样式设定
	 * 
	 * @method __setStyle
	 * @private
	 * @param {jmControl} control 当前样式对应的控件对象
	 * @param {style} style 样式
	 * @param {string} name 样式名称
	 * @param {string} mpkey 样式名称在映射中的key(例如：shadow.blur为模糊值)
	 */
	function __setStyle(control,style,name,mpkey) {		
		var styleValue = style[name];
		if(styleValue) {
			if(!control.mode || control.mode == 'canvas') {
				//样式映射名
				var styleMapCacheKey = 'jm_control_style_mapping';
				var styleMap = jmUtils.cache.get(styleMapCacheKey);
				if(!styleMap) {
					//样式名称，也当做白名单使用					
					styleMap = {
						'fill':'fillStyle',
						'stroke':'strokeStyle',
						'shadow.blur':'shadowBlur',
						'shadow.x':'shadowOffsetX',
						'shadow.y':'shadowOffsetY',
						'shadow.color':'shadowColor',
						'lineWidth' : 'lineWidth',
						'fillStyle' : 'fillStyle',
						'strokeStyle' : 'strokeStyle',
						'font' : 'font',
						'opacity' : 'globalAlpha',
						'textAlign' : 'textAlign',
						'textBaseline' : 'textBaseline',
						'shadowBlur' : 'shadowBlur',
						'shadowOffsetX' : 'shadowOffsetX',
						'shadowOffsetY' : 'shadowOffsetY',
						'shadowColor' : 'shadowColor',
						'lineJoin': 'lineJoin',//线交汇处的形状,miter(默认，尖角),bevel(斜角),round（圆角）
						'lineCap':'lineCap' //线条终端点,butt(默认，平),round(圆),square（方）
					};
					jmUtils.cache.add(styleMapCacheKey,styleMap);
				}
				var t = typeof styleValue;
				if(t == 'object' && !styleMap[name]) {
					switch(name) {
						//阴影样式
						case 'shadow' : {
							for(var k in styleValue) {
								__setStyle(control,styleValue,k,name + '.' + k);
							}
							break;
						}
						//平移
						case 'translate' : {
							control.context.translate(styleValue.x,styleValue.y);
							break;
						}
					}							
				}
				//如果为渐变对象
				else if(t == 'object' && jmUtils.isType(styleValue,jmGradient)) {
					var mpname = styleMap[mpkey || name] || name;					
					control.context[mpname] = styleValue.toGradient(control);
				}
				else if(t != 'function' && t != 'object') {
					var mpname = styleMap[mpkey || name];
					//只有存在白名单中才处理
					if(mpname) {						
						control.context[mpname] = styleValue;						
					}
					//不在白名单中的特殊样式处理
					else {
						switch(name) {
							//旋转
							case 'rotate' : {								
								//旋 转先移位偏移量
								var tranX = 0;
								var tranY = 0;
								//旋转，则移位，如果有中心位则按中心旋转，否则按左上角旋转
								if(control.rotatePosition) {
									var bounds = control.parent && control.parent.absoluteBounds?control.parent.absoluteBounds:control.absoluteBounds;
									tranX = control.rotatePosition.x + bounds.left;
									tranY = control.rotatePosition.y + bounds.top;
								}
													
								control.context.translate(tranX,tranY);
								control.context.rotate(styleValue);
								break;
							}
							case 'transform' : {
								if(jmUtils.isArray(styleValue)) {
									control.context.transform.apply(control.context,styleValue);
								}
								else if(typeof styleValue == 'object') {
									control.context.transform(styleValue.scaleX,//水平缩放
										styleValue.skewX,//水平倾斜
										styleValue.skewY,//垂直倾斜
										styleValue.scaleY,//垂直缩放
										styleValue.offsetX,//水平位移
										styleValue.offsetY);//垂直位移
								}								
								break;
							}
							//位移
							case 'translate' : {
								control.context.translate(styleValue.x,styleValue.y);			
								break;
							}
							//鼠标指针
							case 'cursor' : {
								control.cursor(styleValue);
								break;
							}
						}
					}

				}				
			}
			else if(control.svgShape) {				
				control.svgShape.attr(mpkey || name,styleValue);
			}
		}
	}	

	//一些特殊属性要先设置，否则会导致顺序不对出现错误的效果
	if(this.translate) {
		__setStyle(this,{translate:this.translate},'translate');
	}
	if(this.transform) {
		__setStyle(this,{transform:this.transform},'transform');
	}
	if(this.rotate) {
		__setStyle(this,{rotate:this.rotate},'rotate');
	}
	//设置样式
	for(var k in style) {
		__setStyle(this,style,k);
	}
}

/**
 * 获取当前控件的边界
 * 通过分析控件的描点或位置加宽高得到为方形的边界
 *
 * @method getBounds
 * @for jmControl
 * @return {object} 控件的边界描述对象(left,top,right,bottom,width,height)
 */
jmControl.prototype.getBounds = function() {
	//if(this.initPoints) this.initPoints();
	var rect = {};
	
	if(this.points && this.points.length > 0) {		
		for(var i in this.points) {
			var p = this.points[i];
			if(typeof rect.left === 'undefined' || rect.left > p.x) {
				rect.left = p.x;
			}
			if(typeof rect.top === 'undefined'  || rect.top > p.y) {
				rect.top = p.y;
			}

			if(typeof rect.right === 'undefined'  || rect.right < p.x) {
				rect.right = p.x;
			}
			if(typeof rect.bottom === 'undefined' || rect.bottom < p.y) {
				rect.bottom = p.y;
			}
		}
	}
	else if(this.getLocation) {
		var p = this.getLocation();
		if(p) {
			rect.left = p.left;
			rect.top = p.top;
			rect.right = p.left + p.width;
			rect.bottom = p.top + p.height;
		}		
	}
	if(!rect.left) rect.left = 0; 
	if(!rect.top) rect.top = 0; 
	if(!rect.right) rect.right = 0; 
	if(!rect.bottom) rect.bottom = 0; 
	rect.width = rect.right - rect.left;
	rect.height = rect.bottom - rect.top;
	return rect;
}

/**
 * 获取当前控件的位置相关参数
 * 解析百分比和margin参数
 *
 * @method getLocation
 * @return {object} 当前控件位置参数，包括中心点坐标，右上角坐标，宽高
 */
jmControl.prototype.getLocation = function(reset) {
	//如果已经计算过则直接返回
	//在开画之前会清空此对象
	if(reset !== true && this.location) return this.location;

	var localtion = this.location = {left:0,top:0,width:0,height:0};
	var p = this.position();	
	localtion.center = this.center && typeof this.center === 'function'?jmUtils.clone(this.center()):null;//中心
	localtion.radius = this.radius?this.radius():null;//半径
	localtion.width = this.width() || 0;
	localtion.height = this.height() || 0;

	var margin = this.style.margin || {};
	margin.left = margin.left || 0;
	margin.top = margin.top || 0;
	margin.right = margin.right || 0;
	margin.bottom = margin.bottom || 0;
	
	//如果没有指定位置，但指定了margin。则位置取margin偏移量
	if(p) {
		localtion.left = p.x;
		localtion.top = p.y;
	}
	else {
		localtion.left = margin.left;
		localtion.top = margin.top;
	}

	if(!this.parent) return localtion;//没有父节点则直接返回
	var parentBounds = this.parent.bounds?this.parent.bounds:this.parent.getBounds();	

	//处理百分比参数
	if(jmUtils.checkPercent(localtion.left)) {
		localtion.left = jmUtils.percentToNumber(localtion.left) * parentBounds.width;
	}
	if(jmUtils.checkPercent(localtion.top)) {
		localtion.top = jmUtils.percentToNumber(localtion.top) * parentBounds.height;
	}
	
	//如果没有指定宽度或高度，则按百分之百计算其父宽度或高度
	if(jmUtils.checkPercent(localtion.width)) {
		localtion.width = jmUtils.percentToNumber(localtion.width) * parentBounds.width;
	}
	if(jmUtils.checkPercent(localtion.height)) {
		localtion.height = jmUtils.percentToNumber(localtion.height) * parentBounds.height;
	}
	//处理中心点
	if(localtion.center) {
		//处理百分比参数
		if(jmUtils.checkPercent(localtion.center.x)) {
			localtion.center.x = jmUtils.percentToNumber(localtion.center.x) * parentBounds.width;
		}
		if(jmUtils.checkPercent(localtion.center.y)) {
			localtion.center.y = jmUtils.percentToNumber(localtion.center.y) * parentBounds.height;
		}
	}
	if(localtion.radius) {
		//处理百分比参数
		if(jmUtils.checkPercent(localtion.radius)) {
			localtion.radius = jmUtils.percentToNumber(localtion.radius) * Math.min(parentBounds.width,parentBounds.height);
		}		
	}
	return localtion;
}

/**
 * 移除当前控件
 * 如果是VML元素，则调用其删除元素
 *
 * @method remove 
 */
jmControl.prototype.remove = function() {
	if(this.svgShape) this.svgShape.remove();
	if(this.parent) {
		this.parent.children.remove(this);
	}
}

/**
 * 获取或设定位置坐标
 *
 * @method position
 * @param {point} [p] 位置参数{x:1,y:1} ,如果为空则返回当前位置
 * @return {point} 当前控件的位置
 */
jmControl.prototype.position = function(p) {
	return this.setValue('position',p);
}

/**
 * 设定或获取宽度
 * 
 * @method width
 * @param {number} [w] 宽度，如果为空则返回当前宽度
 * @return {nubmer} 控件的当前宽度
 */
jmControl.prototype.width = function(w) {
	return this.setValue('width',w);
}

/**
 * 设定或获取高度
 *
 * @method height
 * @param {number} [h] 高度
 * @return {number} 当前控件的高度
 */
jmControl.prototype.height = function(h) {
	return this.setValue('height',h);
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
jmControl.prototype.offset = function(x,y,trans) {
	trans = trans === false?false:true;	
	var location = this.getLocation(true);
	
	var offseted = false;
	if(this.center && typeof this.center == 'function') {		
		var center = this.center();
		if(center) {			
			center.x = location.center.x + x;
			center.y = location.center.y + y;
			//this.center(center);
			offseted = true;
		}			
	}
	if(offseted == false && this.position && typeof this.position == 'function') {
		var p = this.position();
		if(p) {
			location.left += x;
			location.top += y;
			p.x = location.left;
			p.y = location.top;
			//this.position(p);
			offseted = true;
		}			
	}
	if(offseted == false && this.cpoints && typeof this.cpoints == 'function') {
		var p = this.cpoints();
		if(p) {			
			var len = p.length;
			for(var i=0; i < len;i++) {
				p[i].x += x;
				p[i].y += y;
			}		
			offseted = true;
		}			
	}
	
	if(offseted == false && this.points) {
		var len = this.points.length;
		for(var i=0; i < len;i++) {
			this.points[i].x += x;
			this.points[i].y += y;
		}
		offseted = true;
	}
	
	//触发控件移动事件	
	this.emit('move',{offsetX:x,offsetY:y,trans:trans});

	//this.getLocation(true);	//重置
	this.graph.refresh();
}

/**
 * 获取控件相对于画布的绝对边界，
 * 与getBounds不同的是：getBounds获取的是相对于父容器的边界.
 *
 * @method getAbsoluteBounds
 * @return {object} 边界对象(left,top,right,bottom,width,height)
 */
jmControl.prototype.getAbsoluteBounds = function() {
	//当前控件的边界，
	var rec = this.bounds || this.getBounds();
	if(this.parent && this.parent.absoluteBounds) {
		//父容器的绝对边界
		var prec = this.parent.absoluteBounds || this.parent.getAbsoluteBounds();
		
		return {
			left : prec.left + rec.left,
			top : prec.top + rec.top,
			right : prec.left + rec.right,
			bottom : prec.top + rec.bottom,
			width : rec.width,
			height : rec.height
		};
	}
	return rec;
}

/**
 * 画控件前初始化
 * 执行beginPath开始控件的绘制
 * 
 * @method beginDraw
 */
jmControl.prototype.beginDraw = function() {	
	this.getLocation(true);//重置位置信息
	this.context.beginPath();			
}

/**
 * 结束控件绘制
 *
 * @method endDraw
 */
jmControl.prototype.endDraw = function() {
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
 * 绘制控件
 * 在画布上描点
 * 
 * @method draw
 */
jmControl.prototype.draw = function() {	
	if(this.points && this.points.length > 0) {
		//获取当前控件的绝对位置
		var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
		if(!this.mode || this.mode == 'canvas') {
			this.context.moveTo(this.points[0].x + bounds.left,this.points[0].y + bounds.top);
			var len = this.points.length;			
			for(var i=1; i < len;i++) {
				var p = this.points[i];
				//移至当前坐标
				if(p.m) {
					this.context.moveTo(p.x + bounds.left,p.y + bounds.top);
				}
				else {
					this.context.lineTo(p.x+ bounds.left,p.y + bounds.top);
				}			
			}
		}
		else {			
			this.svgShape.setStyle(this);
			var ps = this.points.slice(0);
			var len = ps.length;			
			for(var i=0; i < len;i++) {
				ps[i].x += bounds.left;
				ps[i].y += bounds.top;
			}
			this.svgShape.attr('path',ps,this.style.close);	
		}
	}	
}

/**
 * 绘制当前控件
 * 协调控件的绘制，先从其子控件开始绘制，再往上冒。
 *
 * @method paint
 */
jmControl.prototype.paint = function(v) {
	if(v !== false && this.visible !== false) {
		if(this.svgShape) this.svgShape.show();

		if(this.initPoints) this.initPoints();
		//计算当前边界
		this.bounds = this.getBounds();
		this.absoluteBounds = this.getAbsoluteBounds();

		this.context.save();
		if(this.svgShape && this.svgShape.glow) this.svgShape.glow.remove();
		this.setStyle();//设定样式
		this.emit('beginDraw',this);
		if(this.beginDraw) this.beginDraw();
		if(this.draw) this.draw();	
		if(this.endDraw) this.endDraw();
		
		if(this.children) {	
			this.children.sort();//先排序
			this.children.each(function(i,item) {
				if(item && item.paint) item.paint();
			});
		}
		
		this.emit('endDraw',this);	
		this.context.restore();
	}
	else {
		if(this.svgShape) {
			this.svgShape.hide();
			if(this.children) {					
				this.children.each(function(i,item) {
					if(item && item.paint) item.paint(false);
				});
			}
		}
	}
}

/**
 * 获取指定事件的集合
 * 比如mousedown,mouseup等
 *
 * @method getEvent
 * @param {string} name 事件名称
 * @return {list} 事件委托的集合
 */
jmControl.prototype.getEvent = function(name) {		
	return this.__events?this.__events[name]:null;
}

/**
 * 绑定控件的事件
 *
 * @method bind
 * @param {string} name 事件名称
 * @param {function} handle 事件委托
 */
jmControl.prototype.bind = function(name,handle) {	
	//if(this.svgShape) {
		//this.svgShape.bind(name,handle);
		//return;
	//}
	/**
	 * 添加事件的集合
	 *
	 * @method _setEvent
	 * @private
	 */
	function _setEvent(name,events) {
		if(!this.__events) this.__events = {};
		return this.__events[name] = events;
	}
	var eventCollection = this.getEvent(name) || _setEvent.call(this,name,new jmUtils.list());
	if(!eventCollection.contain(handle)) {
		eventCollection.add(handle);
	}
}

/**
 * 移除控件的事件
 *
 * @method unbind 
 * @param {string} name 事件名称
 * @param {function} handle 从控件中移除事件的委托
 */
jmControl.prototype.unbind = function(name,handle) {
	//if(this.svgShape) {
		//this.svgShape.unbind(name,handle);
		//return;
	//}

	var eventCollection = this.getEvent(name) ;		
	if(eventCollection) {
		eventCollection.remove(handle);
	}
}

/**
 * 独立执行事件委托
 *
 * @method runEventHandle
 * @param {string} 将执行的事件名称
 * @param {object} 事件执行的参数，包括触发事件的对象和位置
 */
function runEventHandle(name,args) {
	var events = this.getEvent(name);		
	if(events) {
		var self = this;			
		events.each(function(i,handle) {
			//只要有一个事件被阻止，则不再处理同级事件，并设置冒泡被阻断
			if(false === handle.call(self,args)) {
				args.cancel = true;
			}
		});		
	}	
	return args.cancel;
}

/**
 * 检 查坐标是否落在当前控件区域中..true=在区域内
 *
 * @method checkPoint
 * @param {point} p 位置参数
 * @return {boolean} 当前位置如果在区域内则为true,否则为false。
 */
jmControl.prototype.checkPoint = function(p) {
	//生成当前坐标对应的父级元素的相对位置
	var abounds = this.bounds || this.getBounds();

	if(p.x > abounds.right || p.x < abounds.left) {
		return false;
	}
	if(p.y > abounds.bottom || p.y < abounds.top) {
		return false;
	}
	
	return true;
}


/**
 * 触发控件事件，组合参数并按控件层级关系执行事件冒泡。
 *
 * @method raiseEvent
 * @param {string} name 事件名称
 * @param {object} args 事件执行参数
 * @return {boolean} 如果事件被组止冒泡则返回false,否则返回true
 */
jmControl.prototype.raiseEvent = function(name,args) {
	if(this.visible === false) return ;//如果不显示则不响应事件	
	if(!args.position) {		
		var graph = this.findParent('jmGraph');
		var position = jmUtils.getEventPosition(args,graph.scaleSize);//初始化事件位置
		
		//如果不是html5模式，则处理每个元素的相对位置为graph容器的位置
		if(this.mode !== 'canvas') {
			var graphposition = graph.getPosition();
			position.x = position.offsetX = position.pageX - graphposition.left;
			position.y = position.offsetY = position.pageY - graphposition.top;
		}

		var srcElement = args.srcElement || args.target;
		args = {position:position,
			button:args.button == 0?1:args.button,
			keyCode:args.keyCode || args.charCode || args.which,
			ctrlKey:args.ctrlKey,
			cancel : false,
			srcElement : srcElement
		};		
	}
	//先执行子元素事件，如果事件没有被阻断，则向上冒泡
	//var stoped = false;
	if(this.children) {
		this.children.each(function(j,el) {	
			//未被阻止才执行			
			if(args.cancel !== true) {
				//如果被阻止冒泡，
				//stoped = el.raiseEvent(name,args) === false?true:stoped;
				el.raiseEvent(name,args)
			}
		},true);//按逆序处理
	}
	//if(stoped) return false;

	//获取当前对象的父元素绝对位置
	//生成当前坐标对应的父级元素的相对位置
	var abounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds : this.absoluteBounds;
	if(!abounds) return false;	
	//args = jmUtils.clone(args);//参数副本
	args.position.x = args.position.offsetX - abounds.left;
	args.position.y = args.position.offsetY - abounds.top;
	
	//事件发生在边界内或健盘事件发生在画布中才触发
	if(this.checkPoint(args.position)) {
		//如果没有指定触发对象，则认为当前为第一触发对象
		if(!args.target) {
			args.target = this;
		}
		if(args.cancel !== true) {
			//如果返回true则阻断冒泡
			runEventHandle.call(this,name,args);//执行事件		
		}
		if(!this.focused && name == 'mousemove') {
	 		this.focused = true;//表明当前焦点在此控件中
	 		this.raiseEvent('mouseover',args);
		}	
	}
	else {
		//如果焦点不在，且原焦点在，则触发mouseleave事件
		if(this.focused && name == 'mousemove') {
	 		this.focused = false;//表明当前焦点离开
	 		runEventHandle.call(this,'mouseleave',args);//执行事件	
		}	
	}
		
	return args.cancel == false;//如果被阻止则返回false,否则返回true
}

/**
 * 清空控件指定事件
 *
 * @method clearEvents
 * @param {string} name 需要清除的事件名称
 */
jmControl.prototype.clearEvents = function(name) {
	var eventCollection = this.getEvent(name) ;		
	if(eventCollection) {
		eventCollection.clear;
	}
}

/**
 * 查找其父级类型为type的元素，直到找到指定的对象或到最顶级控件后返回空。
 *
 * @method findParent 
 * @param {object} 类型名称或类型对象
 * @return {object} 指定类型的实例
 */
jmControl.prototype.findParent = function(type) {
	//如果为类型名称，则返回名称相同的类型对象
	if(typeof type === 'string') {
		if(this.type == type)
			return this;
	}
	else if(this.is(type)) {
		return this;
	}
	if(this.parent) {
		return this.parent.findParent(type);
	}
	return null;
}

/**
 * 设定是否可以移动
 * 此方法需指定jmgraph或在控件添加到jmgraph后再调用才能生效。
 *
 * @method canMove
 * @param {boolean} m true=可以移动，false=不可移动或清除移动。
 * @param {jmGraph} [graph] 当前画布，如果为空的话必需是已加入画布的控件，否则得指定画布。
 */
jmControl.prototype.canMove = function(m,graph) {
	if(!this.__mvMonitor) {
		/**
		 * 控制控件移动对象
		 * 
		 * @property __mvMonitor
		 * @private
		 */
		this.__mvMonitor = {};
		this.__mvMonitor.mouseDown = false;
		this.__mvMonitor.curposition={x:0,y:0};
		var self = this;
		/**
		 * 控件移动鼠标事件
		 *
		 * @method mv
		 * @private
		 */
		this.__mvMonitor.mv = function(evt) {
			var _this = self;
			if(_this.__mvMonitor.mouseDown) {
				_this.parent.bounds = null;
				var parentbounds = _this.parent.getAbsoluteBounds();		
				var offsetx = evt.position.x - _this.__mvMonitor.curposition.x;
				var offsety = evt.position.y - _this.__mvMonitor.curposition.y;				
				
				//如果锁定边界
				if(_this.lockSide) {
					var thisbounds = _this.bounds || _this.getAbsoluteBounds();					
					//检查边界出界
					var outside = jmUtils.checkOutSide(parentbounds,thisbounds,{x:offsetx,y:offsety});
					if(outside.left < 0) {
						if(_this.lockSide.left) offsetx -= outside.left;
					}
					else if(outside.right > 0) {
						if(_this.lockSide.right) offsetx -= outside.right;
					}
					if(outside.top < 0) {
						if(_this.lockSide.top) offsety -= outside.top;
					}
					else if(outside.bottom > 0) {
						if(_this.lockSide.bottom) offsety -= outside.bottom;
					}
				}
				
				if(offsetx || offsety) {
					_this.offset(offsetx,offsety);
					_this.__mvMonitor.curposition.x = evt.position.x;
					_this.__mvMonitor.curposition.y = evt.position.y;	
					//console.log(offsetx + '.' + offsety);
				}
				return false;
			}
		}
		/**
		 * 控件移动鼠标松开事件
		 *
		 * @method mu
		 * @private
		 */
		this.__mvMonitor.mu = function(evt) {
			var _this = self;
			if(_this.__mvMonitor.mouseDown) {
				_this.__mvMonitor.mouseDown = false;
				_this.cursor('default');
				_this.emit('moveend',{position:_this.__mvMonitor.curposition});	
				//return false;
			}			
		}
		/**
		 * 控件移动鼠标离开事件
		 *
		 * @method ml
		 * @private
		 */
		this.__mvMonitor.ml = function() {
			var _this = self;
	 		if(_this.__mvMonitor.mouseDown) {
				_this.__mvMonitor.mouseDown = false;
				_this.cursor('default');	
				_this.emit('moveend',{position:_this.__mvMonitor.curposition});
				return false;
			}	
		}
		/**
		 * 控件移动鼠标按下事件
		 *
		 * @method md
		 * @private
		 */
		this.__mvMonitor.md = function(evt) {
			var _this = self;
			if(_this.__mvMonitor.mouseDown) return;
			if(evt.button == 0 || evt.button == 1) {
				_this.__mvMonitor.mouseDown = true;
				_this.cursor('move');
				var parentbounds = _this.parent.absoluteBounds || _this.parent.getAbsoluteBounds();	
				_this.__mvMonitor.curposition.x = evt.position.x + parentbounds.left;
				_this.__mvMonitor.curposition.y = evt.position.y + parentbounds.top;
				//触发控件移动事件
				_this.emit('movestart',{position:_this.__mvMonitor.curposition});
				
				evt.cancel = true;
				return false;
			}			
		}
	}
	graph = graph || this.graph || this.findParent('jmGraph');//获取最顶级元素画布
	
	if(graph && m) {
		
			graph.bind('mousemove',this.__mvMonitor.mv);
			graph.bind('mouseup',this.__mvMonitor.mu);
			graph.bind('mouseleave',this.__mvMonitor.ml);
			this.bind('mousedown',this.__mvMonitor.md);
			graph.bind('touchmove',this.__mvMonitor.mv);
			graph.bind('touchend',this.__mvMonitor.mu);
			this.bind('touchstart',this.__mvMonitor.md);	
			
	}
	else {
		
			graph.unbind('mousemove',this.__mvMonitor.mv);
			graph.unbind('mouseup',this.__mvMonitor.mu);
			graph.unbind('mouseleave',this.__mvMonitor.ml);
			this.unbind('mousedown',this.__mvMonitor.md);
			graph.unbind('touchmove',this.__mvMonitor.mv);
			graph.unbind('touchend',this.__mvMonitor.mu);
			this.unbind('touchstart',this.__mvMonitor.md);	
		
	}
}


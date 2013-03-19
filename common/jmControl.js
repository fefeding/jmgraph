/**
* 控件基础对象
*/

var jmControl = (function() {
	function __constructor() {		
		
	}
	jmUtils.extend(__constructor,jmProperty);//继承属性绑定

	return __constructor;
})();


/**
* 初始化对象
*/
jmControl.prototype.initializing = function(context,style) {
	this.context = context;
	this.style = style || {};
	this.visible = true;

	var _this = this;
	//定义子元素集合
	this.children = (function() {
		var lst = new jmUtils.list();
		var oadd = lst.add;
		//当把对象添加到当前控件中时，设定其父节点
		lst.add = function(obj) {
			if(typeof obj === 'object') {
				if(obj.parent && obj.parent.children) {
					obj.parent.children.remove(obj);//如果有父节点则从其父节点中移除
				}
				obj.parent = _this;
				oadd.call(this,obj);
			}
		} ;
		var oremove= lst.remove;
		//当把对象从此控件中移除时，把其父节点置为空
		lst.remove = function(obj) {
			if(typeof obj === 'object') {
				/*if(obj.canMove) {
					obj.canMove(false);
				}*/
				obj.parent = null;
				oremove.call(this,obj);
			}
		};
		/**
		* 根据控件zIndex排序，越大的越高
		*/
		lst.sort = function() {
			var topItems = [];
			//提取zindex大于0的元素
			lst.each(function(i,obj) {
				if(obj.style && obj.style.zIndex && !obj.zIndex) {
					obj.zIndex = Number(obj.style.zIndex);
				}
				if(obj.zIndex && Number(obj.zIndex) > 0) {
					topItems.push(obj);
					oremove.call(this,obj);
				}
			});
			//通过zindex排序
			topItems.sort(function(item1,item2) {
				return item1.zIndex - item2.zIndex;
			});
			oadd.call(this,topItems);
		}
		return lst;
	})();
} 

/**
* 鼠标指针
*/
jmControl.prototype.cursor = function(cur) {	
	var graph = this.findParent(jmGraph);
	if(graph) {
		graph.setStyle('cursor',cur);
	}
}

/**
* 设定样式到context
* fill=填充色，stroke=画笔色
*/
jmControl.prototype.setStyle = function(style) {
	style = style || this.style;
	if(!style) return;

	/**
	* 样式设定
	* context = 当前画板，style=样式对象，name=样式对象中的名称，
	* mpkey=样式名称在映射中的key(例如：shadow.blur为模糊值)
	*/
	function __setStyle(control,style,name,mpkey) {
		//样式映射名
		var styleMapCacheKey = 'jm_control_style_mapping';
		var styleMap = jmUtils.cache.get(styleMapCacheKey);
		if(!styleMap) {
			styleMap = {
				'fill':'fillStyle',
				'stroke':'strokeStyle',
				'shadow.blur':'shadowBlur',
				'shadow.x':'shadowOffsetX',
				'shadow.y':'shadowOffsetY',
				'shadow.color':'shadowColor'
			};
			jmUtils.cache.add(styleMapCacheKey,styleMap);
		}
		var styleValue = style[name];
		if(styleValue) {
			if(typeof styleValue == 'object' && !styleMap[name]) {
				for(var k in styleValue) {
					__setStyle(control,styleValue,k,name + '.' + k);
				}
			}
			//如果为渐变对象
			else if(jmUtils.isType(styleValue,jmGradient)) {				
				var mpname = styleMap[mpkey || name] || name;
				control.context[mpname] = styleValue.toGradient(control);
			}		
			else if(typeof styleValue != 'function') {
				var mpname = styleMap[mpkey || name] || name;
				control.context[mpname] = style[name];
			}				
		}
	}
	for(var k in style) {
		__setStyle(this,style,k);
	}
}

/**
* 获取当前控件的边界
*/
jmControl.prototype.getBounds = function() {
	if(this.initPoints) this.initPoints();
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
	if(!rect.left) rect.left = 0; 
	if(!rect.top) rect.top = 0; 
	if(!rect.right) rect.right = 0; 
	if(!rect.bottom) rect.bottom = 0; 
	rect.width = rect.right - rect.left;
	rect.height = rect.bottom - rect.top;
	return rect;
}


/**
* 设定或获取宽度
*/
jmControl.prototype.width = function(w) {
	return this.setValue('width',w);
}

/**
* 设定或获取高度
*/
jmControl.prototype.height = function(h) {
	return this.setValue('height',h);
}

/**
* 对控件进行平移
*/
jmControl.prototype.offset = function(x,y) {	
	if(this.cpoints && typeof this.cpoints == 'function') {
		var ps = this.cpoints();
		for(var i in ps) {
			ps[i].x += x;
			ps[i].y += y;
		}
	}
	else if(this.center && typeof this.center == 'function') {
		var center = this.center();
		center.x += x;
		center.y += y;	
		//this.center(center);	
	}
	else if(this.position && typeof this.position == 'function') {
		var p = this.position();
		if(p) {
			p.x += x;
			p.y += y;
		}		
	}
	else if(this.points) {
		for(var i in this.points) {
			this.points[i].x += x;
			this.points[i].y += y;
		}
	}
}

/**
* 获取控件相对于画布的绝对边界
*/
jmControl.prototype.getAbsoluteBounds = function() {
	//当前控件的边界，
	var rec = this.bounds;
	if(this.parent && this.parent.absoluteBounds) {
		//父容器的绝对边界
		var prec = this.parent.absoluteBounds;
		
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
* 绘制当前控件
*/
jmControl.prototype.paint = function() {
	if(this.visible !== false) {	
		//计算当前边界
		this.bounds = this.getBounds();
		this.absoluteBounds = this.getAbsoluteBounds();

		this.context.save();
		this.setStyle();//设定样式
		if(this.beginDraw) this.beginDraw();
		if(this.draw) this.draw();
		if(this.endDraw) this.endDraw();

		if(this.children) {	
			this.children.sort();//先排序
			this.children.each(function(i,item) {
				if(item && item.paint) item.paint();
			});
		}
		this.context.restore();
	}
}

/**
* 获取指定事件的集合
*/
jmControl.prototype.getEvent = function(name) {		
	return this.__events?this.__events[name]:null;
}

/**
* 绑定控件的事件
*/
jmControl.prototype.bind = function(name,handle) {	
	/**
	* 添加事件的集合
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
*/
jmControl.prototype.unbind = function(name,handle) {
	var eventCollection = this.getEvent(name) ;		
	if(eventCollection) {
		eventCollection.remove(handle);
	}
}

/**
* 独立执行事件委托
*/
function runEventHandle(name,args) {
	var stoped = false;
	var events = this.getEvent(name);		
	if(events) {
		var _this = this;			
		events.each(function(i,handle) {
			//只要有一个事件被阻止，则不再向上冒泡
			if(false === handle.call(_this,args)) {
				stoped = true;
			}
		});		
	}	
	return stoped;		
}

/**
* 检 查坐标是否落在当前控件区域中..true=在区域内
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
* 触发事件
*/
jmControl.prototype.raiseEvent = function(name,args) {
	if(this.visible === false) return ;//如果不显示则不响应事件	
	if(!args.position) {		
		var graph = this.findParent(jmGraph);
		var position = jmUtils.getEventPosition(args,graph.scaleSize);//初始化事件位置	

		//复制一个参数对象
		/*var argstmp = {position:position,target:this};
		for(var k in args) {
			var t = typeof args[k];
			if(t === 'string' || t === 'number') {
				argstmp[k] = args[k];
			}
		}
		args = argstmp;*/
		args.position = position;
		args.target = this;
	}
	//先执行子元素事件，如果事件没有被阻断，则向上冒泡
	var stoped = false;
	if(this.children) {
		this.children.each(function(j,el) {	
			//未被阻止才执行			
			if(stoped == false) {
				stoped = (false === el.raiseEvent(name,args));
			}
		},true);//按逆序处理
	}


	//获取当前对象的父元素绝对位置
	//生成当前坐标对应的父级元素的相对位置
	var abounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds : this.absoluteBounds;
	if(!abounds) return false;	
	//args = jmUtils.clone(args);//参数副本
	args.position.x = args.position.offsetX - abounds.left;
	args.position.y = args.position.offsetY - abounds.top;
	
	//事件发生在边界内才触发
	if(this.checkPoint(args.position)) {
		if(stoped == false) {
			//如果返回true则阻断冒泡
			stoped = runEventHandle.call(this,name,args);//执行事件		
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
		
	return stoped == false;//如果被阻止则返回false,否则返回true
}

/**
* 清空控件指定事件
*/
jmControl.prototype.clearEvents = function(name) {
	var eventCollection = this.getEvent(name) ;		
	if(eventCollection) {
		eventCollection.clear;
	}
}

/**
* 向上查找其父级类型为type的元素
*/
jmControl.prototype.findParent = function(type) {
	if(this.is(type)) return this;
	if(this.parent) {
		return this.parent.findParent(type);
	}
	return null;
}

/**
* 设定是否可以移动
*/
jmControl.prototype.canMove = function(m) {
	var graph = this.findParent(jmGraph);//获取最顶级元素画布
	if(!graph) return;

	if(!this.__mvMonitor) {
		this.__mvMonitor = {};
		this.__mvMonitor.mouseDown = false;
		this.__mvMonitor.curposition={x:0,y:0};
		var _this = this;
		_this.__mvMonitor.mv = function(evt) {
			if(_this.__mvMonitor.mouseDown) {	
				var parentbounds = _this.parent.absoluteBounds || _this.parent.getAbsoluteBounds();		
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
				
				_this.offset(offsetx,offsety);
				_this.__mvMonitor.curposition.x = evt.position.x;
				_this.__mvMonitor.curposition.y = evt.position.y;
				//触发控件移动事件
				_this.callHandle('move',[{position:_this.__mvMonitor.curposition,offsetX:offsetx,offsetY:offsety}]);
				graph.refresh();
				return false;
			}
		}
		_this.__mvMonitor.mu = function() {
			if(_this.__mvMonitor.mouseDown) {
				_this.__mvMonitor.mouseDown = false;
				_this.cursor('default');
				_this.callHandle('moveend',[{position:_this.__mvMonitor.curposition}]);	
				return false;
			}			
		}
		_this.__mvMonitor.ml = function() {
	 		if(_this.__mvMonitor.mouseDown) {
				_this.__mvMonitor.mouseDown = false;
				_this.cursor('default');	
				_this.callHandle('moveend',[{position:_this.__mvMonitor.curposition}]);
				return false;
			}	
		}
		_this.__mvMonitor.md = function(evt) {
			_this.__mvMonitor.mouseDown = true;
			_this.cursor('move');
			var parentbounds = _this.parent.absoluteBounds || _this.parent.getAbsoluteBounds();	
			_this.__mvMonitor.curposition.x = evt.position.x + parentbounds.left;
			_this.__mvMonitor.curposition.y = evt.position.y + parentbounds.top;
			//触发控件移动事件
			_this.callHandle('movestart',[{position:_this.__mvMonitor.curposition}]);
			return false;
		}
	}
	
	if(m) {
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
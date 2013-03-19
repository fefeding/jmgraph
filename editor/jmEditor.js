/**
* jm流程图编辑器
*/

var jmEditor = (function () {
	function __constructor(option) {
		this.option = option;
		this.cells = new jmUtils.list();
		this.styles = {};
		if(option.container) {
			var canvas = option.container;
			if(canvas.tagName.toLowerCase() == 'canvas') {
				this.graph = new jmGraph(option.container);
			}
			else {
				canvas = document.createElement('canvas');	
				option.container.appendChild(canvas);
				this.graph = new jmGraph(canvas);
			}				
			this.graph.registerShape('cellConnectLine',jmConnectLine);		
			this.initEvents();//绑定基础事件
		}		
	}
	return __constructor;
})();

/**
* 添加元素
*/
jmEditor.prototype.addCell = function(option) {
	option = option || {};
	option.graph = this.graph;
	option.editor = this;
	var cell = new jmCell(option);
	this.cells.add(cell);
	cell.add();
	return cell;
}

/**
* 初始化编辑器的基础事件
*/
jmEditor.prototype.initEvents = function() {
	var _this = this;
	this.graph.bind('mousedown',function() {
		_this.selectAll(false);
	});
	/*this.graph.bind('mouseup',function(evt) {
		if(_this.currentComponent) {
			var componentindex = _this.currentComponent.img.getAttribute('data-component');
			var option = _this.components[componentindex];
			option = jmUtils.clone(option);
			var evtpos = jmUtils.getEventPosition(evt || event);
			option.position = {x:evtpos.x,y:evtpos.y};
			_this.addCell(option);
			document.body.removeChild(_this.currentComponent.img);
			_this.currentComponent = null;
			return false;
		}
	});*/

	jmUtils.bindEvent(document,'mousemove',function(evt) {
		if(_this.currentComponent) {
			evt = evt || event;
			var evtpos = jmUtils.getEventPosition(evt || event);
			var dx = evtpos.pageX - _this.currentComponent.evtX;
			var dy = evtpos.pageY - _this.currentComponent.evtY;
			
			_this.currentComponent.left += dx;
			_this.currentComponent.top += dy;
			_this.currentComponent.img.style.left = _this.currentComponent.left + 'px';
			_this.currentComponent.img.style.top = _this.currentComponent.top + 'px';
			_this.currentComponent.evtX = evtpos.pageX;
			_this.currentComponent.evtY = evtpos.pageY;			
		}		
	});
	jmUtils.bindEvent(document,'mouseup',function(evt) {
		//当有拖放组件时，生成组件元素
		if(_this.currentComponent) {
			evt = evt || event;
			var pos = jmUtils.getElementPosition(_this.graph.canvas);
			var evtpos = jmUtils.getEventPosition(evt);
			if(evtpos.pageX >= pos.left && evtpos.pageX <= pos.left + _this.graph.canvas.width &&
				evtpos.pageY >= pos.top && evtpos.pageY <= pos.top + _this.graph.canvas.height) {
				var componentindex = _this.currentComponent.img.getAttribute('data-component');
				var option = _this.components[componentindex];
				if(typeof option === 'function') {
					option.call(_this,{x:evtpos.pageX - pos.left,y:evtpos.pageY - pos.top});
				}
				else {
					option = jmUtils.clone(option);				
					option.position = {x:evtpos.pageX - pos.left,y:evtpos.pageY - pos.top};
					_this.addCell(option);
				}
				_this.graph.refresh();
			}			
			document.body.removeChild(_this.currentComponent.img);
			_this.currentComponent = null;
			return false;
		}		
	});
}

/**
* 选择所有元素
*/
jmEditor.prototype.selectAll = function(b) {
	this.cells.each(function(i,cell) {
		cell.select(b);
	})
}

/**
* 初始化组件添加对象
*/
jmEditor.prototype.regComponent = function(el,option) {
	if(!this.components) this.components = [];
	this.components.push(option);
	if(typeof el === 'string') {
		var tmp = document.createElement('img');
		tmp.src = el;
		el = tmp;
	}
	el.setAttribute('data-component',this.components.length - 1);
	var _this = this;
	jmUtils.bindEvent(el,'mousedown',function(evt) {
		evt = evt || event;
		var target = evt.target || evt.srcElement;
		_this.currentComponent = {};
		_this.currentComponent.img = document.createElement('img');
		_this.currentComponent.img.setAttribute('data-component',target.getAttribute('data-component'));
		_this.currentComponent.img.src = this.src;
		_this.currentComponent.img.style['position'] = 'absolute';
		var pos = jmUtils.getElementPosition(target);
		_this.currentComponent.left = pos.left;
		_this.currentComponent.top = pos.top;
		_this.currentComponent.img.style.left = pos.left + 'px';
		_this.currentComponent.img.style.top = pos.top + 'px';
		window.document.body.appendChild(_this.currentComponent.img);
		var evtpos = jmUtils.getEventPosition(evt || event);
		_this.currentComponent.evtX = evtpos.pageX;
		_this.currentComponent.evtY = evtpos.pageY;
		if ( evt && evt.preventDefault ) {
			//阻止默认浏览器动作(W3C) 
			evt.preventDefault(); 
		}		
		else {
			//IE中阻止函数器默认动作的方式 
			window.event.returnValue = false; 
		}			
		return false;
	});
	return el;
}

/**
* 保存样式信息
*/
jmEditor.prototype.regStyle = function(name,style) {
	this.styles[name] = style;
}

/**
* 对画布执行基本命令
*/
jmEditor.prototype.execute = function(cmd) {
	switch(cmd) {
		case 'zoomOut': {
			this.graph.zoomOut();
			break;
		}
		case 'zoomIn': {
			this.graph.zoomIn();
			break;
		}
		case 'zoomActual': {
			this.graph.zoomActual();
			break;
		}
	}
}

/**
* 转为图片信息
*/
jmEditor.prototype.toImage = function() {
	return this.graph.toDataURL();
}
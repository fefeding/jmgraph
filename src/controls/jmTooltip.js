
/**
 * 显示提示控件
 * params参数:style=样式，value=显示的文字
 *
 * @class jmTooltip
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 当前画布
 * @param {object} params 参数
 */
function jmTooltip(graph,params) {
	if(!params) params = {};		
	var style = params.style || {};
	style.font = style.font || "15px Arial";
	this.type = 'jmTooltip';
	
	this.graph = graph;

	this.position(params.position || {x:0,y:0});		
	this.initializing(graph.context,style);

	this.element = document.createElement('div');
	this.element.className = 'jm-tooltip';
	this.element.style.position = 'absolute';
	this.element.style.display = 'none';
	this.value(params.value);
	document.body.appendChild(this.element);
}

jmUtils.extend(jmTooltip,jmControl);//jmPath

/**
 * 写入样式
 * 
 * @method setStyle
 * @private
 */
jmTooltip.prototype.setStyle = function(style) {
	style = style || this.style;
	if(style && typeof style == 'object') {		
		for(var k in style) {
			if(typeof(k) != 'string' || typeof(style[k]) != 'string') continue;
			try {
				this.element.style[k] = style[k];
			}
			catch(e) {
				window.console.log(e);
			}
		}		
	}
}

/**
 * 计算提示位并显示
 * 
 * @method draw
 */
jmTooltip.prototype.draw = function() {	
	this.setPosition();	
}

/**
 * 设置提示坐标位置
 *
 * @method setPosition
 * @param {number} x X轴坐标
 * @param {number} y Y轴坐标
 */
jmTooltip.prototype.setPosition = function(x,y) {
	this.x = x || this.x || 0;
	this.y = y || this.y || 0;
	//获取当前控件的绝对位置
	var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
	var location = this.getLocation();
	x = this.x + location.left + bounds.left;
	y = this.y + location.top + bounds.top;
	
	var graphpostion = this.graph.getPosition();
	x += graphpostion.left;
	y += graphpostion.top;

	this.element.style.top = y + 'px';
	this.element.style.left = x + 'px';
}

/**
 * 移除当前控件
 *
 * @method remove 
 */
jmTooltip.prototype.remove = function() {
	if(this.element) {
		document.body.removeChild(this.element);
	}
}

/**
 * 显示当前控件
 *
 * @method remove 
 */
jmTooltip.prototype.show = function() {
	if(this.element) {
		this.element.style.display = 'inline';
	}
}

/**
 * 隐藏当前控件
 *
 * @method remove 
 */
jmTooltip.prototype.hide = function() {
	if(this.element) {
		this.element.style.display = 'none';
	}
}

/**
 * 设置或获取当前值
 *
 * @method value 
 */
jmTooltip.prototype.value = function(v) {
	if(this.element) {
		if(v !== undefined) {
			this.element.innerHTML = v;
		}
		return this.element.innerHTML;
	}
}

/**
 * 设置或获取当前宽度
 *
 * @method width 
 * @param {number} w 宽度
 */
jmTooltip.prototype.width = function(w) {
	if(this.element) {
		if(w !== undefined) {
			this.element.style.width = w + 'px';
		}
		return this.element.clientWidth;
	}
}

/**
 * 设置或获取当前高度
 *
 * @method width 
 * @param {number} w 宽度
 */
jmTooltip.prototype.height = function(h) {
	if(this.element) {
		if(h !== undefined) {
			this.element.style.height = h + 'px';
		}
		return this.element.clientHeight;
	}
}




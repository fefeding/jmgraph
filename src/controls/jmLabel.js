import jmControl from "../common/jmControl";
/**
 * 显示文字控件
 * params参数:style=样式，value=显示的文字
 *
 * @class jmLabel
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 当前画布
 * @param {object} params 文字控件参数
 */
function jmLabel(graph,params) {
	if(!params) params = {};		
	var style = params.style || {};
	style.font = style.font || "15px Arial";
	style.fontFamily = style.fontFamily || 'Arial';
	style.fontSize = style.fontSize || 15;
	this.type = 'jmLabel';
	// 显示不同的 textAlign 值
	//文字水平对齐
	style.textAlign = style.textAlign || 'left';
	//文字垂直对齐
	style.textBaseline = style.textBaseline || 'middle',
	
	this.graph = graph;
	this.text = params.text||'';
	this.position = params.position || {x:0,y:0};
	this.width = params.width || 0;
	this.height = params.height  || 0;

	this.initializing(graph.context,style);
}
jmUtils.extend(jmLabel, jmControl);//jmPath


/**
 * 显示的内容
 * @property text
 * @type {string}
 */
jmUtils.createProperty(jmLabel.prototype, 'text');

/**
 * 初始化图形点,主要用于限定控件边界。
 *
 * @method initPoints
 * @return {array} 所有边界点数组
 * @private
 */
jmLabel.prototype.initPoints = function() {	
	this.__size = null;
	var size = this.testSize();	
	var location = this.getLocation();
	
	var w = location.width || size.width;
	var h = location.height || size.height;	

	this.points = [{x:location.left,y:location.top}];
	this.points.push({x:location.left + w,y:location.top});
	this.points.push({x:location.left + w,y:location.top + h});
	this.points.push({x:location.left,y:location.top+ h});
	return this.points;
}

/**
 * 测试获取文本所占大小
 *
 * @method testSize
 * @return {object} 含文本大小的对象
 */
jmLabel.prototype.testSize = function() {
	if(this.__size) return this.__size;
	this.style.font = this.style.fontSize + 'px ' + this.style.fontFamily;
	this.context.save();
	this.setStyle();
	//计算宽度
	this.__size = this.context.measureText?
						this.context.measureText(this.text):
						{width:15};
	this.context.restore();
	this.__size.height = this.style.fontSize?this.style.fontSize:15;
	if(!this.width) this.width = this.__size.width;
	if(!this.height) this.height = this.__size.height;
	return this.__size;
}

/**
 * 根据位置偏移画字符串
 * 
 * @method draw
 */
jmLabel.prototype.draw = function() {	
	
	//获取当前控件的绝对位置
	var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;		
	var size = this.testSize();
	var location = this.getLocation();
	var x = location.left + bounds.left;
	var y = location.top + bounds.top;
	//通过文字对齐方式计算起始X位置
	switch(this.style.textAlign) {
		case 'right': {
			x += location.width;
			break;
		}
		case 'center': {
			x += location.width / 2;
			break;
		}
	}
	//通过垂直对齐方式计算起始Y值
	switch(this.style.textBaseline) {
		case 'bottom': {
			y += location.height;
			break;
		}
		case 'hanging':
		case 'alphabetic':
		case 'middle' : {
			y += location.height/2;
			break;
		}

	}

	var txt = this.text;
	if(txt) {
		if(this.style.fill && this.context.fillText) {
			if(this.style.maxWidth) {
				this.context.fillText(txt,x,y,this.style.maxWidth);
			}
			else {
				this.context.fillText(txt,x,y);
			}
		}
		else if(this.context.strokeText) {
			if(this.style.maxWidth) {
				this.context.strokeText(txt,x,y,this.style.maxWidth);
			}
			else {
				this.context.strokeText(txt,x,y);
			}
		}
	}
	//如果有指定边框，则画出边框
	if(this.style.border) {
		//如果指定了边框样式
		if(this.style.border.style) {
			this.context.save();
			this.setStyle(this.style.border.style);
		}
		this.context.moveTo(this.points[0].x + bounds.left,this.points[0].y + bounds.top);
		if(this.style.border.top) {
			this.context.lineTo(this.points[1].x + bounds.left,this.points[1].y + bounds.top);
		}
		
		if(this.style.border.right) {
			this.context.moveTo(this.points[1].x + bounds.left,this.points[1].y + bounds.top);
			this.context.lineTo(this.points[2].x + bounds.left,this.points[2].y + bounds.top);
		}
		
		if(this.style.border.bottom) {
			this.context.moveTo(this.points[2].x + bounds.left,this.points[2].y + bounds.top);
			this.context.lineTo(this.points[3].x + bounds.left,this.points[3].y + bounds.top);
		}
		
		if(this.style.border.left) {
			this.context.moveTo(this.points[3].x + bounds.left,this.points[3].y + bounds.top);	
			this.context.lineTo(this.points[0].x + bounds.left,this.points[0].y + bounds.top);
		}
		//如果指定了边框颜色
		if(this.style.border.style) {
			this.context.restore();
		}	
	}
	
}

if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['label'] = jmLabel;
}
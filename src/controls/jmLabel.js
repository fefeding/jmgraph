import {jmControl} from "../shapes/jmControl.js";
/**
 * 显示文字控件
 *
 * @class jmLabel
 * @extends jmControl
 * @param {object} params params参数:style=样式，value=显示的文字
 */
class jmLabel extends jmControl {

	constructor(params, t) {
		params = params || {};
		super(params, t||'jmLabel');

		this.style.font = this.style.font || "15px Arial";
		this.style.fontFamily = this.style.fontFamily || 'Arial';
		this.style.fontSize = this.style.fontSize || 15;

		// 显示不同的 textAlign 值
		//文字水平对齐
		this.style.textAlign = this.style.textAlign || 'left';
		//文字垂直对齐
		this.style.textBaseline = this.style.textBaseline || 'middle';
		this.text = params.text || '';

		this.center = params.center || null;
	}

	/**
	 * 显示的内容
	 * @property text
	 * @type {string}
	 */
	get text() {
		return this.__pro('text');
	}
	set text(v) {
		this.needUpdate = true;
		return this.__pro('text', v);
	}

	/**
	 * 中心点
	 * point格式：{x:0,y:0,m:true}
	 * @property center
	 * @type {point}
	 */
	get center() {
		return this.__pro('center');
	}
	set center(v) {
		this.needUpdate = true;
		return this.__pro('center', v);
	}	

	/**
	 * 当前位置左上角
	 * @property position
	 * @type {point}
	 */
	get position() {
		return this.__pro('position');
	}
	set position(v) {
		this.needUpdate = true;
		return this.__pro('position', v);
	}

	/**
	 * 在基础的getLocation上，再加上一个特殊的center处理
	 * 
	 * @method getLocation
	 * @returns {Object}
	 */
	getLocation() {
		let location = super.getLocation();
		let size = this.testSize();	
		
		location.width = location.width || size.width;
		location.height = location.height || size.height;	

		//如果没有指定位置，但指定了中心，则用中心来计算坐标
		if(!location.left && !location.top && location.center) {
			location.left = location.center.x - location.width / 2;
			location.top = location.center.y - location.height / 2;
		}
		return location;
	}

	/**
	 * 初始化图形点,主要用于限定控件边界。
	 *
	 * @method initPoints
	 * @return {array} 所有边界点数组
	 * @private
	 */
	initPoints() {	
		this.__size = null;
		let location = this.getLocation();

		this.points = [{x: location.left, y: location.top}];
		this.points.push({x: location.left + location.width, y: location.top});
		this.points.push({x: location.left + location.width, y: location.top + location.height});
		this.points.push({x: location.left, y: location.top + location.height});
		return this.points;
	}

	/**
	 * 测试获取文本所占大小
	 *
	 * @method testSize
	 * @return {object} 含文本大小的对象
	 */
	testSize() {
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
	draw() {	
		
		//获取当前控件的绝对位置
		let bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;		
		let size = this.testSize();
		let location = this.location;
		let x = location.left + bounds.left;
		let y = location.top + bounds.top;
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

		let txt = this.text;
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
}

export { jmLabel };
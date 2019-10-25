import {jmPath} from "./jmPath.js";
/**
 * 画矩形
 *
 * @class jmRect
 * @extends jmPath
 * @param {object} params 参数 position=矩形左上角顶点坐标,width=宽，height=高,radius=边角弧度
 */ 
class jmRect extends jmPath {		

	constructor(params, t='jmRect') {
		params = params||{};
		super(params, t);

		this.style.close = true;
		this.radius = params.radius || this.style.radius || 0;
	}
	/**
	 * 圆角半径
	 * @property radius
	 * @type {number}
	 */
	get radius() {
		return this.__pro('radius');
	}
	set radius(v) {
		this.needUpdate = true;
		return this.__pro('radius', v);
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
	 * 获取当前控件的边界
	 *
	 * @method getBounds
	 * @return {bound} 当前控件边界
	 */
	getBounds() {
		let rect = {};
		this.initPoints();
		let p = this.getLocation();
		rect.left = p.left; 
		rect.top = p.top; 
		
		rect.right = p.left + p.width; 
		rect.bottom = p.top + p.height; 
		
		rect.width = rect.right - rect.left;
		rect.height = rect.bottom - rect.top;
		return rect;
	}
	
	/**
	 * 重写检查坐标是否在区域内
	 *
	 * @method checkPoint
	 * @param {point} p 待检查的坐标
	 * @return {boolean} 如果在则返回true,否则返回false
	 */
	/*checkPoint(p) {	
		//生成当前坐标对应的父级元素的相对位置
		let abounds = this.bounds || this.getBounds();

		if(p.x > abounds.right || p.x < abounds.left) {
			return false;
		}
		if(p.y > abounds.bottom || p.y < abounds.top) {
			return false;
		}
		
		return true;
	}*/

	/**
	 * 初始化图形点
	 * 如果有边角弧度则类型圆绝计算其描点
	 * 
	 * @method initPoints
	 * @private
	 */
	initPoints() {
		let location = this.getLocation();	
		let p1 = {x:location.left,y:location.top};
		let p2 = {x:location.left + location.width,y:location.top};
		let p3 = {x:location.left + location.width,y:location.top + location.height};
		let p4 = {x:location.left,y:location.top + location.height};

		//如果指定为虚线 , 则初始化一个直线组件，来构建虚线点集合
		if(this.style.lineType === 'dotted' && !this.dottedLine) {
			this.dottedLine = this.graph.createShape('line', {style: this.style});
		}
		
		//如果有边界弧度则借助圆弧对象计算描点
		if(location.radius && location.radius < location.width/2 && location.radius < location.height/2) {
			let q = Math.PI / 2;
			let arc = this.graph.createShape('arc',{radius:location.radius,anticlockwise:false});
			arc.center = {x:location.left + location.radius,y:location.top+location.radius};
			arc.startAngle = Math.PI;
			arc.endAngle = Math.PI + q;
			let ps1 = arc.initPoints();
			
			arc = this.graph.createShape('arc',{radius:location.radius,anticlockwise:false});
			arc.center = {x:p2.x - location.radius,y:p2.y + location.radius};
			arc.startAngle = Math.PI + q;
			arc.endAngle = Math.PI * 2;
			let ps2 = arc.initPoints();
			
			arc = this.graph.createShape('arc',{radius:location.radius,anticlockwise:false});
			arc.center = {x:p3.x - location.radius,y:p3.y - location.radius};
			arc.startAngle = 0;
			arc.endAngle = q;
			let ps3 = arc.initPoints();
			
			arc = this.graph.createShape('arc',{radius:location.radius,anticlockwise:false});
			arc.center = {x:p4.x + location.radius,y:p4.y - location.radius};
			arc.startAngle = q;
			arc.endAngle = Math.PI;
			let ps4 = arc.initPoints();
			this.points = ps1.concat(ps2,ps3,ps4);
		}
		else {
			this.points = [];
			this.points.push(p1);
			//如果是虚线
			if(this.dottedLine) {
				this.dottedLine.start = p1;
				this.dottedLine.end = p2;
				this.points = this.points.concat(this.dottedLine.initPoints());
			}
			this.points.push(p2);
			//如果是虚线
			if(this.dottedLine) {
				this.dottedLine.start = p2;
				this.dottedLine.end = p3;
				this.points = this.points.concat(this.dottedLine.initPoints());
			}
			this.points.push(p3);
			//如果是虚线
			if(this.dottedLine) {
				this.dottedLine.start = p3;
				this.dottedLine.end = p4;
				this.points = this.points.concat(this.dottedLine.initPoints());
			}
			this.points.push(p4);
			//如果是虚线
			if(this.dottedLine) {
				this.dottedLine.start = p4;
				this.dottedLine.end = p1;
				this.points = this.points.concat(this.dottedLine.initPoints());
			}
		}		
		
		return this.points;
	}
}

export { jmRect };

import {jmPath} from "../core/jmPath.js";
import {jmArc} from './jmArc.js';
import {jmLine} from './jmLine.js';
import {jmBorder} from "../core/jmBorder.js";

/**
 * 画矩形
 *
 * @class jmRect
 * @extends jmPath
 * @param {object} params 参数 position=矩形左上角顶点坐标,width=宽，height=高,radius=边角弧度
 *   radius支持数字(四角相同)或对象 { topLeft, topRight, bottomRight, bottomLeft }
 */ 
export default class jmRect extends jmPath {		

	constructor(params, t='jmRect') {
		params = params||{};
		params.isRegular = true;// 规则的
		super(params, t);

		this.style.close = true;
		const r = params.radius || this.style.radius || this.style.borderRadius || 0;
		if(typeof r === 'object' && r !== null) {
			// 四角独立圆角
			this.radius = {
				topLeft: Number(r.topLeft) || 0,
				topRight: Number(r.topRight) || 0,
				bottomRight: Number(r.bottomRight) || 0,
				bottomLeft: Number(r.bottomLeft) || 0
			};
		}
		else {
			this.radius = r;
		}

		// 解析border样式中的圆角
		if(this.style.border) {
			let border = this.style.border;
			if(typeof border === 'string') border = new jmBorder(border);
			if(border instanceof jmBorder && border.radius) {
				if(typeof border.radius === 'object') {
					this.radius = border.radius;
				}
				else if(border.radius > 0) {
					this.radius = border.radius;
				}
			}
		}
	}
	/**
	 * 圆角半径，支持数字或四角独立对象
	 * @property radius
	 * @type {number|object}
	 */
	get radius() {
		return this.property('radius');
	}
	set radius(v) {
		this.needUpdate = true;
		return this.property('radius', v);
	}

	/**
	 * 获取规范化的圆角值（四角独立）
	 * @returns {object} { topLeft, topRight, bottomRight, bottomLeft }
	 */
	getNormalizedRadius() {
		const r = this.radius;
		if(typeof r === 'number') {
			const v = Math.max(0, r);
			return { topLeft: v, topRight: v, bottomRight: v, bottomLeft: v };
		}
		if(typeof r === 'object' && r !== null) {
			return {
				topLeft: Math.max(0, Number(r.topLeft) || 0),
				topRight: Math.max(0, Number(r.topRight) || 0),
				bottomRight: Math.max(0, Number(r.bottomRight) || 0),
				bottomLeft: Math.max(0, Number(r.bottomLeft) || 0)
			};
		}
		return { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 };
	}

	/**
	 * 检查是否有圆角
	 * @returns {boolean}
	 */
	hasRadius() {
		const nr = this.getNormalizedRadius();
		return nr.topLeft > 0 || nr.topRight > 0 || nr.bottomRight > 0 || nr.bottomLeft > 0;
	}	

	/**
	 * 当前位置左上角
	 * @property position
	 * @type {point}
	 */
	get position() {
		return this.property('position');
	}
	set position(v) {
		this.needUpdate = true;
		return this.property('position', v);
	}

	/**
	 * 获取当前控件的边界
	 *
	 * @method getBounds
	 * @return {bound} 当前控件边界
	 */
	getBounds(isReset) {
		//如果当次计算过，则不重复计算
		if(this.bounds && !isReset) return this.bounds;
		let rect = {};
		this.initPoints();
		let p = this.getLocation();
		rect.left = p.left; 
		rect.top = p.top; 
		
		rect.right = p.left + p.width; 
		rect.bottom = p.top + p.height; 
		
		rect.width = rect.right - rect.left;
		rect.height = rect.bottom - rect.top;

		return this.bounds=rect;
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
	 * 支持四角独立圆角，借助圆弧对象计算描点
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
			this.dottedLine = this.graph.createShape(jmLine, {style: this.style});
		}
		
		const nr = this.getNormalizedRadius();
		const hasRadius = this.hasRadius();

		// 如果有圆角（支持四角独立），借助圆弧对象计算描点
		if(hasRadius) {
			let q = Math.PI / 2;

			// 限制圆角不超过短边的一半
			const maxR = Math.min(location.width / 2, location.height / 2);
			const rtl = Math.min(nr.topLeft, maxR);
			const rtr = Math.min(nr.topRight, maxR);
			const rbr = Math.min(nr.bottomRight, maxR);
			const rbl = Math.min(nr.bottomLeft, maxR);

			// 左上角圆弧
			if(rtl > 0) {
				let arc = this.graph.createShape(jmArc,{radius:rtl,anticlockwise:false});
				arc.center = {x:location.left + rtl, y:location.top + rtl};
				arc.startAngle = Math.PI;
				arc.endAngle = Math.PI + q;
				var ps1 = arc.initPoints();
			}
			else {
				var ps1 = [p1];
			}

			// 右上角圆弧
			if(rtr > 0) {
				let arc = this.graph.createShape(jmArc,{radius:rtr,anticlockwise:false});
				arc.center = {x:p2.x - rtr, y:p2.y + rtr};
				arc.startAngle = Math.PI + q;
				arc.endAngle = Math.PI * 2;
				var ps2 = arc.initPoints();
			}
			else {
				var ps2 = [p2];
			}

			// 右下角圆弧
			if(rbr > 0) {
				let arc = this.graph.createShape(jmArc,{radius:rbr,anticlockwise:false});
				arc.center = {x:p3.x - rbr, y:p3.y - rbr};
				arc.startAngle = 0;
				arc.endAngle = q;
				var ps3 = arc.initPoints();
			}
			else {
				var ps3 = [p3];
			}

			// 左下角圆弧
			if(rbl > 0) {
				let arc = this.graph.createShape(jmArc,{radius:rbl,anticlockwise:false});
				arc.center = {x:p4.x + rbl, y:p4.y - rbl};
				arc.startAngle = q;
				arc.endAngle = Math.PI;
				var ps4 = arc.initPoints();
			}
			else {
				var ps4 = [p4];
			}
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

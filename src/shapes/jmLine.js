import {jmPath} from "../core/jmPath.js";
/**
 * 画一条直线
 *
 * @class jmLine
 * @extends jmPath
 * @param {object} params 直线参数:start=起始点,end=结束点,lineType=线类型(solid=实线，dotted=虚线),dashLength=虚线间隔(=4)
 */
export default class jmLine extends jmPath {	
	
	constructor(params, t='jmLine') {
		super(params, t);

		this.start = params.start || {x:0,y:0};
		this.end = params.end || {x:0,y:0};
		this.style.lineType = this.style.lineType || 'solid';
		this.style.dashLength = this.style.dashLength || 4;
		this.style.close = false;
	}	

	/**
	 * 控制起始点
	 * 
	 * @property start
	 * @for jmLine
	 * @type {point}
	 */
	get start() {
		return this.property('start');
	}
	set start(v) {
		this.needUpdate = true;
		return this.property('start', v);
	}

	/**
	 * 控制结束点
	 * 
	 * @property end
	 * @for jmLine
	 * @type {point}
	 */
	get end() {
		return this.property('end');
	}
	set end(v) {
		this.needUpdate = true;
		return this.property('end', v);
	}

	/**
	 * 初始化图形点,如呆为虚线则根据跳跃间隔描点
	 * @method initPoints
	 * @private
	 */
	initPoints() {	
		const start = this.start;
		const end = this.end;
		this.points = [];	
		this.points.push(start);

		if(this.style.lineType === 'dotted') {			
			let dx = end.x - start.x;
			let dy = end.y - start.y;
			const lineLen = Math.sqrt(dx * dx + dy * dy);
			dx = dx / lineLen;
			dy = dy / lineLen;
			let dottedstart = false;

			const dashLen = this.style.dashLength || 5;
			const dottedsp = dashLen / 2;
			for(let l=dashLen; l<=lineLen;) {
				const p = {
					x: start.x + dx * l, 
					y: start.y + dy * l
				};
				if(dottedstart === false) {					
					l += dottedsp;
				}
				else {				
					p.m = true;// 移动到当时坐标
					l += dashLen;
				}
				this.points.push(p);
				dottedstart = !dottedstart;				
			}
		}
		this.points.push(end);
		return this.points;
	}
}

export { jmLine };
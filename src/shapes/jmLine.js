import {jmPath} from "./jmPath.js";
/**
 * 画一条直线
 *
 * @class jmLine
 * @extends jmPath
 * @param {object} params 直线参数:start=起始点,end=结束点,lineType=线类型(solid=实线，dotted=虚线),dashLength=虚线间隔(=4)
 */
class jmLine extends jmPath {	
	
	constructor(params, t='jmLine') {
		super(params, t);

		this.start = params.start || {x:0,y:0};
		this.end = params.end || {x:0,y:0};
		this.style.lineType = this.style.lineType || 'solid';
		this.style.dashLength = this.style.dashLength || 4;
	}	

	/**
	 * 控制起始点
	 * 
	 * @property start
	 * @for jmLine
	 * @type {point}
	 */
	get start() {
		return this.__pro('start');
	}
	set start(v) {
		this.needUpdate = true;
		return this.__pro('start', v);
	}

	/**
	 * 控制结束点
	 * 
	 * @property end
	 * @for jmLine
	 * @type {point}
	 */
	get end() {
		return this.__pro('end');
	}
	set end(v) {
		this.needUpdate = true;
		return this.__pro('end', v);
	}

	/**
	 * 初始化图形点,如呆为虚线则根据跳跃间隔描点
	 * @method initPoints
	 * @private
	 */
	initPoints() {	
		let start = this.start;
		let end = this.end;
		this.points = [];	
		this.points.push(start);

		if(this.style.lineType === 'dotted') {			
			let dx = end.x - start.x;
			let dy = end.y - start.y;
			let lineLen = Math.sqrt(dx * dx + dy * dy);
			dx = dx / lineLen;
			dy = dy / lineLen;
			let dottedstart = false;

			let dashLen = this.style.dashLength || 5;
			let dottedsp = dashLen / 2;
			for(let l=dashLen; l<=lineLen;) {
				if(dottedstart == false) {
					this.points.push({x: start.x + dx * l, y: start.y + dy * l});
					l += dottedsp;
				}
				else {				
					this.points.push({x: start.x + dx * l, y: start.y+ dy * l, m: true});
					l += dashLen;
				}
				dottedstart = !dottedstart;				
			}
		}
		this.points.push(end);
		return this.points;
	}
}

export { jmLine };
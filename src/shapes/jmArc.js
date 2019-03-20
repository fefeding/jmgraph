import {jmPath} from "./jmPath.js";
/**
 * 圆弧图型 继承自jmPath
 *
 * @class jmArc
 * @extends jmPath
 * @param {object} params center=当前圆弧中心,radius=圆弧半径,start=圆弧起始角度,end=圆弧结束角度,anticlockwise=  false  顺时针，true 逆时针
 */
class jmArc extends jmPath {

	constructor(params, t='jmArc') {
		if(!params) params = {};
		super(params, t);

		this.center = params.center || {x:0,y:0};
		this.radius = params.radius || 0;

		this.startAngle = params.start || params.startAngle || 0;
		this.endAngle = params.end || params.endAngle || Math.PI * 2;		

		this.anticlockwise = params.anticlockwise  || 0;
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
	 * 半径
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
	 * 扇形起始角度
	 * @property startAngle
	 * @type {number}
	 */
	get startAngle() {
		return this.__pro('startAngle');
	}
	set startAngle(v) {
		this.needUpdate = true;
		return this.__pro('startAngle', v);
	}

	/**
	 * 扇形结束角度
	 * @property endAngle
	 * @type {number}
	 */
	get endAngle() {
		return this.__pro('endAngle');
	}
	set endAngle(v) {
		this.needUpdate = true;
		return this.__pro('endAngle', v);
	}

	/**
	 * 可选。规定应该逆时针还是顺时针绘图
	 * false  顺时针，true 逆时针
	 * @property anticlockwise
	 * @type {boolean}
	 */
	get anticlockwise() {
		return this.__pro('anticlockwise');
	}
	set anticlockwise(v) {
		this.needUpdate = true;
		return this.__pro('anticlockwise', v);
	}


	/**
	 * 初始化图形点
	 * 
	 * @method initPoint
	 * @private
	 * @for jmArc
	 */
	initPoints() {
		let location = this.getLocation();//获取位置参数
		let mw = 0;
		let mh = 0;
		let cx = location.center.x ;
		let cy = location.center.y ;
		//如果设定了半径。则以半径为主	
		if(location.radius) {
			mw = mh = location.radius;
		}
		else {
			mw = location.width / 2;
			mh = location.height / 2;
		}	
		
		let start = this.startAngle;
		let end = this.endAngle;

		if((mw == 0 && mh == 0) || start == end) return;

		let anticlockwise = this.anticlockwise;
		this.points = [];
		let step = 1 / Math.max(mw, mh);

		//如果是逆时针绘制，则角度为负数，并且结束角为2Math.PI-end
		if(anticlockwise) {
			let p2 =  Math.PI * 2;
			start = p2 - start;
			end = p2 - end;
		}
		if(start > end) step = -step;
		
		//椭圆方程x=a*cos(r) ,y=b*sin(r)	
		for(let r=start;;r += step) {	
			if(step > 0 && r > end) r = end;
			else if(step < 0 && r < end) r = end;

			let p = {
				x : Math.cos(r) * mw + cx,
				y : Math.sin(r) * mh + cy
			};
			this.points.push(p);

			if(r == end) break;
		}
		return this.points;
	}
}

export { jmArc };
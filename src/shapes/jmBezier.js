import {jmPath} from "./jmPath.js";
/**
 * 贝塞尔曲线,继承jmPath
 * N阶，参数points中为控制点
 *
 * @class jmBezier
 * @extends jmPath
 * @param {object} params 参数
 */ 
class jmBezier extends jmPath {	
	
	constructor(params, t='jmBezier') {
		// 典线默认不封闭
		if(params.style && typeof params.style.close !== true) {
			params.style.close = false;
		}

		super(params, t);
		this.cpoints = params.points || [];
	}	
	
	/**
	 * 控制点
	 *
	 * @property cpoints
	 * @for jmBezier
	 * @type {array}
	 */
	get cpoints() {
		return this.__pro('cpoints');
	}
	set cpoints(v) {
		this.needUpdate = true;
		return this.__pro('cpoints', v);
	}
	
	/**
	 * 初始化图形点
	 *
	 * @method initPoints
	 * @private
	 */
	initPoints() {
		
		this.points = [];
		
		let cps = this.cpoints;
		for(let t = 0;t <= 1;t += 0.01) {
			let p = this.getPoint(cps,t);
			this.points.push(p);
		}	
		this.points.push(cps[cps.length - 1]);
		return this.points;
	}

	/**
	 * 根据控制点和参数t生成贝塞尔曲线轨迹点
	 *
	 * @method getPoint
	 * @param {array} ps 控制点集合
	 * @param {number} t 参数(0-1)
	 * @return {array} 所有轨迹点的数组
	 */
	getPoint(ps, t) {
		if(ps.length == 1) return ps[0];
		if(ps.length == 2) {					
			let p = {};
			p.x = (ps[1].x - ps[0].x) * t + ps[0].x;
			p.y = (ps[1].y - ps[0].y) * t + ps[0].y;
			return p;	
		}
		if(ps.length > 2) {
			let nps = [];
			for(let i = 0;i < ps.length - 1;i++) {
				let p = this.getPoint([ps[i],ps[i+1]],t);
				if(p) nps.push(p);
			}
			return this.getPoint(nps,t);
		}
	}

	/**
	 * 对控件进行平移
	 * 遍历控件所有描点或位置，设置其偏移量。
	 *
	 * @method offset
	 * @param {number} x x轴偏移量
	 * @param {number} y y轴偏移量
	 * @param {boolean} [trans] 是否传递,监听者可以通过此属性是否决定是否响应移动事件,默认=true
	 */
	offset(x, y, trans) {	
		let p = this.cpoints;
		if(p) {			
			let len = p.length;
			for(let i=0; i < len;i++) {
				p[i].x += x;
				p[i].y += y;
			}		
			
			//触发控件移动事件	
			this.emit('move',{
				offsetX: x,
				offsetY: y,
				trans: trans
			});
			this.getLocation(true);	//重置
		}
	}
}

export { jmBezier };
import {jmUtils} from "../common/jmUtils.js";
import {jmList} from "../common/jmList.js";

/**
 * 渐变类
 *
 * @class jmGradient
 * @param {object} op 渐变参数,type:[linear= 线性渐变,radial=放射性渐变] 
 */
class jmGradient {
	constructor(opt) {
		this.stops = new jmList();

		if(opt && typeof opt == 'object') {
			for(let k in opt) {
				this[k] = opt[k];
			}
		}
		//解析字符串格式
		//linear-gradient(direction, color-stop1, color-stop2, ...);
		//radial-gradient(center, shape size, start-color, ..., last-color);
		else if(typeof opt == 'string') {
			this.fromString(opt);
		}
	}
	/**
	 * 添加渐变色
	 * 
	 * @method addStop
	 * @for jmGradient
	 * @param {number} offset 放射渐变颜色偏移,可为百分比参数。
	 * @param {string} color 当前偏移颜色值
	 */
	addStop(offset, color) {
		this.stops.add({
			offset:offset,
			color:color
		});
	}

	/**
	 * 生成为canvas的渐变对象
	 *
	 * @method toGradient
	 * @for jmGradient
	 * @param {jmControl} control 当前渐变对应的控件
	 * @return {gradient} canvas渐变对象
	 */
	toGradient(control) {
		let gradient;
		let context = control.context || control;
		let bounds = control.absoluteBounds?control.absoluteBounds:control.getAbsoluteBounds();
		let x1 = this.x1||0;
		let y1 = this.y1||0;
		let x2 = this.x2;
		let y2 = this.y2;

		let location = control.getLocation();

		let d = 0;
		if(location.radius) {
			d = location.radius * 2;				
		}
		if(!d) {
			d = Math.min(location.width,location.height);				
		}

		//let offsetLine = 1;//渐变长度或半径
		//处理百分比参数
		if(jmUtils.checkPercent(x1)) {
			x1 = jmUtils.percentToNumber(x1) * (location.width || d);
		}
		if(jmUtils.checkPercent(x2)) {
			x2 = jmUtils.percentToNumber(x2) * (location.width || d);
		}
		if(jmUtils.checkPercent(y1)) {
			y1 = jmUtils.percentToNumber(y1) * (location.height || d);
		}
		if(jmUtils.checkPercent(y2)) {
			y2 = jmUtils.percentToNumber(y2) * (location.height || d);
		}	

		let sx1 = Number(x1) + bounds.left;
		let sy1 = Number(y1) + bounds.top;
		let sx2 = Number(x2) + bounds.left;
		let sy2 = Number(y2) + bounds.top;
		if(this.type === 'linear') {		
			gradient = context.createLinearGradient(sx1, sy1, sx2, sy2);	
			//let x = Math.abs(x2-x1);
			//let y = Math.abs(y2-y1);
			//offsetLine = Math.sqrt(x*x + y*y);
		}
		else if(this.type === 'radial') {
			let r1 = this.r1||0;
			let r2 = this.r2;
			if(jmUtils.checkPercent(r1)) {
				r1 = jmUtils.percentToNumber(r1);			
				r1 = d * r1;
			}
			if(jmUtils.checkPercent(r2)) {
				r2 = jmUtils.percentToNumber(r2);
				r2 = d * r2;
			}	
			//offsetLine = Math.abs(r2 - r1);//二圆半径差
			//小程序的接口特殊
			if(context.createCircularGradient) { 
				gradient = context.createCircularGradient(sx1, sy1, r2);
			}
			else {
				gradient = context.createRadialGradient(sx1, sy1, r1, sx2, sy2, r2);	
			}	
		}
		//颜色渐变
		this.stops.each(function(i,s) {	
			let c = jmUtils.toColor(s.color);
			//s.offset 0.0 ~ 1.0
			gradient.addColorStop(s.offset, c);		
		});
		
		return gradient;
	}

	/**
	 * 变换为字条串格式
	 * linear-gradient(x1 y1 x2 y2, color1 step, color2 step, ...);	//radial-gradient(x1 y1 r1 x2 y2 r2, color1 step,color2 step, ...);
	 * linear-gradient线性渐变，x1 y1表示起点，x2 y2表示结束点,color表颜色，step为当前颜色偏移
	 * radial-gradient径向渐变,x1 y1 r1分别表示内圆中心和半径，x2 y2 r2为结束圆 中心和半径，颜色例似线性渐变 step为0-1之间
	 *
	 * @method fromString
	 * @for jmGradient
	 * @return {string} 
	 */
	fromString(s) {
		if(!s) return;
		let ms = s.match(/(linear|radial)-gradient\s*\(\s*([^,]+[^\)]+)\)/i);
		if(!ms || ms.length < 3) return;
		this.type = ms[1].toLowerCase();
		let pars = ms[2].split(',');
		if(pars.length) {
			let ps = jmUtils.trim(pars[0]).split(/\s+/);
			//线性渐变
			if(this.type == 'linear') {
				if(ps.length <= 2) {
					this.x2 = ps[0];
					this.y2 = ps[1]||0;
				}
				else {
					this.x1 = ps[0];
					this.y1 = ps[1];
					this.x2 = ps[2];
					this.y2 = ps[3];
				}
			}
			//径向渐变
			else {
				if(ps.length <= 3) {
					this.x2 = ps[0];
					this.y2 = ps[1]||0;
					this.r2 = ps[2]||0;
				}
				else {
					this.x1 = ps[0];
					this.y1 = ps[1];
					this.r1 = ps[2];
					this.x2 = ps[3];
					this.y2 = ps[3];
					this.r2 = ps[3];
				}
			}
			//解析颜色偏移
			//color step
			if(pars.length > 1) {
				for(let i=1;i<pars.length;i++) {
					let cs = jmUtils.trim(pars[i]).split(/\s+/);
					if(cs.length) {
						this.addStop(cs[1]||0, cs[0]);
					}
				}
			}
		}
	}

	/**
	 * 转换为渐变的字符串表达
	 *
	 * @method toString
	 * @for jmGradient
	 * @return {string} linear-gradient(x1 y1 x2 y2, color1 step, color2 step, ...);	//radial-gradient(x1 y1 r1 x2 y2 r2, color1 step,color2 step, ...);
	 */
	toString() {
		let str = this.type + '-gradient(';
		if(this.type == 'linear') {
			str += this.x1 + ' ' + this.y1 + ' ' + this.x2 + ' ' + this.y2;
		}
		else {
			str += this.x1 + ' ' + this.y1 + ' ' + this.r1 + ' ' + this.x2 + ' ' + this.y2 + ' ' + this.r2;
		}
		//颜色渐变
		this.stops.each(function(i,s) {	
			str += ',' + s.color + ' ' + s.offset;
		});
		return str + ')';
	}
}

export { jmGradient };




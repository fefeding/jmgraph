import jmControl from "../common/jmControl.js";
/**
 * 基础路径,大部分图型的基类
 * 指定一系列点，画出图形
 *
 * @class jmPath
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 画布
 * @param {object} params 路径参数 points=所有描点
 */

class jmPath extends jmControl {
	/**
	 * 当前对象类型名jmPath
	 *
	 * @property type
	 * @type string
	 */
	type = 'jmPath';

	constructor(params) {
		super(params);		
		this.points = params && params.points ? params.points : [];		
	}
	
	/**
	 * 描点集合
	 * point格式：{x:0,y:0,m:true}
	 * @property points
	 * @type {array}
	 */
	get points() {
		let s = this.__pro('points');
		return s;
	}
	set points(v) {
		return this.__pro('points', v);
	}

	/**
	 * 绘制控件
	 * 在画布上描点
	 * 
	 * @method draw
	 */
	draw() {	
		if(this.points && this.points.length > 0) {
			//获取当前控件的绝对位置
			let bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
			
			this.context.moveTo(this.points[0].x + bounds.left,this.points[0].y + bounds.top);
			let len = this.points.length;			
			for(let i=1; i < len;i++) {
				let p = this.points[i];
				//移至当前坐标
				if(p.m) {
					this.context.moveTo(p.x + bounds.left,p.y + bounds.top);
				}
				else {
					this.context.lineTo(p.x+ bounds.left,p.y + bounds.top);
				}			
			}		
		}	
	}
}

export default jmPath;

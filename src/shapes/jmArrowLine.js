/**
 * @fileoverview jmArrowLine 带箭头的直线类
 * 
 * jmArrowLine 提供了带箭头直线的绘制功能。
 * 继承自 jmLine，在直线末端添加箭头。
 * 
 * 主要功能：
 * - 带箭头的直线绘制
 * - 支持虚线模式
 * - 可控制箭头显示
 * 
 * @module jmArrowLine
 * @author jmGraph Team
 * @license MIT
 */

import {jmLine} from "./jmLine.js";
import {jmArrow} from "./jmArrow.js";

/**
 * 带箭头的直线类
 * 
 * 绘制带箭头的直线，继承自 jmLine。
 * 箭头位于直线的末端。
 *
 * @class jmArrowLine
 * @extends jmLine
 * @param {object} params 直线参数
 * @param {object} [params.start] 直线起始点 {x, y}
 * @param {object} [params.end] 直线终结点 {x, y}
 * @param {boolean} [params.arrowVisible=true] 是否显示箭头
 * 
 * @example
 * // 创建带箭头的直线
 * const arrowLine = graph.createShape('arrowLine', {
 *     start: {x: 100, y: 100},
 *     end: {x: 200, y: 100},
 *     style: { stroke: '#000', lineWidth: 2 }
 * });
 */	
export default class jmArrowLine extends jmLine {	

	constructor(params, t) {

		params.start = params.start || {x:0,y:0};
		params.end = params.end || {x:0,y:0};

		super(params, t||'jmArrowLine');
		this.style.lineJoin = this.style.lineJoin || 'miter';
		this.arrow = new jmArrow(params);
	}

	/**
	 * 初始化直线和箭头描点
	 *
	 * @method initPoints
	 * @private
	 */
	initPoints() {	
		this.points = super.initPoints();
		if(this.arrowVisible !== false) {
			this.points = this.points.concat(this.arrow.initPoints());
		}
		return this.points;
	}
}

export { jmArrowLine };
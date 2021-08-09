import {jmLine} from "./jmLine.js";
import {jmArrow} from "./jmArrow.js";
/**
 * 带箭头的直线,继承jmPath
 *
 * @class jmArrowLine
 * @extends jmLine
 * @param {object} params 生成当前直线的参数对象，(style=当前线条样式,start=直线起始点,end=直线终结点)
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
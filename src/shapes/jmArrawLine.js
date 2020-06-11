import {jmLine} from "./jmLine.js";
import {jmArraw} from "./jmArraw.js";
/**
 * 带箭头的直线,继承jmPath
 *
 * @class jmArrawLine
 * @extends jmLine
 * @param {object} params 生成当前直线的参数对象，(style=当前线条样式,start=直线起始点,end=直线终结点)
 */	
export default class jmArrawLine extends jmLine {	

	constructor(params, t) {
		
		this.start = params.start || {x:0,y:0};
		this.end = params.end || {x:0,y:0};

		super(params, t||'jmArrawLine');
		this.style.lineJoin = this.style.lineJoin || 'miter';
		this.arraw = new jmArraw(params);
	}

	/**
	 * 初始化直线和箭头描点
	 *
	 * @method initPoints
	 * @private
	 */
	initPoints() {	
		this.points = super.initPoints();
		if(this.arrawVisible !== false) {
			this.points = this.points.concat(this.arraw.initPoints());
		}
		return this.points;
	}
}

export { jmArrawLine };
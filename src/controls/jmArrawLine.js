import jmLine from "../shapes/jmLine.js";
import jmArraw from "../shapes/jmArraw.js";
/**
 * 带箭头的直线,继承jmPath
 *
 * @class jmArrawLine
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 当前画布
 * @param {object} params 生成当前直线的参数对象，(style=当前线条样式,start=直线起始点,end=直线终结点)
 */	
class jmArrawLine extends jmLine {	

	constructor(params) {
		super(params);
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

export default jmArrawLine;
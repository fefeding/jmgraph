import {jmPath} from "./jmPath.js";
/**
 * 画棱形
 *
 * @class jmPrismatic
 * @extends jmPath
 * @param {object} params 参数 center=棱形中心点，width=棱形宽,height=棱形高
 */
class jmPrismatic extends jmPath {	
	
	constructor(params, t='jmPrismatic') {
		super(params, t);
		this.style.close = typeof this.style.close == 'undefined'? true : this.style.close;

		this.center = params.center || {x:0,y:0};
		this.width = params.width || 0;

		//this.on('PropertyChange',this.initPoints);
		this.height = params.height  || 0;
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
	 * 初始化图形点
	 * 计算棱形顶点
	 * 
	 * @method initPoints
	 * @private
	 */
	initPoints() {		
		let location = this.getLocation();
		let mw = location.width / 2;
		let mh = location.height / 2;
		
		this.points = [];
		this.points.push({x:location.center.x - mw, y:location.center.y});
		this.points.push({x:location.center.x, y:location.center.y + mh});
		this.points.push({x:location.center.x + mw, y:location.center.y});
		this.points.push({x:location.center.x, y:location.center.y - mh});
	}
}

export { jmPrismatic };
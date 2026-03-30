import {jmPath} from "../core/jmPath.js";

/**
 * 画多边形
 * 支持规则多边形（正多边形）和自定义多边形
 * 规则多边形通过边数和半径自动计算顶点，自定义多边形通过顶点数组定义
 *
 * @class jmPolygon
 * @extends jmPath
 * @param {object} params 多边形的参数
 * @param {array} [params.points] 自定义顶点数组，如果提供则忽略sides和radius
 * @param {number} [params.sides=3] 多边形边数（3-100）
 * @param {number} [params.radius=50] 多边形半径（像素）
 * @param {object} [params.center={x:0,y:0}] 多边形中心点坐标
 */
export default class jmPolygon extends jmPath {
	
	constructor(params, t='jmPolygon') {
		params = params || {};
		params.isRegular = true; // 标记为规则图形，便于优化渲染
		super(params, t);

		// 参数验证和初始化
		this.sides = params.sides || params.points?.length || 3;
		this.radius = params.radius || 50;
		this.center = params.center || {x: 0, y: 0};
	}

	/**
	 * 设定或获取多边形边数
	 * 边数决定了多边形的形状，最小为3（三角形）
	 * 
	 * @property sides
	 * @for jmPolygon
	 * @type {number}
	 */
	get sides() {
		return this.property('sides');
	}
	set sides(v) {
		// 参数验证：边数必须在3-100之间
		if(typeof v !== 'number' || isNaN(v) || v < 3) {
			console.warn('jmPolygon: sides must be a number >= 3');
			v = 3;
		}
		if(v > 100) {
			console.warn('jmPolygon: sides should not exceed 100 for performance reasons');
			v = 100;
		}
		this.needUpdate = true;
		return this.property('sides', Math.floor(v)); // 确保是整数
	}

	/**
	 * 设定或获取多边形半径
	 * 半径是从中心点到顶点的距离
	 * 
	 * @property radius
	 * @for jmPolygon
	 * @type {number}
	 */
	get radius() {
		return this.property('radius');
	}
	set radius(v) {
		// 参数验证：半径必须为正数
		if(typeof v !== 'number' || isNaN(v) || v <= 0) {
			console.warn('jmPolygon: radius must be a positive number');
			v = 1;
		}
		this.needUpdate = true;
		return this.property('radius', v);
	}

	/**
	 * 设定或获取多边形中心
	 * 中心点是多边形的几何中心
	 * 
	 * @property center
	 * @for jmPolygon
	 * @type {object}
	 */
	get center() {
		return this.property('center');
	}
	set center(v) {
		// 参数验证：中心点必须包含x和y属性
		if(!v || typeof v.x !== 'number' || typeof v.y !== 'number') {
			console.warn('jmPolygon: center must be an object with x and y properties');
			v = {x: 0, y: 0};
		}
		this.needUpdate = true;
		return this.property('center', v);
	}

	/**
	 * 初始化图形点
	 * 如果提供了自定义顶点，则使用自定义顶点
	 * 否则根据边数和半径自动计算规则多边形的顶点
	 * 
	 * @method initPoints
	 * @private
	 * @for jmPolygon
	 */
	initPoints() {
		// 如果提供了自定义顶点，直接使用
		if (this.points && this.points.length > 0) {
			return;
		}

		// 计算规则多边形的顶点
		const points = [];
		const sides = this.sides;
		const radius = this.radius;
		const center = this.center;

		// 从顶部开始绘制（-90度），顺时针方向
		for (let i = 0; i < sides; i++) {
			const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
			const x = center.x + Math.cos(angle) * radius;
			const y = center.y + Math.sin(angle) * radius;
			points.push({x, y});
		}

		this.points = points;
	}
}

export { jmPolygon };
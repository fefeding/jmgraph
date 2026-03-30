import {jmPath} from "../core/jmPath.js";

/**
 * 画星形
 * 支持自定义顶点数和内外半径，创建各种星形图案
 * 星形由交替的外半径和内半径顶点组成
 *
 * @class jmStar
 * @extends jmPath
 * @param {object} params 星形的参数
 * @param {array} [params.points] 自定义顶点数组，如果提供则忽略其他参数
 * @param {number} [params.points=5] 星形顶点数（角数，3-50）
 * @param {number} [params.radius=50] 星形外半径（从中心到尖角的距离）
 * @param {number} [params.innerRadius=25] 星形内半径（从中心到凹陷处的距离）
 * @param {object} [params.center={x:0,y:0}] 星形中心点坐标
 */
export default class jmStar extends jmPath {
	
	constructor(params, t='jmStar') {
		params = params || {};
		params.isRegular = true; // 标记为规则图形
		super(params, t);

		// 参数验证和初始化
		this.pointsCount = params.points || 5;
		this.radius = params.radius || 50;
		this.innerRadius = params.innerRadius || 25;
		this.center = params.center || {x: 0, y: 0};
	}

	/**
	 * 设定或获取星形顶点数（角数）
	 * 顶点数决定了星形的角数，例如5表示五角星
	 * 
	 * @property pointsCount
	 * @for jmStar
	 * @type {number}
	 */
	get pointsCount() {
		return this.property('pointsCount');
	}
	set pointsCount(v) {
		// 参数验证：顶点数必须在3-50之间
		if(typeof v !== 'number' || isNaN(v) || v < 3) {
			console.warn('jmStar: pointsCount must be a number >= 3');
			v = 3;
		}
		if(v > 50) {
			console.warn('jmStar: pointsCount should not exceed 50 for performance reasons');
			v = 50;
		}
		this.needUpdate = true;
		return this.property('pointsCount', Math.floor(v)); // 确保是整数
	}

	/**
	 * 设定或获取星形外半径
	 * 外半径是从中心到尖角的距离
	 * 
	 * @property radius
	 * @for jmStar
	 * @type {number}
	 */
	get radius() {
		return this.property('radius');
	}
	set radius(v) {
		// 参数验证：半径必须为正数
		if(typeof v !== 'number' || isNaN(v) || v <= 0) {
			console.warn('jmStar: radius must be a positive number');
			v = 1;
		}
		this.needUpdate = true;
		return this.property('radius', v);
	}

	/**
	 * 设定或获取星形内半径
	 * 内半径是从中心到凹陷处的距离
	 * 内半径应该小于外半径，否则会产生奇怪的形状
	 * 
	 * @property innerRadius
	 * @for jmStar
	 * @type {number}
	 */
	get innerRadius() {
		return this.property('innerRadius');
	}
	set innerRadius(v) {
		// 参数验证：内半径必须为正数
		if(typeof v !== 'number' || isNaN(v) || v <= 0) {
			console.warn('jmStar: innerRadius must be a positive number');
			v = 1;
		}
		// 警告：内半径不应大于外半径
		if(v >= this.radius) {
			console.warn('jmStar: innerRadius should be less than radius for proper star shape');
		}
		this.needUpdate = true;
		return this.property('innerRadius', v);
	}

	/**
	 * 设定或获取星形中心
	 * 中心点是星形的几何中心
	 * 
	 * @property center
	 * @for jmStar
	 * @type {object}
	 */
	get center() {
		return this.property('center');
	}
	set center(v) {
		// 参数验证：中心点必须包含x和y属性
		if(!v || typeof v.x !== 'number' || typeof v.y !== 'number') {
			console.warn('jmStar: center must be an object with x and y properties');
			v = {x: 0, y: 0};
		}
		this.needUpdate = true;
		return this.property('center', v);
	}

	/**
	 * 初始化图形点
	 * 计算星形的顶点坐标，交替使用外半径和内半径
	 * 
	 * @method initPoints
	 * @private
	 * @for jmStar
	 */
	initPoints() {
		// 如果提供了自定义顶点，直接使用
		if (this.points && this.points.length > 0) {
			return;
		}

		// 计算星形顶点
		const points = [];
		const pointsCount = this.pointsCount;
		const radius = this.radius;
		const innerRadius = this.innerRadius;
		const center = this.center;

		// 星形有2倍顶点数的点（外半径和内半径交替）
		// 从顶部开始绘制（-90度），顺时针方向
		for (let i = 0; i < pointsCount * 2; i++) {
			const angle = (i / pointsCount) * Math.PI - Math.PI / 2;
			// 偶数索引使用外半径，奇数索引使用内半径
			const r = i % 2 === 0 ? radius : innerRadius;
			const x = center.x + Math.cos(angle) * r;
			const y = center.y + Math.sin(angle) * r;
			points.push({x, y});
		}

		this.points = points;
	}
}

export { jmStar };
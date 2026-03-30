import {jmArc} from "./jmArc.js";

/**
 * 画椭圆
 * 椭圆是通过缩放圆形来实现的，支持完整的椭圆和椭圆弧
 * 可以指定起始角度和结束角度来绘制椭圆弧
 *
 * @class jmEllipse
 * @extends jmArc
 * @param {object} params 椭圆的参数
 * @param {object} [params.center={x:0,y:0}] 椭圆中心点坐标
 * @param {number} [params.width=100] 椭圆宽度（长轴直径）
 * @param {number} [params.height=60] 椭圆高度（短轴直径）
 * @param {number} [params.startAngle=0] 起始角度（弧度）
 * @param {number} [params.endAngle=Math.PI*2] 结束角度（弧度）
 * @param {boolean} [params.anticlockwise=false] 是否逆时针绘制
 */
export default class jmEllipse extends jmArc {
	
	constructor(params, t='jmEllipse') {
		params = params || {};
		params.isRegular = true; // 标记为规则图形
		super(params, t);
	}

	/**
	 * 初始化图形点
	 * 为WebGL模式生成控制点，2D模式使用draw方法直接绘制
	 * 
	 * @method initPoints
	 * @private
	 * @for jmEllipse
	 */
	initPoints() {
		// WebGL模式使用父类的点生成方法
		if(this.graph.mode === 'webgl') {
			return super.initPoints();
		}
		
		// 2D模式：生成4个控制点用于边界计算
		// 这些点不是实际的绘制点，而是用于碰撞检测和边界计算
		let location = this.getLocation();

		this.points = [];
		this.points.push({x:location.center.x - location.width/2, y:location.center.y}); // 左
		this.points.push({x:location.center.x, y:location.center.y - location.height/2}); // 上
		this.points.push({x:location.center.x + location.width/2, y:location.center.y}); // 右
		this.points.push({x:location.center.x, y:location.center.y + location.height/2}); // 下
	}

	/**
	 * 重写基类画图，此处为画一个椭圆
	 * 使用Canvas的变换功能（平移和缩放）来绘制椭圆
	 * 
	 * @method draw
	 */
	draw() {
		// WebGL模式使用父类的绘制方法
		if(this.graph.mode === 'webgl') {
			return super.draw();
		}
		
		// 获取边界和位置信息
		let bounds = this.parent && this.parent.absoluteBounds ? this.parent.absoluteBounds : this.absoluteBounds;
		let location = this.getLocation();

		// 获取椭圆弧参数
		let start = this.startAngle || 0;
		let end = this.endAngle || Math.PI * 2;
		let anticlockwise = this.anticlockwise || false;

		// 椭圆绘制：通过变换圆形来实现
		// 1. 保存当前绘图状态
		this.context.save();
		
		// 2. 平移到椭圆中心
		this.context.translate(location.center.x + bounds.left, location.center.y + bounds.top);
		
		// 3. 缩放坐标系，使圆形变为椭圆
		// 将X轴缩放width/2，Y轴缩放height/2，这样单位圆就变成了椭圆
		this.context.scale(location.width/2, location.height/2);
		
		// 4. 绘制单位圆（会被缩放成椭圆）
		this.context.arc(0, 0, 1, start, end, anticlockwise);
		
		// 5. 恢复绘图状态
		this.context.restore();
	}
}

export { jmEllipse };
/**
 * @fileoverview jmViewport 视口与坐标变换管理器
 * 
 * jmViewport 统一管理画布的缩放(scaleFactor)和平移(translation)，
 * 是「世界坐标 ↔ 屏幕坐标」转换与视口剔除的唯一入口。
 * 
 * 背景：原实现中，坐标转换散落在 jmGraph（translation/scaleFactor）、
 * jmControl（getAbsoluteBounds）和 paint（视口裁剪）三处，职责混乱，
 * 导致缩放平移后裁剪逻辑容易漏转换（历史 bug 的根源）。
 * 本类将这些职责收拢为一个可独立测试的纯逻辑模块。
 * 
 * 术语：
 * - 世界坐标：图形 position/points 所在坐标系（与缩放平移无关）
 * - 屏幕坐标：画布像素坐标系（等于世界坐标 * scaleFactor + translation）
 * 
 * @module jmViewport
 * @author jmGraph Team
 * @license MIT
 */
export default class jmViewport {

	/**
	 * 构造函数
	 *
	 * @param {number} width 画布逻辑宽度
	 * @param {number} height 画布逻辑高度
	 * @param {Object} [option] 可选参数
	 * @param {number} [option.scaleFactor=1] 初始缩放因子
	 * @param {number} [option.x=0] 初始 X 平移
	 * @param {number} [option.y=0] 初始 Y 平移
	 * @param {number} [option.minZoom=0.1] 最小缩放
	 * @param {number} [option.maxZoom=10] 最大缩放
	 */
	constructor(width, height, option = {}) {
		this.width = width || 0;
		this.height = height || 0;
		this.scaleFactor = typeof option.scaleFactor === 'number' ? option.scaleFactor : 1;
		this.translation = {
			x: option.x || 0,
			y: option.y || 0
		};
		this.minZoom = typeof option.minZoom === 'number' ? option.minZoom : 0.1;
		this.maxZoom = typeof option.maxZoom === 'number' ? option.maxZoom : 10;

		/**
		 * 变换版本号，任何缩放/平移变化都会自增。
		 * 用于让调用方判断「变换是否变化过」，避免重复计算。
		 * @type {number}
		 */
		this._stamp = 0;
	}

	/** 当前变换版本号 */
	get stamp() {
		return this._stamp;
	}

	/** 是否发生过缩放或平移（判断是否需要转换坐标） */
	get transformed() {
		return this.scaleFactor !== 1 || this.translation.x !== 0 || this.translation.y !== 0;
	}

	/**
	 * 重置视口（缩放=1，平移=0）
	 */
	reset() {
		this.scaleFactor = 1;
		this.translation.x = 0;
		this.translation.y = 0;
		this._stamp++;
		return this;
	}

	/**
	 * 平移画布
	 * @param {number} dx X 轴平移量（屏幕像素）
	 * @param {number} dy Y 轴平移量（屏幕像素）
	 */
	pan(dx, dy) {
		this.translation.x += dx;
		this.translation.y += dy;
		this._stamp++;
		return this;
	}

	/**
	 * 以指定世界坐标点为缩放中心进行缩放，保持该点屏幕位置不变。
	 *
	 * @param {number} zoom 目标缩放因子
	 * @param {number} [cx] 缩放中心 X（世界坐标）
	 * @param {number} [cy] 缩放中心 Y（世界坐标）
	 */
	zoomAt(zoom, cx, cy) {
		zoom = this.clampZoom(zoom);
		if(cx !== undefined && cy !== undefined) {
			const old = this.scaleFactor || 1;
			this.translation.x = cx - (cx - this.translation.x) * (zoom / old);
			this.translation.y = cy - (cy - this.translation.y) * (zoom / old);
		}
		this.scaleFactor = zoom;
		this._stamp++;
		return this;
	}

	/**
	 * 直接设置平移
	 * @param {number} x X 平移（屏幕像素）
	 * @param {number} y Y 平移（屏幕像素）
	 */
	setTranslation(x, y) {
		this.translation.x = x;
		this.translation.y = y;
		this._stamp++;
		return this;
	}

	/** 缩放范围钳制 */
	clampZoom(zoom) {
		if(typeof zoom !== 'number' || isNaN(zoom)) return this.scaleFactor;
		return Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
	}

	/**
	 * 屏幕坐标 → 世界坐标
	 * @param {Object} p {x, y}
	 * @return {Object} 世界坐标
	 */
	screenToWorld(p) {
		return {
			x: (p.x - this.translation.x) / this.scaleFactor,
			y: (p.y - this.translation.y) / this.scaleFactor
		};
	}

	/**
	 * 世界坐标 → 屏幕坐标
	 * @param {Object} p {x, y}
	 * @return {Object} 屏幕坐标
	 */
	worldToScreen(p) {
		return {
			x: p.x * this.scaleFactor + this.translation.x,
			y: p.y * this.scaleFactor + this.translation.y
		};
	}

	/**
	 * 把世界坐标边界矩形转换为屏幕坐标边界矩形。
	 * @param {Object} bounds 世界坐标矩形 {left, top, right, bottom, width, height}
	 * @return {Object} 屏幕坐标矩形
	 */
	worldRectToScreen(bounds) {
		const s = this.scaleFactor;
		const left = bounds.left * s + this.translation.x;
		const top = bounds.top * s + this.translation.y;
		return {
			left,
			top,
			right: bounds.right * s + this.translation.x,
			bottom: bounds.bottom * s + this.translation.y,
			width: bounds.width * s,
			height: bounds.height * s
		};
	}

	/**
	 * 获取当前视口对应的世界坐标可见区域。
	 *
	 * @return {Object} {left, top, right, bottom, width, height}
	 */
	getVisibleWorldRect() {
		const left = -this.translation.x / this.scaleFactor;
		const top = -this.translation.y / this.scaleFactor;
		return {
			left,
			top,
			right: left + this.width / this.scaleFactor,
			bottom: top + this.height / this.scaleFactor,
			width: this.width / this.scaleFactor,
			height: this.height / this.scaleFactor
		};
	}

	/**
	 * 判断一个世界坐标边界矩形是否与视口相交（是否可见）。
	 *
	 * 先把世界坐标矩形变换到屏幕坐标，再与画布尺寸比较，
	 * 保证缩放、平移后裁剪结果始终正确。
	 *
	 * @param {Object} bounds 世界坐标矩形 {left, top, right, bottom}
	 * @param {number} [pad=0] 额外容差（像素，屏幕坐标）
	 * @return {boolean} true=可见
	 */
	isVisible(bounds, pad = 0) {
		if(!bounds) return false;
		const s = this.scaleFactor;
		const sl = bounds.left * s + this.translation.x - pad;
		const st = bounds.top * s + this.translation.y - pad;
		const sr = bounds.right * s + this.translation.x + pad;
		const sb = bounds.bottom * s + this.translation.y + pad;
		if(sl >= this.width) return false;
		if(st >= this.height) return false;
		if(sr <= 0) return false;
		if(sb <= 0) return false;
		return true;
	}

	/**
	 * 判断一个世界坐标点是否在视口内。
	 * @param {Object} p {x, y} 世界坐标
	 * @return {boolean}
	 */
	containsPoint(p) {
		const sp = this.worldToScreen(p);
		return sp.x >= 0 && sp.x <= this.width && sp.y >= 0 && sp.y <= this.height;
	}

	/**
	 * 按画布中心进行自适应缩放（fitView 用）。
	 * @param {Object} bounds 内容边界（世界坐标）
	 * @param {number} padding 留白比例 0-0.9
	 */
	fitBounds(bounds, padding = 0.15) {
		if(!bounds) {
			this.reset();
			return this;
		}
		// 兼容只传 {left, top, right, bottom} 的边界对象
		const bw = bounds.width !== undefined ? bounds.width : (bounds.right - bounds.left);
		const bh = bounds.height !== undefined ? bounds.height : (bounds.bottom - bounds.top);
		if(!bw || !bh || !this.width || !this.height) {
			this.reset();
			return this;
		}
		const pad = Math.max(0, Math.min(0.9, padding));
		const zoom = this.clampZoom(
			Math.min(this.width / bw, this.height / bh) * (1 - pad)
		);
		this.scaleFactor = zoom;
		this.translation.x = this.width / 2 - (bounds.left + bw / 2) * zoom;
		this.translation.y = this.height / 2 - (bounds.top + bh / 2) * zoom;
		this._stamp++;
		return this;
	}

	/**
	 * 序列化当前视口状态（调试/持久化用）。
	 * @return {Object}
	 */
	toJSON() {
		return {
			scaleFactor: this.scaleFactor,
			translation: { ...this.translation },
			width: this.width,
			height: this.height
		};
	}
}

export { jmViewport };

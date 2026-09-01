/**
 * @fileoverview jmRenderer 渲染器抽象
 * 
 * 渲染器负责「画布变换、清屏、路径绘制」等与具体渲染后端相关的操作，
 * 使 jmGraph/jmControl 不再直接依赖 Canvas 2D / WebGL 的具体差异。
 * 
 * 目前提供：
 * - jmRenderer：抽象基类
 * - Canvas2DRenderer：Canvas 2D 实现
 * 
 * WebGLRenderer 可作为后续工作基于本接口扩展，
 * 届时 shape 只需产出几何描述，无需关心渲染后端。
 * 
 * @module jmRenderer
 * @author jmGraph Team
 * @license MIT
 */
export class jmRenderer {

	/**
	 * @param {jmGraph} graph 所属画布
	 */
	constructor(graph) {
		this.graph = graph;
	}

	/** 底层渲染上下文 */
	get context() {
		return this.graph.context;
	}

	/**
	 * 开始一次绘制（应用视口变换）
	 * 注意：本方法不负责 save/restore，由调用方（paint）统一管理栈。
	 */
	begin() {}

	/** 结束一次绘制（撤销 begin 应用的变换） */
	end() {}

	/** 清空画布 */
	clear(w, h) {}

	/** 保存上下文状态 */
	save() {
		this.context.save && this.context.save();
	}

	/** 恢复上下文状态 */
	restore() {
		this.context.restore && this.context.restore();
	}

	/** 开始路径 */
	beginPath() {
		this.context.beginPath && this.context.beginPath();
	}

	/** 移动画笔 */
	moveTo(x, y) {
		this.context.moveTo && this.context.moveTo(x, y);
	}

	/** 画线 */
	lineTo(x, y) {
		this.context.lineTo && this.context.lineTo(x, y);
	}

	/** 闭合路径 */
	closePath() {
		this.context.closePath && this.context.closePath();
	}

	/** 填充 */
	fill() {
		this.context.fill && this.context.fill();
	}

	/** 描边 */
	stroke() {
		this.context.stroke && this.context.stroke();
	}
}

/**
 * Canvas 2D 渲染器
 * @class Canvas2DRenderer
 * @extends jmRenderer
 */
export class Canvas2DRenderer extends jmRenderer {

	/**
	 * 应用视口变换：0.5 偏移（解决一像素线条模糊）+ 平移 + 缩放。
	 */
	begin() {
		const ctx = this.context;
		const vp = this.graph.viewport;
		if(!ctx.translate || !vp) return;
		ctx.translate(0.5, 0.5);
		if(vp.transformed) {
			ctx.translate(vp.translation.x, vp.translation.y);
			ctx.scale(vp.scaleFactor, vp.scaleFactor);
		}
	}

	/**
	 * 撤销 begin 应用的变换。
	 */
	end() {
		const ctx = this.context;
		const vp = this.graph.viewport;
		if(!ctx.translate || !vp) return;
		if(vp.transformed) {
			ctx.scale(1 / vp.scaleFactor, 1 / vp.scaleFactor);
			ctx.translate(-vp.translation.x, -vp.translation.y);
		}
		ctx.translate(-0.5, -0.5);
	}

	/** 清空画布 */
	clear(w, h) {
		const ctx = this.context;
		if(ctx && ctx.clearRect) {
			ctx.clearRect(0, 0, w, h);
		}
	}
}

export default Canvas2DRenderer;

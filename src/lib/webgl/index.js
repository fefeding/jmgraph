

/**
 * @fileoverview WebGL 渲染上下文适配器
 * 
 * 本模块提供了与 Canvas 2D API 兼容的 WebGL 接口，
 * 使 jmGraph 能够无缝切换使用 Canvas 2D 或 WebGL 进行渲染。
 * 
 * 主要功能：
 * - 提供与 Canvas 2D Context 兼容的方法签名
 * - 管理变换矩阵（平移、缩放、旋转）
 * - 支持渐变创建
 * - 文本测量支持
 * 
 * @module lib/webgl
 * @author jmGraph Team
 */
import WebglBase from './base.js';
import WebglPath from './path.js';

/**
 * WebGL 渲染上下文适配器类
 * 提供与 Canvas 2D Context 兼容的 API 接口
 * 
 * @class webgl
 * @example
 * // 在 jmGraph 中使用
 * const graph = new jmGraph(canvas, { mode: 'webgl' });
 * // 内部会自动创建 webgl 实例作为 context
 */
class webgl {
    /**
     * 构造函数
     * @param {WebGLRenderingContext} context WebGL 渲染上下文
     * @param {Object} option 配置选项
     */
    constructor(context, option) {
        this.option = option || {};
        this.context = context;
        this.base = new WebglBase(null, option);
        this.base.context = context;
    }

    /**
     * 保存当前状态到状态栈
     * @method save
     */
    save() {
        this.base.save();
    }

    /**
     * 从状态栈恢复上一个状态
     * @method restore
     */
    restore() {
        this.base.restore();
    }

    /**
     * 平移变换
     * @method translate
     * @param {number} x X 轴平移量
     * @param {number} y Y 轴平移量
     */
    translate(x, y) {
        this.base.translate(x, y);
    }

    /**
     * 缩放变换
     * @method scale
     * @param {number} sx X 轴缩放比例
     * @param {number} sy Y 轴缩放比例
     */
    scale(sx, sy) {
        this.base.scale(sx, sy);
    }

    /**
     * 旋转变换
     * @method rotate
     * @param {number} angle 旋转角度（弧度）
     */
    rotate(angle) {
        this.base.rotate(angle);
    }

    /**
     * 矩阵变换
     * @method transform
     * @param {number} a 水平缩放
     * @param {number} b 垂直倾斜
     * @param {number} c 水平倾斜
     * @param {number} d 垂直缩放
     * @param {number} e 水平移动
     * @param {number} f 垂直移动
     */
    transform(a, b, c, d, e, f) {
        this.base.transform(a, b, c, d, e, f);
    }

    /**
     * 开始路径（WebGL 中由具体绘制方法处理，此方法为空实现）
     * @method beginPath
     */
    beginPath() {
        // WebGL 中不需要 beginPath，由具体的绘制方法处理
    }

    /**
     * 关闭路径（WebGL 中由具体绘制方法处理，此方法为空实现）
     * @method closePath
     */
    closePath() {
        // WebGL 中不需要 closePath，由具体的绘制方法处理
    }

    /**
     * 移动到指定点（WebGL 中由具体绘制方法处理，此方法为空实现）
     * @method moveTo
     * @param {number} x 目标点 X 坐标
     * @param {number} y 目标点 Y 坐标
     */
    moveTo(x, y) {
        // WebGL 中不需要 moveTo，由具体的绘制方法处理
    }

    /**
     * 绘制直线到指定点（WebGL 中由具体绘制方法处理，此方法为空实现）
     * @method lineTo
     * @param {number} x 目标点 X 坐标
     * @param {number} y 目标点 Y 坐标
     */
    lineTo(x, y) {
        // WebGL 中不需要 lineTo，由具体的绘制方法处理
    }

    /**
     * 填充路径（WebGL 中由具体绘制方法处理，此方法为空实现）
     * @method fill
     */
    fill() {
        // WebGL 中不需要 fill，由具体的绘制方法处理
    }

    /**
     * 描边路径（WebGL 中由具体绘制方法处理，此方法为空实现）
     * @method stroke
     */
    stroke() {
        // WebGL 中不需要 stroke，由具体的绘制方法处理
    }

    /**
     * 清除矩形区域
     * @method clearRect
     * @param {number} x 矩形左上角 X 坐标
     * @param {number} y 矩形左上角 Y 坐标
     * @param {number} width 矩形宽度
     * @param {number} height 矩形高度
     */
    clearRect(x, y, width, height) {
        this.context.clearColor(0, 0, 0, 0);
        this.context.clear(this.context.COLOR_BUFFER_BIT);
    }

    /**
     * 设置线条宽度（由具体绘制方法处理）
     * @method lineWidth
     * @param {number} width 线条宽度
     */
    lineWidth(width) {
        // 由具体的绘制方法处理
    }

    /**
     * 设置填充样式（由具体绘制方法处理）
     * @method fillStyle
     * @param {string|Object} style 填充样式
     */
    fillStyle(style) {
        // 由具体的绘制方法处理
    }

    /**
     * 设置描边样式（由具体绘制方法处理）
     * @method strokeStyle
     * @param {string|Object} style 描边样式
     */
    strokeStyle(style) {
        // 由具体的绘制方法处理
    }

    /**
     * 绘制填充文本（由具体绘制方法处理）
     * @method fillText
     * @param {string} text 要绘制的文本
     * @param {number} x 文本起始 X 坐标
     * @param {number} y 文本起始 Y 坐标
     * @param {number} [maxWidth] 最大宽度
     */
    fillText(text, x, y, maxWidth) {
        // 由具体的绘制方法处理
    }

    /**
     * 绘制描边文本（由具体绘制方法处理）
     * @method strokeText
     * @param {string} text 要绘制的文本
     * @param {number} x 文本起始 X 坐标
     * @param {number} y 文本起始 Y 坐标
     * @param {number} [maxWidth] 最大宽度
     */
    strokeText(text, x, y, maxWidth) {
        // 由具体的绘制方法处理
    }

    /**
     * 测量文本宽度
     * @method measureText
     * @param {string} text 要测量的文本
     * @returns {TextMetrics} 文本测量结果，包含 width 属性
     */
    measureText(text) {
        if(this.base && this.base._measureCtx) {
            return this.base._measureCtx.measureText(text);
        }
        return { width: 15 };
    }

    /**
     * 创建线性渐变
     * @method createLinearGradient
     * @param {number} x1 起点X坐标
     * @param {number} y1 起点Y坐标
     * @param {number} x2 终点X坐标
     * @param {number} y2 终点Y坐标
     * @param {Object} bounds 渐变边界 {left, top, width, height}
     * @returns {WebglGradient} WebGL 渐变对象
     */
    createLinearGradient(x1, y1, x2, y2, bounds) {
        return this.base.createLinearGradient(x1, y1, x2, y2, bounds);
    }

    /**
     * 创建径向渐变
     * @method createRadialGradient
     * @param {number} x1 内圆中心X坐标
     * @param {number} y1 内圆中心Y坐标
     * @param {number} r1 内圆半径
     * @param {number} x2 外圆中心X坐标
     * @param {number} y2 外圆中心Y坐标
     * @param {number} r2 外圆半径
     * @param {Object} bounds 渐变边界 {left, top, width, height}
     * @returns {WebglGradient} WebGL 渐变对象
     */
    createRadialGradient(x1, y1, r1, x2, y2, r2, bounds) {
        return this.base.createRadialGradient(x1, y1, r1, x2, y2, r2, bounds);
    }

    /**
     * 绘制图像（由具体绘制方法处理）
     * @method drawImage
     * @param {Image|HTMLImageElement} img 图像对象
     * @param {number} dx 目标 X 坐标
     * @param {number} dy 目标 Y 坐标
     * @param {number} [dWidth] 目标宽度
     * @param {number} [dHeight] 目标高度
     */
    drawImage(img, dx, dy, dWidth, dHeight) {
        // 由具体的绘制方法处理
    }

    /**
     * 创建 WebglPath 实例
     * @method createPath
     * @param {Object} option 路径配置选项
     * @returns {WebglPath} WebGL 路径对象
     */
    createPath(option) {
        return new WebglPath(null, option);
    }
}

export default webgl;
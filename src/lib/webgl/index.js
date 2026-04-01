

/**
 * 采用webgl基础绘图
 */
import WebglBase from './base.js';
import WebglPath from './path.js';

class webgl {
    constructor(context, option) {
        this.option = option || {};
        this.context = context;
        this.base = new WebglBase(null, option);
        this.base.context = context;
    }

    // 保存当前状态
    save() {
        this.base.save();
    }

    // 恢复上一个状态
    restore() {
        this.base.restore();
    }

    // 平移变换
    translate(x, y) {
        this.base.translate(x, y);
    }

    // 缩放变换
    scale(sx, sy) {
        this.base.scale(sx, sy);
    }

    // 旋转变换
    rotate(angle) {
        this.base.rotate(angle);
    }

    // 矩阵变换
    transform(a, b, c, d, e, f) {
        this.base.transform(a, b, c, d, e, f);
    }

    // 开始路径
    beginPath() {
        // WebGL 中不需要 beginPath，由具体的绘制方法处理
    }

    // 关闭路径
    closePath() {
        // WebGL 中不需要 closePath，由具体的绘制方法处理
    }

    // 移动到指定点
    moveTo(x, y) {
        // WebGL 中不需要 moveTo，由具体的绘制方法处理
    }

    // 绘制直线
    lineTo(x, y) {
        // WebGL 中不需要 lineTo，由具体的绘制方法处理
    }

    // 填充路径
    fill() {
        // WebGL 中不需要 fill，由具体的绘制方法处理
    }

    // 描边路径
    stroke() {
        // WebGL 中不需要 stroke，由具体的绘制方法处理
    }

    // 清除矩形区域
    clearRect(x, y, width, height) {
        this.context.clearColor(0, 0, 0, 0);
        this.context.clear(this.context.COLOR_BUFFER_BIT);
    }

    // 设置线条宽度
    lineWidth(width) {
        // 由具体的绘制方法处理
    }

    // 设置填充样式
    fillStyle(style) {
        // 由具体的绘制方法处理
    }

    // 设置描边样式
    strokeStyle(style) {
        // 由具体的绘制方法处理
    }

    // 绘制文本
    fillText(text, x, y, maxWidth) {
        // 由具体的绘制方法处理
    }

    // 描边文本
    strokeText(text, x, y, maxWidth) {
        // 由具体的绘制方法处理
    }

    // 测量文本宽度
    measureText(text) {
        if(this.base && this.base._measureCtx) {
            return this.base._measureCtx.measureText(text);
        }
        return { width: 15 };
    }

    // 创建线性渐变
    createLinearGradient(x1, y1, x2, y2, bounds) {
        return this.base.createLinearGradient(x1, y1, x2, y2, bounds);
    }

    // 创建径向渐变
    createRadialGradient(x1, y1, r1, x2, y2, r2, bounds) {
        return this.base.createRadialGradient(x1, y1, r1, x2, y2, r2, bounds);
    }

    // 绘制图像
    drawImage(img, dx, dy, dWidth, dHeight) {
        // 由具体的绘制方法处理
    }

    // 创建 WebglPath 实例
    createPath(option) {
        return new WebglPath(null, option);
    }
}

export default webgl;
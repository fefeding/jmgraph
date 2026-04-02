/**
 * @fileoverview WebGL 渐变对象
 * 
 * 本模块提供了 WebGL 渐变功能，支持 GLSL 着色器直接计算渐变色，
 * 无需 textureCanvas，性能更优。
 * 
 * 支持的渐变类型：
 * - 线性渐变 (linear)
 * - 径向渐变 (radial)
 * 
 * @module lib/webgl/gradient
 * @author jmGraph Team
 */

/** @constant {number} 最大颜色断点数量 */
const MAX_STOPS = 16;

/**
 * WebGL 渐变类
 * 支持 GLSL 着色器直接计算渐变色
 * 
 * @class WebglGradient
 * @example
 * const gradient = new WebglGradient('linear', { x1: 0, y1: 0, x2: 100, y2: 0 });
 * gradient.addColorStop(0, '#ff0000');
 * gradient.addColorStop(1, '#0000ff');
 */
class WebglGradient {
    /**
     * 构造函数
     * @param {string} [type='linear'] 渐变类型：'linear' 或 'radial'
     * @param {Object} params 渐变参数
     * @param {number} [params.x1=0] 起点/内圆中心X坐标
     * @param {number} [params.y1=0] 起点/内圆中心Y坐标
     * @param {number} [params.r1=0] 内圆半径（径向渐变）
     * @param {number} [params.x2=0] 终点/外圆中心X坐标
     * @param {number} [params.y2=0] 终点/外圆中心Y坐标
     * @param {number} [params.r2=0] 外圆半径（径向渐变）
     * @param {Object} [params.bounds] 渐变边界
     * @param {Object} [params.control] 控制器对象
     */
    constructor(type = 'linear', params = {}) {
        /** @type {string} 渐变类型 */
        this.type = type || 'linear';

        this.x1 = params.x1 || 0;
        this.y1 = params.y1 || 0;
        this.r1 = params.r1 || 0;
        this.x2 = params.x2 || 0;
        this.y2 = params.y2 || 0;
        this.r2 = params.r2 || 0;

        /** @type {Object} 渐变边界 */
        this.bounds = params.bounds || { left: 0, top: 0, width: 0, height: 0 };

        this.control = params.control;

        /** @type {Array<{offset: number, color: string}>} 颜色断点数组 */
        this.stops = [];
        this._sortedStops = null;
        this._paramsHash = null;
    }

    /**
     * 添加颜色断点
     * @param {number} offset 断点位置 (0-1)
     * @param {string} color 颜色值
     */
    addColorStop(offset, color) {
        this.stops.push({
            offset: Math.max(0, Math.min(1, offset)),
            color
        });
        this._sortedStops = null;
        this._paramsHash = null;
    }

    /**
     * 获取排序后的断点数组（带解析后的颜色）
     * @private
     * @returns {Array<{offset: number, r: number, g: number, b: number, a: number}>}
     */
    _getSortedStops() {
        if (this._sortedStops) return this._sortedStops;

        const utils = this.control && this.control.graph && this.control.graph.utils;
        this._sortedStops = this.stops
            .map(s => {
                let c = s.color;
                if (utils && typeof c === 'string') {
                    c = utils.hexToRGBA(c);
                }
                if (typeof c === 'object' && c !== null) {
                    const needNormalize = (c.r > 1 || c.g > 1 || c.b > 1) ? 255 : 1;
                    return {
                        offset: s.offset,
                        r: (c.r !== undefined ? c.r : 0) / needNormalize,
                        g: (c.g !== undefined ? c.g : 0) / needNormalize,
                        b: (c.b !== undefined ? c.b : 0) / needNormalize,
                        a: c.a !== undefined ? c.a : 1
                    };
                }
                return { offset: s.offset, r: 0, g: 0, b: 0, a: 1 };
            })
            .sort((a, b) => a.offset - b.offset);

        return this._sortedStops;
    }

    /**
     * 将渐变参数转换为 uniform 格式，传递给着色器
     * @returns {Object} uniform 参数对象
     */
    toUniformParams() {
        const stops = this._getSortedStops();
        const count = Math.min(stops.length, MAX_STOPS);

        const flatStops = new Float32Array(count * 5);
        for (let i = 0; i < count; i++) {
            const s = stops[i];
            flatStops[i * 5 + 0] = s.offset;
            flatStops[i * 5 + 1] = s.r;
            flatStops[i * 5 + 2] = s.g;
            flatStops[i * 5 + 3] = s.b;
            flatStops[i * 5 + 4] = s.a;
        }

        return {
            gradientType: this.type === 'radial' ? 2 : 1,
            gradientStart: new Float32Array([
                this.x1, this.y1,
                this.type === 'radial' ? Math.max(0, this.r1) : 0,
                0
            ]),
            gradientEnd: new Float32Array([
                this.x2, this.y2,
                this.type === 'radial' ? Math.max(0, this.r2) : 0,
                0
            ]),
            stopCount: count,
            stops: flatStops
        };
    }

    /** 使缓存失效 */
    invalidateCache() {
        this._sortedStops = null;
        this._paramsHash = null;
    }

    /**
     * 转换为渐变的字符串表达
     * @returns {string} 渐变字符串
     */
    toString() {
        let str = this.type + '-gradient(';
        if (this.type == 'linear') {
            str += this.x1 + ' ' + this.y1 + ' ' + this.x2 + ' ' + this.y2;
        }
        else {
            str += this.x1 + ' ' + this.y1 + ' ' + this.r1 + ' ' + this.x2 + ' ' + this.y2 + ' ' + this.r2;
        }
        this.stops.forEach(function(s) {
            str += ',' + s.color + ' ' + s.offset;
        });
        return str + ')';
    }
}

export default WebglGradient;
export { MAX_STOPS };

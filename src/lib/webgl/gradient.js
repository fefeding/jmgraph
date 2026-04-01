const MAX_STOPS = 16;

/**
 * WebGL 渐变对象
 * 支持 GLSL 着色器直接计算渐变色，无需 textureCanvas
 */
class WebglGradient {
    constructor(type = 'linear', params = {}) {
        this.type = type || 'linear';

        this.x1 = params.x1 || 0;
        this.y1 = params.y1 || 0;
        this.r1 = params.r1 || 0;
        this.x2 = params.x2 || 0;
        this.y2 = params.y2 || 0;
        this.r2 = params.r2 || 0;

        this.bounds = params.bounds || {
            left: 0,
            top: 0,
            width: 0,
            height: 0
        };

        this.control = params.control;

        this.stops = [];
        this._sortedStops = null;
        this._paramsHash = null;
    }

    /**
     * 添加颜色断点
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
     * 获取排序后的 stops（带解析后的颜色）
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
                    // hexToRGBA 返回 r/g/b 为 0~255，a 为 0~1
                    // 但如果已经是 0~1 范围（由 rgbToDecimal 处理过），需要检测
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
     * 将渐变参数以 uniform 形式传递给着色器
     * 返回 { type, start, end, stopCount, stops } 供着色器使用
     */
    toUniformParams() {
        const stops = this._getSortedStops();
        const count = Math.min(stops.length, MAX_STOPS);

        // 展平为 Float32Array: [offset, r, g, b, a, ...]
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

    /**
     * 使缓存失效
     */
    invalidateCache() {
        this._sortedStops = null;
        this._paramsHash = null;
    }

    /**
     * 转换为渐变的字符串表达
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

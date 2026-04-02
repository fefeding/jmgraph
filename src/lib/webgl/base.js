
/**
 * @fileoverview WebGL 基础渲染类
 * 
 * 本模块提供了 WebGL 渲染的核心功能，包括：
 * - 着色器程序管理
 * - 缓冲区管理
 * - 纹理管理
 * - 变换矩阵操作
 * - 多边形三角化（使用 earcut 算法）
 * - 渐变支持
 * 
 * @module lib/webgl/base
 * @author jmGraph Team
 */
import earcut from '../earcut.js';
import webglGradient, { MAX_STOPS } from './gradient.js';
import {
    createProgram,
    useProgram,
    writeVertexAttrib,
    disableVertexAttribArray
} from './core/program.js';

import {
    createFloat32Buffer,
    createUint16Buffer,
    deleteBuffer,
} from './core/buffer.js';

import {
    create2DTexture,
    createImgTexture,
    createDataTexture,
    deleteTexture
} from './core/texture.js';

// 把canvas坐标转为webgl坐标系
const convertPointSource = `
    vec4 translatePosition(vec4 point, float x, float y) {
        point.x = (point.x-x)/x;
        point.y = (y-point.y)/y;
        return point;
    }`;
// 把纹理的canvas坐标转为纹理的坐标系
const convertTexturePosition = `
    vec2 translateTexturePosition(in vec2 point, vec4 bounds) {
        point.x = (point.x-bounds.x)/bounds.z; // 离左上角位置的X长比上纹理宽 0-1
        point.y = 1.0-(point.y-bounds.y)/bounds.w; // 离左上角位置的Y长比上高，因为纹理坐标是左下角起，所以要用1-
        return point;
    }`;

// path顶点着色器源码
const pathVertexSource = `
    attribute vec4 a_position;
    attribute vec4 a_color;
    attribute vec2 a_text_coord;
    uniform vec2 a_center_point; // 当前canvas的中心位置
    uniform float a_point_size; // 点的大小
    uniform int a_type;
    varying vec4 v_color;
    varying vec2 v_text_coord;
    varying float v_type;

    ${convertPointSource}

    void main() {
        gl_PointSize = a_point_size == 0.0? 1.0 : a_point_size;
        v_type = float(a_type);
        vec4 pos = translatePosition(a_position, a_center_point.x, a_center_point.y);
        gl_Position = pos;
        v_color = a_color;
        if(a_type == 2 || a_type == 5) {
            v_text_coord = a_position.xy;
        }
    }
`;
// path 片段着色器源码
const pathFragmentSource = `
    precision mediump float;
    uniform sampler2D u_sample;
    uniform vec4 v_texture_bounds; // 纹理的左上坐标和大小 x,y,z,w
    uniform vec4 v_single_color;
    // GLSL 渐变 uniforms
    uniform int u_gradient_type;     // 0=无 1=线性 2=径向
    uniform vec4 u_gradient_start;   // 线性:{x1,y1,0,0} 径向:{cx,cy,r1,0}
    uniform vec4 u_gradient_end;     // 线性:{x2,y2,0,0} 径向:{cx,cy,r2,0}
    uniform int u_gradient_stop_count;
    uniform float u_gradient_offsets[${MAX_STOPS}];
    uniform vec4 u_gradient_colors[${MAX_STOPS}]; // {r, g, b, a} 0~1 范围
    varying float v_type;
    varying vec4 v_color;
    varying vec2 v_text_coord;

    ${convertTexturePosition}

    // 在 sorted stops 中按 t 值采样颜色
    // 兼容 GLSL ES 1.0：循环仅与常量比较，无 break/continue
    vec4 sampleGradient(float t) {
        t = clamp(t, 0.0, 1.0);
        // 正向扫描：始终遍历 MAX_STOPS-1 次，找到 t 所在段并覆盖结果
        float localT = 0.0;
        vec4 c0 = u_gradient_colors[0];
        vec4 c1 = u_gradient_colors[0];
        for(int i = 0; i < ${MAX_STOPS - 1}; i++) {
            float s0 = u_gradient_offsets[i];
            float s1 = u_gradient_offsets[i + 1];
            if(t >= s0) {
                float range = s1 - s0;
                localT = range > 0.0001 ? clamp((t - s0) / range, 0.0, 1.0) : 0.0;
                c0 = u_gradient_colors[i];
                c1 = u_gradient_colors[i + 1];
            }
        }
        return mix(c0, c1, localT);
    }

    void main() {
        // 如果是fill，则直接填充颜色
        if(v_type == 1.0) {
            gl_FragColor = v_single_color;
        }
        // 渐变色 (旧方式，顶点颜色插值)
        else if(v_type == 3.0) {
            gl_FragColor = v_color;
        }
        // GLSL 渐变填充 (type=5)
        else if(v_type == 5.0) {
            float t;
            if(u_gradient_type == 2) {
                // 径向渐变
                vec2 d = v_text_coord - u_gradient_start.xy;
                float dist = length(d);
                float r1 = u_gradient_start.z;
                float r2 = u_gradient_end.z;
                float range = r2 - r1;
                t = range > 0.001 ? (dist - r1) / range : 0.0;
            } else {
                // 线性渐变
                vec2 dir = u_gradient_end.xy - u_gradient_start.xy;
                float lenSq = dot(dir, dir);
                if(lenSq > 0.001) {
                    vec2 pos = v_text_coord - u_gradient_start.xy;
                    t = dot(pos, dir) / lenSq;
                } else {
                    t = 0.0;
                }
            }
            gl_FragColor = sampleGradient(t) * v_single_color.a;
        }
        else if(v_type == 2.0) {
            vec2 pos = translateTexturePosition(v_text_coord, v_texture_bounds);
            gl_FragColor = texture2D(u_sample, pos);
        }
        else {
            float r = distance(gl_PointCoord, vec2(0.5, 0.5));
            //根据距离设置片元
            if(r <= 0.5){
                // 方形区域片元距离几何中心半径小于0.5，像素颜色设置红色
                gl_FragColor = v_single_color;
            }else {
                // 方形区域距离几何中心半径不小于0.5的片元剪裁舍弃掉：
                discard;
            }
        }
    }
`;

/**
 * WebGL 基础渲染类
 * 提供 WebGL 渲染的核心功能，包括着色器、缓冲区、纹理管理等
 * 
 * @class WeblBase
 * @example
 * const base = new WeblBase(graph, { mode: 'webgl' });
 * base.setStyle({ fillStyle: '#ff0000' });
 */
class WeblBase {
    /**
     * 构造函数
     * @param {jmGraph} graph jmGraph 实例
     * @param {Object} option 配置选项
     */
    constructor(graph, option) {
        this.graph = graph;
        this.option = option || {};
        this.style = {
            globalAlpha: 1
        };
        this.stateStack = [];
        /** @type {number[]} 2D 变换矩阵 [a, b, c, d, tx, ty] */
        this.transformMatrix = [1, 0, 0, 1, 0, 0];
    }

    /** @returns {WebGLRenderingContext} WebGL 渲染上下文 */
    get context() {
        if(this.graph) return this.graph.context;
    }

    /** 保存当前状态到状态栈 */
    save() {
        this.stateStack.push({
            transformMatrix: [...this.transformMatrix],
            style: { ...this.style }
        });
    }

    /** 从状态栈恢复上一个状态 */
    restore() {
        if (this.stateStack.length > 0) {
            const state = this.stateStack.pop();
            this.transformMatrix = state.transformMatrix;
            this.style = state.style;
        }
    }

    /**
     * 平移变换
     * @param {number} x X 轴平移量
     * @param {number} y Y 轴平移量
     */
    translate(x, y) {
        this.transformMatrix[4] += x * this.transformMatrix[0] + y * this.transformMatrix[2];
        this.transformMatrix[5] += x * this.transformMatrix[1] + y * this.transformMatrix[3];
    }

    /**
     * 缩放变换
     * @param {number} sx X 轴缩放比例
     * @param {number} sy Y 轴缩放比例
     */
    scale(sx, sy) {
        this.transformMatrix[0] *= sx;
        this.transformMatrix[1] *= sx;
        this.transformMatrix[2] *= sy;
        this.transformMatrix[3] *= sy;
    }

    /**
     * 旋转变换
     * @param {number} angle 旋转角度（弧度）
     */
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const [a, b, c, d] = this.transformMatrix;
        this.transformMatrix[0] = a * cos - b * sin;
        this.transformMatrix[1] = a * sin + b * cos;
        this.transformMatrix[2] = c * cos - d * sin;
        this.transformMatrix[3] = c * sin + d * cos;
    }

    /**
     * 矩阵变换
     * @param {number} a 水平缩放
     * @param {number} b 垂直倾斜
     * @param {number} c 水平倾斜
     * @param {number} d 垂直缩放
     * @param {number} e 水平移动
     * @param {number} f 垂直移动
     */
    transform(a, b, c, d, e, f) {
        const [currentA, currentB, currentC, currentD, currentE, currentF] = this.transformMatrix;
        this.transformMatrix[0] = a * currentA + b * currentC;
        this.transformMatrix[1] = a * currentB + b * currentD;
        this.transformMatrix[2] = c * currentA + d * currentC;
        this.transformMatrix[3] = c * currentB + d * currentD;
        this.transformMatrix[4] = e * currentA + f * currentC + currentE;
        this.transformMatrix[5] = e * currentB + f * currentD + currentF;
    }

    /**
     * 应用变换到点
     * @param {Object} point 点坐标 {x, y}
     * @returns {Object} 变换后的点坐标 {x, y}
     */
    applyTransform(point) {
        const [a, b, c, d, tx, ty] = this.transformMatrix;
        return {
            x: a * point.x + c * point.y + tx,
            y: b * point.x + d * point.y + ty
        };
    }

    /**
     * 文本测量用的离屏 canvas context
     * @private
     * @returns {CanvasRenderingContext2D|null}
     */
    get _measureCtx() {
        if(!this.__measureCtx) {
            try {
                if(typeof document !== 'undefined') {
                    const c = document.createElement('canvas');
                    c.width = c.height = 1;
                    this.__measureCtx = c.getContext('2d');
                }
            } catch(e) {
                this.__measureCtx = null;
            }
        }
        return this.__measureCtx;
    }

    /**
     * 获取当前着色器程序
     * @returns {Object} 着色器程序对象
     */
    get program() {
        return this.graph.context.pathProgram || (this.graph.context.pathProgram=this.createProgram(pathVertexSource, pathFragmentSource));
    }

    /**
     * 设置样式
     * @param {Object|string} style 样式对象或样式属性名
     * @param {string} [value] 样式值（当 style 为字符串时使用）
     */
    setStyle(style = this.style, value = '') {
        if(typeof style === 'string') {
            const obj = {};
            obj[style] = value;
            style = obj;
        }
        this.style = {
            ...this.style,
            ...style
        }
    }

    /**
     * 将颜色转换为 WebGL 可识别的格式
     * @param {string|Object} color 颜色值
     * @returns {Object} RGBA 对象 {r, g, b, a}，范围 0-1
     */
    convertColor(color) {
        if(this.isGradient(color)) return color;
        if(typeof color === 'string') {
            color = this.graph.utils.hexToRGBA(color);
            if(typeof color === 'string') {
                color = this.__parseCSSColor(color);
            }
        }
        if(typeof color === 'object' && color.r !== undefined) {
            return this.graph.utils.rgbToDecimal(color);
        }
        return color;
    }

    /**
     * 利用离屏 canvas 解析任意 CSS 颜色
     * @private
     * @param {string} colorStr CSS 颜色字符串
     * @returns {Object} RGBA 对象 {r, g, b, a}
     */
    __parseCSSColor(colorStr) {
        const ctx = this._measureCtx;
        if(!ctx) return { r: 0, g: 0, b: 0, a: 0 };
        try {
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = '#000000';
            ctx.fillStyle = colorStr;
            ctx.fillRect(0, 0, 1, 1);
            const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
            if(ctx.fillStyle === '#000000' && colorStr !== '#000000' && colorStr !== 'black') {
                return { r: 0, g: 0, b: 0, a: 0 };
            }
            return { r, g, b, a: a / 255 };
        } catch(e) {
            return { r: 0, g: 0, b: 0, a: 0 };
        }
    }

    /**
     * 创建着色器程序
     * @param {string} vertexSrc 顶点着色器源码
     * @param {string} fragmentSrc 片段着色器源码
     * @returns {Object} 着色器程序对象
     */
    createProgram(vertexSrc, fragmentSrc) {        
        return createProgram(this.context, vertexSrc, fragmentSrc);
    }

    /**
     * 使用指定的着色器程序
     * @param {Object} [program] 着色器程序，默认使用当前程序
     * @returns {Object} 着色器程序
     */
    useProgram(program=this.program) {
        program = program.program || program;
        if(this.context.__curent_program === program) return program;
        useProgram(this.context, program.program || program);
        this.context.__curent_program = program;
        return program;
    }

    /**
     * 获取属性位置
     * @param {string} name 属性名
     * @returns {number} 属性位置
     */
    getAttribLocation(name) {
        return this.context.getAttribLocation(this.program.program, name);
    }
    
    /**
     * 获取 uniform 位置
     * @param {string} name uniform 变量名
     * @returns {WebGLUniformLocation} uniform 位置
     */
    getUniformLocation(name) {
        return this.context.getUniformLocation(this.program.program, name);
    }

    /**
     * 将缓冲区数据写入顶点属性
     * @param {Object} buffer 缓冲区对象
     * @param {Object} attr 属性对象
     * @param {number} [size=2] 每个顶点的分量数（1-4）
     * @param {number} [strip=0] 步长，0 表示紧密排列
     * @param {number} [offset=0] 字节偏移量
     * @param {number} [dataType=FLOAT] 数据类型
     * @returns {Object} 缓冲区对象
     */
    writeVertexAttrib(buffer, attr, size=2, strip=0, offset=0, dataType=this.context.FLOAT) {
        buffer.attr = attr;
        return writeVertexAttrib(this.context, buffer, attr, size, strip, offset, dataType);
    }

    /**
     * 禁用顶点属性数组
     * @param {Object} attr 属性对象
     * @returns {Object} 属性对象
     */
    disableVertexAttribArray(attr) {
        try{
            if(!attr) return attr;
            return disableVertexAttribArray(this.context, attr);
        }
        catch(e) {
            console.error(e);
        }
        return attr;
    }

    /**
     * 创建 Float32 缓冲区
     * @param {Array} data 数据数组
     * @param {number} [type=ARRAY_BUFFER] 缓冲区类型
     * @param {number} [drawType=STATIC_DRAW] 绘制类型
     * @returns {Object} 缓冲区对象
     */
    createFloat32Buffer(data, type=this.context.ARRAY_BUFFER, drawType=this.context.STATIC_DRAW) {
        const buffer = createFloat32Buffer(this.context, data, type, drawType);
        return { data, ...buffer };
    }

    /**
     * 创建 Uint16 缓冲区
     * @param {Array} data 数据数组
     * @param {number} [type=ARRAY_BUFFER] 缓冲区类型
     * @param {number} [drawType=STATIC_DRAW] 绘制类型
     * @returns {Object} 缓冲区对象
     */
    createUint16Buffer(data, type=this.context.ARRAY_BUFFER, drawType=this.context.STATIC_DRAW) {
        const buffer = createUint16Buffer(this.context, data, type, drawType);
        return { data, ...buffer };
    }

    /**
     * 删除缓冲区
     * @param {Object} buffer 缓冲区对象
     * @returns {Object} 缓冲区对象
     */
    deleteBuffer(buffer) {
        try {
            if(!buffer) return;
            const bufferHandler = buffer.buffer || buffer;
            if(bufferHandler) return deleteBuffer(this.context, bufferHandler);
        }
        catch(e) {
            console.log(buffer);
            console.error(e);
        }
        return buffer;
    }

    /** @returns {WebGLTexture} 2D 纹理对象 */
    create2DTexture() { 
        return create2DTexture(this.context);
    }

    /**
     * 创建图片纹理
     * @param {Image|HTMLImageElement} img 图像对象
     * @returns {Object} 纹理对象
     */
    createImgTexture(img) {
        return createImgTexture(this.context, img);
    }

    /**
     * 根据像素数据创建纹理
     * @param {ImageData|Uint8Array} data 像素数据
     * @returns {Object} 纹理对象
     */
    createDataTexture(data) {
        return createDataTexture(this.context, data);
    }

    /**
     * 删除纹理
     * @param {Object} texture 纹理对象
     * @returns {Object} 纹理对象
     */
    deleteTexture(texture) {
        try {
            return deleteTexture(this.context, texture.texture || texture);
        }
        catch(e) {
            console.error(e);
        }
        return texture;
    }

    /**
     * 多边形三角化，得到三角形顶点索引数组
     * @param {Array<Object>} points 多边形顶点数组
     * @returns {Array<number>} 三角形顶点索引数组
     */
    earCutPoints(points) {
        const arr = this.pointsToArray(points);
        const ps = earcut(arr);
        return ps;
    }

    /**
     * 多边形三角化，得到三角形顶点数组
     * @param {Array<Object>} points 多边形顶点数组
     * @returns {Array<Array<Object>>} 三角形数组，每个三角形包含3个顶点
     */
    earCutPointsToTriangles(points) {
        this.earCutCache = this.earCutCache || (this.earCutCache = {});
        const len = points.length;
        const key = len + '_' + points[0].x + '_' + points[0].y + '_' + points[len-1].x + '_' + points[len-1].y;
        if (this.earCutCache[key]) return this.earCutCache[key];

        const ps = this.earCutPoints(points);
        const triangles = [];
        for(let i=0;i<ps.length; i+=3) {
            const p1 = points[ps[i]];
            const p2 = points[ps[i+1]];
            const p3 = points[ps[i+2]];
            triangles.push([p1, p2, p3]);
        }
        
        this.earCutCache[key] = triangles;
        return triangles;
    }

    /**
     * 点坐标数组转为一维数组
     * @param {Array<Object>} points 点数组 [{x, y}, ...]
     * @returns {Array<number>} 一维数组 [x1, y1, x2, y2, ...]
     */
    pointsToArray(points) {
        return [].concat(...points.map(p=>[p.x,p.y]));
    }

    /**
     * 一维数组转为点坐标数组
     * @param {Array<number>} arr 一维数组 [x1, y1, x2, y2, ...]
     * @returns {Array<Object>} 点数组 [{x, y}, ...]
     */
    arrayToPoints(arr) {
        const points = [];
        for(let i=0;i<arr.length; i+=2) {
            points.push({
                x: arr[i],
                y: arr[i+1]
            });
        }
        return points;
    }

    /**
     * 创建线性渐变
     * @param {number} x1 起点X坐标
     * @param {number} y1 起点Y坐标
     * @param {number} x2 终点X坐标
     * @param {number} y2 终点Y坐标
     * @param {Object} bounds 渐变边界
     * @returns {WebglGradient} 渐变对象
     */
    createLinearGradient(x1, y1, x2, y2, bounds) {
        return new webglGradient('linear', {
            x1, y1, x2, y2, bounds,
            control: this
        });
    }

    /**
     * 创建径向渐变
     * @param {number} x1 内圆中心X坐标
     * @param {number} y1 内圆中心Y坐标
     * @param {number} r1 内圆半径
     * @param {number} x2 外圆中心X坐标
     * @param {number} y2 外圆中心Y坐标
     * @param {number} r2 外圆半径
     * @param {Object} bounds 渐变边界
     * @returns {WebglGradient} 渐变对象
     */
    createRadialGradient(x1, y1, r1, x2, y2, r2, bounds) {
        return new webglGradient('radial', {
            x1, y1, r1,
            x2, y2, r2,
            bounds,
            control: this
        });
    }

    /**
     * 判断是否为渐变对象
     * @param {Object} obj 待检测对象
     * @returns {boolean} 是否为渐变对象
     */
    isGradient(obj) {
        return obj && obj instanceof webglGradient;
    }

	/**
	 * 测试获取文本所占大小
	 *
	 * @method testSize
	 * @return {object} 含文本大小的对象
	 */
	testSize(text, style=this.style) {
		const ctx = this._measureCtx;
		if(!ctx) return { width: 15, height: style.fontSize || 15 };

		ctx.save && ctx.save();
		if(style.font || style.fontSize) ctx.font = style.font || (style.fontSize + 'px ' + style.fontFamily);
		const size = ctx.measureText ? ctx.measureText(text) : { width: 15 };
        ctx.restore && ctx.restore();
		size.height = style.fontSize ? parseInt(style.fontSize) : 15;
		return size;
	}
}

export default WeblBase;
export { pathVertexSource, pathFragmentSource, MAX_STOPS };

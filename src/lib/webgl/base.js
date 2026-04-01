
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

class WeblBase {
    constructor(graph, option) {
        this.graph = graph;
        this.option = option || {};
        this.style = {
            globalAlpha: 1
        };
        this.stateStack = [];
        this.transformMatrix = [1, 0, 0, 1, 0, 0]; // 2D 变换矩阵
    }

    get context() {
        if(this.graph) return this.graph.context;
    }

    // 保存当前状态
    save() {
        this.stateStack.push({
            transformMatrix: [...this.transformMatrix],
            style: { ...this.style }
        });
    }

    // 恢复上一个状态
    restore() {
        if (this.stateStack.length > 0) {
            const state = this.stateStack.pop();
            this.transformMatrix = state.transformMatrix;
            this.style = state.style;
        }
    }

    // 平移变换
    translate(x, y) {
        // 更新变换矩阵
        this.transformMatrix[4] += x * this.transformMatrix[0] + y * this.transformMatrix[2];
        this.transformMatrix[5] += x * this.transformMatrix[1] + y * this.transformMatrix[3];
    }

    // 缩放变换
    scale(sx, sy) {
        // 更新变换矩阵
        this.transformMatrix[0] *= sx;
        this.transformMatrix[1] *= sx;
        this.transformMatrix[2] *= sy;
        this.transformMatrix[3] *= sy;
    }

    // 旋转变换
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const [a, b, c, d] = this.transformMatrix;
        
        // 更新变换矩阵
        this.transformMatrix[0] = a * cos - b * sin;
        this.transformMatrix[1] = a * sin + b * cos;
        this.transformMatrix[2] = c * cos - d * sin;
        this.transformMatrix[3] = c * sin + d * cos;
    }

    // 矩阵变换
    transform(a, b, c, d, e, f) {
        const [currentA, currentB, currentC, currentD, currentE, currentF] = this.transformMatrix;
        
        // 矩阵乘法
        this.transformMatrix[0] = a * currentA + b * currentC;
        this.transformMatrix[1] = a * currentB + b * currentD;
        this.transformMatrix[2] = c * currentA + d * currentC;
        this.transformMatrix[3] = c * currentB + d * currentD;
        this.transformMatrix[4] = e * currentA + f * currentC + currentE;
        this.transformMatrix[5] = e * currentB + f * currentD + currentF;
    }

    // 应用变换到点
    applyTransform(point) {
        const [a, b, c, d, tx, ty] = this.transformMatrix;
        return {
            x: a * point.x + c * point.y + tx,
            y: b * point.x + d * point.y + ty
        };
    }

    // 文本测量用的离屏 canvas context（1x1 单例缓存，不依赖 textureCanvas）
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

    // i当前程序
    get program() {
        // 默认所有path用同一个编译好的program
        return this.graph.context.pathProgram || (this.graph.context.pathProgram=this.createProgram(pathVertexSource, pathFragmentSource));
    }

    // 设置样式
    setStyle(style = this.style, value = '') {

        if(typeof style === 'string') {
            const obj = {};
            obj[style] = value;
            style = obj;
        }
       /*
        // 设置线条颜色或填充色
        if(style.strokeStyle) {
            let color = style.strokeStyle;
            if(typeof color === 'string') color = this.graph.utils.hexToRGBA(color);
            this.style.strokeStyle = this.graph.utils.rgbToDecimal(color);
            delete style.strokeStyle;
        }
        else if(style.fillStyle) {
            let color = style.fillStyle;
            if(this.isGradient(color)) {
                this.style.fillStyle = color;
            }
            else {
                if(typeof color === 'string') color = this.graph.utils.hexToRGBA(color);
                this.style.fillStyle =  this.graph.utils.rgbToDecimal(color);
            }
            delete style.fillStyle;
        } */       

        this.style = {
            ...this.style,
            ...style
        }
    }

    // 把传统颜色转为webgl识别的
    convertColor(color) {
        if(this.isGradient(color)) return color;
        if(typeof color === 'string') {
            // 先尝试 hexToRGBA 解析
            color = this.graph.utils.hexToRGBA(color);
            // hexToRGBA 对无法识别的格式（如 hsl）会原样返回字符串
            // 利用离屏 canvas 将任意 CSS 颜色转为 rgba
            if(typeof color === 'string') {
                color = this.__parseCSSColor(color);
            }
        }
        if(typeof color === 'object' && color.r !== undefined) {
            return this.graph.utils.rgbToDecimal(color);
        }
        return color;
    }

    // 利用离屏 canvas 解析任意 CSS 颜色（hsl/hsla/命名颜色等）
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

    // 创建程序
    createProgram(vertexSrc, fragmentSrc) {        
        return createProgram(this.context, vertexSrc, fragmentSrc);
    }

    // 指定使用某个程序
    useProgram(program=this.program) {
        program = program.program || program;
        if(this.context.__curent_program === program) return program;
        useProgram(this.context, program.program || program);
        this.context.__curent_program = program;
        return program;
    }

    getAttribLocation(name) {
        return this.context.getAttribLocation(this.program.program, name);
    }
    
    getUniformLocation(name) {
        return this.context.getUniformLocation(this.program.program, name);
    }

    // 把缓冲区的值写入变量
    // buffer: 缓冲区
    // size: 组成数量，必须是1，2，3或4.  每个单元由多少个数组成
    // strip: 步长 数组中一行长度，0 表示数据是紧密的没有空隙，让OpenGL决定具体步长
    // offset: 字节偏移量，必须是类型的字节长度的倍数。
    // dataType: 每个元素的数据类型
    writeVertexAttrib(buffer, attr, size=2, strip=0, offset=0, dataType=this.context.FLOAT) {
        buffer.attr = attr;
        return writeVertexAttrib(this.context, buffer, attr, size, strip, offset, dataType);
    }

    // 禁用attri
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

    // 创建float32的buffer
    createFloat32Buffer(data, type=this.context.ARRAY_BUFFER, drawType=this.context.STATIC_DRAW) {
        const buffer = createFloat32Buffer(this.context, data, type, drawType);
        return {
            data,
            ...buffer
        };
    }

    createUint16Buffer(data, type=this.context.ARRAY_BUFFER, drawType=this.context.STATIC_DRAW) {
        const buffer = createUint16Buffer(this.context, data, type, drawType);
        return {
            data,
            ...buffer
        };
    }

    // 释放
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

    // 生成纹理
    create2DTexture() { 
        return create2DTexture(this.context);
    }

    // 创建图片纹理
    createImgTexture(img) {
        return createImgTexture(this.context, img);
    }

    // 根根像素值生成纹理
    createDataTexture(data) {
        return createDataTexture(this.context, data);
    }

    // 删除纹理
    deleteTexture(texture) {
        try {
            return deleteTexture(this.context, texture.texture || texture);
        }
        catch(e) {
            console.error(e);
        }
        return texture;
    }

    // 多边切割, 得到三角形顶点索引数组
    // polygonIndices 顶点索引，
    earCutPoints(points) {
        const arr = this.pointsToArray(points);
        const ps = earcut(arr);// 切割得到3角色顶点索引，
        return ps;
    }

    // 多边切割, 得到三角形顶点
    // polygonIndices 顶点索引，
    earCutPointsToTriangles(points) {
        this.earCutCache = this.earCutCache || (this.earCutCache = {});
        // 快速缓存 key：用长度和首尾点坐标
        const len = points.length;
        const key = len + '_' + points[0].x + '_' + points[0].y + '_' + points[len-1].x + '_' + points[len-1].y;
        if (this.earCutCache[key]) return this.earCutCache[key];

        const ps = this.earCutPoints(points);// 切割得到3角色顶点索引，
        const triangles = [];
        // 用顶点索引再组合成坐标数组
        for(let i=0;i<ps.length; i+=3) {
            const p1 = points[ps[i]];
            const p2 = points[ps[i+1]];
            const p3 = points[ps[i+2]];

            triangles.push([p1, p2, p3]);// 每三个顶点构成一个三角
        }
        
        this.earCutCache[key] = triangles;
        return triangles;
    }

    // 点坐标数组转为一维数组
    pointsToArray(points) {
        return [].concat(...points.map(p=>[p.x,p.y]));// 把x,y转为数组元素
    }
    // 每2位表示坐标x,y转为坐标点对象
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

    // 创建线性渐变
    createLinearGradient(x1, y1, x2, y2, bounds) {
        return new webglGradient('linear', {
            x1, y1, x2, y2, bounds,
            control: this
        });
    }
    // 创建放射性渐变
    createRadialGradient(x1, y1, r1, x2, y2, r2, bounds) {
        return new webglGradient('radial', {
            x1, y1, r1,
            x2, y2, r2,
            bounds,
            control: this
        });
    }
    // 判断是否是一个渐变对象
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

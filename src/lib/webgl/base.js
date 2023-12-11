
import earcut from '../earcut.js';
import webglGradient from './gradient.js';
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
        if(a_type == 2) {
            v_text_coord = a_text_coord;
        }
    }
`;
// path 片段着色器源码
const pathFragmentSource = `
    precision mediump float;
    uniform sampler2D u_sample;
    uniform vec4 v_texture_bounds; // 纹理的左上坐标和大小 x,y,z,w
    uniform vec4 v_single_color;
    varying float v_type;
    varying vec4 v_color;
    varying vec2 v_text_coord;

    ${convertTexturePosition}

    void main() {
        // 如果是fill，则直接填充颜色
        if(v_type == 1.0) {
            gl_FragColor = v_single_color;
        }
        // 渐变色
        else if(v_type == 3.0) {
            gl_FragColor = v_color;
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
    }

    get context() {
        if(this.graph) return this.graph.context;
    }

    // 创建程序
    createProgram(vertexSrc, fragmentSrc) {        
        this.context.lineWidth(1);
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
        const ps = this.earCutPoints(points);// 切割得到3角色顶点索引，
        const triangles = [];
        // 用顶点索引再组合成坐标数组
        for(let i=0;i<ps.length; i+=3) {
            const p1 = points[ps[i]];
            const p2 = points[ps[i+1]];
            const p3 = points[ps[i+2]];

            triangles.push([p1, p2, p3]);// 每三个顶点构成一个三角
        }
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
		
		this.textureContext.save && this.textureContext.save();
		// 修改字体，用来计算
		if(style.font || style.fontSize) this.textureContext.font = style.font || (style.fontSize + 'px ' + style.fontFamily);
		
		//计算宽度
		const size = this.textureContext.measureText?
                        this.textureContext.measureText(text):
							{width:15};
        this.textureContext.restore &&this.textureContext.restore();
		size.height = this.style.fontSize? this.style.fontSize: 15;
		return size;
	}

    // 使用纹理canvas生成图，
    // 填充可以是颜色或渐变对象
    // 如果指定了points，则表明要绘制不规则的图形
    toFillTexture(fillStyle, bounds, points=null) {
        const canvas = this.textureCanvas;
        if(!canvas) {
            return fillStyle;
        }
        canvas.width = bounds.width;
        canvas.height = bounds.height;

        if(!canvas.width || !canvas.height) {
            return fillStyle;
        }

        this.textureContext.clearRect(0, 0, canvas.width, canvas.height);

        this.textureContext.fillStyle = fillStyle;

        this.textureContext.beginPath();
        if(!points || !points.length) {
            points = [];
            points.push({
                x: bounds.left,
                y: bounds.top
            });
            points.push({
                x: bounds.left + bounds.width,
                y: bounds.top
            });
            points.push({
                x: bounds.left + bounds.width,
                y: bounds.top + bounds.height
            });
            points.push({
                x: bounds.left,
                y: bounds.top + bounds.height
            });
            points.push({
                x: bounds.left,
                y: bounds.top
            });
        }
        if(points && points.length) {
            for(const p of points) {
                //移至当前坐标
                if(p.m) {
                    this.textureContext.moveTo(p.x - bounds.left, p.y - bounds.top);
                }
                else {
                    this.textureContext.lineTo(p.x - bounds.left, p.y - bounds.top);
                }			
            }	
        }
        else {
            this.textureContext.moveTo(0, 0);
            this.textureContext.lineTo(bounds.width, 0);
            this.textureContext.lineTo(bounds.width, bounds.height);
            this.textureContext.lineTo(0, bounds.height);
            this.textureContext.lineTo(0, 0);
        }
        this.textureContext.closePath();
        this.textureContext.fill();

        const data = this.textureContext.getImageData(0, 0, canvas.width, canvas.height);
        return {
            data,
            points
        };
    }
}

export default WeblBase;
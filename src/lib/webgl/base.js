
import earcut from '../earcut.js';
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
    deleteTexture
} from './core/texture.js';

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
        return writeVertexAttrib(this.context, buffer, attr, size, strip, offset, dataType);
    }

    // 禁用attri
    disableVertexAttribArray(attr) {
        try{
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
    create2DTexture(img) { 
        return create2DTexture(this.context, img);
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
}

export default WeblBase;
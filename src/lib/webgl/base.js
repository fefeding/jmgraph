import {
    createProgram,
    writeVertexAttrib
} from './core/program.js';

import {
    createFloat32Buffer,
    deleteBuffer,
} from './core/buffer.js';

import {
    create2DTexture
} from './core/texture.js';

class WeblBase {
    constructor(graph, option) {
        this.graph = graph;
        this.context = graph.context;
        this.option = option || {};
        this.style = this.option.style || {};
    }

    // 创建程序
    createProgram(vertexSrc, fragmentSrc) {
        return createProgram(this.context, vertexSrc, fragmentSrc);
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

    // 创建float32的buffer
    createFloat32Buffer(data, type=this.context.ARRAY_BUFFER, drawType=this.context.STATIC_DRAW) {
        const buffer = createFloat32Buffer(this.context, data, type, drawType);
        return buffer;
    }

    // 释放
    deleteBuffer(buffer) {
        if(buffer) return deleteBuffer(this.context, buffer.buffer || buffer);
    }

    // 生成纹理
    create2DTexture(img) { 
        return create2DTexture(this.context, img);
    }
}

export default WeblBase;
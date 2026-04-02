
/**
 * @fileoverview WebGL 缓冲区管理模块
 * 
 * 本模块提供了 WebGL 缓冲区的创建和管理功能，包括：
 * - 创建通用缓冲区
 * - 创建 Float32 类型缓冲区
 * - 创建 Uint16 类型缓冲区
 * - 删除缓冲区
 * 
 * @module lib/webgl/core/buffer
 * @author jmGraph Team
 */

/**
 * 创建 WebGL 缓冲区
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {Array|TypedArray} data 缓冲区数据
 * @param {number} [type=gl.ARRAY_BUFFER] 缓冲区类型
 * @param {number} [drawType=gl.STATIC_DRAW] 绘制类型
 * @returns {Object} 缓冲区对象 {type, drawType, buffer, unitSize}
 */
function createBuffer(gl, data, type=gl.ARRAY_BUFFER, drawType=gl.STATIC_DRAW) {
    const buffer = gl.createBuffer();
    if(!buffer) {
        throw Error('创建缓冲区对象失败');
    }
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, data.buffer || data, drawType);
    return {
        type,
        drawType,
        buffer,
        unitSize: data.BYTES_PER_ELEMENT
    };
}

/**
 * 创建 Float32 类型缓冲区
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {Array} data 数据数组
 * @param {number} [type=gl.ARRAY_BUFFER] 缓冲区类型
 * @param {number} [drawType=gl.STATIC_DRAW] 绘制类型
 * @returns {Object} 缓冲区对象
 */
function createFloat32Buffer(gl, data, type=gl.ARRAY_BUFFER, drawType=gl.STATIC_DRAW) {
    const vertices = new Float32Array(data);
    const buffer = createBuffer(gl, vertices, type, drawType);
    return buffer;
}

/**
 * 创建 Uint16 类型缓冲区
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {Array} data 数据数组
 * @param {number} [type=gl.ARRAY_BUFFER] 缓冲区类型
 * @param {number} [drawType=gl.STATIC_DRAW] 绘制类型
 * @returns {Object} 缓冲区对象
 */
function createUint16Buffer(gl, data, type=gl.ARRAY_BUFFER, drawType=gl.STATIC_DRAW) {
    const vertices = new Uint16Array(data);
    const buffer = createBuffer(gl, vertices, type, drawType);
    return buffer;
}

/**
 * 删除缓冲区
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {Object|WebGLBuffer} buffer 缓冲区对象或 WebGL 缓冲区
 */
function deleteBuffer(gl, buffer) {
    gl.deleteBuffer(buffer.buffer || buffer);
}

export {
    createBuffer,
    createUint16Buffer,
    createFloat32Buffer,
    deleteBuffer,
}
/**
 * @fileoverview WebGL 着色器程序管理模块
 * 
 * 本模块提供了 WebGL 着色器程序的创建和管理功能，包括：
 * - 创建着色器程序
 * - 提取属性和 uniform 变量
 * - 顶点属性绑定
 * 
 * @module lib/webgl/core/program
 * @author jmGraph Team
 */
import { createShader } from './shader.js';
import { mapSize } from './mapSize.js';
import { mapType } from './mapType.js';

/**
 * 创建着色器程序
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {string} vertexSrc 顶点着色器源码
 * @param {string} fragmentSrc 片段着色器源码
 * @returns {Object} 程序对象 {program, attrs, uniforms}
 */
function createProgram(gl, vertexSrc, fragmentSrc) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSrc);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('PError: Could not initialize shader.');
        console.error('gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS));
        console.error('gl.getError()', gl.getError());

        if (gl.getProgramInfoLog(program) !== '') {
            console.warn('Warning: gl.getProgramInfoLog()', gl.getProgramInfoLog(program));
        }

        gl.deleteProgram(program);
    }

    useProgram(gl, program);

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    const attrs = extractAttributes(gl, program);
    const uniforms = extractUniforms(gl, program);
    
    return { program, attrs, uniforms };
}

/**
 * 使用指定的着色器程序
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {WebGLProgram} program 着色器程序
 */
function useProgram(gl, program) {
    return gl.useProgram(program);
}

/**
 * 提取着色器程序中的所有属性
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {WebGLProgram} program 着色器程序
 * @returns {Object} 属性对象字典
 */
function extractAttributes(gl, program) {
    const attributes = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

    for (let i = 0; i < count; i++){
        const attribData = gl.getActiveAttrib(program, i);
        const type = mapType(gl, attribData.type);
        attributes[attribData.name] = {
            attribData,
            size: mapSize(type),
            type,
            location: gl.getAttribLocation(program, attribData.name),            
        };
    }

    return attributes;
}

/**
 * 提取着色器程序中的所有 uniform 变量
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {WebGLProgram} program 着色器程序
 * @returns {Object} uniform 变量对象字典
 */
function extractUniforms(gl, program) {
    const uniforms = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < count; i++) {
        const uniformData = gl.getActiveUniform(program, i);
        const name = uniformData.name.replace(/\[.*?\]/, "");
        const type = mapType(gl, uniformData.type);

        uniforms[name] = {
            uniformData,
            type: type,
            size: uniformData.size,
            location: gl.getUniformLocation(program, name),
        };
    }

    return uniforms;
}

/**
 * 将缓冲区数据写入顶点属性
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {Object} buffer 缓冲区对象
 * @param {Object} attr 属性对象
 * @param {number} [size=2] 每个顶点的分量数（1-4）
 * @param {number} [strip=0] 步长，0 表示紧密排列
 * @param {number} [offset=0] 字节偏移量
 * @param {number} [dataType=gl.FLOAT] 数据类型
 * @returns {Object} 缓冲区对象
 */
function writeVertexAttrib(gl, buffer, attr, size=2, strip=0, offset=0, dataType=gl.FLOAT) {
    gl.bindBuffer(buffer.type, buffer.buffer);
    gl.vertexAttribPointer(
        attr.location,
        size,
        dataType,
        false,
        strip * buffer.unitSize,
        offset
    );
    gl.enableVertexAttribArray(attr.location);
    return buffer;
}

/**
 * 禁用顶点属性数组
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {Object} attr 属性对象
 */
function disableVertexAttribArray(gl, attr) {
    return gl.disableVertexAttribArray(attr.location);
}

/**
 * 获取属性位置
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {WebGLProgram} program 着色器程序
 * @param {string} name 属性名
 * @returns {number} 属性位置
 */
function getAttribLocation(gl, program, name) {
    return gl.getAttribLocation(program, name);
}

/**
 * 获取 uniform 位置
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {WebGLProgram} program 着色器程序
 * @param {string} name uniform 变量名
 * @returns {WebGLUniformLocation} uniform 位置
 */
function getUniformLocation(gl, program, name) {
    return gl.getUniformLocation(program, name);
}

export {
    createProgram,
    useProgram,
    getAttribLocation,
    getUniformLocation,
    extractAttributes,
    extractUniforms,
    writeVertexAttrib,
    disableVertexAttribArray
}
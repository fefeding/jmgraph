/**
 * @fileoverview WebGL 着色器管理模块
 * 
 * 本模块提供了 WebGL 着色器的创建功能。
 * 
 * @module lib/webgl/core/shader
 * @author jmGraph Team
 */

/**
 * 创建 WebGL 着色器
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {number} type 着色器类型：gl.VERTEX_SHADER 或 gl.FRAGMENT_SHADER
 * @param {string} src 着色器源码
 * @returns {WebGLShader} 编译后的着色器对象
 */
function createShader(gl, type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return shader;
}

export {
    createShader
}
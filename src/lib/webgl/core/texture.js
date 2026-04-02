
/**
 * @fileoverview WebGL 纹理管理模块
 * 
 * 本模块提供了 WebGL 纹理的创建和管理功能，包括：
 * - 创建 2D 纹理
 * - 创建图片纹理
 * - 创建数据纹理
 * - 删除纹理
 * 
 * @module lib/webgl/core/texture
 * @author jmGraph Team
 */

/**
 * 创建 2D 纹理
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @returns {WebGLTexture} 纹理对象
 */
function create2DTexture(gl) {
    const texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    return texture;
}

/**
 * 创建图片纹理
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {Image|HTMLImageElement} img 图像对象
 * @returns {Object} 纹理对象 {texture}
 */
function createImgTexture(gl, img) {
    const texture = create2DTexture(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    return { texture };
}

/**
 * 根据像素数据创建纹理
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {ImageData|Object} pixels 像素数据 {data, width, height}
 * @returns {Object} 纹理对象 {texture}
 */
function createDataTexture(gl, pixels) {
    const data = new Uint8Array(pixels.data || pixels);
    const texture = create2DTexture(gl);

    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        pixels.width || 1,
        pixels.height || 1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        data
    );
    return { texture };
}

/**
 * 删除纹理
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {WebGLTexture} texture 纹理对象
 */
function deleteTexture(gl, texture) {
    return gl.deleteTexture(texture);
}

export {
    create2DTexture,
    createImgTexture,
    createDataTexture,
    deleteTexture
}
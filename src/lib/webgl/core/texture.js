
// 生成纹理
function create2DTexture(gl) {
    const texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // 图像反转Y轴
    gl.activeTexture(gl.TEXTURE0); // 激活纹理单元
    gl.bindTexture(gl.TEXTURE_2D, texture); // 绑定纹理对象
    
    //gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // 放大处理方式  // LINEAR  / NEAREST
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // 缩小处理方式
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // 水平平铺方式
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // 竖直平铺方式

    
    return texture;
}

// 创建图片纹理
function createImgTexture(gl, img) {
    const texture = create2DTexture(gl);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img) // 配置纹理图像
    return {
        texture
    };
}

// 用像素值来绘制纹理
function createDataTexture(gl, pixels) {
    const data = new Uint8Array(pixels.data || pixels);

    const texture = create2DTexture(gl);

    gl.texImage2D(
        gl.TEXTURE_2D, // 纹理目标
        0, // 细节级别,指定详细级别。0 级是基本图像等级，n 级是第 n 个金字塔简化级。
        gl.RGBA, // 纹理内部格式
        pixels.width || 1, // 指定纹理的宽度
        pixels.height || 1, // 指定纹理的高度
        0, // 指定纹理的边框宽度。必须为 0。
        gl.RGBA, // 源图像数据格式
        gl.UNSIGNED_BYTE, // 纹理数据类型
        data // 数据
      );
    return {
        texture
    };
}

// 删除纹理
function deleteTexture(gl, texture) {
    return gl.deleteTexture(texture);
}

export {
    create2DTexture,
    createImgTexture,
    createDataTexture,
    deleteTexture
}
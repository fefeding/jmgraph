
// 生成纹理
function create2DTexture(gl, img) {
    const texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1) // 图像反转Y轴
    gl.activeTexture(gl.TEXTURE0) // 激活纹理单元
    gl.bindTexture(gl.TEXTURE_2D, texture) // 绑定纹理对象
/*
    const level = 0;
const internalFormat = gl.RGBA;
const width = 1;
const height = 1;
const border = 0;
const srcFormat = gl.RGBA;
const srcType = gl.UNSIGNED_BYTE;
const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
gl.texImage2D(
gl.TEXTURE_2D,
level,
internalFormat,
width,
height,
border,
srcFormat,
srcType,
pixel
);*/

    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR) // 放大处理方式
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR) // 缩小处理方式
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE) // 水平平铺方式
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE) // 竖直平铺方式

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img) // 配置纹理图像
    return {
        texture
    };
}

export {
    create2DTexture
}
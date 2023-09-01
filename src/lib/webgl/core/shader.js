// 生成着色器
// type: gl.VERTEX_SHADER 顶点着色器  , gl.FRAGMENT_SHADER  片段着色器
// src: 着色器代码
function createShader(gl, type, src) {
    const shader = gl.createShader(type) // 创建一个顶点着色器
    gl.shaderSource(shader, src); // 编写顶点着色器代码
    gl.compileShader(shader); // 编译着色器

    return shader;
}

export  {
    createShader
}
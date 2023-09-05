import {
    createShader
} from './shader.js';
import {
    mapSize
} from './mapSize.js';
import {
    mapType
} from './mapType.js';

// 创建程序
function createProgram(gl, vertexSrc, fragmentSrc) {
    // 创建顶点着色器
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSrc);
    // 创建片段着色器
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

    const program = gl.createProgram() // 创建一个程序
    gl.attachShader(program, vertexShader) // 添加顶点着色器
    gl.attachShader(program, fragmentShader) // 添加片元着色器
    gl.linkProgram(program) // 连接 program 中的着色器

    // 检查程序链接状态
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('PError: Could not initialize shader.');
        console.error('gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS));
        console.error('gl.getError()', gl.getError());

        // if there is a program info log, log it
        if (gl.getProgramInfoLog(program) !== '') {
            console.warn('Warning: gl.getProgramInfoLog()', gl.getProgramInfoLog(program));
        }

        gl.deleteProgram(program);
    }

    useProgram(gl, program);

    // clean up some shaders
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    const attrs = extractAttributes(gl, program);
    const uniforms = extractUniforms(gl, program);
    
    return {
        program,
        attrs,
        uniforms
    };
}

// 采用program
function useProgram(gl, program) {
    return gl.useProgram(program); // 告诉 webgl 用这个 program 进行渲染
}

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

function extractUniforms(gl, program) {
	const uniforms = {};

    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < count; i++) {
    	const uniformData = gl.getActiveUniform(program, i);
    	const name = uniformData.name.replace(/\[.*?\]/, "");
        const type = mapType(gl, uniformData.type );

    	uniforms[name] = {
            uniformData,
    		type: type,
    		size: uniformData.size,
    		location: gl.getUniformLocation(program, name),
    	};
    }

	return uniforms;
};


// 把缓冲区的值写入变量
// size: 组成数量，必须是1，2，3或4.  每个单元由多少个数组成
// strip: 步长 数组中一行长度，0 表示数据是紧密的没有空隙，让OpenGL决定具体步长
// offset: 字节偏移量，必须是类型的字节长度的倍数。
// dataType: 每个元素的数据类型
function writeVertexAttrib(gl, buffer, attr, size=2,strip=0,offset=0,dataType=gl.FLOAT) {
    gl.bindBuffer(buffer.type, buffer.buffer);
    gl.vertexAttribPointer( // 告诉 OpenGL 如何从 Buffer 中获取数据
            attr.location, // 顶点属性的索引
            size, // 组成数量，必须是1，2，3或4。我们只提供了 x 和 y
            dataType,
            false, // 是否归一化到特定的范围，对 FLOAT 类型数据设置无效
            strip * buffer.unitSize,
            offset
        )
    gl.enableVertexAttribArray(attr.location);
    return buffer;
}

function getAttribLocation(gl, program, name) {
    return gl.getAttribLocation(program, name);
}

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
    writeVertexAttrib
}
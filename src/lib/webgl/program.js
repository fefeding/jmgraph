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

    gl.useProgram(program) // 告诉 webgl 用这个 program 进行渲染

    // clean up some shaders
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return program;
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

export {
    createProgram,
    extractAttributes,
    extractUniforms
}
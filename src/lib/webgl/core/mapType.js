
/**
 * @fileoverview WebGL 类型到 GLSL 类型映射模块
 * 
 * 本模块提供了 WebGL 常量类型到 GLSL 类型名的映射。
 * 
 * @module lib/webgl/core/mapType
 * @author jmGraph Team
 */

/** @type {Object.<number, string>|null} 缓存的类型映射表 */
var GL_TABLE = null;

/**
 * WebGL 常量到 GLSL 类型的映射表
 * @constant {Object.<string, string>}
 */
const GL_TO_GLSL_TYPES = {
    'FLOAT':       'float',
    'FLOAT_VEC2':  'vec2',
    'FLOAT_VEC3':  'vec3',
    'FLOAT_VEC4':  'vec4',

    'INT':         'int',
    'INT_VEC2':    'ivec2',
    'INT_VEC3':    'ivec3',
    'INT_VEC4':    'ivec4',
    
    'BOOL':        'bool',
    'BOOL_VEC2':   'bvec2',
    'BOOL_VEC3':   'bvec3',
    'BOOL_VEC4':   'bvec4',
    
    'FLOAT_MAT2':  'mat2',
    'FLOAT_MAT3':  'mat3',
    'FLOAT_MAT4':  'mat4',
    
    'SAMPLER_2D':  'sampler2D'  
};

/**
 * 将 WebGL 类型常量映射为 GLSL 类型名
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {number} type WebGL 类型常量
 * @returns {string} GLSL 类型名
 */
const mapType = function(gl, type) {
    if(!GL_TABLE) {
        const typeNames = Object.keys(GL_TO_GLSL_TYPES);
        GL_TABLE = {};
        for(let i = 0; i < typeNames.length; ++i) {
            const tn = typeNames[i];
            GL_TABLE[ gl[tn] ] = GL_TO_GLSL_TYPES[tn];
        }
    }

    return GL_TABLE[type];
};

export {
    mapType
}

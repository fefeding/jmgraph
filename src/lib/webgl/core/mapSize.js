
/**
 * @fileoverview GLSL 类型大小映射模块
 * 
 * 本模块提供了 GLSL 类型到其元素数量的映射。
 * 
 * @module lib/webgl/core/mapSize
 * @author jmGraph Team
 */

/**
 * GLSL 类型到元素数量的映射表
 * @constant {Object.<string, number>}
 */
const GLSL_TO_SIZE = {
    'float':    1,
    'vec2':     2,
    'vec3':     3,
    'vec4':     4,

    'int':      1,
    'ivec2':    2,
    'ivec3':    3,
    'ivec4':    4,

    'bool':     1,
    'bvec2':    2,
    'bvec3':    3,
    'bvec4':    4,

    'mat2':     4,
    'mat3':     9,
    'mat4':     16,

    'sampler2D':  1
};

/**
 * 根据 GLSL 类型名获取元素数量
 * @param {string} type GLSL 类型名
 * @returns {number} 元素数量
 */
const mapSize = function(type) { 
    return GLSL_TO_SIZE[type];
};

export {
    mapSize
}

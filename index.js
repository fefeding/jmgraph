

import {jmArc} from "./src/shapes/jmArc.js";
import {jmArrow} from "./src/shapes/jmArrow.js";
import {jmBezier} from "./src/shapes/jmBezier.js";
import {jmCircle} from "./src/shapes/jmCircle.js";
import {jmHArc} from "./src/shapes/jmHArc.js";
import {jmLine} from "./src/shapes/jmLine.js";
import {jmPrismatic} from "./src/shapes/jmPrismatic.js";
import {jmRect} from "./src/shapes/jmRect.js";
import {jmArrowLine} from "./src/shapes/jmArrowLine.js";
import {jmImage} from "./src/shapes/jmImage.js";
import {jmLabel} from "./src/shapes/jmLabel.js";
import {jmResize} from "./src/shapes/jmResize.js";

import { jmGraph as jmGraphCore, 
    jmUtils,
	jmList,
	jmProperty,
	jmShadow,
	jmGradient,
	jmEvents,
	jmControl,
	jmPath, } from "./src/core/jmGraph.js";

const shapes = {
    "arc": jmArc,
    "arrow": jmArrow,
    "bezier": jmBezier,
    "circle": jmCircle,
    "harc": jmHArc,
    "line": jmLine,
    "prismatic": jmPrismatic,
    "rect": jmRect,
    "Arrowline": jmArrowLine,
    "image": jmImage,
    "img": jmImage,
    "label": jmLabel,
    "resize": jmResize
}

export default class jmGraph extends jmGraphCore {
    constructor(canvas, option, callback) {
        
        const targetType = new.target;

        // 合并shapes
        option = Object.assign({}, option);
        option.shapes = Object.assign(shapes, option.shapes||{});
        
        //不是用new实例化的话，返回一个promise
		if(!targetType || !(targetType.prototype instanceof jmGraphCore)) {
			return new Promise(function(resolve, reject){				
				var g = new jmGraph(canvas, option, callback);
				if(resolve) resolve(g);				
			});
        }

        if(typeof option == 'function') {
			callback = option;
			option = {};
        } 
        
        super(canvas, option, callback);
    }
}

//创建实例
const createJmGraph = (...args) => {
	return new jmGraph(...args);
}

export {   
    jmUtils, 
    jmList,    
    jmControl,
    jmPath,
    jmShadow,
    jmGradient,
	jmArc,
	jmArrow,
	jmBezier,
	jmCircle,
	jmHArc,
	jmLine,
	jmPrismatic,
	jmRect,
	jmArrowLine,
	jmImage,
	jmLabel,
    jmResize,
    jmGraph,
    createJmGraph as create
};


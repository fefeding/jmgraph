

import {jmArc} from "./src/shapes/jmArc.js";
import {jmArraw} from "./src/shapes/jmArraw.js";
import {jmBezier} from "./src/shapes/jmBezier.js";
import {jmCircle} from "./src/shapes/jmCircle.js";
import {jmHArc} from "./src/shapes/jmHArc.js";
import {jmLine} from "./src/shapes/jmLine.js";
import {jmPrismatic} from "./src/shapes/jmPrismatic.js";
import {jmRect} from "./src/shapes/jmRect.js";
import {jmArrawLine} from "./src/shapes/jmArrawLine.js";
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
    "arraw": jmArraw,
    "bezier": jmBezier,
    "circle": jmCircle,
    "harc": jmHArc,
    "line": jmLine,
    "prismatic": jmPrismatic,
    "rect": jmRect,
    "arrawline": jmArrawLine,
    "image": jmImage,
    "img": jmImage,
    "label": jmLabel,
    "resize": jmResize
}

export default class jmGraph extends jmGraphCore {
    constructor(canvas, option, callback) {

        //不是用new实例化的话，返回一个promise
		if(new.target !== jmGraph) {
			return new Promise(function(resolve, reject){				
				var g = new jmGraph(canvas, option, callback);
				if(resolve) resolve(g);				
			});
        }

        if(typeof option == 'function') {
			callback = option;
			option = {};
        }        
        

        // 合并shapes
        option = Object.assign({}, option);
        option.shapes = Object.assign(shapes, option.shapes||{});
        
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
	jmArraw,
	jmBezier,
	jmCircle,
	jmHArc,
	jmLine,
	jmPrismatic,
	jmRect,
	jmArrawLine,
	jmImage,
	jmLabel,
    jmResize,
    jmGraph,
    createJmGraph as create
};


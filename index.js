

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
import {jmEllipse} from "./src/shapes/jmEllipse.js";
import {jmPolygon} from "./src/shapes/jmPolygon.js";
import {jmStar} from "./src/shapes/jmStar.js";

import { jmGraph as jmGraphCore,
    jmUtils,
	jmList,
	jmProperty,
	jmShadow,
	jmGradient,
	jmFilter,
	jmEvents,
	jmControl,
	jmPath } from "./src/core/jmGraph.js";

const shapes = {
    "arc": jmArc,
    "arrow": jmArrow,
    "bezier": jmBezier,
    "circle": jmCircle,
    "harc": jmHArc,
    "line": jmLine,
    "prismatic": jmPrismatic,
    "rect": jmRect,
    "arrowline": jmArrowLine,
    "image": jmImage,
    "img": jmImage,
    "label": jmLabel,
    "resize": jmResize,
    "ellipse": jmEllipse,
    "polygon": jmPolygon,
    "star": jmStar
}

class jmGraphImpl extends jmGraphCore {
    constructor(canvas, option, callback) {
        // 合并shapes
        option = Object.assign({}, option);
        option.shapes = Object.assign(shapes, option.shapes||{});

        if(typeof option == 'function') {
			callback = option;
			option = {};
        } 
        
        super(canvas, option, callback);
    }
}

//创建实例，支持不加 new 直接调用
const createJmGraph = (...args) => {
	return new jmGraphImpl(...args);
}

export default jmGraphImpl;

export {
    jmUtils,
    jmList,
    jmControl,
    jmPath,
    jmShadow,
    jmGradient,
    jmFilter,
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
    jmEllipse,
    jmPolygon,
    jmStar,
    jmGraphImpl as jmGraph,
    createJmGraph as create
};


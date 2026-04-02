
/**
 * @fileoverview jmGraph 工具类
 * 
 * jmUtils 是 jmGraph 库的核心工具类，提供了一系列静态工具方法：
 * - 对象克隆与深拷贝
 * - 事件绑定与解绑
 * - DOM 元素位置计算
 * - 几何计算（点在多边形内判断、旋转等）
 * - 颜色解析与转换
 * - 字符串处理
 * 
 * 所有方法都是静态的，可以直接通过 jmUtils.methodName() 调用。
 * 
 * @module jmUtils
 * @author jmGraph Team
 * @license MIT
 */

import { jmList } from './jmList.js';

/**
 * CSS 颜色关键字映射表
 * 
 * 包含所有 CSS 标准颜色名称到十六进制值的映射。
 * 支持 147 种命名颜色 + CSS 系统颜色。
 * 
 * @constant {Object.<string, string>}
 * @private
 */
const colorKeywords = {
    aliceblue:            "#f0f8ff",
    antiquewhite:         "#faebd7",
    aqua:                 "#00ffff",
    aquamarine:           "#7fffd4",
    azure:                "#f0ffff",
    beige:                "#f5f5dc",
    bisque:               "#ffe4c4",
    black:                "#000000",
    blanchedalmond:       "#ffebcd",
    blue:                 "#0000ff",
    blueviolet:           "#8a2be2",
    brown:                "#a52a2a",
    burlywood:            "#deb887",
    cadetblue:            "#5f9ea0",
    chartreuse:           "#7fff00",
    chocolate:            "#d2691e",
    coral:                "#ff7f50",
    cornflowerblue:       "#6495ed",
    cornsilk:             "#fff8dc",
    crimson:              "#dc143c",
    cyan:                 "#00ffff",
    darkblue:             "#00008b",
    darkcyan:             "#008b8b",
    darkgoldenrod:        "#b8860b",
    darkgray:             "#a9a9a9",
    darkgreen:            "#006400",
    darkkhaki:            "#bdb76b",
    darkmagenta:          "#8b008b",
    darkolivegreen:       "#556b2f",
    darkorange:           "#ff8c00",
    darkorchid:           "#9932cc",
    darkred:              "#8b0000",
    darksalmon:           "#e9967a",
    darkseagreen:         "#8fbc8f",
    darkslateblue:        "#483d8b",
    darkslategray:        "#2f4f4f",
    darkslategrey:        "#2f4f4f",
    darkturquoise:        "#00ced1",
    darkviolet:           "#9400d3",
    deeppink:             "#ff1493",
    deepskyblue:          "#00bfff",
    dimgray:              "#696969",
    dimgrey:              "#696969",
    dodgerblue:           "#1e90ff",
    firebrick:            "#b22222",
    floralwhite:          "#fffaf0",
    forestgreen:          "#228b22",
    fuchsia:              "#ff00ff",
    gainsboro:            "#dcdcdc",
    ghostwhite:           "#f8f8ff",
    gold:                 "#ffd700",
    goldenrod:            "#daa520",
    gray:                 "#808080",
    green:                "#008000",
    greenyellow:          "#adff2f",
    grey:                 "#808080",
    honeydew:             "#f0fff0",
    hotpink:              "#ff69b4",
    indianred:            "#cd5c5c",
    indigo:               "#4b0082",
    ivory:                "#fffff0",
    khaki:                "#f0e68c",
    lavender:             "#e6e6fa",
    lavenderblush:        "#fff0f5",
    lawngreen:            "#7cfc00",
    lemonchiffon:         "#fffacd",
    lightblue:            "#add8e6",
    lightcoral:           "#f08080",
    lightcyan:            "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgrey:            "#d3d3d3",
    lightgreen:           "#90ee90",
    lightpink:            "#ffb6c1",
    lightsalmon:          "#ffa07a",
    lightseagreen:        "#20b2aa",
    lightskyblue:         "#87cefa",
    lightslategray:       "#778899",
    lightslategrey:       "#778899",
    lightsteelblue:       "#b0c4de",
    lightyellow:          "#ffffe0",
    lime:                 "#00ff00",
    limegreen:            "#32cd32",
    linen:                "#faf0e6",
    magenta:              "#ff00ff",
    maroon:               "#800000",
    mediumaquamarine:     "#66cdaa",
    mediumblue:           "#0000cd",
    mediumorchid:         "#ba55d3",
    mediumpurple:         "#9370d8",
    mediumseagreen:       "#3cb371",
    mediumslateblue:      "#7b68ee",
    mediumspringgreen:    "#00fa9a",
    mediumturquoise:      "#48d1cc",
    mediumvioletred:      "#c71585",
    midnightblue:         "#191970",
    mintcream:            "#f5fffa",
    mistyrose:            "#ffe4e1",
    moccasin:             "#ffe4b5",
    navajowhite:          "#ffdead",
    navy:                 "#000080",
    oldlace:              "#fdf5e6",
    olive:                "#808000",
    olivedrab:            "#6b8e23",
    orange:               "#ffa500",
    orangered:            "#ff4500",
    orchid:               "#da70d6",
    palegoldenrod:        "#eee8aa",
    palegreen:            "#98fb98",
    paleturquoise:        "#afeeee",
    palevioletred:        "#d87093",
    papayawhip:           "#ffefd5",
    peachpuff:            "#ffdab9",
    peru:                 "#cd853f",
    pink:                 "#ffc0cb",
    plum:                 "#dda0dd",
    powderblue:           "#b0e0e6",
    purple:               "#800080",
    red:                  "#ff0000",
    rebeccapurple:        "#663399",
    rosybrown:            "#bc8f8f",
    royalblue:            "#4169e1",
    saddlebrown:          "#8b4513",
    salmon:               "#fa8072",
    sandybrown:           "#f4a460",
    seagreen:             "#2e8b57",
    seashell:             "#fff5ee",
    sienna:               "#a0522d",
    silver:               "#c0c0c0",
    skyblue:              "#87ceeb",
    slateblue:            "#6a5acd",
    slategray:            "#708090",
    slategrey:            "#708090",
    snow:                 "#fffafa",
    springgreen:          "#00ff7f",
    steelblue:            "#4682b4",
    tan:                  "#d2b48c",
    teal:                 "#008080",
    thistle:              "#d8bfd8",
    tomato:               "#ff6347",
    turquoise:            "#40e0d0",
    violet:               "#ee82ee",
    wheat:                "#f5deb3",
    white:                "#ffffff",
    whitesmoke:           "#f5f5f5",
    yellow:               "#ffff00",
    yellowgreen:          "#9acd32",
    transparent:          "rgba(0,0,0,0)",
    // grey 别名（已有 darkslategrey/lightslategrey/slategrey/dimgrey）
    // 以下为 CSS 系统颜色
    activeborder:         "#bfcaca",
    activecaption:        "#000080",
    appworkspace:         "#ababab",
    background:           "#636363",
    buttonface:           "#c0c0c0",
    buttonhighlight:      "#dedede",
    buttonshadow:         "#808080",
    buttontext:           "#000000",
    captiontext:          "#000000",
    graytext:             "#808080",
    highlight:            "#b3d4fc",
    highlighttext:        "#000000",
    inactiveborder:       "#d4d0c8",
    inactivecaption:      "#bfbbb0",
    inactivecaptiontext:  "#545454",
    infobackground:       "#fbfcc5",
    infotext:             "#000000",
    menu:                 "#c0c0c0",
    menutext:             "#000000",
    scrollbar:            "#c0c0c0",
    threeddarkshadow:     "#696969",
    threedface:           "#c0c0c0",
    threedhighlight:      "#dfdfdf",
    threedlightshadow:    "#dcdcdc",
    threedshadow:         "#808080",
    window:               "#ffffff",
    windowframe:          "#646464",
    windowtext:           "#000000"
  };

/**
 * jmGraph 工具类
 * 
 * 提供常用的静态工具方法，包括对象操作、事件处理、几何计算、颜色转换等。
 * 
 * @class jmUtils
 * @static
 * 
 * @example
 * // 克隆对象
 * const newObj = jmUtils.clone({ a: 1, b: 2 });
 * 
 * // 绑定事件
 * jmUtils.bindEvent(element, 'click', handler);
 * 
 * // 检查点是否在多边形内
 * const inside = jmUtils.pointInPolygon({x: 10, y: 10}, polygonPoints);
 */
export default class jmUtils {
    /**
     * 复制一个对象
     * 
     * @method clone
     * @static
     * @param {object} source 被复制的对象
     * @param {object} target 可选，如果指定就表示复制给这个对象，如果为boolean它就是deep参数
     * @param {boolean} deep 是否深度复制，如果为true,数组内的每个对象都会被复制
     * @param {function} copyHandler 复制对象回调，如果返回undefined，就走后面的逻辑，否则到这里中止
     * @return {object} 参数source的拷贝对象
     */
    static clone(source, target, deep = false, copyHandler = null, deepIndex = 0, cloned = null) {
        // 如果有指定回调，则用回调处理，否则走后面的复制逻辑
        if(typeof copyHandler === 'function') {
            const obj = copyHandler(source, deep, deepIndex);
            if(obj) return obj;
        }

        // 首次调用时初始化克隆映射表（用于处理循环引用）
        if(!cloned) cloned = new WeakMap();

        if(typeof target === 'boolean') {
            deep = target;
            target = undefined;
        }

        // 非对象直接返回
        if(!source || typeof source !== 'object') {
            return typeof target !== 'undefined' ? target : source;
        }

        // 如果source已经被克隆过，直接返回之前的克隆对象，打破循环引用
        if(cloned.has(source)) return cloned.get(source);

        // 数组处理
        if(Array.isArray(source)) {
            //如果为当前泛型，则直接new
            if(this.isType(source, jmList)) {
                return new jmList(source);
            }
            if(deep) {
                let dest = [];
                cloned.set(source, dest);
                for(let i = 0; i < source.length; i++) {
                    dest.push(this.clone(source[i], undefined, deep, copyHandler, deepIndex + 1, cloned));
                }
                return dest;
            }
            return source.slice(0);
        }

        // 不复制页面元素和class对象（如jmControl实例等复杂对象保持引用）
        if(source.tagName || source.getContext || source.emit) {
            return source;
        }

        // 普通对象处理
        target = target || {};
        cloned.set(source, target);

        // 保持原型链一致
        if(source.__proto__) target.__proto__ = source.__proto__;
        
        // 遍历自身可枚举属性（字符串键 + Symbol键），避免触发原型链上宿主对象的getter
        const keys = Object.keys(source).concat(Object.getOwnPropertySymbols(source));
        for(const k of keys) {
            if(k === 'constructor') continue;
            const v = source[k];
            // 不复制页面元素和class对象
            if(v && (v.tagName || v.getContext || v.emit)) {
                target[k] = v;
                continue;
            }

            // 如果不是对象和空，则采用target的属性
            if(typeof target[k] === 'object' || typeof target[k] === 'undefined') {                    
                target[k] = this.clone(v, target[k], deep, copyHandler, deepIndex + 1, cloned);
            }
        }
        return target;
    }

    /**
     * 绑定事件到html对象
     * 
     * @method bindEvent
     * @static
     * @param {element} html元素对象
     * @param {string} name 事件名称
     * @param {function} fun 事件委托
     * @returns {name, fun, target} 返回当前绑定
     */
    static bindEvent(target, name, fun, opt) {
        if(name &&  name.indexOf && name.indexOf(' ') != -1) {
            let ns = name.split(' ');
            for(let i=0;i<ns.length;i++) {
                this.bindEvent(target, ns[i], fun, opt);
            }
        }
        if(target.attachEvent) {
            target.attachEvent("on"+name, fun, opt);
        }    
        else if(target.addEventListener) {
            target.addEventListener(name, fun, opt);
        }
        return {
            name,
            target,
            fun
        };
    }

    /**
     * 从对象中移除事件到
     * 
     * @method removeEvent
     * @static
     * @param {element} html元素对象
     * @param {string} name 事件名称
     * @param {function} fun 事件委托
     */
    static removeEvent(target, name, fun) {
        if(target.removeEventListener) {
            return target.removeEventListener(name, fun, false);
        }    
        else if(target.detachEvent) {
            target.detachEvent('on' + name, fun);
            return true;
        }
        else {
            target['on' + name] = null;
        }
    }

    /**
     * 获取元素的绝对定位
     *
     * @method getElementPosition
     * @static
     * @param {element} el 目标元素对象
     * @return {position} 位置对象(top,left)
     */
    static getElementPosition(el) {    
        let pos = {"top": 0, "left": 0};
        if(!el) return pos;

        if (el.offsetParent) {
            while (el.offsetParent) {
                pos.top += el.offsetTop;
                pos.left += el.offsetLeft;
                el = el.offsetParent;
            }
        }
		else if(el.x) {
			pos.left += el.x;
		}
		else if(el.y){
			pos.top += el.y;
		}
        return pos;
    }
    /**
     * 获取元素事件触发的位置
     *
     * @method getEventPosition
     * @static
     * @param {eventArg} evt 当前触发事件的参数
     * @param {point} [scale] 当前画布的缩放比例
     * @return {point} 事件触发的位置 
     */
    static getEventPosition (evt, scale) {
        evt = evt || event;
        const isWXMiniApp = evt.isWXMiniApp;
        let isTouch = false;
        let touches = evt.changedTouches || evt.targetTouches || evt.touches;
        let target = evt.target || evt.srcElement;
        if(touches && touches.length) {
            evt = touches[0];//兼容touch事件            
            if(!evt.target) evt.target = target;
            isTouch = true;
        }
        let px = evt.pageX || evt.x;
        if(typeof px == 'undefined')  px = evt.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);    
        let py = evt.pageY || evt.y;
        if(typeof py == 'undefined')  py = evt.clientY + (document.documentElement.scrollTop || document.body.scrollTop);

        let ox = evt.offsetX;
        let oy = evt.offsetY;
        if(typeof ox === 'undefined' && typeof oy === 'undefined') {
            // 小程序下取x,y就是它的相对坐标
            if(isWXMiniApp) {
                ox = evt.x;
                oy = evt.y;
            }
            else {
                let p = this.getElementPosition(target);
                ox= px - p.left;
                oy = py - p.top;
            }
        }
        if(scale) {
            if(scale.x) ox = ox / scale.x;
            if(scale.y) oy = oy / scale.y;
        }

        return {
            pageX: px,
            pageY: py,
            clientX: evt.clientX,
            clientY: evt.clientY,
            //相对于容器偏移量
            offsetX: ox,
            offsetY: oy,
            layerX: evt.layerX,
            layerY: evt.layerY,
            screenX: evt.screenX,
            screenY: evt.screenY,
            x: ox,
            y: oy,
            isTouch: isTouch,
            touches,
            isWXMiniApp
        };
    }

    /**
     * 检 查对象是否为指定的类型,不包括继承
     * 
     * @method isType
     * @static
     * @param {object} target 需要判断类型的对象
     * @param {class} type 对象类型
     * @return {boolean} 返回对象是否为指定类型 
     */
    static isType(target, type) {
        if(!target || typeof target !== 'object') return false;
        if(target.constructor === type) return true;
        /*if(target.__baseType) {        
            return jmUtils.isType(target.__baseType.prototype,type);
        }*/

        //return target instanceof type;
        return false;
    }
    /**
     * 判断点是否在多边形内
     * 如果一个点在多边形内部，任意角度做射线肯定会与多边形要么有一个交点，要么有与多边形边界线重叠。
     * 如果一个点在多边形外部，任意角度做射线要么与多边形有一个交点，要么有两个交点，要么没有交点，要么有与多边形边界线重叠。
     * 利用上面的结论，我们只要判断这个点与多边形的交点个数，就可以判断出点与多边形的位置关系了。
     * 
     * @method pointInPolygon
     * @static
     * @param {point} pt 坐标对象
     * @param {array} polygon 多边型角坐标对象数组
     * @param {number} offset 判断可偏移值
     * @return {integer} 0= 不在图形内和线上，1=在边上，2=在图形内部
     */
    static pointInPolygon(pt, polygon, offset) {
        offset = offset || 1;
        offset = offset / 2;
        const n = polygon.length;
        
        if(!polygon || n == 0) return 0;
        
        if(n == 1) {
            return Math.abs(polygon[0].x - pt.x) <= offset && Math.abs(polygon[0].y - pt.y) <= offset ? 1 : 0;
        }
        
        if(n == 2) {
            return this.pointOnLine(pt, polygon[0], polygon[1], offset);
        }

        for (let i = 0; i < n; i++) {
            if (Math.abs(polygon[i].x - pt.x) <= offset && 
                Math.abs(polygon[i].y - pt.y) <= offset) {
                return 1;
            }
        }

        return this.rayCasting(pt, polygon, offset);
    }

    /**
     * 判断点是否在线段上
     * 
     * 通过计算点到线段的垂直距离来判断点是否在线段上。
     * 同时检查点是否在线段的范围内（不仅仅是直线上）。
     * 
     * @method pointOnLine
     * @static
     * @private
     * @param {Object} pt 待检测的点 {x, y}
     * @param {Object} p1 线段起点 {x, y}
     * @param {Object} p2 线段终点 {x, y}
     * @param {number} offset 允许的偏差值（像素）
     * @returns {number} 0=不在线段上, 1=在线段上
     * 
     * @example
     * const onLine = jmUtils.pointOnLine(
     *     {x: 5, y: 5},      // 待检测点
     *     {x: 0, y: 0},      // 起点
     *     {x: 10, y: 10},    // 终点
     *     2                  // 允许偏差
     * );
     * // 返回 1，点在对角线上
     */
    static pointOnLine(pt, p1, p2, offset) {
        const minX = Math.min(p1.x, p2.x);
        const maxX = Math.max(p1.x, p2.x);
        const minY = Math.min(p1.y, p2.y);
        const maxY = Math.max(p1.y, p2.y);

        if (minX - pt.x > offset || pt.x - maxX > offset) {
            return 0;
        }
        if (minY - pt.y > offset || pt.y - maxY > offset) {
            return 0;
        }

        if (p1.x == p2.x) {
            return Math.abs(p1.x - pt.x) <= offset && 
                   (pt.y - p1.y) * (pt.y - p2.y) <= 0 ? 1 : 0;
        }

        if (p1.y == p2.y) {
            return Math.abs(p1.y - pt.y) <= offset && 
                   (pt.x - p1.x) * (pt.x - p2.x) <= 0 ? 1 : 0;
        }

        if (Math.abs(p1.x - pt.x) < offset && Math.abs(p1.y - pt.y) < offset) {
            return 1;
        }
        if (Math.abs(p2.x - pt.x) < offset && Math.abs(p2.y - pt.y) < offset) {
            return 1;
        }

        if (pt.y != p1.y && pt.y != p2.y) {
            const f = (p2.x - p1.x) / (p2.y - p1.y) * (pt.y - p1.y);
            const ff = (pt.y - p1.y) / Math.sqrt(f * f + (pt.y - p1.y) * (pt.y - p1.y));
            const l = ff * (pt.x - p1.x - f);
            
            return Math.abs(l) <= offset ? 1 : 0;
        }
        return 0;
    }

    /**
     * 射线法判断点是否在多边形内部
     * 
     * 从待测点向右发射一条水平射线，计算与多边形边界的交点数量。
     * - 交点数为奇数：点在多边形内部
     * - 交点数为偶数：点在多边形外部
     * 
     * 这是判断点是否在任意多边形内的经典算法，时间复杂度 O(n)。
     * 
     * @method rayCasting
     * @static
     * @private
     * @param {Object} pt 待检测的点 {x, y}
     * @param {Array<Object>} polygon 多边形顶点数组 [{x, y}, ...]
     * @param {number} offset 允许的偏差值（未使用）
     * @returns {number} 0=在多边形外部, 2=在多边形内部
     * 
     * @see {@link https://en.wikipedia.org/wiki/Point_in_polygon Point in polygon - Wikipedia}
     */
    static rayCasting(pt, polygon, offset) {
        const n = polygon.length;
        let inside = false;
        const testY = pt.y;
        const testX = pt.x;

        for (let i = 0, j = n - 1; i < n; j = i++) {
            const yi = polygon[i].y;
            const yj = polygon[j].y;
            const xi = polygon[i].x;
            const xj = polygon[j].x;

            const intersect = ((yi > testY) !== (yj > testY)) &&
                (testX < (xj - xi) * (testY - yi) / (yj - yi) + xi);

            if (intersect) {
                inside = !inside;
            }
        }

        return inside ? 2 : 0;
    }

    /**
     * @method judge 判断点是否在多边形中
     * @param {point} dot {{x,y}} 需要判断的点
     * @param {array} coordinates {{x,y}} 多边形点坐标的数组，为保证图形能够闭合，起点和终点必须相等。
     *        比如三角形需要四个点表示，第一个点和最后一个点必须相同。 
     * @param  {number} 是否为实心 1= 是
     * @returns {boolean} 结果 true=在形状内
     */
    /*static judge(dot,coordinates,noneZeroMode) {
        // 默认启动none zero mode
        noneZeroMode=noneZeroMode||1;
        var x = dot.x,y=dot.y;
        var crossNum = 0;
        // 点在线段的左侧数目
        var leftCount = 0;
        // 点在线段的右侧数目
        var rightCount = 0;
        for(var i=0;i<coordinates.length-1;i++){
            var start = coordinates[i];
            var end = coordinates[i+1];
                
            // 起点、终点斜率不存在的情况
            if(start.x===end.x) {
                // 因为射线向右水平，此处说明不相交
                if(x>start.x) continue;
                
                // 从左侧贯穿
                if((end.y>start.y&&y>=start.y && y<=end.y)){
                    leftCount++;
                    crossNum++;
                }
                // 从右侧贯穿
                if((end.y<start.y&&y>=end.y && y<=start.y)) {
                    rightCount++;
                    crossNum++;
                }
                continue;
            }
            // 斜率存在的情况，计算斜率
            var k=(end.y-start.y)/(end.x-start.x);
            // 交点的x坐标
            var x0 = (y-start.y)/k+start.x;
            // 因为射线向右水平，此处说明不相交
            if(x>x0) continue;
                
            if((end.x>start.x&&x0>=start.x && x0<=end.x)){
                crossNum++;
                if(k>=0) leftCount++;
                else rightCount++;
            }
            if((end.x<start.x&&x0>=end.x && x0<=start.x)) {
                crossNum++;
                if(k>=0) rightCount++;
                else leftCount++;
            }
        }
        
        return noneZeroMode===1?leftCount-rightCount!==0:crossNum%2===1;
    }*/

    /**
     * 检查边界，子对象是否超出父容器边界
     * 当对象偏移offset后是否出界
     * 返回(left:0,right:0,top:0,bottom:0)
     * 如果right>0表示右边出界right偏移量,left<0则表示左边出界left偏移量
     * 如果bottom>0表示下边出界bottom偏移量,top<0则表示上边出界ltop偏移量
     *
     * @method checkOutSide
     * @static
     * @param {bound} parentBounds 父对象的边界
     * @param {bound} targetBounds 对象的边界
     * @param {number} offset 判断是否越界可容偏差
     * @return {bound} 越界标识
     */
    static checkOutSide(parentBounds, targetBounds, offset) {
        let result = {left:0,right:0,top:0,bottom:0};
        if(offset.x < 0 ) {
            result.left = targetBounds.left + offset.x - parentBounds.left;
        }
        else if(offset.x > 0 ) {
            result.right = targetBounds.right + offset.x - parentBounds.right;
        }

        if(offset.y < 0 ) {
            result.top = targetBounds.top + offset.y - parentBounds.top;
        }
        else if(offset.y > 0) {
            result.bottom = targetBounds.bottom + offset.y - parentBounds.bottom;
        }
        return result;
    }

    /**
     * 把一个或多个点绕某个点旋转一定角度
     * 先把坐标原点移到旋转中心点，计算后移回
     * @method rotatePoints
     * @static
     * @param {Array/object} p 一个或多个点
     * @param {*} rp 旋转中心点
     * @param {*} r 旋转角度
     */
    static rotatePoints(p, rp, r) {
        if(!r || !p) return p;
        let cos = Math.cos(r);
        let sin = Math.sin(r);
        if(Array.isArray(p)) {
            for(let i=0;i<p.length;i++) {
                if(!p[i]) continue;
                let x1 = p[i].x - rp.x;
                let y1 = p[i].y - rp.y;
                p[i].x = x1 * cos - y1 * sin + rp.x;
                p[i].y = x1 * sin + y1 * cos + rp.y;
            }
        }
        else {
            let x1 = p.x - rp.x;
            let y1 = p.y - rp.y;
            p.x = x1 * cos - y1 * sin + rp.x;
            p.y = x1 * sin + y1 * cos + rp.y;
        }
        return p;
    }

    /**
     * 去除字符串开始字符
     * 
     * @method trimStart
     * @static
     * @param {string} source 需要处理的字符串
     * @param {char} [c] 要去除字符串的前置字符
     * @return {string} 去除前置字符后的字符串
     */
    static trimStart(source, c) {
        c = c || ' ';
        if(source && source.length > 0) {
            let sc = source[0];
            if(sc === c || c.indexOf(sc) >= 0) {
                source = source.substring(1);
                return this.trimStart(source,c);
            }        
        }
        return source;
    }

    /**
     * 去除字符串结束的字符c
     *
     * @method trimEnd
     * @static
     * @param {string} source 需要处理的字符串
     * @param {char} [c] 要去除字符串的后置字符
     * @return {string} 去除后置字符后的字符串
     */
    static trimEnd(source, c) {
        c = c || ' ';
        if(source && source.length > 0) {
            let sc = source[source.length - 1];
            if(sc === c || c.indexOf(sc) >= 0) {
                source = source.substring(0,source.length - 1);
                return this.trimStart(source,c);
            }        
        }
        return source;
    }

    /**
     * 去除字符串开始与结束的字符
     *
     * @method trim
     * @static
     * @param {string} source 需要处理的字符串
     * @param {char} [c] 要去除字符串的字符
     * @return {string} 去除字符后的字符串
     */
    static trim(source,c) {
        return this.trimEnd(this.trimStart(source,c),c);
    }

    /**
     * 检查是否为百分比参数
     *
     * @method checkPercent
     * @static
     * @param {string} 字符串参数
     * @return {boolean} true=当前字符串为百分比参数,false=不是
     */
    static checkPercent(per) {
        if(typeof per === 'string') {
            per = this.trim(per);
            if(per[per.length - 1] == '%') {
                return per;
            }
        }
    }

    /**
     * 转换百分数为数值类型
     *
     * @method percentToNumber
     * @static
     * @param {string} per 把百分比转为数值的参数
     * @return {number} 百分比对应的数值
     */
    static percentToNumber(per) {
        if(typeof per === 'string') {
            let tmp = this.checkPercent(per);
            if(tmp) {
                per = this.trim(tmp,'% ');
                per = per / 100;
            }
        }
        return per;
    }

    /**
     * 转换16进制为数值
     *
     * @method hexToNumber
     * @static
     * @param {string} h 16进制颜色表达
     * @return {number} 10进制表达
     */
    static hexToNumber(h) {
        if(typeof h !== 'string') return h;

        h = h.toLowerCase();
        let hex = '0123456789abcdef';
        let v = 0;
        let l = h.length;
        for(let i=0;i<l;i++) {
            let iv = hex.indexOf(h[i]);
            if(iv == 0) continue;
            
            for(let j=1;j<l - i;j++) {
                iv *= 16;
            }
            v += iv;
        }
        return v;
    }

    /**
     * 转换数值为16进制字符串表达
     *
     * @method hex
     * @static
     * @param {number} v 数值
     * @return {string} 16进制表达
     */
    static numberToHex(v) {
        let hex = '0123456789abcdef';
        
        let h = '';
        while(v > 0) {
            let t = v % 16;
            h = hex[t] + h;
            v = Math.floor(v / 16);
        }
        return h;
    }

    /**
     * 16进制颜色转为r g b a 对象 {r, g , b, a}
     * @param {string}} hex 16进度的颜色
     */
    static hexToRGBA(hex) {
        if(typeof hex === 'string') hex = this.trim(hex);   
        else return hex;

        // 如果缓存存在，则直接返回
        this.__hexToRGBA_Cache = this.__hexToRGBA_Cache || {};
        if(this.__hexToRGBA_Cache[hex]) return this.__hexToRGBA_Cache[hex];

        let res = hex;

        // 系统颜色
        if(colorKeywords[res]) res = colorKeywords[res];

        //当为7位时，表示需要转为带透明度的rgba
        if(res[0] == '#') {
            const color = {
                a: 1
            };
            if(res.length >= 8) {
                color.a = res.substr(1,2);
                color.g = res.substr(5,2);
                color.b = res.substr(7,2);
                color.r = res.substr(3,2);
                //透明度
                color.a = Number((this.hexToNumber(color.a) / 255).toFixed(4));

                color.r = this.hexToNumber(color.r||0);
                color.g = this.hexToNumber(color.g||0);
                color.b = this.hexToNumber(color.b||0);
                res = color; 
            }
            // #cccccc || #ccc
            else if(res.length === 7 || res.length === 4) {
                // #ccc这种情况，把每个位复制一份
                if(res.length === 4) {
                    color.g = res.substr(2, 1);
                    color.g = color.g + color.g;
                    color.b = res.substr(3, 1);
                    color.b = color.b + color.b;
                    color.r = res.substr(1, 1);
                    color.r = color.r + color.r;
                }
                else {
                    color.g = res.substr(3, 2);//除#号外的第二位
                    color.b = res.substr(5, 2);
                    color.r = res.substr(1, 2);
                }

                color.r = this.hexToNumber(color.r||0);
                color.g = this.hexToNumber(color.g||0);
                color.b = this.hexToNumber(color.b||0);
                
                res = color; 
            }
            //如果是5位的话，# 则第2位表示A，后面依次是r,g,b
            else if(res.length === 5) {
                color.a = res.substr(1,1);
                color.g = res.substr(3,1);//除#号外的第二位
                color.b = res.substr(4,1);
                color.r = res.substr(2,1);

                color.r = this.hexToNumber(color.r||0);
                color.g = this.hexToNumber(color.g||0);
                color.b = this.hexToNumber(color.b||0);
                //透明度
                color.a = Number((this.hexToNumber(color.a) / 255).toFixed(4));
                res = color; 
            }
        }  
        if(typeof res === 'string') {
            const m = res.match(/rgb(a)?\s*\(\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)\s*(,\s*[\d\.]+)?\s*\)/i); 
            if(m && m.length === 6) {
                const color = {
                    r: Number(m[2]),
                    g: Number(m[3]),
                    b: Number(m[4]),
                    a: Number(this.trimStart(m[5]||'1', ','))
                };
                res = color;
            }
        }
        return this.__hexToRGBA_Cache[hex] = res;     
    }

    /**
     * 将 RGB 颜色值从 0-255 范围转换为 0-1 范围
     * 
     * WebGL 中的颜色值通常使用 0-1 的浮点数表示，
     * 此方法用于将标准 RGB 值转换为 WebGL 兼容格式。
     * 
     * @method rgbToDecimal
     * @static
     * @param {Object} color 颜色对象 {r, g, b, a?}
     * @returns {Object} 转换后的颜色对象 {r, g, b, a?}，其中 r/g/b 为 0-1 范围
     * 
     * @example
     * const color = jmUtils.rgbToDecimal({ r: 255, g: 128, b: 64 });
     * // 返回 { r: 1, g: 0.502, b: 0.251 }
     */
    static rgbToDecimal(color) {
        color = this.clone(color);
        color.r = this.byteToDecimal(color.r);
        color.g = this.byteToDecimal(color.g);
        color.b = this.byteToDecimal(color.b);
        return color;
    }

    /**
     * 将字节值（0-255）转换为小数（0-1）
     * 
     * @method byteToDecimal
     * @static
     * @private
     * @param {number} b 字节值（0-255）
     * @returns {number} 小数值（0-1）
     */
    static byteToDecimal(b) {
        return b / 255;
    }

    /**
     * 转换颜色格式，如果输入r,g,b则转为hex格式,如果为hex则转为r,g,b格式
     *
     * @method toColor
     * @static
     * @param {string} hex 16进制颜色表达
     * @return {string} 颜色字符串
     */
    static toColor(r, g, b, a) {    
        if(typeof r === 'string' && r) {
            r = this.trim(r); 
            // 正常的颜色表达，不需要转换
            if(r[0] === '#' && (r.length === 4 || r.length === 7)) return r;

            const color = this.hexToRGBA(r);
            if(typeof color === 'string') return color;
            
            r = typeof color.r !== 'undefined'? color.r: r;
            g = typeof color.g !== 'undefined'? color.g: g;
            b = typeof color.b !== 'undefined'? color.b: b;
            a = typeof color.a !== 'undefined'? color.a: a;
        }
        if(r && typeof r === 'object') {
            g = r.g;
            b = r.b;
            a = r.a || 1;
            r = r.r;
        }
        if(typeof r != 'undefined' && typeof g != 'undefined' && typeof b != 'undefined') {
            if(typeof a != 'undefined') {            
                return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
            }
            else {
                return 'rgb(' + r + ',' + g + ',' + b + ')';
            }
        }
        return r;
    }
    /**
     * 请求动画帧
     * 
     * 封装浏览器原生的 requestAnimationFrame 方法，提供跨浏览器兼容性。
     * 在不支持 requestAnimationFrame 的环境中降级为 setTimeout。
     * 
     * @method requestAnimationFrame
     * @static
     * @param {Function} callback 动画帧回调函数，接收时间戳参数
     * @param {Window} [win] 可选的窗口对象（用于多窗口环境）
     * @returns {number} 动画帧请求ID，用于取消
     * 
     * @example
     * let animationId;
     * function animate(timestamp) {
     *     // 更新动画
     *     animationId = jmUtils.requestAnimationFrame(animate);
     * }
     * animationId = jmUtils.requestAnimationFrame(animate);
     * 
     * // 取消动画
     * jmUtils.cancelAnimationFrame(animationId);
     */
    static requestAnimationFrame(callback, win) {
        let fun = win && win.requestAnimationFrame? win.requestAnimationFrame: (typeof window !== 'undefined' && window.requestAnimationFrame? window.requestAnimationFrame: setTimeout);        
		return fun(callback, 20);
    }
    /**
     * 取消动画帧请求
     * 
     * 取消之前通过 requestAnimationFrame 注册的回调。
     * 在不支持 cancelAnimationFrame 的环境中降级为 clearTimeout。
     * 
     * @method cancelAnimationFrame
     * @static
     * @param {number} handler requestAnimationFrame 返回的请求ID
     * @param {Window} [win] 可选的窗口对象（用于多窗口环境）
     * 
     * @example
     * const animationId = jmUtils.requestAnimationFrame(animate);
     * jmUtils.cancelAnimationFrame(animationId);
     */
    static cancelAnimationFrame(handler, win) {
        let fun = win && win.cancelAnimationFrame? win.cancelAnimationFrame: (typeof window !== 'undefined' && window.cancelAnimationFrame? window.cancelAnimationFrame: clearTimeout);        
		return fun(handler);
    }	
}
export { jmUtils };
export { colorKeywords };

import { jmList } from './jmList.js';

/**
 * 画图基础对象
 * 当前库的工具类
 * 
 * @class jmUtils
 * @static
 */
class jmUtils {
    /**
     * 复制一个对象
     * 
     * @method clone
     * @static
     * @param {object} source 被复制的对象
     * @param {boolean} deep 是否深度复制，如果为true,数组内的每个对象都会被复制
     * @return {object} 参数source的拷贝对象
     */
    static clone(source, deep = false) {
        if(source && typeof source === 'object') {
            //如果为当前泛型，则直接new
            if(this.isType(source, jmList)) {
                return new jmList(source);
            }
            else if(Array.isArray(source)) {
                //如果是深度复，则拷贝每个对象
                if(deep) {
                    let dest = [];
                    for(let i=0; i<source.length; i++) {
                        dest.push(this.clone(source[i], deep));
                    }
                    return dest;
                }
                return source.slice(0);
            }
            let target = {};
            target.constructor = source.constructor;
            for(let k in source) {
                target[k] = this.clone(source[k], deep);
            }
            return target;
        }
        return source;
    }

    /**
     * 绑定事件到html对象
     * 
     * @method bindEvent
     * @static
     * @param {element} html元素对象
     * @param {string} name 事件名称
     * @param {function} fun 事件委托
     */
    static bindEvent(target, name, fun, opt) {
        if(name &&  name.indexOf && name.indexOf(' ') != -1) {
            let ns = name.split(' ');
            for(let i=0;i<ns.length;i++) {
                this.bindEvent(target, ns[i], fun, opt);
            }
            return;
        }
        if(target.attachEvent) {
            return target.attachEvent("on"+name, fun, opt);
        }    
        else if(target.addEventListener) {
            target.addEventListener(name, fun, opt);
            return true;
        }
        else {
            return false;
        }
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
        else if(el.x){
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
        
        let isTouch = false;
        let touches = evt.changedTouches || evt.targetTouches || evt.touches;
        let target = evt.target || evt.srcElement;
        if(touches) {
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
            let p = this.getElementPosition(target);
            ox= px - p.left;
            oy = py - p.top;
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
            isTouch: isTouch
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
        let i, j, n = polygon.length;
        let inside = false, redo = true;

        if(!polygon || n == 0) return 0;
        if(n == 1) {
            return Math.abs(polygon[0].x - pt.x) <= offset && Math.abs(polygon[0].y - pt.y) <= offset;
        }
        
        //一条直线
        else if(n == 2) {
            //在最左边之外或在最右边之外
            if(Math.min(polygon[0].x,polygon[1].x) - pt.x > offset || 
                pt.x - Math.max(polygon[0].x,polygon[1].x) > offset ) {
                return 0;
            }
            //在最顶部之外或在最底部之外
            if(Math.min(polygon[0].y,polygon[1].y) - pt.y > offset || 
                pt.y - Math.max(polygon[0].y,polygon[1].y) > offset) {
                return 0;
            }

            //如果线为平行为纵坐标。
            if(polygon[0].x == polygon[1].x){
                return (Math.abs(polygon[0].x - pt.x) <= offset && (pt.y - polygon[0].y) * (pt.y - polygon[1].y) <= 0)? 1:0;
            }
            //如果线为平行为横坐标。
            if(polygon[0].y == polygon[1].y){
                return (Math.abs(polygon[0].y - pt.y) <= offset && (pt.x - polygon[0].x) * (pt.x - polygon[1].x) <= 0)? 1:0;
            }

            if(Math.abs(polygon[0].x - pt.x) < offset && Math.abs(polygon[0].y - pt.y) < offset) {
                return 1;
            }
            if(Math.abs(polygon[1].x - pt.x) < offset && Math.abs(polygon[1].y - pt.y) < offset) {
                return 1;
            }

            //点到直线的距离小于宽度的一半，表示在线上
            if(pt.y != polygon[0].y && pt.y != polygon[1].y) {

                let f = (polygon[1].x - polygon[0].x) / (polygon[1].y - polygon[0].y) * (pt.y - polygon[0].y);
                let ff = (pt.y - polygon[0].y) / Math.sqrt(f * f + (pt.y - polygon[0].y) * (pt.y - polygon[0].y));
                let l = ff * (pt.x - polygon[0].x - f );
                
                return Math.abs(l) <= offset ?1:0;
            }
            return 0;
        }

        for (i = 0;i < n;++i) {
            if (polygon[i].x == pt.x &&    // 是否在顶点上
                polygon[i].y == pt.y ) {
                return 1;
            }
        }

        //pt = this.clone(pt);
        while (redo) {
            redo = false;
            inside = false;
            for (i = 0,j = n - 1;i < n;j = i++) {
                if ( (polygon[i].y < pt.y && pt.y < polygon[j].y) || 
                    (polygon[j].y < pt.y && pt.y < polygon[i].y) ) {
                    if (pt.x <= polygon[i].x || pt.x <= polygon[j].x) {
                        var _x = (pt.y-polygon[i].y)*(polygon[j].x-polygon[i].x)/(polygon[j].y-polygon[i].y)+polygon[i].x;
                        if (pt.x < _x)          // 在线的左侧
                            inside = !inside;
                        else if (pt.x == _x)    // 在线上
                        {
                            return 1;
                        }
                    }
                }
                else if ( pt.y == polygon[i].y) {
                    if (pt.x < polygon[i].x) {    // 交点在顶点上                    
                        if(polygon[i].y > polygon[j].y) {
                            --pt.y
                        }
                        else {
                            ++pt.y;
                        }
                        redo = true;
                        break;
                    }
                }
                else if ( polygon[i].y ==  polygon[j].y && // 在水平的边界线上
                    pt.y == polygon[i].y &&
                    ( (polygon[i].x < pt.x && pt.x < polygon[j].x) || 
                    (polygon[j].x < pt.x && pt.x < polygon[i].x) ) ) {
                    inside = true;
                    break;
                }
            }
        }

        return inside ? 2:0;
    }

    /**
     * @method judge 判断点是否在多边形中
     * @param {point} dot {{x,y}} 需要判断的点
     * @param {array} coordinates {{x,y}[]} 多边形点坐标的数组，为保证图形能够闭合，起点和终点必须相等。
     *        比如三角形需要四个点表示，第一个点和最后一个点必须相同。 
     * @param  {number} 是否为实心 1= 是
     * @returns {boolean} 结果 true=在形状内
     */
    static judge(dot,coordinates,noneZeroMode) {
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
    }

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
        if(p.length) {
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
     * 转换颜色格式，如果输入r,g,b则转为hex格式,如果为hex则转为r,g,b格式
     *
     * @method toColor
     * @static
     * @param {string} hex 16进制颜色表达
     * @return {string} 颜色字符串
     */
    static toColor(r, g, b, a) {    
        if(typeof r == 'string' && r) {
            r = this.trim(r);
            //当为7位时，表示需要转为带透明度的rgba
            if(r[0] == '#') {
                if(r.length >= 8) {
                    a = r.substr(1,2);
                    g = r.substr(5,2);
                    b = r.substr(7,2);
                    r = r.substr(3,2);
                    //透明度
                    a = (this.hexToNumber(a) / 255).toFixed(4);

                    r = this.hexToNumber(r||0);
                    g = this.hexToNumber(g||0);
                    b = this.hexToNumber(b||0);
                }
                //如果是5位的话，# 则第2位表示A，后面依次是r,g,b
                else if(r.length === 5) {
                    a = r.substr(1,1);
                    g = r.substr(3,1);//除#号外的第二位
                    b = r.substr(4,1);
                    r = r.substr(2,1);

                    r = this.hexToNumber(r||0);
                    g = this.hexToNumber(g||0);
                    b = this.hexToNumber(b||0);
                    //透明度
                    a = (this.hexToNumber(a) / 255).toFixed(4);
                }
            }        
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
}
export { jmUtils };
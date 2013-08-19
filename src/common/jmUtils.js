
/**
 * 画图基础对象
 * 当前库的工具类
 * 
 * @class jmUtils
 * @module jmUtils
 * @static
 */
var jmUtils = {
    version: '1.0.0'
};

/**
 * 继承
 * 
 * @method extend
 * @for jmUtils
 * @param {class} target 派生类
 * @param {class} source 基类
 */
jmUtils.extend =  function(target,source) {  
    if(typeof source === 'function') {//类式继承  
        var F = function() {}; //创建一个中间函数对象以获取父类的原型对象  
        F.prototype = source.prototype; //设置原型对象 
        
        var targetPrototype = target.prototype;
        if(targetPrototype && targetPrototype.constructor != Object) {
            jmUtils.extend(F,targetPrototype);//继承原prototype
        }

        target.prototype = new F(); //实例化F, 继承父类的原型中的属性和方法，而无需调用父类的构造函数实例化无关的父类成员  
        target.prototype.constructor = target; //设置构造函数指向自己 
        //target.prototype.__baseType = source;  
        target.superClass = source; //同时，添加一个指向父类构造函数的引用，方便调用父类方法或者调用父类构造函数  
    } 
    else if(typeof source === 'object') { //方法的扩充  
            var pro = typeof target === 'function'?target.prototype:target;  
            for(var k in source) {  
                if(!pro[k]) { //如果原型对象不存在这个属性，则复制  
                    pro[k] = source[k];  
                }  
            }  
            pro['_base'] = source;
    }
    else {  
        throw new Error('fatal error:"Function.prototype.extend" expects a function or object');  
    }  
      
    return target;  
}; 

/**
 * 复制一个对象
 * 
 * @method clone
 * @for jmUtils
 * @param {object} source 被复制的对象
 * @return {object} 参数source的拷贝对象
 */
jmUtils.clone = function(source) {
    if(source && typeof source === 'object') {
        //如果为当前泛型，则直接new
        if(jmUtils.isType(source,jmUtils.list)) {
            return new jmUtils.list(source.items);
        }
        else if(jmUtils.isArray(source)) {
            return source.slice(0);
        }
        var target = {};
        target.constructor = source.constructor;
        for(var k in source) {
            target[k] = jmUtils.clone(source[k]);
        }
        return target;
    }
    return source
} 

/**
 * 把一个对象的属性应用到目标对象，不存在则创建。
 * 递归深度应用，函数会忽略
 * 
 * @method apply
 * @for jmUtils
 * @param {object} source 应用源对象
 * @param {object} target 应用到目标对象
 */
jmUtils.apply = function(source,target) {
    if(typeof source == 'object' && typeof target == 'object') {
        for(var k in source) {
            var t = typeof source[k];
            if(t == 'function') continue;
            else if(t == 'object') {
                if(!target[k] || typeof target[k] != 'object') target[k] = {};
                this.apply(source[k],target[k]);//递归应用
            }
            else {
                target[k] = source[k];
            }
        }
    }
}  

/**
 * 自定义集合
 * 
 * @class list
 * @namespace jmUtils
 * @for jmUtils
 * @param {array} [arr] 数组，可转为当前list元素
 */
jmUtils.list = (function() {    
    function __constructor(arr) {
        this.items = [];
        if(arr) {
            if(jmUtils.isArray(arr)) {
                this.items = arr.slice(0);
            }
            else {
                this.items.push(arr);
            }
        }
    }

    /**
     * 往集合中添加对象
     *
     * @method add
     * @for list
     * @param {any} obj 往集合中添加的对象
     */
    __constructor.prototype.add = function(obj) {        
        if(obj && jmUtils.isArray(obj)) {
            for(var i in obj) {
                this.add(obj[i]);
            } 
            return obj;           
        }
        if(typeof obj == 'object' && this.contain(obj)) return obj;
        this.items.push(obj);
        return obj;
    }

    /**
     * 从集合中移除指定对象
     * 
     * @method remove
     * @for list
     * @param {any} obj 将移除的对象
     */
    __constructor.prototype.remove = function(obj) {
        for(var i = this.items.length -1;i>=0;i--) {
            /*if(typeof obj == 'function') {
                if(obj(this.items[i])) {
                    this.removeAt(i);
                }
            }
            else*/
             if(this.items[i] == obj) {
                this.removeAt(i);
            }
        }
    }

    /**
     * 按索引移除对象
     * 
     * @method removeAt
     * @for list
     * @param {integer} index 移除对象的索引
     */
    __constructor.prototype.removeAt = function (index) {
        if(this.items.length > index) {
            //delete this.items[index];   
            this.items.splice(index,1);
        }
    }

    /**
     * 判断是否包含某个对象
     * 
     * @method contain
     * @for list
     * @param {any} obj 判断当前集合中是否包含此对象
     */
    __constructor.prototype.contain = function(obj) {
        /*if(typeof obj === 'function') {
            for(var i in this.items) {
                if(obj(this.items[i])) return true;
            }
        }
        else {*/
            for(var i in this.items) {
                if(this.items[i] == obj) return true;
            }
        //}
        return false;
    }

    /**
     * 从集合中获取某个对象
     * 
     * @method get
     * @for list
     * @param {integer/function} index 如果为整型则表示为获取此索引的对象，如果为function为则通过此委托获取对象
     * @return {any} 集合中的对象
     */
    __constructor.prototype.get = function(index) {
        if(typeof index == 'function') {
            for(var i in this.items) {
                if(index(this.items[i])) {
                    return this.items[i];
                }
            }
        }
        else {
            return this.items[index];
        }        
    }

    /**
     * 遍历当前集合 
     *
     * @method each
     * @for list
     * @param {function} cb 遍历当前集合的委托
     * @param {boolean} inverse 是否按逆序遍历
     */
    __constructor.prototype.each = function(cb,inverse) {
        if(cb && typeof cb == 'function') {
            //如果按倒序循环
            if(inverse) {
                for(var i = this.items.length - 1;i >= 0; i--) {
                    var r = cb.call(this,i,this.items[i]);
                    if(r === false) break;
                }
            }
            else {
                var len = this.items.length;
               for(var i  = 0; i < len;i++) {
                    var r = cb.call(this,i,this.items[i]);
                    if(r === false) break;
                } 
            }            
        }        
    }

    /**
     * 排序当前集合
     *
     * @method sort
     * @for list
     * @param {function} cb 排序委托
     */
    __constructor.prototype.sort = function(cb) {
        this.items.sort(cb);
    }

    /**
     * 获取当前集合对象个数
     *
     * @method count
     * @param {function} [handler] 检查对象是否符合计算的条件
     * @for list
     * @return {integer} 当前集合的个数
     */
    __constructor.prototype.count = function(handler) {
        if(handler && typeof handler == 'function') {
            var count = 0;
            var len = this.items.length;
            for(var i  = 0; i < len;i++) {
                if(handler(this.items[i])) {
                    count ++;
                }
            } 
            return count;
        }
        return this.items.length;
    }

    /**
     * 清空当前集合
     *
     * @method clear
     * @for list
     */
    __constructor.prototype.clear = function() {
        //清空集合
        for(var i = this.items.length -1;i>=0;i--) {           
             this.remove(this.items[i]);
        }
    }
    return __constructor;
})();


/**
 * 全局缓存
 *
 * @class cache
 * @namespace jmUtils
 * @static
 */
jmUtils.cache = {
    /**
     * 当前缓存集合
     *
     * @property items
     * @type {object}
     * @for cache
     */
    items : {},
    /**
     * 向缓存中添加对象
     *
     * @method add
     * @for cache
     * @param {string} key 加入缓存的健值
     * @param {any} value 加入缓存的值
     * @return {any} 当前加入的值
     */
    add: function(key,value) {
        this.set(key,value);
        return value;
    },
    /**
     * 跟add类似
     * 
     * @method set
     * @for cache
     * @param {string} key 加入缓存的健值
     * @param {any} value 加入缓存的值
     */
    set: function(key,value) {
        this.items[key] = value;
    },
    /**
     * 从缓存中获取对象
     *
     * @method get
     * @for cache
     * @param {string} key 获取缓存的健值
     * @return {any} 对应健的值
     */
    get :function(key) {
        return this.items[key];
    },
    /**
     * 从缓存中移除指定健的对象
     *
     * @method remove
     * @for cache
     * @param {string} key 需要移除的缓存健
     */
    remove: function(key) {
        this.items[key] = null;
    }
}

/**
 * 检查浏览器信息
 *
 * @method browser
 * @for jmUtils
 * @return {object} 返回浏览器信息,如：msie=true表示为ie浏览器
 */
jmUtils.browser = function() { 
    if(jmUtils.browserInfo)   {
        return jmUtils.browserInfo;
    }
    jmUtils.browserInfo = {agent:navigator.userAgent};
    
    if (/Mobile/i.test(jmUtils.browserInfo.agent)) {
        jmUtils.browserInfo.mobile = true;
    }
    if (/iPad/i.test(jmUtils.browserInfo.agent)) {
        jmUtils.browserInfo.iPad = true;
    }
    else if (/iPhone/i.test(jmUtils.browserInfo.agent)) {
        jmUtils.browserInfo.iPhone = true;
    }
    else if (/Android/i.test(jmUtils.browserInfo.agent)) {
        jmUtils.browserInfo.android = true;
    }

    if (/msie/i.test(jmUtils.browserInfo.agent)) {
        jmUtils.browserInfo.msie = true;
        var ieinfo = jmUtils.browserInfo.agent.match(/msie\s+\d+(\.\d+)*/i)[0];
        jmUtils.browserInfo.ver = ieinfo.match(/\d+(\.\d+)*/)[0];
    }
    else if (/Chrome/i.test(jmUtils.browserInfo.agent)) {
        jmUtils.browserInfo.chrome = true;
    }
    else if (/Safari/i.test(jmUtils.browserInfo.agent)) {
        jmUtils.browserInfo.safari = true;
    }
    else if (/Firefox/i.test(jmUtils.browserInfo.agent)) {
        jmUtils.browserInfo.firefox = true;
    }

    return  jmUtils.browserInfo;
}

/**
 * 检查是否支持的浏览器
 *
 * @method isSurportedBrowser
 * @return {boolean} true=支持，false=不支持
 */
jmUtils.isSupportedBrowser = function() {
    var browser = jmUtils.browser();
    return !browser.msie || browser.ver > 8.0;
}

/**
 * 检查是否支持canvas或svg
 * @method checkSupportedMode
 * @return {string} canvas或svg
 */
jmUtils.checkSupportedMode = function() {
    var m = document.createElement('canvas');
    if(m && m.getContext) {
        return 'canvas';
    }
    else if(document.createElementNS) {
         return 'svg';
    }
    else if(this.browser().msie && this.browser().ver < 9) {
        return 'vml';
    }    
    throw 'not supported browser';
}

/**
 * 判断对象是否为数组
 *
 * @method isArray
 * @for jmUtils
 * @param {object} 被判断的对象
 * @return {boolean} true=为数组对象，false=当前对象不为数组
 */
jmUtils.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

/**
 * 判断是否为日期对象
 *
 * @method isDate
 * @param {object} obj 要判断的对象
 * @return {bool} 是否为日期对象
 */
jmUtils.isDate = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
}

/**
 * 加载图片资源
 *
 * @method loadImg
 * @for jmUtils
 * @param {string/array} src 图片地址
 * @param {function} [callback] 图片加载完回调
 */
jmUtils.loadImg = function(src,callback) {
    if(jmUtils.isArray(src) || typeof src == 'object') {
        var count = 0;
        var loadedcount = 0;
        for(var i in src) {
            count ++;
            if(callback) {
                jmUtils.loadImg(src[i],function() {
                    loadedcount++;
                    if(loadedcount == count) {
                        callback();
                    }
                });
            }
            else {
                jmUtils.loadImg(src[i]);
            }            
        }
    }
    else if(typeof src == 'string') {
        var img = document.createElement('img');
        if(callback) {
            img.onload = function() {
                callback();
            };
            img.onerror = function() {
                callback();
            };
        }
        img.src = src;
    }
    else {
        callback();
    }
}

/**
 * 加载js文件
 * 
 * @method require
 * @for jmUtils
 * @param {string} js 需要加载的JS的路径
 * @param {function} [callback] 回调函数callback为成功或失败后回调
 */
jmUtils.require = function(js,callback) {
    if(jmUtils.isArray(js)) {
        var loaded = js.length;
        for(var i in js) {
            jmUtils.require(js[i],function(j,err) {
                if(err) {
                    if(callback) callback(j,err);
                }
                else {
                    loaded--;
                    if(loaded == 0) {
                        if(callback) callback(loaded);
                    }
                }
            });
        }
    }
    else {
        //获取所有已加载的js标记
        var sc = document.getElementsByTagName('script');
        for(var i in sc) {
            //如果已加载则直接返回成功
            if(sc[i].src === js) {
                if(callback) callback(js);
                return;
            }
        }
        //创建script，加载js
        sc = document.createElement('script');
        sc.type= 'text/javascript';
        sc.charset = 'utf-8';
        sc.src = js;
        //append到head中
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(sc);

        //加载回调
        if(callback) {
            function loadCallback(e) {
                if(this.readyState && this.readyState !== 'loaded' && this.readyState !== 'complete') {
                    return;
                }
                if(callback) callback(js);
            }
            //加载回调
            if(sc.readyState) {
                sc.onreadystatechange = loadCallback;
            }
            else {
                sc.onload = loadCallback;
            }               
        }
        //加载失败
        sc.onerror = function() {
            head.removeChild(sc);
            if(callback) callback(js,'load faild');
        }        
    }
}

/**
 * 绑定事件到html对象
 * 
 * @method bindEvent
 * @for jmUtils
 * @param {element} html元素对象
 * @param {string} name 事件名称
 * @param {function} fun 事件委托
 */
jmUtils.bindEvent = function(target,name,fun) {
    if(target.attachEvent) {
        return target.attachEvent("on"+name,fun);
    }    
    else if(target.addEventListener) {
        target.addEventListener(name,fun);
        return true;
    }
    else {
        return false;
    };
}

/**
 * 从对象中移除事件到
 * 
 * @method removeEvent
 * @for jmUtils
 * @param {element} html元素对象
 * @param {string} name 事件名称
 * @param {function} fun 事件委托
 */
jmUtils.removeEvent = function(target,name,fun) {
    if(target.removeEventListener) {
        return target.removeEventListener(name,fun,false);
    }    
    else if(target.detachEvent) {
        target.detachEvent('on' + name,fun);
        return true;
    }
    else {
        target['on' + name] = null;
    };
}

/**
 * 获取元素的绝对定位
 *
 * @method getElementPosition
 * @for jmUtils
 * @param {element} el 目标元素对象
 * @return {position} 位置对象(top,left)
 */
jmUtils.getElementPosition = function(el) {
    if(!el) return ;
    var pos = {"top":0, "left":0};
    if(false && document.documentElement && el.getBoundingClientRect) {
        var rect = el.getBoundingClientRect();
        pos.top = document.documentElement.scrollTop + rect.top;
        pos.left = document.documentElement.scrollLeft + rect.left;
    }
    else {
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
    }   
    return pos;
}
/**
 * 获取元素事件触发的位置
 *
 * @method getEventPosition
 * @for jmUtils
 * @param {eventArg} evt 当前触发事件的参数
 * @param {point} [scale] 当前画布的缩放比例
 * @return {point} 事件触发的位置 
 */
jmUtils.getEventPosition = function(evt,scale) {
    evt = evt || event;
    
    var touches = evt.changedTouches || evt.targetTouches || evt.touches;
    if(touches) evt = touches[0];//兼容touch事件
    var px = evt.pageX || 
        (evt.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));    
    var py = evt.pageY || 
        (evt.clientY + (document.documentElement.scrollTop || document.body.scrollTop));

    var ox = evt.offsetX;
    var oy = evt.offsetY;
    if(typeof ox === 'undefined' && typeof oy === 'undefined') {
        var p = jmUtils.getElementPosition(evt.target || evt.srcElement);
        ox= px - p.left;
        oy = py - p.top;
    }
    if(scale) {
        if(scale.x) ox = ox / scale.x;
        if(scale.y) oy = oy / scale.y;
    }
    return {
        pageX:px,
        pageY:py,
        clientX:evt.clientX,
        clientY:evt.clientY,
        //相对于容器偏移量
        offsetX:ox,
        offsetY:oy,
        layerX : evt.layerX,
        layerY: evt.layerY,
        screenX:evt.screenX,
        screenY:evt.screenY,
        x : ox,
        y : oy
    };
}

/**
 * 检 查对象是否为指定的类型,不包括继承
 * 
 * @method isType
 * @for jmUtils
 * @param {object} target 需要判断类型的对象
 * @param {class} type 对象类型
 * @return {boolean} 返回对象是否为指定类型 
 */
jmUtils.isType = function(target ,type) {
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
 * @for jmUtils
 * @param {point} pt 坐标对象
 * @param {array} polygon 多边型角坐标对象数组
 * @param {number} offset 判断可偏移值
 * @return {integer} 0= 不在图形内和线上，1=在边上，2=在图形内部
 */
jmUtils.pointInPolygon = function(pt,polygon,offset) {
    offset = offset || 1;
    offset = offset / 2;
    var i,j,n = polygon.length;
    var inside=false,redo=true;

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

            var f = (polygon[1].x - polygon[0].x) / (polygon[1].y - polygon[0].y) * (pt.y - polygon[0].y);
            var ff = (pt.y - polygon[0].y) / Math.sqrt(f * f + (pt.y - polygon[0].y) * (pt.y - polygon[0].y));
            var l = ff * (pt.x - polygon[0].x - f );
            
            return Math.abs(l) <= offset ?1:0;
        }
        return 0;
    }

    for (i = 0;i < n;++i)
    {
        if (polygon[i].x == pt.x &&    // 是否在顶点上
            polygon[i].y == pt.y )
        {
            return 1;
        }
    }
    pt = jmUtils.clone(pt);
    while (redo)
    {
        redo = false;
        inside = false;
        for (i = 0,j = n - 1;i < n;j = i++) 
        {
            if ( (polygon[i].y < pt.y && pt.y < polygon[j].y) || 
                (polygon[j].y < pt.y && pt.y < polygon[i].y) ) 
            {
                if (pt.x <= polygon[i].x || pt.x <= polygon[j].x) 
                {
                    var _x = (pt.y-polygon[i].y)*(polygon[j].x-polygon[i].x)/(polygon[j].y-polygon[i].y)+polygon[i].x;
                    if (pt.x < _x)          // 在线的左侧
                        inside = !inside;
                    else if (pt.x == _x)    // 在线上
                    {
                        return 1;
                    }
                }
            }
            else if ( pt.y == polygon[i].y) 
            {
                if (pt.x < polygon[i].x)    // 交点在顶点上
                {
                    polygon[i].y > polygon[j].y ? --pt.y : ++pt.y;
                    redo = true;
                    break;
                }
            }
            else if ( polygon[i].y ==  polygon[j].y && // 在水平的边界线上
                pt.y == polygon[i].y &&
                ( (polygon[i].x < pt.x && pt.x < polygon[j].x) || 
                (polygon[j].x < pt.x && pt.x < polygon[i].x) ) )
            {
                inside = true;
                break;
            }
        }
    }

    return inside ? 2:0;
}

/**
 * 检查边界，子对象是否超出父容器边界
 * 当对象偏移offset后是否出界
 * 返回(left:0,right:0,top:0,bottom:0)
 * 如果right>0表示右边出界right偏移量,left<0则表示左边出界left偏移量
 * 如果bottom>0表示下边出界bottom偏移量,top<0则表示上边出界ltop偏移量
 *
 * @method checkOutSide
 * @for jmUtils
 * @param {bound} parentBounds 父对象的边界
 * @param {bound} targetBounds 对象的边界
 * @param {number} offset 判断是否越界可容偏差
 * @return {bound} 越界标识
 */
jmUtils.checkOutSide = function(parentBounds,targetBounds,offset) {
    var result = {left:0,right:0,top:0,bottom:0};
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
 * 通过时间生成唯 一ID
 *
 * @method guid
 * @for jmUtils
 * @return {string} 唯一字符串
 */
jmUtils.guid = function() {
    var gid = new Date().getTime();
    return gid;
}

/**
 * 去除字符串开始字符
 * 
 * @method trimStart
 * @for jmUtils
 * @param {string} source 需要处理的字符串
 * @param {char} [c] 要去除字符串的前置字符
 * @return {string} 去除前置字符后的字符串
 */
jmUtils.trimStart = function(source,c) {
    c = c || ' ';
    if(source && source.length > 0) {
        var sc = source[0];
        if(sc === c || c.indexOf(sc) >= 0) {
            source = source.substring(1);
            return jmUtils.trimStart(source,c);
        }        
    }
    return source;
}

/**
 * 去除字符串结束的字符c
 *
 * @method trimEnd
 * @for jmUtils
 * @param {string} source 需要处理的字符串
 * @param {char} [c] 要去除字符串的后置字符
 * @return {string} 去除后置字符后的字符串
 */
jmUtils.trimEnd = function(source,c) {
    c = c || ' ';
    if(source && source.length > 0) {
        var sc = source[source.length - 1];
        if(sc === c || c.indexOf(sc) >= 0) {
            source = source.substring(0,source.length - 1);
            return jmUtils.trimStart(source,c);
        }        
    }
    return source;
}

/**
 * 去除字符串开始与结束的字符
 *
 * @method trim
 * @for jmUtils
 * @param {string} source 需要处理的字符串
 * @param {char} [c] 要去除字符串的字符
 * @return {string} 去除字符后的字符串
 */
jmUtils.trim = function(source,c) {
    return jmUtils.trimEnd(jmUtils.trimStart(source,c),c);
}

/**
 * 检查是否为百分比参数
 *
 * @method checkPercent
 * @for jmUtils
 * @param {string} 字符串参数
 * @return {boolean} true=当前字符串为百分比参数,false=不是
 */
jmUtils.checkPercent = function(per) {
    if(typeof per === 'string') {
        per = jmUtils.trim(per);
        if(per[per.length - 1] == '%') {
            return per;
        }
    }
}

/**
 * 转换百分数为数值类型
 *
 * @method percentToNumber
 * @for jmUtils
 * @param {string} per 把百分比转为数值的参数
 * @return {number} 百分比对应的数值
 */
jmUtils.percentToNumber = function(per) {
    if(typeof per === 'string') {
        var tmp = jmUtils.checkPercent(per);
        if(tmp) {
            per = jmUtils.trim(tmp,'%');
            per = per / 100;
        }
    }
    return per;
}

/**
 * 获取对象在目标对象中的索引
 * 比如可以检查一个元素在数组中的索引，或字符在字符串中的索引
 *
 * @method indexOf
 * @for jmUtils
 * @param {any} t 要检查的对象
 * @return {array/string} 目标对象
 */
jmUtils.indexOf = function(t,s) {
    if(jmUtils.isArray(s)) {
        for(var i =0; i<s.length;i++) {
            if(s[i] == t) return i;
        }
    }
    else if(typeof s == 'string') {
        return s.indexOf(t);
    }
    return -1;
}

/**
 * 解析XML字符串
 *
 * @method parseXML
 * @for jmUtils
 * @param {string} xml xml字符串
 * @return {XmlDocument} 把字符串转为的xml对象
 */
jmUtils.parseXML = function(xml) {
    var xmlDoc;
    if(DOMParser) {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(xml, "text/xml");
    }
    else if(window.ActiveXObject) {   
        xmlDoc  = new ActiveXObject('Microsoft.XMLDOM');
        xmlDoc.async  = false;
        xmlDoc.loadXML(xml);
    } 
    else {
        return null;
    }   
    return xmlDoc;
}

/**
 * 解析XML文档为json对象
 *
 * @method xmlToJSON
 * @for jmUtils
 * @param {string} xml 待转为xml对象的xml字符串
 * @return {object} xml对象转为的json对象
 */
jmUtils.xmlToJSON = function(xml) {
    if (!xml) return null;
    if(typeof xml === 'string') {
        xml = jmUtils.parseXML(xml);
    }
    /**
     * 解析节点
     * 
     * @method turnChildren
     * @param {xmlNode} xmlnode xml对象节点
     * @param {xmlNode} parent 当前对象的父节点
     * @private
     * @return 当前节点对应的json对象
     */
    function turnChildren(xmlnode,parent) {
        if (xmlnode && xmlnode.childNodes && xmlnode.childNodes.length > 0) {
            for (var i = 0; i < xmlnode.childNodes.length; i++) {
                var node = xmlnode.childNodes[i];
                if(node.nodeType != 1) continue;
                var name = node.name || node.nodeName || node.tagName;
                if (name) {
                    var item = {children:[],attributes:{}};
                    //解析属性
                    if(node.attributes) {
                        for(var k in node.attributes) {
                            var attr = node.attributes[k];
                            var attrname = attr.name || attr.nodeName;
                            if(attrname) {
                                item.attributes[attrname] = jmUtils.trim(attr.value || node.nodeValue || attr.textContent);
                            }
                        }             
                    }
                    item.name = name;
                    item.value = jmUtils.trim(node.value || node.nodeValue || node.textContent);
                    parent.children.push(item);
                    turnChildren(node, item);
                }
                else {
                    parent.value = jmUtils.trim(node.value || node.nodeValue || node.textContent);
                    turnChildren(node, parent);
                }                
            }
        }
    }    
    var jsobj = {children:[]};
    jsobj.version = xml.xmlVersion;
    jsobj.title = xml.title;
    turnChildren(xml, jsobj);
    return jsobj;
}

/**
 * 转换16进制为数值
 *
 * @method hexToNumber
 * @for jmUtils
 * @param {string} h 16进制颜色表达
 * @return {number} 10进制表达
 */
jmUtils.hexToNumber = function(h) {
    if(typeof h !== 'string') return h;

    h = h.toLowerCase();
    var hex = '0123456789abcdef';
    var v = 0;
    var l = h.length;
    for(var i=l - 1;i>=0;i--) {
        var iv = Number(hex.indexOf(h[i]));
        if(iv == 0) continue;
        var n = l - i;
        var s = 1;
        for(var j=0;j<n;j++) {
            s *= 16;
        }
        v += iv * s;
    }
    return v;
}

/**
 * 转换数值为16进制字符串表达
 *
 * @method hex
 * @for jmUtils
 * @param {number} v 数值
 * @return {string} 16进制表达
 */
jmUtils.numberToHex = function(v) {
    var hex = '0123456789abcdef';
    
    var h = '';
    while(v > 0) {
        var t = v % 16;
        h = hex[t] + h;
        v = Math.floor(v / 16);
    }
    return h;
}

/**
 * 转换颜色格式，如果输入r,g,b则转为hex格式,如果为hex则转为r,g,b格式
 *
 * @method toColor
 * @for jmUtils
 * @param {string} hex 16进制颜色表达
 * @return {string} 颜色字符串
 */
jmUtils.toColor = function(r,g,b,a) {
    if(typeof r == 'string') {
        if(r.indexOf('rgb') >= 0) {
            //去除前后的空格，r,g,b,a,(,)
            r = this.trim(r,'rgba()) ');
            var tmp = r.split(',');
            r = tmp[0];
            g = tmp[1];
            b = tmp[2];
            if(a == undefined && tmp.length > 3) a = tmp[3];
        }
        else if(r.length < 6) {
            b = r.substring(r.length-1,1);
            g = r.substring(r.length-2,1);
            r = r.substring(r.length-3,1) ;
            b += '' + b;
            g += '' + g;
            r += '' + r;
            r = this.hexToNumber(r);
            g = this.hexToNumber(g);
            b = this.hexToNumber(b);
        }
        else {           
            b = r.substring(r.length-2,2);
            g = r.substring(r.length-4,2);
            //透明度
            if(r.length > 7) {
                a = r.substring(r.length-8,2);
                a = this.hexToNumber(a) / 255;
            }
            r = r.substring(r.length-6,2) ;
            r = this.hexToNumber(r);
            g = this.hexToNumber(g);
            b = this.hexToNumber(b);
        }
        if(a) {            
            return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        }
        else {
            return 'rgb(' + r + ',' + g + ',' + b + ')';
        }
    }
    else {
        r = this.numberToHex(r);
        r = r.length == 1?('0' + r):r;
        g = this.numberToHex(g);
        g = g.length == 1?('0' + g):g;
        b = this.numberToHex(b);
        b = b.length == 1?('0' + b):b;
        return '#' + r + g + b;
    }
}

/**
 * 转为日期格式
 *
 * @method parseDate
 * @for jmUtils
 * @param {string} s 时间字符串
 * @return {date} 日期
 */
jmUtils.parseDate = function (s) {
    if(jmUtils.isDate(s)) {
        return s;
    }
    else if(typeof s == 'number') {
        return new Date(s);
    }
    var ar = (s + ",0,0,0").match(/\d+/g);
    return ar[5] ? (new Date(ar[0], ar[1] - 1, ar[2], ar[3], ar[4], ar[5])) : (new Date(s));
}

/**
 * 格式化日期格式
 *
 * @param {date} date 需要格式化的日期
 * @param {string} format 格式表达式 y表示年，M为月份，d为天，H为小时，m为分，s为秒
 * @return {string} 格式化后的字符串
 */
jmUtils.formatDate = function(date,format) {
    date = this.parseDate(date || new Date());
    format = format || 'yyyy-MM-dd HH:mm:ss';
    var result = format.replace('yyyy', date.getFullYear().toString())
    .replace('MM', (date.getMonth()< 9?'0':'') + (date.getMonth() + 1).toString())
    .replace('dd', (date.getDate()<9?'0':'')+date.getDate().toString())
    .replace('HH', (date.getHours() < 9 ? '0' : '') + date.getHours().toString())
    .replace('mm', (date.getMinutes() < 9 ? '0' : '') + date.getMinutes().toString())
    .replace('ss', (date.getSeconds() < 9 ? '0' : '') + date.getSeconds().toString());

    return result;
}


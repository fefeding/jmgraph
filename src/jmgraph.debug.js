
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

/**
 * 渐变类
 *
 * @class jmGradient
 * @module jmGraph
 * @for jmGraph
 * @param {object} op 渐变参数,type:[linear= 线性渐变,radial=放射性渐变] 
 */
function jmGradient(op) {
	if(op) {
		for(var k in op) {
			this[k] = op[k];
		}
	}
	this.stops = new jmUtils.list();
}

/**
 * 添加渐变色
 * 
 * @method addStop
 * @for jmGradient
 * @param {number} offset 放射渐变颜色偏移,可为百分比参数。
 * @param {string} color 当前偏移颜色值
 */
jmGradient.prototype.addColorStop =
jmGradient.prototype.addStop = function(offset,color) {
	this.stops.add({
		offset:offset,
		color:color
	});
}

/**
 * 生成为canvas的渐变对象
 *
 * @method toGradient
 * @for jmGradient
 * @param {jmControl} control 当前渐变对应的控件
 * @return {gradient} canvas渐变对象
 */
jmGradient.prototype.toGradient = function(control) {
	var gradient;
	var context = control.context || control;
	var bounds = control.absoluteBounds?control.absoluteBounds:control.getAbsoluteBounds();
	var x1 = this.x1;
	var y1 = this.y1;
	var x2 = this.x2;
	var y2 = this.y2;

	var location = control.getLocation();

	var d = 0;
	if(location.radius) {
		d = location.radius * 2;				
	}
	if(!d) {
		d = Math.min(location.width,location.height);				
	}

	//处理百分比参数
	if(jmUtils.checkPercent(x1)) {
		x1 = jmUtils.percentToNumber(x1) * (location.width || d);
	}
	if(jmUtils.checkPercent(x2)) {
		x2 = jmUtils.percentToNumber(x2) * (location.width || d);
	}
	if(jmUtils.checkPercent(y1)) {
		y1 = jmUtils.percentToNumber(y1) * (location.height || d);
	}
	if(jmUtils.checkPercent(y2)) {
		y2 = jmUtils.percentToNumber(y2) * (location.height || d);
	}	
	if(this.type === 'linear') {
		if(control.mode == 'canvas') {
			gradient = context.createLinearGradient(x1 + bounds.left,y1 + bounds.top,x2 + bounds.left,y2 + bounds.top);
		}
		else {
			gradient = Raphael.deg(Math.atan2(y2-y1,x2-x1)) + '-';
			this.stops.each(function(i,stop) {	
				gradient += stop.color + ':' + Math.floor(stop.offset * 100) + '-';
			});
			gradient = jmUtils.trimEnd(gradient,'-');
		}
	}
	else if(this.type === 'radial') {
		var r1 = this.r1;
		var r2 = this.r2;
		
		if(jmUtils.checkPercent(r1)) {
			r1 = jmUtils.percentToNumber(r1);			
			r1 = d * r1;
		}
		if(jmUtils.checkPercent(r2)) {
			r2 = jmUtils.percentToNumber(r2);
			r2 = d * r2;
		}	
		if(control.mode == 'canvas') {		
			gradient = context.createRadialGradient(x1 + bounds.left,y1 + bounds.top,r1,x2 + bounds.left,y2 + bounds.top,r2);
		}
		else {
			gradient = 'r(';
			this.stops.each(function(i,stop) {	
				gradient += stop.offset + ',';
			});
			gradient = jmUtils.trimEnd(gradient,',') + ')';
			this.stops.each(function(i,stop) {	
				gradient += stop.color + '-';
			});
			gradient = jmUtils.trimEnd(gradient,'-');
		}
	}
	if(control.mode == 'canvas') {	
		this.stops.each(function(i,stop) {			
			gradient.addColorStop(stop.offset,stop.color);		
		});
	}
	return gradient;
}

/**
 * 转换为raphael的渐变的字符串表达
 *
 * @method toString
 * @for jmGradient
 * @return {string} raphael的渐变的字符串表达
 */
jmGradient.prototype.toString = function() {

}


/**
 * 画图阴影对象表示法
 *
 * @class jmShadow
 * @for jmGraph
 * @param {number} x 横坐标偏移量
 * @param {number} y 纵坐标编移量
 * @param {number} blur 模糊值
 * @param {string} color 阴影的颜色
 */

function jmShadow(x,y,blur,color) {
	this.x = x;
	this.y = y;
	this.blur = blur;
	this.color = color;

	/**
	 * 转换为raphael的光晕对象
	 *
	 * @method toGlow
	 * @for jmShadow
	 * @class jmShadow	
	 * @return {object} raphael的光晕对象
	 */
	this.toGlow = function() {
		return {
			width: this.blur,
			offsetx : this.x,
			offsety : this.y,
			color : this.color
		}
	}
}/**
 *  所有jm对象的基础对象
 * 
 * @class jmObject
 * @module jmGraph
 * @for jmGraph
 */

function jmObject() {
}

/**
 * 检 查对象是否为指定类型
 * 
 * @method is
 * @param {class} type 判断的类型
 * @for jmObject
 * @return {boolean} true=表示当前对象为指定的类型type,false=表示不是
 */
jmObject.prototype.is = function(type) {
	if(typeof type == 'string') {
		return this.type == type;
	}
	return this instanceof type;
}

/**
 * 给控件添加动画处理,如果成功执行会导致画布刷新。
 *
 * @method animate
 * @for jmObject
 * @param {function} handle 动画委托
 * @param {integer} millisec 此委托执行间隔 （毫秒）
 */
jmObject.prototype.animate = function(handle,millisec) {	
	if(this.is('jmGraph')) {
		if(handle) {			
			if(!this.animateHandles) this.animateHandles = new jmUtils.list();
			
			//var id = jmUtils.guid();
			var params = [];
			if(arguments.length > 2) {
				for(var i=2;i<arguments.length;i++) {
					params.push(arguments[i]);
				}
			}		
			this.animateHandles.add({millisec:millisec || 20,handle:handle,params:params});//id:id,
		}
		if(this.animateHandles) {
			if(this.animateHandles.count() > 0) {
				var self = this;
				//延时处理动画事件
				this.dispatcher = setTimeout(function(_this) {
					_this = _this || self;
					var needredraw = false;
					var overduehandles = [];
					var curTimes = new Date().getTime();
					_this.animateHandles.each(function(i,ani) {						
						try {
							if(ani && ani.handle && (!ani.times || curTimes - ani.times >= ani.millisec)) {
								var r = ani.handle.apply(_this,ani.params);
								if(r === false) {
									overduehandles.push(ani);//表示已完成的动画效果
								}								
								ani.times = curTimes;
								needredraw = true;								
							}
						}
						catch(e) {
							if(window.console && window.console.info) {
								window.console.info(e.toString());
							}
							if(ani) overduehandles.push(ani);//异常的事件，不再执行
						}						
					});
					for(var i in overduehandles) {
						_this.animateHandles.remove(overduehandles[i]);//移除完成的效果
					}
					if(needredraw) {
						_this.redraw();				
					}
					//console.log(curTimes)
					_this.animate();
				},10,this);//刷新				
			}
		}
	}	
	else {
		var graph = this.findParent('jmGraph');
		if(graph) {
			graph.animate.apply(graph,arguments);
		}
	}
}




/**
 * 对象属性管理
 * 
 * @class jmProperty
 * @for jmGraph
 * @require jmObject
 */

var jmProperty = function() {	
	this.__properties = {};
	this.__eventHandles = {};
};

jmUtils.extend(jmProperty,jmObject);

/**
 * 获取属性值
 * 
 * @method getValue
 * @for jmProperty
 * @param {string} name 获取属性的名称
 * @return {any} 获取属性的值
 */
jmProperty.prototype.getValue = function(name) {
	if(!this.__properties) this.__properties = {};
	return this.__properties[name];
}

/**
 * 设置属性值
 *
 * @method setValue
 * @for jmProperty
 * @param {string} name 设置属性的名称
 * @param {any} value 设置属性的值
 * @retunr {any} 当前属性的值
 */
jmProperty.prototype.setValue = function(name,value) {
	if(typeof value !== 'undefined') {
		if(!this.__properties) this.__properties = {};
		var args = {oldValue:this.getValue(name),newValue:value};
		this.__properties[name] = value;
		this.emit('PropertyChange',name,args);
	}
	return this.getValue(name);
}

/**
 * 绑定事件监听
 *
 * @method on
 * @for jmProperty
 * @param {string} name 监听事件的名称
 * @param {function} handle 监听委托 
 */
jmProperty.prototype.on = function(name,handle) {
	if(!this.__eventHandles) this.__eventHandles = {};
	var handles = this.__eventHandles[name];
	if(!handles) {
		handles = this.__eventHandles[name] = []
	}
	//如果已绑定相同的事件，则直接返回
	for(var i in handles) {
		if(handles[i] === handle) {
			return;
		}
	}
	handles.push(handle);
}

/**
 * 执行监听回调
 * 
 * @method emit
 * @for jmProperty
 * @param {string} name 触发事件的名称
 * @param {array} args 事件参数数组
 */
 jmProperty.prototype.emit = function(name) {
	var handles = this.__eventHandles?this.__eventHandles[name]:null;
	if(handles) {
		var args = [];
		var len = arguments.length;
		if(len > 1) {
			//截取除name以后的所有参数
			for(var i=1;i<len;i++) {
				args.push(arguments[i]);
			}
		}		
		for(var i in handles) {
			handles[i].apply(this,args);
		}		
	}
}

/**
 * 事件模型
 *
 * @class jmEvents
 * @module jmGraph
 * @for jmGraph
 */
function jmEvents(container,target) {
	/**
	 * 鼠标事件勾子
	 *
	 * @property mouseHandler
	 * @type {class}
	 */
	this.mouseHandler = new mouseEvent(container,target);

	/**
	 * 健盘事件勾子
	 *
	 * @property keyHandler
	 * @type {class}
	 */
	this.keyHandler = new keyEvent(container,target);
	
	/**
	 * 鼠标事件处理对象，container 为事件主体，target为响应事件对象
	 */
	function mouseEvent(container,target) {
		this.container = container;
		this.target = target || container;
		this.init = function() {
			var canvas = this.target;	
			//禁用鼠标右健系统菜单
			canvas.oncontextmenu = function() {
				return false;
			};

			jmUtils.bindEvent(this.target,'mousedown',function(evt) {
				evt = evt || event;
				var r = container.raiseEvent('mousedown',evt);
				//if(r === false) {
					if(evt.preventDefault) evt.preventDefault();
					return false;
				//}				
			});
			jmUtils.bindEvent(window.document,'touchstart',function(evt) {
				evt = evt || event;
				//evt.preventDefault();
				container.raiseEvent('touchstart',evt);
				if(evt.preventDefault) evt.preventDefault();
				return false;
			});
			jmUtils.bindEvent(window.document,'mousemove',function(evt) {	
				evt = evt || event;		
				var target = evt.target || evt.srcElement;
				if(target == canvas) {
					var r = container.raiseEvent('mousemove',evt);
					//if(r === false) {
						if(evt.preventDefault) evt.preventDefault();
						return false;
					//}		
				}				
			});
			jmUtils.bindEvent(window.document,'touchmove',function(evt) {
				evt = evt || event;
				
				container.raiseEvent('touchmove',evt);
				if(evt.preventDefault) evt.preventDefault();
				return false;
			});
			jmUtils.bindEvent(this.target,'mouseover',function(evt) {
				evt = evt || event;
				container.raiseEvent('mouseover',evt);
			});
			jmUtils.bindEvent(this.target,'mouseleave',function(evt) {
				evt = evt || event;
				container.raiseEvent('mouseleave',evt);
			});			
			jmUtils.bindEvent(this.target,'mouseout',function(evt) {
				evt = evt || event;
				container.raiseEvent('mouseout',evt);
			});
			jmUtils.bindEvent(window.document,'mouseup',function(evt) {
				evt = evt || event;
				//var target = evt.target || evt.srcElement;
				//if(target == canvas) {						
					var r = container.raiseEvent('mouseup',evt);
					if(r === false) {
						if(evt.preventDefault) evt.preventDefault();
						return false;
					}					
				//}
			});
			jmUtils.bindEvent(window.document,'touchend',function(evt) {
				evt = evt || event;
				
				container.raiseEvent('touchend',evt);
				if(evt.preventDefault) evt.preventDefault();
				return false;
			});
			jmUtils.bindEvent(this.target,'dblclick',function(evt) {
				evt = evt || event;
				container.raiseEvent('dblclick',evt);
			});
			jmUtils.bindEvent(this.target,'click',function(evt) {
				evt = evt || event;
				container.raiseEvent('click',evt);
			});

			jmUtils.bindEvent(document,'resize',function(evt) {
				evt = evt || event;
				return container.raiseEvent('resize',evt);
			});
		}
		this.init();
	}

	/**
	 * 健盘事件处理对象，container 为事件主体，target为响应事件对象
	 */
	function keyEvent(container,target) {
		this.container = container;
		this.target = target || container;

		/**
		 * 检查是否触发健盘事件至画布
		 * 如果触发对象为输入框等对象则不响应事件
		 *  
		 */
		function checkKeyEvent(evt) {
			var target = evt.srcElement || evt.target;
			if(target && (target.tagName == 'INPUT' 
				|| target.tagName == 'TEXTAREA'
				|| target.tagName == 'ANCHOR' 
				|| target.tagName == 'FORM' 
				|| target.tagName == 'FILE'
				|| target.tagName == 'IMG'
				|| target.tagName == 'HIDDEN'
				|| target.tagName == 'RADIO'
				|| target.tagName == 'TEXT'	)) {
				return false;
			}
			return true;
		}

		/**
		 * 初始化健盘事件
		 */
		this.init = function() {
			jmUtils.bindEvent(document,'keypress',function(evt) {
				evt = evt || event;
				if(!checkKeyEvent(evt)) return;//如果事件为其它输入框，则不响应
				var r = container.raiseEvent('keypress',evt);
				if(r === false && evt.preventDefault) 
					evt.preventDefault();
				return r;
			});
			jmUtils.bindEvent(document,'keydown',function(evt) {
				evt = evt || event;
				if(!checkKeyEvent(evt)) return;//如果事件为其它输入框，则不响应
				var r = container.raiseEvent('keydown',evt);
				if(r === false && evt.preventDefault) 
					evt.preventDefault();
				return r;
			});
			jmUtils.bindEvent(document,'keyup',function(evt) {
				evt = evt || event;
				if(!checkKeyEvent(evt)) return;//如果事件为其它输入框，则不响应
				var r = container.raiseEvent('keyup',evt);
				if(r === false && evt.preventDefault) 
					evt.preventDefault();
				return r;
			});			
		}
		this.init();
	}
}
/**
 * 控件基础对象
 * 控件的基础属性和方法
 *
 * @class jmControl
 * @module jmGraph
 * @for jmGraph
 */	
function jmControl() {

};
//继承属性绑定
jmUtils.extend(jmControl,jmProperty);

/**
 * 初始化对象，设定样式，初始化子控件对象
 * 此方法为所有控件需调用的方法
 *
 * @method initializing
 * @for jmControl
 * @param {canvas} context 当前画布
 * @param {style} style 当前控件的样式
 */
jmControl.prototype.initializing = function(context,style) {
	this.context = context;
	this.style = style || {};
	//this.style.fill = this.style.fill || 'transparent';
	this.visible = true;

	//如果不是html5模式，则生成非hmtl5元素
	var mode = this.mode || (this.mode = this.graph.mode);
	if(mode !== 'canvas' && !this.svgShape && this.type !== 'jmGraph') {
		this.svgShape = this.context.create('path',this);
		//this.svgShape.appendTo(this.graph.canvas);
	}

	var self = this;
	//定义子元素集合
	this.children = (function() {
		var lst = new jmUtils.list();
		var oadd = lst.add;
		//当把对象添加到当前控件中时，设定其父节点
		lst.add = function(obj) {
			if(typeof obj === 'object') {
				if(obj.parent && obj.parent != self && obj.parent.children) {
					obj.parent.children.remove(obj);//如果有父节点则从其父节点中移除
				}
				obj.parent = self;
				//如果存在先移除
				if(this.contain(obj)) {
					this.oremove(obj);
				}
				oadd.call(this,obj);
				obj.emit('add',obj);
				return obj;
			}
		};
		lst.oremove= lst.remove;
		//当把对象从此控件中移除时，把其父节点置为空
		lst.remove = function(obj) {
			if(typeof obj === 'object') {				
				obj.parent = null;
				obj.remove(true);
				this.oremove(obj);
			}
		};
		/**
		 * 根据控件zIndex排序，越大的越高
		 */
		lst.sort = function() {
			var levelItems = {};
			//提取zindex大于0的元素
			lst.each(function(i,obj) {
				var zindex = obj.zIndex;
				if(!zindex && obj.style && obj.style.zIndex) {
					zindex = Number(obj.style.zIndex);
				}
				if(zindex) {
					var items = levelItems[zindex] || (levelItems[zindex] = []);
					items.push(obj);					
				}
			});
			
			for(var index in levelItems) {
				oadd.call(this,levelItems[index]);
			}
		}
		lst.clear = function() {
			lst.each(function(i,obj) {
				this.remove(obj);
			},true);
		}
		return lst;
	})();
} 

/**
 * 设置鼠标指针
 * 
 * @method cursor
 * @for jmControl
 * @param {string} cur css鼠标指针标识,例如:pointer,move等
 */
jmControl.prototype.cursor = function(cur) {
	if(this.svgShape) {
		this.svgShape.css('cursor',cur);
	}
	else {
		var graph = this.graph || this.findParent('jmGraph');
		if(graph) {		
			graph.css('cursor',cur);		
		}
	}	
}

/**
 * 设定样式到context
 * 处理样式映射，转换渐变和阴影对象为标准canvas属性
 * 
 * @method setStyle
 * @for jmControl
 * @private
 * @param {style} style 样式对象，如:{fill:'black',stroke:'red'}
 */
jmControl.prototype.setStyle = function(style) {
	style = style || this.style;
	if(!style) return;

	/**
	 * 样式设定
	 * 
	 * @method __setStyle
	 * @private
	 * @param {jmControl} control 当前样式对应的控件对象
	 * @param {style} style 样式
	 * @param {string} name 样式名称
	 * @param {string} mpkey 样式名称在映射中的key(例如：shadow.blur为模糊值)
	 */
	function __setStyle(control,style,name,mpkey) {		
		var styleValue = style[name];
		if(styleValue) {
			if(!control.mode || control.mode == 'canvas') {
				//样式映射名
				var styleMapCacheKey = 'jm_control_style_mapping';
				var styleMap = jmUtils.cache.get(styleMapCacheKey);
				if(!styleMap) {
					//样式名称，也当做白名单使用					
					styleMap = {
						'fill':'fillStyle',
						'stroke':'strokeStyle',
						'shadow.blur':'shadowBlur',
						'shadow.x':'shadowOffsetX',
						'shadow.y':'shadowOffsetY',
						'shadow.color':'shadowColor',
						'lineWidth' : 'lineWidth',
						'fillStyle' : 'fillStyle',
						'strokeStyle' : 'strokeStyle',
						'font' : 'font',
						'opacity' : 'globalAlpha',
						'textAlign' : 'textAlign',
						'textBaseline' : 'textBaseline',
						'shadowBlur' : 'shadowBlur',
						'shadowOffsetX' : 'shadowOffsetX',
						'shadowOffsetY' : 'shadowOffsetY',
						'shadowColor' : 'shadowColor',
						'lineJoin': 'lineJoin',//线交汇处的形状,miter(默认，尖角),bevel(斜角),round（圆角）
						'lineCap':'lineCap' //线条终端点,butt(默认，平),round(圆),square（方）
					};
					jmUtils.cache.add(styleMapCacheKey,styleMap);
				}
				var t = typeof styleValue;
				if(t == 'object' && !styleMap[name]) {
					switch(name) {
						//阴影样式
						case 'shadow' : {
							for(var k in styleValue) {
								__setStyle(control,styleValue,k,name + '.' + k);
							}
							break;
						}
						//平移
						case 'translate' : {
							control.context.translate(styleValue.x,styleValue.y);
							break;
						}
					}							
				}
				//如果为渐变对象
				else if(t == 'object' && jmUtils.isType(styleValue,jmGradient)) {
					var mpname = styleMap[mpkey || name] || name;					
					control.context[mpname] = styleValue.toGradient(control);
				}
				else if(t != 'function' && t != 'object') {
					var mpname = styleMap[mpkey || name];
					//只有存在白名单中才处理
					if(mpname) {						
						control.context[mpname] = styleValue;						
					}
					//不在白名单中的特殊样式处理
					else {
						switch(name) {
							//旋转
							case 'rotate' : {								
								//旋 转先移位偏移量
								var tranX = 0;
								var tranY = 0;
								//旋转，则移位，如果有中心位则按中心旋转，否则按左上角旋转
								if(control.rotatePosition) {
									var bounds = control.parent && control.parent.absoluteBounds?control.parent.absoluteBounds:control.absoluteBounds;
									tranX = control.rotatePosition.x + bounds.left;
									tranY = control.rotatePosition.y + bounds.top;
								}
													
								control.context.translate(tranX,tranY);
								control.context.rotate(styleValue);
								break;
							}
							case 'transform' : {
								if(jmUtils.isArray(styleValue)) {
									control.context.transform.apply(control.context,styleValue);
								}
								else if(typeof styleValue == 'object') {
									control.context.transform(styleValue.scaleX,//水平缩放
										styleValue.skewX,//水平倾斜
										styleValue.skewY,//垂直倾斜
										styleValue.scaleY,//垂直缩放
										styleValue.offsetX,//水平位移
										styleValue.offsetY);//垂直位移
								}								
								break;
							}
							//位移
							case 'translate' : {
								control.context.translate(styleValue.x,styleValue.y);			
								break;
							}
							//鼠标指针
							case 'cursor' : {
								control.cursor(styleValue);
								break;
							}
						}
					}

				}				
			}
			else if(control.svgShape) {				
				control.svgShape.attr(mpkey || name,styleValue);
			}
		}
	}	

	//一些特殊属性要先设置，否则会导致顺序不对出现错误的效果
	if(this.translate) {
		__setStyle(this,{translate:this.translate},'translate');
	}
	if(this.transform) {
		__setStyle(this,{transform:this.transform},'transform');
	}
	if(this.rotate) {
		__setStyle(this,{rotate:this.rotate},'rotate');
	}
	//设置样式
	for(var k in style) {
		__setStyle(this,style,k);
	}
}

/**
 * 获取当前控件的边界
 * 通过分析控件的描点或位置加宽高得到为方形的边界
 *
 * @method getBounds
 * @for jmControl
 * @return {object} 控件的边界描述对象(left,top,right,bottom,width,height)
 */
jmControl.prototype.getBounds = function() {
	//if(this.initPoints) this.initPoints();
	var rect = {};
	
	if(this.points && this.points.length > 0) {		
		for(var i in this.points) {
			var p = this.points[i];
			if(typeof rect.left === 'undefined' || rect.left > p.x) {
				rect.left = p.x;
			}
			if(typeof rect.top === 'undefined'  || rect.top > p.y) {
				rect.top = p.y;
			}

			if(typeof rect.right === 'undefined'  || rect.right < p.x) {
				rect.right = p.x;
			}
			if(typeof rect.bottom === 'undefined' || rect.bottom < p.y) {
				rect.bottom = p.y;
			}
		}
	}
	else if(this.getLocation) {
		var p = this.getLocation();
		if(p) {
			rect.left = p.left;
			rect.top = p.top;
			rect.right = p.left + p.width;
			rect.bottom = p.top + p.height;
		}		
	}
	if(!rect.left) rect.left = 0; 
	if(!rect.top) rect.top = 0; 
	if(!rect.right) rect.right = 0; 
	if(!rect.bottom) rect.bottom = 0; 
	rect.width = rect.right - rect.left;
	rect.height = rect.bottom - rect.top;
	return rect;
}

/**
 * 获取当前控件的位置相关参数
 * 解析百分比和margin参数
 *
 * @method getLocation
 * @return {object} 当前控件位置参数，包括中心点坐标，右上角坐标，宽高
 */
jmControl.prototype.getLocation = function(reset) {
	//如果已经计算过则直接返回
	//在开画之前会清空此对象
	if(reset !== true && this.location) return this.location;

	var localtion = this.location = {left:0,top:0,width:0,height:0};
	var p = this.position();	
	localtion.center = this.center && typeof this.center === 'function'?jmUtils.clone(this.center()):null;//中心
	localtion.radius = this.radius?this.radius():null;//半径
	localtion.width = this.width() || 0;
	localtion.height = this.height() || 0;

	var margin = this.style.margin || {};
	margin.left = margin.left || 0;
	margin.top = margin.top || 0;
	margin.right = margin.right || 0;
	margin.bottom = margin.bottom || 0;
	
	//如果没有指定位置，但指定了margin。则位置取margin偏移量
	if(p) {
		localtion.left = p.x;
		localtion.top = p.y;
	}
	else {
		localtion.left = margin.left;
		localtion.top = margin.top;
	}

	if(!this.parent) return localtion;//没有父节点则直接返回
	var parentBounds = this.parent.bounds?this.parent.bounds:this.parent.getBounds();	

	//处理百分比参数
	if(jmUtils.checkPercent(localtion.left)) {
		localtion.left = jmUtils.percentToNumber(localtion.left) * parentBounds.width;
	}
	if(jmUtils.checkPercent(localtion.top)) {
		localtion.top = jmUtils.percentToNumber(localtion.top) * parentBounds.height;
	}
	
	//如果没有指定宽度或高度，则按百分之百计算其父宽度或高度
	if(jmUtils.checkPercent(localtion.width)) {
		localtion.width = jmUtils.percentToNumber(localtion.width) * parentBounds.width;
	}
	if(jmUtils.checkPercent(localtion.height)) {
		localtion.height = jmUtils.percentToNumber(localtion.height) * parentBounds.height;
	}
	//处理中心点
	if(localtion.center) {
		//处理百分比参数
		if(jmUtils.checkPercent(localtion.center.x)) {
			localtion.center.x = jmUtils.percentToNumber(localtion.center.x) * parentBounds.width;
		}
		if(jmUtils.checkPercent(localtion.center.y)) {
			localtion.center.y = jmUtils.percentToNumber(localtion.center.y) * parentBounds.height;
		}
	}
	if(localtion.radius) {
		//处理百分比参数
		if(jmUtils.checkPercent(localtion.radius)) {
			localtion.radius = jmUtils.percentToNumber(localtion.radius) * Math.min(parentBounds.width,parentBounds.height);
		}		
	}
	return localtion;
}

/**
 * 移除当前控件
 * 如果是VML元素，则调用其删除元素
 *
 * @method remove 
 */
jmControl.prototype.remove = function() {
	if(this.svgShape) this.svgShape.remove();
	if(this.parent) {
		this.parent.children.remove(this);
	}
}

/**
 * 获取或设定位置坐标
 *
 * @method position
 * @param {point} [p] 位置参数{x:1,y:1} ,如果为空则返回当前位置
 * @return {point} 当前控件的位置
 */
jmControl.prototype.position = function(p) {
	return this.setValue('position',p);
}

/**
 * 设定或获取宽度
 * 
 * @method width
 * @param {number} [w] 宽度，如果为空则返回当前宽度
 * @return {nubmer} 控件的当前宽度
 */
jmControl.prototype.width = function(w) {
	return this.setValue('width',w);
}

/**
 * 设定或获取高度
 *
 * @method height
 * @param {number} [h] 高度
 * @return {number} 当前控件的高度
 */
jmControl.prototype.height = function(h) {
	return this.setValue('height',h);
}

/**
 * 对控件进行平移
 * 遍历控件所有描点或位置，设置其偏移量。
 *
 * @method offset
 * @param {number} x x轴偏移量
 * @param {number} y y轴偏移量
 * @param {boolean} [trans] 是否传递,监听者可以通过此属性是否决定是否响应移动事件,默认=true
 */
jmControl.prototype.offset = function(x,y,trans) {
	trans = trans === false?false:true;	
	var location = this.getLocation(true);
	
	var offseted = false;
	if(this.center && typeof this.center == 'function') {		
		var center = this.center();
		if(center) {			
			center.x = location.center.x + x;
			center.y = location.center.y + y;
			//this.center(center);
			offseted = true;
		}			
	}
	if(offseted == false && this.position && typeof this.position == 'function') {
		var p = this.position();
		if(p) {
			location.left += x;
			location.top += y;
			p.x = location.left;
			p.y = location.top;
			//this.position(p);
			offseted = true;
		}			
	}
	if(offseted == false && this.cpoints && typeof this.cpoints == 'function') {
		var p = this.cpoints();
		if(p) {			
			var len = p.length;
			for(var i=0; i < len;i++) {
				p[i].x += x;
				p[i].y += y;
			}		
			offseted = true;
		}			
	}
	
	if(offseted == false && this.points) {
		var len = this.points.length;
		for(var i=0; i < len;i++) {
			this.points[i].x += x;
			this.points[i].y += y;
		}
		offseted = true;
	}
	
	//触发控件移动事件	
	this.emit('move',{offsetX:x,offsetY:y,trans:trans});

	//this.getLocation(true);	//重置
	this.graph.refresh();
}

/**
 * 获取控件相对于画布的绝对边界，
 * 与getBounds不同的是：getBounds获取的是相对于父容器的边界.
 *
 * @method getAbsoluteBounds
 * @return {object} 边界对象(left,top,right,bottom,width,height)
 */
jmControl.prototype.getAbsoluteBounds = function() {
	//当前控件的边界，
	var rec = this.bounds || this.getBounds();
	if(this.parent && this.parent.absoluteBounds) {
		//父容器的绝对边界
		var prec = this.parent.absoluteBounds || this.parent.getAbsoluteBounds();
		
		return {
			left : prec.left + rec.left,
			top : prec.top + rec.top,
			right : prec.left + rec.right,
			bottom : prec.top + rec.bottom,
			width : rec.width,
			height : rec.height
		};
	}
	return rec;
}

/**
 * 画控件前初始化
 * 执行beginPath开始控件的绘制
 * 
 * @method beginDraw
 */
jmControl.prototype.beginDraw = function() {	
	this.getLocation(true);//重置位置信息
	this.context.beginPath();			
}

/**
 * 结束控件绘制
 *
 * @method endDraw
 */
jmControl.prototype.endDraw = function() {
	//如果当前为封闭路径
	if(this.style.close) {
		this.context.closePath();
	}
	
	if(this.style['fill']) {
		this.context.fill();
	}
	if(this.style['stroke'] || !this.style['fill']) {
		this.context.stroke();
	}		
}

/**
 * 绘制控件
 * 在画布上描点
 * 
 * @method draw
 */
jmControl.prototype.draw = function() {	
	if(this.points && this.points.length > 0) {
		//获取当前控件的绝对位置
		var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
		if(!this.mode || this.mode == 'canvas') {
			this.context.moveTo(this.points[0].x + bounds.left,this.points[0].y + bounds.top);
			var len = this.points.length;			
			for(var i=1; i < len;i++) {
				var p = this.points[i];
				//移至当前坐标
				if(p.m) {
					this.context.moveTo(p.x + bounds.left,p.y + bounds.top);
				}
				else {
					this.context.lineTo(p.x+ bounds.left,p.y + bounds.top);
				}			
			}
		}
		else {			
			this.svgShape.setStyle(this);
			var ps = this.points.slice(0);
			var len = ps.length;			
			for(var i=0; i < len;i++) {
				ps[i].x += bounds.left;
				ps[i].y += bounds.top;
			}
			this.svgShape.attr('path',ps,this.style.close);	
		}
	}	
}

/**
 * 绘制当前控件
 * 协调控件的绘制，先从其子控件开始绘制，再往上冒。
 *
 * @method paint
 */
jmControl.prototype.paint = function(v) {
	if(v !== false && this.visible !== false) {
		if(this.svgShape) this.svgShape.show();

		if(this.initPoints) this.initPoints();
		//计算当前边界
		this.bounds = this.getBounds();
		this.absoluteBounds = this.getAbsoluteBounds();

		this.context.save();
		if(this.svgShape && this.svgShape.glow) this.svgShape.glow.remove();
		this.setStyle();//设定样式
		this.emit('beginDraw',this);
		if(this.beginDraw) this.beginDraw();
		if(this.draw) this.draw();	
		if(this.endDraw) this.endDraw();
		
		if(this.children) {	
			this.children.sort();//先排序
			this.children.each(function(i,item) {
				if(item && item.paint) item.paint();
			});
		}
		
		this.emit('endDraw',this);	
		this.context.restore();
	}
	else {
		if(this.svgShape) {
			this.svgShape.hide();
			if(this.children) {					
				this.children.each(function(i,item) {
					if(item && item.paint) item.paint(false);
				});
			}
		}
	}
}

/**
 * 获取指定事件的集合
 * 比如mousedown,mouseup等
 *
 * @method getEvent
 * @param {string} name 事件名称
 * @return {list} 事件委托的集合
 */
jmControl.prototype.getEvent = function(name) {		
	return this.__events?this.__events[name]:null;
}

/**
 * 绑定控件的事件
 *
 * @method bind
 * @param {string} name 事件名称
 * @param {function} handle 事件委托
 */
jmControl.prototype.bind = function(name,handle) {	
	//if(this.svgShape) {
		//this.svgShape.bind(name,handle);
		//return;
	//}
	/**
	 * 添加事件的集合
	 *
	 * @method _setEvent
	 * @private
	 */
	function _setEvent(name,events) {
		if(!this.__events) this.__events = {};
		return this.__events[name] = events;
	}
	var eventCollection = this.getEvent(name) || _setEvent.call(this,name,new jmUtils.list());
	if(!eventCollection.contain(handle)) {
		eventCollection.add(handle);
	}
}

/**
 * 移除控件的事件
 *
 * @method unbind 
 * @param {string} name 事件名称
 * @param {function} handle 从控件中移除事件的委托
 */
jmControl.prototype.unbind = function(name,handle) {
	//if(this.svgShape) {
		//this.svgShape.unbind(name,handle);
		//return;
	//}

	var eventCollection = this.getEvent(name) ;		
	if(eventCollection) {
		eventCollection.remove(handle);
	}
}

/**
 * 独立执行事件委托
 *
 * @method runEventHandle
 * @param {string} 将执行的事件名称
 * @param {object} 事件执行的参数，包括触发事件的对象和位置
 */
function runEventHandle(name,args) {
	var events = this.getEvent(name);		
	if(events) {
		var self = this;			
		events.each(function(i,handle) {
			//只要有一个事件被阻止，则不再处理同级事件，并设置冒泡被阻断
			if(false === handle.call(self,args)) {
				args.cancel = true;
			}
		});		
	}	
	return args.cancel;
}

/**
 * 检 查坐标是否落在当前控件区域中..true=在区域内
 *
 * @method checkPoint
 * @param {point} p 位置参数
 * @return {boolean} 当前位置如果在区域内则为true,否则为false。
 */
jmControl.prototype.checkPoint = function(p) {
	//生成当前坐标对应的父级元素的相对位置
	var abounds = this.bounds || this.getBounds();

	if(p.x > abounds.right || p.x < abounds.left) {
		return false;
	}
	if(p.y > abounds.bottom || p.y < abounds.top) {
		return false;
	}
	
	return true;
    this.paint();
    return this.context.isPointInPath(p.x, p.y);
}


/**
 * 触发控件事件，组合参数并按控件层级关系执行事件冒泡。
 *
 * @method raiseEvent
 * @param {string} name 事件名称
 * @param {object} args 事件执行参数
 * @return {boolean} 如果事件被组止冒泡则返回false,否则返回true
 */
jmControl.prototype.raiseEvent = function(name,args) {
	if(this.visible === false) return ;//如果不显示则不响应事件	
	if(!args.position) {		
		var graph = this.findParent('jmGraph');
		var position = jmUtils.getEventPosition(args,graph.scaleSize);//初始化事件位置
		
		//如果不是html5模式，则处理每个元素的相对位置为graph容器的位置
		if(this.mode !== 'canvas') {
			var graphposition = graph.getPosition();
			position.x = position.offsetX = position.pageX - graphposition.left;
			position.y = position.offsetY = position.pageY - graphposition.top;
		}

		var srcElement = args.srcElement || args.target;
		args = {position:position,
			button:args.button == 0?1:args.button,
			keyCode:args.keyCode || args.charCode || args.which,
			ctrlKey:args.ctrlKey,
			cancel : false,
			srcElement : srcElement
		};		
	}
	//先执行子元素事件，如果事件没有被阻断，则向上冒泡
	//var stoped = false;
	if(this.children) {
		this.children.each(function(j,el) {	
			//未被阻止才执行			
			if(args.cancel !== true) {
				//如果被阻止冒泡，
				//stoped = el.raiseEvent(name,args) === false?true:stoped;
				el.raiseEvent(name,args)
			}
		},true);//按逆序处理
	}
	//if(stoped) return false;

	//获取当前对象的父元素绝对位置
	//生成当前坐标对应的父级元素的相对位置
	var abounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds : this.absoluteBounds;
	if(!abounds) return false;	
	//args = jmUtils.clone(args);//参数副本
	args.position.x = args.position.offsetX - abounds.left;
	args.position.y = args.position.offsetY - abounds.top;
	
	//事件发生在边界内或健盘事件发生在画布中才触发
	if(this.checkPoint(args.position)) {
		//如果没有指定触发对象，则认为当前为第一触发对象
		if(!args.target) {
			args.target = this;
		}
		if(args.cancel !== true) {
			//如果返回true则阻断冒泡
			runEventHandle.call(this,name,args);//执行事件		
		}
		if(!this.focused && name == 'mousemove') {
	 		this.focused = true;//表明当前焦点在此控件中
	 		this.raiseEvent('mouseover',args);
		}	
	}
	else {
		//如果焦点不在，且原焦点在，则触发mouseleave事件
		if(this.focused && name == 'mousemove') {
	 		this.focused = false;//表明当前焦点离开
	 		runEventHandle.call(this,'mouseleave',args);//执行事件	
		}	
	}
		
	return args.cancel == false;//如果被阻止则返回false,否则返回true
}

/**
 * 清空控件指定事件
 *
 * @method clearEvents
 * @param {string} name 需要清除的事件名称
 */
jmControl.prototype.clearEvents = function(name) {
	var eventCollection = this.getEvent(name) ;		
	if(eventCollection) {
		eventCollection.clear;
	}
}

/**
 * 查找其父级类型为type的元素，直到找到指定的对象或到最顶级控件后返回空。
 *
 * @method findParent 
 * @param {object} 类型名称或类型对象
 * @return {object} 指定类型的实例
 */
jmControl.prototype.findParent = function(type) {
	//如果为类型名称，则返回名称相同的类型对象
	if(typeof type === 'string') {
		if(this.type == type)
			return this;
	}
	else if(this.is(type)) {
		return this;
	}
	if(this.parent) {
		return this.parent.findParent(type);
	}
	return null;
}

/**
 * 设定是否可以移动
 * 此方法需指定jmgraph或在控件添加到jmgraph后再调用才能生效。
 *
 * @method canMove
 * @param {boolean} m true=可以移动，false=不可移动或清除移动。
 * @param {jmGraph} [graph] 当前画布，如果为空的话必需是已加入画布的控件，否则得指定画布。
 */
jmControl.prototype.canMove = function(m,graph) {
	if(!this.__mvMonitor) {
		/**
		 * 控制控件移动对象
		 * 
		 * @property __mvMonitor
		 * @private
		 */
		this.__mvMonitor = {};
		this.__mvMonitor.mouseDown = false;
		this.__mvMonitor.curposition={x:0,y:0};
		var self = this;
		/**
		 * 控件移动鼠标事件
		 *
		 * @method mv
		 * @private
		 */
		this.__mvMonitor.mv = function(evt) {
			var _this = self;
			if(_this.__mvMonitor.mouseDown) {
				_this.parent.bounds = null;
				var parentbounds = _this.parent.getAbsoluteBounds();		
				var offsetx = evt.position.x - _this.__mvMonitor.curposition.x;
				var offsety = evt.position.y - _this.__mvMonitor.curposition.y;				
				
				//如果锁定边界
				if(_this.lockSide) {
					var thisbounds = _this.bounds || _this.getAbsoluteBounds();					
					//检查边界出界
					var outside = jmUtils.checkOutSide(parentbounds,thisbounds,{x:offsetx,y:offsety});
					if(outside.left < 0) {
						if(_this.lockSide.left) offsetx -= outside.left;
					}
					else if(outside.right > 0) {
						if(_this.lockSide.right) offsetx -= outside.right;
					}
					if(outside.top < 0) {
						if(_this.lockSide.top) offsety -= outside.top;
					}
					else if(outside.bottom > 0) {
						if(_this.lockSide.bottom) offsety -= outside.bottom;
					}
				}
				
				if(offsetx || offsety) {
					_this.offset(offsetx,offsety);
					_this.__mvMonitor.curposition.x = evt.position.x;
					_this.__mvMonitor.curposition.y = evt.position.y;	
					//console.log(offsetx + '.' + offsety);
				}
				return false;
			}
		}
		/**
		 * 控件移动鼠标松开事件
		 *
		 * @method mu
		 * @private
		 */
		this.__mvMonitor.mu = function(evt) {
			var _this = self;
			if(_this.__mvMonitor.mouseDown) {
				_this.__mvMonitor.mouseDown = false;
				_this.cursor('default');
				_this.emit('moveend',{position:_this.__mvMonitor.curposition});	
				//return false;
			}			
		}
		/**
		 * 控件移动鼠标离开事件
		 *
		 * @method ml
		 * @private
		 */
		this.__mvMonitor.ml = function() {
			var _this = self;
	 		if(_this.__mvMonitor.mouseDown) {
				_this.__mvMonitor.mouseDown = false;
				_this.cursor('default');	
				_this.emit('moveend',{position:_this.__mvMonitor.curposition});
				return false;
			}	
		}
		/**
		 * 控件移动鼠标按下事件
		 *
		 * @method md
		 * @private
		 */
		this.__mvMonitor.md = function(evt) {
			var _this = self;
			if(_this.__mvMonitor.mouseDown) return;
			if(evt.button == 0 || evt.button == 1) {
				_this.__mvMonitor.mouseDown = true;
				_this.cursor('move');
				var parentbounds = _this.parent.absoluteBounds || _this.parent.getAbsoluteBounds();	
				_this.__mvMonitor.curposition.x = evt.position.x + parentbounds.left;
				_this.__mvMonitor.curposition.y = evt.position.y + parentbounds.top;
				//触发控件移动事件
				_this.emit('movestart',{position:_this.__mvMonitor.curposition});
				
				evt.cancel = true;
				return false;
			}			
		}
	}
	graph = graph || this.graph || this.findParent('jmGraph');//获取最顶级元素画布
	
	if(graph && m) {
		
			graph.bind('mousemove',this.__mvMonitor.mv);
			graph.bind('mouseup',this.__mvMonitor.mu);
			graph.bind('mouseleave',this.__mvMonitor.ml);
			this.bind('mousedown',this.__mvMonitor.md);
			graph.bind('touchmove',this.__mvMonitor.mv);
			graph.bind('touchend',this.__mvMonitor.mu);
			this.bind('touchstart',this.__mvMonitor.md);	
			
	}
	else {
		
			graph.unbind('mousemove',this.__mvMonitor.mv);
			graph.unbind('mouseup',this.__mvMonitor.mu);
			graph.unbind('mouseleave',this.__mvMonitor.ml);
			this.unbind('mousedown',this.__mvMonitor.md);
			graph.unbind('touchmove',this.__mvMonitor.mv);
			graph.unbind('touchend',this.__mvMonitor.mu);
			this.unbind('touchstart',this.__mvMonitor.md);	
		
	}
}

/**
 * 图型基础类
 *
 * @class jmShape
 * @for jmGraph
 */

function jmShape(graph) {
	/**
	 * 当前对象类型名 jmShape
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmShape';
	
	/**
	 * 当前画布
	 *
	 * @property type
	 * @type jmGraph
	 */
	this.graph = graph;

	this.initializing(graph.context,style);
}
jmUtils.extend(jmShape,jmControl);

/**
 * 基础路径,大部分图型的基类
 * 指定一系列点，画出图形
 *
 * @class jmPath
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 画布
 * @param {object} params 路径参数 points=所有描点
 */

function jmPath(graph,params) {
	/**
	 * 当前对象类型名jmPath
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmPath';
	var style = params && params.style ? params.style : null;
	
	this.graph = graph;
	this.points = params && params.points ? params.points : [];
	this.initializing(graph.context,style);
}
jmUtils.extend(jmPath,jmShape);//继承基础图形

/**
 * 重写检查坐标是否在区域内
 * 支持任意多边形
 * 根据边界检查某个点是否在区域内，如果样式有fill，则只要在内有效，如果只有stroke则在边框上有效
 *
 * @method checkPoint
 * @param {point} p 待检查的坐标
 * @return {boolean} 如果在则返回true,否则返回false
 */
jmPath.prototype.checkPoint = function(p) {	
	var w = this.style['lineWidth'] || 1;

	//如果当前路径不是实心的
	//就只用判断点是否在边上即可	
	if(this.points.length > 2 && (!this.style['fill'] || this.style['stroke'])) {
		var i = 0;
		var count = this.points.length;
		for(var j = i+1; j <= count; j = (++i + 1)) {
			//如果j超出最后一个
			//则当为封闭图形时跟第一点连线处理.否则直接返回false
			if(j == count) {
				if(this.style.close) {
					var r = jmUtils.pointInPolygon(p,[this.points[i],this.points[0]],w);
					if(r) return true;
				}
			} 
			else {
				//判断是否在点i,j连成的线上
				var s = jmUtils.pointInPolygon(p,[this.points[i],this.points[j]],w);
				if(s) return true;
			}			
		}
		//不是封闭的图形，则直接返回
		if(!this.style['fill']) return false;
	}

	var r = jmUtils.pointInPolygon(p,this.points,w);
	return r;
}

/**
 * 画一条直线
 *
 * @class jmLine
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 当前画布
 * @param {object} params 直线参数:start=起始点,end=结束点,lineType=线类型(solid=实线，dotted=虚线),dashLength=虚线间隔(=4)
 */

function jmLine(graph,params) {
	if(!params) params = {};
	/**
	 * 当前对象类型名jmLine
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmLine';
	this.points = params.points || [];
	var style = params.style || {};
	
	this.graph = graph;
		
	this.start(params.start || {x:0,y:0});
	this.end(params.end || {x:0,y:0});
	//this.points.push(this.start);
	//this.points.push(this.end);

	style.lineType = style.lineType || 'solid';
	style.dashLength = style.dashLength || 4;
	this.initializing(graph.context,style);
}
jmUtils.extend(jmLine,jmPath);//继承path图形

/**
 * 初始化图形点,如呆为虚线则根据跳跃间隔描点
 * @method initPoints
 * @private
 */
jmLine.prototype.initPoints = function() {	
	var start = this.start();
	var end = this.end();
	this.points = [];	
	this.points.push(start);

	if(this.style.lineType === 'dotted') {			
		var dx = end.x - start.x;
		var dy = end.y - start.y;
		var lineLen = Math.sqrt(dx * dx + dy * dy);
		dx = dx / lineLen;
		dy = dy / lineLen;
		var dottedstart = false;
		var dottedsp = this.style.dashLength / 2;
		for(var l=this.style.dashLength; l<=lineLen;) {
			if(dottedstart == false) {
				this.points.push({x:start.x + dx * l,y:start.y+ dy * l});
				l += dottedsp;
			}
			else {				
				this.points.push({x:start.x + dx * l,y:start.y+ dy * l,m:true});
				l += this.style.dashLength;
			}
			dottedstart = !dottedstart;				
		}
	}
	this.points.push(end);
	return this.points;
}

/**
* 开始画图
*//*
jmLine.prototype.draw = function() {	
	
	//获取当前控件的绝对位置
	var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
	var startx = this.start.x + bounds.left;
	var starty = this.start.y + bounds.top;
	this.context.moveTo(startx,starty);
	
	if(this.style.lineType === 'dotted') {			
		var dx = this.end.x - this.start.x;
		var dy = this.end.y - this.start.y;
		var lineLen = Math.sqrt(dx * dx + dy * dy);
		dx = dx / lineLen;
		dy = dy / lineLen;
		var dottedstart = false;
		var dottedsp = this.style.dashLength / 2;
		for(var l=this.style.dashLength; l<=lineLen;) {
			if(dottedstart == false) {
				this.context.lineTo(startx + dx * l,starty+ dy * l);
				l += dottedsp;
			}
			else {
				this.context.moveTo(startx + dx * l,starty+ dy * l);
				l += this.style.dashLength;
			}
			dottedstart = !dottedstart;				
		}
		this.context.lineTo(this.end.x+ bounds.left,this.end.y + bounds.top);		
	}
	else {			
		this.context.lineTo(this.end.x+ bounds.left,this.end.y + bounds.top);
	}
		
}*/

/**
 * 控制起始点
 * 
 * @method start
 * @for jmLine
 * @param {point} p 起始点坐标
 * @return {point} 当前起始点坐标
 */
jmLine.prototype.start = function(p) {
	return this.setValue('start',p);
}

/**
 * 控制结束点
 * 
 * @method end
 * @for jmLine
 * @param {point} p 结束点坐标
 * @return {point} 当前结束点坐标
 */
jmLine.prototype.end = function(p) {
	return this.setValue('end',p);
}



/**
 * 画完整的圆
 *
 * @class jmCircle
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 画布
 * @param {object} params 圆的参数:center=圆中心,radius=圆半径,优先取此属性，如果没有则取宽和高,width=圆宽,height=圆高
 */

function jmCircle(graph,params) {
	if(!params) params = {};
	/**
	 * 当前对象类型名jmCircle
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmCircle';
	this.points = params.points || [];
	var style = params.style || {};
	
	this.graph = graph;
		
	this.center(params.center || {x:0,y:0});
	this.width(params.width || 0);

	//this.on('PropertyChange',this.initPoints);
	this.height(params.height  || 0);
	this.radius(params.radius  || 0);

	this.initializing(graph.context,style);
}
jmUtils.extend(jmCircle,jmPath);//继承path图形

/**
 * 初始化图形点
 * 
 * @method initPoint
 * @private
 * @for jmCircle
 */
jmCircle.prototype.initPoints = function() {	
	/*var mw = this.width() / 2;
	var mh = this.height() / 2;
	var center = this.center();
	var cx = center.x ;//+ bounds.left;
	var cy = center.y ;//+ bounds.top;
	var r1 =  mw * mw;
	var r2 = mh * mh;
	this.points = [];
	for(var x = -mw;x <= mw; x += 0.1) {
		var y = Math.sqrt((1 - (x * x) / r1)) * mh;
		this.points.push({x:x + cx,y:y + cy});
	}
	for(var i= this.points.length - 1;i >= 0;i--) {
		var p = this.points[i];
		this.points.push({x:p.x ,y:cy * 2 - p.y});
	}*/
	var location = this.getLocation();
	
	if(!location.radius) {
		location.radius = Math.min(location.width , location.height) / 2;
	}
	this.points = [];
	this.points.push({x:location.center.x - location.radius,y:location.center.y - location.radius});
	this.points.push({x:location.center.x + location.radius,y:location.center.y - location.radius});
	this.points.push({x:location.center.x + location.radius,y:location.center.y + location.radius});
	this.points.push({x:location.center.x - location.radius,y:location.center.y + location.radius});
}

/**
 * 重写基类画图，此处为画一个完整的圆 
 *
 * @method draw
 */
jmCircle.prototype.draw = function() {
	var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;	
	var location = this.getLocation();
	
	if(!location.radius) {
		location.radius = Math.min(location.width , location.height) / 2;
	}
	if(!this.mode || this.mode == 'canvas') {
		this.context.arc(location.center.x + bounds.left,location.center.y + bounds.top,location.radius,0,Math.PI * 2);
	}
	else {
		if(!this.svgShape) {
			this.svgShape = this.context.create('circle',this);
			this.setStyle();
			this.svgShape.appendTo(this.graph.canvas);
		}	
		this.svgShape.setStyle(this);		
		this.svgShape.attr({
			cx:location.center.x + bounds.left,
			cy:location.center.y + bounds.top,
			r:location.radius
		});
	}
}

/**
* 获取当前控件的边界

jmCircle.prototype.getBounds = function() {
	this.initPoints();
	return this.base.getBounds.call(this);
}*/

/**
 * 设定或获取中心点
 * 
 * @method center
 * @for jmCircle
 * @param {point} p 中心参数
 * @return {point} 当前中心点
 */
jmCircle.prototype.center = function(p) {
	return this.setValue('center',p);
}

/**
 * 设定或获取半径
 * 
 * @method radius
 * @for jmCircle
 * @param {number} p 半径
 * @return {number} 当前半径
 */
jmCircle.prototype.radius = function(p) {
	return this.setValue('radius',p);
}



/**
 * 圆弧图型 继承自jmPath
 * 参数params说明:center=当前圆弧中心,radius=圆弧半径,start=圆弧起始角度,end=圆弧结束角度,anticlockwise=是否为顺时针
 *
 * @class jmArc
 * @for jmGraph
 * @require jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 画布
 * @param {object} params 圆弧参数
 */

function jmArc(graph,params) {
	if(!params) params = {};
	this.points = params.points || [];
	var style = params.style || {};
	/**
	 * 当前对象类型名
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmArc';
	this.graph = graph;
		
	this.center(params.center || {x:0,y:0});
	this.radius(params.radius || 0);

	this.startAngle(params.start  || 0);
	this.endAngle(params.end  || Math.PI * 2);

	this.width(params.width || 0);
	this.height(params.height  || 0);

	this.anticlockwise(params.anticlockwise  || 0);

	this.initializing(graph.context,style);

	//this.on('PropertyChange',this.initPoints);
	//this.base = new jmCircle.prototype.constructor.superClass(graph,params);
}
jmUtils.extend(jmArc,jmPath);//jmPath

/**
 * 初始化图形点
 * 
 * @method initPoint
 * @private
 * @for jmArc
 */
jmArc.prototype.initPoints = function() {
	var location = this.getLocation();//获取位置参数
	var mw = 0;
	var mh = 0;
	var cx = location.center.x ;//+ bounds.left;
	var cy = location.center.y ;//+ bounds.top;
	//如果设定了半径。则以半径为主	
	if(location.radius) {
		mw = mh = location.radius;
	}
	else {
		mw = location.width / 2;
		mh = location.height / 2;
	}
	
	var start = this.startAngle();
	var end = this.endAngle();
	var anticlockwise = this.anticlockwise();
	this.points = [];
	//椭圆方程x=a*cos(r) ,y=b*sin(r)
	if(start < end) {
		for(var r=start;r<=end;r += 0.01) {
			var rr = anticlockwise?-r:r;
			var p = {
				x : Math.cos(rr) * mw + cx,
				y : Math.sin(rr) * mh + cy
			};
			this.points.push(p);
		}
	}
	else {
		for(var r=start;r >= end;r -= 0.01) {
			var rr = anticlockwise?-r:r;
			var p = {
				x : Math.cos(rr) * mw + cx,
				y : Math.sin(rr) * mh + cy
			};
			this.points.push(p);
		}
	}
	return this.points;
}

/**
 * 设定或获取中心点
 * 
 * @method center
 * @for jmArc
 * @param {point} p 中心参数
 * @return {point} 当前中心点
 */
jmArc.prototype.center = function(p) {
	return this.setValue('center',p);
}

/**
 * 设定或获取半径
 *
 * @method radius
 * @for jmArc
 * @param {number} r 半径
 * @return {number} 当前半径
 */
jmArc.prototype.radius = function(r) {
	return this.setValue('radius',r);
}

/**
 * 设定或获取起始角度
 *
 * @method startAngle
 * @for jmArc
 * @param {number} r 角度
 * @return {number} 当前起始角度
 */
jmArc.prototype.startAngle = function(a) {
	return this.setValue('startAngle',a);
}

/**
 * 设定或获取结束角度
 *
 * @method endAngle
 * @for jmArc
 * @param {number} r 角度
 * @return {number} 当前结束角度
 */
jmArc.prototype.endAngle = function(a) {
	return this.setValue('endAngle',a);
}

/**
 * 设定或获取是否顺时针画
 *
 * @method anticlockwise
 * @for jmArc
 * @param {boolean} a true=顺时针,false=逆时针
 * @return {boolean} 当前是否为顺时针
 */
jmArc.prototype.anticlockwise = function(a) {
	return this.setValue('anticlockwise',a);
}





/**
 * 画空心圆弧,继承自jmPath
 *
 * @class jmHArc
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 画布
 * @param {object} params 空心圆参数:minRadius=中心小圆半径,maxRadius=大圆半径,start=起始角度,end=结束角度,anticlockwise=是否为顺时针
 */

function jmHArc(graph,params) {
	if(!params) params = {};
	/**
	 * 当前对象类型名jmHarc
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmHArc';
	this.points = params.points || [];
	var style = params.style || {};
	
	this.graph = graph;
		
	this.center(params.center || {x:0,y:0});
	this.minRadius(params.minRadius || style.minRadius || 0);
	this.maxRadius(params.maxRadius || style.maxRadius || 0);

	this.startAngle(params.start  || 0);
	this.endAngle(params.end  || Math.PI * 2);

	this.width(params.width || 0);
	this.height(params.height  || 0);

	this.anticlockwise(params.anticlockwise  || 0);

	this.initializing(graph.context,style);
}
jmUtils.extend(jmHArc,jmPath);//jmPath

/**
 * 初始化图形点
 *
 * @method initPoints
 * @private
 */
jmHArc.prototype.initPoints = function() {	
	var location = this.getLocation();	
	//如果设定了半径。则以半径为主
	var minr = this.minRadius();
	var maxr = this.maxRadius();
	
	var start = this.startAngle();
	var end = this.endAngle();
	var anticlockwise = this.anticlockwise();
	var minps = [];
	var maxps = [];
	//椭圆方程x=a*cos(r) ,y=b*sin(r)
	for(var r=start;r<=end;r += 0.1) {
		var rr = anticlockwise?-r:r;
		var cos = Math.cos(rr);
		var sin = Math.sin(rr);
		var p1 = {
			x : cos * minr + location.center.x,
			y : sin * minr + location.center.y
		};
		var p2 = {
			x : cos * maxr + location.center.x,
			y : sin * maxr + location.center.y
		};
		minps.push(p1);
		maxps.push(p2);
	}
	
	maxps.reverse();//大圆逆序
	if(!this.style || !this.style.close) {
		maxps[0].m = true;//开始画大圆时表示为移动
	}		
	this.points = minps.concat(maxps);
}

/**
* 获取当前控件的边界

jmHArc.prototype.getBounds = function() {
	this.initPoints();
	return this.base.getBounds.call(this);
}*/

/**
 * 设定或获取中心点
 * 
 * @method center
 * @for jmHArc
 * @param {point} p 中心点坐标
 * @return {point} 当前中心点坐标
 */
jmHArc.prototype.center = function(p) {
	return this.setValue('center',p);
}

/**
 * 设定或获取内空心圆半径
 * 
 * @method minRadius
 * @for jmHArc
 * @param {number} r 内空心圆半径
 * @return {number} 当前内空心圆半径
 */
jmHArc.prototype.minRadius = function(r) {
	return this.setValue('minRadius',r);
}

/**
 * 设定或获取外空心圆半径
 * 
 * @method maxRadius
 * @for jmHArc
 * @param {number} r 外空心圆半径
 * @return {number} 当前外空心圆半径
 */
jmHArc.prototype.maxRadius = function(r) {
	return this.setValue('maxRadius',r);
}

/**
 * 设定或获取起始角度
 * 
 * @method startAngle
 * @for jmHArc
 * @param {number} a 起始角度
 * @return {number} 当前起始角度
 */
jmHArc.prototype.startAngle = function(a) {
	return this.setValue('startAngle',a);
}

/**
 * 设定或获取结束角度
 * 
 * @method endAngle
 * @for jmHArc
 * @param {number} a 结束角度
 * @return {number} 当前结束角度
 */
jmHArc.prototype.endAngle = function(a) {
	return this.setValue('endAngle',a);
}

/**
 * 设定或获取是否顺时针画
 * 
 * @method anticlockwise
 * @for jmHArc
 * @param {number} a 是否顺时针画
 * @return {number} 当前是否顺时针画
 */
jmHArc.prototype.anticlockwise = function(a) {
	return this.setValue('anticlockwise',a);
}

/**
 * 画棱形
 *
 * @class jmPrismatic
 * @for jmGraph
 * @param {jmGraph} graph 画布
 * @param {object} params 参数 center=棱形中心点，width=棱形宽,height=棱形高
 */

function jmPrismatic(graph,params) {
	if(!params) params = {};
	/**
	 * 当前对象类型名jmPrismatic
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmPrismatic';
	this.points = params.points || [];
	var style = params.style || {};
	
	this.graph = graph;
		
	this.center(params.center || {x:0,y:0});
	this.width(params.width || 0);

	//this.on('PropertyChange',this.initPoints);
	this.height(params.height  || 0);

	this.initializing(graph.context,style);
}
jmUtils.extend(jmPrismatic,jmPath);//继承path图形


/**
 * 初始化图形点
 * 计算棱形顶点
 * 
 * @method initPoints
 * @private
 */
jmPrismatic.prototype.initPoints = function() {
	/*//获取当前控件的绝对位置
	var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
    if(!bounds) bounds = this.parent && this.parent.getAbsoluteBounds?this.parent.getAbsoluteBounds():this.getAbsoluteBounds();
	if(!bounds) bounds= {left:0,top:0,right:0,bottom:0};
*/
	var location = this.getLocation();
	var mw = location.width / 2;
	var mh = location.height / 2;
	
	this.points = [];
	this.points.push({x:location.center.x - mw,y:location.center.y});
	this.points.push({x:location.center.x,y:location.center.y + mh});
	this.points.push({x:location.center.x + mw,y:location.center.y});
	this.points.push({x:location.center.x,y:location.center.y - mh});
}

/**
 * 设定或获取宽度
 *
 * @method center
 * @param {point} p 图形中心点
 * @return {point} 当前中心坐标
 */
jmPrismatic.prototype.center = function(p) {
	return this.setValue('center',p);
}

/**
 * 贝塞尔曲线,继承jmPath
 * N阶，参数points中为控制点
 *
 * @class jmBezier
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 画布
 * @param {object} params 参数
 */
 
function jmBezier(graph,params) {
	if(!params) params = {};
	/**
	 * 当前对象类型名
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmBezier';
	this.points = params.points || [];
	var style = params.style || {};
	
	this.graph = graph;
	this.cpoints(this.points);
	this.initializing(graph.context,style);
}
jmUtils.extend(jmBezier,jmPath);//继承path图形

/**
 * 初始化图形点
 *
 * @method initPoints
 * @private
 */
jmBezier.prototype.initPoints = function() {
	//获取当前控件的绝对位置
	//var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
    //if(!bounds) bounds = this.parent && this.parent.getAbsoluteBounds?this.parent.getAbsoluteBounds():this.getAbsoluteBounds();
	
	this.points = [];
	
	var cps = this.cpoints();
	/*var newps = cps;
	if(bounds) {
		newps = [];
		for(var i in cps) {
			if(cps[i]) {
				var np = {x:cps[i].x + bounds.left,y:cps[i].y + bounds.top};
				newps.push(np);	
			}	
		}	
	}*/
	for(var t = 0;t <= 1;t += 0.01) {
		var p = this.getPoint(cps,t);
		this.points.push(p);
	}	
	this.points.push(cps[cps.length - 1]);
	return this.points;
}

/**
 * 根据控制点和参数t生成贝塞尔曲线轨迹点
 *
 * @method getPoint
 * @param {array} ps 控制点集合
 * @param {number} t 参数(0-1)
 * @return {array} 所有轨迹点的数组
 */
jmBezier.prototype.getPoint = function(ps,t) {
	if(ps.length == 1) return ps[0];
	if(ps.length == 2) {					
		var p = {};
		p.x = (ps[1].x - ps[0].x) * t + ps[0].x;
		p.y = (ps[1].y - ps[0].y) * t + ps[0].y;
		return p;	
	}
	if(ps.length > 2) {
		var nps = [];
		for(var i = 0;i < ps.length - 1;i++) {
			var p = this.getPoint([ps[i],ps[i+1]],t);
			if(p) nps.push(p);
		}
		return this.getPoint(nps,t);
	}
}

/**
 * 对控件进行平移
 * 遍历控件所有描点或位置，设置其偏移量。
 *
 * @method offset
 * @param {number} x x轴偏移量
 * @param {number} y y轴偏移量
 * @param {boolean} [trans] 是否传递,监听者可以通过此属性是否决定是否响应移动事件,默认=true
 */
jmBezier.prototype.offset = function(x,y,trans) {	
	var p = this.cpoints();
	if(p) {			
		var len = p.length;
		for(var i=0; i < len;i++) {
			p[i].x += x;
			p[i].y += y;
		}		
		
		//触发控件移动事件	
		this.emit('move',{offsetX:x,offsetY:y,trans:trans});
		this.getLocation(true);	//重置
		this.graph.refresh();
	}
}

/**
* 获取当前控件的边界

jmBezier.prototype.getBounds = function() {
	this.initPoints();
	return this.base.getBounds.call(this);
}*/

/**
 * 控制点
 *
 * @method cpoints
 * @param {array} p 所有控制点
 * @return {array} 当前控制点集合
 */
jmBezier.prototype.cpoints = function(p) {
	return this.setValue('cpoints',p);
}




/**
 * 画矩形
 *
 * @class jmRect
 * @for jmGraph
 * @param {jmGraph} graph 画布
 * @param {object} params 参数 position=矩形左上角顶点坐标,width=宽，height=高,radius=边角弧度
 */
 
function jmRect(graph,params) {
	if(!params) params = {};
	/**
	 * 当前对象类型名jmRect
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmRect';
	this.points = params.points || [];
	var style = params.style || {};
	style.close = true;
	
	this.graph = graph;
	
	this.position(params.position || {x:0,y:0});
	this.width(params.width || 0);
	this.height(params.height  || 0);
	this.radius(params.radius || style.radius || 0);

	this.initializing(graph.context,style);
}
jmUtils.extend(jmRect,jmPath);//jmPath

/**
 * 获取当前控件的边界
 *
 * @method getBounds
 * @return {bound} 当前控件边界
 */
jmRect.prototype.getBounds = function() {
	var rect = {};
	this.initPoints();
	var p = this.position();
	rect.left = p.x; 
	rect.top = p.y; 
	rect.right = p.x + this.width(); 
	rect.bottom = p.y + this.height(); 
	rect.width = rect.right - rect.left;
	rect.height = rect.bottom - rect.top;
	return rect;
}

/**
 * 重写检查坐标是否在区域内
 *
 * @method checkPoint
 * @param {point} p 待检查的坐标
 * @return {boolean} 如果在则返回true,否则返回false
 */
jmRect.prototype.checkPoint = function(p) {	
	//生成当前坐标对应的父级元素的相对位置
	var abounds = this.bounds || this.getBounds();

	if(p.x > abounds.right || p.x < abounds.left) {
		return false;
	}
	if(p.y > abounds.bottom || p.y < abounds.top) {
		return false;
	}
	
	return true;
}

/**
 * 初始化图形点
 * 如果有边角弧度则类型圆绝计算其描点
 * 
 * @method initPoints
 * @private
 */
jmRect.prototype.initPoints = function() {
	var location = this.getLocation();	
	var p1 = {x:location.left,y:location.top};
	var p2 = {x:location.left + location.width,y:location.top};
	var p3 = {x:location.left + location.width,y:location.top + location.height};
	var p4 = {x:location.left,y:location.top + location.height};
	
	//如果有边界弧度则借助圆弧对象计算描点
	if(location.radius && location.radius < location.width/2 && location.radius < location.height/2) {
		var q = Math.PI / 2;
		var arc = this.graph.createShape('arc',{radius:location.radius,anticlockwise:false});
		arc.center({x:location.left + location.radius,y:location.top+location.radius});
		arc.startAngle(Math.PI);
		arc.endAngle(Math.PI + q);
		var ps1 = arc.initPoints();
		
		arc = this.graph.createShape('arc',{radius:location.radius,anticlockwise:false});
		arc.center({x:p2.x - location.radius,y:p2.y + location.radius});
		arc.startAngle(Math.PI + q);
		arc.endAngle(Math.PI * 2);
		var ps2 = arc.initPoints();
		
		arc = this.graph.createShape('arc',{radius:location.radius,anticlockwise:false});
		arc.center({x:p3.x - location.radius,y:p3.y - location.radius});
		arc.startAngle(0);
		arc.endAngle(q);
		var ps3 = arc.initPoints();
		
		arc = this.graph.createShape('arc',{radius:location.radius,anticlockwise:false});
		arc.center({x:p4.x + location.radius,y:p4.y - location.radius});
		arc.startAngle(q);
		arc.endAngle(Math.PI);
		var ps4 = arc.initPoints();
		this.points = ps1.concat(ps2,ps3,ps4);
	}
	else {
		this.points = [];
		this.points.push(p1);
		this.points.push(p2);
		this.points.push(p3);
		this.points.push(p4);
	}		
	
	return this.points;
}

/**
* 开始矩形
*//*
jmRect.prototype.draw = function() {
	var p = this.position();	
	if(p) {
		//获取当前控件的绝对位置
		//var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
		
		var w = this.width();
		var h = this.height();
		var p2 = {x:p.x + w,y:p.y};
		var p3 = {x:p.x + w,y:p.y + h};
		var p4 = {x:p.x,y:p.y + h};
		this.points = [];
		this.points.push(p);
		this.points.push(p2);
		this.points.push(p3);
		this.points.push(p4);
		//this.points.push(p1);

		this.context.moveTo(p.x,p.y );		
		this.context.lineTo(p2.x,p2.y);
		this.context.lineTo(p3.x,p3.y);
		this.context.lineTo(p4.x,p4.y);
		//this.context.lineTo(p1.x,p1.y);
	}		
}*/

/**
 * 圆角半径
 *
 * @method radius
 * @param {number} r 边角圆弧半径
 * @return {number} 当前圆角半径
 */
jmRect.prototype.radius = function(r) {
	return this.setValue('radius',r);
}


/**
 * 画箭头,继承自jmPath
 *
 * @class jmArraw
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 当前画布
 * @param {object} 生成箭头所需的参数
 */
function jmArraw(graph,params) {
	if(!params) params = {};
	this.points = params.points || [];
	var style = params.style || {};
	/**
	 * 当前对象类型名
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmArraw';
	
	style.lineJoin = 'miter';
	style.lineCap = 'square';
	this.graph = graph;
	
	this.angle(params.angle  || 0);
	this.start(params.start  || 0);
	this.end(params.end  || 0);
	this.offsetX(params.offsetX || 5);
	this.offsetY(params.offsetY || 8);
	this.initializing(graph.context,style);
}

jmUtils.extend(jmArraw,jmPath);//jmPath

/**
 * 初始化图形点
 * 
 * @method initPoint
 * @private
 * @param {boolean} solid 是否为实心的箭头
 * @for jmArraw
 */
jmArraw.prototype.initPoints = function(solid) {	
	var rotate = this.angle();
	var start = this.start();
	var end = this.end();
	if(!end) return;
	//计算箭头指向角度
	if(!rotate) {
		rotate = Math.atan2(end.y - start.y,end.x - start.x);
	}
	this.points = [];
	var offx = this.offsetX();
	var offy = this.offsetY();
	//箭头相对于线的偏移角度
	var r = Math.atan2(offx,offy);
	var r1 = rotate + r;
    var rsin = Math.sin(r1);
    var rcos = Math.cos(r1);
    var sq = Math.sqrt(offx * offx  + offy * offy);
    var ystep = rsin * sq;
    var xstep = rcos * sq;
    
    var p1 = {x:end.x - xstep,y:end.y - ystep};
    var r2 = rotate - r;
    rsin = Math.sin(r2);
    rcos = Math.cos(r2);
    ystep = rsin * sq;
    xstep = rcos * sq;
    var p2 = {x:end.x - xstep,y:end.y - ystep};

    var s = jmUtils.clone(end);  
    s.m = true;  
    this.points.push(s);
    this.points.push(p1);
    //如果实心箭头则封闭路线
    if(solid || this.style.fill) {    	
    	this.points.push(p2);
    	this.points.push(s);
    }
    else {
    	this.points.push(s);
    	this.points.push(p2);
    }
    
	return this.points;
}


/**
 * 控制起始点
 *
 * @method start
 * @for jmArraw
 * @param {point} p 起始点
 * @return {point} 起始点
 */
jmArraw.prototype.start = function(p) {
	return this.setValue('start',p);
}

/**
 * 控制结束点
 *
 * @method end
 * @for jmArraw
 * @param {point} p 结束点
 * @return {point} 结束点
 */
jmArraw.prototype.end = function(p) {
	return this.setValue('end',p);
}

/**
 * 箭头角度
 *
 * @method angle
 * @for jmArraw
 * @param {number} r 箭头角度
 * @return {number} 箭头角度
 */
jmArraw.prototype.angle = function(r) {
	return this.setValue('angle',r);
}

/**
 * 箭头X偏移量
 *
 * @method offsetX
 * @for jmArraw
 * @param {number} p 箭头X偏移量
 * @return {number} 箭头X偏移量
 */
jmArraw.prototype.offsetX = function(p) {
	return this.setValue('offsetX',p);
}
/**
 * 箭头Y偏移量
 *
 * @method offsetY
 * @for jmArraw
 * @param {number} p 箭头Y偏移量
 * @return {number} 箭头Y偏移量
 */
jmArraw.prototype.offsetY = function(p) {
	return this.setValue('offsetY',p);
}


/**
 * 显示文字控件
 * params参数:style=样式，value=显示的文字
 *
 * @class jmLabel
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 当前画布
 * @param {object} params 文字控件参数
 */
function jmLabel(graph,params) {
	if(!params) params = {};		
	var style = params.style || {};
	style.font = style.font || "15px Arial";
	this.type = 'jmLabel';
	// 显示不同的 textAlign 值
	//文字水平对齐
	style.textAlign = style.textAlign || 'left';
	//文字垂直对齐
	style.textBaseline = style.textBaseline || 'middle',
	
	this.graph = graph;
	this.value = params.value;
	this.position(params.position || {x:0,y:0});
	this.width(params.width || 0);
	this.height(params.height  || 0);

	if(graph.mode != 'canvas') this.svgShape = graph.context.create('text',this);
	this.initializing(graph.context,style);
}
jmUtils.extend(jmLabel,jmControl);//jmPath

/**
 * 初始化图形点,主要用于限定控件边界。
 *
 * @method initPoints
 * @return {array} 所有边界点数组
 * @private
 */
jmLabel.prototype.initPoints = function() {	
	var location = this.getLocation();
	
	var w = location.width;
	var h = location.height;	

	this.points = [{x:location.left,y:location.top}];
	this.points.push({x:location.left + location.width,y:location.top});
	this.points.push({x:location.left + location.width,y:location.top + location.height});
	this.points.push({x:location.left,y:location.top+ location.height});
	return this.points;
}

/**
 * 测试获取文本所占大小
 *
 * @method testSize
 * @return {object} 含文本大小的对象
 */
jmLabel.prototype.testSize = function() {
	this.context.save();
	this.setStyle();
	//计算宽度
	var textSize = this.context.measureText?
						this.context.measureText(this.value):
						{width:(this.svgShape?this.svgShape.element.getBBox().width:15)};
	this.context.restore();
	textSize.height = 15;
	return textSize;
}

/**
 * 根据位置偏移画字符串
 * 
 * @method draw
 */
jmLabel.prototype.draw = function() {	
	
	//获取当前控件的绝对位置
	var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;		
	
	var location = this.getLocation();
	var x = location.left + bounds.left;
	var y = location.top + bounds.top;
	//通过文字对齐方式计算起始X位置
	switch(this.style.textAlign) {
		case 'right': {
			x += location.width;
			break;
		}
		case 'center': {
			x += location.width / 2;
			break;
		}
	}
	//通过垂直对齐方式计算起始Y值
	switch(this.style.textBaseline) {
		case 'bottom': {
			y += location.height;
			break;
		}
		case 'hanging':
		case 'alphabetic':
		case 'middle' : {
			y += location.height/2;
			break;
		}

	}

	if(this.mode == 'canvas') {
		if(this.value) {
			if(this.style.fill && this.context.fillText) {
				if(this.style.maxWidth) {
					this.context.fillText(this.value,x,y,this.style.maxWidth);
				}
				else {
					this.context.fillText(this.value,x,y);
				}
			}
			else if(this.context.strokeText) {
				if(this.style.maxWidth) {
					this.context.strokeText(this.value,x,y,this.style.maxWidth);
				}
				else {
					this.context.strokeText(this.value,x,y);
				}
			}
		}
		//如果有指定边框，则画出边框
		if(this.style.border) {
			this.context.moveTo(this.points[0].x + bounds.left,this.points[0].y + bounds.top);
			if(this.style.border.top) {
				this.context.lineTo(this.points[1].x + bounds.left,this.points[1].y + bounds.top);
			}
			
			if(this.style.border.right) {
				this.context.moveTo(this.points[1].x + bounds.left,this.points[1].y + bounds.top);
				this.context.lineTo(this.points[2].x + bounds.left,this.points[2].y + bounds.top);
			}
			
			if(this.style.border.bottom) {
				this.context.moveTo(this.points[2].x + bounds.left,this.points[2].y + bounds.top);
				this.context.lineTo(this.points[3].x + bounds.left,this.points[3].y + bounds.top);
			}
			
			if(this.style.border.left) {
				this.context.moveTo(this.points[3].x + bounds.left,this.points[3].y + bounds.top);	
				this.context.lineTo(this.points[0].x + bounds.left,this.points[0].y + bounds.top);
			}	
		}
	}
	else {
		this.svgShape.attr({
			x:x,
			y:y,
			text:this.value
		})
	}
}

/**
 * 设置或获取宽度
 *
 * @method width
 * @param {number} w 宽度
 * @return {number} 当前宽度
 */
jmLabel.prototype.width = function(w) {
	if(w) {
		return this.setValue('width',w);
	}
	else {
		w = this.getValue('width');
		if(w) return w;
		else if(this.context) {
			return this.testSize().width;
		}		
	}
}


/**
 * 图片控件，继承自jmControl
 * params参数中image为指定的图片源地址或图片img对象，
 * postion=当前控件的位置，width=其宽度，height=高度，sposition=从当前图片中展示的位置，swidth=从图片中截取的宽度,sheight=从图片中截取的高度。
 * 
 * @class jmImage
 * @for jmGraph
 * @module jmGraph
 * @require jmControl
 * @param {jmGraph} graph 当前画布
 * @param {object} params 控件参数
 */
function jmImage(graph,params) {
	var style = params && params.style ? params.style : {};
	
	this.graph = graph;
	this.width(params.width);
	this.height(params.height);
	this.type = 'jmImage';
	this.position(params.position || {x:0,y:0});
	this.sourceWidth(params.swidth);
	this.sourceHeight(params.sheight);
	this.sourcePosition(params.sposition);
	this.image(params.image || style.image);
	this.initializing(graph.context,style);
}

jmUtils.extend(jmImage,jmControl);//继承基础图形

/**
 * 重写控件绘制
 * 根据父边界偏移和此控件参数绘制图片
 *
 * @method draw
 */
jmImage.prototype.draw = function() {	
	try {
		var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
	    if(!bounds) bounds = this.parent && this.parent.getAbsoluteBounds?this.parent.getAbsoluteBounds():this.getAbsoluteBounds();
		var p = this.getLocation();
		p.left += bounds.left;
		p.top += bounds.top;
		
		var sp = this.sourcePosition();
		var sw = this.sourceWidth();
		var sh = this.sourceHeight();
		var img = this.image();
		if(sw || sh) {
			if(!sw) sw= p.width;
			if(!sh) sh= p.height;
			if(!sp) sp= {x:0,y:0};
		}
		if(sp) {		
			if(p.width && p.height) this.context.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,p.width,p.height);
			else if(p.width) {
				this.context.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,p.width,img.height);
			}		
			else if(p.height) {
				this.context.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,img.width,p.height);
			}		
			else this.context.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top);		
		}
		else if(p) {
			if(p.width && p.height) this.context.drawImage(img,p.left,p.top,p.width,p.height);
			else if(p.width) this.context.drawImage(img,p.left,p.top,p.width,img.height);
			else if(p.height) this.context.drawImage(img,p.left,p.top,img.width,p.height);
			else this.context.drawImage(img,p.left,p.top);
		}
		else {
			this.context.drawImage(this.image());
		}
	}
	catch(e) {
		console.log(e);
	}
}

/**
 * 获取当前控件的边界 
 * 
 * @method getBounds
 * @return {object} 边界对象(left,top,right,bottom,width,height)
 */
jmImage.prototype.getBounds = function() {
	var rect = {};
	var img = this.image();
	var p = this.getLocation();
	var w = p.width || img.width;
	var h = p.height || img.height;
	rect.left = p.left; 
	rect.top = p.top; 
	rect.right = p.left + w; 
	rect.bottom = p.top + h; 
	rect.width = w;
	rect.height = h;
	return rect;
}

/**
 * 设定要绘制的图像或其它多媒体对象
 *
 * @method image
 * @param {string/img} [img] 图片路径或图片控件对象
 * @return {img} 图片对象
 */
jmImage.prototype.image = function(img) {
	if(img && typeof img == 'string') {
		var g = document.createElement('img');
		g.src = img;
		img = g;
	}
	return this.setValue('image',img);
}

/**
 * 画图的起始位置
 *
 * @method position
 * @param {point} [p] 图片绘制的位置
 * @return {point} 当前图片位置
 */
jmImage.prototype.position = function(p) {
	return this.setValue('position',p);
}

/**
 * 画图开始剪切位置
 *
 * @method sourcePosition
 * @param {point} [p] 目标图片截取的位置
 * @return {point} 当前截取位置
 */
jmImage.prototype.sourcePosition = function(p) {
	return this.setValue('sourcePosition',p);
}

/**
 * 被剪切宽度
 *
 * @method sourceWidth
 * @param {number} [w] 图片剪切宽度
 * @return {number} 剪切宽度
 */
jmImage.prototype.sourceWidth = function(w) {
	return this.setValue('sourceWidth',w);
}

/**
 * 被剪切高度
 *
 * @method sourceHeight
 * @param {number} h 图片剪切高度
 * @return {number} 当前被剪切高度
 */
jmImage.prototype.sourceHeight = function(h) {
	return this.setValue('sourceHeight',h);
}



/**
 * 可拉伸的缩放控件
 * 继承jmRect
 * 如果此控件加入到了当前控制的对象的子控件中，请在参数中加入movable:false，否则导致当前控件会偏离被控制的控件。
 *
 * @class jmResize
 * @for jmGraph
 */
function jmResize(graph,params) {
	this.params = params || {};
	var style = params.style || {};
	/**
	 * 当前对象类型名jmResize
	 *
	 * @property type
	 * @type string
	 */
	this.type = 'jmResize';	
	//是否可拉伸
	this.enabled = params.enabled === false?false:true;	
	
	
	this.graph = graph;
	this.points = params.points || [];
	this.position(params.position || {x:0,y:0});
	this.width(params.width || 0);
	this.height(params.height  || 0);
	this.rectSize(params.rectSize || 10);
	this.initializing(graph.context,style);
	this.init();
}

jmUtils.extend(jmResize,jmRect);//jmRect

/**
 * 初始化控件的8个拉伸方框
 *
 * @method init
 * @private
 */
jmResize.prototype.init = function() {
	//如果不可改变大小。则直接退出
	if(this.params.resizable === false) return;
	this.resizeRects = [];	
	var rs = this.rectSize();
	for(var i = 0;i<8;i++) {
		//生成改变大小方块
		var r = this.graph.createShape('rect',{
				position:{x:0,y:0},
				width:rs,
				height:rs,
				style:{
					stroke: this.style.rectStroke || 'red',
					//fill:'transparent',
					close:true,
					zIndex:100
				}});
		r.index = i;
		r.visible = true;
		this.resizeRects.push(r);	
		this.children.add(r);
		r.canMove(true,this.graph);	
	}	
	this.reset(0,0,0,0);//初始化位置
	//绑定其事件
	this.bindRectEvents();
}

/**
 * 绑定周边拉伸的小方块事件
 *
 * @method bindRectEvents
 * @private
 */
jmResize.prototype.bindRectEvents = function() {
	var self = this;
	
	for(var i in this.resizeRects) {
		var r = this.resizeRects[i];		
		//小方块移动监听
		r.on('move',function(arg) {				
			var px=0,py=0,dx=0,dy=0;
			if(this.index == 0) {				
				dx = - arg.offsetX;
				px = arg.offsetX;						
			}
			else if(this.index == 1) {
				dx = - arg.offsetX;
				px = arg.offsetX;				
				dy = - arg.offsetY;
				py = arg.offsetY;						
			}
			else if(this.index == 2) {				
				dy = -arg.offsetY;				
				py = arg.offsetY;						
			}
			else if(this.index == 3) {
				dx = arg.offsetX;				
				dy = -arg.offsetY;
				py = arg.offsetY;
			}
			else if(this.index == 4) {
				dx = arg.offsetX;							
			}
			else if(this.index == 5) {
				dx = arg.offsetX;
				dy = arg.offsetY;					
			}
			else if(this.index == 6) {
				dy = arg.offsetY;					
			}
			else if(this.index == 7) {
				dx = - arg.offsetX;
				px = arg.offsetX;
				dy = arg.offsetY;				
			}
			//重新定位
			self.reset(px,py,dx,dy);
		});
		//鼠标指针
		r.bind('mousemove',function() {	
			var rectCursors = ['w-resize','nw-resize','n-resize','ne-resize','e-resize','se-resize','s-resize','sw-resize'];		
			this.cursor(rectCursors[this.index]);
		});
		r.bind('mouseleave',function() {
			this.cursor('default');
		});
	}
}

/**
 * 按移动偏移量重置当前对象，并触发大小和位置改变事件
 * @method reset
 * @param {number} px 位置X轴偏移
 * @param {number} py 位置y轴偏移
 * @param {number} dx 大小x轴偏移
 * @param {number} dy 大小y轴偏移
 */
jmResize.prototype.reset = function(px,py,dx,dy) {
	var minSize = 5;
	var location = this.getLocation();
	if(dx != 0 || dy != 0) {
		var w = location.width + dx;
		var h = location.height + dy;
		if(w >= minSize && h >= minSize) {
			this.width(w);
			this.height(h);
			//如果当前控件能移动才能改变其位置
			if(this.params.movable !== false) {
				var p = this.position();
				p.x = location.left + px;
				p.y = location.top + py;
				this.position(p);
			}			
			//触发大小改变事件
			this.emit('resize',px,py,dx,dy);
		}	
	}

	for(var i in this.resizeRects) {
		var r = this.resizeRects[i];
		switch(r.index) {
			case 0: {
				r.position().x = -r.width() / 2;
				r.position().y = (location.height - r.height()) / 2;
				break;
			}	
			case 1: {
				r.position().x = -r.width() / 2;
				r.position().y = -r.height() / 2;
				break;
			}		
			case 2: {
				r.position().x = (location.width - r.width()) / 2;
				r.position().y = -r.height() / 2;
				break;
			}
			case 3: {
				r.position().x = location.width - r.width() / 2;
				r.position().y = -r.height() / 2;
				break;
			}
			case 4: {
				r.position().x = location.width - r.width() / 2;
				r.position().y = (location.height - r.height()) / 2;
				break;
			}
			case 5: {
				r.position().x = location.width - r.width() / 2;
				r.position().y = location.height - r.height() /2;
				break;
			}
			case 6: {
				r.position().x = (location.width - r.height()) / 2;
				r.position().y = location.height - r.height() / 2;
				break;
			}
			case 7: {
				r.position().x = -r.width() / 2;
				r.position().y = location.height - r.height() / 2;
				break;
			}
		}
	}
}

/**
 * 拉伸小方块边长
 *
 * @method rectSize
 * @param {number} s 边长
 * @return {number} 当前边长
 */
jmResize.prototype.rectSize = function(s) {
	return this.setValue('rectSize',s);
}

/**
 * 控制的目标控件
 *
 * @method target
 * @param {jmControl} target 边长
 * @return {jmControl} 控制的目标控件
 */
jmResize.prototype.target = function(target) {
	return this.setValue('target',target);
}

/**
 * 带箭头的直线,继承jmPath
 *
 * @class jmArrawLine
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 当前画布
 * @param {object} params 生成当前直线的参数对象，(style=当前线条样式,start=直线起始点,end=直线终结点)
 */	
function jmArrawLine(graph,params) {
	if(!params) params = {};
	this.points = params.points || [];
	var style = params.style || {};
	style.lineJoin = 'miter';
	
	this.graph = graph;
	this.type = 'jmArrawLine';
	this.start = params.start || (params.start={x:0,y:0});
	this.end = params.end || (params.end={x:0,y:0});

	this.initializing(graph.context,style);
	
	this.line = graph.createShape('line',params) ;
	this.arraw = graph.createShape('arraw',params);
}
jmUtils.extend(jmArrawLine,jmPath);//jmPath


/**
 * 初始化直线和箭头描点
 *
 * @method initPoints
 * @private
 */
jmArrawLine.prototype.initPoints = function() {	
	this.points = this.line.initPoints();
	if(this.arrawVisible !== false) {
		this.points = this.points.concat(this.arraw.initPoints());
	}
	return this.points;
}


/**
 * 显示提示控件
 * params参数:style=样式，value=显示的文字
 *
 * @class jmTooltip
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 当前画布
 * @param {object} params 参数
 */
function jmTooltip(graph,params) {
	if(!params) params = {};		
	var style = params.style || {};
	style.font = style.font || "15px Arial";
	this.type = 'jmTooltip';
	
	this.graph = graph;

	this.position(params.position || {x:0,y:0});		
	this.initializing(graph.context,style);

	this.element = document.createElement('div');
	this.element.className = 'jm-tooltip';
	this.element.style.position = 'absolute';
	this.element.style.display = 'none';
	this.value(params.value);
	document.body.appendChild(this.element);
}

jmUtils.extend(jmTooltip,jmControl);//jmPath

/**
 * 写入样式
 * 
 * @method setStyle
 * @private
 */
jmTooltip.prototype.setStyle = function(style) {
	style = style || this.style;
	if(style && typeof style == 'object') {		
		for(var k in style) {
			if(typeof(k) != 'string' || typeof(style[k]) != 'string') continue;
			try {
				this.element.style[k] = style[k];
			}
			catch(e) {
				window.console.log(e);
			}
		}		
	}
}

/**
 * 计算提示位并显示
 * 
 * @method draw
 */
jmTooltip.prototype.draw = function() {	
	this.setPosition();	
}

/**
 * 设置提示坐标位置
 *
 * @method setPosition
 * @param {number} x X轴坐标
 * @param {number} y Y轴坐标
 */
jmTooltip.prototype.setPosition = function(x,y) {
	this.x = x || this.x || 0;
	this.y = y || this.y || 0;
	//获取当前控件的绝对位置
	var bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
	var location = this.getLocation();
	x = this.x + location.left + bounds.left;
	y = this.y + location.top + bounds.top;
	
	var graphpostion = this.graph.getPosition();
	x += graphpostion.left;
	y += graphpostion.top;

	this.element.style.top = y + 'px';
	this.element.style.left = x + 'px';
}

/**
 * 移除当前控件
 *
 * @method remove 
 */
jmTooltip.prototype.remove = function() {
	if(this.element) {
		document.body.removeChild(this.element);
	}
}

/**
 * 显示当前控件
 *
 * @method remove 
 */
jmTooltip.prototype.show = function() {
	if(this.element) {
		this.element.style.display = 'inline';
	}
}

/**
 * 隐藏当前控件
 *
 * @method remove 
 */
jmTooltip.prototype.hide = function() {
	if(this.element) {
		this.element.style.display = 'none';
	}
}

/**
 * 设置或获取当前值
 *
 * @method value 
 */
jmTooltip.prototype.value = function(v) {
	if(this.element) {
		if(v !== undefined) {
			this.element.innerHTML = v;
		}
		return this.element.innerHTML;
	}
}

/**
 * 设置或获取当前宽度
 *
 * @method width 
 * @param {number} w 宽度
 */
jmTooltip.prototype.width = function(w) {
	if(this.element) {
		if(w !== undefined) {
			this.element.style.width = w + 'px';
		}
		return this.element.clientWidth;
	}
}

/**
 * 设置或获取当前高度
 *
 * @method width 
 * @param {number} w 宽度
 */
jmTooltip.prototype.height = function(h) {
	if(this.element) {
		if(h !== undefined) {
			this.element.style.height = h + 'px';
		}
		return this.element.clientHeight;
	}
}




/**
 * jmGraph画图类库
 * 对canvas画图api进行二次封装，使其更易调用，省去很多重复的工作。
 *
 * @module jmGraph
 * @class jmGraph
 * @param {element} canvas 标签canvas
 * @require jmControl
 */
function jmGraph(canvas,w,h) {
	/*if(!canvas || !canvas.getContext) {
		throw 'canvas error';
	}*/
	this.type = 'jmGraph';
	/**
	 * 当前支持的画图类型 svg/canvas
	 *
	 * @property mode
	 * @type {string}
	 */
	this.mode = 'canvas';//jmUtils.checkSupportedMode();

	if(typeof canvas === 'string') {
		canvas = document.getElementById(canvas);
	}
	if(this.mode == 'canvas') {	
		if(canvas.tagName != 'CANVAS') {
			var cn = document.createElement('canvas');
			canvas.appendChild(cn);
			cn.width = canvas.clientWidth;
			cn.height = canvas.clientHeight;
			canvas = cn;
			
			
		}		
		this.canvas = canvas;
		if(w) this.width(w);
		if(h) this.height(h);	

		//当为ie9以下版本时，采用excanvas初始化canvas
		if(typeof G_vmlCanvasManager != 'undefined') {
			G_vmlCanvasManager.init_(document);
		}
		this.context = canvas.getContext('2d');	

			
	}
	else {
		this.context = new jmSVG(canvas,w,h);			
		this.canvas = this.context.paper;		
	}
	this.initializing(this.context);

	/**
	 * 初始化默认图形
	 * 
	 * @method initShapes
	 * @private
	 */
	(function initShapes() {
		if(typeof jmLine !== 'undefined') this.registerShape('line',jmLine);
		if(typeof jmPath !== 'undefined') this.registerShape('path',jmPath);
		if(typeof jmRect !== 'undefined') this.registerShape('rect',jmRect);
		if(typeof jmCircle !== 'undefined') this.registerShape('circle',jmCircle);
		if(typeof jmArc !== 'undefined') this.registerShape('arc',jmArc);
		if(typeof jmHArc !== 'undefined') this.registerShape('harc',jmHArc);
		if(typeof jmPrismatic !== 'undefined') this.registerShape('prismatic',jmPrismatic);
		if(typeof jmLabel !== 'undefined') this.registerShape('label',jmLabel);
		if(typeof jmImage !== 'undefined') {
			this.registerShape('image',jmImage);
			this.registerShape('img',jmImage);
		}
		if(typeof jmBezier !== 'undefined') {
			this.registerShape('bezier',jmBezier);
		}
		if(typeof jmArraw !== 'undefined') this.registerShape('arraw',jmArraw);
		if(typeof jmArrawLine !== 'undefined') this.registerShape('arrawline',jmArrawLine);
		if(typeof jmResize !== 'undefined') this.registerShape('resize',jmResize);
		if(typeof jmTooltip !== 'undefined') this.registerShape('tooltip',jmTooltip);
	}).call(this);
	
	//绑定事件
	this.eventHandler = new jmEvents(this,this.canvas.canvas || this.canvas);
}

//继承基础控件
jmUtils.extend(jmGraph,jmControl);	

/**
 * 注册图形类型,图形类型必需有统一的构造函数。参数为画布句柄和参数对象。
 *
 * @method registerShape 
 * @param {string} name 控件图形名称
 * @param {class} shape 图形控件类型
 */
jmGraph.prototype.registerShape = function(name,shape) {
	name = 'jmGraph.shapes.' + name;
	if(!jmUtils.cache.get(name)) {
		jmUtils.cache.set(name , shape);
	}
}

/**
 * 从已注册的图形类创建图形
 * 简单直观创建对象
 *
 * @method createShape 
 * @param {string} name 注册控件的名称
 * @param {object} args 实例化控件的参数
 * @return {object} 已实例化控件的对象
 */
jmGraph.prototype.createShape = function(name,args) {
	name = 'jmGraph.shapes.' + name;
	var shape = jmUtils.cache.get(name);
	if(shape) {
		if(!args) args = {};
		args.mode = this.mode;
		var obj = new shape(this,args);
		return obj;
	}
}

/**
 * 检查是否支持的浏览器
 *
 * @method isSurportedBrowser
 * @return {boolean} true=支持，false=不支持
 */
jmGraph.prototype.isSupportedBrowser = function() {
	var browser = jmUtils.browser();
	return !browser.msie || browser.ver > 8.0;
}

/**
 * 生成阴影对象
 *
 * @method createLinearGradient
 * @param {number} x x偏移量
 * @param {number} y y偏移量
 * @param {number} blur 模糊值
 * @param {string} color 颜色
 * @return {jmShadow} 阴影对象
 */
jmGraph.prototype.createShadow = function(x,y,blur,color) {
	var sh = new jmShadow(x,y,blur,color);
	return sh;
}

/**
 * 生成线性渐变对象
 *
 * @method createLinearGradient
 * @param {number} x1 线性渐变起始点X坐标
 * @param {number} y1 线性渐变起始点Y坐标
 * @param {number} x2 线性渐变结束点X坐标
 * @param {number} y2 线性渐变结束点Y坐标
 * @return {jmGradient} 线性渐变对象
 */
jmGraph.prototype.createLinearGradient = function(x1,y1,x2,y2) {
	var gradient = new jmGradient({type:'linear',x1:x1,y1:y1,x2:x2,y2:y2});
	return gradient;
}

/**
 * 生成放射渐变对象
 *
 * @method createRadialGradient
 * @param {number} x1 放射渐变小圆中心X坐标
 * @param {number} y1 放射渐变小圆中心Y坐标
 * @param {number} r1 放射渐变小圆半径
 * @param {number} x2 放射渐变大圆中心X坐标
 * @param {number} y2 放射渐变大圆中心Y坐标
 * @param {number} r2 放射渐变大圆半径
 * @return {jmGradient} 放射渐变对象
 */
jmGraph.prototype.createRadialGradient = function(x1,y1,r1,x2,y2,r2) {	
	var gradient = new jmGradient({type:'radial',x1:x1,y1:y1,r1:r1,x2:x2,y2:y2,r2:r2});
	return gradient;
}

/**
 * 重新刷新整个画板
 * 以加入动画事件触发延时10毫秒刷新，保存最尽的调用只刷新一次，加强性能的效果。
 *
 * @method refresh
 */
jmGraph.prototype.refresh = function() {	
	//加入动画，触发redraw，会导致多次refresh只redraw一次
	this.animate(function() {
		return false;
	},100,'jmgraph_refresh');
	//this.redraw();
}

/**
 * 重新刷新整个画板
 * 此方法直接重画，与refresh效果类似
 *
 * @method redraw
 * @param {number} [w] 清除画布的宽度
 * @param {number} [h] 清除画布的高度
 */
jmGraph.prototype.redraw = function(w,h) {	
	this.clear(w,h);
	this.paint();
}

/**
 * 清除画布
 * 
 * @method clear
 * @param {number} [w] 清除画布的宽度
 * @param {number} [h] 清除画布的高度
 */
jmGraph.prototype.clear = function(w,h) {
	//this.canvas.width = this.canvas.width;
	if(w && h) {
		//this.zoomActual();//恢复比例缩放
		this.canvas.width = w;
		this.canvas.height = h;
		//保留原有缩放比例
		if(this.scaleSize) {
			if(this.context.scale) this.context.scale(this.scaleSize.x,this.scaleSize.y);
		}
	}
	else {
		w = this.canvas.width;
		h = this.canvas.height;
		if(this.scaleSize) {
			w = w / this.scaleSize.x;
			h = h / this.scaleSize.y;
		}
	}
	if(this.context.clearRect) this.context.clearRect(0,0,w,h);
}

/**
* 设置画布样式，此处只是设置其css样式
*
* @method css
* @param {string} name 样式名
* @param {string} value 样式值
*/
jmGraph.prototype.css = function(name,value) {
	if(this.canvas) {
		this.canvas.style[name] = value;
	}
}

/**
 * 生成路径对象
 *
 * @method createPath
 * @param {array} points 路径中的描点集合
 * @param {style} style 当前路径的样式
 * @return {jmPath} 路径对象jmPath
 */
jmGraph.prototype.createPath = function(points,style) {
	var path = this.createShape('path',{points:points,style:style});
	return path;
}

/**
 * 生成直线
 * 
 * @method createLine
 * @param {point} start 直线的起点
 * @param {point} end 直线的终点
 * @param {style} 直线的样式
 * @return {jmLine} 直线对象
 */
jmGraph.prototype.createLine = function(start,end,style) {
	var line = this.createShape('line',{start:start,end:end,style:style});
	return line;
}

/**
 * 重写获取当前控件的边界
 * 
 * @method getBounds
 * @return {object} 当前画布的边界 {left,top,right,bottom,width,height}
 */
jmGraph.prototype.getBounds = function() {
	var rect = {};	
	rect.left = 0; 
	rect.top = 0; 
	if(typeof this.canvas.width === 'function') {
		rect.right = this.canvas.width(); 
	}
	else {
		rect.right = this.canvas.width; 
	}
	
	if(typeof this.canvas.height === 'function') {
		rect.bottom = this.canvas.height(); 
	}
	else {
		rect.bottom = this.canvas.height; 
	}
	rect.width = rect.right;
	rect.height = rect.bottom;
	return rect;
}

/**
 * 获取当前画布在浏览器中的绝对定位
 *
 * @method getPosition
 * @return {postion} 返回定位坐标
 */
jmGraph.prototype.getPosition = function() {
	var p = jmUtils.getElementPosition(this.canvas.canvas || this.canvas);
	p.width = this.canvas.width;
	p.height = this.canvas.height;
	p.right = p.left + p.width;
	p.bottom = p.top + p.height;
	return p;
}

/**
 * 检 查坐标是否落在当前控件区域中..true=在区域内
 * graph需要特殊处理，因为它是相对为整个页面的，接收所有事件再分发相对于它本身的子控件。
 *
 * @method checkPoint
 * @param {point} p 位置参数
 * @return {boolean} 当前位置如果在区域内则为true,否则为false。
 */
jmGraph.prototype.checkPoint = function(p) {	
	var position = this.getPosition();

	if(p.pageX > position.right || p.pageX < position.left) {
		return false;
	}
	if(p.pageY > position.bottom || p.pageY < position.top) {
		return false;
	}	
	return true;
}

/**
 * 缩小整个画布按比例0.9
 * 
 * @method zoomOut
 */
jmGraph.prototype.zoomOut = function() {
	this.scale(0.9 ,0.9);
}

/**
 * 放大 每次增大0.1的比例
 * 
 * @method zoomIn
 */
jmGraph.prototype.zoomIn = function() {		
	this.scale(1.1 ,1.1);
}

/**
 * 大小复原
 * 
 * @method zoomActual
 */
jmGraph.prototype.zoomActual = function() {
	if(this.scaleSize) {
		this.scale(1 / this.scaleSize.x ,1 / this.scaleSize.y);	
	}
	else {
		this.scale(1 ,1);	
	}	
}

/**
 * 宽度
 * 
 * @method width
 */
jmGraph.prototype.width = function(w) {
	//if(this.mode == 'canvas') {
		if(typeof w !== 'undefined') this.canvas.width = w;
		return this.canvas.width;
	//}
	//else {
		//if(typeof w !== 'undefined') this.canvas.width(w);
		//return this.canvas.width();
	//}
}

/**
 * 高度
 * 
 * @method width
 */
jmGraph.prototype.height = function(h) {
	//if(this.mode == 'canvas') {
		if(typeof h !== 'undefined') this.canvas.height = h;
		return this.canvas.height;
	//}
	//else {
		//if(typeof h !== 'undefined') this.canvas.height(h);
		//return this.canvas.height();
	//}
}

/**
 * 放大缩小画布
 * 
 * @method scale
 * @param {number} dx 缩放X轴比例
 * @param {number} dy 缩放Y轴比例
 */
jmGraph.prototype.scale = function(dx,dy) {
	if(!this.normalSize) {
		this.normalSize = {width:this.canvas.width,height:this.canvas.height};		
	}
	
	this.context.scale(dx,dy);
	if(!this.scaleSize) {
		this.scaleSize = {x:dx,y:dy};
	}
	else {
		this.scaleSize = {x:dx * this.scaleSize.x,y:dy * this.scaleSize.y};
	}
	this.refresh();
}

/**
 * 保存为base64图形数据
 * 
 * @method toDataURL
 * @return {string} 当前画布图的base64字符串
 */
jmGraph.prototype.toDataURL = function() {
	var data = this.canvas.toDataURL?this.canvas.toDataURL():'';
	return data;
}


/**
 * 流程编辑器单元,继承自jmControl
 * 参数说明:resizable=是否可改变大小，connectable=是否可连线,value =当前显示字符串,position=单元位置,editor=当前单元所属编辑器,graph=画布,style=样式对象或名称
 * 
 * @class jmCell
 * @for jmEditor
 * @module jmEditor
 * @param {object} option 参数
 */

function jmCell(option) {		
	this.option = option;			
	this.type = 'jmCell';
	this.value(option.value || '');
	this.graph = option.graph;
	this.editor = option.editor;		
	this.styleName = option.style;		
	this.setStyle(this.styleName);
	option.position = option.position || {x:0,y:0};

	//如果从样式中取大小，则重新定位
	if(option.width) {
		this.width(option.width);
	}
	else if(this.style.width) {
		this.width(this.style.width);
		option.position.x -= this.style.width / 2;
	}
	if(option.height) {
		this.height(option.height);
	}
	else if(this.style.height) {
		this.height(this.style.height);
		option.position.y -= this.style.height / 2;
	}
	this.position(option.position);	

	/**
	 * 当前元素是否已被选择
	 *
	 * @property selected
	 * @type boolean
	 */
	this.selected = false;
	this.initializing(this.graph.context,this.style);
	//已option参数为准
	if(typeof option.resizable != 'undefined') {
		this.resizable = option.resizable;
	}
	else if(typeof this.style.resizable != 'undefined') {
		this.resizable = this.style.resizable;			
	}
	
	if(typeof option.connectable != 'undefined') {
		this.connectable = option.connectable;
	}
	else if(typeof this.style.connectable != 'undefined') {
		this.connectable = this.style.connectable;			
	}	
	else {
		this.connectable = this.editor.connectable;
	}	
}

jmUtils.extend(jmCell,jmControl);//继承属性绑定	

/**
 * 初始化当前元素样式
 *
 * @method setStyle
 * @for jmCell
 * @param {object} style 样式
 */
jmCell.prototype.setStyle = function(style) {
	if(style) {
		var mpstyle = this.editor.styles[style]
		 if(mpstyle) {
		 	this.styleName = style;
		 	this.style = jmUtils.clone(mpstyle);
		 }
		 else {
		 	this.style = jmUtils.clone(style);
		 	mpstyle = style;
		 }
		if(typeof this.style.resizable != 'undefined') {
			this.resizable = this.style.resizable;	
		}
		this.style.zIndex = this.style.zIndex || 1000;
		this.fontStyle = mpstyle.fontStyle || this.editor.defaultStyle.font;
		this.style.padding = this.style.padding || {left:8,top:8,right:8,bottom:8};
		if(this.label) {
			this.label.style = this.fontStyle;
		}
		if(this.shape) {
			mpstyle.zIndex = 0;
			this.shape.style = mpstyle;
		}
	}	
}

/**
 * 生成节点元素
 * 并生成基础子控件,包括图形，边界，拖放标识和连线等
 *
 * @method create
 * @for jmCell
 * @private
 */
jmCell.prototype.create = function() {
	this.connects = new jmUtils.list();
	var w = this.width();
	var h = this.height();
	this.center = {x:w / 2,y:h / 2};
	var borderStyle;
	if(this.style.borderStyle) {
		borderStyle = this.style.borderStyle;
	}
	else {
		borderStyle = {
					stroke:this.style.borderStroke || this.editor.defaultStyle.cellBorder.stroke,
					//fill:'transparent',
					//大小改变拖放边框样式
					rectStroke:this.style.borderStroke || this.editor.defaultStyle.cellBorder.stroke,
					close:true
				};
	}
	this.rect = this.graph.createShape('resize',{
				width:w,
				height:h,
				movable:false,
				resizable:this.resizable,
				style:borderStyle});

	this.rect.visible = false;
	var shape = this.option.shape || this.style.shape;
	if(shape) {	
		var params = jmUtils.extend({
			style:this.style,
			width:'94%',
			height:'94%',
			center:this.center,
			position:{x:'3%',y:'3%'}
		},this.option);
		this.shape = this.graph.createShape(shape,params);		
	}

	if(this.connectable) {
		//创建连线拉动点
		var centerArcSzie = 8;
		var bg = this.graph.createRadialGradient(centerArcSzie / 2,centerArcSzie / 2,0,centerArcSzie / 2,centerArcSzie / 2,centerArcSzie);
			bg.addStop(0,'#00FF00');
			bg.addStop(1,'#059505');		
		//连接拖动圆点
		this.connArc = this.graph.createShape('arc',{
			center:{x:'50%',y:'50%'},			
			width:centerArcSzie,
			height:centerArcSzie,
			radius:centerArcSzie,
			style:{
				fill:bg,
				close:true,
				zIndex:200
			}});
		this.connArc.visible = false;	
		//带箭头的连线，用来拖动连接对象
		this.connectLine = this.graph.createShape('arrawline',{
			start:this.center,
			end:this.connArc.center(),
			offsetX: 6,
			offsetY: 12,
			style:this.editor.defaultStyle.dragLine
		});

		this.connectLine.visible = false;	
		this.children.add(this.connectLine);
	}
	
	//当前节点字符串为示控件
	this.label = this.graph.createShape('label',{
		style:this.fontStyle,
		width:'100%',
		height:'100%',
		value : this.value()
	});
	this.setStyle(this.styleName);	
}

/**
 * 添加当前元素到画布中
 *
 * @method add
 * @for jmCell
 */
jmCell.prototype.add = function() {
	this.create();
	this.children.add(this.rect);	
	this.graph.children.add(this);
	//如果可以移动
	if(this.editor.movable) {
		this.canMove(true);
	}
	
	if(this.shape) this.children.add(this.shape);	
	
	//单击选当前元素
	this.bind('mousedown',function(evt) {			
		//if(evt.button == 1) {
			//如果没有按下ctrl健，且没有被选中，则清除其它选中
			if(!evt.ctrlKey && !this.selected) {
				this.editor.selectAll(false,this.id);
			}				
			//选择当前节点		
			if(!this.selected) this.select(true);
			evt.cancel = true;
		//}
	});
	
	//当有连线拉到当前元素上时，连接这二个元素
		this.bind('mouseup',function(evt) {
			var from = this.editor.connectFrom;
			if(from) {
				if(from != this) {
					//连接二个节点
					if(from.connect(this) !== false)
					{
						this.editor.save();//保存状态
					}
				}			
				this.editor.connectFrom = null;
				//return false;
			}			
		});

	if(this.connectable) {		
		this.bind('mousemove',function() {
			this.connArc.visible = true;	
			this.graph.refresh();			
		});
		this.bind('mouseleave',function() {		
			if(this.editor.connectFrom != this) {
				this.connArc.visible = false;
				this.graph.refresh();
			}		
		});
		
		this.children.add(this.connArc);	
		this.connArc.canMove(true);
		//开始移动连线
		this.connArc.on('movestart',function(args) {
			var _this = self;
			_this.editor.connectFrom = _this;
			_this.connectLine.visible = true;
		});
		//结束移动时归位
		this.connArc.on('moveend',function(args) {
			var _this = self;
			var arccenter = _this.connArc.center();
			arccenter.x = '50%';
			arccenter.y = '50%';
			_this.editor.connectFrom = null;
			_this.connectLine.visible = false;
			_this.connArc.visible = false;
			_this.graph.refresh();
		});
	}

	//如果当前节点被移动，则重新定位子元素
	this.on('move',function(args) {
		this.initPosition();//重新定位
		//this.moved = true;//标识已被移动
	});

	this.children.add(this.label);	
	this.resize();

	//监听大小改变
	var self = this;
	this.rect.on('resize',function(px,py,dx,dy) {
		var _this = self;
		_this.position().x += px;
		_this.position().y += py;
		var w = _this.width() + dx;
		var h = _this.height() + dy;
		_this.width(w);
		_this.height(h);
		_this.resize();
	});
}

/**
* 设置一个标识
* 例如用来做状态标识等
*
* @method setOverlay
* @param {string} src 图片地址
* @param {number} w 图片宽
* @param {nubmer} h 图片高度
* @param {string} tooltip 标识信息描述
*/
jmCell.prototype.setOverlay = function(src,w,h,tooltip) {
	if(!this.overlay) {
		/*this.overlay = this.graph.createShape('img',
			{style:this.style,position:{x:this.width(),y:this.height()},image:src,width:0});
		this.children.add(this.overlay);*/

		this.overlay = document.createElement('img');
		this.overlay.style.position = 'absolute';
		var bounds = this.getAbsoluteBounds();
		var top = bounds.bottom;
		var left = bounds.right;

		if(this.style && this.style.overlay && this.style.overlay.margin) {
			if(this.style.overlay.margin.left) {
				left += this.style.overlay.margin.left;				
			}
			if(this.style.overlay.margin.top) {
				top += this.style.overlay.margin.top;
			}
		}

		this.overlay.style.top = top + 'px';
		this.overlay.style.left = left + 'px';
		this.overlay.style.border = '0';
		this.editor.container.appendChild(this.overlay);
	}
	if(src) {
		this.overlay.src = src;
		this.overlay.width = w;
		this.overlay.height = h;
		this.overlay.title = tooltip;
		/*this.overlay.width(w);
		this.overlay.height(h);		
		this.overlay.image(src).title = tooltip;
		this.overlay.visible = true;*/
	}
	else {
		this.overlay.visible = false;
	}
	return this.overlay;
}

/**
 * 大小改变事件
 * 重置各元素大小和位置
 *
 * @method resize
 * @for jmCell
 * @private
 */
jmCell.prototype.resize = function() {
	var w = this.width();
	var h = this.height();	

	var center = this.center;
	//如果设有padding
	//则计算大小减去padding大小
	if(this.style.padding) {
		w = w - (this.style.padding.left || 0) - (this.style.padding.right || 0);
		h = h - (this.style.padding.top || 0) - (this.style.padding.bottom || 0);
		center.x = w/2 + (this.style.padding.left || 0);
		center.y = h/2 + (this.style.padding.top || 0);
	}
	else {
		center.x = w / 2;
		center.y = h / 2;
	}
	if(this.connArc) {
		this.connArc.center().x = center.x;
		this.connArc.center().y = center.y;
	}
	this.initPosition();
}

/**
 * 重新初始化各位置
 * 
 * @method initPosition
 * @for jmCell
 * @private
 */
jmCell.prototype.initPosition = function() {

	var p = this.position();
	//定义四个线路口
	if(!this.pos1) this.pos1 = {};
	this.pos1.x = p.x;
	this.pos1.y = p.y + this.height() / 2;

	if(!this.pos2) this.pos2 = {};
	this.pos2.x = p.x + this.width() / 2;
	this.pos2.y = p.y;

	if(!this.pos3) this.pos3 = {};
	this.pos3.x = p.x + this.width();
	this.pos3.y = this.pos1.y;

	if(!this.pos4) this.pos4 = {};
	this.pos4.x = this.pos2.x;
	this.pos4.y = p.y + this.height();

	this.rect.width(this.width());
	this.rect.height(this.height());
	
	//如果已设定标识信息，则定位
	if(this.overlay) {
		if(this.overlay.tagName == 'IMG') {
			var bounds = this.getAbsoluteBounds();
			var top = bounds.bottom;
			var left = bounds.right;

			if(this.style && this.style.overlay && this.style.overlay.margin) {
				if(this.style.overlay.margin.left) {
					left += this.style.overlay.margin.left;				
				}
				if(this.style.overlay.margin.top) {
					top += this.style.overlay.margin.top;
				}
			}

			this.overlay.style.top = top + 'px';
			this.overlay.style.left = left + 'px';		
		}
		else {
			var op = this.overlay.position();
			op.x = this.width();
			op.y = this.height();
		}
	}
}

/**
 * 选择当前节点
 *
 * @method select
 * @for jmCell
 * @param {boolean} b 选择或消选当前元素
 * @param {boolean} [raiseEvent=true] 是否触发选择事件
 * @return {boolean} 是否被选择
 */
jmCell.prototype.select = function(b,raiseEvent) {
	var changed = false;//是否改变了选择状态
	if(b === false && this.selected === true) {
		//this.rect.style.stroke = 'transparent';	
		this.rect.visible = false;	
		this.selected = false;	
		changed = true;	
	}
	else if(b === true && !this.selected) {
		this.selected = true;	
		this.rect.visible = true;	
		changed = true;		
	}
	if(changed) {		
		this.graph.refresh();
		//触发选择事件
		if(raiseEvent !== false) {
			this.emit('select',this.selected);
		}		
	}	
}

/**
 * 连接到目标节点
 * 
 * @method connect
 * @for jmCell
 * @param {jmCell} to 要连接到的元素
 * @param {number} id 指定当前连线的id
 * @param {string} [value] 当前连线显示的字符值
 */
jmCell.prototype.connect = function(to,id,value) {
	//查找相同的连线，如果存在则不重连
	var line  = this.connects.get(function(l) {
		return (l.from == this && l.to == to);
	});
	if(!line) {
		//检查元素是否可连接
		if(this.editor.validConnect && !this.editor.validConnect(this,to)) {
			return false;
		}

		id = id || this.editor.maxId();
		line = this.graph.createShape('cellConnectLine',{
			id:id,
			from:this,
			to:to,
			style:jmUtils.clone(this.style.connectLine),
			editor:this.editor
		});	
		
		this.connects.add(line);
		to.connects.add(line);
		line.value(value);
		this.graph.children.add(line);
		this.editor.connects.add(line);//记录到编辑器中

		//连线鼠标进入控件
		line.bind('mouseover',function() {	
			if(!this.selected)	 {
				var overstroke = this.style && this.style.overStroke?this.style.overStroke:jmEditorDefaultStyle.connectLine.overStroke;
				this.style.stroke = overstroke;
				this.style.zIndex = 2000;
				this.graph.refresh();
			}			
		});
		//连线鼠标离开控件
		line.bind('mouseleave',function() {
			if(!this.selected) {
				var stroke = this.style && this.style.normalStroke?this.style.normalStroke:jmEditorDefaultStyle.connectLine.stroke;
				this.style.stroke = stroke;
				this.style.zIndex = 1;
				this.graph.refresh();
			}			
		});
		//当按下鼠标时选择当前线
		line.bind('mousedown',function(evt) {
			var b = this.selected;	
			if(!evt.ctrlKey && !this.selected) {
				this.editor.selectAll(false,this.id);
			}
			
			this.select(!b);			
			return false;
		});
	}
}

/**
 * 返回或设置当前元素的值 
 *
 * @method value
 * @for jmCell
 * @param {string} [v] 元素显示的值
 * @return {string} 当前的值
 */
jmCell.prototype.value = function(v) {
	if(typeof v !== 'undefined') {
		if(this.label) {
			this.label.value = v;
		}
		return this.setValue('value',v);
	}
	return this.getValue('value');
}

/**
 * 设定或获取中心点
 * 
 * @method center
 * @for jmHArc
 * @param {point} p 中心点坐标
 * @return {point} 当前中心点坐标
 */
jmCell.prototype.center = function(p) {
	return this.setValue('center',p);
}

/**
 * 从编辑器中移除当前节点
 *
 * @method remove
 * @for jmCell
 */
jmCell.prototype.remove = function(r) {
	if(r) return;
	if(this.editor) {
		this.editor.cells.remove(this);	
		this.graph.children.remove(this);	
		if(this.overlay && this.overlay.parentElement) {
			this.overlay.parentElement.removeChild(this.overlay);
		}
	}
	//并移除它的连线
	this.connects.each(function(i,c) {
		c.remove();	
	},true);
}



/**
 * 二元素之间的连线,继承自jmPath
 * 连线参数:from=起始元素，to=目标元素,value=连线值
 *
 * @class jmConnectLine
 * @for jmEditor
 * @module jmEditor
 * @param {jmGraph} graph 当前画布
 * @param {object} params 连线参数
 */

function jmConnectLine(graph,params) {
	this.graph = graph;
	this.editor = params.editor;
	this.id = params.id;
	this.from = params.from;
	this.to = params.to;
	this.selected = false;
	this.points = params.points || [];
	var style = params.style || {
						stroke:this.editor.defaultStyle.connectLine.stroke,
						lineWidth:this.editor.defaultStyle.connectLine.lineWidth,
						zIndex :1
					};
	this.type = "jmConnectLine";
	//style.fill = 'transparent';
	style.close = false;
	this.initializing(graph.context,style);

	params = jmUtils.extend({
				start:params.from.outPos2,
				end:params.to.inPos					
				},params);
	
	var arrawstyle = jmUtils.clone(params.style);
	arrawstyle.fill = style.stroke;
	params.style = arrawstyle;
	this.arraw = graph.createShape('arraw',params);	
	this.children.add(this.arraw);

	var fontstyle = this.style.fontStyle || this.editor.defaultStyle.font;
	this.label = this.graph.createShape('label',{style:fontstyle});
	//当连线建立时，同时加入标签
	this.on('add',function(obj) {
		obj.children.add(obj.label);
	});
	this.on('beginDraw',function(obj) {
		var bounds = obj.bounds;
		obj.label.width(bounds.width);
		obj.label.height(bounds.height);
	});

	/**
	 * 当前是否为选中状态
	 *
	 * @property selected
	 * @for jmConnectLine
	 */
	this.selected = false;
}

jmUtils.extend(jmConnectLine,jmPath);

/**
 * 初始化图形点,通过元素出口和入口计算最佳连线路径
 *
 * @method initPoints 
 * @for jmConnectLine
 * @return {array} 所有描点集合
 */
jmConnectLine.prototype.initPoints = function() {	
	var start = this.from.pos4;
	var end = this.to.pos2;
	var toposition = this.to.position();
	var frompostion = this.from.position();
	//节点在目标节点左边
	if(frompostion.x + this.from.width() < toposition.x) {
		start = this.from.pos3;
		var offy = toposition.y - frompostion.y - this.from.height();
		//节点在目标节点上边
		if(offy > 0) {
			if(offy > 30) {
				start = this.from.pos4;
			}
			else {
				start = this.from.pos3;
			}
			end = this.to.pos2;
		}
		//目标节点在起始节点上边
		else if(frompostion.y > toposition.y + this.to.height()) {
			end = this.to.pos4;
		}
		else {
			end = this.to.pos1;
		}		
	}
	//如果起始在结束右边
	else if(frompostion.x > toposition.x + this.to.width()) {	
		start = this.from.pos1;	
		var offy = toposition.y - frompostion.y - this.from.height();
		if(offy > 0) {
			if(offy > 30) {
				start = this.from.pos4;
			}
			else {
				start = this.from.pos1;
			}
			end = this.to.pos2;
		}
		else if(frompostion.y > toposition.y + this.to.height()) {			
			end = this.to.pos4;
		}
		else {
			end = this.to.pos3;
		}	
		
	}
	else if(frompostion.y > toposition.y + this.to.height()) {
		start = this.from.pos1;
		end = this.to.pos1;
	}
	
	this.points =this.getPoints(start,end);
	return this.points;
}

/**
 * 给定开始点与结束点，计算连线路径
 *
 * @method getPoints
 * @for jmConnectLine
 * @private
 */
jmConnectLine.prototype.getPoints = function(start,end) {
	//获取二点的方位，1=left,2=top,3=right,=bottom	
	function getDirection(s,e) {
		if(s.x == e.x) {
			return s.y > e.y?4:2;//垂直方向
		}
		if(s.y == e.y) {
			return s.x > e.x?3:1;//水平方向
		}
		if(s.x > e.x) {
			return s.y > e.y?3412:3214;//起始点x,y都大于结束点则为左上右下
		}
		else {
			return s.y > e.y?1432:1234;//起始点X小于结束点，Y大于结束点则为右下右上
		}
	}	
	var xOffset = 30;
	var yOffset = 30;
	var points = [start];
	if(start == this.from.pos1) {
		switch (end) {
			case this.to.pos1 : {
				var p1x = Math.min(start.x - xOffset,end.x - xOffset);
				var p1 = {x:p1x,y:start.y};
				points.push(p1);
				var p2 = {x:p1x,y:end.y};
				points.push(p2);
				break;
			}
			case this.to.pos2 : {	
				var p1 = {x:end.x,y:start.y};
				points.push(p1);			
				break;
			}
			case this.to.pos3 : {
				var p1 = {x:(start.x - end.x)/2 + end.x,y:start.y};
				points.push(p1);
				var p2 = {x:p1.x,y:end.y};
				points.push(p2);
				break;
			}
			case this.to.pos4 : {
				var p1 = {x:end.x,y:start.y};
				points.push(p1);
				break;
			}
		}
	}
	else if(start == this.from.pos2) {
		switch (end) {
			case this.to.pos1 : {				
				var p1 = {x:start.x,y:end.y};
				points.push(p1);
				break;
			}
			case this.to.pos2 : {	
				var p1 = {x:start.x,y:Math.min(start.y - yOffset,end.y - yOffset)};
				points.push(p1);			
				break;
			}
			case this.to.pos3 : {
				var p1 = {x:start.x,y:end.y};
				points.push(p1);
				break;
			}
			case this.to.pos4 : {
				var p1 = {x:start.x,y:(start.y - end.y) / 2 + end.y};
				points.push(p1);
				var p2 = {x:end.x,y:p1.y};
				points.push(p2);
				break;
			}
		}
	}
	else if(start == this.from.pos3) {
		switch (end) {
			case this.to.pos1 : {				
				var p1 = {x:(end.x - start.x) / 2 + start.x,y:start.y};
				points.push(p1);
				var p2 = {x:p1.x,y:end.y};
				points.push(p2);
				break;
			}
			case this.to.pos2 : {	
				var p1 = {x:end.x,y:start.y};
				points.push(p1);			
				break;
			}
			case this.to.pos3 : {
				var p1 = {x:Math.max(start.x + xOffset,end.x + xOffset),y:start.y};
				points.push(p1);
				var p2 = {x:p1.x,y:end.y};
				points.push(p2);
				break;
			}
			case this.to.pos4 : {
				var p1 = {x:end.x,y:start.y};
				points.push(p1);
				break;
			}
		}
	}
	else if(start == this.from.pos4) {
		switch (end) {
			case this.to.pos1 : {				
				var p1 = {x:start.x,y:end.y};
				points.push(p1);		
				break;
			}
			case this.to.pos2 : {	
				var p1 = {x:start.x,y:Math.max((end.y - start.y) / 2 + start.y,end.y - yOffset)};
				points.push(p1);	
				var p2 = {x:end.x,y:p1.y};
				points.push(p2);	
				break;
			}
			case this.to.pos3 : {
				var p1 = {x:start.x,y:end.y};
				points.push(p1);
				break;
			}
			case this.to.pos4 : {
				var p1 = {x:start.x,y:Math.max(start.y + xOffset,end.y + xOffset)};
				points.push(p1);
				var p2 = {x:end.x,y:p1.y};
				points.push(p2);
				break;
			}
		}
	}
	points.push(end);

	var from = jmUtils.clone(points[points.length - 2]);
	var to = jmUtils.clone(end);
	var minx;
	var miny;
	for(var i=0;i<points.length;i++) {
		var p = points[i];
		minx = Math.min(minx || p.x,p.x);
		miny = Math.min(miny || p.y,p.y);
	}
	from.x -= minx;
	to.x -= minx;
	from.y -= miny;
	to.y -= miny;
	this.arraw.start(from);    
    this.arraw.end(to);
    this.arraw.style.stroke = this.arraw.style.fill = this.style.stroke;
    //实心箭头
	//points = points.concat(this.arraw.initPoints(false));
	return points;
}

/**
 * 选择当前连线
 *
 * @method value
 * @for jmConnectLine
 * @return {string} 当前连线的值
 */
jmConnectLine.prototype.select = function(b) {
	if(typeof b !== 'undefined') {
		var changed = false;
		if(b && this.selected == false) {
			this.style.stroke = this.style && this.style.selectedStroke?this.style.selectedStroke:this.editor.defaultStyle.connectLine.overStroke;
			this.style.zIndex = 10;
			this.selected = true;
			changed = true;
		}		
		else if(this.selected == true) {
			this.style.stroke = this.style && this.style.normalStroke?this.style.normalStroke:this.editor.defaultStyle.connectLine.stroke;
			this.style.zIndex = 1;
			this.selected = false;
			changed = true;
		}
		if(changed) {
			this.editor.emit('select',this,b);
			this.graph.refresh();
		}
		
	}
}

/**
 * 当前连线标签值
 *
 * @method value
 * @for jmConnectLine
 * @return {string} 当前连线的值
 */
jmConnectLine.prototype.value = function(v) {
	if(typeof v !== 'undefined') this.label.value = v;
	return this.label.value;
}

/**
 * 移除当前连线
 *
 * @method remove
 * @for jmConnectLine
 */
jmConnectLine.prototype.remove = function(r) {
	if(r) return;
	//从起始元素中移除
	if(this.from) {
		this.from.connects.remove(this);
	}
	//从目标元素中移除
	if(this.to) {
		this.to.connects.remove(this);
	}
	if(this.editor) {
		this.editor.connects.remove(this);
	}
	//从编辑器中移除
	this.graph.children.remove(this);
}
/**
 * jm流程图编辑器
 * 继承jmProperty
 * option参数:connectable=是否可连线，enabled=是否可编辑
 *
 * @class jmEditor
 * @module jmEditor
 * @param {object} option 流程图参数
 */

function jmEditor(option) {
	this.option = option;

	/**
	 * 当前画布所有节点元素
	 *
	 * @property cells
	 * @type list
	 * @for jmEditor
	 */
	this.cells = new jmUtils.list();

	/**
	 * 当前画布所有连线集合
	 *
	 * @property connects
	 * @type list
	 * @for jmEditor
	 */
	this.connects = new jmUtils.list();

	/**
	 * 当前所有样式集合
	 *
	 * @property styles
	 * @type object
	 * @for jmEditor
	 */
	this.styles = {};

	/**
	 * 当前类型标识
	 *
	 * @property type
	 * @type string
	 * @for jmEditor
	 */
	this.type = 'jmEditor';
	//是否可编辑
	if(typeof option.enabled === 'undefined') option.enabled = true;
	this.isEnabled(option.enabled);
	/**
	 * 是否可连线
	 *
	 * @property connectable
	 * @type boolean
	 * @for jmEditor
	 */
	this.connectable = option.connectable === false?false:true;
	/**
	 * 是否移动节点
	 *
	 * @property movable
	 * @type boolean
	 * @for jmEditor
	 */
	this.movable = option.movable === false?false:true;

	if(option.container) {
		if(typeof option.container === 'string') {
			option.container = document.getElementById(option.container);
		} 

		if(option.container.tagName != 'CANVAS') {
			this.container = document.createElement('div');
			this.container.style.position = 'relative';
			this.container.style.padding = '0';
			this.container.style.margin = '0';
			this.container.style.width = '100%';
			this.container.style.height = '100%';
			option.container.appendChild(this.container);
		}			
		else {
			this.container = option.container.parentElement;
			canvas = option.container;
		}

		this.graph = new jmGraph(this.container,option.width,option.height);			

		//生成框选对象
		this.selectRect = this.graph.createShape('rect',{style:this.defaultStyle.selectRect});	
		this.selectRect.visible = false;
		this.graph.children.add(this.selectRect);		
		this.graph.registerShape('cellConnectLine',jmConnectLine);		
		this.initEvents();//绑定基础事件
	}
}
jmUtils.extend(jmEditor,jmProperty);//继承属性绑定

/**
 * 编辑器默认样式
 *
 * @property defaultStyle		 
 * @module jmEditor
 * @for jmEditor
 */
jmEditor.prototype.defaultStyle = {
	/**
	 * 拖放连线的样式
	 *
	 * @property dragLine
	 * @type object
	 */
	dragLine : {
		stroke:'rgb(59,111,41)',
			lineWidth:1,
			lineType: "dotted",
			dashLength :6,
			zIndex:10000
	},
	/**
	 * 单元边框样式
	 *
	 * @property cellBorder
	 * @type object
	 */
	cellBorder : {
		stroke : 'rgb(0,255,0)'
	},
	/**
	 * 连线样式
	 *
	 * @property connectLine
	 * @type object
	 */
	connectLine : {
		stroke : 'rgb(59,255,41)',
		overStroke : 'red' ,
		lineWidth : 2
	},
	/**
	 * 编辑器字符样式
	 *
	 * @property font
	 * @type object
	 */
	font : {
		textAlign : 'center',
		'textBaseline' : 'middle',
		fill : "blue",
		font : '20px Arial',
		border : null
	},
	/**
	 * 选择元素边框样式
	 *
	 * @property selectRect
	 * @type object
	 */
	selectRect : {
		stroke : 'rgb(0,255,0)',
		lineWidth:1,
		zIndex : 10000
	}
};

/**
 * 编辑器的右健菜单
 * 可直接对返回的对象执行操作
 *
 * @method menus
 * @for jmEditor
 * @return {object} 菜单主体对象
 */
jmEditor.prototype.menus = function() {
	if(!this.menuBody) {
		var menu = this.menuBody = {};
		this.menuBody.panel = document.createElement('div');
		this.menuBody.panel.style.display = 'none';
		this.menuBody.panel.className = 'editor-menu';
		this.menuBody.container = document.createElement('ul'); 
		this.menuBody.panel.appendChild(this.menuBody.container);
		document.body.appendChild(this.menuBody.panel);

		/**
		 * 显示当前菜单
		 *
		 * @method show
		 * @for menus
		 * @param {nubmer} [x] 菜单显示位置的X坐标
		 * @param {nubmer} [y] 菜单显示位置的Y坐标
		 * @return {object} 当前菜单对象 
		 */
		this.menuBody.show = function(x,y) {
			this.panel.style.display = 'inline';
			this.panel.style.position = 'absolute';
			//如果指定了位置
			if(x && y) {
				this.panel.style['top'] = (y + 1) + 'px';
				this.panel.style['left'] = (x + 1)+ 'px';
			}
			else {
				var p = jmUtils.getEventPosition(event);
				this.panel.style['top'] = (p.pageY + 1) + 'px';
				this.panel.style['left'] = (p.pageX + 1) + 'px';
			}
			return this;
		};
		/**
		 * 向菜单中添加项
		 *
		 * @method add
		 * @for menus
		 * @param {element/string} item 菜单项，可以是字符串或html元素
		 * @param {function} click 当前菜单项单击事件委托
		 */
		this.menuBody.add = function(item,click) {
			var mitem = document.createElement('li');
			if(typeof item === 'string') {
				mitem.innerHTML = item;
			}
			else {
				mitem.appendChild(item);
			}
			mitem.onmouseup = function() {
				if(click) {
					click.call(this);
				}
				menu.hide();
			};
			this.container.appendChild(mitem);
			return this;
		};
		this.menuBody.hide = function() {
			this.panel.style.display = 'none';
			return this;
		};
		this.graph.bind('mousedown',function(evt) {
			menu.hide();
		});
	}
	this.menuBody.container.innerHTML = '';
	return this.menuBody;
}

/**
 * 添加元素节点,并监听其选择事件
 *
 * @method addCell
 * @for jmEditor
 * @param {object} option 元素参数，主要为jmcell的参数
 */
jmEditor.prototype.addCell = function(option) {
	option = option || {};
	option.graph = this.graph;
	option.editor = this;
	if(!this.isEnabled() || this.option.resizable === false) {
		option.resizable = false;
	}	
	var cell = new jmCell(option);
	//如果已设定校验节点，则需通过校验才可添加
	if(this.validCell && !this.validCell(cell)) {
		return;
	}
	var self = this;
	//监控对象选择事件
	cell.on('select',function(s) {
		self.emit('select',this,s);
	});
	//监听移动事件,如果移动且当前选择了其它节点，则一同移动
	cell.on('move',function(s) {
		var _this = self;
		//如果事件传递则处理所有已选节点位置
		if(s.trans === true) {			
			var cells = _this.getSelectedCells();
			for(var i = 0; i < cells.length; i++) {
				if(cells[i] != this) {
					cells[i].offset(s.offsetX,s.offsetY,false);//移动但不传递 事件
				}			
			}	
		}
		_this.resize(this);			
	});
	
	cell.id = option.id || this.maxId();
	this.cells.add(cell);
	cell.add();
	this.resize(cell);
	return cell;
}

/**
 * 获取当前流程中最大ID, 并自加1
 *
 * @method maxId
 * @for jmEditor
 * @return {integer} 当前编辑器中的最大ID加1
 */
jmEditor.prototype.maxId = function() {
	var id = 0;
	this.cells.each(function(i,cell) {
		id = Math.max(cell.id,id);
	});
	this.connects.each(function(i,cn) {
		id = Math.max(cn.id,id);
	});
	return id + 1;
}

/**
 * 当前是否可编辑
 *
 * @method isEnabled
 * @for jmEditor
 * @return {boolean} 当前编辑器可否编辑
 */
jmEditor.prototype.isEnabled = function(b) {
	if(typeof b !== 'undefined') {
		this.__enabled = b;
	}
	return this.__enabled;
}

/**
 * 初始化编辑器的基础事件
 *
 * @method initEvents
 * @for jmEditor
 * @private
 */
jmEditor.prototype.initEvents = function() {
	var self = this;
	//编辑器开始框选
	this.graph.bind('mousedown',function(evt) {
		var _this = self;		
		if(evt.button == 0 || evt.button == 1) {
			_this.selectAll(false);
			_this.selecting = true;//开始框选
			_this.selectRect.position({x:evt.position.offsetX,y:evt.position.offsetY});
			_this.selectRect.width(1);
			_this.selectRect.height(1);
			_this.selectRect.visible = true;
			return false;
		}		
	});
	//编辑器框选中
	this.graph.bind('mousemove',function(evt) {
		var _this = self;
		if(_this.selecting) {
			//改变框选控件大小
			var p = _this.selectRect.position();
			var w = evt.position.offsetX - p.x;
			var h = evt.position.offsetY - p.y;
			_this.selectRect.width(w);
			_this.selectRect.height(h);
			_this.graph.refresh();
			return false;
		}
	});

	//鼠标移动事件，
	//有拖出组件时，移动组件
	jmUtils.bindEvent(document,'mousemove',function(evt) {
		var _this = self;
		if(_this.currentComponent) {
			evt = evt || event;
			var evtpos = jmUtils.getEventPosition(evt || event);
			var dx = evtpos.pageX - _this.currentComponent.evtX;
			var dy = evtpos.pageY - _this.currentComponent.evtY;
			
			_this.currentComponent.left += dx;
			_this.currentComponent.top += dy;
			_this.currentComponent.img.style.left = _this.currentComponent.left + 'px';
			_this.currentComponent.img.style.top = _this.currentComponent.top + 'px';
			_this.currentComponent.evtX = evtpos.pageX;
			_this.currentComponent.evtY = evtpos.pageY;	
			return false;		
		}		
	});
	//松开鼠标
	//当有组件时，定位组件
	jmUtils.bindEvent(document,'mouseup',function(evt) {
		var _this = self;
		//当有拖放组件时，生成组件元素
		if(_this.currentComponent) {
			evt = evt || event;
			var pos = jmUtils.getElementPosition(_this.graph.canvas);
			var evtpos = jmUtils.getEventPosition(evt);
			if(evtpos.pageX >= pos.left && evtpos.pageX <= pos.left + _this.graph.canvas.width &&
				evtpos.pageY >= pos.top && evtpos.pageY <= pos.top + _this.graph.canvas.height) {
				var componentindex = _this.currentComponent.img.getAttribute('data-component');
				var option = _this.components[componentindex];
				//中心定位到当前鼠标位置				
				var left = evtpos.pageX - pos.left;
				var top = evtpos.pageY - pos.top;
				if(option.width) {
					left -= option.width / 2;
				}
				if(option.height) {
					top -= option.height / 2;
				}
				if(typeof option === 'function') {
					option.call(_this,{x:left,y:top});
				}
				else {
					option = jmUtils.clone(option);				
					option.position = {x:left,y:top};
					_this.addCell(option);
				}				
				_this.save();//当手动添加元素时。保存缓存
				_this.graph.refresh();
			}			
			document.body.removeChild(_this.currentComponent.img);
			_this.currentComponent = null;
			return false;
		}	

		//如果正在框选则结束处理
		if(_this.selecting) {
			_this.selectRect.visible = false;
			_this.selecting = false;
			//计算选框的对角线位置
			var p = _this.selectRect.position();
			var endp = {x:p.x + _this.selectRect.width(),y:p.y + _this.selectRect.height()};
			_this.cells.each(function(i,cell) {
				var cp = cell.position?cell.position():(cell.center?cell.center():{x:0,y:0});
				//如果节点的中心或位置点在框内。则选中
				if(cp.x >= Math.min(p.x,endp.x) && cp.x <= Math.max(p.x,endp.x) &&
					cp.y >= Math.min(p.y,endp.y) && cp.y <= Math.max(p.y,endp.y)) {
					cell.select(true);
				}
			});
			_this.graph.refresh();
		}	
	});

	/**
	 * 绑定当前编辑器按健事件
	 */
	this.graph.bind('keydown',function(evt) {
		var code = evt.keyCode;	
		var _this = self;	
		switch(code) {
			case 46: {//按下delete健
				if(_this.isEnabled()) {
					var changed = false;
					var cells = _this.getSelectedCells();
					if(cells && cells.length > 0) {
						_this.remove(cells);
						changed = true;							
					}	
					//删除选择的连线				
					_this.connects.each(function(i,conn) {
						if(conn.selected) {
							conn.remove();
							changed = true;
						}
					},true);			
					if(changed) {
						_this.graph.refresh();
						_this.save();	
						return false;
					}
				}				
				break;
			}
			case 97:
			case 65: {
			//按下A健//如果同时按下了ctrl健，则全选
				if(evt.ctrlKey) {
					_this.selectAll(true);
					_this.emit('select',_this,true);
					return false;
				}
				break;
			}
			case 37: { // 向左
				if(_this.movable) {
					var cells = _this.getSelectedCells();
					_this.moveCells(cells,-1,0);
					return false;
				}				
				break;
			}
			case 38: { //向上
				if(_this.movable) {
					var cells = _this.getSelectedCells();
					_this.moveCells(cells,0,-1);
					return false;
				}
				break;
			}
			case 39: { //向右
				if(_this.movable) {
					var cells = _this.getSelectedCells();
					_this.moveCells(cells,1,0);
					return false;
				}
				break;
			}
			case 40: { //向下
				if(_this.movable) {
					var cells = _this.getSelectedCells();
					_this.moveCells(cells,0,1);
					return false;
				}
				break;
			}
		}		
	});
}

/**
 * 选择所有元素
 * 
 * @method selectAll
 * @for jmEditor
 * @param {boolean} true=选择所有元素，false=取消所有元素的选择
 * @param {integer} 选择或消选所排除的id
 */
jmEditor.prototype.selectAll = function(b,exid) {
	this.cells.each(function(i,cell) {
		//如果为排除元素则不改变它的状态
		if(exid && cell.id == exid) return;
		cell.select(b);
	});
	//所有连线处理
	this.connects.each(function(i,conn) {
		conn.select(b == true);
	});
}

/**
 * 通过id获取元素
 *
 * @method getCell
 * @for jmEditor
 * @param {integer} id 需要获取的元素id
 * @return {jmCell} 元素对象
 */
jmEditor.prototype.getCell = function(id) {
	return this.cells.get(function(c) {
		return c.id == id;
	});
}

/**
 * 获取所有元素的数组
 *
 * @method getCells
 * @for jmEditor
 */
jmEditor.prototype.getCells = function() {
	return this.cells.items;
}

/**
 * 获取当前已选中的节点
 *
 * @method getSelectedCells
 * @for jmEditor
 * @return {array} 所有已选择的元素数组 
 */
jmEditor.prototype.getSelectedCells = function() {
	var cells = [];
	this.cells.each(function(i,c) {
		if(c.selected) {
			cells.push(c);
		}
	});
	return cells;
}

/**
 * 获取当前已选中的连线
 *
 * @method getSelectedConnects
 * @for jmEditor
 * @return {array} 所有已选择的元素数组 
 */
jmEditor.prototype.getSelectedConnects = function() {
	var lines = [];
	this.connects.each(function(i,c) {
		if(c.selected) {
			lines.push(c);
		}
	});
	return lines;
}

/**
* 移动指定的节点
*
* @method moveCells
* @param {array} cells 需要移动的节点数组
* @param {number} dx 移动的X偏移量
* @param {number} dy 移动的Y偏移量
*/
jmEditor.prototype.moveCells = function(cells,dx,dy) {
	if(jmUtils.isArray(cells)) {
		for(var i = cells.length - 1;i >= 0;i--) {
			cells[i].offset(dx,dy);
		}	
	}
	else if(cells) {
		cells.offset(dx,dy);
	}
	this.graph.refresh();
}

/**
 * 移除元素
 *
 * @method remove
 * @for jmEditor
 * @param {array/jmCell} 需要移除的元素集合或指定的某个元素
 */
jmEditor.prototype.remove = function(cells) {	
	if(jmUtils.isArray(cells)) {
		for(var i = cells.length - 1;i >= 0;i--) {
			cells[i].remove();
		}	
	}
	else if(cells) {
		cells.remove();
	}
	this.graph.refresh();
}

/**
 * 清除所有画布上的对象
 *
 * @method clear
 * @for jmEditor
 */
jmEditor.prototype.clear = function() {	
	this.remove(this.cells.items);
}

/**
 * 初始化组件添加对象
 *
 * @method regComponent
 * @for jmEditor
 * @param {string} el 组件小图标
 * @param {object} option 组件参数
 */
jmEditor.prototype.regComponent = function(el,option) {
	if(!this.components) this.components = [];
	this.components.push(option);
	if(typeof el === 'string') {
		var tmp = document.createElement('img');
		tmp.src = el;
		el = tmp;
	}
	el.setAttribute('data-component',this.components.length - 1);
	var self = this;
	jmUtils.bindEvent(el,'mousedown',function(evt) {
		var _this = self;
		evt = evt || event;
		var target = evt.target || evt.srcElement;
		var pos = jmUtils.getElementPosition(target);

		if(!target.getAttribute('data-component')) {
			if(target.children.length == 0) {
				target = target.parentElement;
			}
		}

		_this.currentComponent = {};
		_this.currentComponent.img = document.createElement('img');
		_this.currentComponent.img.setAttribute('data-component',target.getAttribute('data-component'));

		if(target.tagName !== 'IMG') {			
			for(var i in target.children) {
				var n = target.children[i];
				if(n.tagName === 'IMG') {
					target = n;
					break;
				}
			}
		}
		_this.currentComponent.img.src = target.src;
		_this.currentComponent.img.width = target.width;
		_this.currentComponent.img.height = target.height;
		_this.currentComponent.img.style['position'] = 'absolute';
		
		_this.currentComponent.left = pos.left;
		_this.currentComponent.top = pos.top;
		_this.currentComponent.img.style.left = pos.left + 'px';
		_this.currentComponent.img.style.top = pos.top + 'px';
		window.document.body.appendChild(_this.currentComponent.img);
		var evtpos = jmUtils.getEventPosition(evt || event);
		_this.currentComponent.evtX = evtpos.pageX;
		_this.currentComponent.evtY = evtpos.pageY;
		if ( evt && evt.preventDefault ) {
			//阻止默认浏览器动作(W3C) 
			evt.preventDefault(); 
		}		
		else {
			//IE中阻止函数器默认动作的方式 
			window.event.returnValue = false; 
		}			
		return false;
	});
	return el;
}

/**
 * 保存样式信息，可供后面直接通过样式名称设定，
 * 简单重复使用。
 *
 * @method regStyle
 * @for jmEditor
 * @param {string} name 样式指定名称
 * @param {object} style 样式对象
 */
jmEditor.prototype.regStyle = function(name,style) {
	this.styles[name] = style;
}

/**
 * 保存当前画布状态
 * 把当前画布对象转为json对象保存
 *
 * @method save
 * @for jmEditor
 */
jmEditor.prototype.save = function() {
	if(!this.isEnabled()) return;//不可编辑时，直接退出
	if(!this.caches) this.caches = [];
	//当前缓存索引不是最后一个时，表示正在做撤消或恢复操作
	//去除后面可恢复的操作，只保存当前状态前的状态和当前操作
	if(this.cacheIndex < this.caches.length - 1) {
		this.caches = this.caches.slice(0,this.cacheIndex);
	}
	//只保持10个缓存
	if(this.caches.length > 10) {
		this.caches = this.caches.slice(this.caches.length - 10);
	}
	this.caches.push(this.toJSON());
	this.cacheIndex = this.caches.length - 1;
}

/**
 * 撤消当前操作
 *
 * @method undo
 * @for jmEditor
 */
jmEditor.prototype.undo = function() {
	if(!this.isEnabled()) return;//不可编辑时，直接退出

	if(this.caches && this.caches.length > 0 && this.cacheIndex  > 0) {
		if(typeof this.cacheIndex === 'undefined') {
			this.cacheIndex = this.cacheIndex || this.caches.length - 1;
		}
		this.cacheIndex = this.cacheIndex > 0?--this.cacheIndex:0;
		var json = this.caches[this.cacheIndex];
		this.fromJSON(json,true);//撤消并不保存
	}	
}

/**
 * 恢复操作
 * 
 * @method redo
 * @for jmEditor
 */
jmEditor.prototype.redo = function() {
	if(!this.isEnabled()) return;//不可编辑时，直接退出
	//当前索引不为最后一个时方可恢复操作
	if(this.cacheIndex !== undefined && this.cacheIndex < this.caches.length - 1 && 
		this.caches && this.caches.length > 0) {
		this.cacheIndex = this.cacheIndex + 1;
		if(this.cacheIndex < this.caches.length) {
			var json = this.caches[this.cacheIndex];
			this.fromJSON(json,true);//恢复，并不保存状态
		}
	}
}

/**
 * 排列已选元素
 * @method align
 * @param {string} 排列方式,top=顶端对齐,bottom=底端对齐,middle=垂直居中,left=左对齐,right=右对齐,center=水平居中
 */
jmEditor.prototype.align = function(der) {
	var cells = this.getSelectedCells();
	if(cells.length < 2) return;
	//首先取得最顶部的元素
	var topcell;
	for(var i in cells) {
		var cell = cells[i];
		var p = cell.position();
		if(!topcell || topcell.y > p.y) {
			topcell = cell;
		}
	}
	switch(der) {
		case 'left': {
			for(var i in cells) {
				var cell = cells[i];
				if(der == 'left') {
					cell.offset(topcell.position().x - cell.position().x,0,false);
				}				
			}
			break;
		}
		case 'right':
			for(var i in cells) {
				var cell = cells[i];			
				var right = topcell.position().x + topcell.width();
				cell.offset(right - cell.width() - cell.position().x,0,false);					
			}
			break;
		case 'center': {			
			for(var i in cells) {
				var cell = cells[i];	
				var middle = topcell.position().y + topcell.height() / 2;			
				cell.offset(0,middle - cell.height() / 2 - cell.position().y,false);				
			}
			break;
		}
		case 'top': {
			for(var i in cells) {
				var cell = cells[i];				
				cell.offset(0,topcell.position().y - cell.position().y,false);				
			}
			break;
		}
		case 'bottom': {
			for(var i in cells) {
				var cell = cells[i];	
				var bottom = topcell.position().y + topcell.height();			
				cell.offset(0,bottom - cell.height() - cell.position().y,false);				
			}
			break;
		}
		case 'middle': {
			for(var i in cells) {
				var cell = cells[i];				
				var center = topcell.position().x + topcell.width() / 2;
				cell.offset(center - cell.width() / 2 - cell.position().x,0,false);				
			}			
			break;
		}
	}	
	this.save();
	this.graph.refresh();
}

/**
 * 根据最新元素重新计算画布大小
 * 如果没有指定元素，则循环所有元素计算大小
 *
 * @method resize
 * @param {jmCell} [cell] 是影响大小的元素
 */
jmEditor.prototype.resize = function(cell) {
	var maxw = 0;
	var maxh = 0;
	//取元素边界
	if(cell) {
		var p = cell.position();
		maxw = p.x + cell.width();
		maxh = p.y + cell.height();
	}
	//处理所有元素
	else {
		this.cells.each(function(i,cell) {
			var p = cell.position();
			var w = p.x + cell.width();
			var h = p.y + cell.height();
			maxw = Math.max(w,maxw);
			maxh = Math.max(h,maxh);
		});
	}
	
	if(maxw > this.graph.canvas.width || maxh > this.graph.canvas.height) {
		this.graph.redraw(Math.max(maxw,this.graph.canvas.width) + 10,Math.max(maxh,this.graph.canvas.height) + 10);
	}
}


/**
 * 对画布执行基本命令
 *
 * @method execute
 * @for jmEditor
 * @param {string} cmd 要执行的名称
 */
jmEditor.prototype.execute = function(cmd) {
	switch(cmd) {
		case 'zoomOut': {
			this.graph.zoomOut();
			break;
		}
		case 'zoomIn': {
			this.graph.zoomIn();
			break;
		}
		case 'zoomActual': {
			this.graph.zoomActual();
			break;
		}
		case 'undo': {
			this.undo();
			break;
		}
		case 'redo': {
			this.redo();
			break;
		}
	}
}

/**
 * 转为图片信息
 * 
 * @method toImage
 * @for jmEditor
 * @return {string} 当前画布的base64字符串
 */
jmEditor.prototype.toImage = function() {
	return this.graph.toDataURL();
}

/**
 * 转为json对象
 * 画布完整json描述
 * 
 * @method toJSON
 * @for jmEditor
 * @return {object} 当前描述json
 */
jmEditor.prototype.toJSON = function() {
	var json = {cells:[],toString:function() {
		return JSON.stringify(this);
	}};
	this.cells.each(function(i,cell) {		
		var c = {outs:[]};
		c.id = cell.id;
		c.position = cell.position();
		c.width = cell.width();
		c.height = cell.height();
		c.style = cell.styleName || cell.style;
		c.value = cell.value();
		if(cell.connects) {
			cell.connects.each(function(j,cn) {
				if(cn.from == cell) {
					c.outs.push(
						{
							id:cn.id,
							to:cn.to.id,
							value:cn.value(),
							from:cell.id
						});
				}
			});
		}
		json.cells.push(c);
	}) 
	return json;
}

/**
 * 从json中恢复图
 * 根据json描述恢复原图
 *
 * @method fromJSON
 * @for jmEditor
 * @param {string/object} json 描述json
 * @param {boolean} [s=false] 当前恢复是否记录状态 true表示记录，false不记录
 */
jmEditor.prototype.fromJSON = function(json,s) {
	if(!json) return;
	if(typeof json === 'string') {
		json = JSON.parse(json);
	}
	this.clear();
	if(json.cells) {
		//从源中生成流程图的节点
		for(var i in json.cells) {
			var cell = json.cells[i];
			this.addCell(cell);			
		}
		//循环所有节点，连接彼此的连线
		for(var i in json.cells) {
			var cell = json.cells[i];
			if(cell.outs) {
				//获取连接起始节点
				var cur = this.getCell(cell.id);
				if(!cur) continue;
				for(var j in cell.outs) {
					var o = cell.outs[j];
					if(o.to) {
						//获取目标节点对象
						var target = this.getCell(o.to);
						if(target) {
							cur.connect(target,o.id,o.value);//连接
						}
					}
				}
			}	
		}
		this.resize();//重置大小
		this.graph.refresh();
	}
	if(s !== true) {
		this.save();
	}	
}
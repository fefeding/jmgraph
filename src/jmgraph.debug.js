
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
}// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Raphaël 2.1.0 - JavaScript Vector Library                          │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2008-2012 Dmitry Baranovskiy (http://raphaeljs.com)    │ \\
// │ Copyright © 2008-2012 Sencha Labs (http://sencha.com)              │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT (http://raphaeljs.com/license.html) license.│ \\
// └────────────────────────────────────────────────────────────────────┘ \\
(function(t){var e,r,i="0.4.2",n="hasOwnProperty",a=/[\.\/]/,s="*",o=function(){},l=function(t,e){return t-e},h={n:{}},u=function(t,i){t+="";var n,a=r,s=Array.prototype.slice.call(arguments,2),o=u.listeners(t),h=0,c=[],f={},p=[],d=e;e=t,r=0;for(var g=0,v=o.length;v>g;g++)"zIndex"in o[g]&&(c.push(o[g].zIndex),0>o[g].zIndex&&(f[o[g].zIndex]=o[g]));for(c.sort(l);0>c[h];)if(n=f[c[h++]],p.push(n.apply(i,s)),r)return r=a,p;for(g=0;v>g;g++)if(n=o[g],"zIndex"in n)if(n.zIndex==c[h]){if(p.push(n.apply(i,s)),r)break;do if(h++,n=f[c[h]],n&&p.push(n.apply(i,s)),r)break;while(n)}else f[n.zIndex]=n;else if(p.push(n.apply(i,s)),r)break;return r=a,e=d,p.length?p:null};u._events=h,u.listeners=function(t){var e,r,i,n,o,l,u,c,f=t.split(a),p=h,d=[p],g=[];for(n=0,o=f.length;o>n;n++){for(c=[],l=0,u=d.length;u>l;l++)for(p=d[l].n,r=[p[f[n]],p[s]],i=2;i--;)e=r[i],e&&(c.push(e),g=g.concat(e.f||[]));d=c}return g},u.on=function(t,e){if(t+="","function"!=typeof e)return function(){};for(var r=t.split(a),i=h,n=0,s=r.length;s>n;n++)i=i.n,i=i.hasOwnProperty(r[n])&&i[r[n]]||(i[r[n]]={n:{}});for(i.f=i.f||[],n=0,s=i.f.length;s>n;n++)if(i.f[n]==e)return o;return i.f.push(e),function(t){+t==+t&&(e.zIndex=+t)}},u.f=function(t){var e=[].slice.call(arguments,1);return function(){u.apply(null,[t,null].concat(e).concat([].slice.call(arguments,0)))}},u.stop=function(){r=1},u.nt=function(t){return t?RegExp("(?:\\.|\\/|^)"+t+"(?:\\.|\\/|$)").test(e):e},u.nts=function(){return e.split(a)},u.off=u.unbind=function(t,e){if(!t)return u._events=h={n:{}},void 0;var r,i,o,l,c,f,p,d=t.split(a),g=[h];for(l=0,c=d.length;c>l;l++)for(f=0;g.length>f;f+=o.length-2){if(o=[f,1],r=g[f].n,d[l]!=s)r[d[l]]&&o.push(r[d[l]]);else for(i in r)r[n](i)&&o.push(r[i]);g.splice.apply(g,o)}for(l=0,c=g.length;c>l;l++)for(r=g[l];r.n;){if(e){if(r.f){for(f=0,p=r.f.length;p>f;f++)if(r.f[f]==e){r.f.splice(f,1);break}!r.f.length&&delete r.f}for(i in r.n)if(r.n[n](i)&&r.n[i].f){var v=r.n[i].f;for(f=0,p=v.length;p>f;f++)if(v[f]==e){v.splice(f,1);break}!v.length&&delete r.n[i].f}}else{delete r.f;for(i in r.n)r.n[n](i)&&r.n[i].f&&delete r.n[i].f}r=r.n}},u.once=function(t,e){var r=function(){return u.unbind(t,r),e.apply(this,arguments)};return u.on(t,r)},u.version=i,u.toString=function(){return"You are running Eve "+i},"undefined"!=typeof module&&module.exports?module.exports=u:"undefined"!=typeof define?define("eve",[],function(){return u}):t.eve=u})(this),function(t,e){"function"==typeof define&&define.amd?define(["eve"],function(r){return e(t,r)}):e(t,t.eve)}(this,function(t,e){function r(t){if(r.is(t,"function"))return b?t():e.on("raphael.DOMload",t);if(r.is(t,H))return r._engine.create[N](r,t.splice(0,3+r.is(t[0],W))).add(t);var i=Array.prototype.slice.call(arguments,0);if(r.is(i[i.length-1],"function")){var n=i.pop();return b?n.call(r._engine.create[N](r,i)):e.on("raphael.DOMload",function(){n.call(r._engine.create[N](r,i))})}return r._engine.create[N](r,arguments)}function i(t){if(Object(t)!==t)return t;var e=new t.constructor;for(var r in t)t[B](r)&&(e[r]=i(t[r]));return e}function n(t,e){for(var r=0,i=t.length;i>r;r++)if(t[r]===e)return t.push(t.splice(r,1)[0])}function a(t,e,r){function i(){var a=Array.prototype.slice.call(arguments,0),s=a.join("␀"),o=i.cache=i.cache||{},l=i.count=i.count||[];return o[B](s)?(n(l,s),r?r(o[s]):o[s]):(l.length>=1e3&&delete o[l.shift()],l.push(s),o[s]=t[N](e,a),r?r(o[s]):o[s])}return i}function s(){return this.hex}function o(t,e){for(var r=[],i=0,n=t.length;n-2*!e>i;i+=2){var a=[{x:+t[i-2],y:+t[i-1]},{x:+t[i],y:+t[i+1]},{x:+t[i+2],y:+t[i+3]},{x:+t[i+4],y:+t[i+5]}];e?i?n-4==i?a[3]={x:+t[0],y:+t[1]}:n-2==i&&(a[2]={x:+t[0],y:+t[1]},a[3]={x:+t[2],y:+t[3]}):a[0]={x:+t[n-2],y:+t[n-1]}:n-4==i?a[3]=a[2]:i||(a[0]={x:+t[i],y:+t[i+1]}),r.push(["C",(-a[0].x+6*a[1].x+a[2].x)/6,(-a[0].y+6*a[1].y+a[2].y)/6,(a[1].x+6*a[2].x-a[3].x)/6,(a[1].y+6*a[2].y-a[3].y)/6,a[2].x,a[2].y])}return r}function l(t,e,r,i,n){var a=-3*e+9*r-9*i+3*n,s=t*a+6*e-12*r+6*i;return t*s-3*e+3*r}function h(t,e,r,i,n,a,s,o,h){null==h&&(h=1),h=h>1?1:0>h?0:h;for(var u=h/2,c=12,f=[-.1252,.1252,-.3678,.3678,-.5873,.5873,-.7699,.7699,-.9041,.9041,-.9816,.9816],p=[.2491,.2491,.2335,.2335,.2032,.2032,.1601,.1601,.1069,.1069,.0472,.0472],d=0,g=0;c>g;g++){var v=u*f[g]+u,x=l(v,t,r,n,s),y=l(v,e,i,a,o),m=x*x+y*y;d+=p[g]*q.sqrt(m)}return u*d}function u(t,e,r,i,n,a,s,o,l){if(!(0>l||l>h(t,e,r,i,n,a,s,o))){var u,c=1,f=c/2,p=c-f,d=.01;for(u=h(t,e,r,i,n,a,s,o,p);V(u-l)>d;)f/=2,p+=(l>u?1:-1)*f,u=h(t,e,r,i,n,a,s,o,p);return p}}function c(t,e,r,i,n,a,s,o){if(!(D(t,r)<O(n,s)||O(t,r)>D(n,s)||D(e,i)<O(a,o)||O(e,i)>D(a,o))){var l=(t*i-e*r)*(n-s)-(t-r)*(n*o-a*s),h=(t*i-e*r)*(a-o)-(e-i)*(n*o-a*s),u=(t-r)*(a-o)-(e-i)*(n-s);if(u){var c=l/u,f=h/u,p=+c.toFixed(2),d=+f.toFixed(2);if(!(+O(t,r).toFixed(2)>p||p>+D(t,r).toFixed(2)||+O(n,s).toFixed(2)>p||p>+D(n,s).toFixed(2)||+O(e,i).toFixed(2)>d||d>+D(e,i).toFixed(2)||+O(a,o).toFixed(2)>d||d>+D(a,o).toFixed(2)))return{x:c,y:f}}}}function f(t,e,i){var n=r.bezierBBox(t),a=r.bezierBBox(e);if(!r.isBBoxIntersect(n,a))return i?0:[];for(var s=h.apply(0,t),o=h.apply(0,e),l=~~(s/5),u=~~(o/5),f=[],p=[],d={},g=i?0:[],v=0;l+1>v;v++){var x=r.findDotsAtSegment.apply(r,t.concat(v/l));f.push({x:x.x,y:x.y,t:v/l})}for(v=0;u+1>v;v++)x=r.findDotsAtSegment.apply(r,e.concat(v/u)),p.push({x:x.x,y:x.y,t:v/u});for(v=0;l>v;v++)for(var y=0;u>y;y++){var m=f[v],b=f[v+1],_=p[y],w=p[y+1],k=.001>V(b.x-m.x)?"y":"x",C=.001>V(w.x-_.x)?"y":"x",B=c(m.x,m.y,b.x,b.y,_.x,_.y,w.x,w.y);if(B){if(d[B.x.toFixed(4)]==B.y.toFixed(4))continue;d[B.x.toFixed(4)]=B.y.toFixed(4);var S=m.t+V((B[k]-m[k])/(b[k]-m[k]))*(b.t-m.t),T=_.t+V((B[C]-_[C])/(w[C]-_[C]))*(w.t-_.t);S>=0&&1>=S&&T>=0&&1>=T&&(i?g++:g.push({x:B.x,y:B.y,t1:S,t2:T}))}}return g}function p(t,e,i){t=r._path2curve(t),e=r._path2curve(e);for(var n,a,s,o,l,h,u,c,p,d,g=i?0:[],v=0,x=t.length;x>v;v++){var y=t[v];if("M"==y[0])n=l=y[1],a=h=y[2];else{"C"==y[0]?(p=[n,a].concat(y.slice(1)),n=p[6],a=p[7]):(p=[n,a,n,a,l,h,l,h],n=l,a=h);for(var m=0,b=e.length;b>m;m++){var _=e[m];if("M"==_[0])s=u=_[1],o=c=_[2];else{"C"==_[0]?(d=[s,o].concat(_.slice(1)),s=d[6],o=d[7]):(d=[s,o,s,o,u,c,u,c],s=u,o=c);var w=f(p,d,i);if(i)g+=w;else{for(var k=0,C=w.length;C>k;k++)w[k].segment1=v,w[k].segment2=m,w[k].bez1=p,w[k].bez2=d;g=g.concat(w)}}}}}return g}function d(t,e,r,i,n,a){null!=t?(this.a=+t,this.b=+e,this.c=+r,this.d=+i,this.e=+n,this.f=+a):(this.a=1,this.b=0,this.c=0,this.d=1,this.e=0,this.f=0)}function g(){return this.x+P+this.y+P+this.width+" × "+this.height}function v(t,e,r,i,n,a){function s(t){return((c*t+u)*t+h)*t}function o(t,e){var r=l(t,e);return((d*r+p)*r+f)*r}function l(t,e){var r,i,n,a,o,l;for(n=t,l=0;8>l;l++){if(a=s(n)-t,e>V(a))return n;if(o=(3*c*n+2*u)*n+h,1e-6>V(o))break;n-=a/o}if(r=0,i=1,n=t,r>n)return r;if(n>i)return i;for(;i>r;){if(a=s(n),e>V(a-t))return n;t>a?r=n:i=n,n=(i-r)/2+r}return n}var h=3*e,u=3*(i-e)-h,c=1-h-u,f=3*r,p=3*(n-r)-f,d=1-f-p;return o(t,1/(200*a))}function x(t,e){var r=[],i={};if(this.ms=e,this.times=1,t){for(var n in t)t[B](n)&&(i[K(n)]=t[n],r.push(K(n)));r.sort(ce)}this.anim=i,this.top=r[r.length-1],this.percents=r}function y(t,i,n,a,s,o){n=K(n);var l,h,u,c,f,p,g=t.ms,x={},y={},m={};if(a)for(_=0,k=lr.length;k>_;_++){var b=lr[_];if(b.el.id==i.id&&b.anim==t){b.percent!=n?(lr.splice(_,1),u=1):h=b,i.attr(b.totalOrigin);break}}else a=+y;for(var _=0,k=t.percents.length;k>_;_++){if(t.percents[_]==n||t.percents[_]>a*t.top){n=t.percents[_],f=t.percents[_-1]||0,g=g/t.top*(n-f),c=t.percents[_+1],l=t.anim[n];break}a&&i.attr(t.anim[t.percents[_]])}if(l){if(h)h.initstatus=a,h.start=new Date-h.ms*a;else{for(var C in l)if(l[B](C)&&(ie[B](C)||i.paper.customAttributes[B](C)))switch(x[C]=i.attr(C),null==x[C]&&(x[C]=re[C]),y[C]=l[C],ie[C]){case W:m[C]=(y[C]-x[C])/g;break;case"colour":x[C]=r.getRGB(x[C]);var S=r.getRGB(y[C]);m[C]={r:(S.r-x[C].r)/g,g:(S.g-x[C].g)/g,b:(S.b-x[C].b)/g};break;case"path":var T=Re(x[C],y[C]),A=T[1];for(x[C]=T[0],m[C]=[],_=0,k=x[C].length;k>_;_++){m[C][_]=[0];for(var N=1,L=x[C][_].length;L>N;N++)m[C][_][N]=(A[_][N]-x[C][_][N])/g}break;case"transform":var M=i._,P=Oe(M[C],y[C]);if(P)for(x[C]=P.from,y[C]=P.to,m[C]=[],m[C].real=!0,_=0,k=x[C].length;k>_;_++)for(m[C][_]=[x[C][_][0]],N=1,L=x[C][_].length;L>N;N++)m[C][_][N]=(y[C][_][N]-x[C][_][N])/g;else{var R=i.matrix||new d,I={_:{transform:M.transform},getBBox:function(){return i.getBBox(1)}};x[C]=[R.a,R.b,R.c,R.d,R.e,R.f],qe(I,y[C]),y[C]=I._.transform,m[C]=[(I.matrix.a-R.a)/g,(I.matrix.b-R.b)/g,(I.matrix.c-R.c)/g,(I.matrix.d-R.d)/g,(I.matrix.e-R.e)/g,(I.matrix.f-R.f)/g]}break;case"csv":var j=z(l[C])[F](w),q=z(x[C])[F](w);if("clip-rect"==C)for(x[C]=q,m[C]=[],_=q.length;_--;)m[C][_]=(j[_]-x[C][_])/g;y[C]=j;break;default:for(j=[][E](l[C]),q=[][E](x[C]),m[C]=[],_=i.paper.customAttributes[C].length;_--;)m[C][_]=((j[_]||0)-(q[_]||0))/g}var D=l.easing,O=r.easing_formulas[D];if(!O)if(O=z(D).match(Q),O&&5==O.length){var V=O;O=function(t){return v(t,+V[1],+V[2],+V[3],+V[4],g)}}else O=pe;if(p=l.start||t.start||+new Date,b={anim:t,percent:n,timestamp:p,start:p+(t.del||0),status:0,initstatus:a||0,stop:!1,ms:g,easing:O,from:x,diff:m,to:y,el:i,callback:l.callback,prev:f,next:c,repeat:o||t.times,origin:i.attr(),totalOrigin:s},lr.push(b),a&&!h&&!u&&(b.stop=!0,b.start=new Date-g*a,1==lr.length))return ur();u&&(b.start=new Date-b.ms*a),1==lr.length&&hr(ur)}e("raphael.anim.start."+i.id,i,t)}}function m(t){for(var e=0;lr.length>e;e++)lr[e].el.paper==t&&lr.splice(e--,1)}r.version="2.1.0",r.eve=e;var b,_,w=/[, ]+/,k={circle:1,rect:1,path:1,ellipse:1,text:1,image:1},C=/\{(\d+)\}/g,B="hasOwnProperty",S={doc:document,win:t},T={was:Object.prototype[B].call(S.win,"Raphael"),is:S.win.Raphael},A=function(){this.ca=this.customAttributes={}},N="apply",E="concat",L="ontouchstart"in S.win||S.win.DocumentTouch&&S.doc instanceof DocumentTouch,M="",P=" ",z=String,F="split",R="click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[F](P),I={mousedown:"touchstart",mousemove:"touchmove",mouseup:"touchend"},j=z.prototype.toLowerCase,q=Math,D=q.max,O=q.min,V=q.abs,Y=q.pow,G=q.PI,W="number",X="string",H="array",U=Object.prototype.toString,$=(r._ISURL=/^url\(['"]?([^\)]+?)['"]?\)$/i,/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i),Z={NaN:1,Infinity:1,"-Infinity":1},Q=/^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,J=q.round,K=parseFloat,te=parseInt,ee=z.prototype.toUpperCase,re=r._availableAttrs={"arrow-end":"none","arrow-start":"none",blur:0,"clip-rect":"0 0 1e9 1e9",cursor:"default",cx:0,cy:0,fill:"#fff","fill-opacity":1,font:'10px "Arial"',"font-family":'"Arial"',"font-size":"10","font-style":"normal","font-weight":400,gradient:0,height:0,href:"http://raphaeljs.com/","letter-spacing":0,opacity:1,path:"M0,0",r:0,rx:0,ry:0,src:"",stroke:"#000","stroke-dasharray":"","stroke-linecap":"butt","stroke-linejoin":"butt","stroke-miterlimit":0,"stroke-opacity":1,"stroke-width":1,target:"_blank","text-anchor":"middle",title:"Raphael",transform:"",width:0,x:0,y:0},ie=r._availableAnimAttrs={blur:W,"clip-rect":"csv",cx:W,cy:W,fill:"colour","fill-opacity":W,"font-size":W,height:W,opacity:W,path:"path",r:W,rx:W,ry:W,stroke:"colour","stroke-opacity":W,"stroke-width":W,transform:"transform",width:W,x:W,y:W},ne=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,ae={hs:1,rg:1},se=/,?([achlmqrstvxz]),?/gi,oe=/([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi,le=/([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi,he=/(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/gi,ue=(r._radial_gradient=/^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/,{}),ce=function(t,e){return K(t)-K(e)},fe=function(){},pe=function(t){return t},de=r._rectPath=function(t,e,r,i,n){return n?[["M",t+n,e],["l",r-2*n,0],["a",n,n,0,0,1,n,n],["l",0,i-2*n],["a",n,n,0,0,1,-n,n],["l",2*n-r,0],["a",n,n,0,0,1,-n,-n],["l",0,2*n-i],["a",n,n,0,0,1,n,-n],["z"]]:[["M",t,e],["l",r,0],["l",0,i],["l",-r,0],["z"]]},ge=function(t,e,r,i){return null==i&&(i=r),[["M",t,e],["m",0,-i],["a",r,i,0,1,1,0,2*i],["a",r,i,0,1,1,0,-2*i],["z"]]},ve=r._getPath={path:function(t){return t.attr("path")},circle:function(t){var e=t.attrs;return ge(e.cx,e.cy,e.r)},ellipse:function(t){var e=t.attrs;return ge(e.cx,e.cy,e.rx,e.ry)},rect:function(t){var e=t.attrs;return de(e.x,e.y,e.width,e.height,e.r)},image:function(t){var e=t.attrs;return de(e.x,e.y,e.width,e.height)},text:function(t){var e=t._getBBox();return de(e.x,e.y,e.width,e.height)},set:function(t){var e=t._getBBox();return de(e.x,e.y,e.width,e.height)}},xe=r.mapPath=function(t,e){if(!e)return t;var r,i,n,a,s,o,l;for(t=Re(t),n=0,s=t.length;s>n;n++)for(l=t[n],a=1,o=l.length;o>a;a+=2)r=e.x(l[a],l[a+1]),i=e.y(l[a],l[a+1]),l[a]=r,l[a+1]=i;return t};if(r._g=S,r.type=S.win.SVGAngle||S.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML","VML"==r.type){var ye,me=S.doc.createElement("div");if(me.innerHTML='<v:shape adj="1"/>',ye=me.firstChild,ye.style.behavior="url(#default#VML)",!ye||"object"!=typeof ye.adj)return r.type=M;me=null}r.svg=!(r.vml="VML"==r.type),r._Paper=A,r.fn=_=A.prototype=r.prototype,r._id=0,r._oid=0,r.is=function(t,e){return e=j.call(e),"finite"==e?!Z[B](+t):"array"==e?t instanceof Array:"null"==e&&null===t||e==typeof t&&null!==t||"object"==e&&t===Object(t)||"array"==e&&Array.isArray&&Array.isArray(t)||U.call(t).slice(8,-1).toLowerCase()==e},r.angle=function(t,e,i,n,a,s){if(null==a){var o=t-i,l=e-n;return o||l?(180+180*q.atan2(-l,-o)/G+360)%360:0}return r.angle(t,e,a,s)-r.angle(i,n,a,s)},r.rad=function(t){return t%360*G/180},r.deg=function(t){return 180*t/G%360},r.snapTo=function(t,e,i){if(i=r.is(i,"finite")?i:10,r.is(t,H)){for(var n=t.length;n--;)if(i>=V(t[n]-e))return t[n]}else{t=+t;var a=e%t;if(i>a)return e-a;if(a>t-i)return e-a+t}return e},r.createUUID=function(t,e){return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(t,e).toUpperCase()}}(/[xy]/g,function(t){var e=0|16*q.random(),r="x"==t?e:8|3&e;return r.toString(16)}),r.setWindow=function(t){e("raphael.setWindow",r,S.win,t),S.win=t,S.doc=S.win.document,r._engine.initWin&&r._engine.initWin(S.win)};var be=function(t){if(r.vml){var e,i=/^\s+|\s+$/g;try{var n=new ActiveXObject("htmlfile");n.write("<body>"),n.close(),e=n.body}catch(s){e=createPopup().document.body}var o=e.createTextRange();be=a(function(t){try{e.style.color=z(t).replace(i,M);var r=o.queryCommandValue("ForeColor");return r=(255&r)<<16|65280&r|(16711680&r)>>>16,"#"+("000000"+r.toString(16)).slice(-6)}catch(n){return"none"}})}else{var l=S.doc.createElement("i");l.title="Raphaël Colour Picker",l.style.display="none",S.doc.body.appendChild(l),be=a(function(t){return l.style.color=t,S.doc.defaultView.getComputedStyle(l,M).getPropertyValue("color")})}return be(t)},_e=function(){return"hsb("+[this.h,this.s,this.b]+")"},we=function(){return"hsl("+[this.h,this.s,this.l]+")"},ke=function(){return this.hex},Ce=function(t,e,i){if(null==e&&r.is(t,"object")&&"r"in t&&"g"in t&&"b"in t&&(i=t.b,e=t.g,t=t.r),null==e&&r.is(t,X)){var n=r.getRGB(t);t=n.r,e=n.g,i=n.b}return(t>1||e>1||i>1)&&(t/=255,e/=255,i/=255),[t,e,i]},Be=function(t,e,i,n){t*=255,e*=255,i*=255;var a={r:t,g:e,b:i,hex:r.rgb(t,e,i),toString:ke};return r.is(n,"finite")&&(a.opacity=n),a};r.color=function(t){var e;return r.is(t,"object")&&"h"in t&&"s"in t&&"b"in t?(e=r.hsb2rgb(t),t.r=e.r,t.g=e.g,t.b=e.b,t.hex=e.hex):r.is(t,"object")&&"h"in t&&"s"in t&&"l"in t?(e=r.hsl2rgb(t),t.r=e.r,t.g=e.g,t.b=e.b,t.hex=e.hex):(r.is(t,"string")&&(t=r.getRGB(t)),r.is(t,"object")&&"r"in t&&"g"in t&&"b"in t?(e=r.rgb2hsl(t),t.h=e.h,t.s=e.s,t.l=e.l,e=r.rgb2hsb(t),t.v=e.b):(t={hex:"none"},t.r=t.g=t.b=t.h=t.s=t.v=t.l=-1)),t.toString=ke,t},r.hsb2rgb=function(t,e,r,i){this.is(t,"object")&&"h"in t&&"s"in t&&"b"in t&&(r=t.b,e=t.s,t=t.h,i=t.o),t*=360;var n,a,s,o,l;return t=t%360/60,l=r*e,o=l*(1-V(t%2-1)),n=a=s=r-l,t=~~t,n+=[l,o,0,0,o,l][t],a+=[o,l,l,o,0,0][t],s+=[0,0,o,l,l,o][t],Be(n,a,s,i)},r.hsl2rgb=function(t,e,r,i){this.is(t,"object")&&"h"in t&&"s"in t&&"l"in t&&(r=t.l,e=t.s,t=t.h),(t>1||e>1||r>1)&&(t/=360,e/=100,r/=100),t*=360;var n,a,s,o,l;return t=t%360/60,l=2*e*(.5>r?r:1-r),o=l*(1-V(t%2-1)),n=a=s=r-l/2,t=~~t,n+=[l,o,0,0,o,l][t],a+=[o,l,l,o,0,0][t],s+=[0,0,o,l,l,o][t],Be(n,a,s,i)},r.rgb2hsb=function(t,e,r){r=Ce(t,e,r),t=r[0],e=r[1],r=r[2];var i,n,a,s;return a=D(t,e,r),s=a-O(t,e,r),i=0==s?null:a==t?(e-r)/s:a==e?(r-t)/s+2:(t-e)/s+4,i=60*((i+360)%6)/360,n=0==s?0:s/a,{h:i,s:n,b:a,toString:_e}},r.rgb2hsl=function(t,e,r){r=Ce(t,e,r),t=r[0],e=r[1],r=r[2];var i,n,a,s,o,l;return s=D(t,e,r),o=O(t,e,r),l=s-o,i=0==l?null:s==t?(e-r)/l:s==e?(r-t)/l+2:(t-e)/l+4,i=60*((i+360)%6)/360,a=(s+o)/2,n=0==l?0:.5>a?l/(2*a):l/(2-2*a),{h:i,s:n,l:a,toString:we}},r._path2string=function(){return this.join(",").replace(se,"$1")},r._preload=function(t,e){var r=S.doc.createElement("img");r.style.cssText="position:absolute;left:-9999em;top:-9999em",r.onload=function(){e.call(this),this.onload=null,S.doc.body.removeChild(this)},r.onerror=function(){S.doc.body.removeChild(this)},S.doc.body.appendChild(r),r.src=t},r.getRGB=a(function(t){if(!t||(t=z(t)).indexOf("-")+1)return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:s};if("none"==t)return{r:-1,g:-1,b:-1,hex:"none",toString:s};!(ae[B](t.toLowerCase().substring(0,2))||"#"==t.charAt())&&(t=be(t));var e,i,n,a,o,l,h=t.match($);return h?(h[2]&&(n=te(h[2].substring(5),16),i=te(h[2].substring(3,5),16),e=te(h[2].substring(1,3),16)),h[3]&&(n=te((o=h[3].charAt(3))+o,16),i=te((o=h[3].charAt(2))+o,16),e=te((o=h[3].charAt(1))+o,16)),h[4]&&(l=h[4][F](ne),e=K(l[0]),"%"==l[0].slice(-1)&&(e*=2.55),i=K(l[1]),"%"==l[1].slice(-1)&&(i*=2.55),n=K(l[2]),"%"==l[2].slice(-1)&&(n*=2.55),"rgba"==h[1].toLowerCase().slice(0,4)&&(a=K(l[3])),l[3]&&"%"==l[3].slice(-1)&&(a/=100)),h[5]?(l=h[5][F](ne),e=K(l[0]),"%"==l[0].slice(-1)&&(e*=2.55),i=K(l[1]),"%"==l[1].slice(-1)&&(i*=2.55),n=K(l[2]),"%"==l[2].slice(-1)&&(n*=2.55),("deg"==l[0].slice(-3)||"°"==l[0].slice(-1))&&(e/=360),"hsba"==h[1].toLowerCase().slice(0,4)&&(a=K(l[3])),l[3]&&"%"==l[3].slice(-1)&&(a/=100),r.hsb2rgb(e,i,n,a)):h[6]?(l=h[6][F](ne),e=K(l[0]),"%"==l[0].slice(-1)&&(e*=2.55),i=K(l[1]),"%"==l[1].slice(-1)&&(i*=2.55),n=K(l[2]),"%"==l[2].slice(-1)&&(n*=2.55),("deg"==l[0].slice(-3)||"°"==l[0].slice(-1))&&(e/=360),"hsla"==h[1].toLowerCase().slice(0,4)&&(a=K(l[3])),l[3]&&"%"==l[3].slice(-1)&&(a/=100),r.hsl2rgb(e,i,n,a)):(h={r:e,g:i,b:n,toString:s},h.hex="#"+(16777216|n|i<<8|e<<16).toString(16).slice(1),r.is(a,"finite")&&(h.opacity=a),h)):{r:-1,g:-1,b:-1,hex:"none",error:1,toString:s}},r),r.hsb=a(function(t,e,i){return r.hsb2rgb(t,e,i).hex}),r.hsl=a(function(t,e,i){return r.hsl2rgb(t,e,i).hex}),r.rgb=a(function(t,e,r){return"#"+(16777216|r|e<<8|t<<16).toString(16).slice(1)}),r.getColor=function(t){var e=this.getColor.start=this.getColor.start||{h:0,s:1,b:t||.75},r=this.hsb2rgb(e.h,e.s,e.b);return e.h+=.075,e.h>1&&(e.h=0,e.s-=.2,0>=e.s&&(this.getColor.start={h:0,s:1,b:e.b})),r.hex},r.getColor.reset=function(){delete this.start},r.parsePathString=function(t){if(!t)return null;var e=Se(t);if(e.arr)return Ae(e.arr);var i={a:7,c:6,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,z:0},n=[];return r.is(t,H)&&r.is(t[0],H)&&(n=Ae(t)),n.length||z(t).replace(oe,function(t,e,r){var a=[],s=e.toLowerCase();if(r.replace(he,function(t,e){e&&a.push(+e)}),"m"==s&&a.length>2&&(n.push([e][E](a.splice(0,2))),s="l",e="m"==e?"l":"L"),"r"==s)n.push([e][E](a));else for(;a.length>=i[s]&&(n.push([e][E](a.splice(0,i[s]))),i[s]););}),n.toString=r._path2string,e.arr=Ae(n),n},r.parseTransformString=a(function(t){if(!t)return null;var e=[];return r.is(t,H)&&r.is(t[0],H)&&(e=Ae(t)),e.length||z(t).replace(le,function(t,r,i){var n=[];j.call(r),i.replace(he,function(t,e){e&&n.push(+e)}),e.push([r][E](n))}),e.toString=r._path2string,e});var Se=function(t){var e=Se.ps=Se.ps||{};return e[t]?e[t].sleep=100:e[t]={sleep:100},setTimeout(function(){for(var r in e)e[B](r)&&r!=t&&(e[r].sleep--,!e[r].sleep&&delete e[r])}),e[t]};r.findDotsAtSegment=function(t,e,r,i,n,a,s,o,l){var h=1-l,u=Y(h,3),c=Y(h,2),f=l*l,p=f*l,d=u*t+3*c*l*r+3*h*l*l*n+p*s,g=u*e+3*c*l*i+3*h*l*l*a+p*o,v=t+2*l*(r-t)+f*(n-2*r+t),x=e+2*l*(i-e)+f*(a-2*i+e),y=r+2*l*(n-r)+f*(s-2*n+r),m=i+2*l*(a-i)+f*(o-2*a+i),b=h*t+l*r,_=h*e+l*i,w=h*n+l*s,k=h*a+l*o,C=90-180*q.atan2(v-y,x-m)/G;return(v>y||m>x)&&(C+=180),{x:d,y:g,m:{x:v,y:x},n:{x:y,y:m},start:{x:b,y:_},end:{x:w,y:k},alpha:C}},r.bezierBBox=function(t,e,i,n,a,s,o,l){r.is(t,"array")||(t=[t,e,i,n,a,s,o,l]);var h=Fe.apply(null,t);return{x:h.min.x,y:h.min.y,x2:h.max.x,y2:h.max.y,width:h.max.x-h.min.x,height:h.max.y-h.min.y}},r.isPointInsideBBox=function(t,e,r){return e>=t.x&&t.x2>=e&&r>=t.y&&t.y2>=r},r.isBBoxIntersect=function(t,e){var i=r.isPointInsideBBox;return i(e,t.x,t.y)||i(e,t.x2,t.y)||i(e,t.x,t.y2)||i(e,t.x2,t.y2)||i(t,e.x,e.y)||i(t,e.x2,e.y)||i(t,e.x,e.y2)||i(t,e.x2,e.y2)||(t.x<e.x2&&t.x>e.x||e.x<t.x2&&e.x>t.x)&&(t.y<e.y2&&t.y>e.y||e.y<t.y2&&e.y>t.y)},r.pathIntersection=function(t,e){return p(t,e)},r.pathIntersectionNumber=function(t,e){return p(t,e,1)},r.isPointInsidePath=function(t,e,i){var n=r.pathBBox(t);return r.isPointInsideBBox(n,e,i)&&1==p(t,[["M",e,i],["H",n.x2+10]],1)%2},r._removedFactory=function(t){return function(){e("raphael.log",null,"Raphaël: you are calling to method “"+t+"” of removed object",t)}};var Te=r.pathBBox=function(t){var e=Se(t);if(e.bbox)return i(e.bbox);if(!t)return{x:0,y:0,width:0,height:0,x2:0,y2:0};t=Re(t);for(var r,n=0,a=0,s=[],o=[],l=0,h=t.length;h>l;l++)if(r=t[l],"M"==r[0])n=r[1],a=r[2],s.push(n),o.push(a);else{var u=Fe(n,a,r[1],r[2],r[3],r[4],r[5],r[6]);s=s[E](u.min.x,u.max.x),o=o[E](u.min.y,u.max.y),n=r[5],a=r[6]}var c=O[N](0,s),f=O[N](0,o),p=D[N](0,s),d=D[N](0,o),g=p-c,v=d-f,x={x:c,y:f,x2:p,y2:d,width:g,height:v,cx:c+g/2,cy:f+v/2};return e.bbox=i(x),x},Ae=function(t){var e=i(t);return e.toString=r._path2string,e},Ne=r._pathToRelative=function(t){var e=Se(t);if(e.rel)return Ae(e.rel);r.is(t,H)&&r.is(t&&t[0],H)||(t=r.parsePathString(t));var i=[],n=0,a=0,s=0,o=0,l=0;"M"==t[0][0]&&(n=t[0][1],a=t[0][2],s=n,o=a,l++,i.push(["M",n,a]));for(var h=l,u=t.length;u>h;h++){var c=i[h]=[],f=t[h];if(f[0]!=j.call(f[0]))switch(c[0]=j.call(f[0]),c[0]){case"a":c[1]=f[1],c[2]=f[2],c[3]=f[3],c[4]=f[4],c[5]=f[5],c[6]=+(f[6]-n).toFixed(3),c[7]=+(f[7]-a).toFixed(3);break;case"v":c[1]=+(f[1]-a).toFixed(3);break;case"m":s=f[1],o=f[2];default:for(var p=1,d=f.length;d>p;p++)c[p]=+(f[p]-(p%2?n:a)).toFixed(3)}else{c=i[h]=[],"m"==f[0]&&(s=f[1]+n,o=f[2]+a);for(var g=0,v=f.length;v>g;g++)i[h][g]=f[g]}var x=i[h].length;switch(i[h][0]){case"z":n=s,a=o;break;case"h":n+=+i[h][x-1];break;case"v":a+=+i[h][x-1];break;default:n+=+i[h][x-2],a+=+i[h][x-1]}}return i.toString=r._path2string,e.rel=Ae(i),i},Ee=r._pathToAbsolute=function(t){var e=Se(t);if(e.abs)return Ae(e.abs);if(r.is(t,H)&&r.is(t&&t[0],H)||(t=r.parsePathString(t)),!t||!t.length)return[["M",0,0]];var i=[],n=0,a=0,s=0,l=0,h=0;"M"==t[0][0]&&(n=+t[0][1],a=+t[0][2],s=n,l=a,h++,i[0]=["M",n,a]);for(var u,c,f=3==t.length&&"M"==t[0][0]&&"R"==t[1][0].toUpperCase()&&"Z"==t[2][0].toUpperCase(),p=h,d=t.length;d>p;p++){if(i.push(u=[]),c=t[p],c[0]!=ee.call(c[0]))switch(u[0]=ee.call(c[0]),u[0]){case"A":u[1]=c[1],u[2]=c[2],u[3]=c[3],u[4]=c[4],u[5]=c[5],u[6]=+(c[6]+n),u[7]=+(c[7]+a);break;case"V":u[1]=+c[1]+a;break;case"H":u[1]=+c[1]+n;break;case"R":for(var g=[n,a][E](c.slice(1)),v=2,x=g.length;x>v;v++)g[v]=+g[v]+n,g[++v]=+g[v]+a;i.pop(),i=i[E](o(g,f));break;case"M":s=+c[1]+n,l=+c[2]+a;default:for(v=1,x=c.length;x>v;v++)u[v]=+c[v]+(v%2?n:a)}else if("R"==c[0])g=[n,a][E](c.slice(1)),i.pop(),i=i[E](o(g,f)),u=["R"][E](c.slice(-2));else for(var y=0,m=c.length;m>y;y++)u[y]=c[y];switch(u[0]){case"Z":n=s,a=l;break;case"H":n=u[1];break;case"V":a=u[1];break;case"M":s=u[u.length-2],l=u[u.length-1];default:n=u[u.length-2],a=u[u.length-1]}}return i.toString=r._path2string,e.abs=Ae(i),i},Le=function(t,e,r,i){return[t,e,r,i,r,i]},Me=function(t,e,r,i,n,a){var s=1/3,o=2/3;return[s*t+o*r,s*e+o*i,s*n+o*r,s*a+o*i,n,a]},Pe=function(t,e,r,i,n,s,o,l,h,u){var c,f=120*G/180,p=G/180*(+n||0),d=[],g=a(function(t,e,r){var i=t*q.cos(r)-e*q.sin(r),n=t*q.sin(r)+e*q.cos(r);return{x:i,y:n}});if(u)C=u[0],B=u[1],w=u[2],k=u[3];else{c=g(t,e,-p),t=c.x,e=c.y,c=g(l,h,-p),l=c.x,h=c.y;var v=(q.cos(G/180*n),q.sin(G/180*n),(t-l)/2),x=(e-h)/2,y=v*v/(r*r)+x*x/(i*i);y>1&&(y=q.sqrt(y),r=y*r,i=y*i);var m=r*r,b=i*i,_=(s==o?-1:1)*q.sqrt(V((m*b-m*x*x-b*v*v)/(m*x*x+b*v*v))),w=_*r*x/i+(t+l)/2,k=_*-i*v/r+(e+h)/2,C=q.asin(((e-k)/i).toFixed(9)),B=q.asin(((h-k)/i).toFixed(9));C=w>t?G-C:C,B=w>l?G-B:B,0>C&&(C=2*G+C),0>B&&(B=2*G+B),o&&C>B&&(C-=2*G),!o&&B>C&&(B-=2*G)}var S=B-C;if(V(S)>f){var T=B,A=l,N=h;B=C+f*(o&&B>C?1:-1),l=w+r*q.cos(B),h=k+i*q.sin(B),d=Pe(l,h,r,i,n,0,o,A,N,[B,T,w,k])}S=B-C;var L=q.cos(C),M=q.sin(C),P=q.cos(B),z=q.sin(B),R=q.tan(S/4),I=4/3*r*R,j=4/3*i*R,D=[t,e],O=[t+I*M,e-j*L],Y=[l+I*z,h-j*P],W=[l,h];if(O[0]=2*D[0]-O[0],O[1]=2*D[1]-O[1],u)return[O,Y,W][E](d);d=[O,Y,W][E](d).join()[F](",");for(var X=[],H=0,U=d.length;U>H;H++)X[H]=H%2?g(d[H-1],d[H],p).y:g(d[H],d[H+1],p).x;return X},ze=function(t,e,r,i,n,a,s,o,l){var h=1-l;return{x:Y(h,3)*t+3*Y(h,2)*l*r+3*h*l*l*n+Y(l,3)*s,y:Y(h,3)*e+3*Y(h,2)*l*i+3*h*l*l*a+Y(l,3)*o}},Fe=a(function(t,e,r,i,n,a,s,o){var l,h=n-2*r+t-(s-2*n+r),u=2*(r-t)-2*(n-r),c=t-r,f=(-u+q.sqrt(u*u-4*h*c))/2/h,p=(-u-q.sqrt(u*u-4*h*c))/2/h,d=[e,o],g=[t,s];return V(f)>"1e12"&&(f=.5),V(p)>"1e12"&&(p=.5),f>0&&1>f&&(l=ze(t,e,r,i,n,a,s,o,f),g.push(l.x),d.push(l.y)),p>0&&1>p&&(l=ze(t,e,r,i,n,a,s,o,p),g.push(l.x),d.push(l.y)),h=a-2*i+e-(o-2*a+i),u=2*(i-e)-2*(a-i),c=e-i,f=(-u+q.sqrt(u*u-4*h*c))/2/h,p=(-u-q.sqrt(u*u-4*h*c))/2/h,V(f)>"1e12"&&(f=.5),V(p)>"1e12"&&(p=.5),f>0&&1>f&&(l=ze(t,e,r,i,n,a,s,o,f),g.push(l.x),d.push(l.y)),p>0&&1>p&&(l=ze(t,e,r,i,n,a,s,o,p),g.push(l.x),d.push(l.y)),{min:{x:O[N](0,g),y:O[N](0,d)},max:{x:D[N](0,g),y:D[N](0,d)}}}),Re=r._path2curve=a(function(t,e){var r=!e&&Se(t);if(!e&&r.curve)return Ae(r.curve);for(var i=Ee(t),n=e&&Ee(e),a={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},s={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},o=(function(t,e){var r,i;if(!t)return["C",e.x,e.y,e.x,e.y,e.x,e.y];switch(!(t[0]in{T:1,Q:1})&&(e.qx=e.qy=null),t[0]){case"M":e.X=t[1],e.Y=t[2];break;case"A":t=["C"][E](Pe[N](0,[e.x,e.y][E](t.slice(1))));break;case"S":r=e.x+(e.x-(e.bx||e.x)),i=e.y+(e.y-(e.by||e.y)),t=["C",r,i][E](t.slice(1));break;case"T":e.qx=e.x+(e.x-(e.qx||e.x)),e.qy=e.y+(e.y-(e.qy||e.y)),t=["C"][E](Me(e.x,e.y,e.qx,e.qy,t[1],t[2]));break;case"Q":e.qx=t[1],e.qy=t[2],t=["C"][E](Me(e.x,e.y,t[1],t[2],t[3],t[4]));break;case"L":t=["C"][E](Le(e.x,e.y,t[1],t[2]));break;case"H":t=["C"][E](Le(e.x,e.y,t[1],e.y));break;case"V":t=["C"][E](Le(e.x,e.y,e.x,t[1]));break;case"Z":t=["C"][E](Le(e.x,e.y,e.X,e.Y))}return t}),l=function(t,e){if(t[e].length>7){t[e].shift();for(var r=t[e];r.length;)t.splice(e++,0,["C"][E](r.splice(0,6)));t.splice(e,1),c=D(i.length,n&&n.length||0)}},h=function(t,e,r,a,s){t&&e&&"M"==t[s][0]&&"M"!=e[s][0]&&(e.splice(s,0,["M",a.x,a.y]),r.bx=0,r.by=0,r.x=t[s][1],r.y=t[s][2],c=D(i.length,n&&n.length||0))},u=0,c=D(i.length,n&&n.length||0);c>u;u++){i[u]=o(i[u],a),l(i,u),n&&(n[u]=o(n[u],s)),n&&l(n,u),h(i,n,a,s,u),h(n,i,s,a,u);var f=i[u],p=n&&n[u],d=f.length,g=n&&p.length;a.x=f[d-2],a.y=f[d-1],a.bx=K(f[d-4])||a.x,a.by=K(f[d-3])||a.y,s.bx=n&&(K(p[g-4])||s.x),s.by=n&&(K(p[g-3])||s.y),s.x=n&&p[g-2],s.y=n&&p[g-1]}return n||(r.curve=Ae(i)),n?[i,n]:i},null,Ae),Ie=(r._parseDots=a(function(t){for(var e=[],i=0,n=t.length;n>i;i++){var a={},s=t[i].match(/^([^:]*):?([\d\.]*)/);if(a.color=r.getRGB(s[1]),a.color.error)return null;a.color=a.color.hex,s[2]&&(a.offset=s[2]+"%"),e.push(a)}for(i=1,n=e.length-1;n>i;i++)if(!e[i].offset){for(var o=K(e[i-1].offset||0),l=0,h=i+1;n>h;h++)if(e[h].offset){l=e[h].offset;break}l||(l=100,h=n),l=K(l);for(var u=(l-o)/(h-i+1);h>i;i++)o+=u,e[i].offset=o+"%"}return e}),r._tear=function(t,e){t==e.top&&(e.top=t.prev),t==e.bottom&&(e.bottom=t.next),t.next&&(t.next.prev=t.prev),t.prev&&(t.prev.next=t.next)}),je=(r._tofront=function(t,e){e.top!==t&&(Ie(t,e),t.next=null,t.prev=e.top,e.top.next=t,e.top=t)},r._toback=function(t,e){e.bottom!==t&&(Ie(t,e),t.next=e.bottom,t.prev=null,e.bottom.prev=t,e.bottom=t)},r._insertafter=function(t,e,r){Ie(t,r),e==r.top&&(r.top=t),e.next&&(e.next.prev=t),t.next=e.next,t.prev=e,e.next=t},r._insertbefore=function(t,e,r){Ie(t,r),e==r.bottom&&(r.bottom=t),e.prev&&(e.prev.next=t),t.prev=e.prev,e.prev=t,t.next=e},r.toMatrix=function(t,e){var r=Te(t),i={_:{transform:M},getBBox:function(){return r}};return qe(i,e),i.matrix}),qe=(r.transformPath=function(t,e){return xe(t,je(t,e))},r._extractTransform=function(t,e){if(null==e)return t._.transform;e=z(e).replace(/\.{3}|\u2026/g,t._.transform||M);var i=r.parseTransformString(e),n=0,a=0,s=0,o=1,l=1,h=t._,u=new d;if(h.transform=i||[],i)for(var c=0,f=i.length;f>c;c++){var p,g,v,x,y,m=i[c],b=m.length,_=z(m[0]).toLowerCase(),w=m[0]!=_,k=w?u.invert():0;"t"==_&&3==b?w?(p=k.x(0,0),g=k.y(0,0),v=k.x(m[1],m[2]),x=k.y(m[1],m[2]),u.translate(v-p,x-g)):u.translate(m[1],m[2]):"r"==_?2==b?(y=y||t.getBBox(1),u.rotate(m[1],y.x+y.width/2,y.y+y.height/2),n+=m[1]):4==b&&(w?(v=k.x(m[2],m[3]),x=k.y(m[2],m[3]),u.rotate(m[1],v,x)):u.rotate(m[1],m[2],m[3]),n+=m[1]):"s"==_?2==b||3==b?(y=y||t.getBBox(1),u.scale(m[1],m[b-1],y.x+y.width/2,y.y+y.height/2),o*=m[1],l*=m[b-1]):5==b&&(w?(v=k.x(m[3],m[4]),x=k.y(m[3],m[4]),u.scale(m[1],m[2],v,x)):u.scale(m[1],m[2],m[3],m[4]),o*=m[1],l*=m[2]):"m"==_&&7==b&&u.add(m[1],m[2],m[3],m[4],m[5],m[6]),h.dirtyT=1,t.matrix=u}t.matrix=u,h.sx=o,h.sy=l,h.deg=n,h.dx=a=u.e,h.dy=s=u.f,1==o&&1==l&&!n&&h.bbox?(h.bbox.x+=+a,h.bbox.y+=+s):h.dirtyT=1}),De=function(t){var e=t[0];switch(e.toLowerCase()){case"t":return[e,0,0];case"m":return[e,1,0,0,1,0,0];case"r":return 4==t.length?[e,0,t[2],t[3]]:[e,0];case"s":return 5==t.length?[e,1,1,t[3],t[4]]:3==t.length?[e,1,1]:[e,1]}},Oe=r._equaliseTransform=function(t,e){e=z(e).replace(/\.{3}|\u2026/g,t),t=r.parseTransformString(t)||[],e=r.parseTransformString(e)||[];for(var i,n,a,s,o=D(t.length,e.length),l=[],h=[],u=0;o>u;u++){if(a=t[u]||De(e[u]),s=e[u]||De(a),a[0]!=s[0]||"r"==a[0].toLowerCase()&&(a[2]!=s[2]||a[3]!=s[3])||"s"==a[0].toLowerCase()&&(a[3]!=s[3]||a[4]!=s[4]))return;for(l[u]=[],h[u]=[],i=0,n=D(a.length,s.length);n>i;i++)i in a&&(l[u][i]=a[i]),i in s&&(h[u][i]=s[i])}return{from:l,to:h}
};r._getContainer=function(t,e,i,n){var a;return a=null!=n||r.is(t,"object")?t:S.doc.getElementById(t),null!=a?a.tagName?null==e?{container:a,width:a.style.pixelWidth||a.offsetWidth,height:a.style.pixelHeight||a.offsetHeight}:{container:a,width:e,height:i}:{container:1,x:t,y:e,width:i,height:n}:void 0},r.pathToRelative=Ne,r._engine={},r.path2curve=Re,r.matrix=function(t,e,r,i,n,a){return new d(t,e,r,i,n,a)},function(t){function e(t){return t[0]*t[0]+t[1]*t[1]}function i(t){var r=q.sqrt(e(t));t[0]&&(t[0]/=r),t[1]&&(t[1]/=r)}t.add=function(t,e,r,i,n,a){var s,o,l,h,u=[[],[],[]],c=[[this.a,this.c,this.e],[this.b,this.d,this.f],[0,0,1]],f=[[t,r,n],[e,i,a],[0,0,1]];for(t&&t instanceof d&&(f=[[t.a,t.c,t.e],[t.b,t.d,t.f],[0,0,1]]),s=0;3>s;s++)for(o=0;3>o;o++){for(h=0,l=0;3>l;l++)h+=c[s][l]*f[l][o];u[s][o]=h}this.a=u[0][0],this.b=u[1][0],this.c=u[0][1],this.d=u[1][1],this.e=u[0][2],this.f=u[1][2]},t.invert=function(){var t=this,e=t.a*t.d-t.b*t.c;return new d(t.d/e,-t.b/e,-t.c/e,t.a/e,(t.c*t.f-t.d*t.e)/e,(t.b*t.e-t.a*t.f)/e)},t.clone=function(){return new d(this.a,this.b,this.c,this.d,this.e,this.f)},t.translate=function(t,e){this.add(1,0,0,1,t,e)},t.scale=function(t,e,r,i){null==e&&(e=t),(r||i)&&this.add(1,0,0,1,r,i),this.add(t,0,0,e,0,0),(r||i)&&this.add(1,0,0,1,-r,-i)},t.rotate=function(t,e,i){t=r.rad(t),e=e||0,i=i||0;var n=+q.cos(t).toFixed(9),a=+q.sin(t).toFixed(9);this.add(n,a,-a,n,e,i),this.add(1,0,0,1,-e,-i)},t.x=function(t,e){return t*this.a+e*this.c+this.e},t.y=function(t,e){return t*this.b+e*this.d+this.f},t.get=function(t){return+this[z.fromCharCode(97+t)].toFixed(4)},t.toString=function(){return r.svg?"matrix("+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)].join()+")":[this.get(0),this.get(2),this.get(1),this.get(3),0,0].join()},t.toFilter=function(){return"progid:DXImageTransform.Microsoft.Matrix(M11="+this.get(0)+", M12="+this.get(2)+", M21="+this.get(1)+", M22="+this.get(3)+", Dx="+this.get(4)+", Dy="+this.get(5)+", sizingmethod='auto expand')"},t.offset=function(){return[this.e.toFixed(4),this.f.toFixed(4)]},t.split=function(){var t={};t.dx=this.e,t.dy=this.f;var n=[[this.a,this.c],[this.b,this.d]];t.scalex=q.sqrt(e(n[0])),i(n[0]),t.shear=n[0][0]*n[1][0]+n[0][1]*n[1][1],n[1]=[n[1][0]-n[0][0]*t.shear,n[1][1]-n[0][1]*t.shear],t.scaley=q.sqrt(e(n[1])),i(n[1]),t.shear/=t.scaley;var a=-n[0][1],s=n[1][1];return 0>s?(t.rotate=r.deg(q.acos(s)),0>a&&(t.rotate=360-t.rotate)):t.rotate=r.deg(q.asin(a)),t.isSimple=!(+t.shear.toFixed(9)||t.scalex.toFixed(9)!=t.scaley.toFixed(9)&&t.rotate),t.isSuperSimple=!+t.shear.toFixed(9)&&t.scalex.toFixed(9)==t.scaley.toFixed(9)&&!t.rotate,t.noRotation=!+t.shear.toFixed(9)&&!t.rotate,t},t.toTransformString=function(t){var e=t||this[F]();return e.isSimple?(e.scalex=+e.scalex.toFixed(4),e.scaley=+e.scaley.toFixed(4),e.rotate=+e.rotate.toFixed(4),(e.dx||e.dy?"t"+[e.dx,e.dy]:M)+(1!=e.scalex||1!=e.scaley?"s"+[e.scalex,e.scaley,0,0]:M)+(e.rotate?"r"+[e.rotate,0,0]:M)):"m"+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)]}}(d.prototype);var Ve=navigator.userAgent.match(/Version\/(.*?)\s/)||navigator.userAgent.match(/Chrome\/(\d+)/);_.safari="Apple Computer, Inc."==navigator.vendor&&(Ve&&4>Ve[1]||"iP"==navigator.platform.slice(0,2))||"Google Inc."==navigator.vendor&&Ve&&8>Ve[1]?function(){var t=this.rect(-99,-99,this.width+99,this.height+99).attr({stroke:"none"});setTimeout(function(){t.remove()})}:fe;for(var Ye=function(){this.returnValue=!1},Ge=function(){return this.originalEvent.preventDefault()},We=function(){this.cancelBubble=!0},Xe=function(){return this.originalEvent.stopPropagation()},He=function(t){var e=S.doc.documentElement.scrollTop||S.doc.body.scrollTop,r=S.doc.documentElement.scrollLeft||S.doc.body.scrollLeft;return{x:t.clientX+r,y:t.clientY+e}},Ue=function(){return S.doc.addEventListener?function(t,e,r,i){var n=function(t){var e=He(t);return r.call(i,t,e.x,e.y)};if(t.addEventListener(e,n,!1),L&&I[e]){var a=function(e){for(var n=He(e),a=e,s=0,o=e.targetTouches&&e.targetTouches.length;o>s;s++)if(e.targetTouches[s].target==t){e=e.targetTouches[s],e.originalEvent=a,e.preventDefault=Ge,e.stopPropagation=Xe;break}return r.call(i,e,n.x,n.y)};t.addEventListener(I[e],a,!1)}return function(){return t.removeEventListener(e,n,!1),L&&I[e]&&t.removeEventListener(I[e],n,!1),!0}}:S.doc.attachEvent?function(t,e,r,i){var n=function(t){t=t||S.win.event;var e=S.doc.documentElement.scrollTop||S.doc.body.scrollTop,n=S.doc.documentElement.scrollLeft||S.doc.body.scrollLeft,a=t.clientX+n,s=t.clientY+e;return t.preventDefault=t.preventDefault||Ye,t.stopPropagation=t.stopPropagation||We,r.call(i,t,a,s)};t.attachEvent("on"+e,n);var a=function(){return t.detachEvent("on"+e,n),!0};return a}:void 0}(),$e=[],Ze=function(t){for(var r,i=t.clientX,n=t.clientY,a=S.doc.documentElement.scrollTop||S.doc.body.scrollTop,s=S.doc.documentElement.scrollLeft||S.doc.body.scrollLeft,o=$e.length;o--;){if(r=$e[o],L&&t.touches){for(var l,h=t.touches.length;h--;)if(l=t.touches[h],l.identifier==r.el._drag.id){i=l.clientX,n=l.clientY,(t.originalEvent?t.originalEvent:t).preventDefault();break}}else t.preventDefault();var u,c=r.el.node,f=c.nextSibling,p=c.parentNode,d=c.style.display;S.win.opera&&p.removeChild(c),c.style.display="none",u=r.el.paper.getElementByPoint(i,n),c.style.display=d,S.win.opera&&(f?p.insertBefore(c,f):p.appendChild(c)),u&&e("raphael.drag.over."+r.el.id,r.el,u),i+=s,n+=a,e("raphael.drag.move."+r.el.id,r.move_scope||r.el,i-r.el._drag.x,n-r.el._drag.y,i,n,t)}},Qe=function(t){r.unmousemove(Ze).unmouseup(Qe);for(var i,n=$e.length;n--;)i=$e[n],i.el._drag={},e("raphael.drag.end."+i.el.id,i.end_scope||i.start_scope||i.move_scope||i.el,t);$e=[]},Je=r.el={},Ke=R.length;Ke--;)(function(t){r[t]=Je[t]=function(e,i){return r.is(e,"function")&&(this.events=this.events||[],this.events.push({name:t,f:e,unbind:Ue(this.shape||this.node||S.doc,t,e,i||this)})),this},r["un"+t]=Je["un"+t]=function(e){for(var i=this.events||[],n=i.length;n--;)i[n].name!=t||!r.is(e,"undefined")&&i[n].f!=e||(i[n].unbind(),i.splice(n,1),!i.length&&delete this.events);return this}})(R[Ke]);Je.data=function(t,i){var n=ue[this.id]=ue[this.id]||{};if(0==arguments.length)return n;if(1==arguments.length){if(r.is(t,"object")){for(var a in t)t[B](a)&&this.data(a,t[a]);return this}return e("raphael.data.get."+this.id,this,n[t],t),n[t]}return n[t]=i,e("raphael.data.set."+this.id,this,i,t),this},Je.removeData=function(t){return null==t?ue[this.id]={}:ue[this.id]&&delete ue[this.id][t],this},Je.getData=function(){return i(ue[this.id]||{})},Je.hover=function(t,e,r,i){return this.mouseover(t,r).mouseout(e,i||r)},Je.unhover=function(t,e){return this.unmouseover(t).unmouseout(e)};var tr=[];Je.drag=function(t,i,n,a,s,o){function l(l){(l.originalEvent||l).preventDefault();var h=S.doc.documentElement.scrollTop||S.doc.body.scrollTop,u=S.doc.documentElement.scrollLeft||S.doc.body.scrollLeft;this._drag.x=l.clientX+u,this._drag.y=l.clientY+h,this._drag.id=l.identifier,!$e.length&&r.mousemove(Ze).mouseup(Qe),$e.push({el:this,move_scope:a,start_scope:s,end_scope:o}),i&&e.on("raphael.drag.start."+this.id,i),t&&e.on("raphael.drag.move."+this.id,t),n&&e.on("raphael.drag.end."+this.id,n),e("raphael.drag.start."+this.id,s||a||this,l.clientX+u,l.clientY+h,l)}return this._drag={},tr.push({el:this,start:l}),this.mousedown(l),this},Je.onDragOver=function(t){t?e.on("raphael.drag.over."+this.id,t):e.unbind("raphael.drag.over."+this.id)},Je.undrag=function(){for(var t=tr.length;t--;)tr[t].el==this&&(this.unmousedown(tr[t].start),tr.splice(t,1),e.unbind("raphael.drag.*."+this.id));!tr.length&&r.unmousemove(Ze).unmouseup(Qe),$e=[]},_.circle=function(t,e,i){var n=r._engine.circle(this,t||0,e||0,i||0);return this.__set__&&this.__set__.push(n),n},_.rect=function(t,e,i,n,a){var s=r._engine.rect(this,t||0,e||0,i||0,n||0,a||0);return this.__set__&&this.__set__.push(s),s},_.ellipse=function(t,e,i,n){var a=r._engine.ellipse(this,t||0,e||0,i||0,n||0);return this.__set__&&this.__set__.push(a),a},_.path=function(t){t&&!r.is(t,X)&&!r.is(t[0],H)&&(t+=M);var e=r._engine.path(r.format[N](r,arguments),this);return this.__set__&&this.__set__.push(e),e},_.image=function(t,e,i,n,a){var s=r._engine.image(this,t||"about:blank",e||0,i||0,n||0,a||0);return this.__set__&&this.__set__.push(s),s},_.text=function(t,e,i){var n=r._engine.text(this,t||0,e||0,z(i));return this.__set__&&this.__set__.push(n),n},_.set=function(t){!r.is(t,"array")&&(t=Array.prototype.splice.call(arguments,0,arguments.length));var e=new fr(t);return this.__set__&&this.__set__.push(e),e.paper=this,e.type="set",e},_.setStart=function(t){this.__set__=t||this.set()},_.setFinish=function(){var t=this.__set__;return delete this.__set__,t},_.setSize=function(t,e){return r._engine.setSize.call(this,t,e)},_.setViewBox=function(t,e,i,n,a){return r._engine.setViewBox.call(this,t,e,i,n,a)},_.top=_.bottom=null,_.raphael=r;var er=function(t){var e=t.getBoundingClientRect(),r=t.ownerDocument,i=r.body,n=r.documentElement,a=n.clientTop||i.clientTop||0,s=n.clientLeft||i.clientLeft||0,o=e.top+(S.win.pageYOffset||n.scrollTop||i.scrollTop)-a,l=e.left+(S.win.pageXOffset||n.scrollLeft||i.scrollLeft)-s;return{y:o,x:l}};_.getElementByPoint=function(t,e){var r=this,i=r.canvas,n=S.doc.elementFromPoint(t,e);if(S.win.opera&&"svg"==n.tagName){var a=er(i),s=i.createSVGRect();s.x=t-a.x,s.y=e-a.y,s.width=s.height=1;var o=i.getIntersectionList(s,null);o.length&&(n=o[o.length-1])}if(!n)return null;for(;n.parentNode&&n!=i.parentNode&&!n.raphael;)n=n.parentNode;return n==r.canvas.parentNode&&(n=i),n=n&&n.raphael?r.getById(n.raphaelid):null},_.getElementsByBBox=function(t){var e=this.set();return this.forEach(function(i){r.isBBoxIntersect(i.getBBox(),t)&&e.push(i)}),e},_.getById=function(t){for(var e=this.bottom;e;){if(e.id==t)return e;e=e.next}return null},_.forEach=function(t,e){for(var r=this.bottom;r;){if(t.call(e,r)===!1)return this;r=r.next}return this},_.getElementsByPoint=function(t,e){var r=this.set();return this.forEach(function(i){i.isPointInside(t,e)&&r.push(i)}),r},Je.isPointInside=function(t,e){var i=this.realPath=this.realPath||ve[this.type](this);return r.isPointInsidePath(i,t,e)},Je.getBBox=function(t){if(this.removed)return{};var e=this._;return t?((e.dirty||!e.bboxwt)&&(this.realPath=ve[this.type](this),e.bboxwt=Te(this.realPath),e.bboxwt.toString=g,e.dirty=0),e.bboxwt):((e.dirty||e.dirtyT||!e.bbox)&&((e.dirty||!this.realPath)&&(e.bboxwt=0,this.realPath=ve[this.type](this)),e.bbox=Te(xe(this.realPath,this.matrix)),e.bbox.toString=g,e.dirty=e.dirtyT=0),e.bbox)},Je.clone=function(){if(this.removed)return null;var t=this.paper[this.type]().attr(this.attr());return this.__set__&&this.__set__.push(t),t},Je.glow=function(t){if("text"==this.type)return null;t=t||{};var e={width:(t.width||10)+(+this.attr("stroke-width")||1),fill:t.fill||!1,opacity:t.opacity||.5,offsetx:t.offsetx||0,offsety:t.offsety||0,color:t.color||"#000"},r=e.width/2,i=this.paper,n=i.set(),a=this.realPath||ve[this.type](this);a=this.matrix?xe(a,this.matrix):a;for(var s=1;r+1>s;s++)n.push(i.path(a).attr({stroke:e.color,fill:e.fill?e.color:"none","stroke-linejoin":"round","stroke-linecap":"round","stroke-width":+(e.width/r*s).toFixed(3),opacity:+(e.opacity/r).toFixed(3)}));return n.insertBefore(this).translate(e.offsetx,e.offsety)};var rr=function(t,e,i,n,a,s,o,l,c){return null==c?h(t,e,i,n,a,s,o,l):r.findDotsAtSegment(t,e,i,n,a,s,o,l,u(t,e,i,n,a,s,o,l,c))},ir=function(t,e){return function(i,n,a){i=Re(i);for(var s,o,l,h,u,c="",f={},p=0,d=0,g=i.length;g>d;d++){if(l=i[d],"M"==l[0])s=+l[1],o=+l[2];else{if(h=rr(s,o,l[1],l[2],l[3],l[4],l[5],l[6]),p+h>n){if(e&&!f.start){if(u=rr(s,o,l[1],l[2],l[3],l[4],l[5],l[6],n-p),c+=["C"+u.start.x,u.start.y,u.m.x,u.m.y,u.x,u.y],a)return c;f.start=c,c=["M"+u.x,u.y+"C"+u.n.x,u.n.y,u.end.x,u.end.y,l[5],l[6]].join(),p+=h,s=+l[5],o=+l[6];continue}if(!t&&!e)return u=rr(s,o,l[1],l[2],l[3],l[4],l[5],l[6],n-p),{x:u.x,y:u.y,alpha:u.alpha}}p+=h,s=+l[5],o=+l[6]}c+=l.shift()+l}return f.end=c,u=t?p:e?f:r.findDotsAtSegment(s,o,l[0],l[1],l[2],l[3],l[4],l[5],1),u.alpha&&(u={x:u.x,y:u.y,alpha:u.alpha}),u}},nr=ir(1),ar=ir(),sr=ir(0,1);r.getTotalLength=nr,r.getPointAtLength=ar,r.getSubpath=function(t,e,r){if(1e-6>this.getTotalLength(t)-r)return sr(t,e).end;var i=sr(t,r,1);return e?sr(i,e).end:i},Je.getTotalLength=function(){var t=this.getPath();if(t)return this.node.getTotalLength?this.node.getTotalLength():nr(t)},Je.getPointAtLength=function(t){var e=this.getPath();if(e)return ar(e,t)},Je.getPath=function(){var t,e=r._getPath[this.type];if("text"!=this.type&&"set"!=this.type)return e&&(t=e(this)),t},Je.getSubpath=function(t,e){var i=this.getPath();if(i)return r.getSubpath(i,t,e)};var or=r.easing_formulas={linear:function(t){return t},"<":function(t){return Y(t,1.7)},">":function(t){return Y(t,.48)},"<>":function(t){var e=.48-t/1.04,r=q.sqrt(.1734+e*e),i=r-e,n=Y(V(i),1/3)*(0>i?-1:1),a=-r-e,s=Y(V(a),1/3)*(0>a?-1:1),o=n+s+.5;return 3*(1-o)*o*o+o*o*o},backIn:function(t){var e=1.70158;return t*t*((e+1)*t-e)},backOut:function(t){t-=1;var e=1.70158;return t*t*((e+1)*t+e)+1},elastic:function(t){return t==!!t?t:Y(2,-10*t)*q.sin((t-.075)*2*G/.3)+1},bounce:function(t){var e,r=7.5625,i=2.75;return 1/i>t?e=r*t*t:2/i>t?(t-=1.5/i,e=r*t*t+.75):2.5/i>t?(t-=2.25/i,e=r*t*t+.9375):(t-=2.625/i,e=r*t*t+.984375),e}};or.easeIn=or["ease-in"]=or["<"],or.easeOut=or["ease-out"]=or[">"],or.easeInOut=or["ease-in-out"]=or["<>"],or["back-in"]=or.backIn,or["back-out"]=or.backOut;var lr=[],hr=t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||t.msRequestAnimationFrame||function(t){setTimeout(t,16)},ur=function(){for(var t=+new Date,i=0;lr.length>i;i++){var n=lr[i];if(!n.el.removed&&!n.paused){var a,s,o=t-n.start,l=n.ms,h=n.easing,u=n.from,c=n.diff,f=n.to,p=(n.t,n.el),d={},g={};if(n.initstatus?(o=(n.initstatus*n.anim.top-n.prev)/(n.percent-n.prev)*l,n.status=n.initstatus,delete n.initstatus,n.stop&&lr.splice(i--,1)):n.status=(n.prev+(n.percent-n.prev)*(o/l))/n.anim.top,!(0>o))if(l>o){var v=h(o/l);for(var x in u)if(u[B](x)){switch(ie[x]){case W:a=+u[x]+v*l*c[x];break;case"colour":a="rgb("+[cr(J(u[x].r+v*l*c[x].r)),cr(J(u[x].g+v*l*c[x].g)),cr(J(u[x].b+v*l*c[x].b))].join(",")+")";break;case"path":a=[];for(var m=0,b=u[x].length;b>m;m++){a[m]=[u[x][m][0]];for(var _=1,w=u[x][m].length;w>_;_++)a[m][_]=+u[x][m][_]+v*l*c[x][m][_];a[m]=a[m].join(P)}a=a.join(P);break;case"transform":if(c[x].real)for(a=[],m=0,b=u[x].length;b>m;m++)for(a[m]=[u[x][m][0]],_=1,w=u[x][m].length;w>_;_++)a[m][_]=u[x][m][_]+v*l*c[x][m][_];else{var k=function(t){return+u[x][t]+v*l*c[x][t]};a=[["m",k(0),k(1),k(2),k(3),k(4),k(5)]]}break;case"csv":if("clip-rect"==x)for(a=[],m=4;m--;)a[m]=+u[x][m]+v*l*c[x][m];break;default:var C=[][E](u[x]);for(a=[],m=p.paper.customAttributes[x].length;m--;)a[m]=+C[m]+v*l*c[x][m]}d[x]=a}p.attr(d),function(t,r,i){setTimeout(function(){e("raphael.anim.frame."+t,r,i)})}(p.id,p,n.anim)}else{if(function(t,i,n){setTimeout(function(){e("raphael.anim.frame."+i.id,i,n),e("raphael.anim.finish."+i.id,i,n),r.is(t,"function")&&t.call(i)})}(n.callback,p,n.anim),p.attr(f),lr.splice(i--,1),n.repeat>1&&!n.next){for(s in f)f[B](s)&&(g[s]=n.totalOrigin[s]);n.el.attr(g),y(n.anim,n.el,n.anim.percents[0],null,n.totalOrigin,n.repeat-1)}n.next&&!n.stop&&y(n.anim,n.el,n.next,null,n.totalOrigin,n.repeat)}}}r.svg&&p&&p.paper&&p.paper.safari(),lr.length&&hr(ur)},cr=function(t){return t>255?255:0>t?0:t};Je.animateWith=function(t,e,i,n,a,s){var o=this;if(o.removed)return s&&s.call(o),o;var l=i instanceof x?i:r.animation(i,n,a,s);y(l,o,l.percents[0],null,o.attr());for(var h=0,u=lr.length;u>h;h++)if(lr[h].anim==e&&lr[h].el==t){lr[u-1].start=lr[h].start;break}return o},Je.onAnimation=function(t){return t?e.on("raphael.anim.frame."+this.id,t):e.unbind("raphael.anim.frame."+this.id),this},x.prototype.delay=function(t){var e=new x(this.anim,this.ms);return e.times=this.times,e.del=+t||0,e},x.prototype.repeat=function(t){var e=new x(this.anim,this.ms);return e.del=this.del,e.times=q.floor(D(t,0))||1,e},r.animation=function(t,e,i,n){if(t instanceof x)return t;(r.is(i,"function")||!i)&&(n=n||i||null,i=null),t=Object(t),e=+e||0;var a,s,o={};for(s in t)t[B](s)&&K(s)!=s&&K(s)+"%"!=s&&(a=!0,o[s]=t[s]);return a?(i&&(o.easing=i),n&&(o.callback=n),new x({100:o},e)):new x(t,e)},Je.animate=function(t,e,i,n){var a=this;if(a.removed)return n&&n.call(a),a;var s=t instanceof x?t:r.animation(t,e,i,n);return y(s,a,s.percents[0],null,a.attr()),a},Je.setTime=function(t,e){return t&&null!=e&&this.status(t,O(e,t.ms)/t.ms),this},Je.status=function(t,e){var r,i,n=[],a=0;if(null!=e)return y(t,this,-1,O(e,1)),this;for(r=lr.length;r>a;a++)if(i=lr[a],i.el.id==this.id&&(!t||i.anim==t)){if(t)return i.status;n.push({anim:i.anim,status:i.status})}return t?0:n},Je.pause=function(t){for(var r=0;lr.length>r;r++)lr[r].el.id!=this.id||t&&lr[r].anim!=t||e("raphael.anim.pause."+this.id,this,lr[r].anim)!==!1&&(lr[r].paused=!0);return this},Je.resume=function(t){for(var r=0;lr.length>r;r++)if(lr[r].el.id==this.id&&(!t||lr[r].anim==t)){var i=lr[r];e("raphael.anim.resume."+this.id,this,i.anim)!==!1&&(delete i.paused,this.status(i.anim,i.status))}return this},Je.stop=function(t){for(var r=0;lr.length>r;r++)lr[r].el.id!=this.id||t&&lr[r].anim!=t||e("raphael.anim.stop."+this.id,this,lr[r].anim)!==!1&&lr.splice(r--,1);return this},e.on("raphael.remove",m),e.on("raphael.clear",m),Je.toString=function(){return"Raphaël’s object"};var fr=function(t){if(this.items=[],this.length=0,this.type="set",t)for(var e=0,r=t.length;r>e;e++)!t[e]||t[e].constructor!=Je.constructor&&t[e].constructor!=fr||(this[this.items.length]=this.items[this.items.length]=t[e],this.length++)},pr=fr.prototype;pr.push=function(){for(var t,e,r=0,i=arguments.length;i>r;r++)t=arguments[r],!t||t.constructor!=Je.constructor&&t.constructor!=fr||(e=this.items.length,this[e]=this.items[e]=t,this.length++);return this},pr.pop=function(){return this.length&&delete this[this.length--],this.items.pop()},pr.forEach=function(t,e){for(var r=0,i=this.items.length;i>r;r++)if(t.call(e,this.items[r],r)===!1)return this;return this};for(var dr in Je)Je[B](dr)&&(pr[dr]=function(t){return function(){var e=arguments;return this.forEach(function(r){r[t][N](r,e)})}}(dr));return pr.attr=function(t,e){if(t&&r.is(t,H)&&r.is(t[0],"object"))for(var i=0,n=t.length;n>i;i++)this.items[i].attr(t[i]);else for(var a=0,s=this.items.length;s>a;a++)this.items[a].attr(t,e);return this},pr.clear=function(){for(;this.length;)this.pop()},pr.splice=function(t,e){t=0>t?D(this.length+t,0):t,e=D(0,O(this.length-t,e));var r,i=[],n=[],a=[];for(r=2;arguments.length>r;r++)a.push(arguments[r]);for(r=0;e>r;r++)n.push(this[t+r]);for(;this.length-t>r;r++)i.push(this[t+r]);var s=a.length;for(r=0;s+i.length>r;r++)this.items[t+r]=this[t+r]=s>r?a[r]:i[r-s];for(r=this.items.length=this.length-=e-s;this[r];)delete this[r++];return new fr(n)},pr.exclude=function(t){for(var e=0,r=this.length;r>e;e++)if(this[e]==t)return this.splice(e,1),!0},pr.animate=function(t,e,i,n){(r.is(i,"function")||!i)&&(n=i||null);var a,s,o=this.items.length,l=o,h=this;if(!o)return this;n&&(s=function(){!--o&&n.call(h)}),i=r.is(i,X)?i:s;var u=r.animation(t,e,i,s);for(a=this.items[--l].animate(u);l--;)this.items[l]&&!this.items[l].removed&&this.items[l].animateWith(a,u,u),this.items[l]&&!this.items[l].removed||o--;return this},pr.insertAfter=function(t){for(var e=this.items.length;e--;)this.items[e].insertAfter(t);return this},pr.getBBox=function(){for(var t=[],e=[],r=[],i=[],n=this.items.length;n--;)if(!this.items[n].removed){var a=this.items[n].getBBox();t.push(a.x),e.push(a.y),r.push(a.x+a.width),i.push(a.y+a.height)}return t=O[N](0,t),e=O[N](0,e),r=D[N](0,r),i=D[N](0,i),{x:t,y:e,x2:r,y2:i,width:r-t,height:i-e}},pr.clone=function(t){t=this.paper.set();for(var e=0,r=this.items.length;r>e;e++)t.push(this.items[e].clone());return t},pr.toString=function(){return"Raphaël‘s set"},pr.glow=function(t){var e=this.paper.set();return this.forEach(function(r){var i=r.glow(t);null!=i&&i.forEach(function(t){e.push(t)})}),e},pr.isPointInside=function(t,e){var r=!1;return this.forEach(function(i){return i.isPointInside(t,e)?(console.log("runned"),r=!0,!1):void 0}),r},r.registerFont=function(t){if(!t.face)return t;this.fonts=this.fonts||{};var e={w:t.w,face:{},glyphs:{}},r=t.face["font-family"];for(var i in t.face)t.face[B](i)&&(e.face[i]=t.face[i]);if(this.fonts[r]?this.fonts[r].push(e):this.fonts[r]=[e],!t.svg){e.face["units-per-em"]=te(t.face["units-per-em"],10);for(var n in t.glyphs)if(t.glyphs[B](n)){var a=t.glyphs[n];if(e.glyphs[n]={w:a.w,k:{},d:a.d&&"M"+a.d.replace(/[mlcxtrv]/g,function(t){return{l:"L",c:"C",x:"z",t:"m",r:"l",v:"c"}[t]||"M"})+"z"},a.k)for(var s in a.k)a[B](s)&&(e.glyphs[n].k[s]=a.k[s])}}return t},_.getFont=function(t,e,i,n){if(n=n||"normal",i=i||"normal",e=+e||{normal:400,bold:700,lighter:300,bolder:800}[e]||400,r.fonts){var a=r.fonts[t];if(!a){var s=RegExp("(^|\\s)"+t.replace(/[^\w\d\s+!~.:_-]/g,M)+"(\\s|$)","i");for(var o in r.fonts)if(r.fonts[B](o)&&s.test(o)){a=r.fonts[o];break}}var l;if(a)for(var h=0,u=a.length;u>h&&(l=a[h],l.face["font-weight"]!=e||l.face["font-style"]!=i&&l.face["font-style"]||l.face["font-stretch"]!=n);h++);return l}},_.print=function(t,e,i,n,a,s,o,l){s=s||"middle",o=D(O(o||0,1),-1),l=D(O(l||1,3),1);var h,u=z(i)[F](M),c=0,f=0,p=M;if(r.is(n,"string")&&(n=this.getFont(n)),n){h=(a||16)/n.face["units-per-em"];for(var d=n.face.bbox[F](w),g=+d[0],v=d[3]-d[1],x=0,y=+d[1]+("baseline"==s?v+ +n.face.descent:v/2),m=0,b=u.length;b>m;m++){if("\n"==u[m])c=0,k=0,f=0,x+=v*l;else{var _=f&&n.glyphs[u[m-1]]||{},k=n.glyphs[u[m]];c+=f?(_.w||n.w)+(_.k&&_.k[u[m]]||0)+n.w*o:0,f=1}k&&k.d&&(p+=r.transformPath(k.d,["t",c*h,x*h,"s",h,h,g,y,"t",(t-g)/h,(e-y)/h]))}}return this.path(p).attr({fill:"#000",stroke:"none"})},_.add=function(t){if(r.is(t,"array"))for(var e,i=this.set(),n=0,a=t.length;a>n;n++)e=t[n]||{},k[B](e.type)&&i.push(this[e.type]().attr(e));return i},r.format=function(t,e){var i=r.is(e,H)?[0][E](e):arguments;return t&&r.is(t,X)&&i.length-1&&(t=t.replace(C,function(t,e){return null==i[++e]?M:i[e]})),t||M},r.fullfill=function(){var t=/\{([^\}]+)\}/g,e=/(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,r=function(t,r,i){var n=i;return r.replace(e,function(t,e,r,i,a){e=e||i,n&&(e in n&&(n=n[e]),"function"==typeof n&&a&&(n=n()))}),n=(null==n||n==i?t:n)+""};return function(e,i){return(e+"").replace(t,function(t,e){return r(t,e,i)})}}(),r.ninja=function(){return T.was?S.win.Raphael=T.is:delete Raphael,r},r.st=pr,function(t,e,i){function n(){/in/.test(t.readyState)?setTimeout(n,9):r.eve("raphael.DOMload")}null==t.readyState&&t.addEventListener&&(t.addEventListener(e,i=function(){t.removeEventListener(e,i,!1),t.readyState="complete"},!1),t.readyState="loading"),n()}(document,"DOMContentLoaded"),e.on("raphael.DOMload",function(){b=!0}),function(){if(r.svg){var t="hasOwnProperty",e=String,i=parseFloat,n=parseInt,a=Math,s=a.max,o=a.abs,l=a.pow,h=/[, ]+/,u=r.eve,c="",f=" ",p="http://www.w3.org/1999/xlink",d={block:"M5,0 0,2.5 5,5z",classic:"M5,0 0,2.5 5,5 3.5,3 3.5,2z",diamond:"M2.5,0 5,2.5 2.5,5 0,2.5z",open:"M6,1 1,3.5 6,6",oval:"M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"},g={};r.toString=function(){return"Your browser supports SVG.\nYou are running Raphaël "+this.version};var v=function(i,n){if(n){"string"==typeof i&&(i=v(i));for(var a in n)n[t](a)&&("xlink:"==a.substring(0,6)?i.setAttributeNS(p,a.substring(6),e(n[a])):i.setAttribute(a,e(n[a])))}else i=r._g.doc.createElementNS("http://www.w3.org/2000/svg",i),i.style&&(i.style.webkitTapHighlightColor="rgba(0,0,0,0)");return i},x=function(t,n){var h="linear",u=t.id+n,f=.5,p=.5,d=t.node,g=t.paper,x=d.style,y=r._g.doc.getElementById(u);if(!y){if(n=e(n).replace(r._radial_gradient,function(t,e,r){if(h="radial",e&&r){f=i(e),p=i(r);var n=2*(p>.5)-1;l(f-.5,2)+l(p-.5,2)>.25&&(p=a.sqrt(.25-l(f-.5,2))*n+.5)&&.5!=p&&(p=p.toFixed(5)-1e-5*n)}return c}),n=n.split(/\s*\-\s*/),"linear"==h){var m=n.shift();if(m=-i(m),isNaN(m))return null;var b=[0,0,a.cos(r.rad(m)),a.sin(r.rad(m))],_=1/(s(o(b[2]),o(b[3]))||1);b[2]*=_,b[3]*=_,0>b[2]&&(b[0]=-b[2],b[2]=0),0>b[3]&&(b[1]=-b[3],b[3]=0)}var w=r._parseDots(n);if(!w)return null;if(u=u.replace(/[\(\)\s,\xb0#]/g,"_"),t.gradient&&u!=t.gradient.id&&(g.defs.removeChild(t.gradient),delete t.gradient),!t.gradient){y=v(h+"Gradient",{id:u}),t.gradient=y,v(y,"radial"==h?{fx:f,fy:p}:{x1:b[0],y1:b[1],x2:b[2],y2:b[3],gradientTransform:t.matrix.invert()}),g.defs.appendChild(y);for(var k=0,C=w.length;C>k;k++)y.appendChild(v("stop",{offset:w[k].offset?w[k].offset:k?"100%":"0%","stop-color":w[k].color||"#fff"}))}}return v(d,{fill:"url(#"+u+")",opacity:1,"fill-opacity":1}),x.fill=c,x.opacity=1,x.fillOpacity=1,1},y=function(t){var e=t.getBBox(1);v(t.pattern,{patternTransform:t.matrix.invert()+" translate("+e.x+","+e.y+")"})},m=function(i,n,a){if("path"==i.type){for(var s,o,l,h,u,f=e(n).toLowerCase().split("-"),p=i.paper,x=a?"end":"start",y=i.node,m=i.attrs,b=m["stroke-width"],_=f.length,w="classic",k=3,C=3,B=5;_--;)switch(f[_]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":w=f[_];break;case"wide":C=5;break;case"narrow":C=2;break;case"long":k=5;break;case"short":k=2}if("open"==w?(k+=2,C+=2,B+=2,l=1,h=a?4:1,u={fill:"none",stroke:m.stroke}):(h=l=k/2,u={fill:m.stroke,stroke:"none"}),i._.arrows?a?(i._.arrows.endPath&&g[i._.arrows.endPath]--,i._.arrows.endMarker&&g[i._.arrows.endMarker]--):(i._.arrows.startPath&&g[i._.arrows.startPath]--,i._.arrows.startMarker&&g[i._.arrows.startMarker]--):i._.arrows={},"none"!=w){var S="raphael-marker-"+w,T="raphael-marker-"+x+w+k+C;r._g.doc.getElementById(S)?g[S]++:(p.defs.appendChild(v(v("path"),{"stroke-linecap":"round",d:d[w],id:S})),g[S]=1);var A,N=r._g.doc.getElementById(T);N?(g[T]++,A=N.getElementsByTagName("use")[0]):(N=v(v("marker"),{id:T,markerHeight:C,markerWidth:k,orient:"auto",refX:h,refY:C/2}),A=v(v("use"),{"xlink:href":"#"+S,transform:(a?"rotate(180 "+k/2+" "+C/2+") ":c)+"scale("+k/B+","+C/B+")","stroke-width":(1/((k/B+C/B)/2)).toFixed(4)}),N.appendChild(A),p.defs.appendChild(N),g[T]=1),v(A,u);var E=l*("diamond"!=w&&"oval"!=w);a?(s=i._.arrows.startdx*b||0,o=r.getTotalLength(m.path)-E*b):(s=E*b,o=r.getTotalLength(m.path)-(i._.arrows.enddx*b||0)),u={},u["marker-"+x]="url(#"+T+")",(o||s)&&(u.d=r.getSubpath(m.path,s,o)),v(y,u),i._.arrows[x+"Path"]=S,i._.arrows[x+"Marker"]=T,i._.arrows[x+"dx"]=E,i._.arrows[x+"Type"]=w,i._.arrows[x+"String"]=n}else a?(s=i._.arrows.startdx*b||0,o=r.getTotalLength(m.path)-s):(s=0,o=r.getTotalLength(m.path)-(i._.arrows.enddx*b||0)),i._.arrows[x+"Path"]&&v(y,{d:r.getSubpath(m.path,s,o)}),delete i._.arrows[x+"Path"],delete i._.arrows[x+"Marker"],delete i._.arrows[x+"dx"],delete i._.arrows[x+"Type"],delete i._.arrows[x+"String"];for(u in g)if(g[t](u)&&!g[u]){var L=r._g.doc.getElementById(u);L&&L.parentNode.removeChild(L)}}},b={"":[0],none:[0],"-":[3,1],".":[1,1],"-.":[3,1,1,1],"-..":[3,1,1,1,1,1],". ":[1,3],"- ":[4,3],"--":[8,3],"- .":[4,3,1,3],"--.":[8,3,1,3],"--..":[8,3,1,3,1,3]},_=function(t,r,i){if(r=b[e(r).toLowerCase()]){for(var n=t.attrs["stroke-width"]||"1",a={round:n,square:n,butt:0}[t.attrs["stroke-linecap"]||i["stroke-linecap"]]||0,s=[],o=r.length;o--;)s[o]=r[o]*n+(o%2?1:-1)*a;v(t.node,{"stroke-dasharray":s.join(",")})}},w=function(i,a){var l=i.node,u=i.attrs,f=l.style.visibility;l.style.visibility="hidden";for(var d in a)if(a[t](d)){if(!r._availableAttrs[t](d))continue;var g=a[d];switch(u[d]=g,d){case"blur":i.blur(g);break;case"href":case"title":case"target":var b=l.parentNode;if("a"!=b.tagName.toLowerCase()){var w=v("a");b.insertBefore(w,l),w.appendChild(l),b=w}"target"==d?b.setAttributeNS(p,"show","blank"==g?"new":g):b.setAttributeNS(p,d,g);break;case"cursor":l.style.cursor=g;break;case"transform":i.transform(g);break;case"arrow-start":m(i,g);break;case"arrow-end":m(i,g,1);break;case"clip-rect":var k=e(g).split(h);if(4==k.length){i.clip&&i.clip.parentNode.parentNode.removeChild(i.clip.parentNode);var B=v("clipPath"),S=v("rect");B.id=r.createUUID(),v(S,{x:k[0],y:k[1],width:k[2],height:k[3]}),B.appendChild(S),i.paper.defs.appendChild(B),v(l,{"clip-path":"url(#"+B.id+")"}),i.clip=S}if(!g){var T=l.getAttribute("clip-path");if(T){var A=r._g.doc.getElementById(T.replace(/(^url\(#|\)$)/g,c));A&&A.parentNode.removeChild(A),v(l,{"clip-path":c}),delete i.clip}}break;case"path":"path"==i.type&&(v(l,{d:g?u.path=r._pathToAbsolute(g):"M0,0"}),i._.dirty=1,i._.arrows&&("startString"in i._.arrows&&m(i,i._.arrows.startString),"endString"in i._.arrows&&m(i,i._.arrows.endString,1)));break;case"width":if(l.setAttribute(d,g),i._.dirty=1,!u.fx)break;d="x",g=u.x;case"x":u.fx&&(g=-u.x-(u.width||0));case"rx":if("rx"==d&&"rect"==i.type)break;case"cx":l.setAttribute(d,g),i.pattern&&y(i),i._.dirty=1;break;case"height":if(l.setAttribute(d,g),i._.dirty=1,!u.fy)break;d="y",g=u.y;case"y":u.fy&&(g=-u.y-(u.height||0));case"ry":if("ry"==d&&"rect"==i.type)break;case"cy":l.setAttribute(d,g),i.pattern&&y(i),i._.dirty=1;break;case"r":"rect"==i.type?v(l,{rx:g,ry:g}):l.setAttribute(d,g),i._.dirty=1;break;case"src":"image"==i.type&&l.setAttributeNS(p,"href",g);break;case"stroke-width":(1!=i._.sx||1!=i._.sy)&&(g/=s(o(i._.sx),o(i._.sy))||1),i.paper._vbSize&&(g*=i.paper._vbSize),l.setAttribute(d,g),u["stroke-dasharray"]&&_(i,u["stroke-dasharray"],a),i._.arrows&&("startString"in i._.arrows&&m(i,i._.arrows.startString),"endString"in i._.arrows&&m(i,i._.arrows.endString,1));break;case"stroke-dasharray":_(i,g,a);break;case"fill":var N=e(g).match(r._ISURL);if(N){B=v("pattern");var E=v("image");B.id=r.createUUID(),v(B,{x:0,y:0,patternUnits:"userSpaceOnUse",height:1,width:1}),v(E,{x:0,y:0,"xlink:href":N[1]}),B.appendChild(E),function(t){r._preload(N[1],function(){var e=this.offsetWidth,r=this.offsetHeight;v(t,{width:e,height:r}),v(E,{width:e,height:r}),i.paper.safari()})}(B),i.paper.defs.appendChild(B),v(l,{fill:"url(#"+B.id+")"}),i.pattern=B,i.pattern&&y(i);break}var L=r.getRGB(g);if(L.error){if(("circle"==i.type||"ellipse"==i.type||"r"!=e(g).charAt())&&x(i,g)){if("opacity"in u||"fill-opacity"in u){var M=r._g.doc.getElementById(l.getAttribute("fill").replace(/^url\(#|\)$/g,c));if(M){var P=M.getElementsByTagName("stop");v(P[P.length-1],{"stop-opacity":("opacity"in u?u.opacity:1)*("fill-opacity"in u?u["fill-opacity"]:1)})}}u.gradient=g,u.fill="none";break}}else delete a.gradient,delete u.gradient,!r.is(u.opacity,"undefined")&&r.is(a.opacity,"undefined")&&v(l,{opacity:u.opacity}),!r.is(u["fill-opacity"],"undefined")&&r.is(a["fill-opacity"],"undefined")&&v(l,{"fill-opacity":u["fill-opacity"]});L[t]("opacity")&&v(l,{"fill-opacity":L.opacity>1?L.opacity/100:L.opacity});case"stroke":L=r.getRGB(g),l.setAttribute(d,L.hex),"stroke"==d&&L[t]("opacity")&&v(l,{"stroke-opacity":L.opacity>1?L.opacity/100:L.opacity}),"stroke"==d&&i._.arrows&&("startString"in i._.arrows&&m(i,i._.arrows.startString),"endString"in i._.arrows&&m(i,i._.arrows.endString,1));break;case"gradient":("circle"==i.type||"ellipse"==i.type||"r"!=e(g).charAt())&&x(i,g);break;case"opacity":u.gradient&&!u[t]("stroke-opacity")&&v(l,{"stroke-opacity":g>1?g/100:g});case"fill-opacity":if(u.gradient){M=r._g.doc.getElementById(l.getAttribute("fill").replace(/^url\(#|\)$/g,c)),M&&(P=M.getElementsByTagName("stop"),v(P[P.length-1],{"stop-opacity":g}));break}default:"font-size"==d&&(g=n(g,10)+"px");var z=d.replace(/(\-.)/g,function(t){return t.substring(1).toUpperCase()});l.style[z]=g,i._.dirty=1,l.setAttribute(d,g)}}C(i,a),l.style.visibility=f},k=1.2,C=function(i,a){if("text"==i.type&&(a[t]("text")||a[t]("font")||a[t]("font-size")||a[t]("x")||a[t]("y"))){var s=i.attrs,o=i.node,l=o.firstChild?n(r._g.doc.defaultView.getComputedStyle(o.firstChild,c).getPropertyValue("font-size"),10):10;if(a[t]("text")){for(s.text=a.text;o.firstChild;)o.removeChild(o.firstChild);for(var h,u=e(a.text).split("\n"),f=[],p=0,d=u.length;d>p;p++)h=v("tspan"),p&&v(h,{dy:l*k,x:s.x}),h.appendChild(r._g.doc.createTextNode(u[p])),o.appendChild(h),f[p]=h
}else for(f=o.getElementsByTagName("tspan"),p=0,d=f.length;d>p;p++)p?v(f[p],{dy:l*k,x:s.x}):v(f[0],{dy:0});v(o,{x:s.x,y:s.y}),i._.dirty=1;var g=i._getBBox(),x=s.y-(g.y+g.height/2);x&&r.is(x,"finite")&&v(f[0],{dy:x})}},B=function(t,e){this[0]=this.node=t,t.raphael=!0,this.id=r._oid++,t.raphaelid=this.id,this.matrix=r.matrix(),this.realPath=null,this.paper=e,this.attrs=this.attrs||{},this._={transform:[],sx:1,sy:1,deg:0,dx:0,dy:0,dirty:1},!e.bottom&&(e.bottom=this),this.prev=e.top,e.top&&(e.top.next=this),e.top=this,this.next=null},S=r.el;B.prototype=S,S.constructor=B,r._engine.path=function(t,e){var r=v("path");e.canvas&&e.canvas.appendChild(r);var i=new B(r,e);return i.type="path",w(i,{fill:"none",stroke:"#000",path:t}),i},S.rotate=function(t,r,n){if(this.removed)return this;if(t=e(t).split(h),t.length-1&&(r=i(t[1]),n=i(t[2])),t=i(t[0]),null==n&&(r=n),null==r||null==n){var a=this.getBBox(1);r=a.x+a.width/2,n=a.y+a.height/2}return this.transform(this._.transform.concat([["r",t,r,n]])),this},S.scale=function(t,r,n,a){if(this.removed)return this;if(t=e(t).split(h),t.length-1&&(r=i(t[1]),n=i(t[2]),a=i(t[3])),t=i(t[0]),null==r&&(r=t),null==a&&(n=a),null==n||null==a)var s=this.getBBox(1);return n=null==n?s.x+s.width/2:n,a=null==a?s.y+s.height/2:a,this.transform(this._.transform.concat([["s",t,r,n,a]])),this},S.translate=function(t,r){return this.removed?this:(t=e(t).split(h),t.length-1&&(r=i(t[1])),t=i(t[0])||0,r=+r||0,this.transform(this._.transform.concat([["t",t,r]])),this)},S.transform=function(e){var i=this._;if(null==e)return i.transform;if(r._extractTransform(this,e),this.clip&&v(this.clip,{transform:this.matrix.invert()}),this.pattern&&y(this),this.node&&v(this.node,{transform:this.matrix}),1!=i.sx||1!=i.sy){var n=this.attrs[t]("stroke-width")?this.attrs["stroke-width"]:1;this.attr({"stroke-width":n})}return this},S.hide=function(){return!this.removed&&this.paper.safari(this.node.style.display="none"),this},S.show=function(){return!this.removed&&this.paper.safari(this.node.style.display=""),this},S.remove=function(){if(!this.removed&&this.node.parentNode){var t=this.paper;t.__set__&&t.__set__.exclude(this),u.unbind("raphael.*.*."+this.id),this.gradient&&t.defs.removeChild(this.gradient),r._tear(this,t),"a"==this.node.parentNode.tagName.toLowerCase()?this.node.parentNode.parentNode.removeChild(this.node.parentNode):this.node.parentNode.removeChild(this.node);for(var e in this)this[e]="function"==typeof this[e]?r._removedFactory(e):null;this.removed=!0}},S._getBBox=function(){if("none"==this.node.style.display){this.show();var t=!0}var e={};try{e=this.node.getBBox()}catch(r){}finally{e=e||{}}return t&&this.hide(),e},S.attr=function(e,i){if(this.removed)return this;if(null==e){var n={};for(var a in this.attrs)this.attrs[t](a)&&(n[a]=this.attrs[a]);return n.gradient&&"none"==n.fill&&(n.fill=n.gradient)&&delete n.gradient,n.transform=this._.transform,n}if(null==i&&r.is(e,"string")){if("fill"==e&&"none"==this.attrs.fill&&this.attrs.gradient)return this.attrs.gradient;if("transform"==e)return this._.transform;for(var s=e.split(h),o={},l=0,c=s.length;c>l;l++)e=s[l],o[e]=e in this.attrs?this.attrs[e]:r.is(this.paper.customAttributes[e],"function")?this.paper.customAttributes[e].def:r._availableAttrs[e];return c-1?o:o[s[0]]}if(null==i&&r.is(e,"array")){for(o={},l=0,c=e.length;c>l;l++)o[e[l]]=this.attr(e[l]);return o}if(null!=i){var f={};f[e]=i}else null!=e&&r.is(e,"object")&&(f=e);for(var p in f)u("raphael.attr."+p+"."+this.id,this,f[p]);for(p in this.paper.customAttributes)if(this.paper.customAttributes[t](p)&&f[t](p)&&r.is(this.paper.customAttributes[p],"function")){var d=this.paper.customAttributes[p].apply(this,[].concat(f[p]));this.attrs[p]=f[p];for(var g in d)d[t](g)&&(f[g]=d[g])}return w(this,f),this},S.toFront=function(){if(this.removed)return this;"a"==this.node.parentNode.tagName.toLowerCase()?this.node.parentNode.parentNode.appendChild(this.node.parentNode):this.node.parentNode.appendChild(this.node);var t=this.paper;return t.top!=this&&r._tofront(this,t),this},S.toBack=function(){if(this.removed)return this;var t=this.node.parentNode;return"a"==t.tagName.toLowerCase()?t.parentNode.insertBefore(this.node.parentNode,this.node.parentNode.parentNode.firstChild):t.firstChild!=this.node&&t.insertBefore(this.node,this.node.parentNode.firstChild),r._toback(this,this.paper),this.paper,this},S.insertAfter=function(t){if(this.removed)return this;var e=t.node||t[t.length-1].node;return e.nextSibling?e.parentNode.insertBefore(this.node,e.nextSibling):e.parentNode.appendChild(this.node),r._insertafter(this,t,this.paper),this},S.insertBefore=function(t){if(this.removed)return this;var e=t.node||t[0].node;return e.parentNode.insertBefore(this.node,e),r._insertbefore(this,t,this.paper),this},S.blur=function(t){var e=this;if(0!==+t){var i=v("filter"),n=v("feGaussianBlur");e.attrs.blur=t,i.id=r.createUUID(),v(n,{stdDeviation:+t||1.5}),i.appendChild(n),e.paper.defs.appendChild(i),e._blur=i,v(e.node,{filter:"url(#"+i.id+")"})}else e._blur&&(e._blur.parentNode.removeChild(e._blur),delete e._blur,delete e.attrs.blur),e.node.removeAttribute("filter");return e},r._engine.circle=function(t,e,r,i){var n=v("circle");t.canvas&&t.canvas.appendChild(n);var a=new B(n,t);return a.attrs={cx:e,cy:r,r:i,fill:"none",stroke:"#000"},a.type="circle",v(n,a.attrs),a},r._engine.rect=function(t,e,r,i,n,a){var s=v("rect");t.canvas&&t.canvas.appendChild(s);var o=new B(s,t);return o.attrs={x:e,y:r,width:i,height:n,r:a||0,rx:a||0,ry:a||0,fill:"none",stroke:"#000"},o.type="rect",v(s,o.attrs),o},r._engine.ellipse=function(t,e,r,i,n){var a=v("ellipse");t.canvas&&t.canvas.appendChild(a);var s=new B(a,t);return s.attrs={cx:e,cy:r,rx:i,ry:n,fill:"none",stroke:"#000"},s.type="ellipse",v(a,s.attrs),s},r._engine.image=function(t,e,r,i,n,a){var s=v("image");v(s,{x:r,y:i,width:n,height:a,preserveAspectRatio:"none"}),s.setAttributeNS(p,"href",e),t.canvas&&t.canvas.appendChild(s);var o=new B(s,t);return o.attrs={x:r,y:i,width:n,height:a,src:e},o.type="image",o},r._engine.text=function(t,e,i,n){var a=v("text");t.canvas&&t.canvas.appendChild(a);var s=new B(a,t);return s.attrs={x:e,y:i,"text-anchor":"middle",text:n,font:r._availableAttrs.font,stroke:"none",fill:"#000"},s.type="text",w(s,s.attrs),s},r._engine.setSize=function(t,e){return this.width=t||this.width,this.height=e||this.height,this.canvas.setAttribute("width",this.width),this.canvas.setAttribute("height",this.height),this._viewBox&&this.setViewBox.apply(this,this._viewBox),this},r._engine.create=function(){var t=r._getContainer.apply(0,arguments),e=t&&t.container,i=t.x,n=t.y,a=t.width,s=t.height;if(!e)throw Error("SVG container not found.");var o,l=v("svg"),h="overflow:hidden;";return i=i||0,n=n||0,a=a||512,s=s||342,v(l,{height:s,version:1.1,width:a,xmlns:"http://www.w3.org/2000/svg"}),1==e?(l.style.cssText=h+"position:absolute;left:"+i+"px;top:"+n+"px",r._g.doc.body.appendChild(l),o=1):(l.style.cssText=h+"position:relative",e.firstChild?e.insertBefore(l,e.firstChild):e.appendChild(l)),e=new r._Paper,e.width=a,e.height=s,e.canvas=l,e.clear(),e._left=e._top=0,o&&(e.renderfix=function(){}),e.renderfix(),e},r._engine.setViewBox=function(t,e,r,i,n){u("raphael.setViewBox",this,this._viewBox,[t,e,r,i,n]);var a,o,l=s(r/this.width,i/this.height),h=this.top,c=n?"meet":"xMinYMin";for(null==t?(this._vbSize&&(l=1),delete this._vbSize,a="0 0 "+this.width+f+this.height):(this._vbSize=l,a=t+f+e+f+r+f+i),v(this.canvas,{viewBox:a,preserveAspectRatio:c});l&&h;)o="stroke-width"in h.attrs?h.attrs["stroke-width"]:1,h.attr({"stroke-width":o}),h._.dirty=1,h._.dirtyT=1,h=h.prev;return this._viewBox=[t,e,r,i,!!n],this},r.prototype.renderfix=function(){var t,e=this.canvas,r=e.style;try{t=e.getScreenCTM()||e.createSVGMatrix()}catch(i){t=e.createSVGMatrix()}var n=-t.e%1,a=-t.f%1;(n||a)&&(n&&(this._left=(this._left+n)%1,r.left=this._left+"px"),a&&(this._top=(this._top+a)%1,r.top=this._top+"px"))},r.prototype.clear=function(){r.eve("raphael.clear",this);for(var t=this.canvas;t.firstChild;)t.removeChild(t.firstChild);this.bottom=this.top=null,(this.desc=v("desc")).appendChild(r._g.doc.createTextNode("Created with Raphaël "+r.version)),t.appendChild(this.desc),t.appendChild(this.defs=v("defs"))},r.prototype.remove=function(){u("raphael.remove",this),this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);for(var t in this)this[t]="function"==typeof this[t]?r._removedFactory(t):null};var T=r.st;for(var A in S)S[t](A)&&!T[t](A)&&(T[A]=function(t){return function(){var e=arguments;return this.forEach(function(r){r[t].apply(r,e)})}}(A))}}(),function(){if(r.vml){var t="hasOwnProperty",e=String,i=parseFloat,n=Math,a=n.round,s=n.max,o=n.min,l=n.abs,h="fill",u=/[, ]+/,c=r.eve,f=" progid:DXImageTransform.Microsoft",p=" ",d="",g={M:"m",L:"l",C:"c",Z:"x",m:"t",l:"r",c:"v",z:"x"},v=/([clmz]),?([^clmz]*)/gi,x=/ progid:\S+Blur\([^\)]+\)/g,y=/-?[^,\s-]+/g,m="position:absolute;left:0;top:0;width:1px;height:1px",b=21600,_={path:1,rect:1,image:1},w={circle:1,ellipse:1},k=function(t){var i=/[ahqstv]/gi,n=r._pathToAbsolute;if(e(t).match(i)&&(n=r._path2curve),i=/[clmz]/g,n==r._pathToAbsolute&&!e(t).match(i)){var s=e(t).replace(v,function(t,e,r){var i=[],n="m"==e.toLowerCase(),s=g[e];return r.replace(y,function(t){n&&2==i.length&&(s+=i+g["m"==e?"l":"L"],i=[]),i.push(a(t*b))}),s+i});return s}var o,l,h=n(t);s=[];for(var u=0,c=h.length;c>u;u++){o=h[u],l=h[u][0].toLowerCase(),"z"==l&&(l="x");for(var f=1,x=o.length;x>f;f++)l+=a(o[f]*b)+(f!=x-1?",":d);s.push(l)}return s.join(p)},C=function(t,e,i){var n=r.matrix();return n.rotate(-t,.5,.5),{dx:n.x(e,i),dy:n.y(e,i)}},B=function(t,e,r,i,n,a){var s=t._,o=t.matrix,u=s.fillpos,c=t.node,f=c.style,d=1,g="",v=b/e,x=b/r;if(f.visibility="hidden",e&&r){if(c.coordsize=l(v)+p+l(x),f.rotation=a*(0>e*r?-1:1),a){var y=C(a,i,n);i=y.dx,n=y.dy}if(0>e&&(g+="x"),0>r&&(g+=" y")&&(d=-1),f.flip=g,c.coordorigin=i*-v+p+n*-x,u||s.fillsize){var m=c.getElementsByTagName(h);m=m&&m[0],c.removeChild(m),u&&(y=C(a,o.x(u[0],u[1]),o.y(u[0],u[1])),m.position=y.dx*d+p+y.dy*d),s.fillsize&&(m.size=s.fillsize[0]*l(e)+p+s.fillsize[1]*l(r)),c.appendChild(m)}f.visibility="visible"}};r.toString=function(){return"Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël "+this.version};var S=function(t,r,i){for(var n=e(r).toLowerCase().split("-"),a=i?"end":"start",s=n.length,o="classic",l="medium",h="medium";s--;)switch(n[s]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":o=n[s];break;case"wide":case"narrow":h=n[s];break;case"long":case"short":l=n[s]}var u=t.node.getElementsByTagName("stroke")[0];u[a+"arrow"]=o,u[a+"arrowlength"]=l,u[a+"arrowwidth"]=h},T=function(n,l){n.attrs=n.attrs||{};var c=n.node,f=n.attrs,g=c.style,v=_[n.type]&&(l.x!=f.x||l.y!=f.y||l.width!=f.width||l.height!=f.height||l.cx!=f.cx||l.cy!=f.cy||l.rx!=f.rx||l.ry!=f.ry||l.r!=f.r),x=w[n.type]&&(f.cx!=l.cx||f.cy!=l.cy||f.r!=l.r||f.rx!=l.rx||f.ry!=l.ry),y=n;for(var m in l)l[t](m)&&(f[m]=l[m]);if(v&&(f.path=r._getPath[n.type](n),n._.dirty=1),l.href&&(c.href=l.href),l.title&&(c.title=l.title),l.target&&(c.target=l.target),l.cursor&&(g.cursor=l.cursor),"blur"in l&&n.blur(l.blur),(l.path&&"path"==n.type||v)&&(c.path=k(~e(f.path).toLowerCase().indexOf("r")?r._pathToAbsolute(f.path):f.path),"image"==n.type&&(n._.fillpos=[f.x,f.y],n._.fillsize=[f.width,f.height],B(n,1,1,0,0,0))),"transform"in l&&n.transform(l.transform),x){var C=+f.cx,T=+f.cy,N=+f.rx||+f.r||0,E=+f.ry||+f.r||0;c.path=r.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x",a((C-N)*b),a((T-E)*b),a((C+N)*b),a((T+E)*b),a(C*b)),n._.dirty=1}if("clip-rect"in l){var M=e(l["clip-rect"]).split(u);if(4==M.length){M[2]=+M[2]+ +M[0],M[3]=+M[3]+ +M[1];var P=c.clipRect||r._g.doc.createElement("div"),z=P.style;z.clip=r.format("rect({1}px {2}px {3}px {0}px)",M),c.clipRect||(z.position="absolute",z.top=0,z.left=0,z.width=n.paper.width+"px",z.height=n.paper.height+"px",c.parentNode.insertBefore(P,c),P.appendChild(c),c.clipRect=P)}l["clip-rect"]||c.clipRect&&(c.clipRect.style.clip="auto")}if(n.textpath){var F=n.textpath.style;l.font&&(F.font=l.font),l["font-family"]&&(F.fontFamily='"'+l["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g,d)+'"'),l["font-size"]&&(F.fontSize=l["font-size"]),l["font-weight"]&&(F.fontWeight=l["font-weight"]),l["font-style"]&&(F.fontStyle=l["font-style"])}if("arrow-start"in l&&S(y,l["arrow-start"]),"arrow-end"in l&&S(y,l["arrow-end"],1),null!=l.opacity||null!=l["stroke-width"]||null!=l.fill||null!=l.src||null!=l.stroke||null!=l["stroke-width"]||null!=l["stroke-opacity"]||null!=l["fill-opacity"]||null!=l["stroke-dasharray"]||null!=l["stroke-miterlimit"]||null!=l["stroke-linejoin"]||null!=l["stroke-linecap"]){var R=c.getElementsByTagName(h),I=!1;if(R=R&&R[0],!R&&(I=R=L(h)),"image"==n.type&&l.src&&(R.src=l.src),l.fill&&(R.on=!0),(null==R.on||"none"==l.fill||null===l.fill)&&(R.on=!1),R.on&&l.fill){var j=e(l.fill).match(r._ISURL);if(j){R.parentNode==c&&c.removeChild(R),R.rotate=!0,R.src=j[1],R.type="tile";var q=n.getBBox(1);R.position=q.x+p+q.y,n._.fillpos=[q.x,q.y],r._preload(j[1],function(){n._.fillsize=[this.offsetWidth,this.offsetHeight]})}else R.color=r.getRGB(l.fill).hex,R.src=d,R.type="solid",r.getRGB(l.fill).error&&(y.type in{circle:1,ellipse:1}||"r"!=e(l.fill).charAt())&&A(y,l.fill,R)&&(f.fill="none",f.gradient=l.fill,R.rotate=!1)}if("fill-opacity"in l||"opacity"in l){var D=((+f["fill-opacity"]+1||2)-1)*((+f.opacity+1||2)-1)*((+r.getRGB(l.fill).o+1||2)-1);D=o(s(D,0),1),R.opacity=D,R.src&&(R.color="none")}c.appendChild(R);var O=c.getElementsByTagName("stroke")&&c.getElementsByTagName("stroke")[0],V=!1;!O&&(V=O=L("stroke")),(l.stroke&&"none"!=l.stroke||l["stroke-width"]||null!=l["stroke-opacity"]||l["stroke-dasharray"]||l["stroke-miterlimit"]||l["stroke-linejoin"]||l["stroke-linecap"])&&(O.on=!0),("none"==l.stroke||null===l.stroke||null==O.on||0==l.stroke||0==l["stroke-width"])&&(O.on=!1);var Y=r.getRGB(l.stroke);O.on&&l.stroke&&(O.color=Y.hex),D=((+f["stroke-opacity"]+1||2)-1)*((+f.opacity+1||2)-1)*((+Y.o+1||2)-1);var G=.75*(i(l["stroke-width"])||1);if(D=o(s(D,0),1),null==l["stroke-width"]&&(G=f["stroke-width"]),l["stroke-width"]&&(O.weight=G),G&&1>G&&(D*=G)&&(O.weight=1),O.opacity=D,l["stroke-linejoin"]&&(O.joinstyle=l["stroke-linejoin"]||"miter"),O.miterlimit=l["stroke-miterlimit"]||8,l["stroke-linecap"]&&(O.endcap="butt"==l["stroke-linecap"]?"flat":"square"==l["stroke-linecap"]?"square":"round"),l["stroke-dasharray"]){var W={"-":"shortdash",".":"shortdot","-.":"shortdashdot","-..":"shortdashdotdot",". ":"dot","- ":"dash","--":"longdash","- .":"dashdot","--.":"longdashdot","--..":"longdashdotdot"};O.dashstyle=W[t](l["stroke-dasharray"])?W[l["stroke-dasharray"]]:d}V&&c.appendChild(O)}if("text"==y.type){y.paper.canvas.style.display=d;var X=y.paper.span,H=100,U=f.font&&f.font.match(/\d+(?:\.\d*)?(?=px)/);g=X.style,f.font&&(g.font=f.font),f["font-family"]&&(g.fontFamily=f["font-family"]),f["font-weight"]&&(g.fontWeight=f["font-weight"]),f["font-style"]&&(g.fontStyle=f["font-style"]),U=i(f["font-size"]||U&&U[0])||10,g.fontSize=U*H+"px",y.textpath.string&&(X.innerHTML=e(y.textpath.string).replace(/</g,"&#60;").replace(/&/g,"&#38;").replace(/\n/g,"<br>"));var $=X.getBoundingClientRect();y.W=f.w=($.right-$.left)/H,y.H=f.h=($.bottom-$.top)/H,y.X=f.x,y.Y=f.y+y.H/2,("x"in l||"y"in l)&&(y.path.v=r.format("m{0},{1}l{2},{1}",a(f.x*b),a(f.y*b),a(f.x*b)+1));for(var Z=["x","y","text","font","font-family","font-weight","font-style","font-size"],Q=0,J=Z.length;J>Q;Q++)if(Z[Q]in l){y._.dirty=1;break}switch(f["text-anchor"]){case"start":y.textpath.style["v-text-align"]="left",y.bbx=y.W/2;break;case"end":y.textpath.style["v-text-align"]="right",y.bbx=-y.W/2;break;default:y.textpath.style["v-text-align"]="center",y.bbx=0}y.textpath.style["v-text-kern"]=!0}},A=function(t,a,s){t.attrs=t.attrs||{};var o=(t.attrs,Math.pow),l="linear",h=".5 .5";if(t.attrs.gradient=a,a=e(a).replace(r._radial_gradient,function(t,e,r){return l="radial",e&&r&&(e=i(e),r=i(r),o(e-.5,2)+o(r-.5,2)>.25&&(r=n.sqrt(.25-o(e-.5,2))*(2*(r>.5)-1)+.5),h=e+p+r),d}),a=a.split(/\s*\-\s*/),"linear"==l){var u=a.shift();if(u=-i(u),isNaN(u))return null}var c=r._parseDots(a);if(!c)return null;if(t=t.shape||t.node,c.length){t.removeChild(s),s.on=!0,s.method="none",s.color=c[0].color,s.color2=c[c.length-1].color;for(var f=[],g=0,v=c.length;v>g;g++)c[g].offset&&f.push(c[g].offset+p+c[g].color);s.colors=f.length?f.join():"0% "+s.color,"radial"==l?(s.type="gradientTitle",s.focus="100%",s.focussize="0 0",s.focusposition=h,s.angle=0):(s.type="gradient",s.angle=(270-u)%360),t.appendChild(s)}return 1},N=function(t,e){this[0]=this.node=t,t.raphael=!0,this.id=r._oid++,t.raphaelid=this.id,this.X=0,this.Y=0,this.attrs={},this.paper=e,this.matrix=r.matrix(),this._={transform:[],sx:1,sy:1,dx:0,dy:0,deg:0,dirty:1,dirtyT:1},!e.bottom&&(e.bottom=this),this.prev=e.top,e.top&&(e.top.next=this),e.top=this,this.next=null},E=r.el;N.prototype=E,E.constructor=N,E.transform=function(t){if(null==t)return this._.transform;var i,n=this.paper._viewBoxShift,a=n?"s"+[n.scale,n.scale]+"-1-1t"+[n.dx,n.dy]:d;n&&(i=t=e(t).replace(/\.{3}|\u2026/g,this._.transform||d)),r._extractTransform(this,a+t);var s,o=this.matrix.clone(),l=this.skew,h=this.node,u=~e(this.attrs.fill).indexOf("-"),c=!e(this.attrs.fill).indexOf("url(");if(o.translate(-.5,-.5),c||u||"image"==this.type)if(l.matrix="1 0 0 1",l.offset="0 0",s=o.split(),u&&s.noRotation||!s.isSimple){h.style.filter=o.toFilter();var f=this.getBBox(),g=this.getBBox(1),v=f.x-g.x,x=f.y-g.y;h.coordorigin=v*-b+p+x*-b,B(this,1,1,v,x,0)}else h.style.filter=d,B(this,s.scalex,s.scaley,s.dx,s.dy,s.rotate);else h.style.filter=d,l.matrix=e(o),l.offset=o.offset();return i&&(this._.transform=i),this},E.rotate=function(t,r,n){if(this.removed)return this;if(null!=t){if(t=e(t).split(u),t.length-1&&(r=i(t[1]),n=i(t[2])),t=i(t[0]),null==n&&(r=n),null==r||null==n){var a=this.getBBox(1);r=a.x+a.width/2,n=a.y+a.height/2}return this._.dirtyT=1,this.transform(this._.transform.concat([["r",t,r,n]])),this}},E.translate=function(t,r){return this.removed?this:(t=e(t).split(u),t.length-1&&(r=i(t[1])),t=i(t[0])||0,r=+r||0,this._.bbox&&(this._.bbox.x+=t,this._.bbox.y+=r),this.transform(this._.transform.concat([["t",t,r]])),this)},E.scale=function(t,r,n,a){if(this.removed)return this;if(t=e(t).split(u),t.length-1&&(r=i(t[1]),n=i(t[2]),a=i(t[3]),isNaN(n)&&(n=null),isNaN(a)&&(a=null)),t=i(t[0]),null==r&&(r=t),null==a&&(n=a),null==n||null==a)var s=this.getBBox(1);return n=null==n?s.x+s.width/2:n,a=null==a?s.y+s.height/2:a,this.transform(this._.transform.concat([["s",t,r,n,a]])),this._.dirtyT=1,this},E.hide=function(){return!this.removed&&(this.node.style.display="none"),this},E.show=function(){return!this.removed&&(this.node.style.display=d),this},E._getBBox=function(){return this.removed?{}:{x:this.X+(this.bbx||0)-this.W/2,y:this.Y-this.H,width:this.W,height:this.H}},E.remove=function(){if(!this.removed&&this.node.parentNode){this.paper.__set__&&this.paper.__set__.exclude(this),r.eve.unbind("raphael.*.*."+this.id),r._tear(this,this.paper),this.node.parentNode.removeChild(this.node),this.shape&&this.shape.parentNode.removeChild(this.shape);for(var t in this)this[t]="function"==typeof this[t]?r._removedFactory(t):null;this.removed=!0}},E.attr=function(e,i){if(this.removed)return this;if(null==e){var n={};for(var a in this.attrs)this.attrs[t](a)&&(n[a]=this.attrs[a]);return n.gradient&&"none"==n.fill&&(n.fill=n.gradient)&&delete n.gradient,n.transform=this._.transform,n}if(null==i&&r.is(e,"string")){if(e==h&&"none"==this.attrs.fill&&this.attrs.gradient)return this.attrs.gradient;for(var s=e.split(u),o={},l=0,f=s.length;f>l;l++)e=s[l],o[e]=e in this.attrs?this.attrs[e]:r.is(this.paper.customAttributes[e],"function")?this.paper.customAttributes[e].def:r._availableAttrs[e];return f-1?o:o[s[0]]}if(this.attrs&&null==i&&r.is(e,"array")){for(o={},l=0,f=e.length;f>l;l++)o[e[l]]=this.attr(e[l]);return o}var p;null!=i&&(p={},p[e]=i),null==i&&r.is(e,"object")&&(p=e);for(var d in p)c("raphael.attr."+d+"."+this.id,this,p[d]);if(p){for(d in this.paper.customAttributes)if(this.paper.customAttributes[t](d)&&p[t](d)&&r.is(this.paper.customAttributes[d],"function")){var g=this.paper.customAttributes[d].apply(this,[].concat(p[d]));this.attrs[d]=p[d];for(var v in g)g[t](v)&&(p[v]=g[v])}p.text&&"text"==this.type&&(this.textpath.string=p.text),T(this,p)}return this},E.toFront=function(){return!this.removed&&this.node.parentNode.appendChild(this.node),this.paper&&this.paper.top!=this&&r._tofront(this,this.paper),this},E.toBack=function(){return this.removed?this:(this.node.parentNode.firstChild!=this.node&&(this.node.parentNode.insertBefore(this.node,this.node.parentNode.firstChild),r._toback(this,this.paper)),this)},E.insertAfter=function(t){return this.removed?this:(t.constructor==r.st.constructor&&(t=t[t.length-1]),t.node.nextSibling?t.node.parentNode.insertBefore(this.node,t.node.nextSibling):t.node.parentNode.appendChild(this.node),r._insertafter(this,t,this.paper),this)},E.insertBefore=function(t){return this.removed?this:(t.constructor==r.st.constructor&&(t=t[0]),t.node.parentNode.insertBefore(this.node,t.node),r._insertbefore(this,t,this.paper),this)},E.blur=function(t){var e=this.node.runtimeStyle,i=e.filter;return i=i.replace(x,d),0!==+t?(this.attrs.blur=t,e.filter=i+p+f+".Blur(pixelradius="+(+t||1.5)+")",e.margin=r.format("-{0}px 0 0 -{0}px",a(+t||1.5))):(e.filter=i,e.margin=0,delete this.attrs.blur),this},r._engine.path=function(t,e){var r=L("shape");r.style.cssText=m,r.coordsize=b+p+b,r.coordorigin=e.coordorigin;var i=new N(r,e),n={fill:"none",stroke:"#000"};t&&(n.path=t),i.type="path",i.path=[],i.Path=d,T(i,n),e.canvas.appendChild(r);var a=L("skew");return a.on=!0,r.appendChild(a),i.skew=a,i.transform(d),i},r._engine.rect=function(t,e,i,n,a,s){var o=r._rectPath(e,i,n,a,s),l=t.path(o),h=l.attrs;return l.X=h.x=e,l.Y=h.y=i,l.W=h.width=n,l.H=h.height=a,h.r=s,h.path=o,l.type="rect",l},r._engine.ellipse=function(t,e,r,i,n){var a=t.path();return a.attrs,a.X=e-i,a.Y=r-n,a.W=2*i,a.H=2*n,a.type="ellipse",T(a,{cx:e,cy:r,rx:i,ry:n}),a},r._engine.circle=function(t,e,r,i){var n=t.path();return n.attrs,n.X=e-i,n.Y=r-i,n.W=n.H=2*i,n.type="circle",T(n,{cx:e,cy:r,r:i}),n},r._engine.image=function(t,e,i,n,a,s){var o=r._rectPath(i,n,a,s),l=t.path(o).attr({stroke:"none"}),u=l.attrs,c=l.node,f=c.getElementsByTagName(h)[0];return u.src=e,l.X=u.x=i,l.Y=u.y=n,l.W=u.width=a,l.H=u.height=s,u.path=o,l.type="image",f.parentNode==c&&c.removeChild(f),f.rotate=!0,f.src=e,f.type="tile",l._.fillpos=[i,n],l._.fillsize=[a,s],c.appendChild(f),B(l,1,1,0,0,0),l},r._engine.text=function(t,i,n,s){var o=L("shape"),l=L("path"),h=L("textpath");i=i||0,n=n||0,s=s||"",l.v=r.format("m{0},{1}l{2},{1}",a(i*b),a(n*b),a(i*b)+1),l.textpathok=!0,h.string=e(s),h.on=!0,o.style.cssText=m,o.coordsize=b+p+b,o.coordorigin="0 0";var u=new N(o,t),c={fill:"#000",stroke:"none",font:r._availableAttrs.font,text:s};u.shape=o,u.path=l,u.textpath=h,u.type="text",u.attrs.text=e(s),u.attrs.x=i,u.attrs.y=n,u.attrs.w=1,u.attrs.h=1,T(u,c),o.appendChild(h),o.appendChild(l),t.canvas.appendChild(o);var f=L("skew");return f.on=!0,o.appendChild(f),u.skew=f,u.transform(d),u},r._engine.setSize=function(t,e){var i=this.canvas.style;return this.width=t,this.height=e,t==+t&&(t+="px"),e==+e&&(e+="px"),i.width=t,i.height=e,i.clip="rect(0 "+t+" "+e+" 0)",this._viewBox&&r._engine.setViewBox.apply(this,this._viewBox),this},r._engine.setViewBox=function(t,e,i,n,a){r.eve("raphael.setViewBox",this,this._viewBox,[t,e,i,n,a]);var o,l,h=this.width,u=this.height,c=1/s(i/h,n/u);return a&&(o=u/n,l=h/i,h>i*o&&(t-=(h-i*o)/2/o),u>n*l&&(e-=(u-n*l)/2/l)),this._viewBox=[t,e,i,n,!!a],this._viewBoxShift={dx:-t,dy:-e,scale:c},this.forEach(function(t){t.transform("...")}),this};var L;r._engine.initWin=function(t){var e=t.document;e.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{!e.namespaces.rvml&&e.namespaces.add("rvml","urn:schemas-microsoft-com:vml"),L=function(t){return e.createElement("<rvml:"+t+' class="rvml">')}}catch(r){L=function(t){return e.createElement("<"+t+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}},r._engine.initWin(r._g.win),r._engine.create=function(){var t=r._getContainer.apply(0,arguments),e=t.container,i=t.height,n=t.width,a=t.x,s=t.y;if(!e)throw Error("VML container not found.");var o=new r._Paper,l=o.canvas=r._g.doc.createElement("div"),h=l.style;return a=a||0,s=s||0,n=n||512,i=i||342,o.width=n,o.height=i,n==+n&&(n+="px"),i==+i&&(i+="px"),o.coordsize=1e3*b+p+1e3*b,o.coordorigin="0 0",o.span=r._g.doc.createElement("span"),o.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;",l.appendChild(o.span),h.cssText=r.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden",n,i),1==e?(r._g.doc.body.appendChild(l),h.left=a+"px",h.top=s+"px",h.position="absolute"):e.firstChild?e.insertBefore(l,e.firstChild):e.appendChild(l),o.renderfix=function(){},o},r.prototype.clear=function(){r.eve("raphael.clear",this),this.canvas.innerHTML=d,this.span=r._g.doc.createElement("span"),this.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;",this.canvas.appendChild(this.span),this.bottom=this.top=null},r.prototype.remove=function(){r.eve("raphael.remove",this),this.canvas.parentNode.removeChild(this.canvas);for(var t in this)this[t]="function"==typeof this[t]?r._removedFactory(t):null;return!0};var M=r.st;for(var P in E)E[t](P)&&!M[t](P)&&(M[P]=function(t){return function(){var e=arguments;return this.forEach(function(r){r[t].apply(r,e)})}}(P))}}(),T.was?S.win.Raphael=r:Raphael=r,r});
/**
 * SVG基础封装
 *
 * @module jmSVG
 * @class jmSVG
 */
function jmSVG(container,w,h) {
	/*this.container = this.create('svg');
	this.container.attr({
		'xmlns':this.container.ns,
		'version':this.container.ver,
		'xlink':this.container.xlink
	});*/
    this.paper = new Raphael(container,w,h);
}

/**
 * 生成svg对应的元素
 *
 * @method create
 * @param {string} 元素名称
 * @param {jmcontrol} 所属控件
 * @return {element} 元素对象
 */
jmSVG.prototype.create = function(tag,control) {
	var node = new jmSVGElement(tag,this.paper,control);
	return node;
}

/**
 * 指定或获取画布宽度
 *
 * @method width
 * @param {number} [w] 指定的宽度
 * @return {number} 当前对象宽度
 */
jmSVG.prototype.width = function(w) {
    return this.paper.width(w);
}

/**
 * 指定或获取画布高度
 *
 * @method height
 * @param {number} [h] 指定的宽度
 * @return {number} 当前对象宽度
 */
jmSVG.prototype.height = function(h) {
    return this.paper.height(h);
}

/**
 * 兼容处理的空函数
 *
 */
jmSVG.prototype.fill = function() {	
}
/**
 * 兼容处理的空函数
 *
 */
jmSVG.prototype.stroke = function() {	
}
/**
 * 兼容处理的空函数
 *
 */
jmSVG.prototype.closePath = function() {	
}
/**
 * 兼容处理的空函数
 *
 */
jmSVG.prototype.beginPath = function() {	
}
/**
 * 兼容处理的空函数
 *
 */
jmSVG.prototype.save = function() {	
}
/**
 * 兼容处理的空函数
 *
 */
jmSVG.prototype.restore = function() {	
}
/**
 * 兼容处理的空函数
 *
 */
jmSVG.prototype.moveTo = function() {	
}
/**
 * 兼容处理的空函数
 *
 */
jmSVG.prototype.lineTo = function() {	
}
/**
 * 兼容处理的空函数
 *
 */
jmSVG.prototype.arc = function() {	
}
/**
 * 兼容处理的空函数
 *
 */
jmSVG.prototype.drawImage = function() {

}

/**
 * vml基础封装，用于jmgraph兼容ie9以下浏览器
 *
 * @module jmSVG
 * @class jmVML
 */
function jmVML() {
    this.container = this.create('div');
    this.container.css('position','relative');
    document.namespaces.add('v','urn:schemas-microsoft-com:vml');

    var style = document.createElement('style');
    style.type = 'text/css';
    style.styleSheet.cssText = 'v\\:*{behavior:url(#default#VML);}' +
                                'v\\:shape{behavior:url(#default#VML);}' +
                                'v\\:oval{behavior:url(#default#VML);}' +
                                'v\\:fill{behavior:url(#default#VML);}' +
                                'v\\:stroke{behavior:url(#default#VML);}';
    document.getElementsByTagName('head')[0].appendChild(style);
}
//继承jmsvg
jmUtils.extend(jmVML,jmSVG);

/**
 * 生成svg对应的元素
 *
 * @method create
 * @param {string} 元素名称
 * @return {element} 元素对象
 */
jmVML.prototype.create = function(tag) {
    switch(tag) {
        case 'path': {
            tag = 'v:shape';
            break;
        }
        case 'circle': {
            tag = 'v:roundrect';
            break;
        }
    }
    
    var node = new jmSVGElement(tag,'vml');
    return node;
}

/**
 * SVG元素对象
 * 
 * @module jmSVG
 * @class jmSVGElement
 * @param {string} tag 元素名
 * @param {string} mode 模式(svg/vml)
 */
function jmSVGElement(tag,paper,control) {
	//this.ns = 'http://www.w3.org/2000/svg';
	//this.ver = '1.1';
	//this.xlink = 'http://www.w3.org/1999/xlink';
    //this.mode = mode;
	this.paper = paper;	
    this.element = paper[tag]();
    this.control = control;

    /*if(mode === 'vml' && tag !== 'v:fill') {
        //默认设定为透明
        if(!this.fill) {
            this.fill = new jmSVGElement('v:fill',this.mode);
            this.fill.attr('opacity','0');
            this.fill.appendTo(this);
        }
    }*/
}

/**
 * 指定或获取宽度
 *
 * @method width
 * @param {number} [w] 指定的宽度
 * @return {number} 当前对象宽度
 */
jmSVGElement.prototype.width = function(w) {
    if(typeof w !== 'undefined') {
        this.css('width',w + 'px');
    }
    else {
        w = Math.max(this.element.offsetWidth || this.element.clientWidth);
    }
    return Number(w);
}

/**
 * 指定或获取高度
 *
 * @method height
 * @param {number} [h] 指定的宽度
 * @return {number} 当前对象宽度
 */
jmSVGElement.prototype.height = function(h) {
    if(typeof h !== 'undefined') {
        this.css('height',h + 'px');
    }
    else {
        h = Math.max(this.element.offsetHeight || this.element.clientHeight);
    }
    return Number(h);
}

/**
 * 根据绑定的对象设置其相关属性
 *
 * @method setStyle
 * @param {jmControl} target 绑定到的控件对象
 */
jmSVGElement.prototype.setStyle = function(target) {
    if(this.mode == 'vml') {
       var bounds = target.parent && target.parent.absoluteBounds?target.parent.absoluteBounds:target.absoluteBounds;
       this.css({
            position:'absolute',
            left:bounds.left + 'px',
            top:bounds.top + 'px',
            width: target.bounds.width + 'px',
            height:target.bounds.height+'px'
        });  
        this.attr('fill','transparent'); 
        this.attr('coordsize',Math.floor(target.bounds.width * 100) + ',' + Math.floor(target.bounds.height * 100));
    }    
}

/**
 * 设定当前元素的属性
 *
 * @method attr
 * @param {string} n 属性名
 * @param {string} v 属性值
 */
jmSVGElement.prototype.attr = function(n,v,close,scale) {
	if(arguments.length == 1) {
		if(typeof n === 'string') {
			var a = this.element.attr(n);
			return a?a.content || a || '':'';
		}
		else if(typeof n === 'object') {
			/*for(var i in n) {
                if(typeof i === 'string') {
                    this.attr(i,n[i]);
                }				
			}*/
            this.element.attr(n);
		}
	} 
	else if(arguments.length >= 2) {  
            if(n === 'path' && jmUtils.isArray(v)) {
                var m = 'M';
                var l = 'L';
                var c = 'Z';
                var sp = ' ';
                var e = '';
                /*if(this.mode == 'vml') {
                    m = 'm ';
                    l = 'l ';
                    c = 'x';
                    sp = ',';
                    e = 'e';
                    var d = m + Math.floor(v[0].x * 100) + sp + Math.floor(v[0].y * 100);
                    var len = v.length;           
                    for(var i=1; i < len;i++) {
                        var p = v[i];
                        //移至当前坐标
                        if(p.m) {
                            d += ' ' + m + Math.floor(p.x * 100) + sp + Math.floor(p.y * 100);
                        }
                        else {
                            d += ' ' + l + Math.floor(p.x * 100) + sp + Math.floor(p.y * 100);
                        }           
                    }
                }
               else {*/
                    var d = m + v[0].x + sp + v[0].y ;
                    var len = v.length;           
                    for(var i=1; i < len;i++) {
                        var p = v[i];
                        //移至当前坐标
                        if(p.m) {
                            d += ' ' + m + p.x + sp + p.y;
                        }
                        else {
                            d += ' ' + l + p.x + sp + p.y;
                        }           
                    }
               //}
                //如果当前为封闭路径
                if(close) {
                    d += ' ' + c;
                }
                v = d + ' ' + e;  
            }

            var styleMapCacheKey = 'jm_control_style_mapping_' + this.mode;
            var styleMap = jmUtils.cache.get(styleMapCacheKey);
            if(!styleMap) {
                
                    styleMap = {
                        'fill':'fill',
                        'stroke':'stroke',
                        //'shadow.blur':'shadowBlur',
                        //'shadow.x':'shadowOffsetX',
                        //'shadow.y':'shadowOffsetY',
                        //'shadow.color':'shadowColor',
                        'lineWidth' : 'stroke-width',
                        'fillStyle' : 'fill',
                        'strokeStyle' : 'stroke',
                        'font' : 'font',
                        'path':'path',
                        'lineJoin': 'lineJoin',//线交汇处的形状,miter(默认，尖角),bevel(斜角),round（圆角）
                        'lineCap':'lineCap' //线条终端点,butt(默认，平),round(圆),square（方）
                        //'textAlign' : 'textAlign',
                        //'textBaseline' : 'textBaseline',
                        //'shadowBlur' : 'shadowBlur',
                        //'shadowOffsetX' : 'shadowOffsetX',
                        //'shadowOffsetY' : 'shadowOffsetY',
                        //'shadowColor' : 'shadowColor'
                    };           
                
                jmUtils.cache.set(styleMapCacheKey,styleMap);
            }
            
            n = styleMap[n] || n;
            if(typeof n === 'string') {                    
                if(typeof v == 'object') {                    
                    if(jmUtils.isType(v,jmGradient)) {
                        this.element.attr(n,v.toGradient(this.control));
                    }
                    //暂不支持光晕
                    else if(jmUtils.isType(v,jmShadow)) {
                        this.glow = this.element.glow(v.toGlow());
                    }
                }
                else if(v != 'transparent') {
                    this.element.attr(n,v);
                }
            }
            
	}	
}
                   
                    
/**
 * 设定元素样式
 * 如果不指定参数则返回整个样式串，
 * 指定一个参数字符串则返回此样式对应的值，
 * 如果指定一个object对象则把它所有属性加到样式中。
 * 指定二个参数为样式健值
 *
 * @method css
 * @param {string/object} [k] 样式健或对象
 * @param {string} [v] 样式值
 */
jmSVGElement.prototype.css = function(k,v) {
    this.attr(k,v);
    return;
	if (arguments.length == 0) {        
        return this.attr('style') || ''      
    }

    var styleKS = {};
    var style = this.css();
    if(style) {
    	var ss = style.split(';');    	
    	for(var i in ss) {
    		var s = ss[i];
    		if(s) {
    			var cs = s.split(':');
    			if(cs.length == 2) {
    				styleKS[cs[0]] = cs[1];
    			}
    		}    		
    	}    	
    }

    if(arguments.length == 1) {
        if(typeof k === 'string') {
            return styleKS[k];
        }
        else if(typeof k === 'object') {
            for(var j in k) {
                this.css(j,k[j]);
            }
            return;
        }
    }
    else if(arguments.length == 2 && typeof k == 'string') {
        styleKS[k] = v;
        var ss = [];
        for(var j in styleKS) {
            ss.push(j + ':' + styleKS[j]);
        }
        style = ss.join(';');
        this.attr('style',style);
    }
    return this;
}

/**
 * 将当前元素加入到父对象中
 *
 * @method appendTo
 * @param {element} p 父容器
 */
jmSVGElement.prototype.appendTo = function(p) {
    return;
    if(p) {
        this.remove();
        if(jmUtils.isType(p,jmSVGElement)) {
            p.element.appendChild(this.element);
        }
        else {
            p.appendChild(this.element);
        }        
    }
}

/**
 * 将当前元素从父对象中移除掉
 *
 * @method remove
 */
jmSVGElement.prototype.remove = function() {    
    this.element.remove();
}

/**
 * 显示
 *
 * @method show
 */
jmSVGElement.prototype.show = function() {    
    this.element.show();
}

/**
 * 隐藏
 *
 * @method hide
 */
jmSVGElement.prototype.hide = function() {    
    this.element.hide();
}

/**
 * 绑定控件的事件
 *
 * @method bind
 * @param {string} name 事件名称
 * @param {function} handle 事件委托
 */
jmSVGElement.prototype.bind = function(name,handle) {  
    //jmUtils.bindEvent(this.element,name,handle);
}

/**
 * 移除控件的事件
 *
 * @method unbind 
 * @param {string} name 事件名称
 * @param {function} handle 从控件中移除事件的委托
 */
jmSVGElement.prototype.unbind = function(name,handle) {
    //jmUtils.removeEvent(this.element,name,handle);
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
				//var self = this;
				//延时处理动画事件
				this.dispatcher = setTimeout(function(self) {
					//var _this = self;
					var needredraw = false;
					var overduehandles = [];
					var curTimes = new Date().getTime();
					self.animateHandles.each(function(i,ani) {						
						try {
							if(ani && ani.handle && (!ani.times || curTimes - ani.times >= ani.millisec)) {
								var r = ani.handle.apply(self,ani.params);
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
						self.animateHandles.remove(overduehandles[i]);//移除完成的效果
					}
					if(needredraw) {
						self.redraw();				
					}
					//console.log(curTimes)
					self.animate();
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
				obj.remove();
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
				
				if(offsetx && offsety) {
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
	//计算宽度
	var textSize = this.context.measureText?
						this.context.measureText(this.value):
						{width:(this.svgShape?this.svgShape.element.getBBox().width:15)};
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
	this.mode = jmUtils.checkSupportedMode();

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
		this.context = canvas.getContext('2d');	

		if(w) this.width(w);
		if(h) this.height(h);		
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
jmCell.prototype.remove = function() {
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
	for(var i in points) {
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
jmConnectLine.prototype.remove = function() {
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
			mitem.onclick = function() {
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
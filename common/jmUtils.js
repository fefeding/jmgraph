
/**
* 画图基础对象
*/
var jmUtils = (function(){
	function __contructor() {
		this.version = '0.1';
	}
	return new __contructor();
})();

/**
* 引用JS文件库
*/
jmUtils.require = function(src,callback) {

}

/**
* 继承
* target 为派生类，source为被继承类
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
*/
jmUtils.clone = function(source) {
    if(typeof source === 'object') {
        var target = {};
        for(var k in source) {
            target[k] = jmUtils.clone(source[k]);
        }
        return target;
    }
    return source
}   

/**
* 自定义集合
*/
jmUtils.list = (function() {    
    function __constructor(arr) {
        this.__items = [];
        if(arr) {
            if(typeof arr == 'array') {
                for(var i in arr) this.__items.push(arr[i]);
            }
            else {
                this.__items.push(arr);
            }
        }
    }

    //往集合中添加对象
    __constructor.prototype.add = function(obj) {        
        if(obj && obj.constructor === Array) {
            for(var i in obj) {
                this.add(obj[i]);
            }
            return true;
        }
        if(typeof obj == 'object' && this.contain(obj)) return false;
        this.__items.push(obj);
    }

    __constructor.prototype.remove = function(obj) {
        for(var i = this.__items.length -1;i>=0;i--) {
            /*if(typeof obj == 'function') {
                if(obj(this.__items[i])) {
                    this.removeAt(i);
                }
            }
            else*/
             if(this.__items[i] == obj) {
                this.removeAt(i);
            }
        }
    }

    __constructor.prototype.removeAt = function (index) {
        if(this.__items.length > index) {
            //delete this.__items[index];   
            this.__items.splice(index,1);
        }
    }

    __constructor.prototype.contain = function(obj) {
        /*if(typeof obj === 'function') {
            for(var i in this.__items) {
                if(obj(this.__items[i])) return true;
            }
        }
        else {*/
            for(var i in this.__items) {
                if(this.__items[i] == obj) return true;
            }
        //}
        return false;
    }

    __constructor.prototype.get = function(index) {
        if(typeof index == 'function') {
            for(var i in this.__items) {
                if(index(this.__items[i])) {
                    return this.__items[i];
                }
            }
        }
        else {
            return this.__items[index];
        }        
    }

    __constructor.prototype.each = function(cb,inverse) {
        if(cb && typeof cb == 'function') {
            //如果按倒序循环
            if(inverse) {
                for(var i = this.__items.length - 1;i >= 0; i--) {
                    cb.call(this,i,this.__items[i]);
                }
            }
            else {
               for(var i in this.__items) {
                    cb.call(this,i,this.__items[i]);
                } 
            }            
        }        
    }

    __constructor.prototype.sort = function(cb) {
        this.__items.sort(cb);
    }

    __constructor.prototype.count = function() {
        return this.__items.length;
    }

    __constructor.prototype.clear = function() {
        this.__items = [];
    }
    return __constructor;
})();


/**
* 全局缓存
*/
jmUtils.cache = {
    items : {},
    add: function(key,value) {
        this.set(key,value);
        return value;
    },
    set: function(key,value) {
        this.items[key] = value;
    },
    get :function(key) {
        return this.items[key];
    },
    remove: function(key) {
        this.items[key] = null;
    }
}

/**
* 绑定对象事件
*/
jmUtils.bindEvent = function(target,name,fun) {
    if(target.addEventListener){
        target.addEventListener(name,fun);
        return true;
    }else if(target.attachEvent){
        return target.attachEvent("on"+name,fun);
    }else{
        return false;
    };
}

/**
* 获取元素的绝对定位
*/
jmUtils.getElementPosition = function(el) {
    if(!el) return ;
    var pos = {"top":0, "left":0};
    if(document.documentElement && el.getBoundingClientRect) {
        var rect = el.getBoundingClientRect();
        pos.top = document.documentElement.scrollTop + el.getBoundingClientRect().top;
        pos.left = document.documentElement.scrollLeft + el.getBoundingClientRect().left;
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
* 获取事件的位置
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
*/
jmUtils.isType = function(target ,type) {
    if(typeof target !== 'object') return false;
    if(target.constructor === type) return true;
    /*if(target.__baseType) {        
        return jmUtils.isType(target.__baseType.prototype,type);
    }*/

    //return target instanceof type;
    return false;
}
/**
* 判断点是否在多边形内
如果一个点在多边形内部，任意角度做射线肯定会与多边形要么有一个交点，要么有与多边形边界线重叠。

如果一个点在多边形外部，任意角度做射线要么与多边形有一个交点，要么有两个交点，要么没有交点，要么有与多边形边界线重叠。

利用上面的结论，我们只要判断这个点与多边形的交点个数，就可以判断出点与多边形的位置关系了。
* 返回直 0= 不在图形内和线上，1=在边上，2=在图形内部
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
* 返回{left:0,right:0,top:0,bottom:0} 
* 如果right>0表示右边出界right偏移量,left<0则表示左边出界left偏移量
* 如果bottom>0表示下边出界bottom偏移量,top<0则表示上边出界ltop偏移量
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
* 生成唯 一ID
*/
jmUtils.guid = function() {
    var gid = new Date().getTime();
    return gid;
}

/**
* 去除字符串开始字符
*/
jmUtils.trimStart = function(source,c) {
    c = c || ' ';
    if(source && source.length > 0 && source[0] === c) {
        source = source.substring(1);
        return jmUtils.trimStart(source,c);
    }
    return source;
}

/**
* 去除字符串结束的字符c
*/
jmUtils.trimEnd = function(source,c) {
    c = c || ' ';
    if(source && source.length > 0 && source[source.length - 1] === c) {
        source = source.substring(0,source.length - 1);
        return jmUtils.trimStart(source,c);
    }
    return source;
}

/**
* 去除字符串开始与结束的字符
*/
jmUtils.trim = function(source,c) {
    return jmUtils.trimEnd(jmUtils.trimStart(source,c),c);
}

/**
* 检查是否为百分比参数
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


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
}
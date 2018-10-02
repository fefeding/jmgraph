
/**
 * jmGraph画图类库
 * 对canvas画图api进行二次封装，使其更易调用，省去很多重复的工作。
 *
 * @module jmGraph
 * @class jmGraph
 * @param {element} canvas 标签canvas
 * @param {object} option 参数：{width:宽,height:高}
 * @param {function} callback 初始化后的回调
 */
function jmGraph(canvas, option, callback) {

	if(typeof option == 'function') {
		callback = option;
		option = {};
	}

	option = option || {};

	if(this instanceof jmGraph) {
		this.type = 'jmGraph';
		/**
		 * 当前支持的画图类型 svg/canvas
		 *
		 * @property mode
		 * @type {string}
		 */
		this.mode = 'canvas';		
		
		this.option = option||{};
		this.util = jmUtils;

		//如果是小程序
		if(typeof wx != 'undefined' && wx.createCanvasContext) {
			this.context = wx.createCanvasContext(canvas);
			canvas = wx.createSelectorQuery().select('#' + canvas);
		}
		else {
			if(typeof canvas === 'string' && typeof document != 'undefined') {
				canvas = document.getElementById(canvas);
			}
			else if(canvas.length) {
				canvas = canvas[0];
			}
			if(canvas.tagName != 'CANVAS') {
				var cn = document.createElement('canvas');
				canvas.appendChild(cn);
				cn.width = canvas.offsetWidth||canvas.clientWidth;
				cn.height = canvas.offsetHeight||canvas.clientHeight;
				canvas = cn;
			}	

			this.context = canvas.getContext('2d');
		}

		this.canvas = canvas;

		jmGraphTypeInit.call(this, option, function() {
			this.init(callback);
		});		
	}
	else {		
		return new Promise(function(resolve, reject){
			jmGraphTypeInit(option, function() {
				var g = new jmGraph(canvas, option);
				resolve && resolve(g);
			});
		});
	}
}

/**
 * 初始化画布
 * @method init
 */
jmGraph.prototype.init = function(callback) {
	
	/**
	 * 画控件前初始化
	 * 为了解决一像素线条问题
	 */
	this.on('beginDraw', function() {	
		this.context.translate(0.5, 0.5);
	});
	/**
	 * 结束控件绘制 为了解决一像素线条问题
	 */
	this.on('endDraw', function() {	
		this.context.translate(-0.5, -0.5);		
	});
	
	if(this.option.width > 0) this.width = this.option.width;
	if(this.option.height > 0) this.height = this.option.height;	

	//绑定事件
	this.eventHandler = new jmEvents(this, this.canvas.canvas || this.canvas);		

	this.initializing(this.context, this.option.style);		

	callback && callback(this);
	
}

/**
 * 当前所有图形类型
 * @property shapes
 * @type {object}
 */
jmGraph.prototype.shapes = {};

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
 * 注册图形类型,图形类型必需有统一的构造函数。参数为画布句柄和参数对象。
 *
 * @method registerShape 
 * @param {string} name 控件图形名称
 * @param {class} shape 图形控件类型
 */
jmGraph.prototype.registerShape = function(name,shape) {
	this.shapes[name] = shape;
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
	var shape = this.shapes[name];
	if(shape) {
		if(!args) args = {};
		args.mode = this.mode;
		var obj = new shape(this, args);
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
 * @method createShadow
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
	/*this.animate(function() {
		return false;
	},100,'jmgraph_refresh');*/
	this.redraw();
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
	//如果有指定背景，则等到draw再全屏绘制一次，也同样达到清除画布的功能
	if(this.style && this.style.fill) {
		this.points = [
			{x:0,y:0},
			{x:w,y:0},
			{x:w,y:h},
			{x:0,y:h}
		];
	}
	else if(this.context.clearRect) this.context.clearRect(0,0,w,h);
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
 * 自动刷新画版
 * @param {function} callback 执行回调
 */
jmGraph.prototype.autoRefresh = function(callback) {
	var self = this;
	function update() {
		self.redraw();
		requestAnimationFrame(update);
		callback && callback();
	}
	update();
	return this;
}

/**
 * 初始化jmGraph类型
 * @private
 * @method jmGraphTypeInit
 */
function jmGraphTypeInit(option, callback) {	
	//初始化图形集合
	var shapes = jmGraph.prototype.shapes = jmGraph.prototype.shapes||{};
	var graphBaseUrl = option.baseUrl || '';//当前graph.js的路径
	//加载组件
	function loadComponent(obj, cb) {
		//如果是小程序
		if(typeof wx != 'undefined' && wx.createCanvasContext) {			
			cb && cb(1);
			return;
		}

		if(!graphBaseUrl) {
			//获取当前graph路径
            var sc = document.getElementsByTagName('script');
            for(var i =0; i < sc.length;i++) {
                var src = sc[i].src;
                var graphindex = src.indexOf('jmGraph');
                if(graphindex >= 0) {
                    graphBaseUrl = src.substring(0, graphindex);
                    break;
                }
            }
		}
		if(obj) {
			var o = obj;
			//如果为数组，则先处理第一个
			if(obj.length) {
				o = obj[0];
			}
			if(o.url && o.typeName) {
				//如果当前组件已加载过，则直接返回
				if(shapes[o.name] || typeof window[o.typeName] !== 'undefined') {
					//没有注册的类型先注册
					if(o.name && !shapes[o.name] && typeof window[o.typeName] !== 'undefined') shapes[o.name] = window[o.typeName];	
					loadComponent(obj.slice(1), cb);
					return;
				}
				var url = graphBaseUrl + o.url;
				 //创建script，加载js
				 var sc = document.createElement('script');
				 sc.type= 'text/javascript';
				 sc.charset = 'utf-8';
				 sc.src = url;
				 //append到head中
				 var head = document.getElementsByTagName('head')[0];
				 head.appendChild(sc);		 
				 
				function loadCallback(e) {
					if(this.readyState && this.readyState !== 'loaded' && this.readyState !== 'complete') {
						return;
					}	
					if(o.name && typeof window[o.typeName] !== 'undefined') shapes[o.name] = window[o.typeName];		
					loadComponent(obj.slice(1), cb);
				}
				//加载回调
				if(sc.readyState) {
					sc.onreadystatechange = loadCallback;
				}
				else {
					sc.onload = loadCallback;
				}
				 //加载失败
				 sc.onerror = function() {
					 head.removeChild(sc);
					 console.error && console.error(this.src + ' load failure');
					 cb && cb(0);
				 }
				 return;       
			}
		}		
		cb && cb(1);
	}
	
	var self = this;
	// 初始化默认图形组件
	loadComponent([		
			{typeName:'jmUtils',url:'common/jmUtils.js'},
			{typeName:'jmGradient',url:'models/jmGradient.js'},
			{typeName:'jmShadow',url:'models/jmShadow.js'},
			{typeName:'jmObject',url:'common/jmObject.js'},
			{typeName:'jmProperty',url:'common/jmProperty.js'},
			{typeName:'jmEvents',url:'common/jmEvents.js'},
			{typeName:'jmControl',url:'common/jmControl.js'},			
			{typeName:'jmShape',url:'shapes/jmShape.js'},
			{name:'path',typeName:'jmPath',url:'shapes/jmPath.js'},
			{name:'line',typeName:'jmLine',url:'shapes/jmLine.js'},
			{name:'arc',typeName:'jmArc',url:'shapes/jmArc.js'},
			{name:'circle',typeName:'jmCircle',url:'shapes/jmCircle.js'},			
			{name:'harc',typeName:'jmHArc',url:'shapes/jmHArc.js'},
			{name:'prismatic',typeName:'jmPrismatic',url:'shapes/jmPrismatic.js'},
			{name:'bezier',typeName:'jmBezier',url:'shapes/jmBezier.js'},
			{name:'rect',typeName:'jmRect',url:'shapes/jmRect.js'},
			{name:'arraw',typeName:'jmArraw',url:'shapes/jmArraw.js'},					
			{name:'label',typeName:'jmLabel',url:'controls/jmLabel.js'},
			{name:'image',typeName:'jmImage',url:'controls/jmImage.js'},
			{name:'resize',typeName:'jmResize',url:'controls/jmResize.js'},
			{name:'arrawline',typeName:'jmArrawLine',url:'controls/jmArrawLine.js'}
	], function(ret){

		//继承基础控件
		if(!jmGraph.superClass) {
			
			//这里为了不覆盖原prototype属性
			jmUtils.extend(jmGraph, jmControl);	

			//如果当前对象没有继承过，是直接继承
			if(self && self.type == 'jmGraph') {
				self.__proto__.__proto__ = new jmControl();
			}
		}

		callback && callback.call(self);
	});
}

//如果是小程序
if(typeof module != 'undefined') {
	module.exports = jmGraph;
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

	this.stops = new jmUtils.list();

	if(op && typeof op == 'object') {
		for(var k in op) {
			this[k] = op[k];
		}
	}
	//解析字符串格式
	//linear-gradient(direction, color-stop1, color-stop2, ...);
	//radial-gradient(center, shape size, start-color, ..., last-color);
	else if(typeof op == 'string') {
		this.fromString(op);
	}
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
	var x1 = this.x1||0;
	var y1 = this.y1||0;
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

	//var offsetLine = 1;//渐变长度或半径
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

	var sx1 = Number(x1) + bounds.left;
	var sy1 = Number(y1) + bounds.top;
	var sx2 = Number(x2) + bounds.left;
	var sy2 = Number(y2) + bounds.top;
	if(this.type === 'linear') {		
		gradient = context.createLinearGradient(sx1, sy1, sx2, sy2);	
		//var x = Math.abs(x2-x1);
		//var y = Math.abs(y2-y1);
		//offsetLine = Math.sqrt(x*x + y*y);
	}
	else if(this.type === 'radial') {
		var r1 = this.r1||0;
		var r2 = this.r2;
		if(jmUtils.checkPercent(r1)) {
			r1 = jmUtils.percentToNumber(r1);			
			r1 = d * r1;
		}
		if(jmUtils.checkPercent(r2)) {
			r2 = jmUtils.percentToNumber(r2);
			r2 = d * r2;
		}	
		//offsetLine = Math.abs(r2 - r1);//二圆半径差
		//小程序的接口特殊
		if(context.createCircularGradient) { 
			gradient = context.createCircularGradient(sx1, sy1, sx2, sy2);
		}
		else {
			gradient = context.createRadialGradient(sx1, sy1,r1, sx2, sy2,r2);	
		}	
	}
	//颜色渐变
	this.stops.each(function(i,s) {	
		var c = jmUtils.toColor(s.color);
		//s.offset 0.0 ~ 1.0
		gradient.addColorStop(s.offset, c);		
	});
	
	return gradient;
}

/**
 * 变换为字条串格式
 * linear-gradient(x1 y1 x2 y2, color1 step, color2 step, ...);	//radial-gradient(x1 y1 r1 x2 y2 r2, color1 step,color2 step, ...);
 * linear-gradient线性渐变，x1 y1表示起点，x2 y2表示结束点,color表颜色，step为当前颜色偏移
 * radial-gradient径向渐变,x1 y1 r1分别表示内圆中心和半径，x2 y2 r2为结束圆 中心和半径，颜色例似线性渐变 step为0-1之间
 *
 * @method fromString
 * @for jmGradient
 * @return {string} 
 */
jmGradient.prototype.fromString = function(s) {
	if(!s) return;
	var ms = s.match(/(linear|radial)-gradient\s*\(\s*([^,]+[^\)]+)\)/i);
	if(!ms || ms.length < 3) return;
	this.type = ms[1].toLowerCase();
	var pars = ms[2].split(',');
	if(pars.length) {
		var ps = jmUtils.trim(pars[0]).split(/\s+/);
		//线性渐变
		if(this.type == 'linear') {
			if(ps.length <= 2) {
				this.x2 = ps[0];
				this.y2 = ps[1]||0;
			}
			else {
				this.x1 = ps[0];
				this.y1 = ps[1];
				this.x2 = ps[2];
				this.y2 = ps[3]
			}
		}
		//径向渐变
		else {
			if(ps.length <= 3) {
				this.x2 = ps[0];
				this.y2 = ps[1]||0;
				this.r2 = ps[2]||0;
			}
			else {
				this.x1 = ps[0];
				this.y1 = ps[1];
				this.r1 = ps[2];
				this.x2 = ps[3];
				this.y2 = ps[3];
				this.r2 = ps[3];
			}
		}
		//解析颜色偏移
		//color step
		if(pars.length > 1) {
			for(var i=1;i<pars.length;i++) {
				var cs = jmUtils.trim(pars[i]).split(/\s+/);
				if(cs.length) {
					this.addStop(cs[1]||0, cs[0]);
				}
			}
		}
	}
}

/**
 * 转换为渐变的字符串表达
 *
 * @method toString
 * @for jmGradient
 * @return {string} linear-gradient(x1 y1 x2 y2, color1 step, color2 step, ...);	//radial-gradient(x1 y1 r1 x2 y2 r2, color1 step,color2 step, ...);
 */
jmGradient.prototype.toString = function() {
	var str = this.type + '-gradient(';
	if(this.type == 'linear') {
		str += this.x1 + ' ' + this.y1 + ' ' + this.x2 + ' ' + this.y2;
	}
	else {
		str += this.x1 + ' ' + this.y1 + ' ' + this.r1 + ' ' + this.x2 + ' ' + this.y2 + ' ' + this.r2;
	}
	//颜色渐变
	this.stops.each(function(i,s) {	
		str += ',' + s.color + ' ' + s.offset;
	});
	return str + ')';
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
	if(typeof x == 'string' && !y && !blur && !color) {
		this.fromString(x);
	}
	else {
		this.x = x;
		this.y = y;
		this.blur = blur;
		this.color = color;
	}
}

/**
 * 根据字符串格式转为阴影
 * @method fromString
 * @param {string} s 阴影字符串 x,y,blur,color
 */
jmShadow.prototype.fromString = function(s) {
	var ms = s.match(/\s*([^,]+)\s*,\s*([^,]+)\s*(,[^,]+)?\s*(,[\s\S]+)?\s*/i);
	if(ms) {
		this.x = ms[1]||0;
		this.y = ms[2]||0;
		if(ms[3]) {
			ms[3] = jmUtils.trim(ms[3],', ');
			//如果第三位是颜色格式，则表示为颜色
			if(ms[3].indexOf('#')===0 || /^rgb/i.test(ms[3])) {
				this.color = ms[3];
			}
			else {
				this.blur = jmUtils.trim(ms[3],', ');
			}
		}
		if(ms[4]) {
			this.color = jmUtils.trim(ms[4],', ');
		}
	}
}

/**
 * 转为字符串格式 x,y,blur,color
 * @method toString
 * @returns {string} 阴影字符串
 */
jmShadow.prototype.toString = function(s) {
	var s = this.x + ',' + this.y;
	if(this.blur) s += ',' + this.blur;
	if(this.color) s += ',' + this.color;
	return s;
}

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
jmUtils.extend =  function(target, source) {  
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
                if(typeof pro[k] == 'undefined') { //如果原型对象不存在这个属性，则复制  
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
 * @param {boolean} deep 是否深度复制，如果为true,数组内的每个对象都会被复制
 * @return {object} 参数source的拷贝对象
 */
jmUtils.clone = function(source, deep) {
    if(source && typeof source === 'object') {
        //如果为当前泛型，则直接new
        if(jmUtils.isType(source,jmUtils.list)) {
            return new jmUtils.list(source.items);
        }
        else if(jmUtils.isArray(source)) {
            //如果是深度复，则拷贝每个对象
            if(deep) {
                var dest = [];
                for(var i=0;i<source.length;i++) {
                    dest.push(jmUtils.clone(source[i]));
                }
                return dest;
            }
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
jmUtils.bindEvent = function(target, name, fun, opt) {
    if(name && name.indexOf(' ') != -1) {
        var ns = name.split(' ');
        for(var i=0;i<ns.length;i++) {
            jmUtils.bindEvent(target, ns[i], fun, opt);
        }
        return;
    }
    if(target.attachEvent) {
        return target.attachEvent("on"+name,fun,opt);
    }    
    else if(target.addEventListener) {
        target.addEventListener(name,fun,opt);
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
    var pos = {"top":0, "left":0};

    if(!el) return pos;

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
    
    var isTouch = false;
    var touches = evt.changedTouches || evt.targetTouches || evt.touches;
    var target = evt.target || evt.srcElement;
    if(touches) {
        evt = touches[0];//兼容touch事件
        evt.target = target;
        isTouch = true;
    }
    var px = evt.pageX || evt.x || 
        (evt.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));    
    var py = evt.pageY || evt.y || 
        (evt.clientY + (document.documentElement.scrollTop || document.body.scrollTop));

    var ox = evt.offsetX;
    var oy = evt.offsetY;
    if(typeof ox === 'undefined' && typeof oy === 'undefined') {
        var p = jmUtils.getElementPosition(target);
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
        y : oy,
        isTouch: isTouch
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
 * 把一个或多个点绕某个点旋转一定角度
 * 先把坐标原点移到旋转中心点，计算后移回
 * @method rotatePoints
 * @param {Array/object} p 一个或多个点
 * @param {*} rp 旋转中心点
 * @param {*} r 旋转角度
 */
jmUtils.rotatePoints = function(p, rp, r) {
    if(!r || !p) return p;
    var cos = Math.cos(r);
    var sin = Math.sin(r);
    if(p.length) {
        for(var i=0;i<p.length;i++) {
            if(!p[i]) continue;
            var x1 = p[i].x - rp.x;
            var y1 = p[i].y - rp.y;
            p[i].x = x1 * cos - y1 * sin + rp.x;
            p[i].y = x1 * sin + y1 * cos + rp.y;
        }
    }
    else {
        var x1 = p.x - rp.x;
        var y1 = p.y - rp.y;
        p.x = x1 * cos - y1 * sin + rp.x;
        p.y = x1 * sin + y1 * cos + rp.y;
    }
    return p;
}

/**
 * 把一个或多个点绕某个点平移一定坐标
 * @method offsetPoints
 * @param {Array/object} p 一个或多个点
 * @param {*} offp 平移坐标{x:0,y:0}
 */
jmUtils.offsetPoints = function(p, offp) {
    if(!offp) return p;
    if(p.length) {
        for(var i=0;i<p.length;i++) {
            p[i].x += offp.x;
            p[i].y += offp.y;
        }
    }
    else {
        p.x += offp.x;
        p.y += offp.y;
    }
    return p;
}

/**
 * 把一个或多个点绕某个点平移一定坐标
 * @method getDistance
 * @param {point} p1 点1
 * @param {point} p2 点2
 * @returns {number} 返回二点的距离
 */
jmUtils.getDistance = function(p1, p2) {
    var cx = p1.x - p2.x;
    var cy = p1.y - p2.y;
    return Math.sqrt(cx * cx + cy * cy);
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
            per = jmUtils.trim(tmp,'% ');
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
    for(var i=0;i<l;i++) {
        var iv = hex.indexOf(h[i]);
        if(iv == 0) continue;
        
        for(var j=1;j<l - i;j++) {
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
 * 定义一个属性
 *
 * @method createProperty
 * @param {object} instance 被添加属性的对象
 * @param {string} name 设置属性的名称
 * @param {any} value 属性的值，可选, 如果直接指定为descriptor，也可以。可以传递get,set，按defineProperty第三个参数做参考
 * @retunr {any} 当前属性的值
 */
jmUtils.createProperty = function(instance, name, value) {
    var descriptor = {
        configurable: false, //当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false。
        enumerable: true,
        //valueMaps: {},
        name: name,
        defaultValue: value
    };
    if(value) {
        if(!(value instanceof jmUtils.list) && (typeof value.set == 'function' || typeof value.get == 'function')) {
            descriptor.set = value.set;
            descriptor.get = value.get;
            //descriptor.value = value.value; //赋值不能跟get/set同时存在
        }
        else if(typeof value == 'object' && ('value' in value || 'configurable' in value || 'enumerable' in value || 'writable' in value)) {
            descriptor.value = value.value;
            descriptor.configurable = typeof value.configurable == 'boolean'?value.configurable:true;
            descriptor.enumerable = typeof value.enumerable == 'boolean'?value.enumerable:true;
            descriptor.writable = typeof value.writable == 'boolean'?value.writable:true;
        }
        /*else {
            descriptor.value = value;
            descriptor.enumerable = true; //能否for in 默认false
            descriptor.writable = true;
        }*/
    }
    /*else {
        descriptor.enumerable = true;
        descriptor.writable = true;
    }*/
    //如果没有指定一些必要属性，则采用get/set方式初始化
    if(!('get' in descriptor || 'set' in descriptor || 'value' in descriptor || 'writable' in descriptor)) {
        descriptor.get = function() {
            //如果是canvas对象，则直接返回
            if(this.canvas && ('width' == descriptor.name || 'height' == descriptor.name )) {
                return this.canvas[descriptor.name];
            }
            this.__properties = this.__properties||{};
            return this.__properties[descriptor.name];
        };
        descriptor.set = function(value) {
            //如果是canvas 则修改其属性
            if(this.canvas && ('width' == descriptor.name || 'height' == descriptor.name )) {
                this.canvas[descriptor.name] = value;
            }
            else {
                this.__properties = this.__properties||{};
                this.__properties[descriptor.name] = value;
            }
            this.needUpdate = true;
        };
    }
    //给对象定义一个属性
	return Object.defineProperty(instance, name, descriptor);
}


/**
 * 事件模型
 *
 * @class jmEvents
 * @module jmGraph
 * @for jmGraph
 */
function jmEvents(container,target) {

	var self = this;

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

	this.touchStart = function(evt) {
		evt = evt || window.event;
		container.raiseEvent('touchstart',evt);
		var t = evt.target || evt.srcElement;
		if(t == target) {
			if(evt.preventDefault) evt.preventDefault();
			return false;
		}
	};

	this.touchMove = function(evt) {
		evt = evt || window.event;
		container.raiseEvent('touchmove',evt);
		var t = evt.target || evt.srcElement;
		if(t == target) {
			if(evt.preventDefault) evt.preventDefault();
			return false;
		}
	};

	this.touchEnd = function(evt) {
		evt = evt || window.event;
		
		container.raiseEvent('touchend',evt);
		var t = evt.target || evt.srcElement;
		if(t == target) {
			if(evt.preventDefault) evt.preventDefault();
			return false;
		}
	};

	this.touchCancel = function(evt) {
		evt = evt || window.event;
		
		container.raiseEvent('touchcancel',evt);
		var t = evt.target || evt.srcElement;
		if(t == target) {
			if(evt.preventDefault) evt.preventDefault();
			return false;
		}
	};	
	
	/**
	 * 鼠标事件处理对象，container 为事件主体，target为响应事件对象
	 */
	function mouseEvent(container,target) {
		this.container = container;
		this.target = target || container;
		this.init = function() {
			var canvas = this.target;	
			var hasDocment = typeof document != 'undefined';
			//禁用鼠标右健系统菜单
			//canvas.oncontextmenu = function() {
			//	return false;
			//};

			jmUtils.bindEvent(this.target,'mousedown',function(evt) {
				evt = evt || window.event;
				var r = container.raiseEvent('mousedown',evt);
				//if(r === false) {
					//if(evt.preventDefault) evt.preventDefault();
					//return false;
				//}				
			});
			
			hasDocment && jmUtils.bindEvent(document,'mousemove',function(evt) {	
				evt = evt || window.event;		
				var target = evt.target || evt.srcElement;
				if(target == canvas) {
					var r = container.raiseEvent('mousemove',evt);
					//if(r === false) {
						if(evt.preventDefault) evt.preventDefault();
						return false;
					//}		
				}				
			});
			
			jmUtils.bindEvent(this.target,'mouseover',function(evt) {
				evt = evt || window.event;
				container.raiseEvent('mouseover',evt);
			});
			jmUtils.bindEvent(this.target,'mouseleave',function(evt) {
				evt = evt || window.event;
				container.raiseEvent('mouseleave',evt);
			});			
			jmUtils.bindEvent(this.target,'mouseout',function(evt) {
				evt = evt || window.event;
				container.raiseEvent('mouseout',evt);
			});
			hasDocment && jmUtils.bindEvent(document,'mouseup',function(evt) {
				evt = evt || window.event;
				//var target = evt.target || evt.srcElement;
				//if(target == canvas) {						
					var r = container.raiseEvent('mouseup',evt);
					if(r === false) {
						if(evt.preventDefault) evt.preventDefault();
						return false;
					}					
				//}
			});
			
			jmUtils.bindEvent(this.target,'dblclick',function(evt) {
				evt = evt || window.event;
				container.raiseEvent('dblclick',evt);
			});
			jmUtils.bindEvent(this.target,'click',function(evt) {
				evt = evt || window.event;
				container.raiseEvent('click',evt);
			});

			hasDocment && jmUtils.bindEvent(document,'resize',function(evt) {
				evt = evt || window.event;
				return container.raiseEvent('resize',evt);
			});

			// passive: false 为了让浏览器不告警并且preventDefault有效
			// 另一种处理：touch-action: none; 这样任何触摸事件都不会产生默认行为，但是 touch 事件照样触发。
			hasDocment && jmUtils.bindEvent(document,'touchstart', function(evt) {
				return self.touchStart.call(this, evt);
			},{ passive: false });

			hasDocment && jmUtils.bindEvent(document,'touchmove', function(evt) {
				return self.touchMove.call(this, evt);
			},{ passive: false });

			hasDocment && jmUtils.bindEvent(document,'touchend', function(evt) {
				return self.touchEnd.call(this, evt);
			},{ passive: false });

			hasDocment && jmUtils.bindEvent(document,'touchcancel', function(evt) {
				return self.touchCancel.call(this, evt);
			},{ passive: false });
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
			var hasDocment = typeof document != 'undefined';

			hasDocment && jmUtils.bindEvent(document,'keypress',function(evt) {
				evt = evt || window.event;
				if(!checkKeyEvent(evt)) return;//如果事件为其它输入框，则不响应
				var r = container.raiseEvent('keypress',evt);
				if(r === false && evt.preventDefault) 
					evt.preventDefault();
				return r;
			});
			hasDocment && jmUtils.bindEvent(document,'keydown',function(evt) {
				evt = evt || window.event;
				if(!checkKeyEvent(evt)) return;//如果事件为其它输入框，则不响应
				var r = container.raiseEvent('keydown',evt);
				if(r === false && evt.preventDefault) 
					evt.preventDefault();
				return r;
			});
			hasDocment && jmUtils.bindEvent(document,'keyup',function(evt) {
				evt = evt || window.event;
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
 *  所有jm对象的基础对象
 * 
 * @class jmObject
 * @module jmGraph
 * @for jmGraph
 */

function jmObject(graph) {
	if(graph && graph.type == 'jmGraph') {
		this.graph = graph;
	}
}

/**
 * id 控件唯一标识
 * @property id
 * @readonly
 * @type {object}
 */
jmUtils.createProperty(jmObject.prototype, 'id', {
	get: function() {
		if(!this.__id) {
			this.__id = Date.now().toString() + Math.floor(Math.random() * 1000);
		}
		return this.__id;
	}	
});

/**
 * 是否需要刷新画板，属性的改变会导致它变为true
 * @property needUpdate
 * @type {object}
 */
jmUtils.createProperty(jmObject.prototype, 'needUpdate', {
	get: function() {
		return this.__needUpdate;
	},
	set: function(v) {
		this.__needUpdate = v;
		//子控件属性改变，需要更新整个画板
		if(v && !this.is('jmGraph') && this.graph) {
			this.graph.__needUpdate = true;
		}
	}
});

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
					//var needredraw = false;
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
								//needredraw = true;								
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
					//if(needredraw) {
					//	_this.redraw();				
					//}
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

jmUtils.extend(jmProperty, jmObject);

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
 * 定义一个属性
 *
 * @method setValue
 * @for createProperty
 * @param {string} name 设置属性的名称
 * @param {any} value 属性的值，可选, 如果直接指定为descriptor，也可以。可以传递get,set，按defineProperty第三个参数做参考
 * @retunr {any} 当前属性的值
 */
jmProperty.prototype.createProperty = function(name, value) {	
	return jmUtils.createProperty(this, name, value);
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
	return this;
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
	return this;
}


/**
 * 控件基础对象
 * 控件的基础属性和方法
 *
 * @class jmControl
 * @module jmGraph
 * @for jmGraph
 */	
function jmControl(graph, option) {	
	
};
//继承属性绑定
jmUtils.extend(jmControl, jmProperty);

//# region 定义属性

/**
 * 样式
 * @property style
 * @type {object}
 */
jmUtils.createProperty(jmControl.prototype, 'style', {});

/**
 * 当前控件是否可见
 * @property visible
 * @default true
 * @type {boolean}
 */
jmUtils.createProperty(jmControl.prototype, 'visible', true);

/**
 * 当前控件的子控件集合
 * @property children
 * @type {list}
 */
jmUtils.createProperty(jmControl.prototype, 'children', new jmUtils.list());

/**
 * 当前位置左上角
 * @property position
 * @type {point}
 */
jmUtils.createProperty(jmControl.prototype, 'position');

/**
 * 宽度
 * @property width
 * @type {number}
 */
jmUtils.createProperty(jmControl.prototype, 'width', 0);

/**
 * 高度
 * @property height
 * @type {number}
 */
jmUtils.createProperty(jmControl.prototype, 'height', 0);

//# end region

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

	this.style = style||{};

	var self = this;
	//定义子元素集合
	this.children = new jmUtils.list();
	var oadd = this.children.add;
	//当把对象添加到当前控件中时，设定其父节点
	this.children.add = function(obj) {
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

			self.needUpdate = true;
			return obj;
		}
	};
	this.children.oremove= this.children.remove;
	//当把对象从此控件中移除时，把其父节点置为空
	this.children.remove = function(obj) {
		if(typeof obj === 'object') {				
			obj.parent = null;
			obj.remove(true);
			this.oremove(obj);
			self.needUpdate = true;
		}
	};
	/**
	 * 根据控件zIndex排序，越大的越高
	 */
	this.children.sort = function() {
		var levelItems = {};
		//提取zindex大于0的元素
		//为了保证0的层级不改变，只能把大于0的提出来。
		this.each(function(i,obj) {
			var zindex = obj.zIndex;
			if(!zindex && obj.style && obj.style.zIndex) {
				zindex = Number(obj.style.zIndex);
				if(isNaN(zindex)) zindex=obj.style.zIndex||0;
			}
			if(zindex) {
				var items = levelItems[zindex] || (levelItems[zindex] = []);
				items.push(obj);					
			}
		});
		
		for(var index in levelItems) {
			oadd.call(this,levelItems[index]);
		}

		self.needUpdate = true;
	}
	this.children.clear = function() {
		this.each(function(i,obj) {
			this.remove(obj);
		},true);
	}

	this.needUpdate = true;
} 

/**
 * 设置鼠标指针
 * 
 * @method cursor
 * @for jmControl
 * @param {string} cur css鼠标指针标识,例如:pointer,move等
 */
jmControl.prototype.cursor = function(cur) {	
	var graph = this.graph || this.findParent('jmGraph');
	if(graph) {		
		graph.css('cursor',cur);		
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
		//var styleValue = style[mpkey||name]||style;
		if(style) {
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
						'miterLimit': 'miterLimit',
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
				var t = typeof style;	
				var mpname = styleMap[mpkey || name];

				//如果为渐变对象
				if(jmUtils.isType(style,jmGradient) || (t == 'string' && style.indexOf('-gradient') > -1)) {
					//如果是渐变，则需要转换
					if(t == 'string' && style.indexOf('-gradient') > -1) {
						style = new jmGradient(style);
					}
					__setStyle(control,style.toGradient(control),mpname||name);	
				}
				else if(t == 'function') {					
					if(mpname) {
						style = style.call(this, mpname);
						if(style) {
							__setStyle(control,style,mpname);	
						}
					}
				}
				else if(mpname) {
					//只有存在白名单中才处理
					//颜色转换
					if(t == 'string' && ['fillStyle', 'strokeStyle', 'shadowColor'].indexOf(mpname) > -1) {
						style = jmUtils.toColor(style);
					}					
					control.context[mpname] = style;
				}	
				else {
					switch(name) {
						//阴影样式
						case 'shadow' : {
							if(t == 'string') {
								__setStyle(control, new jmShadow(style), name);
								break;
							}
							for(var k in style) {
								__setStyle(control, style[k], k, name + '.' + k);
							}
							break;
						}
						//平移
						case 'translate' : {
							control.context.translate(style.x,style.y);
							break;
						}
						//旋转
						case 'rotation' : {								
							//旋 转先移位偏移量
							var tranX = 0;
							var tranY = 0;
							//旋转，则移位，如果有中心位则按中心旋转，否则按左上角旋转
							//这里只有style中的旋转才能生效，不然会导至子控件多次旋转
							if(style.point) {
								var bounds = control.absoluteBounds?control.absoluteBounds:control.getAbsoluteBounds();
								style = control.getRotation(style);
								
								tranX = style.rotateX + bounds.left;
								tranY = style.rotateY + bounds.top;	
							}
												
							if(tranX!=0 || tranY != 0) control.context.translate(tranX,tranY);
							control.context.rotate(style.angle);
							if(tranX!=0 || tranY != 0) control.context.translate(-tranX,-tranY);
							break;
						}
						case 'transform' : {
							if(jmUtils.isArray(style)) {
								control.context.transform.apply(control.context,style);
							}
							else if(typeof style == 'object') {
								control.context.transform(style.scaleX,//水平缩放
									style.skewX,//水平倾斜
									style.skewY,//垂直倾斜
									style.scaleY,//垂直缩放
									style.offsetX,//水平位移
									style.offsetY);//垂直位移
							}								
							break;
						}
						//位移
						case 'translate' : {
							control.context.translate(style.x,style.y);			
							break;
						}
						//鼠标指针
						case 'cursor' : {
							control.cursor(style);
							break;
						}
					}							
				}			
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
	//设置样式
	for(var k in style) {
		var t = typeof style[k];
		//先处理部分样式，以免每次都需要初始化解析
		if(t == 'string' && style[k].indexOf('-gradient') > -1) {
			style[k] = new jmGradient(style[k]);
		}
		else if(t == 'string' && k == 'shadow') {
			style[k] = new jmShadow(style[k]);
		}
		__setStyle(this,style[k],k);
	}
}

/**
 * 获取当前控件的边界
 * 通过分析控件的描点或位置加宽高得到为方形的边界
 *
 * @method getBounds
 * @for jmControl
 * @param {boolean} [isReset=false] 是否强制重新计算
 * @return {object} 控件的边界描述对象(left,top,right,bottom,width,height)
 */
jmControl.prototype.getBounds = function(isReset) {
	//如果当次计算过，则不重复计算
	if(this.bounds && !isReset) return this.bounds;

	var rect = {
		left: undefined, //只能初始化成undefined，这样会认为没有被设置
		top: undefined
	};
	//jmGraph，特殊处理
	if(this.type == 'jmGraph' && this.canvas) {
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
	}
	else if(this.points && this.points.length > 0) {		
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
	return this.bounds=rect;
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
	//if(reset !== true && this.location) return this.location;

	var local = this.location = {left:0,top:0,width:0,height:0};
	local.position = typeof this.position == 'function'? this.position(): this.position;	
	local.center = this.center && typeof this.center === 'function'?this.center(): this.center;//中心
	local.start = this.start && typeof this.start === 'function'?this.start(): this.start;//起点
	local.end = this.end && typeof this.end === 'function'?this.end(): this.end;//起点
	local.radius = this.radius;//半径
	local.width = this.width;
	local.height = this.height;

	var margin = this.style.margin || {};
	margin.left = margin.left || 0;
	margin.top = margin.top || 0;
	margin.right = margin.right || 0;
	margin.bottom = margin.bottom || 0;
	
	//如果没有指定位置，但指定了margin。则位置取margin偏移量
	if(local.position) {
		local.left = local.position.x;
		local.top = local.position.y;
	}
	else {
		local.left = margin.left;
		local.top = margin.top;
	}

	if(!this.parent) return local;//没有父节点则直接返回
	var parentBounds = this.parent.getBounds();	

	//处理百分比参数
	if(jmUtils.checkPercent(local.left)) {
		local.left = jmUtils.percentToNumber(local.left) * parentBounds.width;
	}
	if(jmUtils.checkPercent(local.top)) {
		local.top = jmUtils.percentToNumber(local.top) * parentBounds.height;
	}
	
	//如果没有指定宽度或高度，则按百分之百计算其父宽度或高度
	if(jmUtils.checkPercent(local.width)) {
		local.width = jmUtils.percentToNumber(local.width) * parentBounds.width;
	}
	if(jmUtils.checkPercent(local.height)) {
		local.height = jmUtils.percentToNumber(local.height) * parentBounds.height;
	}
	//处理中心点
	if(local.center) {
		//处理百分比参数
		if(jmUtils.checkPercent(local.center.x)) {
			local.center.x = jmUtils.percentToNumber(local.center.x) * parentBounds.width;
		}
		if(jmUtils.checkPercent(local.center.y)) {
			local.center.y = jmUtils.percentToNumber(local.center.y) * parentBounds.height;
		}
	}
	if(local.radius) {
		//处理百分比参数
		if(jmUtils.checkPercent(local.radius)) {
			local.radius = jmUtils.percentToNumber(local.radius) * Math.min(parentBounds.width, parentBounds.height);
		}		
	}
	return local;
}

/**
 * 获取当前控制的旋转信息
 * @returns {object} 旋转中心和角度
 */
jmControl.prototype.getRotation = function(rotation) {
	rotation = rotation || this.style.rotation;
	if(!rotation) {
		//如果本身没有，则可以继承父级的
		rotation = this.parent && this.parent.getRotation?this.parent.getRotation():null;
		//如果父级有旋转，则把坐标转换为当前控件区域
		if(rotation) {
			var bounds = this.getBounds();
			rotation.rotateX -= bounds.left;
			rotation.rotateY -= bounds.top;
		}
	}
	else {
		var bounds = this.getBounds();
		rotation.rotateX = rotation.point.x;
		if(jmUtils.checkPercent(rotation.rotateX)) {
			rotation.rotateX  = jmUtils.percentToNumber(rotation.rotateX) * bounds.width;
		}

		rotation.rotateY = rotation.point.y;
		if(jmUtils.checkPercent(rotation.rotateY)) {
			rotation.rotateY  = jmUtils.percentToNumber(rotation.rotateY) * bounds.height;
		}
	}
	return rotation;

}

/**
 * 移除当前控件
 * 如果是VML元素，则调用其删除元素
 *
 * @method remove 
 */
jmControl.prototype.remove = function() {	
	if(this.parent) {
		this.parent.children.remove(this);
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
 * @param {object} [evt] 如果是事件触发，则传递move事件参数
 */
jmControl.prototype.offset = function(x, y, trans, evt) {
	trans = trans === false?false:true;	
	var local = this.getLocation(true);
	
	var offseted = false;
	
	if(local.position) {
		local.left += x;
		local.top += y;
		local.position.x = local.left;
		local.position.y = local.top;
		offseted = true;
	}

	if(offseted == false && local.center) {		
		local.center.x = local.center.x + x;
		local.center.y = local.center.y + y;
		offseted = true;
	}

	if(local.start && typeof local.start == 'object') {	
		local.start.x = local.start.x + x;
		local.start.y = local.start.y + y;
		offseted = true;
	}

	if(local.end && typeof local.end == 'object') {		
		local.end.x = local.end.x + x;
		local.end.y = local.end.y + y;
		offseted = true;
	}


	if(offseted == false && this.cpoints) {
		var p = typeof this.cpoints == 'function'?this.cpoints:this.cpoints;
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
	this.emit('move',{offsetX:x,offsetY:y,trans:trans,evt:evt});

	this.needUpdate = true;
}

/**
 * 把图形旋转一个角度
 * @param {number} angle 旋转角度
 * @param {object} point 旋转坐标，可以是百分比,例如：{x: '50%',y: '50%'}
 */
jmControl.prototype.rotate = function(angle, point) {	
	/*this.children.each(function(i,c){
		c.rotate(angle);
	});*/
	this.style.rotation = {
		angle: angle,
		point: point
	};

	this.needUpdate = true;
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
	var rec = this.getBounds();
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

	this.needUpdate = false;
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
}

/**
 * 绘制当前控件
 * 协调控件的绘制，先从其子控件开始绘制，再往上冒。
 *
 * @method paint
 */
jmControl.prototype.paint = function(v) {
	if(v !== false && this.visible !== false) {		
		if(this.initPoints) this.initPoints();
		//计算当前边界
		this.bounds = null;
		this.absoluteBounds = this.getAbsoluteBounds();

		this.context.save();
		
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
		
		//兼容小程序
		if(this.type == 'jmGraph' && this.context.draw) this.context.draw();
		this.needUpdate = false;
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
 * @param {number} [pad] 可选参数，表示线条多远内都算在线上
 * @return {boolean} 当前位置如果在区域内则为true,否则为false。
 */
jmControl.prototype.checkPoint = function(p, pad) {
	//jmGraph 需要判断dom位置
	if(this.type == 'jmGraph') {
		//获取dom位置
		var position = this.getPosition();
		if(p.pageX > position.right || p.pageX < position.left) {
			return false;
		}
		if(p.pageY > position.bottom || p.pageY < position.top) {
			return false;
		}	
		return true;
	}
	
				var bounds = this.getBounds();	
	var rotation = this.getRotation();//获取当前旋转参数
	var ps = this.points;
	//如果不是路径组成，则采用边界做为顶点
	if(!ps || !ps.length) {
		ps = [];
		ps.push({x: bounds.left, y: bounds.top}); //左上角
		ps.push({x: bounds.right, y: bounds.top});//右上角
		ps.push({x: bounds.right, y: bounds.bottom});//右下角
		ps.push({x: bounds.left, y: bounds.bottom}); //左下
		ps.push({x: bounds.left, y: bounds.top}); //左上角   //闭合
	}
	//如果有指定padding 表示接受区域加宽，命中更易
	pad = Number(pad || this.style['touchPadding'] || this.style['lineWidth'] || 1);
	if(ps && ps.length) {
		
		//如果有旋转参数，则需要转换坐标再处理
		if(rotation && rotation.angle != 0) {
			ps = jmUtils.clone(ps, true);//拷贝一份数据
			//rotateX ,rotateY 是相对当前控件的位置
			ps = jmUtils.rotatePoints(ps, {
				x: rotation.rotateX + bounds.left,
				y: rotation.rotateY + bounds.top
			}, rotation.angle);
		}
		//如果当前路径不是实心的
		//就只用判断点是否在边上即可	
		if(ps.length > 2 && (!this.style['fill'] || this.style['stroke'])) {
			var i = 0;
			var count = ps.length;
			for(var j = i+1; j <= count; j = (++i + 1)) {
				//如果j超出最后一个
				//则当为封闭图形时跟第一点连线处理.否则直接返回false
				if(j == count) {
					if(this.style.close) {
						var r = jmUtils.pointInPolygon(p,[ps[i],ps[0]], pad);
						if(r) return true;
					}
				} 
				else {
					//判断是否在点i,j连成的线上
					var s = jmUtils.pointInPolygon(p,[ps[i],ps[j]], pad);
					if(s) return true;
				}			
			}
			//不是封闭的图形，则直接返回
			if(!this.style['fill']) return false;
		}

		var r = jmUtils.pointInPolygon(p,ps, pad);		
		return r;
	}

	if(p.x > bounds.right || p.x < bounds.left) {
		return false;
	}
	if(p.y > bounds.bottom || p.y < bounds.top) {
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
		var graph = this.graph || this.findParent('jmGraph');
		var position = jmUtils.getEventPosition(args,graph.scaleSize);//初始化事件位置		

		var srcElement = args.srcElement || args.target;
		args = {position:position,
			button:args.button == 0||position.isTouch?1:args.button,
			keyCode:args.keyCode || args.charCode || args.which,
			ctrlKey:args.ctrlKey,
			cancel : false,
			srcElement : srcElement
		};		
	}
	args.path = args.path||[]; //事件冒泡路径
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
		
		args.path.push(this);

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
			//如果鼠标经过当前可移动控件，则显示可移动指针
			//if(evt.path && evt.path.indexOf(_this)>-1) {
			//	_this.cursor('move');	
			//}

			if(_this.__mvMonitor.mouseDown) {
				_this.parent.bounds = null;
				var parentbounds = _this.parent.getAbsoluteBounds();		
				var offsetx = evt.position.offsetX - _this.__mvMonitor.curposition.x;
				var offsety = evt.position.offsetY - _this.__mvMonitor.curposition.y;				
				//console.log(offsetx + ',' + offsety);
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
					_this.offset(offsetx, offsety, true, evt);
					_this.__mvMonitor.curposition.x = evt.position.offsetX;
					_this.__mvMonitor.curposition.y = evt.position.offsetY;	
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
				//_this.cursor('default');
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
				//_this.cursor('default');	
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
			
			if(this.__mvMonitor.mouseDown) return;
			if(evt.button == 0 || evt.button == 1) {
				this.__mvMonitor.mouseDown = true;
				//this.cursor('move');
				var parentbounds = this.parent.absoluteBounds || this.parent.getAbsoluteBounds();	
				this.__mvMonitor.curposition.x = evt.position.x + parentbounds.left;
				this.__mvMonitor.curposition.y = evt.position.y + parentbounds.top;
				//触发控件移动事件
				this.emit('movestart',{position:this.__mvMonitor.curposition});
				
				evt.cancel = true;
				return false;
			}			
		}
	}
	graph = graph || this.graph || this.findParent('jmGraph');//获取最顶级元素画布
	
	if(m !== false) {
		
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
	return this;
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
jmUtils.extend(jmShape, jmControl);


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

function jmPath(graph, params) {
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
 * 描点集合
 * point格式：{x:0,y:0,m:true}
 * @property points
 * @type {array}
 */
jmUtils.createProperty(jmPath.prototype, 'points');

/**
 * 重写检查坐标是否在区域内
 * 支持任意多边形
 * 根据边界检查某个点是否在区域内，如果样式有fill，则只要在内有效，如果只有stroke则在边框上有效
 *
 * @method checkPoint
 * @param {point} p 待检查的坐标
 * @return {boolean} 如果在则返回true,否则返回false
 */
/*jmPath.prototype.checkPoint = function(p) {	
	var w = this.style['lineWidth'] || 1;
	var ps = this.points;

	var rotation = this.getRotation();//获取当前旋转参数
	//如果有旋转参数，则需要转换坐标再处理
	if(rotation) {
		ps = [].concat(ps);//拷贝一份数据
		ps = jmUtils.rotatePoints(ps, {
			x: rotation.rotateX,
			y: rotation.rotateY
		}, rotation.angle);
	}
	//如果当前路径不是实心的
	//就只用判断点是否在边上即可	
	if(ps.length > 2 && (!this.style['fill'] || this.style['stroke'])) {
		var i = 0;
		var count = ps.length;
		for(var j = i+1; j <= count; j = (++i + 1)) {
			//如果j超出最后一个
			//则当为封闭图形时跟第一点连线处理.否则直接返回false
			if(j == count) {
				if(this.style.close) {
					var r = jmUtils.pointInPolygon(p,[ps[i],ps[0]],w);
					if(r) return true;
				}
			} 
			else {
				//判断是否在点i,j连成的线上
				var s = jmUtils.pointInPolygon(p,[ps[i],ps[j]],w);
				if(s) return true;
			}			
		}
		//不是封闭的图形，则直接返回
		if(!this.style['fill']) return false;
	}

	var r = jmUtils.pointInPolygon(p,ps,w);
	return r;
}*/


if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['path'] = jmPath;
}


/**
 * 圆弧图型 继承自jmPath
 * 参数params说明:center=当前圆弧中心,radius=圆弧半径,start=圆弧起始角度,end=圆弧结束角度,anticlockwise=  false  顺时针，true 逆时针
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
		
	this.center = params.center || {x:0,y:0};
	this.radius = params.radius || 0;

	this.startAngle = params.start || params.startAngle || 0;
	this.endAngle = params.end || params.endAngle || Math.PI * 2;

	this.width = params.width || 0;
	this.height = params.height  || 0;

	this.anticlockwise = params.anticlockwise  || 0;

	this.initializing(graph.context,style);
}
jmUtils.extend(jmArc, jmPath);//jmPath

/**
 * 中心点
 * point格式：{x:0,y:0,m:true}
 * @property center
 * @type {point}
 */
jmUtils.createProperty(jmArc.prototype, 'center');

/**
 * 半径
 * @property radius
 * @type {number}
 */
jmUtils.createProperty(jmArc.prototype, 'radius', 0);

/**
 * 扇形起始角度
 * @property startAngle
 * @type {number}
 */
jmUtils.createProperty(jmArc.prototype, 'startAngle', 0);

/**
 * 扇形结束角度
 * @property endAngle
 * @type {number}
 */
jmUtils.createProperty(jmArc.prototype, 'endAngle', 2*Math.PI);

/**
 * 可选。规定应该逆时针还是顺时针绘图
 * false  顺时针，true 逆时针
 * @property anticlockwise
 * @type {boolean}
 */
jmUtils.createProperty(jmArc.prototype, 'anticlockwise', false);


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
	
	var start = this.startAngle;
	var end = this.endAngle;
	var anticlockwise = this.anticlockwise;
	this.points = [];
	var step = 1/Math.max(mw,mh);

	//如果是逆时针绘制，则角度为负数，并且结束角为2Math.PI-end
	if(anticlockwise) {
		var p2 =  Math.PI*2;
		start = p2 - start;
		end = p2 - end;
	}
	if(start > end) step = -step;
	
	//椭圆方程x=a*cos(r) ,y=b*sin(r)	
	for(var r=start;;r += step) {
		if(step > 0 && r >= end) break;
		else if(step < 0 && r <= end) break;
		
		var p = {
			x : Math.cos(r) * mw + cx,
			y : Math.sin(r) * mh + cy
		};
		this.points.push(p);
	}
	return this.points;
}

if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['arc'] = jmArc;
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
	
	this.angle = params.angle  || 0;
	this.start = params.start  || {x:0,y:0};
	this.end = params.end  ||  {x:0,y:0};
	this.offsetX = params.offsetX || 5;
	this.offsetY = params.offsetY || 8;
	this.initializing(graph.context,style);
}

jmUtils.extend(jmArraw, jmPath);//jmPath

/**
 * 控制起始点
 *
 * @property start
 * @for jmArraw
 * @type {point}
 */
jmUtils.createProperty(jmArraw.prototype, 'start');

/**
 * 控制结束点
 *
 * @property end
 * @for jmArraw
 * @type {point} 结束点
 */
jmUtils.createProperty(jmArraw.prototype, 'end');

/**
 * 箭头角度
 *
 * @property angle
 * @for jmArraw
 * @type {number} 箭头角度
 */
jmUtils.createProperty(jmArraw.prototype, 'angle');

/**
 * 箭头X偏移量
 *
 * @property offsetX
 * @for jmArraw
 * @type {number}
 */
jmUtils.createProperty(jmArraw.prototype, 'offsetX');

/**
 * 箭头Y偏移量
 *
 * @property offsetY
 * @for jmArraw
 * @type {number}
 */
jmUtils.createProperty(jmArraw.prototype, 'offsetY');


/**
 * 初始化图形点
 * 
 * @method initPoint
 * @private
 * @param {boolean} solid 是否为实心的箭头
 * @for jmArraw
 */
jmArraw.prototype.initPoints = function(solid) {	
	var rotate = this.angle;
	var start = this.start;
	var end = this.end;
	if(!end) return;
	//计算箭头指向角度
	if(!rotate) {
		rotate = Math.atan2(end.y - start.y,end.x - start.x);
	}
	this.points = [];
	var offx = this.offsetX;
	var offy = this.offsetY;
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
    	this.points.push(end);
    }
    else {
    	this.points.push(s);
    	this.points.push(p2);
    }
    
	return this.points;
}

if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['arraw'] = jmArraw;
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
	this.cpoints = params.points || [];
	this.points = [];
	var style = params.style || {};
	
	this.graph = graph;
	this.initializing(graph.context, style);
}
jmUtils.extend(jmBezier, jmPath);//继承path图形

/**
 * 控制点
 *
 * @property cpoints
 * @for jmBezier
 * @type {array}
 */
jmUtils.createProperty(jmBezier.prototype, 'cpoints');

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
	
	var cps = this.cpoints;
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
	var p = this.cpoints;
	if(p) {			
		var len = p.length;
		for(var i=0; i < len;i++) {
			p[i].x += x;
			p[i].y += y;
		}		
		
		//触发控件移动事件	
		this.emit('move',{offsetX:x,offsetY:y,trans:trans});
		this.getLocation(true);	//重置
	}
}

if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['bezier'] = jmBezier;
}
/**
 * 画规则的圆弧
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
		
	this.center = params.center || {x:0,y:0};
	this.radius = params.radius || 0;

	this.startAngle = params.start || params.startAngle || 0;
	this.endAngle = params.end || params.endAngle || Math.PI * 2;

	this.width = params.width || 0;
	this.height = params.height  || 0;

	this.anticlockwise = params.anticlockwise  || 0;

	this.initializing(graph.context,style);
}
jmUtils.extend(jmCircle, jmArc);//继承path图形

/**
 * 初始化图形点
 * 
 * @method initPoint
 * @private
 * @for jmCircle
 */
jmCircle.prototype.initPoints = function() {	
	
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
	var start = this.startAngle;
	var end = this.endAngle;
	var anticlockwise = this.anticlockwise;
	//context.arc(x,y,r,sAngle,eAngle,counterclockwise);
	this.context.arc(location.center.x + bounds.left,location.center.y + bounds.top, location.radius, start,end,anticlockwise);
}


if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['circle'] = jmCircle;
}

/**
 * 画空心圆弧,继承自jmPath
 *
 * @class jmHArc
 * @for jmGraph
 * @module jmGraph
 * @param {jmGraph} graph 画布
 * @param {object} params 空心圆参数:minRadius=中心小圆半径,maxRadius=大圆半径,start=起始角度,end=结束角度,anticlockwise=false  顺时针，true 逆时针
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
		
	this.center = params.center || {x:0,y:0};
	this.minRadius = params.minRadius || style.minRadius || 0;
	this.maxRadius = params.maxRadius || style.maxRadius || 0;

	this.startAngle = params.start || params.startAngle || 0;
	this.endAngle = params.end || params.endAngle || Math.PI * 2;

	this.width = params.width || 0;
	this.height = params.height  || 0;

	this.anticlockwise = params.anticlockwise  || 0;

	this.initializing(graph.context,style);
}
jmUtils.extend(jmHArc, jmPath);//jmPath

/**
 * 中心点
 * point格式：{x:0,y:0,m:true}
 * @property center
 * @type {point}
 */
jmUtils.createProperty(jmHArc.prototype, 'center');

/**
 * 设定或获取内空心圆半径
 * 
 * @property minRadius
 * @for jmHArc
 * @type {number} 
 */
jmUtils.createProperty(jmHArc.prototype, 'minRadius');

/**
 * 设定或获取外空心圆半径
 * 
 * @property maxRadius
 * @for jmHArc
 * @type {number} 
 */
jmUtils.createProperty(jmHArc.prototype, 'maxRadius');

/**
 * 扇形起始角度
 * @property startAngle
 * @type {number}
 */
jmUtils.createProperty(jmHArc.prototype, 'startAngle', 0);

/**
 * 扇形结束角度
 * @property endAngle
 * @type {number}
 */
jmUtils.createProperty(jmHArc.prototype, 'endAngle', 2*Math.PI);

/**
 * 可选。规定应该逆时针还是顺时针绘图
 * False  顺时针，true 逆时针
 * @property anticlockwise
 * @type {boolean}
 */
jmUtils.createProperty(jmHArc.prototype, 'anticlockwise', false);

/**
 * 初始化图形点
 *
 * @method initPoints
 * @private
 */
jmHArc.prototype.initPoints = function() {	
	var location = this.getLocation();	
	//如果设定了半径。则以半径为主
	var minr = this.minRadius;
	var maxr = this.maxRadius;
	
	var start = this.startAngle;
	var end = this.endAngle;
	var anticlockwise = this.anticlockwise;

	//如果是逆时针绘制，则角度为负数，并且结束角为2Math.PI-end
	if(anticlockwise) {
		var p2 =  Math.PI*2;
		start = p2 - start;
		end = p2 - end;
	}

	var step = 0.1;
	if(start > end) step = -step;

	var minps = [];
	var maxps = [];
	//椭圆方程x=a*cos(r) ,y=b*sin(r)
	for(var r=start;;r += step) {
		if(step > 0 && r >= end) break;
		else if(step < 0 && r <= end) break;

		var cos = Math.cos(r);
		var sin = Math.sin(r);
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

if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['harc'] = jmHArc;
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
		
	this.start = params.start || {x:0,y:0};
	this.end = params.end || {x:0,y:0};
	//this.points.push(this.start);
	//this.points.push(this.end);

	style.lineType = style.lineType || 'solid';
	style.dashLength = style.dashLength || 4;
	this.initializing(graph.context,style);
}
jmUtils.extend(jmLine, jmPath);//继承path图形

/**
 * 控制起始点
 * 
 * @property start
 * @for jmLine
 * @type {point}
 */
jmUtils.createProperty(jmLine.prototype, 'start');

/**
 * 控制结束点
 * 
 * @property end
 * @for jmLine
 * @type {point}
 */
jmUtils.createProperty(jmLine.prototype, 'end');

/**
 * 初始化图形点,如呆为虚线则根据跳跃间隔描点
 * @method initPoints
 * @private
 */
jmLine.prototype.initPoints = function() {	
	var start = this.start;
	var end = this.end;
	this.points = [];	
	this.points.push(start);

	if(this.style.lineType === 'dotted') {			
		var dx = end.x - start.x;
		var dy = end.y - start.y;
		var lineLen = Math.sqrt(dx * dx + dy * dy);
		dx = dx / lineLen;
		dy = dy / lineLen;
		var dottedstart = false;

		var dashLen = this.style.dashLength || 5;
		var dottedsp = dashLen / 2;
		for(var l=dashLen; l<=lineLen;) {
			if(dottedstart == false) {
				this.points.push({x:start.x + dx * l,y:start.y+ dy * l});
				l += dottedsp;
			}
			else {				
				this.points.push({x:start.x + dx * l,y:start.y+ dy * l,m:true});
				l += dashLen;
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



if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['line'] = jmLine;
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
	style.close = typeof style.close == 'undefined'? true : style.close;
	this.graph = graph;
		
	this.center = params.center || {x:0,y:0};
	this.width = params.width || 0;

	//this.on('PropertyChange',this.initPoints);
	this.height = params.height  || 0;

	this.initializing(graph.context,style);
}
jmUtils.extend(jmPrismatic, jmPath);//继承path图形

/**
 * 中心点
 * point格式：{x:0,y:0,m:true}
 * @property center
 * @type {point}
 */
jmUtils.createProperty(jmPrismatic.prototype, 'center');

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

if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['prismatic'] = jmPrismatic;
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
	this.createProperty('points', params.points || []);
	var style = params.style || {};
	style.close = true;
	
	this.createProperty('graph', graph);
	
	this.position = params.position || {x:0,y:0};
	this.width = params.width || 0;
	this.height = params.height  || 0;
	this.radius = params.radius || style.radius || 0;
	this.graph = graph;

	this.initializing(graph.context,style);
}
jmUtils.extend(jmRect, jmPath);//jmPath

/**
 * 圆角半径
 * @property radius
 * @type {number}
 */
jmUtils.createProperty(jmRect.prototype, 'radius', 0);

/**
 * 获取当前控件的边界
 *
 * @method getBounds
 * @return {bound} 当前控件边界
 */
jmRect.prototype.getBounds = function() {
	 var rect = {};
    this.initPoints();
    var p = this.getLocation();
    rect.left = p.left; 
    rect.top = p.top; 
    
    rect.right = p.left + p.width; 
    rect.bottom = p.top + p.height; 
    
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
/*jmRect.prototype.checkPoint = function(p) {	
	//生成当前坐标对应的父级元素的相对位置
	var abounds = this.bounds || this.getBounds();

	if(p.x > abounds.right || p.x < abounds.left) {
		return false;
	}
	if(p.y > abounds.bottom || p.y < abounds.top) {
		return false;
	}
	
	return true;
}*/

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

	//如果指定为虚线 , 则初始化一个直线组件，来构建虚线点集合
	if(this.style.lineType === 'dotted' && !this.dottedLine) {
		this.dottedLine = this.graph.createShape('line', {style: this.style});
	}
	
	//如果有边界弧度则借助圆弧对象计算描点
	if(location.radius && location.radius < location.width/2 && location.radius < location.height/2) {
		var q = Math.PI / 2;
		var arc = this.graph.createShape('arc',{radius:location.radius,anticlockwise:false});
		arc.center = {x:location.left + location.radius,y:location.top+location.radius};
		arc.startAngle = Math.PI;
		arc.endAngle = Math.PI + q;
		var ps1 = arc.initPoints();
		
		arc = this.graph.createShape('arc',{radius:location.radius,anticlockwise:false});
		arc.center = {x:p2.x - location.radius,y:p2.y + location.radius};
		arc.startAngle = Math.PI + q;
		arc.endAngle = Math.PI * 2;
		var ps2 = arc.initPoints();
		
		arc = this.graph.createShape('arc',{radius:location.radius,anticlockwise:false});
		arc.center = {x:p3.x - location.radius,y:p3.y - location.radius};
		arc.startAngle = 0;
		arc.endAngle = q;
		var ps3 = arc.initPoints();
		
		arc = this.graph.createShape('arc',{radius:location.radius,anticlockwise:false});
		arc.center = {x:p4.x + location.radius,y:p4.y - location.radius};
		arc.startAngle = q;
		arc.endAngle = Math.PI;
		var ps4 = arc.initPoints();
		this.points = ps1.concat(ps2,ps3,ps4);
	}
	else {
		this.points = [];
		this.points.push(p1);
		//如果是虚线
		if(this.dottedLine) {
			this.dottedLine.start = p1;
			this.dottedLine.end = p2;
			this.points = this.points.concat(this.dottedLine.initPoints());
		}
		this.points.push(p2);
		//如果是虚线
		if(this.dottedLine) {
			this.dottedLine.start = p2;
			this.dottedLine.end = p3;
			this.points = this.points.concat(this.dottedLine.initPoints());
		}
		this.points.push(p3);
		//如果是虚线
		if(this.dottedLine) {
			this.dottedLine.start = p3;
			this.dottedLine.end = p4;
			this.points = this.points.concat(this.dottedLine.initPoints());
		}
		this.points.push(p4);
		//如果是虚线
		if(this.dottedLine) {
			this.dottedLine.start = p4;
			this.dottedLine.end = p1;
			this.points = this.points.concat(this.dottedLine.initPoints());
		}
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

if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['rect'] = jmRect;
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
	style.lineJoin = style.lineJoin||'miter';
	
	this.graph = graph;
	this.type = 'jmArrawLine';
	this.start = params.start || (params.start={x:0,y:0});
	this.end = params.end || (params.end={x:0,y:0});

	this.initializing(graph.context,style);
	
	this.line = graph.createShape('line', params) ;
	this.arraw = graph.createShape('arraw', params);
}
jmUtils.extend(jmArrawLine, jmPath);//jmPath

/**
 * 结束点
 * @property end
 * @type {point}
 */
jmUtils.createProperty(jmArrawLine.prototype, 'end');

/**
 * 起点
 * @property start
 * @type {point}
 */
jmUtils.createProperty(jmArrawLine.prototype, 'start');

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

if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['arrawline'] = jmArrawLine;
}


/**
 * 图片控件，继承自jmControl
 * params参数中image为指定的图片源地址或图片img对象，
 * postion=当前控件的位置，width=其宽度，height=高度，sourcePosition=从当前图片中展示的位置，sourceWidth=从图片中截取的宽度,sourceHeight=从图片中截取的高度。
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
	style.fill = style.fill || 'transparent';//默认指定一个fill，为了可以鼠标选中
	this.graph = graph;
	
	/**
	 * 要使用的图像的宽度。（伸展或缩小图像）
	 *
	 * @method width
	 * @type {number}
	 */
	this.width = params.width;
	/**
	 * 要使用的图像的高度。（伸展或缩小图像）
	 *
	 * @method height
	 * @type {number}
	 */
	this.height = params.height;

	this.type = 'jmImage';
	this.position = params.position || {x:0,y:0};
	this.sourceWidth = params.sourceWidth;
	this.sourceHeight = params.sourceHeight;
	this.sourcePosition = params.sourcePosition;
	this.image = params.image || style.image;
	this.initializing(graph.context, style);
}

jmUtils.extend(jmImage, jmControl);//继承基础图形

/**
 * 画图开始剪切位置
 *
 * @property sourcePosition
 * @type {point}
 */
jmUtils.createProperty(jmImage.prototype, 'sourcePosition');

/**
 * 被剪切宽度
 *
 * @property sourceWidth
 * @type {number}
 */
jmUtils.createProperty(jmImage.prototype, 'sourceWidth');

/**
 * 被剪切高度
 *
 * @method sourceHeight
 * @type {number}
 */
jmUtils.createProperty(jmImage.prototype, 'sourceHeight');

/**
 * 设定要绘制的图像或其它多媒体对象，可以是图片地址，或图片image对象
 *
 * @method image
 * @type {number}
 */
jmUtils.createProperty(jmImage.prototype, 'image');

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
		
		var sp = this.sourcePosition;
		var sw = this.sourceWidth;
		var sh = this.sourceHeight;
		var img = this.getImage();
			
		if(sp || typeof sw != 'undefined' || typeof sh != 'undefined') {	
			if(typeof sw == 'undefined') sw= p.width || img.width || 0;
			if(typeof sh == 'undefined') sh= p.height || img.height || 0;
			sp = sp || {x:0, y:0};

			if(p.width && p.height) this.context.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,p.width,p.height);
			else if(p.width) {
				this.context.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,p.width,sh);
			}		
			else if(p.height) {
				this.context.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,sw,p.height);
			}		
			else this.context.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,sw,sh);		
		}
		else if(p) {
			if(p.width && p.height) this.context.drawImage(img,p.left,p.top,p.width,p.height);
			else if(p.width) this.context.drawImage(img,p.left,p.top,p.width,img.height);
			else if(p.height) this.context.drawImage(img,p.left,p.top,img.width,p.height);
			else this.context.drawImage(img,p.left,p.top);
		}
		else {
			this.context.drawImage(img);
		}
	}
	catch(e) {
		console.error && console.error(e);
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
	var img = this.getImage();
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
 * img对象
 *
 * @method getImage
 * @return {img} 图片对象
 */
jmImage.prototype.getImage = function() {
	var src = this.image || this.style.src || this.style.image;
	if(this.__img && this.__img.src && this.__img.src.indexOf(src) != -1) {
		return this.__img;
	}
	else if(src && src.src) {
		this.__img = src;
	}
	else if(document && document.createElement) {
		this.__img = document.createElement('img');
		if(src && typeof src == 'string') this.__img.src = src;
	}
	else {
		this.__img = src;
	}
	return this.__img;
}

if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['image'] = jmImage;
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
	this.text = params.text||'';
	this.position = params.position || {x:0,y:0};
	this.width = params.width || 0;
	this.height = params.height  || 0;

	this.initializing(graph.context,style);
}
jmUtils.extend(jmLabel, jmControl);//jmPath


/**
 * 显示的内容
 * @property text
 * @type {string}
 */
jmUtils.createProperty(jmLabel.prototype, 'text');

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
						this.context.measureText(this.text):
						{width:15};
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

	var txt = this.text;
	if(txt) {
		if(this.style.fill && this.context.fillText) {
			if(this.style.maxWidth) {
				this.context.fillText(txt,x,y,this.style.maxWidth);
			}
			else {
				this.context.fillText(txt,x,y);
			}
		}
		else if(this.context.strokeText) {
			if(this.style.maxWidth) {
				this.context.strokeText(txt,x,y,this.style.maxWidth);
			}
			else {
				this.context.strokeText(txt,x,y);
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

if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['label'] = jmLabel;
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
	this.position = params.position || {x:0, y:0};
	this.width = params.width || 0;
	this.height = params.height || 0;
	this.points = params.points || [];
	this.rectSize = params.rectSize || 8;
	style.close = style.close || true;
	
	this.initializing(graph.context, style);
	this.init();
}

jmUtils.extend(jmResize, jmRect);//jmRect

/**
 * 拉动的小方块大小
 * @property rectSize
 * @type {number}
 */
jmUtils.createProperty(jmResize.prototype, 'rectSize', 8);

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
	var rs = this.rectSize;
	var rectStyle = this.style.rectStyle || {
			stroke: 'red',
			fill: 'transparent',
			lineWidth: 2,
			close: true,
			zIndex:100
		};
	rectStyle.close = true;
	rectStyle.fill = rectStyle.fill || 'transparent';
	
	for(var i = 0;i<8;i++) {
		//生成改变大小方块
		var r = this.graph.createShape('rect',{
				position:{x:0,y:0},
				width: rs,
				height: rs,
				style: rectStyle
			});
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
				dx = - arg.offsetX;
				px = arg.offsetX;
				dy = arg.offsetY;				
			}
			//重新定位
			this.parent.reset(px,py,dx,dy);
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
	var minWidth = typeof this.style.minWidth=='undefined'?5:this.style.minWidth;
	var minHeight = typeof this.style.minHeight=='undefined'?5:this.style.minHeight;

	var location = this.getLocation();
	if(dx != 0 || dy != 0) {
		var w = location.width + dx;
		var h = location.height + dy;
		if(w >= minWidth || h >= minHeight) {
			if(w >= minWidth) {
				this.width = w;
			}
			else {
				px = 0;
				dx = 0;
			}
			if(h >= minHeight) {
				this.height = h;
			}
			else {
				py = 0;
				dy = 0;
			}
			//如果当前控件能移动才能改变其位置
			if(this.params.movable !== false && (px||py)) {
				var p = this.position;
				p.x = location.left + px;
				p.y = location.top + py;
				this.position = p;
			}			
			//触发大小改变事件
			this.emit('resize',px,py,dx,dy);
		}	
	}

	for(var i in this.resizeRects) {
		var r = this.resizeRects[i];
		switch(r.index) {
			case 0: {
				r.position.x = -r.width / 2;
				r.position.y = (location.height - r.height) / 2;
				break;
			}	
			case 1: {
				r.position.x = -r.width / 2;
				r.position.y = -r.height / 2;
				break;
			}		
			case 2: {
				r.position.x = (location.width - r.width) / 2;
				r.position.y = -r.height / 2;
				break;
			}
			case 3: {
				r.position.x = location.width - r.width / 2;
				r.position.y = -r.height / 2;
				break;
			}
			case 4: {
				r.position.x = location.width - r.width / 2;
				r.position.y = (location.height - r.height) / 2;
				break;
			}
			case 5: {
				r.position.x = location.width - r.width / 2;
				r.position.y = location.height - r.height /2;
				break;
			}
			case 6: {
				r.position.x = (location.width - r.height) / 2;
				r.position.y = location.height - r.height / 2;
				break;
			}
			case 7: {
				r.position.x = -r.width / 2;
				r.position.y = location.height - r.height / 2;
				break;
			}
		}
	}
}

if(typeof jmGraph != 'undefined') {
	jmGraph.prototype.shapes['resize'] = jmResize;
}

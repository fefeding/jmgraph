
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

		if(typeof canvas === 'string') {
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

		this.canvas = canvas;
		this.context = canvas.getContext('2d');

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
			if(self.type == 'jmGraph') {
				jmUtils.extend(self, new jmControl());	
			}
		}

		callback && callback.call(self);
	});
}



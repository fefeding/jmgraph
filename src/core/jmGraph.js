/**
 * @fileoverview jmGraph 主画布类
 * 
 * jmGraph 是 jmGraph 库的核心类，代表一个完整的画布实例。
 * 它继承自 jmControl，提供了完整的图形渲染、事件处理、缩放平移等功能。
 * 
 * 主要功能：
 * - Canvas/WebGL 双渲染模式支持
 * - 图形创建与管理（createShape, createLine, createPath 等）
 * - 渐变和阴影效果（createLinearGradient, createRadialGradient, createShadow）
 * - 缩放和平移（setZoom, pan, resetTransform）
 * - 导出功能（toDataURL, exportToPNG, exportToJPEG, exportToSVG）
 * - 自动刷新动画循环（autoRefresh）
 * - 微信小程序支持
 * 
 * @module jmGraph
 * @author jmGraph Team
 * @license MIT
 */

import {jmUtils} from "./jmUtils.js";
import {jmList} from "./jmList.js";
import {jmProperty} from './jmProperty.js';
import {jmShadow} from "./jmShadow.js";
import {jmGradient} from "./jmGradient.js";
import {jmFilter} from "./jmFilter.js";
import {jmEvents} from "./jmEvents.js";
import {jmControl} from "./jmControl.js";
import {jmPath} from "./jmPath.js";
import jmViewport from "./jmViewport.js";
import jmSpatialIndex from "./jmSpatialIndex.js";
import {Canvas2DRenderer, jmRenderer} from "./jmRenderer.js";
import {jmPlatform} from "./jmPlatform.js";

/**
 * jmGraph 画图类
 * 
 * 对 Canvas 画图 API 进行二次封装，使其更易调用，省去很多重复的工作。
 * 支持多种图形的创建、渲染、交互和导出。
 * 
 * @class jmGraph
 * @extends jmControl
 * 
 * @param {HTMLElement|string} canvas Canvas 元素或元素 ID
 * @param {Object} [option] 配置选项
 * @param {number} [option.width] 画布宽度
 * @param {number} [option.height] 画布高度
 * @param {string} [option.mode='2d'] 渲染模式：'2d' 或 'webgl'
 * @param {boolean} [option.autoRefresh=false] 是否自动刷新
 * @param {Object} [option.shapes] 自定义图形类型映射
 * @param {function} [callback] 初始化完成后的回调函数
 * 
 * @example
 * // 创建画布实例
 * const graph = new jmGraph('canvasId', {
 *     width: 800,
 *     height: 600,
 *     mode: '2d'
 * });
 * 
 * // 创建一个矩形
 * const rect = graph.createShape('rect', {
 *     x: 100, y: 100,
 *     width: 200, height: 150,
 *     style: { fill: '#ff0000' }
 * });
 * graph.children.add(rect);
 * graph.refresh();
 */
export default class jmGraph extends jmControl {

	constructor(canvas, option, callback) {
		if(typeof option == 'function') {
			callback = option;
			option = {};
		}
	
		option = option || {};
		//option.mode = '2d'; // webgl | 2d 暂不支持webgl
		option.interactive = true;
		option.isRegular = true;// 规则的

		super(option, 'jmGraph');

		this.option = option || {};
		
		this.devicePixelRatio = 1; // 根据屏幕的缩放倍数

		/**
		 * 工具类
		 * @property utils/util
		 * @type {jmUtils}
		 */
		this.util = this.utils = jmUtils;	
		// 模式 webgl | 2d
		this.mode = option.mode || '2d';

		// 视口管理器：统一负责缩放/平移/坐标转换/视口剔除
		this.viewport = new jmViewport(option.width || 0, option.height || 0, {
			scaleFactor: 1,
			x: 0,
			y: 0,
			minZoom: typeof option.minZoom === 'number' ? option.minZoom : 0.1,
			maxZoom: typeof option.maxZoom === 'number' ? option.maxZoom : 10
		});
		// 空间命中索引（大图交互优化），可通过 option.hitIndex === false 关闭
		this.hitIndex = option.hitIndex === false ? null : new jmSpatialIndex(option.hitIndexCellSize || 100);
		this.__hitIndexDirty = true;

		// 兼容旧 API：scaleFactor / translation 委托到 viewport
		Object.defineProperty(this, 'scaleFactor', {
			get: () => this.viewport.scaleFactor,
			set: v => {
				this.viewport.scaleFactor = v;
				this.viewport._stamp++;
				return v;
			},
			configurable: true
		});
		this.translation = this.viewport.translation;

		//如果是小程序
		if(jmPlatform.isWX()) {			
			if(typeof canvas === 'string') canvas = wx.createSelectorQuery().select('#' + canvas);
			this.isWXMiniApp = true;// 微信小程序平台
			this.container = canvas;
		}
		else {
			if(typeof canvas === 'string') {
				canvas = jmPlatform.resolveCanvas(canvas);
			}
			else if(canvas.length) {
				canvas = canvas[0];
			}

			if(!canvas.getContext && jmPlatform.getDocument()) {
				this.container = canvas;
				let cn = jmPlatform.createCanvas();
				canvas.appendChild(cn);
				cn.width = canvas.offsetWidth||canvas.clientWidth;
				cn.height = canvas.offsetHeight||canvas.clientHeight;
				canvas = cn;
			}	
			else {
				this.container = canvas.parentElement;
			}
		}	
		this.canvas = canvas;	
		// Create context with preserveDrawingBuffer for webgl to prevent flickering
		if(this.mode === 'webgl') {
			this.context = canvas.getContext(this.mode, { preserveDrawingBuffer: true });
		}
		else {
			this.context = canvas.getContext(this.mode);
		}
		
		// webgl模式
		if(this.mode === 'webgl') {

			this.context.enable(this.context.BLEND);// 开启混合功能：（注意，它不可和gl.DEPTH_TEST一起使用）
			this.context.blendFunc(this.context.SRC_ALPHA, this.context.ONE_MINUS_SRC_ALPHA); // 指定混合函数：
			// webglcontextlost webglcontextrestored
			jmUtils.bindEvent(canvas, 'webglcontextlost', (e)=> {
				console.log('canvas webglcontextlost', e);
				this.emit('webglcontextlost', e);
			});
			jmUtils.bindEvent(canvas, 'webglcontextrestored', (e)=> {
				console.log('canvas webglcontextrestored', e);
				this.emit('webglcontextrestored', e);
			});
		} 
		this.__init(callback);
	}

	/**
	 * 初始化画布
	 * @method init
	 */
	__init(callback) {
		/**
		 * 当前所有图形类型
		 * @property shapes
		 * @type {object}
		 */
		this.shapes = Object.assign({
			"path": jmPath,
		}, this.option.shapes);
		
		/**
		 * 画控件前初始化
		 * 为了解决一像素线条问题 + 应用视口（缩放/平移）变换
		 * 变换逻辑统一收口到 renderer.begin/end，避免散落在事件闭包中
		 */
		this.on('beginDraw', function() {
			if(this.renderer) this.renderer.begin();
		});
		/**
		 * 结束控件绘制
		 */
		this.on('endDraw', function() {
			if(this.renderer) this.renderer.end();
		});

		// devicePixelRatio初始化（平台适配层）
		let dpr = jmPlatform.getDevicePixelRatio();
		this.devicePixelRatio = dpr > 1 ? dpr : 1;
		// 为了解决锯齿问题，先放大canvas再缩放。
		// 可通过 option.dprScale === false 关闭（性能优先）或指定具体倍数
		const dprOpt = this.option.dprScale;
		if(dprOpt === false) {
			this.dprScaleSize = 1;
		}
		else if(typeof dprOpt === 'number' && dprOpt > 0) {
			this.dprScaleSize = dprOpt;
		}
		else {
			this.dprScaleSize = this.devicePixelRatio > 1? this.devicePixelRatio : 2;
		}

		// 渲染器：统一管理视口变换与清屏（Canvas2D / WebGL 可替换）
		this.renderer = new Canvas2DRenderer(this);

		if(this.option.width > 0) this.width = this.option.width;
		if(this.option.height > 0) this.height = this.option.height;	
		this.resize();

		//绑定事件
		this.eventHandler = new jmEvents(this, this.canvas.canvas || this.canvas);	

		//如果指定了自动刷新
		if(this.option.autoRefresh) {
			this.autoRefresh();
		}

		if(callback) callback(this);		
	}

	//  重置canvas大小，并判断高清屏，画图先放大二倍
	resize(w, h) {
		if(!this.canvas) return;

		this.__normalSize = this.__normalSize || { width: 0, height: 0};
		w = w || this.__normalSize.width || this.width, h = h || this.__normalSize.height || this.height;

		if(w) this.__normalSize.width = w;
		if(h) this.__normalSize.height = h;
	
		this.css('width', w + "px");
		this.css('height', h + "px");
		if(this.mode === '2d') {
			this.canvas.height = h * this.dprScaleSize;
			this.canvas.width = w * this.dprScaleSize;
			if(this.dprScaleSize !== 1) this.context.scale && this.context.scale(this.dprScaleSize, this.dprScaleSize);	
		}
		else {
			this.canvas.width = w;
			this.canvas.height = h;
		}

		this.context.viewport && this.context.viewport(0, 0, w, h);
		// 同步视口尺寸（世界坐标可见区域依赖画布尺寸）
		this.viewport.width = w;
		this.viewport.height = h;
		this.needUpdate = true;
		}

	/**
	 * 宽度
	 * @property width
	 * @type {number}
	 */
	get width() {
		if(this.__normalSize && this.__normalSize.width) return this.__normalSize.width;
		if(this.canvas) return this.canvas.width;
		return 0;
	}
	set width(v) {
		this.needUpdate = true;
		if(this.canvas) {
			this.resize(v);
		}	
		return v;
	}

	/**
	 * 高度
	 * @property height
	 * @type {number}
	 */
	get height() {
		if(this.__normalSize && this.__normalSize.height) return this.__normalSize.height;
		if(this.canvas) return this.canvas.height;
		return 0;
	}
	set height(v) {
		this.needUpdate = true;
		if(this.canvas) {
			this.resize(0, v);
		}
		return v;
	}

	/**
	 * 创建jmGraph的静态对象
	 *
	 * @method create
	 * @return {jmGraph} jmGraph实例对象
	 */
	static create(...args) {
		return new jmGraph(...args);
	}

	/**
	 * 获取当前画布在浏览器中的绝对定位
	 *
	 * @method getPosition
	 * @return {postion} 返回定位坐标
	 */
	getPosition() {
		const p = this.isWXMiniApp? {
			left: 0,
			top: 0
		} :jmUtils.getElementPosition(this.canvas.canvas || this.canvas);
		
		p.width = this.width;
		p.height = this.height;
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
	registerShape(name, shape) {
		this.shapes[name] = shape;
	}

	/**
	 * 从已注册的图形类创建图形
	 * 简单直观创建对象
	 *
	 * @method createShape 
	 * @param {string} shape 注册控件的名称 也可以直接是控件类型
	 * @param {object} args 实例化控件的参数
	 * @return {object} 已实例化控件的对象
	 */
	createShape(shape, args) {
		if(typeof shape === 'string') {
			shape = this.shapes[shape];
		}
		if(shape) {
			if(!args) args = {};
			args.graph = this;
			const obj = new shape(args);
			return obj;
		}
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
	createShadow(x, y, blur, color) {
		const sh = new jmShadow(x, y, blur, color);
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
	createLinearGradient(x1, y1, x2, y2, stops=[]) {
		const gradient = new jmGradient({
			type:'linear',
			x1: x1,
			y1: y1,
			x2: x2,
			y2: y2,
			stops
		});
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
	createRadialGradient(x1, y1, r1, x2, y2, r2, stops=[]) {	
		const gradient = new jmGradient({
			type:'radial',
			x1: x1,
			y1: y1,
			r1: r1,
			x2: x2,
			y2: y2,
			r2: r2,
			stops
		});
		return gradient;
	}

	/**
	 * 重新刷新整个画板
	 * 以加入动画事件触发延时10毫秒刷新，保存最尽的调用只刷新一次，加强性能的效果。
	 *
	 * @method refresh
	 */
	refresh() {	
		// 刷新节流：连续多次 refresh 合并为一次重绘（rAF 对齐），
		// 避免非 autoRefresh 模式下高频调用导致每帧多次全量重绘
		if(this.__refreshScheduled) return this;
		this.__refreshScheduled = true;
		const self = this;
		const flush = () => {
			self.__refreshScheduled = false;
			self.redraw();
		};
		if(typeof requestAnimationFrame !== 'undefined' && !this.isWXMiniApp) {
			requestAnimationFrame(flush);
		}
		else {
			setTimeout(flush, 16);
		}
		return this;
	}

	/**
	 * 重新刷新整个画板
	 * 此方法直接重画，与refresh效果类似
	 *
	 * @method redraw
	 * @param {number} [w] 清除画布的宽度
	 * @param {number} [h] 清除画布的高度
	 */
	redraw(w, h) {	
		this.clear(w||this.width, h||this.height);
		this.paint();
	}

	/**
	 * 清除画布
	 * 
	 * @method clear
	 * @param {number} [w] 清除画布的宽度
	 * @param {number} [h] 清除画布的高度
	 */
	clear(w, h) {
		if(!w || !h) {
			w = this.width;
			h = this.height;
			/*if(this.scaleSize) {
				w = w / this.scaleSize.x;
				h = h / this.scaleSize.y;
			}*/
		}
		
		if(this.context.clearRect) {
			// 清屏统一走渲染器（背景填充在 webgl 分支用 clearColor，2d 分支只清透明画布）
			if(this.renderer) {
				this.renderer.clear(w, h);
			}
			else {
				this.context.clearRect(0, 0, w, h);
			}
		}
		else if(this.mode === 'webgl' && this.context.clear) {
			// 缓存 clearColor 对象，避免每帧创建
			if(this.style && this.style.fill) {
				const color = this.utils.hexToRGBA(this.style.fill);
				this.__lastClearColor = color;
				this.context.clearColor(color.r, color.g, color.b, color.a);
			}
			else if(!this.__lastClearColor) {
				this.__lastClearColor = { r: 0, g: 0, b: 0, a: 0 };
				this.context.clearColor(0, 0, 0, 0);
			}
			else {
				this.context.clearColor(this.__lastClearColor.r, this.__lastClearColor.g, this.__lastClearColor.b, this.__lastClearColor.a);
			}
        	this.context.clear(this.context.COLOR_BUFFER_BIT); // 清空颜色缓冲区，也就是清空画布
		}
	}

	/**
	* 设置画布样式，此处只是设置其css样式
	*
	* @method css
	* @param {string} name 样式名
	* @param {string} value 样式值
	*/
	css(name, value) {
		if(this.canvas && this.canvas.style) {
			if(typeof value != 'undefined') this.canvas.style[name] = value;
			return this.canvas.style[name];
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
	createPath(points, style, option={}) {
		const path = this.createShape('path',{
			points: points,
			style: style,
			...option
		});
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
	createLine(start, end, style) {
		const line = this.createShape('line', {
			start: start,
			end: end,
			style: style
		});
		return line;
	}

	/**
	 * 缩小整个画布按比例0.9
	 * 
	 * @method zoomOut
	 */
	zoomOut() {
		this.scale(0.9 ,0.9);
	}

	/**
	 * 放大 每次增大0.1的比例
	 * 
	 * @method zoomIn
	 */
	zoomIn() {		
		this.scale(1.1 ,1.1);
	}

	/**
	 * 大小复原
	 * 
	 * @method zoomActual
	 */
	zoomActual() {
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
	scale(dx, dy) {
		if(!this.normalSize) {
			this.normalSize = {
				width: this.canvas.width,
				height: this.canvas.height
			};
		}
		
		//this.context.scale && this.context.scale(dx,dy);
		if(!this.scaleSize) {
			this.scaleSize = {x: 1,y: 1};
		}
		else {
			this.scaleSize = {x: dx * this.scaleSize.x, y: dy * this.scaleSize.y};
		}
		this.canvas.style && (this.canvas.style.transform = `scale(${this.scaleSize.x}, ${this.scaleSize.y})`);
	}

	/**
	 * 设置缩放因子
	 * 支持以指定点为中心进行缩放，保持该点在屏幕上的位置不变
	 * 
	 * @method setZoom
	 * @param {number} zoom 缩放因子（建议范围：0.1 - 10）
	 * @param {number} [x] 缩放中心X坐标（画布坐标）
	 * @param {number} [y] 缩放中心Y坐标（画布坐标）
	 * @return {jmGraph} 返回当前实例，支持链式调用
	 */
	setZoom(zoom, x, y) {
		// 参数验证
		if(typeof zoom !== 'number' || isNaN(zoom)) {
			console.warn('jmGraph: setZoom - 无效的缩放因子');
			return this;
		}
		// 统一委托 viewport（含缩放范围钳制与以指定点为中心的保持逻辑）
		this.viewport.zoomAt(zoom, x, y);
		this.needUpdate = true;
		this.redraw();
		
		return this; // 支持链式调用
	}

	/**
	 * 平移画布
	 * 移动画布视图，改变可视区域
	 * 
	 * @method pan
	 * @param {number} dx X轴平移量（像素）
	 * @param {number} dy Y轴平移量（像素）
	 * @return {jmGraph} 返回当前实例，支持链式调用
	 */
	pan(dx, dy) {
		// 参数验证
		if(typeof dx !== 'number' || typeof dy !== 'number' || isNaN(dx) || isNaN(dy)) {
			console.warn('jmGraph: pan - 无效的平移参数');
			return this;
		}
		
		this.viewport.pan(dx, dy);
		this.needUpdate = true;
		this.redraw();
		
		return this; // 支持链式调用
	}

	/**
	 * 重置缩放和平移
	 * 恢复画布到初始状态（缩放为1，平移为0）
	 * 
	 * @method resetTransform
	 * @return {jmGraph} 返回当前实例，支持链式调用
	 */
	resetTransform() {
		this.viewport.reset();
		this.needUpdate = true;
		this.redraw();
		
		return this; // 支持链式调用
	}

	/**
	 * 把屏幕坐标（画布像素坐标）转换为世界坐标（图形坐标）
	 * 
	 * 画布通过 translation/scaleFactor 做平移缩放，图形的 position 一律使用世界坐标，
	 * 因此涉及鼠标交互时需要用本方法把屏幕坐标换算回世界坐标。
	 * 
	 * @method screenToWorld
	 * @param {point} point 屏幕坐标 {x, y}
	 * @return {point} 世界坐标 {x, y}
	 */
	screenToWorld(point) {
		return this.viewport.screenToWorld(point);
	}

	/**
	 * 把世界坐标（图形坐标）转换为屏幕坐标（画布像素坐标）
	 * 
	 * @method worldToScreen
	 * @param {point} point 世界坐标 {x, y}
	 * @return {point} 屏幕坐标 {x, y}
	 */
	worldToScreen(point) {
		return this.viewport.worldToScreen(point);
	}

	/**
	 * 获取当前所有图形的内容边界（世界坐标）
	 *
	 * 会递归遍历图层/容器等子级，忽略无实际内容的图形（如图层容器本身）。
	 *
	 * @method getContentBounds
	 * @param {function} [filter] 过滤回调，返回 false 的图形会被忽略（其子级也不再遍历）
	 * @return {object|null} 边界对象 {left, top, right, bottom, width, height}，无图形时返回 null
	 */
	getContentBounds(filter) {
		let rect = null;
		const walk = control => {
			if(!control || !control.children) return;
			control.children.each((i, shape) => {
				if(!shape || shape === this || shape.visible === false) return;
				if(typeof filter === 'function' && filter(shape) === false) return;
				// 使用相对画布的绝对边界，保证不同层级的图形在同一坐标系下合并
				if(shape.bounds !== undefined) shape.__boundsDirty = true;
				const b = shape.getAbsoluteBounds ? shape.getAbsoluteBounds() :
					(shape.getBounds ? shape.getBounds(true) : null);
				if(b && (b.width || b.height)) {
					if(!rect) {
						rect = { left: b.left, top: b.top, right: b.right, bottom: b.bottom };
					}
					else {
						if(b.left < rect.left) rect.left = b.left;
						if(b.top < rect.top) rect.top = b.top;
						if(b.right > rect.right) rect.right = b.right;
						if(b.bottom > rect.bottom) rect.bottom = b.bottom;
					}
				}
				walk(shape);
			});
		};
		walk(this);
		if(rect) {
			rect.width = rect.right - rect.left;
			rect.height = rect.bottom - rect.top;
		}
		return rect;
	}

	/**
	 * 缩放并平移到刚好容纳全部图形
	 * 
	 * @method fitView
	 * @param {number} [padding=0.15] 内容与画布边缘的留白比例（0-0.9）
	 * @param {function} [filter] 参与计算的内容过滤回调
	 * @return {jmGraph} 返回当前实例，支持链式调用
	 */
	fitView(padding = 0.15, filter) {
		const bounds = this.getContentBounds(filter);
		if(!bounds || !bounds.width || !bounds.height || !this.width || !this.height) {
			return this.resetTransform();
		}
		// 统一委托 viewport（含缩放范围钳制与居中计算）
		this.viewport.fitBounds(bounds, padding);
		this.needUpdate = true;
		this.redraw();
		return this;
	}

	/**
	 * 触发事件
	 * 
	 * 重写以增加「缩放/平移感知」：当画布存在缩放或平移时，
	 * 先把原生事件的屏幕坐标换算为世界坐标，再交给基类的命中检测，
	 * 否则缩放、平移之后图形将无法被正确命中。
	 * 
	 * @method raiseEvent
	 * @param {string} name 事件名称
	 * @param {object} args 原生事件参数
	 * @return {boolean}
	 */
	raiseEvent(name, args) {
		// 事件前惰性重建命中索引（children 增删后只需重建一次）
		if(this.hitIndex && this.__hitIndexDirty) {
			this._syncHitIndex();
		}
		const transformed = this.viewport.transformed;
		if(args && !args.position && transformed) {
			const position = jmUtils.getEventPosition(args);
			// 只转换相对画布的偏移，pageX/pageY 仍保留原始值供画布自身命中检测使用
			const world = this.viewport.screenToWorld({
				x: position.offsetX,
				y: position.offsetY
			});
			position.offsetX = world.x;
			position.offsetY = world.y;
			position.x = world.x;
			position.y = world.y;

			args = {
				position: position,
				button: args.button == 0 || position.isTouch ? 1 : args.button,
				keyCode: args.keyCode || args.charCode || args.which,
				ctrlKey: args.ctrlKey,
				cancel: false,
				event: args,
				srcElement: args.srcElement || args.target,
				isWXMiniApp: this.isWXMiniApp
			};
		}
		return super.raiseEvent(name, args);
	}

	/**
	 * 重建空间命中索引（事件前惰性调用）
	 * 收集所有 interactive 的图形边界到均匀网格中，
	 * 使 mousemove 等高频事件只对候选图形做精确命中。
	 * @private
	 */
	_syncHitIndex() {
		this.__hitIndexDirty = false;
		const index = this.hitIndex;
		if(!index) return;
		index.clear();
		const collect = control => {
			if(!control || !control.children) return;
			control.children.each((i, shape) => {
				if(!shape || shape === this || shape.visible === false) return;
				if(shape.interactive !== false) {
					try {
						index.upsert(shape);
					}
					catch(e) {
						// 忽略尚无边界的图形（例如尚未初始化完成）
					}
				}
				collect(shape);
			});
		};
		collect(this);
	}

	/**
	 * 保存为base64图形数据
	 * 
	 * @method toDataURL
	 * @return {string} 当前画布图的base64字符串
	 */
	toDataURL() {
		let data = this.canvas.toDataURL?this.canvas.toDataURL():'';
		return data;
	}

	/**
	 * 导出为PNG图片
	 * 使用Canvas的toDataURL方法导出当前画布内容
	 * 
	 * @method exportToPNG
	 * @param {string} [fileName='jmgraph-export'] 文件名（不含扩展名）
	 * @param {string} [format='image/png'] 图片格式，支持image/png和image/jpeg
	 * @param {number} [quality=0.9] 图片质量（0-1之间，仅对JPEG格式有效）
	 */
	exportToPNG(fileName = 'jmgraph-export', format = 'image/png', quality = 0.9) {
		try {
			// 确保画布已渲染
			this.redraw();
			
			const dataURL = this.canvas.toDataURL(format, quality);
			this.downloadFile(dataURL, fileName, 'png');
		} catch(error) {
			console.error('jmGraph: exportToPNG - 导出失败', error);
		}
	}

	/**
	 * 导出为JPEG图片
	 * 
	 * @method exportToJPEG
	 * @param {string} [fileName='jmgraph-export'] 文件名（不含扩展名）
	 * @param {number} [quality=0.9] 图片质量（0-1之间）
	 */
	exportToJPEG(fileName = 'jmgraph-export', quality = 0.9) {
		this.exportToPNG(fileName, 'image/jpeg', quality);
	}

	/**
	 * 导出为SVG文件
	 * 将当前画布内容转换为SVG格式
	 * 注意：只有实现了toSVG方法的形状才能被导出
	 * 
	 * @method exportToSVG
	 * @param {string} [fileName='jmgraph-export'] 文件名（不含扩展名）
	 */
	exportToSVG(fileName = 'jmgraph-export') {
		try {
			const svg = this.toSVG();
			const url = jmPlatform.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
			this.downloadFile(url, fileName, 'svg');
			
			// 释放URL对象，避免内存泄漏
			if(url) setTimeout(() => jmPlatform.revokeObjectURL(url), 100);
		} catch(error) {
			console.error('jmGraph: exportToSVG - 导出失败', error);
		}
	}

	/**
	 * 遍历所有形状，生成SVG标记
	 *
	 * @method toSVG
	 * @return {string} SVG字符串
	 */
	toSVG() {
		// SVG头部，包含命名空间和画布尺寸
		let svg = `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}">`;

		// 添加背景色（如果有）
		if(this.style && this.style.fill) {
			svg += `<rect width="100%" height="100%" fill="${this.style.fill}"/>`;
		}

		// 递归遍历所有层级的形状（含嵌套容器/图层）
		const walk = shape => {
			if(shape && shape.toSVG) {
				svg += shape.toSVG();
			}
			if(shape && shape.children) {
				shape.children.each((i, child) => walk(child));
			}
		};
		this.children.each((i, shape) => walk(shape));

		svg += '</svg>';
		return svg;
	}

	/**
	 * 下载文件
	 * 创建临时链接元素触发浏览器下载
	 * 
	 * @method downloadFile
	 * @private
	 * @param {string} url 文件URL或Data URL
	 * @param {string} fileName 文件名（不含扩展名）
	 * @param {string} extension 文件扩展名
	 */
	downloadFile(url, fileName, extension) {
		// 平台适配层统一处理下载
		jmPlatform.download(url, `${fileName}.${extension}`);
	}

	/** 
	 * 自动刷新画版
	 * @param {function} callback 执行回调
	 */
	autoRefresh(callback) {
		if(this.___isAutoRefreshing) return;
		const self = this;
		this.___isAutoRefreshing = true;
		
		const refreshStartTime = Date.now();
		function update() {
			if(self.destroyed) {
				self.___isAutoRefreshing = false;
				return;// 已销毁
			}
			if(self.needUpdate) self.redraw();

			const time = Date.now() - refreshStartTime;
			// 触发刷新事件
			self.emit('update', time);

			// 直接 requestAnimationFrame，无需先 cancel
			self.__requestAnimationFrameFunHandler = self.requestAnimationFrame(update);
			if(callback) callback();
		}
		self.__requestAnimationFrameFunHandler && this.cancelAnimationFrame(self.__requestAnimationFrameFunHandler);
		self.__requestAnimationFrameFunHandler = this.requestAnimationFrame(update);
		return this;
	}

	// 销毁当前对象
	destroy() {
		if(this.eventHandler) this.eventHandler.destroy();
		if(this.hitIndex) {
			this.hitIndex.clear();
			this.hitIndex = null;
		}
		this.destroyed = true;// 标记已销毁
	}
}

export {
	jmGraph,
	jmUtils,
	jmList,
	jmProperty,
	jmShadow,
	jmGradient,
	jmFilter,
	jmEvents,
	jmControl,
	jmPath,
	jmViewport,
	jmSpatialIndex,
	jmPlatform,
	Canvas2DRenderer,
	jmRenderer,
 };

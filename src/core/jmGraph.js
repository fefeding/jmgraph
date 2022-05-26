import { Scene } from 'spritejs';
import {jmUtils} from "./jmUtils.js";
import {jmList} from "./jmList.js";
import {jmProperty} from './jmProperty.js';
import {jmShadow} from "./jmShadow.js";
import {jmGradient} from "./jmGradient.js";
import {jmEvents} from "./jmEvents.js";
import {jmControl} from "./jmControl.js";
import {jmPath} from "./jmPath.js";

/**
 * jmGraph画图类库
 * 对canvas画图api进行二次封装，使其更易调用，省去很多重复的工作。
 *
 * @module jmGraph
 * @class jmGraph
 * @extends jmControl
 * @param {element} container 容器
 * @param {object} option 参数：{width:宽,height:高}
 * @param {function} callback 初始化后的回调
 */
export default class jmGraph extends jmControl {

	constructor(container, option, callback) {
		if(typeof option == 'function') {
			callback = option;
			option = {};
		}
	
		option = option || {};
		option.interactive = true;
		
		super(option, 'jmGraph');

		this.option = option || {};
		
		this.devicePixelRatio = 1; // 根据屏幕的缩放倍数

		/**
		 * 工具类
		 * @property utils/util
		 * @type {jmUtils}
		 */
		this.util = this.utils = jmUtils;		

		//如果是小程序
		if(typeof wx != 'undefined' && wx.createCanvasContext) {
			this.context = wx.createCanvasContext(container);
			container = wx.createSelectorQuery().select('#' + container);
			this.isWXMiniApp = true;// 微信小程序平台
		}
		else {
			if(typeof container === 'string' && typeof document != 'undefined') {
				container = document.getElementById(container);
			}
			else if(container.length) {
				container = container[0];
			}
			this.container = container;				
			const scene = new Scene({ container});			
			this.scene = scene;
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

		this.resize(this.option.width, this.option.height);

		if(callback) callback(this);		
	}

	//  重置canvas大小
	resize(w, h) {
		if(w > 0) this.scene.width = w;
		if(h > 0) this.scene.height = h;	
		(w || h) && this.scene.resize()
	}

	/**
	 * 内部坐标转为页面坐标，这里主要是有devicePixelRatio倍数问题
	 * @param {x, y} point 内部坐标
	 */
	pointToPixes(point) {
		if(this.devicePixelRatio && this.devicePixelRatio !== 1) {
			point = Object.assign({}, point, {
				x: point.x / this.devicePixelRatio,
				y: point.y / this.devicePixelRatio
			});
		}
		return point;
	}

	/**
	 * 宽度
	 * @property width
	 * @type {number}
	 */
	get width() {
		if(this.scene) return this.scene.width;
		return 0;
	}
	set width(v) {
		this.needUpdate = true;
		if(this.scene) {
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
		if(this.scene) return this.scene.height;
		return 0;
	}
	set height(v) {
		this.needUpdate = true;
		if(this.scene) {
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
		let p = jmUtils.getElementPosition(this.container);
		p.width = this.scene.width;
		p.height = this.scene.height;
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
			let obj = new shape(args);
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
		let sh = new jmShadow(x, y, blur, color);
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
	createLinearGradient(x1, y1, x2, y2) {
		let gradient = new jmGradient({
			type:'linear',
			x1: x1,
			y1: y1,
			x2: x2,
			y2: y2
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
	createRadialGradient(x1, y1, r1, x2, y2, r2) {	
		let gradient = new jmGradient({
			type:'radial',
			x1: x1,
			y1: y1,
			r1: r1,
			x2: x2,
			y2: y2,
			r2: r2
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
		console.log(w,h);
	}

	/**
	* 设置画布样式，此处只是设置其css样式
	*
	* @method css
	* @param {string} name 样式名
	* @param {string} value 样式值
	*/
	css(name, value) {
		if(this.container && this.container.style) {
			if(typeof value != 'undefined') this.container.style[name] = value;
			return this.container.style[name];
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
	createPath(points, style) {
		let path = this.createShape('path',{
			points: points,
			style: style
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
		let line = this.createShape('line', {
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
		this.refresh();
	}

	/**
	 * 保存为base64图形数据
	 * 
	 * @method toDataURL
	 * @return {string} 当前画布图的base64字符串
	 */
	toDataURL() {
		let data = this.scene.toDataURL?this.scene.toDataURL():'';
		return data;
	}

	/** 
	 * 自动刷新画版
	 * @param {function} callback 执行回调
	 */
	autoRefresh(callback) {
		if(this.___isAutoRefreshing) return;
		const self = this;
		this.___isAutoRefreshing = true;
		
		function update() {
			if(self.destoryed) {
				self.___isAutoRefreshing = false;
				return;// 已销毁
			}
			if(self.needUpdate) self.redraw();
			self.__requestAnimationFrameFunHandler && jmUtils.cancelAnimationFrame(self.__requestAnimationFrameFunHandler);
			self.__requestAnimationFrameFunHandler = jmUtils.requestAnimationFrame(update);
			if(callback) callback();
		}
		self.__requestAnimationFrameFunHandler && jmUtils.cancelAnimationFrame(self.__requestAnimationFrameFunHandler);
		self.__requestAnimationFrameFunHandler = jmUtils.requestAnimationFrame(update);
		return this;
	}

	// 销毁当前对象
	destory() {
		this.eventHandler && this.eventHandler.destory();
		this.destoryed = true;// 标记已销毁
	}
}

export { 
	jmGraph, 
	jmUtils,
	jmList,
	jmProperty,
	jmShadow,
	jmGradient,
	jmEvents,
	jmControl,
	jmPath,
 };

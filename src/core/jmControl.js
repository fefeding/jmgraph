
/**
 * @fileoverview jmGraph 控件基类
 * 
 * jmControl 是 jmGraph 库中所有可视化控件的基类，继承自 jmProperty。
 * 提供了完整的控件生命周期管理：
 * - 样式系统：支持填充、描边、阴影、渐变、滤镜等
 * - 变换系统：支持平移、旋转、缩放
 * - 事件系统：支持鼠标、键盘、触摸事件
 * - 渲染系统：支持 Canvas 2D 和 WebGL 双渲染模式
 * - 层级管理：支持 zIndex 排序和父子关系
 * - 碰撞检测：支持点击测试和命中区域
 * 
 * @module jmControl
 * @extends jmProperty
 * @author jmGraph Team
 * @license MIT
 */

import {jmUtils} from "./jmUtils.js";
import {jmList} from "./jmList.js";
import {jmGradient} from "./jmGradient.js";
import {jmShadow} from "./jmShadow.js";
import {jmFilter} from "./jmFilter.js";
import {jmProperty} from "./jmProperty.js";
import WebglPath from "../lib/webgl/path.js";

/**
 * 样式名称映射表
 * 
 * 将简化的样式名称映射到 Canvas API 的标准属性名。
 * 例如：'fill' -> 'fillStyle', 'stroke' -> 'strokeStyle'
 * 
 * @constant {Object.<string, string>}
 * @private
 */
const jmStyleMap = {
	'fill':'fillStyle',           // 填充颜色
	'fillImage':'fillImage',      // 填充图片
	'stroke':'strokeStyle',       // 描边颜色
	'shadow.blur':'shadowBlur',   // 阴影模糊度
	'shadow.x':'shadowOffsetX',   // 阴影X偏移
	'shadow.y':'shadowOffsetY',   // 阴影Y偏移
	'shadow.color':'shadowColor', // 阴影颜色
	'lineWidth' : 'lineWidth',    // 线宽
	'miterLimit': 'miterLimit',   // 斜接限制
	'fillStyle' : 'fillStyle',    // 填充样式
	'strokeStyle' : 'strokeStyle',// 描边样式
	'font' : 'font',              // 字体
	'opacity' : 'globalAlpha',    // 透明度
	'textAlign' : 'textAlign',    // 文本对齐
	'textBaseline' : 'textBaseline', // 文本基线
	'shadowBlur' : 'shadowBlur',  // 阴影模糊
	'shadowOffsetX' : 'shadowOffsetX', // 阴影X偏移
	'shadowOffsetY' : 'shadowOffsetY', // 阴影Y偏移
	'shadowColor' : 'shadowColor', // 阴影颜色
	'lineJoin': 'lineJoin',       // 线条连接样式
	'lineCap':'lineCap',          // 线条端点样式
	'lineDashOffset': 'lineDashOffset', // 虚线偏移
	'globalCompositeOperation': 'globalCompositeOperation' // 合成操作
};

/**
 * jmGraph 控件基类
 * 
 * jmControl 是所有可视化图形控件的基类，提供了完整的图形渲染和交互能力。
 * 
 * **核心功能：**
 * 
 * 1. **样式系统**
 *    - 支持填充色、描边色、渐变、图片填充
 *    - 支持阴影、滤镜、混合模式
 *    - 支持虚线、线宽、线帽等线条样式
 * 
 * 2. **变换系统**
 *    - 支持 translate（平移）
 *    - 支持 rotation（旋转）
 *    - 支持 transform（矩阵变换）
 * 
 * 3. **事件系统**
 *    - 鼠标事件：mousedown, mouseup, mousemove, click, dblclick
 *    - 触摸事件：touchstart, touchmove, touchend
 *    - 焦点事件：mouseover, mouseleave, touchover, touchleave
 *    - 自定义事件：支持任意事件类型
 * 
 * 4. **渲染系统**
 *    - 自动选择 Canvas 2D 或 WebGL 渲染器
 *    - 支持脏矩形优化
 *    - 支持层级排序（zIndex）
 * 
 * 5. **碰撞检测**
 *    - 支持点在多边形内判断
 *    - 支持自定义命中区域
 *    - 支持旋转后的碰撞检测
 * 
 * @class jmControl
 * @extends jmProperty
 * 
 * @example
 * // 创建自定义控件
 * class MyShape extends jmControl {
 *     constructor(params) {
 *         super(params, 'myShape');
 *     }
 *     
 *     // 重写绘制方法
 *     draw() {
 *         // 自定义绘制逻辑
 *     }
 * }
 * 
 * // 使用控件
 * const shape = new MyShape({
 *     position: { x: 100, y: 100 },
 *     width: 50,
 *     height: 50,
 *     style: {
 *         fill: 'red',
 *         stroke: 'black',
 *         lineWidth: 2
 *     }
 * });
 * graph.children.add(shape);
 */
export default class jmControl extends jmProperty {

	/**
	 * 构造函数
	 * 
	 * 创建一个新的控件实例。子类应该调用 super(params, 'typeName') 来设置类型名称。
	 * 
	 * @constructor
	 * @param {Object} [params] - 控件初始化参数
	 * @param {Object} [params.style] - 样式对象，包含填充、描边等属性
	 * @param {number} [params.width=0] - 控件宽度
	 * @param {number} [params.height=0] - 控件高度
	 * @param {Object} [params.position] - 控件位置 {x, y}
	 * @param {jmGraph} [params.graph] - 所属画布实例
	 * @param {number} [params.zIndex=0] - 层级顺序
	 * @param {boolean} [params.interactive=false] - 是否响应交互事件
	 * @param {Object} [params.hitArea] - 自定义命中区域 {x, y, width, height}
	 * @param {boolean} [params.isRegular] - 是否为规则图形（WebGL优化）
	 * @param {boolean} [params.needCut] - 是否需要裁剪（WebGL）
	 * @param {string} [t] - 控件类型名称，默认使用类名
	 * 
	 * @example
	 * // 创建矩形控件
	 * const rect = new jmControl({
	 *     position: { x: 10, y: 10 },
	 *     width: 100,
	 *     height: 50,
	 *     style: {
	 *         fill: '#ff0000',
	 *         stroke: '#000000',
	 *         lineWidth: 2
	 *     },
	 *     interactive: true
	 * }, 'jmRect');
	 */
	constructor(params, t) {
		params = params||{};
		super(params);
		// 设置控件类型标识
		this.property('type', t || new.target.name);
		// 初始化样式对象
		this.style = params && params.style ? params.style : {};
		// 设置尺寸
		this.width = params.width || 0;
		this.height = params.height  || 0;
		// 自定义命中区域（用于点击测试）
		this.hitArea = params.hitArea || null;

		// 设置位置
		if(params.position) {
			this.position = params.position;
		}

		// 关联画布
		this.graph = params.graph || null;
		// 层级顺序（用于排序）
		this.zIndex = params.zIndex || 0;
		// 是否响应交互事件
		this.interactive = typeof params.interactive == 'undefined'? false : params.interactive;

		// WebGL 模式下创建对应的渲染控制器
		if(this.mode === 'webgl') {
			this.webglControl = new WebglPath(this.graph, {
				style: this.style,
				control: this,
				isRegular: params.isRegular,
				needCut: params.needCut
			});
		}

		// 执行初始化
		this.initializing();
		
		// 别名：on 等同于 bind
		this.on = this.bind;
		
		// 保存原始参数
		this.option = params;
	}

	/**
	 * 控件类型标识
	 * 
	 * 用于类型检查和调试，由构造函数自动设置。
	 * 
	 * @type {string}
	 * @readonly
	 * 
	 * @example
	 * console.log(rect.type); // 'jmRect'
	 * if(control.type === 'jmCircle') { ... }
	 */
	get type() {
		return this.property('type');
	}

	/**
	 * 绘图上下文
	 * 
	 * 获取当前控件的 Canvas 2D 或 WebGL 渲染上下文。
	 * 如果控件本身不是 jmGraph，会返回所属 graph 的上下文。
	 * 
	 * @type {CanvasRenderingContext2D|WebGLRenderingContext}
	 * @readonly
	 * 
	 * @example
	 * // 获取上下文并绘制
	 * const ctx = control.context;
	 * ctx.fillStyle = 'red';
	 * ctx.fillRect(0, 0, 100, 100);
	 */
	get context() {
		let s = this.property('context');
		if(s) return s;
		else if(this.is('jmGraph') && this.canvas && this.canvas.getContext) {
			return this.context = this.canvas.getContext(this.mode || '2d');
		}
		const g = this.graph;
		if(g) return g.context;
		return g.canvas.getContext(this.mode || '2d');
	}
	set context(v) {
		return this.property('context', v);
	}

	/**
	 * 样式对象
	 * 
	 * 控件的视觉样式配置，包括：
	 * - fill: 填充颜色或渐变
	 * - stroke: 描边颜色
	 * - lineWidth: 线宽
	 * - shadow: 阴影配置
	 * - font: 字体（文本控件）
	 * - opacity: 透明度
	 * 
	 * 设置新样式会触发 needUpdate。
	 * 
	 * @type {Object}
	 * 
	 * @example
	 * // 设置样式
	 * control.style = {
	 *     fill: '#ff0000',
	 *     stroke: '#000000',
	 *     lineWidth: 2,
	 *     shadow: {
	 *         blur: 10,
	 *         x: 5,
	 *         y: 5,
	 *         color: 'rgba(0,0,0,0.5)'
	 *     }
	 * };
	 */
	get style() {
		let s = this.property('style');
		if(!s) s = this.property('style', {});
		return s;
	}
	set style(v) {
		this.needUpdate = true;
		return this.property('style', v);
	}

	/**
	 * 是否可见
	 * 
	 * 控制控件是否参与渲染和事件响应。
	 * 不可见的控件不会被绘制，也不会响应鼠标/触摸事件。
	 * 
	 * @type {boolean}
	 * @default true
	 * 
	 * @example
	 * // 隐藏控件
	 * control.visible = false;
	 * 
	 * // 显示控件
	 * control.visible = true;
	 */
	get visible() {
		let s = this.property('visible');
		if(typeof s == 'undefined') s = this.property('visible', true);
		return s;
	}
	set visible(v) {
		this.needUpdate = true;
		return this.property('visible', v);
	}

	/**
	 * 是否响应交互事件
	 * 
	 * 设置为 true 时，控件会响应鼠标和触摸事件。
	 * 设置为 false 时，事件会穿透到下层控件。
	 * 
	 * @type {boolean}
	 * @default false
	 * 
	 * @example
	 * // 启用交互
	 * control.interactive = true;
	 * control.bind('click', (evt) => {
	 *     console.log('clicked!');
	 * });
	 */
	get interactive() {
		const s = this.property('interactive');
		return s;
	}
	set interactive(v) {
		return this.property('interactive', v);
	}

	/**
	 * 自定义命中区域
	 * 
	 * 用于点击测试的自定义区域，格式为 {x, y, width, height}。
	 * 如果设置，点击测试会使用此区域而非实际图形边界。
	 * 
	 * @type {Object|null}
	 * 
	 * @example
	 * // 设置更大的点击区域
	 * control.hitArea = {
	 *     x: -10,
	 *     y: -10,
	 *     width: control.width + 20,
	 *     height: control.height + 20
	 * };
	 */
	get hitArea() {
		const s = this.property('hitArea');
		return s;
	}
	set hitArea(v) {
		return this.property('hitArea', v);
	}
		
	/**
	 * 子控件列表
	 * 
	 * 当前控件的所有子控件。子控件会按 zIndex 排序后绘制。
	 * 添加子控件时会自动建立父子关系。
	 * 
	 * @type {jmList}
	 * 
	 * @example
	 * // 添加子控件
	 * parent.children.add(child);
	 * 
	 * // 移除子控件
	 * parent.children.remove(child);
	 * 
	 * // 遍历子控件
	 * parent.children.each((i, child) => {
	 *     console.log(child);
	 * });
	 */
	get children() {
		let s = this.property('children');
		if(!s) s = this.property('children', new jmList());
		return s;
	}
	set children(v) {
		this.needUpdate = true;
		return this.property('children', v);
	}

	/**
	 * 控件宽度
	 * 
	 * 可以是具体数值或百分比字符串（如 '50%'）。
	 * 百分比会相对于父容器宽度计算。
	 * 
	 * @type {number|string}
	 * 
	 * @example
	 * // 设置固定宽度
	 * control.width = 100;
	 * 
	 * // 设置百分比宽度
	 * control.width = '50%';
	 */
	get width() {
		let s = this.property('width');
		if(typeof s == 'undefined') s = this.property('width', 0);
		return s;
	}
	set width(v) {
		this.needUpdate = true;
		return this.property('width', v);
	}

	/**
	 * 控件高度
	 * 
	 * 可以是具体数值或百分比字符串（如 '50%'）。
	 * 百分比会相对于父容器高度计算。
	 * 
	 * @type {number|string}
	 * 
	 * @example
	 * // 设置固定高度
	 * control.height = 100;
	 * 
	 * // 设置百分比高度
	 * control.height = '50%';
	 */
	get height() {
		let s = this.property('height');
		if(typeof s == 'undefined') s = this.property('height', 0);
		return s;
	}
	set height(v) {
		this.needUpdate = true;
		return this.property('height', v);
	}

	/**
	 * 层级顺序
	 * 
	 * 控制控件的绘制顺序，值越大越靠上。
	 * 设置 zIndex 会触发子控件重新排序。
	 * 
	 * @type {number}
	 * @default 0
	 * 
	 * @example
	 * // 将控件置于最上层
	 * control.zIndex = 100;
	 * 
	 * // 将控件置于最下层
	 * control.zIndex = -1;
	 */
	get zIndex() {
		let s = this.property('zIndex');
		if(!s) s = this.property('zIndex', 0);
		return s;
	}
	set zIndex(v) {
		this.property('zIndex', v);
		this.children.sort();
		this.needUpdate = true;
		return v;
	}

	/**
	 * 鼠标样式
	 * 
	 * 鼠标悬停在控件上时显示的光标样式。
	 * 常用值：'default', 'pointer', 'move', 'text', 'crosshair'
	 * 
	 * @type {string}
	 * 
	 * @example
	 * // 设置为手型指针
	 * control.cursor = 'pointer';
	 * 
	 * // 设置为移动样式
	 * control.cursor = 'move';
	 */
	set cursor(cur) {
		const graph = this.graph;
		if(graph) {
			graph.css('cursor',cur);
		}
	}
	get cursor() {
		const graph = this.graph;
		if(graph) {
			return graph.css('cursor');
		}
	}

	/**
	 * 初始化控件
	 * 
	 * 在构造函数末尾调用，用于设置子控件管理逻辑。
	 * 重写了 children 的 add、remove、sort、clear 方法，
	 * 实现自动的父子关系维护和脏标记传播。
	 * 
	 * @method initializing
	 * @protected
	 */
	initializing() {

		const self = this;
		this.children = this.children || new jmList();
		const oadd = this.children.add;
		
		/**
		 * 重写 add 方法，自动建立父子关系
		 * @param {jmControl} obj - 要添加的子控件
		 * @returns {jmControl} 添加的子控件
		 */
		this.children.add = function(obj) {
			if(typeof obj === 'object') {
				// 如果对象已有父级，先从原父级移除
				if(obj.parent && obj.parent != self && obj.parent.children) {
					obj.parent.children.remove(obj);
				}
				obj.parent = self;
				// 如果已存在，先移除再添加
				if(this.contain(obj)) {
					this.oremove(obj);
				}
				oadd.call(this, obj);
				obj.emit('add', obj);

				self.needUpdate = true;
				// 传播 graph 引用
				if(self.graph) obj.graph = self.graph;
				this.sort();
				return obj;
			}
		};
		this.children.oremove= this.children.remove;
		
		/**
		 * 重写 remove 方法，清理父子关系
		 * @param {jmControl} obj - 要移除的子控件
		 */
		this.children.remove = function(obj) {
			if(typeof obj === 'object') {
				obj.parent = null;
				obj.graph = null;
				obj.remove(true);
				this.oremove(obj);
				self.needUpdate = true;
			}
		};
		
		/**
		 * 按 zIndex 排序子控件
		 */
		this.children.sort = function() {
			const levelItems = {};
			this.each(function(i, obj) {
				if(!obj) return;
				let zindex = obj.zIndex;
				if(!zindex && obj.style && obj.style.zIndex) {
					zindex = Number(obj.style.zIndex);
					if(isNaN(zindex)) zindex=obj.style.zIndex||0;
				}
				let items = levelItems[zindex] || (levelItems[zindex] = []);
				items.push(obj);
			});

			this.splice(0, this.length);
			
			for(let index in levelItems) {
				oadd.call(this, levelItems[index]);
			}
		}
		
		/**
		 * 清空所有子控件
		 */
		this.children.clear = function() {
			this.each(function(i,obj) {
				this.remove(obj);
			},true);
		}
		this.needUpdate = true;
	} 

	/**
	 * 设置控件样式到绘图上下文
	 * 
	 * 将样式对象应用到 Canvas 上下文，支持：
	 * - 基础样式：fill, stroke, lineWidth, opacity 等
	 * - 阴影效果：shadow.blur, shadow.x, shadow.y, shadow.color
	 * - 渐变填充：支持线性渐变和径向渐变
	 * - 变换效果：rotation（旋转）、translate（平移）、transform（矩阵变换）
	 * - 高级效果：lineDash（虚线）、filter（滤镜）、clipPath（裁剪）、mask（遮罩）
	 * 
	 * @method setStyle
	 * @param {Object} [style] - 要应用的样式对象，默认使用 this.style
	 * 
	 * @example
	 * // 应用样式
	 * control.setStyle({
	 *     fill: '#ff0000',
	 *     stroke: '#000000',
	 *     lineWidth: 2,
	 *     shadow: {
	 *         blur: 10,
	 *         x: 5,
	 *         y: 5,
	 *         color: 'rgba(0,0,0,0.5)'
	 *     }
	 * });
	 * 
	 * // 使用渐变
	 * control.setStyle({
	 *     fill: 'linear-gradient(0,0,100,0,#ff0000,#0000ff)'
	 * });
	 */
	setStyle(style) {
		if(!style) {
			style = this.style;
		}
		if(!style) return;

		/**
		 * 内部样式设置函数
		 * @param {*} styleValue - 样式值
		 * @param {string} name - 样式名称
		 * @param {string} [mpkey] - 映射键名
		 * @private
		 */
		const __setStyle = (style, name, mpkey) => {
			if(style) {
				let styleValue = style;
				// 支持函数形式的样式值
				if(typeof styleValue === 'function') {
					try {
						styleValue = styleValue.call(this);
					}
					catch(e) {
						console.warn(e);
						return;
					}
				}
				let t = typeof styleValue;
				let mpname = jmStyleMap[mpkey || name];

				// 处理渐变
				if((styleValue instanceof jmGradient) || (t == 'string' && styleValue.indexOf('-gradient') > -1)) {
					if(t == 'string' && styleValue.indexOf('-gradient') > -1) {
						styleValue = new jmGradient(styleValue);
					}
					__setStyle(styleValue.toGradient(this), mpname||name);
				}
				// 处理标准样式映射
				else if(mpname) {
					if(this.webglControl) {
						this.webglControl.setStyle(mpname, styleValue);
					}
					else {
						if(t == 'string' && ['fillStyle', 'strokeStyle', 'shadowColor'].indexOf(mpname) > -1) {
							styleValue = jmUtils.toColor(styleValue);
						}
						this.context[mpname] = styleValue;
					}
				}
				// 处理特殊样式
				else {
					switch(name) {
						// 阴影样式
						case 'shadow' : {
							if(t == 'string') {
								__setStyle(new jmShadow(styleValue), name);
								break;
							}
							for(let k in styleValue) {
								__setStyle(styleValue[k], k, name + '.' + k);
							}
							break;
						}
						// 平移变换
						case 'translate' : {
							break;
						}
						// 旋转变换
						case 'rotation' : {
							if(typeof styleValue.angle === 'undefined' || isNaN(styleValue.angle)) break;
							styleValue = this.getRotation(styleValue);
							
							this.__translateAbsolutePosition = this.toAbsolutePoint({
								x: styleValue.x,
								y: styleValue.y
							});
							this.context.translate && this.context.translate(this.__translateAbsolutePosition.x, this.__translateAbsolutePosition.y);
							this.context.rotate && this.context.rotate(styleValue.angle);
							this.context.translate && this.context.translate(-this.__translateAbsolutePosition.x, -this.__translateAbsolutePosition.y);
							break;
						}
						// 矩阵变换
						case 'transform' : {
							if(!this.context.transform) break;
							if(Array.isArray(styleValue)) {
								this.context.transform.apply(this.context, styleValue);
							}
							else if(typeof styleValue == 'object') {
								this.context.transform(
									styleValue.scaleX || 1,
									styleValue.skewX || 0,
									styleValue.skewY || 0,
									styleValue.scaleY || 1,
									styleValue.offsetX || 0,
									styleValue.offsetY || 0
								);
							}
							break;
						}
						// 鼠标样式
						case 'cursor' : {
							this.cursor = styleValue;
							break;
						}
						// ===== 新增样式特性 =====

						/**
						 * 虚线样式
						 * 支持数组格式 [5, 3, 2] 或字符串格式 "5,3,2"
						 * @example
						 * style: { lineDash: [5, 3] } // 5px实线，3px空白
						 */
						case 'lineDash' : {
							if(!this.context.setLineDash) break;
							let dash;
							if(typeof styleValue === 'string') {
								dash = styleValue.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
							}
							else if(Array.isArray(styleValue)) {
								dash = styleValue.map(v => parseFloat(v)).filter(v => !isNaN(v));
							}
							if(dash && dash.length) {
								this.context.setLineDash(dash);
							}
							else {
								this.context.setLineDash([]);
							}
							break;
						}
						// 虚线偏移量
						case 'lineDashOffset' : {
							if(!this.context.setLineDash) break;
							this.context.lineDashOffset = Number(styleValue) || 0;
							break;
						}
						/**
						 * CSS滤镜效果
						 * 支持 blur, grayscale, sepia, brightness, contrast, saturate, hue-rotate, invert, opacity
						 * @example
						 * style: { filter: 'blur(5px) grayscale(50%)' }
						 * // 或使用对象
						 * style: { filter: { blur: 5, grayscale: 0.5 } }
						 */
						case 'filter' : {
							if(this.context.filter === undefined) break;
							if(styleValue instanceof jmFilter) {
								this.context.filter = styleValue.toCanvasFilter();
							}
							else if(typeof styleValue === 'string') {
								this.context.filter = styleValue || 'none';
							}
							else if(typeof styleValue === 'object') {
								this.context.filter = (new jmFilter(styleValue)).toCanvasFilter();
							}
							break;
						}
						/**
						 * 混合模式
						 * 常用值：source-over, multiply, screen, overlay, darken, lighten
						 * @example
						 * style: { globalCompositeOperation: 'multiply' }
						 */
						case 'globalCompositeOperation' : {
							if(!this.context.globalCompositeOperation) break;
							this.context.globalCompositeOperation = styleValue;
							break;
						}
						/**
						 * 裁剪路径
						 * 通过 canvas clip 实现裁剪效果
						 * @example
						 * style: { clipPath: clipShape } // clipShape 是一个图形控件
						 */
						case 'clipPath' : {
							if(!this.context.clip) break;
							// clipPath可以是一个图形控件实例
							if(styleValue && styleValue.points && styleValue.points.length > 0) {
								const bounds = this.parent && this.parent.absoluteBounds ? this.parent.absoluteBounds : this.absoluteBounds;
								this.context.beginPath();
								this.context.moveTo(styleValue.points[0].x + (bounds ? bounds.left : 0), styleValue.points[0].y + (bounds ? bounds.top : 0));
								for(let i = 1; i < styleValue.points.length; i++) {
									if(styleValue.points[i].m) {
										this.context.moveTo(styleValue.points[i].x + (bounds ? bounds.left : 0), styleValue.points[i].y + (bounds ? bounds.top : 0));
									}
									else {
										this.context.lineTo(styleValue.points[i].x + (bounds ? bounds.left : 0), styleValue.points[i].y + (bounds ? bounds.top : 0));
									}
								}
								if(styleValue.style && styleValue.style.close) {
									this.context.closePath();
								}
								this.context.clip();
							}
							break;
						}
						/**
						 * 遮罩效果
						 * 通过 globalCompositeOperation + destination-in 实现
						 * @example
						 * style: { mask: maskShape } // maskShape 是一个图形控件
						 */
						case 'mask' : {
							if(!this.context.globalCompositeOperation) break;
							// mask是一个图形控件实例，在绘制前需要先应用mask
							// 这里只是标记，实际绘制在paint流程中处理
							this.__mask = styleValue;
							break;
						}
						// 阴影相关样式（WebGL兼容）
						case 'shadowColor' : {
							if(this.webglControl) {
								this.webglControl.setStyle('shadowColor', styleValue);
							}
							else {
								this.context.shadowColor = jmUtils.toColor(styleValue);
							}
							break;
						}
						case 'shadowBlur' : {
							if(this.webglControl) {
								this.webglControl.setStyle('shadowBlur', styleValue);
							}
							else {
								this.context.shadowBlur = Number(styleValue) || 0;
							}
							break;
						}
						case 'shadowOffsetX' : {
							if(this.webglControl) {
								this.webglControl.setStyle('shadowOffsetX', styleValue);
							}
							else {
								this.context.shadowOffsetX = Number(styleValue) || 0;
							}
							break;
						}
						case 'shadowOffsetY' : {
							if(this.webglControl) {
								this.webglControl.setStyle('shadowOffsetY', styleValue);
							}
							else {
								this.context.shadowOffsetY = Number(styleValue) || 0;
							}
							break;
						}
					}
				}
			}
		}

		// 应用平移变换
		if(this.translate) {
			__setStyle(this.translate, 'translate');
		}
		// 应用矩阵变换
		if(this.transform) {
			__setStyle(this.transform, 'transform');
		}
		// 遍历应用所有样式
		for(let k in style) {
			if(k === 'constructor') continue;
			let t = typeof style[k];
			// 自动转换渐变字符串
			if(t == 'string' && style[k].indexOf('-gradient') > -1) {
				style[k] = new jmGradient(style[k]);
			}
			// 自动转换阴影字符串
			else if(t == 'string' && k == 'shadow') {
				style[k] = new jmShadow(style[k]);
			}
			// 自动转换滤镜字符串
			else if(t == 'string' && k == 'filter') {
				style[k] = new jmFilter(style[k]);
			}
			__setStyle(style[k], k);
		}
	}

	/**
	 * 获取当前控件的边界矩形
	 * 
	 * 通过分析控件的描点或位置加宽高得到边界矩形。
	 * 对于 jmGraph，边界为画布尺寸。
	 * 对于有 points 的控件，边界为所有点的最小包围矩形。
	 * 
	 * @method getBounds
	 * @param {boolean} [isReset=false] - 是否强制重新计算（忽略缓存）
	 * @returns {Object} 边界对象
	 * @returns {number} returns.left - 左边界 X 坐标
	 * @returns {number} returns.top - 上边界 Y 坐标
	 * @returns {number} returns.right - 右边界 X 坐标
	 * @returns {number} returns.bottom - 下边界 Y 坐标
	 * @returns {number} returns.width - 宽度
	 * @returns {number} returns.height - 高度
	 * 
	 * @example
	 * // 获取边界
	 * const bounds = control.getBounds();
	 * console.log(`宽: ${bounds.width}, 高: ${bounds.height}`);
	 * 
	 * // 强制重新计算
	 * const newBounds = control.getBounds(true);
	 */
	getBounds(isReset) {
		//如果当次计算过，则不重复计算
		if(this.bounds && !isReset) return this.bounds;

		const rect = {}; // left top
		//jmGraph，特殊处理
		if(this.type == 'jmGraph' && this.canvas) {
			if(typeof this.canvas.width === 'function') {
				rect.right = this.canvas.width(); 
			}
			else if(this.width) {
				rect.right = this.width;
			}
			
			if(typeof this.canvas.height === 'function') {
				rect.bottom = this.canvas.height(); 
			}
			else if(this.height) {
				rect.bottom = this.height;
			}
		}
		// 根据 points 计算边界
		else if(this.points && this.points.length > 0) {		
			for(const p of this.points) {
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
		// 根据位置和尺寸计算边界
		else if(this.getLocation) {
			let p = this.getLocation();
			if(p) {
				rect.left = p.left;
				rect.top = p.top;
				rect.right = p.left + p.width;
				rect.bottom = p.top + p.height;
			}		
		}
		if(rect.left === undefined) rect.left = 0; 
		if(rect.top === undefined) rect.top = 0; 
		if(rect.right === undefined) rect.right = 0; 
		if(rect.bottom === undefined) rect.bottom = 0; 
		rect.width = rect.right - rect.left;
		rect.height = rect.bottom - rect.top;
		
		return this.bounds=rect;
	}

	/**
	 * 获取旋转后的边界矩形
	 * 
	 * 计算控件旋转后的最小包围矩形。
	 * 当控件有旋转变换时，实际占据的空间会发生变化。
	 * 
	 * @method getRotationBounds
	 * @param {Object} [rotation] - 旋转参数，默认使用 style.rotation
	 * @param {number} rotation.x - 旋转中心 X（相对于控件）
	 * @param {number} rotation.y - 旋转中心 Y（相对于控件）
	 * @param {number} rotation.angle - 旋转角度（弧度）
	 * @param {Object} [bounds] - 基础边界，默认使用 getBounds()
	 * @returns {Object} 旋转后的边界对象
	 * 
	 * @example
	 * // 获取旋转后的边界
	 * const bounds = control.getRotationBounds();
	 * console.log(`旋转后宽度: ${bounds.width}`);
	 */
	getRotationBounds(rotation=null) {
		rotation = rotation || this.getRotation();
		const bounds = this.getBounds();
		if(!rotation || !rotation.angle) return bounds;

		const rect = {
			width: 0,
			height: 0,
			oldBounds: bounds
		}; // left top
		let points = [];
		if(this.points && this.points.length > 0) {	
			points = jmUtils.clone(this.points, true); // 深度拷贝			
		}
		else if(this.getLocation) {
			const local = this.getLocation();
			if(local) {
				points.push({
					x: local.left,
					y: local.top
				},{
					x: local.left + local.width,
					y: local.top
				},{
					x: local.left + local.width,
					y: local.top + local.height
				},{
					x: local.left,
					y: local.top + local.height
				});
			}		
		}
		points = jmUtils.rotatePoints(points, {
			x: rotation.x + bounds.left,
			y: rotation.y + bounds.top
		}, rotation.angle);// 对现在点进行旋转

		for(const p of points) {
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

		if(!rect.left) rect.left = 0; 
		if(!rect.top) rect.top = 0; 
		if(!rect.right) rect.right = 0; 
		if(!rect.bottom) rect.bottom = 0; 

		rect.width = rect.right - rect.left;
		rect.height = rect.bottom - rect.top;

		return rect;
	}

	/**
	 * 获取当前控件的位置参数
	 * 
	 * 解析百分比和 margin 参数，返回标准化的位置信息。
	 * 支持百分比定位（如 '50%'）和 margin 偏移。
	 * 
	 * @method getLocation
	 * @returns {Object} 位置参数对象
	 * @returns {number} returns.left - 左边距
	 * @returns {number} returns.top - 上边距
	 * @returns {number} returns.width - 宽度
	 * @returns {number} returns.height - 高度
	 * @returns {Object} [returns.position] - 位置对象 {x, y}
	 * @returns {Object} [returns.center] - 中心点
	 * @returns {Object} [returns.start] - 起点（线条类）
	 * @returns {Object} [returns.end] - 终点（线条类）
	 * @returns {number} [returns.radius] - 半径（圆形类）
	 * 
	 * @example
	 * const loc = control.getLocation();
	 * console.log(`位置: (${loc.left}, ${loc.top})`);
	 */
	getLocation() {
		//如果已经计算过则直接返回
		//在开画之前会清空此对象
		//if(reset !== true && this.location) return this.location;

		let local = this.location = {left: 0,top: 0,width: 0,height: 0};

		// 检查是否有百分比参数需要解析，没有则直接引用避免克隆开销
		const needResolve = this.parent && (jmUtils.checkPercent(this.width) || jmUtils.checkPercent(this.height) ||
			(this.position && jmUtils.checkPercent(this.position.x)) || (this.position && jmUtils.checkPercent(this.position.y)));
		local.position = typeof this.position == 'function'? this.position(): (needResolve? jmUtils.clone(this.position) : this.position);	
		local.center = this.center && typeof this.center === 'function'?this.center(): (needResolve? jmUtils.clone(this.center) : this.center);//中心
		local.start = this.start && typeof this.start === 'function'?this.start(): (needResolve? jmUtils.clone(this.start) : this.start);//起点
		local.end = this.end && typeof this.end === 'function'?this.end(): (needResolve? jmUtils.clone(this.end) : this.end);//起点
		local.radius = this.radius;//半径
		local.width = this.width;
		local.height = this.height;

		const margin = this.style.margin;
		const marginObj = needResolve && margin ? jmUtils.clone(margin, {}) : (margin || {});
		marginObj.left = (marginObj.left || 0);
		marginObj.top = (marginObj.top || 0);
		marginObj.right = (marginObj.right || 0);
		marginObj.bottom = (marginObj.bottom || 0);
		
		//如果没有指定位置，但指定了margin。则位置取margin偏移量
		if(local.position) {
			local.left = local.position.x;
			local.top = local.position.y;
		}
		else {
			local.left = marginObj.left;
			local.top = marginObj.top;
		}

		if(this.parent) {
			const parentBounds = this.parent.getBounds();	

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
		}
		return local;
	}

	/**
	 * 获取当前控件的旋转信息
	 * 
	 * 解析旋转参数，支持百分比形式的旋转中心。
	 * 如果控件本身没有旋转，会继承父级的旋转。
	 * 
	 * @method getRotation
	 * @param {Object} [rotation] - 旋转参数，默认使用 style.rotation
	 * @param {Object} [bounds] - 基础边界
	 * @returns {Object} 旋转信息
	 * @returns {number} returns.x - 旋转中心 X（相对于控件）
	 * @returns {number} returns.y - 旋转中心 Y（相对于控件）
	 * @returns {number} returns.angle - 旋转角度（弧度）
	 * @returns {Object} returns.bounds - 控件边界
	 * 
	 * @example
	 * // 获取旋转信息
	 * const rot = control.getRotation();
	 * if(rot.angle) {
	 *     console.log(`旋转角度: ${rot.angle} 弧度`);
	 * }
	 */
	getRotation(rotation, bounds = null) {
		rotation = rotation || jmUtils.clone(this.style.rotation);

		if(!rotation) {
			//如果本身没有，则可以继承父级的
			rotation = this.parent && this.parent.getRotation?this.parent.getRotation():null;
			//如果父级有旋转，则把坐标转换为当前控件区域
			if(rotation) {
				bounds = bounds || this.getBounds();
				rotation.x -= bounds.left;
				rotation.y -= bounds.top;
			}
		}
		else {
			bounds = bounds || this.getBounds();
			if(typeof rotation.x === 'undefined') rotation.x = '50%';
			if(typeof rotation.y === 'undefined') rotation.y = '50%';
			if(jmUtils.checkPercent(rotation.x)) {
				rotation.x  = jmUtils.percentToNumber(rotation.x) * bounds.width;
			}
			if(jmUtils.checkPercent(rotation.y)) {
				rotation.y  = jmUtils.percentToNumber(rotation.y) * bounds.height;
			}
		}
		return {
			...rotation,
			bounds
		};

	}

	/**
	 * 计算位移偏移量
	 * 
	 * 解析 translate 样式，支持百分比形式。
	 * 
	 * @method getTranslate
	 * @param {Object} [translate] - 平移参数，默认使用 style.translate
	 * @param {Object} [bounds] - 参考边界
	 * @returns {Object} 平移信息 {x, y}
	 * 
	 * @example
	 * const trans = control.getTranslate();
	 * console.log(`平移: (${trans.x}, ${trans.y})`);
	 */
	getTranslate(translate, bounds = null) {
		translate = translate || this.style.translate;
		if(!translate) return {x: 0, y: 0};
		const result = {
			x: translate.x || 0,
			y: translate.y || 0
		}
		
		if(jmUtils.checkPercent(result.x)) {
			if(!bounds && this.parent) bounds = this.parent.getBounds();
			result.x  = jmUtils.percentToNumber(result.x) * bounds.width;
		}
		if(jmUtils.checkPercent(result.y)) {
			if(!bounds && this.parent) bounds = this.parent.getBounds();
			result.y  = jmUtils.percentToNumber(result.y) * bounds.height;
		}
		return result;
	}

	/**
	 * 移除当前控件
	 * 
	 * 从父控件的子控件列表中移除当前控件。
	 * 移除后会触发 needUpdate 重绘。
	 * 
	 * @method remove
	 * 
	 * @example
	 * // 移除控件
	 * control.remove();
	 */
	remove() {	
		if(this.parent) {
			this.parent.children.remove(this);
		}
	}

	/**
	 * 对控件进行平移
	 * 
	 * 遍历控件所有描点或位置，设置其偏移量。
	 * 支持移动 position、center、start、end、points 等属性。
	 * 
	 * @method offset
	 * @param {number} x - X 轴偏移量
	 * @param {number} y - Y 轴偏移量
	 * @param {boolean} [trans=true] - 是否传递给监听者
	 * @param {Object} [evt] - 如果是事件触发，传递 move 事件参数
	 * 
	 * @example
	 * // 向右移动 10px，向下移动 5px
	 * control.offset(10, 5);
	 */
	offset(x, y, trans, evt) {
		trans = trans === false?false:true;	
		let local = this.getLocation(true);		
		let offseted = false;
		
		if(local.position) {
			local.left += x;
			local.top += y;
			// 由于local是clone出来的对象，为了保留位移，则要修改原属性
			this.position.x = local.left;
			this.position.y = local.top;
			offseted = true;
		}

		if(local.center) {		
			this.center.x = local.center.x + x;
			this.center.y = local.center.y + y;
			offseted = true;
		}

		if(local.start && typeof local.start == 'object') {	
			this.start.x = local.start.x + x;
			this.start.y = local.start.y + y;
			offseted = true;
		}

		if(local.end && typeof local.end == 'object') {		
			this.end.x = local.end.x + x;
			this.end.y = local.end.y + y;
			offseted = true;
		}


		if(offseted == false && this.cpoints) {
			let p = typeof this.cpoints == 'function'?this.cpoints:this.cpoints;
			if(p) {			
				let len = p.length;
				for(let i=0; i < len;i++) {
					p[i].x += x;
					p[i].y += y;
				}		
				offseted = true;
			}			
		}
		
		if(offseted == false && this.points) {
			let len = this.points.length;
			for(let i=0; i < len;i++) {
				this.points[i].x += x;
				this.points[i].y += y;
			}
			offseted = true;
		}
		
		//触发控件移动事件	
		this.emit('move',{
			offsetX: x,
			offsetY: y,
			trans: trans,
			evt: evt
		});

		this.needUpdate = true;
	}

	/**
	 * 获取控件相对于画布的绝对边界
	 * 
	 * 与 getBounds 不同的是：getBounds 获取的是相对于父容器的边界，
	 * 而 getAbsoluteBounds 获取的是相对于画布的边界。
	 * 
	 * @method getAbsoluteBounds
	 * @returns {Object} 绝对边界对象
	 * 
	 * @example
	 * const absBounds = control.getAbsoluteBounds();
	 * console.log(`画布上的位置: (${absBounds.left}, ${absBounds.top})`);
	 */
	getAbsoluteBounds() {
		//当前控件的边界，
		let rec = this.getBounds();
		if(this.parent && this.parent.absoluteBounds) {
			//父容器的绝对边界
			let prec = this.parent.absoluteBounds || this.parent.getAbsoluteBounds();
			
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
	 * 把当前控件内部坐标转为画布绝对坐标
	 * 
	 * @method toAbsolutePoint
	 * @param {Object} point - 内部坐标 {x, y}
	 * @returns {Object} 绝对坐标
	 * 
	 * @example
	 * const absPoint = control.toAbsolutePoint({x: 10, y: 10});
	 */
	toAbsolutePoint(point) {
		if(point.x || point.y) {
			const bounds = this.absoluteBounds?this.absoluteBounds:this.getAbsoluteBounds();
			
			point.x = (point.x||0) + bounds.left;
			point.y = (point.y||0) + bounds.top;	
		}
		return point;
	}

	/**
	 * 把画布绝对坐标转为当前控件坐标系内
	 * 
	 * @method toLocalPosition
	 * @param {Object} point - 绝对坐标
	 * @returns {Object|false} 相对坐标，如果无法转换返回 false
	 * 
	 * @example
	 * const localPoint = control.toLocalPosition({x: 100, y: 100});
	 */
	toLocalPosition(point) {
		
		const bounds = this.absoluteBounds?this.absoluteBounds:this.getAbsoluteBounds();
		if(!bounds) return false;	
		return { 
			x: point.x - bounds.left,
			y: point.y - bounds.top
		};
	}

	/**
	 * 画控件前初始化
	 * 
	 * 执行 beginPath 开始控件的绘制路径。
	 * 重置位置信息缓存，确保使用最新的位置数据。
	 * 
	 * @method beginDraw
	 * @protected
	 * 
	 * @example
	 * // 子类重写时需要调用父类方法
	 * class MyShape extends jmControl {
	 *     beginDraw() {
	 *         super.beginDraw();
	 *         // 自定义初始化逻辑
	 *     }
	 * }
	 */
	beginDraw() {	
		this.getLocation(true);//重置位置信息
		this.context.beginPath && this.context.beginPath();		
		if(this.webglControl && this.webglControl.beginDraw) this.webglControl.beginDraw();
	}

	/**
	 * 结束控件绘制
	 * 
	 * 根据样式执行 fill 或 stroke 操作。
	 * 如果设置了 close 样式，会先闭合路径。
	 * 
	 * @method endDraw
	 * @protected
	 * 
	 * @example
	 * // 绘制流程
	 * control.beginDraw();
	 * control.draw();
	 * control.endDraw();
	 */
	endDraw() {
		//如果当前为封闭路径
		if(this.style.close) {
			if(this.webglControl) this.webglControl.closePath();
			this.context.closePath && this.context.closePath();
		}

		// 根据渲染模式选择不同的绘制路径
		if(this.webglControl) {
			// WebGL 模式：使用 WebGL 绘制
			const fill = this.style['fill'] || this.style['fillStyle'];
			if(fill) {
				const bounds = this.getBounds();
				this.webglControl.fill(bounds);
			}
			if(this.style['stroke'] || (!fill && !this.is('jmGraph'))) {
				this.webglControl.stroke();
			}
			if(this.webglControl.endDraw) this.webglControl.endDraw();
		}
		else {
			// 2D 模式：使用 Canvas 2D API 绘制
			const fill = this.style['fill'] || this.style['fillStyle'];
			if(fill) {
				this.context.fill && this.context.fill();
			}
			if(this.style['stroke'] || (!fill && !this.is('jmGraph'))) {
				this.context.stroke && this.context.stroke();
			}
		}

		this.needUpdate = false;
	}

	/**
	 * 绘制控件路径
	 * 
	 * 在画布上绘制控件的路径点。
	 * 子类应该重写此方法实现自定义绘制逻辑。
	 * 
	 * @method draw
	 * @protected
	 * 
	 * @example
	 * // 子类重写绘制方法
	 * class MyShape extends jmControl {
	 *     draw() {
	 *         const ctx = this.context;
	 *         ctx.moveTo(0, 0);
	 *         ctx.lineTo(100, 100);
	 *         // ... 更多绘制逻辑
	 *     }
	 * }
	 */
	draw() {	
		if(this.points && this.points.length > 0) {
			//获取当前控件的绝对位置
			const bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
			if(this.webglControl) {
				this.webglControl.setParentBounds(bounds);
				this.webglControl.draw(this.points);
			}
			else if(this.context && this.context.moveTo) {
				this.context.moveTo(this.points[0].x + bounds.left,this.points[0].y + bounds.top);
				let len = this.points.length;			
				for(let i=1; i < len;i++) {
					let p = this.points[i];
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
	}

	/**
	 * 绘制当前控件及其子控件
	 * 
	 * 协调控件的绘制流程：
	 * 1. 检查可见性
	 * 2. 初始化点数据
	 * 3. 计算边界
	 * 4. 应用样式
	 * 5. 绘制自身
	 * 6. 绘制子控件
	 * 7. 触发事件
	 * 
	 * @method paint
	 * @param {boolean} [v] - 是否可见，false 时跳过绘制
	 * 
	 * @example
	 * // 手动触发重绘
	 * control.paint();
	 */
	paint(v) {
		if(v !== false && this.visible !== false) {		
			if(this.initPoints) this.initPoints();
			//计算当前边界
			this.bounds = null;
			this.absoluteBounds = this.getAbsoluteBounds();
			let needDraw = true;//是否需要绘制
			if(!this.is('jmGraph') && this.graph) {
				if(this.absoluteBounds.left >= this.graph.width) needDraw = false;
				else if(this.absoluteBounds.top >= this.graph.height) needDraw = false;
				else if(this.absoluteBounds.right <= 0) needDraw = false;
				else if(this.absoluteBounds.bottom <= 0) needDraw = false;
			}
			
			this.context.save && this.context.save();

			this.emit('beginDraw', this);
			
			this.setStyle();//设定样式

			// 应用mask遮罩效果：在mask区域内绘制当前控件
			// 使用 destination-in 合成模式，只保留mask区域内的内容
			const maskStyle = this.style.mask || this.__mask;
			if(maskStyle && maskStyle.points && this.context.globalCompositeOperation) {
				// 先绘制当前控件
				if(needDraw && this.beginDraw) this.beginDraw();
				if(needDraw && this.draw) this.draw();	
				if(needDraw && this.endDraw) this.endDraw();

				// 再应用mask裁剪
				this.context.globalCompositeOperation = 'destination-in';
				if(maskStyle.initPoints) maskStyle.initPoints();
				const mBounds = maskStyle.parent && maskStyle.parent.absoluteBounds ? maskStyle.parent.absoluteBounds : this.absoluteBounds;
				this.context.beginPath();
				if(maskStyle.points && maskStyle.points.length > 0) {
					this.context.moveTo(maskStyle.points[0].x + (mBounds ? mBounds.left : 0), maskStyle.points[0].y + (mBounds ? mBounds.top : 0));
					for(let i = 1; i < maskStyle.points.length; i++) {
						if(maskStyle.points[i].m) {
							this.context.moveTo(maskStyle.points[i].x + (mBounds ? mBounds.left : 0), maskStyle.points[i].y + (mBounds ? mBounds.top : 0));
						}
						else {
							this.context.lineTo(maskStyle.points[i].x + (mBounds ? mBounds.left : 0), maskStyle.points[i].y + (mBounds ? mBounds.top : 0));
						}
					}
					if(maskStyle.style && maskStyle.style.close) {
						this.context.closePath();
					}
				}
				this.context.fillStyle = '#ffffff';
				this.context.fill();
				// 恢复合成模式
				this.context.globalCompositeOperation = 'source-over';
			}
			else {
				if(needDraw && this.beginDraw) this.beginDraw();
				if(needDraw && this.draw) this.draw();	
				if(needDraw && this.endDraw) this.endDraw();
			}

			if(this.children) {
				this.children.each(function(i,item) {
					if(item && item.paint) item.paint();
				});
			}

			this.emit('endDraw',this);	
			this.context.restore && this.context.restore();
			
			this.needUpdate = false;
		}
	}

	/**
	 * 获取指定事件的监听器集合
	 * 
	 * 返回绑定到指定事件名称的所有事件处理函数。
	 * 
	 * @method getEvent
	 * @param {string} name - 事件名称（如 'click', 'mousedown'）
	 * @returns {jmList|null} 事件处理函数集合，不存在则返回 null
	 * 
	 * @example
	 * const handlers = control.getEvent('click');
	 * if(handlers) {
	 *     console.log(`有 ${handlers.count()} 个点击事件处理器`);
	 * }
	 */
	getEvent(name) {		
		return this.__events?this.__events[name]:null;
	}

	/**
	 * 绑定控件事件
	 * 
	 * 为控件添加事件监听器。支持同时绑定多个事件（用空格分隔）。
	 * 同一个处理函数不会被重复添加。
	 * 
	 * @method bind
	 * @param {string} name - 事件名称，多个事件用空格分隔
	 * @param {Function} handle - 事件处理函数
	 * @returns {void}
	 * 
	 * @example
	 * // 绑定单个事件
	 * control.bind('click', (evt) => {
	 *     console.log('被点击了', evt);
	 * });
	 * 
	 * // 绑定多个事件
	 * control.bind('mousedown mouseup', (evt) => {
	 *     console.log('鼠标事件', evt);
	 * });
	 * 
	 * // 使用 on 别名
	 * control.on('mousemove', (evt) => {
	 *     console.log('鼠标移动', evt.position);
	 * });
	 */
	bind(name, handle) {	
		if(name && name.indexOf(' ') > -1) {
			name = name.split(' ');
			for(let n of name) {
				n && this.bind(n, handle);
			}
			return;
		}	
		/**
		 * 添加事件的集合
		 *
		 * @method _setEvent
		 * @private
		 */
		function _setEvent(name, events) {
			if(!this.__events) this.__events = {};
			return this.__events[name] = events;
		}
		let eventCollection = this.getEvent(name) || _setEvent.call(this, name, new jmList());
		if(!eventCollection.contain(handle)) {
			eventCollection.add(handle);
		}
	}

	/**
	 * 移除控件事件
	 * 
	 * 移除已绑定的事件处理函数。如果不指定处理函数，则移除该事件的所有处理函数。
	 * 
	 * @method unbind
	 * @param {string} name - 事件名称，多个事件用空格分隔
	 * @param {Function} [handle] - 要移除的事件处理函数，不指定则移除所有
	 * 
	 * @example
	 * // 移除特定处理函数
	 * control.unbind('click', myHandler);
	 * 
	 * // 移除所有点击事件
	 * control.unbind('click');
	 * 
	 * // 移除多个事件
	 * control.unbind('mousedown mouseup');
	 */
	unbind(name, handle) {	
		if(name && name.indexOf(' ') > -1) {
			name = name.split(' ');
			for(let n of name) {
				n && this.unbind(n, handle);
			}
			return;
		}	
		let eventCollection = this.getEvent(name) ;		
		if(eventCollection) {
			if(handle) eventCollection.remove(handle);
			else eventCollection.clear();
		}
	}


	/**
	 * 触发事件
	 * 
	 * 执行指定事件的所有监听器。
	 * 支持传递多个参数给事件处理函数。
	 * 
	 * @method emit
	 * @param {string} name - 事件名称
	 * @param {...*} args - 传递给事件处理函数的参数
	 * @returns {jmControl} 返回 this 以支持链式调用
	 * 
	 * @example
	 * // 触发自定义事件
	 * control.emit('customEvent', { data: 'value' });
	 * 
	 * // 触发带多个参数的事件
	 * control.emit('dataChange', oldValue, newValue);
	 */
	emit(...args) {			
		// 避免每帧 args.slice(1) 分配临时数组
		// runEventHandle 内部会把非数组参数包装成数组
		if(args.length > 2) {
			this.runEventHandle(args[0], args.slice(1));
		} else if(args.length === 2) {
			this.runEventHandle(args[0], [args[1]]);
		} else {
			this.runEventHandle(args[0], []);
		}
		return this;
	}

	/**
	 * 执行事件处理函数
	 * 
	 * 内部方法，用于执行指定事件的所有监听器。
	 * 如果任一处理函数返回 false，会设置 args.cancel = true。
	 * 
	 * @method runEventHandle
	 * @param {string} name - 事件名称
	 * @param {Array|Object} args - 事件参数
	 * @returns {boolean} 是否被取消
	 * @protected
	 */
	runEventHandle(name, args) {
		let events = this.getEvent(name);		
		if(events) {
		
			var self = this;
			if(!Array.isArray(args)) args = [args];	
			events.each(function(i, handle) {
				//只要有一个事件被阻止，则不再处理同级事件，并设置冒泡被阻断
				if(false === handle.apply(self, args)) {
					args.cancel = true;
				}
			});		
		}	
		return args.cancel;
	}

	/**
	 * 检查坐标是否落在当前控件区域中
	 * 
	 * 用于点击测试和碰撞检测。
	 * 支持旋转后的碰撞检测，以及自定义命中区域。
	 * 
	 * @method checkPoint
	 * @param {Object} p - 要检测的点坐标
	 * @param {number} p.x - X 坐标
	 * @param {number} p.y - Y 坐标
	 * @param {number} [pad] - 容差范围，默认使用 lineWidth 或 1
	 * @returns {boolean} 点是否在控件区域内
	 * 
	 * @example
	 * // 检查点击位置
	 * graph.bind('click', (evt) => {
	 *     if(control.checkPoint(evt.position)) {
	 *         console.log('点击了控件');
	 *     }
	 * });
	 */
	checkPoint(p, pad) {
		//jmGraph 需要判断dom位置
		if(this.type == 'jmGraph') {
			//获取dom位置
			const position = this.getPosition();
			if(p.pageX > position.right || p.pageX < position.left) {
				return false;
			}
			if(p.pageY > position.bottom || p.pageY < position.top) {
				return false;
			}	
			return true;
		}
		
		const bounds = this.getBounds();	
		// 如果指定了合中区域，则以命中区域为准
		if(this.hitArea) {
			const hitArea = {
				left: this.hitArea.x + bounds.left,
				top: this.hitArea.y + bounds.top,
				right: this.hitArea.width + bounds.left,
				bottom: this.hitArea.height + bounds.top,
			};
			if(p.x > hitArea.right || p.x < hitArea.left) {
				return false;
			}
			if(p.y > hitArea.bottom || p.y < hitArea.top) {
				return false;
			}
			return true;
		}
		
		let ps = this.points;
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
			const rotation = this.getRotation(null, bounds);//获取当前旋转参数
			//如果有旋转参数，则需要转换坐标再处理
			if(rotation && rotation.angle) {
				ps = jmUtils.clone(ps, true);//拷贝一份数据
				//rotateX ,rotateY 是相对当前控件的位置
				ps = jmUtils.rotatePoints(ps, {
					x: rotation.x + bounds.left,
					y: rotation.y + bounds.top
				}, rotation.angle || 0);
			}
			//如果当前路径不是实心的
			//就只用判断点是否在边上即可	
			if(ps.length > 2 && (!this.style['fill'] || this.style['stroke'])) {
				let i = 0;
				const count = ps.length;
				for(let j = i+1; j <= count; j = (++i + 1)) {
					//如果j超出最后一个
					//则当为封闭图形时跟第一点连线处理.否则直接返回false
					if(j == count) {
						if(this.style.close) {
							const r = jmUtils.pointInPolygon(p,[ps[i],ps[0]], pad);
							if(r) return true;
						}
					} 
					else {
						//判断是否在点i,j连成的线上
						const s = jmUtils.pointInPolygon(p,[ps[i],ps[j]], pad);
						if(s) return true;
					}			
				}
				//不是封闭的图形，则直接返回
				if(!this.style['fill']) return false;
			}

			const r = jmUtils.pointInPolygon(p,ps, pad);		
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
	 * 触发控件事件并执行事件冒泡
	 * 
	 * 组合事件参数，按控件层级关系执行事件冒泡。
	 * 事件从最上层的子控件开始触发，向上冒泡到父控件。
	 * 
	 * @method raiseEvent
	 * @param {string} name - 事件名称
	 * @param {Object} args - 原生事件对象
	 * @returns {boolean} 如果事件被阻止冒泡则返回 false，否则返回 true
	 * 
	 * @example
	 * // 通常由框架内部调用，用户一般不需要直接调用
	 * // 框架会自动处理鼠标/触摸事件
	 */
	raiseEvent(name, args) {
		if(this.visible === false) return ;//如果不显示则不响应事件	
		
		if(!args.position) {		
			const graph = this.graph;
			args.isWXMiniApp = graph.isWXMiniApp;

			const srcElement = args.srcElement || args.target;			
			
			const position = jmUtils.getEventPosition(args);//初始化事件位置
		
			args = {
				position: position,
				button: args.button == 0 || position.isTouch? 1: args.button,
				keyCode: args.keyCode || args.charCode || args.which,
				ctrlKey: args.ctrlKey,
				cancel : false,
				event: args, // 原生事件
				srcElement : srcElement,
				isWXMiniApp: graph.isWXMiniApp,
			};		
		}
		args.path = args.path||[]; //事件冒泡路径

		//先执行子元素事件，如果事件没有被阻断，则向上冒泡
		let stoped = false;
		if(this.children) {
			this.children.each(function(j, el) {
				//未被阻止才执行			
				if(args.cancel !== true) {
					//如果被阻止冒泡，
					stoped = el.raiseEvent(name, args) === false? true: stoped;
					// 不再响应其它元素
					if(stoped) return false;
				}
			}, true);//按逆序处理
		}
		// 如果已被阻止，不再响应上级事件
		if(stoped) return false;
		
		//获取当前对象的父元素绝对位置
		//生成当前坐标对应的父级元素的相对位置
		let abounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds : this.absoluteBounds;
		if(!abounds) return false;	
		//args = jmUtils.clone(args);//参数副本
		args.position.x = args.position.offsetX - abounds.left;
		args.position.y = args.position.offsetY - abounds.top;

		// 是否在当前控件内操作
		const inpos = this.interactive !== false && this.checkPoint(args.position);

		if(name === 'mousemove' && this.type == 'jmGraph' && !inpos) {
			console.log('mousemove out', args.position, abounds);
		}
		
		//事件发生在边界内或健盘事件发生在画布中才触发
		if(inpos) {
			//如果没有指定触发对象，则认为当前为第一触发对象
			if(!args.target) {
				args.target = this;
			}
			
			this.runEventAndPopEvent(name, args);

			if(!this.focused && (name === 'mousemove' || name === 'touchmove')) {
				this.focused = true;//表明当前焦点在此控件中
				this.raiseEvent(name === 'mousemove'? 'mouseover': 'touchover', args);
			}	
		}
		else {
			//如果焦点不在，且原焦点在，则触发mouseleave事件
			if(this.interactive !== false && !inpos &&
				this.focused && 
				(name === 'mousemove' || name === 'touchmove')) {

				this.focused = false;//表明当前焦点离开
				this.runEventHandle(name === 'mousemove'? 'mouseleave' : 'touchleave', args);//执行事件	
			}	
		}
			
		return args.cancel === false;//如果被阻止则返回false,否则返回true
	}

	/**
	 * 执行事件并进行冒泡
	 * 
	 * 内部方法，用于执行事件处理并添加到事件路径。
	 * 
	 * @method runEventAndPopEvent
	 * @param {string} name - 事件名称
	 * @param {Object} args - 事件参数
	 * @protected
	 */
	runEventAndPopEvent(name, args) {	

		if(args.cancel !== true) {
			// 添加到触发路径
			args.path.push(this);

			//如果返回true则阻断冒泡
			this.runEventHandle(name, args);//执行事件

			// // 向父节点冒泡事件		
			// if(args.cancel !== true && this.parent && this.parent.runEventAndPopEvent) {
			// 	// 相对位置需要改为父节点的
			// 	if(args.position) {
			// 		let bounds = this.parent.getBounds();
			// 		args.position.x += bounds.left;
			// 		args.position.y += bounds.top;
			// 	}
			// 	this.parent.runEventAndPopEvent(name, args);
			// }		
		}
	}

	/**
	 * 清空控件指定事件
	 * 
	 * 移除指定事件名称下的所有事件处理函数。
	 * 
	 * @method clearEvents
	 * @param {string} name - 需要清除的事件名称
	 * 
	 * @example
	 * // 清除所有点击事件
	 * control.clearEvents('click');
	 */
	clearEvents(name) {
		var eventCollection = this.getEvent(name);		
		if(eventCollection) {
			eventCollection.clear();
		}
	}

	/**
	 * 查找指定类型的父级控件
	 * 
	 * 沿着父级链向上查找，直到找到指定类型的控件或到达最顶级。
	 * 
	 * @method findParent
	 * @param {string|Function} type - 类型名称（字符串）或类构造函数
	 * @returns {jmControl|null} 找到的父级控件实例，未找到返回 null
	 * 
	 * @example
	 * // 查找 jmGraph 实例
	 * const graph = control.findParent('jmGraph');
	 * 
	 * // 查找特定类的实例
	 * const parent = control.findParent(MyCustomControl);
	 */
	findParent(type) {
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
	 * 设置控件是否可拖动
	 * 
	 * 启用或禁用控件的拖动功能。
	 * 拖动时会触发 movestart、move、moveend 事件。
	 * 
	 * @method canMove
	 * @param {boolean} m - true 启用拖动，false 禁用拖动
	 * @param {jmGraph} [graph] - 画布实例，如果控件已添加到画布可省略
	 * @returns {jmControl} 返回 this 以支持链式调用
	 * 
	 * @example
	 * // 启用拖动
	 * control.canMove(true);
	 * 
	 * // 禁用拖动
	 * control.canMove(false);
	 * 
	 * // 监听拖动事件
	 * control.on('movestart', (evt) => console.log('开始拖动'));
	 * control.on('moveend', (evt) => console.log('结束拖动'));
	 */
	canMove(m, graph) {
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
				let _this = self;
				//如果鼠标经过当前可移动控件，则显示可移动指针
				//if(evt.path && evt.path.indexOf(_this)>-1) {
				//	_this.cursor('move');	
				//}
				if(_this.__mvMonitor.mouseDown) {
					_this.parent.bounds = null;
					//let parentbounds = _this.parent.getAbsoluteBounds();		
					let offsetx = evt.position.offsetX - _this.__mvMonitor.curposition.x;
					let offsety = evt.position.offsetY - _this.__mvMonitor.curposition.y;				
					//console.log(offsetx + ',' + offsety);
					//如果锁定边界
					if(_this.option.lockSide) {
						let thisbounds = _this.bounds || _this.getAbsoluteBounds();					
						//检查边界出界
						let outside = jmUtils.checkOutSide(_this.option.lockSide, thisbounds, { x: offsetx, y: offsety });
						if(outside.left < 0 && offsetx < 0) {
							//offsetx -= outside.left;
							offsetx = 0;
						}
						else if(outside.right > 0 && offsetx > 0) {
							//offsetx -= outside.right;
							offsetx = 0;
						}
						if(outside.top < 0 && offsety < 0) {
							//offsety -= outside.top;
							offsety = 0;
						}
						else if(outside.bottom > 0 && offsety > 0) {
							//offsety -= outside.bottom;
							offsety = 0;
						}
					}
					
					if(offsetx || offsety) {
						_this.offset(offsetx, offsety, true, evt);
						if(offsetx) _this.__mvMonitor.curposition.x = evt.position.offsetX;
						if(offsety) _this.__mvMonitor.curposition.y = evt.position.offsetY;	
						//console.log('mouse move',offsetx + '.' + offsety);
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
				let _this = self;
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
				let _this = self;
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
					//var parentbounds = this.parent.absoluteBounds || this.parent.getAbsoluteBounds();	
					this.__mvMonitor.curposition.x = evt.position.offsetX;//evt.position.x + parentbounds.left;
					this.__mvMonitor.curposition.y = evt.position.offsetY;//evt.position.y + parentbounds.top;
					//触发控件移动事件
					this.emit('movestart',{position:this.__mvMonitor.curposition});
					
					evt.cancel = true;
					return false;
				}			
			}
		}
		graph = graph || this.graph ;//获取最顶级元素画布
		
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

		this.interactive = true;// 如果可以移动，则响应事件
		return this;
	}
};

export { jmControl };
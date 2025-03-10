
import {jmUtils} from "./jmUtils.js";
import {jmList} from "./jmList.js";
import {jmGradient} from "./jmGradient.js";
import {jmShadow} from "./jmShadow.js";
import {jmProperty} from "./jmProperty.js";
import WebglPath from "../lib/webgl/path.js";

//样式名称，也当做白名单使用		
const jmStyleMap = {
	'fill':'fillStyle',
	'fillImage':'fillImage',
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

/**
 * 控件基础对象
 * 控件的基础属性和方法
 *
 * @class jmControl
 * @extends jmProperty
 */	
export default class jmControl extends jmProperty {	

	constructor(params, t) {
		params = params||{};
		super(params);
		this.property('type', t || new.target.name);
		this.style = params && params.style ? params.style : {};
		//this.position = params.position || {x:0,y:0};
		this.width = params.width || 0;
		this.height = params.height  || 0;
		this.hitArea = params.hitArea || null;
		//this.lockSide = params.lockSide || null;

		if(params.position) {
			this.position = params.position;
		}

		this.graph = params.graph || null;
		this.zIndex = params.zIndex || 0;
		this.interactive = typeof params.interactive == 'undefined'? false : params.interactive;

		// webgl模式
		if(this.mode === 'webgl') {
			this.webglControl = new WebglPath(this.graph, {
				style: this.style,
				control: this,
				isRegular: params.isRegular,
				needCut: params.needCut
			});
		}

		this.initializing();	
		
		this.on = this.bind;
		
		this.option = params;
	}

	//# region 定义属性
	/**
	 * 当前对象类型名jmRect
	 *
	 * @property type
	 * @type string
	 */
	get type() {
		return this.property('type');
	}

	/**
	 * 当前canvas的context
	 * @property context
	 * @type {object}
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
	 * 样式
	 * @property style
	 * @type {object}
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
	 * 当前控件是否可见
	 * @property visible
	 * @default true
	 * @type {boolean}
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
	 * 当前控件是否是交互式的，如果是则会响应鼠标或touch事件。
	 * 如果false则不会主动响应，但冒泡的事件依然会得到回调
	 * @property interactive
	 * @default false
	 * @type {boolean}
	 */
	get interactive() {
		const s = this.property('interactive');
		return s;
	}
	set interactive(v) {
		return this.property('interactive', v);
	}

	/**
	 * 事件命中区域，如果不给定就会自动计算
	 *  这个区域是相对于当前控件本身的，也就是说从左上角开始 {x:0,y:0}
	 * @property hitArea
	 * @default bounds
	 * @type { x: number, y: number, width: number, height: number}
	 */
	get hitArea() {
		const s = this.property('hitArea');
		return s;
	}
	set hitArea(v) {
		return this.property('hitArea', v);
	}
		
	/**
	 * 当前控件的子控件集合
	 * @property children
	 * @type {list}
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
	 * 宽度
	 * @property width
	 * @type {number}
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
	 * 高度
	 * @property height
	 * @type {number}
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
	 * 控件层级关系，发生改变时，需要重新调整排序
	 * @property zIndex
	 * @type {number}
	 */
	get zIndex() {
		let s = this.property('zIndex');
		if(!s) s = this.property('zIndex', 0);
		return s;
	}
	set zIndex(v) {
		this.property('zIndex', v);
		this.children.sort();//层级发生改变，需要重新排序
		this.needUpdate = true;
		return v;
	}

	/**
	 * 设置鼠标指针
	 * css鼠标指针标识,例如:pointer,move等
	 * 
	 * @property cursor
	 * @type {string}
	 */
	set cursor(cur) {	
		var graph = this.graph ;
		if(graph) {		
			graph.css('cursor',cur);		
		}
	}
	get cursor() {
		var graph = this.graph ;
		if(graph) {		
			return graph.css('cursor');		
		}
	}

	//# end region

	/**
	 * 初始化对象，设定样式，初始化子控件对象
	 * 此方法为所有控件需调用的方法
	 *
	 * @method initializing
	 * @for jmControl
	 */
	initializing() {

		const self = this;
		//定义子元素集合
		this.children = this.children || new jmList();
		const oadd = this.children.add;
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
				oadd.call(this, obj);
				obj.emit('add', obj);

				self.needUpdate = true;
				if(self.graph) obj.graph = self.graph;
				this.sort();//先排序
				//self.emit('addChild', obj);
				return obj;
			}
		};
		this.children.oremove= this.children.remove;
		//当把对象从此控件中移除时，把其父节点置为空
		this.children.remove = function(obj) {
			if(typeof obj === 'object') {				
				obj.parent = null;
				obj.graph = null;
				obj.remove(true);
				this.oremove(obj);
				self.needUpdate = true;
				//self.emit('removeChild', obj, index);
			}
		};
		/**
		 * 根据控件zIndex排序，越大的越高
		 */
		//const osort = this.children.sort;
		this.children.sort = function() {
			const levelItems = {};
			//提取zindex大于0的元素
			//为了保证0的层级不改变，只能把大于0的提出来。
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
			/*
			osort.call(this, (c1, c2) => {
				let zindex1 = c1.zIndex || c1.style.zIndex || 0;
				let zindex2 = c2.zIndex || c2.style.zIndex || 0;
				return zindex1 - zindex2;
			});*/
		}
		this.children.clear = function() {
			this.each(function(i,obj) {
				this.remove(obj);
			},true);
		}
		this.needUpdate = true;
	} 

	/**
	 * 设定样式到context
	 * 处理样式映射，转换渐变和阴影对象为标准canvas属性
	 * 样式一览
		| 简化名称 | 原生名称 | 说明
		| :- | :- | :- | 
		| fill | fillStyle | 用于填充绘画的颜色、渐变或模式
		| stroke | strokeStyle | 用于笔触的颜色、渐变或模式
		| shadow | 没有对应的 | 最终会解析成以下几个属性，格式：'0,0,10,#fff'或g.createShadow(0,0,20,'#000');
		| shadow.blur | shadowBlur | 用于阴影的模糊级别
		| shadow.x | shadowOffsetX | 阴影距形状的水平距离
		| shadow.y | shadowOffsetY | 阴影距形状的垂直距离
		| shadow.color | shadowColor | 阴影颜色，格式：'#000'、'#46BF86'、'rgb(255,255,255)'或'rgba(39,72,188,0.5)'
		| lineWidth | lineWidth | 当前的线条宽度
		| miterLimit | miterLimit | 最大斜接长度
		| font | font | 请使用下面的 fontSize 和 fontFamily
		| fontSize | font | 字体大小
		| fontFamily | font | 字体
		| opacity | globalAlpha | 绘图的当前 alpha 或透明值
		| textAlign | textAlign | 文本内容的当前对齐方式
		| textBaseline | textBaseline | 在绘制文本时使用的当前文本基线
		| lineJoin | lineJoin | 两条线相交时，所创建的拐角类型：miter(默认，尖角),bevel(斜角),round（圆角）
		| lineCap | lineCap | 线条的结束端点样式：butt(默认，平),round(圆),square（方）
	 * 
	 * @method setStyle
	 * @for jmControl
	 * @private
	 * @param {style} style 样式对象，如:{fill:'black',stroke:'red'}
	 */
	setStyle(style) {
		style = style || jmUtils.clone(this.style, true);
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
		const __setStyle = (style, name, mpkey) => {
			
			if(style) {		
				let styleValue = style;		
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

				//如果为渐变对象
				if((styleValue instanceof jmGradient) || (t == 'string' && styleValue.indexOf('-gradient') > -1)) {
					//如果是渐变，则需要转换
					if(t == 'string' && styleValue.indexOf('-gradient') > -1) {
						styleValue = new jmGradient(styleValue);
					}
					__setStyle(styleValue.toGradient(this), mpname||name);	
				}
				else if(mpname) {
					
					if(this.webglControl) {

						this.webglControl.setStyle(mpname, styleValue);
					}
					else {
						//只有存在白名单中才处理
						//颜色转换
						if(t == 'string' && ['fillStyle', 'strokeStyle', 'shadowColor'].indexOf(mpname) > -1) {
							styleValue = jmUtils.toColor(styleValue);
						}

						this.context[mpname] = styleValue;
					}
				}	
				else {
					switch(name) {
						//阴影样式
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
						//平移
						case 'translate' : {
							break;
						}
						//旋转
						case 'rotation' : {	
							if(typeof styleValue.angle === 'undefined' || isNaN(styleValue.angle)) break;	
							styleValue = this.getRotation(styleValue);
							
							this.__translateAbsolutePosition = this.toAbsolutePoint({
								x: styleValue.x,
								y: styleValue.y
							});
							//旋转，则移位，如果有中心位则按中心旋转，否则按左上角旋转
							//这里只有style中的旋转才能生效，不然会导至子控件多次旋转
							this.context.translate && this.context.translate(this.__translateAbsolutePosition.x, this.__translateAbsolutePosition.y);							
							this.context.rotate && this.context.rotate(styleValue.angle);
							this.context.translate && this.context.translate(-this.__translateAbsolutePosition.x, -this.__translateAbsolutePosition.y);							
							break;
						}
						case 'transform' : {
							if(!this.context.transform) break;
							if(Array.isArray(styleValue)) {
								this.context.transform.apply(this.context, styleValue);
							}
							else if(typeof styleValue == 'object') {
								this.context.transform(
									styleValue.scaleX || 1,//水平缩放
									styleValue.skewX || 0,//水平倾斜
									styleValue.skewY || 0,//垂直倾斜
									styleValue.scaleY || 1,//垂直缩放
									styleValue.offsetX || 0,//水平位移
									styleValue.offsetY || 0//垂直位移
								);
							}								
							break;
						}
						//鼠标指针
						case 'cursor' : {
							this.cursor = styleValue;
							break;
						}
					}							
				}
			}
		}	

		//一些特殊属性要先设置，否则会导致顺序不对出现错误的效果
		if(this.translate) {
			__setStyle(this.translate, 'translate');
		}
		if(this.transform) {
			__setStyle(this.transform, 'transform');
		}
		//设置样式
		for(let k in style) {
			if(k === 'constructor') continue;
			let t = typeof style[k];
			//先处理部分样式，以免每次都需要初始化解析
			if(t == 'string' && style[k].indexOf('-gradient') > -1) {
				style[k] = new jmGradient(style[k]);
			}
			else if(t == 'string' && k == 'shadow') {
				style[k] = new jmShadow(style[k]);
			}
			__setStyle(style[k], k);
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
		else if(this.getLocation) {
			let p = this.getLocation();
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
	 * 获取被旋转后的边界
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
	 * 获取当前控件的位置相关参数
	 * 解析百分比和margin参数
	 *
	 * @method getLocation
	 * @return {object} 当前控件位置参数，包括中心点坐标，右上角坐标，宽高
	 */
	getLocation(clone=true) {
		//如果已经计算过则直接返回
		//在开画之前会清空此对象
		//if(reset !== true && this.location) return this.location;

		let local = this.location = {left: 0,top: 0,width: 0,height: 0};
		local.position = typeof this.position == 'function'? this.position(): jmUtils.clone(this.position);	
		local.center = this.center && typeof this.center === 'function'?this.center(): jmUtils.clone(this.center);//中心
		local.start = this.start && typeof this.start === 'function'?this.start(): jmUtils.clone(this.start);//起点
		local.end = this.end && typeof this.end === 'function'?this.end(): jmUtils.clone(this.end);//起点
		local.radius = this.radius;//半径
		local.width = this.width;
		local.height = this.height;

		const margin = jmUtils.clone(this.style.margin, {});
		margin.left = (margin.left || 0);
		margin.top = (margin.top || 0);
		margin.right = (margin.right || 0);
		margin.bottom = (margin.bottom || 0);
		
		//如果没有指定位置，但指定了margin。则位置取margin偏移量
		if(local.position) {
			local.left = local.position.x;
			local.top = local.position.y;
		}
		else {
			local.left = margin.left;
			local.top = margin.top;
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
	 * 获取当前控制的旋转信息
	 * @returns {object} 旋转中心和角度
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

	// 计算位移偏移量
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
	 * 如果是VML元素，则调用其删除元素
	 *
	 * @method remove 
	 */
	remove() {	
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
	 * 获取控件相对于画布的绝对边界，
	 * 与getBounds不同的是：getBounds获取的是相对于父容器的边界.
	 *
	 * @method getAbsoluteBounds
	 * @return {object} 边界对象(left,top,right,bottom,width,height)
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
	 * 把当前控制内部坐标转为canvas绝对定位坐标
	 * 
	 * @method toAbsolutePoint
	 * @param {x: number, y: number} 内部坐标
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
	 * 把绝对定位坐标转为当前控件坐标系内
	 * @param {*} point 
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
	 * 执行beginPath开始控件的绘制
	 * 
	 * @method beginDraw
	 */
	beginDraw() {	
		this.getLocation(true);//重置位置信息
		this.context.beginPath && this.context.beginPath();		
		if(this.webglControl && this.webglControl.beginDraw) this.webglControl.beginDraw();
	}

	/**
	 * 结束控件绘制
	 *
	 * @method endDraw
	 */
	endDraw() {
		//如果当前为封闭路径
		if(this.style.close) {
			if(this.webglControl) this.webglControl.closePath();
			this.context.closePath && this.context.closePath();
		}
		
		const fill = this.style['fill'] || this.style['fillStyle'];
		if(fill) {
			if(this.webglControl) {
				const bounds = this.getBounds();
				this.webglControl.fill(bounds);
			}
			this.context.fill && this.context.fill();
		}
		if(this.style['stroke'] || (!fill && !this.is('jmGraph'))) {
			if(this.webglControl) this.webglControl.stroke();
			this.context.stroke && this.context.stroke();
		}

		if(this.webglControl && this.webglControl.endDraw) this.webglControl.endDraw();

		this.needUpdate = false;
	}

	/**
	 * 绘制控件
	 * 在画布上描点
	 * 
	 * @method draw
	 */
	draw() {	
		if(this.points && this.points.length > 0) {
			//获取当前控件的绝对位置
			const bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
			if(this.webglControl) {
				this.webglControl.setParentBounds(bounds);
				this.webglControl.draw([
					...this.points
				]);
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
	 * 绘制当前控件
	 * 协调控件的绘制，先从其子控件开始绘制，再往上冒。
	 *
	 * @method paint
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

			if(needDraw && this.beginDraw) this.beginDraw();
			if(needDraw && this.draw) this.draw();	
			if(needDraw && this.endDraw) this.endDraw();

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
	 * 获取指定事件的集合
	 * 比如mousedown,mouseup等
	 *
	 * @method getEvent
	 * @param {string} name 事件名称
	 * @return {list} 事件委托的集合
	 */
	getEvent(name) {		
		return this.__events?this.__events[name]:null;
	}

	/**
	 * 绑定控件的事件
	 *
	 * @method bind
	 * @param {string} name 事件名称
	 * @param {function} handle 事件委托
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
	 * 移除控件的事件
	 *
	 * @method unbind 
	 * @param {string} name 事件名称
	 * @param {function} handle 从控件中移除事件的委托
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
	 * 执行监听回调
	 * 
	 * @method emit
	 * @for jmControl
	 * @param {string} name 触发事件的名称
	 * @param {array} args 事件参数数组
	 */
	emit(...args) {			
		this.runEventHandle(args[0], args.slice(1));
		return this;
	}

	/**
	 * 独立执行事件委托
	 *
	 * @method runEventHandle
	 * @param {string} 将执行的事件名称
	 * @param {object} 事件执行的参数，包括触发事件的对象和位置
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
	 * 检 查坐标是否落在当前控件区域中..true=在区域内
	 *
	 * @method checkPoint
	 * @param {point} p 位置参数
	 * @param {number} [pad] 可选参数，表示线条多远内都算在线上
	 * @return {boolean} 当前位置如果在区域内则为true,否则为false。
	 */
	checkPoint(p, pad) {
		//jmGraph 需要判断dom位置
		if(this.type == 'jmGraph') {
			//获取dom位置
			let position = this.getPosition();
			// 由于高清屏会有放大坐标，所以这里用pagex就只能用真实的canvas大小
			const right = position.left + this.width;
			const bottom = position.top + this.height;
			if(p.x > right || p.x < position.left) {
				return false;
			}
			if(p.y > bottom || p.y < position.top) {
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
	 * 触发控件事件，组合参数并按控件层级关系执行事件冒泡。
	 *
	 * @method raiseEvent
	 * @param {string} name 事件名称
	 * @param {object} args 事件执行参数
	 * @return {boolean} 如果事件被组止冒泡则返回false,否则返回true
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
	 * 执行事件，并进行冒泡
	 * @param {string} name 事件名称 
	 * @param {object} args 事件参数
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
	 * @method clearEvents
	 * @param {string} name 需要清除的事件名称
	 */
	clearEvents(name) {
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
	 * 设定是否可以移动
	 * 此方法需指定jmgraph或在控件添加到jmgraph后再调用才能生效。
	 *
	 * @method canMove
	 * @param {boolean} m true=可以移动，false=不可移动或清除移动。
	 * @param {jmGraph} [graph] 当前画布，如果为空的话必需是已加入画布的控件，否则得指定画布。
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
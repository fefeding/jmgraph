
import {jmUtils} from "./jmUtils.js";
import {jmList} from "./jmList.js";
import {jmGradient} from "./jmGradient.js";
import {jmShadow} from "./jmShadow.js";
import {jmProperty} from "./jmProperty.js";
import WebglPath from "../lib/webgl/path.js";

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
	'lineJoin': 'lineJoin',
	'lineCap':'lineCap'
};

export default class jmControl extends jmProperty {	

	constructor(params, t) {
		params = params || {};
		super(params);
		this.property('type', t || new.target.name);
		this.style = params && params.style ? params.style : {};
		this.width = params.width || 0;
		this.height = params.height || 0;

		if(params.position) {
			this.position = params.position;
		}

		this.graph = params.graph || null;
		this.zIndex = params.zIndex || 0;
		this.interactive = typeof params.interactive == 'undefined' ? true : params.interactive;

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

	get type() {
		return this.property('type');
	}

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

	get style() {
		let s = this.property('style');
		if(!s) s = this.property('style', {});
		return s;
	}
	set style(v) {
		this.needUpdate = true;
		return this.property('style', v);
	}

	get visible() {
		let s = this.property('visible');
		if(typeof s == 'undefined') s = this.property('visible', true);
		return s;
	}
	set visible(v) {
		this.needUpdate = true;
		return this.property('visible', v);
	}	

	get interactive() {
		let s = this.property('interactive');
		return s;
	}
	set interactive(v) {
		return this.property('interactive', v);
	}
		
	get children() {
		let s = this.property('children');
		if(!s) s = this.property('children', new jmList());
		return s;
	}
	set children(v) {
		this.needUpdate = true;
		return this.property('children', v);
	}

	get width() {
		let s = this.property('width');
		if(typeof s == 'undefined') s = this.property('width', 0);
		return s;
	}
	set width(v) {
		this.needUpdate = true;
		return this.property('width', v);
	}

	get height() {
		let s = this.property('height');
		if(typeof s == 'undefined') s = this.property('height', 0);
		return s;
	}
	set height(v) {
		this.needUpdate = true;
		return this.property('height', v);
	}

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

	set cursor(cur) {	
		const graph = this.graph;
		if(graph) {		
			graph.css('cursor', cur);		
		}
	}
	get cursor() {
		const graph = this.graph;
		if(graph) {		
			return graph.css('cursor');		
		}
	}

	/**
	 * 初始化对象，设定样式，初始化子控件对象
	 * 此方法为所有控件需调用的方法
	 *
	 * @method initializing
	 * @for jmControl
	 */
	initializing() {

		const self = this;
		this.children = this.children || new jmList();
		const oadd = this.children.add;
		
		this.children.add = function(obj) {
			if(typeof obj === 'object') {
				if(obj.parent && obj.parent != self && obj.parent.children) {
					obj.parent.children.remove(obj);
				}
				obj.parent = self;
				if(this.contain(obj)) {
					this.oremove(obj);
				}
				oadd.call(this, obj);
				obj.emit('add', obj);

				self.needUpdate = true;
				if(self.graph) obj.graph = self.graph;
				this.sort();
				return obj;
			}
		};
		
		this.children.oremove = this.children.remove;
		
		this.children.remove = function(obj) {
			if(typeof obj === 'object') {				
				obj.parent = null;
				obj.graph = null;
				obj.remove(true);
				this.oremove(obj);
				self.needUpdate = true;
			}
		};
		
		this.children.sort = function() {
			const levelItems = {};
			
			this.each(function(i, obj) {
				if(!obj) return;
				let zindex = obj.zIndex;
				if(!zindex && obj.style && obj.style.zIndex) {
					zindex = Number(obj.style.zIndex);
					if(isNaN(zindex)) zindex = obj.style.zIndex || 0;
				}
				let items = levelItems[zindex] || (levelItems[zindex] = []);
				items.push(obj);
			});

			this.splice(0, this.length);
			
			for(let index in levelItems) {
				oadd.call(this, levelItems[index]);
			}
		}
		
		this.children.clear = function() {
			this.each(function(i, obj) {
				this.remove(obj);
			}, true);
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

		let __setStyle = (style, name, mpkey) => {
			
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

				if((styleValue instanceof jmGradient) || (t == 'string' && styleValue.indexOf('-gradient') > -1)) {
					if(t == 'string' && styleValue.indexOf('-gradient') > -1) {
						styleValue = new jmGradient(styleValue);
					}
					__setStyle(styleValue.toGradient(this), mpname || name);	
				}
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
				else {
					switch(name) {
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
						case 'translate' : {
							this.context.translate && this.context.translate(styleValue.x, styleValue.y);
							break;
						}
						case 'rotation' : {	
							if(!styleValue.angle) break;							
							let tranX = 0;
							let tranY = 0;
							if(styleValue.point) {
								let bounds = this.absoluteBounds ? this.absoluteBounds : this.getAbsoluteBounds();
								styleValue = this.getRotation(styleValue);
								
								tranX = styleValue.rotateX + bounds.left;
								tranY = styleValue.rotateY + bounds.top;	
							}
												
							if(tranX != 0 || tranY != 0) this.context.translate && this.context.translate(tranX, tranY);
							this.context.rotate(styleValue.angle);
							if(tranX != 0 || tranY != 0) this.context.translate && this.context.translate(-tranX, -tranY);
							break;
						}
						case 'transform' : {
							if(Array.isArray(styleValue)) {
								this.context.transform.apply(this.context, styleValue);
							}
							else if(typeof styleValue == 'object') {
								this.context.transform(styleValue.scaleX,
								styleValue.skewX,
								styleValue.skewY,
								styleValue.scaleY,
								styleValue.offsetX,
								styleValue.offsetY);
							}								
							break;
						}
						case 'cursor' : {
							this.cursor = styleValue;
							break;
						}
					}							
				}
			}
		}	

		if(this.translate) {
			__setStyle(this.translate, 'translate');
		}
		if(this.transform) {
			__setStyle(this.transform, 'transform');
		}
		
		for(let k in style) {
			if(k === 'constructor') continue;
			let t = typeof style[k];
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
		if(this.bounds && !isReset) return this.bounds;

		let rect = {};
		
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
			for(let i in this.points) {
				let p = this.points[i];
				if(typeof rect.left === 'undefined' || rect.left > p.x) {
					rect.left = p.x;
				}
				if(typeof rect.top === 'undefined' || rect.top > p.y) {
					rect.top = p.y;
				}

				if(typeof rect.right === 'undefined' || rect.right < p.x) {
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
		return this.bounds = rect;
	}

	/**
	 * 获取当前控件的位置相关参数
	 * 解析百分比和margin参数
	 *
	 * @method getLocation
	 * @return {object} 当前控件位置参数，包括中心点坐标，右上角坐标，宽高
	 */
	getLocation(clone = true) {
		let local = this.location = {left: 0, top: 0, width: 0, height: 0};
		local.position = typeof this.position == 'function' ? this.position() : jmUtils.clone(this.position);	
		local.center = this.center && typeof this.center === 'function' ? this.center() : jmUtils.clone(this.center);
		local.start = this.start && typeof this.start === 'function' ? this.start() : jmUtils.clone(this.start);
		local.end = this.end && typeof this.end === 'function' ? this.end() : jmUtils.clone(this.end);
		local.radius = this.radius;
		local.width = this.width;
		local.height = this.height;

		let margin = jmUtils.clone(this.style.margin, {});
		margin.left = (margin.left || 0);
		margin.top = (margin.top || 0);
		margin.right = (margin.right || 0);
		margin.bottom = (margin.bottom || 0);
		
		if(local.position) {
			local.left = local.position.x;
			local.top = local.position.y;
		}
		else {
			local.left = margin.left;
			local.top = margin.top;
		}

		if(!this.parent) return local;
		let parentBounds = this.parent.getBounds();	

		if(jmUtils.checkPercent(local.left)) {
			local.left = jmUtils.percentToNumber(local.left) * parentBounds.width;
		}
		if(jmUtils.checkPercent(local.top)) {
			local.top = jmUtils.percentToNumber(local.top) * parentBounds.height;
		}
		
		if(jmUtils.checkPercent(local.width)) {
			local.width = jmUtils.percentToNumber(local.width) * parentBounds.width;
		}
		if(jmUtils.checkPercent(local.height)) {
			local.height = jmUtils.percentToNumber(local.height) * parentBounds.height;
		}
		
		if(local.center) {
			if(jmUtils.checkPercent(local.center.x)) {
				local.center.x = jmUtils.percentToNumber(local.center.x) * parentBounds.width;
			}
			if(jmUtils.checkPercent(local.center.y)) {
				local.center.y = jmUtils.percentToNumber(local.center.y) * parentBounds.height;
			}
		}
		
		if(local.radius) {
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
	getRotation(rotation) {
		rotation = rotation || this.style.rotation;
		if(!rotation) {
			//如果本身没有，则可以继承父级的
			rotation = this.parent && this.parent.getRotation?this.parent.getRotation():null;
			//如果父级有旋转，则把坐标转换为当前控件区域
			if(rotation) {
				let bounds = this.getBounds();
				rotation.rotateX -= bounds.left;
				rotation.rotateY -= bounds.top;
			}
		}
		else {
			let bounds = this.getBounds();
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
		trans = trans === false ? false : true;	
		let local = this.getLocation(true);		
		let offseted = false;
		
		if(local.position) {
			local.left += x;
			local.top += y;
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
			let p = typeof this.cpoints == 'function' ? this.cpoints : this.cpoints;
			if(p) {			
				let len = p.length;
				for(let i = 0; i < len; i++) {
					p[i].x += x;
					p[i].y += y;
				}		
				offseted = true;
			}			
		}
		
		if(offseted == false && this.points) {
			let len = this.points.length;
			for(let i = 0; i < len; i++) {
				this.points[i].x += x;
				this.points[i].y += y;
			}
			offseted = true;
		}
		
		this.emit('move', {
			offsetX: x,
			offsetY: y,
			trans: trans,
			evt: evt
		});

		this.needUpdate = true;
	}

	/**
	 * 把图形旋转一个角度
	 * @param {number} angle 旋转角度
	 * @param {object} point 旋转坐标，可以是百分比,例如：{x: '50%',y: '50%'}
	 */
	rotate(angle, point) {	
		this.style.rotation = {
			angle: angle,
			point: point
		};

		this.needUpdate = true;
	}

	getAbsoluteBounds() {
		let rec = this.getBounds();
		if(this.parent && this.parent.absoluteBounds) {
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

	beginDraw() {	
		this.getLocation(true);
		this.context.beginPath && this.context.beginPath();		
		if(this.webglControl && this.webglControl.beginDraw) this.webglControl.beginDraw();
	}

	endDraw() {
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

	draw() {	
		if(this.points && this.points.length > 0) {
			const bounds = this.parent && this.parent.absoluteBounds ? this.parent.absoluteBounds : this.absoluteBounds;
			if(this.webglControl) {
				this.webglControl.setParentBounds(bounds);
				this.webglControl.draw([
					...this.points
				]);
			}
			else if(this.context && this.context.moveTo) {
				this.context.moveTo(this.points[0].x + bounds.left, this.points[0].y + bounds.top);
				let len = this.points.length;			
				for(let i = 1; i < len; i++) {
					let p = this.points[i];
					if(p.m) {
						this.context.moveTo(p.x + bounds.left, p.y + bounds.top);
					}
					else {
						this.context.lineTo(p.x + bounds.left, p.y + bounds.top);
					}			
				}	
			}	
		}	
	}

	paint(v) {
		if(v !== false && this.visible !== false) {		
			if(this.initPoints) this.initPoints();
			
			this.bounds = null;
			this.absoluteBounds = this.getAbsoluteBounds();
			let needDraw = true;
			
			if(!this.is('jmGraph') && this.graph) {
				if(this.absoluteBounds.left >= this.graph.width) needDraw = false;
				else if(this.absoluteBounds.top >= this.graph.height) needDraw = false;
				else if(this.absoluteBounds.right <= 0) needDraw = false;
				else if(this.absoluteBounds.bottom <= 0) needDraw = false;
			}
			
			this.context.save && this.context.save();

			this.emit('beginDraw', this);
			
			this.setStyle();

			if(needDraw && this.beginDraw) this.beginDraw();
			if(needDraw && this.draw) this.draw();	
			if(needDraw && this.endDraw) this.endDraw();

			if(this.children) {
				this.children.each(function(i, item) {
					if(item && item.paint) item.paint();
				});
			}

			this.emit('endDraw', this);	
			this.context.restore && this.context.restore();
			
			this.needUpdate = false;
		}
	}

	getEvent(name) {		
		return this.__events ? this.__events[name] : null;
	}

	bind(name, handle) {	
		if(name && name.indexOf(' ') > -1) {
			name = name.split(' ');
			for(let n of name) {
				n && this.bind(n, handle);
			}
			return;
		}	
		
		function _setEvent(name, events) {
			if(!this.__events) this.__events = {};
			return this.__events[name] = events;
		}
		
		let eventCollection = this.getEvent(name) || _setEvent.call(this, name, new jmList());
		if(!eventCollection.contain(handle)) {
			eventCollection.add(handle);
		}
	}

	unbind(name, handle) {	
		if(name && name.indexOf(' ') > -1) {
			name = name.split(' ');
			for(let n of name) {
				n && this.unbind(n, handle);
			}
			return;
		}	
		let eventCollection = this.getEvent(name);		
		if(eventCollection) {
			if(handle) eventCollection.remove(handle);
			else eventCollection.clear();
		}
	}

	emit(...args) {			
		this.runEventHandle(args[0], args.slice(1));
		return this;
	}

	runEventHandle(name, args) {
		let events = this.getEvent(name);		
		if(events) {
			let self = this;
			if(!Array.isArray(args)) args = [args];	
			events.each(function(i, handle) {
				if(false === handle.apply(self, args)) {
					args.cancel = true;
				}
			});		
		}	
		return args.cancel;
	}

	checkPoint(p, pad) {
		if(this.type == 'jmGraph') {
			let position = this.getPosition();
			const right = position.left + this.width;
			const bottom = position.top + this.height;
			if(p.pageX > right || p.pageX < position.left) {
				return false;
			}
			if(p.pageY > bottom || p.pageY < position.top) {
				return false;
			}	
			return true;
		}
		
		let bounds = this.getBounds();	
		let rotation = this.getRotation();
		let ps = this.points;
		
		if(!ps || !ps.length) {
			ps = [];
			ps.push({x: bounds.left, y: bounds.top});
			ps.push({x: bounds.right, y: bounds.top});
			ps.push({x: bounds.right, y: bounds.bottom});
			ps.push({x: bounds.left, y: bounds.bottom});
			ps.push({x: bounds.left, y: bounds.top});
		}
		
		pad = Number(pad || this.style['touchPadding'] || this.style['lineWidth'] || 1);
		if(ps && ps.length) {
			
			if(rotation && rotation.angle != 0) {
				ps = jmUtils.clone(ps, true);
				ps = jmUtils.rotatePoints(ps, {
					x: rotation.rotateX + bounds.left,
					y: rotation.rotateY + bounds.top
				}, rotation.angle);
			}
			
			if(ps.length > 2 && (!this.style['fill'] || this.style['stroke'])) {
				let i = 0;
				let count = ps.length;
				for(let j = i+1; j <= count; j = (++i + 1)) {
					if(j == count) {
						if(this.style.close) {
							let r = jmUtils.pointInPolygon(p, [ps[i], ps[0]], pad);
							if(r) return true;
						}
					} 
					else {
						let s = jmUtils.pointInPolygon(p, [ps[i], ps[j]], pad);
						if(s) return true;
					}			
				}
				if(!this.style['fill']) return false;
			}

			let r = jmUtils.pointInPolygon(p, ps, pad);		
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


	raiseEvent(name, args) {
		if(this.visible === false) return;	
		
		if(!args.position) {		
			const graph = this.graph;
			const srcElement = args.srcElement || args.target;			
			const position = jmUtils.getEventPosition(args, graph.scaleSize);
		
			args = {
				position: position,
				button: args.button == 0 || position.isTouch ? 1 : args.button,
				keyCode: args.keyCode || args.charCode || args.which,
				ctrlKey: args.ctrlKey,
				cancel : false,
				event: args,
				srcElement : srcElement
			};		
		}
		
		args.path = args.path || [];

		let stoped = false;
		if(this.children) {
			this.children.each(function(j, el) {
				if(args.cancel !== true) {
					stoped = el.raiseEvent(name, args) === false ? true : stoped;
					if(stoped) return false;
				}
			}, true);
		}
		
		if(stoped) return false;
		
		let abounds = this.parent && this.parent.absoluteBounds ? this.parent.absoluteBounds : this.absoluteBounds;
		if(!abounds) return false;	
		
		args.position.x = args.position.offsetX - abounds.left;
		args.position.y = args.position.offsetY - abounds.top;

		const inpos = this.interactive !== false && this.checkPoint(args.position);
		
		if(inpos) {
			if(!args.target) {
				args.target = this;
			}
			
			this.runEventAndPopEvent(name, args);

			if(!this.focused && (name === 'mousemove' || name === 'touchmove')) {
				this.focused = true;
				this.raiseEvent(name === 'mousemove' ? 'mouseover' : 'touchover', args);
			}	
		}
		else {
			if(this.interactive !== false && !inpos &&
				this.focused && 
				(name === 'mousemove' || name === 'touchmove')) {

				this.focused = false;
				this.runEventHandle(name === 'mousemove' ? 'mouseleave' : 'touchleave', args);
			}	
		}
			
		return args.cancel === false;
	}

	runEventAndPopEvent(name, args) {	

		if(args.cancel !== true) {
			args.path.push(this);
			this.runEventHandle(name, args);
		}
	}

	clearEvents(name) {
		let eventCollection = this.getEvent(name);		
		if(eventCollection) {
			eventCollection.clear;
		}
	}

	findParent(type) {
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

	canMove(m, graph) {
		if(!this.__mvMonitor) {
			this.__mvMonitor = {};
			this.__mvMonitor.mouseDown = false;
			this.__mvMonitor.curposition = {x: 0, y: 0};
			var self = this;
			
			this.__mvMonitor.mv = function(evt) {
				let _this = self;

				if(_this.__mvMonitor.mouseDown) {
					_this.parent.bounds = null;
					let parentbounds = _this.parent.getAbsoluteBounds();		
					let offsetx = evt.position.offsetX - _this.__mvMonitor.curposition.x;
					let offsety = evt.position.offsetY - _this.__mvMonitor.curposition.y;				
					
					if(_this.lockSide) {
						let thisbounds = _this.bounds || _this.getAbsoluteBounds();					
						let outside = jmUtils.checkOutSide(parentbounds, thisbounds, {x: offsetx, y: offsety});
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
					}
					return false;
				}
			}
			
			this.__mvMonitor.mu = function(evt) {
				let _this = self;
				if(_this.__mvMonitor.mouseDown) {
					_this.__mvMonitor.mouseDown = false;
					_this.emit('moveend', {position: _this.__mvMonitor.curposition});	
				}			
			}
			
			this.__mvMonitor.ml = function() {
				let _this = self;
				if(_this.__mvMonitor.mouseDown) {
					_this.__mvMonitor.mouseDown = false;
					_this.emit('moveend', {position: _this.__mvMonitor.curposition});
					return false;
				}	
			}
			
			this.__mvMonitor.md = function(evt) {
				
				if(this.__mvMonitor.mouseDown) return;
				if(evt.button == 0 || evt.button == 1) {
					this.__mvMonitor.mouseDown = true;
					this.__mvMonitor.curposition.x = evt.position.offsetX;
					this.__mvMonitor.curposition.y = evt.position.offsetY;
					this.emit('movestart', {position: this.__mvMonitor.curposition});
					
					evt.cancel = true;
					return false;
				}			
			}
		}
		
		graph = graph || this.graph;
		
		if(m !== false) {			
			graph.bind('mousemove', this.__mvMonitor.mv);
			graph.bind('mouseup', this.__mvMonitor.mu);
			graph.bind('mouseleave', this.__mvMonitor.ml);
			this.bind('mousedown', this.__mvMonitor.md);
			graph.bind('touchmove', this.__mvMonitor.mv);
			graph.bind('touchend', this.__mvMonitor.mu);
			this.bind('touchstart', this.__mvMonitor.md);
		}
		else {			
			graph.unbind('mousemove', this.__mvMonitor.mv);
			graph.unbind('mouseup', this.__mvMonitor.mu);
			graph.unbind('mouseleave', this.__mvMonitor.ml);
			this.unbind('mousedown', this.__mvMonitor.md);
			graph.unbind('touchmove', this.__mvMonitor.mv);
			graph.unbind('touchend', this.__mvMonitor.mu);
			this.unbind('touchstart', this.__mvMonitor.md);	
		}
		return this;
	}
};

export { jmControl };
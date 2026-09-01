/**
 * @fileoverview jmEvents 事件处理系统
 * 
 * jmEvents 是 jmGraph 库的事件处理模块，负责管理所有用户交互事件。
 * 包括鼠标事件、触摸事件和键盘事件的绑定、分发和销毁。
 * 
 * 主要功能：
 * - 鼠标事件：mousedown, mousemove, mouseup, click, dblclick 等
 * - 触摸事件：touchstart, touchmove, touchend, touchcancel, tap
 * - 键盘事件：keydown, keyup, keypress
 * - 事件冒泡和委托机制
 * 
 * @module jmEvents
 * @author jmGraph Team
 * @license MIT
 */

import {jmUtils} from "./jmUtils.js";

/**
 * jmEvents 事件处理类
 * 
 * 统一管理画布上的所有交互事件，包括鼠标、触摸和键盘事件。
 * 支持事件冒泡机制，可以将事件传递给子控件处理。
 * 
 * @class jmEvents
 * 
 * @param {jmGraph} container jmGraph 实例
 * @param {HTMLElement} target 事件目标元素（通常是 canvas 元素）
 * 
 * @example
 * // 通常由 jmGraph 内部创建，不需要手动实例化
 * const events = new jmEvents(graph, canvasElement);
 */
export default class jmEvents {

	/**
	 * 构造函数
	 * 
	 * @param {jmGraph} container jmGraph 实例
	 * @param {HTMLElement} target 事件目标元素
	 */
	constructor(container, target) {
		/**
		 * jmGraph 实例
		 * @type {jmGraph}
		 */
		this.container = container;
		/**
		 * 事件目标元素
		 * @type {HTMLElement}
		 */
		this.target = target || container;
		/**
		 * 鼠标事件处理器
		 * @type {jmMouseEvent}
		 */
		this.mouseHandler = new jmMouseEvent(this, container, target);
		/**
		 * 键盘事件处理器
		 * @type {jmKeyEvent}
		 */
		this.keyHandler = new jmKeyEvent(this, container, target);
	}

	/**
	 * 触摸开始事件处理
	 * 
	 * @method touchStart
	 * @param {TouchEvent} evt 触摸事件对象
	 * @return {boolean} 如果事件目标为画布本身则返回 false
	 */
	touchStart(evt) {
		evt = evt || window.event;
		evt.eventName = 'touchstart';
		this.container.raiseEvent('touchstart',evt);
		const t = evt.target || evt.srcElement;
		if(t == this.target) {
			return false;
		}
	};

	/**
	 * 触摸移动事件处理
	 * 
	 * @method touchMove
	 * @param {TouchEvent} evt 触摸事件对象
	 * @return {boolean} 如果事件目标为画布本身则返回 false
	 */
	touchMove(evt) {
		evt = evt || window.event;
		evt.eventName = 'touchmove';
		this.container.raiseEvent('touchmove',evt);
		const t = evt.target || evt.srcElement;
		if(t == this.target) {
			return false;
		}
	};

	/**
	 * 触摸结束事件处理
	 * 
	 * @method touchEnd
	 * @param {TouchEvent} evt 触摸事件对象
	 * @return {boolean} 如果事件目标为画布本身则返回 false
	 */
	touchEnd(evt) {
		evt = evt || window.event;
		evt.eventName = 'touchend';
		
		this.container.raiseEvent('touchend',evt);
		const t = evt.target || evt.srcElement;
		if(t == this.target) {
			return false;
		}
	};

	/**
	 * 触摸取消事件处理
	 * 
	 * @method touchCancel
	 * @param {TouchEvent} evt 触摸事件对象
	 * @return {boolean} 如果事件目标为画布本身则返回 false
	 */
	touchCancel(evt) {
		evt = evt || window.event;
		evt.eventName = 'touchcancel';
		
		this.container.raiseEvent('touchcancel',evt);
		const t = evt.target || evt.srcElement;
		if(t == this.target) {
			return false;
		}
	};

	/**
	 * 轻触事件处理
	 * 
	 * @method tap
	 * @param {Event} evt 事件对象
	 * @return {boolean} 如果事件目标为画布本身则返回 false
	 */
	tap(evt) {
		evt = evt || window.event;
		evt.eventName = 'tap';
		
		this.container.raiseEvent('tap',evt);
		const t = evt.target || evt.srcElement;
		if(t == this.target) {
			return false;
		}
	};

	/**
	 * 销毁事件处理器
	 * 
	 * 移除所有绑定的事件监听器，释放资源。
	 * 
	 * @method destroy
	 */
	destroy() {
		this.mouseHandler.destroy();
		this.keyHandler.destroy();
	}
}

/**
 * 鼠标事件处理器
 * 
 * @class jmMouseEvent
 * @private
 */
class jmMouseEvent {
	/**
	 * 构造函数
	 * 
	 * @param {jmEvents} instance jmEvents 实例
	 * @param {jmGraph} container jmGraph 实例
	 * @param {HTMLElement} target 事件目标元素
	 */
	constructor(instance, container, target) {
		this.instance = instance;
		this.container = container;
		this.target = target || container;

		/**
		 * 已绑定的事件映射表
		 * @type {Object}
		 */
		this.eventEvents = {};

		this.init(instance, container, target);
	}
	
	/**
	 * 初始化鼠标事件绑定
	 * 
	 * @method init
	 * @private
	 * @param {jmEvents} instance jmEvents 实例
	 * @param {jmGraph} container jmGraph 实例
	 * @param {HTMLElement} target 事件目标元素
	 */
	init(instance, container, target) {
		const canvas = this.target;
		const doc = typeof document != 'undefined'? document: null;

		this.eventEvents['mousedown'] = jmUtils.bindEvent(this.target,'mousedown',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'mousedown';
			container.raiseEvent('mousedown',evt);
		});
		
		this.eventEvents['mousemove'] = jmUtils.bindEvent(this.target,'mousemove',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'mousemove';
			const target = evt.target || evt.srcElement;
			if(target == canvas) {
				container.raiseEvent('mousemove',evt);
				if(evt.preventDefault) evt.preventDefault();
				return false;
			}
		});
		
		this.eventEvents['mouseover'] = jmUtils.bindEvent(this.target,'mouseover',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'mouseover';
			container.raiseEvent('mouseover',evt);
		});
		this.eventEvents['mouseleave'] = jmUtils.bindEvent(this.target,'mouseleave',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'mouseleave';
			container.raiseEvent('mouseleave',evt);
		});
		this.eventEvents['mouseout'] = jmUtils.bindEvent(this.target,'mouseout',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'mouseout';
			container.raiseEvent('mouseout',evt);
		});
		doc && (this.eventEvents['mouseup'] = jmUtils.bindEvent(doc,'mouseup',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'mouseup';
			const r = container.raiseEvent('mouseup',evt);
			if(r === false) {
				if(evt.preventDefault) evt.preventDefault();
				return false;
			}
		}));
		
		this.eventEvents['wheel'] = jmUtils.bindEvent(this.target,'wheel',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'wheel';
			const r = container.raiseEvent('wheel',evt);
			if(r === false) {
				if(evt.preventDefault) evt.preventDefault();
				return false;
			}
		},{ passive: false });

		this.eventEvents['dblclick'] = jmUtils.bindEvent(this.target,'dblclick',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'dblclick';
			container.raiseEvent('dblclick',evt);
		});
		this.eventEvents['click'] = jmUtils.bindEvent(this.target,'click',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'click';
			container.raiseEvent('click',evt);
		});

		doc && (this.eventEvents['resize'] = jmUtils.bindEvent(doc,'resize',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'resize';
			return container.raiseEvent('resize',evt);
		}));

		this.eventEvents['touchstart'] = jmUtils.bindEvent(this.target,'touchstart', function(evt) {
			evt.eventName = 'touchstart';
			return instance.touchStart(evt);
		},{ passive: false });

		this.eventEvents['touchmove'] = jmUtils.bindEvent(this.target,'touchmove', function(evt) {
			evt.eventName = 'touchmove';
			return instance.touchMove(evt);
		},{ passive: false });

		doc && (this.eventEvents['touchend'] = jmUtils.bindEvent(doc,'touchend', function(evt) {
			evt.eventName = 'touchend';
			return instance.touchEnd(evt);
		},{ passive: false }));

		doc && (this.eventEvents['touchcancel'] = jmUtils.bindEvent(doc,'touchcancel', function(evt) {
			evt.eventName = 'touchcancel';
			return instance.touchCancel(evt);
		},{ passive: false }));
	}

	/**
	 * 销毁鼠标事件处理器
	 * 
	 * 移除所有绑定的鼠标事件监听器。
	 * 
	 * @method destroy
	 */
	destroy() {
		for(const name in this.eventEvents) {
			const event = this.eventEvents[name];
			if(!event || !event.fun) continue;
			jmUtils.removeEvent(event.target, name, event.fun);
		}
	}
}

/**
 * 键盘事件处理器
 * 
 * @class jmKeyEvent
 * @private
 */
class jmKeyEvent {
	/**
	 * 构造函数
	 * 
	 * @param {jmEvents} instance jmEvents 实例
	 * @param {jmGraph} container jmGraph 实例
	 * @param {HTMLElement} target 事件目标元素
	 */
	constructor(instance, container,target) {
		this.instance = instance;
		this.container = container;
		this.target = target || container;

		/**
		 * 已绑定的事件映射表
		 * @type {Object}
		 */
		this.eventEvents = {};

		this.init(container, target);
	}

	/**
	 * 初始化键盘事件绑定
	 * 
	 * @method init
	 * @private
	 * @param {jmGraph} container jmGraph 实例
	 * @param {HTMLElement} target 事件目标元素
	 */
	init(container, target) {
		const doc = typeof document != 'undefined'? document: null;

		const checkKeyEvent = (evt) => {
			const target = evt.srcElement || evt.target;
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

		doc && (this.eventEvents['keypress'] = jmUtils.bindEvent(doc,'keypress',function(evt) {
			evt = evt || window.event;
			if(!checkKeyEvent(evt)) return;
			const r = container.raiseEvent('keypress',evt);
			if(r === false && evt.preventDefault) 
				evt.preventDefault();
			return r;
		}));
		doc && (this.eventEvents['keydown'] = jmUtils.bindEvent(doc,'keydown',function(evt) {
			evt = evt || window.event;
			if(!checkKeyEvent(evt)) return;
			const r = container.raiseEvent('keydown',evt);
			if(r === false && evt.preventDefault) 
				evt.preventDefault();
			return r;
		}));
		doc && (this.eventEvents['keyup'] = jmUtils.bindEvent(doc,'keyup',function(evt) {
			evt = evt || window.event;
			if(!checkKeyEvent(evt)) return;
			const r = container.raiseEvent('keyup',evt);
			if(r === false && evt.preventDefault) 
				evt.preventDefault();
			return r;
		}));
	}

	destroy() {
		for(const name in this.eventEvents) {
			const event = this.eventEvents[name];
			if(!event || !event.fun) continue;
			jmUtils.removeEvent(event.target, name, event.fun);
		}
	}
}

export { jmEvents };

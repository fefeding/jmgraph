import {jmUtils} from "./jmUtils.js";
/**
 * 事件模型
 *
 * @class jmEvents
 * @for jmGraph
 */
class jmEvents {

	constructor(container, target) {
		this.container = container;
		this.target = target || container;
		this.mouseHandler = new jmMouseEvent(this, container, target);
		this.keyHandler = new jmKeyEvent(this, container, target);
	}

	touchStart(evt) {
		evt = evt || window.event;
		this.container.raiseEvent('touchstart',evt);
		let t = evt.target || evt.srcElement;
		if(t == this.target) {
			//if(evt.preventDefault) evt.preventDefault();
			return false;
		}
	};

	touchMove(evt) {
		evt = evt || window.event;
		this.container.raiseEvent('touchmove',evt);
		let t = evt.target || evt.srcElement;
		if(t == this.target) {
			//if(evt.preventDefault) evt.preventDefault();
			return false;
		}
	};

	touchEnd(evt) {
		evt = evt || window.event;
		
		this.container.raiseEvent('touchend',evt);
		let t = evt.target || evt.srcElement;
		if(t == this.target) {
			//if(evt.preventDefault) evt.preventDefault();
			return false;
		}
	};

	touchCancel(evt) {
		evt = evt || window.event;
		
		this.container.raiseEvent('touchcancel',evt);
		let t = evt.target || evt.srcElement;
		if(t == target) {
			//if(evt.preventDefault) evt.preventDefault();
			return false;
		}
	};
}

/**
 * 鼠标事件处理对象，container 为事件主体，target为响应事件对象
 */
class jmMouseEvent {
	constructor(instance, container, target) {
		this.instance = instance;
		this.container = container;
		this.target = target || container;

		this.init(instance, container, target);
	}
	
	init(instance, container, target) {
		let canvas = this.target;	
		let doc = typeof typeof document != 'undefined'?document:null;
		//禁用鼠标右健系统菜单
		//canvas.oncontextmenu = function() {
		//	return false;
		//};

		jmUtils.bindEvent(this.target,'mousedown',function(evt) {
			evt = evt || window.event;
			let r = container.raiseEvent('mousedown',evt);
			//if(r === false) {
				//if(evt.preventDefault) evt.preventDefault();
				//return false;
			//}				
		});
		
		doc && jmUtils.bindEvent(doc,'mousemove',function(evt) {	
			evt = evt || window.event;		
			let target = evt.target || evt.srcElement;
			if(target == canvas) {
				let r = container.raiseEvent('mousemove',evt);
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
		doc && jmUtils.bindEvent(doc,'mouseup',function(evt) {
			evt = evt || window.event;
			//let target = evt.target || evt.srcElement;
			//if(target == canvas) {						
				let r = container.raiseEvent('mouseup',evt);
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

		doc && jmUtils.bindEvent(doc,'resize',function(evt) {
			evt = evt || window.event;
			return container.raiseEvent('resize',evt);
		});

		// passive: false 为了让浏览器不告警并且preventDefault有效
		// 另一种处理：touch-action: none; 这样任何触摸事件都不会产生默认行为，但是 touch 事件照样触发。
		doc && jmUtils.bindEvent(doc,'touchstart', function(evt) {
			return instance.touchStart(evt);
		},{ passive: false });

		doc && jmUtils.bindEvent(doc,'touchmove', function(evt) {
			return instance.touchMove(evt);
		},{ passive: false });

		doc && jmUtils.bindEvent(doc,'touchend', function(evt) {
			return instance.touchEnd(evt);
		},{ passive: false });

		doc && jmUtils.bindEvent(doc,'touchcancel', function(evt) {
			return instance.touchCancel(evt);
		},{ passive: false });
	}
}

/**
 * 健盘事件处理对象，container 为事件主体，target为响应事件对象
 */
class jmKeyEvent {
	constructor(instance, container,target) {
		this.instance = instance;
		this.container = container;
		this.target = target || container;

		this.init(container, target);
	}

	/**
	 * 初始化健盘事件
	 */
	init(container, target) {
		let doc = typeof typeof document != 'undefined'?document:null;
		/**
		 * 检查是否触发健盘事件至画布
		 * 如果触发对象为输入框等对象则不响应事件
		 *  
		 */
		let checkKeyEvent = (evt) => {
			let target = evt.srcElement || evt.target;
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

		doc && jmUtils.bindEvent(doc,'keypress',function(evt) {
			evt = evt || window.event;
			if(!checkKeyEvent(evt)) return;//如果事件为其它输入框，则不响应
			let r = container.raiseEvent('keypress',evt);
			if(r === false && evt.preventDefault) 
				evt.preventDefault();
			return r;
		});
		doc && jmUtils.bindEvent(doc,'keydown',function(evt) {
			evt = evt || window.event;
			if(!checkKeyEvent(evt)) return;//如果事件为其它输入框，则不响应
			let r = container.raiseEvent('keydown',evt);
			if(r === false && evt.preventDefault) 
				evt.preventDefault();
			return r;
		});
		doc && jmUtils.bindEvent(doc,'keyup',function(evt) {
			evt = evt || window.event;
			if(!checkKeyEvent(evt)) return;//如果事件为其它输入框，则不响应
			let r = container.raiseEvent('keyup',evt);
			if(r === false && evt.preventDefault) 
				evt.preventDefault();
			return r;
		});			
	}
}

export { jmEvents };

import jmUtils from "./jmUtils";
/**
 * 事件模型
 *
 * @class jmEvents
 * @module jmGraph
 * @for jmGraph
 */
class jmEvents {
	/**
	 * 鼠标事件勾子
	 *
	 * @property mouseHandler
	 * @type {class}
	 */
	mouseHandler;
	/**
	 * 健盘事件勾子
	 *
	 * @property keyHandler
	 * @type {class}
	 */
	keyHandler;

	constructor(container,target) {
		this.mouseHandler = new mouseEvent(container,target);
		this.keyHandler = new keyEvent(container,target);
	}

	touchStart(evt) {
		evt = evt || window.event;
		container.raiseEvent('touchstart',evt);
		let t = evt.target || evt.srcElement;
		if(t == target) {
			if(evt.preventDefault) evt.preventDefault();
			return false;
		}
	};

	touchMove(evt) {
		evt = evt || window.event;
		container.raiseEvent('touchmove',evt);
		let t = evt.target || evt.srcElement;
		if(t == target) {
			if(evt.preventDefault) evt.preventDefault();
			return false;
		}
	};

	touchEnd(evt) {
		evt = evt || window.event;
		
		container.raiseEvent('touchend',evt);
		let t = evt.target || evt.srcElement;
		if(t == target) {
			if(evt.preventDefault) evt.preventDefault();
			return false;
		}
	};

	touchCancel(evt) {
		evt = evt || window.event;
		
		container.raiseEvent('touchcancel',evt);
		let t = evt.target || evt.srcElement;
		if(t == target) {
			if(evt.preventDefault) evt.preventDefault();
			return false;
		}
	};
}

/**
 * 鼠标事件处理对象，container 为事件主体，target为响应事件对象
 */
class mouseEvent {
	constructor(container, target) {
		this.container = container;
		this.target = target || container;

		this.init();
	}
	
	init() {
		let canvas = this.target;	
		let hasDocment = typeof document != 'undefined';
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
		
		hasDocment && jmUtils.bindEvent(document,'mousemove',function(evt) {	
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
		hasDocment && jmUtils.bindEvent(document,'mouseup',function(evt) {
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

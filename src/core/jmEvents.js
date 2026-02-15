import {jmUtils} from "./jmUtils.js";

export default class jmEvents {

	constructor(container, target) {
		this.container = container;
		this.target = target || container;
		this.mouseHandler = new jmMouseEvent(this, container, target);
		this.keyHandler = new jmKeyEvent(this, container, target);
	}

	touchStart(evt) {
		evt = evt || window.event;
		evt.eventName = 'touchstart';
		this.container.raiseEvent('touchstart', evt);
		let t = evt.target || evt.srcElement;
		if(t == this.target) {
			return false;
		}
	};

	touchMove(evt) {
		evt = evt || window.event;
		evt.eventName = 'touchmove';
		this.container.raiseEvent('touchmove', evt);
		let t = evt.target || evt.srcElement;
		if(t == this.target) {
			return false;
		}
	};

	touchEnd(evt) {
		evt = evt || window.event;
		evt.eventName = 'touchend';
		
		this.container.raiseEvent('touchend', evt);
		let t = evt.target || evt.srcElement;
		if(t == this.target) {
			return false;
		}
	};

	touchCancel(evt) {
		evt = evt || window.event;
		evt.eventName = 'touchcancel';
		
		this.container.raiseEvent('touchcancel', evt);
		let t = evt.target || evt.srcElement;
		if(t == this.target) {
			return false;
		}
	};

	destroy() {
		this.mouseHandler.destroy();
		this.keyHandler.destroy();
	}
}

class jmMouseEvent {
	constructor(instance, container, target) {
		this.instance = instance;
		this.container = container;
		this.target = target || container;

		this.eventEvents = {};

		this.init(instance, container, target);
	}
	
	init(instance, container, target) {
		let canvas = this.target;	
		let doc = typeof document != 'undefined' ? document : null;

		this.eventEvents['mousedown'] = jmUtils.bindEvent(this.target, 'mousedown', function(evt) {
			evt = evt || window.event;
			evt.eventName = 'mousedown';
			let r = container.raiseEvent('mousedown', evt);
		});
		
		this.eventEvents['mousemove'] = jmUtils.bindEvent(this.target, 'mousemove', function(evt) {	
			evt = evt || window.event;		
			evt.eventName = 'mousemove';
			let target = evt.target || evt.srcElement;
			if(target == canvas) {
				let r = container.raiseEvent('mousemove', evt);
				if(evt.preventDefault) evt.preventDefault();
				return false;
			}				
		});
		
		this.eventEvents['mouseover'] = jmUtils.bindEvent(this.target, 'mouseover', function(evt) {
			evt = evt || window.event;	
			evt.eventName = 'mouseover';
			container.raiseEvent('mouseover', evt);
		});
		
		this.eventEvents['mouseleave'] = jmUtils.bindEvent(this.target, 'mouseleave', function(evt) {
			evt = evt || window.event;	
			evt.eventName = 'mouseleave';
			container.raiseEvent('mouseleave', evt);
		});			
		
		this.eventEvents['mouseout'] = jmUtils.bindEvent(this.target, 'mouseout', function(evt) {
			evt = evt || window.event;	
			evt.eventName = 'mouseout';
			container.raiseEvent('mouseout', evt);
		});
		
		doc && (this.eventEvents['mouseup'] = jmUtils.bindEvent(doc, 'mouseup', function(evt) {
			evt = evt || window.event;	
			evt.eventName = 'mouseup';
			let r = container.raiseEvent('mouseup', evt);
			if(r === false) {
				if(evt.preventDefault) evt.preventDefault();
				return false;
			}					
		}));
		
		this.eventEvents['dblclick'] = jmUtils.bindEvent(this.target, 'dblclick', function(evt) {
			evt = evt || window.event;
			evt.eventName = 'dblclick';
			container.raiseEvent('dblclick', evt);
		});
		
		this.eventEvents['click'] = jmUtils.bindEvent(this.target, 'click', function(evt) {
			evt = evt || window.event;
			evt.eventName = 'click';
			container.raiseEvent('click', evt);
		});

		doc && (this.eventEvents['resize'] = jmUtils.bindEvent(doc, 'resize', function(evt) {
			evt = evt || window.event;
			evt.eventName = 'resize';
			return container.raiseEvent('resize', evt);
		}));

		this.eventEvents['touchstart'] = jmUtils.bindEvent(this.target, 'touchstart', function(evt) {
			evt.eventName = 'touchstart';
			return instance.touchStart(evt);
		}, { passive: false });

		this.eventEvents['touchmove'] = jmUtils.bindEvent(this.target, 'touchmove', function(evt) {
			evt.eventName = 'touchmove';
			return instance.touchMove(evt);
		}, { passive: false });

		doc && (this.eventEvents['touchend'] = jmUtils.bindEvent(doc, 'touchend', function(evt) {
			evt.eventName = 'touchend';
			return instance.touchEnd(evt);
		}, { passive: false }));

		doc && (this.eventEvents['touchcancel'] = jmUtils.bindEvent(doc, 'touchcancel', function(evt) {
			evt.eventName = 'touchcancel';
			return instance.touchCancel(evt);
		}, { passive: false }));
	}

	destroy() {
		for(let name in this.eventEvents) {
			const event = this.eventEvents[name];
			if(!event || !event.fun) continue;
			jmUtils.removeEvent(event.target, name, event.fun);
		}
	}
}

class jmKeyEvent {
	constructor(instance, container, target) {
		this.instance = instance;
		this.container = container;
		this.target = target || container;

		this.eventEvents = {};

		this.init(container, target);
	}

	init(container, target) {
		let doc = typeof document != 'undefined' ? document : null;
		
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
				|| target.tagName == 'TEXT')) {
				return false;
			}
			return true;
		}

		doc && (this.eventEvents['keypress'] = jmUtils.bindEvent(doc, 'keypress', function(evt) {
			evt = evt || window.event;
			if(!checkKeyEvent(evt)) return;
			let r = container.raiseEvent('keypress', evt);
			if(r === false && evt.preventDefault) 
				evt.preventDefault();
			return r;
		}));
		
		doc && (this.eventEvents['keydown'] = jmUtils.bindEvent(doc, 'keydown', function(evt) {
			evt = evt || window.event;
			if(!checkKeyEvent(evt)) return;
			let r = container.raiseEvent('keydown', evt);
			if(r === false && evt.preventDefault) 
				evt.preventDefault();
			return r;
		}));
		
		doc && (this.eventEvents['keyup'] = jmUtils.bindEvent(doc, 'keyup', function(evt) {
			evt = evt || window.event;
			if(!checkKeyEvent(evt)) return;
			let r = container.raiseEvent('keyup', evt);
			if(r === false && evt.preventDefault) 
				evt.preventDefault();
			return r;
		}));			
	}

	destroy() {
		for(let name in this.eventEvents) {
			const event = this.eventEvents[name];
			if(!event || !event.fun) continue;
			jmUtils.removeEvent(event.target, name, event.fun);
		}
	}
}

export { jmEvents };

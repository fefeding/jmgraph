/**
 * 事件模型
 *
 * @class jmEvents
 * @module jmGraph
 * @for jmGraph
 */

var jmEvents = (function() {	
	var __constructor = function(container,target) {
		this.mouseHandler = new mouseEvent(container,target);
		this.keyHandler = new keyEvent(container,target);
	}

	/**
	* 鼠标事件处理对象，container 为事件主体，target为响应事件对象
	*/
	function mouseEvent(container,target) {
		this.container = container;
		this.target = target || container;
		this.init = function() {
			var canvas = this.target;	
			//禁用鼠标右健系统菜单
			canvas.oncontextmenu = function() {
				return false;
			};

			jmUtils.bindEvent(this.target,'mousedown',function(evt) {
				evt = evt || event;
				container.raiseEvent('mousedown',evt);
				if(evt.preventDefault) evt.preventDefault();
				return false;				
			});
			jmUtils.bindEvent(this.target,'touchstart',function(evt) {
				evt = evt || event;
				//evt.preventDefault();
				container.raiseEvent('touchstart',evt);
			});
			jmUtils.bindEvent(window.document,'mousemove',function(evt) {	
				evt = evt || event;		
				var target = evt.target || evt.srcElement;
				if(target == canvas) {
					container.raiseEvent('mousemove',evt);
				}				
			});
			jmUtils.bindEvent(window.document,'touchmove',function(evt) {
				evt = evt || event;
				//evt.preventDefault();
				container.raiseEvent('touchmove',evt);
			});
			jmUtils.bindEvent(this.target,'mouseover',function(evt) {
				evt = evt || event;
				container.raiseEvent('mouseover',evt);
			});
			jmUtils.bindEvent(this.target,'mouseleave',function(evt) {
				evt = evt || event;
				container.raiseEvent('mouseleave',evt);
			});			
			jmUtils.bindEvent(this.target,'mouseout',function(evt) {
				evt = evt || event;
				container.raiseEvent('mouseout',evt);
			});
			jmUtils.bindEvent(window.document,'mouseup',function(evt) {
				evt = evt || event;
				var target = evt.target || evt.srcElement;
				if(target == canvas) {						
					container.raiseEvent('mouseup',evt);
					if(evt.preventDefault) evt.preventDefault();
					return false;
				}
			});
			jmUtils.bindEvent(this.target,'touchend',function(evt) {
				evt = evt || event;
				//evt.preventDefault();
				container.raiseEvent('touchend',evt);
			});
			jmUtils.bindEvent(this.target,'dblclick',function(evt) {
				evt = evt || event;
				container.raiseEvent('dblclick',evt);
			});
			jmUtils.bindEvent(this.target,'click',function(evt) {
				evt = evt || event;
				container.raiseEvent('click',evt);
			});
		}
		this.init();
	}

	/**
	* 健盘事件处理对象，container 为事件主体，target为响应事件对象
	*/
	function keyEvent(container,target) {
		this.container = container;
		this.target = target || container;
		this.init = function() {
			jmUtils.bindEvent(document,'keypress',function(evt) {
				evt = evt || event;
				var r = container.raiseEvent('keypress',evt);
				if(r === false && evt.preventDefault) 
					evt.preventDefault();
				return r;
			});
			jmUtils.bindEvent(document,'keydown',function(evt) {
				evt = evt || event;
				var r = container.raiseEvent('keydown',evt);
				if(r === false && evt.preventDefault) 
					evt.preventDefault();
				return r;
			});
			jmUtils.bindEvent(document,'keyup',function(evt) {
				evt = evt || event;
				var r = container.raiseEvent('keyup',evt);
				if(r === false && evt.preventDefault) 
					evt.preventDefault();
				return r;
			});
			jmUtils.bindEvent(document,'resize',function(evt) {
				evt = evt || event;
				return container.raiseEvent('resize',evt);
			});
		}
		this.init();
	}

	return __constructor;
})();

/**
 * 事件模型
 *
 * @class jmEvents
 * @module jmGraph
 * @for jmGraph
 */
function jmEvents(container,target) {
	/**
	 * 鼠标事件勾子
	 *
	 * @property mouseHandler
	 * @type {class}
	 */
	this.mouseHandler = new mouseEvent(container,target);

	/**
	 * 健盘事件勾子
	 *
	 * @property keyHandler
	 * @type {class}
	 */
	this.keyHandler = new keyEvent(container,target);
	
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
				var r = container.raiseEvent('mousedown',evt);
				//if(r === false) {
					if(evt.preventDefault) evt.preventDefault();
					return false;
				//}				
			});
			jmUtils.bindEvent(window.document,'touchstart',function(evt) {
				evt = evt || event;
				//evt.preventDefault();
				container.raiseEvent('touchstart',evt);
				if(evt.preventDefault) evt.preventDefault();
				return false;
			});
			jmUtils.bindEvent(window.document,'mousemove',function(evt) {	
				evt = evt || event;		
				var target = evt.target || evt.srcElement;
				if(target == canvas) {
					var r = container.raiseEvent('mousemove',evt);
					//if(r === false) {
						if(evt.preventDefault) evt.preventDefault();
						return false;
					//}		
				}				
			});
			jmUtils.bindEvent(window.document,'touchmove',function(evt) {
				evt = evt || event;
				
				container.raiseEvent('touchmove',evt);
				if(evt.preventDefault) evt.preventDefault();
				return false;
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
				//var target = evt.target || evt.srcElement;
				//if(target == canvas) {						
					var r = container.raiseEvent('mouseup',evt);
					if(r === false) {
						if(evt.preventDefault) evt.preventDefault();
						return false;
					}					
				//}
			});
			jmUtils.bindEvent(window.document,'touchend',function(evt) {
				evt = evt || event;
				
				container.raiseEvent('touchend',evt);
				if(evt.preventDefault) evt.preventDefault();
				return false;
			});
			jmUtils.bindEvent(this.target,'dblclick',function(evt) {
				evt = evt || event;
				container.raiseEvent('dblclick',evt);
			});
			jmUtils.bindEvent(this.target,'click',function(evt) {
				evt = evt || event;
				container.raiseEvent('click',evt);
			});

			jmUtils.bindEvent(document,'resize',function(evt) {
				evt = evt || event;
				return container.raiseEvent('resize',evt);
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
			jmUtils.bindEvent(document,'keypress',function(evt) {
				evt = evt || event;
				if(!checkKeyEvent(evt)) return;//如果事件为其它输入框，则不响应
				var r = container.raiseEvent('keypress',evt);
				if(r === false && evt.preventDefault) 
					evt.preventDefault();
				return r;
			});
			jmUtils.bindEvent(document,'keydown',function(evt) {
				evt = evt || event;
				if(!checkKeyEvent(evt)) return;//如果事件为其它输入框，则不响应
				var r = container.raiseEvent('keydown',evt);
				if(r === false && evt.preventDefault) 
					evt.preventDefault();
				return r;
			});
			jmUtils.bindEvent(document,'keyup',function(evt) {
				evt = evt || event;
				if(!checkKeyEvent(evt)) return;//如果事件为其它输入框，则不响应
				var r = container.raiseEvent('keyup',evt);
				if(r === false && evt.preventDefault) 
					evt.preventDefault();
				return r;
			});			
		}
		this.init();
	}
}

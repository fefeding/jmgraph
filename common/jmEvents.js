/**
* 事件模型
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
			jmUtils.bindEvent(this.target,'mousedown',function(evt) {
				evt = evt || event;
				container.raiseEvent('mousedown',evt);
			});
			jmUtils.bindEvent(this.target,'touchstart',function(evt) {
				evt = evt || event;
				evt.preventDefault();
				container.raiseEvent('touchstart',evt);
			});
			jmUtils.bindEvent(window.document,'mousemove',function(evt) {	
				evt = evt || event;			
				container.raiseEvent('mousemove',evt);
			});
			jmUtils.bindEvent(window.document,'touchmove',function(evt) {
				evt = evt || event;
				evt.preventDefault();
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
			jmUtils.bindEvent(this.target,'mouseup',function(evt) {
				evt = evt || event;
				container.raiseEvent('mouseup',evt);
			});
			jmUtils.bindEvent(this.target,'touchend',function(evt) {
				evt = evt || event;
				evt.preventDefault();
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
			jmUtils.bindEvent(this.target,'keypress',function(evt) {
				container.raiseEvent('keypress',evt);
			});
			jmUtils.bindEvent(this.target,'keydown',function(evt) {
				container.raiseEvent('keydown',evt);
			});
			jmUtils.bindEvent(this.target,'keyup',function(evt) {
				container.raiseEvent('keyup',evt);
			});
			jmUtils.bindEvent(this.target,'resize',function(evt) {
				container.raiseEvent('resize',evt);
			});
		}
		this.init();
	}

	return __constructor;
})();


/**
*基础对象
*/
function jmObject() {

}

/**
* 检 查对象是否为指定类型
*/
jmObject.prototype.is = function(type) {
	return this instanceof type;
}

/**
* 控件动画处理
*/
jmObject.prototype.animate = function(handle,millisec) {	
	if(this.is(jmGraph)) {
		if(handle) {			
			if(!this.animateHandles) this.animateHandles = new jmUtils.list();
			
			var id = jmUtils.guid();
			var params = [];
			if(arguments.length > 2) {
				for(var i=2;i<arguments.length;i++) {
					params.push(arguments[i]);
				}
			}		
			this.animateHandles.add({id:id,millisec:millisec || 20,handle:handle,params:params});
		}
		if(this.animateHandles) {
			if(this.animateHandles.count() > 0) {
				var _this = this;
				//延时处理动画事件
				this.dispatcher = setTimeout(function() {
					var needredraw = false;
					var overduehandles = [];
					var curTimes = new Date().getTime();
					_this.animateHandles.each(function(i,ani) {
						try {
							if(ani && ani.handle && (!ani.times || curTimes - ani.times >= ani.millisec)) {
								var r = ani.handle.apply(_this,ani.params);
								if(r === false) {
									overduehandles.push(ani);//表示已完成的动画效果
								}
								needredraw = true;
								ani.times = curTimes;								
							}
						}
						catch(e) {
							if(window.console && window.console.info) {
								window.console.info(e.toString());
							}
						}
					});
					for(var i in overduehandles) {
						_this.animateHandles.remove(overduehandles[i]);//移除完成的效果
					}
					if(needredraw) {
						_this.redraw();				
					}
					_this.animate();
				},10);//刷新				
			}
		}
	}	
	else {
		var graph = this.findParent(jmGraph);
		if(graph) {
			graph.animate.apply(graph,arguments);
		}
	}
}

/**
* 对象属性管理
*/
var jmProperty = (function(){
	function __contructor() {
		this.__properties = {};
		this.__eventHandles = {};
	}

	jmUtils.extend(__contructor,jmObject);
	return __contructor;
})();

/**
* 获取属性值
*/
jmProperty.prototype.getValue = function(name) {
	if(!this.__properties) this.__properties = {};
	return this.__properties[name];
}

/**
* 获取属性值
*/
jmProperty.prototype.setValue = function(name,value) {
	if(typeof value !== 'undefined') {
		if(!this.__properties) this.__properties = {};
		var args = {oldValue:this.getValue(name),newValue:value};
		this.__properties[name] = value;
		this.callHandle('PropertyChange',[name,args]);
	}
	return this.getValue(name);
}

/**
* 绑定事件监听
*/
jmProperty.prototype.on = function(name,handle) {
	if(!this.__eventHandles) this.__eventHandles = {};
	this.__eventHandles[name] = handle;
}

/**
* 执行监听回调
*/
jmProperty.prototype.callHandle = function(name,args) {
	var handle = this.__eventHandles?this.__eventHandles[name]:null;
	if(handle) {
		handle.apply(this,args);
	}
}
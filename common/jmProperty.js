
/**
 *  所有jm对象的基础对象
 * 
 * @class jmObject
 * @module jmGraph
 * @for jmGraph
 */
function jmObject() {

}

/**
 * 检 查对象是否为指定类型
 * 
 * @method is
 * @param {class} type 判断的类型
 * @for jmObject
 * @return {boolean} true=表示当前对象为指定的类型type,false=表示不是
 */
jmObject.prototype.is = function(type) {
	return this instanceof type;
}

/**
 * 给控件添加动画处理,如果成功执行会导致画布刷新。
 *
 * @method animate
 * @for jmObject
 * @param {function} handle 动画委托
 * @param {integer} millisec 此委托执行间隔 （毫秒）
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
				var self = this;
				//延时处理动画事件
				this.dispatcher = setTimeout(function() {
					var _this = self;
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
				},20);//刷新				
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
 * 
 * @class jmProperty
 * @for jmGraph
 * @require jmObject
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
 * 
 * @method getValue
 * @for jmProperty
 * @param {string} name 获取属性的名称
 * @return {any} 获取属性的值
 */
jmProperty.prototype.getValue = function(name) {
	if(!this.__properties) this.__properties = {};
	return this.__properties[name];
}

/**
 * 设置属性值
 *
 * @method setValue
 * @for jmProperty
 * @param {string} name 设置属性的名称
 * @param {any} value 设置属性的值
 * @retunr {any} 当前属性的值
 */
jmProperty.prototype.setValue = function(name,value) {
	if(typeof value !== 'undefined') {
		if(!this.__properties) this.__properties = {};
		var args = {oldValue:this.getValue(name),newValue:value};
		this.__properties[name] = value;
		this.emit('PropertyChange',name,args);
	}
	return this.getValue(name);
}

/**
 * 绑定事件监听
 *
 * @method on
 * @for jmProperty
 * @param {string} name 监听事件的名称
 * @param {function} handle 监听委托 
 */
jmProperty.prototype.on = function(name,handle) {
	if(!this.__eventHandles) this.__eventHandles = {};
	var handles = this.__eventHandles[name];
	if(!handles) {
		handles = this.__eventHandles[name] = []
	}
	//如果已绑定相同的事件，则直接返回
	for(var i in handles) {
		if(handles[i] === handle) {
			return;
		}
	}
	handles.push(handle);
}

/**
 * 执行监听回调
 * 
 * @method emit
 * @for jmProperty
 * @param {string} name 触发事件的名称
 * @param {array} args 事件参数数组
 */
 jmProperty.prototype.emit = function(name) {
	var handles = this.__eventHandles?this.__eventHandles[name]:null;
	if(handles) {
		var args = [];
		var len = arguments.length;
		if(len > 1) {
			//截取除name以后的所有参数
			for(var i=1;i<len;i++) {
				args.push(arguments[i]);
			}
		}		
		for(var i in handles) {
			handles[i].apply(this,args);
		}		
	}
}
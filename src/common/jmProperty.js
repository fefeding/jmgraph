



/**
 * 对象属性管理
 * 
 * @class jmProperty
 * @for jmGraph
 * @require jmObject
 */

var jmProperty = function() {	
	this.__properties = {};
	this.__eventHandles = {};
};

jmUtils.extend(jmProperty,jmObject);

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


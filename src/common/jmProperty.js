



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

jmUtils.extend(jmProperty, jmObject);

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
		this.emit && this.emit('PropertyChange',name,args);
	}
	return this.getValue(name);
}

/**
 * 定义一个属性
 *
 * @method setValue
 * @for createProperty
 * @param {string} name 设置属性的名称
 * @param {any} value 属性的值，可选, 如果直接指定为descriptor，也可以。可以传递get,set，按defineProperty第三个参数做参考
 * @retunr {any} 当前属性的值
 */
jmProperty.prototype.createProperty = function(name, value) {	
	return jmUtils.createProperty(this, name, value);
}



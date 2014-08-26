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
	if(typeof type == 'string') {
		return this.type == type;
	}
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
	if(this.is('jmGraph')) {
		if(handle) {			
			if(!this.animateHandles) this.animateHandles = new jmUtils.list();
			
			//var id = jmUtils.guid();
			var params = [];
			if(arguments.length > 2) {
				for(var i=2;i<arguments.length;i++) {
					params.push(arguments[i]);
				}
			}		
			this.animateHandles.add({millisec:millisec || 20,handle:handle,params:params});//id:id,
		}
		if(this.animateHandles) {
			if(this.animateHandles.count() > 0) {
				var self = this;
				//延时处理动画事件
				this.dispatcher = setTimeout(function(_this) {
					_this = _this || self;
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
								ani.times = curTimes;
								needredraw = true;								
							}
						}
						catch(e) {
							if(window.console && window.console.info) {
								window.console.info(e.toString());
							}
							if(ani) overduehandles.push(ani);//异常的事件，不再执行
						}						
					});
					for(var i in overduehandles) {
						_this.animateHandles.remove(overduehandles[i]);//移除完成的效果
					}
					if(needredraw) {
						_this.redraw();				
					}
					//console.log(curTimes)
					_this.animate();
				},10,this);//刷新				
			}
		}
	}	
	else {
		var graph = this.findParent('jmGraph');
		if(graph) {
			graph.animate.apply(graph,arguments);
		}
	}
}

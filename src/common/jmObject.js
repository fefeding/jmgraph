
import {jmList} from "./jmList.js";

/**
 *  所有jm对象的基础对象
 * 
 * @class jmObject
 * @for jmGraph
 */
class jmObject {
	//id;
	constructor(g) {
		if(g && g.type == 'jmGraph') {
			this.graph = g;
		}
		//this.id = Symbol("id"); //生成一个唯一id
	}
	
	/**
	 * 检 查对象是否为指定类型
	 * 
	 * @method is
	 * @param {class} type 判断的类型
	 * @for jmObject
	 * @return {boolean} true=表示当前对象为指定的类型type,false=表示不是
	 */
	is(type) {
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
	animate(...args) {	
		if(this.is('jmGraph')) {
			if(args.length > 1) {			
				if(!this.animateHandles) this.animateHandles = new jmList();
				
				var params = [];
				if(args.length > 2) {
					for(var i=2;i<args.length;i++) {
						params.push(args[i]);
					}
				}		
				this.animateHandles.add({
					millisec: args[1] || 20, 
					handle: args[0], 
					params:params
				});
			}
			if(this.animateHandles) {
				if(this.animateHandles.count() > 0) {
					var self = this;
					//延时处理动画事件
					this.dispatcher = setTimeout(function(_this) {
						_this = _this || self;
						//var needredraw = false;
						var overduehandles = [];
						var curTimes = new Date().getTime();
						_this.animateHandles.each(function(i,ani) {						
							try {
								if(ani && ani.handle && (!ani.times || curTimes - ani.times >= ani.millisec)) {
									var r = ani.handle.apply(_this, ani.params);
									if(r === false) {
										overduehandles.push(ani);//表示已完成的动画效果
									}								
									ani.times = curTimes;
									//needredraw = true;								
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
						_this.animate();
					},10,this);//刷新				
				}
			}
		}	
		else {
			var graph = this.graph;
			if(graph) {
				graph.animate(...args);
			}
		}
	}
}

export { jmObject };
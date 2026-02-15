
import {jmList} from "./jmList.js";

let control_id_counter = 0;

export default class jmObject {
	constructor(g) {
		if(g && g.type == 'jmGraph') {
			this.graph = g;
		}
		this.id = ++control_id_counter;
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

	animate(...args) {
		if(this.is('jmGraph')) {
			if(args.length > 1) {
				if(!this.animateHandles) this.animateHandles = new jmList();
				
				const params = [];
				if(args.length > 2) {
					for(let i=2;i<args.length;i++) {
						params.push(args[i]);
					}
				}
				this.animateHandles.add({
					millisec: args[1] || 20, 
					handle: args[0], 
					params: params
				});
			}
			if(this.animateHandles) {
				if(this.animateHandles.count() > 0) {
					const self = this;
					this.dispatcher = setTimeout(function(_this) {
						_this = _this || self;
						const overduehandles = [];
						const curTimes = Date.now();
						_this.animateHandles.each(function(i,ani) {
							try {
								if(ani && ani.handle && (!ani.times || curTimes - ani.times >= ani.millisec)) {
									const r = ani.handle.apply(_this, ani.params);
									if(r === false) {
										overduehandles.push(ani);
									}
									ani.times = curTimes;
								}
							}
							catch(e) {
								if(ani) overduehandles.push(ani);
							}
						});
						for(const i in overduehandles) {
							_this.animateHandles.remove(overduehandles[i]);
						}
						_this.animate();
					},10,this);
				}
			}
		}
		else {
			const graph = this.graph;
			if(graph) {
				graph.animate(...args);
			}
		}
	}
}

export { jmObject };
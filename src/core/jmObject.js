
/**
 * @fileoverview jmGraph 基础对象类
 * 
 * jmObject 是 jmGraph 库中所有对象的基类，提供了：
 * - 唯一ID生成机制
 * - 类型检查方法
 * - 动画帧调度系统
 * 
 * @module jmObject
 * @author jmGraph Team
 * @license MIT
 */

import {jmList} from "./jmList.js";

/**
 * 控件ID计数器
 * 用于为每个新创建的对象生成唯一标识符
 * @type {number}
 * @private
 */
let control_id_counter = 0;

/**
 * jmGraph 基础对象类
 * 
 * 所有图形控件、属性对象、工具类的基类。
 * 提供了对象标识、类型检查和动画调度等核心功能。
 * 
 * @class jmObject
 * @example
 * // 创建一个基础对象
 * const obj = new jmObject();
 * console.log(obj.id); // 输出唯一ID
 * 
 * // 类型检查
 * obj.is('jmObject'); // true
 * obj.is(jmObject);  // true
 */
export default class jmObject {
	/**
	 * 构造函数
	 * 
	 * 创建一个新的基础对象实例，自动分配唯一ID。
	 * 如果传入的是 jmGraph 实例，则建立关联关系。
	 * 
	 * @constructor
	 * @param {jmGraph} [g] - 可选的 jmGraph 实例，用于建立对象与画布的关联
	 * 
	 * @example
	 * // 创建独立对象
	 * const obj = new jmObject();
	 * 
	 * // 创建关联画布的对象
	 * const graph = new jmGraph(canvas);
	 * const objWithGraph = new jmObject(graph);
	 */
	constructor(g) {
		// 如果传入的是 jmGraph 实例，则建立引用关系
		if(g && g.type == 'jmGraph') {
			this.graph = g;
		}
		// 生成唯一ID
		this.id = ++control_id_counter;
	}
	
	/**
	 * 检查对象是否为指定类型
	 * 
	 * 支持两种类型检查方式：
	 * 1. 字符串方式：检查对象的 type 属性是否匹配
	 * 2. 类构造函数方式：使用 instanceof 检查原型链
	 * 
	 * @method is
	 * @param {string|Function} type - 要检查的类型名称（字符串）或类构造函数
	 * @returns {boolean} 如果对象是指定类型则返回 true，否则返回 false
	 * 
	 * @example
	 * // 使用字符串检查
	 * control.is('jmRect'); // 检查是否为矩形
	 * 
	 * // 使用类构造函数检查
	 * control.is(jmControl); // 检查是否为 jmControl 实例
	 * control.is(jmPath);   // 检查是否继承自 jmPath
	 */
	is(type) {
		// 字符串类型：检查 type 属性
		if(typeof type == 'string') {
			return this.type == type;
		}
		// 类构造函数：使用 instanceof 检查原型链
		return this instanceof type;
	}

	/**
	 * 注册并执行动画帧回调
	 * 
	 * 提供动画帧调度功能，支持：
	 * - 按指定时间间隔执行回调
	 * - 多个动画句柄并行执行
	 * - 自动清理返回 false 的动画
	 * - 错误自动移除异常动画
	 * 
	 * 此方法通常由 jmGraph 实例调用，子控件会委托给所属的 graph 处理。
	 * 
	 * @method animate
	 * @param {Function} handle - 动画回调函数，返回 false 时自动移除
	 * @param {number} [millisec=20] - 执行间隔（毫秒），默认 20ms
	 * @param {...*} [params] - 传递给回调函数的额外参数
	 * 
	 * @example
	 * // 创建一个简单的动画
	 * let x = 0;
	 * graph.animate(function() {
	 *     x += 1;
	 *     rect.position.x = x;
	 *     graph.redraw();
	 *     
	 *     // 动画结束条件
	 *     if(x > 100) return false;
	 * }, 16); // 约60fps
	 * 
	 * // 带参数的动画
	 * graph.animate(function(speed) {
	 *     x += speed;
	 *     // ...
	 * }, 16, 5); // speed = 5
	 */
	animate(...args) {
		// 只有 jmGraph 实例才真正处理动画调度
		if(this.is('jmGraph')) {
			// 注册新的动画句柄
			if(args.length > 1) {
				if(!this.animateHandles) this.animateHandles = new jmList();
				
				// 收集额外参数
				const params = [];
				if(args.length > 2) {
					for(let i=2;i<args.length;i++) {
						params.push(args[i]);
					}
				}
				// 添加动画句柄到列表
				this.animateHandles.add({
					millisec: args[1] || 20,    // 执行间隔
					handle: args[0],             // 回调函数
					params: params               // 额外参数
				});
			}
			
			// 如果有动画句柄，启动调度循环
			if(this.animateHandles) {
				if(this.animateHandles.count() > 0) {
					const self = this;
					// 使用 setTimeout 进行调度（避免 requestAnimationFrame 的固定帧率限制）
					this.dispatcher = setTimeout(function(_this) {
						_this = _this || self;
						const overduehandles = [];  // 需要移除的句柄
						const curTimes = Date.now();
						
						// 遍历执行所有动画句柄
						_this.animateHandles.each(function(i,ani) {
							try {
								// 检查是否到达执行时间
								if(ani && ani.handle && (!ani.times || curTimes - ani.times >= ani.millisec)) {
									// 执行回调
									const r = ani.handle.apply(_this, ani.params);
									// 返回 false 表示动画结束
									if(r === false) {
										overduehandles.push(ani);
									}
									// 更新最后执行时间
									ani.times = curTimes;
								}
							}
							catch(e) {
								// 出错的句柄自动移除
								if(ani) overduehandles.push(ani);
							}
						});
						
						// 移除已完成的动画句柄
						for(const i in overduehandles) {
							_this.animateHandles.remove(overduehandles[i]);
						}
						
						// 继续下一轮调度
						_this.animate();
					},10,this);
				}
			}
		}
		else {
			// 非 jmGraph 对象委托给所属的 graph 处理
			const graph = this.graph;
			if(graph) {
				graph.animate(...args);
			}
		}
	}
}

export { jmObject };
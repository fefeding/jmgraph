/**
 * @fileoverview jmLayer 图层类
 * 
 * jmLayer 提供了图层管理功能，用于组织和控制图形对象的显示和交互。
 * 图层可以包含多个图形对象，支持可见性和锁定控制。
 * 
 * 主要功能：
 * - 图层可见性控制
 * - 图层锁定（防止交互）
 * - 图形对象组织和管理
 * - 批量操作支持
 * 
 * @module jmLayer
 * @author jmGraph Team
 * @license MIT
 */

import {jmControl} from "./jmControl.js";

/**
 * 图层类
 * 
 * 用于组织和管理图形对象，支持可见性和锁定控制。
 * 图层可以包含多个图形对象，并控制它们的显示和交互。
 *
 * @class jmLayer
 * @extends jmControl
 * @param {object} params 图层参数
 * @param {string} [params.name] 图层名称，默认为 'Layer_${timestamp}'
 * @param {boolean} [params.visible=true] 图层是否可见
 * @param {boolean} [params.locked=false] 图层是否锁定（锁定后不可交互）
 * @param {jmGraph} [params.graph] 所属的画布对象
 * 
 * @example
 * // 创建图层
 * const layer = new jmLayer({
 *     name: 'background',
 *     visible: true,
 *     locked: false
 * });
 * 
 * // 添加图形到图层
 * layer.children.add(rect);
 * 
 * // 锁定图层
 * layer.locked = true;
 */
export default class jmLayer extends jmControl {
	
	constructor(params, t='jmLayer') {
		params = params || {};
		params.interactive = false; // 图层本身不响应交互事件
		super(params, t);

		this.name = params.name || `Layer_${Date.now()}`;
		this.visible = params.visible !== false;
		this.locked = params.locked || false;
	}

	/**
	 * 图层名称
	 * 图层的唯一标识符，用于查找和管理图层
	 * 
	 * @property name
	 * @type {string}
	 */
	get name() {
		return this.property('name');
	}
	set name(v) {
		if(!v || typeof v !== 'string') {
			console.warn('jmLayer: name must be a non-empty string');
			return;
		}
		return this.property('name', v);
	}

	/**
	 * 图层是否可见
	 * 不可见的图层不会被渲染，但仍然存在于图层列表中
	 * 
	 * @property visible
	 * @type {boolean}
	 */
	get visible() {
		return this.property('visible');
	}
	set visible(v) {
		this.needUpdate = true;
		return this.property('visible', v);
	}

	/**
	 * 图层是否锁定
	 * 锁定的图层中的图形不可被选中或移动，但仍然可见
	 * 适用于背景图层或参考图层
	 * 
	 * @property locked
	 * @type {boolean}
	 */
	get locked() {
		return this.property('locked');
	}
	set locked(v) {
		return this.property('locked', v);
	}

	/**
	 * 绘制图层
	 * 只有可见的图层才会被绘制
	 * 
	 * @method paint
	 * @param {boolean} v 是否需要重绘
	 */
	paint(v) {
		if(this.visible !== false) {
			super.paint(v);
		}
	}

	/**
	 * 检查点是否在图层内
	 * 锁定的图层不会响应鼠标事件
	 * 
	 * @method checkPoint
	 * @param {object} p 坐标点 {x, y}
	 * @param {number} [pad] padding，额外的检测范围
	 * @return {boolean} 是否在图层内
	 */
	checkPoint(p, pad) {
		// 锁定的图层不响应交互
		if(this.locked) return false;
		return super.checkPoint(p, pad);
	}

	/**
	 * 清空图层
	 * 移除图层中的所有图形对象
	 * 
	 * @method clear
	 */
	clear() {
		this.children.clear();
		this.needUpdate = true;
	}

	/**
	 * 获取图层中的图形数量
	 * 
	 * @method getShapeCount
	 * @return {number} 图形数量
	 */
	getShapeCount() {
		return this.children.length;
	}

	/**
	 * 获取图层信息
	 * 返回图层的基本信息，用于调试和日志
	 * 
	 * @method getInfo
	 * @return {object} 图层信息对象
	 */
	getInfo() {
		return {
			name: this.name,
			visible: this.visible,
			locked: this.locked,
			shapeCount: this.getShapeCount()
		};
	}
}

export { jmLayer };
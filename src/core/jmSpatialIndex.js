/**
 * @fileoverview jmSpatialIndex 空间索引（均匀网格）
 * 
 * 用于加速事件命中测试。当画布中 interactive 控件数量很大时，
 * 全量遍历所有子级做命中判断（O(n)）会成为交互性能瓶颈。
 * 本类用均匀网格把控件按其边界插入到网格单元中，
 * 查询时只遍历点所在单元（及相邻单元）的候选集，大幅减少命中测试次数。
 * 
 * 约定：索引以「世界坐标」为坐标系，与 viewport 解耦——
 * 查询方先把事件点通过 viewport.screenToWorld 转换后再查询。
 * 
 * @module jmSpatialIndex
 * @author jmGraph Team
 * @license MIT
 */
export default class jmSpatialIndex {

	/**
	 * 构造函数
	 * @param {number} [cellSize=100] 网格单元大小（世界坐标单位）
	 */
	constructor(cellSize = 100) {
		this.cellSize = Math.max(8, cellSize || 100);
		/** 网格：cellKey -> Set<control> */
		this.cells = new Map();
		/** control -> Set<cellKey>，用于删除时精确清理 */
		this.controlCells = new Map();
	}

	/** 计算某坐标对应的网格 key */
	_cellKey(x, y) {
		return ((x / this.cellSize) | 0) + '_' + ((y / this.cellSize) | 0);
	}

	/** 计算某矩形覆盖的所有网格 key */
	_rectKeys(bounds) {
		const keys = [];
		const left = Math.floor(bounds.left / this.cellSize);
		const right = Math.floor(bounds.right / this.cellSize);
		const top = Math.floor(bounds.top / this.cellSize);
		const bottom = Math.floor(bounds.bottom / this.cellSize);
		for(let cy = top; cy <= bottom; cy++) {
			for(let cx = left; cx <= right; cx++) {
				keys.push(cx + '_' + cy);
			}
		}
		return keys;
	}

	/**
	 * 获取控件当前边界（世界坐标），用于插入索引。
	 * 控件必须已挂到 graph 上且已计算过 absoluteBounds。
	 * @param {Object} control
	 * @return {Object|null} {left, top, right, bottom}
	 */
	_boundsOf(control) {
		const b = control.absoluteBounds || (control.getAbsoluteBounds ? control.getAbsoluteBounds() : null);
		if(!b) return null;
		// 命中容差：线条/非实心图形需要更宽的判定范围
		const pad = (control.style && (control.style.lineWidth || 0)) || 1;
		return {
			left: b.left - pad,
			top: b.top - pad,
			right: b.right + pad,
			bottom: b.bottom + pad
		};
	}

	/**
	 * 插入（或更新）一个控件
	 * @param {Object} control
	 */
	upsert(control) {
		this.remove(control);
		const bounds = this._boundsOf(control);
		if(!bounds) return;
		const keys = this._rectKeys(bounds);
		const cellSet = new Set();
		for(const key of keys) {
			let cell = this.cells.get(key);
			if(!cell) this.cells.set(key, cell = new Set());
			cell.add(control);
			cellSet.add(key);
		}
		this.controlCells.set(control, cellSet);
	}

	/**
	 * 移除一个控件
	 * @param {Object} control
	 */
	remove(control) {
		const cellSet = this.controlCells.get(control);
		if(!cellSet) return;
		for(const key of cellSet) {
			const cell = this.cells.get(key);
			if(cell) {
				cell.delete(control);
				if(cell.size === 0) this.cells.delete(key);
			}
		}
		this.controlCells.delete(control);
	}

	/**
	 * 查询包含指定点（世界坐标）的所有候选控件。
	 * @param {Object} p {x, y} 世界坐标
	 * @return {Set<Object>|null} 候选控件集合（可为 null）
	 */
	query(p) {
		const key = this._cellKey(p.x, p.y);
		const cell = this.cells.get(key);
		return cell || null;
	}

	/**
	 * 查询与指定矩形相交的所有候选控件。
	 * @param {Object} rect 世界坐标矩形 {left, top, right, bottom}
	 * @return {Set<Object>} 候选控件集合
	 */
	queryRect(rect) {
		const result = new Set();
		const keys = this._rectKeys(rect);
		for(const key of keys) {
			const cell = this.cells.get(key);
			if(cell) {
				for(const c of cell) result.add(c);
			}
		}
		return result;
	}

	/** 清空索引 */
	clear() {
		this.cells.clear();
		this.controlCells.clear();
	}

	/** 索引中控件数量 */
	get size() {
		return this.controlCells.size;
	}
}

export { jmSpatialIndex };

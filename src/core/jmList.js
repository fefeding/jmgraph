/**
 * @fileoverview jmList 列表类
 * 
 * jmList 是 jmGraph 库的集合类，继承自原生 Array。
 * 提供了增强的列表操作方法，包括去重添加、条件查找、遍历等。
 * 
 * 主要功能：
 * - 去重添加元素（add）
 * - 条件查找（get）
 * - 正向/反向遍历（each）
 * - 元素计数（count）
 * - 移除回调支持
 * 
 * @module jmList
 * @author jmGraph Team
 * @license MIT
 */

/**
 * jmList 列表类
 * 
 * 继承自 Array 的增强列表类，提供去重、遍历、查找等功能。
 * 主要用于管理图形对象的子元素集合。
 * 
 * @class jmList
 * @extends Array
 * 
 * @param {...*} arg 初始元素或数组
 * 
 * @example
 * // 创建列表
 * const list = new jmList([1, 2, 3]);
 * 
 * // 添加元素（自动去重）
 * list.add(4);
 * list.add([5, 6]);
 * 
 * // 遍历
 * list.each((index, item) => {
 *     console.log(index, item);
 * });
 * 
 * // 条件查找
 * const found = list.get(item => item > 3);
 */
export default class jmList extends Array {
    /**
     * 构造函数
     * 
     * @param {...*} arg 初始元素或数组
     */
    constructor(...arg) {
        const ps = [];
        if(arg && arg.length && Array.isArray(arg[0])) {
            for(let i=0; i< arg[0].length; i++) ps.push(arg[0][i]);
            super(...ps);
        }
        else {
            super();
        }
        /**
         * 配置选项
         * @type {Object}
         * @property {function} removeHandler 元素移除时的回调函数
         */
        this.option = {};
        /**
         * 类型标识
         * @type {string}
         */
        this.type = 'jmList';
    }

    /**
     * 添加元素到列表
     * 
     * 自动去重，如果元素已存在则不会重复添加。
     * 支持添加单个元素或数组。
     * 
     * @method add
     * @param {*} obj 要添加的元素或数组
     * @returns {*} 添加的元素
     * 
     * @example
     * list.add(1);           // 添加单个元素
     * list.add([2, 3, 4]);   // 添加数组
     */
    add(obj) {
        if(obj && Array.isArray(obj)) {
            for(let i=0; i < obj.length; i++) {
                if(!this.includes(obj[i])) this.push(obj[i]);
            }
            return obj;
        }
        if(typeof obj == 'object' && this.includes(obj)) return obj;
        this.push(obj);
        return obj;
    }

    /**
     * 批量添加元素
     * 
     * 比逐个调用 add 更高效（去重仍为 O(n)，但避免每次 add 的数组包装开销）。
     * 
     * @method addAll
     * @param {Array} objs 要添加的元素数组
     * @returns {Array} 传入的数组
     * 
     * @example
     * list.addAll([1, 2, 3]);
     */
    addAll(objs) {
        if(!Array.isArray(objs)) return objs;
        for(let i = 0; i < objs.length; i++) {
            if(!this.includes(objs[i])) this.push(objs[i]);
        }
        return objs;
    }

    /**
     * 从列表中移除元素
     * 
     * 移除所有匹配的元素，并触发移除回调。
     * 
     * @method remove
     * @param {*} obj 要移除的元素
     * 
     * @example
     * list.remove(item);
     */
    remove(obj) {
        for(let i = this.length -1; i>=0; i--) {
            if(this[i] == obj) {
                this.removeAt(i);
            }
        }
    }

    /**
     * 移除指定索引位置的元素
     * 
     * @method removeAt
     * @param {number} index 要移除的元素索引
     * 
     * @example
     * list.removeAt(0);  // 移除第一个元素
     */
    removeAt(index) {
        if(this.length > index) {
            const obj = this[index];
            this.splice(index,1);
            if(this.option.removeHandler) this.option.removeHandler.call(this, obj, index);
        }
    }

    /**
     * 检查列表是否包含指定元素
     * 
     * @method contain
     * @param {*} obj 要检查的元素
     * @returns {boolean} 如果包含返回 true，否则返回 false
     * 
     * @example
     * if (list.contain(item)) {
     *     console.log('元素存在');
     * }
     */
    contain(obj) {
        return this.includes(obj);
    }

    /**
     * 获取元素
     * 
     * 如果参数是函数，则返回第一个满足条件的元素；
     * 如果参数是数字，则返回指定索引的元素。
     * 
     * @method get
     * @param {number|function} index 索引或条件函数
     * @returns {*} 找到的元素，如果未找到返回 undefined
     * 
     * @example
     * // 按索引获取
     * const item = list.get(0);
     * 
     * // 按条件查找
     * const found = list.get(item => item.id === 5);
     */
    get(index) {
        if(typeof index == 'function') {
            return this.find(index);
        }
        else {
            return this[index];
        }
    }

    /**
     * 遍历列表
     * 
     * 支持正向和反向遍历。在回调中返回 false 可以中断遍历。
     * 
     * @method each
     * @param {function} cb 回调函数，参数为 (index, item)
     * @param {boolean} [inverse=false] 是否反向遍历
     * 
     * @example
     * // 正向遍历
     * list.each((index, item) => {
     *     console.log(index, item);
     *     if (item.id === 3) return false;  // 中断遍历
     * });
     * 
     * // 反向遍历
     * list.each((index, item) => {
     *     console.log(index, item);
     * }, true);
     */
    each(cb, inverse) {
        if(cb && typeof cb == 'function') {
            if(inverse) {
                for(let i = this.length - 1;i>=0; i--) {
                    const r = cb.call(this, i, this[i]);
                    if(r === false) break;
                }
            }
            else {
                const len = this.length;
                for(let i = 0; i < len;i++) {
                    const r = cb.call(this, i, this[i]);
                    if(r === false) break;
                }
            }
        }
    }

    /**
     * 统计元素数量
     * 
     * 如果提供了条件函数，返回满足条件的元素数量；
     * 否则返回列表总长度。
     * 
     * @method count
     * @param {function} [handler] 条件函数
     * @returns {number} 元素数量
     * 
     * @example
     * const total = list.count();  // 总数量
     * const matched = list.count(item => item.active);  // 满足条件的数量
     */
    count(handler) {
        if(handler && typeof handler == 'function') {
            let count = 0;
            const len = this.length;
            for(let i = 0; i<len;i++) {
                if(handler(this[i])) {
                    count++;
                }
            }
            return count;
        }
        return this.length;
    }

    /**
     * 清空列表
     * 
     * 移除列表中的所有元素。
     * 
     * @method clear
     * 
     * @example
     * list.clear();
     */
    clear() {
        this.splice(0, this.length);
    }
}

export { jmList };
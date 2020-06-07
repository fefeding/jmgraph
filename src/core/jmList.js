/**
 * 自定义集合
 * 
 * @class jmList
 * @for jmUtils
 * @param {array} [arr] 数组，可转为当前list元素
 */
class jmList extends Array {    
    constructor(...arg) {
        let ps = [];
        if(arg && arg.length && Array.isArray(arg[0])) {
            for(let i=0; i< arg[0].length; i++) ps.push(arg[0][i]);
            super(...ps);
        }
        else {
            super();
        }
        this.option = {}; //选项
        this.type = 'jmList';
    }
    /**
     * 往集合中添加对象
     *
     * @method add
     * @for list
     * @param {any} obj 往集合中添加的对象
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
     * 从集合中移除指定对象
     * 
     * @method remove
     * @for list
     * @param {any} obj 将移除的对象
     */
    remove(obj) {
        for(let i = this.length -1; i>=0; i--) {            
            if(this[i] == obj) {
                this.removeAt(i);
            }
        }
    }

    /**
     * 按索引移除对象
     * 
     * @method removeAt
     * @for list
     * @param {integer} index 移除对象的索引
     */
    removeAt(index) {
        if(this.length > index) {
            let obj = this[index];
            this.splice(index,1);
            if(this.option.removeHandler)  this.option.removeHandler.call(this, obj, index);
        }
    }

    /**
     * 判断是否包含某个对象
     * 
     * @method contain
     * @for list
     * @param {any} obj 判断当前集合中是否包含此对象
     */
    contain(obj) {
        return this.includes(obj);
    }

    /**
     * 从集合中获取某个对象
     * 
     * @method get
     * @for list
     * @param {integer/function} index 如果为整型则表示为获取此索引的对象，如果为function为则通过此委托获取对象
     * @return {any} 集合中的对象
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
     * 遍历当前集合 
     *
     * @method each
     * @for list
     * @param {function} cb 遍历当前集合的委托
     * @param {boolean} inverse 是否按逆序遍历
     */
    each(cb, inverse) {
        if(cb && typeof cb == 'function') {
            //如果按倒序循环
            if(inverse) {
                for(let i = this.length - 1;i>=0; i--) {
                    let r = cb.call(this, i, this[i]);
                    if(r === false) break;
                }
            }
            else {
                let len = this.length;
               for(let i  = 0; i < len;i++) {
                    let r = cb.call(this, i, this[i]);
                    if(r === false) break;
                } 
            }            
        }        
    }

    /**
     * 获取当前集合对象个数
     *
     * @method count
     * @param {function} [handler] 检查对象是否符合计算的条件
     * @for list
     * @return {integer} 当前集合的个数
     */
    count(handler) {
        if(handler && typeof handler == 'function') {
            let count = 0;
            let len = this.length;
            for(let i  = 0; i<len;i++) {
                if(handler(this[i])) {
                    count ++;
                }
            } 
            return count;
        }
        return this.length;
    }

    /**
     * 清空当前集合
     *
     * @method clear
     * @for list
     */
    clear() {
        this.splice(0, this.length);
    }
}

export { jmList };
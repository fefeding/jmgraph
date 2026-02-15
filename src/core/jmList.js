export default class jmList extends Array {
    constructor(...arg) {
        const ps = [];
        if(arg && arg.length && Array.isArray(arg[0])) {
            for(let i=0; i< arg[0].length; i++) ps.push(arg[0][i]);
            super(...ps);
        }
        else {
            super();
        }
        this.option = {};
        this.type = 'jmList';
    }

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

    remove(obj) {
        for(let i = this.length -1; i>=0; i--) {
            if(this[i] == obj) {
                this.removeAt(i);
            }
        }
    }

    removeAt(index) {
        if(this.length > index) {
            const obj = this[index];
            this.splice(index,1);
            if(this.option.removeHandler) this.option.removeHandler.call(this, obj, index);
        }
    }

    contain(obj) {
        return this.includes(obj);
    }

    get(index) {
        if(typeof index == 'function') {
            return this.find(index);
        }
        else {
            return this[index];
        }
    }

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

    clear() {
        this.splice(0, this.length);
    }
}

export { jmList };
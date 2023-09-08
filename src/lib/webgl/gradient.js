
// 渐变
class WeblGradient {
    // type:[linear= 线性渐变,radial=放射性渐变] 
    constructor(type='linear', params={}) {
        this.type = type || 'linear';

        this.x1 = params.x1 || 0;
        this.y1 = params.y1 || 0;
        this.r1 = params.r1 || 0;
        this.x2 = params.x2 || 0;
        this.y2 = params.y2 || 0;
        this.r2 = params.r2 || 0;

        this.bounds = params.bounds || {
            left: 0,
            top: 0,
            width: 0,
            height: 0
        }

        this.control = params.control;

        this.stops = [];
    }

    init() {
        const dx = this.x2 - this.x1;
        const dy = this.y2 - this.y1;

        if(this.type === 'radial') {
            this.length = this.r2 - this.r1;
        }
        else if(dx === 0 && dy === 0) {
            this.length = 0;
        }
        else {
            // 渐变中心的距离
            this.length = Math.sqrt(Math.pow(dx, 2), Math.pow(dy, 2));
            this.sin = dy / this.length;
            this.cos = dx / this.length;
        }
    }

    // 渐变颜色
    addColorStop(offset, color) {
        this.stops.push({
            offset,
            color
        });
    }

    // 根据绘制图形的坐标计算出对应点的颜色
    toPointColors(points) {
        const stops = this.getStops();
        const colors = [];
        for(let i=0; i<points.length; i+=2) {
            const p = {
                x: points[i],
                y: points[i+1]
            }
            if(this.type === 'radial') {
                const dx = p.x - this.x1;
                const dy = p.y - this.y1;
                const len = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                const rang = this.getStopRange(len, stops);
                if(!rang.start && rang.end) {
                    colors.push(rang.end.color);
                }
                else if(!rang.end && rang.start) {
                    colors.push(rang.start.color);
                }
                else {
                    const rangLength = rang.end.length - rang.start.length;
                    const offlen = len - rang.start.length;
                    const per = offlen / rangLength;
                    const color = {
                        r: rang.start.color.r + (rang.end.color.r - rang.start.color.r) * per,
                        g: rang.start.color.g + (rang.end.color.g - rang.start.color.g) * per,
                        b: rang.start.color.b + (rang.end.color.b - rang.start.color.b) * per,
                        a: rang.start.color.a + (rang.end.color.a - rang.start.color.a) * per,
                    };
                    colors.push(color);
                }
            }
        }
        return colors;
    }

    // 根据起点距离获取边界stop
    getStopRange(len, stops) {
        const res = {};
        for(const s of stops) {
            if(s.length <= len) {
                res.start = s;
            }
            else {
                res.end = s;
            }
        }
        return res;
    }

    // 根据stop计算offset长度
    getStops() {
        const stops = this.stops.sort((p1, p2) => p1.offset - p2.offset); // 渐变色排序从小于大
        for(const s of stops) {
            s.color = this.control.graph.utils.hexToRGBA(s.color);
            s.length = s.offset * this.length;
        }
        return stops;
    }
}

export default WeblGradient;
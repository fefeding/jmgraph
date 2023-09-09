const WebglGradientTextureCache = {};
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
        this.init();
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

    // 转为渐变为纹理
    toTexture(control, bounds) {
        const key = this.toString() + `-${bounds.width}x${bounds.height}`;
        if(WebglGradientTextureCache[key]) return WebglGradientTextureCache[key];

        let canvas = control.graph.textureCanvas;
        if(!canvas) {
            canvas = control.graph.textureCanvas = document.createElement('canvas');
        }
        canvas.width = bounds.width;
        canvas.height = bounds.height;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let gradient = null;
        if(this.type === 'linear') {
            gradient = ctx.createLinearGradient(this.x1, this.y1, this.x2, this.y2);
        }
        else {
            gradient = ctx.createRadialGradient(this.x1, this.y1, this.r1, this.x2, this.y2, this.r2);
        }
        this.stops.forEach(function(s, i) {	
            const c = control.graph.utils.toColor(s.color);
            gradient && gradient.addColorStop(s.offset, c);		
        });
        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.moveTo(0, 0);
        ctx.lineTo(bounds.width, 0);
        ctx.lineTo(bounds.width, bounds.height);
        ctx.lineTo(0, bounds.height);
        ctx.lineTo(0, 0);

        ctx.closePath();
        ctx.fill();

        const src = canvas.toDataURL();
        const img = new Image();
        img.onload = ()=>{
            control.graph.needUpdate = true;
        }
        img.src = src;

        WebglGradientTextureCache[key] = img;

        return img;
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
            
            const color = typeof s.color === 'string'? this.control.graph.utils.hexToRGBA(s.color) : s.color;
            console.log(s, color);
            s.color = this.control.graph.utils.rgbToDecimal(color);
            s.length = s.offset * this.length;
        }
        return stops;
    }

    /**
	 * 转换为渐变的字符串表达
	 *
	 * @method toString
	 * @for jmGradient
	 * @return {string} linear-gradient(x1 y1 x2 y2, color1 step, color2 step, ...);	//radial-gradient(x1 y1 r1 x2 y2 r2, color1 step,color2 step, ...);
	 */
	toString() {
		let str = this.type + '-gradient(';
		if(this.type == 'linear') {
			str += this.x1 + ' ' + this.y1 + ' ' + this.x2 + ' ' + this.y2;
		}
		else {
			str += this.x1 + ' ' + this.y1 + ' ' + this.r1 + ' ' + this.x2 + ' ' + this.y2 + ' ' + this.r2;
		}
		//颜色渐变
		this.stops.forEach(function(s) {	
			str += ',' + s.color + ' ' + s.offset;
		});
		return str + ')';
	}
}

export default WeblGradient;
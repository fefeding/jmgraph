
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

        this.stops = [];
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
        const stops = this.stops.sort((p1, p2)=>p1.offset-p2.offset); // 渐变色排序从小于大

    }
}

export default WeblGradient;
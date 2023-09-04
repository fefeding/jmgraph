import WebglBase from './base.js';

// 把canvas坐标转为webgl坐标系
const convertPointSource = `
    vec4 translatePosition(vec4 point, float x, float y) {
        point.x = (point.x-x)/x;
        point.y = (y-point.y)/y;
        return point;
    }`

// path顶点着色器源码
const pathVertexSource = `
    attribute vec4 a_position;
    uniform vec2 a_center_point;
    uniform float a_point_size;
    ${convertPointSource}
    void main() {
        gl_PointSize = a_point_size;
        vec4 pos = translatePosition(a_position, a_center_point.x, a_center_point.y);
        gl_Position = pos;
    }
`;
// path 片段着色器源码
const pathFragmentSource = `
    precision mediump float;
    uniform vec4 v_color;
    uniform int v_type;

    void main() {
        // 如果是fill，则直接填充颜色
        if(v_type == 1) {
            gl_FragColor = v_color;
        }
        else {
            float r = distance(gl_PointCoord, vec2(0.5, 0.5));
            //根据距离设置片元
            if(r <= 0.5){
                // 方形区域片元距离几何中心半径小于0.5，像素颜色设置红色
                gl_FragColor = v_color;
            }else {
                // 方形区域距离几何中心半径不小于0.5的片元剪裁舍弃掉：
                discard;
            }
        }
    }
`;

// path 绘制类
class WebglPath extends WebglBase {
    constructor(graph, option) {
        super(graph, option);   
        // 默认所有path用同一个编译好的program
        this.program = graph.context.pathProgram || (graph.context.pathProgram=this.createProgram(pathVertexSource, pathFragmentSource));
    }

    // 设置样式
    setStyle(style = this.style, value = '') {
        if(typeof style === 'string') {
            const obj = {};
            obj[style] = value;
            style = obj;
        }
       
        // 设置线条颜色或填充色
        if(style.strokeStyle) {
            let color = style.strokeStyle;
            if(typeof color === 'string') color = this.graph.utils.hexToRGBA(color);
            color = this.graph.utils.clone(color);
            color.r /= 255;
            color.g /= 255;
            color.b /= 255;
            this.style.strokeStyle = color;
            delete style.strokeStyle;
        }
        else if(style.fillStyle) {
            let color = style.fillStyle;
            if(typeof color === 'string') color = this.graph.utils.hexToRGBA(color);
            color = this.graph.utils.clone(color);
            color.r /= 255;
            color.g /= 255;
            color.b /= 255;
            this.style.fillStyle = color;
            delete style.fillStyle;
        }
        // 线宽
        if(style.lineWidth && this.program.uniforms.a_point_size) {
            this.context.uniform1f(this.program.uniforms.a_point_size.location, style.lineWidth);// * this.graph.devicePixelRatio
        }

        this.style = {
            ...this.style,
            ...style
        }
    }

    // 开始绘制
    draw(points, bounds = this.absoluteBounds) {
        if(bounds) this.absoluteBounds = bounds;
        // 写入当前canvas大小
        if(this.program.uniforms.a_center_point) {
            this.context.uniform2f(this.program.uniforms.a_center_point.location, this.graph.width / 2, this.graph.height / 2);
        }
        this.points = points;
    }

    // 图形封闭
    closePath() {
        if(this.points && this.points.length > 2 && this.points[0] !== this.points[this.points.length-1]) {
            this.points.push(this.points[0]);
        }
    }

    // 绘制点数组
    writePoints(points) {
        const fixedPoints = [];
        // 设置路径
        if(this.program.attrs.a_position) {
            for(const p of points) {
                fixedPoints.push(
                    p.x + this.absoluteBounds.left,
                    p.y + this.absoluteBounds.top
                );
            }
            const vertexBuffer = this.createFloat32Buffer(fixedPoints); 
            this.writeVertexAttrib(vertexBuffer, this.program.attrs.a_position, 2, 0, 0);
        }
        return fixedPoints;
    }

    // 连接二个点
    genLinePoints(start, end) {
        const points = [start];
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        if(dx !== 0 || dy !== 0) {
            const len = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            const cos = dx / len;
            const sin = dy / len;
            const step = 0.1;
            for(let l=step; l<len; l+=step) {
                const x = start.x + cos * l;
                const y = start.y + sin * l;
                points.push({
                    x, y
                });
            }
        }
        points.push(end);
        return points;
    }

    // 画线条
    stroke() {
        if(this.program.uniforms.v_color && this.style.strokeStyle) {
            const color = this.style.strokeStyle;
            this.context.uniform4f(this.program.uniforms.v_color.location, color.r, color.g, color.b, color.a * this.style.globalAlpha);
        }
        // 标注为stroke
        if(this.program.uniforms.v_type) {
            this.context.uniform1i(this.program.uniforms.v_type.location, 0);
        }
        if(this.points && this.points.length) {
            let start = null;
            const points = [];
            for(let i=0; i<this.points.length; i++) {
                const p = this.points[i];
                if(start && !p.m) {
                    const linePoints = this.genLinePoints(start, p);
                    points.push(...linePoints);
                }
                else if(start && !points.includes(start)) {
                    points.push(start);
                }
                start = p;
            }
            if(!points.includes(start)) points.push(start);
            this.writePoints(points);
            this.context.drawArrays(this.context.POINTS, 0, points.length);
        }
        
    }

    // 填充图形
    fill() {
        if(this.program.uniforms.v_color && this.style.fillStyle) {
            const color = this.style.fillStyle;
            this.context.uniform4f(this.program.uniforms.v_color.location, color.r, color.g, color.b, color.a * this.style.globalAlpha);
        }
        // 标注为fill
        if(this.program.uniforms.v_type) {
            this.context.uniform1i(this.program.uniforms.v_type.location, 1);
        }
        if(this.points && this.points.length) {
            this.writePoints(this.points);
            this.context.drawArrays(this.context.TRIANGLE_FAN, 0, this.points.length);
        }
    }
}

export default WebglPath;
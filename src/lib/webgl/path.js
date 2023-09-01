import WebglBase from './base.js';

// 把canvas坐标转为webgl坐标系
const convertPointSource = `
    vec4 translatePosition(in vec4 point, float x, float y) {
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

    void main() {
        float r = distance(gl_PointCoord, vec2(0.5, 0.5));
        //根据距离设置片元
        if(r <= 0.5){
            // 方形区域片元距离几何中心半径小于0.5，像素颜色设置红色
            gl_FragColor = v_color;
        }else {
            // 方形区域距离几何中心半径不小于0.5的片元剪裁舍弃掉：
        discard;
        }
        //gl_FragColor = u_color;
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
    setStyle(style = this.style) {
        // 设置线条颜色或填充色
        if(this.program.uniforms.v_color) {
            const color = style.strokeStyle || style.fillStyle;
            this.context.uniform4f(this.program.uniforms.v_color.location, color.r, color.g, color.b, color.a);
        }
        // 线宽
        if(style.lineWidth && this.program.uniforms.a_point_size) {
            this.context.uniform1f(this.program.uniforms.a_point_size.location, style.lineWidth);
        }
    }

    // 开始绘制
    draw(points = this.points, bounds = this.absoluteBounds) {
        // 写入当前canvas大小
        if(this.program.uniforms.a_center_point) {
            this.graph.context.uniform2f(this.program.uniforms.a_center_point.location, graph.width / 2, graph.height / 2);
        }
        // 设置路径
        if(this.program.attrs.a_position) {
            if(points) this.points = points;
            const absolutePoints = [];
            for(const p of points) {
                absolutePoints.push(
                    p.x + bounds.left,
                    p.y + bounds.top
                );
            }
            const vertexBuffer = createFloat32Buffer(this.context, absolutePoints); 
            writeVertexAttrib(this.context, vertexBuffer, program.attrs.a_position, 2, 0, 0);
        }
    }

    // 画线条
    stroke() {
        this.context.drawArrays(this.context.TRIANGLE, 0, this.points.length/2);
    }

    // 填充图形
    fill() {
        this.context.drawArrays(this.context.TRIANGLE_FAN, 0, this.points.length/2);
    }
}

export default WebglPath;
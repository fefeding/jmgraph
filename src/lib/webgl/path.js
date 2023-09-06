import WebglBase from './base.js';

// 把canvas坐标转为webgl坐标系
const convertPointSource = `
    vec4 translatePosition(vec4 point, float x, float y) {
        point.x = (point.x-x)/x;
        point.y = (y-point.y)/y;
        return point;
    }`;
// 把纹理的canvas坐标转为纹理的坐标系
const convertTexturePosition = `
    vec2 translateTexturePosition(in vec2 point, vec4 bounds) {
        point.x = (point.x-bounds.x)/bounds.z; // 离左上角位置的X长比上纹理宽 0-1
        point.y = 1.0-(point.y-bounds.y)/bounds.w; // 离左上角位置的Y长比上高，因为纹理坐标是左下角起，所以要用1-
        return point;
    }`;

// path顶点着色器源码
const pathVertexSource = `
    attribute vec4 a_position;
    attribute vec2 a_text_coord;
    uniform vec2 a_center_point; // 当前canvas的中心位置
    uniform float a_point_size; // 点的大小
    varying  vec2 v_text_coord;

    ${convertPointSource}

    void main() {
        gl_PointSize = a_point_size;
        vec4 pos = translatePosition(a_position, a_center_point.x, a_center_point.y);
        gl_Position = pos;
        v_text_coord = a_text_coord;
    }
`;
// path 片段着色器源码
const pathFragmentSource = `
    precision highp float;
    uniform vec4 v_color;
    uniform int v_type;
    uniform sampler2D u_sample;
    uniform vec4 v_texture_bounds; // 纹理的左上坐标和大小 x,y,z,w
    varying  vec2 v_text_coord;

    ${convertTexturePosition}

    void main() {
        // 如果是fill，则直接填充颜色
        if(v_type == 1) {
            gl_FragColor = v_color;
        }
        else if(v_type == 2) {
            vec2 pos = translateTexturePosition(v_text_coord, v_texture_bounds);
            gl_FragColor = texture2D(u_sample, pos);
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
        this.useProgram();

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
            this.style.strokeStyle = this.graph.utils.rgbToDecimal(color);
            delete style.strokeStyle;
        }
        else if(style.fillStyle) {
            let color = style.fillStyle;
            if(typeof color === 'string') color = this.graph.utils.hexToRGBA(color);
            color = this.graph.utils.clone(color);
            this.style.fillStyle =  this.graph.utils.rgbToDecimal(color);
            delete style.fillStyle;
        }
        // 线宽
        if(style.lineWidth) {
            this.context.uniform1f(this.program.uniforms.a_point_size.location, style.lineWidth);// * this.graph.devicePixelRatio
        }

        this.style = {
            ...this.style,
            ...style
        }
    }

    setBounds(bounds = this.absoluteBounds) {

        //this.useProgram();

        if(bounds) this.absoluteBounds = bounds;
        // 写入当前canvas大小
        if(this.program.uniforms.a_center_point) {
            this.context.uniform2f(this.program.uniforms.a_center_point.location, this.graph.width / 2, this.graph.height / 2);
        }
    }

    beginDraw() {
        this.useProgram();
    }

    // 开始绘制
    draw(points, bounds = this.absoluteBounds) {
        this.useProgram();

        this.setBounds(bounds);
        
        this.points = points;
    }

    endDraw() {
        if(this.points) delete this.points;
        if(this.pathPoints) delete this.pathPoints;
    }

    // 图形封闭
    closePath() {
        if(this.points && this.points.length > 2 && this.points[0] !== this.points[this.points.length-1]) {
            const start = this.points[0];
            const end = this.points[this.points.length-1];
            if(start != end && !(start.x === end.x && start.y === end.y)) this.points.push(start);
        }
    }

    // 绘制点数组
    writePoints(points, attr = this.program.attrs.a_position) {
       
        const fixedPoints = [];
        for(const p of points) {
            fixedPoints.push(
                p.x + this.absoluteBounds.left,
                p.y + this.absoluteBounds.top
            );
        }
        const vertexBuffer = this.createFloat32Buffer(fixedPoints); 
        this.writeVertexAttrib(vertexBuffer, attr, 2, 0, 0);
        return vertexBuffer;
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

    // 把path坐标集合分解成一个个点，并且处理moveTo线段能力
    pathToPoints(points=this.points) {
        let start = null;
        const res = [];
        for(let i=0; i<points.length; i++) {
            const p = points[i];
            if(start && !p.m) {
                const linePoints = this.genLinePoints(start, p);
                res.push(...linePoints);
            }
            else if(start && !res.includes(start)) {
                res.push(start);
            }
            start = p;
        }
        if(!res.includes(start)) res.push(start);
        return res;
    }

    // 把path坐标集合转为线段集
    pathToLines(points) {
        let start = null;
        const res = [];
        for(let i=0; i<points.length; i++) {
            const p = points[i];
            // 不重合的二个点，组成线段
            if(start && !p.m && !(start.x == p.x && start.y == p.y)) {
                const line = {
                    start,
                    end: p
                };
                res.push(line);
            }
            start = p;
        }
        if(!res.includes(start)) res.push(start);
        return res;
    }

    // 计算二个线段的交点
    getIntersection(line1, line2) {
        // 三角形abc 面积的2倍
        const area_abc = (line1.start.x - line2.start.x) * (line1.end.y - line2.start.y) - (line1.start.y - line2.start.y) * (line1.end.x - line2.start.x);
        
        // 三角形abd 面积的2倍
        const area_abd = (line1.start.x - line2.end.x) * (line1.end.y - line2.end.y) - (line1.start.y - line2.end.y) * (line1.end.x - line2.end.x);
        
        // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
        if (area_abc*area_abd >= 0) {
            return null;
        }
        
        // 三角形cda 面积的2倍
        const area_cda = (line2.start.x - line1.start.x) * (line2.end.y - line1.start.y) - (line2.start.y - line1.start.y) * (line2.end.x - line1.start.x);
        // 三角形cdb 面积的2倍
        // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
        const area_cdb = area_cda + area_abc - area_abd ;
        if(area_cda * area_cdb >= 0) {
            return null ;
        }
        
        //计算交点坐标
        const t = area_cda / (area_abd - area_abc);
        const dx= t * (line1.end.x - line1.start.x);
        const dy= t * (line1.end.y - line1.start.y);

        return { 
            x: line1.start.x + dx , 
            y: line1.start.y + dy 
        };
    }

    // 画线条
    stroke() {
       // this.useProgram();

        if(this.style.strokeStyle) {
            const color = this.style.strokeStyle;
            this.context.uniform4f(this.program.uniforms.v_color.location, color.r, color.g, color.b, color.a * this.style.globalAlpha);
        }
        // 标注为stroke
        if(this.program.uniforms.v_type) {
            this.context.uniform1i(this.program.uniforms.v_type.location, 1);
        }
        if(this.points && this.points.length) {
            const points =this.pathToPoints(this.points);
            const buffer = this.writePoints(points);
            this.context.drawArrays(this.context.POINTS, 0, points.length);
            this.deleteBuffer(buffer);
        }
        
    }

    // 填充图形
    fill(type = 1) {
        //this.useProgram();

        if(this.style.fillStyle) {
            const color = this.style.fillStyle;
            this.context.uniform4f(this.program.uniforms.v_color.location, color.r, color.g, color.b, color.a * this.style.globalAlpha);
        }
        // 标注为fill
        this.context.uniform1i(this.program.uniforms.v_type.location, type);
        
        if(this.points && this.points.length) {
            let buffer = null;
            if(this.points.length > 3) {
                const lines = this.pathToLines(this.points); // 分解得到线段
                if(lines && lines.length > 2) {
                    
                }
                // 需要分割三角形，不然填充会有问题
                const triangles = this.earCutPoints(this.points);// 切割得到三角形顶点二维数组

                if(triangles && triangles.length) {
                    buffer = this.writePoints(this.points);
                    const indexBuffer = this.createUint16Buffer(triangles, this.context.ELEMENT_ARRAY_BUFFER);
                    this.context.drawElements(this.context.TRIANGLES, triangles.length, this.context.UNSIGNED_SHORT, 0);
                    this.deleteBuffer(indexBuffer);
                }
            }            
            else {
                buffer = this.writePoints(this.points);
                this.context.drawArrays(this.context.TRIANGLE_FAN, 0, this.points.length);
            }
            if(buffer) this.deleteBuffer(buffer);
/*
            for(const points of triangles) {
                this.writePoints(points);

                const indexBuffer = this.createUint16Buffer([0,1,2], this.context.ELEMENT_ARRAY_BUFFER);
                this.context.drawElements(this.context.TRIANGLES, 3, this.context.UNSIGNED_SHORT, 0);
                this.deleteBuffer(indexBuffer);
            }   */  
        }
    }

    // 填充图形
    drawImage(img, left=0, top=0, width=img.width, height=img.height) {
        width = width || img.width;
        height = height || img.height;

        //this.useProgram();

        // 设置纹理
        const texture = this.create2DTexture(img);
        this.context.uniform1i(this.program.uniforms.u_sample.location, 0); // 纹理单元传递给着色器
       
        // 指定纹理区域尺寸
        if(this.program.uniforms.v_texture_bounds) {
            this.context.uniform4f(this.program.uniforms.v_texture_bounds.location, 
                left + this.absoluteBounds.left,
                top + this.absoluteBounds.top,
                width,
                height,
                ); // 纹理单元传递给着色器
        }
        
        this.points = [
            {
                x: left,
                y: top
            },
            {
                x: left + width,
                y: top
            },
            {
                x: left + width,
                y: top + height
            },
             {
                x: left, 
                y: top + height
             }
        ];

        // 纹理坐标
        const coordBuffer = this.writePoints(this.points, this.program.attrs.a_text_coord);

        // 标注为纹理对象
       // 标注为fill
        this.context.uniform1i(this.program.uniforms.v_type.location, 2);
        if(this.points && this.points.length) {
            const buffer = this.writePoints(this.points);
            this.context.drawArrays(this.context.TRIANGLE_FAN, 0, this.points.length);
            this.deleteBuffer(buffer);
        }
        this.deleteBuffer(coordBuffer);
        this.deleteTexture(texture);
    }
}

export default WebglPath;
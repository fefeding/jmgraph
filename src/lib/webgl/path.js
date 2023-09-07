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
    uniform int a_type;
    varying  vec2 v_text_coord;
    varying  float v_type;

    ${convertPointSource}

    void main() {
        gl_PointSize = a_point_size;
        v_type = float(a_type);
        vec4 pos = translatePosition(a_position, a_center_point.x, a_center_point.y);
        gl_Position = pos;
        if(a_type == 2) {
            v_text_coord = a_text_coord;
        }
    }
`;
// path 片段着色器源码
const pathFragmentSource = `
    precision highp float;
    uniform vec4 v_color;
    uniform sampler2D u_sample;
    uniform vec4 v_texture_bounds; // 纹理的左上坐标和大小 x,y,z,w
    varying  float v_type;
    varying  vec2 v_text_coord;

    ${convertTexturePosition}

    void main() {
        // 如果是fill，则直接填充颜色
        if(v_type == 1.0) {
            gl_FragColor = v_color;
        }
        else if(v_type == 2.0) {
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
    }

    // i当前程序
    get program() {
        // 默认所有path用同一个编译好的program
        return this.graph.context.pathProgram || (this.graph.context.pathProgram=this.createProgram(pathVertexSource, pathFragmentSource));
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

    setParentBounds(parentBounds = this.parentAbsoluteBounds) {

        //this.useProgram();

        if(parentBounds) this.parentAbsoluteBounds = parentBounds;
        // 写入当前canvas大小
        this.context.uniform2f(this.program.uniforms.a_center_point.location, this.graph.width / 2, this.graph.height / 2);
    }

    beginDraw() {
        this.useProgram();
    }

    // 开始绘制
    draw(points, parentBounds = this.parentAbsoluteBounds) {
        //this.useProgram();

        this.setParentBounds(parentBounds);
        
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
                p.x + this.parentAbsoluteBounds.left,
                p.y + this.parentAbsoluteBounds.top
            );
        }
        const vertexBuffer = this.createFloat32Buffer(fixedPoints); 
        this.writeVertexAttrib(vertexBuffer, attr, 2, 0, 0);
        vertexBuffer.attr = attr;
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
        return res;
    }

    // 计算二个线段的交点
    getIntersection(line1, line2) {
        // 三角形abc 面积的2倍
        const area_abc = (line1.start.x - line2.start.x) * (line1.end.y - line2.start.y) - (line1.start.y - line2.start.y) * (line1.end.x - line2.start.x);
        
        // 三角形abd 面积的2倍
        const area_abd = (line1.start.x - line2.end.x) * (line1.end.y - line2.end.y) - (line1.start.y - line2.end.y) * (line1.end.x - line2.end.x);
        
        // 面积符号相同则两点在线段同侧,不相交 (=0表示在线段顶点上);
        if (area_abc*area_abd > 0) {
            return null;
        }
        
        // 三角形cda 面积的2倍
        const area_cda = (line2.start.x - line1.start.x) * (line2.end.y - line1.start.y) - (line2.start.y - line1.start.y) * (line2.end.x - line1.start.x);
        // 三角形cdb 面积的2倍
        // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
        const area_cdb = area_cda + area_abc - area_abd ;
        if(area_cda * area_cdb > 0) {
            return null ;
        }
        
        //计算交点坐标
        const t = area_cda / (area_abd - area_abc);
        const dx= t * (line1.end.x - line1.start.x);
        const dy= t * (line1.end.y - line1.start.y);

        return { 
            x: line1.start.x + dx, 
            y: line1.start.y + dy 
        };
    }

    // 根据路径点坐标，切割出封闭的多边形
    getPolygon(points) {
        const polygons = [];
        const lines = this.pathToLines(points); // 分解得到线段
        if(lines && lines.length > 2) {
            for(let i=0; i<lines.length-1; i++) {
                const line1 = lines[i];
                let polygon = [];// 当前图形
                let lastLine = line1; // 下一个还在连接状态的线
                for(let j=i+1; j<lines.length; j++) {
                    const line2 = lines[j];
                    // 如果跟下一条线相接，则表示还在形成图形中
                    if(lastLine.end.x === line2.start.x && lastLine.end.y === line2.start.y) {
                        polygon.push(lastLine.end);
                        lastLine = line2;
                    }
                    else {
                        polygon = [];
                    }                    
                    // 表示连线断开，如果还只是下一条线，后面逻辑没必要进行，2条线断开后就没有形成图形的可能
                    if(j === i+1) continue;
                    
                    const intersection = this.getIntersection(line1, line2);// 计算交点
                    if(intersection) {
                        polygon.push(intersection);// 交叉点为图形顶点
                        // 如果上一个连接线不是当前交叉线，则表示重新开始闭合
                        // 如果上一个连接线是当前交叉线，形成了封闭的图形
                        if(lastLine === line2 && polygon.length > 1) {
                            polygons.push(polygon);
                            
                            // 封闭后，下一个起始线条就是从交点开始计算起
                            lastLine = {
                                start: intersection,
                                end: line2.end
                            };

                            // 如果交点是上一条线的终点，则新图形为空
                            if(line2.end.x === intersection.x && line2.end.y === intersection.y) {
                                polygon = [];// 重新开始新一轮找图形
                            }
                            else {
                                polygon = [ intersection ];// 重新开始新一轮找图形
                            }
                        }
                        else {
                            lastLine = line2;
                        }
                    }
                }
            }
        }
        return polygons;
    }

    // 画线条
    stroke() {
       // this.useProgram();

        if(this.style.strokeStyle) {
            const color = this.style.strokeStyle;
            this.context.uniform4f(this.program.uniforms.v_color.location, color.r, color.g, color.b, color.a * this.style.globalAlpha);
        }
        // 标注为stroke
        if(this.program.uniforms.a_type) {
            this.context.uniform1i(this.program.uniforms.a_type.location, 1);
        }
        if(this.points && this.points.length) {
            const points =this.pathToPoints(this.points);
            const buffer = this.writePoints(points);
            this.context.drawArrays(this.context.POINTS, 0, points.length);
            this.deleteBuffer(buffer);
        }
        
    }

    // 填充图形
    fill(bounds = {left: 0, top: 0, width: 0, height: 0}, type = 1) {
        //this.useProgram();
        
        if(this.points && this.points.length) {
            
            // 如果是颜色rgba
            if(this.style.fillStyle && this.style.fillStyle.hasOwnProperty && 
                this.style.fillStyle.hasOwnProperty('r') && this.style.fillStyle.hasOwnProperty('g') && this.style.fillStyle.hasOwnProperty('b')) {

                const color = this.style.fillStyle;
                this.context.uniform4f(this.program.uniforms.v_color.location, color.r, color.g, color.b, color.a * this.style.globalAlpha);
            
                let filled = false;// 是否成功填充
                if(this.points.length > 3) {                
                    const polygons = this.getPolygon(this.points);
                    if(polygons.length) {
                        for(const polygon of polygons) {
                            // 需要分割三角形，不然填充会有问题
                            const triangles = this.earCutPoints(polygon);// 切割得到三角形顶点二维数组

                            if(triangles && triangles.length) {
                                const buffer = this.writePoints(polygon);
                                const indexBuffer = this.createUint16Buffer(triangles, this.context.ELEMENT_ARRAY_BUFFER);
                                this.context.drawElements(this.context.TRIANGLES, triangles.length, this.context.UNSIGNED_SHORT, 0);
                                this.deleteBuffer(indexBuffer);
                                this.deleteBuffer(buffer);
                                filled = true;// 表示已填充过了
                            }
                        }
                    }
                }   
                // 如果前面的条件没有填充成功，则直接按正常填充         
                if(!filled) {
                    this.fillColor(this.points, type);
                }
            }

            // 如果指定的是img，则采用填充图片的方式
            if(this.style.fillImage) {
                this.fillImage(this.style.fillImage, this.points, bounds);
            }
        }
    }

    fillColor(points, type=1) {
        // 标注为fill
        this.context.uniform1i(this.program.uniforms.a_type.location, type);

        const buffer = this.writePoints(points);
        this.context.drawArrays(this.context.TRIANGLE_FAN, 0, points.length);
        if(buffer) this.deleteBuffer(buffer);
    }

    // 填充图形
    drawImage(img, left=0, top=0, width=img.width, height=img.height) {
        width = width || img.width;
        height = height || img.height;

        //this.useProgram();

        this.fillImage(img, this.points, {
            left,
            top,
            width, 
            height
        });
    }

    // 区域填充图片
    // points绘制的图形顶点
    // 图片整体绘制区域
    fillImage(img, points, bounds) {
        // 设置纹理
        const texture = this.create2DTexture(img);
        this.context.uniform1i(this.program.uniforms.u_sample.location, 0); // 纹理单元传递给着色器

        // 指定纹理区域尺寸
        this.context.uniform4f(this.program.uniforms.v_texture_bounds.location, 
            bounds.left + this.parentAbsoluteBounds.left,
            bounds.top + this.parentAbsoluteBounds.top,
            bounds.width,
            bounds.height,
        ); // 纹理单元传递给着色器

        // 标注为纹理对象
        this.context.uniform1i(this.program.uniforms.a_type.location, 2);

        let filled = false;// 是否成功填充
        if(points.length > 3) {                
            const polygons = this.getPolygon(points);
            if(polygons.length) {
                for(const polygon of polygons) {
                    // 需要分割三角形，不然填充会有问题
                    const triangles = this.earCutPointsToTriangles(polygon);// 切割得到三角形顶点二维数组

                    if(triangles && triangles.length) {
                        for(const triangle of triangles) {
                            this.fillTexture(triangle); // 单独为每个分割的图形填充
                        }
                        filled = true;// 表示已填充过了
                    }
                }
            }
        }   
        // 如果前面的条件没有填充成功，则直接按正常填充         
        if(!filled) {
            this.fillTexture(points);
        }
        this.deleteTexture(texture);
    }
    fillTexture(points) {
        // 纹理坐标
        const coordBuffer = this.writePoints(points, this.program.attrs.a_text_coord);

        
        if(points && points.length) {
            const buffer = this.writePoints(points);
            this.context.drawArrays(this.context.TRIANGLE_FAN, 0, points.length);
            this.deleteBuffer(buffer);
        }
        this.disableVertexAttribArray(coordBuffer.attr);
        this.deleteBuffer(coordBuffer);        
    }
}

export default WebglPath;
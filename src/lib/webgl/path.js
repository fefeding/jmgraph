import WebglBase, { MAX_STOPS } from './base.js';
import earcut from '../earcut.js';

// path 绘制类
class WebglPath extends WebglBase {
    constructor(graph, option) {
        super(graph, option);
        // 是否是规则的，不规则的处理方式更为复杂和耗性能
        this.isRegular = option.isRegular || false;
        this.needCut = option.needCut || false;
        this.control = option.control;
        this.points = [];
        // 缓存 buffer 和纹理，避免每帧创建/销毁
        this.__cachedBuffers = [];
        this.__cachedTexture = null;
        this.__cachedTextureKey = null;
    }

    // 释放缓存的 WebGL 资源
    dispose() {
        for(const buf of this.__cachedBuffers) {
            this.deleteBuffer(buf);
        }
        this.__cachedBuffers = [];
        if(this.__cachedTexture) {
            this.deleteTexture(this.__cachedTexture);
            this.__cachedTexture = null;
            this.__cachedTextureKey = null;
        }
    }

    // 获取或创建 buffer，优先复用缓存
    getOrCreateBuffer(data, attr) {
        let buffer = this.__cachedBuffers.find(b => b.attr === attr);
        if(buffer) {
            const gl = this.context;
            const float32 = new Float32Array(data);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, float32, gl.DYNAMIC_DRAW);
            buffer.data = data;
            return buffer;
        }
        buffer = this.createFloat32Buffer(data);
        buffer.attr = attr;
        this.__cachedBuffers.push(buffer);
        return buffer;
    }

    // 应用变换到点
    applyTransform(point) {
        return super.applyTransform(point);
    }

    setParentBounds(parentBounds = this.parentAbsoluteBounds) {

        //this.useProgram();

        if(parentBounds) this.parentAbsoluteBounds = parentBounds;
        // 缓存中心点值，只在变化时才更新 uniform
        const cx = this.graph.width / 2;
        const cy = this.graph.height / 2;
        if(this.__lastCenterX !== cx || this.__lastCenterY !== cy) {
            this.context.uniform2f(this.program.uniforms.a_center_point.location, cx, cy);
            this.__lastCenterX = cx;
            this.__lastCenterY = cy;
        }
    }

    setFragColor(color) {
        
        if(!Array.isArray(color)) {
            color = this.convertColor(color);
            if(typeof color.a === 'undefined') color.a = 1;
            this.context.uniform4f(this.program.uniforms.v_single_color.location, color.r, color.g, color.b, color.a * this.style.globalAlpha);
            return null;
        }

        const colorData = [];
        for(let c of color) {
            c = this.convertColor(c);
            if(typeof c.a === 'undefined') c.a = 1;
            colorData.push(c.r, c.g, c.b, c.a * this.style.globalAlpha);
        }
        
        const colorBuffer = this.createFloat32Buffer(colorData); 
        this.writeVertexAttrib(colorBuffer, this.program.attrs.a_color, 4, 0, 0);
        colorBuffer.attr = this.program.attrs.a_color;
        return colorBuffer;
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
        // 缓存的纹理保留到下次绘制（渐变可能不变）
    }

    // 图形封闭
    closePath() {
        if(this.points && this.points.length > 2 && this.points[0] !== this.points[this.points.length-1]) {
            const start = this.points[0];
            const end = this.points[this.points.length-1];
            if(start != end && !(start.x === end.x && start.y === end.y)) this.points.push(start);
        }
    }

    // 绘制点数组（使用 DYNAMIC_DRAW 复用 buffer，避免每帧 create/delete）
    writePoints(points, attr = this.program.attrs.a_position) {
        const fixedPoints = [];
        const [a, b, c, d, tx, ty] = this.transformMatrix;
        const isIdentity = (a === 1 && b === 0 && c === 0 && d === 1 && tx === 0 && ty === 0);
        const offsetLeft = this.parentAbsoluteBounds.left;
        const offsetTop = this.parentAbsoluteBounds.top;

        if(isIdentity) {
            // 单位矩阵时直接加偏移，避免逐点调用 applyTransform
            for(let i = 0; i < points.length; i++) {
                fixedPoints.push(points[i].x + offsetLeft, points[i].y + offsetTop);
            }
        } else {
            for(const p of points) {
                const transformedPoint = this.applyTransform(p);
                fixedPoints.push(
                    transformedPoint.x + offsetLeft,
                    transformedPoint.y + offsetTop
                );
            }
        }
        const float32 = new Float32Array(fixedPoints);
        const gl = this.context;

        // 复用已有 buffer 或创建新的
        if(this.__cachedBuffers.length > 0) {
            // 找一个同 attr 的 buffer 复用
            let buffer = this.__cachedBuffers.find(b => b.attr === attr);
            if(buffer) {
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
                gl.bufferData(gl.ARRAY_BUFFER, float32, gl.DYNAMIC_DRAW);
                buffer.data = fixedPoints;
                this.writeVertexAttrib(buffer, attr, 2, 0, 0);
                return buffer;
            }
        }
        const vertexBuffer = this.createFloat32Buffer(float32, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW); 
        this.writeVertexAttrib(vertexBuffer, attr, 2, 0, 0);
        vertexBuffer.attr = attr;
        this.__cachedBuffers.push(vertexBuffer);
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
            const step = 0.5;
            for(let l=step; l<len; l+=step) {
                const x = start.x + cos * l;
                const y = start.y + sin * l;
                points.push({
                    x, 
                    y
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
    // 二点是否重合
    equalPoint(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
    }

    // 将带 moveTo 标记的点集拆分为外轮廓和多个洞
    splitSubPaths(points) {
        const subPaths = [];
        let current = [];
        for(let i = 0; i < points.length; i++) {
            const p = points[i];
            if(p.m && current.length > 0) {
                subPaths.push(current);
                current = [];
            }
            current.push(p);
        }
        if(current.length > 0) subPaths.push(current);

        // 面积最大的作为外轮廓，其余作为洞
        let maxArea = -1;
        let outerIdx = 0;
        for(let i = 0; i < subPaths.length; i++) {
            const area = Math.abs(this.polygonArea(subPaths[i]));
            if(area > maxArea) {
                maxArea = area;
                outerIdx = i;
            }
        }

        const outerPoints = subPaths[outerIdx];
        const holes = [];
        for(let i = 0; i < subPaths.length; i++) {
            if(i !== outerIdx) holes.push(subPaths[i]);
        }
        return { outerPoints, holes };
    }

    // 计算多边形面积（Shoelace 公式）
    polygonArea(points) {
        let area = 0;
        const n = points.length;
        for(let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            area += points[i].x * points[j].y;
            area -= points[j].x * points[i].y;
        }
        return area / 2;
    }

    // 使用 earcut 带 holes 填充多边形
    fillWithHoles(outerPoints, holes, isTexture = false) {
        // 将所有点合并：外轮廓 + 各个洞，并记录洞的起始索引
        const allPoints = [...outerPoints];
        const holeIndices = [];
        for(const hole of holes) {
            holeIndices.push(allPoints.length);
            allPoints.push(...hole);
        }

        const dim = 2;
        const vertexData = [];
        for(const p of allPoints) {
            vertexData.push(p.x, p.y);
        }

        // 用 earcut 进行带洞三角化
        const indices = earcut(vertexData, holeIndices, dim);

        if(!indices || indices.length < 3) return;

        // 构建 GPU 顶点数据
        const allVertices = [];
        const allTexCoords = [];
        for(let i = 0; i < indices.length; i++) {
            const p = allPoints[indices[i]];
            allVertices.push(p.x, p.y);
            if(isTexture) allTexCoords.push(p.x, p.y);
        }

        const gl = this.context;
        const vertexArr = new Float32Array(allVertices);

        let posBuffer = this.__cachedBuffers.find(b => b.attr === this.program.attrs.a_position);
        if(!posBuffer) {
            posBuffer = this.createFloat32Buffer(vertexArr, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
            posBuffer.attr = this.program.attrs.a_position;
            this.__cachedBuffers.push(posBuffer);
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertexArr, gl.DYNAMIC_DRAW);
        }
        this.writeVertexAttrib(posBuffer, this.program.attrs.a_position, 2, 0, 0);

        if(isTexture && allTexCoords.length) {
            const texData = new Float32Array(allTexCoords);
            let texBuffer = this.__cachedBuffers.find(b => b.attr === this.program.attrs.a_text_coord);
            if(!texBuffer) {
                texBuffer = this.createFloat32Buffer(texData, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
                texBuffer.attr = this.program.attrs.a_text_coord;
                this.__cachedBuffers.push(texBuffer);
            } else {
                gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer.buffer);
                gl.bufferData(gl.ARRAY_BUFFER, texData, gl.DYNAMIC_DRAW);
            }
            this.writeVertexAttrib(texBuffer, this.program.attrs.a_text_coord, 2, 0, 0);
        }

        gl.drawArrays(gl.TRIANGLES, 0, allVertices.length / 2);
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
                    end: p,
                };
                res.push(line);
            }
            start = p;
        }
        return res;
    }

    // 裁剪线段，如果二段线段有交点，则分割成四段， 端头相交的线段不用分割
    cutLines(lines, index1=0, index2=0) {
        if(lines && lines.length < 3) return lines;
        
        index2 = Math.max(index1 + 1, index2); //如果指定了比下一个更大的索引，则用更大的，说明前面的已经处理过了，不需要重复

        // 找出线段相交的点，并切割线段
        while(index1 < lines.length) {
            const line1 = lines[index1];

            while(index2 < lines.length) {
                const line2 = lines[index2];
                // 如果二条线顶点有重合，则不用处理
                if(this.equalPoint(line1.start, line2.start) || this.equalPoint(line1.end, line2.end) || 
                this.equalPoint(line1.start, line2.end) || this.equalPoint(line1.end, line2.start)) {
                    index2++;
                    continue;
                }
                let cuted = false;
                const intersection = this.getIntersection(line1, line2);// 计算交点
                if(intersection) {
                    // 如果交点不是线段的端点，则分割成二条线段
                    if(!this.equalPoint(line1.start, intersection) && !this.equalPoint(line1.end, intersection)) {
                        const sub1 = {
                            start: line1.start,
                            end: intersection
                        };
                        const sub2 = {
                            start: intersection,
                            end: line1.end
                        };
                        // 从原数组中删除当前线段，替换成新的线段
                        lines.splice(index1, 1, sub1, sub2);
                        // 当前线段被重新替换，需要重新从它开始处理
                        cuted = true;
                        index2 ++;// 因为多加入了一个线段，则对比线索引需要加1
                    }
                    // 如果交点不是线段的端点，则分割成二条线段
                    if(!this.equalPoint(line2.start, intersection) && !this.equalPoint(line2.end, intersection)) {
                        const sub1 = {
                            start: line2.start,
                            end: intersection
                        };
                        const sub2 = {
                            start: intersection,
                            end: line2.end
                        };
                        // 从原数组中删除当前线段，替换成新的线段
                        lines.splice(index2, 1, sub1, sub2);
                        index2 ++; // 线段2也切成了二段，对比索引要继续加1
                    }
                }
                index2++;
                // 如果已经分割了起始线段，则第一个子线段开始，重新对比后面还未对比完的。直接所有对比完成返回
                if(cuted) return this.cutLines(lines, index1, index2);
            }
            index1++;
            index2 = index1 + 1;
        }
        return lines;
    }

    // 计算二个线段的交点
    getIntersection(line1, line2) {
        // 如果首尾相接，也认为是有交点
        if(this.equalPoint(line1.start, line2.start) || this.equalPoint(line1.start, line2.end)) return line1.start;
        if(this.equalPoint(line1.end, line2.start) || this.equalPoint(line1.end, line2.end)) return line1.end;

        // 三角形abc 面积的2倍
        const area_abc = (line1.start.x - line2.start.x) * (line1.end.y - line2.start.y) - (line1.start.y - line2.start.y) * (line1.end.x - line2.start.x);
        
        // 三角形abd 面积的2倍
        const area_abd = (line1.start.x - line2.end.x) * (line1.end.y - line2.end.y) - (line1.start.y - line2.end.y) * (line1.end.x - line2.end.x);
        
        // 面积符号相同则两点在线段同侧,不相交 (=0表示在线段顶点上);
        if (area_abc * area_abd > 0) {
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
        if(area_abd === area_abc) return null;

        //计算交点坐标
        const t = area_cda / (area_abd - area_abc);
        const dx= t * (line1.end.x - line1.start.x);
        const dy= t * (line1.end.y - line1.start.y);

        return { 
            x: line1.start.x + dx, 
            y: line1.start.y + dy
        };
    }

    // 找出跟当前线段尾部相交的所有线段
    getIntersectionLines(line, lines, index, point=line.end, points=[], root=null) {
        const res = {
            line,
            polygons: []
        };
        
        points.push(point);
        
        if(root && this.equalPoint(root.line.start, point)) {
            points.unshift(root.line.start); // 把起始地址加入进去
            root.polygons.push(points);
            return res;
        }

        for(;index<lines.length; index++) {
            const l = lines[index];
            if(this.equalPoint(point, l.start)) {      
                if(points.includes(l.end)) continue;          
                this.getIntersectionLines(l, lines, index+1, l.end, [...points], root||res);
            }
            else if(this.equalPoint(point, l.end)) {
                if(points.includes(l.start)) continue;     
                this.getIntersectionLines(l, lines, index+1, l.start, [...points], root||res);
            }
        }
        return res;
    }

    // 根据路径点坐标，切割出封闭的多边形
    getPolygon(points) {
        let polygons = [];
        let lines = this.pathToLines(points); // 分解得到线段
        if(lines && lines.length > 2) {
            lines = this.cutLines(lines); // 把所有相交点切割线段找出来
            for(let i=0; i<lines.length-1; i++) {
                const line1 = lines[i];
                let polygon = [];// 当前图形

                const treeLine = this.getIntersectionLines(line1, lines, i+1);
                
                if(treeLine.polygons.length) polygons.push(...treeLine.polygons);
                continue;
                let lastLine = line1; // 下一个还在连接状态的线
                for(let j=i+1; j<lines.length; j++) {
                    const line2 = lines[j];
                    // 如果跟下一条线相接，则表示还在形成图形中
                    if(this.equalPoint(lastLine.end, line2.start)) {
                        polygon.push(lastLine.end);
                        lastLine = line2;
                        if(i === j+1) continue; //下一条相连 则不需要处理相交情况
                    }
                    else {
                        polygon = [];
                    }  
                    // 因为前面进行了分割线段，则里只有处理端点相连的情况
                    const intersection = this.equalPoint(line1.start, line2.end)? line1.start: null;//this.getIntersection(line1, line2);// 计算交点
                    if(intersection) {
                        polygon.push(intersection);// 交叉点为图形顶点
                        // 如果上一个连接线不是当前交叉线，则表示重新开始闭合
                        // 如果上一个连接线是当前交叉线，形成了封闭的图形
                        if(lastLine === line2 && polygon.length > 1) {
                            polygons.push(polygon);
                            
                            // 封闭后，下一个起始线条就是从交点开始计算起
                            /*lastLine = {
                                start: intersection,
                                end: line2.end
                            };*/
                            polygon = [];// 重新开始新一轮找图形

                            /*
                            // 如果交点是上一条线的终点，则新图形为空
                            if(this.equalPoint(line2.end, intersection)) {
                                polygon = [];// 重新开始新一轮找图形
                            }
                            else {
                                // 同时交点也要加到上一个图形中第一个点，形成封闭
                                polygon.unshift(intersection);

                                polygon = [ intersection ];// 重新开始新一轮找图形
                            }*/
                        }
                        else {
                            lastLine = line2;
                        }
                    }
                }
            }
        }
        
        // 当有多个封闭图形时，再弟归一下，里面是不是有封闭图形内还有子封闭图形
        /*if(polygons.length > 1) {
            const newPolygons = [];
            for(const polygon of polygons) {
                // 只有大于4才有可能有子封闭图形
                if(polygon.length > 4) {
                    const childPolygons = this.getPolygon(polygon);
                    // 当有多个子图形时，表示它不是最终封闭图形，跳过，
                    // 因为它的子图形之前有加入的，不需要重复加入
                    if(childPolygons.length > 1) {
                        //newPolygons.push(...childPolygons);
                        continue;
                    }
                }
                newPolygons.push(polygon);
            }
            polygons = newPolygons;
        }*/
        return polygons;
    }

    // 分割成一个个规则的三角形，不规则的多边形不全割的话纹理就会没法正确覆盖
    getTriangles(points) {
        this.trianglesCache = this.trianglesCache||(this.trianglesCache={});
        // 快速缓存 key：用长度和首尾点坐标（比 JSON.stringify 快几个数量级）
        const len = points.length;
        const key = len + '_' + points[0].x + '_' + points[0].y + '_' + points[len-1].x + '_' + points[len-1].y;
        if(this.trianglesCache[key]) return this.trianglesCache[key];

        const res = [];
        const polygons = this.getPolygon(points);                
        if(polygons.length) {            
            for(const polygon of polygons) {
                // 需要分割三角形，不然填充会有问题
                const triangles = this.earCutPointsToTriangles(polygon);
                res.push(...triangles);
            }   
        }
        this.trianglesCache[key] = res;
        return res;
    }

    // 画线条
    stroke(points = this.points, color = this.style.strokeStyle, lineWidth = this.style.lineWidth) {
        if(!points || !points.length) return;
       // this.useProgram();

        let colorBuffer = null;
        if(color) {
            colorBuffer = this.setFragColor(color);
        }
        // 线宽
        if(lineWidth) {
            this.context.uniform1f(this.program.uniforms.a_point_size.location, lineWidth);// * this.graph.devicePixelRatio
        }
        // 标注为stroke
        if(this.program.uniforms.a_type) {
            // 4表示单画一个圆点，1表示方块形成的线条
            this.context.uniform1i(this.program.uniforms.a_type.location, points.length === 1? 4 :1);
        }
        if(points && points.length) {
            const regular = lineWidth <= 1.2;
            const hasMoveTo = points.some && points.some(p => p.m);
            const isRing = !hasMoveTo && this.needCut; // 空心形状（jmHArc close=true 时无 m 标记）
            if(regular && (hasMoveTo || isRing)) {
                // 有 moveTo 标记或空心形状时，分段绘制每个子路径的 LINE_LOOP
                // 避免 LINE_LOOP 把不同子路径的点连起来产生拉扯线
                if(hasMoveTo) {
                    let subPath = [];
                    for(let i = 0; i < points.length; i++) {
                        if(points[i].m && subPath.length > 0) {
                            const buffer = this.writePoints(subPath);
                            this.context.drawArrays(this.context.LINE_LOOP, 0, subPath.length);
                            subPath = [];
                        }
                        subPath.push(points[i]);
                    }
                    if(subPath.length > 1) {
                        const buffer = this.writePoints(subPath);
                        this.context.drawArrays(this.context.LINE_LOOP, 0, subPath.length);
                    }
                }
                else if(isRing) {
                    // 空心形状：前半段为内弧，后半段为外弧（反向），各自 LINE_LOOP
                    const mid = Math.floor(points.length / 2);
                    const inner = points.slice(0, mid);
                    const outer = points.slice(mid);
                    if(inner.length > 1) {
                        this.writePoints(inner);
                        this.context.drawArrays(this.context.LINE_LOOP, 0, inner.length);
                    }
                    if(outer.length > 1) {
                        this.writePoints(outer);
                        this.context.drawArrays(this.context.LINE_LOOP, 0, outer.length);
                    }
                }
            }
            else {
                points = regular? points : this.pathToPoints(points);
                const buffer = this.writePoints(points);
                this.context.drawArrays(regular? this.context.LINE_LOOP: this.context.POINTS, 0, points.length);
            }
            // buffer 由 endDraw 统一清理
        }
        colorBuffer && this.disableVertexAttribArray(colorBuffer && colorBuffer.attr);
    }

    // 填充图形
    fill(bounds = {left: 0, top: 0, width: 0, height: 0}, type = 1) {
       
        if(this.points && this.points.length) {            
            // 如果是颜色rgba
            if(this.style.fillStyle) {            
                this.fillColor(this.style.fillStyle, this.points, bounds, type);
            }
            if(this.style.fillImage) {            
                this.fillImage(this.style.fillImage, this.points, bounds, type); 
            }
        }
    }

    fillColor(color, points, bounds, type=1) {
        
        // 如果是渐变色，使用 GLSL 着色器直接计算
        if(this.isGradient(color)) {
            return this.fillGradient(color, points, bounds);
        }
        
        // 标注为fill
        this.context.uniform1i(this.program.uniforms.a_type.location, type);
        const colorBuffer = this.setFragColor(color);

        this.fillPolygons(points);                

        colorBuffer && this.disableVertexAttribArray(colorBuffer && colorBuffer.attr);

    }

    /**
     * 使用 GLSL 着色器渲染渐变填充
     * 无需 textureCanvas，直接通过 uniform 传递渐变参数给 GPU
     */
    fillGradient(gradient, points, bounds) {
        const params = gradient.toUniformParams();
        if(!params) return;

        // 标注为 GLSL 渐变 (type=5)
        this.context.uniform1i(this.program.uniforms.a_type.location, 5);

        // 设置 globalAlpha（通过 v_single_color.a 传递给着色器）
        this.context.uniform4f(this.program.uniforms.v_single_color.location, 1.0, 1.0, 1.0, this.style.globalAlpha);

        // 设置渐变类型
        if(this.program.uniforms.u_gradient_type) {
            this.context.uniform1i(this.program.uniforms.u_gradient_type.location, params.gradientType);
        }

        // 设置渐变起点/终点
        if(this.program.uniforms.u_gradient_start) {
            this.context.uniform4fv(this.program.uniforms.u_gradient_start.location, params.gradientStart);
        }
        if(this.program.uniforms.u_gradient_end) {
            this.context.uniform4fv(this.program.uniforms.u_gradient_end.location, params.gradientEnd);
        }

        // 设置颜色断点数量
        if(this.program.uniforms.u_gradient_stop_count) {
            this.context.uniform1i(this.program.uniforms.u_gradient_stop_count.location, params.stopCount);
        }

        // 设置每个 stop 的 offset
        // 关键：必须填充完整的 MAX_STOPS 长度数组，否则未初始化元素默认为 0
        // 会导致着色器循环中 t >= 0 始终为 true，返回黑色
        if(this.program.uniforms.u_gradient_offsets) {
            const offsets = new Float32Array(MAX_STOPS);
            for(let i = 0; i < params.stopCount; i++) {
                offsets[i] = params.stops[i * 5];
            }
            // 用 2.0 填充剩余项，使 t(0~1) >= 2.0 为 false，不会被匹配
            for(let i = params.stopCount; i < MAX_STOPS; i++) {
                offsets[i] = 2.0;
            }
            this.context.uniform1fv(this.program.uniforms.u_gradient_offsets.location, offsets);
        }

        // 设置每个 stop 的颜色 (rgba)
        if(this.program.uniforms.u_gradient_colors) {
            const colors = new Float32Array(MAX_STOPS * 4);
            for(let i = 0; i < params.stopCount; i++) {
                colors[i * 4 + 0] = params.stops[i * 5 + 1]; // r
                colors[i * 4 + 1] = params.stops[i * 5 + 2]; // g
                colors[i * 4 + 2] = params.stops[i * 5 + 3]; // b
                colors[i * 4 + 3] = params.stops[i * 5 + 4]; // a
            }
            // 用最后一个 stop 的颜色填充剩余项，确保不会返回黑色
            if(params.stopCount > 0) {
                const lastR = params.stops[(params.stopCount - 1) * 5 + 1];
                const lastG = params.stops[(params.stopCount - 1) * 5 + 2];
                const lastB = params.stops[(params.stopCount - 1) * 5 + 3];
                const lastA = params.stops[(params.stopCount - 1) * 5 + 4];
                for(let i = params.stopCount; i < MAX_STOPS; i++) {
                    colors[i * 4 + 0] = lastR;
                    colors[i * 4 + 1] = lastG;
                    colors[i * 4 + 2] = lastB;
                    colors[i * 4 + 3] = lastA;
                }
            }
            this.context.uniform4fv(this.program.uniforms.u_gradient_colors.location, colors);
        }

        // 填充多边形（需要纹理坐标来计算渐变位置）
        this.fillPolygons(points, true);
        this.disableVertexAttribArray(this.program.attrs.a_text_coord);
    }

    // 区域填充图片
    // points绘制的图形顶点
    // 图片整体绘制区域
    fillImage(img, points, bounds) {
        if(!img) return;

        // 对于 ImageData，生成缓存 key（基于渐变参数或 bounds），复用纹理
        let texture = null;
        if(img instanceof ImageData) {
            const key = `${img.width}_${img.height}_${bounds.width}_${bounds.height}_${bounds.left}_${bounds.top}`;
            if(this.__cachedTexture && this.__cachedTextureKey === key) {
                texture = this.__cachedTexture;
            } else {
                texture = this.createDataTexture(img);
                // 释放旧纹理
                if(this.__cachedTexture) {
                    this.deleteTexture(this.__cachedTexture);
                }
                this.__cachedTexture = texture;
                this.__cachedTextureKey = key;
            }
        } else {
            texture = this.createImgTexture(img);
        }
        this.context.uniform1i(this.program.uniforms.u_sample.location, 0); // 纹理单元传递给着色器

        // 指定纹理区域尺寸
        this.context.uniform4f(this.program.uniforms.v_texture_bounds.location, 
            bounds.left + this.parentAbsoluteBounds.left,
            bounds.top + this.parentAbsoluteBounds.top,
            bounds.width,
            bounds.height,
        ); // 纹理单元传递给着色器

        this.fillTexture(points);
        
        // 仅对非缓存纹理（非 ImageData）立即删除
        if(!(img instanceof ImageData)) {
            this.deleteTexture(texture);
        }
    }

    fillTexture(points) {        
        if(points && points.length) {  // 标注为纹理对象
            this.context.uniform1i(this.program.uniforms.a_type.location, 2);  
            // 纹理坐标
            //const coordBuffer = this.writePoints(points, this.program.attrs.a_text_coord);
            this.fillPolygons(points, true);
            //this.deleteBuffer(coordBuffer);  
            this.disableVertexAttribArray(this.program.attrs.a_text_coord);   
        } 
    }

    // 进行多边形填充
    fillPolygons(points, isTexture = false) {   
        if(points.length <= 3) {
            // 3个点以下的三角形直接画
            const buffer = this.writePoints(points);
            const coordBuffer = isTexture? this.writePoints(points, this.program.attrs.a_text_coord): null;
            this.context.drawArrays(this.context.TRIANGLE_FAN, 0, points.length);
            return;
        }

        // 规则图形（凸多边形，如圆）：直接用 TRIANGLE_FAN 一次性绘制，无需 earcut
        if(this.isRegular) {
            // 检查是否有 moveTo 标记，如果有说明路径包含多个子路径（如空心圆弧 jmHArc）
            const hasMoveTo = points.some && points.some(p => p.m);
            if(hasMoveTo) {
                // 有 m 标记：按 m 标记拆分子路径
                const { outerPoints, holes } = this.splitSubPaths(points);
                this.fillWithHoles(outerPoints, holes, isTexture);
                return;
            }
            // 无 m 标记但 needCut=true 表示空心形状（如 jmHArc close=true）
            // 前半段为内弧，后半段为外弧（反向），按中点拆分
            if(this.needCut && points.length >= 6) {
                const mid = Math.floor(points.length / 2);
                const inner = points.slice(0, mid);
                const outer = points.slice(mid);
                const innerArea = Math.abs(this.polygonArea(inner));
                const outerArea = Math.abs(this.polygonArea(outer));
                if(outerArea >= innerArea) {
                    this.fillWithHoles(outer, [inner], isTexture);
                } else {
                    this.fillWithHoles(inner, [outer], isTexture);
                }
                return;
            }
            const buffer = this.writePoints(points);
            const coordBuffer = isTexture? this.writePoints(points, this.program.attrs.a_text_coord): null;
            this.context.drawArrays(this.context.TRIANGLE_FAN, 0, points.length);
            return;
        }

        // 不规则图形：需要 earcut 三角化后，合并为一个大的顶点缓冲区，单次 drawArrays
        const triangles = this.needCut? this.earCutPointsToTriangles(points): this.getTriangles(points);
        if(!triangles.length) return;

        // 合并所有三角形的顶点到一个数组
        const allVertices = [];
        const allTexCoords = [];
        for(const triangle of triangles) {
            for(const p of triangle) {
                allVertices.push(p.x, p.y);
                if(isTexture) allTexCoords.push(p.x, p.y);
            }
        }

        // 一次性上传所有数据并绘制
        const vertexData = new Float32Array(allVertices);
        const gl = this.context;

        // 复用或创建 position buffer
        let posBuffer = this.__cachedBuffers.find(b => b.attr === this.program.attrs.a_position);
        if(!posBuffer) {
            posBuffer = this.createFloat32Buffer(vertexData, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
            posBuffer.attr = this.program.attrs.a_position;
            this.__cachedBuffers.push(posBuffer);
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.DYNAMIC_DRAW);
        }
        this.writeVertexAttrib(posBuffer, this.program.attrs.a_position, 2, 0, 0);

        if(isTexture && allTexCoords.length) {
            const texData = new Float32Array(allTexCoords);
            let texBuffer = this.__cachedBuffers.find(b => b.attr === this.program.attrs.a_text_coord);
            if(!texBuffer) {
                texBuffer = this.createFloat32Buffer(texData, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
                texBuffer.attr = this.program.attrs.a_text_coord;
                this.__cachedBuffers.push(texBuffer);
            } else {
                gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer.buffer);
                gl.bufferData(gl.ARRAY_BUFFER, texData, gl.DYNAMIC_DRAW);
            }
            this.writeVertexAttrib(texBuffer, this.program.attrs.a_text_coord, 2, 0, 0);
        }

        gl.drawArrays(gl.TRIANGLES, 0, allVertices.length / 2);
    }

    // 填充图形
    drawImage(img, left=0, top=0, width=img.width, height=img.height) {
        width = width || img.width;
        height = height || img.height;

        this.fillImage(img, this.points, {
            left,
            top,
            width, 
            height
        });
    }

    drawText(text, x, y, bounds) {
        // 文本渲染仍需要 2D canvas 绘制字形，然后作为纹理上传
        // 使用临时 canvas，不依赖共享的 textureCanvas
        if(!bounds.width || !bounds.height) return null;
        if(typeof document === 'undefined') return null;

        let canvas = this.__textCanvas;
        if(!canvas) {
            canvas = document.createElement('canvas');
            this.__textCanvas = canvas;
        }
        canvas.width = bounds.width;
        canvas.height = bounds.height;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 修改字体
        ctx.font = this.style.font || (this.style.fontSize + 'px ' + this.style.fontFamily);

        x -= bounds.left;
        y -= bounds.top;

        // 设置文本样式
        if(this.style.fillStyle) {
            ctx.fillStyle = this.graph.utils.toColor(this.style.fillStyle);
        }
        if(this.style.strokeStyle) {
            ctx.strokeStyle = this.graph.utils.toColor(this.style.strokeStyle);
        }
        if(this.style.shadowColor) {
            ctx.shadowColor = this.graph.utils.toColor(this.style.shadowColor);
        }
        if(this.style.shadowBlur) {
            ctx.shadowBlur = this.style.shadowBlur;
        }
        if(this.style.shadowOffsetX !== undefined) {
            ctx.shadowOffsetX = this.style.shadowOffsetX;
        }
        if(this.style.shadowOffsetY !== undefined) {
            ctx.shadowOffsetY = this.style.shadowOffsetY;
        }
        if(this.style.textAlign) {
            ctx.textAlign = this.style.textAlign;
        }
        if(this.style.textBaseline) {
            ctx.textBaseline = this.style.textBaseline;
        }

        if(this.style.fillStyle && ctx.fillText) {
            if(this.style.maxWidth) {
                ctx.fillText(text, x, y, this.style.maxWidth);
            }
            else {
                ctx.fillText(text, x, y);
            }
        }
        if(this.style.strokeStyle && ctx.strokeText) {
            if(this.style.maxWidth) {
                ctx.strokeText(text, x, y, this.style.maxWidth);
            }
            else {
                ctx.strokeText(text, x, y);
            }
        }

        // 用纹理图片代替文字
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.fillImage(data, this.points, bounds);
    }
}

export default WebglPath;
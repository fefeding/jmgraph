jmGraph
=========

[![Latest NPM release][npm-badge]][npm-badge-url]
[![License][license-badge]][license-badge-url]

基于CANVAS的简单画图组件  
`让你用类似于dom的方式，在canvas上画图，感觉会不会很爽。`

主页：[http://graph.jm47.com/](http://graph.jm47.com/)  
示例：[http://graph.jm47.com/example/index.html](http://graph.jm47.com/example/index.html)

入门
--------

下载jmGraph.min.js代码，并引用到你的html中。
```html
<script type="text/javascript" src="../dist/jmGraph.min.js"></script>	
```

在dom中添加一个`div或canvas`，然后初始化jmGraph。
```html
<div id="mycanvas_container"></div>
<script type="text/javascript">	
    //也可以是一个dom对象或一个jquery对象 
    //例如：$('#mycanvas_container') || document.getElementById('mycanvas_container')
    var container = 'mycanvas_container';

    // 用Promise方式
    /*jmGraph(container, {
        width: 800,
        height: 600
    }).then((g)=>{
        //g就是一个jmGraph实例
        init(g);
    });	*/
    
    var g = new jmGraph(container, {
        width: 800,
        height: 600,
        //样式，规则请参照样式说明
        style: {
            fill: '#000' //指定背景色
        }
    });
</script>
```
在画布上画一个方块
```javascript

function init(g){
    var style = {
        stroke:'#46BF86',
        lineWidth: 2
    };
    style.shadow = '0,0,10,#fff';//阴影
    //style.opacity = 0.2;			
    //style.lineCap = 'round';

    //创建一个方块
    var rect = g.createShape('rect',{
        style:style,
        position: {x:100,y:100}, //左上角坐标
        width:100,
        height:100
    });
    g.children.add(rect);

    //绘制，可以用requestAnimationFrame动态刷新
    function update() {
        g.redraw();
        //requestAnimationFrame(update);
    }
    update();
}
```

样式
---

样式可以直接用`canvas`支持的名称，也可以用本组件简化后的。

#### 样式一览
| 简化名称 | 原生名称 | 说明
| :- | :- | :- | 
| fill | fillStyle | 用于填充绘画的颜色、渐变或模式
| stroke | strokeStyle | 用于笔触的颜色、渐变或模式
| shadow | 没有对应的 | 最终会解析成以下几个属性，格式：'0,0,10,#fff'或g.createShadow(0,0,20,'#000');
| shadow.blur | shadowBlur | 用于阴影的模糊级别
| shadow.x | shadowOffsetX | 阴影距形状的水平距离
| shadow.y | shadowOffsetY | 阴影距形状的垂直距离
| shadow.color | shadowColor | 阴影颜色，格式：'#000'、'#46BF86'、'rgb(255,255,255)'或'rgba(39,72,188,0.5)'
| lineWidth | lineWidth | 当前的线条宽度
| miterLimit | miterLimit | 最大斜接长度
| font | font | 文本内容的当前字体属性
| opacity | globalAlpha | 绘图的当前 alpha 或透明值
| textAlign | textAlign | 文本内容的当前对齐方式
| textBaseline | textBaseline | 在绘制文本时使用的当前文本基线
| lineJoin | lineJoin | 两条线相交时，所创建的拐角类型：miter(默认，尖角),bevel(斜角),round（圆角）
| lineCap | lineCap | 线条的结束端点样式：butt(默认，平),round(圆),square（方）


事件
---

事件的绑定函数：`bind/unbind`  
示例：
```javascript
//创建一条线
var line = graph.createLine({x:10,y:200},{x:80,y:120},style);
//鼠标移到上面显示不同的样式			
line.bind('mouseover',function(evt) {
    this.style.stroke = 'rgba(39,72,188,0.5)';
    this.cursor('pointer');
    this.neadUpdate = true; //需要刷新
});
```

#### 事件一览
| 名称 | 说明 | 回调参数
| :- | :- | :- | 
| mousedown | 鼠标按下时触发 | -
| mousemove | 鼠标在对象上移动时触发 |{target:当前元素,position: 当前位置}
| mouseover | 鼠标从某元素移开 | {target:当前元素}
| mouseleave | 某个鼠标按键被松开 | -
| mouseup | 某个鼠标按键被松开 | -
| dblclick | 鼠标双击某个对象 | -
| click | 鼠标点击某个对象 | -
| touchstart | 触控开始 | position: 当前位置
| touchmove | 触控移动手指 | position: 当前位置
| touchend | 触控结束 | position: 当前位置


自定义控件
---
大多数控件直接继承`jmPath`即可，然后通过实现`initPoints`来绘制当前控件。  
`当需要从某点重新开始画时，给点指定m属性为true，表示移到当前点。`  


#### 示例
来画一个X  
在线示例：[http://graph.jm47.com/example/controls/test.html](http://graph.jm47.com/example/controls/test.html)
```javascript
function jmTest(graph,params) {
    if(!params) params = {};
    this.points = params.points || [];
    var style = params.style || {};
    
    this.type = 'jmTest';
    this.graph = graph;
        
    this.center = params.center || {x:0,y:0};
    this.radius = params.radius || 0;

    this.initializing(graph.context, style);
}
jmUtils.extend(jmTest, jmPath);//jmPath

//定义属性

/**
 * 中心点
 * point格式：{x:0,y:0,m:true}
 * @property center
 * @type {point}
 */
jmUtils.createProperty(jmTest.prototype, 'center');

/**
 * 半径
 * @property radius
 * @type {number}
 */
jmUtils.createProperty(jmTest.prototype, 'radius', 0);


/**
 * 初始化图形点
 * 控件都是由点形成
 * 
 * @method initPoint
 * @private
 * @for jmArc
 */
jmTest.prototype.initPoints = function() {
    //可以获取当前控件的左上坐标，可以用来画相对位置
    var location = this.getLocation();//获取位置参数
    
    var cx = location.center.x ;
    var cy = location.center.y ;
    
    this.points = [];

    //简单的画一个X

    //根据半径计算x,y偏移量
    //由于是圆，偏移量相同
    var offw = Math.sqrt(location.radius * location.radius / 2);
    //左上角到右下角对角线
    this.points.push({x:cx - offw, y:cy-offw}, {x:cx + offw, y:cy+offw});

    //左下角到右上角对角线
    this.points.push({x:cx - offw, y:cy+offw, m:true}, {x:cx + offw, y:cy-offw});

    return this.points;
}
```




  
[npm-badge]: https://img.shields.io/npm/v/jmgraph.svg
[npm-badge-url]: https://www.npmjs.com/package/jmgraph
[license-badge]: https://img.shields.io/npm/l/jmgraph.svg
[license-badge-url]: ./LICENSE
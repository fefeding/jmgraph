jmGraph
=========

[![Latest NPM release][npm-badge]][npm-badge-url]

基于CANVAS的简单画图组件  
`让你用类似于dom的方式，在canvas上画图，感觉会不会很爽。`

主页：[http://graph.jm47.com/](http://graph.jm47.com/)  
示例：[http://graph.jm47.com/example/index.html](http://graph.jm47.com/example/index.html)

安装
---
直接从github下载包或npm安装
```
npm install jmgraph
```

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
| zIndex | - | 控件层级，同级节点值越大层级越高


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

控件
---

#### Path
`path`是多数图形的基类，可以指定一个points数组来绘制一个路径。  
[在线示例](http://graph.jm47.com/example/controls/line.html)

```javascript
var path = graph.createPath(null,style);
path.points.push({x:10,y:10});
path.points.push({x:10,y:60});
path.points.push({x:80,y:20});
path.points.push({x:90,y:80});
path.points.push({x:80,y:80});
```
#### 圆
`arc`可以创建椭圆、圆弧和圆，circle调用的是原生的arc函数绘制，harc可以绘制一个圆环。
具体请参考示例。
[在线示例](http://graph.jm47.com/example/controls/arc.html)

```javascript
//创建一个椭圆，指定不同的宽高就为椭圆。如果相同或指定半径则为圆。
var arc1 = g.createShape('arc', {
    style: style,
    center: {x:100, y:150},
    width: 120,
    height: 80
});		
```

#### 箭头
`arraw`为创建一个箭头，
`arrawline`是一条带箭头的直线。  
具体请参考示例。
[在线示例](http://graph.jm47.com/example/controls/arrawline.html)

```javascript
//带箭头的直线
var shape = g.createShape('arrawline',{
    style:style,
    start: {x:100,y:100},
    end: {x: 200, y: 350}
});	
//一起结束点和一个角度angle可以决定一个箭头，如果不填angle，则会用start和end来计算角度
var arraw = g.createShape('arraw',{
    style:style,
    start: {x:150, y:120},
    end: {x: 160, y: 150}
    //angle: Math.PI/2, //箭头角度  可以不填
    //offsetX: 5, //箭头X偏移量
    //offsetY: 8 //箭头Y偏移量
});	
```

#### 贝塞尔曲线
`bezier`可以指定无隐个控制点，绘制复杂的曲线。
具体请参考示例。
[在线示例](http://graph.jm47.com/example/controls/bezier.html)

```javascript
//一个固定的bezier曲线
var bezier = g.createShape('bezier', { style: style, points: [p0, p1, p2, p3, p4] });
```

#### 图片
`img`是用来承载一张图片的控件，可以用style.src来指定图片url。
具体请参考示例。
[在线示例](http://graph.jm47.com/example/controls/img.html)

```javascript
var style = {
    src: 'http://mat1.gtimg.com/www/qq2018/imgs/qq_logo_2018x2.png'
};
style.shadow = '0,0,10,#fff';
//style.opacity = 0.2;		

//创建一个image
var img = g.createShape('image',{
    style:style,
    position: {x:100,y:100}
});	
//设置图片可以用鼠标移动		
img.canMove(true);
```

#### 文字
`label`可以用来绘制文字，通过style指定样式。
具体请参考示例。
[在线示例](http://graph.jm47.com/example/controls/label.html)

```javascript
var style = {
    stroke: '#effaaa',
    fill: '#fff',
    textAlign: 'center', //水平居中
    textBaseline: 'middle', //垂直居中
    font: '20px Arial',
    border: {left:1,top:1,right:1,bottom:1}, //边框
    shadow: '0,0,10,#fff'
};
//style.opacity = 0.2;		

//创建一个label
var label = g.createShape('label',{
    style:style,
    position:{x:200,y:150},
    text:'test label',
    width:120,
    height:80
});		
```

#### 棱形
`prismatic`  
具体请参考示例。
[在线示例](http://graph.jm47.com/example/controls/prismatic.html)

```javascript
var prismatic = g.createShape('prismatic',{
    style:style,
    center:{x:200,y:150},
    width:120,
    height:80
});		
```

#### 可缩放控件
`resize` 可以自由放大缩小的控件。 
具体请参考示例。
[在线示例](http://graph.jm47.com/example/controls/resize.html)

```javascript
var style = {
    stroke: 'red',
    fill: 'yellow',
    lineWidth: 2, //边线宽
    //小方块样式
    rectStyle: {
        stroke: 'green', //小方块边颜色
        fill: 'transparent',//小方块填充色
        lineWidth: 1, //小方块线宽
        close: true
    }
};
//style.opacity = 0.2;		

//创建一个resize
var resize = g.createShape('resize', {
    style: style,
    position: {x:200, y:150},
    width: 120,
    height: 80
});	
//大小改变事件
resize.on('resize', function() {
    console.log(arguments);
});	
```

#### 自定义控件

大多数控件直接继承`jmPath`即可，然后通过实现`initPoints`来绘制当前控件。  
`当需要从某点重新开始画时，给点指定m属性为true，表示移到当前点。`  


##### 示例
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
    //画完上面的线后，需要重新移到这条线的起点，指定m:true即可
    this.points.push({x:cx - offw, y:cy+offw, m:true}, {x:cx + offw, y:cy-offw});

    return this.points;
}
```


#### 微信小程序支持
微信小程序稍有差别，因为无需压缩，请直接把`dist`中的`jmgraph.js`合并后的文件引用到你的小程序中。

#####示例
`wxml`
```html
<canvas style="width: 400px; height: 600px;background:#000;" 
    canvas-id="mycanvas" 
    bindtouchstart="canvastouchstart" 
    bindtouchmove="canvastouchmove" 
    bindtouchend="canvastouchend" 
    bindtouchcancel="canvastouchcancel">
</canvas>
```
`javascript`
```javascript
/**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    //这里引用jmgraph
    let jmGraph = require('../../utils/jmgraph');

    var self = this;

    jmGraph('mycanvas', {
      width: 400,
      height: 600
    }).then((g) => {
      init(g)
    });

    function init(g) {
      //g.style.fill = '#000'; //画布背景
      var style = {
        stroke: '#46BF86',
        fill: '#556662',
        lineWidth: 2
      };
      style.shadow = '0,0,10,#fff';
      //style.opacity = 0.2;			
      //style.lineCap = 'round';

      //创建一个方块
      var rect = g.createShape('rect', {
        style: style,
        position: { x: 100, y: 100 },
        width: 100,
        height: 100
      });
      rect.canMove(true);
      g.children.add(rect);

      function update() {
        if (g.needUpdate) g.redraw();
        requestAnimationFrame(update);
      }

      update();

      //初始化jmGraph事件
      //把小程序中的canvas事件交给jmGraph处理
      self.canvastouchstart = function() {
        return g.eventHandler.touchStart.apply(this, arguments);
      }
      self.canvastouchmove = function() {
        return g.eventHandler.touchMove.apply(this, arguments);
      }
      self.canvastouchend = function() {
        return g.eventHandler.touchEnd.apply(this, arguments);
      }
      self.canvastouchcancel = function() {
        return g.eventHandler.touchCancel.apply(this, arguments);
      }
    }
  }
```

  
[npm-badge]: https://img.shields.io/npm/v/jmgraph.svg
[npm-badge-url]: https://www.npmjs.com/package/jmgraph
[license-badge]: https://img.shields.io/npm/l/jmgraph.svg
[license-badge-url]: ./LICENSE
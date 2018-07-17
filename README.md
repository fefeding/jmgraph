jmGraph
=========

基于CANVAS的简单画图组件

主页:[http://graph.jm47.com/](http://graph.jm47.com/)


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

事件的绑定`jquery(bind/unbind)`。
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
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

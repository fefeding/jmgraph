## Classes

<dl>
<dt><a href="#jmList">jmList</a></dt>
<dd></dd>
<dt><a href="#jmObject">jmObject</a></dt>
<dd></dd>
<dt><a href="#jmProperty">jmProperty</a> ⇐ <code><a href="#jmObject">jmObject</a></code></dt>
<dd></dd>
<dt><a href="#jmEvents">jmEvents</a></dt>
<dd></dd>
<dt><a href="#jmMouseEvent">jmMouseEvent</a></dt>
<dd><p>鼠标事件处理对象，container 为事件主体，target为响应事件对象</p>
</dd>
<dt><a href="#jmKeyEvent">jmKeyEvent</a></dt>
<dd><p>健盘事件处理对象，container 为事件主体，target为响应事件对象</p>
</dd>
<dt><a href="#jmGradient">jmGradient</a></dt>
<dd></dd>
<dt><a href="#jmShadow">jmShadow</a></dt>
<dd></dd>
<dt><a href="#jmControl">jmControl</a> ⇐ <code><a href="#jmProperty">jmProperty</a></code></dt>
<dd></dd>
<dt><a href="#jmPath">jmPath</a> ⇐ <code><a href="#jmControl">jmControl</a></code></dt>
<dd></dd>
<dt><a href="#jmArc">jmArc</a> ⇐ <code><a href="#jmPath">jmPath</a></code></dt>
<dd></dd>
<dt><a href="#jmArrow">jmArrow</a> ⇐ <code><a href="#jmPath">jmPath</a></code></dt>
<dd></dd>
<dt><a href="#jmArrowLine">jmArrowLine</a> ⇐ <code><a href="#jmLine">jmLine</a></code></dt>
<dd></dd>
<dt><a href="#jmBezier">jmBezier</a> ⇐ <code><a href="#jmPath">jmPath</a></code></dt>
<dd></dd>
<dt><a href="#jmCircle">jmCircle</a> ⇐ <code><a href="#jmArc">jmArc</a></code></dt>
<dd></dd>
<dt><a href="#jmHArc">jmHArc</a> ⇐ <code><a href="#jmArc">jmArc</a></code></dt>
<dd></dd>
<dt><a href="#jmImage">jmImage</a> ⇐ <code><a href="#jmControl">jmControl</a></code></dt>
<dd></dd>
<dt><a href="#jmLabel">jmLabel</a> ⇐ <code><a href="#jmControl">jmControl</a></code></dt>
<dd></dd>
<dt><a href="#jmLine">jmLine</a> ⇐ <code><a href="#jmPath">jmPath</a></code></dt>
<dd></dd>
<dt><a href="#jmPrismatic">jmPrismatic</a> ⇐ <code><a href="#jmPath">jmPath</a></code></dt>
<dd></dd>
<dt><a href="#jmRect">jmRect</a> ⇐ <code><a href="#jmPath">jmPath</a></code></dt>
<dd></dd>
<dt><a href="#jmResize">jmResize</a> ⇐ <code><a href="#jmRect">jmRect</a></code></dt>
<dd></dd>
<dt><a href="#jmGraph">jmGraph</a> ⇐ <code><a href="#jmControl">jmControl</a></code></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#needUpdate">needUpdate</a> : <code>boolean</code></dt>
<dd><p>是否需要刷新画板，属性的改变会导致它变为true</p>
</dd>
<dt><a href="#graph">graph</a> : <code><a href="#jmGraph">jmGraph</a></code></dt>
<dd><p>当前所在的画布对象 jmGraph</p>
</dd>
<dt><a href="#type">type</a> : <code>string</code></dt>
<dd><p>当前对象类型名jmRect</p>
</dd>
<dt><a href="#context">context</a> : <code>object</code></dt>
<dd><p>当前canvas的context</p>
</dd>
<dt><a href="#style">style</a> : <code>object</code></dt>
<dd><p>样式</p>
</dd>
<dt><a href="#visible">visible</a> : <code>boolean</code></dt>
<dd><p>当前控件是否可见</p>
</dd>
<dt><a href="#interactive">interactive</a> : <code>boolean</code></dt>
<dd><p>当前控件是否是交互式的，如果是则会响应鼠标或touch事件。
如果false则不会主动响应，但冒泡的事件依然会得到回调</p>
</dd>
<dt><a href="#children">children</a> : <code>list</code></dt>
<dd><p>当前控件的子控件集合</p>
</dd>
<dt><a href="#width">width</a> : <code>number</code></dt>
<dd><p>宽度</p>
</dd>
<dt><a href="#height">height</a> : <code>number</code></dt>
<dd><p>高度</p>
</dd>
<dt><a href="#zIndex">zIndex</a> : <code>number</code></dt>
<dd><p>控件层级关系，发生改变时，需要重新调整排序</p>
</dd>
<dt><a href="#cursor">cursor</a> : <code>string</code></dt>
<dd><p>设置鼠标指针
css鼠标指针标识,例如:pointer,move等</p>
</dd>
<dt><a href="#points">points</a> : <code>array</code></dt>
<dd><p>描点集合
point格式：{x:0,y:0,m:true}</p>
</dd>
<dt><a href="#center">center</a> : <code>point</code></dt>
<dd><p>中心点
point格式：{x:0,y:0,m:true}</p>
</dd>
<dt><a href="#radius">radius</a> : <code>number</code></dt>
<dd><p>半径</p>
</dd>
<dt><a href="#startAngle">startAngle</a> : <code>number</code></dt>
<dd><p>扇形起始角度</p>
</dd>
<dt><a href="#endAngle">endAngle</a> : <code>number</code></dt>
<dd><p>扇形结束角度</p>
</dd>
<dt><a href="#anticlockwise">anticlockwise</a> : <code>boolean</code></dt>
<dd><p>可选。规定应该逆时针还是顺时针绘图
false  顺时针，true 逆时针</p>
</dd>
<dt><a href="#start">start</a> : <code>point</code></dt>
<dd><p>控制起始点</p>
</dd>
<dt><a href="#end">end</a> : <code>point</code></dt>
<dd><p>控制结束点</p>
</dd>
<dt><a href="#angle">angle</a> : <code>number</code></dt>
<dd><p>箭头角度</p>
</dd>
<dt><a href="#offsetX">offsetX</a> : <code>number</code></dt>
<dd><p>箭头X偏移量</p>
</dd>
<dt><a href="#offsetY">offsetY</a> : <code>number</code></dt>
<dd><p>箭头Y偏移量</p>
</dd>
<dt><a href="#cpoints">cpoints</a> : <code>array</code></dt>
<dd><p>控制点</p>
</dd>
<dt><a href="#minRadius">minRadius</a> : <code>number</code></dt>
<dd><p>设定或获取内空心圆半径</p>
</dd>
<dt><a href="#maxRadius">maxRadius</a> : <code>number</code></dt>
<dd><p>设定或获取外空心圆半径</p>
</dd>
<dt><a href="#sourcePosition">sourcePosition</a> : <code>point</code></dt>
<dd><p>画图开始剪切位置</p>
</dd>
<dt><a href="#sourceWidth">sourceWidth</a> : <code>number</code></dt>
<dd><p>被剪切宽度</p>
</dd>
<dt><a href="#text">text</a> : <code>string</code></dt>
<dd><p>显示的内容</p>
</dd>
<dt><a href="#center">center</a> : <code>point</code></dt>
<dd><p>中心点
point格式：{x:0,y:0,m:true}</p>
</dd>
<dt><a href="#position">position</a> : <code>point</code></dt>
<dd><p>当前位置左上角</p>
</dd>
<dt><a href="#start">start</a> : <code>point</code></dt>
<dd><p>控制起始点</p>
</dd>
<dt><a href="#end">end</a> : <code>point</code></dt>
<dd><p>控制结束点</p>
</dd>
<dt><a href="#center">center</a> : <code>point</code></dt>
<dd><p>中心点
point格式：{x:0,y:0,m:true}</p>
</dd>
<dt><a href="#radius">radius</a> : <code>number</code></dt>
<dd><p>圆角半径</p>
</dd>
<dt><a href="#position">position</a> : <code>point</code></dt>
<dd><p>当前位置左上角</p>
</dd>
<dt><a href="#rectSize">rectSize</a> : <code>number</code></dt>
<dd><p>拉动的小方块大小</p>
</dd>
<dt><a href="#resizable">resizable</a> : <code>boolean</code></dt>
<dd><p>是否可以拉大缩小</p>
</dd>
<dt><a href="#shapes">shapes</a> : <code>object</code></dt>
<dd><p>当前所有图形类型</p>
</dd>
<dt><a href="#width">width</a> : <code>number</code></dt>
<dd><p>宽度</p>
</dd>
<dt><a href="#height">height</a> : <code>number</code></dt>
<dd><p>高度</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#add">add(obj)</a></dt>
<dd><p>往集合中添加对象</p>
</dd>
<dt><a href="#remove">remove(obj)</a></dt>
<dd><p>从集合中移除指定对象</p>
</dd>
<dt><a href="#removeAt">removeAt(index)</a></dt>
<dd><p>按索引移除对象</p>
</dd>
<dt><a href="#contain">contain(obj)</a></dt>
<dd><p>判断是否包含某个对象</p>
</dd>
<dt><a href="#get">get(index)</a> ⇒ <code>any</code></dt>
<dd><p>从集合中获取某个对象</p>
</dd>
<dt><a href="#each">each(cb, inverse)</a></dt>
<dd><p>遍历当前集合</p>
</dd>
<dt><a href="#count">count([handler])</a> ⇒ <code>integer</code></dt>
<dd><p>获取当前集合对象个数</p>
</dd>
<dt><a href="#clear">clear()</a></dt>
<dd><p>清空当前集合</p>
</dd>
<dt><a href="#judge 判断点是否在多边形中">judge 判断点是否在多边形中(dot, coordinates, 是否为实心)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#hexToRGBA">hexToRGBA(})</a></dt>
<dd><p>16进制颜色转为r g b a 对象 {r, g , b, a}</p>
</dd>
<dt><a href="#is">is(type)</a> ⇒ <code>boolean</code></dt>
<dd><p>检 查对象是否为指定类型</p>
</dd>
<dt><a href="#animate">animate(handle, millisec)</a></dt>
<dd><p>给控件添加动画处理,如果成功执行会导致画布刷新。</p>
</dd>
<dt><a href="#__pro">__pro(name, value)</a> ⇒ <code>any</code></dt>
<dd><p>基础属性读写接口</p>
</dd>
<dt><a href="#addStop">addStop(offset, color)</a></dt>
<dd><p>添加渐变色</p>
</dd>
<dt><a href="#toGradient">toGradient(control)</a> ⇒ <code>gradient</code></dt>
<dd><p>生成为canvas的渐变对象</p>
</dd>
<dt><a href="#fromString">fromString()</a> ⇒ <code>string</code></dt>
<dd><p>变换为字条串格式
linear-gradient(x1 y1 x2 y2, color1 step, color2 step, ...);    //radial-gradient(x1 y1 r1 x2 y2 r2, color1 step,color2 step, ...);
linear-gradient线性渐变，x1 y1表示起点，x2 y2表示结束点,color表颜色，step为当前颜色偏移
radial-gradient径向渐变,x1 y1 r1分别表示内圆中心和半径，x2 y2 r2为结束圆 中心和半径，颜色例似线性渐变 step为0-1之间</p>
</dd>
<dt><a href="#toString">toString()</a> ⇒ <code>string</code></dt>
<dd><p>转换为渐变的字符串表达</p>
</dd>
<dt><a href="#fromString">fromString(s)</a></dt>
<dd><p>根据字符串格式转为阴影</p>
</dd>
<dt><a href="#toString">toString()</a> ⇒ <code>string</code></dt>
<dd><p>转为字符串格式 x,y,blur,color</p>
</dd>
<dt><a href="#initializing">initializing()</a></dt>
<dd><p>初始化对象，设定样式，初始化子控件对象
此方法为所有控件需调用的方法</p>
</dd>
<dt><a href="#getBounds">getBounds([isReset])</a> ⇒ <code>object</code></dt>
<dd><p>获取当前控件的边界
通过分析控件的描点或位置加宽高得到为方形的边界</p>
</dd>
<dt><a href="#getLocation">getLocation()</a> ⇒ <code>object</code></dt>
<dd><p>获取当前控件的位置相关参数
解析百分比和margin参数</p>
</dd>
<dt><a href="#getRotation">getRotation()</a> ⇒ <code>object</code></dt>
<dd><p>获取当前控制的旋转信息</p>
</dd>
<dt><a href="#remove">remove()</a></dt>
<dd><p>移除当前控件
如果是VML元素，则调用其删除元素</p>
</dd>
<dt><a href="#offset">offset(x, y, [trans], [evt])</a></dt>
<dd><p>对控件进行平移
遍历控件所有描点或位置，设置其偏移量。</p>
</dd>
<dt><a href="#rotate">rotate(angle, point)</a></dt>
<dd><p>把图形旋转一个角度</p>
</dd>
<dt><a href="#getAbsoluteBounds">getAbsoluteBounds()</a> ⇒ <code>object</code></dt>
<dd><p>获取控件相对于画布的绝对边界，
与getBounds不同的是：getBounds获取的是相对于父容器的边界.</p>
</dd>
<dt><a href="#beginDraw">beginDraw()</a></dt>
<dd><p>画控件前初始化
执行beginPath开始控件的绘制</p>
</dd>
<dt><a href="#endDraw">endDraw()</a></dt>
<dd><p>结束控件绘制</p>
</dd>
<dt><a href="#draw">draw()</a></dt>
<dd><p>绘制控件
在画布上描点</p>
</dd>
<dt><a href="#paint">paint()</a></dt>
<dd><p>绘制当前控件
协调控件的绘制，先从其子控件开始绘制，再往上冒。</p>
</dd>
<dt><a href="#getEvent">getEvent(name)</a> ⇒ <code>list</code></dt>
<dd><p>获取指定事件的集合
比如mousedown,mouseup等</p>
</dd>
<dt><a href="#bind">bind(name, handle)</a></dt>
<dd><p>绑定控件的事件</p>
</dd>
<dt><a href="#unbind">unbind(name, handle)</a></dt>
<dd><p>移除控件的事件</p>
</dd>
<dt><a href="#emit">emit(name, args)</a></dt>
<dd><p>执行监听回调</p>
</dd>
<dt><a href="#runEventHandle">runEventHandle(将执行的事件名称, 事件执行的参数，包括触发事件的对象和位置)</a></dt>
<dd><p>独立执行事件委托</p>
</dd>
<dt><a href="#checkPoint">checkPoint(p, [pad])</a> ⇒ <code>boolean</code></dt>
<dd><p>检 查坐标是否落在当前控件区域中..true=在区域内</p>
</dd>
<dt><a href="#raiseEvent">raiseEvent(name, args)</a> ⇒ <code>boolean</code></dt>
<dd><p>触发控件事件，组合参数并按控件层级关系执行事件冒泡。</p>
</dd>
<dt><a href="#runEventAndPopEvent">runEventAndPopEvent(name, args)</a></dt>
<dd><p>执行事件，并进行冒泡</p>
</dd>
<dt><a href="#clearEvents">clearEvents(name)</a></dt>
<dd><p>清空控件指定事件</p>
</dd>
<dt><a href="#findParent">findParent(类型名称或类型对象)</a> ⇒ <code>object</code></dt>
<dd><p>查找其父级类型为type的元素，直到找到指定的对象或到最顶级控件后返回空。</p>
</dd>
<dt><a href="#canMove">canMove(m, [graph])</a></dt>
<dd><p>设定是否可以移动
此方法需指定jmgraph或在控件添加到jmgraph后再调用才能生效。</p>
</dd>
<dt><a href="#getPoint">getPoint(ps, t)</a> ⇒ <code>array</code></dt>
<dd><p>根据控制点和参数t生成贝塞尔曲线轨迹点</p>
</dd>
<dt><a href="#offset">offset(x, y, [trans])</a></dt>
<dd><p>对控件进行平移
遍历控件所有描点或位置，设置其偏移量。</p>
</dd>
<dt><a href="#draw">draw()</a></dt>
<dd><p>重写基类画图，此处为画一个完整的圆</p>
</dd>
<dt><a href="#sourceHeight">sourceHeight()</a> ⇒ <code>number</code></dt>
<dd><p>被剪切高度</p>
</dd>
<dt><a href="#image">image()</a> ⇒ <code>img</code></dt>
<dd><p>设定要绘制的图像或其它多媒体对象，可以是图片地址，或图片image对象</p>
</dd>
<dt><a href="#draw">draw()</a></dt>
<dd><p>重写控件绘制
根据父边界偏移和此控件参数绘制图片</p>
</dd>
<dt><a href="#getBounds">getBounds()</a> ⇒ <code>object</code></dt>
<dd><p>获取当前控件的边界</p>
</dd>
<dt><a href="#getImage">getImage()</a> ⇒ <code>img</code></dt>
<dd><p>img对象</p>
</dd>
<dt><a href="#getLocation">getLocation()</a> ⇒ <code>Object</code></dt>
<dd><p>在基础的getLocation上，再加上一个特殊的center处理</p>
</dd>
<dt><a href="#testSize">testSize()</a> ⇒ <code>object</code></dt>
<dd><p>测试获取文本所占大小</p>
</dd>
<dt><a href="#draw">draw()</a></dt>
<dd><p>根据位置偏移画字符串</p>
</dd>
<dt><a href="#getBounds">getBounds()</a> ⇒ <code>bound</code></dt>
<dd><p>获取当前控件的边界</p>
</dd>
<dt><a href="#checkPoint">checkPoint(p)</a> ⇒ <code>boolean</code></dt>
<dd><p>重写检查坐标是否在区域内</p>
</dd>
<dt><a href="#reset">reset(px, py, dx, dy)</a></dt>
<dd><p>按移动偏移量重置当前对象，并触发大小和位置改变事件</p>
</dd>
<dt><a href="#init">init()</a></dt>
<dd><p>初始化画布</p>
</dd>
<dt><a href="#create">create()</a> ⇒ <code><a href="#jmGraph">jmGraph</a></code></dt>
<dd><p>创建jmGraph的静态对象</p>
</dd>
<dt><a href="#getPosition">getPosition()</a> ⇒ <code>postion</code></dt>
<dd><p>获取当前画布在浏览器中的绝对定位</p>
</dd>
<dt><a href="#registerShape">registerShape(name, shape)</a></dt>
<dd><p>注册图形类型,图形类型必需有统一的构造函数。参数为画布句柄和参数对象。</p>
</dd>
<dt><a href="#createShape">createShape(name, args)</a> ⇒ <code>object</code></dt>
<dd><p>从已注册的图形类创建图形
简单直观创建对象</p>
</dd>
<dt><a href="#createShadow">createShadow(x, y, blur, color)</a> ⇒ <code><a href="#jmShadow">jmShadow</a></code></dt>
<dd><p>生成阴影对象</p>
</dd>
<dt><a href="#createLinearGradient">createLinearGradient(x1, y1, x2, y2)</a> ⇒ <code><a href="#jmGradient">jmGradient</a></code></dt>
<dd><p>生成线性渐变对象</p>
</dd>
<dt><a href="#createRadialGradient">createRadialGradient(x1, y1, r1, x2, y2, r2)</a> ⇒ <code><a href="#jmGradient">jmGradient</a></code></dt>
<dd><p>生成放射渐变对象</p>
</dd>
<dt><a href="#refresh">refresh()</a></dt>
<dd><p>重新刷新整个画板
以加入动画事件触发延时10毫秒刷新，保存最尽的调用只刷新一次，加强性能的效果。</p>
</dd>
<dt><a href="#redraw">redraw([w], [h])</a></dt>
<dd><p>重新刷新整个画板
此方法直接重画，与refresh效果类似</p>
</dd>
<dt><a href="#clear">clear([w], [h])</a></dt>
<dd><p>清除画布</p>
</dd>
<dt><a href="#css">css(name, value)</a></dt>
<dd><p>设置画布样式，此处只是设置其css样式</p>
</dd>
<dt><a href="#createPath">createPath(points, style)</a> ⇒ <code><a href="#jmPath">jmPath</a></code></dt>
<dd><p>生成路径对象</p>
</dd>
<dt><a href="#createLine">createLine(start, end, 直线的样式)</a> ⇒ <code><a href="#jmLine">jmLine</a></code></dt>
<dd><p>生成直线</p>
</dd>
<dt><a href="#zoomOut">zoomOut()</a></dt>
<dd><p>缩小整个画布按比例0.9</p>
</dd>
<dt><a href="#zoomIn">zoomIn()</a></dt>
<dd><p>放大 每次增大0.1的比例</p>
</dd>
<dt><a href="#zoomActual">zoomActual()</a></dt>
<dd><p>大小复原</p>
</dd>
<dt><a href="#scale">scale(dx, dy)</a></dt>
<dd><p>放大缩小画布</p>
</dd>
<dt><a href="#toDataURL">toDataURL()</a> ⇒ <code>string</code></dt>
<dd><p>保存为base64图形数据</p>
</dd>
<dt><a href="#autoRefresh">autoRefresh(callback)</a></dt>
<dd><p>自动刷新画版</p>
</dd>
</dl>

<a name="jmList"></a>

## jmList
**Kind**: global class  
**For**: jmUtils  
<a name="new_jmList_new"></a>

### new jmList([arr])
自定义集合


| Param | Type | Description |
| --- | --- | --- |
| [arr] | <code>array</code> | 数组，可转为当前list元素 |

<a name="jmObject"></a>

## jmObject
**Kind**: global class  
**For**: jmGraph  
<a name="new_jmObject_new"></a>

### new jmObject()
所有jm对象的基础对象

<a name="jmProperty"></a>

## jmProperty ⇐ <code>[jmObject](#jmObject)</code>
**Kind**: global class  
**Extends:** <code>[jmObject](#jmObject)</code>  
**Require**: jmObject  
<a name="new_jmProperty_new"></a>

### new jmProperty()
对象属性管理

<a name="jmEvents"></a>

## jmEvents
**Kind**: global class  
**For**: jmGraph  
<a name="new_jmEvents_new"></a>

### new jmEvents()
事件模型

<a name="jmMouseEvent"></a>

## jmMouseEvent
鼠标事件处理对象，container 为事件主体，target为响应事件对象

**Kind**: global class  
<a name="jmKeyEvent"></a>

## jmKeyEvent
健盘事件处理对象，container 为事件主体，target为响应事件对象

**Kind**: global class  
<a name="jmKeyEvent+init"></a>

### jmKeyEvent.init()
初始化健盘事件

**Kind**: instance method of <code>[jmKeyEvent](#jmKeyEvent)</code>  
<a name="jmGradient"></a>

## jmGradient
**Kind**: global class  
<a name="new_jmGradient_new"></a>

### new jmGradient(op)
渐变类


| Param | Type | Description |
| --- | --- | --- |
| op | <code>object</code> | 渐变参数,type:[linear= 线性渐变,radial=放射性渐变] |

<a name="jmShadow"></a>

## jmShadow
**Kind**: global class  
<a name="new_jmShadow_new"></a>

### new jmShadow(x, y, blur, color)
画图阴影对象表示法


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | 横坐标偏移量 |
| y | <code>number</code> | 纵坐标编移量 |
| blur | <code>number</code> | 模糊值 |
| color | <code>string</code> | 阴影的颜色 |

<a name="jmControl"></a>

## jmControl ⇐ <code>[jmProperty](#jmProperty)</code>
**Kind**: global class  
**Extends:** <code>[jmProperty](#jmProperty)</code>  
<a name="new_jmControl_new"></a>

### new jmControl()
控件基础对象
控件的基础属性和方法

<a name="jmPath"></a>

## jmPath ⇐ <code>[jmControl](#jmControl)</code>
**Kind**: global class  
**Extends:** <code>[jmControl](#jmControl)</code>  
<a name="new_jmPath_new"></a>

### new jmPath(params)
基础路径,大部分图型的基类
指定一系列点，画出图形


| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | 路径参数 points=所有描点 |

<a name="jmArc"></a>

## jmArc ⇐ <code>[jmPath](#jmPath)</code>
**Kind**: global class  
**Extends:** <code>[jmPath](#jmPath)</code>  
<a name="new_jmArc_new"></a>

### new jmArc(params)
圆弧图型 继承自jmPath


| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | center=当前圆弧中心,radius=圆弧半径,start=圆弧起始角度,end=圆弧结束角度,anticlockwise=  false  顺时针，true 逆时针 |

<a name="jmArrow"></a>

## jmArrow ⇐ <code>[jmPath](#jmPath)</code>
**Kind**: global class  
**Extends:** <code>[jmPath](#jmPath)</code>  
<a name="new_jmArrow_new"></a>

### new jmArrow(生成箭头所需的参数)
画箭头,继承自jmPath


| Param | Type |
| --- | --- |
| 生成箭头所需的参数 | <code>object</code> | 

<a name="jmArrowLine"></a>

## jmArrowLine ⇐ <code>[jmLine](#jmLine)</code>
**Kind**: global class  
**Extends:** <code>[jmLine](#jmLine)</code>  
<a name="new_jmArrowLine_new"></a>

### new jmArrowLine(params)
带箭头的直线,继承jmPath


| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | 生成当前直线的参数对象，(style=当前线条样式,start=直线起始点,end=直线终结点) |

<a name="jmBezier"></a>

## jmBezier ⇐ <code>[jmPath](#jmPath)</code>
**Kind**: global class  
**Extends:** <code>[jmPath](#jmPath)</code>  
<a name="new_jmBezier_new"></a>

### new jmBezier(params)
贝塞尔曲线,继承jmPath
N阶，参数points中为控制点


| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | 参数 |

<a name="jmCircle"></a>

## jmCircle ⇐ <code>[jmArc](#jmArc)</code>
**Kind**: global class  
**Extends:** <code>[jmArc](#jmArc)</code>  
<a name="new_jmCircle_new"></a>

### new jmCircle(params)
画规则的圆弧


| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | 圆的参数:center=圆中心,radius=圆半径,优先取此属性，如果没有则取宽和高,width=圆宽,height=圆高 |

<a name="jmHArc"></a>

## jmHArc ⇐ <code>[jmArc](#jmArc)</code>
**Kind**: global class  
**Extends:** <code>[jmArc](#jmArc)</code>  
<a name="new_jmHArc_new"></a>

### new jmHArc(params)
画空心圆弧,继承自jmPath


| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | 空心圆参数:minRadius=中心小圆半径,maxRadius=大圆半径,start=起始角度,end=结束角度,anticlockwise=false  顺时针，true 逆时针 |

<a name="jmImage"></a>

## jmImage ⇐ <code>[jmControl](#jmControl)</code>
**Kind**: global class  
**Extends:** <code>[jmControl](#jmControl)</code>  
<a name="new_jmImage_new"></a>

### new jmImage(params)
图片控件，继承自jmControl
params参数中image为指定的图片源地址或图片img对象，
postion=当前控件的位置，width=其宽度，height=高度，sourcePosition=从当前图片中展示的位置，sourceWidth=从图片中截取的宽度,sourceHeight=从图片中截取的高度。


| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | 控件参数 |

<a name="jmLabel"></a>

## jmLabel ⇐ <code>[jmControl](#jmControl)</code>
**Kind**: global class  
**Extends:** <code>[jmControl](#jmControl)</code>  
<a name="new_jmLabel_new"></a>

### new jmLabel(params)
显示文字控件


| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | params参数:style=样式，value=显示的文字 |

<a name="jmLine"></a>

## jmLine ⇐ <code>[jmPath](#jmPath)</code>
**Kind**: global class  
**Extends:** <code>[jmPath](#jmPath)</code>  
<a name="new_jmLine_new"></a>

### new jmLine(params)
画一条直线


| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | 直线参数:start=起始点,end=结束点,lineType=线类型(solid=实线，dotted=虚线),dashLength=虚线间隔(=4) |

<a name="jmPrismatic"></a>

## jmPrismatic ⇐ <code>[jmPath](#jmPath)</code>
**Kind**: global class  
**Extends:** <code>[jmPath](#jmPath)</code>  
<a name="new_jmPrismatic_new"></a>

### new jmPrismatic(params)
画棱形


| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | 参数 center=棱形中心点，width=棱形宽,height=棱形高 |

<a name="jmRect"></a>

## jmRect ⇐ <code>[jmPath](#jmPath)</code>
**Kind**: global class  
**Extends:** <code>[jmPath](#jmPath)</code>  
<a name="new_jmRect_new"></a>

### new jmRect(params)
画矩形


| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | 参数 position=矩形左上角顶点坐标,width=宽，height=高,radius=边角弧度 |

<a name="jmResize"></a>

## jmResize ⇐ <code>[jmRect](#jmRect)</code>
**Kind**: global class  
**Extends:** <code>[jmRect](#jmRect)</code>  
<a name="new_jmResize_new"></a>

### new jmResize()
可拉伸的缩放控件
继承jmRect
如果此控件加入到了当前控制的对象的子控件中，请在参数中加入movable:false，否则导致当前控件会偏离被控制的控件。

<a name="jmGraph"></a>

## jmGraph ⇐ <code>[jmControl](#jmControl)</code>
**Kind**: global class  
**Extends:** <code>[jmControl](#jmControl)</code>  
<a name="new_jmGraph_new"></a>

### new jmGraph(canvas, option, callback)
jmGraph画图类库
对canvas画图api进行二次封装，使其更易调用，省去很多重复的工作。


| Param | Type | Description |
| --- | --- | --- |
| canvas | <code>element</code> | 标签canvas |
| option | <code>object</code> | 参数：{width:宽,height:高} |
| callback | <code>function</code> | 初始化后的回调 |

<a name="needUpdate"></a>

## needUpdate : <code>boolean</code>
是否需要刷新画板，属性的改变会导致它变为true

**Kind**: global variable  
**Properties**

| Name |
| --- |
| needUpdate | 

<a name="graph"></a>

## graph : <code>[jmGraph](#jmGraph)</code>
当前所在的画布对象 jmGraph

**Kind**: global variable  
**Properties**

| Name |
| --- |
| graph | 

<a name="type"></a>

## type : <code>string</code>
当前对象类型名jmRect

**Kind**: global variable  
**Properties**

| Name |
| --- |
| type | 

<a name="context"></a>

## context : <code>object</code>
当前canvas的context

**Kind**: global variable  
**Properties**

| Name |
| --- |
| context | 

<a name="style"></a>

## style : <code>object</code>
样式

**Kind**: global variable  
**Properties**

| Name |
| --- |
| style | 

<a name="visible"></a>

## visible : <code>boolean</code>
当前控件是否可见

**Kind**: global variable  
**Default**: <code>true</code>  
**Properties**

| Name |
| --- |
| visible | 

<a name="interactive"></a>

## interactive : <code>boolean</code>
当前控件是否是交互式的，如果是则会响应鼠标或touch事件。
如果false则不会主动响应，但冒泡的事件依然会得到回调

**Kind**: global variable  
**Default**: <code>false</code>  
**Properties**

| Name |
| --- |
| interactive | 

<a name="children"></a>

## children : <code>list</code>
当前控件的子控件集合

**Kind**: global variable  
**Properties**

| Name |
| --- |
| children | 

<a name="children.sort"></a>

### children.sort()
根据控件zIndex排序，越大的越高

**Kind**: static method of <code>[children](#children)</code>  
<a name="width"></a>

## width : <code>number</code>
宽度

**Kind**: global variable  
**Properties**

| Name |
| --- |
| width | 

<a name="height"></a>

## height : <code>number</code>
高度

**Kind**: global variable  
**Properties**

| Name |
| --- |
| height | 

<a name="zIndex"></a>

## zIndex : <code>number</code>
控件层级关系，发生改变时，需要重新调整排序

**Kind**: global variable  
**Properties**

| Name |
| --- |
| zIndex | 

<a name="cursor"></a>

## cursor : <code>string</code>
设置鼠标指针
css鼠标指针标识,例如:pointer,move等

**Kind**: global variable  
**Properties**

| Name |
| --- |
| cursor | 

<a name="points"></a>

## points : <code>array</code>
描点集合
point格式：{x:0,y:0,m:true}

**Kind**: global variable  
**Properties**

| Name |
| --- |
| points | 

<a name="center"></a>

## center : <code>point</code>
中心点
point格式：{x:0,y:0,m:true}

**Kind**: global variable  
**Properties**

| Name |
| --- |
| center | 

<a name="radius"></a>

## radius : <code>number</code>
半径

**Kind**: global variable  
**Properties**

| Name |
| --- |
| radius | 

<a name="startAngle"></a>

## startAngle : <code>number</code>
扇形起始角度

**Kind**: global variable  
**Properties**

| Name |
| --- |
| startAngle | 

<a name="endAngle"></a>

## endAngle : <code>number</code>
扇形结束角度

**Kind**: global variable  
**Properties**

| Name |
| --- |
| endAngle | 

<a name="anticlockwise"></a>

## anticlockwise : <code>boolean</code>
可选。规定应该逆时针还是顺时针绘图
false  顺时针，true 逆时针

**Kind**: global variable  
**Properties**

| Name |
| --- |
| anticlockwise | 

<a name="start"></a>

## start : <code>point</code>
控制起始点

**Kind**: global variable  
**For**: jmArrow  
**Properties**

| Name |
| --- |
| start | 

<a name="end"></a>

## end : <code>point</code>
控制结束点

**Kind**: global variable  
**For**: jmArrow  
**Properties**

| Name |
| --- |
| end | 

<a name="angle"></a>

## angle : <code>number</code>
箭头角度

**Kind**: global variable  
**For**: jmArrow  
**Properties**

| Name |
| --- |
| angle | 

<a name="offsetX"></a>

## offsetX : <code>number</code>
箭头X偏移量

**Kind**: global variable  
**For**: jmArrow  
**Properties**

| Name |
| --- |
| offsetX | 

<a name="offsetY"></a>

## offsetY : <code>number</code>
箭头Y偏移量

**Kind**: global variable  
**For**: jmArrow  
**Properties**

| Name |
| --- |
| offsetY | 

<a name="cpoints"></a>

## cpoints : <code>array</code>
控制点

**Kind**: global variable  
**For**: jmBezier  
**Properties**

| Name |
| --- |
| cpoints | 

<a name="minRadius"></a>

## minRadius : <code>number</code>
设定或获取内空心圆半径

**Kind**: global variable  
**For**: jmHArc  
**Properties**

| Name |
| --- |
| minRadius | 

<a name="maxRadius"></a>

## maxRadius : <code>number</code>
设定或获取外空心圆半径

**Kind**: global variable  
**For**: jmHArc  
**Properties**

| Name |
| --- |
| maxRadius | 

<a name="sourcePosition"></a>

## sourcePosition : <code>point</code>
画图开始剪切位置

**Kind**: global variable  
**Properties**

| Name |
| --- |
| sourcePosition | 

<a name="sourceWidth"></a>

## sourceWidth : <code>number</code>
被剪切宽度

**Kind**: global variable  
**Properties**

| Name |
| --- |
| sourceWidth | 

<a name="text"></a>

## text : <code>string</code>
显示的内容

**Kind**: global variable  
**Properties**

| Name |
| --- |
| text | 

<a name="center"></a>

## center : <code>point</code>
中心点
point格式：{x:0,y:0,m:true}

**Kind**: global variable  
**Properties**

| Name |
| --- |
| center | 

<a name="position"></a>

## position : <code>point</code>
当前位置左上角

**Kind**: global variable  
**Properties**

| Name |
| --- |
| position | 

<a name="start"></a>

## start : <code>point</code>
控制起始点

**Kind**: global variable  
**For**: jmLine  
**Properties**

| Name |
| --- |
| start | 

<a name="end"></a>

## end : <code>point</code>
控制结束点

**Kind**: global variable  
**For**: jmLine  
**Properties**

| Name |
| --- |
| end | 

<a name="center"></a>

## center : <code>point</code>
中心点
point格式：{x:0,y:0,m:true}

**Kind**: global variable  
**Properties**

| Name |
| --- |
| center | 

<a name="radius"></a>

## radius : <code>number</code>
圆角半径

**Kind**: global variable  
**Properties**

| Name |
| --- |
| radius | 

<a name="position"></a>

## position : <code>point</code>
当前位置左上角

**Kind**: global variable  
**Properties**

| Name |
| --- |
| position | 

<a name="rectSize"></a>

## rectSize : <code>number</code>
拉动的小方块大小

**Kind**: global variable  
**Properties**

| Name |
| --- |
| rectSize | 

<a name="resizable"></a>

## resizable : <code>boolean</code>
是否可以拉大缩小

**Kind**: global variable  
**Properties**

| Name |
| --- |
| resizable | 

<a name="shapes"></a>

## shapes : <code>object</code>
当前所有图形类型

**Kind**: global variable  
**Properties**

| Name |
| --- |
| shapes | 

<a name="width"></a>

## width : <code>number</code>
宽度

**Kind**: global variable  
**Properties**

| Name |
| --- |
| width | 

<a name="height"></a>

## height : <code>number</code>
高度

**Kind**: global variable  
**Properties**

| Name |
| --- |
| height | 

<a name="add"></a>

## add(obj)
往集合中添加对象

**Kind**: global function  
**For**: list  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>any</code> | 往集合中添加的对象 |

<a name="remove"></a>

## remove(obj)
从集合中移除指定对象

**Kind**: global function  
**For**: list  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>any</code> | 将移除的对象 |

<a name="removeAt"></a>

## removeAt(index)
按索引移除对象

**Kind**: global function  
**For**: list  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>integer</code> | 移除对象的索引 |

<a name="contain"></a>

## contain(obj)
判断是否包含某个对象

**Kind**: global function  
**For**: list  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>any</code> | 判断当前集合中是否包含此对象 |

<a name="get"></a>

## get(index) ⇒ <code>any</code>
从集合中获取某个对象

**Kind**: global function  
**Returns**: <code>any</code> - 集合中的对象  
**For**: list  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>integer/function</code> | 如果为整型则表示为获取此索引的对象，如果为function为则通过此委托获取对象 |

<a name="each"></a>

## each(cb, inverse)
遍历当前集合

**Kind**: global function  
**For**: list  

| Param | Type | Description |
| --- | --- | --- |
| cb | <code>function</code> | 遍历当前集合的委托 |
| inverse | <code>boolean</code> | 是否按逆序遍历 |

<a name="count"></a>

## count([handler]) ⇒ <code>integer</code>
获取当前集合对象个数

**Kind**: global function  
**Returns**: <code>integer</code> - 当前集合的个数  
**For**: list  

| Param | Type | Description |
| --- | --- | --- |
| [handler] | <code>function</code> | 检查对象是否符合计算的条件 |

<a name="clear"></a>

## clear()
清空当前集合

**Kind**: global function  
**For**: list  
<a name="judge 判断点是否在多边形中"></a>

## judge 判断点是否在多边形中(dot, coordinates, 是否为实心) ⇒ <code>boolean</code>
**Kind**: global function  
**Returns**: <code>boolean</code> - 结果 true=在形状内  

| Param | Type | Description |
| --- | --- | --- |
| dot | <code>point</code> | {{x,y}} 需要判断的点 |
| coordinates | <code>array</code> | {{x,y}} 多边形点坐标的数组，为保证图形能够闭合，起点和终点必须相等。        比如三角形需要四个点表示，第一个点和最后一个点必须相同。 |
| 是否为实心 | <code>number</code> | 1= 是 |

<a name="hexToRGBA"></a>

## hexToRGBA(})
16进制颜色转为r g b a 对象 {r, g , b, a}

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| } | <code>string</code> | hex 16进度的颜色 |

<a name="is"></a>

## is(type) ⇒ <code>boolean</code>
检 查对象是否为指定类型

**Kind**: global function  
**Returns**: <code>boolean</code> - true=表示当前对象为指定的类型type,false=表示不是  
**For**: jmObject  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>class</code> | 判断的类型 |

<a name="animate"></a>

## animate(handle, millisec)
给控件添加动画处理,如果成功执行会导致画布刷新。

**Kind**: global function  
**For**: jmObject  

| Param | Type | Description |
| --- | --- | --- |
| handle | <code>function</code> | 动画委托 |
| millisec | <code>integer</code> | 此委托执行间隔 （毫秒） |

<a name="__pro"></a>

## __pro(name, value) ⇒ <code>any</code>
基础属性读写接口

**Kind**: global function  
**Returns**: <code>any</code> - 属性的值  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | 属性名 |
| value | <code>any</code> | 属性的值 |

<a name="addStop"></a>

## addStop(offset, color)
添加渐变色

**Kind**: global function  
**For**: jmGradient  

| Param | Type | Description |
| --- | --- | --- |
| offset | <code>number</code> | 放射渐变颜色偏移,可为百分比参数。 |
| color | <code>string</code> | 当前偏移颜色值 |

<a name="toGradient"></a>

## toGradient(control) ⇒ <code>gradient</code>
生成为canvas的渐变对象

**Kind**: global function  
**Returns**: <code>gradient</code> - canvas渐变对象  
**For**: jmGradient  

| Param | Type | Description |
| --- | --- | --- |
| control | <code>[jmControl](#jmControl)</code> | 当前渐变对应的控件 |

<a name="fromString"></a>

## fromString() ⇒ <code>string</code>
变换为字条串格式
linear-gradient(x1 y1 x2 y2, color1 step, color2 step, ...);	//radial-gradient(x1 y1 r1 x2 y2 r2, color1 step,color2 step, ...);
linear-gradient线性渐变，x1 y1表示起点，x2 y2表示结束点,color表颜色，step为当前颜色偏移
radial-gradient径向渐变,x1 y1 r1分别表示内圆中心和半径，x2 y2 r2为结束圆 中心和半径，颜色例似线性渐变 step为0-1之间

**Kind**: global function  
**For**: jmGradient  
<a name="toString"></a>

## toString() ⇒ <code>string</code>
转换为渐变的字符串表达

**Kind**: global function  
**Returns**: <code>string</code> - linear-gradient(x1 y1 x2 y2, color1 step, color2 step, ...);	//radial-gradient(x1 y1 r1 x2 y2 r2, color1 step,color2 step, ...);  
**For**: jmGradient  
<a name="fromString"></a>

## fromString(s)
根据字符串格式转为阴影

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| s | <code>string</code> | 阴影字符串 x,y,blur,color |

<a name="toString"></a>

## toString() ⇒ <code>string</code>
转为字符串格式 x,y,blur,color

**Kind**: global function  
**Returns**: <code>string</code> - 阴影字符串  
<a name="initializing"></a>

## initializing()
初始化对象，设定样式，初始化子控件对象
此方法为所有控件需调用的方法

**Kind**: global function  
**For**: jmControl  
<a name="getBounds"></a>

## getBounds([isReset]) ⇒ <code>object</code>
获取当前控件的边界
通过分析控件的描点或位置加宽高得到为方形的边界

**Kind**: global function  
**Returns**: <code>object</code> - 控件的边界描述对象(left,top,right,bottom,width,height)  
**For**: jmControl  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isReset] | <code>boolean</code> | <code>false</code> | 是否强制重新计算 |

<a name="getLocation"></a>

## getLocation() ⇒ <code>object</code>
获取当前控件的位置相关参数
解析百分比和margin参数

**Kind**: global function  
**Returns**: <code>object</code> - 当前控件位置参数，包括中心点坐标，右上角坐标，宽高  
<a name="getRotation"></a>

## getRotation() ⇒ <code>object</code>
获取当前控制的旋转信息

**Kind**: global function  
**Returns**: <code>object</code> - 旋转中心和角度  
<a name="remove"></a>

## remove()
移除当前控件
如果是VML元素，则调用其删除元素

**Kind**: global function  
<a name="offset"></a>

## offset(x, y, [trans], [evt])
对控件进行平移
遍历控件所有描点或位置，设置其偏移量。

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | x轴偏移量 |
| y | <code>number</code> | y轴偏移量 |
| [trans] | <code>boolean</code> | 是否传递,监听者可以通过此属性是否决定是否响应移动事件,默认=true |
| [evt] | <code>object</code> | 如果是事件触发，则传递move事件参数 |

<a name="rotate"></a>

## rotate(angle, point)
把图形旋转一个角度

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| angle | <code>number</code> | 旋转角度 |
| point | <code>object</code> | 旋转坐标，可以是百分比,例如：{x: '50%',y: '50%'} |

<a name="getAbsoluteBounds"></a>

## getAbsoluteBounds() ⇒ <code>object</code>
获取控件相对于画布的绝对边界，
与getBounds不同的是：getBounds获取的是相对于父容器的边界.

**Kind**: global function  
**Returns**: <code>object</code> - 边界对象(left,top,right,bottom,width,height)  
<a name="beginDraw"></a>

## beginDraw()
画控件前初始化
执行beginPath开始控件的绘制

**Kind**: global function  
<a name="endDraw"></a>

## endDraw()
结束控件绘制

**Kind**: global function  
<a name="draw"></a>

## draw()
绘制控件
在画布上描点

**Kind**: global function  
<a name="paint"></a>

## paint()
绘制当前控件
协调控件的绘制，先从其子控件开始绘制，再往上冒。

**Kind**: global function  
<a name="getEvent"></a>

## getEvent(name) ⇒ <code>list</code>
获取指定事件的集合
比如mousedown,mouseup等

**Kind**: global function  
**Returns**: <code>list</code> - 事件委托的集合  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | 事件名称 |

<a name="bind"></a>

## bind(name, handle)
绑定控件的事件

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | 事件名称 |
| handle | <code>function</code> | 事件委托 |

<a name="unbind"></a>

## unbind(name, handle)
移除控件的事件

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | 事件名称 |
| handle | <code>function</code> | 从控件中移除事件的委托 |

<a name="emit"></a>

## emit(name, args)
执行监听回调

**Kind**: global function  
**For**: jmControl  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | 触发事件的名称 |
| args | <code>array</code> | 事件参数数组 |

<a name="runEventHandle"></a>

## runEventHandle(将执行的事件名称, 事件执行的参数，包括触发事件的对象和位置)
独立执行事件委托

**Kind**: global function  

| Param | Type |
| --- | --- |
| 将执行的事件名称 | <code>string</code> | 
| 事件执行的参数，包括触发事件的对象和位置 | <code>object</code> | 

<a name="checkPoint"></a>

## checkPoint(p, [pad]) ⇒ <code>boolean</code>
检 查坐标是否落在当前控件区域中..true=在区域内

**Kind**: global function  
**Returns**: <code>boolean</code> - 当前位置如果在区域内则为true,否则为false。  

| Param | Type | Description |
| --- | --- | --- |
| p | <code>point</code> | 位置参数 |
| [pad] | <code>number</code> | 可选参数，表示线条多远内都算在线上 |

<a name="raiseEvent"></a>

## raiseEvent(name, args) ⇒ <code>boolean</code>
触发控件事件，组合参数并按控件层级关系执行事件冒泡。

**Kind**: global function  
**Returns**: <code>boolean</code> - 如果事件被组止冒泡则返回false,否则返回true  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | 事件名称 |
| args | <code>object</code> | 事件执行参数 |

<a name="runEventAndPopEvent"></a>

## runEventAndPopEvent(name, args)
执行事件，并进行冒泡

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | 事件名称 |
| args | <code>object</code> | 事件参数 |

<a name="clearEvents"></a>

## clearEvents(name)
清空控件指定事件

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | 需要清除的事件名称 |

<a name="findParent"></a>

## findParent(类型名称或类型对象) ⇒ <code>object</code>
查找其父级类型为type的元素，直到找到指定的对象或到最顶级控件后返回空。

**Kind**: global function  
**Returns**: <code>object</code> - 指定类型的实例  

| Param | Type |
| --- | --- |
| 类型名称或类型对象 | <code>object</code> | 

<a name="canMove"></a>

## canMove(m, [graph])
设定是否可以移动
此方法需指定jmgraph或在控件添加到jmgraph后再调用才能生效。

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| m | <code>boolean</code> | true=可以移动，false=不可移动或清除移动。 |
| [graph] | <code>[jmGraph](#jmGraph)</code> | 当前画布，如果为空的话必需是已加入画布的控件，否则得指定画布。 |

<a name="getPoint"></a>

## getPoint(ps, t) ⇒ <code>array</code>
根据控制点和参数t生成贝塞尔曲线轨迹点

**Kind**: global function  
**Returns**: <code>array</code> - 所有轨迹点的数组  

| Param | Type | Description |
| --- | --- | --- |
| ps | <code>array</code> | 控制点集合 |
| t | <code>number</code> | 参数(0-1) |

<a name="offset"></a>

## offset(x, y, [trans])
对控件进行平移
遍历控件所有描点或位置，设置其偏移量。

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | x轴偏移量 |
| y | <code>number</code> | y轴偏移量 |
| [trans] | <code>boolean</code> | 是否传递,监听者可以通过此属性是否决定是否响应移动事件,默认=true |

<a name="draw"></a>

## draw()
重写基类画图，此处为画一个完整的圆

**Kind**: global function  
<a name="sourceHeight"></a>

## sourceHeight() ⇒ <code>number</code>
被剪切高度

**Kind**: global function  
<a name="image"></a>

## image() ⇒ <code>img</code>
设定要绘制的图像或其它多媒体对象，可以是图片地址，或图片image对象

**Kind**: global function  
<a name="draw"></a>

## draw()
重写控件绘制
根据父边界偏移和此控件参数绘制图片

**Kind**: global function  
<a name="getBounds"></a>

## getBounds() ⇒ <code>object</code>
获取当前控件的边界

**Kind**: global function  
**Returns**: <code>object</code> - 边界对象(left,top,right,bottom,width,height)  
<a name="getImage"></a>

## getImage() ⇒ <code>img</code>
img对象

**Kind**: global function  
**Returns**: <code>img</code> - 图片对象  
<a name="getLocation"></a>

## getLocation() ⇒ <code>Object</code>
在基础的getLocation上，再加上一个特殊的center处理

**Kind**: global function  
<a name="testSize"></a>

## testSize() ⇒ <code>object</code>
测试获取文本所占大小

**Kind**: global function  
**Returns**: <code>object</code> - 含文本大小的对象  
<a name="draw"></a>

## draw()
根据位置偏移画字符串

**Kind**: global function  
<a name="getBounds"></a>

## getBounds() ⇒ <code>bound</code>
获取当前控件的边界

**Kind**: global function  
**Returns**: <code>bound</code> - 当前控件边界  
<a name="checkPoint"></a>

## checkPoint(p) ⇒ <code>boolean</code>
重写检查坐标是否在区域内

**Kind**: global function  
**Returns**: <code>boolean</code> - 如果在则返回true,否则返回false  

| Param | Type | Description |
| --- | --- | --- |
| p | <code>point</code> | 待检查的坐标 |

<a name="reset"></a>

## reset(px, py, dx, dy)
按移动偏移量重置当前对象，并触发大小和位置改变事件

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| px | <code>number</code> | 位置X轴偏移 |
| py | <code>number</code> | 位置y轴偏移 |
| dx | <code>number</code> | 大小x轴偏移 |
| dy | <code>number</code> | 大小y轴偏移 |

<a name="init"></a>

## init()
初始化画布

**Kind**: global function  
<a name="create"></a>

## create() ⇒ <code>[jmGraph](#jmGraph)</code>
创建jmGraph的静态对象

**Kind**: global function  
**Returns**: <code>[jmGraph](#jmGraph)</code> - jmGraph实例对象  
<a name="getPosition"></a>

## getPosition() ⇒ <code>postion</code>
获取当前画布在浏览器中的绝对定位

**Kind**: global function  
**Returns**: <code>postion</code> - 返回定位坐标  
<a name="registerShape"></a>

## registerShape(name, shape)
注册图形类型,图形类型必需有统一的构造函数。参数为画布句柄和参数对象。

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | 控件图形名称 |
| shape | <code>class</code> | 图形控件类型 |

<a name="createShape"></a>

## createShape(name, args) ⇒ <code>object</code>
从已注册的图形类创建图形
简单直观创建对象

**Kind**: global function  
**Returns**: <code>object</code> - 已实例化控件的对象  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | 注册控件的名称 |
| args | <code>object</code> | 实例化控件的参数 |

<a name="createShadow"></a>

## createShadow(x, y, blur, color) ⇒ <code>[jmShadow](#jmShadow)</code>
生成阴影对象

**Kind**: global function  
**Returns**: <code>[jmShadow](#jmShadow)</code> - 阴影对象  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | x偏移量 |
| y | <code>number</code> | y偏移量 |
| blur | <code>number</code> | 模糊值 |
| color | <code>string</code> | 颜色 |

<a name="createLinearGradient"></a>

## createLinearGradient(x1, y1, x2, y2) ⇒ <code>[jmGradient](#jmGradient)</code>
生成线性渐变对象

**Kind**: global function  
**Returns**: <code>[jmGradient](#jmGradient)</code> - 线性渐变对象  

| Param | Type | Description |
| --- | --- | --- |
| x1 | <code>number</code> | 线性渐变起始点X坐标 |
| y1 | <code>number</code> | 线性渐变起始点Y坐标 |
| x2 | <code>number</code> | 线性渐变结束点X坐标 |
| y2 | <code>number</code> | 线性渐变结束点Y坐标 |

<a name="createRadialGradient"></a>

## createRadialGradient(x1, y1, r1, x2, y2, r2) ⇒ <code>[jmGradient](#jmGradient)</code>
生成放射渐变对象

**Kind**: global function  
**Returns**: <code>[jmGradient](#jmGradient)</code> - 放射渐变对象  

| Param | Type | Description |
| --- | --- | --- |
| x1 | <code>number</code> | 放射渐变小圆中心X坐标 |
| y1 | <code>number</code> | 放射渐变小圆中心Y坐标 |
| r1 | <code>number</code> | 放射渐变小圆半径 |
| x2 | <code>number</code> | 放射渐变大圆中心X坐标 |
| y2 | <code>number</code> | 放射渐变大圆中心Y坐标 |
| r2 | <code>number</code> | 放射渐变大圆半径 |

<a name="refresh"></a>

## refresh()
重新刷新整个画板
以加入动画事件触发延时10毫秒刷新，保存最尽的调用只刷新一次，加强性能的效果。

**Kind**: global function  
<a name="redraw"></a>

## redraw([w], [h])
重新刷新整个画板
此方法直接重画，与refresh效果类似

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [w] | <code>number</code> | 清除画布的宽度 |
| [h] | <code>number</code> | 清除画布的高度 |

<a name="clear"></a>

## clear([w], [h])
清除画布

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [w] | <code>number</code> | 清除画布的宽度 |
| [h] | <code>number</code> | 清除画布的高度 |

<a name="css"></a>

## css(name, value)
设置画布样式，此处只是设置其css样式

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | 样式名 |
| value | <code>string</code> | 样式值 |

<a name="createPath"></a>

## createPath(points, style) ⇒ <code>[jmPath](#jmPath)</code>
生成路径对象

**Kind**: global function  
**Returns**: <code>[jmPath](#jmPath)</code> - 路径对象jmPath  

| Param | Type | Description |
| --- | --- | --- |
| points | <code>array</code> | 路径中的描点集合 |
| style | <code>[style](#style)</code> | 当前路径的样式 |

<a name="createLine"></a>

## createLine(start, end, 直线的样式) ⇒ <code>[jmLine](#jmLine)</code>
生成直线

**Kind**: global function  
**Returns**: <code>[jmLine](#jmLine)</code> - 直线对象  

| Param | Type | Description |
| --- | --- | --- |
| start | <code>point</code> | 直线的起点 |
| end | <code>point</code> | 直线的终点 |
| 直线的样式 | <code>[style](#style)</code> |  |

<a name="zoomOut"></a>

## zoomOut()
缩小整个画布按比例0.9

**Kind**: global function  
<a name="zoomIn"></a>

## zoomIn()
放大 每次增大0.1的比例

**Kind**: global function  
<a name="zoomActual"></a>

## zoomActual()
大小复原

**Kind**: global function  
<a name="scale"></a>

## scale(dx, dy)
放大缩小画布

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| dx | <code>number</code> | 缩放X轴比例 |
| dy | <code>number</code> | 缩放Y轴比例 |

<a name="toDataURL"></a>

## toDataURL() ⇒ <code>string</code>
保存为base64图形数据

**Kind**: global function  
**Returns**: <code>string</code> - 当前画布图的base64字符串  
<a name="autoRefresh"></a>

## autoRefresh(callback)
自动刷新画版

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | 执行回调 |

<a name="jmUtils"></a>

## .jmUtils
**Kind**: static class  
<a name="new_jmUtils_new"></a>

### new jmUtils()
画图基础对象
当前库的工具类

<a name="clone"></a>

## .clone(source, target, deep) ⇒ <code>object</code>
复制一个对象

**Kind**: static function  
**Returns**: <code>object</code> - 参数source的拷贝对象  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>object</code> | 被复制的对象 |
| target | <code>object</code> | 可选，如果指定就表示复制给这个对象，如果为boolean它就是deep参数 |
| deep | <code>boolean</code> | 是否深度复制，如果为true,数组内的每个对象都会被复制 |

<a name="bindEvent"></a>

## .bindEvent(html元素对象, name, fun)
绑定事件到html对象

**Kind**: static function  

| Param | Type | Description |
| --- | --- | --- |
| html元素对象 | <code>element</code> |  |
| name | <code>string</code> | 事件名称 |
| fun | <code>function</code> | 事件委托 |

<a name="removeEvent"></a>

## .removeEvent(html元素对象, name, fun)
从对象中移除事件到

**Kind**: static function  

| Param | Type | Description |
| --- | --- | --- |
| html元素对象 | <code>element</code> |  |
| name | <code>string</code> | 事件名称 |
| fun | <code>function</code> | 事件委托 |

<a name="getElementPosition"></a>

## .getElementPosition(el) ⇒ <code>[position](#position)</code>
获取元素的绝对定位

**Kind**: static function  
**Returns**: <code>[position](#position)</code> - 位置对象(top,left)  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>element</code> | 目标元素对象 |

<a name="getEventPosition"></a>

## .getEventPosition(evt, [scale]) ⇒ <code>point</code>
获取元素事件触发的位置

**Kind**: static function  
**Returns**: <code>point</code> - 事件触发的位置  

| Param | Type | Description |
| --- | --- | --- |
| evt | <code>eventArg</code> | 当前触发事件的参数 |
| [scale] | <code>point</code> | 当前画布的缩放比例 |

<a name="isType"></a>

## .isType(target, type) ⇒ <code>boolean</code>
检 查对象是否为指定的类型,不包括继承

**Kind**: static function  
**Returns**: <code>boolean</code> - 返回对象是否为指定类型  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>object</code> | 需要判断类型的对象 |
| type | <code>class</code> | 对象类型 |

<a name="pointInPolygon"></a>

## .pointInPolygon(pt, polygon, offset) ⇒ <code>integer</code>
判断点是否在多边形内
如果一个点在多边形内部，任意角度做射线肯定会与多边形要么有一个交点，要么有与多边形边界线重叠。
如果一个点在多边形外部，任意角度做射线要么与多边形有一个交点，要么有两个交点，要么没有交点，要么有与多边形边界线重叠。
利用上面的结论，我们只要判断这个点与多边形的交点个数，就可以判断出点与多边形的位置关系了。

**Kind**: static function  
**Returns**: <code>integer</code> - 0= 不在图形内和线上，1=在边上，2=在图形内部  

| Param | Type | Description |
| --- | --- | --- |
| pt | <code>point</code> | 坐标对象 |
| polygon | <code>array</code> | 多边型角坐标对象数组 |
| offset | <code>number</code> | 判断可偏移值 |

<a name="checkOutSide"></a>

## .checkOutSide(parentBounds, targetBounds, offset) ⇒ <code>bound</code>
检查边界，子对象是否超出父容器边界
当对象偏移offset后是否出界
返回(left:0,right:0,top:0,bottom:0)
如果right>0表示右边出界right偏移量,left<0则表示左边出界left偏移量
如果bottom>0表示下边出界bottom偏移量,top<0则表示上边出界ltop偏移量

**Kind**: static function  
**Returns**: <code>bound</code> - 越界标识  

| Param | Type | Description |
| --- | --- | --- |
| parentBounds | <code>bound</code> | 父对象的边界 |
| targetBounds | <code>bound</code> | 对象的边界 |
| offset | <code>number</code> | 判断是否越界可容偏差 |

<a name="rotatePoints"></a>

## .rotatePoints(p, rp, r)
把一个或多个点绕某个点旋转一定角度
先把坐标原点移到旋转中心点，计算后移回

**Kind**: static function  

| Param | Type | Description |
| --- | --- | --- |
| p | <code>Array/object</code> | 一个或多个点 |
| rp | <code>\*</code> | 旋转中心点 |
| r | <code>\*</code> | 旋转角度 |

<a name="trimStart"></a>

## .trimStart(source, [c]) ⇒ <code>string</code>
去除字符串开始字符

**Kind**: static function  
**Returns**: <code>string</code> - 去除前置字符后的字符串  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | 需要处理的字符串 |
| [c] | <code>char</code> | 要去除字符串的前置字符 |

<a name="trimEnd"></a>

## .trimEnd(source, [c]) ⇒ <code>string</code>
去除字符串结束的字符c

**Kind**: static function  
**Returns**: <code>string</code> - 去除后置字符后的字符串  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | 需要处理的字符串 |
| [c] | <code>char</code> | 要去除字符串的后置字符 |

<a name="trim"></a>

## .trim(source, [c]) ⇒ <code>string</code>
去除字符串开始与结束的字符

**Kind**: static function  
**Returns**: <code>string</code> - 去除字符后的字符串  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | 需要处理的字符串 |
| [c] | <code>char</code> | 要去除字符串的字符 |

<a name="checkPercent"></a>

## .checkPercent(字符串参数) ⇒ <code>boolean</code>
检查是否为百分比参数

**Kind**: static function  
**Returns**: <code>boolean</code> - true=当前字符串为百分比参数,false=不是  

| Param | Type |
| --- | --- |
| 字符串参数 | <code>string</code> | 

<a name="percentToNumber"></a>

## .percentToNumber(per) ⇒ <code>number</code>
转换百分数为数值类型

**Kind**: static function  
**Returns**: <code>number</code> - 百分比对应的数值  

| Param | Type | Description |
| --- | --- | --- |
| per | <code>string</code> | 把百分比转为数值的参数 |

<a name="hexToNumber"></a>

## .hexToNumber(h) ⇒ <code>number</code>
转换16进制为数值

**Kind**: static function  
**Returns**: <code>number</code> - 10进制表达  

| Param | Type | Description |
| --- | --- | --- |
| h | <code>string</code> | 16进制颜色表达 |

<a name="hex"></a>

## .hex(v) ⇒ <code>string</code>
转换数值为16进制字符串表达

**Kind**: static function  
**Returns**: <code>string</code> - 16进制表达  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>number</code> | 数值 |

<a name="toColor"></a>

## .toColor(hex) ⇒ <code>string</code>
转换颜色格式，如果输入r,g,b则转为hex格式,如果为hex则转为r,g,b格式

**Kind**: static function  
**Returns**: <code>string</code> - 颜色字符串  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | 16进制颜色表达 |


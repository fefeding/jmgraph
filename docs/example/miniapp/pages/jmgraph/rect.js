require('../../utils/jmgraph')

exports.init = function(g) {
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

  //创建一个椭圆
  var arc1 = g.createShape('arc', {
    style: style,
    center: { x: 100, y: 150 },
    width: 120,
    height: 80
  });
  arc1.canMove(true);
  g.children.add(arc1);   

  //实圆 
  style = g.util.clone(style);
  style.stroke = 'red';
  //创建一个全圆
  var arc2 = g.createShape('arc', {
    style: style,
    center: { x: 280, y: 150 },
    radius: 50
  });
  g.children.add(arc2);

  //圆弧
  style = g.util.clone(style);
  style.stroke = 'green';
  delete style.fill;//圆弧不设为实心
  //创建一个圆弧
  var arc3 = g.createShape('arc', {
    style: style,
    center: { x: 400, y: 150 },
    start: 0,
    end: Math.PI / 2,
    radius: 50
  });
  g.children.add(arc3);
  var arc4 = g.createShape('arc', {
    style: style,
    center: { x: 540, y: 150 },
    start: 0,
    end: Math.PI / 2,
    radius: 50,
    anticlockwise: true //顺时针
  });
  g.children.add(arc4);

  //这种个是直接调用canvas画的，性能会好一点
  var circle = g.createShape('circle', {
    style: style,
    center: { x: 200, y: 400 },
    radius: 50
  });
  g.children.add(circle);

  //圆环
  style = g.util.clone(style);
  style.fill = 'blue';
  style.close = true; //如果是满圆，即end = Math.PI*2 时，把这个设为false
  var harc = g.createShape('harc', {
    style: style,
    center: { x: 400, y: 400 },
    minRadius: 40,
    maxRadius: 80,
    start: 0,
    end: Math.PI / 4,
    anticlockwise: true //false  顺时针，true 逆时针
  });
  g.children.add(harc);   

  style = g.util.clone(style);
  style.shadow = '0,0,10,#fff';
  style.lineType = 'dotted'; //虚线
  style.dashLength = 10;
  style.stroke = '#48EA08';

  //创建
  var arrline = g.createShape('arrawline', {
    style: style,
    start: { x: 100, y: 100 },
    end: { x: 200, y: 350 }
    //height:100
  });
  arrline.canMove(1);
  g.children.add(arrline);

  style = g.util.clone(style);
  style.fill = '#48EA08'; //实心箭头
  //创建
  //一起结束点和一个角度angle可以决定一个箭头，如果不填angle，则会用start和end来计算角度
  var arraw = g.createShape('arraw', {
    style: style,
    start: { x: 150, y: 120 },
    end: { x: 160, y: 150 },
    //angle: Math.PI/2, //箭头角度  可以不填
    //offsetX: 5, //箭头X偏移量
    //offsetY: 8 //箭头Y偏移量
  });
  arraw.canMove(1);
  g.children.add(arraw);

  var style = {
    src: 'https://mat1.gtimg.com/www/qq2018/imgs/qq_logo_2018x2.png'
  };
  style.shadow = '0,0,10,#fff';
  //style.opacity = 0.2;		

  //创建一个image
  var img = g.createShape('image', {
    style: style,
    position: { x: 100, y: 300 }
  });
  img.canMove(true);
  g.children.add(img);

  //截取logo
  var img2 = g.createShape('image', {
    style: style,
    position: { x: 100, y: 400 },

    //伸展或缩小图像
    width: 100,
    height: 40,

    sourcePosition: { x: 0, y: 0 }, //截取起点
    sourceWidth: 60,          //截取宽度，如果不填则用原图宽
    sourceHeight: 60            //截取高度，如果不填则用原图高
  });
  g.children.add(img2);
}
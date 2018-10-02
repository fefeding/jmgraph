exports.init = function(g) {
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
    position: { x: 200, y: 150 },
    width: 120,
    height: 80
  });
  //大小改变事件
  resize.on('resize', function () {
    console.log(arguments);
  });
  resize.canMove(true);
  g.children.add(resize);          
}


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
}
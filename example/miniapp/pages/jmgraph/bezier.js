exports.init = function(g) {
  var psize = 6;
  var style = {
    stroke: 'rgb(120,20,80)',
    lineWidth: 3
  };
  style.shadow = '4,4,6,#ccc';

  var lstyle = g.util.clone(style);
  lstyle.stroke = 'rgba(131,237,111,0.7)';
  lstyle.lineWidth = 1;
  var pstyle = g.util.clone(style);
  pstyle.fill = 'rgb(191,216,44)';

  //控制点
  var mp0 = { x: 50, y: 50 };
  var mp1 = { x: 250, y: 90 };
  var mp2 = { x: 40, y: 80 };
  var mp3 = { x: 50, y: 150 };
  var mp4 = { x: 50, y: 320 };
  var mp5 = { x: 150, y: 300 };
  var mp6 = { x: 350, y: 200 };
  var mp7 = { x: 320, y: 80 };
  var mp8 = { x: 210, y: 33 };
  var mp9 = { x: 320, y: 400 };


  var mlstyle = g.util.clone(lstyle);
  mlstyle.lineWidth = 2;
  mlstyle.stroke = '#086C0A';
  delete mlstyle.shadow;

  //把控制点都连接起来
  var mpath = g.createShape('path', { style: mlstyle, points: [mp0, mp1, mp2, mp3, mp4, mp5, mp6, mp7, mp8, mp9] });
  g.children.add(mpath);
  //mpath.canMove(true);

  //生成控制点图形
  var p0arc = g.createShape('arc', { style: pstyle, center: mp0, radius: psize, start: 0, end: Math.PI * 2, width: psize, height: psize });
  g.children.add(p0arc);
  p0arc.canMove(true);
  var p1arc = g.createShape('arc', { style: pstyle, center: mp1, radius: psize, width: psize, height: psize, start: 0, end: Math.PI * 2, anticlockwise: true });
  g.children.add(p1arc);
  p1arc.canMove(true);
  var p2arc = g.createShape('arc', { style: pstyle, center: mp2, radius: psize, start: 0, end: Math.PI * 2, width: psize, height: psize });
  g.children.add(p2arc);
  p2arc.canMove(true);
  var p3arc = g.createShape('arc', { style: pstyle, center: mp3, radius: psize, start: 0, end: Math.PI * 2, width: psize, height: psize });
  g.children.add(p3arc);
  p3arc.canMove(true);
  var p4arc = g.createShape('arc', { style: pstyle, center: mp4, radius: psize, start: 0, end: Math.PI * 2, width: psize, height: psize });
  g.children.add(p4arc);
  p4arc.canMove(true);
  var p5arc = g.createShape('arc', { style: pstyle, center: mp5, radius: psize, start: 0, end: Math.PI * 2, width: psize, height: psize });
  g.children.add(p5arc);
  p5arc.canMove(true);
  var p6arc = g.createShape('arc', { style: pstyle, center: mp6, radius: psize, start: 0, end: Math.PI * 2, width: psize, height: psize });
  g.children.add(p6arc);
  p6arc.canMove(true);
  var p7arc = g.createShape('arc', { style: pstyle, center: mp7, radius: psize, start: 0, end: Math.PI * 2, width: psize, height: psize });
  g.children.add(p7arc);
  p7arc.canMove(true);
  var p8arc = g.createShape('arc', { style: pstyle, center: mp8, radius: psize, start: 0, end: Math.PI * 2, width: psize, height: psize });
  g.children.add(p8arc);
  p8arc.canMove(true);
  var p9arc = g.createShape('arc', { style: pstyle, center: mp9, radius: psize, start: 0, end: Math.PI * 2, width: psize, height: psize });
  g.children.add(p9arc);
  p9arc.canMove(true);

  style.zIndex = 100;
  //bezier线
  var mbezierpath = g.createShape('path', { style: style });
  g.children.add(mbezierpath);

  var arrstyle = g.util.clone(style);
  var arr = g.createShape('arrow', { style: arrstyle });
  g.children.add(arr);

  var chplines = [];
  var chpstyle = g.util.clone(mlstyle);
  chpstyle.lineWidth = 1;
  chpstyle.stroke = 'rgb(142,142,15)';
  //根据控制点生成曲线点
  function getpoint(ps, t, index) {
    if (ps.length == 1) return ps[0];
    if (ps.length == 2) {
      var p = {};
      p.x = (ps[1].x - ps[0].x) * t + ps[0].x;
      p.y = (ps[1].y - ps[0].y) * t + ps[0].y;
      return p;
    }
    if (ps.length > 2) {
      var ppp;
      if (chplines.length <= index) {
        ppp = chplines[index] = g.createShape('path', { style: chpstyle });
        g.children.add(ppp);
      }
      else {
        ppp = chplines[index];
      }
      ppp.points = [];
      for (var i = 0; i < ps.length - 1; i++) {
        var p = getpoint([ps[i], ps[i + 1]], t);
        if (p) {
          ppp.points.push(p);
        }
      }
      index++;
      return getpoint(ppp.points, t, index);
    }
  }

  //动画，更新线条和点位置
  var t = 0;
  var dir = 0;
  var speed = 0.02;
  function handler() {
    if (t > 1) {
      t = 1;
      dir = 1;
      mbezierpath.points = [];
    }
    else if (t < 0) {
      t = 0;
      dir = 0;
      mbezierpath.points = [];
    }
    var mp = getpoint(mpath.points, t, 0);
    mbezierpath.points.push(mp);

    if (mbezierpath.points.length > 1) {
      arr.start = mbezierpath.points[mbezierpath.points.length - 2];
      arr.end = mbezierpath.points[mbezierpath.points.length - 1];
    }
    t = dir == 0 ? (t + speed) : (t - speed);
    exports.handler=setTimeout(handler, 50);
  }
  handler();
}

exports.destory = function () {
  if (exports.handler) clearTimeout(exports.handler);
}
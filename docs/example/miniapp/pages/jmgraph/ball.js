
exports.init = function(g) {
  resize(g);

  var style = {
    lineWidth: 1,
    close: true,
    stroke: '#fff',
    fill: '#05a2e2'
  };



  var balls = [];
  function createPosition(radius, i) {
    var x = Math.random() * g.width + radius;
    var y = Math.random() * g.height + radius;

    for (var j = i + 1; j < balls.length; j++) {
      var b2 = balls[j];
      var lx = Math.abs(x - b2.x());
      var ly = Math.abs(y - b2.y());
      var l = Math.sqrt(lx * lx + ly * ly);
      //如果二个球重叠则放 弃当前球
      if (l < radius + b2.radius) {
        return createPosition(radius);
      }
    }
    return { x: x, y: y };
  }


  for (var i = 0; i < 10; i++) {
    var radius = Math.random() * 10 + 8;
    var styletmp = g.util.clone(style);
    styletmp.fill = g.createRadialGradient(radius, radius, 0, radius, radius, radius);
    var rr1 = Math.floor(Math.random() * 255);
    var gg1 = Math.floor(Math.random() * 255);
    var bb1 = Math.floor(Math.random() * 255);
    var rr2 = Math.floor(Math.random() * 255);
    var gg2 = Math.floor(Math.random() * 255);
    var bb2 = Math.floor(Math.random() * 255);
    styletmp.fill.addStop(0, g.util.toColor(rr1, gg1, bb1));
    styletmp.fill.addStop(1, g.util.toColor(rr2, gg2, bb2));
    //styletmp.fill = 'r(0.5,0.1)#ccc-#ccc';
    var p = createPosition(radius);
    var b = new ball(g, p.x, p.y, radius, styletmp);
    b.vx = 0;//Math.random() * 20 - 10;
    b.vy = 0;//Math.random() * 20 - 10;
    //b.ax = 0;
    //b.ay = 0.4;
    balls.push(b);
  }

  var radius = Math.random() * 10 + 6;
  var styletmp = g.util.clone(style);
  styletmp.fill = g.createRadialGradient(radius, radius, 0, radius, radius, radius);
  styletmp.fill.addStop(0, '#fff');
  styletmp.fill.addStop(1, g.util.toColor(255, 149, 255));
  var p = createPosition(radius, 0);
  var b = new ball(g, p.x, p.y, radius, styletmp);
  b.vx = 6;
  b.vy = 4;
  balls.push(b);

  function animate() {
    var bs = balls;
    var len = bs.length;
    //var mvx = 0;
    //var mvy = 0;
    for (var i = 0; i < len; i++) {
      var b1 = bs[i];
      b1.vx += b1.ax;
      b1.vy += b1.ay;
      for (var j = i + 1; j < len; j++) {
        var b2 = bs[j];
        var lx = b1.x() - b2.x();
        var ly = b1.y() - b2.y();
        var l = Math.sqrt(lx * lx + ly * ly);
        if (l <= b1.radius + b2.radius) {
          var vx = b1.vx;
          var vy = b1.vy;
          var vxb = b2.vx;
          var vyb = b2.vy;

          var angle = Math.atan2(ly, lx);
          var sine = Math.sin(angle);
          var cosine = Math.cos(angle);

          var x = 0;
          var y = 0;

          var xb = lx * cosine + ly * sine;
          var yb = ly * cosine - lx * sine;

          var vx = b1.vx * cosine + b1.vy * sine;
          var vy = b1.vy * cosine - b1.vx * sine;
          var vxb = b2.vx * cosine + b2.vy * sine;
          var vyb = b2.vy * cosine - b2.vx * sine;

          var vtotal = vx - vxb;

          vx = ((b1.radius - b2.radius) * vx + 2 * b2.radius * vxb) / (b1.radius + b2.radius);
          vxb = vtotal + vx;

          var vx1 = vx * cosine - vy * sine;
          var vy1 = vy * cosine + vx * sine;

          var vx2 = vxb * cosine - vyb * sine;
          var vy2 = vyb * cosine + vxb * sine;

          b1.vx = vx1;
          b1.vy = vy1;
          b2.vx = vx2;
          b2.vy = vy2;
        }
      }
      var x = b1.x() + b1.vx;
      var maxX = b1.graph.width - b1.radius;
      if (x <= b1.radius || x >= maxX) {
        //b1.vy -= 0.4;
        b1.vx *= -1;
      }
      x = Math.max(x, b1.radius);
      x = Math.min(maxX, x);
      b1.x(x);
      var y = b1.y() + b1.vy;
      var maxY = b1.graph.height - b1.radius;
      if (y <= b1.radius || y >= maxY) {
        //if(y >= maxY && b1.vy > 0) {b1.vy -= 1;b1.vx -= 0.4;}
        b1.vy *= -1;
      }
      y = Math.max(y, b1.radius);
      y = Math.min(maxY, y);
      b1.y(y);
    }
    g.needUpdate = true;
    exports.handler = setTimeout(animate, 1);
  };
  animate();		
}

function resize(g) {
  if (g) {
    var info = wx.getSystemInfoSync();
    g.width = info.windowWidth - 2;
    g.height = info.windowHeight - 100;
  }
}

function ball(graph, x, y, radius, style) {
  this.graph = graph;
  this.radius = radius;
  this.center = { x: x, y: y };
  this.shape = graph.createShape('arc', { style: style, center: this.center, radius: this.radius, anticlockwise: true });
  graph.children.add(this.shape);
  this.shape.canMove(true);
  this.vx = 0;
  this.vy = 0;
  this.ax = 0;
  this.ay = 0;


  this.x = function (x) {
    if (typeof x !== 'undefined') this.center.x = x;
    return this.center.x;
  }
  this.y = function (y) {
    if (typeof y !== 'undefined') this.center.y = y;
    return this.center.y;
  }
}

exports.destory = function() {
  if (exports.handler) clearTimeout(exports.handler);
}
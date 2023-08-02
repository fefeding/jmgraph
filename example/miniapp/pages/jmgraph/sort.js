exports.init = function(g) {
  this.sort = new jmSort(g);

  this.sort.init();
  this.sort.heapSort(function (ret) {
    console.log(ret);
  });	
}

exports.destroy = function () {
  if (exports.sort.aniTimeoutHandler) clearTimeout(exports.sort.aniTimeoutHandler);
}

Array.prototype.toRect = function () {
  var rects = [];
  for (var i = 0; i < this.length; i++) {
    rects.push(this[i].rect || this);
  }
  return rects;
}

//排序管理对象
function jmSort(graph) {
  //原始数组个数
  this.arrCount = 20;
  //原始数组
  this.source = [];

  this.graph = graph;
  this.rectStyle = {
    stroke: 'rgb(173,173,209)',
    lineWidth: 1,
    close: true,
    fill: 'rgb(8,209,54)'
  };

  this.disableStyle = {
    stroke: 'rgba(173,173,209,0.8)',
    lineWidth: 1,
    close: true,
    fill: 'rgba(88,196,113,0.5)'
  };
  //this.rectStyle.shadow = this.graph.createShadow(2,2,2,'rgb(39,40,34)');

  this.selectRectStyle = {
    stroke: 'rgb(120,20,80)',
    lineWidth: 1,
    zIndex: 100,
    close: true,
    fill: 'rgba(255,180,5,0.7)'
  };
  //this.selectRectStyle.shadow = this.graph.createShadow(4,4,6,'rgb(39,40,34)');

  //基准样式
  this.datumRectStyle = {
    stroke: 'rgb(224,84,68)',
    lineWidth: 2,
    close: true,
    zIndex: 50,
    //lineType: 'dotted',
    fill: 'rgba(224,84,68,0.7)'
  };

  this.labelStyle = {
    stroke: 'rgb(120,20,80)',
    textAlign: 'center',
    textBaseline: 'middle',
    font: '12px Arial',
    lineWidth: 1
  };
}

//延迟数组循环
jmSort.prototype.arrayTimeout = function (arr, fun, endfun, t, index, end) {
  index = index || 0;
  end = end || arr.length;
  var t = t || 200;
  var self = this;
  function intervalArr() {
    if (index >= end) { endfun && endfun(); return; }
    var r = fun(index, arr[index], function () {
      index++;
      self.timeoutHandler = setTimeout(intervalArr, t);
    });
    if (r === false) {
      endfun && endfun(); return
    }
  }
  intervalArr();
}

//柱子移动动画
jmSort.prototype.rectAnimate = function (rect, cb) {
  if (typeof index == 'function') {
    cb = index;
    index = 0;
  }
  if (!rect.length) {
    rect = [rect];
  }

  var tox = [];
  var offx = [];
  var pos = [];
  var count = rect.length;
  for (var i = 0; i < count; i++) {
    pos[i] = rect[i].rect.position;
    //重新计算其x坐标
    tox[i] = this.xStep * rect[i].index + 10;
    offx[i] = (tox[i] - pos[i].x) / 20;
  }

  var self = this;
  function move() {
    var complete = 0;
    for (var i = 0; i < count; i++) {
      pos[i].x += offx[i];
      if (offx[i] == 0 || (offx[i] > 0 && pos[i].x >= tox[i]) || (offx[i] < 0 && pos[i].x <= tox[i])) {
        pos[i].x = tox[i];
        complete++;
      }
    }
    self.graph.redraw();
    if (complete >= count) {
      cb && cb();
    }
    else {
      self.aniTimeoutHandler = setTimeout(move, 50);
    }
  }
  move();
}

//播放动画
jmSort.prototype.play = function (frames, callback) {
  if (typeof frames == 'function') {
    callback = frames;
    frames = null;
  }
  frames = frames || this.frames;

  if (frames.length == 0) {
    callback && callback();
    return;
  }
  var f = frames.splice(0, 1)[0];//取最早的一个
  var self = this;

  if (f.msg) {
    //log(f.msg);
    console.log(f.msg);
  }

  if (f.move && f.move.length) {
    //var count = 0;
    //for(var i=0;i<f.move.length;i++) {
    this.rectAnimate(f.move, function () {
      //count ++;
      //if(count >= f.move.length) {
      self.play(callback);
      //}
    });
    //}
  }
  else if (f.sels) {
    this.selectRect.apply(this, f.sels);
    this.play(callback);
    //setTimeout(function(){
    //	self.play(callback);
    //}, 40);
  }
  else if (f.datum) {
    if (this.datumLine) {
      var start = this.datumLine.start;
      var end = this.datumLine.end;
      start.y = end.y = f.datum.rect.position.y;
      this.datumLine.visible = true;
    }
    this.play(callback);
  }
  else if (f.refresh) {
    this.refreshGraph(f.refresh);
    this.play(callback);
  }
  else {
    this.play(callback);
  }
}

//初始化排序条件，原始数组
jmSort.prototype.init = function () {
  this.source = [];
  this.frames = [];
  var max = 100;
  var offy = this.graph.height - 20;
  this.graph.children.clear();
  //当前 x轴分布单位宽度
  this.xStep = (this.graph.width - 20) / this.arrCount;

  for (var i = 0; i < this.arrCount; i++) {
    var v = {};
    v.value = Math.floor(Math.random() * max);
    v.height = v.value / max * offy;
    v.toString = function () {
      return this.value;
    };
    this.source.push(v);
  }
  //画基准线
  this.datumLine = this.graph.createLine({ x: 0, y: 0 }, { x: this.graph.width, y: 0 }, this.datumRectStyle);
  this.datumLine.visible = false;
  this.graph.children.add(this.datumLine);
  this.refreshGraph(this.source);
}

jmSort.prototype.reset = function () {
  if (this.timeoutHandler) clearTimeout(this.timeoutHandler);
  if (this.aniTimeoutHandler) clearTimeout(this.aniTimeoutHandler);
  if (this.datumLine) this.datumLine.visible = false;
  //this.refreshGraph();	
  clear();
  this.init();
}

//刷新画布
jmSort.prototype.refreshGraph = function (arr) {
  arr = arr || this.source;
  //this.graph.children.clear();
  var offy = this.graph.height - 20;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].rect) {
      var pos = arr[i].rect.position;
      pos.x = this.xStep * i + 10;
    }
    else {
      var pos = {};
      pos.x = this.xStep * i + 10;
      pos.y = offy - arr[i].height;
      arr[i].rect = this.graph.createShape('rect', { position: pos, width: 10, height: arr[i].height, style: this.rectStyle });
      //arr[i].item = arr[i];
      var label = this.graph.createShape('label', { style: this.labelStyle, position: { x: 0, y: arr[i].height }, value: arr[i].value, width: 10, height: 20 });

      arr[i].rect.children.add(label);
      this.graph.children.add(arr[i].rect);
    }
    //this.graph.children.add(arr[i].rect);
  }
  //this.graph.redraw();
}

//选中某几个值，则加亮显示
jmSort.prototype.selectRect = function (datum, sels, area) {
  var self = this;
  this.graph.children.each(function (i, rect) {
    if (!rect.is('jmRect')) return;
    if (datum && (datum.indexOf(rect) > -1)) {
      rect.style = self.datumRectStyle;
    }
    else if (sels && (sels.indexOf(rect) > -1)) {
      rect.style = self.selectRectStyle;
    }
    else if (area && (area.indexOf(rect) > -1)) {
      rect.style = self.rectStyle;
    }
    else {
      rect.style = self.disableStyle;
    }
  });
  //this.graph.refresh();
}

//快速排序
//取其中一个值，把小于此值的放到其左边，大于此值的放到其右边
//如此递归
jmSort.prototype.quickSort = function (arr, callback) {
  if (typeof arr == 'function') {
    callback = arr;
    arr = null;
  }
  arr = arr || this.source;

  this.frames.push({ msg: '快速排序:取其中一个值，把小于此值的放到其左边，大于此值的放到其右边,再分别对左右二边进行同样处理，如此递归直到最后一个元素。<br />' });

  var self = this;
  function sort(source, oldleft, oldrigth) {
    if (source.length <= 1) return source;

    self.frames.push({ msg: '<br />选定区域：' + source.toString() });
    //取一个值做为比较对象，这里直接取中间的值（任务一个都可）
    var mindex = Math.floor(source.length / 2);
    var m = source[mindex];//基准值
    self.frames.push({ datum: m, msg: '选中' + m.value + '为基准值' });

    //选中当前区域
    var area = [];
    for (var i = 0; i < source.length; i++) {
      area.push(source[i].rect);
    }
    self.frames.push({ sels: [[m.rect], null, area] });

    var left = mindex > 0 ? source.slice(0, mindex) : [];
    var right = mindex > 0 && mindex < source.length - 1 ? source.slice(mindex + 1) : [];
    var middle = [m];

    var index = oldleft ? oldleft.length : 0;
    for (var i = 0; i < source.length; i++) {
      var s = source[i];
      self.frames.push({ sels: [[m.rect], [s.rect], area] });
      var f = { move: [] };
      var sindex = i;
      if (s.value < m.value) {
        if (i < mindex) continue;
        left.push(s);
        var rindex = right.indexOf(s);
        right.splice(rindex, 1);
        sindex = left.length - 1;
        f.move.push({
          rect: s.rect,
          index: sindex + index
        });
        f.msg = s.value + '小于基准值' + m.value + '，移往基准值左边';
        var movearr = middle.concat(right);
        for (var j = 0; j < rindex + middle.length; j++) {
          f.move.push({
            rect: movearr[j].rect,
            index: sindex + index + j + 1
          });
        }
      }
      else if (s.value > m.value) {
        if (i > mindex) continue;
        var lindex = left.indexOf(s);
        left.splice(lindex, 1);
        right.unshift(s);
        sindex = left.length + middle.length;
        f.move.push({
          rect: s.rect,
          index: sindex + index
        });
        f.msg = s.value + '大于基准值' + m.value + '，移往基准值右边';
        var movearr = left.concat(middle);
        for (var j = lindex; j < movearr.length; j++) {
          f.move.push({
            rect: movearr[j].rect,
            index: index + j
          });
        }
      }
      else if (i != mindex) {
        if (i < mindex) {
          var lindex = left.indexOf(s);
          left.splice(lindex, 1);
          middle.unshift(s);
          sindex = left.length;
          f.move.push({
            rect: s.rect,
            index: sindex + index
          });

          f.msg = s.value + '等于基准值' + m.value + '，移往基准值左边位';
          for (var j = lindex; j < left.length; j++) {
            f.move.push({
              rect: left[j].rect,
              index: index + j
            });
          }
        }
        if (i > mindex) {
          var rindex = right.indexOf(s);
          right.splice(right.indexOf(s), 1);
          middle.push(s);
          sindex = left.length + middle.length - 1;
          f.move.push({
            rect: s.rect,
            index: sindex + index
          });

          f.msg = s.value + '等于基准值' + m.value + '，移往基准值右边位';
          for (var j = 0; j < rindex; j++) {
            f.move.push({
              rect: right[j].rect,
              index: sindex + index + j + 1
            });
          }
        }
      }
      if (f.move.length) self.frames.push(f);
    }

    return sort(left, oldleft, middle.concat(right, oldrigth || [])).concat(middle, sort(right, (oldleft || []).concat(left, middle)));
  }
  var result = sort(arr);
  this.play(function () {
    callback && callback(result);
  });
  return result;
}

//直接插入排序
//将一个记录插入到已排序好的有序表中，从而得到一个新记录数增1的有序表。即：先将序列的第1个记录看成是一个有序的子序列，然后从第2个记录逐个进行插入，直至整个序列有序为止。
jmSort.prototype.straightInsertionSort = function (arr, dk, callback) {
  if (typeof arr == 'function') {
    callback = arr;
    arr = null;
  }
  if (typeof dk == 'function') {
    callback = dk;
    dk = 0;
  }



  arr = arr || this.source;
  dk = dk || 1;
  if (dk == 1) this.frames.push({ msg: '直接插入排序(' + dk + ')：先将序列的第1个记录看成是一个有序的子序列，然后从第2个记录逐个进行插入，直至整个序列有序为止。(实际操作就是每个元素向前比较直到值等于或小于它为止)<br />' });

  //拷贝一份
  var result = arr.slice(0);
  var self = this;

  for (var i = dk; i < result.length; i++) {
    var k = i;
    var j = k - dk;
    while (j >= 0) {
      var v = result[k];
      var pre = result[j];

      this.frames.push({ sels: [[v.rect], [pre.rect]] });

      if (v.value < pre.value) {
        result[j] = v;
        result[k] = pre;

        v.index = j;
        pre.index = k;

        this.frames.push({ move: [{ rect: pre.rect, index: k }, { rect: v.rect, index: j }], msg: v.value + '小于' + pre.value + '，互换位置，继续往前比较。' });

        k = j;
        j -= dk;
      }
      else {
        this.frames.push({ msg: v.value + '大于或等于' + pre.value + '，中止往前比较。' });
        break;
      }
    }
  }

  callback && callback(result);
  return result;
}

//希尔排序
//先将整个待排序的记录序列分割成为若干子序列分别进行直接插入排序，待整个序列中的记录“基本有序”时，再对全体记录进行依次直接插入排序。
jmSort.prototype.shellSort = function (arr, callback) {
  if (typeof arr == 'function') {
    callback = arr;
    arr = null;
  }
  this.frames.push({ msg: '希尔排序：先将整个待排序的记录序列分割成为若干子序列分别进行直接插入排序，待整个序列中的记录“基本有序”时，再对全体记录进行依次直接插入排序。(其实就是将直接插入排序的与前一个比较改为与前第N个比较，直接全部排完。)<br />' });

  arr = arr || this.source;
  var dk = Math.floor(arr.length / 2);
  var result = arr;
  while (dk >= 1) {
    this.frames.push('比较跨度：' + dk);
    result = this.straightInsertionSort(result, dk);
    dk = Math.floor(dk / 2);
  }

  this.play(function () {
    callback && callback(result);
  });
  return result;
}

//简单选择排序
//在要排序的一组数中，选出最小（或者最大）的一个数与第1个位置的数交换；然后在剩下的数当中再找最小（或者最大）的与第2个位置的数交换，依次类推，直到第n-1个元素（倒数第二个数）和第n个元素（最后一个数）比较为止。
jmSort.prototype.simpleSelectionSort = function (arr, callback) {
  if (typeof arr == 'function') {
    callback = arr;
    arr = null;
  }
  arr = arr || this.source.slice(0);

  this.frames.push({ msg: '简单选择排序：在要排序的一组数中，选出最小（或者最大）的一个数与第1个位置的数交换；然后在剩下的数当中再找最小（或者最大）的与第2个位置的数交换，依次类推，直到第n-1个元素（倒数第二个数）和第n个元素（最后一个数）比较为止。<br />' });

  for (var i = 0; i < arr.length - 1; i++) {
    var min = arr[i];
    var minindex = i;

    for (var j = i + 1; j < arr.length; j++) {
      if (min.value > arr[j].value) {
        min = arr[j];
        minindex = j;
      }
      //this.frames.push({sels:[[min.rect], [arr[j].rect]]});
    }

    if (minindex != i) {
      this.frames.push({ sels: [[min.rect], [arr[i].rect], arr.slice(i).toRect()] });
      this.frames.push({ move: [{ rect: min.rect, index: i }, { rect: arr[i].rect, index: minindex }], msg: '最小值为：' + min.value + '，跟第' + (i + 1) + '个元素互换位置。' });
      arr[minindex] = arr[i];
      arr[i] = min;
    }
  }

  this.play(function () {
    callback && callback(arr);
  });

  return arr;
}

//二元选择排序
//简单选择排序，每趟循环只能确定一个元素排序后的定位。我们可以考虑改进为每趟循环确定两个元素（当前趟最大和最小记录）的位置,从而减少排序所需的循环次数。改进后对n个数据进行排序，最多只需进行[n/2]趟循环即可
jmSort.prototype.selection2Sort = function (arr, callback) {
  if (typeof arr == 'function') {
    callback = arr;
    arr = null;
  }
  arr = arr || this.source.slice(0);

  this.frames.push({ msg: '二元选择排序：简单选择排序，每趟循环只能确定一个元素排序后的定位。我们可以考虑改进为每趟循环确定两个元素（当前趟最大和最小记录）的位置,从而减少排序所需的循环次数。改进后对n个数据进行排序，最多只需进行[n/2]趟循环即可<br />' });

  var index = -1;
  var self = this;
  var end = Math.floor(arr.length / 2);
  for (var i = 0; i < end; i++) {
    //取最小值和最大值
    var min = arr[i];
    var max = arr[i];
    var minindex = i;
    var maxindex = i;

    for (var j = i + 1; j < arr.length - i; j++) {
      if (min.value > arr[j].value) {
        min = arr[j];
        minindex = j;
      }
      if (max.value <= arr[j].value) {
        max = arr[j];
        maxindex = j;
      }
    }

    var maxpos = j - 1;
    this.frames.push({ sels: [[min.rect, arr[i].rect], [max.rect, arr[maxpos].rect], arr.slice(i, j).toRect()] });
    if (minindex != i) {
      this.frames.push({ move: [{ rect: min.rect, index: i }, { rect: arr[i].rect, index: minindex }], msg: '最小值为：' + min.value + '，跟第' + (i + 1) + '个元素互换位置。' });
      arr[minindex] = arr[i];
      arr[i] = min;
      //如果最大值是当前起始值，则它被换到最小值位置上了
      //需要重新改变最大值的索引为找到的最小值的索引
      if (maxindex == i) {
        maxindex = minindex;
      }
    }
    if (maxindex != maxpos) {
      this.frames.push({ move: [{ rect: max.rect, index: maxpos }, { rect: arr[maxpos].rect, index: maxindex }], msg: '最大值为：' + max.value + '，跟第' + j + '个元素互换位置。' });
      arr[maxindex] = arr[maxpos];
      arr[maxpos] = min;
    }
  }

  this.play(function () {
    callback && callback(arr);
  });

  return arr;
}

//冒泡排序
//在要排序的一组数中，对当前还未排好序的范围内的全部数，自上而下对相邻的两个数依次进行比较和调整，让较大的数往下沉，较小的往上冒。即：每当两相邻的数比较后发现它们的排序与排序要求相反时，就将它们互换。
jmSort.prototype.bubbleSort = function (arr, callback) {
  if (typeof arr == 'function') {
    callback = arr;
    arr = null;
  }
  arr = arr || this.source.slice(0);

  this.frames.push({ msg: '冒泡排序：在要排序的一组数中，对当前还未排好序的范围内的全部数，自上而下对相邻的两个数依次进行比较和调整，让较大的数往下沉，较小的往上冒。即：每当两相邻的数比较后发现它们的排序与排序要求相反时，就将它们互换。<br />' });

  var i = arr.length - 1;
  while (i > 0) {
    var pos = 0;
    for (var j = 0; j < i; j++) {
      this.frames.push({
        sels: [[arr[j].rect], [arr[j + 1].rect], arr.slice(0, i + 1).toRect()]
      });

      if (arr[j].value > arr[j + 1].value) {
        pos = j;
        var tmp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = tmp;
        this.frames.push({
          move: [{
            rect: tmp.rect,
            index: j + 1
          }, {
            rect: arr[j].rect,
            index: j
          }],
          msg: tmp.value + '大于' + arr[j].value + '，互换位置。'
        });
      }
    }
    i = pos;
  }
  this.play(function () {
    callback && callback(arr);
  });
}

//堆排序
jmSort.prototype.heapSort = function (arr, callback) {
  if (typeof arr == 'function') {
    callback = arr;
    arr = null;
  }
  arr = arr || this.source.slice(0);

  this.frames.push({ msg: '堆排序：简单讲就是把一个数组看成一个完全的二叉树，每个节点带二个子节点，不断调整节点的位置保证父节点大于二个子节点，取根节点就是它的最大值（取完再进行一次调整如此递归），直到取完为止。<br />' });

  var result = [];
  var self = this;
  //把堆排列为大堆
  //堆中每个父节点的元素值都大于等于其孩子结点（如果存在）,这样的堆就是一个最大堆
  function bigHeap(source) {
    if (source.length <= 1) return source;
    self.frames.push({ msg: '调整堆，保证父节点大于子节点。<br />' });

    var area = [];
    for (var i = 0; i < source.length; i++) {
      area.push(source[i].rect);
    }

    for (var i = source.length; i > 0; i--) {
      var s = source[i - 1];
      //左右子节点
      var left = 2 * i;
      var right = left + 1;

      var selitems = [];
      if (source[left - 1]) {
        selitems.push(source[left - 1].rect);
      }
      if (source[right - 1]) {
        selitems.push(source[right - 1].rect);
      }
      self.frames.push({
        sels: [[s.rect], selitems, area]
      });

      //如果左子节点大于当前节点，则互换
      if (left <= source.length && source[left - 1].value > s.value) {
        self.frames.push({
          move: [{
            rect: source[left - 1].rect,
            index: i - 1
          }, {
            rect: s.rect,
            index: left - 1
          }], msg: '左子节点' + source[left - 1].value + '大于父节点' + s.value + '，互换位置'
        });

        source[i - 1] = source[left - 1];
        source[left - 1] = s;
        s = source[i - 1];

        self.frames.push({
          sels: [[s.rect], selitems, area]
        });
      }
      if (right <= source.length && source[right - 1].value > s.value) {

        self.frames.push({
          move: [{
            rect: source[right - 1].rect,
            index: i - 1
          }, {
            rect: s.rect,
            index: right - 1
          }], msg: '右子节点' + source[right - 1].value + '大于父节点' + s.value + '，互换位置'
        });

        source[i - 1] = source[right - 1];
        source[right - 1] = s;

        self.frames.push({
          sels: [[source[i - 1].rect], selitems, area]
        });
      }
    }
    return source;
  }

  //每次取出根节点，再对余下的排为大堆，如此递归
  function sort(source) {
    source = bigHeap(source);
    //取最大的一个,放到结果第一个中
    result.unshift(source.shift());

    var f = {
      move: [{
        rect: result[0].rect,
        index: source.length
      }],
      msg: '取堆的根节点（堆中的最大值）:' + result[0].value + '，移到数组最后'
    };
    for (var i = 0; i < source.length; i++) {
      f.move.push({
        rect: source[i].rect,
        index: i
      });
    }
    self.frames.push(f);
    if (source.length) {
      sort(source);
    }
  }
  sort(arr);//执行堆排序
  this.play(function () {
    callback && callback(result);
  });

  return result;
}
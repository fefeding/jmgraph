// pages/jmgraph/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shapes: [
      { name: 'rect', value: 'base', checked: 'true'},
      { name: 'bezier', value: 'bezier'  },
      { name: 'resize', value: 'resize' },
      { name: 'ball', value: '球' },
      { name: 'cell', value: '孢子' },
      { name: 'sort', value: '排序' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    let jmGraph = require('../../utils/jmgraph');

    var self = this;

    jmGraph('firstCanvas', {
      style: {
        fill: '#000'
      }
    }).then((g) => {
      self.initGraph(g);
    });
		/*var g = new jmGraph(container, {
			width: 800,
			height: 600,
			style: {
				fill: '#000'
			}
		});
		this.initGraph(g);;*/
  },

  initGraph: function(g) {
    function update() {
      if (g.needUpdate) g.redraw();
      setTimeout(update, 20);
    }  
    this.graph = g;    
    update();

    this.changeShape('rect');//默认显示

    //初始化jmGraph事件
    //把小程序中的canvas事件交给jmGraph处理
    this.canvastouchstart = function () {
      return g.eventHandler.touchStart.apply(this, arguments);
    }
    this.canvastouchmove = function () {
      return g.eventHandler.touchMove.apply(this, arguments);
    }
    this.canvastouchend = function () {
      return g.eventHandler.touchEnd.apply(this, arguments);
    }
    this.canvastouchcancel = function () {
      return g.eventHandler.touchCancel.apply(this, arguments);
    }
  },

  radioChange: function(e) {
    console.log(e);
    //切换示例
    this.changeShape(e.detail.value);
  },

  changeShape: function(s) {
    this.graph.children.clear();
    if (this.graphShape && this.graphShape.destory) {
      this.graphShape.destory();
    }
    //切换示例
    this.graphShape = require(s);
    this.graphShape.init(this.graph);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
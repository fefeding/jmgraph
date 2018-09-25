// pages/jmgraph/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
      init(g)
    });
		/*var g = new jmGraph(container, {
			width: 800,
			height: 600,
			style: {
				fill: '#000'
			}
		});
		init(g);*/

    function init(g) {      

      function update() {
        if (g.needUpdate) g.redraw();
        requestAnimationFrame(update);
      }

      var rect = require('rect');
      rect.init(g);
      update();

      //初始化jmGraph事件
      //把小程序中的canvas事件交给jmGraph处理
      self.canvastouchstart = function() {
        return g.eventHandler.touchStart.apply(this, arguments);
      }
      self.canvastouchmove = function() {
        return g.eventHandler.touchMove.apply(this, arguments);
      }
      self.canvastouchend = function() {
        return g.eventHandler.touchEnd.apply(this, arguments);
      }
      self.canvastouchcancel = function() {
        return g.eventHandler.touchCancel.apply(this, arguments);
      }
    }
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
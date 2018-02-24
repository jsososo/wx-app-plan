import { getCalendar, numberAnimation } from '../../../utils/util.js';
// pages/piggyBank/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    saved: 0,
    start: '',
    end: '',
    progress: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function () {
    setTimeout(() => {
      numberAnimation((arr) => {
        this.setData({
          progress: arr[0],
          saved: arr[1].toFixed(2),
        })
      }, [{ from: 0, to: 30 }, { from: 0, to: 40, fix: 2 }]);
    }, 2000);
  },

  // 签到
  singIn: function () {

  },

  // 额外存款
  saveMoney: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
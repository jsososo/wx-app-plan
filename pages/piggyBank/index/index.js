import { numberAnimation } from '../../../utils/util.js';
import globalData from '../../../utils/globalData';
import timer from '../../../utils/timer';
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
    savedProgress: 0,
    timeProgress: 0,
    planInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const planInfo = globalData.bankList[options.id];

    this.setData({
      planInfo,
      total: planInfo.totalNum,
      start: timer(planInfo.startTime).str('YYYY-MM-DD'),
      end: timer(planInfo.endTime).str('YYYY-MM-DD'),
    })
  },

  onShow: function () {
    const { savedNum, totalNum, startTime, endTime } = this.data.planInfo;
    console.log(this.data.planInfo);
    const tPro = (timer().getTime() - timer(startTime).getTime()) / (timer(endTime).getTime() - timer(startTime).getTime());
    setTimeout(() => {
      numberAnimation((arr) => {
        this.setData({
          savedProgress: arr[0],
          saved: arr[1],
          timeProgress: arr[2],
        })
      }, [{ from: 0, to: savedNum * 100 / totalNum }, { from: 0, to: savedNum, fix: 2 }, { from: 0, to: tPro * 100 }]);
    }, 500);
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
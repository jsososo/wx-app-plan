// pages/piggyBank/calendar/calendar.js
import { getCalendar } from '../../../utils/timer.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayArray: ['日', '一', '二', '三', '四', '五', '六'],
    dateArray: [],
    year: 0,
    month: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const d = new Date()

    this.setData({
      dateArray: getCalendar(d.getFullYear(), d.getMonth()),
      year: d.getFullYear(),
      month: d.getMonth(),
    })
  },

  // 通过箭头修改年、月
  changeTimeByArrow: function (e) {
    let { year, month } = this.data
    month += Number(e.target.dataset.value)

    if (month === -1) {
      month = 11
      year--
    } else if (month === 12) {
      month = 0
      year++
    }

    this.setData({
      dateArray: getCalendar(year, month),
      year,
      month
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
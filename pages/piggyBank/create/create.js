// pages/piggyBank/create/create.js
import { dateToString, stringToDate } from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: '',
    endDate: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      startDate: dateToString(),
      endDate: dateToString()
    })
  },

  // 修改日期
  bindDateChange: function (e) {
    let data = this.data
    data[e.target.dataset.type] = e.detail.value
    console.log(stringToDate(data.startDate), stringToDate(data.endDate))
    if (stringToDate(data.startDate) > stringToDate(data.endDate)) {
      data.endDate = data.startDate
    }
    this.setData(data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
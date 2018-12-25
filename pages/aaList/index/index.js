// pages/aaList/index/index.js
import Storage from '../../../utils/Storage';
import globalData from '../../../utils/globalData';
import timer from '../../../utils/timer';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const user = globalData.userInfo;
    Storage.queryBmob(
      'AACash',
      (q) => {
        q.equalTo('userIds', user.objectId);
        q.select('updatedAt', 'title', 'users', 'userId');
        return q;
      },
      (res) => {
        res.sort((a, b) => timer(a.updatedAt, 'YYYY-MM-DD HH:mm:ss').time < timer(b.updatedAt, 'YYYY-MM-DD HH:mm:ss'));
        this.setData({ list: res });
      },
      null, 'find'
    );
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
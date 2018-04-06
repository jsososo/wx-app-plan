// pages/list/list.js
import { Get, Post } from '../../utils/request.js';
import timer from '../../utils/timer';
import { shortString } from '../../utils/util';
import globalData from '../../utils/globalData';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { id: '123', type: '', name: '123', desc: '321' },
      { id: '122', type: '', name: '哈哈哈', desc: '321' },
      { id: '121', type: '', name: 'emmm', desc: '321' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Get({
      api: 'queryPlanList',
      cb: () => {
        const list = res.data;
        list.forEach(item => {
          globalData.bankList = globalData.bankList || {};
          globalData.bankList[item.id] = item;
          item.expiredTime = timer().to(timer(item.startTime), 'num', 2);
          item.shortDescription = shortString(item.description);
        });
        this.setData({
          list,
        })
      },
      err: () => {
        const list = [
          {
            id: 1,
            name: 'plan-1',
            endTime: 1529990619910,
            startTime: 1521990619910,
            totalNum: 100,
            savedNum: 20,
            description: 'this is plan 1',
            lastSaved: 1522990619910,
          },
          {
            id: 2,
            name: 'plan-2',
            endTime: 1539990619910,
            startTime: 1511990619910,
            totalNum: 1000,
            savedNum: 90,
            description: 'this is plan 2',
            lastSaved: 1522090619910,
          }
        ];
        list.forEach(item => {
          globalData.bankList = globalData.bankList || {};
          globalData.bankList[item.id] = item;
          item.expiredTime = timer().to(timer(item.startTime), 'num', 2);
          item.shortDescription = shortString(item.description);
        });
        this.setData({
          list,
        })
      }
    });
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
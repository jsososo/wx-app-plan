// pages/chekIn/detail/detail.js
import Storage from '../../../utils/Storage';
import timer from '../../../utils/timer';
import { Loading, Toast, Jump } from '../../../utils/util';
import globalData from '../../../utils/globalData';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    today: timer().str('YY-MM-DD'),
    log: [],
    dayCount: 1,
    closed: false,
  },

  onLoad: function (options) {
    this.getInfo(options.id);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.info.objectId) {
      this.getInfo(this.data.info.objectId)
    }
  },
  
  //  处理一下请求拿到的数据
  handleData(info) {
    const closed = (info.endTime || '9999-01-01') <= timer().str();
    const dayCount = timer(info.startTime, 'YYYY-MM-DD').to(timer(closed ? info.endTime : undefined), 'num', 2) + 1;
    const log = info.log.reverse().map((item) => {
      return {
        time: timer(item.time).str('YY-MM-DD HH:mm:ss'),
        content: item.content,
      };
    });
    this.setData({ info, dayCount, log, closed });
    Loading.hide();
  },
  // 请求获取数据
  getInfo(id) {
    Loading.show();
    Storage.queryBmob(
      'CheckIn',
      (q) => {
        q.equalTo('objectId', id);
        return q;
      },
      (res) => this.handleData(res),
      () => {
        Loading.hide();
        Toast.error('出了点错', 3);
      }
    )
  },
  goToEdit() {
    const { info } = this.data;
    globalData.editInfo = info;
    Jump.navigateTo(`../create/index?id=${info.objectId}`);
  },
  reopenCheck() {
    const { info } = this.data;
    Storage.setBmob(
      'CheckIn',
      info.objectId,
      { endTime: '' },
      () => this.getInfo(info.objectId),
    )
  },
  delCheck() {
    const { info } = this.data;
    wx.showModal({
      content: '确定删掉这次打卡嘛？',
      confirmColor: '#3089DC',
      complete: (res) => {
        if (res.confirm) {
          Storage.delBmob(
            'CheckIn',
            info.objectId,
            () => Jump.navigateBack(1),
          )
        }
      },
    });
  },

  stopCheck() {
    const { info } = this.data;
    wx.showModal({
      content: '确定结束这次打卡嘛？',
      confirmColor: '#3089DC',
      complete: (res) => {
        if (res.confirm) {
          Loading.show();
          Storage.setBmob(
            'CheckIn',
            info.objectId,
            { endTime: timer().str() },
            () => this.getInfo(info.objectId)
          )
        }
      },
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});
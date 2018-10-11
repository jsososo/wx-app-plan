// pages/list/list.js
import Storage from '../../../utils/Storage';
import globalData from '../../../utils/globalData';
import timer from '../../../utils/timer.js';
import {Loading, Toast, Jump} from "../../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    today: timer().str(),
    checkTime: timer().str('YY-MM-DD HH:mm:ss'),
    checkVal: '',
    isChecked: false,
    checkId: '',
    checkInfo: {},
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    Loading.show();
    this.getCheckList();
  },

  getCheckList: function () {
    Storage.queryBmob(
      'CheckIn',
      (q) => {
        q.equalTo('userId', globalData.userInfo.objectId);
        q.select('title');
        q.select('lastEdit');
        q.select('endTime');
        q.select('icon');
        return q;
      },
      (res) => {
        globalData.checkList = res;
        const [nowList, closeList] = [[], []];
        res.forEach(item => {
          if (!item.endTime || (item.endTime > timer().str())) {
            nowList.push(item);
          } else {
            closeList.push(item);
          }
        });
        globalData.nowCheckList = nowList;
        this.setData({ list: nowList, closeList: closeList });
        Loading.hide();
      },
      null,
      'find'
    )
  },

  changeCheckVal: function (e) {
    this.setData({ checkVal: e.detail.value });
  },

  // 关弹窗
  closeCheckDialog: function () {
    this.setData({ checkId: '', checkVal: '' })
  },

  // 展示打卡弹窗
  showCheckDialog: function (e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      checkId: id,
      checkTime: timer().str('YY-MM-DD HH:mm:ss'),
    });
    Loading.show();
    // 获取详细信息
    Storage.queryBmob(
      'CheckIn',
      (q) => {
        q.equalTo('objectId', id);
        return q;
      },
      (res) => {
        const lastLog = res.log[res.log.length - 1];
        const isChecked = lastLog ? (timer(lastLog.time).str() === timer().str()) : false;
        this.setData({
          checkInfo: res,
          isChecked,
          checkVal: isChecked ? lastLog.content : '',
        });
        Loading.hide();
      },
      () => {
        Loading.hide();
        Toast.error('出了点错');
      }
    )
  },

  // 打卡
  addCheck: function () {
    Loading.show();
    const { checkId, checkVal, checkInfo, checkTime, isChecked } = this.data;
    const t = timer(checkTime, 'YY-MM-DD HH:mm:ss');
    checkInfo.lastEdit = t.str();
    const newR = {
      time: t.time,
      content: checkVal,
    };
    // 对于老的记录先不删掉，留起来
    if (isChecked) {
      const lastLog = checkInfo.log.pop();
      newR.olds = [...(lastLog.olds || []), { time: lastLog.time, content: lastLog.content }];
    }
    checkInfo.log.push(newR);
    this.closeCheckDialog();

    Storage.setBmob(
      'CheckIn',
      checkId,
      checkInfo,
      () => this.getCheckList(),
      () => Loading.hide()
    )
  },

  // 跳转去详情
  goToDetail: function (e) {
    Jump.navigateTo(`../detail/index?id=${e.currentTarget.dataset.id}`)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
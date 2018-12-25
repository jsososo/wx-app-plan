// pages/createPlan/createPlan.js
import timer from '../../../utils/timer';
import Storage from '../../../utils/Storage';
import globalData from '../../../utils/globalData';
import { Jump, Toast } from '../../../utils/util';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    value: {
      title: '',
      startTime: timer().str(),
      endTime: '',
      type: 'CHECK_IN',
      record: {},
      log: [],
      icon: 1,
    },
    iconList: Array(23),
    create: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        value: globalData.editInfo,
        create: false,
      })
    }
  },

  changeValue(e) {
    const { key } = e.target.dataset;
    const { value } = this.data;
    value[key] = e.detail.value;
    this.setData({ value });
  },

  createPlan() {
    const { value } = this.data;
    value.userId = globalData.userInfo.objectId;
    if (!value.title) {
      Toast.error('名字还没起', 3);
      return;
    }
    if (value.objectId) {
      // 更新
      Storage.setBmob(
        'CheckIn',
        value.objectId,
        value,
        () => {
          Jump.navigateBack(1);
        }
      );
      return;
    }
    // 创建
    Storage.createBmob(
      'CheckIn',
      value,
      () => {
        Jump.switchTab('../list/list');
      }
    )
  },

  selectIcon(e) {
    const { value } = this.data;
    value.icon = e.currentTarget.dataset.val;
    this.setData({ value });
  }
});
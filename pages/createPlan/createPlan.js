// pages/createPlan/createPlan.js
import timer from '../../utils/timer';
import {timeTypeCNMap, timeTypeArr, timeTypeCNArr, dayArr, dayInfoArr} from "../../utils/const";
import Storage from '../../utils/Storage';
import globalData from '../../utils/globalData';
import { Jump, Toast } from '../../utils/util';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    value: {
      title: '',
      startTime: '',
      endTime: '',
      type: 'CHECK_IN',
      timeType: 'D',
      rule: ['0', '1', '2', '3', '4', '5', '6'],
      record: {},
      log: [],
      times: 1,
      timeTypeNum: 0,
    },
    ruleStr: '每天1次',
    timeTypeCNMap,
    timeTypeArr,
    timeTypeCNArr,
    today: '',
    selectRule: 'all',
    showDialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const today = timer().str();
    const dayCheckArr = [];
    dayArr.forEach((item, index) => {
      dayCheckArr.push({
        value: index,
        label: item,
        checked: true,
      })
    });
    this.setData({
      'value.startTime': today,
      today,
      dayArr: dayCheckArr,
    })
  },

  changeValue(e) {
    const {key} = e.target.dataset;
    const {value} = this.data;
    let {ruleStr} = this.data;
    value[key] = e.detail.value;
    if (key === 'timeTypeNum') {
      value.timeType = timeTypeArr[value[key]];
    }
    if (key === 'times' || key === 'rule' || key === 'timeType') {
      if (value.timeType !== 'D') {
        ruleStr = `每${timeTypeCNMap[value.timeType]}${value.times}次`;
      } else {
        const checkedDayArr = value.rule.sort((a, b) => (a - b));
        if (checkedDayArr.length === 7) {
          ruleStr = `每天${value.times}次`
        } else if (checkedDayArr.join('-') === '1-2-3-4-5') {
          ruleStr = `每个工作日${value.times}次`
        } else if (checkedDayArr.join('-') === '0-6') {
          ruleStr = `周末每天${value.times}次`
        } else {
          const dayShortArr = [];
          checkedDayArr.forEach(d => dayShortArr.push(dayInfoArr[d].short));
          ruleStr = `每周${dayShortArr.join('')}${value.times}次`
        }
      }
    }
    value.times = Number(value.times);
    value.timeTypeNum = Number(value.timeTypeNum);
    this.setData({
      value,
      ruleStr
    })
  },

  changeDialogShow() {
    this.setData({
      showDialog: !this.data.showDialog,
    })
  },

  createPlan() {
    const { value } = this.data;
    value.userId = globalData.userInfo.objectId;
    if (!value.title) {
      Toast.error('名字还没起');
      return;
    }
    Storage.createBmob(
      'CheckIn',
      value,
      (res) => {
        Jump.redirect(`../checkIn/detail/detail?id=${res.id}`);
      }
    )
  },
});
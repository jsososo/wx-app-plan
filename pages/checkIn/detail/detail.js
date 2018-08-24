// pages/chekIn/detail/detail.js
import Storage from '../../../utils/Storage';
import {dayInfoArr, timeTypeCNMap, thisTimeCNMap, getTimeKey} from "../../../utils/const";
import timer from '../../../utils/timer';
import Num, { Abs } from '../../../utils/num';
import globalData from '../../../utils/globalData';
import { Loading, Toast } from '../../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    ruleStr: '',
    id: '',
    thisTime: '',
    nowKey: '',
    nowTimes: 0,
    historyCount: {
      allTimes: 1,
      cCheck: 0,
      cReason: 0,
      cPass: 0,
      cCP: 0,
      cRP: 0,
      cPP: 0,
    },
  },

  onLoad: function (options) {
    this.getInfo(options.id);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.id) {
      this.getInfo(this.data.id)
    }
  },

  // 处理接口请求的拿到的数据
  handleData(value) {
    let ruleStr = '';
    if (value.timeType !== 'D') {
      ruleStr = `每${timeTypeCNMap[value.timeType]}${value.times}次`;
    } else {
      const checkedDayArr = value.rule.sort((a, b) => (a - b));
      if (checkedDayArr.length === 7) {
        ruleStr = `每天打卡${value.times}次`
      } else if (checkedDayArr.join('-') === '1-2-3-4-5') {
        ruleStr = `每个工作日打卡${value.times}次`
      } else if (checkedDayArr.join('-') === '0-6') {
        ruleStr = `周末每天打卡${value.times}次`
      } else {
        const dayShortArr = [];
        checkedDayArr.forEach(d => dayShortArr.push(dayInfoArr[d].short));
        ruleStr = `每周${dayShortArr.join('、')}打卡${value.times}次`
      }
    }
    const nowKey = getTimeKey(value.timeType);
    const historyCount = this.getHistoryCount(value);
    globalData.checkInfo = value;
    Loading.hide();
    this.setData({
      info: value,
      id: value.objectId,
      ruleStr,
      thisTime: thisTimeCNMap[value.timeType],
      nowKey,
      nowCheck: value.record[nowKey] ? value.record[nowKey].check : 0,
      nowTimes: value.record[nowKey] ? (value.record[nowKey].check + value.record[nowKey].reason + value.record[nowKey].pass) : 0,
      historyCount,
    })
  },

  // 显示底部的一些历史统计
  getHistoryCount(info) {
    const type = info.timeType;
    const dCount = Abs(timer().to(timer(info.startTime), 'num', 2)) + 1;
    const mCount = Abs(timer().to(timer(info.startTime), 'num', 1)) + 1;
    let cCheck = 0;
    let cReason = 0;
    let allTimes = 0;

    Object.keys(info.record).forEach((k) => {
      cCheck += info.record[k].check || 0;
      cReason += info.record[k].pass || 0;
    });
    if (type === 'D') {
      allTimes = dCount * info.times;
    } else if (type === 'M') {
      allTimes = mCount * info.times;
    } else if (type === 'W') {
      allTimes = Num(dCount / 7, 0, 1) * info.times;
    }
    const cPass = allTimes - cCheck - cReason;
    return {
      cCheck,
      cReason,
      cPass,
      allTimes,
      cCP: Num(cCheck / allTimes * 100, 2),
      cRP: Num(cReason / allTimes * 100, 2),
      cPP: Num(cPass / allTimes * 100, 2),
    }
  },

  getInfo(id) {
    Storage.queryBmob(
      'CheckIn',
      (q) => {
        q.equalTo('objectId', id);
        return q;
      },
      (res) => this.handleData(res),
      (err) => {
        Loading.hide();
        Toast.error('出了点错');
      }
    )
  },

  // 打卡记录（包括打卡、咕咕咕、不可抗拒）
  addRecord(e) {
    const { info, nowKey, id } = this.data;
    if (!info.record[nowKey]) {
      info.record[nowKey] = {
        check: 0,
        reason: 0,
        pass: 0,
      }
    }
    const rObj = info.record[nowKey];
    if ((rObj.check + rObj.reason + rObj.pass) === info.times) {
      return;
    }
    Loading.show();
    info.record[nowKey][e.target.dataset.key] += 1;
    info.log.push({
      time: timer().time,
      record: e.target.dataset.key,
    });
    Storage.setBmob(
      'CheckIn',
      id,
      {
        record: info.record,
        log: info.log,
      },
      () => this.getInfo(id),
      () => Loading.hide()
    )
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
});
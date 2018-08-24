// pages/checkIn/calendar/calendar.js
import Storage from '../../../utils/Storage';
import globalData from '../../../utils/globalData';
import timer, { getCalendar } from '../../../utils/timer';
import {getTimeKey} from "../../../utils/const";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sTime: null,
    calendar: null,
    info: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getCalendarInfo();
  },

  // 获取日历
  getCalendarInfo() {
    const sTime = this.data.sTime || timer();
    const rawCalendar = getCalendar(sTime.year, sTime.month);
    const calendar = [];
    const info = globalData.checkInfo;

    rawCalendar.forEach((w, i) => {
      calendar.push({
        cls: '',
        list: [],
      });
      w.forEach((d) => {
        const value = {
          value: d || '',
          cls: '',
          check: 0,
          pass: 0,
          reason: 0,
        };
        if (d) {
          const _time = timer([sTime.year, sTime.month, d]);
          const startTime = timer(info.startTime, 'YYYY-MM-DD').time;
          const endTime = info.endTime ? timer(info.endTime, 'YYYY-MM-DD').time : '';
          value.time = _time.time;

          if (value.time < startTime || (info.endTime && value.time > endTime)) {
            // 超出设定范围外灰色
            value.cls = 'bg-gray';
          } else {
            // 日志查询相应的打卡记录
            const log = info.log.filter((lObj) => timer(lObj.time).str() === _time.str());
            log.forEach((lObj) => value[lObj.record] += 1);
          }

          // 非指定的星期设为灰色
          if (info.timeType === 'D' && info.rule.indexOf(`${_time.day.value}`) === -1) {
            value.cls = 'bg-gray';
          }
        }
        calendar[i].list.push(value);
      })
    });
    this.setData({
      sTime,
      calendar,
      info,
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
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
    sCalendar: '',
    calendar: null,
    info: null,
    mCls: '',
    logList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setTime();
    this.getCalendarInfo();
  },

  // 获取日历
  getCalendarInfo() {
    const sTime = this.data.sTime || timer();
    const rawCalendar = getCalendar(sTime.year, sTime.month);
    const calendar = [];
    const info = globalData.checkInfo;
    const startTime = timer(info.startTime, 'YYYY-MM-DD');
    let mCls = '';

    rawCalendar.forEach((w, i) => {
      calendar.push({
        cls: '',
        list: [],
        check: 0,
        pass: 0,
        reason: 0,
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
            log.forEach((lObj) => {
              value[lObj.record] += 1;
              const cMap = {
                check: 'p-blue',
                reason: 'p-yellow',
                pass: 'p-red',
              };
              if (!value.pCls) {
                value.pCls = cMap[lObj.record];
              } else if (lObj.record === 'reason' && value.pCls !== 'p-red') {
                value.pCls = 'p-yellow';
              } else if (lObj.record === 'pass') {
                value.pCls = 'p-red';
              }
            });
          }

          if (_time.str() === sTime.str()) {
            value.select = true;
          }

          if (info.timeType === 'D') {
            if (info.rule.indexOf(`${_time.day.value}`) === -1) {
              value.cls = 'bg-gray';
            } else if (value.check === info.times) {
              value.cls = 'bg-blue';
            } else if (value.reason > 0 && info.times === (value.reason + value.check)) {
              value.cls = 'bg-yellow';
            } else if (value.time < timer().time && value.time >= startTime) {
              value.cls = 'bg-red';
            }
          }

          if (_time.str() === timer().str()) {
            value.cls += ' today';
          }
        } else {
          value.cls = 'bg-white';
        }
        calendar[i].list.push(value);
      });
      // 周纬度的统计和背景色
      if (info.timeType == 'W') {
        const wKey = `${sTime.str('YYYYMM')}${i}`;
        info.log.forEach((item) => {
          if (timer(item.time).week() === wKey) {
            calendar[i][item.record] += 1;
          }
        });
        if (calendar[i].check === info.times) {
          calendar[i].cls = 'bg-blue';
        } else if (calendar[i].reason > 0 && info.times === (calendar[i].reason + calendar[i].check)) {
          calendar[i].cls = 'bg-yellow';
        } else if (wKey >= startTime.week() && wKey <= timer().week()) {
          calendar[i].cls = 'bg-red';
        }
      }
    });
    if (info.timeType === 'M') {
      const sMObj = info.record[sTime.str('YYYYMM')] || { check: 0, pass: 0, reason: 0};
      if (sTime.time < startTime.time || (info.endTime && timer(info.endTime, 'YYYY-MM-DD').time < sTime.time)) {
        mCls = 'bg-gray';
      } else if (sMObj.check === info.times) {
        mCls = 'bg-blue';
      } else if (sMObj.reason > 0 && (sMObj.reason + sMObj.check === info.times)) {
        mCls = 'bg-yellow';
      } else if (sTime.str('YYYYMM') <= timer().str('YYYYMM')) {
        mCls = 'bg-red';
      }
    }
    this.setData({
      sTime,
      calendar,
      info,
      mCls,
    })
    this.getLog();
  },

  // 修改选中的时间
  changeSelectedDay(e) {
    if (!e.target.dataset.date) {
      return;
    }
    const { sTime } = this.data;
    const newST = timer([sTime.year, sTime.month, e.target.dataset.date]);
    this.setData({ sTime: newST });
    this.getCalendarInfo();
  },

  getLog() {
    const { sTime } = this.data;
    const info = globalData.checkInfo;

    const list = info.log.filter(i => timer(i.time).str() === sTime.str());
    list.forEach(item => {
      const recordMap = {
        check: '打卡',
        pass: '咕咕',
        reason: '事出有因',
      };
      item.t = timer(item.time).str('HH:mm:ss');
      item.r = recordMap[item.record];
    });
    this.setData({
      logList: list,
    })
  },

  setTime(e) {
    if (!e) {
      const today = timer();
      this.setData({
        sTime: today,
        sCalendar: today.str('YYYY-MM'),
      })
    } else if (e.detail.value !== this.data.sCalendar) {
      this.setData({
        sTime: timer(`${e.detail.value}-01`, 'YYYY-MM-DD'),
        sCalendar: e.detail.value,
      });
      this.getCalendarInfo();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
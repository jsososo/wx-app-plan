//app.js
import Bmob from 'dist/bmob/Bmob-1.6.3.min';
import bmob from './dist/bmob/bmob';
import { BmobInfo } from 'utils/const';
import globalData from './utils/globalData';

Bmob.initialize(...BmobInfo);
bmob.initialize(...BmobInfo);
App({
  onLaunch: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        globalData.authSetting = res.authSetting;
      }
    })
  },
});
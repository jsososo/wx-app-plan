//app.js
import Bmob from 'dist/bmob/Bmob-1.6.3.min';
import bmob from './dist/bmob/bmob';
import { BmobInfo } from 'utils/const';
import globalData from './utils/globalData';

Bmob.initialize(...BmobInfo);
bmob.initialize(...BmobInfo);
App({
  onLaunch: function () {
    // Bmob.generateCode({ path: 'path', width: 140, type: 1 }).then(function (res) {
    //   console.log(res);
    // })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        globalData.authSetting = res.authSetting;
      }
    })
  },
});
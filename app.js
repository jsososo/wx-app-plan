//app.js
import Bmob from 'utils/bmob/Bmob-1.6.3.min';
import bmob from './utils/bmob/bmob';
import { BmobInfo } from 'utils/const';
import Storage from 'utils/Storage';
import globalData from './utils/globalData';

Bmob.initialize(...BmobInfo);
bmob.initialize(...BmobInfo);
App({
  onLaunch: function () {
    Bmob.User.auth().then(res=>{
      Storage.queryBmob(
        '_User',
        (q) => {
          q.equalTo('wxOpenId', res.authData.weapp.openid);
          return q;
        },
        (res) => {
          if (res) {
            globalData.userInfo.hasUser = true;
            wx.redirectTo({ url: '/pages/list/list' })
          } else {
            wx.redirectTo({ url: '/pages/createUser/createUser' })
          }
        }
      )
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        globalData.authSetting = res.authSetting;
      }
    })
  },
})
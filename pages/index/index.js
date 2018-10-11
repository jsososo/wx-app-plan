//index.js
//获取应用实例
import Storage from "../../utils/Storage";
import globalData from "../../utils/globalData";
import Bmob from "../../dist/bmob/Bmob-1.6.3.min";
import { Jump } from "../../utils/util";

Page({
  data: {
    hasUser: globalData.userInfo.hasUser,
  },
  onLoad: function () {
    Bmob.User.auth().then(res=>{
      globalData.userInfo.wxOpenId = res.authData.weapp.openid;
      Storage.queryBmob(
        '_User',
        (q) => {
          q.equalTo('wxOpenId', res.authData.weapp.openid);
          return q;
        },
        (user) => {
          if (user) {
            globalData.userInfo = user;
            globalData.userInfo.hasUser = true;
          } else {
            globalData.userInfo = res;
            globalData.userInfo.hasUser = false;
          }
          Jump.switchTab('/pages/checkPlan/list/list');
        }
      )
    });
  },
});

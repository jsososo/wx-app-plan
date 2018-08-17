//index.js
//获取应用实例
import Storage from "../../utils/Storage";
import globalData from "../../utils/globalData";

Page({
  data: {
    hasUser: globalData.userInfo.hasUser,
  },
  onLoad: function () {

  },
});

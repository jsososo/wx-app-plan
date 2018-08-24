// pages/createUser/createUser.js
import Storage from "../../utils/Storage";
import globalData from "../../utils/globalData";
import md5 from "../../dist/js-md5";
import { Toast, Jump } from '../../utils/util';
import Bmob from '../../dist/bmob/bmob';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      show: false,
      password: '',
      md5Pass: '',
    },
    mode: '',
    getUserInfo: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 获取用户信息（使用微信注册的时候会用到）
  onGotUserInfo: function(res) {
    const wxUserInfo = res.detail.userInfo;
    if (wxUserInfo) {
      globalData.wxUserInfo = wxUserInfo;
      wxUserInfo.show = true;
      this.setData({
        userInfo: wxUserInfo,
        mode: 'create',
        getUserInfo: true,
      })
    }
  },

  // 修改模式 关联 || 注册
  changeMode: function() {
    const { mode } = this.data;
    this.setData({
      mode: (mode == 'relate') ? 'create' : 'relate',
      'userInfo.show': true,
      'userInfo.nickName': (mode == 'relate') ? globalData.wxUserInfo.nickName : '',
    })
  },

  // 输入用户名
  inputName: function (e) {
    this.setData({
      'userInfo.nickName': e.detail.value,
    })
  },

  // 输入昵称
  inputPass: function (e) {
    this.setData({
      'userInfo.md5Pass': md5(e.detail.value)
    });
  },

  createUser: function () {
    const { userInfo, mode } = this.data;
    if (mode == 'create') {
      // 注册一个新用户
      Storage.queryBmob(
        '_User',
        (q) => {
          q.equalTo('username', userInfo.nickName);
          return q;
        },
        (res) => {
          if (res) {
            Toast.text('用户名已存在  重新起一个吧')
          } else {
            const newUser = {
              username: userInfo.nickName,
              wxOpenId: globalData.userInfo.wxOpenId,
              avatar: globalData.wxUserInfo.avatarUrl,
              password: userInfo.md5Pass,
              wechatInfo: {
                avatar: globalData.wxUserInfo.avatarUrl,
                nick: globalData.wxUserInfo.nickName,
              }
            };
            Storage.createBmob(
              '_User',
              newUser,
              (res) => {
                newUser.objectId = res.objectId;
                globalData.userInfo = newUser;
                Jump.redirect('/page/list/list');
              }
            )
          }
        }
      )
    } else {
      // 关联用户
      Storage.queryBmob(
        '_User',
        (q) => {
          q.equalTo('username', userInfo.nickName);
          q.equalTo('password', userInfo.md5Pass);
          return q;
        },
        (res) => {
          const u = res;
          if (!res) {
            Toast.error('肯定哪里写错了');
          } else if (res.wxOpenId) {
            Toast.text('该账号已关联过其他微信，可先去pc端解绑');
          } else {
            // 需要先登录才能修改user表信息
            Bmob.User.logIn(userInfo.nickName, userInfo.md5Pass, {
              success: () => {
                u.wxOpenId = globalData.userInfo.wxOpenId;
                Storage.setBmob('_User', u.objectId, {
                  wxOpenId: globalData.userInfo.wxOpenId
                });
              },
              error: () => {
                Toast.error('出问题了～')
              }
            })
          }
        }
      )
    }
  },
});
// pages/user/user.js
import globalData from '../../utils/globalData';
import md5 from "../../dist/js-md5";
import {Jump, Toast} from "../../utils/util";
import Bmob from "../../dist/bmob/bmob";
import Storage from "../../utils/Storage";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    edit: false,
    bindUser: {
      nick: '',
      md5Pass: '',
    },
    isEdit: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ userInfo: globalData.userInfo });
  },

  editUser: function () {
    const { userInfo } = this.data;
    this.setData({
      isEdit: true,
      bindUser: {
        nick: userInfo.username,
        md5Pass: '',
      }
    });
  },

  onGotUserInfo: function(res) {
    const { userInfo, bindUser } = this.data;
    const wxUserInfo = res.detail.userInfo;
    if (wxUserInfo) {
      globalData.wxUserInfo = wxUserInfo;
      userInfo.avatar = wxUserInfo.avatarUrl;
      userInfo.username = wxUserInfo.nickName;
      bindUser.nick = wxUserInfo.nickName;
      this.setData({ userInfo, bindUser });
    }
  },

  // 输入用户名
  inputName: function (e) {
    this.setData({
      'bindUser.nick': e.detail.value,
    })
  },

  // 输入昵称
  inputPass: function (e) {
    this.setData({
      'bindUser.md5Pass': md5(e.detail.value)
    });
  },

  cancelEdit: function () {
    this.setData({
      bindUser: {
        nick: '',
        md5Pass: '',
      },
      isEdit: false,
    })
  },

  saveUser: function () {
    const { bindUser } = this.data;
    const { userInfo, checkList } = globalData;
    const wxOpenId = userInfo.authData.weapp.openid;
    Storage.queryBmob(
      '_User',
      (q) => {
        q.equalTo('username', bindUser.nick);
        return q;
      },
      (res) => {
        if (res && !userInfo.hasUser && (bindUser.nick !== userInfo.username)) {
          Storage.queryBmob(
            '_User',
            (q) => {
              q.equalTo('username', bindUser.nick);
              q.equalTo('password', bindUser.md5Pass);
              return q;
            },
            (res) => {
              if (!res) {
                Toast.text('密码不正确或账号已被注册');
              } else {
                // 需要先登录才能修改user表信息
                Bmob.User.logIn(bindUser.nick, bindUser.md5Pass, {
                  success: (u) => {
                    const newUser = JSON.parse(JSON.stringify(u));
                    newUser.wxOpenId = globalData.userInfo.wxOpenId;
                    Storage.setBmob('_User', newUser.objectId, {
                      wxOpenId: wxOpenId,
                    }, () => {
                      checkList.forEach((item) => {
                        Storage.setBmob('CheckIn', item.objectId, { userId: newUser.objectId });
                      });
                      newUser.hasUser = true;
                      globalData.userInfo = newUser;
                      this.cancelEdit();
                      this.setData({ userInfo: newUser })
                    });
                  },
                  error: () => {
                    Toast.error('出问题了～')
                  }
                })
              }
            }
          )
        } else if (userInfo) {
          const createUser = {
            username: bindUser.nick,
            wxOpenId,
            avatar: this.data.userInfo.avatar,
            password: bindUser.md5Pass,
            // wechatInfo: {
            //   avatar: globalData.wxUserInfo.avatarUrl,
            //   nick: globalData.wxUserInfo.nickName,
            // }
          };
          Storage.createBmob(
            '_User',
            createUser,
            (res) => {
              createUser.objectId = res.id;
              globalData.userInfo = createUser;
              globalData.userInfo.hasUser = true;
              checkList.forEach((item) => {
                Storage.setBmob('CheckIn', item.objectId, { userId: createUser.objectId });
              });
              this.setData({ userInfo: createUser });
              this.cancelEdit();
            }
          )
        }
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
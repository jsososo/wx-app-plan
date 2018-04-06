import API_LIST from './api.js';
import globalData from './globalData.js';

const params = {
  api: '',
  data: {},
  cb: (res) => {
    console.log(res);
  },
  err: (res = {}) => {
    const message = res.message || '出了一点小小的问题';
    wx.showToast({
      title: message,
      icon: 'none',
    })
    console.log(message);
  },
  header: {},
}

const Get = (d) => {
  const req = {
    ...params,
    ...d,
  }
  const {api, data, cb, err, header} = req;
  Request(api, data, cb, err, header, 'GET')
};

const Post = (d) => {
  const req = {
    ...params,
    ...d,
  }
  const { api, data, cb, err, header } = req;
  Request(api, data, cb, err, header, 'POST')
};

const Request = (api, data, cb, err, header, method) => {
  const url = API_LIST[api];

  data.userId = globalData.userInfo.userId || undefined;

  if (url) {
    wx.request({
      url,
      data,
      header,
      method,
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        cb();
      },
      fail: (res) => {
        err(res);
      },
    })
  } else {
    err({
      message: '没有找到API',
    })
  }
}

module.exports = {
  Get: Get,
  Post: Post,
}
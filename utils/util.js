const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
};

const numberAnimation = (cb, numArr, time = 20, times = 23) => {
  setTimeout(() => {
    let result = []
    numArr.map(item => {
      item.from += (item.to - item.from) / times
      item.from = Number(item.from.toFixed(item.fix || 0))
      result.push(item.from)
    })
    times--
    cb(result)
    if (times !== 0) {
      numberAnimation(cb, numArr, time, times)
    }
  }, time)
};

const shortString = (str, limited = 20) => {
  return str.length > limited ? `${str.substr(0, limited - 3)}...` : str;
};

const Toast = {
  success: (title = 'ok~') => wx.showToast({
    title,
    icon: 'success'
  }),
  error: (title = '出错啦', n = 2) => wx.showToast({
    title,
    icon: 'loading',
    image: `${new Array(n).fill('..').join('/')}dist/error.png`,
  }),
  text: (title) => wx.showToast({
    title,
    icon: 'none',
  })
};

const Loading = {
  show: (title = '', mask = true) => wx.showLoading({
    title,
    mask,
  }),
  hide: () => wx.hideLoading(),
};


const Jump = {
  redirect: (url) => wx.redirectTo({ url }),
  navigateTo: (url, success, fail, complete) => wx.navigateTo({ url, success, fail, complete }),
  switchTab: (url, success, fail, complete) => wx.switchTab({ url, success, fail, complete }),
  navigateBack: (delta) => wx.navigateBack({ delta }),
};

module.exports = {
  formatTime,
  numberAnimation,
  shortString,
  Loading,
  Toast,
  Jump,
}

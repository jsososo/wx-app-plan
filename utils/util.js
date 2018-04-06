const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

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
}

/*
*  获得某年某月的日历
*
*  @params y: 年份（fullYear）
*  @params m: 月份（0-11）
* */
const getCalendar = (y, m) => {
  const D = new Date();
  // 空白的一周
  const emptyWeek = new Array(7);
  emptyWeek.fill(0);
  // 最后输出的日历
  const C = [];
  // 初始化日期
  D.setYear(y);
  D.setMonth(m);
  D.setDate(1);
  do {
    emptyWeek[D.getDay()] = D.getDate();
    if (D.getDay() === 6) {
      C.push([...emptyWeek]);
      emptyWeek.fill(0);
    }
    D.setDate(D.getDate() + 1);
  } while (D.getMonth() === m);
  if (emptyWeek.join('') !== '0000000') {
    C.push(emptyWeek);
  }
  return C;
};

const shortString = (str, limited = 20) => {
  return str.length > limited ? `${str.substr(0, limited - 3)}...` : str;
}

module.exports = {
  getCalendar: getCalendar,
  formatTime: formatTime,
  numberAnimation: numberAnimation,
  shortString: shortString,
}

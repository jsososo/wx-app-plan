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

/*
*  将日期（时间戳和Date对象）转化为字符串
*
*  字符串格式转换为YYYY（年）MM（月）DD(日)HH(时)mm(分)ss(秒)
*  MM表示01月，M表示1月，其他同理
* */
const dateToString = (date = new Date(), str = 'YYYY-MM-DD') => {
  if (typeof date === 'string') {
    date = Number(date);
  }
  if (typeof date === 'number') {
    date = new Date(date)
  }
  str = str.replace('YYYY', date.getFullYear())
    .replace('YY', String(date.getFullYear()).substr(-2))
    .replace('MM', formatNumber(date.getMonth() + 1))
    .replace('M', date.getMonth() + 1)
    .replace('DD', formatNumber(date.getDate()))
    .replace('D', date.getDate())
    .replace('HH', formatNumber(date.getHours()))
    .replace('H', date.getHours())
    .replace('mm', formatNumber(date.getMinutes()))
    .replace('m', date.getMinutes())
    .replace('ss', formatNumber(date.getSeconds()))
    .replace('s', date.getSeconds())

  return str
}

/*
*  将时间由字符串转为Date对象
*
*  必须含有上级时间才能读取下级时间：如 可以解析 年月日时， 不能解析 年月时分秒, 且至少需要包含 年月 两个信息
* */
const stringToDate = (str, strType = 'YYYY-MM-DD') => {
  const timeArr = [];
  const mapType = [
    ['YYYY', 'YY'],
    ['MM', 'M'],
    ['DD', 'D'],
    ['HH', 'H'],
    ['mm', 'm'],
    ['ss', 's']
  ]
  let index = 0
  // 循环每一种类型
  while (index < 6) {
    // 先判断长的格式，如果不存在再判断短的，如果都不存在则解析结束
    if (strType.indexOf(mapType[index][0]) > -1) {
      timeArr.push(Number(str.substr(strType.indexOf(mapType[index][0]), mapType[index][0].length)))
    } else if (strType.indexOf(mapType[index][1]) > -1) {
      timeArr.push(Number(str.substr(strType.indexOf(mapType[index][1]), mapType[index][1].length)))
      // YY格式需要前缀加上20
      if (strType.indexOf(mapType[index]) === 'YY') {
        timeArr[0] = Number('20' + str.substr(strType.indexOf('YY'), 2))
      }
    } else {
      index += 6
    }
    index++
  }
  timeArr[1]--
  return new Date(...timeArr)
}

/*
*  获得某年某月的日历
*
*  @params y: 年份（fullYear）
*  @params m: 月份（0-11）
* */
const getCalendar = (y, m) => {
  const D = new Date()
  // 空白的一周
  let emptyWeek = new Array(7)
  emptyWeek.fill(0)
  //最后输出的日历
  const C = []
  // 初始化日期
  D.setYear(y)
  D.setMonth(m)
  D.setDate(1)
  do {
    emptyWeek[D.getDay()] = D.getDate();
    if (D.getDay() === 6) {
      C.push([...emptyWeek])
      emptyWeek.fill(0)
    }
    D.setDate(D.getDate() + 1)
  } while (D.getMonth() === m);
  if (emptyWeek.join('') !== '0000000') {
    C.push(emptyWeek)
  }
  return C
}

/*
*   数字变化的动画效果（如 0.0 => 4.0 可以分解为 0.0 => 1.0 => 2.0 => 3.0 => 4.0）
*
*   @params cb: 回调函数，返回当前阶段的数字结果（数组）（必传）
*   @params numArr: 传入的配置信息，数组元素为object （必传）
*           {
*             from:   开始（必传）
*             to:     结束（必传）
*             fix:    保留小数位数（可选，默认0）
*           }
*   @params time: 每一次变化的时间间隔（可选，默认30ms）
*   @params times: 一共需要的变化次数（可选，默认15）
* */
const numberAnimation = (cb, numArr, time = 30, times = 15) => {
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

module.exports = {
  getCalendar: getCalendar,
  formatTime: formatTime,
  numberAnimation: numberAnimation,
  dateToString: dateToString,
  stringToDate: stringToDate,
}

import num from './num';

const formatNumber = (n) => {
    n = n.toString();
    return n[1] ? n : `0${n}`;
};

const Timer = (v = new Date(), strType) => {

    let value = v;

    try {
        if (strType && typeof strType === 'string') {
            const timeArr = [];
            const mapType = [
                ['YYYY', 'YY'],
                ['MM', 'M'],
                ['DD', 'D'],
                ['HH', 'H'],
                ['mm', 'm'],
                ['ss', 's'],
            ];
            let index = 0;
            // 循环每一种类型
            while (index < 6) {
                // 先判断长的格式，如果不存在再判断短的，如果都不存在则解析结束
                if (strType.indexOf(mapType[index][0]) > -1) {
                    timeArr.push(Number(v.substr(strType.indexOf(mapType[index][0]), mapType[index][0].length)));
                } else if (strType.indexOf(mapType[index][1]) > -1) {
                    timeArr.push(Number(v.substr(strType.indexOf(mapType[index][1]), mapType[index][1].length)));
                    // YY格式需要前缀加上20
                    if (strType.indexOf(mapType[index]) === 'YY') {
                        timeArr[0] = Number('20' + v.substr(strType.indexOf('YY'), 2));
                    }
                } else {
                    index += 6;
                }
                index++;
            }
            if (timeArr[1]) {
                timeArr[1]--;
            } else {
                timeArr[1] = 0;
            }
            value =  new Date(...timeArr);
        } else {
        }
    } catch (err) {
        value = new Date();
    }

    const date = new Date(value);

    /*
    *  将日期（时间戳和Date对象）转化为字符串
    *
    *  字符串格式转换为YYYY（年）MM（月）DD(日)HH(时)mm(分)ss(秒)
    *  MM表示01月，M表示1月，其他同理
    * */
    date.str = (s = 'YYYY-MM-DD') => {
        let str = s;
        str = str.replace('YYYY', date.year)
            .replace('YY', String(date.year).substr(-2))
            .replace('MM', formatNumber(date.month))
            .replace('M', date.month)
            .replace('DD', formatNumber(date.date))
            .replace('D', date.date)
            .replace('HH', formatNumber(date.hour))
            .replace('H', date.hour)
            .replace('mm', formatNumber(date.minute))
            .replace('m', date.minute)
            .replace('ss', formatNumber(date.second))
            .replace('s', date.second);
        return str;
    };

    /*
    *  计算与_d之间的的时间间隔
    *
    *  @params _d: 时间截止
    *  @params output: 输出的时间格式 str || arr([Y, M, D, H, m, s])
    *  @params start: 输出为string时计时单位，eg. start = 2 表示输出几天前
    * */
    date.to = (_d = Timer(), output = 'str', start = 0) => {
        const p = (_d.time - date.time) > 0;
        const _t = _d - date;

        let result = [
            num(_t / 31536000000, 0, p ? -1 : 1),
            num((((_d.year - date.year) * 12) + _d.month - date.month + ((_d.date - date.date) >= 0 ? 0.5 : -0.5)), 0, p ? -1 : 1),
            num(_t / 86400000, 0, p ? -1 : 1),
            num(_t / 3600000, 0, p ? -1 : 1),
            num(_t / 60000, 0, p ? -1 : 1),
            num(_t / 1000, 0, p ? -1 : 1),
            _t,
        ];

        let i = start;
        const timeMap = ['年', '个月', '天', '小时', '分钟', '秒', '毫秒'];
        while (result[i] !== undefined) {
            if (result[i]) {
                result = `${Math.abs(result[i])}${timeMap[i]}${p ? '后' : '前'}`;
                i += 10;
            }
            i += 1;
        }
        if (output === 'str') {
            if (typeof result !== 'string') {
                result = '刚刚';
            }
        } else {
            result = result.substr(0, result.length - 2);
        }
        return result;
    };

    /*
    *  获取年月日星期的信息
    * */
    date.year = date.getFullYear();
    date.month = date.getMonth() + 1;
    date.date = date.getDate();
    date.hour = date.getHours();
    date.minute = date.getMinutes();
    date.second = date.getSeconds();
    date.time = date.getTime();
    date.day = [
        {
            cn: '星期天',
            en: 'Sunday',
            short: '日',
            value: 0,
        },
        {
            cn: '星期一',
            en: 'Monday',
            short: '一',
            value: 1,
        },
        {
            cn: '星期二',
            en: 'Tuesday',
            short: '二',
            value: 2,
        },
        {
            cn: '星期三',
            en: 'Wednesday',
            short: '三',
            value: 3,
        },
        {
            cn: '星期四',
            en: 'Thursday',
            short: '四',
            value: 4,
        },
        {
            cn: '星期五',
            en: 'Friday',
            short: '五',
            value: 5,
        },
        {
            cn: '星期六',
            en: 'Saturday',
            short: '六',
            value: 6,
        },
    ][date.getDay()];

    return date;
};

export default Timer;

// pages/aaList/detail/detail.js
import Storage from '../../../utils/Storage';
import Num from '../../../utils/num';
import { Loading, Toast } from '../../../utils/util';
import Timer from "../../../utils/timer";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    detail: {},
    balanceStr: '',
    showDialog: false,
    inputType: 'add',
    transTo: 0,
    userList: [],
    dUser: '',
    inputVal: {
      desc: '',
      num: '',
    },
    showMore: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    const { id } = options;
    this.getAADetail(id);
  },

  getAADetail(id) {
    Storage.queryBmob(
      'AACash',
      (q) => {
        q.equalTo('objectId', id);
        return q;
      }, (v) => {
        this.setData({ info: v.info, detail: v, id });
        this.renderBalance(v.info);
        this.getTotal(v.info);
      },
    );
  },

  showMore(e) {
    const { showMore } = this.data;
    const item = info.find(i => i.name === e.target.dataset.name);
    showMore[item.name] = !showMore[item.name];
    this.setData({ showMore });
  },

  getTotal(info = this.data.info) {
    info.forEach(item => {
      item.total = 0;
      item.showMore = false;
      item.list.forEach((r) => !r.del && (item.total += r.num));
      item.total = Num(item.total, 2);
    });
    this.setData({ info });
  },

  renderBalance(info = this.data.info) {
    let av = 0;
    const result = [];
    const costArr = info.map((item) => {
      let c = 0;
      item.list.forEach((a) => !a.del && (c += a.num));
      c = Num(c, 2);
      return {
        cost: c,
        name: item.name,
      };
    });
    costArr.sort((a, b) => (a.cost - b.cost));
    costArr.forEach((item) => {
      av += item.cost;
    });
    av = Num(av / costArr.length, 2);
    let i = 0;
    let j = costArr.length - 1;
    while (costArr[i] && i !== j) {
      const pay = Num(av - costArr[i].cost, 2);
      if (pay !== 0) {
        result.push(`${costArr[i].name}要给${costArr[j].name}¥${pay}`);
      }
      if (costArr[j].cost - av > pay) {
        costArr[j].cost -= pay;
        i += 1;
      } else {
        costArr[i].cost += pay;
        j -= 1;
      }
    }
    this.setData({ balanceStr: result.join(',') });
  },

  showDialog(e) {
    this.setData({
      showDialog: true,
      dUser: e.currentTarget.dataset.name,
    })
  },

  closeDialog() {
    this.setData({
      showDialog: false,
      inputType: 'add',
      inputVal: {
        num: '',
        desc: '',
      },
      dUser: '',
      transTo: 0,
    })
  },

  changeInputType(e) {
    const inputType = e.currentTarget.dataset.val;
    let userList = [];
    if (inputType === 'trans') {
      userList = this.data.info.map(item => item.name).filter(v => v !== this.data.dUser);
    }
    this.setData({
      inputType,
      userList,
    })
  },

  changeTransTo(e) {
    this.setData({
      transTo: e.detail.value,
    })
  },

  onTapAdd() {
    const { transTo, userList, inputType, dUser, inputVal } = this.data;
    const result = [];
    const toU = userList[transTo];
    const time = Timer().time;
    if (inputVal.num <= 0) {
      Toast.error('金额不对', 3);
      return;
    }
    if (inputType === 'add') {
       if (!inputVal.desc) {
        Toast.error('描述呢描述呢', 3);
        return;
      }
    } else {
      result.push({ name: toU, num: Num(inputVal.num * -1, 2), desc: `收到${dUser}的转账`, time });
    }
    result.push({ name: dUser, num: Num(inputVal.num, 2), desc: inputType === 'add' ? inputVal.desc : `转账给${toU}`, time });
    this.updateVal(result);
  },

  inputVal(e) {
    const key = e.currentTarget.dataset.key;
    const val = e.detail.value;
    const { inputVal } = this.data;
    inputVal[key] = val;
    this.setData({ inputVal });
  },

  updateVal(info) {
    Loading.show();
    const id = this.data.id;
    Storage.queryBmob(
      'AACash',
      (q) => {
        q.equalTo('objectId', id);
        return q;
      }, (v) => {
        info.forEach(item => {
          const editU = v.info.find(u => u.name === item.name);
          const editItem = editU.list.find(r => r.time === item.time);
          if (editItem) {
            editItem.del = true;
          } else {
            editU.list.unshift({
              desc: item.desc,
              num: item.num,
              time: item.time,
            })
          }
        });
        Storage.setBmob('AACash', id, v, () => {
          this.setData({ info: v.info, detail: v });
          this.renderBalance(v.info);
          this.getTotal(v.info);
          this.closeDialog();
          Loading.hide();
        });
      })
  },

  delItem(e) {
    wx.showModal({
      content: '确定删掉这个记录嘛？',
      confirmColor: '#3089DC',
      complete: (res) => {
        if (res.confirm) {
          const { name, time } = e.currentTarget.dataset;
          this.updateVal([{ name, time }]);
        }
      },
    });
  },
});
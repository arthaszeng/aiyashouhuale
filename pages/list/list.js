var app = getApp();
const common = require('../../libs/common.js');

Page({
  onLoad() {
    const that = this;
    common.fetchGoods().then(goods => {
      Promise.resolve(
        goods.map(good => {
          return Object.assign({}, {
            name: good.attributes.name,
            price: good.attributes.price,
            description: good.attributes.description,
            images: good.attributes.images,
            objectId: good.id
          });
        })).then(results => {
        that.setData({
          goods: results
        });
      });
    });
  },

  onReady() {
  },
  onShow() {
  },
  goIndex() {
    wx.navigateTo({
      url: '../index/index',
    });
  },

  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
});


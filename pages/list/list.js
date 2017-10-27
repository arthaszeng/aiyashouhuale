var app = getApp();
const common = require('../../libs/common.js');

Page({
  onLoad(query) {
    const that = this;
    let tag = 'all';
    if ('tag' in query) {
      tag = query.tag;
    }
    common.fetchGoods(tag).then(goods => {
      Promise.resolve(
        goods.map(good => {
          return Object.assign({}, {
            name: good.attributes.name,
            price: good.attributes.price,
            description: good.attributes.description,
            images: good.attributes.images,
            tag: good.attributes.tag,
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


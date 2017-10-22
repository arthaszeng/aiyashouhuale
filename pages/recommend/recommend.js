const app = getApp();
const common = require('../../libs/common.js');

Page({
  name: "feature",

  data: {},

  onLoad() {
    const that = this;
    common.fetchRecommends().then(recommends => {
      Promise.resolve(
        recommends.map(recommend => {
          return Object.assign({}, {
            title: recommend.attributes.title,
            description: recommend.attributes.description,
            images: recommend.attributes.images,
            goodLink: recommend.attributes.goodLink,
            objectId: recommend.id
          });
        })).then(results => {
        that.setData({
          recommends: results
        });
      });
    });
  },

  onReady() {
  },

  onShow() {
  },

  onHide() {

  },

  onUnload() {

  },

  onPullDownRefresh() {

  },

  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
});


const app = getApp();
const common = require('../../libs/common.js');

Page({
  name: "detail",

  data: {},

  onLoad(query) {
    common.showLoading();
    const that = this;
    if ('id' in query) {
      common.fetchGoodByObjectId(query.id).then(good => {
          console.log(good);
          that.setData(Object.assign({}, {
            good: good,
            name: good.attributes.name,
            price: good.attributes.price,
            description: good.attributes.description,
            objectId: good.id,
            images: {
              files: [],
              urls: good.attributes.images
            }
          }));
        },
        function (error) {
          console.error(error);
        });
    }
    common.hideLoading();
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

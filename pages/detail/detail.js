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

  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  openMenu(e) {
    const that = this;
    wx.showActionSheet({
      itemList: ['电话咨询', '线路规划（即将上线）', '在线预约（即将上线）', '上门服务（即将上线）'],
      success: function (res) {
        switch (res.tapIndex) {
          case 0:
            return that.phoneCall();
          case 1:
            return that.goToMap();
          case 2:
            return that.bookOnline();
          case 3:
            return that.bookVisiting();
          default:
            return;
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  phoneCall () {
    wx.makePhoneCall({
      phoneNumber: '15208125605' //仅为示例，并非真实的电话号码
    })
  },

  goToMap() {
    common.showSuccess("此功能即将上线")
  },

  bookOnline() {
    common.showSuccess("此功能即将上线")
  },

  bookVisiting() {
    common.showSuccess("此功能即将上线")
  }
});

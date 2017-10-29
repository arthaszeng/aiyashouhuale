const app = getApp();
const common = require('../../libs/common.js');
const AV = require('../../libs/av-weapp-min.js');


Page({
  data: {
    adminMode: false
  },

  onLoad() {
    const that = this;
    common.showLoading();

    const modelForce = app.globalData.customerModelForce;

    if (!modelForce) {
      Promise.resolve(AV.User.current()).then(user => {
        return Promise.resolve(user.getRoles());
      }).then(roles => {
        that.setData({
          adminMode: roles !== undefined && roles.length !== 0
        })
      }).catch(error => {
        console.error(error);
        common.hideLoading();
      })
    }
    common.hideLoading()
  },

  onReady() {

  },

  onShow() {
  },

  goAbout: function () {
    wx.navigateTo({
      url: '../about/about',
    });
  },

  goFeature: function () {
    wx.navigateTo({
      url: '../feature/feature',
    });
  },

  goAdmin: function () {
    wx.navigateTo({
      url: '../admin/admin',
    });
  },

  goRecommend: function () {
    wx.navigateTo({
      url: '../recommend/recommend',
    });
  },

  goList(event) {
    const tag = event.currentTarget.dataset.tag;
    const url = '../list/list' + (tag ? `?tag=${tag}` : '');
    wx.navigateTo({
      url: url,
    });
  }
});


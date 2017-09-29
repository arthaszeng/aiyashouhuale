var app = getApp();

Page({
  onLoad() {
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
  }
});


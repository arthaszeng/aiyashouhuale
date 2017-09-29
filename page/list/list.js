var app = getApp();

Page({
  onLoad() {
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


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


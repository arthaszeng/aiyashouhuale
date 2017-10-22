const app = getApp();

// 创建页面实例对象
Page({
  name: "detail",

  data: {},

  onLoad() {

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

  goEdit() {
    wx.navigateTo({
      url: "../edit/edit"
    })
  },

  goList() {
    wx.navigateTo({
      url: "../list/list"
    })
  },

  goRecommend() {
    wx.navigateTo({
      url: "../recommend/recommend"
    });
  },

  goEditGood() {
    wx.navigateTo({
      url: "../editgood/editgood"
    });
  }
});
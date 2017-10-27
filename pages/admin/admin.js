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
      url: "../editRecommend/editRecommend"
    })
  },

  goList() {
    wx.navigateTo({
      url: "../list/list?mode=true"
    })
  },

  goRecommend() {
    wx.navigateTo({
      url: "../recommend/recommend?mode=true"
    });
  },

  goEditGood() {
    wx.navigateTo({
      url: "../editgood/editgood"
    });
  }
});
const app = getApp();

Page({
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
  },

  switchToCustomer() {
    app.globalData.customerModelForce = true;
    wx.redirectTo({
      url: "../index/index"
    })
  }

});
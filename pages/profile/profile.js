const AV = require('../../utils/av-weapp-min.js');
const common = require('../../utils/common');
const app = getApp();

Page({
  onLoad: function () {
    this.setData(Object.assign({}, {
      width: app.globalData.windowInfo.width,
      height: app.globalData.windowInfo.height
    }))
  },

  onShow: function () {
    const user = AV.User.current();
    this.setData(Object.assign({}, {
      user,
      images: {urls: user.get('images') || []},
      nickName: user.get('nickName') || 'unknown',
      province: user.get('province') || 'unknown',
      city: user.get('city') || 'unknown',
      avatar: user.get('avatar') || 'http://pic.nipic.com/2007-07-27/200772784417204_2.jpg',
      gender: user.get('gender') || 1
    }));
  },

  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  goEdit: function () {
    wx.navigateTo({
      url: `../edit/edit`,
    });
  },

  goMenu: function () {
    common.showFail("还在施工");
  },

  previewImage: function (e) {
    console.log(e)
    wx.previewImage({
      current: this.data.images.urls[e.currentTarget.id],
      urls: this.data.images.urls
    });
  }
});
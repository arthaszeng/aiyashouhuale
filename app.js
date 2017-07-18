const AV = require('./utils/av-weapp-min.js');
AV.init({
  appId: 'WWfarQ5WJWyBODyeS3YdWoce-gzGzoHsz',
  appKey: '9jvhzsjWx2wJm5zizXdgV0Qq',
});
const user = AV.User.current();


App({
  globalData: {
    movieData: null,
    userInfo: null,
    windowInfo: {}
  },

  onLaunch: function () {
    this.test();
    try {
      var res = wx.getSystemInfoSync()
      this.globalData.windowInfo.width = res.windowWidth;
      this.globalData.windowInfo.height = res.windowHeight;
    } catch (e) {
      console.log(e)
      // Do something when catch error
    }
  },
  getUserInfo: function(cb) {
    AV.User.loginWithWeapp().then(userInfo => {
      const user = AV.User.current();
      // 调用小程序 API，得到用户信息
      wx.getUserInfo({
        success: ({
                    userInfo
                  }) => {
          // 更新当前用户的信息
          user.set(userInfo).save().then(userInfo => {
            // 成功，此时可在控制台中看到更新后的用户信息
            this.globalData.userInfo = userInfo.toJSON();
            cb(this.globalData.userInfo);
          }).catch(console.error);
        }
      });
    }).catch(console.error);
  },

  test: function () {
    wx.request({
      url: 'https://arthaszeng.win/swagger/api-docs/categories/1', //仅为示例，并非真实的接口地址
      data: {
        x: '' ,
        y: ''
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
      },
      fail: function (error) {
        console.log(error)
      }
    })
  }
});

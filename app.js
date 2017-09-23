const AV = require('./libs/av-weapp-min.js');

AV.init({
  appId: 'WWfarQ5WJWyBODyeS3YdWoce-gzGzoHsz',
  appKey: '9jvhzsjWx2wJm5zizXdgV0Qq',
});

App({
  globalData: {
    userList: null,
    userInfo: null,
    windowInfo: {}
  },

  onLaunch: function () {
    try {
      const res = wx.getSystemInfoSync();
      this.globalData.windowInfo.width = res.windowWidth;
      this.globalData.windowInfo.height = res.windowHeight;
      this.loginWithLCAndWeapp();
    } catch (e) {
      console.log(e)
    }
  },

  loginWithLCAndWeapp: function () {
    AV.Promise.resolve(AV.User.current())
      .then(user => user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
      ).then(user =>
      user ? user : AV.User.loginWithWeapp()
    ).then(user => {
      this.globalData.user = user;
      this.syncUserInfo();
    }).catch(error => console.error(error.message));
  },


  syncUserInfo: function () {
    let that = this;
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            that.globalData.user
              .set('nickName', res.userInfo.nickName)
              .set('province', res.userInfo.province)
              .set('city', res.userInfo.city)
              .set('avatar', res.userInfo.avatarUrl)
              .set('gender', res.userInfo.gender)
              .save()
          }
        })
      }
    })
  },
  getUserInfo: function(cb) {
    AV.User.loginWithWeapp().then(userInfo => {
      const user = AV.User.current();
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
});

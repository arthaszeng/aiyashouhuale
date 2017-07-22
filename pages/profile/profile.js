const AV = require('../../utils/av-weapp-min.js');
const common = require('../../utils/common');
const app = getApp();

Page({
  onUnload: function() {
    this.saveImages();
  },

  onShow: function () {
    const user = AV.User.current();
    Promise.resolve(this.fetchImageEditCache()).then(files => {
      this.setData(Object.assign({}, {
        user,
        images: {files, urls: user.get('images') || []},
        nickName: user.get('nickName') || 'unknown',
        province: user.get('province') || 'unknown',
        city: user.get('city') || 'unknown',
        avatar: user.get('avatar') || 'http://pic.nipic.com/2007-07-27/200772784417204_2.jpg',
        gender: user.get('gender') || 1
      }));
    });
  },

  editUserInfo: function () {
    wx.navigateTo({
      url: `../userInfo/userInfo`,
    });
  },

  saveImages: function () {
    const user = this.data.user;
    const localImages = this.data.images;
    if (localImages.files.length !== 0) {
      localImages.files.map(tempFilePath => () => new AV.File('filename', {
        blob: {
          uri: tempFilePath
        }
      }).save()).reduce(
        (m, p) => m.then(v => AV.Promise.all([...v, p()])),
        AV.Promise.resolve([])
      ).then(images => {
        images.map(image => localImages.urls.push(image.url()));
        user.set('images', localImages.urls);
        return user.save();
      }).then(() => {
        common.showSuccessAndBack("保存成功");
        wx.removeStorage({
          key: 'imageEditCache'
        });
      }).catch(error => {
        console.log(error);
        common.showFail("保存失败");
      })
    }
  },

  chooseImage: function () {
    const images = this.data.images;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        images.files = images.files.concat(res.tempFilePaths);
        this.setData({
          images: images
        });
        this.updateEditCache();
      }
    })
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.images.files.length === 0 ? this.data.images.urls : this.data.images.files
    });
  },

  updateEditCache: function () {
    wx.setStorage({
      key: "imageEditCache",
      data: this.data.images.files
    });
  },

  fetchImageEditCache: function () {
    return wx.getStorageSync('imageEditCache') || [];
  },
});
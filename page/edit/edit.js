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
    Promise.resolve(this.fetchImageEditCache()).then(files => {
      this.setData(Object.assign({}, {
        user,
        images: {files, urls: user.get('images').concat(files) || []},
        nickName: user.get('nickName') || 'unknown',
        province: user.get('province') || 'unknown',
        city: user.get('city') || 'unknown',
        avatar: user.get('avatar') || 'http://pic.nipic.com/2007-07-27/200772784417204_2.jpg',
        gender: user.get('gender') || 1
      }));
    });
  },

  onUnload: function () {
    this.saveImages();
  },

  goEdit: function () {
    wx.navigateTo({
      url: `../userInfo/userInfo`,
    });
  },

  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  saveImages: function () {
    const user = this.data.user;
    const localImages = this.data.images;
    const localFiles = localImages.files;
    const localUrls = localImages.urls;
    if (localFiles.length !== 0) {
      localImages.files.map(tempFilePath => () => new AV.File('filename', {
        blob: {
          uri: tempFilePath
        }
      }).save()).reduce(
        (m, p) => m.then(v => AV.Promise.all([...v, p()])),
        AV.Promise.resolve([])
      ).then(images => {
        console.log(images);
        for (let i = 0; i < images.length; i++) {
          for (let j = 0; j < localUrls.length; j++) {
            if (localUrls[j] === localFiles[i]) {
              localUrls[j] = images[i].get('url');
            }
          }
        }
        user.set('images', localUrls);
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

  imageAction: function (e) {
    const index = e.currentTarget.id;
    const that = this;
    wx.showActionSheet({
      itemList: ['设置为封面', '重新选择相片', '删除', '预览'],
      success: function (res) {
        switch (res.tapIndex) {
          case 0:
            return that.setTop(index);
          case 1:
            return that.chooseImage(index);
          case 2:
            return that.deleteImage(index);
          case 3:
            return that.previewImage(e);
          default:
            return;
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  setTop: function (index) {
    const urls = this.data.images.urls;
    const files = this.data.images.files;
    const target = urls[index];
    urls.splice(index, 1);
    urls.unshift(target);
    this.setData({
      images: {urls, files}
    });

    if (common.arrContain(files, target) === -1) {
      const user = this.data.user;
      user.set('images', urls);
      user.save();
    }
  },

  deleteImage: function (index) {
    const images = this.data.images;
    const files = images.files;
    const urls = images.urls;
    const targetItem = urls[index];
    urls.splice(index, 1);
    common.removeItemByValue(files, targetItem);
    this.setData({
      images: {files, urls}
    });

    const user = this.data.user;
    user.set('images', urls);
    user.save();
  },

  chooseImage: function () {
    const images = this.data.images;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        images.files = images.files.concat(res.tempFilePaths);
        images.urls = images.urls.concat(res.tempFilePaths);
        this.setData({
          images: images
        });
        this.updateEditCache();
      }
    })
  },

  previewImage: function (e) {
    console.log(e)
    wx.previewImage({
      current: this.data.images.urls[e.currentTarget.id],
      urls: this.data.images.urls
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
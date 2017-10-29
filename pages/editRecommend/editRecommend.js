const AV = require('../../libs/av-weapp-min.js');
const common = require('../../libs/common.js');
const app = getApp();

Page({
  data: {
    tags: [
      {
        value: 'face',
        name: '焕肤'
      },
      {
        value: 'eye',
        name: '眉眼'
      },
      {
        value: 'clear',
        name: '护理'
      },
      {
        value: 'tattoo',
        name: '纹身'
      },
      {
        value: 'other',
        name: '其他'
      }
    ],
    tagName: "当前商品链接：暂无"
  },

  onLoad: function () {
    this.setData(Object.assign({}, {
      width: app.globalData.windowInfo.width,
      height: app.globalData.windowInfo.height
    }))
  },

  onLoad: function (query) {
    common.showLoading();
    if ('id' in query) {
      new AV.Query('Recommend').equalTo('objectId', query.id).first()
        .then(recommend => {
          console.log(recommend);
          this.setData(Object.assign({}, {
              good: recommend,
              title: recommend.attributes.title,
              description: recommend.attributes.description,
              images: {
                files: [],
                urls: recommend.attributes.images
              }
            }));
        },
          function (error) {
            console.error(error);
          });
    } else {
      Promise.resolve(this.fetchImageEditCache()).then(files => {
        this.setData(Object.assign({}, {
          images: {files, urls: []},
        }));
      });
    }
    common.hideLoading();
  },

  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  saveRecommend: function () {
    common.showLoading("保存中");

    const recommend = new AV.Object('Recommend');
    recommend.set('description', this.data.description);
    recommend.set('title', this.data.title);
    recommend.set('tag', this.data.tag);


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
        recommend.set('images', localUrls);
        return recommend.save();
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

  updateTitle: function (e) {
    this.setData({
      title: e.detail.value
    });
  },

  updateDescription: function (e) {
    this.setData({
      description: e.detail.value
    });
  },

  updateTag: function (e) {
    this.setData({
      tag: this.data.tags[e.detail.value].value,
      tagName: this.data.tags[e.detail.value].name
    });
  },
});
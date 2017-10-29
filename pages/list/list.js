var app = getApp();
const common = require('../../libs/common.js');

Page({
  data: {
    adminMode: false
  },

  onLoad(query) {
    common.showLoading();

    const that = this;
    let tag = 'all';

    if ('tag' in query) {
      tag = query.tag;
    }
    if ('mode' in query) {
      this.setData({
        adminMode: query.mode
      });
    }
    common.fetchGoods(tag).then(goods => {
      Promise.resolve(
        goods.map(good => {
          return Object.assign({}, {
            name: good.attributes.name,
            price: good.attributes.price,
            description: good.attributes.description,
            images: good.attributes.images,
            tag: good.attributes.tag,
            objectId: good.id
          });
        })).then(results => {
        that.setData({
          goods: results
        });
        common.hideLoading();
      });
    }).catch(error => {
      console.log(error);
      common.hideLoading()
    });
  },

  onReady() {
  },
  onShow() {
  },
  goIndex() {
    wx.navigateTo({
      url: '../index/index',
    });
  },

  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  deleteGood(e) {
    const that = this;

    common.showLoading("删除中");
    const objectId = e.currentTarget.id;
    common.deleteObject('Good', objectId).then(
      function (success) {
        let updatedGoods = that.data.goods;
        common.removeItemByObjectId(updatedGoods, objectId);
        that.setData({
          goods: updatedGoods
        });
        common.showSuccess('删除成功');
      }, function (error) {
        common.showFail('删除失败');
      }
    );
  }
});


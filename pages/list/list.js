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
  },

  openMenu(e) {
    const index = e.currentTarget.id;
    const that = this;
    wx.showActionSheet({
      itemList: ['电话咨询', '线路规划（即将上线）', '在线预约（即将上线）', '上门服务（即将上线）'],
      success: function (res) {
        switch (res.tapIndex) {
          case 0:
            return that.phoneCall();
          case 1:
            return that.goToMap();
          case 2:
            return that.bookOnline(index);
          case 3:
            return that.bookVisiting(index);
          default:
            return;
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  phoneCall () {
    wx.makePhoneCall({
      phoneNumber: '15208125605' //仅为示例，并非真实的电话号码
    })
  },

  goToMap() {
    common.showSuccess("此功能即将上线")
  },

  bookOnline() {
    common.showSuccess("此功能即将上线")
  },

  bookVisiting() {
    common.showSuccess("此功能即将上线")
  }
});


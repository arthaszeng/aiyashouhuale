var app = getApp();
const common = require('../../libs/common.js');

Page({
  data: {
    adminMode: false,
    tag: 'all'
  },

  onLoad(query) {
    if ('tag' in query) {
      this.setData({
        tag: query.tag
      })
    }
    if ('mode' in query) {
      this.setData({
        adminMode: query.mode
      });
    }
  },

  onShow() {
    const that = this;
    common.showLoading();
    common.fetchGoods(this.data.tag).then(goods => {
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

  modifyGood(objectId) {
    const url = `../editgood/editgood?id=${objectId}`;
    wx.navigateTo({
      url: url,
    });
  },

  deleteGood(objectId) {
    common.showLoading("删除中");
    const that = this;
    common.deleteObject('Good', objectId).then(
      function (success) {
        let updatedGoods = that.data.goods;
        common.removeItemByObjectId(updatedGoods, objectId);
        that.setData({
          goods: updatedGoods
        });
        common.showSuccess('删除成功');
      }, function (error) {
        console.error(error);
        common.showFail('删除失败');
      }
    );
  },

  openOpMenu(e) {
    const index = e.currentTarget.id;
    const that = this;
    wx.showActionSheet({
      itemList: ['编辑', '删除', '置顶(即将上线)'],
      success: function (res) {
        switch (res.tapIndex) {
          case 0:
            return that.modifyGood(index);
          case 1:
            return that.deleteGood(index);
          case 2:
            return that.setToTop(index);
          default:
            return;
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
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

  phoneCall() {
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
  },

  setToTop(index) {
    common.showSuccess("此功能即将上线")
  }
});


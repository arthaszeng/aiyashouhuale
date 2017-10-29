const app = getApp();
const common = require('../../libs/common.js');
const timer = require('../../libs/dateformater.js');

Page({
  data: {
    adminMode: false
  },

  onLoad(query) {
    if ('mode' in query) {
      this.setData({
        adminMode: query.mode
      });
    }

    const that = this;
    common.fetchRecommends().then(recommends => {
      Promise.resolve(
        recommends.map(recommend => {
          return Object.assign({}, {
            title: recommend.attributes.title,
            tag: recommend.attributes.tag,
            description: recommend.attributes.description,
            images: recommend.attributes.images,
            goodLink: recommend.attributes.goodLink,
            objectId: recommend.id,
            updateAt: timer(recommend.updatedAt, 'yyyy年mm月dd日'),
          });
        })).then(results => {
        that.setData({
          recommends: results
        });
      });
    });
  },
  
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  deleteRecommend(e) {
    const that = this;

    common.showLoading("删除中");
    const objectId = e.currentTarget.id;
    common.deleteObject('Recommend', objectId).then(
      function () {
        let updatedRecommends = that.data.recommends;
        common.removeItemByObjectId(updatedRecommends, objectId);
        that.setData({
          recommends: updatedRecommends
        });
        common.showSuccess('删除成功');
      }, function (error) {
        console.log(error);
        common.showFail('删除失败');
      }
    );
  }
});


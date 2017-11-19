require('coolsite.config.js');

const app = getApp();
const common = require('../../libs/common.js');
const AV = require('../../libs/av-weapp-min.js');

Page({
  name: "detail",

  data: {},

  onLoad(query) {
    common.showLoading();
    app.coolsite360.register(this);

    const that = this;
    if ('id' in query) {
      common.fetchGoodByObjectId(query.id).then(good => {
          that.setData(Object.assign({}, {
            good: good,
            name: good.attributes.name,
            price: good.attributes.price,
            description: good.attributes.description,
            objectId: good.id,
            likes: good.attributes.likes || [],
            liked: that.isLiked(query.id),
            images: {
              files: [],
              urls: good.attributes.images
            }
          }));
        },
        function (error) {
          console.error(error);
        });
      this.fetchComments(query.id).then(comments => {
          Promise.resolve(comments.map(comment => {
            comment.set('liked', that.isLiked(comment.id));
            return comment;
          })).then(comments => {
            that.setData({
              comments: comments
            });
          });
        },
        function (error) {
          console.error(error);
        });
    }

    common.hideLoading();

  },

  onShow() {
    app.coolsite360.onShow(this);
  },

  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  isLiked(id) {
    const likeHistory = wx.getStorageSync('likeHistory') || [];
    return common.arrContain(likeHistory, id) !== -1;
  },

  freshComments() {
    this.fetchComments().then(comments => {
        that.setData({
          comments: comments
        })
      },
      function (error) {
        console.error(error);
      });
  },

  likeForGood() {
    if (!this.data.liked) {
      const good = this.data.good;
      const likes = this.data.likes;
      const user = app.globalData.user;
      const that = this;

      likes.unshift({
        name: user.attributes.nickName,
        avatar: user.attributes.avatar
      });
      good.set('likes', likes);
      good.save().then(() => {
        that.setData({
          liked: true,
          likes: likes
        });
        that.updateLikeHistory(that.data.objectId);
      });
    }
  },

  likeForComment(e) {
    const id = e.currentTarget.id;
    const index = e.currentTarget.dataset.index;
    const comments = this.data.comments;
    const likeHistory = wx.getStorageSync('likeHistory') || [];
    const that = this;

    if (!this.isLiked(id)) {
      const likes = comments[index].attributes.likes;
      comments[index].set('likes', likes + 1);
      comments[index].save().then(() => {
        comments[index].set('liked', true);
        that.setData({
          comments: comments
        });
        this.updateLikeHistory(id);
      })
    }
  },

  updateLikeHistory(id) {
    const likeHistory = wx.getStorageSync('likeHistory') || [];
    likeHistory.push(id);
    wx.setStorage({
      key: "likeHistory",
      data: likeHistory
    });
  },

  openMenu() {
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
            return that.bookOnline();
          case 3:
            return that.bookVisiting();
          default:
            return;
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  syncComment() {
    const that = this;

    if (common.validateComment(this.data.comment)) {
      const good = this.data.good;
      const comment = new AV.Object('Comment');

      comment.set('content', this.data.comment);
      comment.set('good', good);

      const user = app.globalData.user.attributes;
      comment.set('username', user.nickName || "");
      comment.set('userAvatar', user.avatar || "");
      comment.set('date', common.date());
      comment.set('likes', 0);

      Promise.resolve(comment.save()).then(commentRt => {
        const comments = that.data.comments;
        comments.push(commentRt);
        that.setData({
          comments: comments
        });
        common.showSuccess("评论成功");
      });
    }
  },

  fetchComments(id) {
    const good = AV.Object.createWithoutData('Province', id);
    const query = new AV.Query('Comment');
    query.equalTo('good', good);
    return Promise.resolve(query.find());
  },

  updateComment: function (e) {
    this.setData({
      comment: e.detail.value
    });
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

  tap_e2bd485d: function (e) {
    //触发coolsite360交互事件
    app.coolsite360.fireEvent(e, this);
  },

  saveComment: function (e) {
    this.syncComment()
    app.coolsite360.fireEvent(e, this);
  },

  tap_3ec69114: function (e) {
    //触发coolsite360交互事件
    app.coolsite360.fireEvent(e, this);
  },

  addComment: function (e) {
    //触发coolsite360交互事件
    app.coolsite360.fireEvent(e, this);
  },

  tap_d5808da3: function (e) {
    //触发coolsite360交互事件
    app.coolsite360.fireEvent(e, this);
  },

  tap_22930b74: function (e) {
    //触发coolsite360交互事件
    app.coolsite360.fireEvent(e, this);
  },
});

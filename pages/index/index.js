let app = getApp();
const AV = require('../../utils/av-weapp-min.js');
let load = require('../../load.js');
const common = require('../../utils/common');
import {FETCH_THRESHOLD, Z_INDEX_MAX} from '../../constans.js';


let zIndex = 10000; //zindex全局变量
let touch = {
  //拖拽数据
  startPoint: null,
  translateX: null,
  translateY: null,
  timeStampStart: null,
  timeStampEnd: null
};

Page({
  data: {
    isLoadingEnd: false,
    slideTimes: 0,
    userInfo: {},
    touchDot: 0, //触摸时的原点
    coord: {
      x: 0,
      y: 0
    },
    idSets: null,
    listArr: null,
    likeArr: [],
    unlikeArr: [],
    userList: {}
  },

  onLoad: function () {
    common.showLoading();
    let that = this;
    let isShowId, listArr;
    this.setData({
      windowHeight: app.globalData.windowInfo.height,
      windowWidth: app.globalData.windowInfo.width
    });
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo
      });
      load.getuserList({
        fromId: userInfo.lastViewId,
        success: ({
                    userList,
                    idSets
                  }) => {
          console.log('userList', userList);
          console.log('idSets', idSets);

          wx.hideLoading();

          listArr = Array.from(idSets);
          isShowId = listArr[0];
          for (let i = 0; i < listArr.length; i++) {
            userList[listArr[i]].zIndex = --zIndex;
          }
          that.setData({
            userList,
            idSets,
            isShowId,
            listArr,
            user: app.globalData.user
          });
        }
      })
    })
  },

  touchStart: function (e) {
    touch.startPoint = e.touches[0];
    let timeStampStart = new Date().getTime();
    this.animation = wx.createAnimation({
      duration: 70,
      timingFunction: 'ease',
      delay: 0
    });
    this.touch = {
      timeStampStart
    }
  },
  //触摸移动事件
  touchMove: function (e) {
    let userList, rotate;
    let currentPoint = e.touches[e.touches.length - 1];
    let translateX = currentPoint.clientX - touch.startPoint.clientX;
    let translateY = currentPoint.clientY - touch.startPoint.clientY;
    if (translateX < 0) {
      if (translateX > -10) {
        rotate = -1;
      } else {
        rotate = -4;
      }
    }
    if (translateX > 0) {
      if (translateX < 10) {
        rotate = 1;
      } else {
        rotate = 4;
      }
    }
    this.animation.rotate(rotate).translate(translateX, 10).step();
    let id = this.data.isShowId;
    userList = this.data.userList;
    userList[id].animationData = this.animation.export();
    this.setData({
      userList
    })
  },
  // 触摸结束事件
  touchEnd: function (e) {
    // return;
    let userList;
    let translateX = e.changedTouches[0].clientX - touch.startPoint.clientX;
    let translateY = e.changedTouches[0].clientY - touch.startPoint.clientY;
    let timeStampEnd = new Date().getTime();
    let time = timeStampEnd - this.touch.timeStampStart;
    let jack = this.data.user.id;
    let rose = this.data.isShowId;
    let animation = wx.createAnimation({
      duration: 250,
      timingFunction: 'ease',
      delay: 0
    })
    if (time < 150) {
      //快速滑动
      if (translateX > 40) {
        //右划
        this.markAsRead();
        animation.rotate(0).translate(this.data.windowWidth, 0).step();
        userList = this.data.userList;
        userList[rose].animationData = animation.export();
        this.setData({
          userList
        });
        load.likeAction({
          action: 'like',
          jack: jack,
          rose: rose
        })
      } else if (translateX < -40) {
        //左划
        this.markAsRead();
        animation.rotate(0).translate(-this.data.windowWidth, 0).step();
        userList = this.data.userList;
        userList[id].animationData = animation.export();
        this.setData({
          userList
        })
      } else {
        //返回原位置
        animation.rotate(0).translate(0, 0).step();
        userList = this.data.userList;
        userList[this.data.isShowId].animationData = animation.export();
        this.setData({
          userList,
        })
      }
    } else {
      if (translateX > 160) {
        //右划
        this.markAsRead();
        animation.rotate(0).translate(this.data.windowWidth, 0).step();
        userList = this.data.userList;
        userList[rose].animationData = animation.export();
        this.setData({
          userList
        });
        load.likeAction({
          action: 'like',
          jack: jack,
          rose: rose
        })
      } else if (translateX < -160) {
        //左划
        this.markAsRead();
        animation.rotate(0).translate(-this.data.windowWidth, 0).step();
        userList = this.data.userList;
        userList[rose].animationData = animation.export();
        this.setData({
          userList
        })
      } else {
        //返回原位置
        animation.rotate(0).translate(0, 0).step();
        userList = this.data.userList;
        userList[this.data.isShowId].animationData = animation.export();
        this.setData({
          userList,
        })
      }
    }
  },

  onLike: function () {
    this.clickAnimation({
      direction: 'right'
    });
    let rose = this.data.isShowId;
    let likeArr = this.data.likeArr;
    likeArr.push(rose);
    this.setData({
      likeArr
    });
    this.markAsRead();
    load.likeAction({
      action: 'like',
      jake: this.data.user.id,
      rose: rose
    })
  },
  onUnlike: function () {
    this.clickAnimation({
      direction: 'left'
    });
    let rose = this.data.isShowId;
    let unlikeArr = this.data.unlikeArr;
    unlikeArr.push(rose);

    this.setData({
      unlikeArr
    });
    this.markAsRead();
    load.likeAction({
      action: 'unlike',
      jack: this.data.user.id,
      rose: rose
    })
  },
  markAsRead: function () {
    let rose = this.data.isShowId;
    let userList = this.data.userList;
    let listArr = this.data.listArr;
    let length = this.finRemainArrLength({
      listArr,
      rose
    });
    let slideTimes = this.data.slideTimes;
    slideTimes++;

    if (length <= FETCH_THRESHOLD) {
      this.loadMore();
    }
    let i = listArr.indexOf(rose);
    let nextId = listArr[i + 1];

    this.setData({
      isShowId: nextId,
      slideTimes
    });
    if (this.data.slideTimes >= 4) {
      this.deleteItem(rose)
    }

    this.saveLastViewId(rose);
  },
  saveLastViewId: function (id) {
    const _user = AV.Object.createWithoutData('_User', this.data.user.id);
    _user.set('lastViewId', id);
    _user.save();
  },
  clickAnimation: function (params) {
    let x, y, duration, rotate, userList;
    duration = 700;
    y = 100;
    if (params.direction === 'left') {
      rotate = -10;
      x = -this.data.windowWidth - 100;
    } else {
      rotate = 10;
      x = this.data.windowWidth + 100;
    }

    this.animation = wx.createAnimation({
      duration,
      timingFunction: 'ease',
      delay: 0
    });
    let id = this.data.isShowId;
    this.animation.rotate(rotate).translate(x, y).step();
    userList = this.data.userList;
    userList[id].animationData = this.animation.export();
    this.setData({
      userList
    })
  },
  finRemainArrLength: function (params) {
    let i = params.listArr.indexOf(params.rose) + 1;
    return params.listArr.slice(i).length;
  },
  loadMore: function () {
    let _userList, _listArr, _isShowId, fromId;
    fromId = [].concat(this.data.listArr).pop();
    if (!this.data.isLoadingEnd) {
      load.getuserList({
        fromId: fromId,
        success: ({
                    userList,
                    idSets,
                  }) => {
          if (idSets.size === 0) {
            this.setData({
              isLoadingEnd: true
            });
            return;
          }
          _userList = Object.assign({}, this.data.userList, userList);
          _listArr = Array.from(idSets);
          for (let i = 0; i < _listArr.length; i++) {
            _userList[_listArr[i]].zIndex = --zIndex;
            _userList[_listArr[i]].isRender = true;
          }
          let listArrPlus = this.data.listArr.concat(_listArr);
          this.setData({
            userList: _userList,
            listArr: listArrPlus
          })
        }
      })
    }
  },
  deleteItem: function (id) {
    let index = this.data.listArr.indexOf(id);
    let listArr = [].concat(this.data.listArr);
    let _listArr;
    if (index >= FETCH_THRESHOLD) {
      setTimeout(() => {
        let userList = Object.assign({}, this.data.userList);
        for (let i = 0; i < index - FETCH_THRESHOLD; i++) {
          let id = listArr[i];
          userList[id].isRender = false;
        }
        this.setData({
          slideTimes: 0,
          userList
        })
      }, 1000)

    }
  },
  toUserEdit: function () {
    try {
      wx.navigateTo({
        url: '../profile/profile'
      });
    } catch (e) {
      console.log(e);
    } finally {

    }
  },
  onShareAppMessage: function () {
    return {
      title: '电影心愿单',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  },

  goMessage: function () {
    common.showFail("施工中");
  },

  goMenu: function () {
    common.showFail("施工中");
  }
});

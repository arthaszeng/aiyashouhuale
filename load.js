import {HOST, LIMIT} from 'constans.js';

const AV = require('./utils/av-weapp-min.js');

const load = {
  getuserList: function (params) {
    let objectId;
    if (params.fromId) {
      objectId = params.fromId;
    } else {
      try {
        const lastViewId = wx.getStorageSync('lastViewId');
        if (lastViewId) {
          objectId = lastViewId;
        }
      } catch (e) {
        console.log(e)
      }
    }
    let where = {};
    if (objectId) {
      where.objectId = {
        $gt: objectId
      }
    }
    let whereStr = encodeURIComponent(JSON.stringify(where));

    console.log('start request arthas');
    wx.request({
      url: `${HOST}/users/?limit=${LIMIT}`,
      header: {
        'content-type': 'application/json'
      },
      success: (data) => {
        console.log('fetched user data from arthas:');
        console.log(data);
        let arr = data.data;
        let _data = {},
          idSets = new Set();
        for (let i = 0; i < arr.length; ++i) {
          let id = arr[i].objectId;
          _data[id] = arr[i];
          idSets.add(id);
          _data[id].isRender = true;
        }
        params.success({
          userList: _data,
          idSets
        });
      }
    });
  },
  likeAction: function (params) {
    if (params.action === 'like') {
      const LikeList = AV.Object.extend('Match');
      const likeItem = new LikeList();

      const jack = AV.Object.createWithoutData('_User', params.jack);
      const rose = AV.Object.createWithoutData('_User', params.rose);

      likeItem.set('jack', jack);
      likeItem.set('rose', rose);

      likeItem.save().then(function (data) {
      }, function (error) {
        console.error(error);
      });
    }
  },
  leancloudRequest: function (params) {
    let url = `${params.url}`;
    let method = params.method;

    let header, body;
    if (method === 'POST' || method === 'PUT') {
      body = params.body;
    } else {
      body = '';
    }
    header = {
      'Content-Type': 'application/json',
      "X-LC-Id": "FTwd0NMfXvTdENGONHoT5FAp-gzGzoHsz",
      "X-LC-Key": "v6qtxRqeTEjz3Xm0VI7T0kNx"
    };

    wx.request({
      url: url,
      method: method || "GET",
      data: body,
      header,
      success: function (res) {
        try {
          params.success(res.data);
        } catch (e) {
          console.log(e)
        }
      }
    })
  }
};

module.exports = load;

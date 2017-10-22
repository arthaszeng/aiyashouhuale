var app = getApp();

Page({
  data: {
    latitude: 30.579092,
    longitude: 104.015291,

    markers: [{
      id: "1",
      latitude: 30.579092,
      longitude: 104.015291,
      width: 50,
      height: 50,
      iconPath: "/images/location.png",
      name: "哪里",
      label: {color: '#ff828a', fontSize: 12, content: "成都半永久皮肤管理"},
      callout: {content: "成都市双流区西航港\n街道珠江路600号2栋\n1单元7楼718号", color: "#ff828a", borderRadius: 20, bgColor: "#ffffff", fontSize: 10, display:true}
    }],
  },

  onLoad() {
  },

  onReady() {

  },

  onShow() {
  },

  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
});


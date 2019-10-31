// component/view/mine/mine.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    info: wx.getStorageSync("userInfo")
  },
  pageLifetimes: {
    show() {
      this.getUserInfo();
    }
  },
  methods: {
    onGotUserInfo(e) {
      if (e.detail.userInfo) {
        this.setData({
          info: e.detail.userInfo
        });
        wx.setStorage({
          key: "userInfo",
          data: e.detail.userInfo
        });
      }
    },
    getUserInfo() {
      const that = this;
      wx.getUserInfo({
        success(res) {
          that.setData({
            info: res.userInfo
          });
          wx.setStorage({
            key: "userInfo",
            data: res.userInfo
          });
        }
      });
    },
    toPage() {
      wx.navigateTo({
        url: "/pages/mine/userinfo/index"
      });
    }
  }
});
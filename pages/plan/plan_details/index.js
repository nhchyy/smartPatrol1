// pages/plan/plan_details/index.js
const app = getApp();
Page({
    data: {
        planList: null
    },
    onLoad: function(options) {
        this.setData({
            id: options.id
        });
        wx.showLoading({
            title: "加载中....",
            mask: true
        });
    },
    onReady: function() {},
    onShow: function() {
        this.getMyPlanExecutDetails();
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    getMyPlanExecutDetails() {
        let that = this;
        let sendData = {
            id: this.data.id
        };
        app.api
            .getMyPlanExecutDetails(sendData)
            .then(res => {
                wx.hideLoading();
                that.setData({
                    planInfo: res.data
                });
            })
            .catch(wx.hideLoading());
    },
    openLocation(e) {
        wx.openLocation({
            //使用微信内置地图查看位置。
            latitude: e.currentTarget.dataset.lat, //要去的纬度-地址
            longitude: e.currentTarget.dataset.lng, //要去的经度-地址
            name: e.currentTarget.dataset.address,
            address: e.currentTarget.dataset.address
        });
    }
});

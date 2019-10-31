// pages/plan/list_details/index.js
const app = getApp();
Page({
    data: {
        planList: null
    },
    onLoad: function(options) {
        this.setData({
            id: options.id,
            showScan: false
        });
    },
    onReady: function() {},
    onShow: function() {
        wx.showLoading({
            title: "加载中....",
            mask: true
        });
        this.getMyPlanDetails();
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    getMyPlanDetails() {
        let that = this;
        let sendData = {
            id: this.data.id
        };
        app.api
            .getMyPlanDetails(sendData)
            .then(res => {
                wx.hideLoading();
                let endTime = res.data.result["0"].endtime * 1000;
                let timestamp = new Date().getTime();
                that.setData({
                    planList: res.data.result["0"],
                    showScan: endTime > timestamp ? true : false
                });
            })
            .catch(err => {
                wx.hideLoading();
            });
    },
    toDetails(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/plan/plan_details/index?id=${id}`
        });
    },
    // 扫码
    scan() {
        let that = this;
        wx.scanCode({
            onlyFromCamera: true,
            success(res) {
                if (res.result) {
                    wx.navigateTo({
                        url: `/pages/plan/send/index?code=${
                            res.result
                        }&&type=1&&id=${that.data.id}`
                    });
                } else {
                    wx.showToast({
                        title: "请扫描正确的二维码!",
                        icon: "none",
                        duration: 2000
                    });
                }
            }
        });
    }
});

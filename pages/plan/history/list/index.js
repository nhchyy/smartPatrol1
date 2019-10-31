// pages/plan/history/list/index.js
const app = getApp();
Page({
    data: {
        planList: null,
        nowpage: 1,
        totalpage: 1
    },
    onLoad: function (options) {
        let day = options.day || "";
        this.setData({
            day: day
        });
        wx.showLoading({
            title: "加载中....",
            mask: true
        });
        this.getMyPlanRecord();
    },
    onPullDownRefresh: function () {
        this.setData({
            nowpage: 1
        });
        this.getMyPlanRecord();
    },
    onReachBottom: function () {
        let page = this.data.nowpage + 1;
        if (page > this.data.totalpage) return;
        this.setData({
            nowpage: page
        });
        this.getMyPlanRecord(true);
    },
    // 获取巡检记录
    getMyPlanRecord(Refresh = false) {
        let that = this;
        let sendData = {
            p: this.data.nowpage,
            day: this.data.day
        };
        app.api
            .getMyPlanRecord(sendData)
            .then(res => {
                wx.hideLoading();
                wx.stopPullDownRefresh();
                let planList = Refresh
                    ? [...that.data.planList, ...res.data.result]
                    : res.data.result;
                that.setData({
                    planList: planList,
                    totalpage: res.data.totalpage
                });
            })
            .catch(_err => {
                if (_err.status === 0) {
                    wx.navigateBack();
                }
                wx.hideLoading();
                wx.stopPullDownRefresh();
            });
    },
    toDetails(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/plan/history/details/index?id=${id}`
        });
    }
});

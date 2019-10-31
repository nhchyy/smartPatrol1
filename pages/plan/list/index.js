// pages/plan/list/index.js
const app = getApp();
Page({
    data: {
        planList: null,
        nowpage: 1,
        totalpage: 1
    },
    onLoad(options) {
        let day = options.day || "";
        this.setData({
            day: day
        });
        if (day) {
            wx.setNavigationBarTitle({
                title: "巡检记录"
            });
        }
    },
    onShow: function() {
        this.onPullDownRefresh();
    },
    onPullDownRefresh: function() {
        this.setData({
            nowpage: 1
        });
        this.getMyPlan();
    },
    onReachBottom: function() {
        let page = this.data.nowpage + 1;
        if (page > this.data.totalpage) return;
        this.setData({
            nowpage: page
        });
        this.getMyPlan(true);
    },
    getMyPlan(Refresh = false) {
        wx.showLoading({
            title: "加载中....",
            mask: true
        });
        let that = this;
        let sendData = {
            p: this.data.nowpage,
            day: this.data.day
        };
        app.api
            .getMyPlan(sendData)
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
            .catch(err => {
                wx.hideLoading();
                wx.stopPullDownRefresh();
            });
    },
    toDetails(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/plan/list_details/index?id=${id}`
        });
    }
});

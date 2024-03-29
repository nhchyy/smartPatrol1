// pages/task/details/index.js
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            id: options.id
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getMyTaskDetails();
    },
    getMyTaskDetails() {
        let that = this;
        let sendData = {
            id: this.data.id
        };
        app.api
            .getMyTaskDetails(sendData)
            .then(res => {
                that.setData({
                    info: res.data
                });
            })
            
    },
    // 跳转执行页面
    toComplete(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/task/complete/index?id=${id}`
        });
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {}
});

// pages/task/complete/index.js
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        value: "点击选择",
        status: null,
        showAction: false,
        actions: [
            {
                name: "已完成",
                status: 2
            },
            {
                name: "已取消",
                status: 3
            }
        ]
    },

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
    onShow: function() {},
    // 选择
    onSelect(event) {
        if (event.detail)
            this.setData({
                value: event.detail.name,
                status: event.detail.status
            });
        this.setData({
            showAction: !this.data.showAction
        });
    },
    // 显示弹窗
    switchAction() {
        this.setData({
            showAction: !this.data.showAction
        });
    },
    // 点击提交按钮
    clickSendBtn() {
        if (this.data.status) {
            let that = this;
            let sendData = {
                id: this.data.id,
                status: this.data.status
            };
            app.api
                .myTaskComplete(sendData)
                .then(res => {
                    if (res.data.status === 1) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: "success",
                            mask: true,
                            duration: 2000,
                            success: () => {
                                this.Back();
                            }
                        });
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: "none",
                            mask: true,
                            duration: 2000,
                            success: () => {
                                this.Back();
                            }
                        });
                    }
                })
                
        } else {
            wx.showToast({
                title: "请选择任务状态",
                icon: "none",
                mask: true,
                duration: 2000
            });
            setTimeout(() => {
                this.setData({
                    showAction: !this.data.showAction
                });
            }, 2000);
        }
    },
    Back() {
        setTimeout(() => {
            wx.navigateBack();
        }, 2000);
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

//index.js
const app = getApp();
Page({
    data: {
        showMask: true,
        currentTab: 0,
        list: [
            {
                iconPath: "/assets/tab-bar-icon/home.png",
                selectedIconPath: "/assets/tab-bar-icon/home_h.png",
                text: "首页"
            },
            {
                iconPath: "/assets/tab-bar-icon/task.png",
                selectedIconPath: "/assets/tab-bar-icon/task_h.png",
                text: "任务"
            },
            {
                pagePath: "/pages/index/index",
                iconPath: "/assets/tab-bar-icon/scanf_h.png",
                selectedIconPath: "/assets/tab-bar-icon/scanf_h.png",
                text: "巡检"
            },
            {
                iconPath: "/assets/tab-bar-icon/msg.png",
                selectedIconPath: "/assets/tab-bar-icon/msg_h.png",
                text: "消息"
            },
            {
                iconPath: "/assets/tab-bar-icon/my.png",
                selectedIconPath: "/assets/tab-bar-icon/my_h.png",
                text: "我的"
            }
        ]
    },
    onLoad: function() {
        this.getUserInfo();
        this.userLogin();
    },
    onShow: function() {},
    userLogin() {
        wx.login({
            success(res) {
                if (res.code) {
                    // 发起网络请求
                } else {
                }
            }
        });
    },
    getUserInfo() {
        const that = this;
        wx.getUserInfo({
            success(res) {
                that.setData({
                    showMask: false
                });
                wx.setStorage({
                    key: "userInfo",
                    data: res.userInfo
                });
            }
        });
    },
    onGotUserInfo(e) {
        if (e.detail.userInfo) {
            this.setData({
                showMask: false
            });
            wx.setStorage({
                key: "userInfo",
                data: e.detail.userInfo
            });
        }
    },
    swichNav: function(e) {
        let current = e.currentTarget.dataset.current;
        let title = this.data.list[current].text;
        if (current == 2) {
            wx.scanCode({
                onlyFromCamera: true,
                success(res) {
                    if (res.result) {
                        wx.navigateTo({
                            url: `/pages/plan/send/index?code=${
                                res.result
                            }&&type=0`
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
        } else {
            if (current === 3) {
                this.selectComponent("#message").getData();
            }
            if (this.data.currentTab !== current) {
                wx.setNavigationBarTitle({
                    title: title
                });
                this.setData({
                    currentTab: current
                });
            }
        }
    }
});

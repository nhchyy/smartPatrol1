// pages/authorize/index.js
const app = getApp();
Page({
    data: {
        isAuthorize: true
    },
    onShow: function() {
        let that = this;
        // 获取用户设置
        wx.getSetting({
            success(res) {
                // 判断是否授权
                if (res.authSetting["scope.userInfo"]) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    that.getOpenId();
                } else {
                    that.setData({
                        isAuthorize: false
                    });
                }
            }
        });
    },
    // 用户授权开始获取openId
    bindGetUserInfo: function(e) {
        // 判断是否获取到用户信息
        if (!e.detail.userInfo) {
            return;
        } else {
            this.getOpenId();
        }
    },
    // 获取openId
    getOpenId() {
        let that = this;
        wx.login({
            success(res) {
                let sendData = {
                    code: res.code
                };
                app.api.getOpenId(sendData).then(res => {
                    // 储存openId
                    wx.setStorageSync("openid", res.data.openid);
                    // res.status = -1 未注册 res.status = 1 已注册
                    if (res.status === -1) {
                        wx.showToast({
                            title: "尚未注册，正在自动注册",
                            icon: "none",
                            duration: 2000
                        });
                        setTimeout(() => {
                            that.userRegistered(res.data.openid);
                        }, 2000);
                    }
                    if (res.status === 1) {
                        wx.reLaunch({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    // 用户注册
    userRegistered(openId) {
        if (!openId) {
            wx.showToast({
                title: "未获取到用户openId",
                icon: "none",
                duration: 2000
            });
            return false;
        }
        let sendData = {
            openid: openId,
            tel: Math.ceil(Math.random() * 1000)
        };
        app.api
            .registered(sendData)
            .then(res => {
                wx.showToast({
                    title: res.msg,
                    icon: "success",
                    duration: 2000
                });
                setTimeout(() => {
                    wx.reLaunch({
                        url: "/pages/index/index"
                    });
                }, 2000);
            })
            .catch(err => console.log(err));
    }
});

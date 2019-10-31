// pages/mine/userinfo/index.js
const app = getApp();
Page({
    data: {
        name: null,
        tel: null,
        info: null,
        loading: false
    },
    onShow: function() {
        this.getUserInfo();
    },
    /**
     * @description: 获取用户信息
     */
    getUserInfo() {
        let timeOut = setTimeout(() => {
            wx.showLoading({
                title: "加载中",
                mask: true
            });
        }, 2000);
        app.api
            .userLogin()
            .then(res => {
                this.setData({
                    info: res.data,
                    name: res.data.name,
                    tel: res.data.tel
                });
                clearTimeout(timeOut);
                wx.hideLoading();
            })
            .catch(_err => {
                clearTimeout(timeOut);
                wx.hideLoading();
            });
    },
    /**
     * @description: 记录用户修改后信息
     * @param {object} e 当前输入值对象
     */
    changeValue(e) {
        let name = e.currentTarget.dataset.name;
        let value = e.detail.replace(/\s+/g, "");
        this.setData({
            [name]: value
        });
    },
    /**
     * @description: 点击提交按钮
     */
    clickPostBtn() {
        if (!this.data.name && !this.data.tel) {
            wx.showToast({
                title: "没有需要提交的信息",
                icon: "none",
                duration: 2000,
                mask: true
            });
        } else {
            let sendData = {};
            if (this.data.name) {
                sendData.name = this.data.name;
            }
            if (this.data.tel) {
                if (!/^1[34578]\d{9}$/.test(this.data.tel)) {
                    wx.showToast({
                        title: "手机号码有误，请重填",
                        icon: "none",
                        duration: 2000,
                        mask: true
                    });
                    return false;
                }
                sendData.tel = this.data.tel;
            }
            this.sendData(sendData);
        }
    },
    // 切换按钮loading状态
    switchLoading() {
        this.setData({
            loading: !this.data.loading
        });
    },
    /**
     * @description: 提交数据
     * @param {object} sendData 需要提交的数据信息
     * @return:
     */
    sendData(sendData) {
        this.switchLoading();
        app.api
            .editUserInfo(sendData)
            .then(res => {
                wx.showToast({
                    title: res.msg,
                    icon: "success",
                    duration: 2000,
                    mask: true
                });
                this.switchLoading();
                setTimeout(() => {
                    wx.navigateBack();
                }, 2000);
            })
            .catch(_err => {
                this.switchLoading();
                this.getUserInfo();
            });
    }
});

// pages/message/details/index.js
//Page Object
const app = getApp();
Page({
    data: {
        info: null
    },
    //options(Object)
    onLoad: function(options) {
        wx.showLoading({
            title: "加载中...",
            mask: true
        });
        this.getMsgDetail(options.id);
    },
    getMsgDetail(id) {
        let that = this;
        let sendData = {
            id: id
        };
        app.api
            .getMsgDetail(sendData)
            .then(res => {
                wx.hideLoading();
                console.log("res: ", res);
                that.setData({
                    info: res.data
                });
            })
            .catch(wx.hideLoading());
    }
});

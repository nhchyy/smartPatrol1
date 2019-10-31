// pages/plan/history/details/index.js
const app = getApp();
Page({
    data: {
        planInfo: null,
        server: "https://wookong.net.cn",
        photoPaths: [], //图片文件
        onPlayRecord: false //是否正在播放录音
    },
    //options(Object)
    onLoad: function(options) {
        let that = this;
        this.setData({
            id: options.id
        });
        wx.showLoading({
            title: "加载中....",
            mask: true
        });
        this.getMyPlanExecutDetails();
        // 创建播放音频对象
        this.innerAudioContext = wx.createInnerAudioContext();
        this.innerAudioContext.onPlay(res => {
            that.setData({
                onPlayRecord: true
            });
        });
        this.innerAudioContext.onStop(res => {
            that.setData({
                onPlayRecord: false
            });
        });
        this.innerAudioContext.onEnded(res => {
            that.setData({
                onPlayRecord: false
            });
        });
    },
    getMyPlanExecutDetails() {
        let that = this;
        let sendData = {
            id: this.data.id
        };
        app.api
            .getMyPlanExecutDetails(sendData)
            .then(res => {
                wx.hideLoading();
                let photoPaths = [];
                if (res.data.image) {
                    photoPaths = res.data.image.split(",");
                }
                that.setData({
                    planInfo: res.data,
                    photoPaths: photoPaths
                });
            })
            .catch(wx.hideLoading());
    },
    // 开始播放录音
    playRecord() {
        this.innerAudioContext.src = this.data.server + this.data.planInfo.mp4;
        this.innerAudioContext.play();
    },
    // 停止播放录音
    endRecord() {
        this.innerAudioContext.stop();
    }
});

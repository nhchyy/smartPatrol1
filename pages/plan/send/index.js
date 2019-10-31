// pages/plan/send/index.js
const app = getApp();
Page({
    data: {
        info: null, //巡检信息
        line: {}, //选中的巡检计划
        popup_show: false,
        action_show: false,
        distance: "", //巡检员和巡检点间距
        distanceText: "计算中", //巡检员和巡检点间距
        textarea: "", //检验说明
        photoPaths: [], //图片文件
        recorderPaths: null, //录音文件
        videoPaths: null, //录像文件
        onRecorder: false, //正在录音
        endRecorder: false, //录音是否结束
        onPlayRecord: false //是否正在播放录音
    },
    onLoad: function(options) {
        let that = this;
        this.setData({
            code: options.code,
            type: options.type,
            id: options.id || 0
        });
        // 获取二维码对应数据
        this.getQrcodeData();
        // 创建录音对象
        this.recorderManager = wx.getRecorderManager();
        this.recorderManager.onStart(function() {
            that.tip("开始录音");
            that.setData({
                onRecorder: true
            });
        });
        this.recorderManager.onPause(function() {
            that.tip("暂停录音");
            that.setData({
                onRecorder: false
            });
        });
        this.recorderManager.onError(function() {
            that.tip("录音失败");
            that.setData({
                onRecorder: false
            });
        });
        this.recorderManager.onStop(function(res) {
            that.tip("录音完成");
            that.setData({
                onRecorder: false,
                endRecorder: true
            });
            that.uploadFile(1, res.tempFilePath);
        });
        // 创建播放音频对象
        this.innerAudioContext = wx.createInnerAudioContext();
        this.innerAudioContext.onPlay(res => {
            that.tip("开始播放");
            that.setData({
                onPlayRecord: true
            });
        });
        this.innerAudioContext.onError(res => {
            that.tip("录音失败");
            that.setData({
                onPlayRecord: false
            });
        });
        this.innerAudioContext.onStop(res => {
            that.tip("停止播放");
            that.setData({
                onPlayRecord: false
            });
        });
        this.innerAudioContext.onEnded(res => {
            that.tip("播放完成");
            that.setData({
                onPlayRecord: false
            });
        });
    },
    onHide() {
        // 打开设置页面后隐藏Popup
        this.getLocation();
    },
    // 切换Popup
    switchPopup() {
        this.setData({
            popup_show: !this.data.popup_show
        });
    },
    // 切换Action
    switchAction() {
        this.setData({
            action_show: !this.data.action_show
        });
    },
    // 巡检计划选择
    actionSelect(e) {
        this.setData({
            line: e.detail,
            action_show: false
        });
    },

    //计算两点位置距离
    getDistance() {
        let lat1 = this.data.point_lat || 0;
        let lng1 = this.data.point_lng || 0;
        let lat2 = this.data.info.point_lat || 0;
        let lng2 = this.data.info.point_lng || 0;
        if (lat2 && lng2) {
            let rad1 = (lat1 * Math.PI) / 180.0;
            let rad2 = (lat2 * Math.PI) / 180.0;
            let a = rad1 - rad2;
            let b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;

            let r = 6378137;
            let distance =
                r *
                2 *
                Math.asin(
                    Math.sqrt(
                        Math.pow(Math.sin(a / 2), 2) +
                            Math.cos(rad1) *
                                Math.cos(rad2) *
                                Math.pow(Math.sin(b / 2), 2)
                    )
                );
            this.setData({
                distance: Math.ceil(distance),
                distanceText: Math.ceil(distance) + "米"
            });
        } else {
            this.setData({
                distanceText: "暂无数据"
            });
        }
    },
    // 获取用户定位
    getLocation() {
        let that = this;
        wx.getLocation({
            type: "wgs84",
            altitude: true,
            success(res) {
                that.setData({
                    point_lat: res.latitude,
                    point_lng: res.longitude,
                    popup_show: false
                });
                that.getDistance();
            },
            fail() {
                wx.getSetting({
                    success(res) {
                        // 判断是否授权
                        if (res.authSetting["scope.userLocation"]) {
                            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                            that.getLocation();
                        } else {
                            that.switchPopup();
                        }
                    }
                });
            }
        });
    },
    // 子项目巡检状态切换
    statusChange(e) {
        let info = this.data.info;
        let item_list = info.item_list;
        let select = e.detail;
        let num = e.currentTarget.dataset.num;
        item_list[num].select = select;
        info.item_list = item_list;
        this.setData({
            info: info
        });
    },
    // 检验说明失去焦点
    bindTextAreaBlur(e) {
        let value = e.detail.value;
        this.setData({
            textarea: value
        });
    },
    // 提示
    tip(msg) {
        wx.showToast({
            title: msg,
            icon: "none"
        });
    },
    // 获取二维码对应数据
    getQrcodeData() {
        let that = this;
        let sendData = {
            id: this.data.id,
            code: this.data.code
        };
        app.api
            .sendScanCode(sendData)
            .then(res => {
                that.setData({
                    info: res.data
                });
                if (res.data.line_name.length === 1) {
                    // 巡检计划只有一条默认选择，多条则显示Action弹窗
                    that.setData({
                        line: res.data.line_name[0]
                    });
                } else if (res.data.line_name.length === 2) {
                    // 巡检计划有两条，默认选择非无计划巡检
                    res.data.line_name.forEach(element => {
                        if (Number(element.id) !== 0) {
                            that.setData({
                                line: element
                            });
                        }
                    });
                } else {
                    // 显示弹窗
                    that.switchAction();
                }
                // 判断该巡检是否需要GPS定位
                if (res.data.is_gps === 1) {
                    that.getLocation();
                }
            })
            .catch(_err => {
                wx.navigateBack();
            });
    },
    // 拍照
    takePhoto() {
        if (this.data.photoPaths.length > 4) {
            wx.showToast({
                title: "照片最多可拍摄5张",
                icon: "none",
                duration: 1500,
                mask: true
            });
            return;
        }
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ["original"],
            sourceType: ["camera"],
            success(res) {
                that.uploadFile(0, res.tempFilePaths[0]);
            }
        });
    },
    // 开始录音
    startRecord() {
        this.recorderManager.start();
    },
    // 结束录音
    stopRecord() {
        this.recorderManager.stop();
    },
    // 开始播放录音
    playRecord() {
        this.innerAudioContext.src = this.data.recorderPaths.url;
        this.innerAudioContext.play();
    },
    // 停止播放录音
    endRecord() {
        this.innerAudioContext.stop();
    },
    // 开始录像
    chooseVideo() {
        let that = this;
        wx.chooseVideo({
            sourceType: ["camera"],
            maxDuration: 10,
            camera: "back",
            success(res) {
                that.uploadFile(2, res.tempFilePath);
            }
        });
    },
    // 移除图片
    deletePhoto(e) {
        let index = e.currentTarget.dataset.index;
        let photos = this.data.photoPaths;
        photos.splice(index, 1);

        this.setData({
            photoPaths: photos
        });
    },
    // 重新录音
    removeRecord() {
        this.setData({
            recorderPaths: null, //录音文件
            endRecorder: false //录音是否结束
        });
    },
    // 重新录像
    removeVideo() {
        this.setData({
            videoPaths: null
        });
    },
    // 储存上传的拍照文件
    savePhotoUploadFile(data) {
        let photoPathsList = this.data.photoPaths;
        photoPathsList.push(data);

        this.setData({
            photoPaths: photoPathsList
        });
    },
    // 储存上传的音频文件
    saveRecordUploadFile(data) {
        this.setData({
            recorderPaths: data
        });
    },
    // 储存上传的音频文件
    saveVideoUploadFile(data) {
        this.setData({
            videoPaths: data
        });
    },
    // 上传文件
    uploadFile(type, filePath) {
        wx.showLoading({
            title: "文件上传中...",
            mask: true
        });
        app.api
            .uploadFile(filePath)
            .then(res => {
                wx.hideLoading();
                if (type === 0) {
                    this.savePhotoUploadFile(res.data);
                } else if (type === 1) {
                    this.saveRecordUploadFile(res.data);
                } else {
                    this.saveVideoUploadFile(res.data);
                }
            })
            .catch(_err => {
                wx.hideLoading();
            });
    },
    // 执行计划
    sendExecutionPlan() {
        let photoPaths = [];
        this.data.photoPaths.forEach(element => {
            photoPaths.push(element.file);
        });
        photoPaths = photoPaths.join();
        let check_result = [];
        this.data.info.item_list.forEach(element => {
            check_result.push(element.select);
        });
        check_result = check_result.join();
        let sendData = {
            id: this.data.line.id, //巡检ID
            distance: this.data.distance, //巡检员和巡检点间距
            description: this.data.textarea, //巡检说明
            image: photoPaths, //图片文件
            check_result: check_result, //巡检项完成状态
            mp4: this.data.videoPaths ? this.data.videoPaths.file : "", //视频文件
            video: this.data.recorderPaths ? this.data.recorderPaths.file : "" //录音文件
        };
        // 后台是否需要GPS信息
        if (this.data.info.is_gps === 1) {
            sendData.point_lat = this.data.point_lat;
            sendData.point_lng = this.data.point_lng;
        }
        if (Number(this.data.line.id) === 0) {
            // 无计划巡检
            wx.showLoading({
                title: "正在提交",
                mask: true
            });
            sendData.pid = this.data.info.pid;
            app.api
                .addRecord(sendData)
                .then(res => {
                    wx.hideLoading();
                    wx.showToast({
                        title: res.msg,
                        icon: "success",
                        duration: 2000
                    });
                    setTimeout(() => {
                        wx.navigateBack();
                    }, 2000);
                })
                .catch(_err => wx.hideLoading());
        } else {
            // 有计划的巡检
            wx.showLoading({
                title: "正在提交",
                mask: true
            });
            sendData.code = this.data.info.qrcode;
            app.api
                .executionPlan(sendData)
                .then(res => {
                    wx.hideLoading();
                    wx.showToast({
                        title: res.msg,
                        icon: "success",
                        duration: 2000
                    });
                    setTimeout(() => {
                        wx.navigateBack();
                    }, 2000);
                })
                .catch(_err => wx.hideLoading());
        }
    },
    // 点击执行计划按钮
    clickExecutionPlan() {
        let that = this;
        // 判断巡检计划是否选择
        if (!this.data.line.id) {
            this.switchAction();
            return;
        }
        // 判断是否需要GPS数据
        if (this.data.info.is_gps === 1) {
            // GPS数据是否为空
            if (!this.data.point_lat || !this.data.point_lng) {
                this.getLocation();
                return;
            }
        }
        wx.showModal({
            title: "提示",
            content: "请确认巡检完毕",
            success(res) {
                if (res.confirm) {
                    that.sendExecutionPlan();
                }
            }
        });
    }
});

const baseUrl = "https://wookong.net.cn/index.php/index/";

function get(url, sendData = {}, needOpenId = true) {
    // if (needOpenId) sendData.openid = wx.getStorageSync("openid");
    if (needOpenId) sendData.openid = "o3ca05CbufkxvzPXkeJcNDIUXODY";
    // if (needOpenId) sendData.openid = "o3ca05JbIk0ZADvabWLydPjKZNRo";
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseUrl + url,
            method: sendData ? "POST" : "GET",
            data: sendData,
            header: {
                "content-type": "application/json"
            },
            success(res) {
                if (res.data.status === 1 || res.data.status === -1) {
                    resolve(res.data);
                } else {
                    wx.showToast({
                        title: res.data.msg || "未知错误",
                        mask: true,
                        icon: "none",
                        duration: 2000
                    });
                    setTimeout(() => {
                        reject(res.data);
                    }, 2000);
                }
            },
            fail(err) {
                reject(err);
            }
        });
    });
}

function uploadFile(url, filePath) {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: baseUrl + url, // 仅为示例，非真实的接口地址
            header: {
                "content-type": "multipart/form-data" // 默认值
            },
            filePath: filePath,
            name: "file",
            success(res) {
                if (res.statusCode === 200) {
                    res.data = JSON.parse(res.data);
                    if (res.data.status === 1 || res.data.status === -1) {
                        resolve(res.data);
                    } else {
                        wx.showToast({
                            title: res.data.msg || "未知错误",
                            mask: true,
                            icon: "none",
                            duration: 2000
                        });
                        setTimeout(() => {
                            reject(res.data);
                        }, 2000);
                    }
                } else {
                    wx.showToast({
                        title: "未知错误",
                        mask: true,
                        icon: "none",
                        duration: 2000
                    });
                    setTimeout(() => {
                        reject();
                    }, 2000);
                }
            },
            fail(err) {
                reject(err);
            }
        });
    });
}

export { get, uploadFile };

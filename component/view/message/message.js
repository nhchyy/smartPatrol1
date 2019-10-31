// component/view/message/message.js
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        msgList: [],
        totalpage: 1
    },
    pageLifetimes: {
        // 页面被展示
        // show() {
        //     this.getData();
        // }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getData() {
            let that = this;
            app.api.getMsg().then(res => {
                that.setData({
                    msgList: res.data.result || [],
                    totalpage: res.data.totalpage || 1
                });
            });
        },
        toPage(e) {
            let id = e.currentTarget.dataset.id
            wx.navigateTo({
                url: `/pages/message/details/index?id=${id}`
            });
        }
    }
});

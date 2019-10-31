// component/view/home/home.js
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
        welcome: "",
        plan: {
            today: 0,
            ok: 0
        }
    },
    pageLifetimes: {
        // 页面被展示
        show() {
            this.getData();
        }
    },
    methods: {
        getData() {
            let that = this;
            app.api.getIndexData().then(res => {
                that.setData({
                    plan: res.data.plan,
                    welcome: res.data.welcome
                });
            });
        },
        toPage(e) {
            let url = e.currentTarget.dataset.url;
            wx.navigateTo({
                url: url
            });
        }
    }
});

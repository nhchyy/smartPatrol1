// pages/plan/calendar/index.js
const app = getApp();
import initCalendar, {
    setTodoLabels
} from "../../../component/calendar/main.js";
Page({
    data: {
        tips: [
            {
                text: "正常",
                color: "#88d2ac",
                num: 0
            },
            {
                text: "漏检",
                color: "#ff976a",
                num: 0
            },
            {
                text: "异常",
                color: "#f44",
                num: 0
            }
        ]
    },
    onLoad: function(options) {
        let that = this;
        wx.showLoading({
            title: "加载中"
        });
        /**
         * @description: 日历组件初始化
         */
        initCalendar({
            /**
             * 当改变月份时触发
             * @param { object } current 当前年月
             * @param { object } next 切换后的年月
             */
            whenChangeMonth(_current, next) {
                let sendData = {
                    month: `${next.year}${
                        next.month < 10 ? "0" + next.month : next.month
                    }`
                };
                that.getMyDate(sendData);
            },
            onTapDay(currentSelect) {
                wx.navigateTo({
                    url: `/pages/plan/history/list/index?day=${
                        currentSelect.year
                    }-${currentSelect.month}-${currentSelect.day}`,
                    success: result => {},
                    fail: () => {},
                    complete: () => {}
                });
            }
        });
    },
    onShow: function() {
        this.getMyDate();
    },
    /**
     * @description: 设置标记点
     * @param {Array} dayArr 需要标注的日期
     */
    setTodoLabels(dayArr) {
        setTodoLabels({
            // 待办点标记设置
            circle: true,
            days: dayArr
        });
    },
    /**
     * @description: 获取巡检日历数据
     * @param {object}  sendData 默认为空
     * sendData.month 请求对应的月份
     */
    getMyDate(sendData = {}) {
        let that = this;
        app.api
            .getMyDate(sendData)
            .then(res => {
                wx.hideLoading();
                let dayArr = [];
                res.data.retult.forEach(date => {
                    /**
                     * date.status=-1 => 1：异常
                     * date.status=0 => 空白
                     * date.status=1 => 1：正常
                     * date.status=2 => 漏检
                     */
                    if (date.status !== 0) {
                        let newDate = date.date.split("-");
                        let obj = {
                            year: Number(newDate[0]),
                            month: Number(newDate[1]),
                            day: Number(newDate[2]),
                            type:
                                date.status === 1
                                    ? 0
                                    : date.status === 2
                                    ? 1
                                    : 2
                        };
                        dayArr.push(obj);
                    }
                });
                // 判断标记数组是否为空，为空跳过标记
                if (dayArr.length !== 0) {
                    this.setTodoLabels(dayArr);
                }
                let tips = that.data.tips;
                tips[0].num = res.data.totalok;
                tips[1].num = res.data.totalmiss;
                tips[2].num = res.data.totalyc;
                that.setData({
                    tips: tips
                });
            })
            .catch(wx.hideLoading());
    }
});

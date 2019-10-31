// component/view/task/task.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  pageLifetimes: {
    show() {
      // 页面被展示
      let that = this;
      app.api
        .getMyTask()
        .then(res => {
          let list = res.data.result;
          let taskList = that.data.taskList;
          list.forEach((num, index) => {
            taskList[index].completed = num;
          });
          that.setData({
            all: res.data.total,
            taskList: taskList
          });
        })
        
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    all: 0,
    taskList: [{
        title: "处理中",
        color: "#157EFB",
        completed: 0
      },
      {
        title: "已超时",
        color: "#FF2D55",
        completed: 0
      },
      {
        title: "已完成",
        color: "#5856D6",
        completed: 0
      },
      {
        title: "已取消",
        color: "#333333",
        completed: 0
      }
    ]
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toTaskList(e) {
      let status = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/task/list/index?status=${status}`
      });
    }
  }
});
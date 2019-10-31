// component/progress/index.js
let app = getApp();
let interval;
let varName;

Component({
    properties: {
        // 总条数
        all: {
            type: Number,
            value: 0
        },
        // 已完成
        completed: {
            type: Number,
            value: 0
        },
        // 数据展示类型
        type: {
            type: Number,
            value: 0
        },
        // 颜色
        color: {
            type: String,
            value: "#335fda"
        }
    },
    data: {
        percentage: 0
    },
    // 监听数据变化
    observers: {
        "all, completed": function() {
            this.drawCir();
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        drawCir: function() {
            this.setData({
                percentage:
                    this.data.completed !== 0
                        ? ((this.data.completed / this.data.all) * 100).toFixed(
                              0
                          )
                        : 0
            });
            var cxt_arc = wx.createCanvasContext("canvasCircle", this);
            cxt_arc.setLineWidth(6);
            cxt_arc.setStrokeStyle("#eaeaea");
            cxt_arc.setLineCap("round");
            cxt_arc.beginPath();
            cxt_arc.arc(50, 50, 46, 0, 2 * Math.PI, false);
            cxt_arc.stroke();
            cxt_arc.draw();
            if (this.data.completed !== 0) this.drawCircle();
        },
        drawArc: function(s, e) {
            let ctx = wx.createCanvasContext("canvasArcCir", this);
            ctx.setFillStyle("white");
            ctx.clearRect(0, 0, 100, 100);
            ctx.draw();
            var x = 50,
                y = 50,
                radius = 46;
            ctx.setLineWidth(5);
            ctx.setStrokeStyle(this.data.color);
            ctx.setLineCap("round");
            ctx.beginPath();
            ctx.arc(x, y, radius, s, e, false);
            ctx.stroke();
            ctx.draw();
        },
        drawCircle: function() {
            let startAngle = 1.5 * Math.PI;
            let endAngle = (1.5 + (2 * this.data.percentage) / 100) * Math.PI;
            this.drawArc(startAngle, endAngle);
        }
    }
});

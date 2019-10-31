const request = require("./request.js");

// 用户获取令牌（登录）
function getOpenId(sendData) {
    let url = "wx/getopenid";
    return request.get(url, sendData, false);
}

// 用户注册
function userLogin() {
    let url = "wx/login";
    return request.get(url);
}

// 用户注册
function registered(sendData) {
    let url = "wx/regin";
    return request.get(url, sendData);
}

// 主页
function getIndexData() {
    let url = "wx/index";
    return request.get(url);
}

// 巡检日历
function getMyDate(sendData) {
    let url = "wx/mydate";
    return request.get(url, sendData);
}

// 执行计划列表
function getMyPlan(sendData) {
    let url = "wx/planexecute";
    return request.get(url, sendData);
}

// 执行计划详情
function getMyPlanDetails(sendData) {
    let url = "wx/plandetail";
    return request.get(url, sendData);
}

// 执行详情的点详情
function getMyPlanExecutDetails(sendData) {
    let url = "wx/planexecutedetail";
    return request.get(url, sendData);
}

// 巡检记录
function getMyPlanRecord(sendData) {
    let url = "wx/planrecord";
    return request.get(url, sendData);
}

// 执行巡检列表任务
function executionPlan(sendData) {
    let url = "wx/updateplanexecute";
    return request.get(url, sendData);
}

// 执行首页扫码任务
function addRecord(sendData) {
    let url = "wx/addrecord";
    return request.get(url, sendData);
}

// 我的任务
function getMyTask() {
    // 返回参数说明0处理中，1已超时，2完成，3取消状态
    let url = "wx/mytask";
    return request.get(url);
}

// 我的任务-列表
function getMyTaskList(sendData) {
    let url = "wx/tasklist";
    return request.get(url, sendData);
}

// 我的任务-详情
function getMyTaskDetails(sendData) {
    let url = "wx/taskdetail";
    return request.get(url, sendData);
}

// 我的任务-执行
function myTaskComplete(sendData) {
    let url = "wx/tastedit";
    return request.get(url, sendData);
}

// 扫码
function sendScanCode(sendData) {
    let url = "wx/getpoint";
    return request.get(url, sendData);
}

// 修改个人信息
function editUserInfo(sendData) {
    let url = "wx/editinfo";
    return request.get(url, sendData);
}

// 上传文件
function uploadFile(filePath) {
    let url = "wx/upfile";
    return request.uploadFile(url, filePath);
}

// 我的消息
function getMsg() {
    // 返回参数说明0处理中，1已超时，2完成，3取消状态
    let url = "wx/msg";
    return request.get(url);
}

// 我的消息详情
function getMsgDetail(sendData) {
    // 返回参数说明0处理中，1已超时，2完成，3取消状态
    let url = "wx/msgdetail";
    return request.get(url, sendData);
}

export {
    getOpenId,
    userLogin,
    registered,
    getIndexData,
    getMyDate,
    getMyPlan,
    getMyPlanDetails,
    getMyPlanExecutDetails,
    getMyPlanRecord,
    executionPlan,
    addRecord,
    getMyTask,
    getMyTaskList,
    getMyTaskDetails,
    myTaskComplete,
    sendScanCode,
    editUserInfo,
    uploadFile,
    getMsg,
    getMsgDetail
};

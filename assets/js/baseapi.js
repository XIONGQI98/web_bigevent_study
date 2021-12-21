// 简化每次调用$.ajax时的对url根路径的省略
$.ajaxPrefilter(function (options) {
    // 在真正发起ajax请求前，修改为完整的路径
    options.url = `http://api-breakingnews-web.itheima.net${options.url}`

    // 统一为有权限的接口，设置请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载complete 函数
    options.complete = function (res) {
        // 阻止用户不登录账户，直接访问index文件,
        // console.log(res);
        // 判断状态码，查看是否成功拿到服务器返回的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空token
            localStorage.removeItem('token');
            // 2.强制返回登录页面
            return location.href = '/blackhorse/U4前后端交互/03.大事件后台管理系统/login.html';
        }
    }


})
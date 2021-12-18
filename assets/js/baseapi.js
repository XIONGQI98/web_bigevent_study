// 简化每次调用$.ajax时的对url根路径的省略
$.ajaxPrefilter(
    function (options) {
        // 在真正发起ajax请求前，修改为完整的路径
        options.url = `http://api-breakingnews-web.itheima.net${options.url}`
    }
)
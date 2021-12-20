// 写入口函数
$(function () {
    // 获取用户基本信息
    getUserInfo();




    let layer = layui.layer;
    // 设置点击退出事件
    $('#btnLogout').on('click', function () {
        // 设置layui中的退出框
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            /**
             * 点击确认，返回登录页面
             *   1.清空本地存储中的 token
             *   2.重新跳转到登录页面
             * **/
            localStorage.removeItem('token');
            location.href = '/blackhorse/U4前后端交互/03.大事件后台管理系统/login.html';
            // 关闭弹出框
            layer.close(index);
        })
    })
})

// 获取用户基本信息
function getUserInfo() {
    // 发起ajax请求
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // // 配置请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // 判断是否获取成功
            if (res.status !== 0) {
                return layui.layer.msg('获取用户基本信息失败');
            }
            // 渲染用户头像
            renderAvatar(res.data);
        },
        // // 阻止用户不登录账户，直接访问index文件,
        // complete: function (res) {
        //     console.log(res);
        //     // 判断状态码，查看是否成功拿到服务器返回的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空token
        //          localStorage.removeItem('token');
        //         // 2.强制返回登录页面
        //         return location.href = '/blackhorse/U4前后端交互/03.大事件后台管理系统/login.html';
        //     }
        // }
    })
}
// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户名
    let name = user.nickname || user.username;
    // 2.设置 欢迎处的 名字
    $('#welcome').html(`欢迎&nbsp&nbsp${name}`);
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1渲染用户设置的头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        // 隐藏文本头像
        $('.text-avatar').hide();
    } else {
        // 3.2渲染默认文本头像
        // 隐藏用户头像
        $('.layui-nav-img').hide();
        // 渲染文本头像
        let first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }

}
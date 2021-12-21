$(function () {
    // 导入form
    let form = layui.form;
    let layer = layui.layer;

    // 设置输入限制
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间';
            }
        }
    })

    // 调用方法
    initUserInfo();
    // 初始化用户基本信息
    function initUserInfo() {
        // 发起请求
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                }
                console.log(res);
                // 利用layui插件快速给form表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单数据
    $('#btnReset').on('click', function (e) {
        // 阻止默认表单的重置行为
        e.preventDefault();
        // 调用函数重置
        initUserInfo();
    })

    // 监听表单的提交事件，并发起请求
    $(".layui-form").on('submit', function (e) {
        // 阻止默认表单的提交行为
        e.preventDefault();
        // 发起请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败!')
                }
                layer.msg('更新用户信息成功!')
                // 调用父页面中的方法，重新渲染用户的头像与信息
                window.parent.getUserInfo()
            }
        })
    })




})
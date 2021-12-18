$(function () {
    /**
     * 实现交互（点击切换视图）
     *   1.点击注册账号，
     *   2.隐藏当前视图，
     *   3.切出注册视图
     * **/

    // 1.点击注册账号链接
    // 获取元素
    let link_reg = document.getElementById('link_reg');
    let ling_login = document.getElementById('ling_login');

    // 绑定 登录 点击事件
    link_reg.onclick = function () {
        // 隐藏登录盒子
        $('.login-box').hide();
        // 显示注册盒子
        $('.reg-box').show();
    }
    // 绑定 注册 点击事件
    ling_login.onclick = function () {
        // 隐藏登录盒子
        $('.login-box').show();
        // 显示注册盒子
        $('.reg-box').hide();
    }


    // 从layui中获取 form对象
    let form = layui.form;
    let layer = layui.layer;
    // let urlR = 'http://api-breakingnews-web.itheima.net';

    // 通过 form.verify()函数 自定义校验规则
    form.verify({
        // 自定义了一个 pwd规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是 再次确认密码框 中的内容
            let pwd = $('.reg-box [name=password]').val()
            // 还要拿到 密码框 中的内容
            // 进行全等判定，提示消息
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    })


    // 监听注册表单的提交事件
    $('#form_reg').on('submit', e => {
        // 阻止表单提交的默认行为
        e.preventDefault();
        // 发起ajax的POST请求
        let data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        };
        $.post(
            '/api/reguser',
            data,
            res => {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，阔以登录');
                // 实现注册成功 自动跳转
                $('#ling_login').click();
            }
        )
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        // 阻止表单提交的默认行为
        e.preventDefault();
        // 发起Ajax请求
        $.ajax({
            url: "/api/login",
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功');
                // 将登录成功得到的字符串保存到localStorage中
                localStorage.setItem('token', res.token)
                // console.log(localStorage);
                // 跳转到后台主页
                location.href = './index.html';
            }
        })
    })











})

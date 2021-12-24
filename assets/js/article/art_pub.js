$(function () {
    let layer = layui.layer;
    let form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor();


    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要记得调用form.render方法，渲染数据
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮，绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听 coverFile 的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取文件的列表数组
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) return;
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })


    // 定义文章的发布状态
    let art_state = '已发布';

    // 为 存为草稿按钮，绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿';

    })

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 1.基于form表单，快速创建一个formData对象
        let fd = new FormData($(this)[0]);
        // 2.将文章的发布状态，存到fd中
        fd.append('state', art_state)
        // 3.将裁剪过后的封面图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 4.将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 5.发起ajax请求
                publishArticle(fd);
            })
    })
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据
            // 必须添加以下配置项
            contentType: false,
            processData: false,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！。!')
                }
                layer.msg('发布文章成功！。!')
                // 发布文章成功后跳转到文章列表页面
                location.href = './art_list.html'
            }
        })
    }

})
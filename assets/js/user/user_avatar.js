$(function () {
    // 导入layui
    let layer = layui.layer;


    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 绑定点击事件，显示上传文件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    // 默认图片更换成上传的图片
    $('#file').on('change', e => {
        // 接收文件
        let filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择照片~。~')
        }

        // 1.拿到用户的文件
        var file = e.target.files[0];
        // 2.根据选择的文件，创建一个对应的 URL 地址：
        var imgURL = URL.createObjectURL(file);
        // 3.重新初始化图片区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 为确定按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        // 1.获取裁剪后的图片
        var dataURL = $image
            // 创建一个 Canvas 画布
            .cropper('getCroppedCanvas', {
                width: 100,
                height: 100
            })
            // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            .toDataURL('image/png');
        // 2.调用接口，上传图片
        $.ajax({
            url: '/my/update/avatar',
            method: 'POST',
            data: { avatar: dataURL },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败waw')
                }
                layer.msg('更换头像成功waw')
                // 重新渲染头像，需要调用父页面的方法
                window.parent.getUserInfo()
            }


        })
    })

})
$(function () {
    let form = layui.form;
    let layer = layui.layer;
    let laypage = layui.laypage;

    // 美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());
        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());
        return `${y}-${m}-${d} ${hh}-${mm}-${ss}`;
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : `0${n}`;
    }

    // 定义一个查询对象，可提交到服务器
    let q = {
        pagenum: 1,      //页码值，默认第一页
        pagesize: 2,     //每页显示几条数据，默认2条
        cate_id: '',     //文章分类的id
        state: ''        //文章的发布状态
    };

    // 调用方法
    initTable();
    initCate();

    // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res);
                console.log('initTable()', res);
                $('tbody').html(htmlStr)
                // form.render()
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //   通过layui重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定 submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        // 为查询对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件,重新渲染表单
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        console.log('total', total, typeof total);
        // 调用laypage方法,渲染分页结构
        laypage.render({
            elem: 'pageBox',    // 分页容器的ID
            count: total,       // 总数据条数
            limit: q.pagesize,  // 每页显示几条数据
            curr: q.pagenum,    // 设置默认显示第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 8],
            //  分页发生切换的时候，触发回调
            /*
            触发jump的方式
                1.点击页码触发
                2.调用laypage.render()时触发
            */
            jump: function (obj, first) {
                console.log(first);
                console.log(obj.curr, obj.limit);
                // 把最新的页码值赋值到 q
                q.pagenum = obj.curr;
                // 把最新的条目数赋值到 q
                q.pagesize = obj.limit;
                // 根据最新的 q 获取对应的数据列表 并渲染表格
                // initTable();//死循环
                if (!first) {
                    initTable();
                }
            }
        })
    }


    // 通过代理的形式，为 btn-edit 按钮绑定点击事件
    let indexEdit = null;
    $('tbody').on('click', '.btn-add', function () {
        console.log('ok');

    })



    // 通过代理的方式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        let len = $('.btn-delete').length;
        // 获取到文章的id
        let id = $(this).attr('data-id');
        // 询问是否删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: `/my/article/delete/${id}`,
                success: res => {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前页中 是否还有数据，没有则 -1
                    if (len === 1) {
                        // len = 1 时，证明页面删除完毕后，没有数据了
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })

})
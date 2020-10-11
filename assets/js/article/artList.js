$(function () {
    // 为atr-template定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr);
        var y = addZero(dt.getFullYear());
        var m = addZero(dt.getMonth() + 1);
        var d = addZero(dt.getDate());

        var hh = addZero(dt.getHours());
        var mm = addZero(dt.getMinutes());
        var ss = addZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ":" + ss
    }

    function addZero(n) {
        return n > 9 ? n : "0" + n
    }

    var layer = layui.layer;
    var q = {
        pagenum: 1,   //是	int	    页码值
        pagesize: 2,  //是	int	    每页显示多少条数据
        cate_id: "",  //否	string	文章分类的 Id
        state: "",    //否	string	文章的状态，可选值有：已发布、草稿
    }

    initList()
    function initList() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);
                var str = template("tplList", res)
                $('tbody').html(str)
                renderPage(res.total)
            }
        })
    }

    var form = layui.form;
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: "/my/article/cates",
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template("tplCate", res);
                $('[name="cate_id"]').html(htmlStr);
                form.render();
            }
        })
    }

    $("#formSearch").on('submit', function (e) {
        e.preventDefault();
        var cateid = $('[name="cate_id"]').val()
        var states = $('[name="state"]').val()
        q.cate_id = cateid;
        q.state = states
        initList()
    })

    var laypage = layui.laypage;
    function renderPage(total) {
        // console.log(total);
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox',//注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            limits: [2, 3, 5, 10],

            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                q.pagenum = obj.curr;
                // console.log(obj.limit); //得到每页显示的条数
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    //do something
                    initList()
                }
            },

        });

    }

    $('tbody').on('click', '#btnDelete', function () {
        var Id = $(this).attr("data-id");
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: "/my/article/delete/" + Id,
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    if ($("#btnDelete").length == 1 && q.pagenum > 1) {
                        q.pagenum--
                    }
                    initList()

                }

            })
            layer.close(index);
        });
    })
})
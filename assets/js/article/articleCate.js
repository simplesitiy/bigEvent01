$(function () {
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            url: "/my/article/cates",
            success: function (res) {
                var str = template("tpl-table", res)
                $("tbody").html(str)
            }
        })
    }

    var layer = layui.layer;
    var indexAdd = null;

    $("#btnAddBtn").on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类'
            , content: $("#tplAdd").html(),
            area: ['500px', '250px']
        });

    })

    $("body").on('submit', "#formAdd", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg("添加成功")
                layer.close(indexAdd)
            }
        })
    })

    var form = layui.form;
    $("tbody").on('click', "#btnEdit", function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类'
            , content: $("#tplEdit").html(),
            area: ['500px', '250px']
        });

        var Id = $(this).attr("data-id");
        // console.log(Id);
        $.ajax({
            method: 'GET',
            url: "/my/article/cates/" + Id,
            success: function (res) {
                form.val("form-edit", res.data)
            }
        })
    })

    $("body").on('submit', "#formEdit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg("更新成功")
                layer.close(indexEdit)
            }
        })
    })

    // shanchu
    $("tbody").on('click', "#btnDelete", function () {
        var id = $(this).attr("data-id");
        // console.log(id);
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList();
                    layer.msg("删除成功")
                }
            })

            layer.close(index);
        });

    })
})
$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initCate()
    // 初始化富文本编辑器
    initEditor()
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
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $("#btnChoose").on('click', function (e) {
        e.preventDefault();
        $("#file").click()
    })
    $("#file").on("change", function (e) {
        var files = e.target.files;
        if (files.length == 0) {
            return layer.msg("未选择头像")
        }
        // 1. 拿到用户选择的文件

        var file = e.target.files[0]

        // 2. 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)

        // 3. 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：

        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域


    })

    var initStatus = "已发布"
    $("#sureBtn").on("click", function () {
        initStatus = "草稿"
    })

    $("#formPub").on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(this);
        fd.append("state", initStatus);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append("cover_img", blob)
                // console.log(...fd);
                publishArticle(fd)
            })

    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: "/my/article/add",
            contentType: false,
            processData: false,
            data: fd,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                setTimeout(function () {
                    window.parent.document.getElementById("articleLList").click()

                }, 1000)
            }
        })
    }



})


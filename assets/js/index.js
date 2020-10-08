$(function () {
    getUserinof();

    // 退出
    $("#btnLoginOut").on('click', function () {
        var layer = layui.layer;

        layer.confirm('确定退出吗', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('token');
            location.href = "/login.html"
            layer.close(index);
        });
        // console.log(123);
    })

})




// 获取信息
function getUserinof() {
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            renderAvater(res.data)
        },
        // complete: function (res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         localStorage.removeItem('token');
        //         location.href = "/login.html"
        //     }
        // }
    })
}

// 渲染头像
function renderAvater(user) {
    var userName = user.nickname || user.username;

    $(".welcome").html("欢迎&nbsp;&nbsp" + userName);
    if (user.user_pic !== null) {
        $(".layui-nav-img").show().attr('src', user.user_pic)
        $(".userAvatar").hide();
    } else {
        $(".layui-nav-img").hide()
        var text = userName[0].toUpperCase();
        $(".userAvatar").show().html(text);
    }
}
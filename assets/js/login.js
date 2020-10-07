$(function () {
    $('#linkReg').on('click', function () {
        $('.login').hide()
        $('.reg').show()
    })
    $('#linkLogin').on('click', function () {
        $('.reg').hide()
        $('.login').show()
    })

    // 验证
    var form = layui.form;
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repass: function (value) {
            var pwd = $(".reg [name=password]").val()
            if (value !== pwd) {
                return "两次密码不一致"
            }
        }
    })
    // 注册
    $("#formReg").submit(function (e) {
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            method: 'post',
            url: "/api/reguser",
            data: {
                username: $(".reg [name=username]").val(),
                password: $(".reg [name=password]").val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("成功");
                $('#linkLogin').click()
            }

        })
    })

    // 登录
    $("#formLogin").submit(function (e) {
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            method: 'post',
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("成功");
                console.log(res.token);
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }

        })
    })
})
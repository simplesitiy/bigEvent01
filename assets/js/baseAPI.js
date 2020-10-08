var baseUrl = 'http://ajax.frontend.itheima.net';
// 拦截所有的ajax请求，$.get , $.post , $.ajax
// 处理参数
$.ajaxPrefilter(function (params) {
    // 拼接对应环境的服务器地址
    params.url = baseUrl + params.url;
    if (params.url.indexOf("/my/") !== -1) {
        params.headers = {

            Authorization: localStorage.getItem('token') || ''
        }
    }

    params.complete = function (res) {
        console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            localStorage.removeItem('token');
            location.href = "/login.html"
        }
    }
})
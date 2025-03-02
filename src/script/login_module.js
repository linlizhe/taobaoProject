define(['sha1', 'public2007', '../../fonts/icon_projectTaobao/iconfont'], function (sha1, public2007) {
    return {
        init: function () {
            //1.网页头部右边文字_鼠标悬停改变颜色
            $('#header .right a').hover(function () {
                $(this).css({ color: '#ff6200' })
            }, function () {
                $(this).css({ color: 'rgb(102, 102, 102)' })
            });

            //2.账号密码input_鼠标悬停改变背景颜色
            $('input[type="text"]').hover(function () {
                $(this).css({ 'background-color': 'rgba(0, 0, 0, .1)' });
            }, function () {
                if ($(this)[0] === document.activeElement) {
                    return
                } else {
                    $(this).css({ 'background-color': '#f3f6f8' });
                }
            });

            //3.账号密码input_获得焦点时改变颜色
            $('input[type="text"]').on('focus', function () {
                $(this).css({ 'background-color': 'rgba(0, 0, 0, .1)' });
            });
            $('input[type="text"]').on('blur', function () {
                $(this).css({ 'background-color': '#f3f6f8' });
            });


            //4.点击登入的效果.
            let $btn_login = $('.loginBtn'); //登入按钮
            let $input_userName = $('.username'); //用户名文本框
            let $input_password = $('.password'); //密码文本框

            $btn_login.on('click', function () {
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost/taobao/php/login.php',
                    dataType: 'json',
                    data: {
                        user: $input_userName.val(),
                        pass: hex_sha1($input_password.val())
                    }
                }).done((data) => {
                    if (!data) {
                        alert('用户名或者密码错误');
                    } else {
                        location.href = 'index.html';
                        public2007.cookie.set('username', $input_userName.val(), 7);
                    }
                })
            })
        }
    }
})
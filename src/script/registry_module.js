define(['../../fonts/icon_projectTaobao/iconfont'], function () {
    return {
        init: function () {

            //一.网页头部的效果
            //1.鼠标悬停改变颜色.
            let $liAll = $('#header .siteNav li');//网页头的所有li.
            $liAll.not('.li1').hover(function () {
                $(this).css({ color: 'rgb(255, 80, 0)' });
            }, function () {
                $(this).css({ color: '#000' });
            });
            //第一个li特殊, 只能做 鼠标悬停第一个Li里的a时改颜色.
            let $a_li1 = $('#header .li1 a'); //第一个li里的2个a.
            $a_li1.not('.A_color').hover(function () {
                $(this).css({ color: 'rgb(255, 80, 0)' });
            }, function () {
                $(this).css({ color: '#000' });
            });

            //2.宽度自适应.
            let $header = $('#header'); //网页头部最大容器.
            let $siteNav = $('#header .siteNav'); //网页头部最大容器.

            $(window).on('resize', function () {
                if ($header.width() > 1379) {
                    $siteNav.css({ padding: '0 80px' })

                } else {
                    $siteNav.css({ padding: '0 48px' })
                }
            })

            //二.网页尾部效果
            //尾部有悬浮改变颜色的效果, 这里就不做了.

            //三.表单效果
            //1.勾选协议的效果.
            let $checkProtocol = $('.protocolWrap .checkbox');//勾选框.
            $checkProtocol.on('click', function () {
                if ($(this).prop('checked') == true) {
                    $(this).css({ opacity: 0 });
                } else {
                    $(this).css({ opacity: 1 });
                }
            });

            //2.表单正则.
            let username = document.querySelector('.username');
            let telphone = document.querySelector('.telphone');
            let cartid = document.querySelector('.cartid');
            let email = document.querySelector('.email');
            let password = document.querySelector('.password');
            let form = document.querySelector('#registryForm');
            let tip = document.querySelectorAll('#registryForm span');

            let userflag = true;
            let telflag = true;
            let cartflag = true;
            let emailflag = true;
            let passflag = true;

            //1.用户名: 可输入 中英文, 中文是2个字符 英文是1个 总共不能超过14个;
            username.onfocus = function () {
                tip[0].innerHTML = '请输入14个以内的字符';
                tip[0].style.color = 'black';
            }
            username.onblur = function () {
                if (username.value !== '') {
                    var strlen = username.value.replace(/[\u4e00-\u9fa5]/g, '**').length;
                    var reg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
                    if (strlen <= 14) {
                        if (reg.test(username.value)) {
                            tip[0].innerHTML = '√';
                            tip[0].style.color = 'green';
                            var userflag = true;
                        } else {
                            tip[0].innerHTML = '请输入英文或汉字';
                            tip[0].style.color = 'red';
                            var userflag = false;
                        }
                    } else {
                        tip[0].innerHTML = '字符数不能超过14个';
                        tip[0].style.color = 'red';
                        var userflag = false;
                    }
                } else {
                    tip[0].innerHTML = '用户名不能为空';
                    tip[0].style.color = 'red';
                    var userflag = false;
                }
            }

            //2.手机号验证: 11位数字, 跟每个地区的区号有关, 这里就简单做一个reg就行了;
            telphone.onfocus = function () {
                tip[1].innerHTML = '请输入手机号码';
                tip[1].style.color = 'black';
            }
            telphone.onblur = function () {
                if (telphone.value !== '') {
                    var reg = /^1[3456789]\d{9}$/;
                    if (reg.test(telphone.value)) {
                        tip[1].innerHTML = '√';
                        tip[1].style.color = 'green';
                        telflag = true;
                    } else {
                        tip[1].innerHTML = '格式错误';
                        tip[1].style.color = 'red';
                        telflag = false;
                    }
                } else {
                    tip[1].innerHTML = '不能为空';
                    tip[1].style.color = 'red';
                    telflag = false;
                }

            }

            //3.身份证验证: 共18位数, 前6位随机, 4位是年, 2位是月, 2位是第几号, 最后随机3个数字 和大小写的x;
            cartid.onfocus = function () {
                tip[2].innerHTML = '请输入身份证号码';
                tip[2].style.color = 'black';
            }
            cartid.onblur = function () {
                if (cartid.value !== '') {
                    var reg = /^\d{6}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])\d{3}(\d|x|X)$/;
                    if (reg.test(cartid.value)) {
                        tip[2].innerHTML = '√';
                        tip[2].style.color = 'green';
                        telflag = true;
                    } else {
                        tip[2].innerHTML = '格式错误';
                        tip[2].style.color = 'red';
                        telflag = false;
                    }
                } else {
                    tip[2].innerHTML = '内容不能为空';
                    tip[2].style.color = 'red';
                    telflag = false;
                }
            }

            //4.邮箱验证: ("^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$")；
            email.onfocus = function () {
                tip[3].innerHTML = '请输入邮箱';
                tip[3].style.color = 'black';
            }
            email.onblur = function () {
                if (email.value !== '') {
                    var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                    if (reg.test(email.value)) {
                        tip[3].innerHTML = '√';
                        tip[3].style.color = 'green';
                        emailflag = true;
                    } else {
                        tip[3].innerHTML = '格式错误';
                        tip[3].style.color = 'red';
                        emailflag = false;
                    }
                } else {
                    tip[3].innerHTML = '内容不能为空';
                    tip[3].style.color = 'red';
                    emailflag = false;
                }
            }

            //5.密码验证:
            password.onfocus = function () {
                tip[4].innerHTML = '请输入密码';
                tip[4].style.color = 'black';
            }
            password.oninput = function () {
                var reg1 = /\d/g;
                var reg2 = /[a-z]/g;
                var reg3 = /[A-Z]/g;
                var reg4 = /[\w\_]/g;
                var count = 0;
                if (reg1.test(password.value)) {
                    count++;
                }
                if (reg2.test(password.value)) {
                    count++;
                }
                if (reg3.test(password.value)) {
                    count++;
                }
                if (reg4.test(password.value)) {
                    count++;
                }
                switch (count) {
                    case 1:
                        tip[4].innerHTML = '弱';
                        passflag = false;
                        break;
                    case 2:
                    case 3:
                        tip[4].innerHTML = '中';
                        passflag = true;
                        break;
                    case 4:
                        tip[4].innerHTML = '强';
                        passflag = true;
                        break;
                }
            }
            password.onblur = function () {
                if (password.value !== '') {
                    if (passflag) {
                        tip[4].innerHTML = '√';
                        tip[4].style.color = 'green';
                    }
                } else {
                    tip[4].innerHTML = '内容不能为空';
                    tip[4].style.color = 'red';
                }
            }
            //6.点击提交按钮时 有输入内容的 输入框失去焦点, 若输入的内容格式有问题 就会出现对应提示, 
            //但没有输入内容的输入框 就没有获得过焦点, 内容为空, 但这些输入框 因为没有获得过焦点, 
            //所以 点击提交按钮时 这些输入框 也就不会有 失去焦点 这一步, 那么 内容不能为空的提示 就不会出现, 最终结果是 跳转到 action里的地址;
            //为了避免这个错误, 点击提交按钮时 要检测 各个输入框 内容是否为空, 若是空的 就出现提示, 
            //并且检测 设定的flag 只要有1个是false 就说明 有错误, 那就阻止 提交的事件;
            form.onsubmit = function () {
                if (username.value === '') {
                    tip[0].innerHTML = '不能为空';
                    tip[0].style.color = 'red';
                    userflag = false;
                }
                if (telphone.value === '') {
                    tip[1].innerHTML = '不能为空';
                    tip[1].style.color = 'red';
                    telflag = false;
                }
                if (cartid.value === '') {
                    tip[2].innerHTML = '不能为空';
                    tip[2].style.color = 'red';
                    cartflag = false;
                }
                if (email.value === '') {
                    tip[3].innerHTML = '不能为空';
                    tip[3].style.color = 'red';
                    emailflag = false;
                }
                if (password.value === '') {
                    tip[4].innerHTML = '不能为空';
                    tip[4].style.color = 'red';
                    passflag = false;
                }
                if (!userflag || !telflag || !cartflag || !emailflag || !passflag) {
                    return false;
                }
            }
        }
    }
})
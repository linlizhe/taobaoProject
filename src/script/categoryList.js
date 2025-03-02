define([], function () {
    return {
        init: function () {
            //鼠标悬停在文字上 改变文字颜色, 改变当前行 背景色, 且出现二级菜单.

            //结构是: 1行是1个li, li里有多个a, a里的是文字, 1个li对应1个二级菜单.
            //当鼠标悬停在 某个li上时, li的背景色改变, 若鼠标悬停在li里的a上, a的文字颜色改变, 出现对应的二级菜单.

            //$oneMenuLi: 分类列表里的所有li
            let $oneMenuLi = $('.mainContent>.left .list>ul li');
            //$twoMenuWrap是所有二级菜单的容器
            let $twoMenuWrap = $('.mainContent .twoMenuWrap');
            //$twoMenu代表 所有二级菜单, 只做了3个二级菜单, 按照顺序放入分类列表中.
            let $twoMenu = $('.mainContent>.left .twoMenu');

            // let $twoMenuA = $('.mainContent .twoMenuWrap a');


            //1.给所有li添加鼠标经过的事件.
            $oneMenuLi.on('mouseover', function (ev) {
                //给li添加类名active, 去掉其他兄弟li的类名.
                $(this).addClass('active').siblings().removeClass('active');
                //获取li的索引, 用这个索引 让对应索引的二级菜单显示, 其他兄弟二级菜单元素隐藏.
                $twoMenu.eq($(this).index()).css({ display: 'flex' }).siblings().css({ display: 'none' });
                //显示二级菜单的容器.
                $twoMenuWrap.show();
                //若鼠标经过a标签, 改变文字颜色.
                if (ev.target.nodeName === 'A') {
                    $(ev.target).addClass('active');
                }
            });

            //2.给所有li添加鼠标移出时的事件.
            $oneMenuLi.on('mouseout', function () {
                //隐藏二级菜单容器.
                $twoMenuWrap.hide();
                //去掉Li和a的类名.
                $(this).removeClass('active').find('a').removeClass('active');
            })

            //3.鼠标移入移出 二级菜单容器，自身显示和隐藏.
            $twoMenuWrap.hover(() => {
                $twoMenuWrap.show();
            }, () => {
                $twoMenuWrap.hide();
            })

            //4.鼠标悬停在二级菜单的某个文字上时, 改变文字颜色
            $twoMenuWrap.on('mouseover', 'a', function () {
                $(this).addClass('active');
            })
            $twoMenuWrap.on('mouseout', 'a', function () {
                $(this).removeClass('active');
            })

            //5.页面滚动条下拉至 不会显示全部二级菜单时, 二级菜单会紧靠页面顶部显示.
            let $search = $('#container #layout #search');

            //滚动条的top
            let $scrollTop = null;
            let $bannerTop = null;

            //定义函数assignTwoMenuTop, 给二级菜单容器赋值top.
            function assignTwoMenuTop() {
                if ($scrollTop > $('#header').outerHeight() + $('#main .headerNav').outerHeight()) {
                    if ($scrollTop < $bannerTop) {
                        //滚动条top值未超过 二级菜单容器的top时, 二级菜单的top就是 搜索框覆盖的部分.
                        $twoMenuWrap.css({
                            top: $scrollTop - $('#header').outerHeight() -
                                $('#main .headerNav').outerHeight() + 1 - 8
                        });

                    } else {
                        //滚动条top值 已超过 二级菜单容器的top, 此时要把二级菜单放在 搜索框的下面.
                        $twoMenuWrap.css({
                            top: $scrollTop - $bannerTop + $search.outerHeight()

                        });
                    }
                } else {
                    $twoMenuWrap.css({
                        top: 0
                    });
                }
            };

            $(window).on('scroll', function () {
                //banner的top值 - 滚动条的top = $cartlist的top值
                $scrollTop = $(window).scrollTop();
                //banner的top值
                $bannerTop = $('#main .mainContent .left').offset().top;
                // 调用函数 给二级菜单容器赋值.
                assignTwoMenuTop();
            })
            //在oncscroll事件外也要调用函数 给二级菜单容器赋值, 防止刷新页面后的问题.
            assignTwoMenuTop();
        }
    }
})

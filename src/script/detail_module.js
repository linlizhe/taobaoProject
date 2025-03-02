define(['public2007', '../../fonts/icon_projectTaobao/iconfont'], function (public2007) {
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
            });

            //二.检测是否有cookie用户名, 若有就登入.
            //1.显示用户名
            let $username = public2007.cookie.get('username');
            if ($username) {
                $('#header li.li_usernameWrap .a_username').show().siblings('a').hide();
                //显示箭头
                $('.li_usernameWrap .icon_arrow').show();
                $('.a_username').html($username);
                $('.userManageWrap span').html($username);
            } else {
                $('.a_username').hide();
                $('.li_usernameWrap .icon_arrow').hide();
            };
            //2.鼠标悬停用户名, 下面显示退出界面.
            $('.li_usernameWrap').hover(function () {
                if ($username) {
                    $('div.userBox').css({ 'display': 'flex' });
                } else {
                    $('div.userBox').hide();
                }
            }, function () {
                $('div.userBox').hide();
            })

            //3.点击退出按钮, 退出当前账户.
            //删除cookie, 恢复用户名li到原样.
            let $quit = $('.userBox a.quit');
            $quit.on('click', function () {
                public2007.cookie.remove('username');
                //隐藏用户名, 显示文字登入和注册.
                $('#header li.li_usernameWrap .a_username').hide().siblings('a').show();
                //隐藏退出界面.
                $('div.userBox').hide();
            });

            //三.搜索的交互效果.
            //1.鼠标悬停时改变边框颜色.
            $('.searchWrap form').hover(function () {
                $(this).css({ 'border-color': '#ff5000' });
            }, function () {
                $(this).css({ 'border-color': '#fff1eb' });
            });

            //2.鼠标悬停在 相机图标上 改变图标颜色.
            $('.searchWrap form .icon_camera').hover(function () {
                $(this).css({ color: '#ff5000' });
            }, function () {
                $(this).css({ color: '#000' });
            });

            //四.从商品列表到商品详情页的 交互效果.
            let $lastArrow = $('.smallPicWrap .btnWrap svg.last');
            let $nextArrow = $('.smallPicWrap .btnWrap svg.next');
            let $ul = $('.smallPicWrap .picList');

            //1.鼠标悬停在箭头上改变箭头颜色.
            $('.smallPicWrap .btnWrap .icon').hover(function () {
                $(this).css({ color: '#ff5000' })
            }, function () {
                $(this).css({ color: 'gray' })
            });

            let $itemName = $('.infoWrap .titleWrap h1');//标题.
            let $itemPrice = $('.infoWrap .priceWrap span.price');//价格
            let datasid = location.search.substring(1).split('=')[1]; //商品sid
            if (!datasid) { //如果sid不存在，设置1
                datasid = 1;
            };
            $.ajax({
                url: 'http://localhost/taobao/php/detail_getItemSid.php',
                data: {
                    sid: datasid
                },
                dataType: 'json'
            }).done((data) => {
                // console.log(data);
                //获取数据, 渲染 小图列表, 商品标题和价格.
                let picListArr = data.piclisturl.split(',');
                let strhtml = '';
                for (let i = 0; i < picListArr.length; i++) {
                    strhtml += `
                    <li>
                        <a href="javascript:;"> 
                            <img src="${picListArr[i]}" alt="">
                        </a>
                    </li>
                    `;
                };
                $ul.html(strhtml);
                $itemName.html(data.title);
                $itemPrice.html(data.price);


                //2.进入页面时上箭头隐藏, 若小图数量<=5的话 下箭头也隐藏.
                let $clickCount = $('.smallPicWrap .picList li').length - 5;
                let flagNext = $clickCount;
                let flagLast = 0;
                if (flagLast === 0) {
                    $lastArrow.hide();
                };
                if (flagNext <= 0) {
                    $nextArrow.hide();
                };

                //3.点击下箭头, 显示下一张图片.
                let $liHeight = $('.smallPicWrap .picList>li:first-child').outerHeight(true);
                $nextArrow.on('click', function () {
                    if (flagNext > 0) {
                        $ul.stop(false, true).animate({ top: parseInt($ul.css('top')) - $liHeight });
                        flagNext--;
                        flagLast++;
                    } else {
                        $nextArrow.hide();
                    };

                    if (flagLast > 0) {
                        $lastArrow.show();
                    }

                });

                //4.点击上箭头, 显示上一张图片.
                $lastArrow.on('click', function () {
                    $ul.stop(false, true).animate({ top: parseInt($ul.css('top')) + $liHeight });
                    flagLast--;
                    flagNext++;
                    if (flagNext !== 0) {
                        $nextArrow.show();
                    }
                    if (flagLast == 0) {
                        $lastArrow.hide();
                    }
                });

                //5.鼠标悬停在小图上, 改变小图边框颜色.
                let $li_smallPics = $('.smallPicWrap .picList li');
                $li_smallPics.hover(function () {
                    $(this).css({ 'borderColor': '#ff5000' });
                }, function () {
                    $(this).css({ 'borderColor': 'transparent' });
                });

                //6.一开始大图容器要显示第一张小图.
                let $imgContainer = $('.bigPicWrap .imgWrap section.imgSec');
                let img1 = new Image();
                img1.src = $li_smallPics.eq(0).find('img').attr('src');
                $imgContainer.html(img1);

                //7.点击小图, 显示一样的图片在大图容器里, 以及放大镜的容器里.
                $li_smallPics.on('click', function () {
                    $imgContainer.find('img').attr('src', $(this).find('img').attr('src'));
                    $scale.find('img').attr('src', $(this).find('img').attr('src'));
                });

                //8.放大镜效果.
                let $sf = $('.sf');
                let $scale = $('.scale');
                let $bigPicWrap = $('.bigPicWrap');
                let $imgWrap = $('.bigPicWrap .imgWrap');

                //在放大镜容器里 放入大图容器里的图片.
                let img2 = new Image();
                img2.src = img1.src;
                $scale.html(img2);
                //鼠标经过大图容器时, 容器内出现小放, 右边出现放大镜.
                $imgWrap.on('mouseover', function () {
                    $sf.css({ 'visibility': 'visible' });
                    $scale.css({ 'visibility': 'visible' });
                    $sf.width($imgWrap.width() * $scale.width() / $scale.find('img').width());
                    $sf.height($imgWrap.height() * $scale.height() / $scale.find('img').height());

                    let bili = $scale.find('img').width() / $imgWrap.width();
                    $imgWrap.on('mousemove', function (ev) {
                        ev = ev || window.event;
                        //限定范围
                        let l = ev.clientX - $bigPicWrap.offset().left - $sf.width() / 2;
                        let t = ev.clientY - $bigPicWrap.offset().top - $sf.height() / 2;

                        if (l <= 0) {
                            l = 0;
                        } else if (l >= $imgWrap.width() - $sf.width() - 2) {
                            l = $imgWrap.width() - $sf.width() - 2;
                        }

                        if (t <= 0) {
                            t = 0;
                        } else if (t >= $imgWrap.height() - $sf.height() - 2) {
                            t = $imgWrap.height() - $sf.height() - 2;
                        }
                        $sf.css({ left: l });
                        $sf.css({ top: t });

                        //l和t是小放的定位
                        $scale.find('img').css({ left: -l * bili });
                        $scale.find('img').css({ top: -t * bili });
                    });
                });

                //鼠标移出大图容器时, 小放和 放大镜都消失.
                $imgWrap.on('mouseout', function () {
                    $sf.css({ 'visibility': 'hidden' });
                    $scale.css({ 'visibility': 'hidden' });
                });
            });


            //五.商品购买的相关交互效果.
            //1.商品数量的交互效果.
            $itemNumInput = $('.infoWrap .quantity input');
            $additemNumBtn = $('.infoWrap .quantity .inputNum .increase');
            $reduceitemNumBtn = $('.infoWrap .quantity .inputNum .reduce');

            //1.1进入页面时, 商品数量默认显示1.
            $itemNumInput.val(1);

            //1.2点击加减按钮, 增加或减少数量.
            $additemNumBtn.on('click', function () {
                $itemNumInput.val(+$itemNumInput.val() + 1);
                //点一次加按钮, 减按钮就可点击.
                $reduceitemNumBtn.css({ cursor: 'pointer' });
            });
            $reduceitemNumBtn.on('click', function () {
                if ($itemNumInput.val() > 1) {
                    //点击减按钮, 当数量>1时 可以-1;
                    $itemNumInput.val(+$itemNumInput.val() - 1);
                    if ($itemNumInput.val() == 1) {
                        $(this).css({ cursor: 'not-allowed' });
                    }
                } else {
                    //当数量<=1时 减按钮无法点击.
                    $(this).css({ cursor: 'not-allowed' });
                    return;
                }
            });

            //六.下面详情页的相关交互效果.
            //1.标题导航的交互.
            let $titleNavWrap = $('.detailInfoWrap ul.nav');
            let $navWrap = $('.detailInfoWrap div.navWrap');
            let $titleNav = $('.detailInfoWrap ul.nav li');
            let $detailCon = $('.detailInfo>div');

            //onscroll事件: 2个效果.
            $(window).on('scroll', function () {
                //1.1 onscroll事件:页面可视区超过标题导航时, 标题导航显示在顶部.
                if ($(window).scrollTop() > $navWrap.offset().top) {
                    $titleNavWrap.addClass('fixedAcvtive').css({ 'width': $navWrap.width() });
                    $navWrap.css({ 'padding-bottom': $titleNavWrap.outerHeight() })
                } else {
                    $titleNavWrap.removeClass('fixedAcvtive');
                    $navWrap.css({ 'padding-bottom': 0 })
                };

                //1.2 onscroll事件: 根据显示的内容, 标题导航内对应标题有样式.
                $detailCon.each(function (index, element) {
                    if ($(element).offset().top + $(element).height() / 3 > $(window).scrollTop()) {
                        $titleNav.removeClass('active').eq(index).addClass('active');
                        return false;
                    }
                });
            })

            //1.3点击标题,改变文字样式, 且页面移动到对应的标题内容.
            $titleNav.on('click', function () {
                $(this).addClass('active').siblings('li').removeClass('active');
                $('html,body').animate({
                    scrollTop: $detailCon.eq($(this).index()).offset().top - $titleNavWrap.height()
                });
            });

            //2.进入页面时获取当前商品的评论.
            //思路: 上传当前商品的sid, 若数据库中存在该sid, 说明该商品有评论, 那就渲染出评论.
            let $userCommentWrap = $('.detailInfo .comment .conWrap');
            $.ajax({
                url: 'http://localhost/taobao/php/detail_getComment.php',
                data: {
                    itemSid: datasid
                },
                dataType: 'json'
            }).done((data) => {
                console.log(data); //数据data是个数组.
                if (data) {
                    let strhtml = '';
                    for (let i = 0; i < data.length; i++) {
                        strhtml += `
                        <div class="commentCon">
                            <div class="userWrap">
                                <div class="headPic">
                                    <img src="https://img.alicdn.com/imgextra/i4/O1CN01GbZNxl26Vzotrjqli_!!6000000007668-2-tps-160-160.png" alt="">
                                </div>
                                <div class="right">
                                    <span class="username">${data[data.length - 1 - i].username}</span>
                                    <span class="commentDate">${data[data.length - 1 - i].commentTime}</span>
                                </div>
                            </div>
                            <div class="message">
                                <p>${data[data.length - 1 - i].content}</p>
                            </div>
                        </div>
                        `;
                    };
                    $userCommentWrap.html(strhtml);
                }
            });

            //3.发布评论的交互效果.
            let $messageWrap = $('#messageWrap');
            let $openIssue = $('.detailInfo .comment .title .issueMess');
            let $closeBtn = $('#messageWrap .messBtnWrap .close');

            //一开始发布评论的界面隐藏.
            // $messageWrap.hide();

            //3.1点击发布评论按钮.
            //(1)有登入的用户时显示 输入内容的界面.
            //(2)没有登入的用户时 弹出登入提示.
            $openIssue.on('click', function () {
                if ($username) {
                    $messageWrap.show();
                } else {
                    alert('请登入账号')
                };
            });

            //3.2点击关闭按钮, 关闭评论界面.
            $closeBtn.on('click', function () {
                $messageWrap.hide();
            });

            //3.3点击发布按钮, 上传评论.
            let $issueBtn = $('#messageWrap .messBtnWrap .issue');//发布按钮.
            $issueBtn.on('click', function () {
                $.ajax({
                    url: 'http://localhost/taobao/php/detail_saveComment.php',
                    data: {
                        itemSid: datasid,
                        username: $username,
                        time: new Date().toLocaleString(),
                        content: $('#messageWrap textarea').val()
                    },
                    dataType: 'json'
                }).done((data) => {
                    console.log(data);//字符串用户名
                    $.ajax({
                        url: 'http://localhost/taobao/php/detail_getCommentbyClick.php',
                        data: {
                            username: data
                        },
                        dataType: 'json'
                    }).done((data) => {
                        console.log(data); //数据data是个数组.
                        // console.log(2);
                        let strhtml = '';
                        strhtml += `
                        <div class="commentCon">
                            <div class="userWrap">
                                <div class="headPic">
                                    <img src="https://img.alicdn.com/imgextra/i4/O1CN01GbZNxl26Vzotrjqli_!!6000000007668-2-tps-160-160.png" alt="">
                                </div>
                                <div class="right">
                                    <span class="username">${data.username}</span>
                                    <span class="commentDate">${data.commentTime}</span>
                                </div>
                            </div>
                            <div class="message">
                                <p>${data.content}</p>
                            </div>
                        </div>
                        `;
                        $userCommentWrap.prepend(strhtml);
                    });
                });
                $messageWrap.hide();

            });

            //七.加入购物车.
            let $addCart = $('.addCart');
            console.log(2);

            $addCart.on('click', function () {
                $.ajax({
                    url: 'http://localhost/taobao/php/detail_addCart.php',
                    data: {
                        username: $username,
                        itemSid: datasid,
                    },
                    dataType: 'json'
                });
                alert('该商品已加入购物车')
            })
        }
    }
})
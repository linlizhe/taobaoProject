define(['public2007', 'uploadPic', 'slide', 'categoryList', 'jlazyload', '../../fonts/icon_projectTaobao/iconfont'], function (public2007, uploadPic, slide, categoryList) {
    return {
        init: function () {
            //一.进入首页时检测是否有cookie用户名, 若有就登入.
            //1.显示用户名
            let $username = public2007.cookie.get('username');
            if ($username) {
                // $('#header li.li_username>a').not('.a_username').hide();
                $('#header li.li_username .a_username').show().siblings('a').hide();
                $('.a_username span').html($username).css({ color: '#ff5000' });
                $('.userManageWrap span').html($username);
            } else {
                $('.a_username').hide();
            };
            //2.鼠标悬停用户名, 下面显示退出界面.
            $('.li_username').hover(function () {
                if ($('.a_username').css('display') !== 'none') {
                    $('div.userBox').css({ 'display': 'flex' });
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
                $('#header li.li_username .a_username').hide().siblings('a').show();
                //隐藏退出界面.
                $('div.userBox').hide();
            });

            //二.搜索框
            //1.搜索框内的placeHolder文字会定时改变.
            let $placeHolderUl = $('.searchByWriting .placeHolder ul');
            let $placeHolderli = $('.searchByWriting .placeHolder ul li');
            let $placeHolderliHeight = $placeHolderli.height();
            let i = 0;
            setInterval(function () {
                i++;
                if (i === $placeHolderli.size()) {
                    //当placeHolder文字显示完最后1个后, 要从头开始.
                    $placeHolderUl[0].style.top = 0;
                    i = 1;
                }
                public2007.bufferMove($placeHolderUl[0], {
                    //每次都需要获取ul最新的top, 让最新top值-38px, ul就会向上移动.
                    top: -i * $placeHolderliHeight
                });
            }, 2000)

            //2.调用上传图片功能模块
            uploadPic.init();

            //3.滚动条下滑, 搜索框出现在可视区顶部, 且样式改变.
            let $search = $('#container #layout #search');//搜索框容器 $search
            let $searchWrap = $('#container #layout .searchWrap');

            let rightSpacing = ($('#container').width() - $('#layout').outerWidth()) / 2;
            let itemNavFixedLeft = $('#container').width() - $('#layout').width() - parseInt($('#layout').css('padding-right')) - rightSpacing;
            let changeSearchFixedLeft = $('#container').width() - $('#layout').outerWidth() - rightSpacing;

            //搜索框不在可视区时, 搜索框里元素出现改变.
            //通过添加类名 改变元素样式.
            $(window).on('scroll', function () {
                // console.log(1);

                //当滚动条top值超过头部导航的高度时 说明搜索框正在移出可视区.
                if ($(window).scrollTop() > $('#header').outerHeight()) {
                    $search.attr('id', 'changeSearch');
                    $search.width($('#layout').width()).css({ left: changeSearchFixedLeft + 60 });
                    $searchWrap.prop('className', 'searchWrapActive');
                } else {
                    $search.attr('id', 'search');
                    $search.css({ width: '100%' });
                    $searchWrap.prop('className', 'searchWrap');
                };

                // 4.3商品列表标题移出可视区时紧靠在搜索框下面_滚轮事件.
                if ($itemNavWrap.offset().top <= $(window).scrollTop()) {
                    $itemNavWrap.addClass('itemNavWrapActive');
                    $itemNav.addClass('itemNavActive').width($('#layout').width()).css({ left: itemNavFixedLeft - 80 });
                } else {
                    $itemNavWrap.removeClass('itemNavWrapActive')
                    $itemNav.removeClass('itemNavActive').css({ width: '100%' });
                }

            });
            //刷新页面 根据滚动条top值判断 显示第一个或第二个搜索框.
            if ($(window).scrollTop() > $('#header').outerHeight()) {
                $search.attr('id', 'changeSearch');
            } else {
                $search.attr('id', 'search');
            }

            //三.主要内容
            //1.调用分类列表网页效果的模块: 鼠标悬停效果, 二级菜单.
            categoryList.init();

            //2.调用轮播图模块
            slide.init();

            //3.主要内容中, 鼠标悬停改变文字颜色
            //淘江湖列表中的内容
            let $taoJiangHuA = $('.midLeft .botLeft .list a');
            //鼠标移入列表内容时 改变内容颜色, 移出 颜色复原.
            $taoJiangHuA.hover(function () {
                $(this).addClass('active');
            }, function () {
                $(this).removeClass('active');
            });

            //主要内容, 右边用户头像, 下午好, 注册, 开店, 这3个a经过时改变颜色.
            let $sayHiWordA = $('.top_user .sayHiWord p a');
            $sayHiWordA.hover(function () {
                $(this).addClass('active');
            }, function () {
                $(this).removeClass('active');
            });

            let $top_userIconListP1 = $('.top_user ul li p');

            $top_userIconListP1.hover(function () {
                $(this).addClass('active');
            }, function () {
                $(this).removeClass('active');
            });

            let $top_userIconListP2 = $('.right .bottom_list li p');
            $top_userIconListP2.hover(function () {
                $(this).addClass('active');
            }, function () {
                $(this).removeClass('active');
            });


            //4.商品列表: 悬停事件, 渲染商品/滚轮事件, 标题点击事件.
            //4.1悬停事件: 鼠标悬停在商品上出现边框.
            //封装成函数, 因为商品li是异步渲染的, 在渲染li时调用该函数.
            function borderWrapActive() {
                $('#guessYouLike .itemList ul li').hover(function () {
                    //找到悬停的li里的borderWrap元素, 给该元素添加宽高和类名.
                    $(this).find('.borderWrap').width($(this).outerWidth());
                    $(this).find('.borderWrap').addClass('borderWrapActive').height($(this).outerHeight() + 4)

                }, function () {
                    //鼠标移出li时 li下的borderWrap元素宽高=0, 且移出添加的类名.
                    $(this).find('.borderWrap').width(0).height(0).removeClass('borderWrapActive');

                })
            };

            //4.2第一次进入页面时, 渲染7个商品列表.
            // 第一个列表里的商品按照顺序渲染, 后面6个随机.
            let $sidArr = [[], [], [], [], [], [], []];
            const $itemListUl = $('#guessYouLike .itemList ul'); //共7个ul, 对应7个标题.

            for (let i = 0; i < $itemListUl.length; i++) {
                if (i > 0) {
                    //再渲染其他标题对应的商品
                    $.ajax({
                        url: 'http://localhost/taobao/php/getTaoBaoItems.php',
                        dataType: 'json', //设置json格式的对象。  
                    }).done((arrData1) => {
                        //获取一个商品总数内的随机数, 因为每次渲染12个, 随机数不能取到 总数的后面12个, 所以下面要-12;
                        let $ranNum = public2007.ranNum(0, arrData1.length - 12);
                        $.ajax({
                            url: 'http://localhost/taobao/php/render12Items.php',
                            dataType: 'json',
                            data: { num: $ranNum }
                        }).done((arrData2) => {
                            //循环把当前数据的sid放入对应的数组内.
                            for (let j = 0; j < arrData2.length; j++) {
                                $sidArr[i].push(arrData2[j].sid);
                            };
                            //这里循环结束后会有7个数组, 对应7个ul, 数组内有12条数据sid.
                            let $renderdata = arrData2;
                            let $strHtml = ''; //拼接字符串
                            $.each($renderdata, function (index, value) {
                                //使用if做两套拼接的代码, 若当前的value里没有 titleImg 说明没有图片
                                if (!value.titleImg) {
                                    //标题里没有图片的商品更多, 所以把没有时的情况写在if.
                                    if (value.ps) {
                                        //多数都有小字ps, 写在if.
                                        $strHtml += `
                            <li>
                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                    <div class="backImage">
                                        <img src="${value.url}" />
                                    </div>
                                    <div class="itemName">
                                        <span class="titleWord">${value.title}</span>
                                    </div>
                                    <div class="priceInfo">
                                        <p>${value.ps}</p>
                                        <div class="price">
                                            <span class="s1">¥</span>
                                            <span class="s2">${value.price}</span>
                                        </div>
                                    </div>
                                    <div class="borderWrap"></div>
                                </a>
                                
                            </li>
                            `;
                                    } else {
                                        //走这里说明, 标题里没有图片的商品 也没有ps小字ps.
                                        $strHtml += `
                            <li>
                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                    <div class="backImage">
                                        <img src="${value.url}" />
                                    </div>
                                    <div class="itemName">
                                        <span class="titleWord">${value.title}</span>
                                    </div>
                                    <div class="priceInfo">
                                        <p></p>
                                        <div class="price">
                                            <span class="s1">¥</span>
                                            <span class="s2">${value.price}</span>
                                        </div>
                                    </div>
                                    <div class="borderWrap"></div>
                                </a>
                                
                            </li>
                            `;
                                    }
                                } else {
                                    //走这里说明, 标题里有图片.
                                    //判断是否有ps小字
                                    if (value.ps) {
                                        //标题里有图片, 且存在ps小字.
                                        $strHtml += `
                            <li>
                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                    <div class="backImage">
                                        <img src="${value.url}" />
                                    </div>
                                    <div class="itemName">
                                        <img src="${value.titleImg}" alt="">
                                        <span class="titleWord">${value.title}</span>
                                    </div>
                                    <div class="priceInfo">
                                        <p>${value.ps}</p>
                                        <div class="price">
                                            <span class="s1">¥</span>
                                            <span class="s2">${value.price}</span>
                                        </div>
                                    </div>
                                    <div class="borderWrap"></div>
                                </a>
                                
                            </li>
                            `;
                                    } else {
                                        //标题里有图片, 不存在ps小字.
                                        $strHtml += `
                            <li>
                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                    <div class="backImage">
                                        <img src="${value.url}" />
                                    </div>
                                    <div class="itemName">
                                        <img src="${value.titleImg}" alt="">
                                        <span class="titleWord">${value.title}</span>
                                    </div>
                                    <div class="priceInfo">
                                        <p></p>
                                        <div class="price">
                                            <span class="s1">¥</span>
                                            <span class="s2">${value.price}</span>
                                        </div>
                                    </div>
                                    <div class="borderWrap"></div>
                                </a>
                                
                            </li>
                            `;
                                    }
                                }
                            });
                            $($itemListUl[i]).html($strHtml);
                            borderWrapActive();
                        })
                    })

                } else {
                    //先渲染第一个标题对应的商品;
                    $.ajax({
                        url: 'http://localhost/taobao/php/renderInit.php',
                        dataType: 'json', //设置json格式的对象。
                    }).done((arrData) => {

                        //arrData是1个数组, 里面有12个对象, 每个对象内有商品标题, 价格, 图片路径等字符串信息.
                        for (let j = 0; j < arrData.length; j++) {
                            $sidArr[i].push(arrData[j].sid);
                        };
                        let $renderdata = arrData;
                        let $strHtml = ''; //拼接字符串
                        $.each($renderdata, function (index, value) {
                            //使用if做两套拼接的代码, 若当前的value里没有 titleImg 说明没有图片
                            if (!value.titleImg) {
                                //标题里没有图片的商品更多, 所以把没有时的情况写在if.
                                if (value.ps) {
                                    //多数都有小字ps, 写在if.
                                    $strHtml += `
                            <li>
                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                    <div class="backImage">
                                        <img src="${value.url}" />
                                    </div>
                                    <div class="itemName">
                                        <span class="titleWord">${value.title}</span>
                                    </div>
                                    <div class="priceInfo">
                                        <p>${value.ps}</p>
                                        <div class="price">
                                            <span class="s1">¥</span>
                                            <span class="s2">${value.price}</span>
                                        </div>
                                    </div>
                                    <div class="borderWrap"></div>
                                </a>
                                
                            </li>
                            `;
                                } else {
                                    //走这里说明, 标题里没有图片的商品 也没有ps小字ps.
                                    $strHtml += `
                            <li>
                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                    <div class="backImage">
                                        <img src="${value.url}" />
                                    </div>
                                    <div class="itemName">
                                        <span class="titleWord">${value.title}</span>
                                    </div>
                                    <div class="priceInfo">
                                        <p></p>
                                        <div class="price">
                                            <span class="s1">¥</span>
                                            <span class="s2">${value.price}</span>
                                        </div>
                                    </div>
                                    <div class="borderWrap"></div>
                                </a>
                                
                            </li>
                            `;
                                }
                            } else {
                                //走这里说明, 标题里有图片.
                                //判断是否有ps小字
                                if (value.ps) {
                                    //标题里有图片, 且存在ps小字.
                                    $strHtml += `
                            <li>
                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                    <div class="backImage">
                                        <img src="${value.url}" />
                                    </div>
                                    <div class="itemName">
                                        <img src="${value.titleImg}" alt="">
                                        <span class="titleWord">${value.title}</span>
                                    </div>
                                    <div class="priceInfo">
                                        <p>${value.ps}</p>
                                        <div class="price">
                                            <span class="s1">¥</span>
                                            <span class="s2">${value.price}</span>
                                        </div>
                                    </div>
                                    <div class="borderWrap"></div>
                                </a>
                                
                            </li>
                            `;
                                } else {
                                    //标题里有图片, 不存在ps小字.
                                    $strHtml += `
                            <li>
                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                    <div class="backImage">
                                        <img src="${value.url}" />
                                    </div>
                                    <div class="itemName">
                                        <img src="${value.titleImg}" alt="">
                                        <span class="titleWord">${value.title}</span>
                                    </div>
                                    <div class="priceInfo">
                                        <p></p>
                                        <div class="price">
                                            <span class="s1">¥</span>
                                            <span class="s2">${value.price}</span>
                                        </div>
                                    </div>
                                    <div class="borderWrap"></div>
                                </a>
                                
                            </li>
                            `;
                                }
                            }
                        });
                        $($itemListUl[i]).html($strHtml);
                        borderWrapActive();
                    });

                }

            }

            //4.3商品列表标题移出可视区时紧靠在搜索框下面_滚轮事件.
            //这个效果的代码我放在上面搜索框的滚轮事件里.

            //刷新页面后 让滚动条回到顶部.
            $(window).scrollTop(0);

            //4.4渲染商品列表_onscroll事件.
            //定义 防抖函数debounce
            function debounce(callback, time = 50) {
                let t;
                return function () {
                    clearTimeout(t);
                    t = setTimeout(callback, time);
                }
            }

            $(window).on('scroll', debounce(function () {
                // (2)渲染商品.
                let $allItems = $localUl.find('li'); //获取所有显示的li.
                let $itemLength = $allItems.size(); //当前商品总数量.
                let lastItem = $allItems[$itemLength - 1]; //这个元素是原生元素
                let $lastItemTop = null;
                if ($(lastItem).offset() !== undefined) {
                    $lastItemTop = $(lastItem).offset().top - $(window).scrollTop(); //最新一行li的顶部距离 可视区顶部的高度.
                };

                if ($lastItemTop <= $(window).height() * 0.75) { // 例如，当距离底部500px时触发加载更多数据
                    $.ajax({
                        url: 'http://localhost/taobao/php/getTaoBaoItems.php',
                        dataType: 'json', //设置json格式的对象。
                    }).done((arrData1) => {
                        //检测商品列表ul宽度 可放6个还是5个商品, 下面渲染的数量根据这个来.
                        if ($('#guessYouLike .itemList ul.active').width() >= 208 * 6) {//此时一行6个, 每次渲染6个商品.
                            let $ranNum = public2007.ranNum(0, arrData1.length - 6); //获取随机数.
                            $.ajax({
                                url: 'http://localhost/taobao/php/renderItems.php',
                                dataType: 'json', //设置json格式的对象。
                                data: { num: $ranNum, renderCount: 6 }
                            }).done((arrData2) => {//arrData2是随机获取的6个数据.
                                //判断当前最后1个数据的sid是否等于 数组内的最后1个sid
                                if (arrData2[arrData2.length - 1].sid !== $sidArr[$localUl.index()][$sidArr[$localUl.index()].length - 1]) {
                                    //若不等于, 说明当前数据不是上一组数据的重复, 可以渲染.
                                    // console.log(arrData2);
                                    $renderdata = arrData2;
                                    let $strHtml = ''; //拼接字符串
                                    $.each($renderdata, function (index, value) {
                                        //使用if做两套拼接的代码, 若当前的value里没有 titleImg 说明没有图片
                                        if (!value.titleImg) {
                                            //标题里没有图片的商品更多, 所以把没有时的情况写在if.
                                            if (value.ps) {
                                                //多数都有小字ps, 写在if.
                                                // <img class="lazy" data-original="${value.url}" />
                                                // <img class="lazy" data-original="${value.titleImg}" alt="">

                                                $strHtml += `
                                            <li>
                                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                                    <div class="backImage">
                                                        <img src="${value.url}" />
                                                    </div>
                                                    <div class="itemName">
                                                        <span class="titleWord">${value.title}</span>
                                                    </div>
                                                    <div class="priceInfo">
                                                        <p>${value.ps}</p>
                                                        <div class="price">
                                                            <span class="s1">¥</span>
                                                            <span class="s2">${value.price}</span>
                                                        </div>
                                                    </div>
                                                    <div class="borderWrap"></div>
                                                </a>
                                                
                                            </li>
                                            `;
                                            } else {
                                                //走这里说明, 标题里没有图片的商品 也没有ps小字ps.
                                                $strHtml += `
                                            <li>
                                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                                    <div class="backImage">
                                                        <img src="${value.url}" />
                                                    </div>
                                                    <div class="itemName">
                                                        <span class="titleWord">${value.title}</span>
                                                    </div>
                                                    <div class="priceInfo">
                                                        <p></p>
                                                        <div class="price">
                                                            <span class="s1">¥</span>
                                                            <span class="s2">${value.price}</span>
                                                        </div>
                                                    </div>
                                                    <div class="borderWrap"></div>
                                                </a>
                                                
                                            </li>
                                            `;
                                            }
                                        } else {
                                            //走这里说明, 标题里有图片.
                                            //判断是否有ps小字
                                            if (value.ps) {
                                                //标题里有图片, 且存在ps小字.
                                                $strHtml += `
                                            <li>
                                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                                    <div class="backImage">
                                                       <img src="${value.url}" />
                                                    </div>
                                                    <div class="itemName">
                                                        <img src="${value.titleImg}">
                                                        <span class="titleWord">${value.title}</span>
                                                    </div>
                                                    <div class="priceInfo">
                                                        <p>${value.ps}</p>
                                                        <div class="price">
                                                            <span class="s1">¥</span>
                                                            <span class="s2">${value.price}</span>
                                                        </div>
                                                    </div>
                                                    <div class="borderWrap"></div>
                                                </a>
                                                
                                            </li>
                                            `;
                                            } else {
                                                //标题里有图片, 不存在ps小字.
                                                $strHtml += `
                                            <li>
                                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                                    <div class="backImage">
                                                        <img src="${value.url}" />
                                                    </div>
                                                    <div class="itemName">
                                                        <img src="${value.titleImg}">
                                                        <span class="titleWord">${value.title}</span>
                                                    </div>
                                                    <div class="priceInfo">
                                                        <p></p>
                                                        <div class="price">
                                                            <span class="s1">¥</span>
                                                            <span class="s2">${value.price}</span>
                                                        </div>
                                                    </div>
                                                    <div class="borderWrap"></div>
                                                </a>
                                                
                                            </li>
                                            `;
                                            }
                                        }
                                    });
                                    $localUl.append($strHtml);
                                    borderWrapActive();
                                }
                            });
                        } else {//此时一行5个, 每次渲染5个商品.
                            let $ranNum = public2007.ranNum(0, arrData1.length - 5); //获取随机数.
                            $.ajax({
                                url: 'http://localhost/taobao/php/renderItems.php',
                                dataType: 'json', //设置json格式的对象。
                                data: { num: $ranNum, renderCount: 5 }
                            }).done((arrData2) => {//arrData2是随机获取的6个数据.
                                //判断当前最后1个数据的sid是否等于 数组内的最后1个sid
                                if (arrData2[arrData2.length - 1].sid !== $sidArr[$localUl.index()][$sidArr[$localUl.index()].length - 1]) {
                                    //若不等于, 说明当前数据不是上一组数据的重复, 可以渲染.
                                    console.log(arrData2);
                                    $renderdata = arrData2;
                                    let $strHtml = ''; //拼接字符串
                                    $.each($renderdata, function (index, value) {
                                        //使用if做两套拼接的代码, 若当前的value里没有 titleImg 说明没有图片
                                        if (!value.titleImg) {
                                            //标题里没有图片的商品更多, 所以把没有时的情况写在if.
                                            if (value.ps) {
                                                $strHtml += `
                                            <li>
                                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                                    <div class="backImage">
                                                        <img src="${value.url}" />
                                                    </div>
                                                    <div class="itemName">
                                                        <span class="titleWord">${value.title}</span>
                                                    </div>
                                                    <div class="priceInfo">
                                                        <p>${value.ps}</p>
                                                        <div class="price">
                                                            <span class="s1">¥</span>
                                                            <span class="s2">${value.price}</span>
                                                        </div>
                                                    </div>
                                                    <div class="borderWrap"></div>
                                                </a>
                                                
                                            </li>
                                            `;
                                            } else {
                                                //走这里说明, 标题里没有图片的商品 也没有ps小字ps.
                                                $strHtml += `
                                            <li>
                                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                                    <div class="backImage">
                                                        <img src="${value.url}" />
                                                    </div>
                                                    <div class="itemName">
                                                        <span class="titleWord">${value.title}</span>
                                                    </div>
                                                    <div class="priceInfo">
                                                        <p></p>
                                                        <div class="price">
                                                            <span class="s1">¥</span>
                                                            <span class="s2">${value.price}</span>
                                                        </div>
                                                    </div>
                                                    <div class="borderWrap"></div>
                                                </a>
                                                
                                            </li>
                                            `;
                                            }
                                        } else {
                                            //走这里说明, 标题里有图片.
                                            //判断是否有ps小字
                                            if (value.ps) {
                                                //标题里有图片, 且存在ps小字.
                                                $strHtml += `
                                            <li>
                                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                                    <div class="backImage">
                                                       <img src="${value.url}" />
                                                    </div>
                                                    <div class="itemName">
                                                        <img src="${value.titleImg}">
                                                        <span class="titleWord">${value.title}</span>
                                                    </div>
                                                    <div class="priceInfo">
                                                        <p>${value.ps}</p>
                                                        <div class="price">
                                                            <span class="s1">¥</span>
                                                            <span class="s2">${value.price}</span>
                                                        </div>
                                                    </div>
                                                    <div class="borderWrap"></div>
                                                </a>
                                                
                                            </li>
                                            `;
                                            } else {
                                                //标题里有图片, 不存在ps小字.
                                                $strHtml += `
                                            <li>
                                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                                    <div class="backImage">
                                                        <img src="${value.url}" />
                                                    </div>
                                                    <div class="itemName">
                                                        <img src="${value.titleImg}">
                                                        <span class="titleWord">${value.title}</span>
                                                    </div>
                                                    <div class="priceInfo">
                                                        <p></p>
                                                        <div class="price">
                                                            <span class="s1">¥</span>
                                                            <span class="s2">${value.price}</span>
                                                        </div>
                                                    </div>
                                                    <div class="borderWrap"></div>
                                                </a>
                                                
                                            </li>
                                            `;
                                            }
                                        }
                                    });
                                    $localUl.append($strHtml);
                                    borderWrapActive();
                                }
                            });
                        }


                    });
                }
            }, 50))

            //4.5商品列表标题_点击事件_2个效果: (1)给标题加样式, (2)商品列表的标题 刚好在搜索框下面.
            let $itemNav = $('#guessYouLike .itemNav');
            let $itemNavWrap = $('#guessYouLike .itemNavWrap');
            let $guessNavLi = $('#guessYouLike .itemNav li'); //共7个标题.
            let $localUl = $itemListUl.eq($itemNav.find('li.active').index()); //获取跟当前标题对应的ul.

            $guessNavLi.on('click', function () {
                //用if判断点击的li是否有类名actie, 若有就不需要加样式和 移动滚动条, 若没有才需要.
                if ($(this).prop('className') !== 'active') {
                    // (1)点击任意标题, 给标题加样式.
                    $(this).addClass('active').siblings('li').removeClass('active').find('.bottomLineDiv').removeClass('active');
                    $(this).find('.bottomLineDiv').addClass('active');

                    $localUl = $itemListUl.eq($(this).index()); //点击标题时获取 跟点击的标题对应的ul.
                    $localUl.addClass('active').siblings('ul').removeClass('active');

                    //点击任意标题, 商品列表的标题 刚好在 搜索框下面.
                    $('html,body').animate({
                        scrollTop: $('#guessYouLike').offset().top - 58
                    });
                }

            });

            //懒加载效果
            // $("img.lazy").lazyload({
            //     effect: "fadeIn" //图片显示方式
            // });


            //四.网页尾部的效果
            //1.有些文字鼠标悬停时改变文字颜色.
            $('#footer .bottom a').parent().hover(function () {
                $(this).find('a').addClass('active');
            }, function () {
                $(this).find('a').removeClass('active');
            })


            //index.html底部广告的点击事件
            //点击右上角的叉, 关闭广告.
            $('#ad .login_close a img').on('click', () => {
                // console.log(1);$()
                $('#ad').css({
                    display: 'none'
                })
            })

            //五.网页宽度自适应效果
            let $container = $('#container');
            let $layout = $('#layout');
            let $header = $('#header');
            let $siteNav = $('#header #siteNav');

            let $titleimgTaoJiangHu = $('.mainContent .midLeft .botLeft .word_img img'); //淘江湖右边的img.
            let $titleImgTaoBaoZhiBo = $('.mainContent .midLeft .botRight .word_img img'); //淘宝直播右边的img.
            let $mainMidLeftBot = $('.mainContent .midLeft .bottom'); //轮播图下面的元素.
            let $imgTaoBaoZhiBo = $('.mainContent .midLeft .botRight .coverImage'); //淘宝直播里2个图片的容器.

            $(window).on('resize', function () {
                //1.网页头部导航的宽度自适应.
                if ($header.width() >= 1379) {
                    $siteNav.removeClass('style2');
                } else {
                    $siteNav.addClass('style2');
                }

                //2.container和layout元素的宽度自适应
                if ($container.width() >= 1401) { //当container元素宽度<1401时layout元素改变id名, 使用第二套样式.
                    $layout.removeClass('style2');
                } else {
                    $layout.addClass('style2');
                }

                //3.轮播图下2块内容的宽度自适应.
                if ($mainMidLeftBot.width() > 304) {
                    $titleimgTaoJiangHu.show();
                    $titleImgTaoBaoZhiBo.show();

                } else {
                    $titleimgTaoJiangHu.hide();
                    $titleImgTaoBaoZhiBo.hide();
                };

                if ($imgTaoBaoZhiBo.outerWidth() > 208) {
                    $imgTaoBaoZhiBo.find('.a2').show();
                    $imgTaoBaoZhiBo.find('a').css({ width: 'calc((100% - 8px) / 2)' });
                } else {
                    $imgTaoBaoZhiBo.find('.a2').hide();
                    $imgTaoBaoZhiBo.find('a').css({ width: '100%' });
                };
            })

            //4.页面宽度减小, 商品列表一行的数量的改变.
            $(window).on('resize', debounce(function () {
                //4.1数量从6->5时.
                //判断什么时候一行数量从6->5
                if ($('#guessYouLike .itemList ul.active').width() >= 208 * 6) {
                    if ($('#guessYouLike .itemList ul.active li').size() % 6 !== 0) {//一行6个, 且总数无法被6整除时, 渲染剩下的商品补齐.
                        let $restLi = 6 - ($('#guessYouLike .itemList ul.active li').size() % 6); //需要渲染的商品数量.
                        $.ajax({
                            url: 'http://localhost/taobao/php/getTaoBaoItems.php',
                            dataType: 'json', //设置json格式的对象。
                        }).done((arrData1) => {
                            let $ranNum = public2007.ranNum(0, arrData1.length - $restLi); //获取随机数.
                            $.ajax({
                                url: 'http://localhost/taobao/php/renderItems.php',
                                dataType: 'json', //设置json格式的对象。
                                data: { num: $ranNum, renderCount: $restLi }
                            }).done((arrData2) => {//arrData2是随机获取的6个数据.
                                console.log(arrData2);
                                $renderdata = arrData2;
                                let $strHtml = ''; //拼接字符串
                                $.each($renderdata, function (index, value) {
                                    //使用if做两套拼接的代码, 若当前的value里没有 titleImg 说明没有图片
                                    if (!value.titleImg) {
                                        //标题里没有图片的商品更多, 所以把没有时的情况写在if.
                                        if (value.ps) {
                                            $strHtml += `
                                            <li>
                                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                                    <div class="backImage">
                                                        <img src="${value.url}" />
                                                    </div>
                                                    <div class="itemName">
                                                        <span class="titleWord">${value.title}</span>
                                                    </div>
                                                    <div class="priceInfo">
                                                        <p>${value.ps}</p>
                                                        <div class="price">
                                                            <span class="s1">¥</span>
                                                            <span class="s2">${value.price}</span>
                                                        </div>
                                                    </div>
                                                    <div class="borderWrap"></div>
                                                </a>
                                                
                                            </li>
                                            `;
                                        } else {
                                            //走这里说明, 标题里没有图片的商品 也没有ps小字ps.
                                            $strHtml += `
                                            <li>
                                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                                    <div class="backImage">
                                                        <img src="${value.url}" />
                                                    </div>
                                                    <div class="itemName">
                                                        <span class="titleWord">${value.title}</span>
                                                    </div>
                                                    <div class="priceInfo">
                                                        <p></p>
                                                        <div class="price">
                                                            <span class="s1">¥</span>
                                                            <span class="s2">${value.price}</span>
                                                        </div>
                                                    </div>
                                                    <div class="borderWrap"></div>
                                                </a>
                                                
                                            </li>
                                            `;
                                        }
                                    } else {
                                        //走这里说明, 标题里有图片.
                                        //判断是否有ps小字
                                        if (value.ps) {
                                            //标题里有图片, 且存在ps小字.
                                            $strHtml += `
                                            <li>
                                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                                    <div class="backImage">
                                                       <img src="${value.url}" />
                                                    </div>
                                                    <div class="itemName">
                                                        <img src="${value.titleImg}">
                                                        <span class="titleWord">${value.title}</span>
                                                    </div>
                                                    <div class="priceInfo">
                                                        <p>${value.ps}</p>
                                                        <div class="price">
                                                            <span class="s1">¥</span>
                                                            <span class="s2">${value.price}</span>
                                                        </div>
                                                    </div>
                                                    <div class="borderWrap"></div>
                                                </a>
                                                
                                            </li>
                                            `;
                                        } else {
                                            //标题里有图片, 不存在ps小字.
                                            $strHtml += `
                                            <li>
                                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                                    <div class="backImage">
                                                        <img src="${value.url}" />
                                                    </div>
                                                    <div class="itemName">
                                                        <img src="${value.titleImg}">
                                                        <span class="titleWord">${value.title}</span>
                                                    </div>
                                                    <div class="priceInfo">
                                                        <p></p>
                                                        <div class="price">
                                                            <span class="s1">¥</span>
                                                            <span class="s2">${value.price}</span>
                                                        </div>
                                                    </div>
                                                    <div class="borderWrap"></div>
                                                </a>
                                                
                                            </li>
                                            `;
                                        }
                                    }
                                });
                                $localUl.append($strHtml);
                                borderWrapActive();
                            });
                        });

                    }
                } else {//此时数量从5->6.
                    if ($('#guessYouLike .itemList ul.active li').size() % 5 !== 0) {//一行5个, 且总数无法被5整除时, 渲染剩下的商品补齐.
                        let $restLi = 5 - ($('#guessYouLike .itemList ul.active li').size() % 5); //需要渲染的商品数量.
                        $.ajax({
                            url: 'http://localhost/taobao/php/getTaoBaoItems.php',
                            dataType: 'json', //设置json格式的对象。
                        }).done((arrData1) => {
                            let $ranNum = public2007.ranNum(0, arrData1.length - $restLi); //获取随机数.
                            $.ajax({
                                url: 'http://localhost/taobao/php/renderItems.php',
                                dataType: 'json', //设置json格式的对象。
                                data: { num: $ranNum, renderCount: $restLi }
                            }).done((arrData2) => {//arrData2是随机获取的5个数据.
                                console.log(arrData2);
                                $renderdata = arrData2;
                                let $strHtml = ''; //拼接字符串
                                $.each($renderdata, function (index, value) {
                                    //使用if做两套拼接的代码, 若当前的value里没有 titleImg 说明没有图片
                                    if (!value.titleImg) {
                                        //标题里没有图片的商品更多, 所以把没有时的情况写在if.
                                        if (value.ps) {
                                            $strHtml += `
                                            <li>
                                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                                    <div class="backImage">
                                                        <img src="${value.url}" />
                                                    </div>
                                                    <div class="itemName">
                                                        <span class="titleWord">${value.title}</span>
                                                    </div>
                                                    <div class="priceInfo">
                                                        <p>${value.ps}</p>
                                                        <div class="price">
                                                            <span class="s1">¥</span>
                                                            <span class="s2">${value.price}</span>
                                                        </div>
                                                    </div>
                                                    <div class="borderWrap"></div>
                                                </a>
                                                
                                            </li>
                                            `;
                                        } else {
                                            //走这里说明, 标题里没有图片的商品 也没有ps小字ps.
                                            $strHtml += `
                                            <li>
                                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                                    <div class="backImage">
                                                        <img src="${value.url}" />
                                                    </div>
                                                    <div class="itemName">
                                                        <span class="titleWord">${value.title}</span>
                                                    </div>
                                                    <div class="priceInfo">
                                                        <p></p>
                                                        <div class="price">
                                                            <span class="s1">¥</span>
                                                            <span class="s2">${value.price}</span>
                                                        </div>
                                                    </div>
                                                    <div class="borderWrap"></div>
                                                </a>
                                                
                                            </li>
                                            `;
                                        }
                                    } else {
                                        //走这里说明, 标题里有图片.
                                        //判断是否有ps小字
                                        if (value.ps) {
                                            //标题里有图片, 且存在ps小字.
                                            $strHtml += `
                                            <li>
                                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                                    <div class="backImage">
                                                       <img src="${value.url}" />
                                                    </div>
                                                    <div class="itemName">
                                                        <img src="${value.titleImg}">
                                                        <span class="titleWord">${value.title}</span>
                                                    </div>
                                                    <div class="priceInfo">
                                                        <p>${value.ps}</p>
                                                        <div class="price">
                                                            <span class="s1">¥</span>
                                                            <span class="s2">${value.price}</span>
                                                        </div>
                                                    </div>
                                                    <div class="borderWrap"></div>
                                                </a>
                                                
                                            </li>
                                            `;
                                        } else {
                                            //标题里有图片, 不存在ps小字.
                                            $strHtml += `
                                            <li>
                                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                                    <div class="backImage">
                                                        <img src="${value.url}" />
                                                    </div>
                                                    <div class="itemName">
                                                        <img src="${value.titleImg}">
                                                        <span class="titleWord">${value.title}</span>
                                                    </div>
                                                    <div class="priceInfo">
                                                        <p></p>
                                                        <div class="price">
                                                            <span class="s1">¥</span>
                                                            <span class="s2">${value.price}</span>
                                                        </div>
                                                    </div>
                                                    <div class="borderWrap"></div>
                                                </a>
                                                
                                            </li>
                                            `;
                                        }
                                    }
                                });
                                $localUl.append($strHtml);
                                borderWrapActive();
                            });
                        });

                    }
                }
            }, 50));


        }
    }
})




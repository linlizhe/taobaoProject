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

            //三.渲染
            let $itemWrap = $('.itemWrap');//商品的容器.
            let $checkAll = $('.checkAll'); //全选按钮
            // let $priceWrap = $('.totalPrice span.price');// 结算界面总价的容器.
            let $priceWrap = $('#totalPriceWrap span.price'); //结算界面总价的容器.

            //结算界面的图片容器一开始隐藏, 这样才能显示文字, 当有商品被勾选时显示图片容器, 盖住文字.
            let $jiesuanPicWrap = $('#totalPriceWrap .content .imgWrap');
            $jiesuanPicWrap.hide();

            //1.渲染购物车元素
            $.ajax({
                url: 'http://localhost/taobao/php/cart_getItemSid.php',
                data: {
                    username: $username
                },
                dataType: 'json'
            }).done((data) => {
                // console.log(data);
                let itemSidArr = [];
                for (let i = 0; i < data.length; i++) {
                    itemSidArr.push(data[i].itemSid);
                };
                // console.log(itemSidArr);
                $.ajax({
                    url: 'http://localhost/taobao/php/cart_getItemData.php',
                    data: {
                        arr: itemSidArr
                    },
                    dataType: 'json'
                }).done((data) => {
                    // console.log(data);
                    let strhtml = '';
                    for (let i = 0; i < data.length; i++) {
                        strhtml += `
                        <div class="item" sid="${data[i].sid}">
                            <div class="checkBtnWrap">
                                <input type="checkbox" class="checkbox">
                            </div>
                            <div class="picWrap">
                                <img src="${data[i].url}" alt="">
                            </div>
                            <div class="nameWrap">
                                <p>${data[i].title}</p>
                            </div>
                            <div class="speciWrap">规格</div>
                            <div class="priceWrap">
                                <span>¥</span>
                                <span class="price">${data[i].price}</span>
                            </div>
                            <div class="quantityWrap">
                                <button class="reduce">-</button>
                                <input type="text">
                                <button class="increase">+</button>
                            </div>
                            <div class="delBtnWrap">删除</div>
                        </div>
                        `;
                    };
                    $itemWrap.html(strhtml);

                    //2.渲染文字: 全部商品旁边显示商品数量.
                    let $titleNum = $('#main .header .titleWrap span');
                    let $itemNum = $itemWrap.find('.item').length;
                    $titleNum.html('全部商品(' + $itemNum + ')');

                    //四.勾选商品.
                    let $checkbox = $('.checkbox').not('.checkAll'); //商品自带的勾选框.
                    // console.log($checkbox);

                    //1.勾选单个商品
                    $checkbox.on('click', function () {
                        //1.1勾选或取消勾选商品时结算界面的图片和价格会变化.
                        // let $(this) = $(this);//点击的勾选框.
                        let $item = $(this).parent().parent();//点击的勾选框的商品.
                        let $totalPriceNow = +$('#totalPriceWrap span.price').html();//当前结算界面总价.
                        let $price = +$item.find('div.priceWrap').find('span.price').html();//勾选商品的单价.
                        let $quantity = +$item.find('.quantityWrap').find('input').val();//勾选商品的数量.

                        //勾选时 结算明细出现对应商品的图片, 当前总价要加上勾选的商品的 价格*数量.
                        if ($(this).prop('checked') === true) {
                            //显示图片
                            $jiesuanPicWrap.show();//显示结算明细界面的图片的容器.
                            let img = new Image();
                            img.src = $item.find('img').attr('src');
                            $(img).attr('sid', $item.attr('sid'));//结算界面的图片有跟对应商品一样的sid.
                            $jiesuanPicWrap.append(img);

                            //加上价格.
                            $totalPriceNow += $price * $quantity; //最终的总价.
                            $priceWrap.html($totalPriceNow.toFixed(2));//把总价放入价格容器中.

                        } else { //取消勾选时 结算明细去掉对应商品的图片, 减去对应 商品价格*数量
                            //去掉图片.
                            $jiesuanPicWrap.find('img[sid=' + $item.attr('sid') + ']').remove();
                            //减去价格.
                            $totalPriceNow -= $price * $quantity; //最终的总价.
                            // console.log($price.toFixed(2));
                            $priceWrap.html($totalPriceNow.toFixed(2));//把总价放入价格容器中.
                            //当结算明细中没有商品时 隐藏图片容器, 显示文字.
                            if ($jiesuanPicWrap.find('img').length == 0) {
                                $jiesuanPicWrap.hide();
                            }
                        };
                        // $('.checkbox').not('.checkAll').size()
                        //1.2当所有商品勾选时 全选按钮自动勾选.
                        if ($('input:checked').not('.checkAll').size() === $checkbox.size()) {
                            $checkAll.prop('checked', true);
                        } else {
                            $checkAll.prop('checked', false);
                        };
                    });

                    //2.全选商品:点击全选, 勾上所有商品.
                    $checkAll.on('click', function () {
                        //全选商品, 结算明细出现所有商品相关信息.
                        // console.log($checkAll.prop('checked'));
                        if ($checkAll.prop('checked') === true) {
                            //要考虑到, 全选前 已有商品被勾选的情况, 此时要把已勾选商品以外的商品放入明细.
                            //点击全选框, 找到所有没勾选的商品, 勾选上.
                            //通过触发商品的勾选框的点击事件做这个效果.
                            $checkbox.each(function (i, e) {
                                if ($(e).prop('checked') === false) {
                                    $(e).click();
                                }
                            })
                        } else {
                            //当全选框取消勾选之前, 所有商品肯定是勾选状态, 此时触发所有商品勾选框的点击事件, 就能取消所有商品勾选.
                            $checkbox.click();
                        }
                    });

                    //3.点击全选的文字, 触发全选框的点击事件.
                    $('#main .chooseAllWrap span').on('click', function () {
                        $checkAll.click();
                    });

                    //五.删除商品.
                    //1.点击商品自带的删除.
                    let $delBtn = $('.delBtnWrap');//商品自带的删除按钮.
                    $delBtn.on('click', function () {
                        //1.1从页面上删除结构.
                        let $item = $(this).parent();
                        let $totalPriceNow = +$('#totalPriceWrap span.price').html();//当前结算界面总价.
                        let $price = +$item.find('div.priceWrap').find('span.price').html();//勾选商品的单价.
                        let $quantity = +$item.find('.quantityWrap').find('input').val();//勾选商品的数量.

                        $item.remove();
                        //1.2从数据表格中删除数据.
                        let $delItemSid = $(this).parent().attr('sid');
                        $.ajax({
                            url: 'http://localhost/taobao/php/cart_delItemSidFromCart.php',
                            data: {
                                sid: $delItemSid
                            },
                            dataType: 'json'
                        });

                        //1.3每次删除商品后 文字'全部商品(数量)'的数量要重新获取
                        let $itemNum = $itemWrap.find('.item').length;//每次删除商品时获取删除后的商品总数.
                        $titleNum.html('全部商品(' + $itemNum + ')');

                        //1.4去掉结算界面中对应的图片.
                        $jiesuanPicWrap.find('img[sid=' + $item.attr('sid') + ']').remove();

                        //1.5减去结算界面中对应的商品价格*数量.
                        $totalPriceNow -= $price * $quantity;
                        $priceWrap.html($totalPriceNow.toFixed(2));

                        //1.6所有商品勾选, 全选框自动勾选, 此时1个1个删除商品, 删除最后1个时 全选框应该取消勾选.
                        if ($itemWrap.find('.item').length == 0) {
                            $checkAll.prop('checked', false);
                        };
                    });

                    //2.删除勾选的商品.
                    let $delCheckedItemBtn = $('#main .btnWrap .delete');
                    $delCheckedItemBtn.on('click', function () {
                        //准备1个数组, 把所有勾选的商品的sid放入数组, 把数组传给后端, 后端一次性删除.
                        let checkedItemSidArr = [];
                        let $totalPriceNow = +$('#totalPriceWrap span.price').html();//当前结算界面总价.
                        let checkedTotalPrice = 0;
                        $('input:checked').not('.checkAll').each(function (index, element) {
                            let $item = $(element).parent().parent();
                            checkedItemSidArr.push($item.attr('sid'));
                            //2.1删除页面元素结构.
                            $item.remove();

                            //2.2删除结算界面中对应的图片.
                            $jiesuanPicWrap.find('img[sid=' + $item.attr('sid') + ']').remove();

                            //2.3计算单个商品的总价, 并累加, 在循环结束后当前结算总价-累加的值.
                            let $price = +$item.find('div.priceWrap').find('span.price').html();//勾选商品的单价.
                            let $quantity = +$item.find('.quantityWrap').find('input').val();//勾选商品的数量.
                            checkedTotalPrice += $price * $quantity;
                        });
                        $priceWrap.html(($totalPriceNow - checkedTotalPrice).toFixed(2));

                        //2.4所有商品被勾选, 且删除后, 全选框自动取消勾选.
                        if ($itemWrap.find('.item').length == 0) {
                            $checkAll.prop('checked', false);
                        }

                        //2.5删除选中商品后 文字'全部商品(数量)'的数量要重新计算.
                        let $itemNum = $itemWrap.find('.item').length;
                        $titleNum.html('全部商品(' + $itemNum + ')');

                        //2.6若所有商品被删除, 要隐藏结算界面中的图片容器, 让文字显示.
                        if ($jiesuanPicWrap.find('img').length == 0) {
                            $jiesuanPicWrap.hide();
                        }

                        //2.7删除数据.
                        $.ajax({
                            url: 'http://localhost/taobao/php/cart_delItemSidArr.php',
                            data: {
                                arr: checkedItemSidArr
                            },
                            dataType: 'json'
                        });
                    });

                    //四.按钮点击事件
                    $('.quantityWrap input').val(1);//每个商品的数量一开始显示1.
                    let $addBtn = $('.quantityWrap .increase');//减按钮
                    let $reduceBtn = $('.quantityWrap .reduce');//加按钮

                    //1.点击加按钮增加数量, 改变结算界面内容:增加对应数量的总价.
                    $addBtn.on('click', function () {
                        let $item = $(this).parent().parent();//商品.
                        let $price = +$item.find('.priceWrap .price').html();//商品单价.
                        let $input = $(this).siblings('input');
                        let $totalPriceNow = +$('#totalPriceWrap span.price').html();//当前结算界面总价.

                        $input.val(+$input.val() + 1);//数量+1.
                        if ($item.find('input.checkbox').prop('checked') === true) {//当前商品若被勾选, 点击加按钮时在结算界面的总价上 加上当前商品的单价.
                            $totalPriceNow += $price;
                            $priceWrap.html($totalPriceNow.toFixed(2));
                        };

                        //点一次加按钮, 减按钮就可点击.
                        $(this).siblings('button.reduce').css({ cursor: 'pointer' });
                    });

                    //2.点击减按钮减少数量, 改变结算界面内容:减少对应数量的总价.
                    $reduceBtn.on('click', function () {
                        let $item = $(this).parent().parent();//商品.
                        let $price = +$item.find('.priceWrap .price').html();//商品单价.
                        let $input = $(this).siblings('input');//商品数量输入框.
                        let $totalPriceNow = +$('#totalPriceWrap span.price').html();//当前结算界面总价.

                        //点击减按钮, 根据数量判断是否可-1.
                        if ($input.val() > 1) { //点击减按钮, 当数量>1时 可以-1;
                            $input.val(+$input.val() - 1);
                            if ($input.val() == 1) {
                                $(this).css({ cursor: 'not-allowed' });
                            };
                            if ($item.find('input.checkbox').prop('checked') === true) {//当前商品若被勾选, 点击减按钮时在结算界面的总价上 减去当前商品的单价.
                                $totalPriceNow -= $price;
                                $priceWrap.html($totalPriceNow.toFixed(2));
                            };
                        } else {
                            //当数量<=1时 减按钮无法点击.
                            $(this).css({ cursor: 'not-allowed' });
                            return;
                        };
                    });
                })
            });
        }
    }
})
define(['public2007', 'jquery'], function (public2007) {
    return {
        init: function () {
            $banner = $('.banner');
            $piclist = $('.banner ul');
            $picli = $('.banner ul li');
            $btnli = $('.banner ol li');
            $leftarrow = $('#left');
            $rightarrow = $('#right');
            $index = null; //索引
            $timer = null;
            // $ulwidth = $piclist.width();

            //点击btnli，对应的元素添加类active
            $btnli.each(function (i, element) {
                $(element).on('click', function () {
                    $index = i - 1; //存储索引
                    tabswitch();
                })
            })

            //3.显示左右箭头
            $banner.on('mouseover', function () {
                $leftarrow.css({ display: 'block' });
                $rightarrow.css({ display: 'block' });
                clearInterval($timer);
            })


            $banner.on('mouseout', function () {
                $leftarrow.css({ display: 'none' });
                $rightarrow.css({ display: 'none' });
                // $timer = setInterval(function () {
                //     $rightarrow.click();
                // }, 2000);
            })

            //4.箭头事件
            $rightarrow.on('click', function () {
                tabswitch();
            });
            $leftarrow.on('click', function () {
                $index -= 2;
                tabswitch();
            });

            //5.自动轮播
            // $timer = setInterval(function () {
            //     $rightarrow.click();
            // }, 2000);

            //页面宽度改变时 获取新的ul宽度.
            $(window).on('resize', function () {
                clearInterval($timer);
                let $newUlWidth = $piclist.width();
                $piclist.css({ left: -$index * $newUlWidth });

                // $timer = setInterval(function () {
                //     $rightarrow.click();
                // }, 2000);
            });


            function tabswitch() {
                let $ulwidth = $piclist.width();

                $index++;
                //触发的是当前元素的下一个元素
                //右箭头的条件
                if ($index === $btnli.length + 1) { //$btnli.length=5
                    $piclist.css({ left: 0 });
                    $index = 1;
                }
                //左箭头的条件
                if ($index === -1) {
                    $piclist.css({ left: -$ulwidth * $btnli.length });
                    $index = $btnli.length - 1;
                }
                //添加active
                // for (let i = 0; i < $btnli.length; i++) {
                //     $btnli[i].className = '';
                // }
                // $btnli.each(function (i, e) {
                //     $(e).addClass('');
                // })
                //接收类名的索引0-4
                if ($index !== $btnli.length) { //$btnli.length=5, 当$index=5时 第一个圆圈active, $index!==5的情况更多, 所以写在if里.
                    $($btnli[$index]).addClass('active').siblings('li').removeClass('active');
                } else {//否则说明 $index=$btnli.length=5, 第一个圆圈active.
                    $($btnli[0]).addClass('active').siblings('li').removeClass('active');
                }
                //运动
                $piclist.animate({
                    left: -$index * $ulwidth
                });
                // document.title = this.index;
            };
        }
    }
})

define(['pagination'], function () {

    return {
        init: function () {
            let array_default = [];//排序前的li数组;
            let array = [];//排序中的数组
            let prev = null;
            let next = null;

            // //1.渲染列表的数据-默认渲染第一页
            const $list = $('.list');
            $.ajax({
                url: 'http://localhost/taobao/php/listData.php',
                dataType: 'json' //设置json格式的对象。
            }).done(function (data) {
                let $strhtml = '<ul>'; //拼接字符串
                $.each(data, function (index, value) {
                    //下面img是懒加载的用的, 我测试 不想要懒加载 很麻烦, 先拿出来 用普通的img.
                    // <img class="lazy" data-original="${value.url}" width="200" height="200">
                    $strhtml += `
                    <li>
                        <a href="detail.html?sid=${value.sid}" target="_blank">
                            <img src="${value.url}" width="200" height="200">
                            <p>${value.sid}${value.title}</p>
                            <span class="price">¥${value.price}</span>
                            <span>${value.sailnumber}</span>
                        </a>
                    </li>
                    `;
                });
                $strhtml += '</ul>';
                $list.html($strhtml);

                array_default = [];//排序前的li数组;
                array = [];//排序中的数组
                prev = null;
                next = null;
                $('.list li').each(function (index, element) {
                    array[index] = $(this);
                    array_default[index] = $(this);
                });
                //添加懒加载, 懒加载是滚轮触发的.
                // $(function () {
                //     $("img.lazy").lazyload({ effect: "fadeIn" })
                // });
            });

            // //渲染的外部无法获取内部的元素对象. 通过事件委托实现.

            // // 2.告知后端当前请求的是第几页数据, 将当前额的页面页码传递给后端(get和page)

            $('.page').pagination({
                pageCount: 3,//总页数
                jump: false,//是否开启跳转到指定页数, 布尔值
                coping: true,//是否开启 首页和尾页, 布尔值
                prevContent: '上一页',
                nextContent: '下一页',

                callback: function (api) {
                    console.log(api.getCurrent());
                    $.ajax({
                        url: 'http://localhost/taobao/php/listData.php',
                        data: {
                            page: api.getCurrent()
                        },
                        dataType: 'json'
                    }).done(function (data) {
                        let $strhtml = '<ul>'; //拼接字符串
                        $.each(data, function (index, value) {
                            $strhtml += `
                            <li>
                                <a href="detail.html?sid=${value.sid}" target="_blank">
                                    <img src="${value.url}" width="200" height="200">
                                    <p>${value.sid}${value.title}</p>
                                    <span class="price">¥${value.price}</span>
                                    <span>${value.sailnumber}</span>
                                </a>
                            </li>
                            `;
                        });
                        $strhtml += '</ul>';
                        $list.html($strhtml);

                        //重置数组
                        //将页面的li元素加载到2个数组中.
                        array_default = [];//排序前的li数组;
                        array = [];//排序中的数组
                        prev = null;
                        next = null;
                        $('.list li').each(function (index, element) {
                            array[index] = $(this);
                            array_default[index] = $(this);
                        });
                    });
                }
            });

            //3.排序
            //3.1默认排序
            $('button').eq(0).on('click', function () {
                $.each(array_default, function (index, value) {
                    $('.list ul').append(value);
                });
                return;
            });

            //3.2升序
            $('button').eq(1).on('click', function () {
                for (let i = 0; i < array.length - 1; i++) {
                    for (let j = 0; j < array.length - 1; j++) {
                        prev = parseFloat(array[j].find('.price').html().substring(1));
                        next = parseFloat(array[j + 1].find('.price').html().substring(1));
                        //通过价格判断, 改变的是li的位置.
                        if (prev > next) {
                            let temp = array[j];
                            array[j] = array[j + 1];
                            array[j + 1] = temp;
                        }
                    }
                }
                $.each(array, function (index, value) {
                    console.log(value);
                    $('.list ul').append(value);
                });
            });

            //3.3降序
            $('button').eq(2).on('click', function () {
                for (let i = 0; i < array.length - 1; i++) {
                    for (let j = 0; j < array.length - 1; j++) {
                        prev = parseFloat(array[j].find('.price').html().substring(1));
                        next = parseFloat(array[j + 1].find('.price').html().substring(1));
                        //通过价格判断, 改变的是li的位置.
                        if (prev < next) {
                            let temp = array[j];
                            array[j] = array[j + 1];
                            array[j + 1] = temp;
                        }
                    }
                }
                $.each(array, function (index, value) {
                    console.log(value);
                    $('.list ul').append(value);
                });
            });
        }
    }
})
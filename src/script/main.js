// require.config({
//     paths: {
//         'jquery': 'https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.min',
//         'jcookie': 'https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.0/jquery.cookie.min',
//         'jlazyload': 'https://cdn.bootcdn.net/ajax/libs/jquery.lazyload/1.8.3/jquery.lazyload.min'
//     },
//     shim: {
//         'jcookie': {
//             deps: ['jquery'],
//             exports: 'jcookie'
//         },
//         'jlazyload': {
//             deps: ['jquery'],
//             exports: 'jlazyload'
//         }
//     }
// })

// require.config({
//     paths: {
//         'jquery': './script/jquery.js',
//         'jcookie': './script/jcookie.js',
//         'jlazyload': './script/jlazyload.js'
//     },
//     shim: {
//         'jcookie': {
//             deps: ['jquery'],
//             exports: 'jcookie'
//         },
//         'jlazyload': {
//             deps: ['jquery'],
//             exports: 'jlazyload'
//         }
//     }
// });

// require(['jquery', 'jcookie', 'jlazyload'], function () {
//     //用jquery的方法来获取id选择器为 #currentPage的元素(script), 再获取该元素下的自定义属性data-page 的值, 这样就获取到了 模块index_module的名称;
//     let pageMod = $('#currentPage').attr('data-page');

//     //变量 pageMod 就可代表 index_module的名称.
//     require([pageMod], function (page) {
//         //调用模块里的方法 init, 当然那个模块里此时什么都还没写, 现在只是在配置模块, 也就是做结构, 结构做好了再按照结构写代码;
//         page.init();
//     })
// })

require(['jquery'], function () {
    let pageMod = $('#currentPage').attr('data-page');

    require([pageMod], function (page) {
        page.init();
    })
})


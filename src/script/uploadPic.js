
define(['public2007'], function (public2007) {
    return {
        init: function () {
            // console.log('uploadPic:', public2007);

            //2.上传图片搜索商品的 相关效果.
            //$searchByPic是 文字'搜同款'所在的容器
            let $searchByPic = $('.searchByPicWrap .searchByPic');

            //$uploadPic是 上传图片界面 的最大容器
            let $uploadPic = $('.searchByPicWrap .uploadPic');

            //$uploadbtnDiv是 上传图片界面中 底部的上传图片按钮
            let $uploadbtnDiv = $('.searchByPicWrap .uploadbtn');

            //$uploadbtnInput是 点击上传图片按钮后 真正点击的按钮
            let $uploadbtnInput = $('.uploadPic input');

            //$retryBtn 是隐藏的 重试按钮, 当上传的图片格式不符合时 显示.
            let $retryBtn = $('.searchByPicWrap .retryBtn');

            //$searchBtn 是隐藏的 搜索按钮, 当上传的图片正常上传后 显示.
            let $searchBtn = $('.searchByPicWrap .searchBtn');

            //$tipWordWrap是提示文字所在的容器
            let $tipWordWrap = $('.searchByPicWrap .tipWordWrap');

            //$closebtn 是上传图片界面中 右上角的关闭按钮
            let $closebtn = $('.searchByPicWrap .uploadPic .title img');

            //获取picPlace中的文字
            let $picPlaceText = $('.uploadPic .picPlace span');

            //原文字 $originalText
            let $originalText = $picPlaceText.html();

            //2.1鼠标移入移出 '搜同款', 提示文字显示 和 消失.
            $searchByPic.on('mouseover', function () {
                $tipWordWrap.css({ display: 'flex' });

                //上传图片界面 显示时 鼠标移入 搜同款, 不能让提示文字显示.
                if ($uploadPic.css('display') === 'flex') {
                    $tipWordWrap.css({ display: 'none' });
                } else {
                    $tipWordWrap.css({ display: 'flex' });
                }
            })
            $searchByPic.on('mouseout', function () {
                $tipWordWrap.css({ display: 'none' });
            })

            //2.2点击 搜同款, 下面出现 上传图片的界面
            $searchByPic.on('click', function () {
                //出现上传图片的界面
                $uploadPic.css({ display: 'flex' });

                //鼠标点击 '搜同款' 提示文字消失.
                $tipWordWrap.css({ display: 'none' });
            });

            //2.3点击 上传图片按钮 出现选择文件的界面
            $uploadbtnDiv.on('click', function () {
                $uploadbtnInput.click();
            })

            //给重试按钮, 添加事件, 点击该按钮 调用函数originalState, 上传界面恢复到原样.
            $retryBtn.on('click', function () {
                originalState();
                //要点击 重试按钮时, 说明上传过 不符合格式要求的图, 所以此时input里有图, 设这图是a, 我点击重试后 上传界面恢复到原样, 然后再点击上传按钮, 这次还是上传图片a, 这次不会出现 格式错误的提示, 因为第一次上传时 上传了图a, 第二次上传还是上传图a的话 input的内容没有改变 不会触发change事件, 所以 不会出现格式错误的提示.

                //所以, 点击重试按钮把上传界面恢复原样的同时 还要把input内容清空.
                $uploadbtnInput.prop('value', '');
            })

            //2.4 选择文件后, 元素picPlace中原文字改变, 出现进度条, 进度条结束后 出现选择的图片
            $uploadbtnInput.on('change', function (event) {
                //有时在选择文件的界面中 不选择文件 也会触发change事件, 此时因为 没有选择文件 也就不存在event.target.files[0], 所以要先判断event.target.files[0]是否存在.
                //file: 获取选择的文件
                const file = event.target.files[0];
                let imgFormat = null;
                if (file) {//若存在file, 就获取file中的图片的格式.
                    //获取图片格式
                    imgFormat = file.name.match(/\..*/)[0].replace(/\./, '');
                } else {//若不存在file, 就结束事件
                    return;
                }

                //reader: 使用该对象下的方法读取文件内容
                const reader = new FileReader();

                //判断图片的格式, 若格式符合要求 就上传图片.
                if (imgFormat == 'jpg' || imgFormat == 'jpeg' || imgFormat == 'png') {
                    //改变原文字
                    $picPlaceText.html('正在上传图片');

                    //在原文字下插入1个div.progressBar 作为进度条
                    $picPlaceText.after('<div class="progressBar"></div>');

                    //获取进度条, 设置进度条样式
                    let $progressBar = $('.progressBar');
                    $progressBar.css({
                        //进度条宽度跟是 文字高度的一半
                        height: parseInt($picPlaceText.css('height')) / 2 + 'px'
                    })

                    //缓冲运动 让进度条变长的效果 可见.
                    public2007.bufferMove($progressBar[0], {
                        width: $picPlaceText.width()
                    })

                    if (file.type.startsWith('text/')) {
                        reader.readAsText(file);
                    } else {
                        reader.readAsDataURL(file);
                    }

                    //对选择的图片进行操作.
                    reader.onload = function (e) {
                        setTimeout(function () {
                            //在元素picPlace里添加图片, 添加后 隐藏原来的内容 只显示图片.
                            $('.uploadPic .picPlace .innerBox').after('<img src=' + e.target.result + ' ' + 'alt=""' + ' ' + 'class="itemPic"' + '>').hide();

                            //显示图片的同时去掉进度条.
                            $progressBar.remove();

                            //显示 搜索按钮
                            $searchBtn.css({
                                display: 'block'
                            });
                            //隐藏 重试按钮
                            $retryBtn.css({
                                display: 'none'
                            });
                            //隐藏 上传按钮
                            $uploadbtnDiv.css({
                                display: 'none'
                            });


                        }, 1000)
                    };

                } else {//走这里, 说明图片格式不符合要求.
                    // console.log('不符合');
                    $picPlaceText.html('仅支持 jpeg、png 格式图片上传哦～');

                    //出现重试按钮
                    $retryBtn.css({
                        display: 'block'
                    });
                    //隐藏 上传按钮
                    $uploadbtnDiv.css({
                        display: 'none'
                    });
                    //隐藏 搜索按钮
                    $searchBtn.css({
                        display: 'none'
                    });

                }
            })

            //2.5 ctrl+v可粘贴复制的图片, 显示在放图片的位置.
            const fileByBase64 = (file, callback) => {
                const reader = new FileReader();
                // 传入一个参数对象即可得到基于该参数对象的文本内容
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    // target.result 该属性表示目标对象的 DataURL
                    callback(e.target.result);
                };
            };

            const base64ByBlob = (base64, callback) => {
                let arr = base64.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                callback(new Blob([u8arr], { type: mime }));
            };

            document.addEventListener('paste', function (event) {
                //已经粘贴一张img的情况下 再粘贴另一张图片, 淘宝的效果 是新的图片会替换 旧的.

                let items = event.clipboardData && event.clipboardData.items;
                let file = null;
                if (items && items.length) {
                    // 检索剪切板 items
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].type.indexOf('image') !== -1) {
                            // 此时file就是剪切板中的图片文件
                            file = items[i].getAsFile();
                            break;
                        }
                    }
                }
                //获取file中图片的格式, 若是符合要求的格式 就上传图片.
                let imgFormat = file.name.match(/\..*/)[0].replace(/\./, '');
                if (imgFormat == 'jpg' || imgFormat == 'jpeg' || imgFormat == 'png') {
                    //改变原文字
                    $picPlaceText.html('正在上传图片');

                    //在原文字下插入1个div.progressBar 作为进度条
                    $picPlaceText.after('<div class="progressBar"></div>');

                    //获取进度条, 进度条的 固定样式在scss文件里, 高度是根据其他元素的高度来的, 所以写在这里.
                    let $progressBar = $('.progressBar');
                    $progressBar.css({
                        //进度条宽度跟是 文字高度的一半
                        height: parseInt($picPlaceText.css('height')) / 2 + 'px',
                    })

                    //缓冲运动 让进度条变长的效果 可见.
                    public2007.bufferMove($progressBar[0], {
                        width: $picPlaceText.width()
                    })
                    fileByBase64(file, base64 => {
                        base64ByBlob(base64, (blob) => {
                            const url = window.URL.createObjectURL(blob);

                            if (!$('.uploadPic .picPlace .itemPic').length) {//粘贴事件触发时, 判断是否存在 img.itemPic元素, 若不存在 就把当前图片放上去.
                                setTimeout(function () {
                                    //在元素picPlace里添加图片元素, 添加后 隐藏原来的内容 只显示图片.
                                    $('.uploadPic .picPlace .innerBox').after('<img src=' + url + ' ' + 'alt=""' + ' ' + 'class="itemPic"' + '>').hide();

                                    //去掉进度条元素.
                                    $progressBar.remove();

                                    //显示 搜索按钮
                                    $searchBtn.css({
                                        display: 'block'
                                    });
                                    //隐藏 重试按钮
                                    $retryBtn.css({
                                        display: 'none'
                                    });
                                    //隐藏 上传按钮
                                    $uploadbtnDiv.css({
                                        display: 'none'
                                    });

                                    // console.log($progressBar.css('height'));
                                    //多次上传图片的情况, 会产生多个进度条元素, 所以图片上传完毕后, 删除进度条.
                                    $progressBar.remove();

                                }, 1000)

                            } else {
                                //若存在, 就用新图替换旧图.

                                //第一步, 先隐藏旧图.
                                $('.uploadPic .picPlace .itemPic').hide();

                                //替换时 进度条会出现, 进度条在 div.innerBox里面, 所以div.innerBox要先显示.
                                $('.uploadPic .picPlace .innerBox').show();

                                //插入进度条元素
                                $picPlaceText.after('<div class="progressBar"></div>');
                                //获取进度条元素.
                                let $progressBar = $('.progressBar');
                                //设置进度条高度.
                                $progressBar.css({
                                    height: parseInt($picPlaceText.css('height')) / 2 + 'px',
                                })
                                //进度条缓冲运动 变长.
                                public2007.bufferMove($progressBar[0], {
                                    width: $picPlaceText.width()
                                })

                                setTimeout(function () {
                                    //在元素picPlace里添加图片, 添加后 隐藏原来的内容 只显示图片.
                                    $('.uploadPic .picPlace .innerBox').hide();
                                    //替换上一张图片的src.
                                    $('.uploadPic .picPlace .itemPic').prop('src', url);
                                    //显示图片的容器.
                                    $('.uploadPic .picPlace .itemPic').show();

                                    //去掉进度条元素.
                                    $progressBar.remove();
                                }, 1000)
                            }
                        });
                    });

                } else {//走这里说明图片格式不符合, 不上传图片, 出现提示文字.
                    // console.log('不符合');

                    //判断前面是否有 正常上传过图片, 若没有, 直接改变相关元素样式.
                    if (!$('.uploadPic .picPlace .itemPic').length) {
                        $picPlaceText.html('仅支持 jpeg、png 格式图片上传哦～');

                        //显示 重试按钮
                        $retryBtn.css({
                            display: 'block'
                        });
                        //隐藏 搜索按钮
                        $searchBtn.css({
                            display: 'none'
                        });

                        //隐藏 上传按钮
                        $uploadbtnDiv.css({
                            display: 'none'
                        });

                    } else {//若有, 就要把前面的图片清空 再改变相关元素样式.
                        //清空前面上传的图片.
                        $('.uploadPic .picPlace .itemPic').remove();

                        //替换时 进度条会出现, 进度条在 div.innerBox里面, 所以div.innerBox要先显示.
                        $('.uploadPic .picPlace .innerBox').show();

                        $picPlaceText.html('仅支持 jpeg、png 格式图片上传哦～');
                        //显示 重试按钮
                        $retryBtn.css({
                            display: 'block'
                        });
                        //隐藏 搜索按钮
                        $searchBtn.css({
                            display: 'none'
                        });
                        //隐藏 上传按钮
                        $uploadbtnDiv.css({
                            display: 'none'
                        });
                    }

                }
            });

            //封装函数 originalState, 把上传图片的界面恢复到上传图片前的样子.
            function originalState() {
                //显示原图片和 原文字
                $('.uploadPic .picPlace .innerBox').show();
                $picPlaceText.html($originalText);

                //显示 上传按钮
                $uploadbtnDiv.css({
                    display: 'block'
                });
                //隐藏 重试按钮
                $retryBtn.css({
                    display: 'none'
                });
                //隐藏 搜索按钮
                $searchBtn.css({
                    display: 'none'
                });

            }
            //2.6 点击上传图片界面中 右上角的叉, 关闭该界面, 再次打开后全部变回原样.
            $closebtn.on('click', function () {
                $uploadPic.css({ display: 'none' });

                //去掉上传的图片, 和进度条元素
                $('.uploadPic .picPlace .itemPic').remove();
                $('.uploadPic .picPlace .progressBar').remove();

                //清空input file元素的value.
                $uploadbtnInput.prop('value', '');

                //调用函数originalState, 上传界面恢复到原样.
                originalState();
            })

            //2.7问题: 鼠标 在上传图片的界面上时 形状是pointer, 问题原因应该是 上传图片界面 背后的元素的样式是 pointer.
            //目标效果是 鼠标在 上传和关闭按钮上时是pointer, 下面代码解决该问题.
            $uploadPic.on('mouseover', function () {
                $uploadPic.css({ cursor: 'default' })
            })
        }
    }
})

//缓冲运动(快-慢)
function bufferMove(obj, json, fn) {
    function getStyle(obj, attr) {
        if (window.getComputedStyle) {
            return window.getComputedStyle(obj)[attr];
        } else {
            return obj.currentStyle[attr]
        }
    }
    let speed = 0;
    clearInterval(obj.timer);
    obj.timer = setInterval(() => {
        let flag = true;
        for (let attr in json) {
            var currentValue = null;
            if (attr === 'opacity') {
                currentValue = Math.round(getStyle(obj, attr) * 100);
            } else {
                currentValue = parseInt(getStyle(obj, attr));
            }
            speed = (json[attr] - currentValue) / 10;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if (currentValue !== json[attr]) {
                if (attr === 'opacity') {
                    obj.style.opacity = (currentValue + speed) / 100;
                } else {
                    obj.style[attr] = currentValue + speed + 'px';
                }
                flag = false;
            }
        }
        if (flag) {
            clearInterval(obj.timer);
            fn && typeof fn === 'function' && fn();
        }
    }, 1000 / 60);
};


//ajax对象
function ajaxGetData() {
    function objToString(obj) {
        if (Object.prototype.toString.call(obj) === '[object Object]') { //对象
            let arr = [];
            for (let i in obj) {
                arr.push(i + '=' + obj[i])
            }
            return arr.join('&')
        }
    }

    function ajax(option) { //option:对象
        let promise = new Promise((resolve, reject) => {
            let ajax = new XMLHttpRequest();
            option.type = option.type || 'get';
            if (!option.url) {
                throw new Error('接口地址不能为空');
            }
            if (option.data && Object.prototype.toString.call(option.data) === '[object Object]') {
                option.data = objToString(option.data);
            }
            if (option.data && option.type === 'get') {
                option.url += '?' + option.data;
            }
            if (option.async === 'false' || option.async === false) {
                option.async = false
            } else {
                option.async = true
            }
            ajax.open(option.type, option.url, option.async);

            if (option.data && option.type === 'post') {
                ajax.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
                ajax.send(option.data);
            } else {
                ajax.send();
            }
            if (option.async) {
                ajax.onreadystatechange = function () {
                    if (ajax.readyState === 4) {
                        if (ajax.status === 200) {
                            //这里发生变化。
                            resolve(ajax.responseText)
                            // option.success && typeof option.success === 'function' && option.success(ajax.responseText);
                        } else {
                            // option.error && typeof option.error === 'function' && option.error('接口地址有误')
                            reject('接口地址有误')
                        }
                    }
                };
            } else {
                if (ajax.status === 200) {
                    resolve(ajax.responseText);
                } else {
                    reject('接口地址有误');
                }
            }
        });
        return promise;
    }
};


//用flex做自定义瀑布流
function waterFallLayOut() {
    class WaterFall {
        constructor(obj) {
            this.container = document.getElementById(obj.id);
            this.imgUrls = obj.url;
            this.secArr = [];
        }

        //render: 创建列, 图片, 图片的容器.
        render() {
            for (let i = 0; i < this.imgUrls.length; i++) {
                let p = new Promise((resolve, reject) => {
                    resolve(this.imgUrls[i]);
                })

                p.then((res) => {//这个res是url.
                    let img = new Image();
                    img.src = res;

                    let sec = document.createElement('section');
                    sec.appendChild(img);
                    this.secArr[i] = sec;
                })
            }
            setTimeout(() => {
                console.log(this.secArr);
                this.arrange();
            }, 1000 / 16) //约0.06s
        }

        //arrange: 排列图片.
        arrange() {
            let colNum = Math.floor(window.innerWidth / 200); //列数.
            this.container.style.width = (200 * colNum) + 'px';
            for (let i = 0; i < colNum; i++) {
                let column = document.createElement('div');
                column.className = 'column';
                this.container.appendChild(column);
            }
            //获取所有列
            let allCols = document.querySelectorAll('.column');

            function setSec(div, sec) {
                div.appendChild(sec);
            }
            function getMinH(arr) {
                let flag = { height: arr[0], column: 0 };
                for (let i = 1; i < arr.length; i++) {
                    if (flag.height > arr[i]) {
                        flag.height = arr[i];
                        flag.column = i;
                    }
                }
                return flag;
            }
            let perColumnH = [];

            for (let i = 0; i < this.secArr.length; i++) {
                if (perColumnH.length < colNum) {
                    setSec(allCols[i], this.secArr[i]);
                    perColumnH[i] = this.secArr[i].offsetHeight;
                } else {
                    let minH = getMinH(perColumnH);
                    setSec(allCols[minH.column], this.secArr[i]);
                    perColumnH[minH.column] += this.secArr[i].offsetHeight;
                }
            }
        }
    }

};

//cookie的存取删
let cookie = {
    set: function (key, value, day) {
        let date = new Date();
        date.setDate(date.getDate() + day);
        document.cookie = `${key}=${encodeURIComponent(value)};expires=${date};path=/`;
    },
    get: function (key) {
        let arr = decodeURIComponent(document.cookie).split('; ');
        for (let value of arr) {
            let newarr = value.split('=');
            if (newarr[0] === key) {
                return newarr[1];
            }
        }
    },
    remove: function (key) {
        this.set(key, '', -1);
    }
}
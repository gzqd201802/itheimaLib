(function () {
    "use strict";
    //  创建初始变量 hm
    var hm;

    //  选择器选择元素
    var selectElements = function (selector, context) {
        // 没有上下文默认使用 document
        context = context || document;
        // 转换成普通数组
        return toArray(context.querySelectorAll(selector));
    };
    // 转换方法 toArray
    var toArray = function (obj) {
        var arr = [];
        var i = obj.length;
        while (i--) {
            arr[i] = obj[i];
        }
        return arr;
    };

    var addPx = function (property, value) {
        // 可以没有 px 单位的属性
        var noPx = [
            "opacity",
            "z-index",
            "zIndex",
            "font-weight",
            "fontWeight",
            "line-height",
            "lineHeight",
            "overflow",
            "display",
            "color",
            "backgroundColor"
        ];
        // 如果设置的是不需要带 px 的属性，直接返回属性值
        if (noPx.indexOf(property) > -1) return value;
        // 添加 px 单位
        var stringValue = value + "px";
        // 返回带 px 的单位
        return stringValue;
    }

    // 初始化 Init 方法
    var Init = function (selector, context) {
        // 如果是字符串
        if (typeof selector === "string") {
            // 调用选择元素的方法
            let dom = selectElements(selector, context);
            Array.prototype.push.apply(this,dom);
        }
        // 如果是函数，调用入口函数
        else if (typeof selector === "function") {
            document.addEventListener('DOMContentLoaded', selector);
            return this;
        }
        // 选中 NodeList 或者 HTMLCollection
        else if (
            selector instanceof NodeList ||
            selector instanceof HTMLCollection
        ) {
            let dom = toArray(selector);
            Array.prototype.push.apply(this,dom);
        }
        // 或者原本已经是 Init 实例
        else if (selector instanceof Init) {
            return selector;
        } else if (selector instanceof Element) {
            this[0] = selector;
            // this.dom = [selector];
            this.length = 1;
            this.selector = selector;
            return this;
        }
        // 给元素添加元素
        this.length = this.length || 0;
        this.selector = selector ? selector : null;
    };

    // 原型添加方法
    // 获取 dom 元素的方法
    Init.prototype.get = function (index) {
        // 如果传入负数的情况
        if (index < 0) {
            index += this.length;
        }
        // 返回查找的元素
        return this[index];
    }
    // each 方法，用于遍历 dom 元素的核心方法 !!!
    Init.prototype.each = function (callback) {
        // 数组长度
        var len = this.length;
        // 遍历数组
        for (var i = 0; i < len; i++) {
            // 提取每个 dom 元素
            var node = this[i];
            // 调用回调函数，call 改变 函数内 this 指向
            callback.call(node, i, node);
        }
        // 链式编程
        return this;
    }
    // attr() 方法，操作元素属性
    Init.prototype.attr = function (name, value) {
        // 如果参数2 是 字符串 或 数值型
        if (typeof value === "string" || typeof value === "number") {
            return this.each(function () {
                this.setAttribute(name, value);
            });
            // return this;
        }
        // 如果参数1 是对象
        if (typeof name === "object") {
            //  获取对象的属性名数组
            var attrNames = Object.keys(name);
            //  获取对象属性的 长度
            var attrNamesLen = attrNames.length;
            // each 遍历，最后返回 this
            return this.each(function () {
                // for 循环属性名
                for (var i = 0; i < attrNamesLen; i++) {
                    var attr = attrNames[i];
                    // 设置属性
                    this.setAttribute(attr, name[attr])
                }
            })
        }
        // 如果传入一个属性名，获取集合中第一个元素的属性值
        var el = this.get(0);
        // 如果集合为空
        if (!el) return;
        // 获取属性
        var attrValue = el.getAttribute(name);
        // 处理返回值 null 的情况，保持数据格式统一
        if (attrValue === null) return undefined;
        // 返回属性值
        return attrValue;
    }
    // prop 方法
    Init.prototype.prop = function(name,value){
        if(value != undefined){
            return this.each(function(){
                this.setAttribute(name,value);
            })
        }else if(typeof name === 'object'){
            return this.each(function(){
                for(let key in name){
                    if(name.hasOwnProperty(key))
                    this.setAttribute(key,name[key]);
                }
            })
        }else {
            return this[0].getAttribute(name);
        }
    }
    // removeAttr
    Init.prototype.removeAttr = function(name){
        return this.each(function(){
            this.removeAttribute(name);
        })
    }

    // css 方法，操作行内样式
    Init.prototype.css = function (property, value) {
        // 需要考虑是否为数值，数值是否需要带单位
        if (typeof value === "string") {
            return this.each(function () {
                // 把属性直接设置
                this.style[property] = value;
            });
        }
        // 如果是数值，考虑是否带 px
        if (typeof value === "number") {
            // 需要考虑是否带单位
            return this.each(function () {
                // 调用添加 px 方法，支持属性添加 px
                this.style[property] = addPx(property, value);
            });
        }
        // 如果是对象，多属性设置
        if (typeof property === "object") {
            //  获取对象的属性名数组
            var propertyNames = Object.keys(property);
            //  获取对象属性的 长度
            var propertyNamesLen = propertyNames.length;
            // each 遍历，最后返回 this
            return this.each(function () {
                // for 循环属性名
                for (var i = 0; i < propertyNamesLen; i++) {
                    var prop = propertyNames[i];
                    // 设置属性，调用添加 px 方法，支持属性添加 px
                    this.style[prop] = addPx(prop, property[prop]);
                }
            })
        }
        // 单属性获取
        var el = this.get(0);
        if (!el) return;
        // return getComputedStyle(el).getPropertyValue(property);
        return getComputedStyle(el)[property];
    }

    // 获取和设置宽度
    Init.prototype.width = function (val) {
        if (val != undefined) {
            return this.css('width', value);
        } else {
            return parseFloat(this.css('width'));
        }
    }
    // 获取和设置高度
    Init.prototype.height = function (val) {
        if (val != undefined) {
            return this.css('height', value);
        } else {
            return parseFloat(this.css('height'));
        }
    }

    // 添加类
    Init.prototype.addClass = function (className) {
        // console.log(this);   // Init 实例
        // 遍历添加
        return this.each(function () {
            this.classList.add(className);
        });
        // 返回调用该函数的对象
        // return this;
    }
    // 移除类
    Init.prototype.removeClass = function (className) {
        return this.each(function () {
            this.classList.remove(className);
        });
        // return this;
    }
    // 切换类
    Init.prototype.toggleClass = function (className) {
        return this.each(function () {
            this.classList.toggle(className);
        });
        // return this;
    }
    // 是否有类判断
    Init.prototype.hasClass = function (className) {
        var i = this.length;
        while (i--) {
            var el = this.get(i);
            if (el.classList.contains(className)) return true;
        }
        return false;
    }
    // 获取和修改 HTML 内容
    Init.prototype.html = function (htmlString) {
        // 如果参数为空
        if (htmlString === undefined) {
            // 获取集合中第一个元素
            var el = this.get(0);
            // 如果结果为空，直接退出
            if (!el) return;
            // 返回第一个元素的内容
            return el.innerHTML;
        }
        // 传入参数则设置
        return this.each(function () {
            this.innerHTML = htmlString;
        });
    }
    // 获取和修改文本内容
    Init.prototype.text = function (text) {
        // 如果参数为空
        if (text === undefined) {
            // 获取集合中第一个元素
            var el = this.get(0);
            // 如果结果为空，直接退出
            if (!el) return;
            // 返回第一个元素的内容
            return el.innerText;
        }
        // 传入参数则设置
        return this.each(function () {
            this.innerText = text;
        });
    }

    // 表单元素value
    Init.prototype.val = function (val) {
        if (val === undefined) {
            let el = this.get(0);
            if (!el) return;
            return el.value;
        } else {
            return this.each(function (i, e) {
                e.value = val;
            });
        }
    }

    // show() 显示
    Init.prototype.show = function (speed, callback) {
        if (speed == undefined && callback == undefined) {
            return this.each(function () {
                this.style.display = "block";
            });
        }
        return this.each(function () {
            let height = $(this).height();
            let width = $(this).width();
            let opacity = parseFloat($(this).css('opacity'));
            this.style.display = "block";
            $(this).css({
                width: 0,
                height: 0,
                overflow: 'hidden',
                opacity: 0
            });
            $(this).animate({ width, height, opacity }, speed, function () {
                $(this).css({
                    overflow: '',
                    opacity: ''
                }).css('width', '').css('height', '');
                callback && callback.call(this);
            });
        });
    }
    // hide() 隐藏
    Init.prototype.hide = function (speed, callback) {
        if (speed == undefined && callback === undefined) {
            return this.each(function () {
                this.style.display = "none";
            });
        }
        return this.each(function () {
            $(this).css({
                overflow: 'hidden'
            });
            $(this).animate({ width: 0, height: 0, opacity: 0 }, speed, function () {
                $(this).css({
                    overflow: '',
                    opacity: '',
                    display: 'none'
                }).css('width', '').css('height', '');
                callback && callback.call(this);
            });
        });
    }
    // toggle() 切换
    Init.prototype.toggle = function (speed, callback) {
        return this.each(function (index) {
            if (getComputedStyle(this)["display"] === "none") {
                // this.style.display = "block";
                $(this).show(speed, callback);
            } else {
                // this.style.display = "none";
                $(this).hide(speed, callback);
            }
        });
    }

    // hm 方法，传入 selector 选择器 和  context 上下文
    hm = function (selector, context) {
        // 返回初始化的 Init 实例
        return new Init(selector, context);
    };

    // each 方法
    hm.each = function (obj, callback) {
        var length, i = 0;

        // 遍历
        if (obj instanceof Array) {
            length = obj.length;
            // for 遍历数组
            for (; i < length; i++) {
                // 如果返回值 false，跳出循环
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        } else {
            // for in 遍历 对象
            for (i in obj) {
                // 如果返回值 false，跳出循环
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        }
        // 返回遍历对象        
        return obj;
    }

    // 事件
    Init.prototype.on = function (type, selector, fn) {
        // 注册事件
        if (fn === undefined) {
            fn = selector;
            return this.each(function (i, e) {
                e.addEventListener(type, fn, false);
            })
        } else {
            // 事件委托
            return this.each(function (i, e) {
                e.addEventListener(type, (ev) => {
                    let list = Array.from(e.querySelectorAll(selector));
                    if (list.indexOf(ev.target) != -1) {
                        fn.call(ev.target, ev);
                    }
                });
            })
        }
    }

    // 表单
    Init.prototype.serialize = function () {
        let first = this.get(0);
        let kv = first.querySelectorAll('[name]');
        let arr = [];
        kv.forEach(function (e, i) {
            if (e.name.trim().length != 0) {
                arr.push(`${e.name}=${e.value}`);
            }
        })
        return arr.join('&');
    }

    // 动画部分
    function _animate(element, ani, speed, callback) {
        let init = {};
        let target = ani.props
        for (let key in target) {
            let cur = parseFloat(window.getComputedStyle(element)[key]);
            if (!isNaN(cur)) {
                init[key] = cur;
            }
        }
        element.timer = setInterval(() => {
            let isDone = true;
            for (let key in init) {
                let curTarget = target[key];
                let step = (parseFloat(curTarget) - init[key]) / speed * 20;
                let current = parseFloat(window.getComputedStyle(element)[key]);
                // 如果到达了目标，就不动了
                if (step > 0) {
                    step = current >= curTarget ? 0 : step;
                } else {
                    step = current <= curTarget ? 0 : step;
                }
                // 特殊处理opacity
                if (key === 'opacity') {
                    current *= 1000;
                    curTarget *= 1000;
                    step *= 1000;
                    current += step;
                    current = step > 0 ? Math.ceil(current) : Math.floor(current);
                    element.style[key] = current / 1000;
                } else if (key === 'zIndex' || key === 'z-index') {
                    // zIndex 不做任何处理
                } else {
                    // 带px单位的属性
                    current += step;
                    current = step > 0 ? Math.ceil(current) : Math.floor(current);
                    element.style[key] = current + 'px';
                }
                if (step != 0) {
                    isDone = false;
                }
            }
            if (isDone) {
                for (let key in target) {
                    if (key === 'opacity' || key === 'zIndex' || key.indexOf('color') != -1 || key.indexOf('Color') != -1) {
                        element.style[key] = target[key];
                    } else {
                        element.style[key] = target[key] + 'px';
                    }
                }
                clearInterval(element.timer);
                element.isPlaying = false;
                callback && callback.call(element);
                if (element.animateQueue.length != 0) {
                    element.isPlaying = true;
                    let ani = element.animateQueue.shift();
                    _animate(element, ani, speed, ani.callback)
                }
            }
        }, 20);
    }

    Init.prototype.animate = function (props, speed, callback) {
        speed = speed || 1500;
        return this.each((index, element) => {
            // 创建一个动画队列
            if (!element.animateQueue) {
                element.animateQueue = [];
            }
            // 添加动画队列
            element.animateQueue.push({
                props, speed, callback
            });
            // 在动画队列基础上递归的调用
            if (!element.isPlaying) {
                element.isPlaying = true;
                let ani = element.animateQueue.shift();
                _animate(element, ani, speed, ani.callback)
            }
        })
    }

    Init.prototype.slideDown = function (speed, callback) {
        return this.each(function () {
            let height = $(this).height();
            $(this).css('height', 0).css('display', 'block').css('overflow', 'hidden');
            $(this).animate({ height }, speed, function () {
                $(this).css('height', '').css('overflow', 'hidden');
                callback && callback.call(this);
            })
        });
    }

    Init.prototype.slideUp = function (speed, callback) {
        return this.each(function () {
            $(this).css('overflow', 'hidden').animate({ height: 0 }, speed, function () {
                $(this).css('overflow', '').css('height', '').css('display', 'none');
                callback && callback.call(this);
            });
        });
    }

    Init.prototype.children = function (selector) {
        let init = new Init();
        // init.length = 0;
        this.each(function () {
            let child = Array.from(this.children);
            
            if(selector != undefined){
                let sel = Array.from(this.querySelectorAll(selector));
                let temp = sel.filter(e=>{
                    return child.indexOf(e) != -1;
                });
                Array.prototype.push.apply(init,temp);
            }else {
                Array.prototype.push.apply(init,child);
            }
        });
        return init;
    }

    Init.prototype.find = function (selector) {
        let init = new Init();
        this.each(function(){
            let offs = this.querySelectorAll(selector);
            Array.prototype.push.apply(init,offs);
        })
        return init;
    }


    // 挂载到全局
    window.$ = hm;
    hm.fn = Init.prototype;
})(window);

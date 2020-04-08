! function (window, undefined) {

    var Qyl = (function () {
        function Qyl(el, index) {
            return new Qyl.fn.init(el,index)
        }

        Qyl.fn = Qyl.prototype = {
            version: "4-1更新",
            constructor: Qyl,
            init: function () {                
                this.dom.apply(this, arguments);
                return this;
            },
            dom_strategy: {
                array: function (el) {
                    this.alldom(function (key, value) {
                        this[key] = value;
                    }, el)
                },
                object: function (el) {
                    this[0] = this.el = el;
                    this.length = 1;
                },
                string: function (el) {
                    var els = document.querySelectorAll(el),
                        el_len = els.length - 1;
                    this.length = els.length;

                    for (var i = 0; i <= el_len; i++) {
                        this[i] = els[i];
                    }

                    this.el = this[0];
                },
                index: function (el, index) {
                    var els = document.querySelectorAll(el)[index]
                    this[0] = this.el = els;
                    this.length = 1;
                }
            },
            dom: function (el, index) {
                var self = this;
                console.log(index)
                typeof el === "object" && self.type(el) !== "array" && self.dom_strategy["object"].call(this, el);
                self.type(el) === "array" && self.dom_strategy["array"].call(this, el);
                self.type(index) === "undefined" && self.type(el) === "string" && self.dom_strategy["string"].call(this, el)
                self.type(index) === "number" && self.dom_strategy["index"].call(this, el, index);
                return this;
            },
            alldom: function (fun, els) {
                function f(o, fun) {
                    var len = o.length;
                    for (var i = 0; i < len; i++) {
                        fun(i, o[i]);
                    }
                }

                !els && f(this, fun);
                els && f(els, fun);
                return this;
            },

            timer: function (int, name, fun) {
                var self = this;
                this.time = 0;

                function t() {
                    this.time > 0 && (this[name] = null)
                    this[name] = setTimeout(function () {
                        fun && fun.call(self);
                        self.time++;
                        t.call(self);
                    }, int);
                };
                t.call(self);
                return this;
            },
            sty: function () {
                if (window.getComputedStyle) {
                    var self = this,
                        strategy = {
                            arr: function (arg, len) {
                                var style = {};
                                while (len--) {
                                    style[arg[len]] = getComputedStyle(self.el)[arg[len]];
                                }
                                self.styles = style;
                                return style;
                            },
                            one: function () {
                                return getComputedStyle(self.el);
                            }
                        }

                    var len = arguments.length,
                        ret = "";

                    len && (ret = strategy["arr"](arguments, len));
                    !len && (ret = strategy["one"]());

                    return ret
                } else {
                    var self = this,
                        strategy = {
                            arr: function (arg, len) {
                                var style = {};
                                while (len--) {
                                    style[arg[len]] = self.el.currentStyle[arg[len]];
                                }
                                self.styles = style;
                                return style;
                            },
                            one: function () {
                                return self.el.currentStyle;
                            }
                        }


                    var len = arguments.length,
                        ret = "";

                    len && (ret = strategy["arr"](arguments, len));
                    !len && (ret = strategy["one"]());

                    return ret
                }
            },
            classcut: function () {
                if ("classList" in document.documentElement) {
                    var strategy = {
                        add: function (el, className) {
                            el.classList.add(className);
                        },
                        toggle: function (el, className) {
                            el.classList.toggle(className);
                        },
                        remove: function (el, className) {
                            el.classList.remove(className);
                        }
                    }
                    return function (change_type, className) {
                        var self = this,
                            el = this.dom(el)[0];

                        !strategy[change_type] && console.error("请传入正确的clasList使用方法");

                        strategy[change_type] && self.alldom(function () {
                            strategy[change_type].call(self, el, className);
                        });

                        return this;
                    }
                } else {

                }

            }(),
            oneclass: function (el, classname, parent, fun) {
                var el = this.dom(el).el,
                    old_el = this.dom(parent + " ." + classname).el;
                if (arguments.length === 3) {
                    old_el && old_el.classList.remove(classname);
                    el.classList.add(classname);
                } else {
                    old_el && old_el.classList.remove(classname);
                    el.classList.add(classname);
                }
                fun && fun();
                return this;

            },
            oneclass_: function (el, classname, fun) {
                var type = typeof el,
                    self = this,
                    strategy = {
                        object: function () {
                            el.classList.add(classname);
                        },
                        number: function () {
                            self[el].classList.add(classname);
                        }
                    }

                self.alldom(function (item) {
                    item.classList.remove(classname)
                })

                fun && fun();
                type == "object" && strategy[type]();
                type == "number" && strategy[type]();
            },
            css: function (obj) {
                var cssText = "";
                if (arguments[0] instanceof Object) {
                    for (var i in obj) {
                        cssText += i + ":" + obj[i] + ";"
                    };
                    !this.el && console.error("dom元素未选择");
                    this.alldom(function () {
                        arguments[0].style.cssText = cssText
                    })

                    return this;
                } else if (arguments[0] instanceof String) {

                } else {
                    return this.get_sty()
                }
            },
            attr: function (key, value) {
                var self = this,
                    type = this.type(arguments[0]),
                    if_o = arguments[0],
                    strategy = {
                        object: function (el) {
                            self.alldom(function () {
                                self.forin(if_o, function (key, value) {
                                    el.setAttribute(key, value)
                                })
                            })
                        },
                        string: function (el) {
                            el.setAttribute(key, value);
                        }
                    }
                this.alldom(function (key, value) {
                    type == "object" && strategy[type](value)
                    type == "string" && strategy[type](value)

                })
                return this;

            },
            html: function (text) {
                var ret = "",
                    text = text;
                (text || text === 0) && (ret = this) &&
                    this.alldom(function (i, value) {
                        value.innerHTML = text;
                    });

                !text && (ret = this[0].innerHTML);
                return ret;
            },
            htmls: function () {
                var self = this;

                this.alldom(function (key, value) {
                    self[key].innerHTML = value;
                }, arguments);
                return this;
            },
            append: function () {
                var type = typeof arguments[0],
                    self = this,
                    strategy = {
                        object: function (el) {
                            self[0].appendChild(el)
                        }
                    }

                self.alldom(function (key, value) {
                    strategy[type] && strategy[type](value)
                }, arguments)
                return this
            },
            get: function (url, fun) {
                var xhr = new XMLHttpRequest(),
                    self = this;
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {

                        self.type(fun) == "function" && fun(xhr.responseText, xhr.status, xhr);
                        !fun && (self.el.innerHTML = xhr.responseText);
                    }
                }
                xhr.open("get", url, true);
                xhr.send(null);
                return this
            },
            post: function (url, fun) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        fun && fun(xhr.responseText, xhr.status, xhr);
                        !fun && (self.el.innerHTML = xhr.responseText);
                    }
                }
                xhr.open("get", url, true);
                xhr.send(null);
                return this
            },
            Qyl_cite: function (name) {
                window._ = null;
                window[name] = Qyl;

                return this;
            },
            forin: function (o, fun) {
                for (var i in o) {
                    fun && fun(i, o[i]);
                }
                return this;
            },
            addfun: function (name, fun) {
                this.__proto__[name] = fun;
                return this;
            },
            type: function (o) {
                var typ = Object.prototype.toString.call(o).replace(/.*\s(.*)\]/g, "$1");
                return typ.toLowerCase()
            }


        }

        Qyl.add_myfun = function (obj) {
            var self = this;
            var strategy = {
                have: function () {
                    this.f()
                    Qyl.myfun = obj;
                },
                no: function () {
                    this.f();
                    Qyl.myfun = Qyl.myfun
                },
                f: function () {
                    for (var i in obj) {
                        self[i] = obj[i];
                    }
                }
            }
            Qyl.myfun && strategy["have"]();
            !Qyl.myfun && strategy["no"]();

        }
        var df = document.createDocumentFragment(),
            parent = null;
        Qyl.add_myfun({
            type: function (o) {
                var typ = Object.prototype.toString.call(o).replace(/.*\s(.*)\]/g, "$1");
                return typ.toLowerCase()
            },
            all: function (els, fun) {
                var len = els.length;
                len && Qyl.fn.alldom(fun, els);
                !len && Qyl.fn.forin(els, fun);
            },
            newel: function (el) {
                return document.createElement(el)
            },
            none: function (el) {
                parent = el.parentElement
                df.appendChild(el)
            },
            show: function (el) {
                parent.appendChild(el)
            },
            ajax: function () {

            }
        });


        Qyl.fn.init.prototype = Qyl.fn;
        window.Qyl = window._ = Qyl;


        return Qyl;
    })();



}(window)

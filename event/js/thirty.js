AC.define("application/shims/AC_Environment", ["require"], function(b) {
    return window.AC.Environment
});
AC.define("application/shims/AC_Element", ["require"], function(d) {
    var c = window.AC.Element;
    c.removeVendorPrefixStyle = function(j, b) {
        var h = ["", "webkit", "Moz", "ms", "O"],
            a, i = {};
        j = c.getElementById(j);
        b = b.replace(/-(webkit|moz|ms|o)-/i, "");
        b = b.replace(/^(webkit|Moz|ms|O)/, "").charAt(0).toLowerCase() + b.slice(1);
        b = b.replace(/-(\w)/, function(f, e) {
            return e.toUpperCase()
        });
        h.some(function(e, f, g) {
            a = (e === "") ? b : e + b.charAt(0).toUpperCase() + b.slice(1);
            if (a in j.style) {
                i[a] = null;
                c.setStyle(j, i);
                return true
            }
        })
    };
    c.onMouseEnter = function(a, b, f) {
        (function(e) {
            c.addEventListener(e, "mouseover", function(j) {
                var i = j.relatedTarget || j.fromElement;
                if (!i || i.nodeName === "HTML") {
                    b()
                }
                if (i) {
                    if (!i.nodeName) {
                        return
                    }
                    do {
                        if (i == e) {
                            return
                        }
                    } while (i = i.parentNode)
                }
                b()
            }, f)
        }(a))
    };
    c.onMouseLeave = function(a, b, f) {
        (function(e) {
            c.addEventListener(e, "mouseout", function(j) {
                var i = j.relatedTarget || j.toElement;
                if (!i || i.nodeName === "HTML") {
                    b()
                }
                if (i) {
                    if (!i.nodeName) {
                        return
                    }
                    do {
                        if (i == e) {
                            return
                        }
                    } while (i = i.parentNode)
                }
                b()
            }, f)
        }(a))
    };
    return c
});
AC.define("eventEmitter/EventEmitter", [], function() {
    var n = "EventEmitter:propagation";
    var l = function(a) {
        if (a) {
            this.context = a
        }
    };
    var m = l.prototype;
    var h = function() {
        if (!this.hasOwnProperty("_events") && typeof this._events !== "object") {
            this._events = {};
            this._events[n] = []
        }
        return this._events
    };
    var i = function(e, c) {
        var b = e[0];
        var a = e[1];
        var d = e[2];
        if (typeof b !== "string" && typeof b !== "object") {
            throw new TypeError("Expecting event name to be a string or object.")
        }
        if (a && typeof a !== "function") {
            throw new TypeError("Expecting callback to be a function.")
        }
        if (d && typeof d !== "object") {
            throw new TypeError("Expecting context to be an object.")
        }
        if (typeof b === "object") {
            for (var f in b) {
                c.call(this, f, b[f], d)
            }
        }
        if (typeof b === "string") {
            b = b.split(" ");
            b.forEach(function(g) {
                c.call(this, g, a, d)
            }, this)
        }
    };
    var k = function(b, a) {
        var e;
        var d;
        var c;
        e = h.call(this)[b];
        if (!e || e.length === 0) {
            return
        }
        e = e.slice();
        for (d = 0, c = e.length; d < c; d++) {
            if (a(e[d], d)) {
                break
            }
        }
    };
    var j = function(c, b, a) {
        var d = -1;
        k.call(this, b, function(e, f) {
            if (e.callback === a) {
                d = f;
                return true
            }
        });
        if (d === -1) {
            return
        }
        c[b].splice(d, 1)
    };
    m.on = function() {
        var a = h.call(this);
        i.call(this, arguments, function(c, b, d) {
            a[c] = a[c] || (a[c] = []);
            a[c].push({
                callback: b,
                context: d
            })
        });
        return this
    };
    m.once = function() {
        i.call(this, arguments, function(c, a, d) {
            var b = function(e) {
                a.call(d || this, e);
                this.off(c, b)
            };
            this.on(c, b, this)
        });
        return this
    };
    m.off = function(c, a) {
        var d = h.call(this);
        if (c && typeof c !== "string" && typeof c !== "object") {
            throw new TypeError("Expecting event name to be a string or object.")
        }
        if (arguments.length === 0) {
            this._events = {}
        }
        if (typeof c === "object") {
            for (var b in c) {
                j.call(this, d, b, c[b])
            }
        }
        if (typeof c === "string") {
            var e = c.split(" ");
            if (e.length === 1) {
                j.call(this, d, c, a)
            } else {
                e.forEach(function(f) {
                    d[f] = []
                })
            }
        }
        return this
    };
    m.trigger = function(b, a, c) {
        if (!b) {
            throw new Error("trigger method requires an event name")
        }
        if (typeof b !== "string") {
            throw new TypeError("Expecting event names to be a string.")
        }
        if (c && typeof c !== "boolean") {
            throw new TypeError("Expecting event name to be a string.")
        }
        b = b.split(" ");
        b.forEach(function(d) {
            k.call(this, d, function(e) {
                e.callback.call(e.context || this.context || this, a)
            }.bind(this));
            if (!c) {
                k.call(this, n, function(e) {
                    var f = d;
                    if (e.prefix) {
                        f = e.prefix + f
                    }
                    e.emitter.trigger(f, a)
                })
            }
        }, this);
        return this
    };
    m.propagateTo = function(b, a) {
        var c = h.call(this);
        c[n].push({
            emitter: b,
            prefix: a
        })
    };
    m.stopPropagatingTo = function(b) {
        var d = h.call(this);
        if (!b) {
            d[n] = [];
            return
        }
        var a = d[n];
        var c = a.length;
        var e;
        for (e = 0; e < c; e++) {
            if (a[e].emitter === b) {
                a.splice(e, 1);
                break
            }
        }
    };
    return l
});
AC.define("events/BindingDelegate", ["require", "eventEmitter/EventEmitter", "application/shims/AC_Element"], function(g) {
    var i = g("eventEmitter/EventEmitter"),
        f = g("application/shims/AC_Element");
    var h = function(a) {
        if (a === null) {
            return
        }
        this.el = a;
        this._bindings = {};
        this._eventEmitter = new i()
    };
    var j = h.prototype;
    j._each = function(c, a) {
        var b, d = c.length;
        for (b = 0; b < d; b++) {
            a(c[b], b)
        }
    };
    j._parseEventNames = function(a) {
        if (!a) {
            return [a]
        }
        return a.split(" ")
    };
    j._hasEventEmitterBinding = function(a) {
        if (this._eventEmitter && this._eventEmitter._events && this._eventEmitter._events[a] && this._eventEmitter._events[a].length > 0) {
            return true
        }
        return false
    };
    j._onListenerEvent = function(a, b) {
        this.trigger(a, b, false)
    };
    j._addEventListener = function(a) {
        this._bindings[a] = this._onListenerEvent.bind(this, a);
        f.addEventListener(this.el, a, this._bindings[a])
    };
    j._removeEventListener = function(a) {
        f.removeEventListener(this.el, a, this._bindings[a]);
        delete this._bindings[a]
    };
    j.on = function(b, a) {
        b = this._parseEventNames(b);
        this._each(b, function(c, d) {
            if (!this._hasEventEmitterBinding(d)) {
                this._addEventListener(d)
            }
            this._eventEmitter.on(d, c)
        }.bind(this, a));
        return this
    };
    j.off = function(b, a) {
        b = this._parseEventNames(b);
        this._each(b, function(c, e) {
            this._eventEmitter.off(e, c);
            if (typeof e === "undefined" && typeof c === "undefined") {
                var d;
                for (d in this._bindings) {
                    if (this._bindings.hasOwnProperty(d)) {
                        this._removeEventListener(d)
                    }
                }
                return
            }
            if (!this._hasEventEmitterBinding(e)) {
                this._removeEventListener(e)
            }
        }.bind(this, a));
        return this
    };
    j.once = function(c, a, b) {
        c = this._parseEventNames(c);
        this._each(c, function(d, e, l) {
            if (!this._hasEventEmitterBinding(l)) {
                this._addEventListener(l)
            }
            this._eventEmitter.once(l, d, e)
        }.bind(this, a, b));
        return this
    };
    j.trigger = function(c, b, a) {
        c = this._parseEventNames(c);
        this._each(c, function(e, d, l) {
            this._eventEmitter.trigger(l, e, d)
        }.bind(this, b, a));
        return this
    };
    return h
});
AC.define("events/WindowDelegate", ["require", "events/BindingDelegate", "application/shims/AC_Environment"], function(f) {
    var h = f("events/BindingDelegate");
    var g = f("application/shims/AC_Environment");
    var j = function() {
        h.call(this, window);
        this._setWindowDimensionValues();
        this._setScrollValues();
        this.on("resize", this._setWindowDimensionValues.bind(this));
        this.on("scroll", this._setScrollValues.bind(this));
        this.on("touchstart", this._touchScrollStart.bind(this));
        this.on("touchend", this._setZoomValues.bind(this))
    };
    j.prototype = new h(null);
    var i = j.prototype;
    i.isZoomed = function() {
        return this.clientWidth > this.innerWidth
    };
    i._setWindowDimensionValues = function() {
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;
        this.clientWidth = document.documentElement.clientWidth;
        this.clientHeight = document.documentElement.clientHeight
    };
    i._setZoomValues = function() {
        var a = this.innerWidth;
        this.innerWidth = window.innerWidth;
        if (a !== this.innerWidth) {
            this.innerHeight = window.innerHeight;
            this.trigger("zoom");
            if (a < this.innerWidth) {
                this.trigger("zoomIn")
            } else {
                this.trigger("zoomOut")
            }
        } else {
            setTimeout(this._setZoomValues.bind(this), 500)
        }
    };
    i._updateScrollX = function() {
        var c = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft,
            a = document.body.scrollWidth - this.innerWidth,
            b = Math.min(Math.max(0, c), a);
        this.maxScrollX = a;
        this.scrollX = b;
        return b
    };
    i._updateScrollY = function() {
        var a = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop,
            b = document.body.scrollHeight - this.innerHeight,
            c = Math.min(Math.max(0, a), b);
        this.maxScrollY = b;
        this.scrollY = c;
        return c
    };
    i._setScrollValues = function() {
        var a = this.scrollX,
            b = this.scrollY;

        this._updateScrollX();
        this._updateScrollY();
        if (this.scrollX !== a) {
            this.trigger("scrollX")
        }
        if (this.scrollY !== b) {
            this.trigger("scrollY")
        }
        this._scrollStop()
    };
    i._scrollStop = function() {
        if (!g.Feature.touchAvailable()) {
            if (this._scrollStopTimer) {
                clearTimeout(this._scrollStopTimer)
            }
            this._scrollStopTimer = setTimeout(function() {
                clearTimeout(this._scrollStopTimer);
                this.trigger("scrollStop")
            }.bind(this), 300)
        }
    };
    i._touchScrollStart = function() {
        this._updateScrollX();
        this._updateScrollY();
        this.once("touchend", this._touchScrollStop.bind(this, this.scrollX, this.scrollY))
    };
    i._touchScrollStop = function(b, c, a) {
        this._updateScrollX();
        this._updateScrollY();
        if (b !== this.scrollX || c !== this.scrollY) {
            setTimeout(this._touchScrollStop.bind(this, this.scrollX, this.scrollY, true), 300)
        } else {
            if (a) {
                this.trigger("scrollStop")
            }
        }
    };
    return new j()
});
AC.define("application/RuntimeEnvironment", ["require", "application/shims/AC_Environment", "application/shims/AC_Element", "events/WindowDelegate"], function(l) {
    var h = l("application/shims/AC_Environment"),
        j = l("application/shims/AC_Element"),
        k = l("events/WindowDelegate");
    var i = document.documentElement;
    var g = (function() {
        var a = false,
            b;
        return {
            _getNativePlaybackVideoType: function() {
                return "m4v"
            },
            _getNativeVideoPlaybackFormat: function() {
                return "mp4"
            },
            isIE: function() {
                return j.hasClassName(i, "ie")
            },
            getIEVersion: function() {
                if (!this.isIE()) {
                    return -1
                }
                return h.Browser.version
            },
            isIE7: function() {
                return j.hasClassName(i, "ie7")
            },
            isIE9: function() {
                return j.hasClassName(i, "ie9")
            },
            isIOS: function() {},
            isiPhone: function() {},
            isIPad: function() {},
            isFirefox: function() {
                if ((j.hasClassName(i, "mozilla"))) {
                    return true
                }
                return false
            },
            isResponsive: function() {
                return j.hasClassName(i, "responsive")
            },
            isStackedLayout: function() {
                if (!this.isResponsive() && k.clientWidth <= 1024) {
                    return k.clientHeight >= 1024
                } else {
                    return k.clientHeight >= k.clientWidth
                }
            },
            shouldUseTimelineController: function() {
                if ((h.Feature.isHandheld()) || (h.Feature.isTablet()) || (h.Browser.name.toLowerCase() === "ie" && h.Browser.version < 11) || (!(h.Feature.cssPropertyAvailable("transform") || h.Feature.cssPropertyAvailable("-webkit-transform"))) || (!(window.history && window.history.pushState))) {
                    return false
                }
                return true
            },
            supportsVideoElement: function() {
                if (a) {
                    return b
                }
                try {
                    var d = document.createElement("VIDEO");
                    if (d.canPlayType && d.canPlayType("video/" + this._getNativeVideoPlaybackFormat()).replace(/no/, "")) {
                        a = true;
                        b = true;
                        return true
                    }
                } catch (c) {}
                a = true;
                b = false;
                return false
            },
            shouldUseScrollController: function() {
                if ((h.Browser.name.toLowerCase() === "ie" && h.Browser.version < 9) || (!(h.Feature.cssPropertyAvailable("transform") || h.Feature.cssPropertyAvailable("-webkit-transform")))) {
                    return false
                }
                return true
            },
            enableHoverScroll: function() {
                return !h.Feature.touchAvailable()
            },
            enableYearHeroTransitions: function() {
                return !this.isIE() && !this.isStackedLayout()
            },
            shouldUseKeyboardNavigation: function() {
                if ((h.Feature.isHandheld()) || (h.Feature.isTablet())) {
                    return false
                }
                return true
            },
            shouldAnimateHeroCaret: function() {
                if ((h.Browser.name.toLowerCase() === "ie" && h.Browser.version < 11)) {
                    return false
                }
                return true
            },
            supportsShimmerAnimation: function() {
                var c = h.Browser.name.toLowerCase();
                if ((h.Browser.os.toLowerCase() === "ios") || (c === "chrome") || (c === "safari")) {
                    return true
                }
                return false
            },
            shouldUseHTML5Video: function() {
                var c = h.Browser.name.toLowerCase();
                if ((h.Browser.os.toLowerCase() === "ios")) {
                    return true
                }
                return false
            },
            supportsCalc: function() {
                var e = 200;
                var t = 2;
                var x = document.createElement("div");
                var f = document.body.clientWidth;
                var v = f - e;
                var c, u;
                var d = "";
                var w = h.Browser;
                var y = w.name === "Safari" && (parseInt(w.version) < 6.1);
                d += "width: -webkit-calc(100% - " + e + "px);";
                d += "width: -moz-calc(100% - " + e + "px);";
                d += "width: calc(100% - " + e + "px);";
                d += "visibility:hidden;";
                x.style.cssText = d;
                document.body.appendChild(x);
                c = parseInt(window.getComputedStyle(x).width, 10);
                u = (v - t < c) && (c < v + t);
                document.body.removeChild(x);
                return u && !y
            },
            shouldEnableAudioPlayer: function() {
                if (h.Browser.name.toLowerCase() === "safari" && h.Browser.version < 6) {
                    return false
                }
                return true
            },
            shouldAllowScrollToTopOnUnload: function() {
                if ((h.Browser.lowerCaseUserAgent.indexOf("ipad") > -1) && (h.Browser.version < 7) || (this.isIE())) {
                    return false
                }
                return true
            },
            shouldUseNativeVideoSrcSelector: function() {
                var c = h.Browser.name.toLowerCase();
                if ((c === "chrome")) {
                    return true
                }
                return false
            }
        }
    }());
    return g
});
AC.define("events/ApplicationEvents", ["require", "eventEmitter/EventEmitter"], function(g) {
    var j = g("eventEmitter/EventEmitter");
    var f = {
        DOMReady: "DOMReady",
        beforeFetch: "beforeFetch",
        afterFetch: "afterFetch",
        beforeRender: "beforeRender",
        afterRender: "afterRender",
        beforeSegue: "beforeSegue",
        afterSegue: "afterSegue",
        stateChange: "stateChange"
    };
    var h = function() {};
    h.prototype = new j();
    var i = new h();
    i.events = f;
    return i
});
AC.define("application/shims/TYConfig", ["require"], function(b) {
    return window.TYConfig
});
/*AC.define("media/ambient/AmbientSlideShowDelegate", ["require", "events/ApplicationEvents", "application/RuntimeEnvironment", "application/shims/AC_Element", "events/BindingDelegate"], function(o) {
    var k = 5,
        p = 5;
    var r = o("events/ApplicationEvents"),
        j = o("application/RuntimeEnvironment"),
        m = o("application/shims/AC_Element"),
        q = o("events/BindingDelegate");
    var l = function(c, a, b) {
        a = "gallery-crossfade";
        b = b || {};
        this.contentPath = c;
        this.id = a;
        this.options = b;
        this._animating = false;
        this._slideShowOptions = b.slideShowOptions || {};
        this._triggerClassName = b._triggerClassName || "ambient-slideshow-trigger";
        this._slideShowOptions.animationDuration = p;
        this._slideShowOptions.ensureInView = false;
        this._initialize()
    };
    var n = l.prototype;
    n._initialize = function() {
        r.on("beforeRender", this._handleBeforeRenderEvent.bind(this));
        this.el = this._createSlideShowElements(this.id, this.contentPath);
        return this
    };
    n._initializeSwapView = function() {
        var a = AC.Element.selectAll(".gallery-content", this.el);
        this._gallery = new AC.ViewMaster.Viewer(a, this.id, this._triggerClassName, this._slideShowOptions);
        this._gallery.setDelegate(this._getSwapViewDelegate());
        this._slideShow = new AC.ViewMaster.Slideshow(this._gallery, this._triggerClassName + "-slideshow", {
            stopOnUserInteraction: false,
            delay: k * 1000,
            ensureInView: false
        });
        return this
    };
    n._createSlideShowElements = function(e, c) {
        var f = document.createElement("DIV");
        f.className = "gallery";
        var a = document.createElement("DIV");
        a.id = this.id;
        a.className = "gallery-view";
        f.appendChild(a);
        var b, d = c.length;
        for (b = 0; b < d; b++) {
            a.appendChild(this._createSlide(e, b, c[b]))
        }
        return f
    };
    n._createSlide = function(e, c, a) {
        var d = document.createElement("FIGURE");
        d.className = "gallery-content ambient-content";
        d.id = e + "-section-" + (c + 1);
        var g = document.createElement("DIV");
        g.className = "cover-image cover-image-" + c + " " + a.id;
        m.setStyle(g, {
            "background-image": "url(" + a.src + ")"
        });
        var b = document.createElement("img");
        if (c === 0) {
            var f = new q(b);
            f.once("load", function() {
                r.trigger("ambientContentReady")
            })
        }
        b.src = a.src;
        d.appendChild(g);
        return d
    };
    n._getSwapViewDelegate = function() {
        return {
            willAnimate: function(e, b, d, g, a, f) {
                function c(i) {
                    var u = m.selectAll(".gallery-content", this.el),
                        h = i;
                    if (u.length === 1) {
                        this._animating = false;
                        return
                    }
                    h();
                    this._animating = false
                }
                this._animating = true;
                c = c.bind(this, g);
                this._animationEndFunction = c;
                this._gallery._animation.call(this._gallery, e.view, b, d, c, a, f)
            }.bind(this)
        }
    };
    n._handleBeforeRenderEvent = function(a) {
        if (this._animating) {
            this._animationEndFunction()
        }
    };
    n.play = function() {
        if (this._slideShow) {
            this._slideShow._active = true;
            this._slideShow.play()
        }
        return this
    };
    n.pause = function() {
        if (this._slideShow) {
            this._slideShow.pause();
            this._slideShow._active = false
        }
        return this
    };
    n.load = function() {
        return this
    };
    n.skipToNext = function() {
        if (!this._gallery || !this._slideShow) {
            return
        }
        this._slideShow.stop();
        this._slideShow._progress = 0;
        this._gallery.options.shouldAnimateContentChange = false;
        this._gallery.showNext();
        this._gallery.options.shouldAnimateContentChange = true;
        this._slideShow.start()
    };
    return l
});*/
AC.define("media/ambient/AmbientContentPlayer", ["require", "events/ApplicationEvents", "application/RuntimeEnvironment", "media/ambient/AmbientSlideShowDelegate"], function(l) {
    var i = l("events/ApplicationEvents"),
        g = l("application/RuntimeEnvironment"),
        j = l("media/ambient/AmbientSlideShowDelegate");
    var h = function(a, d) {
        this.contentPaths = a;
        this.options = d || {};
        this.type;
        this.paused = true;
        this.isReady = false;
        if (a === null) {
            return
        }
        var b, e, c, d = this.options;
        this.type = "slideshow";
        e = a.slideShow;
        b = j;
        this._ambientDelegate = new b(e, d);
        this.el = this._ambientDelegate.el;
        i.on("ambientContentReady", function() {
            this.isReady = true
        }.bind(this));
        return this
    };
    var k = h.prototype;
    k.play = function() {
        if (!this.paused) {
            return
        }
        this._ambientDelegate.play();
        this.paused = false
    };
    k.pause = function() {
        if (this.paused) {
            return
        }
        this._ambientDelegate.pause();
        this.paused = true
    };
    k.skipToNext = function() {
        if (this._ambientDelegate instanceof j) {
            this._ambientDelegate.skipToNext()
        }
    };
    k.load = function() {
        this._ambientDelegate.load()
    };
    k.appendTo = function(a) {
        a.appendChild(this.el);
        if (this._ambientDelegate instanceof j) {
            this._ambientDelegate._initializeSwapView()
        }
    };
    return h
});
/*AC.define("media/ambient/MediaObjectResizer", ["require", "events/WindowDelegate"], function(f) {
    var e = f("events/WindowDelegate");
    var g = function(c, a, b, d) {
        if (c === null) {
            return
        }
        this.el = c;
        this.wrapper = a;
        this.nativeWidth = b;
        this.nativeHeight = d;
        this.aspectRatio = b / d;
        e.on("resize", this.resize.bind(this));
        this.resize()
    };
    var h = g.prototype;
    h._calculateAspectRatio = function() {};
    h.resize = function(c) {
        var n = e.clientWidth,
            a = e.clientHeight;
        var d = n,
            o = a;
        var b = d / o;
        var m = {
            top: 0,
            left: 0
        };
        if (this.nativeWidth > d) {
            d = this.nativeWidth;
            m.left = -((d - n) / 2) + "px"
        }
        if (this.nativeHeight > o) {
            o = this.nativeHeight;
            m.top = -((o - a) / 2) + "px"
        }
        if (b > this.aspectRatio) {
            m.width = d + "px";
            m.height = d / this.aspectRatio + "px"
        } else {
            m.width = o * this.aspectRatio + "px";
            m.height = o + "px"
        }
        AC.Element.setStyle(this.el, m)
    };
    return g
});*/
/*AC.define("media/ambient/ResizingAmbientContentPlayer", ["require", "media/ambient/AmbientContentPlayer", "media/ambient/MediaObjectResizer"], function(j) {
    var f = j("media/ambient/AmbientContentPlayer"),
        h = j("media/ambient/MediaObjectResizer");
    var g = function(c, b, a, d, e) {
        this.target = b;
        this.nativeWidth = a;
        this.nativeHeight = d;
        if (c === null) {
            return
        }
        this.aspectRatio = a / d;
        f.apply(this, [c, e]);
        if (this.type === "video") {
            this._mediaObjectResizer = new h(this.el, b, a, d, this.aspectRatio)
        }
    };
    g.prototype = new f(null);
    var i = g.prototype;
    return g
});*/
AC.define("application/Router", ["require", "eventEmitter/EventEmitter", "application/shims/AC_Element"], function(f) {
    var h = f("eventEmitter/EventEmitter");
    var j = f("application/shims/AC_Element");
    var g = function(a) {
        a = a || {};
        this.debug = a.debug || false;
        this._intercept = a.intercept || "a";
        this._interceptAttribute = a.attribute || "href";
        this._routes = {};
        this._root = a.root || "/";
        this._routing = false;
        this._initPopEvent = false;
        this._initURL = location.href;
        this.identifierPattern = "([a-zA-Z0-9\\-\\_]+)";
        this.hashPattern = /\#(\w+)/;
        this.trailingSlashPattern = /\/+$/;
        this.hostPattern = /^https?:\/\/[^\/]+\//i;
        this.htmlExtPattern = /\w+\.html+$/;
        this._handleTrigger = this._handleTrigger.bind(this);
        this.tokensRe = new RegExp(":" + this.identifierPattern, "g");
        this.intercept(this._intercept);
        if (a.routes) {
            this.routes(a.routes)
        }
        if (a.autoStart) {
            this.start()
        }
    };
    var i = g.prototype = new h();
    i.log = function() {
        var a = [].slice.call(arguments);
        if (this.debug) {
            console.log.apply(console, ["Router::"].concat(a))
        }
    };
    i.initialize = function() {
        this._start();
        this.log("initialized")
    };
    i._handleTrigger = function(c) {
        this.log("handle trigger");
        var a = c.currentTarget;
        var d = a.getAttribute(this._interceptAttribute);
        var e = c.originalEvent;
        var l = this._normalizePath(d);
        var b = l.path === window.location.pathname && l.hash;
        c.originalEvent.preventDefault();
        if (!e || this._isTransitioning) {
            this.log("originalEvent:", e, "this._isTransitioning", this._isTransitioning);
            return
        }
        if (d) {
            this.log("_handleTrigger, navigating to ", d);
            this.navigate(d, {
                originalEvent: c.originalEvent,
                anchor: b
            })
        }
    };
    i._normalizePath = function(a) {
        var c = a.match(this.hashPattern);
        var b = (c && c[1]) ? c[1] : null;
        a = a.replace(this.hashPattern, "");
        a = a.replace(this.htmlExtPattern, "");
        if (!a.match(this.trailingSlashPattern)) {
            a += "http://www.apple.com/"
        }
        return {
            path: a,
            hash: b
        }
    };
    i.navigate = function(r, a) {
        this.log("navigate - rawPath:", r, a);
        var c, v, d;
        var e = this._normalizePath(r);
        var b = e.path;
        var u = a.state ? a.state.hash : e.hash;
        var w = this.matchRoute(b);
        var t = a && a.first;
        var q = !a.nosave;
        if (!w) {
            this.log("no match");
            return
        }
        this._previousRouteMatch = w;
        c = w.route.callback;
        v = w.route.context || this;
        if (q) {
            if (t) {
                this.log("replacing state");
                window.history.replaceState({
                    route: true,
                    hash: u
                }, null, b)
            } else {
                this._routing = true;
                this.log("pushing state");
                window.history.pushState({
                    route: true,
                    hash: u
                }, null, b)
            }
        }
        if (c && typeof c === "function") {
            d = {
                first: t,
                params: w.params,
                hash: u,
                previousRoute: this._previousRouteMatch,
                currentRoute: w,
                rawPath: r,
                path: b,
                normalizedPath: b,
                originalEvent: a.originalEvent,
                popstate: a && a.popstate,
                fade: a && a.fade
            };
            this.log("calling callback");
            c.call(v, d);
            this.trigger("route", d)
        }
    };
    i._zip = function(a, c) {
        for (var b = 0, d = {}; b < a.length; b++) {
            d[a[b]] = c[b]
        }
        return d
    };
    i.matchRoute = function(c) {
        var n, d, e, m;
        var a = null;
        var b = null;
        for (e in this._routes) {
            n = this._routes[e];
            d = n.matcher.pattern;
            d.lastIndex = 0;
            m = n.matcher.pattern.exec(c);
            if (m) {
                if (m.length && n.matcher.routeTokens) {
                    b = this._zip(n.matcher.routeTokens, m.slice(1))
                }
                a = {
                    params: b,
                    route: n
                }
            }
        }
        return a
    };
    i._createRouteMatcher = function(c) {
        var d;
        var e = this.identifierPattern;
        var a = this.tokensRe;
        var l = this._extractRouteTokens(c);
        var b = c.replace(a, e);
        b = b.replace(/\//g, "\\/");
        d = new RegExp("^" + b + "$", "g");
        return {
            pattern: d,
            routeTokens: l
        }
    };
    i._extractRouteTokens = function(b) {
        var a = this.tokensRe;
        var c = this.identifierPattern;
        var l = b.replace(a, ":" + c);
        var d = new RegExp(l);
        var e = d.exec(b);
        e = (e && e.length > 1) ? e.slice(1) : null;
        return e
    };
    i.route = function(b, a, d) {
        var c = this._createRouteMatcher(this._root + b);
        this.log("registering: ", this._root + b);
        return this._routes[b] = {
            callback: a,
            context: d,
            matcher: c
        }
    };
    i.routes = function(b) {
        var a;
        for (a in b) {
            if (b.hasOwnProperty(a)) {
                this.route(a, b[a])
            }
        }
    };
    i.root = function(a) {
        this.route(this._root, a)
    };
    i._handlePopState = function(b) {
        this.log("popstate", b);
        var a = location.href === this._initURL;
        var c = !this._routing && a;
        this.log("samepath", a, c);
        this._routing = true;
        if (c) {
            this.log("initial pop");
            return
        }
        if (!b.state || !b.state.route) {
            this.log("no routing state");
            return
        }
        this.log("navigate to", window.location.pathname);
        this.navigate(window.location.pathname, {
            silent: true,
            originalEvent: b,
            nosave: true,
            popstate: true,
            state: b.state
        })
    };
    i._start = function() {
        this._handlePopState = this._handlePopState.bind(this);
        j.addEventListener(window, "popstate", this._handlePopState);
        window.requestAnimationFrame(function() {
            this.navigate(window.location.pathname, {
                first: true,
                replace: true
            })
        }.bind(this))
    };
    i.stop = function() {
        window.removeEventListener("popstate", this._handlePopState)
    };
    i.intercept = function(a) {
        var b = document.body;
        j.addEventDelegate(b, "click", a, this._handleTrigger)
    };
    return g
});
AC.define("application/shims/AC_Object", ["require"], function(b) {
    return window.AC.Object
});

AC.define("animationSequencer/vendor/KeySpline", [], function() {
    function b(a, n, l, p) {
        this.get = function(c) {
            if (a === n && l === p) {
                return c
            }
            return t(o(c), n, p)
        };

        function q(d, c) {
            return 1 - 3 * c + 3 * d
        }

        function r(d, c) {
            return 3 * c - 6 * d
        }

        function u(c) {
            return 3 * c
        }

        function t(e, d, c) {
            return ((q(d, c) * e + r(d, c)) * e + u(d)) * e
        }

        function m(e, d, c) {
            return 3 * q(d, c) * e * e + 2 * r(d, c) * e + u(d)
        }

        function o(f) {
            var c = f;
            for (var g = 0; g < 4; ++g) {
                var e = m(c, a, l);
                if (e === 0) {
                    return c
                }
                var d = t(c, a, l) - f;
                c -= d / e
            }
            return c
        }
    }
    return b
});
AC.define("animationSequencer/renderers/LogRenderer", [], function() {
    return {
        render: function(f, d) {
            var e = (arguments.length < 2) ? f : d;
            console.log(e)
        }
    }
});
AC.define("animationSequencer/vendor/EasingFunctions", [], function() {
    var O = {
        linear: function T(a, c, b, d) {
            return b * a / d + c
        },
        easeInQuad: function ab(a, c, b, d) {
            return b * (a /= d) * a + c
        },
        easeOutQuad: function al(a, c, b, d) {
            return -b * (a /= d) * (a - 2) + c
        },
        easeInOutQuad: function M(a, c, b, d) {
            if ((a /= d / 2) < 1) {
                return b / 2 * a * a + c
            }
            return -b / 2 * ((--a) * (a - 2) - 1) + c
        },
        easeInCubic: function V(a, c, b, d) {
            return b * (a /= d) * a * a + c
        },
        easeOutCubic: function ag(a, c, b, d) {
            return b * ((a = a / d - 1) * a * a + 1) + c
        },
        easeInOutCubic: function ah(a, c, b, d) {
            if ((a /= d / 2) < 1) {
                return b / 2 * a * a * a + c
            }
            return b / 2 * ((a -= 2) * a * a + 2) + c
        },
        easeInQuart: function af(a, c, b, d) {
            return b * (a /= d) * a * a * a + c
        },
        easeOutQuart: function L(a, c, b, d) {
            return -b * ((a = a / d - 1) * a * a * a - 1) + c
        },
        easeInOutQuart: function Q(a, c, b, d) {
            if ((a /= d / 2) < 1) {
                return b / 2 * a * a * a * a + c
            }
            return -b / 2 * ((a -= 2) * a * a * a - 2) + c
        },
        easeInQuint: function ac(a, c, b, d) {
            return b * (a /= d) * a * a * a * a + c
        },
        easeOutQuint: function am(a, c, b, d) {
            return b * ((a = a / d - 1) * a * a * a * a + 1) + c
        },
        easeInOutQuint: function N(a, c, b, d) {
            if ((a /= d / 2) < 1) {
                return b / 2 * a * a * a * a * a + c
            }
            return b / 2 * ((a -= 2) * a * a * a * a + 2) + c
        },
        easeInSine: function Y(a, c, b, d) {
            return -b * Math.cos(a / d * (Math.PI / 2)) + b + c
        },
        easeOutSine: function aj(a, c, b, d) {
            return b * Math.sin(a / d * (Math.PI / 2)) + c
        },
        easeInOutSine: function I(a, c, b, d) {
            return -b / 2 * (Math.cos(Math.PI * a / d) - 1) + c
        },
        easeInExpo: function ak(a, c, b, d) {
            return (a === 0) ? c : b * Math.pow(2, 10 * (a / d - 1)) + c
        },
        easeOutExpo: function U(a, c, b, d) {
            return (a === d) ? c + b : b * (-Math.pow(2, -10 * a / d) + 1) + c
        },
        easeInOutExpo: function Z(a, c, b, d) {
            if (a === 0) {
                return c
            }
            if (a === d) {
                return c + b
            }
            if ((a /= d / 2) < 1) {
                return b / 2 * Math.pow(2, 10 * (a - 1)) + c
            }
            return b / 2 * (-Math.pow(2, -10 * --a) + 2) + c
        },
        easeInCirc: function X(a, c, b, d) {
            return -b * (Math.sqrt(1 - (a /= d) * a) - 1) + c
        },
        easeOutCirc: function ai(a, c, b, d) {
            return b * Math.sqrt(1 - (a = a / d - 1) * a) + c
        },
        easeInOutCirc: function H(a, c, b, d) {
            if ((a /= d / 2) < 1) {
                return -b / 2 * (Math.sqrt(1 - a * a) - 1) + c
            }
            return b / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + c
        },
        easeInElastic: function J(a, f, c, g) {
            var d = 1.70158;
            var b = 0;
            var e = c;
            if (a === 0) {
                return f
            }
            if ((a /= g) === 1) {
                return f + c
            }
            if (!b) {
                b = g * 0.3
            }
            if (e < Math.abs(c)) {
                e = c;
                d = b / 4
            } else {
                d = b / (2 * Math.PI) * Math.asin(c / e)
            }
            return -(e * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * g - d) * (2 * Math.PI) / b)) + f
        },
        easeOutElastic: function K(a, f, c, g) {
            var d = 1.70158;
            var b = 0;
            var e = c;
            if (a === 0) {
                return f
            }
            if ((a /= g) === 1) {
                return f + c
            }
            if (!b) {
                b = g * 0.3
            }
            if (e < Math.abs(c)) {
                e = c;
                d = b / 4
            } else {
                d = b / (2 * Math.PI) * Math.asin(c / e)
            }
            return e * Math.pow(2, -10 * a) * Math.sin((a * g - d) * (2 * Math.PI) / b) + c + f
        },
        easeInOutElastic: function W(a, f, c, g) {
            var d = 1.70158;
            var b = 0;
            var e = c;
            if (a === 0) {
                return f
            }
            if ((a /= g / 2) === 2) {
                return f + c
            }
            if (!b) {
                b = g * (0.3 * 1.5)
            }
            if (e < Math.abs(c)) {
                e = c;
                d = b / 4
            } else {
                d = b / (2 * Math.PI) * Math.asin(c / e)
            } if (a < 1) {
                return -0.5 * (e * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * g - d) * (2 * Math.PI) / b)) + f
            }
            return e * Math.pow(2, -10 * (a -= 1)) * Math.sin((a * g - d) * (2 * Math.PI) / b) * 0.5 + c + f
        },
        easeInBack: function P(b, e, c, a, d) {
            if (d === undefined) {
                d = 1.70158
            }
            return c * (b /= a) * b * ((d + 1) * b - d) + e
        },
        easeOutBack: function ad(b, e, c, a, d) {
            if (d === undefined) {
                d = 1.70158
            }
            return c * ((b = b / a - 1) * b * ((d + 1) * b + d) + 1) + e
        },
        easeInOutBack: function R(b, e, c, a, d) {
            if (d === undefined) {
                d = 1.70158
            }
            if ((b /= a / 2) < 1) {
                return c / 2 * (b * b * (((d *= (1.525)) + 1) * b - d)) + e
            }
            return c / 2 * ((b -= 2) * b * (((d *= (1.525)) + 1) * b + d) + 2) + e
        },
        easeInBounce: function S(a, c, b, d) {
            return b - O.easeOutBounce(d - a, 0, b, d) + c
        },
        easeOutBounce: function ae(a, c, b, d) {
            if ((a /= d) < (1 / 2.75)) {
                return b * (7.5625 * a * a) + c
            } else {
                if (a < (2 / 2.75)) {
                    return b * (7.5625 * (a -= (1.5 / 2.75)) * a + 0.75) + c
                } else {
                    if (a < (2.5 / 2.75)) {
                        return b * (7.5625 * (a -= (2.25 / 2.75)) * a + 0.9375) + c
                    } else {
                        return b * (7.5625 * (a -= (2.625 / 2.75)) * a + 0.984375) + c
                    }
                }
            }
        },
        easeInOutBounce: function aa(a, c, b, d) {
            if (a < d / 2) {
                return O.easeInBounce(a * 2, 0, b, d) * 0.5 + c
            }
            return O.easeOutBounce(a * 2 - d, 0, b, d) * 0.5 + b * 0.5 + c
        }
    };
    return O
});
AC.define("animationSequencer/clip/BaseClip", ["require", "animationSequencer/vendor/KeySpline", "animationSequencer/renderers/LogRenderer", "animationSequencer/vendor/EasingFunctions", "eventEmitter/EventEmitter"], function(r) {
    var n = r("animationSequencer/vendor/KeySpline");
    var m = r("animationSequencer/renderers/LogRenderer");
    var o = r("animationSequencer/vendor/EasingFunctions");
    var j = "Easing option must be one of: String, Array[Number:4], or Function. Given: ";
    var q = "KeySpline easing expected an array of exactly four (4) numbers, given: ";
    var k = r("eventEmitter/EventEmitter");

    function l(a, b) {
        this.options = b || {};
        this._renderer = this.options.renderer || m;
        this._duration = a;
        this._currentTime = 0;
        this._easingFunction = this._createEasing(this.options.easing || l.DEFAULT_EASING)
    }
    l.DEFAULT_EASING = "linear";
    var p = l.prototype = new k();
    p._createEasing = function(b) {
        var a;
        if (typeof b === "string") {
            a = this._createPredefinedEasing(b)
        } else {
            if (Array.isArray(b)) {
                a = this._createBezierEasing(b)
            } else {
                if (typeof b === "function") {
                    a = b
                } else {
                    throw new TypeError(j + b)
                }
            }
        }
        return a
    };
    p._createBezierEasing = function(d) {
        var b;
        var a = d;
        var c = d.every(function(e) {
            return (typeof e === "number")
        });
        if (d.length !== 4 || !c) {
            throw new TypeError(q + d)
        }
        b = new n(a[0], a[1], a[2], a[3]);
        return function(h, e, f, g) {
            return b.get(h / g) * f
        }
    };
    p._createPredefinedEasing = function(a) {
        var b = o[a];
        var c = "";
        if (!b) {
            c += 'Easing function "' + b;
            c += '" not recognized among the following: ';
            c += Object.keys(o).join(", ");
            throw new Error(c)
        }
        return b
    };
    p._getInterpolatedValue = function(d, a, b, c) {
        return this._easingFunction(d, a, b, c)
    };
    p.getDuration = function() {
        return this._duration
    };
    p.getCurrentTime = function() {
        return this._currentTime
    };
    p.setCurrentTime = function(a) {
        this._currentTime = a;
        this.update()
    };
    p.getPlaybackRate = function() {
        return this._playbackRate
    };
    p.setPlaybackRate = function(a) {
        this._playbackRate = a
    };
    p.update = function() {};
    return l
});
AC.define("animationSequencer/clip/TweenClip", ["require", "animationSequencer/clip/BaseClip"], function(e) {
    var g = e("animationSequencer/clip/BaseClip");

    function f(a, b, c) {
        if (typeof a === "object") {
            c = a;
            a = c.duration;
            b = c.props
        }
        g.call(this, a, c);
        this.props = b || [];
        this._initializePropEasing();
        this._lastComputedTime = 0;
        this._easingDirection = 1
    }
    f.create = function(a) {
        return new f(a.duration, a.props)
    };
    f.validate = function(a) {
        return (typeof a.selector === "string") && Array.isArray(a.props)
    };
    f.DEFAULT_EASING = "linear";
    var h = f.prototype = Object.create(g.prototype);
    h._initializePropEasing = function() {
        this.props.forEach(function(a) {
            a.easing = this._createEasing(a.easing || g.DEFAULT_EASING)
        }.bind(this))
    };
    h.setEasingDirection = function(a) {
        this._easingDirection = a
    };
    h.update = function(a) {
        var c = (this._easingDirection === -1);
        if (this.options.reverseEase !== true) {
            c = false
        }
        var b = this.getDuration(),
            d = {};
        if (this.props.length < 1) {
            return
        }
        this.props.forEach(function(l) {
            var m;
            var n = l.property;
            if (c) {
                m = l.easing(this.getDuration() - a, l.to, -(l.to - l.from), b)
            } else {
                m = l.easing(a, l.from, (l.to - l.from), b)
            }
            d[n] = m
        }.bind(this));
        this.trigger("tween_update", d)
    };
    h.getCurrentTime = function() {
        return this._currentTime
    };
    h.setCurrentTime = function(a) {
        if (a < 0) {
            a = 0
        }
        if (a > this.getDuration()) {
            a = this.getDuration()
        }
        if (a < 0 || a > this.getDuration()) {
            return
        }
        this._currentTime = a;
        this.update(this._currentTime)
    };
    return f
});
AC.define("animationSequencer/Clock", [], function() {
    function c() {
        this._currentTimeMS = 0;
        this._playbackRate = 1;
        this._paused = true;
        this._resetStartTime()
    }
    var d = c.prototype;
    d._updateCurrentTime = function() {
        var a, b = Date.now();
        if (this._paused) {
            a = 0
        } else {
            a = (b - this._startTime)
        }
        this._currentTimeMS += (a * this._playbackRate);
        this._startTime = b
    };
    d._resetStartTime = function() {
        this._startTime = Date.now()
    };
    d.play = function() {
        this._resetStartTime();
        this._paused = false;
        return this
    };
    d.pause = function() {
        this._updateCurrentTime();
        this._paused = true;
        return this
    };
    d.isPaused = function() {
        return this._paused
    };
    d.getCurrentTime = function() {
        this._updateCurrentTime();
        return this._currentTimeMS / 1000
    };
    d.setCurrentTime = function(a) {
        if (isNaN(a)) {
            return
        }
        this._resetStartTime();
        this._currentTimeMS = a * 1000
    };
    d.getPlaybackRate = function() {
        return this._playbackRate
    };
    d.setPlaybackRate = function(a) {
        if (isNaN(a)) {
            return
        }
        this._playbackRate = a
    };
    return c
});
AC.define("animationSequencer/adapters/PlayerAsMedia", ["eventEmitter/EventEmitter"], function(f) {
    function e(a) {
        this._player = a
    }
    var d = e.prototype = new f();
    d.addEventListener = function() {
        this._player.on.apply(this._player, arguments)
    };
    d.removeEventListener = function() {
        this._player.on.apply(this._player, arguments)
    };
    d.play = function() {
        this._player.play.apply(this._player, arguments)
    };
    d.pause = function() {
        this._player.pause.apply(this._player, arguments)
    };
    Object.defineProperties(e.prototype, {
        paused: {
            get: function() {
                return this._player.isPaused()
            },
            set: function(a) {
                this._player.setPaused(a)
            }
        },
        currentTime: {
            get: function() {
                return this._player.getCurrentTime()
            },
            set: function(a) {
                this._player.setCurrentTime(a)
            }
        },
        duration: {
            get: function() {
                return this._player.getDuration()
            }
        },
        playbackRate: {
            get: function() {
                return this._player.getPlaybackRate()
            },
            set: function(a) {
                this.trigger("ratechange", {
                    rate: a
                });
                this._player.setPlaybackRate(a)
            }
        }
    });
    return e
});
AC.define("animationSequencer/player/BasicPlayer", ["require", "eventEmitter/EventEmitter", "animationSequencer/Clock", "animationSequencer/adapters/PlayerAsMedia"], function(l) {
    var j = l("eventEmitter/EventEmitter");
    var i = l("animationSequencer/Clock");
    var g = l("animationSequencer/adapters/PlayerAsMedia");

    function h(a, b) {
        b = b || {};
        if (!a) {
            throw new TypeError("BasicPlayer: Invalid clip provided", a)
        }
        this._clip = a;
        this._paused = true;
        this.setClock(b.clock || new i());
        window.setTimeout(this._triggerStart.bind(this), 0)
    }
    var k = h.prototype = new j();
    k.addEventListener = k.on;
    k.removeEventListener = k.off;
    k.play = function() {
        this._paused = false;
        this._clock.play();
        this._update();
        this.trigger("play")
    };
    k.pause = function() {
        this.setPaused(true);
        this._clock.pause();
        this.trigger("pause")
    };
    k._triggerStart = function() {
        this.trigger("canplay");
        this.trigger("canplaythrough")
    };
    k._updateCurrentTime = function(a) {
        this._clock.setCurrentTime(a);
        this._lastTime = this._clip.setCurrentTime(a)
    };
    k._update = function() {
        var c = this._clock.getCurrentTime();
        var b = this.getDuration();
        var d = this._clock.getPlaybackRate();
        var e = d > 0;
        var a = e && c >= b;
        var f = !e && c <= 0;
        if (a || f) {
            c = (a) ? b : 0;
            this.pause();
            this._updateCurrentTime(c)
        }
        this.trigger("timeupdate", {
            previous: this._lastTime,
            time: c
        });
        if (a) {
            this.trigger("ended")
        }
        if (f) {
            this.trigger("returned")
        }
        if (!this.isPaused()) {
            this._updateCurrentTime(c);
            window.requestAnimationFrame(this._update.bind(this))
        }
    };
    k._isValidTime = function(a) {
        return (0 <= a) && (a <= this.getDuration())
    };
    k.asMedia = function() {
        return new g(this)
    };
    k.isPaused = function() {
        return this._paused
    };
    k.setPaused = function(a) {
        this._paused = !!a
    };
    k.getCurrentTime = function() {
        return this._clock.getCurrentTime()
    };
    k.setCurrentTime = function(a) {
        if (this._isValidTime(a)) {
            this.trigger("seeking", {
                time: a
            });
            this._updateCurrentTime(a);
            this.trigger("seeked", {
                time: a
            })
        }
    };
    k.getPlaybackRate = function() {
        return this._clock.getPlaybackRate()
    };
    k.setPlaybackRate = function(a) {
        this._clock.setPlaybackRate(a);
        this.trigger("ratechange", {
            rate: a
        })
    };
    k.getDuration = function() {
        return this._clip.getDuration()
    };
    k.setClock = function(a) {
        this._clock = a
    };
    k.getClock = function() {
        return this._clock
    };
    return h
});
AC.define("application/ScrollController", ["require", "events/ApplicationEvents", "events/WindowDelegate", "application/shims/AC_Object", "application/shims/AC_Element", "application/RuntimeEnvironment", "animationSequencer/clip/TweenClip", "animationSequencer/player/BasicPlayer"], function(p) {
    var r = p("events/ApplicationEvents");
    var j = p("events/WindowDelegate");
    var o = p("application/shims/AC_Object");
    var m = p("application/shims/AC_Element");
    var l = p("application/RuntimeEnvironment");
    var k = p("animationSequencer/clip/TweenClip");
    var n = p("animationSequencer/player/BasicPlayer");
    var q = (function() {
        var u = 0,
            f = [],
            d = [],
            a, c = false;
        var b = function(w) {
            var t;
            if (!w) {
                return 0
            }
            if (!isNaN(w)) {
                return parseInt(w, 10)
            }
            if (typeof w === "string") {
                t = m.getElementById(w)
            } else {
                t = w
            }
            return m.cumulativeOffset(t).top
        };
        var g = function(t) {
            if (typeof t === "string") {
                return m.getElementById(t)
            } else {
                if (t instanceof HTMLElement) {
                    return t
                }
            }
            return null
        };
        var i = function() {
            var D = m.select(".next-container"),
                C, B = [],
                E, F, G, t;
            if (D) {
                C = m.selectAll("[data-scroll-class]", D)
            } else {
                C = m.selectAll("[data-scroll-class]")
            }
            E = [{
                className: "scroll-top",
                y: 0
            }, {
                className: "scroll-middle",
                y: j.clientHeight / 2
            }, {
                className: "scroll-bottom",
                y: j.clientHeight - 34
            }];
            C.each(function(v) {
                F = m.getBoundingBox(v);
                G = v.getAttribute("data-scroll-class");
                if (F.top != F.bottom) {
                    for (t = 0; t < E.length; t++) {
                        if (F.top <= E[t].y && F.bottom >= E[t].y) {
                            B[t] = E[t].className + "-" + G
                        }
                    }
                }
            }.bind(this));
            for (t = 0; t < E.length; t++) {
                if (B[t] != d[t]) {
                    if (B[t]) {
                        m.addClassName(document.body, B[t]);
                        m.removeClassName(document.body, d[t]);
                        d[t] = B[t]
                    } else {
                        m.removeClassName(document.body, d[t]);
                        d[t] = null
                    }
                }
            }
        };
        var e = function() {
            var z = j.clientWidth * this.options.hintingThreshold,
                A, t, y;
            if (c || (a && !a.isPaused()) || j.scrollY == 0 || j.scrollY == j.maxScrollY || j.isZoomed()) {
                u = j.scrollY;
                return
            }
            for (y = 0; y < f.length; y++) {
                A = m.percentInViewport(f[y]);
                if (A && A >= this.options.hintingThreshold) {
                    t = m.cumulativeOffset(f[y]).top;
                    if (j.scrollY > u == t > u && t != u) {
                        this.animateTo(f[y]);
                        break
                    }
                }
            }
            u = j.scrollY
        };
        var h = function(t) {
            c = t;
            if (c && a) {
                a.pause()
            }
        };
        return {
            options: {
                hintingThreshold: 0.25,
                animateDuration: 0.4
            },
            initialize: function(t) {
                o.extend(this.options, t);
                this._preventSnap = false;
                j.on("load", i.bind(this));
                j.on("scrollY", i.bind(this));
                j.on("scrollStop", i.bind(this));
                j.on("resize", i.bind(this));
                r.on("beforeSegueStart", i.bind(this));
                j.on("scrollStop", e.bind(this));
                if (l.shouldAllowScrollToTopOnUnload()) {
                    j.on("unload", this.snapTo.bind(this, 0))
                }
                r.on("beforeSegue", h.bind(this, true));
                r.on("afterSegue", h.bind(this, false))
            },
            snapTo: function(t) {
                if (this._preventSnap) {
                    return
                }
                if (a) {
                    a.pause()
                }
                window.scrollTo(0, b(t));
                r.trigger("scrolledTo", {
                    el: g(t)
                })
            },
            animateTo: function(t) {
                if (this._preventSnap) {
                    return
                }
                var x, y;
                if (a) {
                    a.pause()
                }
                y = b(t);
                if (j.scrollY == y) {
                    return
                }
                x = new k({
                    duration: this.options.animateDuration,
                    props: [{
                        property: "scrollTop",
                        from: j.scrollY,
                        to: y,
                        easing: "easeInQuad"
                    }]
                });
                x.on("tween_update", function(w, B, v, C) {
                    window.scrollTo(0, Math.round(C.scrollTop));
                    if (C.scrollTop === w) {
                        v.trigger("scrolledTo", {
                            el: B
                        })
                    }
                }.bind(this, y, g(t), r));
                a = new n(x);
                setTimeout(a.play.bind(a), 0)
            },
            registerForHinting: function(t) {
                f.push(t)
            },
            preventSnapping: function() {
                this._preventSnap = true
            },
            allowSnapping: function() {
                this._preventSnap = false
            }
        }
    }());
    return q
});
AC.define("application/shims/AC_Ajax", ["require"], function(b) {
    return window.AC.Ajax
});
AC.define("application/PageService", ["require", "defer/Deferred", "application/shims/AC_Ajax"], function(d) {
    var e = d("defer/Deferred");
    var f = d("application/shims/AC_Ajax");
    return {
        _cache: {},
        fetch: function(b) {
            var c = new e();
            var a = this._cache[b];
            if (a && a.length) {
                c.resolve(a)
            } else {
                new f.AjaxRequest(b, {
                    onSuccess: function(j) {
                        var i = j.responseText();
                        this._cache[b] = i;
                        c.resolve(i)
                    }.bind(this),
                    onError: c.reject,
                    onFailure: c.reject
                })
            }
            return c.promise()
        }
    }
});
AC.define("events/ScrollLockDelegate", ["require", "events/BindingDelegate", "application/shims/AC_Element", "application/shims/AC_Environment"], function(f) {
    var h = f("events/BindingDelegate"),
        j = f("application/shims/AC_Element"),
        g = f("application/shims/AC_Environment");
    var i = (function() {
        var c = false,
            d = new h(document),
            b = "touchstart",
            e = "scroll-lock",
            m = 0;
        var n = !g.Feature.isDesktop();
        d.on(b, function a() {});
        return {
            _mobileLockListener: function(k) {
                k.preventDefault()
            },
            _lockDesktop: function() {
                j.addClassName(document.body, e);
                return this
            },
            _unlockDesktop: function() {
                j.removeClassName(document.body, e);
                return this
            },
            _lockMobile: function() {
                d.on(b, this._mobileLockListener);
                return this
            },
            _unlockMobile: function() {
                d.off(b, this._mobileLockListener);
                return this
            },
            lockScrolling: function() {
                if (c) {
                    return this
                }
                c = true;
                if (n) {
                    this._lockMobile()
                } else {
                    this._lockDesktop()
                }
                return this
            },
            unlockScrolling: function() {
                m = 0;
                if (!c) {
                    return this
                }
                c = false;
                if (n) {
                    this._unlockMobile()
                } else {
                    this._unlockDesktop()
                }
                return this
            },
            queuedLockScrolling: function() {
                m++;
                this.lockScrolling();
                return this
            },
            queuedUnlockScrolling: function() {
                m--;
                if (m <= 0) {
                    this.unlockScrolling()
                }
                return this
            }
        }
    }());
    return i
});
AC.define("application/polyfills/RequestAnimationFrame", ["require"], function(e) {
    var h = 0;
    var g = ["webkit", "moz"];
    for (var f = 0; f < g.length && !window.requestAnimationFrame; ++f) {
        window.requestAnimationFrame = window[g[f] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[g[f] + "CancelAnimationFrame"] || window[g[f] + "CancelRequestAnimationFrame"]
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(a, d) {
            var j = new Date().getTime();
            var c = Math.max(0, 16 - (j - h));
            var b = window.setTimeout(function() {
                a(j + c)
            }, c);
            h = j + c;
            return b
        }
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(a) {
            clearTimeout(a)
        }
    }
    return window.requestAnimationFrame
});
AC.define("application/segues/BaseSegue", ["require", "application/shims/AC_Element", "events/WindowDelegate", "application/ScrollController", "defer/Deferred", "events/ApplicationEvents", "events/ScrollLockDelegate", "application/polyfills/RequestAnimationFrame"], function(y) {
    var u = y("application/shims/AC_Element");
    var n = y("events/WindowDelegate");
    var z = y("application/ScrollController");
    var q = y("defer/Deferred");
    var A = y("events/ApplicationEvents");
    var o = y("events/ScrollLockDelegate");
    var t = y("application/polyfills/RequestAnimationFrame");
    var v = "show";
    var p = "page-container";
    var r = "segue";
    var x = function(a, c, b) {
        this._init(a, c, b)
    };
    var w = x.prototype;
    w._init = function(a, c, b) {
        this._deferred = new q();
        this.prevContainer = a;
        this.nextContainer = c;
        this.eventData = b;
        this._segue = "fade";
        this._scrollTo = 0;
        this._endElement = this.nextContainer
    };
    w._cleanContainers = function() {
        var a = u.selectAll("." + p);
        delete document.body.dataset.segue;
        u.removeClassName(document.body, r);
        a.each(function(b) {
            u.removeClassName(b, "next-container");
            u.removeClassName(b, "prev-container");
            b.removeAttribute("style")
        })
    };
    w.play = function() {
        this._cleanContainers();
        document.body.dataset.segue = this._segue;
        window.requestAnimationFrame(this._start.bind(this));
        this._transitionEnd = this._end.bind(this);
        u.addVendorPrefixEventListener(this._endElement, "transitionEnd", this._transitionEnd);
        return this._deferred.promise()
    };
    w._start = function() {
        this._beforeSetup();
        o.unlockScrolling();
        o.queuedLockScrolling();
        u.setStyle(this.prevContainer, {
            top: -n.scrollY + "px"
        });
        u.addClassName(this.nextContainer, "next-container");
        u.addClassName(this.prevContainer, "prev-container");
        window.requestAnimationFrame(function() {
            if (this._scrollTo) {
                o.unlockScrolling()
            }
            z.snapTo(this._scrollTo);
            A.trigger("beforeSegueStart");
            this._afterSetup()
        }.bind(this))
    };
    w._end = function(a) {
        if (a.target != this._endElement) {
            return
        }
        this._beforeCleanup();
        u.removeVendorPrefixEventListener(this._endElement, "transitionEnd", this._transitionEnd);
        u.addClassName(this.nextContainer, v);
        u.removeClassName(this.prevContainer, v);
        this._cleanContainers();
        if (this.prevContainer.id !== "landing") {
            u.remove(this.prevContainer)
        }
        this._afterCleanup();
        o.queuedUnlockScrolling();
        this._deferred.resolve()
    };
    w._beforeSetup = function() {};
    w._afterSetup = function() {
        u.addClassName(document.body, r)
    };
    w._beforeCleanup = function() {};
    w._afterCleanup = function() {};
    return x
});
AC.define("application/segues/FadeTo", ["require", "application/segues/BaseSegue"], function(f) {
    var e = f("application/segues/BaseSegue");
    var g = function(a, c, b) {
        this._init(a, c, b);
        this.segue = "fade";
        if (b.hash >= 1984 && b.hash <= 2017) {
            this._scrollTo = "timeline"
        }
    };
    var h = g.prototype = new e();
    return g
});
AC.define("application/segues/YearToYear", ["require", "application/segues/BaseSegue", "application/shims/AC_Element", "events/WindowDelegate"], function(h) {
    var j = h("application/segues/BaseSegue");
    var k = h("application/shims/AC_Element");
    var g = h("events/WindowDelegate");
    var l = function(a, c, b) {
        this._init(a, c, b);
        this._segue = this.eventData.toYear > this.eventData.fromYear ? "next" : "prev"
    };
    var i = l.prototype = new j();
    i._beforeSetup = function() {
        this._prevTransitionEnd = function(a) {
            if (!k.hasClassName(a.target, "year-detail")) {
                return
            }
            k.setStyle(this.nextContainer, {
                opacity: 1
            });
            k.removeVendorPrefixEventListener(this.prevContainer, "transitionEnd", this._prevTransitionEnd)
        }.bind(this);
        k.addVendorPrefixEventListener(this.prevContainer, "transitionEnd", this._prevTransitionEnd)
    };
    i._afterCleanup = function() {
        var a = k.select(".hero .year", this.nextContainer);
        a.tabIndex = 0;
        a.focus()
    };
    return l
});
AC.define("application/segues/YearToAnyYear", ["require", "application/segues/BaseSegue", "application/shims/AC_Element", "events/WindowDelegate"], function(g) {
    var j = g("application/segues/BaseSegue");
    var k = g("application/shims/AC_Element");
    var l = g("events/WindowDelegate");
    var h = function(a, c, b) {
        this._init(a, c, b);
        this._segue = "slide";
        this._direction = this.eventData.toYear > this.eventData.fromYear ? "left" : "right";
        this._offset = l.clientWidth * (this._direction === "left" ? 1 : -1)
    };
    var i = h.prototype = new j();
    i._beforeSetup = function() {
        k.setVendorPrefixStyle(this.nextContainer, "transform", "translateX(" + this._offset + "px)")
    };
    i._afterSetup = function() {
        k.setVendorPrefixStyle(this.nextContainer, "transform", "translateX(0)");
        k.setVendorPrefixStyle(this.prevContainer, "transform", "translateX(" + (this._offset * -0.5) + "px)");
        k.addClassName(document.body, "segue")
    };
    i._afterCleanup = function() {
        var a = k.select(".hero .year", this.nextContainer);
        a.tabIndex = 0;
        a.focus()
    };
    return h
});
AC.define("application/YearNav", ["require", "application/RuntimeEnvironment", "application/shims/AC_Element", "events/ApplicationEvents", "application/ScrollController", "events/WindowDelegate", "defer/Deferred", "animationSequencer/clip/TweenClip", "animationSequencer/player/BasicPlayer", "animationSequencer/vendor/KeySpline", "application/polyfills/RequestAnimationFrame"], function(B) {
    var t = B("application/RuntimeEnvironment");
    var y = B("application/shims/AC_Element");
    var G = B("events/ApplicationEvents");
    var F = B("application/ScrollController");
    var q = B("events/WindowDelegate");
    var v = B("defer/Deferred");
    var r = B("animationSequencer/clip/TweenClip");
    var C = B("animationSequencer/player/BasicPlayer");
    var u = B("animationSequencer/vendor/KeySpline");
    var x = B("application/polyfills/RequestAnimationFrame");
    var w = "expanded";
    var D = "active";
    var z = document.getElementById("hdnEventNos").value;
    var A = {
        "1986": 0.25,
        "1990": 0.25,
        "1992": 0.25,
        "1996": 0.25,
        "1997": 0.25,
        "2001": 0.22,
        "2004": 0.25,
        "2008": 0.25,
        "2009": 0.25,
        "2014": 0.23
    };
    var E = (function() {
        var i = 0,
            d = false,
            c, f, b = 0;
        var h = function() {
            var j, k;
            y.removeClassName(this.carousel, "native-scroll");
            y.addClassName(this.carousel, "hover-scroll");
            this._setMoving(false);
            y.addEventListener(this.carousel, "mousemove", e.bind(this), false);
            y.onMouseEnter(this.carousel, a.bind(this, true), false);
            y.onMouseLeave(this.carousel, a.bind(this, false), false);
            j = new r({
                duration: this.options.scrollDuration,
                props: [{
                    property: "scrollPercent",
                    from: 0,
                    to: 1,
                    easing: this.options.scrollEasing
                }]
            });
            j.on("tween_update", function(l) {
                var m = this._maxScroll() * l.scrollPercent;
                if (this.scrollLeft != m) {
                    this.scrollLeft = m;
                    y.setVendorPrefixStyle(this.list, "transform", "translateX(-" + this.scrollLeft + "px)");
                    this.list.scrollLeft = 0;
                    this.carousel.scrollLeft = 0;
                    g.call(this)
                }
            }.bind(this));
            c = new C(j);
            this._setScroll(this.carousel.scrollLeft + this.list.scrollLeft);
            k = new r({
                duration: this.options.speedUpDuration / this.options.speedUpRegion,
                props: [{
                    property: "speed",
                    from: 0,
                    to: 1,
                    easing: "easeInQuad"
                }]
            });
            k.on("tween_update", function(l) {
                c.setPlaybackRate(l.speed * b);
                if (c.isPaused()) {
                    c.play()
                }
            }.bind(this));
            f = new C(k)
        };
        var e = function(o) {
            var k, j, l, m, n, p;
            g.call(this);
            if (!d || this.open || this._inDeadZone(o.pageY)) {
                f.pause();
                c.pause();
                this._setMoving(false);
                return
            }
            k = q.clientWidth * this.options.scrollRegion;
            j = q.clientWidth - k;
            l = (this.options.speedUpDuration / this.options.speedUpRegion) * (1 - this.options.speedUpAmount);
            m = 0;
            i = o.pageX;
            if (i < k && this.scrollLeft > 0) {
                b = -1;
                m = 1 - i / k;
                this._setMoving(true)
            } else {
                if (i > j && this.scrollLeft < this._maxScroll()) {
                    b = 1;
                    m = (i - j) / k;
                    this._setMoving(true)
                } else {
                    m = 0;
                    this._setMoving(false)
                }
            }
            n = f.getCurrentTime();
            if (m >= (1 - this.options.speedUpRegion)) {
                m = 1 - this.options.speedUpRegion;
                p = m * l;
                if (n < p) {
                    f.setCurrentTime(p)
                }
                if (f.isPaused()) {
                    f.play()
                }
            } else {
                p = m * l;
                if (!f.isPaused()) {
                    f.pause()
                }
                if (n != p) {
                    f.setCurrentTime(p)
                }
            }
        };
        var g = function() {
            var j = -1;
            if (d && !this.open) {
                j = Math.floor((i + this.scrollLeft) / this.liWidth)
            }
            if (this._hoverIndex != j) {
                this.highlightPanel(j);
                this._hoverIndex = j
            }
        };
        var a = function(j) {
            if (d != j) {
                d = j;
                g.call(this);
                if (!d) {
                    this._setMoving(false);
                    f.pause();
                    c.pause()
                }
            }
        };
        return {
            options: {
                selector: ".year-nav",
                scrollDuration: 5,
                scrollEasing: [0.1, 0, 0.9, 1],
                scrollRegion: 1 / 4,
                speedUpRegion: 1 / 5,
                speedUpAmount: 1 / 5,
                speedUpDuration: 1,
                deadZoneSize: 10
            },
            hoverScroll: t.enableHoverScroll(),
            open: false,
            liWidth: 400,
            _inDeadZone: function(k) {
                var j = this.carouselOffset.bottom - this.options.deadZoneSize;
                return (k > j)
            },
            openYear: function(j) {
                var k;
                if (this.hoverScroll && !this.open && j != this.open.year) {
                    F.snapTo(this.carousel);
                    c.pause();
                    this._setMoving(false);
                    this._setOpenYear(j);
                    k = this._expandYear()
                } else {
                    k = new v();
                    k.resolve();
                    k = k.promise()
                }
                return k
            },
            closeYear: function() {
                if (this.hoverScroll && this.open) {
                    this._collapseYear().then(function() {
                        this._setOpenYear(false)
                    }.bind(this))
                }
            },
            highlightPanel: function(j) {
                for (var k = 0; k < z; k++) {
                    y.removeClassName(this.listItems[k], "focus");
                    y.removeClassName(this.listItems[k], "hover");
                    y.removeClassName(this.listItems[k], "before-hover");
                    y.removeClassName(this.listItems[k], "after-hover");
                    if (j != -1) {
                        if (k == j) {
                            y.addClassName(this.listItems[k], "hover")
                        } else {
                            if (k < j) {
                                y.addClassName(this.listItems[k], "before-hover")
                            } else {
                                y.addClassName(this.listItems[k], "after-hover")
                            }
                        }
                    }
                }
            },
            _getBackgroundTranslate: function(l, j) {
                var k;
                if (A[j]) {
                    k = A[j]
                } else {
                    if (AC.Element.hasClassName(l, "year-background-one")) {
                        k = 0.3
                    } else {
                        if (AC.Element.hasClassName(l, "year-background-two")) {
                            k = 0.68
                        } else {
                            k = 0.5
                        }
                    }
                }
                k = 1 - k;
                return -(q.clientWidth * k - this.liWidth) + "px"
            },
            _resize: function() {
                var k = y.selectAll(".year-background", this.carousel),
                    j;
                y.setStyle(this.carousel, {
                    height: q.clientHeight + "px"
                });
                for (j = 0; j < k.length; j++) {
                    y.setVendorPrefixStyle(k[j], "transform", "translateX(" + this._getBackgroundTranslate(k[j], j + 1984) + ")");
                    y.setStyle(this.listItems[j], {
                        width: Math.max(q.clientWidth, 450) + "px"
                    })
                }
                this.carouselOffset = {
                    top: y.cumulativeOffset(this.carousel).top,
                    right: q.clientWidth,
                    left: 0
                };
                this.carouselOffset.bottom = this.carouselOffset.top + q.clientHeight;
                this._setScroll(this.scrollLeft)
            },
            _setMoving: function(j) {
                if (this._moving !== j) {
                    this._moving = j;
                    if (this._moving) {
                        y.addClassName(this.carousel, "moving");
                        y.removeClassName(this.carousel, "stationary")
                    } else {
                        y.removeClassName(this.carousel, "moving");
                        y.addClassName(this.carousel, "stationary")
                    }
                }
            },
            _setScroll: function(j) {
                j = Math.max(Math.min(j, this._maxScroll()), 0);
                if (this.hoverScroll) {
                    if (!this._reverseScrollEasing) {
                        this._reverseScrollEasing = new u(this.options.scrollEasing[1], this.options.scrollEasing[0], this.options.scrollEasing[3], this.options.scrollEasing[2])
                    }
                    c.setCurrentTime(this._reverseScrollEasing.get(j / this._maxScroll()) * this.options.scrollDuration)
                } else {
                    this.scrollLeft = j;
                    this.carousel.scrollLeft = this.scrollLeft
                }
            },
            _scrollToYear: function(k) {
                var j = k - 1984;
                this._setScroll(j * this.liWidth - q.clientWidth / 2 + this.liWidth / 2)
            },
            _expandYear: function(l) {
                var n = new v(),
                    o, j, k, m;
                x(function() {
                    y.addClassName(this.open.li, D);
                    y.addClassName(this.carousel, w);
                    j = this.scrollLeft - this.open.index * this.liWidth;
                    for (m = 0; m < this.listItems.length; m++) {
                        if (m <= this.open.index) {
                            k = j
                        } else {
                            k = q.clientWidth - this.liWidth - j
                        }
                        y.setVendorPrefixStyle(this.listItems[m], "transform", "translateX(" + k + "px)")
                    }
                    y.setVendorPrefixStyle(this.open.content, "transform", "translateY(-50%) translateX(" + (q.clientWidth - this.liWidth) / 2 + "px)");
                    y.setVendorPrefixStyle(this.open.bg, "transform", "translateX(0)")
                }.bind(this));
                o = function() {
                    y.removeVendorPrefixEventListener(this.open.bg, "transitionEnd", o);
                    n.resolve()
                }.bind(this);
                if (l) {
                    o()
                } else {
                    y.addVendorPrefixEventListener(this.open.bg, "transitionEnd", o)
                }
                return n.promise()
            },
            _collapseYear: function(k) {
                var m = new v(),
                    j, l;
                x(function() {
                    y.removeClassName(this.carousel, w);
                    for (l = 0; l < this.listItems.length; l++) {
                        y.removeVendorPrefixStyle(this.listItems[l], "transform")
                    }
                    this.open.content.setAttribute("style", "");
                    y.setVendorPrefixStyle(this.open.bg, "transform", "translateX(" + this._getBackgroundTranslate(this.open.bg, this.open.year) + ")")
                }.bind(this));
                j = function() {
                    y.removeVendorPrefixEventListener(this.open.bg, "transitionEnd", j);
                    y.removeClassName(this.open.li, D);
                    m.resolve()
                }.bind(this);
                if (k) {
                    j()
                } else {
                    y.addVendorPrefixEventListener(this.open.bg, "transitionEnd", j)
                }
                return m.promise()
            },
            _setOpenYear: function(j) {
                if (j === false) {
                    this.open = false
                } else {
                    this.open = {};
                    this.open.year = j;
                    this.open.index = j - 1984;
                    this.open.li = y.getElementById(j);
                    this.open.bg = y.select(".year-background", this.open.li);
                    this.open.content = y.select(".link-content", this.open.li)
                }
            },
            _closeYearInBackground: function() {
                if (this.open) {
                    this.open.content.setAttribute("style", "");
                    y.setVendorPrefixStyle(this.open.bg, "transform", "translateX(" + this._getBackgroundTranslate(this.open.bg, this.open.year) + ")")
                }
            },
            _openYearInBackground: function(m) {
                var j, k, l, n;
                this._closeYearInBackground();
                this._setOpenYear(m);
                this._scrollToYear(m);
                j = this.scrollLeft - this.open.index * this.liWidth;
                for (n = 0; n < this.listItems.length; n++) {
                    y.removeClassName(this.listItems[n], D);
                    if (n <= this.open.index) {
                        k = j
                    } else {
                        k = q.clientWidth - this.liWidth - j
                    }
                    l = y.select("a", this.listItems[n]);
                    l.setAttribute("tabindex", -1);
                    y.setVendorPrefixStyle(this.listItems[n], "transform", "translateX(" + k + "px)")
                }
                y.setVendorPrefixStyle(this.open.content, "transform", "translateY(-50%) translateX(" + (q.clientWidth - this.liWidth) / 2 + "px)");
                y.setVendorPrefixStyle(this.open.bg, "transform", "translateX(0)");
                y.addClassName(this.carousel, w);
                y.addClassName(this.open.li, D)
            },
            _maxScroll: function() {
                return this.liWidth * z - q.clientWidth
            },
            initialize: function() {
                G.on("DOMReady", function() {
                    if (this._initialized) {
                        return
                    }
                    this.carousel = y.select(this.options.selector);
                    if (this.carousel) {
                        this.scrollLeft = 0;
                        this.list = y.select("ul", this.carousel);
                        this.listItems = y.selectAll("li", this.list);
                        if (this.hoverScroll) {
                            h.call(this);
                            this._resize();
                            q.on("resize", this._resize.bind(this));
                            G.on("beforeSegue", function(j) {
                                if (j.fromState == "year" && j.toState == "landing") {
                                    if (q.clientHeight >= q.clientWidth) {
                                        this._closeYearInBackground()
                                    } else {
                                        this._openYearInBackground(j.fromYear)
                                    }
                                }
                            }.bind(this));
                            G.on("afterSegue", function(j) {
                                if (j.toState == "landing") {
                                    this._resize()
                                }
                            }.bind(this));
                            if (t.isIE()) {
                                y.addEventListener(this.carousel, "scroll", function() {
                                    if (this.carousel.scrollLeft) {
                                        this._setScroll(this.carousel.scrollLeft)
                                    }
                                }.bind(this))
                            }
                        }
                        this._initialized = true
                    }
                }.bind(this))
            }
        }
    }());
    return E
});
AC.define("application/segues/YearToLanding", ["require", "application/segues/BaseSegue", "application/shims/AC_Element", "events/WindowDelegate", "application/YearNav"], function(n) {
    var k = n("application/segues/BaseSegue");
    var l = n("application/shims/AC_Element");
    var m = n("events/WindowDelegate");
    var h = n("application/YearNav");
    var i = function(a, c, b) {
        this._init(a, c, b);
        this._segue = "close";
        this._endElement = a;
        if (b.hash >= 1984 && b.hash <= 2017) {
            this._scrollTo = "timeline"
        }
    };
    var j = i.prototype = new k();
    j._afterCleanup = function() {
        h.closeYear()
    };
    return i
});
AC.define("application/segues/LandingToYear", ["require", "application/segues/BaseSegue", "application/shims/AC_Element", "events/WindowDelegate", "application/YearNav"], function(h) {
    var l = h("application/segues/BaseSegue");
    var m = h("application/shims/AC_Element");
    var n = h("events/WindowDelegate");
    var i = h("application/YearNav");
    var j = function(a, c, b) {
        this._init(a, c, b);
        this._segue = "open"
    };
    var k = j.prototype = new l();
    k.play = function() {
        i.openYear(this.eventData.toYear).then(function() {
            this._play()
        }.bind(this));
        return this._deferred.promise()
    };
    k._play = function() {
        this._cleanContainers();
        document.body.dataset.segue = this._segue;
        window.requestAnimationFrame(this._start.bind(this));
        this._transitionEnd = this._end.bind(this);
        m.addVendorPrefixEventListener(this._endElement, "transitionEnd", this._transitionEnd)
    };
    k._afterCleanup = function() {
        var a = m.select(".hero .year", this.nextContainer);
        a.tabIndex = 0;
        a.focus()
    };
    return j
});
AC.define("application/segues/ScrollTo", ["require", "application/segues/BaseSegue", "application/ScrollController"], function(f) {
    var i = f("application/segues/BaseSegue");
    var j = f("application/ScrollController");
    var g = function(a, c, b) {
        this._init(a, c, b)
    };
    var h = g.prototype = new i();
    h.play = function() {
        j.animateTo(this.eventData.hash);
        this._deferred.resolve();
        return this._deferred.promise()
    };
    return g
});
AC.define("application/TimelineController", ["require", "application/Router", "eventEmitter/EventEmitter", "application/shims/AC_Element", "application/shims/AC_Object", "defer/Deferred", "events/ApplicationEvents", "application/ScrollController", "events/WindowDelegate", "application/PageService", "application/RuntimeEnvironment", "application/segues/FadeTo", "application/segues/YearToYear", "application/segues/YearToAnyYear", "application/segues/YearToLanding", "application/segues/LandingToYear", "application/segues/ScrollTo"], function(require) {
    var Router = require("application/Router");
    var EventEmitter = require("eventEmitter/EventEmitter");
    var AC_Element = require("application/shims/AC_Element");
    var AC_Object = require("application/shims/AC_Object");
    var Deferred = require("defer/Deferred");
    var applicationEvents = require("events/ApplicationEvents");
    var ScrollController = require("application/ScrollController");
    var WindowDelegate = require("events/WindowDelegate");
    var PageService = require("application/PageService");
    var RuntimeEnvironment = require("application/RuntimeEnvironment");
    var FadeTo = require("application/segues/FadeTo");
    var YearToYear = require("application/segues/YearToYear");
    var YearToAnyYear = require("application/segues/YearToAnyYear");
    var YearToLanding = require("application/segues/YearToLanding");
    var LandingToYear = require("application/segues/LandingToYear");
    var ScrollTo = require("application/segues/ScrollTo");
    var YEAR_STATE = "year";
    var LANDING_STATE = "landing";
    var SHOW_CLASS = "show";
    var CONTAINER_CLASS = "page-container";
    var Controller = function(options) {
        if (!AC.Environment.Feature.isDesktop()) {
            return
        }
        this.log("initializing");
        options = (options || {});
        this.debug = options.debug || false;
        this._initialRoute = false;
        this._cache = {};
        this._rendering = false;
        this._renderDebounce = null;
        this._renderDebounceDuration = 450;
        this._pageService = PageService;
        this._root = options.root || "/30-years";
        this._includesPath = "includes/content.html";
        this._landingContainer = null;
        this._currentContainer = AC_Element.select("." + CONTAINER_CLASS + "." + SHOW_CLASS);
        this._omniTag = AC_Element.select('meta[name="omni_page"]');
        this._initRouter();
        this._getInitialState();
        this.log("initialized, current state: " + this._currentState)
    };
    var proto = Controller.prototype = new EventEmitter();
    proto._trigger = function(type, data) {
        applicationEvents.trigger(type, data);
        this.trigger(type, data)
    };
    proto._initRouter = function() {
        this.log("init router, root:", this._root);
        this._router = new Router({
            debug: this.debug,
            root: this._root,
            intercept: "[data-route]",
            routes: {
                "/:year/": this._handleYear.bind(this),
                "/": this._handleLanding.bind(this)
            }
        });
        this._router.initialize();
        this.log("router initialized")
    };
    proto._getInitialState = function() {
        var routeMatch = this._router.matchRoute(window.location.pathname);
        var params = routeMatch && routeMatch.params;
        if (params && params.year) {
            this._currentState = YEAR_STATE;
            this._previousYear = params.year
        } else {
            this._currentState = LANDING_STATE;
            this._previousYear = null
        }
        return this._currentState
    };
    proto.log = function() {
        var args = [].slice.call(arguments);
        if (this.debug) {
            console.log.apply(console, ["TimelineController::"].concat(args))
        }
    };
    proto._render = function(container, content, state) {
        var deferred = new Deferred();
        var script;
        if (state === YEAR_STATE || !container.innerHTML) {
            container.innerHTML = content;
            AC_Element.insert(container, document.body, "first");
            var scripts = AC_Element.selectAll("script");
            for (var i = 0, len = scripts.length; i < len; i++) {
                script = scripts[i];
                if (!script.getAttribute("src") && !script.getAttribute("data-analytics") && !script.getAttribute("data-has-run")) {
                    try {
                        eval(script.innerHTML);
                        script.setAttribute("data-has-run", "true")
                    } catch (e) {
                        console.warn("Inline script error", e)
                    }
                }
            }
            this._trigger("DOMReady")
        }
        deferred.resolve();
        return deferred.promise()
    };
    proto._updatePageTitle = function(data) {
        var newTitle = this._getBaseTitle();
        if (data.toYear) {
            newTitle += " - " + data.toYear
        }
        if (this._omniTag) {
            this._omniTag.setAttribute("content", newTitle)
        }
        document.title = newTitle
    };
    proto._getBaseTitle = function() {
        var title = document.title;
        var separator = /\s*\-\s*/;
        var parts = title.split(separator);
        return parts.slice(0, 2).join(" - ")
    };
    proto._fetch = function(path) {
        path += "includes/content.html";
        return this._pageService.fetch(path)
    };
    proto._getNewContainer = function() {
        var container = document.createElement("div");
        AC_Element.addClassName(container, CONTAINER_CLASS);
        return container
    };
    proto._getLandingContainer = function() {
        if (!this._landingContainer) {
            this._landingContainer = AC_Element.select("#landing");
            if (!this._landingContainer) {
                this._landingContainer = this._getNewContainer();
                this._landingContainer.id = "landing"
            }
        }
        return this._landingContainer
    };
    proto.transitionTo = function(state, container, routeData) {
        var path = routeData.path;
        var params = routeData.params;
        var year = params && params.year;
        var renderPagePromise, seguePagePromise, stateChangePromise;
        var eventData = {
            toYear: year,
            toYearIndex: Math.abs(1984 - parseInt(year, 10)) || null,
            fromYear: this._previousYear,
            fromYearIndex: Math.abs(1984 - parseInt(this._previousYear, 10)) || null,
            target: this,
            fromState: this._currentState,
            toState: state,
            hash: routeData.hash,
            originalEvent: routeData.originalEvent,
            fade: routeData.fade
        };
        if (routeData.first) {
            return
        }
        if (this._renderDebounce) {
            this.log("clearing debounce timeout");
            clearTimeout(this._renderDebounce)
        }
        this._trigger("beforeFetch", eventData);
        this._router._isTransitioning = true;
        var fetchPagePromise = this._fetch(path);
        if (this._rendering) {
            this._renderPop = window.location.pathname + window.location.hash;
            return fetchPagePromise
        }
        var renderAndTransition = function() {
            renderPagePromise = fetchPagePromise.then(function(content) {
                this._rendering = true;
                this.log("afterFetch");
                this._trigger("afterFetch", eventData);
                this._trigger("beforeRender", eventData);
                this.log("beforeRender");
                return this._render(container, content, state)
            }.bind(this));
            seguePagePromise = renderPagePromise.then(function() {
                this.log("afterRender");
                this._trigger("afterRender", eventData);
                this.log("beforeSegue");
                this._trigger("beforeSegue", eventData);
                return this._segue(this._currentContainer, container, state, eventData)
            }.bind(this));
            stateChangePromise = seguePagePromise.then(function() {
                this.log("afterSegue");
                this._trigger("afterSegue", eventData);
                try {
                    this._trigger("stateChange", eventData)
                } catch (e) {
                    throw (e)
                } finally {
                    this._updatePageTitle(eventData);
                    this.log("stateChange");
                    this._currentContainer = container;
                    this._previousYear = year || null;
                    this._currentState = state;
                    this._rendering = false;
                    this._stateChangePromise = null;
                    this._router._isTransitioning = false
                }
            }.bind(this));
            stateChangePromise.then(function() {
                if (this._renderPop) {
                    this._router.navigate(this._renderPop, {
                        originalEvent: routeData.originalEvent,
                        silent: true,
                        nosave: true,
                        popstate: true,
                        fade: true
                    });
                    this._renderPop = null
                }
            }.bind(this))
        }.bind(this);
        if (routeData.popstate) {
            this._renderDebounce = setTimeout(renderAndTransition, this._renderDebounceDuration)
        } else {
            renderAndTransition()
        }
        return stateChangePromise
    };
    proto._segue = function(prevContainer, nextContainer, state, data) {
        var SegueCtor, segue;
        if (this._currentState === LANDING_STATE && state === YEAR_STATE) {
            SegueCtor = LandingToYear
        } else {
            if (this._currentState === YEAR_STATE && state === YEAR_STATE && data && data.fade) {
                SegueCtor = FadeTo
            } else {
                if (this._currentState === YEAR_STATE && state === YEAR_STATE) {
                    SegueCtor = YearToYear
                } else {
                    if (this._currentState === YEAR_STATE && state === LANDING_STATE) {
                        SegueCtor = YearToLanding
                    } else {
                        SegueCtor = ScrollTo
                    }
                }
            }
        } if (SegueCtor !== ScrollTo && RuntimeEnvironment.isStackedLayout()) {
            SegueCtor = FadeTo
        }
        segue = new SegueCtor(prevContainer, nextContainer, data);
        return segue.play()
    };
    proto._handleYear = function(data) {
        this.log("_handleYear");
        this.transitionTo(YEAR_STATE, this._getNewContainer(), data)
    };
    proto._handleLanding = function(data) {
        this.log("_handleLanding");
        this.transitionTo(LANDING_STATE, this._getLandingContainer(), data)
    };
    proto.getState = function() {
        return this._currentState
    };
    return Controller
});
AC.define("hero/HeroController", ["require", "events/ApplicationEvents", "application/shims/TYConfig", "application/RuntimeEnvironment", "media/ambient/ResizingAmbientContentPlayer", "application/TimelineController"], function(m) {
    var k = m("events/ApplicationEvents"),
        i = m("application/shims/TYConfig"),
        n = m("application/RuntimeEnvironment"),
        h = m("media/ambient/ResizingAmbientContentPlayer"),
        j = m("application/TimelineController");
    var l = (function() {
        var b = {},
            d = {};
        var c = "ambient-content";
        var g = 1.77777778,
            e = 1920,
            p = 1080;
        b.slideShow = i.ambientSlideshowSlides;
        var a = false,
            f = false;
        return {
            _initializeDOM: function() {
                d.wrapper = AC.Element.select(".thirty-hero");
                d.ambient = AC.Element.select(".ambient", d.wrapper);
                return this
            },
            _initializeCaret: function() {
                if (this.didInitializeCaret || !n.shouldAnimateHeroCaret()) {
                    return
                }
                this.didInitializeCaret = true;
                var o = AC.Element.select(".hero-next-section");
                if (n.supportsShimmerAnimation()) {
                    AC.Element.addClassName(o, "animated")
                }
                AC.Element.addVendorPrefixEventListener(o, "animationEnd", function r() {
                    AC.Element.addClassName(o, "shimmer");
                    AC.Element.removeClassName(o, "intro")
                });
                AC.Element.addClassName(o, "intro")
            },
            initialize: function() {
                if (window.location && window.location.hash.length > 0) {
                    a = true
                }
                k.on("DOMReady", function() {
                    if (this._initialized) {
                        return
                    }
                    try {
                        this._initializeDOM()
                    } catch (o) {
                        f = true;
                        return
                    }
                    if (!d.wrapper || !d.ambient) {
                        f = true;
                        return
                    }
                    this._initialized = true;
                    this._ambientContentPlayer = new h(b, d.ambient, e, p, {
                        loop: true,
                        className: c
                    });
                    this._ambientContentPlayer.load();
                    AC.Element.addClassName(d.ambient, this._ambientContentPlayer.type);
                    this._ambientContentPlayer.appendTo(d.ambient);
                    if (!f && !a) {
                        k.on("introOverlayFadeOutStart", this.play.bind(this));
                        k.on("introForceEndSequence", this.play.bind(this))
                    } else {
                        this._initializeCaret();
                        this.play()
                    }
                    k.on("beforeRender", function(r) {
                        if (r.toState === "landing" && r.fromState === "year") {
                            this.play();
                            this.skipToNext()
                        } else {
                            if (r.toState === "year") {
                                this.pause()
                            }
                        }
                    }.bind(this));
                    k.once("introOverlayFadeOutStart", this._initializeCaret.bind(this));
                    k.once("introForceEndSequence", this._initializeCaret.bind(this))
                }.bind(this));
                return this
            },
            play: function() {
                this._ambientContentPlayer.play()
            },
            pause: function() {
                this._ambientContentPlayer.pause()
            },
            skipToNext: function() {
                this._ambientContentPlayer.skipToNext()
            }
        }
    }());
    return l
});
AC.define("media/fullscreen/VideoTakeover", ["require", "events/WindowDelegate", "hero/HeroController", "application/shims/AC_Element", "application/ScrollController", "events/ApplicationEvents"], function(h) {
    var m = h("events/WindowDelegate"),
        k = h("hero/HeroController"),
        l = h("application/shims/AC_Element"),
        n = h("application/ScrollController"),
        j = h("events/ApplicationEvents");
    var i = (function() {
        var f = "video-",
            b = f + "player-wrapper",
            c = f + "player",
            r = f + "player-trigger",
            d = f + "trigger",
            a = "data-video-key",
            t = f + "reset",
           e = "#main";
        var u = {
            width: 848,
            height: 480,
            aspectRatio: 1.766666666
        };
        var g = {
            resizeOnUpdate: false,
            fullscreen: false
        };
        return {
            _isResetSection: function(o) {
                if (o.id.indexOf(t) > -1) {
                    return true
                }
                return false
            },
            _calculateVideoSize: function() {
                var o = m.clientHeight || document.documentElement.offsetHeight,
                    p = m.clientWidth || document.documentElement.offsetWidth;
                return {
                    width: p,
                    height: o
                }
            },
            _initializeDelegate: function() {
                var o = {
                    document: {
                        body: "width:100%; height:100%; overflow:hidden; margin:0; padding:0; border:0;"
                    },
                    selectAll: {
                        "#top, #landing": "visibility:hidden; opacity:0;"
                    },
                    section: "display:block; position:absolute; left:0; right:0; top:0; bottom:0; width:100%; height:100%; background-color: #FFF;"
                };
                this._gallery.setDelegate({
                    updateLayout: function() {
                        if (this.__onResizeElement) {
                            l.setStyle(this.__onResizeElement, {
                                visibility: "visible"
                            });
                            if (g.resizeOnUpdate) {
                                var w = i._calculateVideoSize();
                                i.setVideoSize(w.width, w.height)
                            } else {
                                var p = m.clientHeight || document.documentElement.offsetHeight;
                                var q = Math.round((p / 2) - (u.height / 2));
                                if (q < 0) {
                                    q = 0
                                }
                                l.setStyle(this.__onResizeElement, {
                                    paddingTop: q + "px"
                                })
                            }
                        }
                    },
                    __onResize: function(p) {
                        if (this.__onResizeElement) {
                            this.updateLayout()
                        }
                    },
                    willShow: function(E, F, J) {
                        if (i._isResetSection(J)) {
                            return
                        }
                        if (k && k._initialized) {
                            k.pause()
                        }
                        n.preventSnapping();
                        this.__currentScrollY = window.scrollY || document.documentElement.scrollTop;
                        for (var p in o.document) {
                            var H = document[p];
                            H.setAttribute("data-previous-style", H.style.cssText);
                            H.style.cssText = o.document[p]
                        }
                        for (var I in o.selectAll) {
                            var K = l.selectAll(I);
                            var G, D;
                            for (G = 0, D = K.length; G < D; G += 1) {
                                var H = K[G];
                                H.setAttribute("data-previous-style", H.style.cssText);
                                H.style.cssText = o.selectAll[I]
                            }
                        }
                        J.content.setAttribute("data-previous-style", J.content.style.cssText);
                        J.content.style.cssText = o.section + " visibility:hidden;";
                        var q = E.view.view();
                        this.__parentNode = q.parentNode;
                        q.style.height = "";
                        document.body.appendChild(q);
                        E.options.alwaysUseKeyboardNav = true;
                        this.__view = E;
                        this.__onResizeElement = J.content;
                        this.__boundOnResize = this.__onResize.bindAsEventListener(this);
                        m.on("resize", this.__boundOnResize, false)
                    },
                    didShow: function(q, z, A) {
                        if (i._isResetSection(A)) {
                            return
                        }
                        this.updateLayout();
                        var p = l.select("a.close", A.content);
                        if (!p) {
                            var y = document.createElement("a");
                            y.href = "#SwapViewFirstSection";
                            y.className = "close " + r;
                            y.innerHTML = "<span></span>";
                            A.content.appendChild(y)
                        }
                        window.scrollTo(0, 0)
                    },
                    willClose: function(E, F, J) {
                        if (i._isResetSection(F)) {
                            return
                        }
                        if (k && k._initialized) {
                            k.play()
                        }
                        n.allowSnapping();
                        for (var p in o.document) {
                            var H = document[p];
                            H.style.cssText = H.getAttribute("data-previous-style");
                            H.removeAttribute("data-previous-style")
                        }
                        for (var I in o.selectAll) {
                            var K = l.selectAll(I);
                            var G, D;
                            for (G = 0, D = K.length; G < D; G += 1) {
                                var H = K[G];
                                H.style.cssText = H.getAttribute("data-previous-style");
                                H.removeAttribute("data-previous-style")
                            }
                        }
                        F.content.style.cssText = F.content.getAttribute("data-previous-style");
                        F.content.removeAttribute("data-previous-style");
                        var q = E.view.view();
                        this.__parentNode.appendChild(q);
                        delete this.__parentNode;
                        if (this.__currentScrollY) {
                            window.scrollTo(0, this.__currentScrollY);
                            delete this.__currentScrollY
                        }
                        l.removeEventListener(window, "resize", this.__boundOnResize, false);
                        delete this.__boundOnResize;
                        delete this.__onResizeElement;
                        delete this.__view;
                        j.trigger("heroVideoStop")
                    }
                })
            },
            _initializeViewer: function() {
                var o = [this._screen],
                    p = {
                        useKeyboardNav: false,
                        escapeToClose: true,
                        silentTriggers: true,
                        shouldAnimateContentChange: false,
                        ensureInView: false,
                        heightFromFirstSection: false
                    };
                this._gallery = new AC.ViewMaster.Viewer(null, c, r, p);
                this._gallery.addSection(this._emptyEl);
                j.on("beforeFetch", function() {
                    this._gallery.showFirst()
                }.bind(this))
            },
            _createPlayerEl: function() {
                this._wrapper = document.createElement("DIV");
                l.addClassName(this._wrapper, b);
                this.el = document.createElement("DIV");
                this.el.setAttribute("id", c);
                l.addClassName(this.el, "gallery-view");
                this._screen = document.createElement("DIV");
                l.addClassName(this._screen, "screen");
                this._emptyEl = document.createElement("DIV");
                this._emptyEl.setAttribute("id", "video-reset");
                this._trigger = document.createElement("A");
                l.addClassName(this._trigger, r);
                l.addClassName(this._trigger, "block");
                l.addClassName(this._trigger, "full-span");
                this._trigger.setAttribute("href", "#");
                this._screen.appendChild(this._trigger);
                this.el.appendChild(this._screen);
                this.el.appendChild(this._emptyEl);
                this._wrapper.appendChild(this.el);
                return this.el
            },
            initialize: function() {
                j.once("DOMReady", function() {
                    this._createPlayerEl();
                   // document.body.appendChild(this._wrapper);
                    this._initializeViewer();
                    this._initializeDelegate()
                }.bind(this))
            },
            setVideoSize: function(p, q) {
                if (!(this._gallery && this._gallery.currentSection && this._gallery.currentSection._movieController)) {
                    return
                }
                this._gallery.currentSection._movieController.setVideoSizeForWidthAndHeight(p, q);
                var o = l.select(".moviePanel", this.el);
                if (o) {
                    o.setAttribute("style", "")
                }
            }
        }
    }());
    return i
});
AC.define("hero/HeroVideoController", ["require", "media/fullscreen/VideoTakeover", "events/BindingDelegate", "application/shims/AC_Element", "events/ApplicationEvents", "application/shims/AC_Environment"], function(n) {
    var i = n("media/fullscreen/VideoTakeover"),
        l = n("events/BindingDelegate"),
        m = n("application/shims/AC_Element"),
        k = n("events/ApplicationEvents"),
        h = n("application/shims/AC_Environment");
    var j = (function() {
        var a = "video-player-trigger";
        return {
            _getTargetFromEvent: function(b) {
                var c = b.target;
                if (m.hasClassName(c, a)) {
                    return c
                }
                return m.ancestor(c, "." + a) || null
            },
            _handleWindowClickDelegate: function(b) {
                var c = this._getTargetFromEvent(b);
                if (c !== null) {
                    b.preventDefault();
                    var d = m.select("video", c);
                    if (!d) {
                        return
                    }
                    if (this.player && this.player !== d) {
                        this.reset()
                    }
                    this.target = c;
                    this.player = d;
                    this._bindings = new l(this.player);
                    this._bindings.on("ended", this._closeFullscreenPlayer.bind(this));
                    this._bindings.on("pause ended", this._onVideoStop.bind(this));
                    this._playVideo()
                }
            },
            _playVideo: function() {
                m.addClassName(this.target, "active");
                this.player.play()
            },
            _closeFullscreenPlayer: function() {
                if (!this.player || !this.player.webkitDisplayingFullscreen) {
                    return
                }
                var b = this.player.parentNode;
                if (!b) {
                    return
                }
                this.player.currentTime = 0;
                b.removeChild(this.player);
                b.appendChild(this.player)
            },
            _onVideoStop: function() {
                if (this.player && this.player.webkitDisplayingFullscreen) {
                    return
                }
                m.removeClassName(this.target, "active");
                k.trigger("heroVideoStop");
                this.reset()
            },
            initialize: function() {
                this._isACMedia = false;
                if (h.Browser.lowerCaseUserAgent.indexOf("iphone") === -1) {
                    i.initialize();
                    this._isACMedia = true;
                    return
                }
                this._delegate = new l(m.select("#thirty"));
                this.initializeHTML5Playback()
            },
            reset: function() {
                this._bindings.off();
                this.target = this.player = this._bindings = null
            },
            initializeHTML5Playback: function() {
                this._delegate.on("click", this._handleWindowClickDelegate.bind(this))
            }
        }
    }());
    return j
});
/*AC.define("application/shims/HTML5VideoObject", ["require", "events/BindingDelegate", "application/shims/AC_Element"], function(g) {
    var h = g("events/BindingDelegate"),
        f = g("application/shims/AC_Element");
    var i = function(a) {
        this.wrapper = a;
        this.player = f.select(".video-player", a);
        this.poster = f.select(".video-poster", a);
        this.bindings = {};
        this._bindEvents()
    };
    var j = i.prototype;
    j._bindEvents = function() {
        this.bindings.wrapper = new h(this.wrapper);
        this.bindings.player = new h(this.player);
        this.bindings.wrapper.on("click", this._handleWrapperClickEvent.bind(this));
        this.bindings.player.on("ended", this.stop.bind(this))
    };
    j._handleWrapperClickEvent = function(a) {
        f.addClassName(this.wrapper, "active");
        this.play()
    };
    j.play = function() {
        this.player.play()
    };
    j.pause = function() {
        this.player.pause()
    };
    j.stop = function() {
        try {
            this.player.pause();
            this.player.currentTime = 0
        } catch (a) {}
        f.removeClassName(this.wrapper, "active")
    };
    j.destroy = function() {
        var a;
        for (a in this.bindings) {
            if (this.bindings.hasOwnProperty(a)) {
                this.bindings[a].off();
                delete this.bindings[a]
            }
        }
        this.wrapper = null;
        this.player = null;
        return this
    };
    return i
});*/
/*AC.define("application/shims/HTML5VideoTagDelegate", ["require", "application/shims/AC_Environment", "events/ApplicationEvents", "application/RuntimeEnvironment", "application/shims/AC_Element", "application/shims/HTML5VideoObject"], function(m) {
    var i = m("application/shims/AC_Environment"),
        j = m("events/ApplicationEvents"),
        n = m("application/RuntimeEnvironment"),
        l = m("application/shims/AC_Element"),
        k = m("application/shims/HTML5VideoObject");
    var h = (function() {
        var c = false,
            a = document.documentElement,
            b = "html5video";
        return {
            _stopOtherVideos: function(d) {
                var e, g, f = this.videos.length;
                for (e = 0; e < f; e++) {
                    g = this.videos[e];
                    if (g !== d) {
                        g.stop()
                    }
                }
            },
            initialize: function() {
                this.videos = [];
                if (n.shouldUseHTML5Video()) {
                    this.setShouldUseHTML5Video(true)
                }
                j.on("DOMReady", this.initializeVideos.bind(this))
            },
            setShouldUseHTML5Video: function(d) {
                if (typeof d === "boolean") {
                    c = d;
                    if (d) {
                        l.addClassName(a, b)
                    } else {
                        l.removeClassName(a, b)
                    }
                }
            },
            getShouldUseHTML5Video: function() {
                return c
            },
            initializeVideos: function() {
                var g = l.selectAll(".video-tag");
                var e, f = g.length,
                    d;
                for (e = 0; e < f; e++) {
                    d = new k(g[e]);
                    d.bindings.player.on("play", function(p) {
                        setTimeout(function() {
                            this.setAttribute("controls", "")
                        }.bind(p.player), 1000);
                        this._stopOtherVideos(p);
                        j.trigger("yearVideoPlay", {
                            el: p.player
                        })
                    }.bind(this, d));
                    d.bindings.player.on("pause", function() {
                        j.trigger("yearVideoPause", {
                            el: this
                        })
                    }.bind(d.player));
                    d.bindings.player.on("ended", function() {
                        this.removeAttribute("controls");
                        j.trigger("yearVideoEnded", {
                            el: this
                        })
                    }.bind(d.player));
                    this.videos.push(d)
                }
            },
            reset: function() {
                var d, e = this.videos.length;
                for (d = 0; d < e; d++) {
                    this.videos[d].destroy()
                }
            }
        }
    }());
    return h
});*/
/*AC.define("application/shims/AC_AutoGallery", ["require", "application/ScrollController", "application/shims/AC_Element", "events/WindowDelegate", "application/shims/HTML5VideoTagDelegate", "events/ApplicationEvents"], function(g) {
    var k = g("application/ScrollController"),
        j = g("application/shims/AC_Element"),
        l = g("events/WindowDelegate"),
        h = g("application/shims/HTML5VideoTagDelegate"),
        i = g("events/ApplicationEvents");
    window.AC.AutoGallery.reset = function() {
        this.galleries = {};
        this.slideshows = {}
    };
    window.AC.AutoGallery.__setUpGallery = function(r) {
        var e, a, c, f, d, p, b, q;
        e = this.Types.Registries.gallery.match(r, this._classPrefix);
        if (h.getShouldUseHTML5Video() && (e.name === "milestone" || e.name === "features")) {
            return
        }
        a = e.getOptions();
        c = r.down("." + this.__classNames.view);
        b = AC.Element.selectAll("." + c.id, r);
        q = c.id;
        c.id = c.id + "-" + Math.round(Math.random() * 9999);
        b.each(function(m) {
            AC.Element.removeClassName(m, q);
            AC.Element.addClassName(m, c.id)
        });
        if (this.__galleryViewIsValid(c)) {
            f = r.select("." + this.__classNames.content);
            f = f.concat(r.select("a." + c.id));
            f = this.__parseContent(f);
            d = e.context.viewer || AC.ViewMaster.Viewer;
            p = this.galleries[c.id] = new d(f, c.id, c.id, a);
            p.__type = e;
            p.__wrapper = r;
            this.__setUpDelegate(c, e);
            this.__setUpSlideshow(c, r);
            p._repaintTriggers = function(n, m, o) {
                return
            }.bind(p, d.prototype._repaintTriggers)
        }
        i.trigger("autoGalleryInit", {
            view: p
        })
    };
    window.AC.AutoGallery.addType("milestone", {
        ensureInView: false,
        shouldAnimateContentChange: false
    }, AC.Function.emptyFunction, "video", {});
    window.AC.AutoGallery.addType("features", {
        ensureInView: false,
        shouldAnimateContentChange: false
    }, AC.Function.emptyFunction, "video", {
        delegate: {
            willShow: function(a, b, c) {
                i.trigger("yearVideoPlay", {
                    el: a.__wrapper
                })
            }
        }
    });
    return window.AC.AutoGallery
});*/
AC.define("application/shims/DOMReady", ["require", "events/ApplicationEvents", "application/shims/AC_AutoGallery"], function(d) {
    var f = d("events/ApplicationEvents");
    var e = d("application/shims/AC_AutoGallery");
    AC.onDOMReady(function() {
        f.trigger("DOMReady", {
            nativeEvent: true
        })
    }.bind(this));
    f.on("DOMReady", function(a) {
        if (!a || !a.nativeEvent) {
            AC.loadRemoteContent._loadArgumentsByUrl = {}
        }
    });
    f.on("stateChange", function(a) {
        e.reset();
        e.initialize()
    })
});
AC.define("application/ResponsiveNav", ["require", "events/WindowDelegate"], function(e) {
    var d = e("events/WindowDelegate");
    var f = (function() {
        var a, n, c, b, l, m;
        var k = function() {
            var h = d.clientWidth,
                g = h / 1024;
            if (g >= 1) {
                AC.Element.setVendorPrefixStyle(a, "transform", "none");
                AC.Element.setVendorPrefixStyle(b, "transform", "none");
                AC.Element.setStyle(n, {
                    height: c.height + "px"
                });
                AC.Element.setStyle(l, {
                    height: m.height + "px"
                })
            } else {
                AC.Element.setVendorPrefixStyle(a, "transform", "scale(" + g + ")");
                AC.Element.setVendorPrefixStyle(b, "transform", "scale(" + g + ")");
                AC.Element.setStyle(n, {
                    height: c.height * g + "px"
                });
                AC.Element.setStyle(l, {
                    height: m.height * g + "px"
                })
            }
        };
        return {
            initialize: function() {
                if (!AC.Element.hasClassName(document.documentElement, "responsive")) {
                    return
                }
                AC.onDOMReady(function() {
                    a = AC.Element.select("#globalheader");
                    b = AC.Element.select("#globalfooter");
                    n = AC.Element.select(".globalheader-wrapper");
                    l = AC.Element.select(".globalfooter-wrapper");
                    if (a && b && n && l) {
                        c = AC.Element.getBoundingBox(a);
                        m = AC.Element.getBoundingBox(b);
                        c.height = c.height + parseInt(AC.Element.getStyle(a, "marginTop")) + parseInt(AC.Element.getStyle(a, "marginBottom"));
                        m.height = m.height + parseInt(AC.Element.getStyle(b, "marginTop")) + parseInt(AC.Element.getStyle(b, "marginBottom"));
                        AC.Element.addClassName(n, "responsive");
                        AC.Element.addClassName(l, "responsive");
                        d.on("resize", k);
                        k()
                    }
                })
            }
        }
    }());
    return f
});
AC.define("animationSequencer/vendor/utils", [], function() {
    return {
        isNum: function(b) {
            return typeof b === "number"
        },
        isArray: function(c) {
            var d = Object.prototype.toString;
            return d.call(c) === "[object Array]"
        },
        addClass: function(d, c) {
            d.classList.add(c)
        },
        removeClass: function(d, c) {
            d.classList.remove(c)
        },
        hasClass: function(d, c) {
            return d.contains(c)
        },
        defaults: function(h, e) {
            var f = {};
            e = e || {};
            for (var g in h) {
                if (h.hasOwnProperty(g)) {
                    f[g] = (e[g] != null) ? e[g] : h[g]
                }
            }
            return f
        },
        defaultProps: function(i, j, g) {
            var f = this.defaults(j, g);
            for (var h in f) {
                if (f.hasOwnProperty(h)) {
                    i[h] = f[h]
                }
            }
        },
        invoke: function(f, e) {
            var d = [].slice.call(arguments, 2);
            if (!Array.isArray(f)) {
                throw new Error("List is not an array")
            }
            f.forEach(function(b) {
                var a = b[e];
                if (a && typeof a === "function") {
                    a.apply(b, d)
                }
            })
        }
    }
});
AC.define("animationSequencer/Tween", ["require", "animationSequencer/vendor/KeySpline", "animationSequencer/vendor/EasingFunctions", "animationSequencer/vendor/utils"], function(o) {
    var l = o("animationSequencer/vendor/KeySpline");
    var m = o("animationSequencer/vendor/EasingFunctions");
    var i = "Easing option must be one of: String, Array[Number:4], or Function. Given: ";
    var j = "KeySpline easing expected an array of exactly four (4) numbers, given: ";
    var p = o("animationSequencer/vendor/utils");

    function k(a) {
        a = a || {};
        p.defaultProps(this, k.defaults, a);
        this._easingFunction = this._createEasing(this.easing)
    }
    k.defaults = {
        from: 0,
        to: 1,
        duration: 1,
        easing: "linear"
    };
    var n = k.prototype;
    n._createEasing = function(b) {
        var a;
        if (typeof b === "string") {
            a = this._createPredefinedEasing(b)
        } else {
            if (Array.isArray(b)) {
                a = this._createBezierEasing(b)
            } else {
                if (typeof b === "function") {
                    a = b
                } else {
                    throw new TypeError(i + b)
                }
            }
        }
        return a
    };
    n._createBezierEasing = function(d) {
        var b;
        var a = d;
        var c = d.every(function(e) {
            return (typeof e === "number")
        });
        if (d.length !== 4 || !c) {
            throw new TypeError(j + d)
        }
        b = new l(a[0], a[1], a[2], a[3]);
        return function(e, f, g, h) {
            return b.get(e / h) * g
        }
    };
    n._createPredefinedEasing = function(a) {
        var b = m[a];
        var c = "";
        if (!b) {
            c += 'Easing function "' + b;
            c += '" not recognized among the following: ';
            c += Object.keys(m).join(", ");
            throw new Error(c)
        }
        return b
    };
    n._getInterpolatedValue = function(d, a, b, c) {
        return this._easingFunction(d, a, b, c)
    };
    n.valueAtLocation = function(a) {
        if (a < 0 || a > 1) {
            return null
        }
        var b = this.duration * a;
        return this.valueAtTime(b)
    };
    n.valueAtPercent = function(a) {
        if (a < 0 || a > 100) {
            return null
        }
        return this.valueAtLocation(a / 100)
    };
    n.valueAtTime = function(a) {
        if (a < 0 || a > this.duration) {
            return null
        }
        return this._getInterpolatedValue(a, this.from, this.to - this.from, this.duration)
    };
    return k
});
AC.define("animationSequencer/renderers/InlineStyleRenderer", [], function() {
    var d = (function() {
        var a, b;
        if (d) {
            return
        }
        b = document.createElement("div");
        a = ["transform", "webkitTransform", "MozTransform", "msTransform", "oTransform"];
        a.some(function(f) {
            if (f in b.style) {
                d = f;
                return true
            }
        });
        return d
    })();
    var c = {
        transformFunctions: ["none", "matrix", "translate", "translateX", "translateY", "scale", "scaleX", "scaleY", "rotate skewX", "skewY", "matrix3d", "translate3d", "translateZ", "scale3d", "scaleZ", "rotate3d", "rotateX", "rotateY", "rotateZ", "perspective"],
        render: function(a, f) {
            var b = this._parseProps(f);
            b.forEach(function(e) {
                a.style[e.prop] = e.value
            })
        },
        _mergeTransformProps: function(b) {
            var a = b.reduce(this._partialPropValue.bind(this), "");
            return {
                prop: d,
                value: a
            }
        },
        _partialPropValue: function(g, b) {
            var a = this._parseTransformFunction(b.prop);
            var h = [g, " ", a, "(", b.value, ")"].join("");
            return h
        },
        _parseTransformFunction: function(a) {
            return a.replace("transform-", "")
        },
        _isTransformFunction: function(a) {
            return this.transformFunctions.indexOf(a) !== -1
        },
        _parseProps: function(l) {
            var m = [];
            var n = [];
            var b;
            var i;
            var a;
            for (var o = 0, p = l.length; o < p; o++) {
                a = l[o];
                b = this._isTransformFunction(a.prop);
                [].push.call(b ? n : m, a)
            }
            if (n.length) {
                i = this._mergeTransformProps(n);
                m.push(i)
            }
            return m
        }
    };
    return c
});
AC.define("animationSequencer/clip/ElementClip", ["require", "animationSequencer/vendor/utils", "animationSequencer/Tween", "animationSequencer/clip/BaseClip", "animationSequencer/renderers/InlineStyleRenderer"], function(p) {
    var i = p("animationSequencer/vendor/utils");
    var k = p("animationSequencer/Tween");
    var l = p("animationSequencer/clip/BaseClip");
    var j = p("animationSequencer/renderers/InlineStyleRenderer");
    var o = "Invalid element or selector: ";

    function m(a) {
        a = i.defaults(m.DEFAULTS, a);
        this.props = a.props || [];
        if (a.selector || typeof a.element === "string") {
            this.el = document.querySelector(a.selector || a.element)
        } else {
            this.el = a.element
        } if (!this.el || !this.el.nodeType || this.el.nodeType !== 1) {
            throw new TypeError(o + a.element)
        }
        if (!a.renderer) {
            this.renderer = j
        }
        l.call(this, a.duration, a);
        this._initProps()
    }
    m.DEFAULTS = {
        props: [],
        selector: null,
        element: ".default_selector",
        renderer: j,
        duration: 1
    };
    m.create = function(a) {
        return new m(a)
    };
    m.validate = function(a) {
        var b = "selector" in a || "element" in a;
        return b
    };
    var n = m.prototype = Object.create(l.prototype);
    n._initProps = function() {
        this.props.forEach(function(a) {
            a.tween = this._createTween({
                easing: a.easing || l.DEFAULT_EASING,
                from: a.from,
                to: a.to,
                duration: this.getDuration()
            })
        }.bind(this))
    };
    n._createTween = function(a) {
        return new k(a)
    };
    n.update = function(a) {
        if (this.props.length < 1) {
            return
        }
        var b = this.props.map(function(f) {
            var d = f.tween;
            var e = f.units;
            var c = d.valueAtTime(a);
            c = (e ? (c + e) : c);
            return {
                prop: f.property,
                value: c
            }
        });
        this._renderer.render(this.el, b);
        this.trigger("tween_update", {
            el: this.el,
            context: b
        })
    };
    n.getCurrentTime = function() {
        return this._currentTime
    };
    n.setCurrentTime = function(a) {
        if (a < 0 || a > this.getDuration()) {
            return
        }
        this._currentTime = a;
        this.update(this._currentTime)
    };
    return m
});
AC.define("animationSequencer/clip/TimedClip", ["require", "animationSequencer/vendor/utils"], function(e) {
    var f = e("animationSequencer/vendor/utils");

    function g(a, b) {
        b = f.defaults(g.DEFAULTS, (b || {}));
        this._clip = a;
        this._startDelay = b.startDelay || 0;
        this._loop = b.loop || false;
        this._fill = b.fill || "none"

    }
    g.DEFAULTS = {
        fill: "none",
        loop: false,
        startDelay: 0
    };
    g.FILL_MODES = ["none", "forwards", "backwards", "both"];
    var h = g.prototype;
    h._show = function() {
        if (this._isHidden) {
            this._isHidden = false;
            this._clip.show()
        }
    };
    h._applyFill = function(a) {
        if (this.getFill() === "none") {
            return
        }
        var b = this.getDuration();
        var d = a > b;
        var l = this.getFill();
        var m = d && l === "forwards";
        var n = !d && l === "backwards";
        var c = l === "both" || m || n;
        if (c) {
            this._clip.setCurrentTime((d) ? b : 0)
        }
    };
    h._hide = function() {
        if (!this._isHidden) {
            this._isHidden = true;
            this._clip.hide()
        }
    };
    h.setEasingDirection = function(a) {
        return this._clip.setEasingDirection(a)
    };
    h.on = function() {
        this._clip.on.apply(this._clip, arguments)
    };
    h.off = function() {
        this._clip.off.apply(this._clip, arguments)
    };
    h.trigger = function() {
        this._clip.trigger.apply(this._clip, arguments)
    };
    h.getCurrentTime = function() {
        return this._currentTime
    };
    h.setCurrentTime = function(a, b) {
        if (a < 0 || a > this.getDuration()) {
            this._clip.inEffect = false;
            this._applyFill(a)
        } else {
            this._clip.inEffect = true;
            this._clip.setCurrentTime(a, b)
        }
    };
    h.getDuration = function() {
        return this._clip.getDuration()
    };
    h.getStartDelay = function() {
        return this._startDelay
    };
    h.setStartDelay = function(a) {
        if (f.isNum(a)) {
            this._startDelay = a
        }
    };
    h.getLoop = function() {
        return this._loop
    };
    h.setLoop = function(a) {
        this._loop = !!a
    };
    h.getFill = function() {
        return this._fill
    };
    h.setFill = function(a) {
        var b = g.FILL_MODES;
        if (b.indexOf(a.toLowerCase()) !== -1) {
            this._fill = a
        }
    };
    return g
});
/*AC.define("animationSequencer/clip/CompositeClip", ["require", "animationSequencer/clip/TimedClip"], function(f) {
    var g = f("animationSequencer/clip/TimedClip");

    function h(a) {
        if (a && a.length) {
            this._clips = a.map(this._ensureTimedClip);
            this._duration = this._calcDuration()
        }
    }
    var e = h.prototype;
    e._calcDuration = function(b) {
        b = b || this._clips;
        var a = b.reduce(function(d, c) {
            var j = c.getStartDelay() + c.getDuration();
            return (j > d) ? j : d
        }, 0);
        return a
    };
    e._ensureTimedClip = function(a) {
        if (!(a instanceof g)) {
            a = new g(a)
        }
        return a
    };
    e._getLocalTime = function(b, a) {
        return a - b.getStartDelay()
    };
    e._getEligibleClips = function() {
        return this._clips
    };
    e.addClip = function(a) {
        a = this._ensureTimedClip(a);
        this._clips.push(a);
        this._duration = this._calcDuration()
    };
    e.on = function() {
        var a = arguments;
        this._clips.forEach(function(b) {
            b.on.apply(b, a)
        })
    };
    e.off = function() {
        var a = arguments;
        this._clips.forEach(function(b) {
            b.off.apply(b, a)
        })
    };
    e.trigger = function() {
        var a = arguments;
        this._clips.forEach(function(b) {
            b.trigger.apply(b, a)
        })
    };
    e.setEasingDirection = function(a) {
        this._clips.forEach(function(b) {
            b.setEasingDirection(a)
        })
    };
    e.getDuration = function() {
        return this._duration
    };
    e.getCurrentTime = function() {
        return this._currentTime
    };
    e.setCurrentTime = function(a, b) {
        var c = this._getEligibleClips();
        if (!c || !c.length) {
            return
        }
        c.forEach(function(j) {
            var d = this._getLocalTime(j, a);
            j.setCurrentTime(d, b)
        }.bind(this))
    };
    e.getPlaybackRate = function() {
        return this._playbackRate
    };
    e.setPlaybackRate = function(a) {
        if (isNaN(a)) {
            return
        }
        this._playbackRate = a
    };
    return h
});*/
/*AC.define("animationSequencer/Timeline", ["require", "animationSequencer/clip/CompositeClip", "animationSequencer/clip/TimedClip", "animationSequencer/clip/TweenClip", "animationSequencer/clip/ElementClip"], function(h) {
    var i = h("animationSequencer/clip/CompositeClip");
    var j = h("animationSequencer/clip/TimedClip");
    var k = "Invalid duration for the following clip; must be number greater than or equal to zero (0)";
    var l = 'Invalid clip type: "';
    var g = {
        clipTypes: {
            Tween: h("animationSequencer/clip/TweenClip"),
            Element: h("animationSequencer/clip/ElementClip")
        },
        create: function(a) {
            if (this.validTimeline(a)) {
                return this._buildTimeline(a)
            }
            if (this.debug && console && typeof console.warn === "function") {
                console.warn("Timeline: invalid timeline data:", a)
            }
            return null
        },
        validTimeline: function(a) {
            return Array.isArray(a) && a.every(this._validClip.bind(this))
        },
        _validate: function() {
            return true
        },
        _buildTimeline: function(a) {
            var b = a.map(this._createTimedClip.bind(this));
            return new i(b)
        },
        _createTimedClip: function(a) {
            var b = this.clipTypes[a.clip];
            return new j(b.create(a), a)
        },
        _validClip: function(b) {
            var c;
            var e = b.clip;
            var d = this._validDuration(b);
            var a = typeof this.clipTypes[b.clip] === "function";
            if (!a) {
                throw new TypeError(l + e + '"\n\n' + JSON.stringify(b))
            }
            c = this.clipTypes[e].validate || this._validate;
            return d && c(b)
        },
        _validDuration: function(b) {
            var a = b.duration;
            var c = typeof a === "number" && a > 0;
            if (!c) {
                throw new TypeError(k + "\n\n" + JSON.stringify(b))
            }
            return c
        }
    };
    return g
});*/
/*
AC.define("animationSequencer/ElementAnimation", ["require", "animationSequencer/clip/ElementClip", "animationSequencer/player/BasicPlayer", "animationSequencer/Timeline", "animationSequencer/vendor/utils"], function(k) {
    var i = k("animationSequencer/clip/ElementClip");
    var l = k("animationSequencer/player/BasicPlayer");
    var j = k("animationSequencer/Timeline");
    var g = k("animationSequencer/vendor/utils").isArray;

    function h(a, c) {
        var b;
        if (g(a)) {
            b = j.create(a)
        } else {
            b = new i(a)
        }
        return new l(b, c)
    }
    return h
});
AC.define("application/shims/AC_Storage", ["require"], function(b) {
    return window.AC.Storage
});
AC.define("media/fullscreen/IOSVideoAutoplay", ["require", "events/BindingDelegate"], function(e) {
    var f = e("events/BindingDelegate");
    var d = (function() {
        return {
            _destroyPlayer: function() {
                if (this._callback) {
                    this._callback()
                }
                this._target.removeChild(this._player);
                this._events.off();
                this._target = this._player = this._events = this._callback = null
            },
            _createPlayer: function() {
                var a = document.createElement("video");
                a.autoplay = true;
                a.preload = "none";
                return a
            },
            _bindPlayerEvents: function(a) {
                this._events = new f(a);
                this._events.once("pause ended", this._destroyPlayer.bind(this))
            },
            play: function(b, c, a) {
                this._target = c || document.body;
                this._callback = a;
                if (!this._player) {
                    this._player = this._createPlayer();
                    this._bindPlayerEvents(this._player);
                    this._target.appendChild(this._player)
                }
                if (this._player.src !== b) {
                    this._player.src = b
                }
                this._player.play()
            }
        }
    }());
    return d
});*/
/*AC.define("media/autoplay/FirstVisitVideoAutoplayer", ["require", "application/shims/AC_Storage", "application/shims/TYConfig", "application/shims/AC_Element", "application/shims/AC_Environment", "hero/HeroVideoController", "defer/Deferred", "events/BindingDelegate", "media/fullscreen/IOSVideoAutoplay", "events/ApplicationEvents"], function(t) {
    var m = t("application/shims/AC_Storage"),
        p = t("application/shims/TYConfig"),
        o = t("application/shims/AC_Element"),
        r = t("application/shims/AC_Environment"),
        l = t("hero/HeroVideoController"),
        n = t("defer/Deferred"),
        v = t("events/BindingDelegate"),
        q = t("media/fullscreen/IOSVideoAutoplay"),
        w = t("events/ApplicationEvents");
    var u = (function() {
        var a = "mac30_autoplay";
        return {
            _isLandingPage: function() {
                var b = new RegExp("^" + p.routePath + "/$");
                if (window.location.pathname.match(b)) {
                    return true
                }
                return false
            },
            _onDOMReady: function() {
                if (this._initialized) {
                    return
                }
                this._initialized = true;
                if (m.getItem(a)) {
                    this._registerViewed();
                    this._complete.resolve();
                    return
                }
                w.on("heroVideoStop", this._handleHeroVideoStop.bind(this));
                if (this._isLandingPage()) {
                    return this._handleAutoplayVideoAction()
                }
                w.on("afterRender", this._handleStateChange.bind(this))
            },
            _handleStateChange: function(b) {
                if (!this._triggered && b.toState === "landing") {
                    this._registerViewed()
                }
            },
            _registerViewed: function() {
                if (m.getItem(a) === null) {
                    m.setItem(a)
                }
                this._triggered = true;
                this._ready.resolve()
            },
            _handleAutoplayVideoAction: function() {
                this._prefetchPlayerAssets().then(function() {
                    w.trigger("willAutoplayVideo");
                    this._autoplayVideo();
                    this._registerViewed()
                }.bind(this))
            },
            _handleHeroVideoStop: function() {
                this._complete.resolve()
            },
            _autoplayVideo: function() {
                if (r.Browser.os.toLowerCase() !== "ios" && l._isACMedia) {
                    return this._playACMediaVideo()
                }
                this._registerViewed();
                this._complete.resolve();
                return
            },
            _playACMediaVideo: function() {
                var c = o.select(".hero-content .video-play");
                var b = document.createEvent("MouseEvent");
                b.initEvent("click", true, true);
                c.dispatchEvent(b)
            },
            _reenableAutoplay: function() {
                m.removeItem(a);
                this._triggered = false
            },
            _prefetchPlayerAssets: function() {
                var c = new n(),
                    d = ["http://images.apple.com/v/30-years/c/images/close.png", "../../images.apple.com/global/ac_media_player/elements/quicktime/ac_media_regular_background.png", "http://images.apple.com/global/ac_media_player/elements/quicktime/ac_media_regular_controls.png"];
                var f, e = [],
                    b = d.length;
                for (f = 0; f < b; f++) {
                    e.push(this._createPrefetchPromise(d[f]))
                }
                n.all(e).then(c.resolve.bind(c));
                return c.promise()
            },
            _createPrefetchPromise: function(c) {
                var d = new n(),
                    b = document.createElement("img"),
                    e = new v(b);
                e.once("load", d.resolve.bind(d));
                b.setAttribute("src", c);
                return d.promise()
            },
            initialize: function() {
                this._triggered = false;
                this._ready = new n();
                this._complete = new n();
                w.on("DOMReady", this._onDOMReady.bind(this))
            },
            ready: function() {
                if (!this._ready && this._ready._defer && this._ready._defer.status === 1) {
                    return new n().resolve()
                }
                return this._ready.promise()
            },
            complete: function() {
                if (!this._complete && this._complete._defer && this._complete._defer.status === 1) {
                    return new n().resolve()
                }
                return this._complete.promise()
            }
        }
    }());
    return u
});*/
AC.define("intro/IntroController", ["require", "defer/Deferred", "events/WindowDelegate", "animationSequencer/ElementAnimation", "application/ScrollController", "events/ScrollLockDelegate", "events/ApplicationEvents", "hero/HeroController", "application/RuntimeEnvironment", "eventEmitter/EventEmitter", "application/shims/AC_Element", "media/autoplay/FirstVisitVideoAutoplayer"], function(w) {
    var u = w("defer/Deferred"),
        n = w("events/WindowDelegate"),
        y = w("animationSequencer/ElementAnimation"),
        z = w("application/ScrollController"),
        p = w("events/ScrollLockDelegate"),
        A = w("events/ApplicationEvents"),
        t = w("hero/HeroController"),
        q = w("application/RuntimeEnvironment"),
        o = w("eventEmitter/EventEmitter"),
        v = w("application/shims/AC_Element"),
        x = w("media/autoplay/FirstVisitVideoAutoplayer");
    var r = (function() {
        var b = 3000;
        var d = "../../images.apple.com/v/30-years/c/images/hero_thirty_logo.png";
        var a = {
            sequenceStart: "sequenceStart",
            sequenceEnd: "sequenceEnd",
            logoFadeInStart: "logoFadeInStart",
            logoFadeInEnd: "logoFadeInEnd",
            overlayFadeOutStart: "overlayFadeOutStart",
            overlayFadeOutEnd: "overlayFadeOutEnd"
        };
        var e = "intro-start",
            c = "intro-complete";
        return {
            _initializeDOM: function() {
                this._introOverlayEl = v.select("#main .intro-overlay");
                this._heroImageEl = v.select("#main .hero-overlay")
            },
            _runSequence: function() {
                if (this._didForceEndSequence) {
                    return
                }
                this._didRunSequence = true;
                var f = new u();
                this._fadeOutOverlay().then(this._endSequence.bind(this)).then(f.resolve.bind(f));
                return f.promise()
            },
            _fadeOutOverlay: function() {
                var h = new u();

                function f(j) {
                    var k = "fade-out-overlay";
                    v.addVendorPrefixEventListener(this._introOverlayEl, "transitionEnd", function i(l) {
                        v.addClassName(this._introOverlayEl, "hidden");
                        v.removeClassName(this._introOverlayEl, l);
                        this.events.trigger(this._eventList.overlayFadeOutEnd);
                        A.trigger(this._eventList.overlayFadeOutEnd);
                        j.resolve()
                    }.bind(this, k));
                    v.addClassName(this._introOverlayEl, k)
                }

                function g(j) {
                    var i = new y({
                        element: this._introOverlayEl,
                        duration: 2,
                        props: [{
                            property: "opacity",
                            from: 1,
                            to: 0,
                            units: "",
                            easing: "easeInQuad"
                        }]
                    });
                    i.on("ended", function() {
                        v.addClassName(this._introOverlayEl, "hidden");
                        this.events.trigger(this._eventList.overlayFadeOutEnd);
                        A.trigger(this._eventList.overlayFadeOutEnd);
                        j.resolve()
                    }.bind(this));
                    i.play()
                }
                this.events.trigger(this._eventList.overlayFadeOutStart);
                v.addClassName(document.documentElement, e);
                A.trigger("introOverlayFadeOutStart");
                if (q.isFirefox()) {
                    setTimeout(f.bind(this, h), 0)
                } else {
                    if (q.isIE() && q.getIEVersion() < 11) {
                        g.call(this, h)
                    } else {
                        f.call(this, h)
                    }
                }
                return h.promise()
            },
            _endSequence: function() {
                this._forceEndSequence();
                this.events.trigger(this._eventList.sequenceEnd);
                return new u().resolve()
            },
            _forceEndSequence: function() {
                this._didForceEndSequence = true;
                this.events.trigger("forceEndSequence");
                A.trigger("introForceEndSequence");
                this.events.off();
                p.unlockScrolling();
                v.removeClassName(document.documentElement, e);
                v.addClassName(document.documentElement, c)
            },
            _canPlayHeroContent: function() {
                var f = new u();
                if (t._ambientContentPlayer && t._ambientContentPlayer.isReady) {
                    return f.resolve()
                }
                A.on("ambientContentReady", f.resolve.bind(f));
                return f.promise()
            },
            _didLoadLogo: function() {
                var g = new u();
                this.events.trigger(this._eventList.sequenceStart);
                var f = new Image();
                f.addEventListener("load", g.resolve.bind(g));
                f.src = d;
                return g.promise()
            },
            _setUpIntroAnimation: function(g) {
                this._didForceEndSequence = false;
                try {
                    this._initializeDOM()
                } catch (f) {
                    this._forceEndSequence();
                    return
                }
                if (!this._introOverlayEl || !this._heroImageEl) {
                    this._forceEndSequence();
                    return
                }
                this._initialized = true;
                v.removeClassName(document.documentElement, e);
                v.removeClassName(document.documentElement, c);
                t.pause();
                x.complete().then(function() {
                    p.lockScrolling();
                    this.events.once(this._eventList.overlayFadeOutStart, p.unlockScrolling.bind(p));
                    u.all([this._canPlayHeroContent(), this._didLoadLogo()]).then(this._runSequence.bind(this));
                    setTimeout(function() {
                        if (!this._didRunSequence) {
                            this._forceEndSequence()
                        }
                    }.bind(this), b)
                }.bind(this));
                return this
            },
            initialize: function() {
                this._eventList = a;
                this.events = new o();
                A.once("DOMReady", function(f) {
                    this._forceEndSequence()
                }.bind(this));
                return;
                A.once("DOMReady", function(f) {
                    if (!this._initialized && f.nativeEvent) {
                        this._setUpIntroAnimation()
                    }
                }.bind(this));
                A.once("willAutoplayVideo", this._setUpIntroAnimation.bind(this))
            }
        }
    }());
    return r
});
/*AC.define("events/ShowOnScroll", ["require"], function(S) {
    var H = window.AC;
    H.ShowOnScroll = H.Class();
    H.ShowOnScroll.prototype = {
        __defaultOptions: {
            threshold: 0.5,
            timeInView: 1,
            scrollEndDelay: 0.4
        },
        initialize: function V(b, a) {
            if (typeof a !== "object") {
                a = {}
            }
            this._options = H.Object.extend(H.Object.clone(this.__defaultOptions), a);
            if (H.Environment.Browser.os === "iOS") {
                this._options.scrollEndDelay = 0
            }
            this._element = H.Element.getElementById(b);
            this._delegate = {};
            this.startObserving();
            H.Object.synthesize(this)
        },
        startObserving: function B() {
            if (typeof this.__boundOnScroll === "undefined") {
                this.__boundOnScroll = H.Function.bindAsEventListener(this.__onScroll, this)
            }
            if (typeof this.__boundRefreshMetrics === "undefined") {
                this.__boundRefreshMetrics = H.Function.bindAsEventListener(this.refreshMetrics, this)
            }
            if (typeof this.__boundWindowLoad === "undefined") {
                this.__boundWindowLoad = H.Function.bindAsEventListener(this.__onWindowLoad, this)
            }
            if (this._isObserving !== true) {
                H.Element.addEventListener(window, "scroll", this.__boundOnScroll);
                H.Element.addEventListener(window, "load", this.__boundWindowLoad);
                H.Element.addEventListener(window, "resize", this.__boundRefreshMetrics);
                H.Element.addEventListener(window, "orientationchange", this.__boundRefreshMetrics);
                this._isObserving = true
            }
        },
        stopObserving: function N() {
            if (this._isObserving === true) {
                H.Element.removeEventListener(window, "scroll", this.__boundOnScroll);
                H.Element.removeEventListener(window, "resize", this.__boundRefreshMetrics);
                H.Element.removeEventListener(window, "orientationchange", this.__boundRefreshMetrics);
                this._isObserving = false
            }
        },
        setDelegate: function K(a) {
            if (typeof a === "object") {
                this._delegate = a
            }
        },
        refreshMetrics: function D() {
            delete this._viewportMetrics;
            delete this._elementMetrics;
            this._viewportMetrics = this.viewportMetrics();
            this._elementMetrics = this.elementMetrics()
        },
        isInView: function E(a) {
            if (typeof a === "undefined") {
                a = this.pixelsInView()
            }
            return (a > 0)
        },
        isEnoughInView: function J(a) {
            if (typeof a === "undefined") {
                a = this.percentInView()
            }
            return (a === 0) ? false : (a >= this._options.threshold)
        },
        viewportMetrics: function T() {
            if (typeof this._viewportMetrics === "undefined") {
                this._viewportMetrics = {};
                this._viewportMetrics.height = window.innerHeight || document.documentElement.clientHeight;
                H.Object.synthesize(this)
            }
            return this._viewportMetrics
        },
        elementMetrics: function O() {
            if (typeof this._elementMetrics === "undefined") {
                this._elementMetrics = {};
                this._elementMetrics.height = this._element.offsetHeight;
                this._elementMetrics.offsetY = H.Element.cumulativeOffset(this._element).top;
                H.Object.synthesize(this)
            }
            return this._elementMetrics
        },
        pixelsInView: function G() {
            var c;
            var b = this.viewportMetrics();
            var d = this.elementMetrics();
            var a = this.elementViewportOffsetY();
            if (a >= 0) {
                c = b.height - a;
                if (c > d.height) {
                    c = d.height
                }
            } else {
                c = d.height + a
            } if (c < 0) {
                c = 0
            }
            return (this._pixelsInView = c)
        },
        percentInView: function W(c) {
            var b = this.viewportMetrics();
            var a = this.elementMetrics();
            if (typeof c !== "number") {
                c = this.pixelsInView()
            }
            this._percentInView = (c === 0) ? 0 : (c / a.height);
            return this._percentInView
        },
        percentTravelled: function L(d) {
            var c = this.viewportMetrics();
            var e = this.elementMetrics();
            var a = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            var b = c.height + e.height;
            this._percentTravelled = 1 - (((e.height + e.offsetY) - a) / b);
            return this._percentTravelled
        },
        elementViewportOffsetY: function F() {
            var b = this.elementMetrics();
            var a = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            return b.offsetY - a
        }
    };
    H.Object.extend(H.ShowOnScroll.prototype, {
        __onScroll: function Q() {
            var c = this._percentInView;
            var d = (typeof c === "undefined");
            var b = this.pixelsInView();
            var e = this.percentInView(b);
            var a = this.percentTravelled(b);
            if (this.isInView(b) && (c === 0 || d)) {
                if (typeof this._delegate.scrolledIntoView === "function") {
                    this._delegate.scrolledIntoView(this._element)
                }
            }
            if ((e === 0 && c > 0) && !d) {
                if (typeof this._delegate.scrolledOutOfView === "function") {
                    this._delegate.scrolledOutOfView(this._element)
                }
            }
            if (e === 1 && (c < 1 || d)) {
                if (typeof this._delegate.scrolledIntoViewCompletely === "function") {
                    this._delegate.scrolledIntoViewCompletely(this._element, b)
                }
            }
            if ((e < 1 && c === 1) && !d) {
                if (typeof this._delegate.scrolledOutOfViewCompletely === "function") {
                    this._delegate.scrolledOutOfViewCompletely(this._element, b, a)
                }
            }
            if (this.__hasChangedInViewPastThresholdStatus(c, e)) {
                if (this.isEnoughInView(e)) {
                    this.__scrolledIntoViewPastThreshold()
                } else {
                    if (!d) {
                        this.__scrolledOutOfViewPastThreshold()
                    }
                }
            }
            if (this.isInView(b)) {
                if (typeof this._delegate.scrolledWhileInView === "function") {
                    this._delegate.scrolledWhileInView(this._element, b, a)
                }
            }
            if (!d) {
                this.__resetOnScrollEndTimer()
            }
        },
        __onWindowLoad: function R() {
            var a = this;
            window.setTimeout(function() {
                a.__onScroll.call(a)
            }, 500)
        },
        __onScrollEnd: function A() {
            delete this.__onScrollEndTimer;
            this.refreshMetrics();
            if (typeof this._delegate.scrollEnd === "function") {
                this._delegate.scrollEnd(this._element, this._pixelsInView, this._percentTravelled)
            }
        },
        __scrolledIntoViewPastThreshold: function U() {
            this.__startTimeInViewTimer();
            if (typeof this._delegate.scrolledIntoViewPastThreshold === "function") {
                this._delegate.scrolledIntoViewPastThreshold(this._element, this._pixelsInView, this._percentTravelled, this._options.threshold)
            }
        },
        __scrolledOutOfViewPastThreshold: function I() {
            this.__cancelTimeInViewTimer();
            if (typeof this._delegate.scrolledOutOfViewPastThreshold === "function") {
                this._delegate.scrolledOutOfViewPastThreshold(this._element, this._pixelsInView, this._percentTravelled, this._options.threshold)
            }
        },
        __visitorEngaged: function P() {
            if (typeof this._delegate.visitorEngaged === "function") {
                this._delegate.visitorEngaged(this._element, this._pixelsInView, this._percentTravelled, this._options.threshold)
            }
            delete this.__timeInViewTimerId
        },
        __hasChangedInViewPastThresholdStatus: function C(b, a) {
            if (((this.isEnoughInView(a)) && (!this.isEnoughInView(b))) || ((!this.isEnoughInView(a)) && (this.isEnoughInView(b))) || (typeof b === "undefined")) {
                return true
            } else {
                return false
            }
        },
        __cancelTimeInViewTimer: function X() {
            if (typeof this.__timeInViewTimerId !== "undefined") {
                window.clearTimeout(this.__timeInViewTimerId);
                delete this.__timeInViewTimerId
            }
        },
        __startTimeInViewTimer: function Y() {
            this.__cancelTimeInViewTimer();
            if (typeof this.__boundVisitorEngaged === "undefined") {
                this.__boundVisitorEngaged = this.__visitorEngaged.bind(this)
            }
            this.__timeInViewTimerId = window.setTimeout(this.__boundVisitorEngaged, (this._options.timeInView * 1000))
        },
        __resetOnScrollEndTimer: function M() {
            window.clearTimeout(this.__onScrollEndTimer);
            if (typeof this.__boundOnScrollEnd === "undefined") {
                this.__boundOnScrollEnd = this.__onScrollEnd.bind(this)
            }
            this.__onScrollEndTimer = window.setTimeout(this.__boundOnScrollEnd, this._options.scrollEndDelay * 1000)
        }
    });
    H.ShowOnScroll.version = "2.1";
    return H.ShowOnScroll
});*/
/*AC.define("datavis/_machinelist", ["require"], function(b) {
    return [{
        name: "Macintosh",
        id: "0",
        year: "1984",
        character: "e600",
        machine_id: "0",
        years_since: "30 years"
    }, {
        name: "Macintosh 512K",
        id: "1",
        year: "1984",
        character: "e600",
        machine_id: "1",
        years_since: "30 years"
    }, {
        name: "Macintosh XL",
        id: "2",
        year: "1985",
        character: "e601",
        machine_id: "2",
        years_since: "29 years"
    }, {
        name: "Macintosh Plus",
        id: "3",
        year: "1986",
        character: "e602",
        machine_id: "3",
        years_since: "28 years"
    }, {
        name: "Macintosh 512Ke",
        id: "4",
        year: "1986",
        character: "e602",
        machine_id: "4",
        years_since: "28 years"
    }, {
        name: "Macintosh II",
        id: "5",
        year: "1987",
        character: "e603",
        machine_id: "5",
        years_since: "27 years"
    }, {
        name: "Macintosh SE",
        id: "6",
        year: "1987",
        character: "e604",
        machine_id: "6",
        years_since: "27 years"
    }, {
        name: "Macintosh IIx",
        id: "7",
        year: "1988",
        character: "e603",
        machine_id: "7",
        years_since: "26 years"
    }, {
        name: "Macintosh SE/30",
        id: "8",
        year: "1989",
        character: "e604",
        machine_id: "8",
        years_since: "25 years"
    }, {
        name: "Macintosh IIci / IIcx",
        id: "9",
        year: "1989",
        character: "e605",
        machine_id: "9",
        years_since: "25 years"
    }, {
        name: "Macintosh Portable",
        id: "10",
        year: "1989",
        character: "e62d",
        machine_id: "10",
        years_since: "25 years"
    }, {
        name: "Macintosh IIfx",
        id: "11",
        year: "1990",
        character: "e603",
        machine_id: "11",
        years_since: "24 years"
    }, {
        name: "Macintosh IIsi",
        id: "13",
        year: "1990",
        character: "e606",
        machine_id: "13",
        years_since: "24 years"
    }, {
        name: "Macintosh Classic",
        id: "12",
        year: "1990",
        character: "e607",
        machine_id: "12",
        years_since: "24 years"
    }, {
        name: "Macintosh LC",
        id: "14",
        year: "1990",
        character: "e606",
        machine_id: "14",
        years_since: "24 years"
    }, {
        name: "Macintosh Classic II",
        id: "15",
        year: "1991",
        character: "e607",
        machine_id: "15",
        years_since: "23 years"
    }, {
        name: "PowerBook",
        id: "16",
        year: "1991",
        character: "e62e",
        machine_id: "16",
        years_since: "23 years"
    }, {
        name: "Quadra 700",
        id: "17",
        year: "1991",
        character: "e61e",
        machine_id: "17",
        years_since: "23 years"
    }, {
        name: "Quadra 900",
        id: "18",
        year: "1991",
        character: "e61f",
        machine_id: "18",
        years_since: "23 years"
    }, {
        name: "Macintosh LC II",
        id: "19",
        year: "1992",
        character: "e606",
        machine_id: "19",
        years_since: "22 years"
    }, {
        name: "Quadra 950",
        id: "20",
        year: "1992",
        character: "e61f",
        machine_id: "20",
        years_since: "22 years"
    }, {
        name: "Performa 200",
        id: "21",
        year: "1992",
        character: "e607",
        machine_id: "21",
        years_since: "22 years"
    }, {
        name: "Performa 400",
        id: "22",
        year: "1992",
        character: "e606",
        machine_id: "22",
        years_since: "22 years"
    }, {
        name: "Performa 600",
        id: "23",
        year: "1992",
        character: "e608",
        machine_id: "23",
        years_since: "22 years"
    }, {
        name: "PowerBook",
        id: "25",
        year: "1992",
        character: "e62e",
        machine_id: "25",
        years_since: "22 years"
    }, {
        name: "Macintosh IIvi&nbsp;/&nbsp;IIvx",
        id: "24",
        year: "1992",
        character: "e608",
        machine_id: "24",
        years_since: "22 years"
    }, {
        name: "PowerBook Duo",
        id: "26",
        year: "1992",
        character: "e62f",
        machine_id: "26",
        years_since: "22 years"
    }, {
        name: "Centris 610 / 660AV",
        id: "27",
        year: "1993",
        character: "e60b",
        machine_id: "27",
        years_since: "21 years"
    }, {
        name: "Centris 650",
        id: "28",
        year: "1993",
        character: "e608",
        machine_id: "28",
        years_since: "21 years"
    }, {
        name: "Macintosh Color Classic",
        id: "29",
        year: "1993",
        character: "e609",
        machine_id: "29",
        years_since: "21 years"
    }, {
        name: "Macintosh LC / LC III",
        id: "30",
        year: "1993",
        character: "e606",
        machine_id: "30",
        years_since: "21 years"
    }, {
        name: "Performa 200 Series",
        id: "31",
        year: "1993",
        character: "e607",
        machine_id: "31",
        years_since: "21 years"
    }, {
        name: "Quadra 800 / 840AV",
        id: "32",
        year: "1993",
        character: "e620",
        machine_id: "32",
        years_since: "21 years"
    }, {
        name: "Performa 400 Series",
        id: "33",
        year: "1993",
        character: "e606",
        machine_id: "33",
        years_since: "21 years"
    }, {
        name: "Performa 500 Series",
        id: "34",
        year: "1993",
        character: "e60a",
        machine_id: "34",
        years_since: "21 years"
    }, {
        name: "PowerBook",
        id: "36",
        year: "1993",
        character: "e62e",
        machine_id: "36",
        years_since: "21 years"
    }, {
        name: "Macintosh LC 520",
        id: "35",
        year: "1993",
        character: "e60a",
        machine_id: "35",
        years_since: "21 years"
    }, {
        name: "PowerBook Duo",
        id: "37",
        year: "1993",
        character: "e62f",
        machine_id: "37",
        years_since: "21 years"
    }, {
        name: "Quadra 605",
        id: "38",
        year: "1993",
        character: "e606",
        machine_id: "38",
        years_since: "21 years"
    }, {
        name: "Quadra 610 / 660AV",
        id: "39",
        year: "1993",
        character: "e60b",
        machine_id: "39",
        years_since: "21 years"
    }, {
        name: "Quadra 650",
        id: "40",
        year: "1993",
        character: "e608",
        machine_id: "40",
        years_since: "21 years"
    }, {
        name: "Macintosh TV",
        id: "41",
        year: "1993",
        character: "e644",
        machine_id: "41",
        years_since: "21 years"
    }, {
        name: "Performa 500 Series",
        id: "42",
        year: "1994",
        character: "e60a",
        machine_id: "42",
        years_since: "20 years"
    }, {
        name: "Power Macintosh 6100",
        id: "44",
        year: "1994",
        character: "e60b",
        machine_id: "44",
        years_since: "20 years"
    }, {
        name: "Macintosh LC 550&nbsp;/&nbsp;575",
        id: "43",
        year: "1994",
        character: "e60a",
        machine_id: "43",
        years_since: "20 years"
    }, {
        name: "Power Macintosh 7100",
        id: "45",
        year: "1994",
        character: "e60d",
        machine_id: "45",
        years_since: "20 years"
    }, {
        name: "Power Macintosh 8100",
        id: "46",
        year: "1994",
        character: "e620",
        machine_id: "46",
        years_since: "20 years"
    }, {
        name: "PowerBook 150",
        id: "47",
        year: "1994",
        character: "e62e",
        machine_id: "47",
        years_since: "20 years"
    }, {
        name: "PowerBook Duo",
        id: "48",
        year: "1994",
        character: "e62f",
        machine_id: "48",
        years_since: "20 years"
    }, {
        name: "Macintosh LC 630",
        id: "50",
        year: "1994",
        character: "e60c",
        machine_id: "50",
        years_since: "20 years"
    }, {
        name: "PowerBook 520 / 540",
        id: "49",
        year: "1994",
        character: "e630",
        machine_id: "49",
        years_since: "20 years"
    }, {
        name: "Performa 600 Series",
        id: "51",
        year: "1994",
        character: "e60c",
        machine_id: "51",
        years_since: "20 years"
    }, {
        name: "Performa 6100 Series",
        id: "53",
        year: "1994",
        character: "e60b",
        machine_id: "53",
        years_since: "20 years"
    }, {
        name: "Quadra 630",
        id: "52",
        year: "1994",
        character: "e60c",
        machine_id: "52",
        years_since: "20 years"
    }, {
        name: "Macintosh LC 580",
        id: "54",
        year: "1995",
        character: "e60a",
        machine_id: "54",
        years_since: "19 years"
    }, {
        name: "Performa 580 / 588",
        id: "55",
        year: "1995",
        character: "e60a",
        machine_id: "55",
        years_since: "19 years"
    }, {
        name: "Power Macintosh 5200&nbsp;/&nbsp;5300",
        id: "56",
        year: "1995",
        character: "e60f",
        machine_id: "56",
        years_since: "19 years"
    }, {
        name: "Performa 6200&nbsp;/&nbsp;6300 Series",
        id: "58",
        year: "1995",
        character: "e60c",
        machine_id: "58",
        years_since: "19 years"
    }, {
        name: "Performa 5200&nbsp;/&nbsp;5300 Series",
        id: "57",
        year: "1995",
        character: "e60f",
        machine_id: "57",
        years_since: "19 years"
    }, {
        name: "PowerBook",
        id: "59",
        year: "1995",
        character: "e630",
        machine_id: "59",
        years_since: "19 years"
    }, {
        name: "Power Macintosh 6200",
        id: "60",
        year: "1995",
        character: "e60c",
        machine_id: "60",
        years_since: "19 years"
    }, {
        name: "Power Macintosh 8500&nbsp;/&nbsp;9500",
        id: "61",
        year: "1995",
        character: "e620",
        machine_id: "61",
        years_since: "19 years"
    }, {
        name: "Power Macintosh 7200&nbsp;/&nbsp;7500",
        id: "63",
        year: "1995",
        character: "e610",
        machine_id: "63",
        years_since: "19 years"
    }, {
        name: "PowerBook Duo",
        id: "62",
        year: "1995",
        character: "e62f",
        machine_id: "62",
        years_since: "19 years"
    }, {
        name: "Power Macintosh 7215&nbsp;/&nbsp;7600",
        id: "64",
        year: "1996",
        character: "e610",
        machine_id: "64",
        years_since: "18 years"
    }, {
        name: "Performa 5000 Series",
        id: "65",
        year: "1996",
        character: "e60f",
        machine_id: "65",
        years_since: "18 years"
    }, {
        name: "Performa 6400 Series",
        id: "80",
        year: "1996",
        character: "e621",
        machine_id: "80",
        years_since: "18 years"
    }, {
        name: "Performa 6360",
        id: "81",
        year: "1996",
        character: "e60c",
        machine_id: "81",
        years_since: "18 years"
    }, {
        name: "Power Macintosh 5260&nbsp;/&nbsp;5400",
        id: "66",
        year: "1996",
        character: "e60f",
        machine_id: "66",
        years_since: "18 years"
    }, {
        name: "Power Macintosh 8200",
        id: "67",
        year: "1996",
        character: "e620",
        machine_id: "67",
        years_since: "18 years"
    }, {
        name: "Power Macintosh 6300",
        id: "68",
        year: "1996",
        character: "e60c",
        machine_id: "68",
        years_since: "18 years"
    }, {
        name: "Power Macintosh 6400",
        id: "69",
        year: "1996",
        character: "e621",
        machine_id: "69",
        years_since: "18 years"
    }, {
        name: "Power Macintosh 4400",
        id: "70",
        year: "1996",
        character: "e611",
        machine_id: "70",
        years_since: "18 years"
    }, {
        name: "PowerBook 1400",
        id: "71",
        year: "1996",
        character: "e631",
        machine_id: "71",
        years_since: "18 years"
    }, {
        name: "PowerBook 3400c",
        id: "72",
        year: "1997",
        character: "e633",
        machine_id: "72",
        years_since: "17 years"
    }, {
        name: "Power Macintosh 5500",
        id: "73",
        year: "1997",
        character: "e60f",
        machine_id: "73",
        years_since: "17 years"
    }, {
        name: "Power Macintosh 6500",
        id: "74",
        year: "1997",
        character: "e621",
        machine_id: "74",
        years_since: "17 years"
    }, {
        name: "Power Macintosh 7220",
        id: "75",
        year: "1997",
        character: "e611",
        machine_id: "75",
        years_since: "17 years"
    }, {
        name: "Power Macintosh 7300",
        id: "76",
        year: "1997",
        character: "e610",
        machine_id: "76",
        years_since: "17 years"
    }, {
        name: "Power Macintosh 8600&nbsp;/&nbsp;9600",
        id: "77",
        year: "1997",
        character: "e643",
        machine_id: "77",
        years_since: "17 years"
    }, {
        name: "PowerBook 2400c",
        id: "78",
        year: "1997",
        character: "e632",
        machine_id: "78",
        years_since: "17 years"
    }, {
        name: "Twentieth Anniversary Macintosh",
        id: "79",
        year: "1997",
        character: "e612",
        machine_id: "79",
        years_since: "17 years"
    }, {
        name: "Power Macintosh&nbsp;G3 (Desktop)",
        id: "83",
        year: "1997",
        character: "e610",
        machine_id: "83",
        years_since: "17 years"
    }, {
        name: "Power Macintosh&nbsp;G3 (Minitower)",
        id: "84",
        year: "1997",
        character: "e643",
        machine_id: "84",
        years_since: "17 years"
    }, {
        name: "PowerBook G3",
        id: "85",
        year: "1997",
        character: "e634",
        machine_id: "85",
        years_since: "17 years"
    }, {
        name: "Power Macintosh&nbsp;G3 (All‑in‑One)",
        id: "86",
        year: "1998",
        character: "e613",
        machine_id: "86",
        years_since: "16 years"
    }, {
        name: "iMac",
        id: "87",
        year: "1998",
        character: "e614",
        machine_id: "87",
        years_since: "16 years"
    }, {
        name: "PowerBook G3",
        id: "88",
        year: "1998",
        character: "e634",
        machine_id: "88",
        years_since: "16 years"
    }, {
        name: "iMac",
        id: "89",
        year: "1999",
        character: "e615",
        machine_id: "89",
        years_since: "15 years"
    }, {
        name: "Power Mac G3",
        id: "90",
        year: "1999",
        character: "e622",
        machine_id: "90",
        years_since: "15 years"
    }, {
        name: "PowerBook G3",
        id: "91",
        year: "1999",
        character: "e635",
        machine_id: "91",
        years_since: "15 years"
    }, {
        name: "iBook",
        id: "92",
        year: "1999",
        character: "e636",
        machine_id: "92",
        years_since: "15 years"
    }, {
        name: "Power Mac G4",
        id: "93",
        year: "1999",
        character: "e623",
        machine_id: "93",
        years_since: "15 years"
    }, {
        name: "PowerBook",
        id: "94",
        year: "2000",
        character: "e635",
        machine_id: "94",
        years_since: "14 years"
    }, {
        name: "iMac",
        id: "95",
        year: "2000",
        character: "e615",
        machine_id: "95",
        years_since: "14 years"
    }, {
        name: "Power Mac G4",
        id: "96",
        year: "2000",
        character: "e623",
        machine_id: "96",
        years_since: "14 years"
    }, {
        name: "Power Mac G4 Cube",
        id: "97",
        year: "2000",
        character: "e616",
        machine_id: "97",
        years_since: "14 years"
    }, {
        name: "iBook",
        id: "98",
        year: "2000",
        character: "e636",
        machine_id: "98",
        years_since: "14 years"
    }, {
        name: "Power Mac G4",
        id: "99",
        year: "2001",
        character: "e623",
        machine_id: "99",
        years_since: "13 years"
    }, {
        name: "PowerBook G4 (Titanium)",
        id: "100",
        year: "2001",
        character: "e637",
        machine_id: "100",
        years_since: "13 years"
    }, {
        name: "iMac",
        id: "101",
        year: "2001",
        character: "e615",
        machine_id: "101",
        years_since: "13 years"
    }, {
        name: "iBook",
        id: "102",
        year: "2001",
        character: "e638",
        machine_id: "102",
        years_since: "13 years"
    }, {
        name: "Power Mac&nbsp;G4 (Quicksilver)",
        id: "103",
        year: "2001",
        character: "e624",
        machine_id: "103",
        years_since: "13 years"
    }, {
        name: "iBook",
        id: "104",
        year: "2002",
        character: "e638",
        machine_id: "104",
        years_since: "12 years"
    }, {
        name: "iMac",
        id: "105",
        year: "2002",
        character: "e618",
        machine_id: "105",
        years_since: "12 years"
    }, {
        name: "Power Mac&nbsp;G4 (Quicksilver)",
        id: "106",
        year: "2002",
        character: "e624",
        machine_id: "106",
        years_since: "12 years"
    }, {
        name: "eMac",
        id: "107",
        year: "2002",
        character: "e617",
        machine_id: "107",
        years_since: "12 years"
    }, {
        name: "PowerBook G4",
        id: "108",
        year: "2002",
        character: "e637",
        machine_id: "108",
        years_since: "12 years"
    }, {
        name: "Power Mac G4",
        id: "109",
        year: "2002",
        character: "e625",
        machine_id: "109",
        years_since: "12 years"
    }, {
        name: "PowerBook G4",
        id: "111",
        year: "2003",
        character: "e63a",
        machine_id: "111",
        years_since: "11 years"
    }, {
        name: "Power Mac G4",
        id: "110",
        year: "2003",
        character: "e625",
        machine_id: "110",
        years_since: "11 years"
    }, {
        name: "iMac",
        id: "112",
        year: "2003",
        character: "e618",
        machine_id: "112",
        years_since: "11 years"
    }, {
        name: "iBook G4",
        id: "113",
        year: "2003",
        character: "e638",
        machine_id: "113",
        years_since: "11 years"
    }, {
        name: "eMac",
        id: "114",
        year: "2003",
        character: "e617",
        machine_id: "114",
        years_since: "11 years"
    }, {
        name: "Power Mac G5",
        id: "115",
        year: "2003",
        character: "e626",
        machine_id: "115",
        years_since: "11 years"
    }, {
        name: "eMac",
        id: "116",
        year: "2004",
        character: "e617",
        machine_id: "116",
        years_since: "10 years"
    }, {
        name: "iBook G4",
        id: "117",
        year: "2004",
        character: "e638",
        machine_id: "117",
        years_since: "10 years"
    }, {
        name: "Power Mac G5",
        id: "119",
        year: "2004",
        character: "e626",
        machine_id: "119",
        years_since: "10 years"
    }, {
        name: "PowerBook G4",
        id: "118",
        year: "2004",
        character: "e63a",
        machine_id: "118",
        years_since: "10 years"
    }, {
        name: "iMac G5",
        id: "120",
        year: "2004",
        character: "e619",
        machine_id: "120",
        years_since: "10 years"
    }, {
        name: "Mac mini",
        id: "121",
        year: "2005",
        character: "e629",
        machine_id: "121",
        years_since: "9 years"
    }, {
        name: "PowerBook G4",
        id: "122",
        year: "2005",
        character: "e63a",
        machine_id: "122",
        years_since: "9 years"
    }, {
        name: "Power Mac G5",
        id: "123",
        year: "2005",
        character: "e626",
        machine_id: "123",
        years_since: "9 years"
    }, {
        name: "eMac",
        id: "124",
        year: "2005",
        character: "e617",
        machine_id: "124",
        years_since: "9 years"
    }, {
        name: "iMac G5",
        id: "125",
        year: "2005",
        character: "e61a",
        machine_id: "125",
        years_since: "9 years"
    }, {
        name: "MacBook Pro",
        id: "127",
        year: "2006",
        character: "e63c",
        machine_id: "127",
        years_since: "8 years"
    }, {
        name: "Mac mini",
        id: "128",
        year: "2006",
        character: "e629",
        machine_id: "128",
        years_since: "8 years"
    }, {
        name: "Mac Pro",
        id: "130",
        year: "2006",
        character: "e627",
        machine_id: "130",
        years_since: "8 years"
    }, {
        name: "iMac",
        id: "126",
        year: "2006",
        character: "e61a",
        machine_id: "126",
        years_since: "8 years"
    }, {
        name: "MacBook",
        id: "129",
        year: "2006",
        character: "e63b",
        machine_id: "129",
        years_since: "8 years"
    }, {
        name: "Mac Pro",
        id: "131",
        year: "2007",
        character: "e627",
        machine_id: "131",
        years_since: "7 years"
    }, {
        name: "MacBook",
        id: "132",
        year: "2007",
        character: "e63b",
        machine_id: "132",
        years_since: "7 years"
    }, {
        name: "MacBook Pro",
        id: "133",
        year: "2007",
        character: "e63c",
        machine_id: "133",
        years_since: "7 years"
    }, {
        name: "iMac",
        id: "134",
        year: "2007",
        character: "e61b",
        machine_id: "134",
        years_since: "7 years"
    }, {
        name: "Mac mini",
        id: "135",
        year: "2007",
        character: "e629",
        machine_id: "135",
        years_since: "7 years"
    }, {
        name: "Mac Pro",
        id: "136",
        year: "2008",
        character: "e627",
        machine_id: "136",
        years_since: "6 years"
    }, {
        name: "MacBook Air",
        id: "137",
        year: "2008",
        character: "e63e",
        machine_id: "137",
        years_since: "6 years"
    }, {
        name: "MacBook (White)",
        id: "138",
        year: "2008",
        character: "e63b",
        machine_id: "138",
        years_since: "6 years"
    }, {
        name: "MacBook Pro",
        id: "139",
        year: "2008",
        character: "e63c",
        machine_id: "139",
        years_since: "6 years"
    }, {
        name: "iMac",
        id: "140",
        year: "2008",
        character: "e61b",
        machine_id: "140",
        years_since: "6 years"
    }, {
        name: "MacBook (Aluminum)",
        id: "141",
        year: "2008",
        character: "e63d",
        machine_id: "141",
        years_since: "6 years"
    }, {
        name: "MacBook",
        id: "142",
        year: "2009",
        character: "e63d",
        machine_id: "142",
        years_since: "5 years"
    }, {
        name: "MacBook Pro",
        id: "143",
        year: "2009",
        character: "e63c",
        machine_id: "143",
        years_since: "5 years"
    }, {
        name: "iMac",
        id: "144",
        year: "2009",
        character: "e61c",
        machine_id: "144",
        years_since: "5 years"
    }, {
        name: "Mac mini",
        id: "145",
        year: "2009",
        character: "e629",
        machine_id: "145",
        years_since: "5 years"
    }, {
        name: "Mac mini (Server)",
        id: "146",
        year: "2009",
        character: "e62a",
        machine_id: "146",
        years_since: "5 years"
    }, {
        name: "Mac Pro",
        id: "147",
        year: "2009",
        character: "e627",
        machine_id: "147",
        years_since: "5 years"
    }, {
        name: "MacBook Air",
        id: "148",
        year: "2009",
        character: "e63e",
        machine_id: "148",
        years_since: "5 years"
    }, {
        name: "MacBook Pro",
        id: "149",
        year: "2010",
        character: "e63c",
        machine_id: "149",
        years_since: "4 years"
    }, {
        name: "Mac mini",
        id: "150",
        year: "2010",
        character: "e62b",
        machine_id: "150",
        years_since: "4 years"
    }, {
        name: "Mac mini (Server)",
        id: "151",
        year: "2010",
        character: "e62c",
        machine_id: "151",
        years_since: "4 years"
    }, {
        name: "iMac",
        id: "152",
        year: "2010",
        character: "e61c",
        machine_id: "152",
        years_since: "4 years"
    }, {
        name: "Mac Pro",
        id: "153",
        year: "2010",
        character: "e627",
        machine_id: "153",
        years_since: "4 years"
    }, {
        name: "MacBook Air",
        id: "154",
        year: "2010",
        character: "e641",
        machine_id: "154",
        years_since: "4 years"
    }, {
        name: "MacBook Pro",
        id: "155",
        year: "2011",
        character: "e640",
        machine_id: "155",
        years_since: "3 years"
    }, {
        name: "iMac",
        id: "156",
        year: "2011",
        character: "e61c",
        machine_id: "156",
        years_since: "3 years"
    }, {
        name: "Mac mini",
        id: "157",
        year: "2011",
        character: "e62c",
        machine_id: "157",
        years_since: "3 years"
    }, {
        name: "MacBook Air",
        id: "158",
        year: "2011",
        character: "e641",
        machine_id: "158",
        years_since: "3 years"
    }, {
        name: "Mac Pro",
        id: "159",
        year: "2012",
        character: "e627",
        machine_id: "159",
        years_since: "2 years"
    }, {
        name: "MacBook Air",
        id: "160",
        year: "2012",
        character: "e641",
        machine_id: "160",
        years_since: "2 years"
    }, {
        name: "MacBook Pro",
        id: "161",
        year: "2012",
        character: "e640",
        machine_id: "161",
        years_since: "2 years"
    }, {
        name: "MacBook&nbsp;Pro (Retina&nbsp;display)",
        id: "162",
        year: "2012",
        character: "e642",
        machine_id: "162",
        years_since: "2 years"
    }, {
        name: "iMac",
        id: "163",
        year: "2012",
        character: "e61d",
        machine_id: "163",
        years_since: "2 years"
    }, {
        name: "Mac mini",
        id: "164",
        year: "2012",
        character: "e62c",
        machine_id: "164",
        years_since: "2 years"
    }, {
        name: "MacBook&nbsp;Pro (Retina&nbsp;display)",
        id: "165",
        year: "2013",
        character: "e642",
        machine_id: "165",
        years_since: "1 year"
    }, {
        name: "iMac",
        id: "166",
        year: "2013",
        character: "e61d",
        machine_id: "166",
        years_since: "1 year"
    }, {
        name: "MacBook Air",
        id: "167",
        year: "2013",
        character: "e641",
        machine_id: "167",
        years_since: "1 year"
    }, {
        name: "Mac Pro",
        id: "168",
        year: "2014",
        character: "e628",
        machine_id: "168",
        years_since: "less than 1 year"
    }]
});*/
/*AC.define("30-years/js/datavis/machineList", ["require", "datavis/_machinelist"], function(d) {
    var c = d("datavis/_machinelist");
    window.datavis = window.datavis || {};
    window.datavis.machineList = c;
    return c
});
AC.define("events/GesturesDelegate", ["require", "events/BindingDelegate", "eventEmitter/EventEmitter"], function(h) {
    var j = h("events/BindingDelegate"),
        l = h("eventEmitter/EventEmitter");
    var i = {};
    var k = function(a) {
        if (typeof a === "undefined") {
            return
        }
        l.call(this);
        this.el = a;
        this._bindings = new j(this.el);
        this._resetState();
        this._bindDOMEvents()
    };
    k.prototype = new l(null);
    var g = k.prototype;
    g._resetState = function() {
        this._state = {
            touching: false,
            touchstart: null,
            lastTouch: null,
            touchmove: null,
            touchend: null,
            startTime: null,
            currentTime: null,
            lastTime: null,
            endTime: null,
            currentTouch: null
        };
        this.data = {
            start: {
                x: null,
                y: null,
                time: null
            },
            current: {
                x: null,
                y: null,
                time: null
            },
            delta: {
                x: null,
                y: null,
                time: null
            }
        };
        this._silenced = {};
        return this
    };
    g._setLastTouch = function(a) {
        if (typeof a !== "undefined") {
            this._state.lastTouch = a;
            return
        }
        if (this._state.touchmove !== null) {
            this._state.lastTouch = this._state.touchmove
        } else {
            this._state.lastTouch = this._state.touchstart
        }
    };
    g._setCurrentTime = function(a) {
        var b = a || this._getCurrentTime();
        this._state.lastTime = this._state.currentTime || b;
        this._state.currentTime = b
    };
    g._getCurrentTime = function() {
        return new Date().getTime()
    };
    g._setData = function() {
        this.data.start.x = this._state.touchstart.layerX, this.data.start.y = this._state.touchstart.layerY, this.data.start.time = this._state.startTime;
        this.data.current.x = this._state.currentTouch.layerX;
        this.data.current.y = this._state.currentTouch.layerY;
        this.data.current.time = this._state.currentTime;
        this.data.delta.x = this.data.current.x - this.data.start.x;
        this.data.delta.y = this.data.current.y - this.data.start.y;
        this.data.delta.time = this.data.current.time - this.data.start.time
    };
    g._bindDOMEvents = function() {
        this._bindings.on("touchstart", this._handleTouchStart.bind(this));
        this._bindings.on("touchmove", this._handleTouchMove.bind(this));
        this._bindings.on("touchend", this._handleTouchEnd.bind(this))
    };
    g._handleTouchStart = function(a) {
        var b = this._getCurrentTime();
        this._resetState();
        this._state.touching = true;
        this._setLastTouch(null);
        this._state.touchstart = a;
        this._state.currentTouch = a;
        this._state.startTime = b;
        this._setCurrentTime(b);
        this._setData();
        this._testGestures()
    };
    g._handleTouchMove = function(a) {
        this._setLastTouch();
        this._state.touchmove = a;
        this._state.currentTouch = a;
        this._setCurrentTime();
        this._setData();
        this._testGestures()
    };
    g._handleTouchEnd = function(a) {
        var b = this._getCurrentTime();
        this._state.touching = false;
        this._setLastTouch();
        this._state.touchend = a;
        this._state.currentTouch = a;
        this._state.endTime = b;
        this._setCurrentTime(b);
        this._setData();
        this._testGestures()
    };
    g._testGestures = function() {
        var a, b, c;
        for (a in i) {
            if (i.hasOwnProperty(a)) {
                b = i[a];
                if (this._silenced[a]) {
                    continue
                }
                c = b.func.call(this);
                if (c) {
                    this.trigger(b.name, this.data);
                    if (b.allowMultiple !== true) {
                        this._silenced[a] = true
                    }
                }
            }
        }
    };
    g.addGesture = function(a) {
        if (typeof a !== "object") {
            return false
        }
        i[a.name] = a;
        return this
    };
    g.removeGesture = function(a) {
        if (i[a]) {
            delete i.name
        }
        return this
    };
    return k
});*/
/*AC.define("events/gestures/SwipeXGesture", ["require"], function(c) {
    var d = (function() {
        var a = 35,
            b = 5000;
        return {
            name: "swipeX",
            func: function() {
                var f = this.data;
                if (Math.abs(f.delta.x) > a && f.delta.time < b) {
                    return true
                }
                return false
            }
        }
    }());
    return d
});
AC.define("events/gestures/ScrollStartGesture", ["require"], function(d) {
    var c = (function() {
        var b = 7,
            a = Infinity;
        return {
            name: "scrollStart",
            func: function() {
                var f = this.data;
                if (Math.abs(f.delta.y) > b && f.delta.time < a) {
                    return true
                }
                return false
            }
        }
    }());
    return c
});
AC.define("events/ApplicationGestures", ["require", "events/GesturesDelegate", "events/gestures/SwipeXGesture", "events/gestures/ScrollStartGesture"], function(j) {
    var i = j("events/GesturesDelegate"),
        f = j("events/gestures/SwipeXGesture"),
        h = j("events/gestures/ScrollStartGesture");
    var g = (function() {
        return {
            initialize: function() {
                this.events = new i(document.documentElement);
                this.events.addGesture(f);
                this.events.addGesture(h)
            }
        }
    }());
    return g
});*/
/*AC.define("application/years/YearHeroController", ["require", "application/RuntimeEnvironment", "application/shims/AC_Element", "events/ApplicationEvents", "events/WindowDelegate", "events/ScrollLockDelegate", "application/shims/AC_Environment", "application/polyfills/RequestAnimationFrame"], function(q) {
    var l = q("application/RuntimeEnvironment");
    var o = q("application/shims/AC_Element"),
        r = q("events/ApplicationEvents"),
        j = q("events/WindowDelegate"),
        m = q("events/ScrollLockDelegate"),
        p = q("application/shims/AC_Environment");
    var n = q("application/polyfills/RequestAnimationFrame");
    var k = (function() {
        var a = {
            imageSelector: ".year-detail .hero-image",
            heroSelector: ".year-detail .hero",
            heroHeadlineSelector: ".headline",
            heroCopySelector: ".after-headline",
            screenSelector: ".screen",
            containerSelector: ".next-container"
        };
        return {
            _initialize: function(b) {
                var c;
                if (b) {
                    c = o.select(a.containerSelector)
                }
                this.image = o.select(a.imageSelector, c);
                if (this.image) {
                    this.hero = o.select(a.heroSelector, c);
                    this.screen = o.select(a.screenSelector, this.image);
                    if (l.enableYearHeroTransitions()) {
                        this._prepareImagePosition();
                        if (b) {
                            r.once("afterSegue", this._startTransition.bind(this))
                        } else {
                            setTimeout(this._startTransition.bind(this), 0)
                        }
                    } else {
                        this._forceEndState()
                    }
                }
            },
            _prepareImagePosition: function() {
                var b = o.cumulativeOffset(this.image).top;
                o.setVendorPrefixStyle(this.image, "transform", "translateY(-" + b + "px)");
                m.queuedLockScrolling()
            },
            _getLastTransitionedElement: function() {
                var b = o.select(a.heroCopySelector, this.hero);
                if (AC.Element.getStyle(b, "display") === "none") {
                    b = o.select(a.heroHeadlineSelector, this.hero)
                }
                return b
            },
            _startTransition: function() {
                var c = this._getLastTransitionedElement();
                var d = function() {
                    o.removeVendorPrefixStyle(this.image, "transform");
                    o.addClassName(this.hero, "reveal");
                    if (this.screen) {
                        o.removeVendorPrefixEventListener(this.screen, "transitionEnd", d)
                    }
                    o.addVendorPrefixEventListener(c, "transitionEnd", b)
                }.bind(this);
                var b = function() {
                    m.unlockScrolling();
                    o.removeVendorPrefixEventListener(this.image, "transitionEnd", b)
                }.bind(this);
                n(function() {
                    if (this.image) {
                        o.addClassName(this.image, "move")
                    }
                    if (this.screen) {
                        o.addVendorPrefixEventListener(this.screen, "transitionEnd", d)
                    } else {
                        d()
                    }
                }.bind(this))
            },
            _forceEndState: function() {
                o.addClassName(this.hero, "reveal");
                o.addClassName(this.image, "move")
            },
            initialize: function() {
                AC.onDOMReady(this._initialize.bind(this, false));
                r.on("beforeSegueStart", this._initialize.bind(this, true))
            }
        }
    }());
    return k
});*/
AC.define("application/Analytics", ["require", "events/ApplicationEvents", "application/shims/AC_Element"], function(e) {
    var g = e("events/ApplicationEvents");
    var h = e("application/shims/AC_Element");
    AC.Tracking.pageName = function() {
        var a = h.select('meta[name="omni_page"]');
        return a.getAttribute("content").toLowerCase()
    };
    var f = {
        initialize: function() {
            this._trackingSocial = false;
            this._handleSocialClick = this._handleSocialClick.bind(this);
            h.addEventDelegate(document, "click", ".thirty-share a", this._handleSocialClick);
            this._trackButtons();
            this.siteName = AC.Tracking.pageName().split(" - ").slice(0, 2).join(" - ");
            g.on("stateChange", this._handleStateChange.bind(this));
            AC.Storage.cookie.setItem("s_ppv2", encodeURIComponent(AC.Tracking.pageName()), 0)
        },
        getPageName: function(a) {
            if (a.toState === "year") {
                return a.toYear
            } else {
                if (a.toState === "landing") {
                    return "index"
                } else {
                    return ""
                }
            }
        },
        getWhereFrom: function(a) {
            if (a.fromState === "landing") {
                return "yn"
            } else {
                if (a.fromState === "year" && a.toState === "year") {
                    return "pn"
                } else {
                    if (a.fromState === "year" && a.toState === "landing") {
                        return "hn"
                    }
                }
            }
        },
        _trackButtons: function() {
            var a = h.select(".page-container");
            h.addEventDelegate(a, "click", ".year-detail a.button", function(b) {
                var c = b.target;
                var d = AC.Tracking.pageName() + " - " + c.getAttribute("data-analytics");
                var j = c.getAttribute("href");
                b.originalEvent.preventDefault();
                AC.Tracking.trackClick({
                    prop3: d
                }, this, "o", d);
                setTimeout(function() {
                    window.location = j
                }, 10)
            }.bind(this))
        },
        _handleStateChange: function(d) {
            if (d.originalEvent && d.originalEvent.type === "popstate") {
                return
            }
            var b = d.originalEvent.target;
            var n = h.ancestor(b, "#main > .thirty-hero > .thirty-header");
            var p = h.ancestor(b, "#main > .thirty-header");
            var o = d.toState === "landing" && d.fromState === "landing";
            var c = d.hash === "timeline" && !p;
            var a = d.hash === "landing" && !n;
            var m = c || a;
            if (o) {
                if (m) {
                    this._handleAnchor({}, d.hash)
                }
            } else {
                this._handlePageLoad(d)
            }
        },
        _handlePageLoad: function(a) {
            var c = this.getPageName(a);
            var b = this.getWhereFrom(a);
            var c = (this.siteName + " - " + c).toLowerCase();
            s.pageName = c;
            s.prop3 = b + "@" + c;
            s.prop14 = decodeURIComponent(AC.Storage.cookie.getItem("s_ppv2"));
            AC.Storage.cookie.setItem("s_ppv2", encodeURIComponent(c), 0);
            AC.Tracking.trackPage()
        },
        _handleAnchor: function(a, b) {
            var c = a.target || a.srcElement;
            var d = c ? c.getAttribute("href") : "";
            var m = d.match(/\#(\w+)/);
            var b = (m && m[1]) ? m[1] : b;
            var o = AC.Tracking.pageName().replace(" - direct", "");
            var n = b + "#" + o;
            AC.Tracking.trackClick({
                prop3: n
            }, this, "o", n)
        },
        _handleSocialClick: function(a) {
            var b = a.target;
            var b = a.currentTarget;
            var c = b.getAttribute("data-track");
            var k = AC.Tracking.pageName();
            var d = c + "@" + k;
            AC.Tracking.trackClick({
                prop3: d
            }, this, "o", d)
        }
    };
    return f
});
/*AC.define("application/years/VideoFigcaptionController", ["require", "events/ApplicationEvents", "application/shims/AC_Element"], function(e) {
    var g = e("events/ApplicationEvents"),
        h = e("application/shims/AC_Element");
    var f = (function() {
        return {
            _getVideoViewWrapper: function(a) {
                return h.ancestor(a, "figure.video") || false
            },
            _handleYearVideoPlay: function(b) {
                var a = this._getVideoViewWrapper(b.el);
                h.addClassName(a, "active")
            },
            initialize: function() {
                g.on("yearVideoPlay", this._handleYearVideoPlay.bind(this))
            }
        }
    }());
    return f
});
AC.define("application/years/PaddleController", ["require", "events/ApplicationEvents", "application/shims/AC_Element"], function(n) {
    var q = n("events/ApplicationEvents");
    var k = n("application/shims/AC_Element");
    var l = ".year-paddles";
    var p = ".paddle-text";
    var m = ".tn-next";
    var o = ".tn-previous";
    var j = "can-hover";
    var r = {
        initialize: function() {
            this._initialEnable = this._initialEnable.bind(this);
            q.on("DOMReady", this._initialEnable);
            q.on("stateChange", this._handleStateChange.bind(this));
            this._handleMouseMove = this._handleMouseMove.bind(this)
        },
        _initialEnable: function() {
            this._enableHover();
            q.off("DOMReady", this._initialEnable)
        },
        _handleBeforeSegue: function(a) {
            k.removeClassName(this._paddleContainer, j)
        },
        _handleStateChange: function(a) {
            var d = k.select(l);
            var b, c;
            if (a.fromState === "landing" && a.toState === "year") {
                this._enableHover()
            } else {
                if (a.fromState === "year" && a.toState === "year") {
                    this._disableHover();
                    b = (a.toYear > a.fromYear) ? m : o;
                    c = k.select(b + " " + p, d);
                    if (!c) {
                        this._enableHover()
                    } else {
                        this._rect = c.getBoundingClientRect();
                        k.addEventListener(document, "mousemove", this._handleMouseMove)
                    }
                }
            }
        },
        _handleMouseMove: function(a) {
            if (this._outsideBox(a.clientX, a.clientY, this._rect)) {
                this._enableHover();
                k.removeEventListener(document, "mousemove", this._handleMouseMove)
            }
        },
        _outsideBox: function(c, a, b) {
            return (c > b.right || c < b.left || a > b.bottom || a < b.top)
        },
        _enableHover: function() {
            var a = k.select(l);
            if (a) {
                k.addClassName(a, j)
            }
        },
        _disableHover: function() {
            var a = k.select(l);
            if (a) {
                k.removeClassName(a, j)
            }
        }
    };
    return r
});*/
/*AC.define("application/landing/LandingScrollControllerSetup", ["require", "events/ApplicationEvents", "events/WindowDelegate", "application/shims/AC_Element", "hero/HeroController", "application/shims/TYConfig", "application/RuntimeEnvironment", "application/ScrollController"], function(o) {
    var r = o("events/ApplicationEvents"),
        j = o("events/WindowDelegate"),
        m = o("application/shims/AC_Element"),
        l = o("hero/HeroController"),
        n = o("application/shims/TYConfig"),
        k = o("application/RuntimeEnvironment"),
        q = o("application/ScrollController");
    var p = (function() {
        return {
            _isLandingPage: function() {
                var a = new RegExp("^" + n.routePath + "/$");
                if (window.location.pathname.match(a)) {
                    return true
                }
                return false
            },
            _onDOMReady: function() {
                if (this._initialized || !this._isLandingPage()) {
                    return
                }
                this._initialized = true;
                this._snapEnabled = true;
                if (l && l._ambientContentPlayer && l._ambientContentPlayer.type === "slideshow") {
                    j.on("scroll", this._handleOnScroll.bind(this));
                    r.on("scrolledTo", this._handleScrolledTo.bind(this));
                    r.on("beforeRender", this._handleStateChange.bind(this))
                }
                this.registerTargets()
            },
            _handleOnScroll: function() {
                if (k.shouldUseScrollController()) {
                    if (j.scrollY <= 0) {
                        this._playHero()
                    }
                    return
                }
                if (j.scrollY < (j.clientHeight / 2)) {
                    this._playHero()
                }
            },
            _handleScrolledTo: function(a) {
                if (this._snapEnabled && !this.targets) {
                    return
                }
                if (a.el === this.targets.hero) {
                    return this._playHero()
                }
                if (a.el === this.targets.timeline) {
                    return this._pauseHero()
                }
            },
            _handleStateChange: function(a) {
                if (a.toState && a.toState === "landing") {
                    this._snapEnabled = true;
                    return
                }
                this._snapEnabled = false
            },
            _playHero: function() {
                if (this._snapEnabled) {
                    l.play()
                }
            },
            _pauseHero: function() {
                if (this._snapEnabled) {
                    l.pause()
                }
            },
            initialize: function() {
                r.on("DOMReady", this._onDOMReady.bind(this))
            },
            registerTargets: function() {
                this.targets = {
                    timeline: m.select("#timeline"),
                    hero: m.select(".thirty-hero")
                };
                var a;
                for (a in this.targets) {
                    if (this.targets.hasOwnProperty(a)) {
                        q.registerForHinting(this.targets[a])
                    }
                }
            }
        }
    }());
    return p
});*/
/*AC.define("application/YearNavKeyboard", ["require", "events/ApplicationEvents", "application/shims/AC_Element", "application/YearNav", "application/ScrollController"], function(l) {
    var i = l("events/ApplicationEvents");
    var j = l("application/shims/AC_Element");
    var g = l("application/YearNav");
    var k = l("application/ScrollController");
    var h = {
        initialize: function() {
            this._focusIndex = 0;
            this._panelsCount = null;
            this._handleKeyDown = this._handleKeyDown.bind(this);
            this._focusClass = "focus";
            this._carouselSelector = ".year-nav";
            this._timelineSelector = "#timeline";
            if (this._carousel = j.select(this._carouselSelector)) {
                this._setupListeners(0)
            }
            j.addEventListener(document, "keydown", this._handleDocumentKeydown.bind(this));
            i.on("stateChange", this._handleStateChange.bind(this))
        },
        _focusPanel: function(c) {
            var a = c + 1;
            var b = j.select("ul > li:nth-child(" + a + ") a", this._carousel);
            var d = b.parentNode;
            j.addClassName(d, this._focusClass);
            b.setAttribute("tabindex", 0);
            this._focusIndex = c;
            g._scrollToYear(1984 + c);
            b.focus()
        },
        _getPanelFromIndex: function(b) {
            var a = b + 1;
            var c = j.select("ul > li:nth-child(" + a + ")", this._carousel);
            return c
        },
        _blurPanels: function(a) {
            var b = this._getPanels();
            b.forEach(function(e, d) {
                var c = e.children[0];
                if (a !== d) {
                    j.removeClassName(e, this._focusClass);
                    c.setAttribute("tabindex", -1);
                    c.blur()
                }
            }.bind(this))
        },
        _getPanels: function() {
            return j.selectAll("li", this._carousel)
        },
        _getPanelLinks: function() {
            return j.selectAll("li a", this._carousel)
        },
        _handleBlur: function(a) {
            var b = a.target || a.srcElement;
            j.removeClassName(b.parentNode, this._focusClass)
        },
        _handleFocus: function(a) {
            var b = a.target || a.srcElement;
            j.addClassName(b.parentNode, this._focusClass)
        },
        _handleStateChange: function(a) {
            var e = a.fromYearIndex;
            var f, b, c;
            var d = a.hash && (!!parseInt(a.hash, 10) || a.hash === "timeline");
            if (a.toState === "landing") {
                this._carousel = j.select(this._carouselSelector);
                f = this._getPanelFromIndex(e);
                b = j.select("a", f);
                this._setupListeners(e);
                this._blurPanels(e);
                this._tempHighlight(f);
                b.setAttribute("tabindex", 0);
                this._focusIndex = e;
                if (d) {
                    c = j.select(this._timelineSelector);
                    c.setAttribute("tabindex", -1);
                    c.focus()
                }
            }
        },
        _tempHighlight: function(a) {
            var b = 2000;
            var c = this._focusClass;
            j.addClassName(a, c);
            setTimeout(function() {
                j.removeClassName(a, c)
            }.bind(this), b)
        },
        _setupListeners: function(b) {
            var a;
            this._carousel = j.select(this._carouselSelector);
            a = this._getPanelLinks();
            j.addEventListener(this._carousel, "keydown", this._handleKeyDown);
            this._panelsCount = a.length;
            a.forEach(function(c, d) {
                c.setAttribute("tabindex", (d === b) ? 0 : -1);
                j.addEventListener(c, "blur", this._handleBlur.bind(this));
                j.addEventListener(c, "focus", this._handleFocus.bind(this))
            }.bind(this))
        },
        _handleDocumentKeydown: function(b) {
            var c, a;
            if (b.which === 37 || b.which === 39) {
                this._carousel = j.select(this._carouselSelector);
                if (this._carousel) {
                    a = j.select('a[tabindex="0"]', this._carousel);
                    k.animateTo("timeline");
                    a.focus()
                }
            }
        },
        _handleKeyDown: function(b) {
            var a = b.which;
            var c = 37;
            var d = 39;
            var e = this._focusIndex;
            var f;
            b.stopPropagation();
            if (a === c || a === d) {
                if (a === c && e > 0) {
                    f = e - 1
                } else {
                    if (a === d && e < (this._panelsCount - 1)) {
                        f = e + 1
                    }
                }
            }
            if (typeof f !== "undefined") {
                this._blurPanels(f);
                this._focusPanel(f)
            }
        }
    };
    return h
});*/
/*AC.define("application/ShareController", ["require", "application/shims/AC_Element", "events/ApplicationEvents"], function(f) {
    var e = f("application/shims/AC_Element");
    var g = f("events/ApplicationEvents");
    var h = (function() {
        return {
            initialize: function() {
                g.on("DOMReady", function() {
                    this._initLinks()
                }.bind(this))
            },
            _initLinks: function() {
                var b = e.selectAll("[data-share]"),
                    a;
                for (a = 0; a < b.length; a++) {
                    e.addEventListener(b[a], "click", this._linkClick.bind(this))
                }
            },
            _linkClick: function(a) {
                var b = a.target,
                    c = b.getAttribute("href");
                switch (b.getAttribute("data-share")) {
                    case "facebook":
                        this.showFacebook(c);
                        break;
                    case "twitter":
                        this.showTwitter(c);
                        break;
                    case "pinterest":
                        this.showPinterest(c);
                        break;
                    case "weibo":
                        this.showWeibo(c);
                        break;
                    default:
                        return
                }
                a.preventDefault();
                return
            },
            showFacebook: function(a) {
                window.open(a, "", "width=555,height=368")
            },
            showTwitter: function(a) {
                window.open(a, "", "width=550,height=257")
            },
            showPinterest: function(a) {
                window.open(a, "", "width=750,height=302")
            },
            showWeibo: function(a) {
                window.open(a, "", "width=650,height=400")
            }
        }
    }());
    return h
});*/
/*AC.define("media/NativeVideoSrcSelectorDelegate", ["require", "events/ApplicationEvents", "application/RuntimeEnvironment"], function(e) {
    var g = e("events/ApplicationEvents"),
        f = e("application/RuntimeEnvironment");
    var h = (function() {
        var a = "medium";
        return {
            _setSrc: function(c, b) {
                c.setSrc(b)
            },
            _getSrcBySelection: function(b) {
                if (b && b.metadata && b.metadata.sizes) {
                    var c = b.metadata.sizes,
                        d, i = c.length;
                    for (d = 0; d < i; d++) {
                        if (c[d].type === a) {
                            return c[d].src
                        }
                    }
                }
                return null
            },
            _handleNativeSrcSelection: function(c) {
                var b = this._getSrcBySelection(c.settings);
                if (b) {
                    this._setSrc(c.scope, b)
                }
            },
            initialize: function() {
                if (f.shouldUseNativeVideoSrcSelector()) {
                    g.on("videoJSONSuccess", this._handleNativeSrcSelection.bind(this))
                }
            }
        }
    }());
    return h
});*/
AC.define("30-years/js/bootstrap", ["require", "application/RuntimeEnvironment", "hero/HeroVideoController", "application/shims/DOMReady", "application/ResponsiveNav", "application/YearNav", "hero/HeroController", "intro/IntroController", "application/TimelineController", "application/ScrollController", "events/ShowOnScroll", "application/shims/AC_AutoGallery", "./datavis/machineList", "events/ApplicationGestures", "application/shims/HTML5VideoTagDelegate", "application/years/YearHeroController", "application/Analytics", "application/years/VideoFigcaptionController", "application/years/PaddleController", "application/landing/LandingScrollControllerSetup", "application/YearNavKeyboard", "application/ShareController", "application/shims/TYConfig", "media/NativeVideoSrcSelectorDelegate"], function(P) {
    var W = P("application/RuntimeEnvironment");
    var F = P("hero/HeroVideoController");
    F.initialize();
    if (W.isIE7()) {
        return
    }
    P("application/shims/DOMReady");
    var K = P("application/ResponsiveNav");
    var I = P("application/YearNav");
    var O = P("hero/HeroController");
    var C = P("intro/IntroController");
    var L = P("application/TimelineController");
    var E = P("application/ScrollController");
    var Q = P("events/ShowOnScroll");
    var M = P("application/shims/AC_AutoGallery");
    var A = P("./datavis/machineList");
    var R = P("events/ApplicationGestures");
    var H = P("application/shims/HTML5VideoTagDelegate");
    var U = P("application/years/YearHeroController");
    var N = P("application/Analytics");
    var S = P("application/years/VideoFigcaptionController");
    var B = P("application/years/PaddleController");
    var J = P("application/landing/LandingScrollControllerSetup");
    var z = P("application/YearNavKeyboard");
    var T = P("application/ShareController");
    var V = P("application/shims/TYConfig");
    var D = P("media/NativeVideoSrcSelectorDelegate");
    if (W.supportsCalc()) {
        document.documentElement.classList.add("calc")
    }
    if (W.shouldUseTimelineController()) {
        var G = new L({
            debug: false,
            root: V.routePath
        })
    }
    N.initialize();
    if (W.shouldUseScrollController()) {
        E.initialize()
    }
    K.initialize();
    O.initialize();
    C.initialize();
    I.initialize();
    //R.initialize();
    //H.initialize();
    //U.initialize();
    //S.initialize();
    //B.initialize();
    //J.initialize();
    //T.initialize();
    //D.initialize();
    if (W.shouldUseKeyboardNavigation()) {
        //z.initialize()
    }
});
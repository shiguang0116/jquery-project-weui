!function (n) {
    var e = n.document,
        t = e.documentElement,
        i = 375,
        d = i / 20,
        o = "orientationchange" in n ? "orientationchange" : "resize",
        fn = function () {
            var w = t.clientWidth || 320; w > 600 && (w = 600);
            t.style.fontSize = w / d + "px";
        };
    e.addEventListener && (n.addEventListener(o, fn, !1), e.addEventListener("DOMContentLoaded", fn, !1))
    fn(); // 解决刷新过程中加载样式问题
}(window);
// ==UserScript==
// @name         网页全屏alpha
// @namespace    Skuyazlu
// @version      0.1
// @description  这种网站看番适配网页全屏
// @author       Skuyazlu
// @author       You
// @match        *://*/*.html
// ==/UserScript==

(function () {
    'use strict';
    //辅助方法>>打印debug信息
    const p = str => console.log(str);
    //p("预定义输出开始");
    const creatdiv = id => {
        var div = document.createElement('div');
        div.id = id;
        return div;
    }
    var frame = false;
    const traversal_dom = (dom) => {
        let doms = dom.children;
        if (doms.length != 0) {
            for (let i = 0; i < doms.length; i++) {
                if (!traversal_dom(doms[i])) {
                    return 0;
                }
            }
        }
        if (dom.nodeName == "IFRAME" || dom.nodeName == "FRAME") {
            if (!frame) {
                frame = dom;
            } else {
                return 0
            }
        }
        return 1;
    };
    const body_style = "height:0px; overflow:hidden;"
    const frame_style = "position:fixed; width:100%; height:100%; top:0px; left:0px;";

    const main = () => {
        window.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "f":
                case "F":
                    document.body.style = body_style;
                    frame.style = frame_style;
                    break;
                case "Escape":
                    document.body.style = "";
                    frame.style = "";
                    break;
                default:
                    console.log(event.key)
            }
        });
        frame.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "f":
                case "F":
                    document.body.style = body_style;
                    frame.style = frame_style;
                    break;
                case "Escape":
                    document.body.style = "";
                    frame.style = "";
                    break;
                default:
                    console.log(event.key)
            }
        });
    };
    if (traversal_dom(document.body)) {
        main();
    }
})();
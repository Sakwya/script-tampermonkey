// ==UserScript==
// @name         存储与读取
// @namespace    Skuyazlu
// @version      0.1
// @description  测试油猴功能
// @author       Skuyazlu
// @grant GM_addStyle
// @grant GM_listValues
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @match        http://127.0.0.1:81/
// ==/UserScript==

(function () {
    'use strict';
    var a = document.createElement('div');
    a.innerHTML=("存储数据");
    var b = document.createElement('div');
    b.innerHTML=("读取数据");
    var c = document.createElement('div');
    c.innerHTML=("列出所有数据");
    var aa = document.createElement('div');
    var bb = document.createElement('div');
    var cc = document.createElement('div');
    a.className=("butt")
    b.className=("butt")
    c.className=("butt")
    aa.className=("list")
    bb.className=("list")
    cc.className=("list")
    var style=`
    .butt{
        width: 120px;
        height: 30px;
        line-height: 30px;
        background: #eee;
        margin: 4px 0px;
    }
    .list{
        width: 260px;
        height:120px;
        background: #eee;
    }
    #root{
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
    }
    `
    var root =document.createElement("div");
    root.id=("root");
    root.appendChild(a).addEventListener("click", function(){
        GM_setValue("name","sky")
    });
    root.appendChild(aa)
    root.appendChild(b).addEventListener("click", function(){
        this.nextElementSibling.innerHTML=(GM_getValue("name"))
    });
    root.appendChild(bb)
    root.appendChild(c).addEventListener("click", function(){
        this.nextElementSibling.innerHTML=(GM_listValues())
    });
    root.appendChild(cc)
    document.body.appendChild(root)
    GM_addStyle(style);
})();
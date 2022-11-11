// ==UserScript==
// @name         折叠课程
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  咦，好！折叠哩！
// @author       YYc
// @match        https://s.ecust.edu.cn/microuserkc/*
// ==/UserScript==

(function () {
    'use strict';
    function clean(classn) {
        document.getElementsByClassName(classn)[0].style.display = "none";
    };
    clean("w_head clearf");
    clean("navbg fl");
    var style = document.createElement("style");
    style.innerHTML = "body{background:#0000;} .wzy_couros_row{background:#f001;border:0px;border-radius: 10px 50px;padding:10px 30px;border-left:1px solid #ff0000;border-top:1px solid #ff0000;border-right:1px solid #ff00ff;border-bottom:1px solid #ff00ff;box-shadow:2px 2px 2px #f0f6;}#row { position: fixed; left: 60%; top: 0px;-webkit-transition:top 0.6s; transition:top 0.6s; } #row div { 	background: #feee; 	width: 300px; height: 400px; 	overflow-x: hidden; overflow-y: scroll;} #row div::-webkit-scrollbar { width: 4px; } #row div::-webkit-scrollbar-thumb { border-radius: 10px; -webkit-box-shadow: inset 0 0 5px rgba(255,0,255,0.1); background: rgba(255,0,255,0.1); } #row div::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 5px rgba(255,0,255,0.1); border-radius: 0; background: rgba(255,0,255,0.1); } #row div div { color: #a00a; line-height: 30px; margin: 10px; padding: 0px 20px; height: 30px; 	width: 240px; 	border-right: 4px solid #f0f1; background: #ff00000a; 	overflow: hidden; } #row div .dis { color: #a006; background: #0000; }";
    document.head.appendChild(style);
    var classrow = document.getElementsByClassName("wzy_couros")[0].firstElementChild.children;
    var row = document.createElement("div");
    row.id = "row";
    var script = document.createElement("script");
    script.innerHTML = "function modchange(cid){ var ch = document.getElementById(cid); if(ch.className=='dis'){ ch.className=''; document.querySelector(\"[cid='\"+cid+\"']\").style.display=''; }else{ ch.className='dis'; document.querySelector(\"[cid='\"+cid+\"']\").style.display='none'; } }";
    row.appendChild(script);
    var crow = document.createElement("div");
    crow.style='border-left:1px solid #f00;border-right:1px solid #f0f; box-shadow: 2px 3px 2px #f0f6; ';
    for (var i = 0; i < classrow.length; i++) {
        var lesn = document.createElement("div");
        lesn.id = classrow[i].getAttribute("cid");
        var func = "modchange(" + lesn.id + ")";
        lesn.setAttribute("onClick", func);
        lesn.innerHTML = classrow[i].firstElementChild.children[2].firstElementChild.innerHTML;
        crow.appendChild(lesn);
        var con = 'hiddenclass(\"' + lesn.id + '\");/**' + lesn.innerHTML+"*/";
        console.log(con);
    }
    row.appendChild(crow);
    var bar = document.createElement('div');
    bar.style = 'height: 1px;width: 100%;background: #f0f;';
    var swih = document.createElement('div');
    swih.innerHTML = "OFF";
    swih.onclick = function () {
        if (swih.innerHTML =="OFF") {
            swih.innerHTML ="ON";
            row.style.top = "0px";
        } else {
            swih.innerHTML = "OFF";
            row.style.top = '-400px';
        }
    }
    row.style.top = '-400px';
    swih.style = "position: absolute;bottom: -30px;color: rgb(255, 0, 255);margin-left: 200px;height: 30px;width: 60px;background: rgb(255, 204, 255);border-bottom-left-radius: 30px;border-bottom-right-radius: 30px;border-bottom: 1px solid;border-left: 1px solid;border-right: 1px solid;text-align: center;line-height: 30px;overflow: hidden;";
    row.appendChild(bar);
    row.appendChild(swih);
    document.body.appendChild(row);
    var hiddenclass = function (cid) {
        document.getElementById(cid).className = "dis";
        document.querySelector("[cid='" + cid + "']").style.display = 'none';
        console.log("[cid='" + cid + "']");
        console.log(document.querySelector("[cid='" + cid + "']").style);
    };
    //hiddenclass("441650000017423");/**大学英语Ⅲ（2022）*/
    //hiddenclass("441650000017374");/**大学物理A（下）-习题课*/
    hiddenclass("441650000020094");/**形势与政策（3）*/
    //hiddenclass("441650000019449");/**大学物理（下）*/
    //hiddenclass("441650000019399");/**体育(3)-高尔夫*/
    //hiddenclass("441650000018713");/**毛泽东思想和中国特色社会主义理论体系概论(上)*/
    //hiddenclass("441650000018407");/**动态网页设计*/
    //hiddenclass("441650000018094");/**面向对象程序设计*/
    //hiddenclass("441650000017798");/**离散数学*/
    //hiddenclass("441650000017684");/**人工智能导论与基础算法实训*/
    hiddenclass("441650000016737");/**大学生心理健康教育*/
    hiddenclass("441650000016285");/**形势与政策（2）*/
    hiddenclass("441650000013771");/**军事理论*/
    hiddenclass("441650000012186");/**大学物理（上）习题课*/
    hiddenclass("441650000001282");/**大学物理（上、下）*/
    hiddenclass("441650000016044");/**【实践教学】作业提交*/
    hiddenclass("441650000014494");/**计算机职业实践*/
    hiddenclass("441650000014422");/**Python程序设计(公选)*/
    hiddenclass("441650000014228");/**大学英语Ⅱ*/
    hiddenclass("441650000014097");/**体育(2)*/
    hiddenclass("441650000013918");/**高等数学（下）*/
    hiddenclass("441650000013846");/**算法与数据结构*/
    hiddenclass("441650000013713");/**中国近现代史纲要*/
    hiddenclass("441650000013392");/**创造性思维与创新方法*/
    hiddenclass("441650000013219");/**形势与政策（1）*/
    hiddenclass("441650000013102");/**习近平新时代中国特色社会主义思想概论*/
    hiddenclass("441650000013083");/**计算机类专业概论*/
    hiddenclass("441650000013024");/**计算机导论-2021-2022-1*/
    hiddenclass("441650000012658");/**高等数学（上）*/
    hiddenclass("441650000012972");/**体育(1)*/
    hiddenclass("441650000010610");/**线性代数 (21级)*/
    hiddenclass("441650000012751");/**思想道德与法治*/
    //hiddenclass("200903091");/**大学物理实验*/
    hiddenclass("222521542");/**计算机网络及应用-2022*/
    hiddenclass("221201035");/**上海市大学生安全教育（2021级）*/
    hiddenclass("204666772");/**计算机程序设计*/
})();
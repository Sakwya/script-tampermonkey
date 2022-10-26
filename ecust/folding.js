// ==UserScript==
// @name         折叠课程
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  给爷收捏
// @author       YYc
// @match        https://s.ecust.edu.cn/microuserkc/*
// ==/UserScript==

(function() {
    'use strict';
    function clean(classn){
        document.getElementsByClassName(classn)[0].style.display='none';
    };
    clean('w_head clearf');
    clean('navbg fl');
    var style = document.createElement('style');
    style.innerHTML='body{background:#0000;} .wzy_couros_row{background:#0002;border:0px;border-radius: 10px 50px;padding:10px 30px;}#row { position: fixed; left: 60%; top: 0px;-webkit-transition:top 0.6s; transition:top 0.6s; } #row div { 	background: #000a; 	width: 300px; height: 400px; 	overflow-x: hidden; overflow-y: scroll; } #row div::-webkit-scrollbar { width: 4px; } #row div::-webkit-scrollbar-thumb { border-radius: 10px; -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2); background: rgba(0,0,0,0.2); } #row div::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2); border-radius: 0; background: rgba(0,0,0,0.1); } #row div div { color: #fff; line-height: 30px; margin: 10px; padding: 0px 20px; height: 30px; 	width: 240px; 	border-right: 4px solid #fff1; background: #fff2; 	overflow: hidden; } #row div .dis { color: #aaa; background: #0000; }';
    document.head.appendChild(style);
    var classrow = document.getElementsByClassName('wzy_couros')[0].firstElementChild.children;
    var row = document.createElement('div');
    row.id='row';
    var script = document.createElement('script');
    script.innerHTML="function modchange(cid){ var ch = document.getElementById(cid); if(ch.className=='dis'){ ch.className=''; document.querySelector(\"[cid='\"+cid+\"']\").style.display=''; }else{ ch.className='dis'; document.querySelector(\"[cid='\"+cid+\"']\").style.display='none'; } }";
    row.appendChild(script);
    var crow = document.createElement('div');;
    for(var i=0;i<classrow.length;i++){
        var lesn = document.createElement('div');
        lesn.id=classrow[i].getAttribute('cid');
        var func = 'modchange('+lesn.id+')';
        lesn.setAttribute('onClick',func);
        lesn.innerHTML=classrow[i].firstElementChild.children[2].firstElementChild.innerHTML;
        crow.appendChild(lesn);
        var con = 'clear(\''+lesn.id+'\')//'+lesn.innerHTML;
        console.log(con);

    }
    row.appendChild(crow);
    var bar= document.createElement('div');
    bar.style='height: 5px;width: 100%;background: #000c;';
    var swih =document.createElement('div');
    swih.innerHTML='OFF';
    swih.onclick=function(){
        if(swih.innerHTML=='OFF'){
            swih.innerHTML='ON';
            row.style.top='0px';
        }else{
            swih.innerHTML='OFF';
            row.style.top='-400px';
        }
    }
    row.style.top='-400px';
    swih.style="margin-left: 200px;height: 30px;width: 60px;background: #000c;border-bottom-left-radius: 30px;border-bottom-right-radius: 30px;text-align: center;line-height: 30px;overflow:hidden;";
    row.appendChild(bar);
    row.appendChild(swih);
    document.body.appendChild(row);
    function clear(cid){
        document.getElementById(cid).className='dis';
			document.querySelector("[cid='"+cid+"']").style.display='none';
    };
    clear('441650000019614')//2022年网络安全意识培训
//clear('441650000019449')//大学物理（下）
//clear('441650000019399')//体育(3)-高尔夫
//clear('441650000017374')//大学物理A（下）-习题课
//clear('441650000018713')//毛泽东思想和中国特色社会主义理论体系概论(上)
//clear('441650000018407')//动态网页设计
//clear('441650000018094')//面向对象程序设计
//clear('441650000017798')//离散数学
//clear('441650000017684')//人工智能导论与基础算法实训
//clear('441650000017423')//大学英语Ⅲ（2022）
clear('441650000016737')//大学生心理健康教育
clear('441650000016285')//形势与政策（2）
clear('441650000013771')//军事理论
clear('441650000012186')//大学物理（上）习题课
clear('441650000016044')//【实践教学】作业提交
clear('441650000014494')//计算机职业实践
clear('441650000014422')//Python程序设计(公选)
clear('441650000014228')//大学英语Ⅱ
clear('441650000014097')//体育(2)
clear('441650000013918')//高等数学（下）
clear('441650000013846')//算法与数据结构
clear('441650000013713')//中国近现代史纲要
clear('441650000013392')//创造性思维与创新方法
clear('441650000013219')//形势与政策（1）
clear('441650000013102')//习近平新时代中国特色社会主义思想概论
clear('441650000013083')//计算机类专业概论
clear('441650000013024')//计算机导论-2021-2022-1
clear('441650000012658')//高等数学（上）
clear('441650000012972')//体育(1)
clear('441650000010610')//线性代数 (21级)
clear('441650000012751')//思想道德与法治
//clear('200903091')//大学物理实验
clear('222521542')//计算机网络及应用-2022
clear('221201035')//上海市大学生安全教育（2021级）
clear('204666772')//计算机程序设计
})();
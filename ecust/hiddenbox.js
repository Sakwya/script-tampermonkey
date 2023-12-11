// ==UserScript==
// @name        华东理工大学本研——课程折叠机
// @namespace   Sakwya
// @version     0.2.1
// @description 隐藏不需要显示的课程，顺带阿巴阿巴一下。
// @author      Sakwya
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @match       https://s.ecust.edu.cn/microuserkc/*
// ==/UserScript==

(function () {
  'use strict';
  const createDiv = id => {
    var div = document.createElement('div');
    div.id = id;
    return div;
  }
  {
    let style = `body { background: #0000; } .wzy_couros { width: 60%; margin: auto; } .wzy_courosColumn { margin: 0.25rem 0; background: linear-gradient(90deg, #fff5, #aaf5); border: 0px; border-radius: 5rem 1rem 4rem 1rem; padding: 0.5rem; overflow: hidden; cursor: pointer; box-shadow: 0px 0px 2px #00f6; transform-origin: top; transition: transform 0.2s, box-shadow 0.2s; } .wzy_courosColumn:hover { transform: rotate(1deg) scale(1.05); box-shadow: 1px 1px 6px #00f6; } #course_root { position: fixed; left: 60%; top: 0px; -webkit-transition: top 0.6s; transition: top 0.6s; font-weight: bolder; } #courseToggleBtnColumn { background: #fffa; width: 240px; height: 400px; overflow-x: hidden; overflow-y: scroll; border-bottom-left-radius: 20px; border: 1px solid; border-top: 0px; } #courseToggleBtnColumn::-webkit-scrollbar { width: 6px; } #courseToggleBtnColumn::-webkit-scrollbar-thumb { border-radius: 6px; background: #eeee; } #courseToggleBtnColumn::-webkit-scrollbar-track { border-radius: 0; background: #fffe; } #courseToggleBtnColumn div { box-sizing: border-box; color: #555; margin: 10px; padding: 0px 10px; height: 30px; width: 220px; border-radius: 5px; cursor: pointer; overflow: hidden; } .courseToggleBtn { line-height: 28px; border: 1px solid #555; background: #fff; box-shadow: 1px 1px 2px 1px lightgrey; } .courseToggleBtn_h { line-height: 30px; border: 0px; background: #fff; } .courseToggleBtn:hover, .courseToggleBtn_h:hover { background: #eee; } #course_s { position: absolute; right: 0px; bottom: -20px; color: #555; height: 20px; width: 100px; background: #fffe; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; border: 1px solid; border-top: 0px; text-align: center; line-height: 20px; } .wzy_couros_pic { opacity: 0.75; border-radius: 4.5rem 0.5rem 0.5rem 0.5rem; } .wzy_couros_pic img { mask: linear-gradient(270deg, transparent 0%, black 50%, black 100%); -webkit-mask: linear-gradient(270deg, transparent 0%, black 50%, black 100%); }`
    GM_addStyle(style);
  }
  //去除大概不需要的信息
  var courseColumn = document.body.getElementsByClassName("wzy_couros")[0];
  document.body.appendChild(courseColumn);
  {
    let temp = document.body.childNodes;
    while (temp.length > 1) {
      document.body.removeChild(temp[0]);
    }
  }
  //定义样式

  //定义下拉栏
  var courseItem = courseColumn.firstChild.children;
  var courseMenu = createDiv("courseMenu");
  var courseToggleBtnColumn = createDiv("courseToggleBtnColumn");
  for (let i = 0; i < courseItem.length; i++) {
    let courseToggleBtn = document.createElement("div");
    courseToggleBtn.className = ("courseToggleBtn");
    courseToggleBtn.id = courseItem[i].getAttribute("cid");
    courseToggleBtn.addEventListener("click", function () {
      if (this.classList.contains("hidden")) {
        this.classList.remove('hidden');
        document.querySelector("[cid='" + this.id + "']").style.display = '';
        let x = GM_getValue("cid_h");
        while (x.indexOf(this.id) != -1) {
          x.splice(x.indexOf(this.id), 1);
        }
        GM_setValue("cid_h", x);
      } else {
        this.classList.add('hidden');
        document.querySelector("[cid='" + this.id + "']").style.display = 'none';
        let x = GM_getValue("cid_h");
        x.push(this.id);
        GM_setValue("cid_h", x);
      }
    })
    courseToggleBtn.innerHTML = courseItem[i].children[0].children[2].firstElementChild.innerHTML;
    courseToggleBtnColumn.appendChild(courseToggleBtn);
  }
  courseMenu.appendChild(courseToggleBtnColumn);
  var course_s = createDiv("course_s");
  course_s.innerHTML = "显示课程菜单";
  course_s.onclick = function () {
    if (course_s.innerHTML == "显示课程菜单") {
      course_s.innerHTML = "隐藏课程菜单";
      courseMenu.style.top = "0px";
    } else {
      course_s.innerHTML = "显示课程菜单";
      courseMenu.style.top = '-400px';
    }
  }
  courseMenu.style.top = '-400px';
  courseMenu.appendChild(course_s);
  document.body.appendChild(courseMenu);
  //载入隐藏课程
  if (GM_getValue("cid_h") === undefined) {
    let x = [];
    GM_setValue("cid_h", x);
  } else {
    let x = GM_getValue("cid_h");
    for (let i = 0; i < x.length; i++) {
      document.getElementById(x[i]).className = "courseToggleBtn_h"
      document.querySelector("[cid='" + x[i] + "']").style.display = 'none';
    }
  }
})();
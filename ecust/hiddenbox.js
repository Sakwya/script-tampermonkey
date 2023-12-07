// ==UserScript==
// @name         华东理工大学本研——课程折叠机
// @namespace    Sakwya
// @version      0.2.1
// @description  隐藏不需要显示的课程，顺带阿巴阿巴一下。
// @author       Sakwya
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @match        https://s.ecust.edu.cn/microuserkc/*
// @downloadURL https://update.greasyfork.org/scripts/454642/%E5%8D%8E%E4%B8%9C%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%9C%AC%E7%A0%94%E2%80%94%E2%80%94%E8%AF%BE%E7%A8%8B%E6%8A%98%E5%8F%A0%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/454642/%E5%8D%8E%E4%B8%9C%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%9C%AC%E7%A0%94%E2%80%94%E2%80%94%E8%AF%BE%E7%A8%8B%E6%8A%98%E5%8F%A0%E6%9C%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const createDiv = id => {
    var div = document.createElement('div');
    div.id = id;
    return div;
  }
  //去除大概不需要的信息
  var course_r = document.body.getElementsByClassName("wzy_couros")[0];
  document.body.appendChild(course_r);
  var pog = document.body.childNodes;
  while (pog.length > 1) {
    document.body.removeChild(pog[0]);
  }
  //定义样式
  const style = `body {
    background: #0000;
}

.wzy_couros {
    width: 60%;
    margin: auto;
}

.wzy_couros_row {
    margin: 0.25rem 0;
    background: linear-gradient(90deg, #fff5, #aaf5);
    border: 0px;
    border-radius: 5rem 1rem 4rem 1rem;
    padding: 0.5rem;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0px 0px 2px #00f6;
    transform-origin: top;
    transition: transform 0.2s, box-shadow 0.2s;
}

.wzy_couros_row:hover {
    transform: rotate(1deg) scale(1.05);
    box-shadow: 1px 1px 6px #00f6;
}

#course_root {
    position: fixed;
    left: 60%;
    top: 0px;
    -webkit-transition: top 0.6s;
    transition: top 0.6s;
    font-weight: bolder;
}

#course_b_row {
    background: #fffa;
    width: 240px;
    height: 400px;
    overflow-x: hidden;
    overflow-y: scroll;
    border-bottom-left-radius: 20px;
    border: 1px solid;
    border-top: 0px;
}

#course_b_row::-webkit-scrollbar {
    width: 6px;
}

#course_b_row::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #eeee;
}

#course_b_row::-webkit-scrollbar-track {
    border-radius: 0;
    background: #fffe;
}

#course_b_row div {
    box-sizing: border-box;
    color: #555;
    margin: 10px;
    padding: 0px 10px;
    height: 30px;
    width: 220px;
    border-radius: 5px;
    cursor: pointer;
    overflow: hidden;
}

.course_b {
    line-height: 28px;
    border: 1px solid #555;
    background: #fff;
    box-shadow: 1px 1px 2px 1px lightgrey;
}

.course_b_h {
    line-height: 30px;
    border: 0px;
    background: #fff;
}

.course_b:hover,
.course_b_h:hover {
    background: #eee;
}

#course_s {
    position: absolute;
    right: 0px;
    bottom: -20px;
    color: #555;
    height: 20px;
    width: 100px;
    background: #fffe;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    border: 1px solid;
    border-top: 0px;
    text-align: center;
    line-height: 20px;
}

.wzy_couros_pic {
    border-radius: 4.5rem 0.5rem 0.5rem 0.5rem;
}

.wzy_couros_pic img {
    mask: linear-gradient(270deg, transparent 0%, black 50%, black 100%);
    -webkit-mask: linear-gradient(270deg, transparent 0%, black 50%, black 100%);
}`
  GM_addStyle(style);
  //定义下拉栏

  var course_ele = course_r.children[0].children;
  var course_root = createDiv("course_root");
  var course_b_row = createDiv("course_b_row");
  for (let i = 0; i < course_ele.length; i++) {
    let course_b = document.createElement("div");
    course_b.className = ("course_b");
    course_b.id = course_ele[i].getAttribute("cid");
    course_b.addEventListener("click", function () {
      let course_r = document.getElementById(this.id);
      if (this.className == "course_b") {
        this.className = "course_b_h"
        document.querySelector("[cid='" + this.id + "']").style.display = 'none';
        let x = GM_getValue("cid_h");
        x.push(this.id);
        GM_setValue("cid_h", x);
      } else {
        this.className = "course_b"
        document.querySelector("[cid='" + this.id + "']").style.display = '';
        let x = GM_getValue("cid_h");
        while (x.indexOf(this.id) != -1) {
          x.splice(x.indexOf(this.id), 1);
        }
        GM_setValue("cid_h", x);
      }
    })
    course_b.innerHTML = course_ele[i].children[0].children[2].firstElementChild.innerHTML;
    course_b_row.appendChild(course_b);
  }
  course_root.appendChild(course_b_row);
  var course_s = createDiv("course_s");
  course_s.innerHTML = "显示课程菜单";
  course_s.onclick = function () {
    if (course_s.innerHTML == "显示课程菜单") {
      course_s.innerHTML = "隐藏课程菜单";
      course_root.style.top = "0px";
    } else {
      course_s.innerHTML = "显示课程菜单";
      course_root.style.top = '-400px';
    }
  }
  course_root.style.top = '-400px';
  course_root.appendChild(course_s);
  document.body.appendChild(course_root);
  //载入隐藏课程
  if (GM_getValue("cid_h") === undefined) {
    let x = [];
    GM_setValue("cid_h", x);
  } else {
    let x = GM_getValue("cid_h");
    for (let i = 0; i < x.length; i++) {
      document.getElementById(x[i]).className = "course_b_h"
      document.querySelector("[cid='" + x[i] + "']").style.display = 'none';
    }
  }
})();
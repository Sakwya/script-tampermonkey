// ==UserScript==
// @name         华东理工大学本研——背景
// @namespace    Skuyazlu
// @version      0.2
// @description  去除多余的信息，同时可以自定义改变背景。课程折叠机的伴生品。
// @author       Skuyazlu
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @match        https://i.s.ecust.edu.cn/*
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
    //背景预处理
    p(document.body.style.background);
    if (GM_getValue("bg_data") === undefined) {
        document.body.style.backgroundImage = "";
    } else {
        document.body.style.backgroundImage = "url(" + GM_getValue("bg_data") + ")";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundSize = "cover";
    }
    //去除完全没用的东西
    var left_content = document.getElementsByClassName("mainleft leftF")[0];
    var main_frame = document.getElementById("frame_content");
    document.body.innerHTML = "";
    document.body.appendChild(left_content).style.display = "none";
    document.body.appendChild(main_frame);
    //定义侧拉栏
    var side_style = `
    #side {
        font-size: 14px;
        position: fixed;
        top: 10%;
        left: 0px;
        -webkit-transition: left 0.6s;
        transition: left 0.6s;
      }
  
      #side_c {
        padding: 10px;
        background: #fffe;
        width: 200px;
        height: 200px;
        overflow: hidden;
        border-bottom-right-radius: 20px;
        border: 1px solid;
        border-left: 0px;
        box-sizing: border-box;
      }
  
      #side_s {
        position: absolute;
        right: -20px;
        color: #222;
        height: 124px;
        width: 20px;
        background: #fffe;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        border: 1px solid;
        border-left: 0px;
        writing-mode: vertical-lr;
        -webkit-writing-mode: vertical-lr;
        text-align: center;
        letter-spacing: 2px;
        overflow: hidden;
        cursor: pointer;
      }
  
      #upload_bg {
        margin: 10px 0px;
      }
  
      #b_save,
      #b_cancel,
      #b_remove {
        height: 30px;
        margin: 10px 0px;
        box-sizing: border-box;
        border: 1px solid;
        border-radius: 5px;
        color: #222;
        background: #eee;
        line-height: 30px;
        padding: 0px 15px;
        cursor: pointer;
      }
  
      #b_save:hover,
      #b_cancel:hover,
      #b_remove:hover {
        background: #ddd;
      }
    
    `
    GM_addStyle(side_style);
    //容器基座
    var side = creatdiv("side");
    //容器开关
    var side_s = creatdiv("side_s");
    side_s.innerHTML = "隐藏背景菜单";
    side_s.onclick = function () {
        if (side_s.innerHTML == "显示背景菜单") {
            side_s.innerHTML = "隐藏背景菜单";
            side.style.left = "0px";
        } else {
            side_s.innerHTML = "显示背景菜单";
            side.style.left = '-200px';
        }
    };
    //容器主体
    var side_c = creatdiv("side_c");
    //选择新背景
    var upload_bg = document.createElement('input');
    upload_bg.id = "upload_bg";
    upload_bg.type = "file";
    upload_bg.accept = "image/*";
    upload_bg.addEventListener("change", function () {
        var URL = window.URL || window.webkitURL || window.mozURL;
        var fileObj = this.files[0];
        var container = document.getElementById('row');
        var img = new Image();
        var img_url = URL.createObjectURL(fileObj);
        img.src = img_url;
        document.body.style.backgroundImage = "url(" + img_url + ")";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundSize = "cover";
        const image = new Image();
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = img_url;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            const ext = img_url.substring(img_url.lastIndexOf('.') + 1).toLowerCase();
            var dataUrl = canvas.toDataURL(`image/${ext}`);
            document.getElementById("dataurl").innerText = dataUrl;
        }
    });
    //保存背景数据
    var b_save = creatdiv("b_save");
    b_save.innerHTML = "保存背景";
    b_save.addEventListener("click", function () {
        if (document.getElementById("dataurl").innerText != "") {
            GM_setValue("bg_data", document.getElementById("dataurl").innerText);
            window.alert("保存成功！");
            document.getElementById("upload_bg").outerHTML = document.getElementById("upload_bg").outerHTML;
        } else {
            window.alert("请选择背景图片");
        }
    });
    var dataurl = creatdiv("dataurl");
    dataurl.style.display = "none";
    //取消改变
    var b_cancel = creatdiv("b_cancel");
    b_cancel.innerHTML = "取消";
    b_cancel.addEventListener("click", function () {
        document.getElementById("upload_bg").outerHTML = document.getElementById("upload_bg").outerHTML;
        document.getElementById("dataurl").innerText = "";
        if (GM_getValue("bg_data") === undefined) {
            document.body.style.backgroundImage = "";
        } else {
            document.body.style.backgroundImage = "url(" + GM_getValue("bg_data") + ")";
        }
    });
    //恢复默认背景
    var b_remove = creatdiv("b_remove");
    b_remove.innerHTML = "恢复默认背景";
    b_remove.addEventListener("click", function () {
        if (window.confirm("确定要恢复默认背景吗？")) {
            document.getElementById("upload_bg").outerHTML = document.getElementById("upload_bg").outerHTML;
            GM_deleteValue("bg_data");
            document.body.style.backgroundImage = "";
        }
    });
    //网页中插入
    side_c.appendChild(upload_bg);
    side_c.appendChild(b_save);
    side_c.appendChild(b_cancel);
    side_c.appendChild(b_remove);
    side.appendChild(side_s);
    side.appendChild(side_c);
    document.body.appendChild(side);
    document.body.appendChild(dataurl);
    //console.log("预定义输出结束");
})();
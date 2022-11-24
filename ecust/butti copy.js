// ==UserScript==
// @name         背景
// @namespace    Skuyazlu
// @version      0.1
// @description  去除多余的信息，让你的视线可以集中在阿比身上。课程折叠机的伴生品。
// @author       Skuyazlu
// @grant GM_listValues
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @match        http://127.0.0.1:81/
// ==/UserScript==

(function () {
    'use strict';
    if (GM_listValues().includes('ecust_bg')) {
        document.body.style.background = "url(" + GM_getValue() + ") no-repeat fixed";
        console.log("included");
    } else {
        document.body.style.background = "url() no-repeat fixed";
        console.log("not included");
    }
    var style = document.createElement("style");
    style.innerHTML = "#row { position: fixed; left: 30%; top: 0px;-webkit-transition:top 0.6s; transition:top 0.6s; } #row div { 	background: #eeee; 	width: 200px; height: 90px; overflow: hidden;border-left: 1px solid;border-right: 1px solid;border-bottom: 1px solid;} #row div div { color: #555; line-height: 30px; margin: 10px; padding: 0px 20px; height: 30px; width: 140px; }";
    document.head.appendChild(style);
    var row = document.createElement("div");
    row.id = "row";
    row.style.top = '0px';
    var content = document.createElement('div');
    var new_bg = document.createElement('input');
    new_bg.id = "nbg";
    new_bg.type = "file";
    new_bg.accept = "image/*";
    new_bg.onchange = ``;
    var URL = window.URL || window.webkitURL || window.mozURL
    var upload_script = document.createElement('script');
    var datadiv = document.createElement('div');
    datadiv.id="dataurl";
    datadiv.style.display = "none";
    document.body.appendChild(datadiv);
    upload_script.innerHTML = `
    var dataUrl ='';
    var imgUrlToBase64 = function(url){
        const image = new Image();
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            const ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
            dataUrl = canvas.toDataURL(\`image/\${ext}\`);
            console.log(dataUrl);
            console.log(typeof(dataUrl));
            var dataurl = document.getElementById("dataUrl");
            document.body.style.backgroundImage="url("+dataurl.innerHTML+")"
        }
    };
        function uploadImg(dom) {
            console.log("运行1")
            var fileObj =
            dom = dom.files[0]
            console.log(dom);
            var container = document.getElementById('row');
            var img = new Image()
            img.width=200
            img.src = URL.createObjectURL(fileObj)
            console.log(img.src)
            img.onload = function() {
                container.appendChild(img)
            }
            imgUrlToBase64(img.src)
        }
    `
    content.innerHTML=`<input type="file" accept="image/*" onchange="uploadImg(this)">`;
    var su = document.createElement('div');
    su.innerHTML="点击储存";
    window.savedataurl = () => {
        console.log("Click");

        GM_listValues();
        console.log("1");
        GM_setValue("bgur", document.getElementById('dataurl').innerHTML);
        console.log("2");
        GM_listValues();
        console.log("3");
    };
    su.onclick=window.savedataurl();
    content.appendChild(su)
    row.appendChild(content);
    row.appendChild(upload_script);
    document.body.appendChild(row);
})();
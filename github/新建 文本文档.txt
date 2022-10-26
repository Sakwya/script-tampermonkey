// ==UserScript==
// @name         图片正常
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       YYc
// @match        https://github.com/tianyilt/ecust-CourseShare/blob/master/%E5%85%AC%E5%85%B1%E5%BF%85%E4%BF%AE/%E5%A4%A7%E7%89%A9%E5%AE%9E%E9%AA%8C/%E5%88%86%E5%85%89%E8%AE%A1/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    style.innerHTML='img{width:100%;}';
    document.head.appendChild(style);
})();
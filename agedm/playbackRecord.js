// ==UserScript==
// @name         AGE动漫播放进度记录
// @namespace    sakwya
// @version      2024-07-16
// @description  修正AGE部分线路的播放进度记录
// @author       sakwya
// @license      MIT
// @match        https://43.240.156.118:8443/m3u8/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agedm.org
// ==/UserScript==

(function () {
  'use strict';
  const video = document.querySelector("#loading > div > video");
  const lastSrc = localStorage.getItem("lastSrc");
  const currentSrc = video.src;
  const isSameSrc = (lastSrc == currentSrc);
  var lastRecordTime;
  if (!isSameSrc) {
    localStorage.setItem("lastSrc", currentSrc);
    const spjx_settings = localStorage.getItem("spjx_settings");
    if (spjx_settings) {
      lastRecordTime = spjx_settings.match(/"1":(\d+)/)[1];
      const recordTime = parseInt(localStorage.getItem(currentSrc)) || 0
      const new_spjx_settings = spjx_settings.replace(/"1":\d+/, '"1":' + recordTime);
      localStorage.setItem("spjx_settings", new_spjx_settings);
      // 下面这行代码会在网页播放器加载spjx_settings之前执行，所以不执行也可以。
      video.currentTime = recordTime;
      if (lastRecordTime != "0") localStorage.setItem(lastSrc, lastRecordTime);
    }
    else {
      console.warn("spjx_settings not found or invalid!");
    }
  }
  // 记录播放历史位置并设置过期
  const recordedSrc = JSON.parse(localStorage.getItem("recordedSrc")) || {}
  const now = Date.now();
  // recordedSrc[lastSrc] = now + 14 * 24 * 60 * 60 * 1000;
  if (lastRecordTime != "0") recordedSrc[lastSrc] = now + 1209600000;
  for (let key in recordedSrc) {
    if (recordedSrc[key] > now) continue;
    localStorage.removeItem(key);
    delete recordedSrc[key];
  }
  localStorage.setItem("recordedSrc", JSON.stringify(recordedSrc));
})();
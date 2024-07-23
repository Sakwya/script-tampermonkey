// ==UserScript==
// @name         AGE动漫播放进度记录
// @namespace    sakwya
// @version      2024-07-24
// @description  修正AGE部分线路的播放进度记录
// @author       sakwya
// @license      MIT
// @match        https://www.agedm.org/play/*/*
// @match        https://43.240.156.118:8443/vip/*
// @match        https://43.240.156.118:8443/m3u8/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agedm.org
// ==/UserScript==

'use strict';
(function () {
  'use strict';
  switch (window.location.href.split('/')[3]) {
    case 'play':
      func_top();
      break;
    case 'vip':
      setTimeout(func_vip, 0);
      break;
    case 'm3u8':
      setTimeout(func_m3u8, 0);
      break;
    default:
      // 理论上不会执行到这里
      console.alert("URL resolution error");
  }
})();

/**
 * www.agedm.org处理
 * 通过url路径将一些信息传输给iframe
 */
function func_top() {
  const iframe = document.getElementById('iframeForVideo');
  if (!iframe || !iframe.contentWindow) {
    console.alert("Failed to get iframe")
  }
  const parent = iframe.parentElement;
  parent.removeChild(iframe);
  const title = document.getElementsByClassName("card-title")[0].innerText;
  const episode = document.getElementsByClassName("video_detail_spisode_playing")[0].parentElement.firstChild.innerText;
  iframe.src = iframe.src + "#title=" + title + "#episode=" + episode;
  parent.appendChild(iframe);
}
function func_vip() {
  const id = PlayConfig.Id;
  if (!id) {
    console.alert("Failed to get PlayConfig.Id")
    return
  }
  const href = decodeURIComponent(window.location.href);
  const pack = href.match(/#title=([^#]*)#episode=([^#]*)/);
  const title = pack[1];
  const episode = pack[2];
  // const video = document.querySelector("#artplayer > div > video")

  /**
   *  artplayer本身存在读取历史的逻辑
   * 所以记录历史交给artplayer
   * 这里只实现进度的过期删除
  */
  const recorded = JSON.parse(localStorage.getItem("vip_recorded")) || {}
  const now = Date.now();
  // "expirationDate": now + 14 * 24 * 60 * 60 * 1000;
  recorded[id] = {
    "title": title,
    "episode": episode,
    "expirationDate": now + 1209600000
  };
  const lastID = localStorage.getItem("lastID_vip");
  localStorage.setItem("lastID_vip", id);
  if (parseInt(localStorage.getItem(lastID)) || 0 < 10) {
    localStorage.removeItem(lastID);
    delete recorded[lastID];
  }

  Object.keys(recorded).forEach(key => {
    if (recorded[key].expirationDate > now) return
    localStorage.removeItem(key);
    delete recorded[key];
  })
  localStorage.setItem("vip_recorded", JSON.stringify(recorded));
}

function func_m3u8() {
  const id = Vurl_id;
  if (!id) {
    console.alert("Failed to get Vurl_id")
    return
  }
  const href = decodeURIComponent(window.location.href);
  const pack = href.match(/#title=([^#]*)#episode=([^#]*)/);
  const title = pack[1];
  const episode = pack[2];
  const video = document.querySelector("#loading > div > video");

  const lastID = localStorage.getItem("lastID_m3u8");
  var lastRecordTime;
  if (lastID != id) {
    localStorage.setItem("lastID_m3u8", id);
    const spjx_settings = localStorage.getItem("spjx_settings");
    if (spjx_settings) {
      lastRecordTime = spjx_settings.match(/"1":(\d+)/)[1];
      const recordTime = parseInt(localStorage.getItem(id)) || 0
      const new_spjx_settings = spjx_settings.replace(/"1":\d+/, '"1":' + recordTime);
      localStorage.setItem("spjx_settings", new_spjx_settings);
      // 下面这行代码会在网页播放器加载spjx_settings之前执行，所以不执行也可以。
      video.currentTime = recordTime;
      if (lastRecordTime != "0") localStorage.setItem(lastID, lastRecordTime);
      else localStorage.removeItem(lastID);
    }
    else {
      console.alert("spjx_settings not found or invalid!");
    }
  }
  // 记录播放历史位置并设置过期
  const recorded = JSON.parse(localStorage.getItem("m3u8_recorded")) || {}
  const now = Date.now();
  // "expirationDate": now + 14 * 24 * 60 * 60 * 1000;
  recorded[id] = {
    "title": title,
    "episode": episode,
    "expirationDate": now + 1209600000
  };
  if (parseInt(lastRecordTime) || 0 < 10) delete recorded[lastID]
  Object.keys(recorded).forEach(key => {
    if (recorded[key].expirationDate > now) return
    localStorage.removeItem(key);
    delete recorded[key];
  })
  localStorage.setItem("m3u8_recorded", JSON.stringify(recorded));
}
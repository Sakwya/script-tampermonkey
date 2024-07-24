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
const now = Date.now();
(function () {
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

  const last_id = localStorage.getItem("last_id_vip");
  localStorage.setItem("last_id_vip", id)

  const data_records = JSON.parse(localStorage.getItem("data_records_vip")) || {}

  const pack = decodeURIComponent(window.location.href).match(/#title=([^#]*)#episode=([^#]*)/);
  const title = pack[1];
  const episode = pack[2];
  // const video = document.querySelector("#artplayer > div > video")

  /**
   *  artplayer本身存在读取历史的逻辑
   * 所以记录历史交给artplayer
   * 这里只实现进度的过期删除
  */
  // "expirationDate": now + 14 * 24 * 60 * 60 * 1000;
  data_records[id] = {
    "title": title,
    "episode": episode,
    "expirationDate": now + 1209600000,
  };
  // 获取播放时间：
  const artplayer_settings = JSON.parse(localStorage.getItem("artplayer_settings"));
  if (!!last_id &&!!artplayer_settings.times && (artplayer_settings.times[last_id] || 0) < 10) {
    localStorage.removeItem(last_id);
    delete data_records[last_id];
  }
  for (let key in data_records) {
    if (data_records[key].expirationDate > now) continue;
    localStorage.removeItem(key);
    delete data_records[key];
  }
  localStorage.setItem("data_records_vip", JSON.stringify(data_records));
}

function func_m3u8() {
  const id = Vurl_id;
  if (!id) {
    console.alert("Failed to get Vurl_id")
    return
  }

  const pack = decodeURIComponent(window.location.href).match(/#title=([^#]*)#episode=([^#]*)/);
  const title = pack[1];
  const episode = pack[2];

  // const video = document.querySelector("#loading > div > video");

  const last_id = localStorage.getItem("last_id_m3u8");
  if (last_id != id) {
    localStorage.setItem("last_id_m3u8", id);
    var spjx_settings;
    try {
      spjx_settings = JSON.parse(localStorage.getItem("spjx_settings")) || {};
    } catch (error) {
      console.alert("spjx_settings invalid!");
      return
    }
    if (spjx_settings["1"] > 10) localStorage.setItem(last_id, spjx_settings["1"]);
    else localStorage.removeItem(last_id);


    spjx_settings["1"] = parseInt(localStorage.getItem(id)) || 0
    localStorage.setItem("spjx_settings", spjx_settings);

    // 下面这行代码会在网页播放器加载spjx_settings之前执行，所以不执行也可以。
    // video.currentTime = recordTime;
  }

  // 记录播放历史位置并设置过期
  const data_records = JSON.parse(localStorage.getItem("data_records_m3u8")) || {}
  // "expirationDate": now + 14 * 24 * 60 * 60 * 1000;
  data_records[id] = {
    "title": title,
    "episode": episode,
    "expirationDate": now + 1209600000
  };
  for (let key in data_records) {
    if (data_records[key].expirationDate > now) continue;
    localStorage.removeItem(key);
    delete data_records[key];
  }
  localStorage.setItem("data_records_m3u8", JSON.stringify(data_records));

  window.addEventListener('beforeunload', () => {
    localStorage.setItem(id, JSON.parse(localStorage.getItem("spjx_settings"))["1"])
  })
}
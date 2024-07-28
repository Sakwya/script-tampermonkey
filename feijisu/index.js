// ==UserScript==
// @name         feijisu升级
// @namespace    http://tampermonkey.net/
// @version      2024-07-28
// @description  try to take over the world!
// @author       sakwya
// @match        http://feijisu35.com/*/*
// @match        https://test3.gqyy8.com:4438/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  const url = new URL(location.href);
  if (url.hostname == "test3.gqyy8.com") {
    return setup();
  }
  // 先判断要移除的广告元素是否已经加载完成
  let leftCnode = document.getElementById('HMhrefleft')
  if (!!leftCnode) {
    leftCnode.parentElement.remove()
    document.getElementById('HMhrefright').parentElement.remove()
    return
  }
  // 未加载完成则监听目标
  const Observer = {}
  const config = { attributes: false, childList: true, subtree: true };
  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type != 'childList') return;
      for (const node of mutation.addedNodes) {
        if (node.children.length === 0) continue;
        let cid = node.children[0].id;
        if (cid != 'HMhrefleft' && cid != 'HMhrefright') continue;
        node.remove();
        if (Observer.o) {
          Observer.observer.disconnect();
          console.log("监听器已移除。")
          return 
        } else {
          Observer.o = true
        }
      }
    }
  };

  const observer = new MutationObserver(callback);
  Observer.observer = observer;
  observer.observe(document, config);
})();

function setup() {
  const video = document.getElementsByTagName("video")[0];
  var focus = false;
  document.addEventListener('click', function (event) {
    // 获取鼠标点击的坐标位置
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // 获取目标元素的位置和尺寸信息
    const targetRect = video.getBoundingClientRect();
    const targetX = targetRect.left;
    const targetY = targetRect.top;
    const targetWidth = targetRect.width;
    const targetHeight = targetRect.height;

    // 检查鼠标点击的坐标是否在目标元素内部
    if (mouseX >= targetX && mouseX <= (targetX + targetWidth) &&
      mouseY >= targetY && mouseY <= (targetY + targetHeight)) {
      focus = true;
    } else {
      focus = false
    }
  })
  document.addEventListener("keydown", function (event) {
    if (!focus) {
      return
    }
    event.preventDefault()
    const key = event.key;
    var time = video.currentTime;
    var volume = video.volume;
    switch (key) {
      case "ArrowUp":
        volume += 0.1
        video.volume = (volume < 1) ? volume : 1;
        break
      case "ArrowDown":
        volume -= 0.1
        video.volume = (volume > 0) ? volume : 0;
        break
      case "ArrowLeft":
        time -= 5;
        video.currentTime = (time > 0) ? time : 0;
        break
      case "ArrowRight":
        var video_length = video.duration
        time += 5;
        video.currentTime = (time < video_length) ? time : video_length;
        break
      case "Space":
        if(video.paused)video.play();
        else video.pause();
        break
    }
  })
}
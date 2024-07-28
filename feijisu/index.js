// ==UserScript==
// @name         feijisu广告移除
// @namespace    http://tampermonkey.net/
// @version      2024-07-28
// @description  try to take over the world!
// @author       You
// @match        http://feijisu35.com/*/*
// @match        https://test3.gqyy8.com:4438/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feijisu35.com
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  const url = new URL(location.href);
  if (url.hostname == "test3.gqyy8.com") {
    return setup();
  }
  // 选择要监视的目标节点
  const targetNode = document;

  // 配置观察器的设置（需要观察哪些变动）
  const config = { attributes: false, childList: true, subtree: true };

  // 当节点发生变化时的回调函数
  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.children.length === 0) return
          let cid = node.children[0].id;
          if (cid === 'HMhrefleft' || cid === 'HMhrefright') {
            console.log(node)
            node.remove();
          }
        });
      }
    }
  };

  // 创建一个观察器实例并传入回调函数
  const observer = new MutationObserver(callback);

  // 通过调用 observe() 方法，开始观察目标节点
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
    }
  })
}
// ==UserScript==
// @name         PikPak分享占用空间查看
// @namespace    sakwya
// @version      2024-08-19
// @description  可以查看选中的文件占用的空间
// @author       sakwya
// @license      MIT
// @match        https://mypikpak.com/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mypikpak.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  const DEBUG = false;
  const debug = (ele, message = "") => {
    if (DEBUG) {
      console.log(ele);
      if (message !== "") console.log(message);
    }
  };

  let progress = 0;
  let totalRequests = 0;

  async function makeRequest(method, url) {
    try {
      totalRequests += 1;
      const response = await fetch(url, { method });
      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }
      const doc = await response.text();
      updateProgress();
      progress += 1;
      return doc;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  const sessionStorage = window.sessionStorage;
  const size_pattern = /([.\d]+)[\s]*([KMGT]?B)/i;

  const display_div = document.createElement("div");
  display_div.style.marginLeft = "auto";
  display_div.style.marginRight = "16px";
  display_div.innerText = "已选中: 0 B";
  document.getElementsByClassName("file-explorer")[0].firstChild.firstChild.firstChild.appendChild(display_div);

  const updateProgress = () => {

    display_div.innerText = `请求中: ${((progress/totalRequests)*100).toFixed(2)}% [${progress}/${totalRequests}]`;
  };
  const get_dir_size = async (url, display_div) => {
    let sum = 0.0;
    try {
      const response = await makeRequest("GET", url);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response, "text/html");
      const rows = Array.from(xmlDoc.getElementsByClassName("row"));

      const sizePromises = rows.map((row) => get_size(row, display_div));
      const sizes = await Promise.all(sizePromises);
      sum = sizes.reduce((acc, size) => acc + (size || 0), 0);
    } catch (e) {
      debug(e);
    }
    return sum;
  };

  const get_size = async (element) => {
    if (!(element instanceof Element)) {
      return debug(element, "传入类型错误");
    }
    const id = element.id;
    let size = sessionStorage.getItem(id);
    if (size != null) {
      return parseFloat(size);
    }

    const size_div = element.getElementsByClassName("size")[0];
    if (!size_div) {
      size = await get_dir_size(`${location.href}/${id}`);
      sessionStorage.setItem(id, size);
      return size;
    }

    const size_str = size_div.innerText;
    const temp = size_str.match(size_pattern);
    if (!temp || temp.length !== 3) {
      return debug(size_str, "size正则匹配失败");
    }

    size = parseFloat(temp[1]);
    const unit = temp[2].toUpperCase();
    const unitFactors = {
      B: 1,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
      TB: 1024 * 1024 * 1024 * 1024,
    };
    size *= unitFactors[unit] || 1;
    sessionStorage.setItem(id, size);
    return size;
  };

  const formatted_size = (size) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${Math.ceil(size * 10) / 10} ${units[i]}`;
  };

  let pikpak_processing = false;
  let pikpak_retry = false;
  const updateSelectedSize = async () => {
    if (pikpak_processing) {
      pikpak_retry = true;
      return;
    }
    pikpak_processing = true;
    display_div.innerText = `已选中: 处理中……`;

    let sum = 0.0;
    do {
      pikpak_retry = false;
      sum = 0.0;
      if (![...document.getElementsByClassName("file-explorer")[0].firstChild.firstChild.firstChild.children].includes(display_div)) {
        document.getElementsByClassName("file-explorer")[0].firstChild.firstChild.firstChild.appendChild(display_div);
      }

      const checked_rows = Array.from(
        document.getElementsByClassName("checked row")
      );

      const sizePromises = checked_rows.map((row) =>
        get_size(row)
      );
      const sizes = await Promise.all(sizePromises);
      sum = sizes.reduce((acc, size) => acc + (size || 0), 0);
    } while (pikpak_retry);
    progress = 0;
    totalRequests = 0;
    display_div.innerText = `已选中: ${formatted_size(sum)}`;
    pikpak_processing = false;
  }
  
  window.addEventListener("click",updateSelectedSize);
  window.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === 'a') {
      setTimeout(updateSelectedSize, 100); // 延迟执行，确保DOM元素选中状态更新完成
    }
  });
})();

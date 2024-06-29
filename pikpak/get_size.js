// ==UserScript==
// @name         PikPak分享占用空间查看
// @namespace    sakwya
// @version      2024-06-27
// @description  可以查看选中的文件占用的空间
// @author       sakwya
// @match        https://mypikpak.com/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mypikpak.com
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  const DEBUG = true;
  const debug = (ele, message = "") => {
    if (DEBUG) {
      console.log(ele);
      if (message !== "") console.log(message);
    }
  };

  function makeRequest(method, url) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.responseText);
          } else {
            reject(new Error('Request failed with status ' + xhr.status));
          }
        }
      };
      xhr.open(method, url, true);
      xhr.send();
    });
  }

  const sessionStorage = window.sessionStorage;
  const size_pattern = /([.\d]+)[\s]*([KMGT]?B)/i;

  const get_dir_size = async (url) => {
    let sum = 0.0;
    try {
      const response = await makeRequest("get", url);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response, 'text/html');
      window.xmlDoc = xmlDoc;
      const rows = xmlDoc.getElementsByClassName('row');

      for (let i = 0; i < rows.length; i++) {
        sum += await get_size(rows[i]) || 0;
      }
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
    if (size != null) return parseFloat(size);
    const size_div = element.getElementsByClassName("size");
    if (size_div.length === 0) {
      size = await get_dir_size(`${location.href}/${id}`);
      sessionStorage.setItem(id, size);
      return size;
    } else if (size_div.length > 1) {
      return debug(size_div, "类名为size的子元素数量多于1");
    }

    const size_str = size_div[0].innerText;
    const temp = size_str.match(size_pattern);
    if (!temp || temp.length !== 3) {
      return debug(size_str, "size正则匹配失败");
    }
    size = parseFloat(temp[1]);
    const unit = temp[2];
    const unitFactors = {
      "B": 1,
      "KB": 1024,
      "MB": 1024 * 1024,
      "GB": 1024 * 1024 * 1024,
      "TB": 1024 * 1024 * 1024 * 1024
    };
    const factor = unitFactors[unit.toUpperCase()] || 1;
    size *= factor;
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
    const formattedSize = Math.ceil(size * 10) / 10; // 向上取整
    const formattedUnit = units[i];
    return `${formattedSize} ${formattedUnit}`;
  };

  const display_div = document.createElement('div');
  display_div.style.marginLeft = 'auto';
  display_div.style.marginRight = '16px';
  display_div.innerText = '已选中: 0 B';
  document.getElementsByClassName("file-explorer")[0].firstChild.firstChild.firstChild.appendChild(display_div);

  let pikpak_processing = false;
  let pikpak_retry = false;
  window.addEventListener('click', async function () {
    if (pikpak_processing) {
      pikpak_retry = true;
      return;
    }
    pikpak_processing = true;
    display_div.innerText = `已选中: 处理中……`;
    var sum;
    do {
      pikpak_retry = false;
      sum = 0.0;
      if (![...document.getElementsByClassName("file-explorer")[0].firstChild.firstChild.firstChild.children].includes(display_div)) {
        document.getElementsByClassName("file-explorer")[0].firstChild.firstChild.firstChild.appendChild(display_div);
      }
      const checked_rows = document.getElementsByClassName("checked row");
      for (let i = 0; i < checked_rows.length; i++) {
        sum += await get_size(checked_rows[i]) || 0;
      }
    } while (pikpak_retry);

    display_div.innerText = `已选中: ${formatted_size(sum)}`;
    pikpak_processing = false;
  });
})();

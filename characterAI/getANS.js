// ==UserScript==
// @name         获取内容》
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Y2c
// @match        https://beta.character.ai/*
// ==/UserScript==

(function () {
    'use strict';
    //
    if (self == top) {
        let x = document.createElement("div")
        x.id = "sideB"
        x.style.height="4em"
        x.style.fontSize="1em"
        x.style.display="grid"
        x.style.position="fixed"
        x.style.top="30%"
        x.style.right="-0.5em"
        x.style.gridTemplateRows = "50% 50%"
        x.style.padding="0.5em"
        x.style.borderRadius="1em"
        x.style.border="1px solid white"
        x.style.justifyContent="space-between"
        let y = document.createElement("div")
        y.innerHTML="Accept"
        y.style.height="1em"
        y.style.lineHeight="1em"
        y.style.background="#afa"
        y.addEventListener("click",()=>{
            main();
        })
        let z = document.createElement("div")
        z.innerHTML="Rejuct"
        z.style.height="1em"
        z.style.lineHeight="1em"
        z.style.background="#faa"
        x.appendChild(y)
        x.appendChild(z)
        document.body.appendChild(x)
    }
    var main = () => {
        let x = document.createElement("div")
        x.id = "twoContainer"
        x.style.width = "100%"
        x.style.height = "100%"
        x.style.display = "grid"
        x.style.gridTemplateColumns = "60% 40%"
        document.body.appendChild(x)
        x.appendChild(document.getElementById("root"))
        var y = document.createElement("iframe")
        y.style.width = "100%"
        y.style.height = "100%"
        y.id = "sideframe"
        y.src = "child.html"
        x.appendChild(y)
    }
    const generater = () => {
        let x = document.createElement("div");
        x.style.height = "2em"
        x.style.borderRadius = "2em"
        x.style.position = "fixed"
        x.style.padding = "0em 1em"
        x.style.top = "15%"
        x.style.left = "5%"
        x.style.border = "solid"
        x.style.borderColor = "white"
        x.innerHTML = "Copy to Dialog"
        x.style.lineHeight = "2em"
        x.style.fontSize = "1em"
        x.style.background = "black"
        x.style.zIndex = "99"
        x.id = "getans"
        document.body.appendChild(x)
        x.addEventListener("click", function () {
            if (self == top) {
                document.getElementById("sideframe").contentDocument.querySelector("#user-input").value = document.querySelector("div.markdown-wrapper.markdown-wrapper-last-msg.swiper-no-swiping").children[0].children[0].innerHTML
            } else {
                parent.document.querySelector("#user-input").value = document.querySelector("div.markdown-wrapper.markdown-wrapper-last-msg.swiper-no-swiping").children[0].children[0].innerHTML
            }
        })
    }

    generater();


})();
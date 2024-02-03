code = """
// ==UserScript==
// @name         InterfaceSimplification for i.s.ecust.edu.cn
// @namespace    Sakwya
// @version      0.3
// @description  华理本研界面简化
// @author       Sakwya
// @match        https://i.s.ecust.edu.cn/*
// ==/UserScript==

(function () {
    {{main.js}}
    })();
"""
with open("./dev/main.js", "r", encoding="utf-8") as main_js:
    code = code.replace("{{main.js}}", main_js.read())

with open("./dev/main.css", "r", encoding="utf-8") as main_css:
    code = code.replace("{{main.css}}", main_css.read())

with open("./dev/script.js", "w+", encoding="utf-8") as script_js:
    script_js.write(code)

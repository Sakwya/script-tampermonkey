
// ==UserScript==
// @name         华东理工大学本研——自定义背景
// @namespace    Sakwya
// @version      0.2
// @description  去除多余的信息，同时可以自定义改变背景。课程折叠机的伴生品。
// @author       Sakwya
// @match        https://i.s.ecust.edu.cn/*
// ==/UserScript==

(function () {
    'use strict';
// 辅助函数
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}
function rgbToHex(rgb) {
    const toHex = (value) => {
        const hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    const r = toHex(rgb.r);
    const g = toHex(rgb.g);
    const b = toHex(rgb.b);
    return `#${r}${g}${b}`;
}
function rgbToHsl(rgb) {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0; // grayscale
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hslToRgb(hsl) {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}
function createWithClass(_class, tag = 'div') {
    const ele = document.createElement(tag);
    ele.className = _class;
    return ele;
}
function createWithId(id, tag = 'div') {
    const ele = document.createElement(tag);
    ele.id = id;
    return ele;
}

// 修改原始样式
const origin_link = document.querySelectorAll('.funclistul>li>a')
const new_links = createWithClass('links_table')
for (const link of origin_link) {
    const new_link = createWithClass('link', 'a');
    new_link.href = link.href;
    new_link.innerHTML = link.children[1].innerHTML
    new_links.appendChild(new_link)
}


var right_panel = document.body.querySelector('#frame_content')
while(document.body.firstChild){
    document.body.removeChild(document.body.firstChild)
}
document.body.appendChild(new_links)
document.body.appendChild(right_panel)

// 全局
const URL = window.URL || window.webkitURL || window.mozURL;
const CUSTOM_STYLE = []
var BG_IMG_URL = null
var NEW_BG_IMG_BLOB = null
const my_style = document.createElement('style')
// 加载主题色
const PRIMARY_COLOR = localStorage.getItem('PRIMARY_COLOR') || '#ffffff';
const hsl_temp = rgbToHsl(hexToRgb(PRIMARY_COLOR))
var temp = hsl_temp.l
hsl_temp.l = 90
const light_color = rgbToHex(hslToRgb(hsl_temp))
hsl_temp.l = 40
const deep_color = rgbToHex(hslToRgb(hsl_temp))
hsl_temp.l = 20
const dark_color = rgbToHex(hslToRgb(hsl_temp))
hsl_temp.l = temp;
hsl_temp.s = hsl_temp.s - 20
if (hsl_temp.s < 0) {
    hsl_temp.s = 0
    hsl_temp.l = hsl_temp.l - 20
    if (hsl_temp.l < 0) {
        hsl_temp.l = 0
    }
}
const plain_color = rgbToHex(hslToRgb(hsl_temp))

CUSTOM_STYLE.push(`:root{
    --light-color: ${light_color};
    --primary-color: ${PRIMARY_COLOR};
    --plain-color: ${plain_color};
    --deep-color: ${deep_color};
    --dark-color: ${dark_color}
}`)
// 加载背景
document.body.style.backgroundColor = PRIMARY_COLOR;
document.body.style.backgroundAttachment = 'fixed';
document.body.style.backgroundSize = 'cover';
const BG_IMG_BASE64 = localStorage.getItem('BG_IMG_BASE64');
if (BG_IMG_BASE64 != null) {
    const byteCharacters = window.atob(BG_IMG_BASE64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    BG_IMG_URL = URL.createObjectURL(blob)
    document.body.style.backgroundImage = `url(${BG_IMG_URL})`;
}
// 侧边栏
const config_table_board = createWithClass('config_table_board')
document.body.appendChild(config_table_board)
const config_table_switch = createWithClass('config_table_switch');
config_table_switch.innerText = 'Config Panel'
document.body.appendChild(config_table_switch)
const config_table = createWithClass('config_table close');
document.body.appendChild(config_table)
config_table.addEventListener('click', (event) => {
    event.stopPropagation();
})
function closeConfigTable() {
    console.log(1)
    config_table.classList.add('close')
    config_table_board.classList.remove('open')
    config_table_board.removeEventListener('click', closeConfigTable)
}
config_table_switch.addEventListener('click', (event) => {
    console.log(2)
    event.stopPropagation();
    config_table.classList.remove('close')
    config_table_board.classList.add('open')
    config_table_board.addEventListener('click', closeConfigTable)
})

const image_input = createWithId('image_input', 'input');
image_input.type = 'file';
image_input.accept = 'image/*';
image_input.style.display = 'none';

const image_input_button = createWithClass('config_table_button', 'label');
image_input_button.htmlFor = 'image_input';
image_input_button.innerHTML = 'Upload Img'
config_table.appendChild(image_input)
config_table.appendChild(image_input_button)

const set_bg_button = createWithClass('config_table_button');
set_bg_button.innerHTML = 'Save As Bg'
config_table.appendChild(set_bg_button)

const reset_bg_button = createWithClass('config_table_button');
reset_bg_button.innerHTML = 'Reset Bg'
config_table.appendChild(reset_bg_button)

const remove_bg_button = createWithClass('config_table_button');
remove_bg_button.innerHTML = 'ReMove Bg'
config_table.appendChild(remove_bg_button)

const set_color_button = createWithClass('config_table_button');
set_color_button.innerHTML = `Color: ${PRIMARY_COLOR}`
config_table.appendChild(set_color_button)

// 设置背景图片
image_input.addEventListener('change', () => {
    const fileObj = image_input.files[0];
    var fileUrl = URL.createObjectURL(fileObj);
    var quality = parseFloat(window.prompt(
        'Please enter the saving quality for the image. \n(The maximum allowed file storage size is 4mb)',
        '0.85'
    ))
    while (isNaN(quality) || quality <= 0 || quality > 1) {
        alert('Please enter a number between 0 and 1');
        quality = parseFloat(window.prompt(
            'Please enter the saving quality for the image. \n(The maximum allowed file storage size is 4mb)',
            '0.85'
        ))
    }
    const image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = fileUrl;
    image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
        canvas.toBlob(function (dataBlob) {
            const dataSize = dataBlob.size / 1048576
            if (dataSize > 4) {
                alert(`The file is too large, ${dataSize}MB/4MB. `)
                return
            }
            const dataUrl = URL.createObjectURL(dataBlob)
            document.body.style.backgroundImage = 'url(' + dataUrl + ')';
            NEW_BG_IMG_BLOB = dataBlob;

            const fileReader = new FileReader()
            fileReader.onload = (e) => {
                console.log(e.target.result)
            }
            // readAsDataURL
            fileReader.readAsDataURL(dataBlob)

        }, 'image/jpeg', quality);
    }
})
// 存储背景图片
set_bg_button.addEventListener('click', () => {
    if (!NEW_BG_IMG_BLOB) {
        return
    } else {
        const dataBlob = NEW_BG_IMG_BLOB;
        NEW_BG_IMG_BLOB = null
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            localStorage.setItem('BG_IMG_BASE64', e.target.result)
            alert('Save Successfully.')
        }
        fileReader.readAsDataURL(dataBlob)
    }
})
// 重设背景图片
reset_bg_button.addEventListener('click', () => {
    document.body.style.backgroundImage = 'url(' + BG_IMG_URL + ')';
})
// 清除背景图片
remove_bg_button.addEventListener('click', () => {
    BG_IMG_URL = null
    document.body.style.backgroundImage = ''
    localStorage.removeItem('BG_IMG_BASE64')
})
// 设置主题色
set_color_button.addEventListener('click', () => {
    const origin_color = localStorage.getItem('PRIMARY_COLOR')
    var new_primary_color = window.prompt('Please Enter New Primary Color:', origin_color || '#ffffff');
    if (!new_primary_color) return;
    new_primary_color = new_primary_color.replace(/^#/, '')
    while (!new_primary_color.match(/^[0-9a-fA-F]{6}$/)) {
        alert('Please Enter Correct Value.');
        new_primary_color = window.prompt('Please Enter New Primary Color:', origin_color || '#ffffff');
        if (!new_primary_color) return;
        new_primary_color = new_primary_color.replace(/^#/, '')
    }
    let hsl_temp = rgbToHsl(hexToRgb(new_primary_color))
    temp = hsl_temp.l
    hsl_temp.l = 90
    const light_color = rgbToHex(hslToRgb(hsl_temp))
    hsl_temp.l = 40
    const deep_color = rgbToHex(hslToRgb(hsl_temp))
    hsl_temp.l = 20
    const dark_color = rgbToHex(hslToRgb(hsl_temp))
    hsl_temp.l = temp;
    hsl_temp.s = hsl_temp.s - 20
    if (hsl_temp.s < 0) {
        hsl_temp.s = 0
        hsl_temp.l = hsl_temp.l - 20
        if (hsl_temp.l < 0) {
            hsl_temp.l = 0
        }
    }
    const plain_color = rgbToHex(hslToRgb(hsl_temp))
    CUSTOM_STYLE[0] = `:root{
    --light-color: ${light_color};
    --primary-color: #${new_primary_color};
    --plain-color: ${plain_color};
    --deep-color: ${deep_color};
    --dark-color: ${dark_color}
}`
    document.body.style.backgroundColor = `#${new_primary_color}`
    my_style.innerHTML = CUSTOM_STYLE.join('\n')
    setTimeout(() => {
        const userConfirmed = window.confirm('Are you to continue?');
        if (userConfirmed) {
            set_bg_button.innerHTML = `Color: #${new_primary_color}`
            localStorage.setItem('PRIMARY_COLOR', `#${new_primary_color}`)
        } else {
            let hsl_temp = rgbToHsl(hexToRgb(origin_color))
            temp = hsl_temp.l
            hsl_temp.l = 90
            const light_color = rgbToHex(hslToRgb(hsl_temp))
            hsl_temp.l = 40
            const deep_color = rgbToHex(hslToRgb(hsl_temp))
            hsl_temp.l = 20
            const dark_color = rgbToHex(hslToRgb(hsl_temp))
            hsl_temp.l = temp;
            hsl_temp.s = hsl_temp.s - 20
            if (hsl_temp.s < 0) {
                hsl_temp.s = 0
                hsl_temp.l = hsl_temp.l - 20
                if (hsl_temp.l < 0) {
                    hsl_temp.l = 0
                }
            }
            const plain_color = rgbToHex(hslToRgb(hsl_temp))
            CUSTOM_STYLE[0] = `:root{
        --light-color: ${light_color};
        --primary-color: ${origin_color};
        --plain-color: ${plain_color};
        --deep-color: ${deep_color};
        --dark-color: ${dark_color}
    }`
        }
        my_style.innerHTML = CUSTOM_STYLE.join('\n')
        document.body.style.backgroundColor = `${origin_color}`
    }, 100)

})

// 设置样式
CUSTOM_STYLE.push(`.config_table_board {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: none;
    z-index: 10;
}
.config_table_board.open{
    display: block;
}
.config_table_switch {
    position: fixed;
    height: 2rem;
    top: calc(50vh - 5rem);
    font-size: 1rem;
    padding: 0 0.5rem;
    font-variant: small-caps;
    font-weight: bolder;
    line-height: 2rem;
    left: 0;
    background-color: var(--deep-color);
    color: var(--light-color);
    transform: translateX(calc(0.5rem - 100%));
    transition: transform 300ms, opacity 300ms linear, background-color 300ms linear;
    border-radius: 0 0.5rem 0.5rem 0;
    cursor: pointer;
}

.config_table_switch:hover {
    transform: translateX(0);
    background-color: var(--dark-color);
    opacity: 1;
}

.config_table {
    position: fixed;
    width: 8rem;
    height: 10.5rem;
    top: calc(50vh - 5rem);
    padding: 0.5rem 0;
    overflow: hidden;
    box-sizing: border-box;
    font-variant: small-caps;
    font-weight: bolder;
    font-size: 0.85rem;
    background-color: #000a;
    border-radius: 0 0.5rem 0.5rem 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    transition: transform 500ms;
    z-index: 11;
}

.config_table.close {
    transform: translateX(-100%);

}

.config_table_button {
    display: block;
    border-radius: 0.25rem;
    background-color: var(--plain-color);
    box-sizing: border-box;
    padding: 0 0.5rem;
    color: var(--light-color);
    text-align: center;
    height: 1.5rem;
    line-height: 1.5rem;
    transition: background-color 300ms linear, box-shadow 300ms linear, margin-left 300ms;
    cursor: pointer;
}

.config_table_button:hover {
    margin-left: 0.5rem;
    background-color: var(--primary-color);
    box-shadow: 0 0 0.5rem var(--deep-color);
}

.config_table_button+.config_table_button {
    margin-top: 0.5rem;
}

.links_table {
    display: flex;
    border-radius:0 0 0.5rem  0.5rem;
    flex-direction: column;
    position: fixed;
    padding: 0.5rem;
    box-sizing: border-box;
    font-variant: small-caps;
    font-weight: bolder;
    top: 0;
    left: 1rem;
    z-index: 9;
    transform: translateY(calc(-100% + 0.5rem));
    transition: transform 500ms, opacity 300ms linear, background-color 300ms linear;
    background-color: var(--deep-color);
}

.links_table:hover {
    transform: translateY(0);
}

.link {
    display: block;
    border-radius: 0.25rem;
    background-color: var(--plain-color);
    box-sizing: border-box;
    padding: 0 1rem;
    color: var(--light-color);
    text-align: center;
    height: 1.5rem;
    line-height: 1.5rem;
    transition: background-color 300ms linear, box-shadow 300ms linear, margin-left 300ms;
    cursor: pointer;
}
.link:hover {
    background-color: var(--primary-color);
    box-shadow: 0 0 0.5rem var(--deep-color);
}
.link+.link {
    margin-top: 0.5rem;
}`)
my_style.innerHTML = CUSTOM_STYLE.join('\n')
document.head.append(my_style)
    })();

// ==UserScript==
// @name         咕咕镇剩余价值收割机remake
// @namespace    https://github.com/GuguTown/GuguTownBattleLogs
// @version      0.6.0-alpha.3
// @description  斗争者的小助手 此为基于npm+rollup的重构的版本
// @author       ikarosf w2040w
// @match        https://www.guguzhen.com/fyg_pk.php
// @match        https://www.momozhen.com/fyg_pk.php
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js
// @require      https://unpkg.com/dexie@latest/dist/dexie.js
// @require      https://unpkg.com/dexie-export-import@latest/dist/dexie-export-import.js
// @require      https://greasyfork.org/scripts/409864-url-gbk-%E7%BC%96%E7%A0%81%E8%A7%A3%E7%A0%81%E5%BA%93/code/URL%20GBK%20%E7%BC%96%E7%A0%81%E8%A7%A3%E7%A0%81%E5%BA%93.js?version=840815
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.16.0/js/md5.min.js
// @resource     dateTimecss https://gitee.com/ikarosf/calendarjs/raw/master/calendar.css
// @connect      fygal.com
// @connect      bakabbs.com
// @connect      9dkf.com
// @connect      365gal.com
// @connect      365galgame.com
// @connect      kfmax.com
// @connect      9shenmi.com
// @connect      kfpromax.com
// @connect      miaola.work
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_listValues
// @downloadURL  https://github.com/w2040w/GuguTownBattleLogs/releases/download/fee/GuguTownBattleLogs.remake.dev.user.js
// @updateURL    https://github.com/w2040w/GuguTownBattleLogs/releases/download/fee/GuguTownBattleLogs.remake.dev.user.js
//
// ==/UserScript==

(function () {
    'use strict';


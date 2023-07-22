import {db, progresschange, setRefreshCountdownTime, refreshCountdownTime} from './global';
import {banbattletypefunc} from './panelFunc';
import {getLocDate} from './dateUtil';
import {refreshMaxtime} from './config';
import {saveBattle} from './pktextResolve';
import {get_user_theard, FM_setValue, BattleLog} from './getUser';
import {initgoxpanel} from './makePanel';
import './unchange/dateTimeWrap-confused';

/* global Dexie *//* Global md5 */
async function fyg_pk_html() {
    'use strict';
    console.log('fyg_pk_html init');

    let goxing = false;
    let ctx = document.createElement('battleCountChart');
    await transToDbdata();

    setRefreshCountdownTime(refreshMaxtime);
    let mydivision = '';
    let myrank = -100;
    let mydogtag = -100;
    let changeLog = [];
    unsafeWindow.changeLog = changeLog;

    //----------------------------------------------------------------------------------
    let read_rank_rightnow_flag = true;

    async function read_rank(){//主循环
        if(refreshMaxtime <= 0){
            $('#goxtiptext').text('无刷新');
            return;
        }
        if(!read_rank_rightnow_flag && setRefreshCountdownTime(refreshCountdownTime-1)>0){
            $('#goxtiptext').text('刷新进度倒计时 '+refreshCountdownTime);
        }else{
            $('#goxtiptext').text('刷新进度倒计时 '+0);
            setRefreshCountdownTime(refreshMaxtime);
            if(goxing) return;
            goxing = true;
            read_rank_rightnow_flag = false;

            try {
                let postRequestReturn = await postRequest();
                if(!postRequestReturn){
                    goxing = false;
                    return;
                }
                //todo

            }catch(err) {
                console.log(typeof(err));
            }
            progresschange.innerText = getChangeLogText();
            goxing = false;
        }
    }

    let refreshNum = 0;
    function postRequest(){ //获取段位进度、体力
        return new Promise((resolve, reject)=>{
            setTimeout(resolve, 10*1000,false);
            GM_xmlhttpRequest({
                method: 'POST',
                url: unsafeWindow.location.origin + '/fyg_read.php',
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                data: 'f=12',
                onload: response => {
                    //throw "throw error";
                    refreshNum++;
                    let responseDiv = $(response.responseText);
                    let newdivision = responseDiv.find('.fyg_colpz05').text(); //段位SSS
                    let newrank = parseInt(responseDiv.find('.fyg_colpz02').text()); //int
                    let alldogtagstr = responseDiv.find('.fyg_colpz03').text();
                    let dogtaglist = alldogtagstr.match(/(\d+) \/ (\d+)/);
                    let newdogtag = parseInt(dogtaglist[1]); //int
                    let changeFlag = false;
                    if(mydivision == ''){
                        mydivision = newdivision;
                    }else if(newdivision != mydivision){
                        document.getElementsByClassName('fyg_colpz05')[0].innerText = newdivision;
                        changeFlag = true;
                    }
                    if(myrank == -100){
                        myrank = newrank;
                    } else if(newrank != myrank){
                        document.getElementsByClassName('fyg_colpz02')[0].innerText = newrank + '%';
                        changeFlag = true;
                    }
                    if(mydogtag == -100){
                        mydogtag = newdogtag;
                    } else if(newdogtag != mydogtag){
                        document.getElementsByClassName('fyg_colpz03')[0].innerText = alldogtagstr + '';
                        mydogtag = newdogtag;
                    }

                    if(changeFlag){
                        appendChangeLogText('[{0} {1}%]->[{2} {3}%]'.format(mydivision,myrank,newdivision,newrank));
                        mydivision = newdivision;
                        myrank = newrank;
                    }

                    resolve(true);
                },
                onerror:function(err){
                    resolve(false);
                },
                ontimeout : function(){
                    resolve(false);
                }
            });
        }); //Promise end
    }
    function appendChangeLogText(text){
        changeLog.push(getNowtime() + ' ' + text);
        progresschange.innerText = getChangeLogText();
    }
    function getNowtime(){
        let date=getLocDate();
        let datetext = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        return datetext;
    }

    function getChangeLogText(){
        let LogText = '';
        LogText += '刷新次数: ' +refreshNum + '\n';
        if(changeLog.length == 0){
            LogText += '未出现进度变动';
        } else{
            for(let i = 0;i<changeLog.length;i++){
                LogText += changeLog[i] + '\n';
            }
        }
        return LogText;
    }

    function mypklist(){
        $.ajax({
            type: 'POST',
            url: 'fyg_read.php',
            data: 'f=12',
            success: function(msg){
                $('#pklist').html(msg);
                $('[data-toggle="tooltip"]').tooltip();
                banbattletypefunc();
            }
        });
    }

    let mycssinner = function () {        /*    #chartParent{    width:100%;max-width:1200px;    height:80%;        position:fixed;    margin:auto;    left:0;    right:0;    top:0;    bottom:0;    display:none;        z-index:1000;    }    .tc_xs{    overflow-x:hidden;    width:100%;    max-width:1200px;    height:80%;    //line-height:3rem;    background:#fff;    position:fixed;    margin:auto;    left:0;    right:0;    top:0;    bottom:0;    color:#666;    border-radius:4px;    display:none;    z-index:1000;    }    #mask{        display:none;        width:100%;        height:300%;        position:absolute;        top:0;        left:0;        z-index:2;        background-color:#000;        opacity:0.3;        }    #goxpanel{    width:20%;    height:60%;    min-width:280px;    line-height:3rem;    background:#ddf3f5;    position:fixed;    //left:10%;    //margin-left:-15%;    top:15%;    text-align:center;    color:#fff;    border-radius:4px;        }    #goxpanelExtend{    width:20%;    height:21%;    min-width:280px;    line-height:3rem;    background:#ddf3f5;    position:fixed;    //left:10%;    //margin-left:-15%;    top:75%;    text-align:center;    color:#000;    border-radius:4px;    display:none;        }    .goxtip{        width:100%;        background-color: #3280fc;        padding: 2px 10px;        text-align: left;        display: flex;        justify-content: space-between;    }    #goxtip2{    background-color: #3280aa;    }    .goxtip button,input,select,textarea {    font-family: inherit;    font-size: inherit;    line-height:normal;    }    .goxtipbottom{        position:absolute;        bottom:10px;    }    .detaillogitem>div>h3>span{    white-space: nowrap;    overflow: hidden;    text-overflow: ellipsis;    display: inline-block;    text-align: left;    }    #goxtipinfo{        color:#000;        text-align: left;        height: 90%;    }    .btn-details{        width:30%    }    #goxpanel a{    color:#FFF;    }    .battlelose>.nameandlevel {    background-color:#ddf3f5  !important;    }    .battletie>.nameandlevel {    background-color: #dbe5d9	 !important;    }    .nameandlevel{    cursor:pointer;    height:30px;    margin:auto;    color: #03a2b6;    text-align: center;    background-color:#ffe5e0;    }    .nameandlevel>h3{    margin-top:5px;    line-height: 200%;    }    #smallbar {    position: absolute;    right: 0px;    height: 100%;    width: 10px;    text-align: center;    display: flex;    align-items:center;    color: black;    cursor:pointer;    }    #extendbar {    position: absolute;    bottom: 0px;    height: 10px;    width: 100%;    line-height: 100%;    color: black;    cursor:pointer;    }        */    };
    function mycss(){
        GM_addStyle(mycssinner.getMultilines());
    }

    let observerBody1 = new MutationObserver(saveBattle);

    function init_table(){
        let table_html = '<canvas id="battleCountChart"></canvas>';
        let obj = document.createElement('div');
        obj.innerHTML = table_html;
        obj.setAttribute('id','chartParent');
        $('body')[0].appendChild(obj);
        chartssize(obj,ctx);
    }
    //参数container为图表盒子节点.charts为图表节点
    function chartssize (container,charts) {
        function getStyle(el, name) {
            if (window.getComputedStyle) {
                return window.getComputedStyle(el, null);
            } else {
                return el.currentStyle;
            }
        }
        let wi = getStyle(container, 'width').width;
        let hi = getStyle(container, 'height').height;
        charts.style.width = wi;
        charts.style.height = hi;
    }

    async function transToDbdata(){
        for (let i in BattleLog){
            if(i != 'enemylevel'){
                delete BattleLog[i];
            }
        }
        FM_setValue('BattleLog',BattleLog);

        let flag = await Dexie.exists('ggzharvester');
        if(flag){
            alert('即将开始将战斗记录数据格式更新至新版本\n可能会花费一点时间，请稍等且不要关闭网页');
            let dbold = new Dexie('ggzharvester');
            dbold.version(1).stores({
                battleLog: '++id,time,username'
            });
            await dbold.battleLog
                .each(async logline => {
                    await logupdateraw(logline.log,logline.isWin,logline.enemyname,logline.char,logline.charlevel,logline.time,logline.username);
                });
            await dbold.delete();
            alert('数据更新完毕！');
        }
    }
    async function logupdateraw(etext,isbattlewin,enemyname,enemychar,enemycharlv,now,username){
        let thisid = md5(etext);
        await db.battleLog.add({id:thisid,username:username,log:etext, isWin:isbattlewin,enemyname:enemyname,char:enemychar,charlevel:enemycharlv,time:now});
    }

    //——————————————————mainfun————————————
    unsafeWindow.get_user_theard = get_user_theard;
    unsafeWindow.pklist = mypklist;
    setTimeout(banbattletypefunc,'1000');
    read_rank();
    setInterval(read_rank,'1000');
    observerBody1.observe(document.querySelector('#pk_text'), {characterData: true,childList: true});
    mycss();
    await initgoxpanel();
    init_table();

    //autodeletelog(30);
}

Function.prototype.getMultilines = function () {
    let lines = new String(this);
    lines = lines.substring(lines.indexOf('/*') + 2,lines.lastIndexOf('*/'));
    return lines;
};
String.format = function(src){
    if (arguments.length == 0) return null;
    let args = Array.prototype.slice.call(arguments, 1);
    return src.replace(/\{(\d+)\}/g, function(m, i){
        return args[i];
    });
};

String.prototype.gblen = function() {
    let len = 0;
    for (let i=0; i<this.length; i++) {
        if (this.charCodeAt(i)>127 || this.charCodeAt(i)==94) {
            len += 2;
        } else {
            len ++;
        }
    }
    return len;
};

let gslientaudio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3LjcxLjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAEAAABVgANTU1NTU1Q0NDQ0NDUFBQUFBQXl5eXl5ea2tra2tra3l5eXl5eYaGhoaGhpSUlJSUlKGhoaGhoaGvr6+vr6+8vLy8vLzKysrKysrX19fX19fX5eXl5eXl8vLy8vLy////////AAAAAExhdmM1Ny44OQAAAAAAAAAAAAAAACQCgAAAAAAAAAVY82AhbwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAALACwAAP/AADwQKVE9YWDGPkQWpT66yk4+zIiYPoTUaT3tnU487uNhOvEmQDaCm1Yz1c6DPjbs6zdZVBk0pdGpMzxF/+MYxA8L0DU0AP+0ANkwmYaAMkOKDDjmYoMtwNMyDxMzDHE/MEsLow9AtDnBlQgDhTx+Eye0GgMHoCyDC8gUswJcMVMABBGj/+MYxBoK4DVpQP8iAtVmDk7LPgi8wvDzI4/MWAwK1T7rxOQwtsItMMQBazAowc4wZMC5MF4AeQAGDpruNuMEzyfjLBJhACU+/+MYxCkJ4DVcAP8MAO9J9THVg6oxRMGNMIqCCTAEwzwwBkINOPAs/iwjgBnMepYyId0PhWo+80PXMVsBFzD/AiwwfcKGMEJB/+MYxDwKKDVkAP8eAF8wMwIxMlpU/OaDPLpNKkEw4dRoBh6qP2FC8jCJQFcweQIPMHOBtTBoAVcwOoCNMYDI0u0Dd8ANTIsy/+MYxE4KUDVsAP8eAFBVpgVVPjdGeTEWQr0wdcDtMCeBgDBkgRgwFYB7Pv/zqx0yQQMCCgKNgonHKj6RRVkxM0GwML0AhDAN/+MYxF8KCDVwAP8MAIHZMDDA3DArAQo3K+TF5WOBDQw0lgcKQUJxhT5sxRcwQQI+EIPWMA7AVBoTABgTgzfBN+ajn3c0lZMe/+MYxHEJyDV0AP7MAA4eEwsqP/PDmzC/gNcwXUGaMBVBIwMEsmB6gaxhVuGkpoqMZMQjooTBwM0+S8FTMC0BcjBTgPwwOQDm/+MYxIQKKDV4AP8WADAzAKQwI4CGPhWOEwCFAiBAYQnQMT+uwXUeGzjBWQVkwTcENMBzA2zAGgFEJfSPkPSZzPXgqFy2h0xB/+MYxJYJCDV8AP7WAE0+7kK7MQrATDAvQRIwOADKMBuA9TAYQNM3AiOSPjGxowgHMKFGcBNMQU1FMy45OS41VVU/31eYM4sK/+MYxKwJaDV8AP7SAI4y1Yq0MmOIADGwBZwwlgIJMztCM0qU5TQPG/MSkn8yEROzCdAxECVMQU1FMy45OS41VTe7Ohk+Pqcx/+MYxMEJMDWAAP6MADVLDFUx+4J6Mq7NsjN2zXo8V5fjVJCXNOhwM0vTCDAxFpMYYQU+RlVMQU1FMy45OS41VVVVVVVVVVVV/+MYxNcJADWAAP7EAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxOsJwDWEAP7SAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxPMLoDV8AP+eAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxPQL0DVcAP+0AFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
gslientaudio.loop = true;
gslientaudio.play();
//gslientaudio.pause();
//gslientaudio.remove();
//——————————————————mainfun————————————
let dateTimecss = GM_getResourceText('dateTimecss');
GM_addStyle(dateTimecss);

//if(/guguzhen.com\/fyg_pk.php/.test(rl)){
fyg_pk_html();
//}


unsafeWindow.GM_getValue = GM_getValue;
unsafeWindow.FM_setValue = FM_setValue;
unsafeWindow.GM_listValues = GM_listValues;
unsafeWindow.getLocDate = getLocDate;

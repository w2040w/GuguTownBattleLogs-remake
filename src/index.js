import {read_rank} from './refresh';
import {banbattletypefunc} from './panelFunc';
import {getLocDate} from './dateUtil';
import {saveBattle} from './pktextResolve';
import {get_user_theard, FM_setValue} from './getUserSM';
import {initgoxpanel} from './makePanel';
import {transToDbdata} from './preoutdated/updateOldDb';
import './confused/dateTimeWrap';

async function fyg_pk_html() {
    'use strict';
    console.log('fyg_pk_html init');

    await transToDbdata();

    //----------------------------------------------------------------------------------


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
    Function.prototype.getMultilines = function () {
        let lines = new String(this);
        lines = lines.substring(lines.indexOf('/*') + 2,lines.lastIndexOf('*/'));
        return lines;
    };

    let observerBody1 = new MutationObserver(saveBattle);

    let ctx = document.createElement('battleCountChart');
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

String.format = function(src){
    if (arguments.length == 0) return null;
    let args = Array.prototype.slice.call(arguments, 1);
    return src.replace(/\{(\d+)\}/g, function(m, i){
        return args[i];
    });
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

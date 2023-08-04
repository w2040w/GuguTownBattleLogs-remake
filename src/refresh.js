export {progresschange, refreshCountdownTime, read_rank};
export {setRefreshCountdownTime};
import {config} from './config';
import {postHistory} from './defense';
import {getLocDate} from './dateUtil';

let refreshCountdownTime = 0;
refreshCountdownTime = config.refreshMaxtime;
function setRefreshCountdownTime(newtime){
    refreshCountdownTime = newtime;
    return refreshCountdownTime;
}

let progresschange = document.createElement('div');  //显示log
progresschange.setAttribute('id','progresschange');
progresschange.setAttribute('class','panel-body');

let changeLog = [];
unsafeWindow.changeLog = changeLog;
let read_rank_rightnow_flag = true;
let goxing = false;
async function read_rank(){//主循环
    if(config.refreshMaxtime <= 0){
        $('#goxtiptext').text('无刷新');
        return;
    }
    if(!read_rank_rightnow_flag && refreshCountdownTime-->0){
        $('#goxtiptext').text('刷新进度倒计时 '+refreshCountdownTime);
    } else {
        $('#goxtiptext').text('刷新进度倒计时 '+0);
        setRefreshCountdownTime(config.refreshMaxtime);
        if(goxing) return;
        goxing = true;
        read_rank_rightnow_flag = false;

        try {
            let postRequestReturn = await postRequest();
            await postHistory();
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
let mydivision = '';
let myrank = -100;
let mydogtag = -100;
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
    changeLog.push(getNowtime(getLocDate()) + ' ' + text);
    progresschange.innerText = getChangeLogText();
}
function getNowtime(date){
    let datetext = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    return datetext;
}

function getChangeLogText(){
    let LogText = '';
    LogText += '刷新次数: ' +refreshNum + '\n';
    if(changeLog.length == 0){
        LogText += '未出现进度变动';
    } else {
        for(let i = 0;i<changeLog.length;i++){
            LogText += changeLog[i] + '\n';
        }
    }
    return LogText;
}

export let infunc;
if (process.env.NODE_ENV === 'test') {
    infunc = {getNowtime, appendChangeLogText, getChangeLogText};
}

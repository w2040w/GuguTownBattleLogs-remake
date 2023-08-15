export {postHistory};
import {getArmor, getWeapon} from './namemap/oriToDb';
import {defenseUpdate, queryDuring} from './db';
import {getLocDate, daymill} from './dateUtil';
import {config} from './config';

function postHistory(){
    if(config.logDefense === false){
        return false;
    }
    return new Promise((resolve, reject)=>{
        setTimeout(resolve, 10*1000,false);
        GM_xmlhttpRequest({
            method: 'POST',
            url: unsafeWindow.location.origin + '/fyg_read.php',
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            data: 'f=25',
            onload: response => {
                let battles = $(response.response).filter('.row');
                unsafeWindow.battles = battles;
                defenseResolve(battles);
                resolve(true);
            },
            onerror:function(err){
                resolve(false);
            },
            ontimeout : function(){
                resolve(false);
            }
        });
    });
}
unsafeWindow.postHistory = postHistory;

async function defenseResolve(battles){
    const localKey = 'lastQuery_Battlelog';
    let defenses = battles.filter(':contains("守")');
    let len = defenses.length;
    let queryTime = getLocDate();
    let lastQueryRaw = localStorage.getItem(localKey);
    if(typeof lastQueryRaw !== 'string'){
        listResolve({}, battles, await createAttkCheck());
    } else {
        let lastQuery = JSON.parse(lastQueryRaw);
        lastQuery.queryTime = new Date(lastQuery.queryTime);
        lastQuery.recordTime = new Date(lastQuery.recordTime);
        const recordTime = lastQuery.recordTime;
        const lastRecordHour = recordTime.getHours();
        if(lastRecordHour === queryTime.getHours() && is23Hour(lastQuery.queryTime, queryTime)){
            console.log('unsafeQuery');
        } else {
            if(is23Hour(recordTime, queryTime)){
                lastQuery.order = -1;
            }
            if(queryTime - recordTime < daymill){
                let forcheck = (i, checkFunc) => {
                    for(; i >= 0; i--){
                        let row = defenses[i];
                        let timeinfo = getTimeinfo(row);
                        if(checkFunc(timeinfo, recordTime)){
                            break;
                        }
                    }
                    return i;
                };
                let i = len-1;
                i = forcheck(i, isEqualTimeinfoDate);
                if(lastQuery.order === -1){
                    i = forcheck(i, (timeinfo, recordTime) => !isEqualTimeinfoDate(timeinfo, recordTime));
                }
                if(lastQuery.order === -1){
                    defenses.length = i + 1;
                } else {
                    defenses.length = i - lastQuery.order + 1;
                }
            }
            listResolve(lastQuery, defenses, () => false);
        }
    }

    async function listResolve(lastQuery, battles, checkAttk){
        let lastTime = getLocDate();
        let newLastQuery = {queryTime};
        let order = 0;
        let changeDay = false;
        let len = battles.length;
        let errlog;
        for(let i = 0; i < len; i++){
            let div = battles[i];
            let battleLog = rowResolve(div);
            let timeinfo = getTimeinfo(div);
            let hour = timeinfo[1];
            let type = div.getElementsByClassName('col-md-1')[0].innerText;
            if(type === '攻'){
                let result = checkAttk(battleLog);
                if(result !== false){
                    if(lastTime.getHours() !== result.getHours()){
                        updateOrder();
                    }
                    lastTime = result;
                }
                continue;
            }

            if(timeinfo[0] === '今天' && hour === lastTime.getHours()){
                lastTime = new Date(lastTime - 1000);
            } else {
                if(!changeDay && timeinfo[0] === '昨天' && hour !== '23'){
                    lastTime = new Date(lastTime - daymill);
                    changeDay = true;
                }
                if(hour !== lastTime.getHours()){
                    lastTime.setHours(hour+1, 0, 0, 0);
                    updateOrder();
                    order = 0;
                }
                lastTime = new Date(lastTime - 1000);
            }

            order++;
            try{
                await defenseUpdate(lastTime, battleLog);
            } catch(err){
                console.error(err);
                if(typeof errlog !== 'object'){
                    errlog = {lastTime, queryTime, order, 'enemy':battleLog.enemyname, lastQuery, err};
                    localStorage.setItem('errlog_Battlelog', JSON.stringify(errlog));
                }
            }
            if(!(newLastQuery.recordTime instanceof Date)){
                newLastQuery.recordTime = new Date(lastTime);
            }
        }

        updateOrder();
        if(newLastQuery.recordTime instanceof Date){
            console.log(queryTime);
            localStorage.setItem(localKey, JSON.stringify(newLastQuery));
        } else {
            lastQuery.queryTime = queryTime;
            localStorage.setItem(localKey, JSON.stringify(lastQuery));
        }

        function updateOrder(){
            if(typeof newLastQuery.order !== 'number' && order !== 0){
                newLastQuery.order = order;
                let recordTime = lastQuery.recordTime;
                let newRecordTime = newLastQuery.recordTime;
                if(recordTime instanceof Date && recordTime.getDate() === newRecordTime.getDate() && recordTime.getHours() === newRecordTime.getHours()){
                    newLastQuery.order += lastQuery.order;
                }
                localStorage.setItem(localKey, JSON.stringify(newLastQuery));
            }
        }
    }

    async function createAttkCheck(){
        let attacks = await queryDuring(1);
        let attLen = attacks.length;
        let atti = attLen - 1;
        return (battleLog) => {
            if(atti >= 0 && battleLog.enemyname === attacks[atti].enemyname){
                let newDate = new Date(attacks[atti].time);
                atti--;
                return newDate;
            }
            return false;
        };
    }
}

function rowResolve(div){
    let battleLog = {};
    let result = div.getElementsByClassName('col-md-1')[1].innerText;
    if(result === '胜'){
        battleLog.battleresult = true;
    } else if (result === '败'){
        battleLog.battleresult = false;
    } else {
        battleLog.battleresult = 0;
    }
    let nameRaw = div.getElementsByClassName('col-md-3')[0].innerText;
    battleLog.enemyname = nameRaw.split(' ')[1];
    let charRaw = div.getElementsByClassName('col-md-2')[1].innerText;
    let charinfo = charRaw.match(/Lv.(\d+) (\S+)/);
    battleLog.echarlv = charinfo[1];
    battleLog.echar = charinfo[2];
    let equips = div.getElementsByTagName('img');
    battleLog.armor = getArmor(equips[2].title, battleLog);
    battleLog.weapon = getWeapon(equips[0].title, battleLog);
    battleLog.etext = div.outerHTML;
    let equipDiv = div.getElementsByClassName('col-md-3')[1].innerHTML;
    battleLog.equip = equipDiv.replaceAll('div', 'span').replace('alert alert-info', '');
    return battleLog;
}
function getTimeinfo(div){
    let time = div.getElementsByClassName('col-md-2')[0].innerText;
    let timeinfo = time.substr(0,5).split(' ');
    timeinfo[1] = parseInt(timeinfo[1]);
    return timeinfo;
}
function is23Hour(before, after){
    let bottom = new Date(after - daymill);
    return before > bottom && before.getDate() === bottom.getDate() && before.getHours() === bottom.getHours();
}
function isEqualTimeinfoDate(timeinfo, date){
    let now = getLocDate();
    let timeDay = now.getDate();
    if(timeinfo[0] === '昨天'){
        let time = new Date(now - daymill);
        timeDay = time.getDate();
    }
    return timeDay === date.getDate() && timeinfo[1] === date.getHours();
}

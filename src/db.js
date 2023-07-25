export {db, user, queryDay, queryEnemyname, queryEnemynameRegex, queryCharname, logupdate, queryDuring, autodeletelog, getDaysOfLog};
import {getLocDate, getDateString} from './dateUtil';

/* global Dexie md5 */
let user = $('button[class*=\"btn btn-lg\"][onclick*=\"fyg_index.php\"]')[0].innerText;
const db = new Dexie('ggzharvester2');
dbInit();
function dbInit(){
    db.version(1).stores({
        battleLog: 'id,time,username'
    });
}
unsafeWindow.db = db;

async function queryEnemyname(enemyname){
    return await db.battleLog.where({username:user,enemyname:enemyname}).sortBy('time');
}

async function queryEnemynameRegex(regex){
    const queryLimit = 50;
    return await db.battleLog.where({username:user}).and(item =>{
        let reg = new RegExp(regex, 'i');
        return reg.test(item.enemyname);
    }).limit(queryLimit).sortBy('time');
}

async function queryDay(key){
    let during_s = 24 * 60 * 60 * 1000;
    let oldDay = getLocDate(key);
    let newDay = new Date(oldDay.getTime() + during_s);
    return await db.battleLog.where('time').between(oldDay,newDay,true,false).and(item => item.username == user).sortBy('time');
}
async function queryCharname(charname, maxQueryDay){
    let during_s = maxQueryDay * 24 * 60 * 60 * 1000;
    let day_ = getLocDate();
    let day = new Date(day_.getTime() - during_s);
    return await db.battleLog.where('time').between(day,day_,true,false).and(item => item.char === charname).sortBy('time');
}
async function queryDuring(during){
    let during_s = during * 24 * 60 * 60 * 1000;
    let now = getLocDate();
    let old = new Date(now - during_s);
    return await db.battleLog.where('time').between(old,now,true,true).and(item => item.username == user).toArray();
}

async function logupdate(battleLog){
    let now = getLocDate();
    let thisid = md5(battleLog.etext+now.getTime());
    await db.battleLog.add({id: thisid, username: user, log: battleLog.etext, isWin: battleLog.battleresult,
        enemyname: battleLog.enemyname, char: battleLog.echar, charlevel: battleLog.echarlv, attrs: battleLog.attrs,
        damages: battleLog.damages, halos: battleLog.halos, weapon: battleLog.weapon, armor: battleLog.armor,
        invalids: battleLog.invalids, time:now});
}

async function autodeletelog(dayss){
    let during_s = dayss * 24 * 60 * 60 * 1000;
    let now = getLocDate();
    let old = new Date(now - during_s);
    await db.battleLog.where('time').belowOrEqual(old).and(item => item.username == user).delete();
}

async function getDaysOfLog(){
    let result = new Set();
    await db.battleLog.where({username:user}).each(item => result.add(getDateString(item.time)));

    return Array.from(result);
}


import {weaponMap, armorMap, equipOldMap, haloMap, attrMap} from './namemap/oriToDb';
import {getLocDate} from './dateUtil';
import {user, db} from './global';
import {get_user_theard} from './getUser';
export {saveBattle};

/* Global md5 */
async function saveBattle() { //战斗记录
    let battleLog = {};
    let pkTextDiv = document.querySelector('#pk_text');
    unsafeWindow.pkTextDiv = pkTextDiv;
    battleLog.etext = pkTextDiv.innerHTML;
    let enemydivs = pkTextDiv.querySelectorAll('span.fyg_f18');
    if(enemydivs==null||enemydivs.length<2){return;}
    let enemyinfo = pkTextDiv.querySelectorAll('div.col-md-6')[1];
    let isbattlewin = pkTextDiv.querySelectorAll('.icon-smile').length>0;
    let isbattlelose = pkTextDiv.querySelectorAll('.icon-frown').length>0;
    if(isbattlewin){
        battleLog.battleresult = true;
    }else if(isbattlelose){
        battleLog.battleresult = false;
    }else{
        battleLog.battleresult = 0;
    }

    let enemydiv = enemydivs[1];
    let enemydivtext = enemydiv.innerText;
    let einfolist = enemydivtext.match(/(.+)（(.+) Lv\.(\d+)/);
    if(einfolist === null){
        einfolist = enemydivtext.match(/(.+)（/);
        battleLog.enemyname = einfolist[1];
        battleLog.echar = '无';//职业
        battleLog.echarlv = '0';
    }else{
        battleLog.enemyname = einfolist[1];
        battleLog.echar = einfolist[2];//职业
        battleLog.echarlv = einfolist[3];
    }

    battleLog.invalids = [];
    function mapGet(map, oriValue, type){
        let desValue = map.get(oriValue);
        if(desValue === undefined){
            battleLog.invalids.push({'type': type, 'oriValue': oriValue});
            console.log('errMap: {0}, {1}'.format(type, oriValue));
        }
        return desValue;
    }
    function sumMap(map1, map2){
        return new Map([...map1, ...map2]);
    }
    let weaponName = enemyinfo.querySelectorAll('.fyg_mp3')[0].dataset.originalTitle;
    battleLog.weapon = mapGet(sumMap(weaponMap,equipOldMap) , weaponName, 'weapon');
    let armorName = enemyinfo.querySelectorAll('.fyg_mp3')[2].dataset.originalTitle;
    battleLog.armor = mapGet(sumMap(armorMap,equipOldMap), armorName, 'armor');

    let physical = pkTextDiv.querySelectorAll('div.hl-primary > .col-md-2')[3].innerText;
    let magical = pkTextDiv.querySelectorAll('div.hl-primary > .col-md-2')[4].innerText;
    let trueD = pkTextDiv.querySelectorAll('div.hl-primary > .col-md-2')[5].innerText;
    battleLog.damages = [parseInt(physical),parseInt(magical),parseInt(trueD)];

    let angles = enemyinfo.querySelectorAll('span.fyg_f14')[2]
        .getElementsByTagName('i');
    battleLog.attrs = [];
    for(let i = 0; i < 6; i++){
        let attrClass= angles[i].classList[1];
        battleLog.attrs.push(mapGet(attrMap, attrClass, 'attrClass'+i));
    }
    let iHalo = enemyinfo.querySelectorAll('.fyg_tr')[0].innerText.matchAll(/\|[^\|]+\|/g);
    battleLog.halos = [];
    let haloIndex = 0;
    for(let haloRaw of iHalo){
        let haloName = haloRaw[0].substring(1,5);
        battleLog.halos.push(mapGet(haloMap, haloName, 'halo'+haloIndex));
        haloIndex++;
    }

    /*console.log(enemydivtext)
        console.log(echar)
        console.log(echarlv)*/
    await logupdate(battleLog);
    if(battleLog.echar=='野怪'){return;}
    get_user_theard(battleLog.enemyname);

}

async function logupdate(battleLog){
    let now = getLocDate();
    let thisid = md5(battleLog.etext);

    await db.battleLog.add({id: thisid, username: user, log: battleLog.etext, isWin: battleLog.battleresult,
        enemyname: battleLog.enemyname, char: battleLog.echar, charlevel: battleLog.echarlv, attrs: battleLog.attrs,
        damages: battleLog.damages, halos: battleLog.halos, weapon: battleLog.weapon, armor: battleLog.armor,
        invalids: battleLog.invalids, time:now});
}


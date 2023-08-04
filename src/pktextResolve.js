export {saveBattle};
import {getArmor, getWeapon, mapGet, haloMap, attrMap} from './namemap/oriToDb';
import {logupdate} from './db';
import {get_user_theard} from './getUserSM';
import {postHistory} from './defense';

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

    if(battleLog.echar !== '野怪'){
        let weaponName = enemyinfo.querySelectorAll('.fyg_mp3')[0].dataset.originalTitle;
        battleLog.weapon = getWeapon(weaponName);
        let armorName = enemyinfo.querySelectorAll('.fyg_mp3')[2].dataset.originalTitle;
        battleLog.armor = getArmor(armorName);

        let physical = pkTextDiv.querySelectorAll('div.hl-primary > .col-md-2')[3].innerText;
        let magical = pkTextDiv.querySelectorAll('div.hl-primary > .col-md-2')[4].innerText;
        let trueD = pkTextDiv.querySelectorAll('div.hl-primary > .col-md-2')[5].innerText;
        battleLog.damages = [parseInt(physical),parseInt(magical),parseInt(trueD)];

        let angles = enemyinfo.querySelectorAll('span.fyg_f14')[2]
            .getElementsByTagName('i');
        battleLog.attrs = [];
        for(let i = 0; i < 6; i++){
            let attrClass= angles[i].classList[1];
            battleLog.attrs.push(mapGet(attrMap, attrClass, 'attrClass'+i, battleLog));
        }
        let iHalo = enemyinfo.querySelectorAll('.fyg_tr')[0].innerText.matchAll(/\|[^\|]+\|/g);
        battleLog.halos = [];
        let haloIndex = 0;
        for(let haloRaw of iHalo){
            let haloName = haloRaw[0].substring(1,5);
            battleLog.halos.push(mapGet(haloMap, haloName, 'halo'+haloIndex, battleLog));
            haloIndex++;
        }
        await logupdate(battleLog);
        await postHistory();
    }

    /*console.log(enemydivtext)
        console.log(echar)
        console.log(echarlv)*/
    if(battleLog.echar=='野怪'){return;}
    get_user_theard(battleLog.enemyname);
}

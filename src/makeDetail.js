export {setDetaillogpanelByday, setDetaillogpanelByname, setDetaillogpanelBychar, setDetaillogpanelBynameRegex};
import {weaponAbbrMap, armorAbbrMap, attrsClassValid, attrName} from './includes/dbToAbbr';
import {queryDay, queryCharname, queryEnemyname, queryEnemynameRegex} from './db';
import {get_enemylevel} from './getUserSM';
import {config} from './config';
import {getDateString} from './dateUtil';

async function setDetaillogpanelByday(key){
    let timetext = '<span style="width: 60px">{time}</span>';
    let items = await queryDay(key);
    return setDetaillogpanel(timetext, items);
}
async function setDetaillogpanelByname(enemyname){
    let timetext = '<span style="width: 100px;">{date}</span>';
    let items = await queryEnemyname(enemyname);
    return setDetaillogpanel(timetext, items);
}
async function setDetaillogpanelBynameRegex(enemynameRegex){
    let timetext = '<span style="width: 100px;">{date}</span>';
    let items = await queryEnemynameRegex(enemynameRegex);
    return setDetaillogpanel(timetext, items);
}
async function setDetaillogpanelBychar(charname, maxQueryDay){
    let timetext = '<span style="width: 100px;">{monthday}  {time}</span>';
    let items = await queryCharname(charname, maxQueryDay);
    return setDetaillogpanel(timetext, items);
}

async function setDetaillogpanel(timetext, items){
    let text = '';
    let len=items.length;
    let divtext = '<div class="detaillogitem {thisclass}"><div class="nameandlevel"><h3>{time}'+
        (config.showRank?'<span style="width:45px;" class="fyg_colpz05">{rank}</span>':'')+
        '<span style="width: 120px;"><span class="enemyname">{name}</span></span>'+
        (config.showSM?'<span style="width: 70px;">{xishu}</span>':'')+
        (config.showcharlv?'<span style="width: 40px;">{char}</span><span style="width: 80px;">{charlv}</span>':'');
    if(len === 0){
        let emptyDiv = '<div class="detaillogitem"><div class="nameandlevel"><h3>无数据</h3></div></div>';
        text += emptyDiv;
    }else{
        for(let i=len-1;i>=0;i--){
            if(items[i].type === 'defense'){
                let divtext2 = '{equip}</h3></div></div>';
                text += makeDetaillogItem(divtext+divtext2, timetext, items[i]);
            } else {
                let divtext2 = '{extrainfo}</h3></div><div style="display:none;">{log}</div></div>';
                text+= makeDetaillogItem(divtext+divtext2, timetext, items[i]);
            }
        }
    }
    return text;
}

function fillzero(numStr, pos){
    return numStr.toString().padStart(pos,'0');
}
function strWhenBool(cond, str){
    return cond?str:'';
}
function makeDetaillogItem(divtext, timetext, item){
    let thisclass = '';
    let date = getDateString(item.time);
    let monthday = fillzero(item.time.getMonth()+1, 2)+'/'+fillzero(item.time.getDate(), 2);
    let time = fillzero(item.time.getHours(), 2)+':'+fillzero(item.time.getMinutes(), 2);
    if(item.isWin === true){
        thisclass='battlewin';
    }else if(item.isWin === false){
        thisclass='battlelose';
    }else if(item.isWin === 0){
        thisclass='battletie';
    }
    if(item.type === 'defense'){
        thisclass += ' defense';
    } else {
        thisclass += ' attack';
    }

    let name = item.enemyname;
    let xishu = get_enemylevel(name);
    if(xishu!=''){
        xishu = 'SM:'+xishu;
    }
    let char = item.char;
    let charlv = 'LV:'+item.charlevel;
    let rank = item.rank;
    if(typeof item.rank !== 'string'){
        rank = '';
    }

    let extrainfo = '';
    if(Array.isArray(item.attrs) && config.showExtrainfo){
        const minDamagePer = 30;
        let spanOri = '<span style=\'width:{0}px;\'>{1}</span>';
        let attrOri = '<span style=\'width:120px; color:grey\'>{0}</span>';
        let weapon = weaponAbbrMap.get(item.weapon);
        let armor = armorAbbrMap.get(item.armor);

        let damages = item.damages;
        let damagePerStr = '';
        let damageSum = damages[0]+damages[1]+damages[2];
        if(damageSum === 0){
            damagePerStr = '0';
        } else {
            let damageClass = ['text-danger', 'text-primary', 'text-warning'];
            let damagePerOri = '<i class=\'{0}\'>{1}% </i>';
            for(let i = 0; i < 3; i++){
                let per = (damages[i]*100/damageSum).toFixed(0);
                if(per < minDamagePer){
                    continue;
                } else {
                    damagePerStr += damagePerOri.format(damageClass[i], per);
                }
            }
        }
        let attrs = item.attrs;
        let attrStr = '';
        let str = '<i class=\'{0}\'></i>{1} ';
        for(let i = 0; i < 6; i++){
            if(attrsClassValid.has(attrs[i])){
                let attrsClass = attrsClassValid.get(attrs[i]);
                attrStr += str.format(attrsClass, attrName[i]);
            }
        }

        const halosValid = ['FEI', 'BO', 'JU', 'HONG', 'JUE', 'HOU', 'DUNH', 'ZI'];
        let halos = item.halos;
        let haloStr = '|';
        for(let i = halos.length-1; i >= 0; i--){
            if(halosValid.includes(halos[i])){
                haloStr += halos[i]+'|';
            }
        }
        if(haloStr === '|'){
            haloStr = '';
        }

        extrainfo = spanOri.format(50, weapon) + strWhenBool(config.showArmor, spanOri.format(50, armor))
                + strWhenBool(config.showDamage, spanOri.format(110, damagePerStr))
                + strWhenBool(config.showAttr, attrOri.format(attrStr))
                + strWhenBool(config.showHalo, spanOri.format(190, haloStr));

    }
    let divLogData = {thisclass,name,xishu,char,charlv,rank,log: item.log, equip: item.equip, extrainfo};
    divLogData.time = timetext.format({time, date, monthday});
    return divtext.format(divLogData);
}

export let infunc;
if (process.env.NODE_ENV === 'test') {
    infunc = {strWhenBool, fillzero};
}

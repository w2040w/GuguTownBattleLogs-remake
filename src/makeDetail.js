import {weaponAbbrMap, armorAbbrMap, attrsClassValid, attrName} from './namemap/dbToAbbr';
import {db, user} from './global';
import {get_enemylevel} from './getUser';
import {config} from './config';
import {getLocDate, getDateString} from './dateUtil';
export {setDetaillogpanelByday, setDetaillogpanelByname, setDetaillogpanelBychar, setDetaillogpanelBynameRegex};

async function setDetaillogpanelByday(key){
    let divtext = '<div class="detaillogitem {thisclass}"><div class="nameandlevel"><h3>'+
            '<span style="width: 60px">{time}</span><span style="width: 120px;">{name}</span>'+
            (config.showSM?'<span style="width: 70px;">{xishu}</span>':'')+
            (config.showcharlv?'<span style="width: 40px;">{char}</span><span style="width: 80px;">{charlv}</span>{extrainfo}':'')+
            '</h3></div><div style="display:none;">{log}</div></div>';

    let during_s = 24 * 60 * 60 * 1000;
    let day = getLocDate(key);
    let day_ = new Date(day.getTime() + during_s);
    let items = await db.battleLog.where('time').between(day,day_,true,false).and(item => item.username == user).sortBy('time');
    return setDetaillogpanel(divtext, items);
}
async function setDetaillogpanelByname(enemyname){
    let divtext = '<div class="detaillogitem {thisclass}"><div class="nameandlevel"><h3>'+
            '<span style="width: 100px;">{date}</span><span style="width: 120px;">{name}</span>'+
            (config.showcharlv?'<span style="width: 40px;">{char}</span><span style="width: 80px;">{charlv}</span>{extrainfo}':'')+
            '</h3></div><div style="display:none;">{log}</div></div>';
    let items = await db.battleLog.where({username:user,enemyname:enemyname}).sortBy('time');
    return setDetaillogpanel(divtext, items);
}
async function setDetaillogpanelBynameRegex(enemynameRegex){
    const queryLimit = 50;
    let divtext = '<div class="detaillogitem {thisclass}"><div class="nameandlevel"><h3>'+
            '<span style="width: 100px;">{date}</span><span style="width: 120px;">{name}</span>'+
            (config.showcharlv?'<span style="width: 40px;">{char}</span><span style="width: 80px;">{charlv}</span>{extrainfo}':'')+
            '</h3></div><div style="display:none;">{log}</div></div>';
    let items = await db.battleLog.where({username:user}).and(item =>{
        let reg = new RegExp(enemynameRegex, 'i');
        return reg.test(item.enemyname);
    }).limit(queryLimit).sortBy('time');

    return setDetaillogpanel(divtext, items);
}
async function setDetaillogpanelBychar(charname, maxQueryDay){
    let divtext = '<div class="detaillogitem {thisclass}"><div class="nameandlevel"><h3>'+
            '<span style="width: 100px;">{monthday}  {time}</span><span style="width: 120px;">{name}</span>'+
            (config.showcharlv?'<span style="width: 40px;">{char}</span><span style="width: 80px;">{charlv}</span>{extrainfo}':'')+
            '</h3></div><div style="display:none;">{log}</div></div>';
    let during_s = maxQueryDay * 24 * 60 * 60 * 1000;
    let day_ = new Date();
    let day = new Date(day_.getTime() - during_s);
    let items = await db.battleLog.where('time').between(day,day_,true,false).and(item => item.char === charname).sortBy('time');
    return setDetaillogpanel(divtext, items);
}

async function setDetaillogpanel(divtext, items){
    let text = '';
    let len=items.length;
    if(len === 0){
        let emptyDivLogData = {thisclass:'',name: '无数据',xishu: '',char:'',charlv:'',log: '',time:'',date:'',monthday:'',extrainfo:''};
        text+=divtext.format(emptyDivLogData);
    }else{
        for(let i=len-1;i>=0;i--){
            text+= makeDetaillogitem(divtext, items[i]);
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
function makeDetaillogitem(divtext, item){
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

    let name = item.enemyname;
    let xishu = get_enemylevel(name);
    if(xishu!=''){
        xishu = 'SM:'+xishu;
    }
    let char = item.char;
    let charlv = 'LV:'+item.charlevel;

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
    let divLogData = {thisclass,name,xishu,char,charlv,log: item.log,extrainfo,time,date,monthday};
    return divtext.format(divLogData);
}


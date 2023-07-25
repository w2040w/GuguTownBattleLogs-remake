export {config, saveConfig, refreshMaxtime, banpveFlag, banpvpFlag, checkboxids};
export {setflashtime, setBanpveFlag, setBanpvpFlag};

let banpvpFlag = false , banpveFlag = false;
if(localStorage.getItem('banpvpFlag')=='true'){
    banpvpFlag = true;
}
if(localStorage.getItem('banpveFlag')=='true'){
    banpveFlag = true;
}
function setBanpveFlag(value){
    banpveFlag = value;
    localStorage.setItem('banpveFlag',banpveFlag);
}
function setBanpvpFlag(value){
    banpvpFlag = value;
    localStorage.setItem('banpvpFlag',banpvpFlag);
}

let config = {};
const checkboxids = ['showSM', 'showcharlv', 'userRegexQuery', 'showArmor', 'showDamage', 'showAttr', 'showHalo'];
let jsonRaw = localStorage.getItem('battlelogConfig');
if(typeof jsonRaw === 'string'){
    config = JSON.parse(jsonRaw);
}
function saveConfig(){
    let raw = JSON.stringify(config);
    localStorage.setItem('battlelogConfig', raw);
}
function initConfigDetail(checkboxid){
    let value = config[checkboxid];
    if(typeof value !== 'boolean'){
        config[checkboxid]= true;
    }
}
initConfigDetail('showExtrainfo');
for(let checkboxid of checkboxids){
    initConfigDetail(checkboxid);
}
if(typeof config.queryMaxDay !== 'number'){
    config.queryMaxDay = 7;
}

let refreshMaxtime = 30;
if(localStorage.getItem('flashtime')===null){
    localStorage.setItem('flashtime', 30);
}
refreshMaxtime = parseInt(localStorage.getItem('flashtime'));

function setflashtime(newtime){
    if(newtime > 0){
        localStorage.setItem('flashtime', newtime);
        refreshMaxtime = newtime;
    }
    if(newtime <= 0){
        localStorage.setItem('flashtime', newtime);
        refreshMaxtime = -1;
    }
}

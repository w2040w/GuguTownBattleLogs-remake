export {config, saveConfig, checkboxids};
export {setflashtime};

let config = {};
const defaultConfig = {
    'showSM': true, 'showcharlv': true, 'userRegexQuery': false, 'queryMaxDay': 7,
    'showExtrainfo': true, 'showAttr': true, 'showDamage': true, 'showHalo': true, 'showArmor': true,
    'banpvpFlag': false, 'banpveFlag': false, 'refreshMaxtime': 30, 'mainHost': '0',
    'logDefense': true, 'showDefense': true
};
const checkboxids = ['showSM', 'showcharlv', 'userRegexQuery', 'showArmor', 'showDamage', 'showAttr', 'showHalo', 'logDefense', 'showDefense'];
initConfig();

function initConfig(){
    config = {};
    let jsonRaw = localStorage.getItem('battlelogConfig');
    if(typeof jsonRaw === 'string'){
        config = JSON.parse(jsonRaw);
        if(config.mainHost === undefined){
            readOldConfig();
            saveConfig();
        }

        const keys = Object.keys(defaultConfig);
        const len = keys.length;
        let changeFlag = 0;
        for(let i = 0; i < len; i++){
            let key = keys[i];
            if(config[key] === undefined){
                config[key] = defaultConfig[key];
                changeFlag = 1;
            }
        }
        if(changeFlag === 1) {
            saveConfig();
        }
    } else {
        config = structuredClone(defaultConfig);
        readOldConfig();
        saveConfig();
    }
}
function saveConfig(){
    let raw = JSON.stringify(config);
    localStorage.setItem('battlelogConfig', raw);
}
function readOldConfig(){
    const oldConfigs = ['showSM', 'showcharlv', 'banpvpFlag', 'banpveFlag', 'mainHost','refreshMaxtime'];
    for(let i = 0; i < 5; i++){
        let key = oldConfigs[i];
        let value = localStorage.getItem(key);
        if(typeof value === 'string'){
            if(key === 'mainHost'){
                config[key] = value;
            } else {
                if(value === 'true'){
                    config[key] = true;
                } else {
                    config[key] = false;
                }
            }
        }
    }

    let value = localStorage.getItem('flashtime');
    if(typeof value === 'string'){
        let newValue = parseInt(value);
        setflashtime(newValue);
    }
}

function setflashtime(newtime){
    if(newtime > 0){
        config.refreshMaxtime = newtime;
        saveConfig();
    }
    if(newtime <= 0){
        config.refreshMaxtime = -1;
        saveConfig();
    }
}

export let infunc;
if (process.env.NODE_ENV === 'test') {
    infunc = {defaultConfig, initConfig};
}

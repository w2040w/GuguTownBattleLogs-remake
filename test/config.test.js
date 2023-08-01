import {setflashtime, config, infunc} from '../src/config';

let oldConfig = {'showSM': false, 'showcharlv': false, 'banpvpFlag': true, 'banpveFlag': true,
    'mainHost': 'https://fygal.com', 'refreshMaxtime': 40};
let poldConfig = {'showSM': false, 'banpvpFlag': true, 'refreshMaxtime': 40};

describe.each([['empty', {}], ['all oldConfig', oldConfig], ['part oldConfig', poldConfig]])('initConfig:%s', (name, local) => {
    let expectConfig;
    expectConfig = structuredClone(infunc.defaultConfig);
    sumObj(expectConfig, local);

    beforeAll(() => {
        localStorage.clear();
    });

    test('config', () => {
        setLocal(local);
        infunc.initConfig();
        expect(config).toEqual(expectConfig);
    });

    test('localStorage', () => {
        expect(getConfig()).toEqual(expectConfig);
    });
});

let reserveConfig = {'userRegexQuery': true, 'queryMaxDay': 8,
    'showExtrainfo': false, 'showAttr': false, 'showDamage': false, 'showHalo': false, 'showArmor': false};
let poldConfig2 = {'showcharlv': false, 'banpveFlag': true, 'mainHost': 'https://fygal.com'};

describe.each([['newConfig', [], reserveConfig], ['new with old', poldConfig2, reserveConfig]])('initConfig:%s', (name, oldConfig, newConfig) => {
    let expectConfig;
    expectConfig = structuredClone(infunc.defaultConfig);
    sumObj(expectConfig, newConfig);
    sumObj(expectConfig, oldConfig);

    beforeAll(() => {
        localStorage.clear();
    });

    test('config', () => {
        oldConfig.battlelogConfig = JSON.stringify(newConfig);
        setLocal(oldConfig);
        infunc.initConfig();
        expect(config).toEqual(expectConfig);
    });

    test('localStorage', () => {
        expect(getConfig()).toEqual(expectConfig);
    });
});

describe.each([[5, 5], [-3, -1], [-1, -1]]) ('setflashtime:%i', (newtime, expected) => {
    test('config', () => {
        setflashtime(newtime);
        expect(config).toHaveProperty('refreshMaxtime', expected);
    });

    test('localStorage', () => {
        expect(getConfig()).toHaveProperty('refreshMaxtime', expected);
    });
});

function getConfig(){
    let jsonRaw = localStorage.getItem('battlelogConfig');
    expect(typeof jsonRaw).toBe('string');
    return JSON.parse(jsonRaw);
}
function setLocal(obj){
    let keys = Object.keys(obj);
    let len = keys.length;
    for(let i = 0; i < len; i++){
        let key = keys[i];
        if(key === 'refreshMaxtime'){
            let key2 = 'flashtime';
            localStorage.setItem(key2, obj[key]);
        } else {
            localStorage.setItem(key, obj[key]);
        }
    }
}
function sumObj(des, src){
    let keys = Object.keys(src);
    let len = keys.length;
    for(let i = 0; i < len; i++){
        let key = keys[i];
        des[key] = src[key];
    }
}

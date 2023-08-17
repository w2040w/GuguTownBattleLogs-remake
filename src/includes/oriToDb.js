export {weaponMap, armorMap, equipOldMap, haloMap, attrMap};
export {mapGet, getWeapon, getArmor};

function mapGet(map, oriValue, type, battleLog){
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
function getWeapon(weapon, battleLog){
    return mapGet(sumMap(weaponMap,equipOldMap), weapon, 'weapon', battleLog);
}
function getArmor(armor, battleLog){
    return mapGet(sumMap(armorMap,equipOldMap), armor, 'armor', battleLog);
}

const weaponMap = new Map([
    ['探险者之剑', 'SWORD'],
    ['探险者短弓', 'BOW'],
    ['探险者短杖', 'STAFF'],
    ['狂信者的荣誉之刃', 'BLADE'],
    ['反叛者的刺杀弓', 'ASSBOW'],
    ['幽梦匕首', 'DAGGER'],
    ['光辉法杖', 'WAND'],
    ['荆棘盾剑', 'SHIELD'],
    ['陨铁重剑', 'CLAYMORE'],
    ['饮血魔剑', 'SPEAR'],
    ['彩金长剑', 'COLORFUL'],
]);

const armorMap = new Map([
    ['探险者铁甲', 'PLATE'],
    ['探险者皮甲', 'LEATHER'],
    ['探险者布甲', 'CLOTH'],
    ['旅法师的灵光袍', 'CLOAK'],
    ['战线支撑者的荆棘重甲', 'THORN'],
    ['复苏战衣', 'WOOD'],
    ['挑战斗篷', 'CAPE'],
]);

const equipOldMap = new Map([
    ['饮血长枪', 'SPEAR'],
    ['荆棘剑盾', 'SHIELD'],
    ['复苏木甲', 'WOOD'],
]);

const haloMap = new Map([
    ['启程之誓', 'SHI'],
    ['启程之心', 'XIN'],
    ['启程之风', 'FENG'],
    ['等级挑战', 'TIAO'],
    ['等级压制', 'YA'],
    ['破壁之心', 'BI'],
    ['破魔之心', 'MO'],
    ['复合护盾', 'DUN'],
    ['鲜血渴望', 'XUE'],
    ['削骨之痛', 'XIAO'],
    ['圣盾祝福', 'SHENG'],
    ['恶意抽奖', 'E'],
    ['伤口恶化', 'SHANG'],
    ['精神创伤', 'SHEN'],
    ['铁甲尖刺', 'CI'],
    ['忍无可忍', 'REN'],
    ['热血战魂', 'RE'],
    ['点到为止', 'DIAN'],
    ['午时已到', 'WU'],
    ['纸薄命硬', 'ZHI'],
    ['不动如山', 'SHAN'],
    ['沸血之志', 'FEI'],
    ['波澜不惊', 'BO'],
    ['飓风之力', 'JU'],
    ['红蓝双刺', 'HONG'],
    ['荧光护盾', 'JUE'],
    ['后发制人', 'HOU'],
    ['钝化锋芒', 'DUNH'],
    ['自信回头', 'ZI'],
]);

const attrMap = new Map([
    ['icon-double-angle-down', 'doubledown'],
    ['icon-angle-down', 'down'],
    ['icon-double-angle-up', 'doubleup'],
    ['icon-angle-up', 'up'],
]);

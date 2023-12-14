export {weaponAbbrMap, armorAbbrMap, attrsClassValid, attrName};

const weaponAbbrMap = new Map([
    ['SWORD', '剑'],['BOW', '短弓'],['STAFF', '短杖'],
    ['BLADE', '刃'],['ASSBOW', '弓'],['DAGGER', '匕首'],
    ['WAND', '光辉'],['SHIELD', '盾剑'],['CLAYMORE', '重剑'],
    ['SPEAR', '长枪'],['COLORFUL', '长剑'],['LIMPIDWAND', '长杖']
]);

const armorAbbrMap = new Map([
    ['PLATE', '铁甲'],['LEATHER', '皮甲'],['CLOTH', '布甲'],['CLOAK', '袍子'],
    ['THORN', '重甲'],['WOOD', '木甲'],['CAPE', '斗篷']
]);

const attrsClassValid = new Map([['up', 'icon-angle-up'], ['doubleup', 'icon-double-angle-up']]);
const attrName = ['力', '敏', '智', '体', '精', '意'];

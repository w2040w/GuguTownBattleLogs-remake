export {transToDbdata};
import {BattleLog, FM_setValue} from '../getUserSM';
import {db} from '../db';
import {getLocDate} from '../dateUtil';

async function transToDbdata(){
    for (let i in BattleLog){
        if(i != 'enemylevel'){
            delete BattleLog[i];
        }
    }
    FM_setValue('BattleLog',BattleLog);

    let flag = await Dexie.exists('ggzharvester');
    if(flag){
        alert('即将开始将战斗记录数据格式更新至新版本\n可能会花费一点时间，请稍等且不要关闭网页');
        let dbold = new Dexie('ggzharvester');
        dbold.version(1).stores({
            battleLog: '++id,time,username'
        });
        await dbold.battleLog
            .each(async logline => {
                await logupdateraw(logline.log,logline.isWin,logline.enemyname,logline.char,logline.charlevel,logline.time,logline.username);
            });
        await dbold.delete();
        alert('数据更新完毕！');
    }
}
async function logupdateraw(etext,isbattlewin,enemyname,enemychar,enemycharlv,now,username){
    let thisid = md5(etext);
    await db.battleLog.add({id:thisid,username:username,log:etext, isWin:isbattlewin,enemyname:enemyname,char:enemychar,charlevel:enemycharlv,time:now});
}


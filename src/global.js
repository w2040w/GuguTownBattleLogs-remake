export {progresschange, db, user, refreshCountdownTime};
export {setRefreshCountdownTime};

let user = $('button[class*=\"btn btn-lg\"][onclick*=\"fyg_index.php\"]')[0].innerText;
let refreshCountdownTime = 0;
function setRefreshCountdownTime(newtime){
    refreshCountdownTime = newtime;
    return refreshCountdownTime;
}

const db = new Dexie('ggzharvester2');
dbInit();
function dbInit(){
    db.version(1).stores({
        battleLog: 'id,time,username'
    });
}
unsafeWindow.db = db;

let progresschange = document.createElement('div');  //显示log
progresschange.setAttribute('id','progresschange');
progresschange.setAttribute('class','panel-body');


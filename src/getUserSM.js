export {BattleLog, get_enemylevel, get_user_theard, showMainHost, setMainHost, FM_setValue};
import {user} from './db';
import {config, saveConfig} from './config';

/* global $URL */
function setMainHost(){
    let newmainHost = prompt('注意此选项可能消耗主站搜索次数！\n格式如https://bbs.kfmax.com/（填0则不获取对手系数）',config.mainHost);
    if(newmainHost!=null&&newmainHost!=''){
        config.mainHost = newmainHost;
        saveConfig();
    }
}

function show_battle_log(text){
    $('#goxtipbottomtext').text(text);
}
function showMainHost(){
    show_battle_log('主站域名:'+config.mainHost);
}

let BattleLog = {};
if(FM_getValue('BattleLog')!=null){
    console.log('BattleLog load');
    BattleLog = FM_getValue('BattleLog', user);
}
unsafeWindow.BattleLog = BattleLog;
function FM_getValue(name, defaultValue){
    let thisvalue = GM_getValue(user);
    if(thisvalue != undefined&&name in thisvalue){
        return thisvalue[name];
    }
    if(defaultValue != null){
        return defaultValue;
    }
    return null;
}
function FM_setValue(name, value){
    let oldvalue = GM_getValue(user);
    if(oldvalue === undefined){
        oldvalue = {};
    }
    oldvalue[name] = value;
    GM_setValue(user,oldvalue);
}

function get_enemylevel(name){
    if(name.indexOf('ikarosf')!=-1){return '114';}
    let a = BattleLog['enemylevel'];
    if(a===undefined){
        return '';
    }
    if(name in a){
        return a[name];
    }
    return '';
}

function save_enemylevel(name,level){
    let a = BattleLog['enemylevel'];
    if(a===undefined){
        BattleLog['enemylevel']={};
        a = BattleLog['enemylevel'];
    }
    a[name]=level;
    FM_setValue('BattleLog',BattleLog, user);
}

let get_user_theard_try_num = 0;
function get_user_theard(name){
    if(config.mainHost === '0') return;
    let search_name = $URL.encode(name);
    show_battle_log('搜素帖子中');
    GM_xmlhttpRequest({
        method: 'post',
        url: config.mainHost+'search.php',
        data: 'step=2&method=AND&sch_area=0&s_type=forum&f_fid=all&orderway=lastpost&asc=DESC&keyword=&pwuser='+search_name,
        headers:  {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        onload: function(res){
            if(res.status === 200){
                let info = res.responseText;
                //console.log(info)
                let firstindex = info.indexOf('共搜索到');
                if(firstindex == -1){
                    if( info.indexOf('用户不存在')!=-1){
                        show_battle_log('用户'+name+'不存在');
                        get_user_theard_try_num = 0;
                        return;
                    }
                    if( info.indexOf('你所属的用户组不能使用搜索功能')!=-1){
                        show_battle_log('主站域名错误或无权限');
                        get_user_theard_try_num = 0;
                        return;
                    }
                    console.log('搜索尝试次数：' + get_user_theard_try_num);
                    if(info.indexOf('搜索排队中')!=-1&&get_user_theard_try_num<3){
                        get_user_theard_try_num++;
                        setTimeout(get_user_theard,2000,name);
                    }else{
                        //console.log(info)
                        get_user_theard_try_num = 0;
                        show_battle_log('找不到'+name+'的帖子,可能他未发过主题帖');
                    }
                    return;
                }
                //let secondindex = info.indexOf("共搜索到",firstindex+1);
                let secondindex = firstindex+200;
                info = info.substring(firstindex,secondindex);
                let theards=info.match(/read\.php.+?(?=")/g);
                //console.log(theards)
                get_user_mainpage(theards,name);
            }else{
                show_battle_log('搜索对手帖子失败');
                console.log(res);
            }
        },
        onerror : function(err){
            show_battle_log('搜索对手帖子错误,可能域名设置格式不正确');
            console.log(err);
        }
    });
}

function get_user_mainpage(theards,name){
    if(theards==null||theards.length<1){
        show_battle_log('找不到'+name+'的帖子');
        return;}
    show_battle_log('进入帖子中');
    let theard = theards[0];
    GM_xmlhttpRequest({
        method: 'get',
        url: config.mainHost+theard ,
        headers:  {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        onload: function(res){
            if(res.status === 200){
                let info = res.responseText;
                //console.log(info)
                let firstindex = info.indexOf('楼主');
                let afterinfo = info.substring(0,firstindex);
                let mainpage=afterinfo.match(/profile\.php\?action=show.+?(?=" )/g);
                if(mainpage==null||mainpage.length==0){

                    afterinfo = info.substring(0,firstindex+100);
                    mainpage=afterinfo.match(/\/user\/uid.+(?=" )/g);
                    get_user_LV(mainpage,name);
                }else{
                    get_user_LV(mainpage,name);}
            }else{
                show_battle_log('获取'+name+'主页失败');
                console.log(res);
            }
        },
        onerror : function(err){
            show_battle_log('获取'+name+'主页错误');
            console.log(err);
        }
    });
}

function get_user_LV(mainpages,name){
    show_battle_log('进入主页中');
    if(mainpages==null||mainpages.length<1){
        show_battle_log('找不到'+name+'的主页');
        return;}
    let mainpage = mainpages[0];
    if(mainpage.indexOf('uid=null')!=-1){
        show_battle_log(name+'已被封禁');
        return;
    }
    GM_xmlhttpRequest({
        method: 'get',
        url: config.mainHost+mainpage ,
        headers:  {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        onload: function(res){
            if(res.status === 200){
                let info = res.responseText;
                //console.log(info)
                let afterinfo = info.replace(/<\/strong>/g,'');
                let level = afterinfo.match(/(?<=神秘系数：)\d+/g)[0];
                save_enemylevel(name,level);//存储对手系数
                show_battle_log('获取'+name+'系数成功');
            }else{
                show_battle_log('进入'+name+'主页失败');
                console.log(res);
            }
        },
        onerror : function(err){
            show_battle_log('进入'+name+'主页错误');
            console.log(err);
        }
    });
}


export {initgoxpanel};
import {getLocDate} from './dateUtil';
import {table_date_set, dosmalldiv, download, banbattletypefunc} from './panelFunc';
import {checkboxids, config, setflashtime, saveConfig} from './config';
import {setRefreshCountdownTime, progresschange} from './refresh';
import {autodeletelog, getDaysOfLog, deleteDefensePastday, db} from './db';
import {showMainHost, setMainHost} from './getUserSM';
import {setDetaillogpanelByday, setDetaillogpanelByname,setDetaillogpanelBychar, setDetaillogpanelBynameRegex} from './makeDetail';

let banbattletypediv= document.createElement('div');

let banpvpcheckbox = document.createElement('input');
banpvpcheckbox.setAttribute('type','checkbox');
banpvpcheckbox.addEventListener('change',function(){
    config.banpvpFlag = banpvpcheckbox.checked;
    saveConfig();
    banbattletypefunc();
});
banbattletypediv.appendChild(banpvpcheckbox);

let banpvpcheckboxtext = document.createElement('i');
banpvpcheckboxtext.innerText = '禁用打人';
banpvpcheckboxtext.setAttribute('style','margin-right:20px;');
banpvpcheckboxtext.setAttribute('class','smalldiv');
banbattletypediv.appendChild(banpvpcheckboxtext);

let banpvecheckbox = document.createElement('input');
banpvecheckbox.setAttribute('type','checkbox');
banpvecheckbox.addEventListener('change',function(){
    config.banpveFlag = banpvecheckbox.checked;
    saveConfig();
    banbattletypefunc();
});
banbattletypediv.appendChild(banpvecheckbox);

let banpvecheckboxtext = document.createElement('i');
banpvecheckboxtext.innerText = '禁用打怪';
banpvecheckboxtext.setAttribute('style','margin-right:20px;');
banpvecheckboxtext.setAttribute('class','smalldiv');
banbattletypediv.appendChild(banpvecheckboxtext);

if(config.banpvpFlag === true){
    banpvpcheckbox.checked = true;
}
if(config.banpveFlag === true){
    banpvecheckbox.checked = true;
}
let detaillogpanel = document.createElement('div');
let goxpanel= document.createElement('div');
let goxpanelExtend= document.createElement('div');
let copydiv = document.createElement('textarea');
let mask = document.createElement('div');
async function initgoxpanel(){
    $('body')[0].appendChild(goxpanel);
    $('body')[0].appendChild(goxpanelExtend);
    goxpanel.setAttribute('id','goxpanel');
    goxpanel.style.setProperty('max-width', (document.body.clientWidth-1300)/2+'px');
    goxpanel.innerHTML = `<div id="smallbar">&lt</div>
    <div id="goxtip" class="goxtip"><a id="goxtiptext" title="设置刷新间隔"></a> </div>
    <div id="goxtip2" class="goxtip smalldiv"></div>
    <div id="goxtipinfo" class="smalldiv"></div><div id="goxtipbottom" class="goxtip goxtipbottom smalldiv"><a id="goxtipbottomtext" title="设置主站域名"></a>
        <input type="text" class="btn btn-details" placeholder="战斗历史" readonly="true" id="date"></div><div id="extendbar">∨</div>`;

    $('#goxtip2').append(banbattletypediv);
    $('#goxtipinfo').append(progresschange);
    progresschange.style.setProperty('overflow-y','auto');
    progresschange.style.setProperty('max-height','70%');

    $('#goxtiptext').click(() => {
        let newtime = parseInt(prompt('新的刷新间隔：(填0则禁止刷新)', config.refreshMaxtime));
        if(!isNaN(newtime)){
            setflashtime(newtime);
            setRefreshCountdownTime(newtime);
        }
    });
    $('#smallbar').click(dosmalldiv);
    showMainHost();
    $('#goxtipbottomtext').click(()=>{
        setMainHost();
        showMainHost();
    });

    $('#extendbar').click(function(){
        if($('#goxpanelExtend').css('display')=='none'){
            $('#extendbar').text('∧');
        }else{
            $('#extendbar').text('∨');
        }
        $('#goxpanelExtend').slideToggle(200);
    });
    function makeCheckbox(id, desc){
        return `<span class="selectLog"><input type="checkbox" id="${id}" style="width: 20px;">${desc}</input></span>`;
    }
    goxpanelExtend.innerHTML =`<div>
        <input  value="30" id="TopDuring" style="width: 40px;">日内 遇到最多TOP</input>
        <input  value="15" id="TopNum" style="width: 40px;margin-right:15px;"></input>
        <input type="button" class="btn" value="查看" id="showTop"></input>
    </div>
    <div>
        <div>
        查询记录：
        <input type="button" class="btn" value="根据用户名" id="showlogbyid"></input>
        <input type="button" class="btn" value="根据角色名" id="showlogbychar"></input>
    </div>
        <div>
            ${makeCheckbox('logDefense', '记录防守')}
            ${makeCheckbox('showDefense', '默认显示防守')}
        </div>
        <input type="button" class="btn" value="设置" id="showConfig"></input>
            <dialog id="userQueryDialog">
        <form method="dialog">
            <input type="checkbox" id="userRegexQuery" style="width: 20px;">包含该词</input>
            <input autofocus class="username"></input>
            <div>
                <button class="cancelBtn">Cancel</button>
                <button class="confirmBtn">Confirm</button>
            </div>
        </form>
    </dialog>
    <dialog id="charQueryDialog">
        <form method="dialog">
            <input required type="number" value="7" id="daylimit" style="width: 40px;">天内</input>
            <input autofocus class="char" style="width: 40px;margin-right:15px;"></input>
            <div>
                <button class="cancelBtn">Cancel</button>
                <button class="confirmBtn">Confirm</button>
            </div>
        </form>
    </dialog>
    <dialog id="configDialog">
        <form method="dialog">
            <div>
                <div>
                ${makeCheckbox('showSM', '记录显示系数')}
                ${makeCheckbox('showcharlv', '记录显示等级')}
                ${makeCheckbox('showRank', '记录显示段位')}
                </div>
                <div>
                </div>
                <div>
                    <input type="checkbox" id="showExtrainfo" style="width: 20px;">显示额外信息</input>
                </div>
                <div class="hidden" id="extrainfo">
                    <input type="checkbox" id="showArmor" style="width: 20px;">防具</input>
                    <input type="checkbox" id="showDamage" style="width: 20px;">伤害比例</input>
                    <input type="checkbox" id="showAttr" style="width: 20px;">加点</input>
                    <input type="checkbox" id="showHalo" style="width: 20px;">光环</input>
                </div>
                <button class="cancelBtn">Cancel</button>
            </div>
        </form>
    </dialog>
</div>
    
<div>
    <input type="button" class="btn" value="导出历史" id="exportlog"></input>
    <span style="width:20px;display: inline-block;"></span>
    <input type="button" class="btn" value="导入历史" id="importlog"></input>
    </div>
    <dialog id="importDialog">
        <form method="dialog">
            lastQuery(如果未开启记录防御功能，可保持为空):</br><input autofocus class="lastQuery" style="width:600px;margin-right:15px;"></input></br>
        导入历史：<input type="file" class="btn log" value="导入历史" accept=".ggzjson" style="width: 90px;height:32px;display: inline-block;"></input>
            <div>
                <button class="cancelBtn">Cancel</button>
                <button class="confirmBtn">Confirm</button>
            </div>
        </form>
    </dialog>
    <dialog id="exportDialog">
        <form method="dialog">
            lastQuery(如果开启了记录防御功能，请复制以下语句):</br><input autofocus class="lastQuery" style="width:600px;margin-right:15px;"></input>
            <div>
                <button class="cancelBtn">Cancel</button>
                <button class="confirmBtn">Copy</button>
            </div>
        </form>
    </dialog>
    <div>
        <input type="button" class="btn btn-danger" value="手动删除记录" id="deletelog"></input>
    </div>
        `;
    goxpanelExtend.setAttribute('id','goxpanelExtend');
    goxpanelExtend.style.setProperty('max-width', (document.body.clientWidth-1300)/2+'px');

    $('#showTop').click(async function(){
        let during = parseInt($('#TopDuring')[0].value);
        let num = parseInt($('#TopNum')[0].value);
        if(!(during>0)) return;
        if(!(num>0)) return;
        await table_date_set(during,num);
        $('#chartParent').fadeIn();
        mask.style.display = 'block';
    });

    $('body')[0].appendChild(mask);
    mask.setAttribute('id','mask');
    mask.addEventListener('click', function(){
        $('.tc_xs').fadeOut();
        $('#chartParent').fadeOut();
        mask.style.display = 'none';
    });
    $('body')[0].appendChild(detaillogpanel);
    detaillogpanel.setAttribute('class','tc_xs');
    detaillogpanel.setAttribute('style','display: none;overflow-y:auto;');
    $('body')[0].appendChild(copydiv);
    copydiv.setAttribute('style','opacity: 0;max-height:0;max-width:0;');

    let now = getLocDate();
    $('#date').datetime({
        type: 'date',
        value: [now.getFullYear(), now.getMonth()+1, now.getDate()],
        active:await getDaysOfLog(),
        success: async function (res) {
            let text = await setDetaillogpanelByday(res);
            setDetaillogpanel(text, res.slice(5));
        }
    });

    function initCheckbox(checkid){
        $('#'+checkid).prop('checked', config[checkid]);
        $('#'+checkid).change(function(){
            if (this.checked === true){
                config[checkid] = true;
            }else{
                config[checkid] = false;
            }
            saveConfig();
        });
    }
    $('#showExtrainfo').prop('checked', config['showExtrainfo']);
    if (config['showExtrainfo']){
        $('#extrainfo').removeClass('hidden');
    }
    $('#showExtrainfo').change(function(){
        if (this.checked === true){
            config.showExtrainfo = true;
            $('#extrainfo').removeClass('hidden');
        }else{
            config.showExtrainfo = false;
            $('#extrainfo').addClass('hidden');
        }
        saveConfig();
    });
    for(let checkboxid of checkboxids){
        initCheckbox(checkboxid);
    }

    $('#deletelog').click(async function(){
        let dayss = parseInt(prompt('将多少天以前的战斗记录清除？\n警告：删除的记录无法恢复，假如填0将删除所有记录'));
        if(!isNaN(dayss)&&dayss>=0){
            await autodeletelog(dayss);
            alert('清除完成，请刷新');
        }else{
            alert('输入错误或取消操作');
        }
    });

    let checkboxText = `<div>${makeCheckbox('showdefense', '显示防御记录')}
        ${makeCheckbox('showattack', '显示进攻记录')}
        ${makeCheckbox('hidename', '隐藏对手名')}`;
    function setDetaillogpanel(text, date = ''){
        let dateEle = '';
        if(date !== ''){
            dateEle = `<strong style='color:#03a2b6; margin-left:20px; font-size:15px;'>${date}</strong>`;
        }
        detaillogpanel.innerHTML = checkboxText+ dateEle + '</dlv>' + text;
        $('.nameandlevel').click(function(){
            $(this).next().toggle(200);
        });
        initDetailCheck('attack', true);
        initDetailCheck('defense', config.showDefense);
        $('#hidename').prop('checked', false);
        $('#hidename').change(function (){
            if(this.checked){
                $('.enemyname').addClass('namecover');
            } else {
                $('.enemyname').removeClass('namecover');
            }
        });
        if(!config.showDefense){
            $('.defense').hide();
        }
        $('[data-toggle="tooltip"]').tooltip();
        $('.tc_xs').fadeIn();
        mask.style.display = 'block';
    }
    function initDetailCheck(prop, value){
        $('#show'+prop).prop('checked', value);
        $('#show'+prop).change(function (){
            if(this.checked){
                $('.'+prop).show();
            } else {
                $('.'+prop).hide();
            }
        });
    }

    $('#daylimit').val(config.queryMaxDay);
    async function userQuery(){
        let searchname = $('#userQueryDialog .username').val();
        let userRegexQuery = config.userRegexQuery;
        if(searchname!=='' && searchname !== null){
            let text = '';
            if(userRegexQuery){
                text = await setDetaillogpanelBynameRegex(searchname);
            } else {
                text = await setDetaillogpanelByname(searchname);
            }
            setDetaillogpanel(text);
        }
    }
    async function charQuery(){
        let searchname = $('#charQueryDialog .char').val();
        let limitday = parseInt($('#daylimit').val());
        if(!isNaN(limitday) && limitday !== config.queryMaxDay){
            config.queryMaxDay = limitday;
            saveConfig();
        }
        if(searchname!=='' && searchname !== null && !isNaN(limitday)){
            let text = await setDetaillogpanelBychar(searchname, limitday);
            setDetaillogpanel(text);
        }
    }

    function initQueryDialog(dialogid, btnid, sumbitfunc){
        const queryDialog = document.getElementById(dialogid);
        $('#'+btnid).click(()=>queryDialog.showModal());
        $('#'+dialogid+' .cancelBtn').click(()=>queryDialog.close());
        $('#'+dialogid+' .confirmBtn').click(sumbitfunc);
        $('#'+dialogid).on('keypress',(e) => {
            if(e.which === 13) sumbitfunc();
        });
    }
    initQueryDialog('userQueryDialog', 'showlogbyid', userQuery);
    initQueryDialog('charQueryDialog', 'showlogbychar', charQuery);
    initQueryDialog('importDialog', 'importlog', importLog);
    initQueryDialog('exportDialog', 'exportlog', exportLog);
    const configDialog = document.getElementById('configDialog');
    initQueryDialog('configDialog', 'showConfig', configDialog.close);

    $('#exportlog').click(async function(){
        $('#exportDialog .lastQuery').attr('value', localStorage.getItem('lastQuery_Battlelog'));
        let dbblob = await db.export();
        download(dbblob,'韭菜收割机历史数据.ggzjson');
    });
    async function exportLog(){
        let lastQueryRaw = $('#exportDialog .lastQuery').val();
        navigator.clipboard.writeText(lastQueryRaw);
        alert('lastQuery信息已存入剪切板');
    }
    async function importLog(){
        let lastQueryRaw = $('#importDialog .lastQuery').val();
        let fileInput = $('#importDialog .log')[0];
        if(lastQueryRaw !== '' && fileInput.files && fileInput.files[0]){
            if(await dealLastQuery(lastQueryRaw) === false){
                return;
            }
        }
        if(fileInput.files && fileInput.files[0]){
            let file = fileInput.files[0];
            await db.import(file,{overwriteValues: true});
            alert('导入完毕，请刷新');
        }
    }
    async function dealLastQuery(lastQueryRaw){
        let lastQuery;
        try{
            lastQuery = JSON.parse(lastQueryRaw);
        } catch (err){
            alert(err);
            return false;
        }
        if(typeof lastQuery.queryTime !== 'string' || typeof lastQuery.recordTime !== 'string' || typeof lastQuery.order !== 'number'){
            alert('lastQuery项错误');
            return false;
        }
        lastQuery.queryTime = new Date(lastQuery.queryTime);
        lastQuery.recordTime = new Date(lastQuery.recordTime);
        if(isNaN(lastQuery.queryTime.valueOf()) || isNaN(lastQuery.recordTime.valueOf())){
            alert('lastQuery时间错误');
            return false;
        }
        await deleteDefensePastday();
        localStorage.setItem('lastQuery_Battlelog', lastQueryRaw);
    }

    if(localStorage.getItem('smalldiv')=='true'){
        dosmalldiv();
    }
}


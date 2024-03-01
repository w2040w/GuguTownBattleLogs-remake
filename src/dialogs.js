export {makeDialogs, makeCheckbox, makeDetaillogPanel, makeTable};

let userQueryDialog = `
<input type="checkbox" id="userRegexQuery" style="width: 20px;">包含该词</input>
<input autofocus class="username"></input>
<div>
    <button class="cancelBtn">Cancel</button>
    <button class="confirmBtn">Confirm</button>
</div>
`;

let charQueryDialog = `
<input required type="number" value="7" id="daylimit" style="width: 40px;">天内</input>
<input autofocus class="char" style="width: 40px;margin-right:15px;"></input>
<div>
    <button class="cancelBtn">Cancel</button>
    <button class="confirmBtn">Confirm</button>
</div>
`;

let configDialog = `
<div>
            ${makeCheckbox('logDefense', '记录防守')}
        </div>
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
`;

let importDialog = `
            lastQuery(如果未开启记录防御功能，可保持为空):</br><input autofocus class="lastQuery" style="width:600px;margin-right:15px;"></input></br>
        导入历史：<input type="file" class="btn log" value="导入历史" accept=".ggzjson" style="width: 90px;height:32px;display: inline-block;"></input>
        <div>
            <button class="cancelBtn">Cancel</button>
            <button class="confirmBtn">Confirm</button>
        </div>
`;

let exportDialog = `
            lastQuery(如果开启了记录防御功能，请复制以下语句):</br><input autofocus class="lastQuery" style="width:600px;margin-right:15px;"></input>
        <div>
            <button class="cancelBtn">Cancel</button>
            <button class="confirmBtn">Copy</button>
        </div>
`;
const dialogs = new DocumentFragment();
const body = $('body')[0];

function makeDialog(inner, id, dialogs, exclass = ''){
    let dialog = document.createElement('dialog');
    dialog.innerHTML = `<div class="innerDialog ${exclass}">${inner}</div>`;
    dialog.setAttribute('id', id);
    dialog.addEventListener('click', (e) => {
        if (e.target.tagName === 'DIALOG') {
            e.target.close();
        }
    });
    dialogs.appendChild(dialog);
    return dialog;
}
function makeSelectDialog(inner, id){
    makeDialog(`<form method="dialog">${inner}</form>`, id, dialogs);
}
function makeDetaillogPanel(){
    return makeDialog('', '', body, 'tc_xs');
}
function makeCheckbox(id, desc){
    return `<span class="selectLog"><input type="checkbox" id="${id}" style="width: 20px;">${desc}</input></span>`;
}

function makeTable(){
    let tableHtml = '<canvas id="battleCountChart"></canvas>';
    makeDialog(`<div id="chartParent">${tableHtml}</div>`, 'chartDialog', body);
    let obj = document.getElementById('chartParent');
    let ctx = document.createElement('battleCountChart');
    chartssize(obj, ctx);
}
//参数container为图表盒子节点.charts为图表节点
function chartssize (container,charts) {
    function getStyle(el, name) {
        if (window.getComputedStyle) {
            return window.getComputedStyle(el, null);
        } else {
            return el.currentStyle;
        }
    }
    let wi = getStyle(container, 'width').width;
    let hi = getStyle(container, 'height').height;
    charts.style.width = wi;
    charts.style.height = hi;
}

function makeDialogs(){
    makeSelectDialog(userQueryDialog, 'userQueryDialog');
    makeSelectDialog(charQueryDialog, 'charQueryDialog');
    makeSelectDialog(configDialog, 'configDialog');
    makeSelectDialog(importDialog, 'importDialog');
    makeSelectDialog(exportDialog, 'exportDialog');
    return dialogs;
}

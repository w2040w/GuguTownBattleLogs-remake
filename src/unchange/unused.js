let rl = window.location.href;
let g_safeid = get_safeid();

let sleep = (ms) => {
    // Unit is ms
    return new Promise(resolve => setTimeout(resolve, ms));
};

function get_safeid(){
    return getPostData(/gox\(\)\{[\s\S]*\}/m,/data: ".*"/).slice(-7,-1);
}
function getPostData(p1,p2){
    let data = -1;
    for(let s of document.getElementsByTagName('script')){
        let func = s.innerText.match(p1);
        if(func!=null){
            data = func[0].match(p2)[0];
            break;
        }
    }
    return data;
}

function dictsort(dic){
    let res = Object.keys(dic).sort(function(a,b){
        return b-a;
    });
    for(let key in res){
        console.log('key: ' + res[key] + ' ,value: ' + dic[res[key]].score);
    }
}

function html_encode(str) {
    let s = '';
    if (str.length == 0) return '';
    s = str.replace(/&/g, '&amp;');
    s = s.replace(/</g, '&lt;');
    s = s.replace(/>/g, '&gt;');
    s = s.replace(/ /g, '&nbsp;');
    s = s.replace(/\'/g, '&#39;');
    s = s.replace(/\"/g, '&quot;');
    s = s.replace(/\n/g, '<br/>');
    return s;
}

function formatStringLen(strVal, len, padChar){
    padChar = padChar || '*';
    if (!strVal) {
        return padChar.repeat(len);
    } else {
        const strLen = strVal.gblen();
        if (strLen > len){
            return strVal.substring(0, len);
        } else if (strLen < len){
            let mylen = len - strLen;
            return strVal + padChar.repeat(mylen);
        }else{
            return strVal;
        }
    }
}

function html_decode(str) {
    let s = '';
    if (str.length == 0) return '';
    s = str.replace(/&amp;/g, '&');
    s = s.replace(/&lt;/g, '<');
    s = s.replace(/&gt;/g, '>');
    s = s.replace(/&nbsp;/g, ' ');
    s = s.replace(/&#39;/g, '\'');
    s = s.replace(/&quot;/g, '"');
    s = s.replace(/<br\/>/g, '\n');
    return s;
}

function getLocDay(){//返回当前日期的Date变量
    let daystr = getDateString(getLocDate());
    return new Date(new Date(daystr).getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);
}


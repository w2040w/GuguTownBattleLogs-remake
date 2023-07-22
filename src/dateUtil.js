export {getLocDate, getDateString};

function getLocDate(aparam){//不传参，返回当前时间的Date变量;该方法用来代替new Date
    let thisDate;
    if (typeof(aparam) == 'undefined') {
        thisDate = new Date();
    }else{
        thisDate = new Date(aparam);
    }
    //本地时间 + 本地时间与格林威治时间的时间差 + GMT+8与格林威治的时间差
    return new Date(thisDate.getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);
}

function getDateString(thisDate){//将传入的时间戳转换为年月日字符串
    return thisDate.getFullYear() + '/' + (thisDate.getMonth()+1) + '/' + thisDate.getDate();
}


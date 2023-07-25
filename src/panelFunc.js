export {dosmalldiv, download, table_date_set, banbattletypefunc};
import {getDateString} from './dateUtil';
import {queryDuring} from './db';
import {banpveFlag, banpvpFlag} from './config';

/* global Chart */
function banbattletypefunc(){
    if(banpveFlag){
        $('.fyg_lh30:eq(1)').addClass('disabled');
    }else{
        $('.fyg_lh30:eq(1)').removeClass('disabled');
    }
    if(banpvpFlag){
        $('.fyg_lh30:eq(0)').addClass('disabled');
    }else{
        $('.fyg_lh30:eq(0)').removeClass('disabled');
    }
}

function dosmalldiv(){
    if($('.smalldiv').css('display')=='none'){
        $('#goxpanel').css('min-width','280px');
        $('#goxpanel').css('width','20%');
        $('#smallbar').text('<');
        localStorage.setItem('smalldiv','false');
    }else{
        $('#goxpanel').css('min-width','unset');
        $('#goxpanel').css('width','50px');
        $('#smallbar').text('>');
        $('#goxpanelExtend').hide();
        localStorage.setItem('smalldiv','true');
    }
    $('.smalldiv').toggle();
}

function download(downfile,name) {
    const tmpLink = document.createElement('a');
    const objectUrl = URL.createObjectURL(downfile);
    tmpLink.href = objectUrl;
    tmpLink.download = name;
    tmpLink.click();
    URL.revokeObjectURL(objectUrl);
}

async function table_date_set(during,num){
    let count_result = await count_battle(during);
    let enemy_sum = count_result[0];
    let enemy_sum_top_list = count_result[1].slice(0, num);
    let wincount_list = [],losecount_list = [],tiecount_list = [];
    for(let enemy_sum_top_item in enemy_sum_top_list){
        wincount_list.push(enemy_sum[enemy_sum_top_list[enemy_sum_top_item]][1]);
        losecount_list.push(enemy_sum[enemy_sum_top_list[enemy_sum_top_item]][2]);
        tiecount_list.push(enemy_sum[enemy_sum_top_list[enemy_sum_top_item]][0]-enemy_sum[enemy_sum_top_list[enemy_sum_top_item]][1]-enemy_sum[enemy_sum_top_list[enemy_sum_top_item]][2]);
    }

    $('#battleCountChart').remove();
    $('#chartParent').append('<canvas id="battleCountChart"></canvas>');
    let ctx = document.getElementById('battleCountChart');
    ctx.style.backgroundColor = 'rgba(250,250,250,150)';
    let linedata = {
        labels: enemy_sum_top_list,
        datasets: [{
            type: 'bar',
            data: losecount_list,
            backgroundColor: '#7fe6ef'
        },{
            type: 'bar',
            data: wincount_list,
            backgroundColor: '#ea8c7c'
        },{
            type: 'bar',
            data: tiecount_list,
            backgroundColor: '#DCDCDC'
        }]
    };

    let myChart = new Chart(ctx, {
        type: 'bar',
        data: linedata,
        options: {
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero:true,
                        stepSize: 1
                    }
                }]
            },
            responsive:true,
            maintainAspectRatio: false,
            title:{
                display:true,
                text:'遇到最多的人TOP' + num,
                fontSize:25
            },
            legend: {
                display: false,

            },
            tooltips: {
                intersect:false,
                displayColors:false,
                callbacks: {
                    label: function(tooltipItem, data) {
                        let enemy_name = tooltipItem.label;
                        let battle_sum = enemy_sum[enemy_name][0];
                        let win_sum = enemy_sum[enemy_name][1];

                        let label = ['战斗次数：'+battle_sum , '获胜次数：'+win_sum, '战斗日期：↓'];
                        for(let i in enemy_sum[enemy_name][3]){
                            label.push('  ' + enemy_sum[enemy_name][3][i]);
                        }
                        return label;
                    }
                }
            }
        }
    });
}
async function count_battle(during){
    let battlelog = await queryDuring(during);
    let enemy_sum = {};
    for(let log of battlelog){
        let name = log.enemyname;
        let isWin = log.isWin;
        let a = enemy_sum[name];
        if(a==undefined){//该对手第一次出现
            enemy_sum[name] = [1,isWin===true?1:0,isWin===false?1:0,[getDateString(log.time)]]; //[总场次，胜场，败场，时间]
        }else{
            enemy_sum[name][0]++;
            enemy_sum[name][1]+=isWin===true?1:0;
            enemy_sum[name][2]+=isWin===false?1:0;
            enemy_sum[name][3].push(getDateString(log.time));
        }
    }
    let listSort = Object.keys(enemy_sum).sort(function(a,b){
        return enemy_sum[b][0]-enemy_sum[a][0];
    });

    return [enemy_sum,listSort];
}

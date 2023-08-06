var test=require('./test.json');
var ac=JSON.parse(test._ver_list[0].action_config)
var ci0=ac[1].ctrl_items[0]
for(var i in ac){
    if(i>=10){
        ac[i].ctrl_items=[];
        ci0.params.data=parseInt(i).toString(16).toUpperCase();
        ac[i].ctrl_items[0]=ci0;
    }
    console.log(ac[i].ctrl_items)
}
test._ver_list[0].action_config=ac;
var strx=JSON.stringify(ac);
console.log(strx.match(/c/n))
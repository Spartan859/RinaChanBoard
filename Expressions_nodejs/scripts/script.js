var pixel_html_str='';
var len=18,hei=16;

for(var i=1;i<=hei;i++){
    pixel_html_str+="<div class=\"box"+i+"\">"
    for(var j=1;j<=len;j++){
        pixel_html_str+="<div class=\"left\" id=\"pixel_"+(i)+'_'+(j)+"\" data-x=\""+i+"\"data-y=\""+j
        +"\"><p class=\"p\" id=\"pid_"+(i)+'_'+(j)+"\">0</p></div>"
    }
    pixel_html_str+="<div style=\"clear:both;\"></div>"+"</div>"+'\n'
}

var reader,csvFile,file;
var id_matrix=new Array(100);
for(var i=0;i<100;i++) id_matrix[i]=new Array(100).fill(0);
var show_stat=1;
var mode_sel=0;
var stx,sty,edx,edy;

var sel_matrix=id_matrix;
var reIdMatrix=[new Array(10000),new Array(10000)];
var dict_expressions={"eye_left":[],"eye_right":[],"cheek":[],"mouth":[]};
var categories_expressions=['eye_left','eye_right','cheek','mouth'];

var output_selected=function(catName,expName){
    var res=[];
    for(var i=stx;i<=edx;i++)
        for(var j=sty;j<=edy;j++){
            //console.log(sel_matrix[i][j]);
            if(sel_matrix[i][j]==1){
                //res=res+id_matrix[i-1][j-1]+',';
                res.push(id_matrix[i-1][j-1]);
                //console.log(i,j,id_matrix[i-1][j-1]);
            }
        }
    //res=res.substring(0,res.length-1);
    console.log("res: ",res);
    dict_expressions[catName][expName]=res;
    updResultFromDict();
    updDivExp(catName);
}
var erase_selected=function(){
    for(var i=stx;i<=edx;i++)
        for(var j=sty;j<=edy;j++){
            sel_matrix[i][j]=0;
            $('#pixel_'+i+'_'+j).css('background-color','white');
        }
}

var erase_all=function(){
    console.log("erasing all");
    for(var i=1;i<=hei;i++)
        for(var j=1;j<=len;j++){
            sel_matrix[i][j]=0;
            $('#pixel_'+i+'_'+j).css('background-color','white');
        }
}

var setOn=function(x,y){
    sel_matrix[x][y]=1;
    $('#pixel_'+x+'_'+y).css('background-color','red');
}
async function updExpCsv(res){
    id_matrix=await neatCsv(res);
    for(var i=1;i<=hei;i++)
        for(var j=1;j<=len;j++){
            if(id_matrix[i-1][j-1]=='') id_matrix[i-1][j-1]=-1;
            id_matrix[i-1][j-1]=parseInt(id_matrix[i-1][j-1]); 
            reIdMatrix[0][id_matrix[i-1][j-1]]=i;
            reIdMatrix[1][id_matrix[i-1][j-1]]=j;
            document.getElementById('pid_'+(i)+'_'+(j)).innerHTML=id_matrix[i-1][j-1];
        }
}

function getInitCsv() {
    let file_url =window.location.href+'RinaInit.csv';
    let xhr = new XMLHttpRequest();
    xhr.open("get", file_url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
      if (this.status == 200) {
        // if (callback) {
        // callback();
        //console.log(this.response)
        const reader = new FileReader()
        reader.onload = function () {
            updExpCsv(reader.result);
        }
        reader.readAsText(this.response);
      }
    };
    xhr.send();
}
function updDivExp(catName){
    contentList=dict_expressions[catName];
    $('#'+catName).html('');
    for(var expName in contentList){
        console.log(expName);
        var expButton=document.createElement('button');
        expButton.id=expName;
        expButton.setAttribute('data-catname',catName);
        expButton.innerHTML=expName;
        expButton.onclick=function(){
            var expId=this.id;
            console.log('click'+expId)
            var catName=this.getAttribute('data-catname');
            var ledList=dict_expressions[catName][expId];
            for(var i in ledList){
                ledId=ledList[i];
                setOn(reIdMatrix[0][ledId],reIdMatrix[1][ledId]);
            }
        }
        document.getElementById(catName).appendChild(expButton);
    }
}

function updDictExpressions(jsonStr){
    console.log(jsonStr);
    jsonStr.replace(/'/g, '"');
    dict_expressions=JSON.parse(jsonStr);
    console.log(dict_expressions);
    for(var i in categories_expressions){
        var catName=categories_expressions[i];
        console.log(catName);
        updDivExp(catName);
    }
}
function updResultFromDict(){
    $('#results').html(JSON.stringify(dict_expressions));
}

window.onload=function(){
    document.getElementById("bigbox").innerHTML=pixel_html_str;
    getInitCsv();
    reader=new FileReader();
    reader.onload=function(){
        updExpCsv(reader.result);
    }
    csvFile=document.querySelector('#import_csv');
    csvFile.onchange=function(){
        file=csvFile.files[0];
        reader.readAsText(file);
    }

    showidbtn=document.querySelector('#show_id');
    showidbtn.onclick=function(){
        if(show_stat==1){
            for(var i=1;i<=hei;i++)
                for(var j=1;j<=len;j++){
                    document.getElementById('pid_'+(i)+'_'+(j)).innerHTML='';
                }
            show_stat=0;
        }else{
            for(var i=1;i<=hei;i++)
                for(var j=1;j<=len;j++){
                    document.getElementById('pid_'+(i)+'_'+(j)).innerHTML=id_matrix[i-1][j-1];
                }
            show_stat=1;
        }
    }

    for(var i=1;i<=hei;i++)
        for(var j=1;j<=len;j++){
            $('#pixel_'+i+'_'+j).click(function(){
                var x=parseInt($(this).attr('data-x'));
                var y=parseInt($(this).attr('data-y'));
                if(mode_sel==1){
                    stx=x;sty=y;
                    mode_sel=2;
                    return;
                }
                if(mode_sel==2){
                    edx=x;edy=y;
                    return;
                }
                sel_matrix[x][y]^=1;
                if(sel_matrix[x][y]==1) $(this).css("background-color", "red");
                else $(this).css("background-color", "white");
                //console.log(x,y,sel_matrix[x][y]);
            });
        }
    
    $('#select_area').click(function(){
        if(mode_sel!=0) return;
        mode_sel=1;
        $(this).css("background-color","red");
    })

    $('#output_area').click(function() { 
        mode_sel=0;
        $("#select_area").css("background-color","silver");
        output_selected($('#exp_category').val(),$('#exp_name').val());
    });

    $('#erase_area').click(function(){
        mode_sel=0;
        $("#select_area").css("background-color","silver");
        erase_selected();
    })

    $('#import_json').change(function (e) { 
        let json_reader=new FileReader();
        json_reader.onload=function(){
            updDictExpressions(this.result);
            updResultFromDict();
        }
        json_reader.readAsText($(this).prop('files')[0]);
    });

    $('#erase_all').click(function(){erase_all();})
}






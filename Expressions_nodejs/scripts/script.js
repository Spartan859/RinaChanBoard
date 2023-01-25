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

var output_selected=function(){
    var res="";
    for(var i=stx;i<=edx;i++)
        for(var j=sty;j<=edy;j++){
            //console.log(sel_matrix[i][j]);
            if(sel_matrix[i][j]==1){
                res=res+id_matrix[i-1][j-1]+',';
                //console.log(i,j,id_matrix[i-1][j-1]);
            }
        }
    res=res.substring(0,res.length-1);
    console.log("res: ",res);
    $('#results').val(res);
}
var erase_selected=function(){
    for(var i=stx;i<=edx;i++)
        for(var j=sty;j<=edy;j++){
            sel_matrix[i][j]=0;
            $('#pixel_'+i+'_'+j).css('background-color','white');
        }
}

window.onload=function(){
    document.getElementById("bigbox").innerHTML=pixel_html_str;
    reader=new FileReader();
    reader.onload=async function(){
        id_matrix=await neatCsv(reader.result);
        console.log(id_matrix[0][2])
        for(var i=1;i<=hei;i++)
            for(var j=1;j<=len;j++){
                document.getElementById('pid_'+(i)+'_'+(j)).innerHTML=id_matrix[i-1][j-1];
            }
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
                console.log(x,y,sel_matrix[x][y]);
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
        output_selected();
    });

    $('#erase_area').click(function(){
        mode_sel=0;
        $("#select_area").css("background-color","silver");
        erase_selected();
    })
}






import React, {forwardRef, useEffect, useImperativeHandle, useState,useRef } from "react";
import {View,Dimensions} from 'react-native';
import {WebView} from 'react-native-webview'
import { styles } from "./Styles";
import { id_to_coordinate } from "./ManualScreen";
import { exp_matrix_ori } from "./BleTest";
import { ExportExp } from "./CustomExp";

var exp_matrix=exp_matrix_ori;


const screen = Dimensions.get("screen");

const ExpWebview=forwardRef((props,ref)=>{
    const board_ref=useRef(null);
    function setPixel(x,y,tp){
        var run="setPixel("+x.toString()+','+y.toString()+','+tp.toString()+')';
        board_ref.current.injectJavaScript(run);
    }
    const setExp=(catName,expId,tp)=>{
        //console.log(exp_matrix[catName][expId])
        expId=parseInt(expId);
        for(var i in exp_matrix[catName][expId]){
            pixel_id=exp_matrix[catName][expId][i];
            setPixel(id_to_coordinate[0][pixel_id],id_to_coordinate[1][pixel_id],tp);
        }
        //console.log(screen.width);
    }
    const startSel=()=>{
        var run="start_sel();";
        board_ref.current.injectJavaScript(run);
    }
    const outputSel=()=>{
        var run="output_selected();";
        board_ref.current.injectJavaScript(run);
    }
    const outputAll=()=>{
        var run="output_all();";
        board_ref.current.injectJavaScript(run);
    }
    const eraseAll=()=>{
        var run="erase_all();";
        board_ref.current.injectJavaScript(run);
    }
    useImperativeHandle(ref,()=>({
        setExp,
        startSel,
        outputSel,
        outputAll,
        eraseAll,
    }));
    const run_generate='generate_screen();';
    return (
        <WebView
            ref={board_ref}
            style={{
                flex: 1,
                width: screen.width,
                //height: screen.height*0.86/1.86,
            }}
            //injectedJavaScript={run_generate}
            onMessage={ExportExp}
            source={{html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8"> 
                <title>RinaBoard Expressions</title>
                <style type="text/css">
                    .left{ float:left; border:1px solid #ccc;}
                    .p{color:green;font-size:5px;}
                </style>
            </head>

            <div id="bigbox"></div>
            <script>
                var len=18,hei=16;
                var reader,csvFile,file;
                var id_matrix=JSON.parse(\`
                [{"0":-1,"1":-1,"2":38,"3":39,"4":70,"5":71,"6":102,"7":103,"8":134,"9":135,"10":166,"11":167,"12":198,"13":199,"14":230,"15":231,"16":-1,"17":-1},{"0":-1,"1":10,"2":37,"3":40,"4":69,"5":72,"6":101,"7":104,"8":133,"9":136,"10":165,"11":168,"12":197,"13":200,"14":229,"15":232,"16":259,"17":-1},{"0":9,"1":11,"2":36,"3":41,"4":68,"5":73,"6":100,"7":105,"8":132,"9":137,"10":164,"11":169,"12":196,"13":201,"14":228,"15":233,"16":258,"17":260},{"0":8,"1":12,"2":35,"3":42,"4":67,"5":74,"6":99,"7":106,"8":131,"9":138,"10":163,"11":170,"12":195,"13":202,"14":227,"15":234,"16":257,"17":261},{"0":7,"1":13,"2":34,"3":43,"4":66,"5":75,"6":98,"7":107,"8":130,"9":139,"10":162,"11":171,"12":194,"13":203,"14":226,"15":235,"16":256,"17":262},{"0":6,"1":14,"2":33,"3":44,"4":65,"5":76,"6":97,"7":108,"8":129,"9":140,"10":161,"11":172,"12":193,"13":204,"14":225,"15":236,"16":255,"17":263},{"0":5,"1":15,"2":32,"3":45,"4":64,"5":77,"6":96,"7":109,"8":128,"9":141,"10":160,"11":173,"12":192,"13":205,"14":224,"15":237,"16":254,"17":264},{"0":4,"1":16,"2":31,"3":46,"4":63,"5":78,"6":95,"7":110,"8":127,"9":142,"10":159,"11":174,"12":191,"13":206,"14":223,"15":238,"16":253,"17":265},{"0":3,"1":17,"2":30,"3":47,"4":62,"5":79,"6":94,"7":111,"8":126,"9":143,"10":158,"11":175,"12":190,"13":207,"14":222,"15":239,"16":252,"17":266},{"0":2,"1":18,"2":29,"3":48,"4":61,"5":80,"6":93,"7":112,"8":125,"9":144,"10":157,"11":176,"12":189,"13":208,"14":221,"15":240,"16":251,"17":267},{"0":1,"1":19,"2":28,"3":49,"4":60,"5":81,"6":92,"7":113,"8":124,"9":145,"10":156,"11":177,"12":188,"13":209,"14":220,"15":241,"16":250,"17":268},{"0":0,"1":20,"2":27,"3":50,"4":59,"5":82,"6":91,"7":114,"8":123,"9":146,"10":155,"11":178,"12":187,"13":210,"14":219,"15":242,"16":249,"17":269},{"0":-1,"1":21,"2":26,"3":51,"4":58,"5":83,"6":90,"7":115,"8":122,"9":147,"10":154,"11":179,"12":186,"13":211,"14":218,"15":243,"16":248,"17":-1},{"0":-1,"1":22,"2":25,"3":52,"4":57,"5":84,"6":89,"7":116,"8":121,"9":148,"10":153,"11":180,"12":185,"13":212,"14":217,"15":244,"16":247,"17":-1},{"0":-1,"1":23,"2":24,"3":53,"4":56,"5":85,"6":88,"7":117,"8":120,"9":149,"10":152,"11":181,"12":184,"13":213,"14":216,"15":245,"16":246,"17":-1},{"0":-1,"1":-1,"2":-1,"3":54,"4":55,"5":86,"6":87,"7":118,"8":119,"9":150,"10":151,"11":182,"12":183,"13":214,"14":215,"15":-1,"16":-1,"17":-1}]
                \`);
                //
                var mode_sel=0;
                var stx=2,sty=2,edx=1,edy=1;
                var show_stat=1;

                var sel_matrix=[];
                for(var i=0;i<100;i++) sel_matrix[i]=new Array(100).fill(0);

                var reIdMatrix=[new Array(10000),new Array(10000)];
                var dict_expressions={"eye_left":[],"eye_right":[],"cheek":[],"mouth":[]};
                var categories_expressions=['eye_left','eye_right','cheek','mouth'];

                var generate_screen=function(){
                    console.log(sel_matrix)
                    pixel_width=window.innerWidth/len-4;
                    //pixel_width=500/len-4;
                    pixel_height=25.17/27.86*pixel_width;
                    console.log(pixel_width);
                    div_bigbox=document.getElementById("bigbox");
                    for(var i=1;i<=hei;i++){
                        var div_boxi=document.createElement("div");
                        
                        for(var j=1;j<=len;j++){
                            //pixel_html_str+="<div class=\"left\" id=\"pixel_"+(i)+'_'+(j)+"\""></div>"
                            var div_pixel=document.createElement("div");
                            div_pixel.setAttribute("class","left");
                            //console.log(pixel_height);
                            div_pixel.style.width=pixel_width+'px';
                            div_pixel.style.height=pixel_height+'px';
                            div_pixel.id="pixel_"+i.toString()+'_'+j.toString();
                            div_pixel.setAttribute("data-x",i.toString());
                            div_pixel.setAttribute("data-y",j.toString());
                            div_boxi.appendChild(div_pixel);
                        }
                        var div_clear=document.createElement("div");
                        div_clear.setAttribute("style","clear:both;");
                        div_boxi.appendChild(div_clear);
                        div_bigbox.appendChild(div_boxi);
                    }
                    for(var i=1;i<=hei;i++)
                        for(var j=1;j<=len;j++){
                            var element=document.getElementById('pixel_'+i.toString()+'_'+j.toString());
                            element.onclick=function(){
                                var x=parseInt(this.getAttribute('data-x'));
                                var y=parseInt(this.getAttribute('data-y'));
                                
                                if(mode_sel==1){
                                    stx=x;sty=y;
                                    mode_sel=2;
                                    this.innerHTML="左上";
                                    return;
                                }
                                if(mode_sel==2){
                                    document.getElementById('pixel_'+edx.toString()+'_'+edy.toString()).innerHTML="";
                                    edx=x;edy=y;
                                    this.innerHTML="右下";
                                    return;
                                }
                                console.log(x,y);
                                sel_matrix[x][y]^=1;
                                if(sel_matrix[x][y]==1) setPixel(x,y,1);
                                else setPixel(x,y,0);
                                //console.log(x,y,sel_matrix[x][y]);
                            }
                        }
                    for(var i=1;i<=hei;i++)
                        for(var j=1;j<=len;j++){
                            if(id_matrix[i-1][j-1]=='') id_matrix[i-1][j-1]=-1;
                            id_matrix[i-1][j-1]=parseInt(id_matrix[i-1][j-1]); 
                            reIdMatrix[0][id_matrix[i-1][j-1]]=i;
                            reIdMatrix[1][id_matrix[i-1][j-1]]=j;
                            //document.getElementById('pixel_'+(i)+'_'+(j)).innerHTML=id_matrix[i-1][j-1];
                        }
                }
                
                var output_selected=function(){
                    if(stx>edx||sty>edy){
                        window.ReactNativeWebView.postMessage("ERR");
                        return;
                    }
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
                    document.getElementById('pixel_'+stx.toString()+'_'+sty.toString()).innerHTML="";
                    document.getElementById('pixel_'+edx.toString()+'_'+edy.toString()).innerHTML="";
                    mode_sel=0;
                    window.ReactNativeWebView.postMessage(JSON.stringify(res));
                    console.log("res: ",res);
                }
                var output_all=function(){
                    var res=[];
                    for(var i=1;i<=hei;i++)
                        for(var j=1;j<=len;j++){
                            //console.log(sel_matrix[i][j]);
                            if(sel_matrix[i][j]==1){
                                //res=res+id_matrix[i-1][j-1]+',';
                                res.push(id_matrix[i-1][j-1]);
                                //console.log(i,j,id_matrix[i-1][j-1]);
                            }
                        }
                    //res=res.substring(0,res.length-1);
                    window.ReactNativeWebView.postMessage(JSON.stringify(res));
                    console.log("res: ",res);
                }
                var erase_selected=function(){
                    for(var i=stx;i<=edx;i++)
                        for(var j=sty;j<=edy;j++){
                            setPixel(i,j,0);
                        }
                }

                var erase_all=function(){
                    console.log("erasing all");
                    for(var i=1;i<=hei;i++)
                        for(var j=1;j<=len;j++){
                            setPixel(i,j,0);
                        }
                }
                var start_sel=function(){
                    if(mode_sel!=0) return;
                    mode_sel=1;
                }
                function setPixel(x,y,tp){
                    sel_matrix[x][y]=tp;
                    if(tp==1){
                        var element=document.getElementById('pixel_'+x.toString()+'_'+y.toString());
                        element.style.backgroundColor="red";
                    }else{
                        var element=document.getElementById('pixel_'+x.toString()+'_'+y.toString());
                        element.style.backgroundColor="white";
                    }
                }
                window.onload=function(){
                    setTimeout(generate_screen,1000);
                    
                }
            </script>
            `}}
        />
    );
});

export default ExpWebview;
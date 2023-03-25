import React, {forwardRef, useEffect, useImperativeHandle, useState,useRef } from "react";
import {View,Dimensions} from 'react-native';
import {WebView} from 'react-native-webview'
import { styles } from "./Styles";
import { id_to_coordinate } from "./ManualScreen";
import { exp_matrix } from "./ManualScreen";




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
    useImperativeHandle(ref,()=>({
        setExp,
    }));
    const run_generate='generate_screen();';
    return (
        <WebView
            ref={board_ref}
            style={{
                flex: 1,
                width: screen.width,
            }}
            //injectedJavaScript={run_generate}
            source={{html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8"> 
                <title>RinaBoard Expressions</title>
                <script src="https://cdn.staticfile.org/jquery/3.2.1/jquery.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/@lyo/neat-csv"></script>
                <style type="text/css">
                    .left{ float:left; border:1px solid #ccc;}
                    .p{color:green;font-size:5px;}
                </style>
            </head>
            
            <div id="bigbox"></div>
            <script>
                window.onload=function(){
                    setTimeout(generate_screen,1000);
                }
                var generate_screen=function(){
                    var len=18,hei=16;
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
                            console.log(pixel_height);
                            div_pixel.style.width=pixel_width+'px';
                            div_pixel.style.height=pixel_height+'px';
                            div_pixel.id="pixel_"+i.toString()+'_'+j.toString();
                            div_boxi.appendChild(div_pixel);
                        }
                        var div_clear=document.createElement("div");
                        div_clear.setAttribute("style","clear:both;");
                        div_boxi.appendChild(div_clear);
                        div_bigbox.appendChild(div_boxi);
                    }
                }
                function setPixel(x,y,tp){
                    if(tp==1){
                        $('#pixel_'+x.toString()+'_'+y.toString()).css('background-color', 'red');
                    }else{
                        $('#pixel_'+x.toString()+'_'+y.toString()).css('background-color', 'white');
                    }
                }
                /*
                window.addEventListener('load', function() {
                    setTimeout(function() {
                        // 获取html页面高度
                        var pageHeight = document.body.scrollHeight;
                        // 获取html页面宽度
                        var pageWidth = document.body.clientWidth;
                        // 将高度和宽度回传给RN
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            params: {
                                height: pageHeight,
                                width: pageWidth
                            }
                        }))
                    }, 1000);
                })*/
            </script>
            `}}
        />
    );
});

export default ExpWebview;
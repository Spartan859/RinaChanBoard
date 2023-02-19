import React, { Component, useEffect, useState } from "react";
import {Text,TextInput,StyleSheet,TouchableOpacity,View, Alert,PermissionsAndroid, Dimensions, ScrollView, Image, Button} from 'react-native';
import dgram from 'react-native-udp'
import RNFS from 'react-native-fs'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {WebView} from 'react-native-webview'
import {InitScreen} from './src/InitScreen'
import {getLocalExpFile} from './src/InitScreen'
import { sendUdpDefault } from "./InitScreen";
import CheckBox from "@react-native-community/checkbox";
import { styles } from "./InitScreen";
import { id_to_coordinate } from "../App";
import { exp_matrix } from "../App";
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import DropDownPicker from 'react-native-dropdown-picker';

const FPS=10;
var server="http://101.133.137.243:1101/";

var board_ref;

var exp_all={"eye_left":0,"eye_right":0,"cheek":0,"mouth":0};
const exp_order={"eye_left":0,"eye_right":1,"cheek":3,"mouth":2};

function getExpSendStr(){
    return exp_all['eye_left'].toString()+','+exp_all['eye_right'].toString()
    +','+exp_all['cheek'].toString()
    +','+exp_all['mouth'].toString()+',';
}

function setPixel(x,y,tp){
    var run="setPixel("+x.toString()+','+y.toString()+','+tp.toString()+')';
    board_ref.injectJavaScript(run);
}

function setExp(catName,expId,tp){
    //console.log(exp_matrix[catName][expId])
    for(var i in exp_matrix[catName][expId]){
        pixel_id=exp_matrix[catName][expId][i];
        setPixel(id_to_coordinate[0][pixel_id],id_to_coordinate[1][pixel_id],tp);
    }
}
//var currentTime=0;
var music_player_ref;

var ExpContent={};
var ExpTxtListTmp=[];
var lastFrame=-1;

async function DownloadExpTxt(){
    console.log("Downloading");
    var FileList=await (await fetch('http://101.133.137.243:1101/RinaExpTxtFiles/')).json();
    console.log(FileList)
    ExpTxtListTmp=[];
    ExpContent={};
    for(var i in FileList){
        var str=await (await fetch(server+'RinaExpTxtFiles/'+FileList[i]['name'])).text();
        //console.log(str);
        ExpContent[FileList[i]['name']]={};
        ExpContent[FileList[i]['name']]['FrameList']=[];
        
        var all_Lines=str.trim().split('\n');
        for(var j in all_Lines){
            //console.log(j);
            ExpContent[FileList[i]['name']]['FrameList'][j]=parseInt(all_Lines[j].split('!')[0]);
            ExpContent[FileList[i]['name']][parseInt(all_Lines[j].split('!')[0])]=all_Lines[j].split('!')[1].split(',');
        }
        ExpTxtListTmp[i]={label: FileList[i]['name'].split('.')[0],value: FileList[i]['name']};
    }
    console.log(ExpContent["田中千惠美 - Analogue Heart.mp3.txt"][0]);
}


export default function AutoLive(){
    const screen = Dimensions.get("screen");
    const [ExpTxtList,SetExpTxtList]=useState([]);
    const [openSongSel, setOpenSongSel] = useState(false);
    const [SongSel, setSongSel] = useState("田中千惠美 - Analogue Heart.mp3.txt");
    useEffect(()=>{if(ExpTxtList[0]==null) DownloadExpTxt().then(()=>{SetExpTxtList(ExpTxtListTmp);console.log(ExpTxtList)});})
    function progressMonitor(data){
        var curFrame=data.currentTime*FPS;
        var nowFrame=ExpContent[SongSel]['FrameList'].findLast(element=>element<=curFrame);
        if(nowFrame==lastFrame) return;
        lastFrame=nowFrame;
        //console.log(nowFrame);
        
        var exp_nowFrame=ExpContent[SongSel][nowFrame];
        //console.log(exp_nowFrame);
        
        for(var catName in exp_all){
            //console.log(catName);
            if(exp_nowFrame[exp_order[catName]]=='-1') continue;
            setExp(catName,exp_all[catName],0);
            exp_all[catName]=exp_nowFrame[exp_order[catName]];
            setExp(catName,exp_all[catName],1);
        }
        sendUdpDefault('e'+getExpSendStr())
        //console.log(nextframe);
    }
    return(
        <View style={styles.container}>
            <View style={{flex:0.86}}>
                <WebView
                    ref={(r) => (board_ref = r)}
                    style={{
                        flex: 1,
                        width: screen.width,
                    }}
                    source={{uri: 'https://bing.satintin.com/rina.html'}}
                />
            </View>
            <View style={[styles.container,{flex:0.5,zIndex:2}]}>
                <DropDownPicker
                    //onChangeValue={(value) => console.log(value)}
                    open={openSongSel}
                    value={SongSel}
                    items={ExpTxtList}
                    setOpen={setOpenSongSel}
                    setValue={setSongSel}
                    setItems={SetExpTxtList}
                />
            </View>
            
            <View style={{flex:0.5,zIndex:1}}>
                <VideoPlayer 
                source={{uri: "http://101.133.137.243:1101/"+SongSel.substring(0,SongSel.length-4)}}
                ref={(ref)=>{music_player_ref=ref}}
                onProgress={progressMonitor}
                progressUpdateInterval={20}
                paused={true}
                />
            </View>   
        </View>
    );
}
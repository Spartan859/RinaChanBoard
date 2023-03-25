import React, {useEffect, useState,createRef} from "react";
import {View,Dimensions} from 'react-native';
import {WebView} from 'react-native-webview'
import { sendUdpDefault } from "./InitScreen";
import { styles } from "./Styles";
import ExpWebview from "./ExpWebview";
import VideoPlayer from 'react-native-video-controls';
import DropDownPicker from 'react-native-dropdown-picker';

const FPS=10;
var server="http://101.133.137.243:1101/";

var exp_all={"eye_left":0,"eye_right":0,"cheek":0,"mouth":0};
const exp_order={"eye_left":0,"eye_right":1,"cheek":3,"mouth":2};

function getExpSendStr(){
    return exp_all['eye_left'].toString()+','+exp_all['eye_right'].toString()
    +','+exp_all['cheek'].toString()
    +','+exp_all['mouth'].toString()+',';
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

const setExp_ref=createRef();
function setExp(catName,expId,tp){
    setExp_ref.current.setExp(catName,expId,tp);
    //console.log(setExp_ref);
}

export default function AutoLive(){
    const [ExpTxtList,SetExpTxtList]=useState([]);
    const [openSongSel, setOpenSongSel] = useState(false);
    const [SongSel, setSongSel] = useState("田中千惠美 - Analogue Heart.mp3.txt");
    useEffect(()=>{if(ExpTxtList[0]==null) DownloadExpTxt().then(()=>{SetExpTxtList(ExpTxtListTmp);console.log(ExpTxtList)});})
    function progressMonitor(data){
        //console.log(data.currentTime);
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
            //if(catName=='cheek') console.log(exp_all[catName]);
        }
        sendUdpDefault('e'+getExpSendStr())
        //console.log(nextframe);
    }
    return(
        <View style={styles.container}>
            <View style={{flex:0.86}}>
                <ExpWebview ref={setExp_ref}/>
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
                ref={(ref)=>{this.player=ref}}
                onProgress={progressMonitor}
                progressUpdateInterval={20}
                paused={true}
                /*
                playWhenInactive={true}
                playInBackground={true}
                onLoad={() => {
                    console.log(this.player.player);
                    this.player.player.setNativeProps({
                      useExternalPlaybackWhileExternalScreenIsActive: false
                    });
                }}*/
                ignoreSilentSwitch={"ignore"}
                />
            </View>   
        </View>
    );
}
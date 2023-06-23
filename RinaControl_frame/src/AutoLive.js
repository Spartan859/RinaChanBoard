import React, {useEffect, useState,createRef} from "react";
import {View,Dimensions,Alert,Text} from 'react-native';
import { sendUdpDefault } from "./BasicFuntions";
import { styles } from "./Styles";
import ExpWebview from "./ExpWebview";
//import VideoPlayer from 'react-native-video-controls';
import { ExpTxtNtDl } from "./DownloadLive";
import { getData, storeData } from "./LocalDataStorage";

const FPS=10;
var server="http://101.133.137.243:1101/";

var exp_all={"eye_left":0,"eye_right":0,"cheek":0,"mouth":0,"full_face":0};
const exp_order={"eye_left":0,"eye_right":1,"cheek":3,"mouth":2,"full_face":4};

function getExpSendStr(){
    return exp_all['eye_left'].toString()+','+exp_all['eye_right'].toString()
    +','+exp_all['cheek'].toString()
    +','+exp_all['mouth'].toString()+','+exp_all['full_face']+',';
}
//var currentTime=0;
var music_player_ref;

var ExpContent={};
var ExpTxtListTmp=[];
var lastFrame=-1;

async function DownloadExpTxt(){
    ExpTxtListTmp=[];
    ExpContent={};
    var i=0;
    for(var file_name in ExpTxtNtDl){
        if(ExpTxtNtDl[file_name]==true) continue;
        ExpContent[file_name]=JSON.parse(await getData(file_name));
        console.log(ExpContent[file_name]);
        ExpTxtListTmp[i]={label: file_name,value: file_name};
        i=i+1;
    }
}

const setExp_ref=createRef();
function setExp(catName,expId,tp){
    setExp_ref.current.setExp(catName,expId,tp);
    //console.log(setExp_ref);
}

export default function AutoLive(){
    const [ExpTxtList,SetExpTxtList]=useState([]);
    const [openSongSel, setOpenSongSel] = useState(false);
    const [SongSel, setSongSel] = useState("Doki Pipo Emotion(short).mp3");
    getData('newSongAdded').then((res)=>{
        console.log("hqkweqw");
        if(res=="true"||ExpTxtList[0]==null){
            DownloadExpTxt().then(()=>{
                storeData('newSongAdded',"false").then(()=>{SetExpTxtList(ExpTxtListTmp);});
            });
        }
    });
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
        sendUdpDefault('e'+getExpSendStr());
        //console.log(nextframe);
    }
    return(
        <View style={styles.container}>
            <View style={{flex:0.86}}>
                <ExpWebview ref={setExp_ref}/>
            </View>
            <View style={[styles.container,{flex:0.5,zIndex:2}]}>
                <Text>下拉框</Text>
            </View>
            
            <View style={{flex:0.5,zIndex:1}}>
                <Text>播放器</Text>
            </View>   
        </View>
    );
}
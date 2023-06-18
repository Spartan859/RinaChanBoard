import React, {useState} from "react";
import {FlatList,View,Alert} from 'react-native';
import { styles } from "./Styles";
import { storeData,getData,rmData } from "./LocalDataStorage";
import { Text } from "react-native";
import { TouchableOpacity,Button } from "react-native";
import RNFS from 'react-native-fs'
import { OfflineMode } from "./BleTest";

var server="http://101.133.137.243:1101/";

export var ExpTxtNtDl={};
export var nowdownloading=false;
var progress_dl=0;

export async function FetchLiveList(){
    console.log("Downloading");
    var FileList=null;
    console.log(OfflineMode);
    if(!OfflineMode){
        FileList=await (await fetch('http://101.133.137.243:1101/RinaExpTxtFiles/')).json();
        if(FileList!=null)
            await storeData('FileList',JSON.stringify(FileList));
    }else{
        FileList=await getData('FileList');
        FileList=JSON.parse(FileList);
        console.log(FileList);
    }
    var scrollList=[];
    for(var i in FileList){
        var file_name=FileList[i]['name'].substring(0,FileList[i]['name'].lastIndexOf("."));
        console.log(file_name);
        //await rmData(file_name);
        scrollList[i]={id:i,text:file_name};
        ExpTxtNtDl[file_name]=((await getData(file_name))==null);
        console.log(ExpTxtNtDl[file_name]);
    }
    return scrollList;
}

function alert_and_alert(){
    Alert.alert("正在下载mp3","下载进度（按刷新键查看进度）："+progress_dl+"%",
            [{text:'刷新',onPress:()=>{
                if(nowdownloading) alert_and_alert();
            }}]);
}

export async function DownloadLiveFiles(live_name){
    if(OfflineMode){
        Alert.alert("已开启离线模式","无法下载！");
        return;
    }
    alert_and_alert();
    nowdownloading=true;
    var downloadDest=RNFS.DocumentDirectoryPath+'/'+live_name;
    console.log(downloadDest);
    var fromUrl=server+live_name;
    var DLoptions={
        fromUrl: fromUrl,
        toFile: downloadDest,
        progress: (res)=>{
            nowdownloading=true;
            progress_dl = res.bytesWritten / res.contentLength;
            progress_dl=Math.round(progress_dl*100);
        }
    };
    dlret=RNFS.downloadFile(DLoptions);
    dlret.promise.then((res)=>{
        console.log('success',res);nowdownloading=false;
        storeData('newSongAdded',"true");
    });
    var str=await fetch('http://101.133.137.243:1101/RinaExpTxtFiles/'+live_name+'.txt');
    str=await str.text();
    var ExpFile={};
    ExpFile['FrameList']=[];
    var all_Lines=str.trim().split('\n');
    for(var j in all_Lines){
        //console.log(j);
        ExpFile['FrameList'][j]=parseInt(all_Lines[j].split('!')[0]);
        var tttmp=all_Lines[j].split('!')[1].split(',');
        tttmp.push("0");
        ExpFile[parseInt(all_Lines[j].split('!')[0])]=tttmp;
    }
    ExpFile=JSON.stringify(ExpFile);
    await storeData(live_name,ExpFile);
    console.log(JSON.parse(ExpFile));
}

export default function DownloadLive(){
    const [ExpDlList,SetExpDlList]=useState([]);
    if(ExpDlList[0]==null){
        FetchLiveList().then((tmplist)=>{SetExpDlList(tmplist);console.log(tmplist)});
    }
    return(
        <View style={styles.container}>
            <FlatList
                data={ExpDlList}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.container,{margin:10}]}>
                        <Text>{item.text}</Text>
                        <TouchableOpacity style={{width: 150}}>
                            {ExpTxtNtDl[item.text] ? (
                                <Button
                                    title="下载"
                                    onPress={() => {
                                        DownloadLiveFiles(item.text).then(()=>{
                                            FetchLiveList().then((tmplist)=>{SetExpDlList(tmplist);console.log(tmplist)});
                                        });
                                    }}
                                    disabled={false}
                                />
                            ) : (
                                <Button
                                    title="已下载"
                                    onPress={() => {
                                        //disconnectDevice();
                                    }}
                                    disabled={true}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}
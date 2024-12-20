import React, { createRef } from "react";
import {Text,StyleSheet,TouchableOpacity,View, Alert, Dimensions, ScrollView, Image, Button} from 'react-native';
import {WebView} from 'react-native-webview'
import { sendUdpDefault } from "./BasicFuntions";
import CheckBox from "@react-native-community/checkbox";
import { styles } from "./Styles";
import ExpWebview from "./ExpWebview";
import { getData } from "./LocalDataStorage";
import { UriList_ori, exp_matrix_ori } from "./BleTest";

export var id_matrix=require('../assets/RinaInit.json');
export var id_to_coordinate=[[],[]];
var exp_matrix=exp_matrix_ori;
var UriList=UriList_ori;

var exp_all={"eye_left":0,"eye_right":0,"cheek":0,"mouth":0,"full_face":0};

var hei=16,len=18;
    for(var i=0;i<hei;i++)
        for(var j=0;j<len;j++){
            id_to_coordinate[0][id_matrix[i][j]]=i+1;
            id_to_coordinate[1][id_matrix[i][j]]=j+1;
        }

function getExpSendStr(){
    return exp_all['eye_left'].toString()+','+exp_all['eye_right'].toString()
    +','+exp_all['cheek'].toString()
    +','+exp_all['mouth'].toString()+','+exp_all['full_face']+',';
}

const setExp_ref=createRef();
function setExp(catName,expId,tp){
    setExp_ref.current.setExp(catName,expId,tp);
    //console.log(setExp_ref);
}
/*
function InitExp(){
    
    //var ExpFile=await getLocalExpFile();
    //exp_matrix=JSON.parse(ExpFile);
    exp_matrix=require('../assets/expressions.json');
}*/

function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
} 
var autoExpOut=false;
var normal_eye=[1,2,3,4,5,6,7,8,11,12,13,18];
function neverEndLoop(){
    if(autoExpOut){
        var eye=normal_eye[randomNum(0,11)];
        var cheek=randomNum(0,4);
        var mouth=randomNum(1,16);
        setExp('eye_left',exp_all['eye_left'],0);
        exp_all['eye_left']=eye;
        setExp('eye_left',exp_all['eye_left'],1);

        setExp('eye_right',exp_all['eye_right'],0);
        exp_all['eye_right']=eye;
        setExp('eye_right',exp_all['eye_right'],1);

        setExp('cheek',exp_all['cheek'],0);
        exp_all['cheek']=cheek;
        setExp('cheek',exp_all['cheek'],1);

        setExp('mouth',exp_all['mouth'],0);
        exp_all['mouth']=mouth;
        setExp('mouth',exp_all['mouth'],1);
        sendUdpDefault('e'+getExpSendStr())
    }
    setTimeout(neverEndLoop,5000);
}
setTimeout(neverEndLoop,5000);


export default function ManualScreen(){
    const [syncLR,setSyncLR]=React.useState(false);
    const [autoExp,setAutoExp]=React.useState(false);
    const [UselessState,setUselessState]=React.useState(0);
    function ExpItem(catName,expId){
        //console.log(catName,expId);
        function PressHandler(){
            if(catName!='full_face'){
                setExp('full_face',exp_all['full_face'],0);
                exp_all['full_face']=0;
                setExp('full_face',exp_all['full_face'],1);
            }else{
                for(var catx in exp_all){
                    if(catx=='full_face') continue;
                    setExp(catx,exp_all[catx],0);
                    exp_all[catx]=0;
                    setExp(catx,exp_all[catx],1);
                }
            }
            setExp(catName,exp_all[catName],0);
            exp_all[catName]=expId;
            setExp(catName,exp_all[catName],1);
            if(syncLR){
                if(catName=='eye_left'){
                    setExp('eye_right',exp_all['eye_right'],0);
                    exp_all['eye_right']=expId;
                    setExp('eye_right',exp_all['eye_right'],1);
                }
                if(catName=='eye_right'){
                    setExp('eye_left',exp_all['eye_left'],0);
                    exp_all['eye_left']=expId;
                    setExp('eye_left',exp_all['eye_left'],1);
                }
            }
        }
        uri_image=catName+expId;
        if(UriList[catName][expId]!=0) uri_image=UriList[catName][expId];
        //console.log(uri_image);
        return (
            <TouchableOpacity
                onPress={PressHandler}
                key={uri_image}
                style={styles.image_button}
            >
                <Image
                    source={{
                        uri: uri_image
                    }}
                    style={styles.image_in_scroll}
                />
                <Text>{expId}</Text>
            </TouchableOpacity>
        );
    }
    //console.log(require('./assets/index.html'))
    
    item_list={};
    function InitItemList() {
        for(var catName in exp_all){
            item_list[catName]=[]
            for(var i in exp_matrix[catName]){
                item_list[catName][i]=ExpItem(catName,i);
            }
        }
    }
    InitItemList();
    return(
        <View style={styles.container}>
            <View style={{flex:0.86}}>
                <ExpWebview ref={setExp_ref}/>
            </View>
            
            <View style={{flex:1}}>
                <ScrollView horizontal={true} style={styles.horizontal_scroll}>
                    {item_list["eye_left"]}
                </ScrollView>
                <ScrollView horizontal={true} style={styles.horizontal_scroll}>
                    {item_list["eye_right"]}
                </ScrollView>
                <ScrollView horizontal={true} style={styles.horizontal_scroll}>
                    {item_list["cheek"]}
                </ScrollView>
                <ScrollView horizontal={true} style={styles.horizontal_scroll}>
                    {item_list["mouth"]}
                </ScrollView>
                <ScrollView horizontal={true} style={styles.horizontal_scroll}>
                    {item_list["full_face"]}
                </ScrollView>
                <View style={[styles.container,{flex:0.5,flexDirection:'row'}]}>
                    <Button
                        title="刷新"
                        onPress={()=>{setUselessState(UselessState^1)}}
                    />
                    <CheckBox
                        //disabled={false}
                        value={syncLR}
                        onValueChange={(val=>setSyncLR(val))}
                    />
                    <Text>同步左右眼    </Text>
                    <CheckBox
                        //disabled={false}
                        value={autoExp}
                        onValueChange={
                            (val)=>{
                                setAutoExp(val);
                                autoExpOut=val;
                            }
                        }
                    />
                    <Text>自动托管    </Text>
                    <Button
                        title="发送"
                        onPress={()=>{sendUdpDefault('e'+getExpSendStr())}}
                    />
                </View>
            </View>
        </View>
        
    );
}
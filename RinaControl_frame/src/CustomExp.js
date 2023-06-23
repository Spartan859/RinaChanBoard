import React, {useState,createRef,useRef} from "react";
import {Text,StyleSheet,TouchableOpacity,View, Alert, Dimensions, ScrollView, Image, Button, FlatList} from 'react-native';
import { styles } from "./Styles";
import { storeData,getData,rmData } from "./LocalDataStorage";
import { OfflineMode, UriList_ori, upd_UriList } from "./BleTest";
import ExpWebview from "./ExpWebview";
import { exp_matrix_ori } from "./BleTest";
import { upd_ExpMatrix } from "./BleTest";
//import ViewShot from "react-native-view-shot";


var exp_matrix=exp_matrix_ori;

var toWhichCat="eye_left";
var curUri="";

var UriList=UriList_ori;
console.log(UriList['full_face'][1]);

export function ExportExp(event){
    if(event.nativeEvent.data=="ERR"){
        Alert.alert("选定区域无效","请先选定一个有效的区域！");
        return;
    }
    var res=JSON.parse(event.nativeEvent.data);
    console.log(toWhichCat);
    exp_matrix[toWhichCat].push(res);
    console.log("QOWIDASKNDLSAK"+JSON.stringify(exp_matrix)==JSON.stringify(exp_matrix_ori));
    storeData('ExpMatrix',JSON.stringify(exp_matrix)).then(upd_ExpMatrix);
    UriList[toWhichCat][exp_matrix[toWhichCat].length-1]=curUri;
    storeData('UriList',JSON.stringify(UriList))//.then(upd_UriList);
}

export var id_matrix=require('../assets/RinaInit.json');
export var id_to_coordinate=[[],[]];

var exp_all={"eye_left":0,"eye_right":0,"cheek":0,"mouth":0,"full_face":0};
var hei=16,len=18;
    for(var i=0;i<hei;i++)
        for(var j=0;j<len;j++){
            id_to_coordinate[0][id_matrix[i][j]]=i+1;
            id_to_coordinate[1][id_matrix[i][j]]=j+1;
        }

const setExp_ref=createRef();
function setExp(catName,expId,tp){
    setExp_ref.current.setExp(catName,expId,tp);
    //console.log(setExp_ref);
}

const CatList=[
    {label: "左眼",value: "eye_left"},
    {label: "右眼",value: "eye_right"},
    {label: "脸颊",value: "cheek"},
    {label: "嘴巴",value: "mouth"},
    {label: "全脸组合",value: "full_face"},
];
export default function CustomExp(){
    const [openCatSel, setOpenCatSel] = useState(false);
    const [CatSel, setCatSel] = useState("eye_left");
    const [UselessState,setUselessState]=useState(0);
    //const ViewShotRef=useRef();
    /*function getWbvImage(tp){
        ViewShotRef.current.capture().then(uri => {
            curUri=uri;
            if(tp==2) setExp_ref.current.outputAll();
            else if(tp==1) setExp_ref.current.outputSel();
        })
    }*/
    
    function ExpItem(catName,expId){
        //console.log(catName,expId);
        function PressHandler(){
            setExp(catName,exp_all[catName],0);
            exp_all[catName]=expId;
            setExp(catName,exp_all[catName],1);
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
                <Text>webview</Text>
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
                    <View style={{flex:1 , marginRight:10}} >
                        <Button
                            title="选择区域"
                            onPress={()=>{setExp_ref.current.startSel();}}
                        />
                    </View>
                    <View style={{flex:1 , marginRight:10}}>
                        <Button
                            title="导出区域"
                            onPress={()=>{
                                //getWbvImage(1);
                                setTimeout(()=>{setUselessState(UselessState^1)},500);
                            }}
                        />
                    </View>
                    <View style={{flex:1 , marginRight:10}}>
                        <Button
                            title="导出全图"
                            onPress={()=>{
                                //getWbvImage(2);
                                setTimeout(()=>{setUselessState(UselessState^1)},500);
                            }}
                        />
                    </View>
                    <View style={{flex:1 , marginRight:10}}>
                        <Button
                            title="清空全图"
                            onPress={()=>{
                                setExp_ref.current.eraseAll();
                            }}
                        />
                    </View>
                    <View style={{flex:1 , marginRight:10}}>
                        <Text>下拉框</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
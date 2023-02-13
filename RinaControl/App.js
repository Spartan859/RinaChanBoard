import React, { Component } from "react";
import {Text,TextInput,StyleSheet,TouchableOpacity,View, Alert,PermissionsAndroid, Dimensions, ScrollView, Image, Button} from 'react-native';
import dgram from 'react-native-udp'
import RNFS from 'react-native-fs'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {WebView} from 'react-native-webview'
import {InitScreen} from './src/InitScreen'
import {getLocalExpFile} from './src/InitScreen'
import { sendUdpDefault } from "./src/InitScreen";
import CheckBox from "@react-native-community/checkbox";
import BleTest from "./src/BleTest";
import AutoLive from "./src/AutoLive";
import { storeData,getData } from "./src/LocalDataStorage";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: "center",
        alignItems: "center",
        //paddingHorizontal: 10
    },
    webview_container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        //height: 10
    },
    bigBlue: {
      color: 'blue',
      fontWeight: 'bold',
      fontSize: 30,
    },
    red: {
      color: 'red',
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        margin: 10
    },
    image_button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
    },
    horizontal_scroll: {
        flex: 1,
        //height: 20
    },
    image_in_scroll: {
        height: "70%",
        width: 60,
        resizeMode: 'contain'
    }
  });

let exppath=RNFS.DocumentDirectoryPath + '/expressions.json';
const createLocalExpFile=()=>{
    let expJSON=require('./assets/expressions.json');
    
    RNFS.writeFile(exppath, JSON.stringify(expJSON), 'utf8').then((success)=>{
        console.log('FILE WRITTEN'+' '+exppath);
    }).catch((err)=>{
        console.log(err.message);
    });
}
RNFS.exists(exppath).then((value)=>{
    if(value==false) createLocalExpFile();
    createLocalExpFile();
});  


var board_ref;
export var id_matrix=require('./assets/RinaInit.json');
export var id_to_coordinate=[[],[]];
export var exp_matrix=require('./assets/expressions.json');;
var exp_all={"eye_left":0,"eye_right":0,"cheek":0,"mouth":0};

var hei=16,len=18;
    for(var i=0;i<hei;i++)
        for(var j=0;j<len;j++){
            id_to_coordinate[0][id_matrix[i][j]]=i+1;
            id_to_coordinate[1][id_matrix[i][j]]=j+1;
        }

function getExpSendStr(){
    return exp_all['eye_left'].toString()+','+exp_all['eye_right'].toString()
    +','+exp_all['cheek'].toString()
    +','+exp_all['mouth'].toString()+',';
}

function setPixel(x,y,tp){
    var run="setPixel("+x.toString()+','+y.toString()+','+tp.toString()+')';
    board_ref.injectJavaScript(run);
}
function InitExp(){
    /*
    var ExpFile=await getLocalExpFile();
    exp_matrix=JSON.parse(ExpFile);*/
    exp_matrix=require('./assets/expressions.json');
}
function setExp(catName,expId,tp){
    //console.log(exp_matrix[catName][expId])
    for(var i in exp_matrix[catName][expId]){
        pixel_id=exp_matrix[catName][expId][i];
        setPixel(id_to_coordinate[0][pixel_id],id_to_coordinate[1][pixel_id],tp);
    }
}

function ManualScreen(){
    const [syncLR,setSyncLR]=React.useState(false);
    function ExpItem(catName,expId){
        function PressHandler(){
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
    const window = Dimensions.get("window");
    const screen = Dimensions.get("screen");
    
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
            <WebView
                ref={(r) => (board_ref = r)}
                style={{
                    flex: 1,
                    width: screen.width,
                }}
                source={{uri: 'https://bing.satintin.com/rina.html'}}
            />
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
                <View style={[styles.container,{flex:0.5,flexDirection:'row'}]}>
                    <CheckBox
                        //disabled={false}
                        value={syncLR}
                        onValueChange={val=>setSyncLR(val)}
                    />
                    <Text>同步左右眼    </Text>
                    <Button
                        title="发送"
                        onPress={()=>{sendUdpDefault('e'+getExpSendStr())}}
                    />
                </View>
            </View>
        </View>
        
    );
}
const Tab=createBottomTabNavigator();
function AllTabs(){
    return (
        <Tab.Navigator>
            <Tab.Screen name="BleTest" component={BleTest}/>
            <Tab.Screen name="Manual" component={ManualScreen}/> 
            <Tab.Screen name="Live" component={AutoLive}/> 
        </Tab.Navigator>
    );
}
export default function App(){
    return (
        <NavigationContainer>
            <AllTabs/>
        </NavigationContainer>
    );
};


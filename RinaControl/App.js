import React from "react";
import {Text,StyleSheet,TouchableOpacity,View, Alert, Dimensions, ScrollView, Image, Button} from 'react-native';
import RNFS from 'react-native-fs'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {WebView} from 'react-native-webview'
import { sendUdpDefault } from "./src/InitScreen";
import CheckBox from "@react-native-community/checkbox";
import BleTest from "./src/BleTest";
import AutoLive from "./src/AutoLive";
import ManualScreen from "./src/ManualScreen";
import { styles } from "./src/Styles";

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
    //createLocalExpFile();
});  

let ScreenHtmlPath=RNFS.DocumentDirectoryPath+'/rina.html';
const createLocalScreenHtml=()=>{//创建并下载本地的表情显示网格的html文件
    /*
    let expJSON=require('./assets/expressions.json');
    
    RNFS.writeFile(exppath, JSON.stringify(expJSON), 'utf8').then((success)=>{
        console.log('FILE WRITTEN'+' '+exppath);
    }).catch((err)=>{
        console.log(err.message);
    });*/
}
RNFS.exists(ScreenHtmlPath).then((value)=>{//若本地不存在，则调用创建(第一次打开不存在，要下载)
    if(value==false) createLocalScreenHtml();
});  

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


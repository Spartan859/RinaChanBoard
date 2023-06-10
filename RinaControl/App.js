import React from "react";
import {Text,StyleSheet,TouchableOpacity,View, Alert, Dimensions, ScrollView, Image, Button} from 'react-native';
import RNFS from 'react-native-fs'
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {WebView} from 'react-native-webview'
import { sendUdpDefault } from "./src/BasicFuntions";
import CheckBox from "@react-native-community/checkbox";
import BleTest from "./src/BleTest";
import AutoLive from "./src/AutoLive";
import ManualScreen from "./src/ManualScreen";
import DownloadLive from "./src/DownloadLive";
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
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    if(route.name=="配网"){
                        return <Text style={{color:color,fontWeight: 'bold',fontSize: 20}}>天</Text>;
                    }
                    if(route.name=="手动"){
                        return <Text style={{color:color,fontWeight: 'bold',fontSize: 20}}>王</Text>;
                    }
                    if(route.name=="Live"){
                        return <Text style={{color:color,fontWeight: 'bold',fontSize: 20}}>寺</Text>;
                    }
                },
            })}
        >
            <Tab.Screen name="配网" component={BleTest}/>
            <Tab.Screen name="手动" component={ManualScreen}/> 
            <Tab.Screen name="Live" component={AutoLive}/>
            <Tab.Screen name="下载资源" component={DownloadLive}/> 
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


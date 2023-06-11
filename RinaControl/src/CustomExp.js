import React, {useState} from "react";
import {FlatList,View,Alert} from 'react-native';
import { styles } from "./Styles";
import { storeData,getData,rmData } from "./LocalDataStorage";
import { Text } from "react-native";
import { TouchableOpacity,Button } from "react-native";
import RNFS from 'react-native-fs'
import { OfflineMode } from "./BleTest";

export default function CustomExp(){
    return(
        <Text style={{fontSize: 60,alignSelf: "center"}}>敬请期待</Text>
    );
}
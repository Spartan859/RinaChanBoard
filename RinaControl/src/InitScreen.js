import React from "react";
import {Text,TextInput,StyleSheet,TouchableOpacity,View, Alert,PermissionsAndroid, Dimensions, ScrollView, Image} from 'react-native';
import dgram from 'react-native-udp'
import RNFS from 'react-native-fs'
import { getData, storeData } from "./LocalDataStorage";

export function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
function buffer2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

const is_ip = (ip) =>{
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
}
let exppath=RNFS.DocumentDirectoryPath + '/expressions.json';
export const getLocalExpFile=async()=>{
    let res=await RNFS.readFile(exppath,'utf8');
    // console.log(res);
    return res;
}
const socket=dgram.createSocket('udp4');
const sendto_port=8888;
socket.bind(23333,(err)=>{
    if(err) console.warn(err);
    socket.setBroadcast(true);
});
socket.on('message', function(msg, rinfo) {
    ipa_out=buffer2str(msg);
    storeData('ipa_out',ipa_out);
    console.log('Message received', ipa_out);
    Alert.alert('Message received', ipa_out);
})

export {socket};

export var ipa_out='null';
getData('ipa_out').then((res)=>{if(res!=null) ipa_out=res});
export function resetipa(){
    ipa_out='null';
}
const sendUdpString=(msg,port,ip)=>{
    if(!is_ip(ip)){
        console.log('udp sending to a false ip: '+ip);
        return;
    }
    socket.send(msg,0,msg.length,port,ip,function(err) {
        if(err) throw err;
        //Alert.alert("Msg sent: ",msg+' '+port+' '+ip);
        //console.log("Msg sent");
    })
}
export const sendUdpDefault=(msg)=>{
    sendUdpString(msg,sendto_port,ipa_out);
}
export const sendInit= async() => {
    //sendUdpString("test",sendto_port,ipa);
    //console.log(getLocalExpFile());
    let str=await getLocalExpFile();
    var yz=1400;
    sendUdpDefault('C');
    await sleep(300);
    for(var i=0;i<str.length;i+=yz){
        //console.log(str.substr(i,yz));
        sendUdpDefault('A'+str.substr(i,yz));
        await sleep(300);
    }
    sendUdpDefault('B');
}


/*
export function InitScreen(){
    const [ipa,setIpa]=React.useState('192.168.1.1');
    const [ipa_txt, setIpaTxt] = React.useState('192.168.1.1');
    const checkIpa = (ipaval) =>{
        if(!is_ip(ipaval)){
            Alert.alert('It is not an ipv4 address');
            return;
        }
        setIpa(ipaval);
        ipa_out=ipaval;
        Alert.alert('ipa updated to: '+ipaval);
    }
    const updateIpa= () => {checkIpa(ipa_txt);}
    
    return(
        <View style={styles.container}>
            <Text style={styles.bigBlue}>设置ip地址</Text>
            <Text style={{fontSize:20}}>当前ip: {ipa}</Text>
            <TextInput
                style={{ height: 50, width: 200,borderColor: 'gray', borderWidth: 1 }}
                onChangeText={val => setIpaTxt(val)}
                value={ipa_txt}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={updateIpa}
                id="updateIpaBtn">
                <Text style={{fontSize:30}}>更新ip地址</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={sendInit}
                id="sendInit">
                <Text style={{fontSize:30}}>发送初始数据包</Text>
            </TouchableOpacity>
        </View>
    );
}*/
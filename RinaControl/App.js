import React, { Component } from "react";
import {Text,TextInput,StyleSheet,TouchableOpacity,View, Alert,PermissionsAndroid} from 'react-native';
import dgram from 'react-native-udp'
import RNFS from 'react-native-fs'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10
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
    }
  });


const socket=dgram.createSocket('udp4');
const sendto_port=8888;
socket.bind(23333);
/*
socket.on("message",function (data,rinfo) {  
    var str=String.fromCharCode.apply(null, new Uint8Array(data));
    console.log(str);
    console.log(JSON.stringify(rinfo));
    Alert.alert("Received test",str+' '+JSON.stringify(rinfo));
})*/


const is_ip = (ip) =>{
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
}

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
    //if(value==false) createLocalExpFile();
    createLocalExpFile();
});  

const getLocalExpFile=async()=>{
    let res=await RNFS.readFile(exppath,'utf8');
    console.log(res);
    return res;
}

const App = () =>{
    const [ipa,setIpa]=React.useState('192.168.1.1');
    const [ipa_txt, setIpaTxt] = React.useState('192.168.1.1');
    const checkIpa = (ipaval) =>{
        if(!is_ip(ipaval)){
            Alert.alert('It is not an ipv4 address');
            return;
        }
        setIpa(ipaval);
        Alert.alert('ipa updated to: '+ipaval);
    }
    const updateIpa= () => {checkIpa(ipa_txt);}
    const sendUdpString=(msg,port,ip)=>{
        socket.send(msg,0,msg.length,port,ip,function(err) {
            if(err) throw err;
            Alert.alert("Msg sent: ",msg+' '+port+' '+ip);
        })
    }
    const sendInit= async() => {
        //sendUdpString("test",sendto_port,ipa);
        //console.log(getLocalExpFile());
        let str=await getLocalExpFile();
        sendUdpString(str,sendto_port,ipa);
    }
    
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
}
export default App;


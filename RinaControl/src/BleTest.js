import React,{useState} from "react";
import { NetworkInfo } from "react-native-network-info";

import base64 from 'react-native-base64'
import { BleManager, Device } from "react-native-ble-plx";
import { PermissionsAndroid, Text, TextInput, TouchableOpacity, View,Button,Alert } from "react-native";
import { styles } from "./Styles"
import { sendInit } from "./BasicFuntions";
import { sendUdpDefault } from "./BasicFuntions";
import { sleep } from "./BasicFuntions";
import { ipa_out } from "./BasicFuntions";
import { resetipa } from "./BasicFuntions";

import { storeData,getData } from "./LocalDataStorage";

const BLTManager=new BleManager();

const SERVICE_UUID='85253ceb-b0b7-4cc2-8e81-c22affa36a43';
const WIFI_UUID='586f7454-dc36-442b-8a87-7e5368a5c42a';
const MESSAGE_UUID='a1303310-cd55-4c46-8140-61b17f22bf01';




const requestBLEPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]);
      console.log(granted)
    } catch (err) {
      console.warn(err);
    }
  };

export default function BleTest(){
    const [isConnected, setIsConnected] = useState(false);
    const [connectedDevice, setConnectedDevice] = useState({});
    const [message, setMessage] = useState('蓝牙暂未连接成功');
    //var wifiValue='ExampleSSID;ExamplePWD';
    const [ssid,setSSID]=useState(null);
    const [pwd,setPWD]=useState(null);
    const [updateVersion,setUpdateVersion]=useState("0.0.2");
    getData('ssid').then((res)=>{if(res!=null&&ssid==null) setSSID(res)});
    getData('pwd').then((res)=>{if(res!=null&&pwd==null) setPWD(res)});

    //Connect the device and start monitoring characteristics
    async function connectDevice(device) {
        console.log('connecting to Device:', device.name);
        //BLTManager.enableAutoConnect(device.id,true);
        BLTManager.connectToDevice(device.id,{autoConnect: true}).then(device=>{
            console.log('connected to device!');
            setConnectedDevice(device);
            setIsConnected(true);
            Alert.alert("蓝牙连接成功！",
            "请在输入框中依次填写好 wifi/热点 名称、密码，并点击“发送wifi信息！”"+
            "\n 注意：wifi/热点 必须设置为2.4ghz而非5ghz，并关闭wifi6选项，否则无法连接！");
            return device.discoverAllServicesAndCharacteristics();
        }).then(device=>{
            BLTManager.onDeviceDisconnected(device.id, (error, device) => {
                console.log('Device DC');
                setIsConnected(false);
            });
            //Message
            device
                .readCharacteristicForService(SERVICE_UUID, MESSAGE_UUID)
                .then(valenc => {
                    //setMessage(base64.decode(valenc.value));
                    setMessage("若在发送Wifi信息前，蓝牙意外断开连接，请手动重启璃奈板")
                });
            //Message
            device.monitorCharacteristicForService(
                SERVICE_UUID,
                MESSAGE_UUID,
                (error, characteristic) => {
                    if (characteristic.value != null) {
                        setMessage(base64.decode(characteristic.value));
                        console.log(
                            'Message update received: ',
                            base64.decode(characteristic.value),
                        );
                    }
                },
                'messagetransaction',
            );
            console.log('Connection established');
        }).catch((error)=>{
            console.log('Error connecting to device: '+error);
        });
    }

    async function scanDevices(){
        await requestBLEPermission();
        console.log("scanning");
        BLTManager.startDeviceScan(null,null,(err,scannedDevice)=>{
            if(err) console.warn(err);
            if(scannedDevice){
                console.log('Scanned: '+scannedDevice.name);
            }
            if(scannedDevice && scannedDevice.name=="RinaChanBoard"){
                BLTManager.stopDeviceScan();
                connectDevice(scannedDevice);
                //connectDevice(scannedDevice);
                //connectDevice(scannedDevice);
                //connectDevice(scannedDevice);
            }
        })
        setTimeout(() => {
            BLTManager.stopDeviceScan();
          }, 5000);
    }

    async function disconnectDevice() {
        console.log('Disconnecting start');

        if (connectedDevice != null) {
            const isDeviceConnected = await connectedDevice.isConnected();
            if (isDeviceConnected) {
                BLTManager.cancelTransaction('messagetransaction');
                BLTManager.cancelTransaction('wifitransaction');

                BLTManager.cancelDeviceConnection(connectedDevice.id).then(() =>
                    console.log('DC completed'),
                );
            }

            const connectionStatus = await connectedDevice.isConnected();
            if (!connectionStatus) {
                setIsConnected(false);
            }
        }
    }

    async function sendWifiValue(value) {
        await BLTManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            SERVICE_UUID,
            WIFI_UUID,
            base64.encode(value),
        );
    }

    async function getIP(){
        var ip=await NetworkInfo.getIPV4Address();
        Alert.alert(ip);
        console.log(ip);
    }

    async function prepareInit(){
        while(ipa_out=='null'){
            await sleep(500);
        }
        sendInit();
    }
    return(
        <View style={styles.container}>
            <Text style={styles.bigBlue}>蓝牙配网</Text>
            <Text style={{fontSize:20}}>{message}</Text>
            
            <TouchableOpacity style={{width: 150}}>
                {!isConnected ? (
                    <Button
                        title="先点我 连接至璃奈板"
                        onPress={() => {
                            scanDevices();
                        }}
                        disabled={false}
                    />
                ) : (
                    <Button
                        title="已连接！"
                        onPress={() => {
                            //disconnectDevice();
                        }}
                        disabled={true}
                    />
                )}
            </TouchableOpacity>

            <TextInput
                style={{ height: 50, width: 200,borderColor: 'gray', borderWidth: 1 }}
                onChangeText={val => setSSID(val)}
                value={ssid}
            />
            <TextInput
                style={{ height: 50, width: 200,borderColor: 'gray', borderWidth: 1 }}
                onChangeText={val => setPWD(val)}
                value={pwd}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={async()=>{
                    if(!isConnected){
                        if(ipa_out!='null'){
                            Alert.alert("蓝牙未连接",
                            '当前已存ip: '
                            +ipa_out+'\n如果璃奈板未显示初始表情，或表情显示不完整，请手动点击“发送配置文件”'
                            +'\n如果你重启了璃奈板，请先点击上方蓝色按钮连接蓝牙！')
                            return;
                        }
                        Alert.alert("蓝牙未连接","蓝牙未连接，无法发送wifi信息！")
                        return;
                    }
                    resetipa();
                    sendWifiValue(ssid+';'+pwd);
                    storeData('ssid',ssid);
                    storeData('pwd',pwd);
                    prepareInit();
                }}
                id="sendWifi">
                <Text style={{fontSize:30}}>发送Wifi信息</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={async()=>{
                    if(ipa_out=="null"){
                        Alert.alert("wifi未连接","请确保已经发送wifi信息，并显示连接成功！")
                        return;
                    }
                    Alert.alert("已经发送配置文件","若璃奈板仍然未显示初始表情，请重试！")
                    prepareInit();
                }}
                id="sendWifi_only">
                <Text style={{fontSize:30}}>发送配置文件</Text>
            </TouchableOpacity>
            <TextInput
                style={{ height: 50, width: 200,borderColor: 'gray', borderWidth: 1 }}
                onChangeText={val => setUpdateVersion(val)}
                value={updateVersion}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={async()=>{ 
                    Alert.alert(
                        "警告",
                        "确认更新固件至版本"+updateVersion+'?',
                        [
                            {text:'确认',onPress:()=>{sendUdpDefault("U "+updateVersion+'.bin');}},
                            {text:'取消',style: 'cancel'},
                        ],
                    );  
                }}
                id="SendUpdateCommand">
                <Text style={{fontSize:30}}>发送固件更新指令</Text>
            </TouchableOpacity>
        </View>
    );
}
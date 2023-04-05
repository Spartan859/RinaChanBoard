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
    const [message, setMessage] = useState('Nothing Yet');
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
                    setMessage(base64.decode(valenc.value));
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
        // device
        //     .connect()
        //     .then(device => {
        //         setConnectedDevice(device);
        //         setIsConnected(true);
        //         return device.discoverAllServicesAndCharacteristics();
        //     })
        //     .then(device => {
        //         //  Set what to do when DC is detected
        //         BLTManager.onDeviceDisconnected(device.id, (error, device) => {
        //             console.log('Device DC');
        //             setIsConnected(false);
        //         });

        //         //Read inital values

        //         //Message
        //         device
        //             .readCharacteristicForService(SERVICE_UUID, MESSAGE_UUID)
        //             .then(valenc => {
        //                 setMessage(base64.decode(valenc.value));
        //             });

        //         //Message
        //         device.monitorCharacteristicForService(
        //             SERVICE_UUID,
        //             MESSAGE_UUID,
        //             (error, characteristic) => {
        //                 if (characteristic.value != null) {
        //                     setMessage(base64.decode(characteristic.value));
        //                     console.log(
        //                         'Message update received: ',
        //                         base64.decode(characteristic.value),
        //                     );
        //                 }
        //             },
        //             'messagetransaction',
        //         );
        //       
        //         console.log('Connection established');
        //     });
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
            <TouchableOpacity style={{width: 120}}>
                {!isConnected ? (
                    <Button
                        title="Connect"
                        onPress={() => {
                            scanDevices();
                        }}
                        disabled={false}
                    />
                ) : (
                    <Button
                        title="Disonnect"
                        onPress={() => {
                            disconnectDevice();
                        }}
                        disabled={false}
                    />
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={async()=>{ 
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
                    storeData('ssid',ssid);
                    storeData('pwd',pwd);
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
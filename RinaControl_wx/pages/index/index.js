// index.js
// 获取应用实例
import {ipa_out,sendInit,resetipa,sleep, sendUdpDefault} from '../../utils/util'
import {get_gbk_offset,read_char,read_char_extra} from '../../utils/getCharPic'
console.log(ipa_out.ip);

const app = getApp()

const str2ab=require('../../utils/util.js').stringToHexBuffer

const ExpMatrixInit=require('../../assets/expressions.js').ExpMatrixInit;

const SERVICE_UUID='85253ceb-b0b7-4cc2-8e81-c22affa36a43';
const WIFI_UUID='586f7454-dc36-442b-8a87-7e5368a5c42a';
const MESSAGE_UUID='a1303310-cd55-4c46-8140-61b17f22bf01';

var IndexExport={};
IndexExport.exp_matrix={};
var deviceId;

var thispage;

var searchingBLE=false;

var dzk_ready=false;



export const sendBLEmessage=function(str){
    if(!thispage.data.ble_status) return;
    wx.writeBLECharacteristicValue({
        characteristicId: MESSAGE_UUID,
        deviceId: deviceId,
        serviceId: SERVICE_UUID,
        value: str2ab(str)
    })
}

Page({
    data:{
        wifi_ssid: "",
        wifi_pwd: "",
        ble_status: false,
        brightness: 40,
        BinList: [],
        BinVersion: 5,
        dispMessage: '璃奈板你说句话呀',
        slide_intv: 100
    },
    testInit: function(){
        sendInit();
    },
    prepareInit: async function(){
        console.log(ipa_out.ip);
        while(ipa_out.ip=='null'){
            console.log(ipa_out.ip)
            await sleep(500);
        }
        sendInit();
    },
    sendWifiValue: function(){
        console.log(deviceId);
        wx.setStorageSync('ssid', this.data.wifi_ssid);
        wx.setStorageSync('pwd', this.data.wifi_pwd);
        if(!this.data.ble_status){
            if(ipa_out.ip!='null'){
                wx.showModal({
                  title: "蓝牙未连接",
                  content: '当前已存ip: '
                  +ipa_out.ip+'\n如果璃奈板未显示初始表情，或表情显示不完整，请手动点击“发送配置文件”'
                  +'\n如果你重启了璃奈板，请先点击上方按钮连接蓝牙！'
                })
                return;
            }
            wx.showModal({
              title: "蓝牙未连接",
              content: "蓝牙未连接，无法发送wifi信息！"
            })
            return;
        }
        resetipa();
        console.log(ipa_out.ip);
        
        console.log(str2ab(this.data.wifi_ssid+';'+this.data.wifi_pwd))
        wx.getBLEDeviceServices({
            deviceId,
            success: (res)=>{
                console.log(res);
                wx.getBLEDeviceCharacteristics({
                    deviceId: deviceId,
                    serviceId: res.services[0].uuid,
                    success(res){
                        wx.writeBLECharacteristicValue({
                            characteristicId: res.characteristics[0].uuid,
                            deviceId: deviceId,
                            serviceId: SERVICE_UUID,
                            value: str2ab(thispage.data.wifi_ssid+';'+thispage.data.wifi_pwd),
                            /*complete(res){
                              wx.closeBLEConnection({
                                  deviceId: deviceId,
                                  complete(res){
                                    searchingBLE=false;
                                    deviceId=undefined;
                                    wx.closeBluetoothAdapter();
                                  }
                              });
                            }*//*,
                            fail(res){
                                wx.showModal({
                                  title: '错误(writeCharacteristic)',
                                  content: JSON.stringify(res)
                                })
                            }*/
                          })
                    }/*,fail(res){
                        wx.showModal({
                            title: '错误(获取characteristics)',
                            content: JSON.stringify(res)
                          })
                    }*/
                })
            }/*,
            fail(res){
                wx.showModal({
                    title: '错误(获取services)',
                    content: JSON.stringify(res)
                  })
            }*/
        })
        setBLEstatus(false);
        this.prepareInit();
    },
    updateExpMatrix: function(){
        //console.log(ExpMatrixInit)
        IndexExport.exp_matrix=wx.getStorageSync('ExpMatrix');
        if(IndexExport.exp_matrix==''){
            console.log("KHQWJDSAHAKJHKj");
            IndexExport.exp_matrix=ExpMatrixInit;
            var USER_exp=wx.getStorageSync('USER_exp_matrix');
            if(USER_exp!=''){
                for(var catName in ExpMatrixInit){
                    IndexExport.exp_matrix[catName]=IndexExport.exp_matrix[catName].concat(USER_exp[catName]);
                }
            }
            wx.setStorageSync('ExpMatrix', IndexExport.exp_matrix);
        }
    },
    updateSSIDandPWD: function(){
        this.setData({
            wifi_ssid: wx.getStorageSync('ssid'),
            wifi_pwd: wx.getStorageSync('pwd')
        })
        console.log(this.data.wifi_ssid);
    },
    onLoad: function(options){
        this.updateSSIDandPWD();
        thispage=this;
        wx.request({
          url: 'https://autosz.satintin.com/RinaChanBoard_FirmwareRelease/',
          success(res){
            let tmpArray=[]
            for(var i in res.data){
                let tmpstr=res.data[i].name
                if(tmpstr[0]=='R') continue;
                tmpArray[i]=tmpstr.substring(0,tmpstr.length-4);
            }
            thispage.setData({BinList: tmpArray});
          }
        })
        
        if(wx.getStorageSync('gbk_dzk')==''){
            wx.downloadFile({
            url: 'https://autosz.satintin.com/dzk/gbk_dzk.bin',
            filePath: wx.env.USER_DATA_PATH+'/gbk_dzk.bin',
            success(res){
                if(res.statusCode!=200){
                    wx.showModal({
                        title: '错误',
                        content: '网络异常！请重启小程序！',
                        complete: (res) => {
                            wx.exitMiniProgram();
                        }
                    })
                    return;
                }
                wx.setStorageSync('gbk_dzk', res.filePath);
                console.log(res.filePath);
            }
            })
        }
        if(wx.getStorageSync('ascii_dzk')==''){
            wx.downloadFile({
                url: 'https://autosz.satintin.com/dzk/ascii_dzk.bin',
                filePath: wx.env.USER_DATA_PATH+'/ascii_dzk.bin',
                success(res){
                    if(res.statusCode!=200){
                        wx.showModal({
                        title: '错误',
                        content: '网络异常！请重启小程序！',
                        complete: (res) => {
                            wx.exitMiniProgram();
                        }
                        })
                        return;
                    }
                    wx.setStorageSync('ascii_dzk', res.filePath);
                }
            })
        }
        if(wx.getStorageSync('ExpInit')!=JSON.stringify(ExpMatrixInit)){
            console.log("CLEARING ALL STORAGE")
            wx.removeStorageSync('ExpMatrix');
            wx.removeStorageSync('image_uri_list');
            wx.setStorageSync('ExpInit', JSON.stringify(ExpMatrixInit));
        }
        this.updateExpMatrix();
    },
    changeBinVersion(event){
        this.setData({BinVersion: event.detail.value});
    },
    setWifiSSID: function(e){
        this.setData({wifi_ssid: e.detail.value})
        return {value: e.detail.value}
    },
    setWifiPWD: function(e){
        this.setData({wifi_pwd: e.detail.value})
        return {value: e.detail.value}
    },
    startBLEsearch: function(){
        
        if(searchingBLE){
            wx.showModal({
              title: '已经在搜索设备中，或者已经连接！请勿反复点击',
              content: '如果要重新连接璃奈板，点击“确定”重启小程序',
              complete: (res) => {
                if (res.confirm) {
                  wx.exitMiniProgram();
                }
              }
            })
            return;
        }
        wx.openBluetoothAdapter({
            mode: 'central',
            success: (res) => {
                searchingBLE=true;
                wx.startBluetoothDevicesDiscovery({
                    allowDuplicatesKey: false,
                  })
            },
            fail: (res) => {
                console.log(res)
                
              if (res.errCode !== 10001){
                wx.showModal({
                    title: '蓝牙启动错误',
                    content: "错误代码："+res.errCode,
                  })
                  return
              }
              wx.showModal({
                title: '蓝牙启动错误',
                content: "请先打开“位置信息”与“蓝牙”！",
              })
              wx.onBluetoothAdapterStateChange((res) => {
                if (!res.available) return
                wx.startBluetoothDevicesDiscovery({
                    allowDuplicatesKey: false,
                  })
              })
            }
          })
    },
    changeBrightness: function(event){
        this.setData({brightness: event.detail.value})
        sendUdpDefault('S '+event.detail.value);
    },
    sendOTA(){
        if(ipa_out.ip=='null'){
            wx.showModal({
              title: 'wifi未连接',
              content: '请确保已经发送wifi信息，并显示连接成功！'
            })
            return;
        }
        wx.showModal({
          title: '警告',
          content: "确认更新固件至版本"+thispage.data.BinList[thispage.data.BinVersion]+'?',
          complete: (res) => {
            if (res.confirm) {
              sendUdpDefault('U '+thispage.data.BinList[thispage.data.BinVersion]+'.bin')
              wx.showModal({
                title: '发送成功',
                content: '请等待更新完成后，重启小程序再次进行蓝牙连接',
                complete: (res)=>{
                    wx.exitMiniProgram()
                }
              })
            }
          }
        })
    },
    sendDispMessage(){
        sendUdpDefault('t');
        sendUdpDefault('p'+this.data.slide_intv);
        for(var i in this.data.dispMessage){
            var char_data=read_char_extra(this.data.dispMessage[i]);
            if(char_data==''){
                char_data=read_char(get_gbk_offset(this.data.dispMessage[i]));
                if(char_data=='') return;
            }
            sendUdpDefault('T'+char_data);
        }
        sendUdpDefault('P');
    },
    setDispMessage(e){
        this.setData({dispMessage: e.detail.value});
    },
    setSlideIntv(e){
        this.setData({slide_intv: parseInt(e.detail.value)});
    }
})

let setBLEstatus=function(val){
    thispage.setData({ble_status: val});
    app.globalData.blestat=val;
}
// 监听扫描到新设备事件
wx.onBluetoothDeviceFound((res) => {
    res.devices.forEach((device) => {
      // 这里可以做一些过滤
      if(device.name=="RinaChanBoard"){
        deviceId=device.deviceId;
        wx.createBLEConnection({
            deviceId, // 搜索到设备的 deviceId
            success: () => {
                console.log("成功连接")
                setBLEstatus(true);
                wx.showModal({
                    title: '蓝牙连接成功！',
                    content: "你现在可以直接操控璃奈板了！(需要固件版本大于等于0.1.0)\n如果要更新固件，请在输入框中依次填写好 wifi/热点 名称、密码，并点击“发送wifi信息！”"+
                    "\n 注意：wifi/热点 必须设置为2.4ghz而非5ghz，并关闭wifi6选项，否则无法连接！"
                })
                wx.getBLEDeviceServices({
                    deviceId,
                    success: (res)=>{
                        console.log(res);
                        wx.getBLEDeviceCharacteristics({
                            deviceId: deviceId,
                            serviceId: res.services[0].uuid,
                            success: (res)=>{
                                wx.getBLEMTU({
                                    deviceId: deviceId,
                                    writeType: 'write',
                                    success (res) {
                                      app.globalData.BLEmtu=res.mtu-4;
                                      wx.setBLEMTU({
                                        deviceId: deviceId,
                                        mtu: 511,
                                        success(res){
                                            wx.showToast({
                                                title: 'MTU: '+res.mtu,
                                                icon: 'none'
                                            })
                                            app.globalData.BLEmtu=res.mtu-4;
                                            sendInit();
                                        }
                                      })
                                    }
                                })
                            }
                        })
                    }
                })
            }
          })
        wx.stopBluetoothDevicesDiscovery()
      }
      console.log('Device Found', device)
    })
    // 找到要搜索的设备后，及时停止扫描
  })




module.exports={
    IndexExport,
    sendBLEmessage
}


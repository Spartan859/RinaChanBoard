// index.js
// 获取应用实例
const app = getApp()

var pagecon;

Page({
    data:{
        wifi_ssid: "",
        wifi_pwd: "",
        ble_msg: "蓝牙尚未连接成功",
        ble_status: false
    },
    setWifiSSID: function(e){
        this.setData({wifi_ssid: e.detail.value})
    },
    setWifiPWD: function(e){
        this.setData({wifi_pwd: e.detail.value})
    },
    startBLEsearch: function(){
        wx.startBluetoothDevicesDiscovery();
    },
})

let setBLEstatus=function(val){
    if(val==true) getCurrentPages()[0].setData({ble_msg: "已连接",ble_status: val});
    else getCurrentPages()[0].setData({ble_msg: "蓝牙尚未连接成功",ble_status: val});
}
// 监听扫描到新设备事件
wx.onBluetoothDeviceFound((res) => {
    res.devices.forEach((device) => {
      // 这里可以做一些过滤
      if(device.name=="RinaChanBoard"){
         let deviceId=device.deviceId;
        wx.createBLEConnection({
            deviceId, // 搜索到设备的 deviceId
            success: () => {
                console.log("成功连接")
                setBLEstatus(true);
              // 连接成功，获取服务
              wx.getBLEDeviceServices({
                deviceId,
              })
            }
          })
        wx.stopBluetoothDevicesDiscovery()
      }
      console.log('Device Found', device)
    })
    // 找到要搜索的设备后，及时停止扫描
  })

// 初始化蓝牙模块
wx.openBluetoothAdapter({
    mode: 'central',
    success: (res) => {
    },
    fail: (res) => {
      if (res.errCode !== 10001) return
      wx.onBluetoothAdapterStateChange((res) => {
        if (!res.available) return
      })
    }
  })


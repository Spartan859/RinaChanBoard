<template>
	<view class="content">
		<text class="bigblue">蓝牙配网</text>
		<text class="small_text">{{ble_status?"已连接":"蓝牙尚未连接成功"}}</text>
		<button type="primary" size="mini" style="margin-top: 10px;">{{ble_status?"已连接":"先点我 连接至璃奈板"}}</button>
	</view>
</template>

<script>
	import {ipa_out,sendInit,resetipa,sleep} from '../../utils/util'
	const str2ab=require('../../utils/util.js').stringToHexBuffer
	
	const ExpMatrixInit=require('../../assets/expressions.js').ExpMatrixInit;
	
	const SERVICE_UUID='85253ceb-b0b7-4cc2-8e81-c22affa36a43';
	const WIFI_UUID='586f7454-dc36-442b-8a87-7e5368a5c42a';
	const MESSAGE_UUID='a1303310-cd55-4c46-8140-61b17f22bf01';
	
	var exp_matrix={};
	var deviceId;
	
	
	export default {
		data() {
			return {
				title: 'Hello',
				ble_status: false,
				wifi_ssid: "",
				wifi_pwd: ""
			}
		},
		onLoad() {

		},
		methods: {
			async prepareInit(){
			    console.log(ipa_out.ip);
			    while(ipa_out.ip=='null'){
			        console.log(ipa_out.ip)
			        await sleep(500);
			    }
			    sendInit();
			}
		},
	}
			/*
			sendWifiValue(){
			    console.log(deviceId);
			    wx.setStorageSync('ssid', this.data.wifi_ssid);
			    wx.setStorageSync('pwd', this.data.wifi_pwd);
			    if(deviceId==undefined){
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
			    wx.writeBLECharacteristicValue({
			      characteristicId: WIFI_UUID,
			      deviceId: deviceId,
			      serviceId: SERVICE_UUID,
			      value: str2ab(this.data.wifi_ssid+';'+this.data.wifi_pwd),
			    })
			    deviceId=undefined;
			    this.setData({ble_status: false});
			    this.prepareInit();
			},
			updateExpMatrix: function(){
			    //console.log(ExpMatrixInit)
			    exp_matrix=wx.getStorageSync('ExpMatrix');
			    if(exp_matrix==''){
			        exp_matrix=ExpMatrixInit;
			        wx.setStorageSync('ExpMatrix', exp_matrix);
			    }
			},
			updateSSIDandPWD: function(){
			    this.setData({
			        wifi_ssid: wx.getStorageSync('ssid'),
			        wifi_pwd: wx.getStorageSync('pwd')
			    })
			    console.log(this.data.wifi_ssid);
			},
		}
	}
	
	Page({
	    
	    onLoad: function(options){
	        this.updateExpMatrix();
	        this.updateSSIDandPWD();
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
	        wx.startBluetoothDevicesDiscovery();
	    },
	})
	
	let setBLEstatus=function(val){
	    getCurrentPages()[0].setData({ble_status: val});
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
	                  content: "请在输入框中依次填写好 wifi/热点 名称、密码，并点击“发送wifi信息！”"+
	                  "\n 注意：wifi/热点 必须设置为2.4ghz而非5ghz，并关闭wifi6选项，否则无法连接！"
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
	  })*/
	

</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	
	.bigblue{
		color: blue;font-size: larger;font-weight: bolder;
		margin-top: 10px;
	}
	
	.small_text{
		font-size: small;
		margin-top: 10px;
	}
</style>

<template>
    <!-- index.wxml -->
    <view class="container">
        <text style="color: blue; font-size: larger; font-weight: bolder">蓝牙配网</text>
        <text style="font-size: small">{{ ble_status ? '已连接' : '蓝牙尚未连接成功' }}</text>
        <button style="font-size: small" @tap="startBLEsearch">{{ ble_status ? '已连接' : '先点我 连接至璃奈板' }}</button>
        <view class="weui-cells weui-cells_after-title">
            <view class="weui-cell weui-cell_input">
                <input class="weui-input" @input="setWifiSSID" placeholder="输入wifi名称" :value="wifi_ssid" />
            </view>
            <view class="weui-cell weui-cell_input">
                <input class="weui-input" @input="setWifiPWD" placeholder="输入wifi密码" :value="wifi_pwd" />
            </view>
        </view>
        <button style="font-size: small; margin-bottom: 10px" @tap="sendWifiValue">发送WiFi信息</button>
        <button style="font-size: small" @tap="prepareInit">发送配置文件</button>
    </view>
</template>

<script>
// index.js
// 获取应用实例
import { ipa_out, sendInit, resetipa, sleep } from '../../utils/util';
console.log(ipa_out.ip);
const app = getApp();
const str2ab = require('../../utils/util.js').stringToHexBuffer;
const ExpMatrixInit = require('../../assets/expressions.js').ExpMatrixInit;
const SERVICE_UUID = '85253ceb-b0b7-4cc2-8e81-c22affa36a43';
const WIFI_UUID = '586f7454-dc36-442b-8a87-7e5368a5c42a';
var exp_matrix = {};
var deviceId;
export default {
    data() {
        return {
            wifi_ssid: '',
            wifi_pwd: '',
            ble_status: false
        };
    },
    onLoad: function (options) {
        this.updateExpMatrix();
        this.updateSSIDandPWD();
    },
    methods: {
        prepareInit: async function () {
            console.log(ipa_out.ip);
            while (ipa_out.ip == 'null') {
                console.log(ipa_out.ip);
                await sleep(500);
            }
            sendInit();
        },

        sendWifiValue: function () {
            console.log(deviceId);
            uni.setStorageSync('ssid', this.wifi_ssid);
            uni.setStorageSync('pwd', this.wifi_pwd);
            if (deviceId == undefined) {
                if (ipa_out.ip != 'null') {
                    uni.showModal({
                        title: '蓝牙未连接',
                        content:
                            '当前已存ip: ' +
                            ipa_out.ip +
                            '\n如果璃奈板未显示初始表情，或表情显示不完整，请手动点击“发送配置文件”' +
                            '\n如果你重启了璃奈板，请先点击上方按钮连接蓝牙！'
                    });
                    return;
                }
                uni.showModal({
                    title: '蓝牙未连接',
                    content: '蓝牙未连接，无法发送wifi信息！'
                });
                return;
            }
            resetipa();
            console.log(ipa_out.ip);
            console.log(str2ab(this.wifi_ssid + ';' + this.wifi_pwd));
            uni.writeBLECharacteristicValue({
                characteristicId: WIFI_UUID,
                deviceId: deviceId,
                serviceId: SERVICE_UUID,
                value: str2ab(this.wifi_ssid + ';' + this.wifi_pwd)
            });
            deviceId = undefined;
            this.setData({
                ble_status: false
            });
            this.prepareInit();
        },

        updateExpMatrix: function () {
            //console.log(ExpMatrixInit)
            exp_matrix = uni.getStorageSync('ExpMatrix');
            if (exp_matrix == '') {
                exp_matrix = ExpMatrixInit;
                uni.setStorageSync('ExpMatrix', exp_matrix);
            }
        },

        updateSSIDandPWD: function () {
            this.setData({
                wifi_ssid: uni.getStorageSync('ssid'),
                wifi_pwd: uni.getStorageSync('pwd')
            });
            console.log(this.wifi_ssid);
        },

        setWifiSSID: function (e) {
            this.setData({
                wifi_ssid: e.detail.value
            });
            return {
                value: e.detail.value
            };
        },

        setWifiPWD: function (e) {
            this.setData({
                wifi_pwd: e.detail.value
            });
            return {
                value: e.detail.value
            };
        },

        startBLEsearch: function () {
            uni.startBluetoothDevicesDiscovery();
        }
    }
};
let setBLEstatus = function (val) {
    getCurrentPages()[0].setData({
        ble_status: val
    });
};
// 监听扫描到新设备事件
uni.onBluetoothDeviceFound((res) => {
    res.devices.forEach((device) => {
        // 这里可以做一些过滤
        if (device.name == 'RinaChanBoard') {
            deviceId = device.deviceId;
            uni.createBLEConnection({
                deviceId,
                // 搜索到设备的 deviceId
                success: () => {
                    console.log('成功连接');
                    setBLEstatus(true);
                    uni.showModal({
                        title: '蓝牙连接成功！',
                        content:
                            '\u8BF7\u5728\u8F93\u5165\u6846\u4E2D\u4F9D\u6B21\u586B\u5199\u597D wifi/\u70ED\u70B9 \u540D\u79F0\u3001\u5BC6\u7801\uFF0C\u5E76\u70B9\u51FB\u201C\u53D1\u9001wifi\u4FE1\u606F\uFF01\u201D\n \u6CE8\u610F\uFF1Awifi/\u70ED\u70B9 \u5FC5\u987B\u8BBE\u7F6E\u4E3A2.4ghz\u800C\u975E5ghz\uFF0C\u5E76\u5173\u95EDwifi6\u9009\u9879\uFF0C\u5426\u5219\u65E0\u6CD5\u8FDE\u63A5\uFF01'
                    });
                }
            });
            uni.stopBluetoothDevicesDiscovery();
        }
        console.log('Device Found', device);
    });
    // 找到要搜索的设备后，及时停止扫描
});

// 初始化蓝牙模块
uni.openBluetoothAdapter({
    mode: 'central',
    success: (res) => {},
    fail: (res) => {
        if (res.errCode !== 10001) {
            return;
        }
        uni.onBluetoothAdapterStateChange((res) => {
            if (!res.available) {
                return;
            }
        });
    }
});
</script>
<style>
/**index.wxss**/
.userinfo {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #aaa;
}

.userinfo-avatar {
    overflow: hidden;
    width: 128rpx;
    height: 128rpx;
    margin: 20rpx;
    border-radius: 50%;
}

.usermotto {
    margin-top: 200px;
}
</style>

const encoding = require("./encoding.js")

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

export function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
function buffer2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}
  export const stringToHexBuffer = function (str) {
    // 首先将字符串转为16进制
    let val = ''
    for (let i = 0; i < str.length; i++) {
      if (val === '') {
        val = str.charCodeAt(i).toString(16)
      } else {
        val += ',' + str.charCodeAt(i).toString(16)
      }
    }
    // 将16进制转化为ArrayBuffer
    return new Uint8Array(
      val.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
      })
    ).buffer
  }
const is_ip = (ip) =>{
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
}
function buf2hex(arrayBuffer) {
	return Array.prototype.map.call(new Uint8Array(arrayBuffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
function hexToStr(hex) {
	// 去掉字符串首尾空格
	let trimedStr = hex.trim()
	// 判断trimedStr前两个字符是否为0x，如果是则截取从第三个字符及后面所有，否则返回全部字符
	let rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr
	// 得到rawStr的长度
	let len = rawStr.length
	// 如果长度不能被2整除，那么传入的十六进制值有误，返回空字符
	if (len % 2 !== 0) {
		return ""
	}
	let curCharCode // 接收每次循环得到的字符
	let resultStr = [] // 存转换后的十进制值数组
	for (let i = 0; i < len; i = i + 2) {
		curCharCode = parseInt(rawStr.substr(i, 2), 16)
		resultStr.push(curCharCode)
	}
	// encoding为空时默认为utf-8
	let bytesView = new Uint8Array(resultStr) // 8 位无符号整数值的类型化数组
	// TextEncoder和TextDecoder对字符串和字节流互转  
	// let str = new TextDecoder(encoding).decode(bytesView)因为小程序中没有TextDecoder,经查阅资料，下载https://github.com/inexorabletash/text-encoding并const encoding = require("./text-encoding-master/lib/encoding.js")引入后使用下面方式即可：
	let str = new encoding.TextDecoder("gbk").decode(bytesView)
	return str
}

const socket=wx.createUDPSocket();
socket.bind(23333);
const sendto_port=8888;
socket.onMessage(function(res){
    ipa_out.ip=hexToStr(buf2hex(res.message));
    wx.setStorageSync('ipa_out', ipa_out.ip);
    wx.showModal({
      title: 'wifi连接成功！',
      content: 'ip: '+ipa_out.ip+'\n如果璃奈板未显示初始表情，或表情显示不完整，请手动点击“发送配置文件”'
    })
})


export var ipa_out={ip: 'null'};
ipa_out.ip=wx.getStorageSync('ipa_out');
if(ipa_out.ip=='') ipa_out.ip='null';
export function resetipa(){
    ipa_out.ip='null';
    wx.setStorageSync('ipa_out', ipa_out.ip)
}

const sendUdpString=(msg,port,ip)=>{
    if(!is_ip(ip)){
        console.log('udp sending to a false ip: '+ip);
        return;
    }
    socket.send({
        message: msg,
        port: port,
        address: ip
    })
}

export const sendUdpDefault=(msg)=>{
    sendUdpString(msg,sendto_port,ipa_out.ip);
}

export const sendInit=async ()=>{
    //sendUdpString("test",sendto_port,ipa);
    //console.log(getLocalExpFile());
    //if(OfflineMode==true) return;
    console.log("Sending Init!!!!!!!!!!!!!!");
    console.log(ipa_out.ip);
    let str=JSON.stringify(wx.getStorageSync('ExpMatrix'));
    console.log(str);
    var yz=1400;
    sendUdpDefault('C');
    console.log("sending pack");
    await sleep(300);
    for(var i=0;i<str.length;i+=yz){
        console.log("sending pack");
        //console.log(str.substr(i,yz));
        sendUdpDefault('A'+str.substr(i,yz));
        await sleep(300);
    }
    sendUdpDefault('B');
}

module.exports = {
  formatTime,
  stringToHexBuffer,
  sendInit,
  sendUdpDefault,
  resetipa,
  sleep,
  ipa_out
}

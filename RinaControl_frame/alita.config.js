const { default: CheckBox } = require('@react-native-community/checkbox')
const path=require('path')
module.exports = {
    entry: "./src/index.js", // 上面入口文件路径
    output: "./wx-dist",    // 小程序输出目录
    include:[
        path.resolve('src'),
        path.resolve('node_modules', '@react-native-community','checkbox'),
        path.resolve('node_modules',"react-native-webview"),
    ],
}
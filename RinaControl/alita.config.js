const path=require('path')
module.exports = {
    entry: "./src/index.js", // 上面入口文件路径
    output: "./wx-dist",    // 小程序输出目录
    include:[
        path.resolve('src'),
        path.resolve('node_modules', 'react-native-dropdown-picker'),
        path.resolve('node_modules', '@miblanchard', 'react-native-slider'),
        path.resolve('node_modules', 'react-native-video'),
        path.resolve('node_modules', 'react-native-video-controls'),
    ],
}
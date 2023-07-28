import Encoder from './GBK_encoder'
function get_gbk_offset(charstr){
    var gbkArray = Encoder.stringToGbkHexstr(charstr);
    var high=parseInt('0x'+gbkArray[0]+gbkArray[1]);
    var low=parseInt('0x'+gbkArray[2]+gbkArray[3]);
    if (low < 0x80)
	{
		return ((high-0x81)*190 + (low-0x40))*32;
	}
	else
	{
		return ((high-0x81)*190 + (low-0x41))*32;
	}
}
function read_char(offset){
    var fs=wx.getFileSystemManager();
    var route=wx.getStorageSync('gbk_dzk');
    console.log(route);
    if(route==''){
        wx.showModal({
          title: '警告',
          content: '字模尚未下载完成！若始终提示此消息，请重启小程序！',
        })
        return '';
    }
    var char_data=fs.readFileSync(route,"hex",offset,32);
    
    for(var st=0;st<char_data.length;st+=4){
        var code1=parseInt('0x'+char_data[st]+char_data[st+1]);
        var code2=parseInt('0x'+char_data[st+2]+char_data[st+3]);
        var tmp_code=(code1<<8)|code2;
        console.log(tmp_code)
        var tmp_str="";
        for(var j=15;j>=0;j--){
            if((tmp_code>>j)&1){
                tmp_str=tmp_str+'●';
            }else tmp_str=tmp_str+'○';
        }
        console.log(tmp_str)
    }
    return char_data;
}

module.exports={
    get_gbk_offset,
    read_char
}
// pages/ManualScreen/ManualScreen.js
import {IndexExport} from '../index/index'
import {sleep,sendUdpDefault,sendTxt} from '../../utils/util'
console.log(IndexExport.exp_matrix);

var ExpViewA;
const FPS=10;
var ExpContent={};
var lastFrame=-1;

var syncLR=false;

var exp_all={"eye_left":0,"eye_right":0,"cheek":0,"mouth":0,"full_face":0};
const exp_order={"eye_left":0,"eye_right":1,"cheek":3,"mouth":2,"full_face":4};

var SongLinkList=[]
var thispage;
var curSongid=0;

var len=18,hei=16;
var id_matrix=JSON.parse(`
    [{"0":-1,"1":-1,"2":38,"3":39,"4":70,"5":71,"6":102,"7":103,"8":134,"9":135,"10":166,"11":167,"12":198,"13":199,"14":230,"15":231,"16":-1,"17":-1},{"0":-1,"1":10,"2":37,"3":40,"4":69,"5":72,"6":101,"7":104,"8":133,"9":136,"10":165,"11":168,"12":197,"13":200,"14":229,"15":232,"16":259,"17":-1},{"0":9,"1":11,"2":36,"3":41,"4":68,"5":73,"6":100,"7":105,"8":132,"9":137,"10":164,"11":169,"12":196,"13":201,"14":228,"15":233,"16":258,"17":260},{"0":8,"1":12,"2":35,"3":42,"4":67,"5":74,"6":99,"7":106,"8":131,"9":138,"10":163,"11":170,"12":195,"13":202,"14":227,"15":234,"16":257,"17":261},{"0":7,"1":13,"2":34,"3":43,"4":66,"5":75,"6":98,"7":107,"8":130,"9":139,"10":162,"11":171,"12":194,"13":203,"14":226,"15":235,"16":256,"17":262},{"0":6,"1":14,"2":33,"3":44,"4":65,"5":76,"6":97,"7":108,"8":129,"9":140,"10":161,"11":172,"12":193,"13":204,"14":225,"15":236,"16":255,"17":263},{"0":5,"1":15,"2":32,"3":45,"4":64,"5":77,"6":96,"7":109,"8":128,"9":141,"10":160,"11":173,"12":192,"13":205,"14":224,"15":237,"16":254,"17":264},{"0":4,"1":16,"2":31,"3":46,"4":63,"5":78,"6":95,"7":110,"8":127,"9":142,"10":159,"11":174,"12":191,"13":206,"14":223,"15":238,"16":253,"17":265},{"0":3,"1":17,"2":30,"3":47,"4":62,"5":79,"6":94,"7":111,"8":126,"9":143,"10":158,"11":175,"12":190,"13":207,"14":222,"15":239,"16":252,"17":266},{"0":2,"1":18,"2":29,"3":48,"4":61,"5":80,"6":93,"7":112,"8":125,"9":144,"10":157,"11":176,"12":189,"13":208,"14":221,"15":240,"16":251,"17":267},{"0":1,"1":19,"2":28,"3":49,"4":60,"5":81,"6":92,"7":113,"8":124,"9":145,"10":156,"11":177,"12":188,"13":209,"14":220,"15":241,"16":250,"17":268},{"0":0,"1":20,"2":27,"3":50,"4":59,"5":82,"6":91,"7":114,"8":123,"9":146,"10":155,"11":178,"12":187,"13":210,"14":219,"15":242,"16":249,"17":269},{"0":-1,"1":21,"2":26,"3":51,"4":58,"5":83,"6":90,"7":115,"8":122,"9":147,"10":154,"11":179,"12":186,"13":211,"14":218,"15":243,"16":248,"17":-1},{"0":-1,"1":22,"2":25,"3":52,"4":57,"5":84,"6":89,"7":116,"8":121,"9":148,"10":153,"11":180,"12":185,"13":212,"14":217,"15":244,"16":247,"17":-1},{"0":-1,"1":23,"2":24,"3":53,"4":56,"5":85,"6":88,"7":117,"8":120,"9":149,"10":152,"11":181,"12":184,"13":213,"14":216,"15":245,"16":246,"17":-1},{"0":-1,"1":-1,"2":-1,"3":54,"4":55,"5":86,"6":87,"7":118,"8":119,"9":150,"10":151,"11":182,"12":183,"13":214,"14":215,"15":-1,"16":-1,"17":-1}]
    `);
var id_to_coordinate=[[],[]];
for(var i=0;i<hei;i++)
    for(var j=0;j<len;j++){
        id_to_coordinate[0][id_matrix[i][j]]=i+1;
        id_to_coordinate[1][id_matrix[i][j]]=j+1;
    }

function format(t) {
    let time = Math.floor(t / 60) >= 10 ? Math.floor(t / 60) : '0' + Math.floor(t / 60)
    t = time + ':' + ((t % 60) / 100).toFixed(2).slice(-2)
    return t
}

function findLast(FL,cF){
    //console.log(cF)
    let l=0,r=FL.length-1,mid=0,ans=0;
    while(l<=r){
        mid=Math.floor(l+(r-l)/2);
        if(FL[mid]>cF){
            r=mid-1;
        }else{
            ans=mid;
            l=mid+1;
        }
    }
    //console.log(ans)
    return FL[ans];
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        duration: "10:00",
        currentTime: "00:00",
        show: false,
        curSecond: 0,
        curduration: 0,
        currentSecond: "00:00",
        SongList: [],
        curSongIndex: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //console.log(IndexExport.exp_matrix);
        thispage=this;
        this.audioCtx=wx.getBackgroundAudioManager();
        //this.startPlaying();
        this.watchAudio();
        this.StartProgressMonitor();
        //下载列表
        wx.request({
            url: 'https://autosz.satintin.com/RinaExpTxtFiles/',
            success(res){
                let tmpArray=[]
                for(var i in res.data){
                    let tmpstr=res.data[i].name
                    
                    tmpArray[i]=tmpstr.substring(0,tmpstr.length-4);
                    thispage.DownloadLive(tmpArray[i]);
                    console.log(tmpArray[i]);
                    SongLinkList[i]='https://autosz.satintin.com/'+tmpArray[i];
                }
                thispage.setData({SongList: tmpArray});
                
            }
          })
    },

    startPlaying(){
        this.audioCtx.src=SongLinkList[curSongid]
        this.audioCtx.title=this.data.SongList[curSongid];
        var SongSel=this.data.SongList[curSongid];
        //console.log(ExpContent[SongSel]['FrameList'])
        //this.audioCtx.play();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        ExpViewA=this.selectComponent('#ExpViewB');
        console.log(ExpViewA)
      },
    getExpSendStr(){
        return exp_all['eye_left'].toString()+','+exp_all['eye_right'].toString()
        +','+exp_all['cheek'].toString()
        +','+exp_all['mouth'].toString()+','+exp_all['full_face']+',';
    },
    setExp(catName,expId,tp){
        //console.log(exp_matrix[catName][expId])
        //ExpViewA=this.selectComponent('#ExpViewA');
        //console.log(ExpViewA)
        expId=parseInt(expId);
        for(var i in IndexExport.exp_matrix[catName][expId]){
            let pixel_id=IndexExport.exp_matrix[catName][expId][i];
            ExpViewA.setPixel(id_to_coordinate[0][pixel_id],id_to_coordinate[1][pixel_id],tp);
        }
    },
    sendExpString(){
        console.log('e'+this.getExpSendStr());
        sendUdpDefault('e'+this.getExpSendStr());
    },
    setSyncLR(event){
        syncLR^=1;
    },
    sliderChangeing:function(e){
    // 在滑动滚动条的时候，暂停播放
        this.pause();
        let time =e.detail.value;
    //通过 this.audioCtx.seek 将音频跳转至当前时间
        this.audioCtx.seek(time)
    // 修改 显示的 值 重新赋值
        this.setData({
        curSecond:time,
        currentSecond:format(time)
        })
    },
    sliderChange:function(e){
        this.play()
    },
    progressMonitor(cT){
        //console.log(cT);
        if(cT==undefined) return;
        if(!this.audioCtx.paused&&!this.data.show) this.pause();
        var curFrame=cT*FPS;
        //console.log(curFrame)
        var SongSel=this.data.SongList[curSongid];
        //console.log(ExpContent[SongSel]);
        if(ExpContent[SongSel]==undefined) return;
        //console.log(ExpContent[SongSel])
        if(ExpContent[SongSel]['FrameList']==undefined) return;
        var nowFrame=findLast(ExpContent[SongSel]['FrameList'],curFrame);
        //console.log(nowFrame)
        if(nowFrame==lastFrame) return;
        lastFrame=nowFrame;
        //console.log(curFrame,nowFrame);
        var exp_nowFrame=ExpContent[SongSel][nowFrame];
        for(var catName in exp_all){
            //console.log(catName);
            if(parseInt(exp_nowFrame[exp_order[catName]])==-1) continue;
            this.setExp(catName,exp_all[catName],0);
            exp_all[catName]=exp_nowFrame[exp_order[catName]];
            this.setExp(catName,exp_all[catName],1);
            //if(catName=='cheek') console.log(exp_all[catName]);
        }
        sendUdpDefault('e'+this.getExpSendStr());
    },

    // 时间格式化
// 监听 歌曲播放时间
  watchAudio: function () {
    this.audioCtx.onTimeUpdate(() => {
    // 拿取当前音频的总时长 带小数 转换成整数 放在slider：max="{{curduration}}"
      this.data.curduration = Math.ceil(this.audioCtx.duration);
    // 将音频总时长 换成"04:18" 格式显示 
      this.data.duration = format(this.data.curduration);
      
   // 拿取当前音频的播放时间 slider: value="{{curSecond}}"
      this.data.curSecond = Math.ceil(this.audioCtx.currentTime);
    // 将当前音频的播放时间 换成"04:18" 格式显示
      this.data.currentSecond = format(this.audioCtx.currentTime);
    // 将拿到的 数据 赋值给 显示的数据
      this.setData({
        curduration: this.data.curduration,
        duration: this.data.duration,
        curSecond: this.data.curSecond,
        currentSecond: this.data.currentSecond
      })
    })
    this.audioCtx.onEnded(()=>{
        this.startPlaying();
    })
    this.audioCtx.onPlay(()=>{
        console.log("played")

    })
  },
  play: function () {
    if (this.data.show == false) {
      this.setData({
        // 切换 播放 和 暂停 按钮
        show: !this.data.show
      })
    }
    this.audioCtx.play()

  },
// 暂停功能
  pause: function () {
    this.setData({
        show: false
      })
      this.audioCtx.pause()
  },
  toggle_play(){
      //console.log("asdhjqjkwhedkas")
    if (this.data.show == false) {
        if(this.audioCtx.src==undefined) this.startPlaying()
        else this.audioCtx.play()
        //console.log("yes")
      }else{
        this.audioCtx.pause()
        //console.log("no")
      }
    this.setData({
    // 切换 播放 和 暂停 按钮
        show: !this.data.show
    })
  },
  ChangeSong(event){
      curSongid=event.detail.value
    this.audioCtx.src=SongLinkList[curSongid];
    this.audioCtx.title=this.data.SongList[curSongid];
    console.log(this.audioCtx.src);

    lastFrame=-1;
    this.setData({curSongIndex: event.detail.value})
    
  },
  DownloadLive(live_name){
      var tmpContent=wx.getStorageSync(live_name)
    if(tmpContent!=''){
        ExpContent[live_name]=tmpContent;
        return;
    }
    console.log("Downloading ",live_name);
    wx.request({
      url: 'https://autosz.satintin.com/RinaExpTxtFiles/'+live_name+'.txt',
      success(res){
        var str=res.data;
        var ExpFile={};
        ExpFile['FrameList']=[];
        var all_Lines=str.trim().split('\n');
        for(var j in all_Lines){
            //console.log(j);
            ExpFile['FrameList'][j]=parseInt(all_Lines[j].split('!')[0]);
            var tttmp=all_Lines[j].split('!')[1].split(',');
            tttmp.push("0");
            ExpFile[parseInt(all_Lines[j].split('!')[0])]=tttmp;
        }
        //ExpFile=JSON.stringify(ExpFile);
        wx.setStorageSync(live_name, ExpFile);
        ExpContent[live_name]=ExpFile;
      }
    })
  },
  StartProgressMonitor(){
    setInterval(()=>{
        this.progressMonitor(this.audioCtx.currentTime);
    },50)
  },
  TestFL(){
    var SongSel=this.data.SongList[curSongid];
    return findLast(ExpContent[SongSel]['FrameList'],106);
  },
  ClearSongTxt(){
      for(var sid in this.data.SongList){
          var sname=this.data.SongList[sid];
          console.log("REMOVE",sname)
          wx.removeStorageSync(sname);
      }
      wx.showModal({
        title: '歌曲缓存清理完毕！',
        content: '重启即可下载最新歌曲文件！是否重启？',
        complete: (res) => {
          if (res.confirm) {
            wx.exitMiniProgram();
          }
        }
      })
  },
  ST(time){
    this.audioCtx.seek(time);
    this.audioCtx.play();
  }
})


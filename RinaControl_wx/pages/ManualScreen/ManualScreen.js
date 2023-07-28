// pages/ManualScreen/ManualScreen.js
import {IndexExport} from '../index/index'
import {sleep,sendUdpDefault,sendTxt, sendInit} from '../../utils/util'
console.log(IndexExport.exp_matrix);

var ExpViewA;
const FPS=10;

var syncLR=false;

var exp_all={"eye_left":0,"eye_right":0,"cheek":0,"mouth":0,"full_face":0};
var exp_init_num={"eye_left":21,"eye_right":21,"cheek":16,"mouth":18,"full_face":0};
const exp_order={"eye_left":0,"eye_right":1,"cheek":3,"mouth":2,"full_face":4};
const catIdList=['eye_left','eye_right','cheek','mouth','full_face'];

var image_uri_list={};

var thispage;

var sending_Init=false;

var USER_exp_matrix={};
var USER_image_uri_list={};

for(var catName in exp_all){
    USER_exp_matrix[catName]=[];
    USER_image_uri_list[catName]=[];
}


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

async function getImageTobase64_url(tempFilePath) {
    const base64 = await new Promise(resolve => {
        wx.request({
        url: tempFilePath,
        responseType: 'arraybuffer', //关键的参数，设置返回的数据格式为arraybuffer
        success: res => {
            //把arraybuffer转成base64
            let data = wx.arrayBufferToBase64(res.data);
            return resolve(('data:image/jpeg;base64,' + data));
        }
        });
    });
    return base64;
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        expMa: {},
        image_len: wx.getSystemInfoSync().screenHeight*65/1027,
        CatList: ["左眼","右眼","脸颊","嘴巴","全脸"],
        curCatIndex: 0,
        imageUri: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        //console.log(IndexExport.exp_matrix);
        let Uem_tmp=wx.getStorageSync('USER_exp_matrix');
        if(Uem_tmp!='') USER_exp_matrix=Uem_tmp;
        let Uim_tmp=wx.getStorageSync('USER_image_uri_list');
        if(Uim_tmp!='') USER_image_uri_list=Uim_tmp;

        thispage=this;
        let im_tmp=wx.getStorageSync('image_uri_list');
        if(im_tmp!='') image_uri_list=im_tmp;
        else{
            for(var catName in exp_all){
                image_uri_list[catName]=[];
                for(var i=0;i<=exp_init_num[catName];i++){
                    image_uri_list[catName][i]=await getImageTobase64_url('https://autosz.satintin.com/images/'+catName+i+'.png')
                    //console.log(image_uri_list[catName][i]);
                }
                image_uri_list[catName]=image_uri_list[catName].concat(USER_image_uri_list[catName]);
            }
        }
        this.setData({expMa: IndexExport.exp_matrix,imageUri: image_uri_list});
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        ExpViewA=this.selectComponent('#ExpViewA');
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
    pressHandler(event){
        //console.log(this.data.canvas_height)
        let catName=event.currentTarget.dataset.catname;
        let expId=event.currentTarget.dataset.id;
        if(catName!='full_face'){
            this.setExp('full_face',exp_all['full_face'],0);
            exp_all['full_face']=0;
            this.setExp('full_face',exp_all['full_face'],1);
        }else{
            for(var catx in exp_all){
                if(catx=='full_face') continue;
                this.setExp(catx,exp_all[catx],0);
                exp_all[catx]=0;
                this.setExp(catx,exp_all[catx],1);
            }
        }
        this.setExp(catName,exp_all[catName],0);
        exp_all[catName]=expId;
        this.setExp(catName,exp_all[catName],1);
        if(syncLR){
            if(catName=='eye_left'){
                this.setExp('eye_right',exp_all['eye_right'],0);
                exp_all['eye_right']=expId;
                this.setExp('eye_right',exp_all['eye_right'],1);
            }
            if(catName=='eye_right'){
                this.setExp('eye_left',exp_all['eye_left'],0);
                exp_all['eye_left']=expId;
                this.setExp('eye_left',exp_all['eye_left'],1);
            }
        }
    },
    sendExpString(){
        if(sending_Init){
            wx.showModal({
              title: '璃奈很忙！',
              content: '璃奈电波发送中，请稍后再操作！'
            })
            return;
        }
        console.log('e'+this.getExpSendStr());
        sendUdpDefault('e'+this.getExpSendStr());
    },
    setSyncLR(event){
        syncLR^=1;
    },
  longpressHandler(event){
    let catName=event.currentTarget.dataset.catname;
    let expId=event.currentTarget.dataset.id;
    if(expId<=exp_init_num[catName]){
        wx.showModal({
          title: '无法删除表情',
          content: '初始表情不能删除！'
        })
        return;
    }
    wx.showModal({
      title: '删除表情',
      content: '是否要删除此表情？',
      complete: (res) => {
        if (res.confirm) {
          this.deleteExp(catName,expId);
        }
      }
    })
  },
  ChangeCat(event){
    this.setData({curCatIndex: event.detail.value});
  },
  ExportTo(){
      sending_Init=true;
      var SelList=ExpViewA.output_all();
      var catName=catIdList[this.data.curCatIndex];
      IndexExport.exp_matrix[catName].push(SelList);
      USER_exp_matrix[catName].push(SelList);

      var tmp_uri=ExpViewA.getImageUri();
      image_uri_list[catName].push(tmp_uri);
      USER_image_uri_list[catName].push(tmp_uri);

      console.log(IndexExport.exp_matrix);

      wx.setStorageSync('ExpMatrix', IndexExport.exp_matrix);
      wx.setStorageSync('image_uri_list', image_uri_list);
      wx.setStorageSync('USER_exp_matrix', USER_exp_matrix);
      wx.setStorageSync('USER_image_uri_list', USER_image_uri_list);

      this.setData({expMa: IndexExport.exp_matrix,imageUri: image_uri_list});
      sendInit().then(()=>{sending_Init=false});
  },
  deleteExp(catName,expId){
    sending_Init=true;
    if(exp_all[catName]==expId){ 
        exp_all[catName]=0;
        this.setExp(catName,expId,0);
        this.sendExpString();
    }
    IndexExport.exp_matrix[catName].splice(expId,1);
    image_uri_list[catName].splice(expId,1);
    USER_exp_matrix[catName].splice(expId-exp_init_num[catName],1);
    USER_image_uri_list[catName].splice(expId-exp_init_num[catName],1);

    wx.setStorageSync('ExpMatrix', IndexExport.exp_matrix);
    wx.setStorageSync('image_uri_list', image_uri_list);
    wx.setStorageSync('USER_exp_matrix', USER_exp_matrix);
    wx.setStorageSync('USER_image_uri_list', USER_image_uri_list);
    this.setData({expMa: IndexExport.exp_matrix,imageUri: image_uri_list});
    
    sendInit().then(()=>{sending_Init=false});
},
  EraseExpView(){
      for(var catName in exp_all){
          exp_all[catName]=0;
      }
      ExpViewA.erase_all();
  }
})


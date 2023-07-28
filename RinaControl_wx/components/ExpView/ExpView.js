const len=18,hei=16;
var id_matrix=JSON.parse(`
    [{"0":-1,"1":-1,"2":38,"3":39,"4":70,"5":71,"6":102,"7":103,"8":134,"9":135,"10":166,"11":167,"12":198,"13":199,"14":230,"15":231,"16":-1,"17":-1},{"0":-1,"1":10,"2":37,"3":40,"4":69,"5":72,"6":101,"7":104,"8":133,"9":136,"10":165,"11":168,"12":197,"13":200,"14":229,"15":232,"16":259,"17":-1},{"0":9,"1":11,"2":36,"3":41,"4":68,"5":73,"6":100,"7":105,"8":132,"9":137,"10":164,"11":169,"12":196,"13":201,"14":228,"15":233,"16":258,"17":260},{"0":8,"1":12,"2":35,"3":42,"4":67,"5":74,"6":99,"7":106,"8":131,"9":138,"10":163,"11":170,"12":195,"13":202,"14":227,"15":234,"16":257,"17":261},{"0":7,"1":13,"2":34,"3":43,"4":66,"5":75,"6":98,"7":107,"8":130,"9":139,"10":162,"11":171,"12":194,"13":203,"14":226,"15":235,"16":256,"17":262},{"0":6,"1":14,"2":33,"3":44,"4":65,"5":76,"6":97,"7":108,"8":129,"9":140,"10":161,"11":172,"12":193,"13":204,"14":225,"15":236,"16":255,"17":263},{"0":5,"1":15,"2":32,"3":45,"4":64,"5":77,"6":96,"7":109,"8":128,"9":141,"10":160,"11":173,"12":192,"13":205,"14":224,"15":237,"16":254,"17":264},{"0":4,"1":16,"2":31,"3":46,"4":63,"5":78,"6":95,"7":110,"8":127,"9":142,"10":159,"11":174,"12":191,"13":206,"14":223,"15":238,"16":253,"17":265},{"0":3,"1":17,"2":30,"3":47,"4":62,"5":79,"6":94,"7":111,"8":126,"9":143,"10":158,"11":175,"12":190,"13":207,"14":222,"15":239,"16":252,"17":266},{"0":2,"1":18,"2":29,"3":48,"4":61,"5":80,"6":93,"7":112,"8":125,"9":144,"10":157,"11":176,"12":189,"13":208,"14":221,"15":240,"16":251,"17":267},{"0":1,"1":19,"2":28,"3":49,"4":60,"5":81,"6":92,"7":113,"8":124,"9":145,"10":156,"11":177,"12":188,"13":209,"14":220,"15":241,"16":250,"17":268},{"0":0,"1":20,"2":27,"3":50,"4":59,"5":82,"6":91,"7":114,"8":123,"9":146,"10":155,"11":178,"12":187,"13":210,"14":219,"15":242,"16":249,"17":269},{"0":-1,"1":21,"2":26,"3":51,"4":58,"5":83,"6":90,"7":115,"8":122,"9":147,"10":154,"11":179,"12":186,"13":211,"14":218,"15":243,"16":248,"17":-1},{"0":-1,"1":22,"2":25,"3":52,"4":57,"5":84,"6":89,"7":116,"8":121,"9":148,"10":153,"11":180,"12":185,"13":212,"14":217,"15":244,"16":247,"17":-1},{"0":-1,"1":23,"2":24,"3":53,"4":56,"5":85,"6":88,"7":117,"8":120,"9":149,"10":152,"11":181,"12":184,"13":213,"14":216,"15":245,"16":246,"17":-1},{"0":-1,"1":-1,"2":-1,"3":54,"4":55,"5":86,"6":87,"7":118,"8":119,"9":150,"10":151,"11":182,"12":183,"13":214,"14":215,"15":-1,"16":-1,"17":-1}]
    `);
var id_to_coordinate=[[],[]];

for(var i=0;i<hei;i++)
    for(var j=0;j<len;j++){
        id_to_coordinate[0][id_matrix[i][j]]=i+1;
        id_to_coordinate[1][id_matrix[i][j]]=j+1;
    }




Component({
    properties: {
    },
    data: {
      // 这里是一些组件内部数据
      canvas_height: 1284,
    },
    ready: function(){
        this.sel_matrix=[];
        for(var i=0;i<100;i++) this.sel_matrix[i]=new Array(100).fill(0);
        const query=wx.createSelectorQuery().in(this);
        query.select('#ExpCanvas').fields({node:true,size:true}).exec((res)=>{
            this.canvas=res[0].node;
            this.ctx=this.canvas.getContext('2d');
            const dpr = wx.getSystemInfoSync().pixelRatio
            this.canvas.width = res[0].width * dpr
            this.canvas.height = res[0].width * dpr*hei/len
            this.ctx.scale(dpr, dpr)
            this.blk_len=this.canvas.width/len/dpr;
            console.log(this.canvas.height);
            this.setData({canvas_height:this.canvas.height/dpr});
            //ctx.fillRect(0,0,1000,1000);
            this.drawBlock();
        }) 
        console.log("askdhqjw",wx.getSystemInfoSync().screenHeight)
    },
    methods: {
      // 这里是一个自定义方法
      drawBlock(){

        for(var i=0;i<hei;i++){
            for(var j=0;j<len;j++){
                this.ctx.rect(j*this.blk_len,i*this.blk_len,this.blk_len,this.blk_len);
            }
        }
        this.ctx.stroke();
      },
      setPixel(x,y,type){
            //console.log(x,y);
            this.sel_matrix[x][y]=type;
            if(type==1){
                this.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
                this.ctx.fillRect((y-1)*this.blk_len+0.8,(x-1)*this.blk_len+0.8,this.blk_len-1.3,this.blk_len-1.3);
            }else{
                this.ctx.clearRect((y-1)*this.blk_len+0.8,(x-1)*this.blk_len+0.8,this.blk_len-1.3,this.blk_len-1.3);
            }     

        },
        HandlePixelTap(event){
            let x=event.detail.x,y=event.detail.y;
            let cor_x=Math.floor(y/this.blk_len)+1,cor_y=Math.floor(x/this.blk_len);
            this.setPixel(cor_x,cor_y,this.sel_matrix[cor_x][cor_y]^1);
        },
        output_all(){
            var res=[];
            for(var i=1;i<=hei;i++)
                for(var j=1;j<=len;j++){
                    //console.log(sel_matrix[i][j]);
                    if(this.sel_matrix[i][j]==1){
                        //res=res+id_matrix[i-1][j-1]+',';
                        res.push(id_matrix[i-1][j-1]);
                        //console.log(i,j,id_matrix[i-1][j-1]);
                    }
                }
            //console.log("res: ",res);
            return res;
            //IndexExport.exp_matrix[]
          },
        erase_all(){
            console.log("erasing all");
            for(var i=1;i<=hei;i++)
                for(var j=1;j<=len;j++){
                    this.setPixel(i,j,0);
                }
        },
        getImageUri(){
            return this.canvas.toDataURL();
        }
    }
})
var eye_json=require('./doki_pipo_eye.json')
var mouth_json=require('./doki_pipo_mouth.json')
var eye_list=[]
var mouth_list=[]
const add_one=0;
const offset=832-704;
const exp_table_mouth={
    "Laugh": 5,
    "U": 10,
    "A": 6,
    "E2": 6,
    "E": 17,
    "O": 18,
    "N": 3,
    "I": 9,
    "RinaMaskBlank": 0,
    "RinaMaskOdoroki": 16,
    "Shy": 15,
    "Smile": 3
}
const exp_table_eye={
    "Closish": [1,1,0],
    "Open": [1,1,0],
    "WideOpen": [2,2,0],
    "Close": [6,6,0],
    "Close_Smile": [4,4,4],
    "Sad": [5,21,0],
    "Angry": [11,11,0],
    "WinkL": [1,4,4],
    "WinkR": [4,1,4],
    "RinaMaskBlank": [0,0,0],
    "Trouble": [4,4,0],
    "Shy": [4,4,2],
    "Missing": [6,6,2],
    "Tightly": [13,13,2],
    "RinaMaskOdoroki": [9,10,0],
}

for(var i in eye_json.m_Clips){
    var exp=eye_json.m_Clips[i];
    //console.log(exp.m_Start);
    eye_list[i]={};
    eye_list[i].st=Math.round(exp.m_Start*10);
    eye_list[i].ed=Math.round((exp.m_Start+exp.m_Duration)*10);
    eye_list[i].name=exp.m_DisplayName;
}

for(var i in mouth_json.m_Clips){
    var exp=mouth_json.m_Clips[i];
    //console.log(exp.m_Start);
    mouth_list[i]={};
    mouth_list[i].st=Math.round(exp.m_Start*10);
    mouth_list[i].ed=Math.round((exp.m_Start+exp.m_Duration)*10);
    mouth_list[i].name=exp.m_DisplayName;
}
function cmp(a,b){
    //console.log(a,b);
    return a.st<b.st?-1:1;
}
eye_list.sort(cmp)
mouth_list.sort(cmp);

var exp_list=[];

for(var i in eye_list){
    i=parseInt(i);
    var lst=exp_table_eye[eye_list[i].name];
    if(lst==undefined) console.log("Warning! Eye",eye_list[i].name)
    exp_list[eye_list[i].st]=[lst[0],lst[1],-1,lst[2]];
    if(eye_list[i+1]==undefined||eye_list[i].ed+add_one<eye_list[i+1].st){
        exp_list[eye_list[i].ed+add_one]=[1,1,-1,0];
    }
}

for(var i in mouth_list){
    i=parseInt(i);
    var lst=exp_table_mouth[mouth_list[i].name];
    if(lst==undefined) console.log("Warning! Mouth",mouth_list[i].name)
    if(exp_list[mouth_list[i].st]==undefined) exp_list[mouth_list[i].st]=[-1,-1,lst,-1];
    else exp_list[mouth_list[i].st][2]=lst;
    if(mouth_list[i+1]==undefined||mouth_list[i].ed+add_one<mouth_list[i+1].st){
        if(exp_list[mouth_list[i].ed+add_one]==undefined) exp_list[mouth_list[i].ed+add_one]=[-1,-1,3,-1];
        else exp_list[mouth_list[i].ed+add_one][2]=3;
    }
}
if(exp_list[0]==undefined) exp_list[0]=[1,1,3,0];
if(exp_list[0][0]==-1){
    exp_list[0][0]=1;
    exp_list[0][1]=1;
    exp_list[0][3]=0;
}
if(exp_list[0][2]==-1){
    exp_list[0][2]=3;
}

for(var i in exp_list){
    if(exp_list[i]==undefined) continue;
    if(parseInt(i)<704) continue; 
    var frame=parseInt(i)+offset;
    if(frame<0) frame=0;
    console.log(frame+'!'+exp_list[i][0]+','+exp_list[i][1]+','+exp_list[i][2]+','+exp_list[i][3]);
}

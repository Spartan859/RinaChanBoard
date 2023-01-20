#include "CHNGEN.h"
#include "LittleFS.h"
#include <Arduino.h>
/*
unsigned char word[4];
bool output[16][16];
*/
String hzk16="/HZK16.bin";
String txt="/text.txt";
int GBK_to_node(unsigned char* wordx,bool output[][16]/*,unsigned char* O_code0x*/){
    int i, j, k, offset;
    int flag;
    unsigned char buffer[32];
    /*
    unsigned char word[2] = {
    0xCE, 0xD2}; // 改成你的转码后的汉字编码*/
    
    unsigned char key[8] = {
     0x80,0x40,0x20,0x10,0x08,0x04,0x02,0x01 };
    File fphzk = LittleFS.open(hzk16, "r");
    if(!fphzk){
        return -1;
    }

    offset = (94*(unsigned int)(wordx[0]-0xa0-1)+(wordx[1]-0xa0-1))*32;
    fphzk.seek(offset, SeekSet);
    fphzk.read(buffer, 32);
    for(k=0; k<16; k++){
    
        for(j=0; j<2; j++){
    
            for(i=0; i<8; i++){
    
                flag = buffer[k*2+j]&key[i];
                //printf("%s", flag?"●":"○");
                output[k][j*8+i]=flag;
            }
        }
        //printf("\n");
    }
    /*
    for(k=0; k<31; k++){
        O_code0x[k]=buffer[k];
        //printf("0x%02X,", buffer[k]);
    }*/

    //printf("\n");
    fphzk.close();
    return 0;
}
/*
int main(){
    word[0]=0xCE;word[1]=0xD2;
    cout<<GBK_to_node(word,output)<<endl;
    for(int i=0;i<16;i++,cout<<endl)
        for(int j=0;j<16;j++){
            if(output[i][j]) cout<<"●";
            else cout<<"○";
        }
    return 0;
}*/
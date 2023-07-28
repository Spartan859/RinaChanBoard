#include <stdio.h>  
#include <unistd.h>  
#include <curses.h>  
  
#define START 0x8140  
#define DATANUM 0x20  
  
int displaychar(FILE *fp,unsigned short int dispch,char fillch,char start_x,char start_y);  
  
int main(void)  
{  
    FILE * fp=0;  
    unsigned short int testch = 0xb0ae;  //汉字'爱‘的gbk码  
  
    fp = fopen("gbk.bin","rb");  
  
    initscr();  
  
    displaychar(fp,testch,'*',0,0);  
  
    refresh();  
  
    while(1);  
    endwin();  
    fclose(fp);  
    return 0;  
}  
  
/* 
 * fp指向点阵字库二进制文件 
 * 以点阵方式显示一个GBK字符 
 * dispch是要显示的字符，fillch是填充点阵的字符 
 * start_x,start_y是显示的起始坐标 
 */  
int displaychar(FILE *fp,unsigned short int dispch,char fillch,char start_x,char start_y)  
{  
    char x=start_x;  
    char y=start_y;  
    unsigned int location=(dispch-START)*DATANUM;  
  
    int i=0;  
    int j=0;  
    char buf=0;  
  
    fseek(fp,location,SEEK_SET);  
  
    for(i=0;i<DATANUM;i++)  
    {  
        buf=fgetc(fp);  
  
        //显示一个字节  
        for(j=0;j<8;j++)  
        {  
            move(y+j,x);  
            if( buf & (0x01<<j) )  
            {  
                addch(fillch);  
            }  
        }  
  
        if(x == (start_x+15))  
        {  
            x=start_x;  
            y=start_y+8;  
        }  
        else  
            x++;  
    }  
    return 0;  
  
}  

#include <stdio.h>  
#include <unistd.h>  
#include <curses.h>  
  
#define START 0x8140  
#define DATANUM 0x20  
  
int displaychar(FILE *fp,unsigned short int dispch,char fillch,char start_x,char start_y);  
  
int main(void)  
{  
    FILE * fp=0;  
    unsigned short int testch = 0xb0ae;  //����'������gbk��  
  
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
 * fpָ������ֿ�������ļ� 
 * �Ե���ʽ��ʾһ��GBK�ַ� 
 * dispch��Ҫ��ʾ���ַ���fillch����������ַ� 
 * start_x,start_y����ʾ����ʼ���� 
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
  
        //��ʾһ���ֽ�  
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

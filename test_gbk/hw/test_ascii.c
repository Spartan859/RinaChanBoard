#include <stdio.h>
#include <unistd.h>
#include <curses.h>

#define START 0x20
#define DATANUM 0x10

int displaychar(FILE *fp,char dispch,char fillch,char start_x,char start_y);

int main(void)
{
	FILE* fp=0;

	int i = 0;
	const char * teststring="I love Julia";

	fp=fopen("ascii_zk.bin","r");


	initscr();

	for(i=0;(teststring[i]!=0);i++)
	{
		displaychar(fp,teststring[i],'*',0+(i*8),0);
	}

	refresh();

	while(1);

	endwin();
	fclose(fp);
	return 0;
}

/*
 * 以点阵方式显示一个ASCII字符
 * dispch是要显示的字符，fillch是填充点阵的字符
 * start_x,start_y是显示的起始坐标
 */

int displaychar(FILE *fp,char dispch,char fillch,char start_x,char start_y)
{
	int location = ((dispch-START) * DATANUM);
	char x=start_x;
	char y=start_y;

	int i=0;
	int j=0;
	char buf=0;

	//将文件流指针移到到dispch字符点阵数据的起始位置
	fseek(fp,location,SEEK_SET);

	for(i=0;i<DATANUM;i++)
	{
		buf = fgetc(fp);

		//显示一个字节
		for(j=0;j<8;j++)
		{
			move(y+j,x);
			if(buf & (0x01<<j))
				addch(fillch);
		}

		if(x == (start_x+7))
		{
			x = start_x;
			y = (start_y+8);
		}
		else
		{
			x++;
		}
	}

	return 0;
}


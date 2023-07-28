#include <sys/stat.h>
#include <stdio.h>
 
#define FILE_NAME "test.bin"
#define STR_HZ "苹"
 
int get_gbk_offset(char * hz_code)
{
	unsigned char high = 0xc6;
	unsigned char low = 0xbb;
 
	printf("high:%x, low:%x\n", high, low);
	
	if (low < 0x80)
	{
		return ((high-0x81)*190 + (low-0x40))*32;
	}
	else
	{
		return ((high-0x81)*190 + (low-0x41))*32;
	}
}
 
unsigned char gbk_hz_buf[100000000];
 
long file_size(const char *file)
{
	int i = 0;
	int offset = 0;
    long length = -1;
    FILE *fp = fopen(file, "rb+");
    if (fp == NULL) {
        return length;
    }
 
    fseek(fp, 0, SEEK_END);
    length = ftell(fp);	
 
	rewind(fp);
 
	fread(gbk_hz_buf, 1, length, fp);
 
	offset = get_gbk_offset("A");
 
	for (i = 0; i < 32; i++)
	{
		printf("0x%x, ", gbk_hz_buf[offset+i]);
 
		if ((i+1)%4 == 0)
		{
			printf("\n");
		}
	}
 
	printf("\n");
 
    fclose(fp);
    return length;
}
 
int main(){
	long size = 0;
	
	size = file_size(FILE_NAME);
 
	return 0;
}
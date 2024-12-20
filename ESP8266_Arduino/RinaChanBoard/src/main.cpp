#include <Arduino.h>
#include <ArduinoJson.h>
#include <LedControl_HW_SPI.h>
//#include <LedControl_SW_SPI.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <ESP8266HTTPClient.h>
#include "CHNGEN.h"
#include "LittleFS.h"
#include "utf8.h"

const char *ssid = "Redmi K30i 5G";
//const char *ssid = "HUAWEI";          // WiFi Name
const char *password = "zteztezte"; // WiFi Password

unsigned int localPort = 8888;     // local port to listen on
const unsigned long HTTP_TIMEOUT = 5000;
WiFiClient client;
HTTPClient http;

// buffers for receiving and sending data
char packetBuffer[UDP_TX_PACKET_MAX_SIZE + 1]; // buffer to hold incoming packet,
char ReplyBuffer[] = "RinaboardIsOn";      // a string to send back

WiFiUDP Udp;

const int DIN_PIN = D7;
const int CS_PIN = D1;
const int CLK_PIN = D5;

char cur_ip[17];
//https://xantorohara.github.io/led-matrix-editor/#0018181818000000|0018181818040000|0000442810000000|0006182018060000|00183c2c18000000|003c020000000000|00007e0000000000|02057e0000000000|1000102044443800|1000101010100000|00183c0c00000000|0018181c10200000|00001e2018060000|10284482926c0000|3c66e78181e7663c|0010207e20100000|0008047e04080000|0044281028440000|103c503814781000|0038444444380000
const uint64_t EYES[] = {
    0x0,
    0x0018181818000000, //1     |
    0x0018181818040000, //2    `|
    0x0000442810000000, //3     ^
    0x0006182018060000, //4     >
    0x00183c2c18000000, //5     0
    0x003c020000000000, //6    `-
    0x00007e0000000000, //7     -
    0x02057e0000000000, //8    .-
    0x1000102044443800, //9     ?
    0x1000101010100000, //10    !
    0x00183c0c00000000, //11
    0x0018181c10200000, //12    イ
    0x00001e2018060000, //13    >
    0x10284482926c0000, //14    ?
    0x3c66e78181e7663c, //15    +
    0x0010207e20100000, //16    →
    0x0008047e04080000, //17    ←
    0x0044281028440000, //18    x
    0x103c503814781000, //19    $
    0x0038444444380000  //20    o
};
const uint64_t LETTERS[] = {
  0x6666667e66663c00,
  0x3e66663e66663e00,
  0x3c66060606663c00,
  0x3e66666666663e00,
  0x7e06063e06067e00,
  0x0606063e06067e00,
  0x3c66760606663c00,
  0x6666667e66666600,
  0x3c18181818183c00,
  0x1c36363030307800,
  0x66361e0e1e366600,
  0x7e06060606060600,
  0xc6c6c6d6feeec600,
  0xc6c6e6f6decec600,
  0x3c66666666663c00,
  0x06063e6666663e00,
  0x603c766666663c00,
  0x66361e3e66663e00,
  0x3c66603c06663c00,
  0x18181818185a7e00,
  0x7c66666666666600,
  0x183c666666666600,
  0xc6eefed6c6c6c600,
  0xc6c66c386cc6c600,
  0x1818183c66666600,
  0x7e060c1830607e00,
  0x0000000000000000,
  0x7c667c603c000000,
  0x3e66663e06060600,
  0x3c6606663c000000,
  0x7c66667c60606000,
  0x3c067e663c000000,
  0x0c0c3e0c0c6c3800,
  0x3c607c66667c0000,
  0x6666663e06060600,
  0x3c18181800180000,
  0x1c36363030003000,
  0x66361e3666060600,
  0x1818181818181800,
  0xd6d6feeec6000000,
  0x6666667e3e000000,
  0x3c6666663c000000,
  0x06063e66663e0000,
  0xf0b03c36363c0000,
  0x060666663e000000,
  0x3e403c027c000000,
  0x1818187e18180000,
  0x7c66666666000000,
  0x183c666600000000,
  0x7cd6d6d6c6000000,
  0x663c183c66000000,
  0x3c607c6666000000,
  0x3c0c18303c000000
};
//const int IMAGES_LEN = sizeof(IMAGES)/8;
//int hpbd[15]={0,1,2,0,3,4,4,2,5,6,7,0,8,3,2};

//https://xantorohara.github.io/led-matrix-editor/#000000e000000000|000000e010000000|000000e010080000|0000804020000000|0080402010f00000|00c0201010f00000|0000804020e00000|00f0101020c00000|0000f008f8000000|0000804040800000|8040202040800000|0080404040408000|0080404040404080|0000f010e0000000
const uint64_t MOUTHES[] = {
    0x0,
    0x000000e000000000, //1
    0x000000e010000000, //2
    0x000000e010080000, //3
    0x0000804020000000, //4
    0x0080402010f00000, //5
    0x00c0201010f00000, //6
    0x0000804020e00000, //7
    0x00f0101020c00000, //8
    0x0000f008f8000000, //9
    0x0000804040800000, //10
    0x8040202040800000, //11
    0x0080404040408000, //12
    0x0080404040404080, //13
    0x0000f010e0000000  //14
}; 

//https://xantorohara.github.io/led-matrix-editor/#0000001800000000|0000002850000000|0000002a54000000|0000000028000000
const uint64_t CHEEKS[] = {
    0x0,
    0x0000001800000000, //1
    0x0000002850000000, //2
    0x0000002a54000000, //3
    0x0000000028000000  //4
};

const uint64_t NUMBERS[] = {
    0x3c24242424243c00, // 0
    0x1010101010101000, // 1
    0x3c04043c20203c00, // 2
    0x3c20203c20203c00, // 3
    0x2020203c24242400, // 4
    0x3c20203c04043c00, // 5
    0x3c24243c04043c00, // 6
    0x2020202020203c00, // 7
    0x3c24243c24243c00, // 8
    0x3c20203c24243c00, // 9
    0x1818000000000000  //.
};

const int eye_num = sizeof(EYES) / sizeof(EYES[0]);
const int mouth_num = sizeof(MOUTHES) / sizeof(MOUTHES[0]);
const int cheek_num = sizeof(CHEEKS) / sizeof(CHEEKS[0]);

typedef struct FACE
{
    int eyeL;
    int eyeR;
    int mouth;
    int cheek;
} FACE;

FACE face[] = {
    {3, 3, 11, 2},
    {3, 3, 5, 2},
    {5, 5, 1, 0},
    {0, 0, 1, 0},
    {3, 3, 9, 2},
    {11, 11, 5, 0},
    {4, 4, 5, 4},
    {8, 9, 10, 0},
    {6, 7, 7, 0},
    {3, 3, 6, 3},
    {4, 4, 8, 2},
    {5, 5, 3, 2},
    {0, 0, 4, 1},
    {0, 0, 0, 0}};

const int FACE_LEN = sizeof(face) / sizeof(FACE);

const byte addr_tbl[16][24] = {
    {1, 1, 1, 1, 1, 1, 1, 1,/**/3, 3, 3, 3, 3, 3, 3, 3,/**/5, 5, 5, 5, 5, 5, 5, 5},
    {1, 1, 1, 1, 1, 1, 1, 1,/**/3, 3, 3, 3, 3, 3, 3, 3,/**/5, 5, 5, 5, 5, 5, 5, 5},
    {1, 1, 1, 1, 1, 1, 1, 1,/**/3, 3, 3, 3, 3, 3, 3, 3,/**/5, 5, 5, 5, 5, 5, 5, 5},
    {1, 1, 1, 1, 1, 1, 1, 1,/**/3, 3, 3, 3, 3, 3, 3, 3,/**/5, 5, 5, 5, 5, 5, 5, 5},
    {1, 1, 1, 1, 1, 1, 1, 1,/**/3, 3, 3, 3, 3, 3, 3, 3,/**/5, 5, 5, 5, 5, 5, 5, 5},
    {1, 1, 1, 1, 1, 1, 1, 1,/**/3, 3, 3, 3, 3, 3, 3, 3,/**/5, 5, 5, 5, 5, 5, 5, 5},
    {1, 1, 1, 1, 1, 1, 1, 1,/**/3, 3, 3, 3, 3, 3, 3, 3,/**/5, 5, 5, 5, 5, 5, 5, 5},
    {1, 1, 1, 1, 1, 1, 1, 1,/**/3, 3, 3, 3, 3, 3, 3, 3,/**/5, 5, 5, 5, 5, 5, 5, 5},
    ///////////////////////////////////////////////////////////////////////////////
    {0, 0, 0, 0, 0, 0, 0, 0,/**/2, 2, 2, 2, 2, 2, 2, 2,/**/4, 4, 4, 4, 4, 4, 4, 4},
    {0, 0, 0, 0, 0, 0, 0, 0,/**/2, 2, 2, 2, 2, 2, 2, 2,/**/4, 4, 4, 4, 4, 4, 4, 4},
    {0, 0, 0, 0, 0, 0, 0, 0,/**/2, 2, 2, 2, 2, 2, 2, 2,/**/4, 4, 4, 4, 4, 4, 4, 4},
    {0, 0, 0, 0, 0, 0, 0, 0,/**/2, 2, 2, 2, 2, 2, 2, 2,/**/4, 4, 4, 4, 4, 4, 4, 4},
    {0, 0, 0, 0, 0, 0, 0, 0,/**/2, 2, 2, 2, 2, 2, 2, 2,/**/4, 4, 4, 4, 4, 4, 4, 4},
    {0, 0, 0, 0, 0, 0, 0, 0,/**/2, 2, 2, 2, 2, 2, 2, 2,/**/4, 4, 4, 4, 4, 4, 4, 4},
    {0, 0, 0, 0, 0, 0, 0, 0,/**/2, 2, 2, 2, 2, 2, 2, 2,/**/4, 4, 4, 4, 4, 4, 4, 4},
    {0, 0, 0, 0, 0, 0, 0, 0,/**/2, 2, 2, 2, 2, 2, 2, 2,/**/4, 4, 4, 4, 4, 4, 4, 4}};

const byte row_tbl[16][24] ={
    {7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0},
    {7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0},
    {7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0},
    {7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0},
    {7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0},
    {7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0},
    {7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0},
    {7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0},
    ///////////////////////////////////////////////////////////////////////////////
    {7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0},
    {7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0},
    {7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0},
    {7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0},
    {7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0},
    {7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0},
    {7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0},
    {7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0,/**/7, 6, 5, 4, 3, 2, 1, 0}};

const byte col_tbl[16][24] = {
    {0, 0, 0, 0, 0, 0, 0, 0,/**/0, 0, 0, 0, 0, 0, 0, 0,/**/0, 0, 0, 0, 0, 0, 0, 0},
    {1, 1, 1, 1, 1, 1, 1, 1,/**/1, 1, 1, 1, 1, 1, 1, 1,/**/1, 1, 1, 1, 1, 1, 1, 1},
    {2, 2, 2, 2, 2, 2, 2, 2,/**/2, 2, 2, 2, 2, 2, 2, 2,/**/2, 2, 2, 2, 2, 2, 2, 2},
    {3, 3, 3, 3, 3, 3, 3, 3,/**/3, 3, 3, 3, 3, 3, 3, 3,/**/3, 3, 3, 3, 3, 3, 3, 3},
    {4, 4, 4, 4, 4, 4, 4, 4,/**/4, 4, 4, 4, 4, 4, 4, 4,/**/4, 4, 4, 4, 4, 4, 4, 4},
    {5, 5, 5, 5, 5, 5, 5, 5,/**/5, 5, 5, 5, 5, 5, 5, 5,/**/5, 5, 5, 5, 5, 5, 5, 5},
    {6, 6, 6, 6, 6, 6, 6, 6,/**/6, 6, 6, 6, 6, 6, 6, 6,/**/6, 6, 6, 6, 6, 6, 6, 6},
    {7, 7, 7, 7, 7, 7, 7, 7,/**/7, 7, 7, 7, 7, 7, 7, 7,/**/7, 7, 7, 7, 7, 7, 7, 7},
    ///////////////////////////////////////////////////////////////////////////////
    {0, 0, 0, 0, 0, 0, 0, 0,/**/0, 0, 0, 0, 0, 0, 0, 0,/**/0, 0, 0, 0, 0, 0, 0, 0},
    {1, 1, 1, 1, 1, 1, 1, 1,/**/1, 1, 1, 1, 1, 1, 1, 1,/**/1, 1, 1, 1, 1, 1, 1, 1},
    {2, 2, 2, 2, 2, 2, 2, 2,/**/2, 2, 2, 2, 2, 2, 2, 2,/**/2, 2, 2, 2, 2, 2, 2, 2},
    {3, 3, 3, 3, 3, 3, 3, 3,/**/3, 3, 3, 3, 3, 3, 3, 3,/**/3, 3, 3, 3, 3, 3, 3, 3},
    {4, 4, 4, 4, 4, 4, 4, 4,/**/4, 4, 4, 4, 4, 4, 4, 4,/**/4, 4, 4, 4, 4, 4, 4, 4},
    {5, 5, 5, 5, 5, 5, 5, 5,/**/5, 5, 5, 5, 5, 5, 5, 5,/**/5, 5, 5, 5, 5, 5, 5, 5},
    {6, 6, 6, 6, 6, 6, 6, 6,/**/6, 6, 6, 6, 6, 6, 6, 6,/**/6, 6, 6, 6, 6, 6, 6, 6},
    {7, 7, 7, 7, 7, 7, 7, 7,/**/7, 7, 7, 7, 7, 7, 7, 7,/**/7, 7, 7, 7, 7, 7, 7, 7}};

/* SWSPI */
// LedControl_SW_SPI led = LedControl_SW_SPI();
/* HWSPI */
LedControl_HW_SPI led = LedControl_HW_SPI();

byte vMemory[16][3];
void setMemory(int row, int col, boolean state)
{
    bitWrite(vMemory[row][col >> 3], col & 0x07, state);
}

void clearMemory(){memset(vMemory,0,sizeof(vMemory));}

void setRinaBoard(int row, int col, boolean state)
{
    led.setLed(addr_tbl[row][col], row_tbl[row][col], col_tbl[row][col], state);
}


void showRefreashDirection()
{
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 8; j++)
        {
            for (int k = 0; k < 8; k++)
            {
                led.setLed(i, j, k, 0);
            }
        }
    }
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 8; j++)
        {
            for (int k = 0; k < 8; k++)
            {
                led.setLed(i, j, k, 1);
                delay(3);
            }
        }
    }
    delay(500);
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 8; j++)
        {
            for (int k = 0; k < 8; k++)
            {
                led.setLed(i, j, k, 0);
            }
        }
    }
}

void setLeftEye(uint64_t image)
{
    for (int i = 0; i < 8; i++)
    {
        byte row = (image >> i * 8) & 0xFF;
        for (int j = 0; j < 8; j++)
        {
            setMemory(i, j + 2, bitRead(row, j));
        }
    }
}

void setRightEye(uint64_t image)
{
    for (int i = 0; i < 8; i++)
    {
        byte row = (image >> i * 8) & 0xFF;
        for (int j = 0; j < 8; j++)
        {
            setMemory(i, 21 - j, bitRead(row, j));
        }
    }
}

void setEyes(uint64_t image)
{
    for (int i = 0; i < 8; i++)
    {
        byte row = (image >> i * 8) & 0xFF;
        for (int j = 0; j < 8; j++)
        {
            setMemory(i, j + 2, bitRead(row, j));
            setMemory(i, 21 - j, bitRead(row, j));
        }
    }
}

void setCheeks(uint64_t image)
{
    for (int i = 3; i < 5; i++)
    {
        byte row = (image >> i * 8) & 0xFF;
        for (int j = 0; j < 8; j++)
        {
            setMemory(i + 5, j, bitRead(row, j));
            setMemory(i + 5, 23 - j, bitRead(row, j));
        }
    }
}

void setMouth(uint64_t image)
{
    for (int i = 0; i < 8; i++)
    {
        byte row = (image >> i * 8) & 0xFF;
        for (int j = 0; j < 8; j++)
        {
            setMemory(i + 8, j + 4, bitRead(row, j));
            setMemory(i + 8, 19 - j, bitRead(row, j));
        }
    }
}

void setFace(int eyeL, int eyeR, int mouth, int cheek)
{
    if (eyeL >= eye_num || eyeL >= eye_num || mouth >= mouth_num || cheek >= cheek_num)
    {
        Serial.println("array out of bounds");
        return;
    }
    setLeftEye(EYES[eyeL]);
    setRightEye(EYES[eyeR]);
    setMouth(MOUTHES[mouth]);
    setCheeks(CHEEKS[cheek]);
}

void displayMemory()
{
    for (int i = 0; i < 16; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            for (int t = 0; t < 8; t++)
            {
                setRinaBoard(i, j * 8 + t, bitRead(vMemory[i][j], t));
            }
        }
    }
}

int cur_face[4];

/*put num in "num1,num2,num3,num4," into numArr[4]*/
void numStr_to_numArray(const char *numStr, int *numArr, int numArrLen)
{
    if (nullptr == numStr || nullptr == numArr)
    {
        Serial.println("nullptr");
        return;
    }
    boolean flag = false;
    for (int i = 0; i < 40; i++)
    {
        if ('\0' == numStr[i])
        {
            flag = true;
        }
    }
    if (false == flag)
    {
        Serial.println("numStr too long");
        return;
    }
    int i = 0;
    char temp[40];
    strcpy(temp, numStr);
    char *cp = temp;
    int face_part_index = 0;
    while (temp[i] != '\0')
    {
        if (',' == temp[i])
        {
            temp[i] = '\0';
            numArr[face_part_index] = atoi(cp);
            face_part_index++;
            if (face_part_index > (numArrLen - 1))
            {
                return;
            }
            cp = &temp[i + 1];
        }
        i++;
    }
}

void printIpOnLeftEye()
{
    char *p = cur_ip;
    if (p == nullptr)
    {
        return;
    }
    for (int i = 0; p[i] != '\0'; i++)
    {
        if (i >= sizeof(cur_ip))
        {
            return;
        }
        if (p[i] == '.')
        {
            setLeftEye(NUMBERS[10]);
            setRightEye(EYES[0]);
            setMouth(MOUTHES[0]);
            setCheeks(CHEEKS[0]);
            displayMemory();
        }
        else if (p[i] >= '0' && p[i] <= '9')
        {
            setLeftEye(NUMBERS[p[i] - '0']);
            setRightEye(EYES[0]);
            setMouth(MOUTHES[0]);
            setCheeks(CHEEKS[0]);
            displayMemory();
        }
        delay(500);
    }
    setLeftEye(EYES[0]);
    setRightEye(EYES[0]);
    setMouth(MOUTHES[0]);
    setCheeks(CHEEKS[0]);
    displayMemory();
}

int offset_blk[6][2]={
    {0,0},
    {0,8},
    {0,16},
    {8,0},
    {8,8},
    {8,16}
};
void displayImage(uint64_t image,int blk) {
  for (int i = 0; i < 8; i++) {
    byte row = (image >> i * 8) & 0xFF;
    for (int j = 0; j < 8; j++) {
      setRinaBoard(i+offset_blk[blk][0], j+offset_blk[blk][1], bitRead(row, j));
    }
  }
}
void printStringOnFirstRow(String s){
    for(int i=0;i<s.length()-2;i++){
        displayImage(LETTERS[s[i]-'A'],0);
        displayImage(LETTERS[s[i+1]-'A'],1);
        displayImage(LETTERS[s[i+2]-'A'],2);
        delay(1000);
    }
}
void printStringOnSecondRow(String s){
    for(int i=0;i<s.length()-2;i++){
        displayImage(LETTERS[s[i]-'A'],3);
        displayImage(LETTERS[s[i+1]-'A'],4);
        displayImage(LETTERS[s[i+2]-'A'],5);
        delay(1000);
    }
}

//unsigned char wordx[2] = {0xCE, 0xD2};

//unsigned char wordo[4] = "我";
unsigned char wordx[3005];
//bool output[16][16];
//unsigned char code0x[32];
//String file_name="/HZK16";
bool allwords[16][16*50+5];

void OneFramePrintBool(int iter,bool DZ[][16*50+5],int len,int dly,int rnds=100000){
    //Serial.println(len);
    if(iter>=rnds*len) return;
    clearMemory();
    for(int i=0;i<16;i++)
        for(int j=iter;j<iter+24;j++){
            int jx=j%len;
            if(DZ[i][jx]) setMemory(i,j-iter,1);
        }
    displayMemory();
    delay(dly);
}

void PrintBoolToLed(bool DZ[][16*50+5],int len,int dly,int rnds=100000){
    for(int iter=0;iter<rnds*len;iter++){
        clearMemory();
        for(int i=0;i<16;i++)
            for(int j=iter;j<iter+24;j++){
                int jx=j%len;
                if(DZ[i][jx]) setMemory(i,j-iter,1);
            }
        displayMemory();
        delay(dly);
    }
}
int CNS_to_SHP(unsigned char *wordx, bool otpt[][16*50+5],int lenx){
    //memset(otpt,0,sizeof(otpt));
    unsigned char tmpword[3]={0};
    bool tmpout[16][16]={0};
    for(int a=0;a<16;a++)
        for(int b=0;b<16*50;b++){
            otpt[a][b]=0;
        }
    for(int i=0;i<lenx;i+=2){
        tmpword[0]=wordx[i];
        tmpword[1]=wordx[i+1];
        GBK_to_node(tmpword,tmpout);
        for(int a=0;a<16;a++)
            for(int b=0;b<16;b++){
                otpt[a][b+17*i/2]=tmpout[a][b];
            }
    }
    return 17*lenx/2+16;
}
int getlen(unsigned char * p){
    for(int i=0;i<3000;i+=2){
        if(p[i]==0&&p[i+1]==0) return i;
    }
    return 3000;
}

int iter_chn=0,len_chn=0;
unsigned char CNSTR[8192+5]="祝唐聚涛生日快乐！";
int printCHN(unsigned char* str,int dly){
    memset(wordx,'\0',sizeof(wordx));
    u8f_gb2312((unsigned char *)str,wordx);
    /*for(int i=0;i<8;i++){
        Serial.printf("0x%02X,",wordx[i]);
    }
    Serial.println();*/
    int wordlen=getlen(wordx);
    //Serial.println(wordlen=getlen(wordx));
    //Serial.println();
    int lenall=CNS_to_SHP(wordx,allwords,wordlen);
    Serial.println(lenall);
    /*
    for(int i=0;i<31;i++){
        Serial.printf("0x%02X,",code0x[i]);
    }*/
    iter_chn=0;
    OneFramePrintBool(iter_chn++,allwords,lenall,dly);
    //Serial.println("");
    return lenall;
}
#define DLY 80
void setup()
{
    Serial.begin(9600);
    Serial.println("Start");
    if(LittleFS.begin()){ // 启动闪存文件系统
        Serial.println("LittleFS Started.");
    } else {
        Serial.println("LittleFS Failed to Start.");
    }
    // we have already set the number of devices when we created the LedControl
    /* SWSPI */
    // led.begin(DIN_PIN, CLK_PIN, CS_PIN, 6);
    /* HWSPI */
    led.begin(CS_PIN, 6);
    int devices = led.getDeviceCount();
    // we have to init all devices in a loop
    for (int address = 0; address < devices; address++)
    {
        /*The MAX72XX is in power-saving mode on startup*/
        led.shutdown(address, false);
        /* Set the brightness to a medium values */
        led.setIntensity(address, 15);
        /* and clear the display */
        led.clearDisplay(address);
    }
    showRefreashDirection();
    setFace(1,1,1,0);
    displayMemory();
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    strcpy(cur_ip, WiFi.localIP().toString().c_str());
    // Serial.println("After Convert:");
    // Serial.println(cur_ip);
    printIpOnLeftEye();
    Udp.begin(localPort);
    //setFace(3,3,2,2);
    //displayMemory();
    //printStringOnFirstRow("HELLOWORLD");
    //printStringOnSecondRow("BOARDTEST");
    len_chn=printCHN(CNSTR,DLY);
}
// int i = 0;
String comdata="";
void loop()
{
    OneFramePrintBool(iter_chn++,allwords,len_chn,DLY);
    int packetSize = Udp.parsePacket();
    if (packetSize)
    {
        Serial.printf("Received packet of size %d from %s:%d\n    (to %s:%d, free heap = %d B)\n",
                      packetSize,
                      Udp.remoteIP().toString().c_str(), Udp.remotePort(),
                      Udp.destinationIP().toString().c_str(), Udp.localPort(),
                      ESP.getFreeHeap());

        // read the packet into packetBufffer
        memset(packetBuffer,'\0',sizeof(packetBuffer));
        int n = Udp.read(packetBuffer, UDP_TX_PACKET_MAX_SIZE);
        packetBuffer[n] = '\0';
        DynamicJsonDocument doc(8192);
        deserializeJson(doc,packetBuffer);
        Serial.print((int)doc["eyes"][2][0]);

        //Serial.printf(ExpJSON);
        // 222,222,222,222,

        Serial.print("Rina Contents:");
        Serial.println(packetBuffer);
        Serial.println("result:");
        if (0 == strcmp("RinaBoardUdpTest", packetBuffer))
        {
            Serial.println("RinaBoardGetTestMessage");
            Udp.beginPacket(Udp.remoteIP(), Udp.remotePort());
            Udp.write(ReplyBuffer);
            Udp.endPacket();
        }
        else if(packetBuffer[0]=='C'&&packetBuffer[1]=='N'){
            memset(CNSTR,'\0',sizeof(CNSTR));
            for(int i=2;i<1000;i++){
                CNSTR[i-2]=packetBuffer[i];
            }
            len_chn=printCHN(CNSTR,DLY);
        }
        else
        {
            iter_chn=50000000;
            clearMemory();
            displayMemory();
            numStr_to_numArray(packetBuffer, cur_face, 4);
            for (int i = 0; i < 4; i++)
            {
                Serial.println(cur_face[i]);
            }
            setFace(cur_face[0], cur_face[1], cur_face[2], cur_face[3]);
            displayMemory();
            // Udp.beginPacket(Udp.remoteIP(), Udp.remotePort());
            // Udp.write('a');
            // Udp.endPacket(); 
        }
    }
    // setFace(face[i].eyeL+1, face[i].eyeR+1, face[i].mouth+1, face[i].cheek+1);
    // displayMemory();
    // if (++i >= FACE_LEN)
    //     i = 0;
    // delay(1000);
    while (Serial.available() > 0){
        comdata += char(Serial.read());
        delay(2);
    }
    if (comdata.length() > 0){
        Serial.println(comdata);
        if(comdata.substring(0,4)=="stop") iter_chn=50000000;
        comdata="";
    }
}
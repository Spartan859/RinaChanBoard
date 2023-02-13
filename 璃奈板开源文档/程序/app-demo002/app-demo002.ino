#include <Adafruit_NeoPixel.h>
#include "BluetoothSerial.h"
#define LEDnum 269  //LED灯数量
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(270, 12, NEO_GRB + NEO_KHZ800);//初始化2812
int a=0;
int i=0;
int b=0;
int j=0;
int Mode=0;
int modetest=0;
int serialin;//接收串口数据
int picnum = -1;
int animenum = 0;
int Brightness = 40;//设置亮度，防止瞎眼
int R;
int G;
int B;
BluetoothSerial SerialBT;
void setup() {
  pixels.begin();
  Serial.begin(115200);
  SerialBT.begin("rina-board-001"); 
  startrunning();
  Clear();
  pic();
  // put your setup code here, to run once:

}

void loop() {
    if (SerialBT.available()) {
     //Mode=SerialBT.read();
  

  

  switch(Mode){
    case 0:
    Mode=SerialBT.read();
    
    case 1:
    if(picnum==-1)
    SerialBT.print("静态表情模式\n");
    picnum=SerialBT.read();
    pic();
    if(picnum==255){
      SerialBT.print("切换\n");
      Mode=0;
      picnum=-1;
    }
    break;

    case 2:
   //SerialBT.print("动画模式");
    animenum=serialin;
    anime();
    break;

    case 5:
   //SerialBT.print("亮度调节模式");
    Brightness=serialin;
    //Serial.print(Brightness);
   break;

    case 6:
    //SerialBT.print("关闭屏幕");
    Clear();
    pixels.show();
    break;
  }

  //Serial.print(modetest);
  // put your main code here, to run repeatedly:
    }
}

void pic(){      //静态表情
  switch(picnum){
    case 0:
    SerialBT.print("表情0：微笑");
    R=255;
    G=0;
    B=255;
    Clear();
    pic0();
    pixels.setBrightness(Brightness);
    pixels.show();
    break;

    case 1:
    SerialBT.print("表情1：wink");
    R=255;
    G=0;
    B=255;
    Clear();
    pic1();
    pixels.setBrightness(Brightness);
    pixels.show();
    break;
    
    case 2:
    SerialBT.print("表情2：404");
    R=255;
    G=0;
    B=255;
    Clear();
    pic2();
    pixels.setBrightness(Brightness);
    pixels.show();
    break;    

    case 3:
    SerialBT.print("表情3：哭哭");
    R=255;
    G=0;
    B=255;
    Clear();
    pic3();
    pixels.setBrightness(Brightness);
    pixels.show();
    break;    
    
    case 4:
    SerialBT.print("表情4：？？？");
    R=255;
    G=0;
    B=255;
    Clear();
    pic4();
    pixels.setBrightness(Brightness);
    pixels.show();
    break;
    
    case 5:
    SerialBT.print("表情5：草");
    R=255;
    G=0;
    B=255;
    Clear();
    pic5();
    pixels.setBrightness(Brightness);
    pixels.show();
    break;  
     
    case 6:
    SerialBT.print("表情6：开心");
    R=255;
    G=0;
    B=255;
    Clear();
    pic6();
    pixels.setBrightness(Brightness);
    pixels.show();
    break;   
     
    case 7:
    SerialBT.print("表情7：wink-2");
    R=255;
    G=0;
    B=255;
    Clear();
    pic7();
    pixels.setBrightness(Brightness);
    pixels.show();
    break;
    
    case 8:
    SerialBT.print("表情8：嘿嘿");
    R=255;
    G=0;
    B=255;
    Clear();
    pic8();
    pixels.setBrightness(Brightness);
    pixels.show();
    break;  
    
    case 9:
    SerialBT.print("表情9：：x");
    R=255;
    G=0;
    B=255;
    Clear();
    pic9();
    pixels.setBrightness(Brightness);
    pixels.show();
    break;  

    case 0x10://不知道为啥十进制10就是不能用，被迫妥协
    SerialBT.print("表情10：寄");
    R=255;
    G=0;
    B=255;
    Clear();
    pic10();
    pixels.setBrightness(Brightness);
    pixels.show();
    break;  

    case 0x11://bug无边
    SerialBT.print("表情11：魅惑");
    R=255;
    G=0;
    B=255;
    Clear();
    pic11();
    pixels.setBrightness(Brightness);
    pixels.show();
    break;  

    case 0x12:
    SerialBT.print("表情12：星星眼");
    R=255;
    G=0;
    B=255;
    Clear();
    pic12();
    pixels.setBrightness(Brightness);
    pixels.show();
    break;  

    case 0x13:
    SerialBT.print("表情13：委屈");
    R=255;
    G=0;
    B=255;
    Clear();
    pic13();
    pixels.setBrightness(Brightness);
    pixels.show();
    break;  

    case 0x14:
    SerialBT.print("表情14：闭目张口");
    R=255;
    G=0;
    B=255;
    Clear();
    pic14();
    pixels.setBrightness(Brightness);
    pixels.show();
    break;  

    case 0x15:
    SerialBT.print("表情15：安详");
    R=255;
    G=0;
    B=255;
    Clear();
    pic15();
    pixels.setBrightness(Brightness);
    pixels.show();
    break;


    case 255:
    break;
  }
}

void anime(){   //动画

  switch(animenum){
    case 1://眨眼
    SerialBT.print("动画1：眨眼（FF暂停播放）");
    R=255;
    G=0;
    B=255;
   for(;;){
    Clear();
    pic0();
    pixels.setBrightness(Brightness);
    pixels.show();
    delay(100);
    pixels.setPixelColor(36, pixels.Color(0,0,0));
    pixels.setPixelColor(41, pixels.Color(0,0,0));
    pixels.setPixelColor(32, pixels.Color(0,0,0));
    pixels.setPixelColor(45, pixels.Color(0,0,0));
    pixels.setPixelColor(228, pixels.Color(0,0,0));
    pixels.setPixelColor(233, pixels.Color(0,0,0));
    pixels.setPixelColor(224, pixels.Color(0,0,0));
    pixels.setPixelColor(237, pixels.Color(0,0,0));
    pixels.setPixelColor(13, pixels.Color(R,G,B));
    pixels.setPixelColor(66, pixels.Color(R,G,B));
    pixels.setPixelColor(203, pixels.Color(R,G,B));
    pixels.setPixelColor(256, pixels.Color(R,G,B));
    pixels.show();
    delay(110);
    Clear();
    pic0();
    pixels.setBrightness(Brightness);
    pixels.show();
    delay(2000);
    if(SerialBT.read()==0xFF){ 
    break;}
    }
    break;

    case 2://？！→？？
    SerialBT.print("动画2：？！→？？");
     R=255;
     G=0;
     B=255;
     Clear();
     pic4();
     pixels.setPixelColor(195, pixels.Color(0,0,0));
     pixels.setPixelColor(201, pixels.Color(0,0,0));
     pixels.setPixelColor(228, pixels.Color(0,0,0));
     pixels.setPixelColor(234, pixels.Color(0,0,0));
     pixels.setPixelColor(226, pixels.Color(0,0,0));
     pixels.setPixelColor(225, pixels.Color(0,0,0));
     pixels.setPixelColor(223, pixels.Color(0,0,0));
     pixels.show();
     pixels.setPixelColor(228, pixels.Color(R,G,B));
     pixels.setPixelColor(227, pixels.Color(R,G,B));
     pixels.setPixelColor(226, pixels.Color(R,G,B));
     pixels.setPixelColor(225, pixels.Color(R,G,B));
     pixels.setPixelColor(223, pixels.Color(R,G,B));
     pixels.show();
     delay(2000);
     pixels.setPixelColor(228, pixels.Color(0,0,0));
     pixels.setPixelColor(227, pixels.Color(0,0,0));
     pixels.setPixelColor(226, pixels.Color(0,0,0));
     pixels.setPixelColor(225, pixels.Color(0,0,0));
     pixels.setPixelColor(223, pixels.Color(0,0,0));
     pixels.show();
     pixels.setPixelColor(195, pixels.Color(R,G,B));
     pixels.setPixelColor(201, pixels.Color(R,G,B));
     pixels.setPixelColor(228, pixels.Color(R,G,B));
     pixels.setPixelColor(234, pixels.Color(R,G,B));
     pixels.setPixelColor(226, pixels.Color(R,G,B));
     pixels.setPixelColor(225, pixels.Color(R,G,B));
     pixels.setPixelColor(223, pixels.Color(R,G,B));
     pixels.show();
     break;

    case 3:
     SerialBT.print("动画3：开机自检");
     R=255;
     G=0;
     B=255;
     Clear();
     startrunning();
     break;

    case 4:
    SerialBT.print("动画4：不能理解");
    R=255;
    G=0;
    B=255;
    Clear();
    startrunning();
    delay(500);
    Clear();   
    pic4();
    pixels.show();
    break;
  }
  
}

void Clear(){
  for(i=0;i<=LEDnum;i++){
     pixels.setPixelColor(i, pixels.Color(0,0,0));
  }
}

void startrunning(){
  R=255;
  G=0;
  B=255;
//=======由黑联科技辅助工具生成======
//=======由黑联科技辅助工具生成======
pixels.setPixelColor(8, R,G,B);
pixels.setPixelColor(7, R,G,B);
pixels.setPixelColor(6, R,G,B);
pixels.setPixelColor(15, R,G,B);
pixels.setPixelColor(16, R,G,B);
pixels.setPixelColor(17, R,G,B);
pixels.setPixelColor(33, R,G,B);
pixels.setPixelColor(34, R,G,B);
pixels.setPixelColor(45, R,G,B);
pixels.setPixelColor(46, R,G,B);
pixels.setPixelColor(47, R,G,B);
pixels.setPixelColor(64, R,G,B);
pixels.setPixelColor(65, R,G,B);
pixels.setPixelColor(66, R,G,B);
pixels.setPixelColor(67, R,G,B);
pixels.setPixelColor(94, R,G,B);
pixels.setPixelColor(95, R,G,B);
pixels.setPixelColor(96, R,G,B);
pixels.setPixelColor(97, R,G,B);
pixels.setPixelColor(98, R,G,B);
pixels.setPixelColor(107, R,G,B);
pixels.setPixelColor(106, R,G,B);
pixels.setPixelColor(132, R,G,B);
pixels.setPixelColor(138, R,G,B);
pixels.setPixelColor(139, R,G,B);
pixels.setPixelColor(161, R,G,B);
pixels.setPixelColor(162, R,G,B);
pixels.setPixelColor(160, R,G,B);
pixels.setPixelColor(159, R,G,B);
pixels.setPixelColor(158, R,G,B);
pixels.setPixelColor(109, R,G,B);
pixels.setPixelColor(128, R,G,B);
pixels.setPixelColor(141, R,G,B);
pixels.setPixelColor(193, R,G,B);
pixels.setPixelColor(192, R,G,B);
pixels.setPixelColor(191, R,G,B);
pixels.setPixelColor(190, R,G,B);
pixels.setPixelColor(194, R,G,B);
pixels.setPixelColor(196, R,G,B);
pixels.setPixelColor(227, R,G,B);
pixels.setPixelColor(234, R,G,B);
pixels.setPixelColor(257, R,G,B);
pixels.setPixelColor(261, R,G,B);
pixels.setPixelColor(235, R,G,B);
pixels.setPixelColor(236, R,G,B);
pixels.setPixelColor(237, R,G,B);
pixels.setPixelColor(238, R,G,B);
pixels.setPixelColor(239, R,G,B);
  pixels.setBrightness(Brightness);
  pixels.show();
pixels.setPixelColor(53, R,G,B);
pixels.setBrightness(Brightness);
pixels.show();
delay(200);
pixels.setPixelColor(56, R,G,B);
pixels.setBrightness(Brightness);
pixels.show();
delay(200);
pixels.setPixelColor(85, R,G,B);
pixels.setBrightness(Brightness);
pixels.show();
delay(200);
pixels.setPixelColor(88, R,G,B);
pixels.setBrightness(Brightness);
pixels.show();
delay(200);
pixels.setPixelColor(117, R,G,B);
pixels.setBrightness(Brightness);
pixels.show();
delay(200);
pixels.setPixelColor(120, R,G,B);
pixels.setBrightness(Brightness);
pixels.show();
delay(200);
pixels.setPixelColor(149, R,G,B);
pixels.setBrightness(Brightness);
pixels.show();
delay(200);
pixels.setPixelColor(152, R,G,B);
pixels.setBrightness(Brightness);
pixels.show();
delay(200);
pixels.setPixelColor(181, R,G,B);
pixels.setBrightness(Brightness);
pixels.show();
delay(200);
pixels.setPixelColor(184, R,G,B);
pixels.setBrightness(Brightness);
pixels.show();
delay(200);
pixels.setPixelColor(213, R,G,B);
pixels.setBrightness(Brightness);
pixels.show();
delay(200);
pixels.setPixelColor(216, R,G,B);
pixels.setBrightness(Brightness);
pixels.show();
delay(200);
}

void pic0(){
  pixels.setPixelColor(36, R,G,B);
pixels.setPixelColor(35, R,G,B);
pixels.setPixelColor(34, R,G,B);
pixels.setPixelColor(33, R,G,B);
pixels.setPixelColor(32, R,G,B);
pixels.setPixelColor(45, R,G,B);
pixels.setPixelColor(44, R,G,B);
pixels.setPixelColor(42, R,G,B);
pixels.setPixelColor(41, R,G,B);
pixels.setPixelColor(43, R,G,B);
pixels.setPixelColor(233, R,G,B);
pixels.setPixelColor(227, R,G,B);
pixels.setPixelColor(228, R,G,B);
pixels.setPixelColor(235, R,G,B);
pixels.setPixelColor(234, R,G,B);
pixels.setPixelColor(226, R,G,B);
pixels.setPixelColor(225, R,G,B);
pixels.setPixelColor(236, R,G,B);
pixels.setPixelColor(237, R,G,B);
pixels.setPixelColor(224, R,G,B);
pixels.setPixelColor(221, R,G,B);
pixels.setPixelColor(220, R,G,B);
pixels.setPixelColor(209, R,G,B);
pixels.setPixelColor(208, R,G,B);
pixels.setPixelColor(61, R,G,B);
pixels.setPixelColor(60, R,G,B);
pixels.setPixelColor(49, R,G,B);
pixels.setPixelColor(48, R,G,B);
pixels.setPixelColor(50, R,G,B);
pixels.setPixelColor(59, R,G,B);
pixels.setPixelColor(83, R,G,B);
pixels.setPixelColor(210, R,G,B);
pixels.setPixelColor(219, R,G,B);
pixels.setPixelColor(58, R,G,B);
pixels.setPixelColor(211, R,G,B);
pixels.setPixelColor(186, R,G,B);
pixels.setPixelColor(185, R,G,B);
pixels.setPixelColor(180, R,G,B);
pixels.setPixelColor(84, R,G,B);
pixels.setPixelColor(89, R,G,B);
pixels.setPixelColor(90, R,G,B);
pixels.setPixelColor(116, R,G,B);
pixels.setPixelColor(115, R,G,B);
pixels.setPixelColor(122, R,G,B);
pixels.setPixelColor(147, R,G,B);
pixels.setPixelColor(154, R,G,B);
pixels.setPixelColor(153, R,G,B);
pixels.setPixelColor(179, R,G,B);
pixels.setPixelColor(148, R,G,B);
pixels.setPixelColor(121, R,G,B);
}

void pic1(){
  pixels.setPixelColor(251, R,G,B);
pixels.setPixelColor(240, R,G,B);
pixels.setPixelColor(221, R,G,B);
pixels.setPixelColor(249, R,G,B);
pixels.setPixelColor(242, R,G,B);
pixels.setPixelColor(219, R,G,B);
pixels.setPixelColor(18, R,G,B);
pixels.setPixelColor(48, R,G,B);
pixels.setPixelColor(29, R,G,B);
pixels.setPixelColor(20, R,G,B);
pixels.setPixelColor(27, R,G,B);
pixels.setPixelColor(50, R,G,B);
pixels.setPixelColor(82, R,G,B);
pixels.setPixelColor(90, R,G,B);
pixels.setPixelColor(115, R,G,B);
pixels.setPixelColor(123, R,G,B);
pixels.setPixelColor(147, R,G,B);
pixels.setPixelColor(154, R,G,B);
pixels.setPixelColor(179, R,G,B);
pixels.setPixelColor(187, R,G,B);
pixels.setPixelColor(188, R,G,B);
pixels.setPixelColor(237, R,G,B);
pixels.setPixelColor(233, R,G,B);
pixels.setPixelColor(227, R,G,B);
pixels.setPixelColor(202, R,G,B);
pixels.setPixelColor(194, R,G,B);
pixels.setPixelColor(204, R,G,B);
pixels.setPixelColor(225, R,G,B);
pixels.setPixelColor(258, R,G,B);
pixels.setPixelColor(254, R,G,B);
pixels.setPixelColor(73, R,G,B);
pixels.setPixelColor(74, R,G,B);
pixels.setPixelColor(75, R,G,B);
pixels.setPixelColor(76, R,G,B);
pixels.setPixelColor(66, R,G,B);
pixels.setPixelColor(65, R,G,B);
pixels.setPixelColor(67, R,G,B);
pixels.setPixelColor(68, R,G,B);
}

void pic2(){
pixels.setPixelColor(36, R,G,B);
pixels.setPixelColor(36, R,G,B);
pixels.setPixelColor(35, R,G,B);
pixels.setPixelColor(34, R,G,B);
pixels.setPixelColor(34, R,G,B);
pixels.setPixelColor(33, R,G,B);
pixels.setPixelColor(44, R,G,B);
pixels.setPixelColor(65, R,G,B);
pixels.setPixelColor(76, R,G,B);
pixels.setPixelColor(68, R,G,B);
pixels.setPixelColor(67, R,G,B);
pixels.setPixelColor(66, R,G,B);
pixels.setPixelColor(64, R,G,B);
pixels.setPixelColor(63, R,G,B);
pixels.setPixelColor(132, R,G,B);
pixels.setPixelColor(137, R,G,B);
pixels.setPixelColor(106, R,G,B);
pixels.setPixelColor(107, R,G,B);
pixels.setPixelColor(108, R,G,B);
pixels.setPixelColor(109, R,G,B);
pixels.setPixelColor(127, R,G,B);
pixels.setPixelColor(142, R,G,B);
pixels.setPixelColor(160, R,G,B);
pixels.setPixelColor(161, R,G,B);
pixels.setPixelColor(162, R,G,B);
pixels.setPixelColor(163, R,G,B);
pixels.setPixelColor(196, R,G,B);
pixels.setPixelColor(195, R,G,B);
pixels.setPixelColor(194, R,G,B);
pixels.setPixelColor(193, R,G,B);
pixels.setPixelColor(204, R,G,B);
pixels.setPixelColor(225, R,G,B);
pixels.setPixelColor(228, R,G,B);
pixels.setPixelColor(227, R,G,B);
pixels.setPixelColor(226, R,G,B);
pixels.setPixelColor(224, R,G,B);
pixels.setPixelColor(223, R,G,B);
pixels.setPixelColor(236, R,G,B);
pixels.setPixelColor(223, R,G,B);
pixels.setPixelColor(113, R,G,B);
pixels.setPixelColor(123, R,G,B);
pixels.setPixelColor(147, R,G,B);
pixels.setPixelColor(153, R,G,B);
pixels.setPixelColor(156, R,G,B);
pixels.setPixelColor(146, R,G,B);
pixels.setPixelColor(122, R,G,B);
pixels.setPixelColor(116, R,G,B);
pixels.setPixelColor(49, R,G,B);
pixels.setPixelColor(50, R,G,B);
pixels.setPixelColor(51, R,G,B);
pixels.setPixelColor(53, R,G,B);
pixels.setPixelColor(220, R,G,B);
pixels.setPixelColor(219, R,G,B);
pixels.setPixelColor(219, R,G,B);
pixels.setPixelColor(218, R,G,B);
pixels.setPixelColor(216, R,G,B);  
}

void pic3(){
pixels.setPixelColor(34, R,G,B);
pixels.setPixelColor(45, R,G,B);
pixels.setPixelColor(64, R,G,B);
pixels.setPixelColor(33, R,G,B);
pixels.setPixelColor(76, R,G,B);
pixels.setPixelColor(75, R,G,B);
pixels.setPixelColor(67, R,G,B);
pixels.setPixelColor(42, R,G,B);
pixels.setPixelColor(43, R,G,B);
pixels.setPixelColor(44, R,G,B);
pixels.setPixelColor(65, R,G,B);
pixels.setPixelColor(235, R,G,B);
pixels.setPixelColor(236, R,G,B);
pixels.setPixelColor(227, R,G,B);
pixels.setPixelColor(202, R,G,B);
pixels.setPixelColor(194, R,G,B);
pixels.setPixelColor(193, R,G,B);
pixels.setPixelColor(205, R,G,B);
pixels.setPixelColor(224, R,G,B);
pixels.setPixelColor(203, R,G,B);
pixels.setPixelColor(204, R,G,B);
pixels.setPixelColor(225, R,G,B);
pixels.setPixelColor(223, R,G,B);
pixels.setPixelColor(253, R,G,B);
pixels.setPixelColor(239, R,G,B);
pixels.setPixelColor(57, R,G,B);
pixels.setPixelColor(58, R,G,B);
pixels.setPixelColor(82, R,G,B);
pixels.setPixelColor(91, R,G,B);
pixels.setPixelColor(114, R,G,B);
pixels.setPixelColor(211, R,G,B);
pixels.setPixelColor(212, R,G,B);
pixels.setPixelColor(187, R,G,B);
pixels.setPixelColor(178, R,G,B);
pixels.setPixelColor(155, R,G,B);
pixels.setPixelColor(146, R,G,B);
pixels.setPixelColor(123, R,G,B);  
}

void pic4(){
pixels.setPixelColor(35, R,G,B);
pixels.setPixelColor(41, R,G,B);
pixels.setPixelColor(68, R,G,B);
pixels.setPixelColor(74, R,G,B);
pixels.setPixelColor(66, R,G,B);
pixels.setPixelColor(63, R,G,B);
pixels.setPixelColor(234, R,G,B);
pixels.setPixelColor(228, R,G,B);
pixels.setPixelColor(201, R,G,B);
pixels.setPixelColor(195, R,G,B);
pixels.setPixelColor(226, R,G,B);
pixels.setPixelColor(223, R,G,B);
pixels.setPixelColor(225, R,G,B);
pixels.setPixelColor(65, R,G,B);
pixels.setPixelColor(92, R,G,B);
pixels.setPixelColor(113, R,G,B);
pixels.setPixelColor(188, R,G,B);
pixels.setPixelColor(156, R,G,B);
pixels.setPixelColor(177, R,G,B);
pixels.setPixelColor(145, R,G,B);
pixels.setPixelColor(124, R,G,B);
pixels.setPixelColor(91, R,G,B);
pixels.setPixelColor(89, R,G,B);
pixels.setPixelColor(90, R,G,B);
pixels.setPixelColor(187, R,G,B);
pixels.setPixelColor(185, R,G,B);
pixels.setPixelColor(186, R,G,B);
pixels.setPixelColor(180, R,G,B);
pixels.setPixelColor(153, R,G,B);
pixels.setPixelColor(148, R,G,B);
pixels.setPixelColor(121, R,G,B);
pixels.setPixelColor(116, R,G,B);  
}

void pic5(){
pixels.setPixelColor(41, R,G,B);
pixels.setPixelColor(68, R,G,B);
pixels.setPixelColor(68, R,G,B);
pixels.setPixelColor(73, R,G,B);
pixels.setPixelColor(100, R,G,B);
pixels.setPixelColor(105, R,G,B);
pixels.setPixelColor(132, R,G,B);
pixels.setPixelColor(137, R,G,B);
pixels.setPixelColor(164, R,G,B);
pixels.setPixelColor(169, R,G,B);
pixels.setPixelColor(196, R,G,B);
pixels.setPixelColor(201, R,G,B);
pixels.setPixelColor(228, R,G,B);
pixels.setPixelColor(197, R,G,B);
pixels.setPixelColor(195, R,G,B);
pixels.setPixelColor(74, R,G,B);
pixels.setPixelColor(72, R,G,B);
pixels.setPixelColor(76, R,G,B);
pixels.setPixelColor(77, R,G,B);
pixels.setPixelColor(78, R,G,B);
pixels.setPixelColor(79, R,G,B);
pixels.setPixelColor(97, R,G,B);
pixels.setPixelColor(108, R,G,B);
pixels.setPixelColor(108, R,G,B);
pixels.setPixelColor(129, R,G,B);
pixels.setPixelColor(140, R,G,B);
pixels.setPixelColor(161, R,G,B);
pixels.setPixelColor(172, R,G,B);
pixels.setPixelColor(193, R,G,B);
pixels.setPixelColor(192, R,G,B);
pixels.setPixelColor(189, R,G,B);
pixels.setPixelColor(190, R,G,B);
pixels.setPixelColor(191, R,G,B);
pixels.setPixelColor(176, R,G,B);
pixels.setPixelColor(157, R,G,B);
pixels.setPixelColor(144, R,G,B);
pixels.setPixelColor(125, R,G,B);
pixels.setPixelColor(112, R,G,B);
pixels.setPixelColor(93, R,G,B);
pixels.setPixelColor(80, R,G,B);
pixels.setPixelColor(95, R,G,B);
pixels.setPixelColor(110, R,G,B);
pixels.setPixelColor(127, R,G,B);
pixels.setPixelColor(159, R,G,B);
pixels.setPixelColor(142, R,G,B);
pixels.setPixelColor(174, R,G,B);
pixels.setPixelColor(90, R,G,B);
pixels.setPixelColor(115, R,G,B);
pixels.setPixelColor(179, R,G,B);
pixels.setPixelColor(154, R,G,B);
pixels.setPixelColor(122, R,G,B);
pixels.setPixelColor(147, R,G,B);
pixels.setPixelColor(145, R,G,B);
pixels.setPixelColor(123, R,G,B);
pixels.setPixelColor(146, R,G,B);
pixels.setPixelColor(124, R,G,B);
pixels.setPixelColor(121, R,G,B);
pixels.setPixelColor(120, R,G,B);
pixels.setPixelColor(119, R,G,B);
pixels.setPixelColor(150, R,G,B);
pixels.setPixelColor(148, R,G,B);
pixels.setPixelColor(149, R,G,B);
pixels.setPixelColor(83, R,G,B);
pixels.setPixelColor(186, R,G,B);  
}

void pic6(){
pixels.setPixelColor(35, R,G,B);
pixels.setPixelColor(42, R,G,B);
pixels.setPixelColor(66, R,G,B);
pixels.setPixelColor(75, R,G,B);
pixels.setPixelColor(97, R,G,B);
pixels.setPixelColor(77, R,G,B);
pixels.setPixelColor(64, R,G,B);
pixels.setPixelColor(46, R,G,B);
pixels.setPixelColor(31, R,G,B);
pixels.setPixelColor(234, R,G,B);
pixels.setPixelColor(227, R,G,B);
pixels.setPixelColor(203, R,G,B);
pixels.setPixelColor(194, R,G,B);
pixels.setPixelColor(172, R,G,B);
pixels.setPixelColor(192, R,G,B);
pixels.setPixelColor(223, R,G,B);
pixels.setPixelColor(238, R,G,B);
pixels.setPixelColor(205, R,G,B);
pixels.setPixelColor(29, R,G,B);
pixels.setPixelColor(61, R,G,B);
pixels.setPixelColor(240, R,G,B);
pixels.setPixelColor(208, R,G,B);
pixels.setPixelColor(81, R,G,B);
pixels.setPixelColor(188, R,G,B);
pixels.setPixelColor(178, R,G,B);
pixels.setPixelColor(91, R,G,B);
pixels.setPixelColor(115, R,G,B);
pixels.setPixelColor(154, R,G,B);
pixels.setPixelColor(147, R,G,B);
pixels.setPixelColor(122, R,G,B);  
}

void pic7(){
pixels.setPixelColor(42, R,G,B);
pixels.setPixelColor(43, R,G,B);
pixels.setPixelColor(44, R,G,B);
pixels.setPixelColor(45, R,G,B);
pixels.setPixelColor(67, R,G,B);
pixels.setPixelColor(66, R,G,B);
pixels.setPixelColor(65, R,G,B);
pixels.setPixelColor(64, R,G,B);
pixels.setPixelColor(48, R,G,B);
pixels.setPixelColor(18, R,G,B);
pixels.setPixelColor(251, R,G,B);
pixels.setPixelColor(221, R,G,B);
pixels.setPixelColor(253, R,G,B);
pixels.setPixelColor(238, R,G,B);
pixels.setPixelColor(224, R,G,B);
pixels.setPixelColor(205, R,G,B);
pixels.setPixelColor(193, R,G,B);
pixels.setPixelColor(203, R,G,B);
pixels.setPixelColor(226, R,G,B);
pixels.setPixelColor(234, R,G,B);
pixels.setPixelColor(237, R,G,B);
pixels.setPixelColor(82, R,G,B);
pixels.setPixelColor(187, R,G,B);
pixels.setPixelColor(90, R,G,B);
pixels.setPixelColor(115, R,G,B);
pixels.setPixelColor(122, R,G,B);
pixels.setPixelColor(147, R,G,B);
pixels.setPixelColor(154, R,G,B);
pixels.setPixelColor(179, R,G,B);  
}

void pic8(){
pixels.setPixelColor(235, R,G,B);
pixels.setPixelColor(226, R,G,B);
pixels.setPixelColor(236, R,G,B);
pixels.setPixelColor(225, R,G,B);
pixels.setPixelColor(204, R,G,B);
pixels.setPixelColor(193, R,G,B);
pixels.setPixelColor(205, R,G,B);
pixels.setPixelColor(224, R,G,B);
pixels.setPixelColor(34, R,G,B);
pixels.setPixelColor(33, R,G,B);
pixels.setPixelColor(43, R,G,B);
pixels.setPixelColor(44, R,G,B);
pixels.setPixelColor(65, R,G,B);
pixels.setPixelColor(76, R,G,B);
pixels.setPixelColor(45, R,G,B);
pixels.setPixelColor(64, R,G,B);
pixels.setPixelColor(48, R,G,B);
pixels.setPixelColor(18, R,G,B);
pixels.setPixelColor(251, R,G,B);
pixels.setPixelColor(221, R,G,B);
pixels.setPixelColor(82, R,G,B);
pixels.setPixelColor(187, R,G,B);
pixels.setPixelColor(90, R,G,B);
pixels.setPixelColor(115, R,G,B);
pixels.setPixelColor(122, R,G,B);
pixels.setPixelColor(147, R,G,B);
pixels.setPixelColor(154, R,G,B);
pixels.setPixelColor(179, R,G,B);  
}

void pic9(){
pixels.setPixelColor(235, R,G,B);
pixels.setPixelColor(236, R,G,B);
pixels.setPixelColor(225, R,G,B);
pixels.setPixelColor(226, R,G,B);
pixels.setPixelColor(204, R,G,B);
pixels.setPixelColor(193, R,G,B);
pixels.setPixelColor(205, R,G,B);
pixels.setPixelColor(224, R,G,B);
pixels.setPixelColor(34, R,G,B);
pixels.setPixelColor(43, R,G,B);
pixels.setPixelColor(33, R,G,B);
pixels.setPixelColor(44, R,G,B);
pixels.setPixelColor(65, R,G,B);
pixels.setPixelColor(76, R,G,B);
pixels.setPixelColor(45, R,G,B);
pixels.setPixelColor(64, R,G,B);
pixels.setPixelColor(17, R,G,B);
pixels.setPixelColor(47, R,G,B);
pixels.setPixelColor(252, R,G,B);
pixels.setPixelColor(222, R,G,B);
pixels.setPixelColor(190, R,G,B);
pixels.setPixelColor(79, R,G,B);
pixels.setPixelColor(93, R,G,B);
pixels.setPixelColor(92, R,G,B);
pixels.setPixelColor(91, R,G,B);
pixels.setPixelColor(176, R,G,B);
pixels.setPixelColor(177, R,G,B);
pixels.setPixelColor(178, R,G,B);
pixels.setPixelColor(83, R,G,B);
pixels.setPixelColor(186, R,G,B);
pixels.setPixelColor(113, R,G,B);
pixels.setPixelColor(124, R,G,B);
pixels.setPixelColor(145, R,G,B);
pixels.setPixelColor(156, R,G,B);  
}

void pic10(){
  //=======由黑联科技辅助工具生成======
pixels.setPixelColor(134, R,G,B);
pixels.setPixelColor(136, R,G,B);
pixels.setPixelColor(42, R,G,B);
pixels.setPixelColor(43, R,G,B);
pixels.setPixelColor(68, R,G,B);
pixels.setPixelColor(73, R,G,B);
pixels.setPixelColor(100, R,G,B);
pixels.setPixelColor(105, R,G,B);
pixels.setPixelColor(132, R,G,B);
pixels.setPixelColor(137, R,G,B);
pixels.setPixelColor(164, R,G,B);
pixels.setPixelColor(169, R,G,B);
pixels.setPixelColor(196, R,G,B);
pixels.setPixelColor(201, R,G,B);
pixels.setPixelColor(227, R,G,B);
pixels.setPixelColor(226, R,G,B);
pixels.setPixelColor(138, R,G,B);
pixels.setPixelColor(139, R,G,B);
pixels.setPixelColor(76, R,G,B);
pixels.setPixelColor(97, R,G,B);
pixels.setPixelColor(108, R,G,B);
pixels.setPixelColor(129, R,G,B);
pixels.setPixelColor(140, R,G,B);
pixels.setPixelColor(161, R,G,B);
pixels.setPixelColor(172, R,G,B);
pixels.setPixelColor(193, R,G,B);
pixels.setPixelColor(128, R,G,B);
pixels.setPixelColor(110, R,G,B);
pixels.setPixelColor(94, R,G,B);
pixels.setPixelColor(160, R,G,B);
pixels.setPixelColor(174, R,G,B);
pixels.setPixelColor(190, R,G,B);
pixels.setPixelColor(61, R,G,B);
pixels.setPixelColor(80, R,G,B);
pixels.setPixelColor(93, R,G,B);
pixels.setPixelColor(112, R,G,B);
pixels.setPixelColor(125, R,G,B);
pixels.setPixelColor(144, R,G,B);
pixels.setPixelColor(157, R,G,B);
pixels.setPixelColor(189, R,G,B);
pixels.setPixelColor(176, R,G,B);
pixels.setPixelColor(208, R,G,B);
pixels.setPixelColor(188, R,G,B);
pixels.setPixelColor(187, R,G,B);
pixels.setPixelColor(186, R,G,B);
pixels.setPixelColor(185, R,G,B);
pixels.setPixelColor(184, R,G,B);
pixels.setPixelColor(183, R,G,B);
pixels.setPixelColor(182, R,G,B);
pixels.setPixelColor(152, R,G,B);
pixels.setPixelColor(82, R,G,B);
pixels.setPixelColor(83, R,G,B);
pixels.setPixelColor(84, R,G,B);
pixels.setPixelColor(85, R,G,B);
pixels.setPixelColor(88, R,G,B);
pixels.setPixelColor(117, R,G,B);
pixels.setPixelColor(120, R,G,B);
pixels.setPixelColor(91, R,G,B);
pixels.setPixelColor(123, R,G,B);
pixels.setPixelColor(122, R,G,B);
pixels.setPixelColor(121, R,G,B);
pixels.setPixelColor(114, R,G,B);
}

void pic11(){
pixels.setPixelColor(36, pixels.Color(R,G,B));
pixels.setPixelColor(35, pixels.Color(R,G,B));
pixels.setPixelColor(34, pixels.Color(R,G,B));
pixels.setPixelColor(33, pixels.Color(R,G,B));
pixels.setPixelColor(44, pixels.Color(R,G,B));
pixels.setPixelColor(43, pixels.Color(R,G,B));
pixels.setPixelColor(42, pixels.Color(R,G,B));
pixels.setPixelColor(41, pixels.Color(R,G,B));
pixels.setPixelColor(32, pixels.Color(R,G,B));
pixels.setPixelColor(45, pixels.Color(R,G,B));
pixels.setPixelColor(48, pixels.Color(R,G,B));
pixels.setPixelColor(18, pixels.Color(R,G,B));
pixels.setPixelColor(82, pixels.Color(R,G,B));
pixels.setPixelColor(187, pixels.Color(R,G,B));
pixels.setPixelColor(186, pixels.Color(R,G,B));
pixels.setPixelColor(83, pixels.Color(R,G,B));
pixels.setPixelColor(91, pixels.Color(R,G,B));
pixels.setPixelColor(114, pixels.Color(R,G,B));
pixels.setPixelColor(123, pixels.Color(R,G,B));
pixels.setPixelColor(146, pixels.Color(R,G,B));
pixels.setPixelColor(155, pixels.Color(R,G,B));
pixels.setPixelColor(178, pixels.Color(R,G,B));
pixels.setPixelColor(89, pixels.Color(R,G,B));
pixels.setPixelColor(117, pixels.Color(R,G,B));
pixels.setPixelColor(180, pixels.Color(R,G,B));
pixels.setPixelColor(152, pixels.Color(R,G,B));
pixels.setPixelColor(120, pixels.Color(R,G,B));
pixels.setPixelColor(149, pixels.Color(R,G,B));
pixels.setPixelColor(251, pixels.Color(R,G,B));
pixels.setPixelColor(221, pixels.Color(R,G,B));
pixels.setPixelColor(205, pixels.Color(R,G,B));
pixels.setPixelColor(192, pixels.Color(R,G,B));
pixels.setPixelColor(225, pixels.Color(R,G,B));
pixels.setPixelColor(172, pixels.Color(R,G,B));
pixels.setPixelColor(162, pixels.Color(R,G,B));
pixels.setPixelColor(235, pixels.Color(R,G,B));
}

void pic12(){
//星星眼
pixels.setPixelColor(41, pixels.Color(R,G,B));
pixels.setPixelColor(42, pixels.Color(R,G,B));
pixels.setPixelColor(34, pixels.Color(R,G,B));
pixels.setPixelColor(43, pixels.Color(R,G,B));
pixels.setPixelColor(66, pixels.Color(R,G,B));
pixels.setPixelColor(6, pixels.Color(R,G,B));
pixels.setPixelColor(14, pixels.Color(R,G,B));
pixels.setPixelColor(33, pixels.Color(R,G,B));
pixels.setPixelColor(44, pixels.Color(R,G,B));
pixels.setPixelColor(65, pixels.Color(R,G,B));
pixels.setPixelColor(76, pixels.Color(R,G,B));
pixels.setPixelColor(64, pixels.Color(R,G,B));
pixels.setPixelColor(45, pixels.Color(R,G,B));
pixels.setPixelColor(32, pixels.Color(R,G,B));
pixels.setPixelColor(46, pixels.Color(R,G,B));
pixels.setPixelColor(47, pixels.Color(R,G,B));
pixels.setPixelColor(97, pixels.Color(R,G,B));
pixels.setPixelColor(228, pixels.Color(R,G,B));
pixels.setPixelColor(227, pixels.Color(R,G,B));
pixels.setPixelColor(203, pixels.Color(R,G,B));
pixels.setPixelColor(226, pixels.Color(R,G,B));
pixels.setPixelColor(235, pixels.Color(R,G,B));
pixels.setPixelColor(172, pixels.Color(R,G,B));
pixels.setPixelColor(193, pixels.Color(R,G,B));
pixels.setPixelColor(204, pixels.Color(R,G,B));
pixels.setPixelColor(225, pixels.Color(R,G,B));
pixels.setPixelColor(236, pixels.Color(R,G,B));
pixels.setPixelColor(255, pixels.Color(R,G,B));
pixels.setPixelColor(263, pixels.Color(R,G,B));
pixels.setPixelColor(237, pixels.Color(R,G,B));
pixels.setPixelColor(224, pixels.Color(R,G,B));
pixels.setPixelColor(205, pixels.Color(R,G,B));
pixels.setPixelColor(223, pixels.Color(R,G,B));
pixels.setPixelColor(222, pixels.Color(R,G,B));
pixels.setPixelColor(60, pixels.Color(R,G,B));
pixels.setPixelColor(82, pixels.Color(R,G,B));
pixels.setPixelColor(90, pixels.Color(R,G,B));
pixels.setPixelColor(116, pixels.Color(R,G,B));
pixels.setPixelColor(120, pixels.Color(R,G,B));
pixels.setPixelColor(149, pixels.Color(R,G,B));
pixels.setPixelColor(153, pixels.Color(R,G,B));
pixels.setPixelColor(179, pixels.Color(R,G,B));
pixels.setPixelColor(187, pixels.Color(R,G,B));
pixels.setPixelColor(209, pixels.Color(R,G,B));
}

void pic13(){
  //委屈
pixels.setPixelColor(36, pixels.Color(R,G,B));
pixels.setPixelColor(35, pixels.Color(R,G,B));
pixels.setPixelColor(34, pixels.Color(R,G,B));
pixels.setPixelColor(33, pixels.Color(R,G,B));
pixels.setPixelColor(32, pixels.Color(R,G,B));
pixels.setPixelColor(45, pixels.Color(R,G,B));
pixels.setPixelColor(44, pixels.Color(R,G,B));
pixels.setPixelColor(43, pixels.Color(R,G,B));
pixels.setPixelColor(42, pixels.Color(R,G,B));
pixels.setPixelColor(41, pixels.Color(R,G,B));
pixels.setPixelColor(233, pixels.Color(R,G,B));
pixels.setPixelColor(228, pixels.Color(R,G,B));
pixels.setPixelColor(234, pixels.Color(R,G,B));
pixels.setPixelColor(235, pixels.Color(R,G,B));
pixels.setPixelColor(236, pixels.Color(R,G,B));
pixels.setPixelColor(237, pixels.Color(R,G,B));
pixels.setPixelColor(224, pixels.Color(R,G,B));
pixels.setPixelColor(225, pixels.Color(R,G,B));
pixels.setPixelColor(226, pixels.Color(R,G,B));
pixels.setPixelColor(227, pixels.Color(R,G,B));
pixels.setPixelColor(47, pixels.Color(R,G,B));
pixels.setPixelColor(17, pixels.Color(R,G,B));
pixels.setPixelColor(222, pixels.Color(R,G,B));
pixels.setPixelColor(252, pixels.Color(R,G,B));
pixels.setPixelColor(58, pixels.Color(R,G,B));
pixels.setPixelColor(82, pixels.Color(R,G,B));
pixels.setPixelColor(92, pixels.Color(R,G,B));
pixels.setPixelColor(114, pixels.Color(R,G,B));
pixels.setPixelColor(122, pixels.Color(R,G,B));
pixels.setPixelColor(147, pixels.Color(R,G,B));
pixels.setPixelColor(155, pixels.Color(R,G,B));
pixels.setPixelColor(177, pixels.Color(R,G,B));
pixels.setPixelColor(187, pixels.Color(R,G,B));
pixels.setPixelColor(211, pixels.Color(R,G,B));
}

void pic14(){
  //闭目张口
pixels.setPixelColor(11, pixels.Color(R,G,B));
pixels.setPixelColor(36, pixels.Color(R,G,B));
pixels.setPixelColor(42, pixels.Color(R,G,B));
pixels.setPixelColor(67, pixels.Color(R,G,B));
pixels.setPixelColor(75, pixels.Color(R,G,B));
pixels.setPixelColor(65, pixels.Color(R,G,B));
pixels.setPixelColor(44, pixels.Color(R,G,B));
pixels.setPixelColor(32, pixels.Color(R,G,B));
pixels.setPixelColor(15, pixels.Color(R,G,B));
pixels.setPixelColor(258, pixels.Color(R,G,B));
pixels.setPixelColor(233, pixels.Color(R,G,B));
pixels.setPixelColor(227, pixels.Color(R,G,B));
pixels.setPixelColor(202, pixels.Color(R,G,B));
pixels.setPixelColor(194, pixels.Color(R,G,B));
pixels.setPixelColor(204, pixels.Color(R,G,B));
pixels.setPixelColor(225, pixels.Color(R,G,B));
pixels.setPixelColor(237, pixels.Color(R,G,B));
pixels.setPixelColor(254, pixels.Color(R,G,B));
pixels.setPixelColor(30, pixels.Color(R,G,B));
pixels.setPixelColor(18, pixels.Color(R,G,B));
pixels.setPixelColor(1, pixels.Color(R,G,B));
pixels.setPixelColor(62, pixels.Color(R,G,B));
pixels.setPixelColor(48, pixels.Color(R,G,B));
pixels.setPixelColor(28, pixels.Color(R,G,B));
pixels.setPixelColor(239, pixels.Color(R,G,B));
pixels.setPixelColor(251, pixels.Color(R,G,B));
pixels.setPixelColor(268, pixels.Color(R,G,B));
pixels.setPixelColor(207, pixels.Color(R,G,B));
pixels.setPixelColor(221, pixels.Color(R,G,B));
pixels.setPixelColor(241, pixels.Color(R,G,B));
pixels.setPixelColor(92, pixels.Color(R,G,B));
pixels.setPixelColor(82, pixels.Color(R,G,B));
pixels.setPixelColor(58, pixels.Color(R,G,B));
pixels.setPixelColor(57, pixels.Color(R,G,B));
pixels.setPixelColor(85, pixels.Color(R,G,B));
pixels.setPixelColor(87, pixels.Color(R,G,B));
pixels.setPixelColor(117, pixels.Color(R,G,B));
pixels.setPixelColor(120, pixels.Color(R,G,B));
pixels.setPixelColor(149, pixels.Color(R,G,B));
pixels.setPixelColor(152, pixels.Color(R,G,B));
pixels.setPixelColor(182, pixels.Color(R,G,B));
pixels.setPixelColor(184, pixels.Color(R,G,B));
pixels.setPixelColor(212, pixels.Color(R,G,B));
pixels.setPixelColor(211, pixels.Color(R,G,B));
pixels.setPixelColor(187, pixels.Color(R,G,B));
pixels.setPixelColor(177, pixels.Color(R,G,B));
pixels.setPixelColor(155, pixels.Color(R,G,B));
pixels.setPixelColor(146, pixels.Color(R,G,B));
pixels.setPixelColor(123, pixels.Color(R,G,B));
pixels.setPixelColor(114, pixels.Color(R,G,B));
}

void pic15(){
  //安详
pixels.setPixelColor(12, pixels.Color(R,G,B));
pixels.setPixelColor(34, pixels.Color(R,G,B));
pixels.setPixelColor(44, pixels.Color(R,G,B));
pixels.setPixelColor(65, pixels.Color(R,G,B));
pixels.setPixelColor(75, pixels.Color(R,G,B));
pixels.setPixelColor(99, pixels.Color(R,G,B));
pixels.setPixelColor(238, pixels.Color(R,G,B));
pixels.setPixelColor(235, pixels.Color(R,G,B));
pixels.setPixelColor(225, pixels.Color(R,G,B));
pixels.setPixelColor(204, pixels.Color(R,G,B));
pixels.setPixelColor(194, pixels.Color(R,G,B));
pixels.setPixelColor(170, pixels.Color(R,G,B));
pixels.setPixelColor(46, pixels.Color(R,G,B));
pixels.setPixelColor(16, pixels.Color(R,G,B));
pixels.setPixelColor(206, pixels.Color(R,G,B));
pixels.setPixelColor(257, pixels.Color(R,G,B));
pixels.setPixelColor(80, pixels.Color(R,G,B));
pixels.setPixelColor(92, pixels.Color(R,G,B));
pixels.setPixelColor(114, pixels.Color(R,G,B));
pixels.setPixelColor(122, pixels.Color(R,G,B));
pixels.setPixelColor(147, pixels.Color(R,G,B));
pixels.setPixelColor(155, pixels.Color(R,G,B));
pixels.setPixelColor(177, pixels.Color(R,G,B));
pixels.setPixelColor(189, pixels.Color(R,G,B));
}

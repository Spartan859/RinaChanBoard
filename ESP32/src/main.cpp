#include <Arduino.h>
//宏定义，如果要用Adafruit_NeoPixel版本的，就把下面这行注释掉
#define __Enable_FastLED
#define LED_PIN 12
#define NUM_LEDS 269
//
#ifdef __Enable_FastLED
#   include <FastLED.h>
    CRGB leds[NUM_LEDS];
#endif
#ifndef __Enable_FastLED
#   include <Adafruit_NeoPixel.h>
    Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUM_LEDS+1, LED_PIN, NEO_GRB + NEO_KHZ800);//初始化2812
#endif
//
#include <WiFi.h>
#include <AsyncUDP.h>
#include <WiFiUdp.h>
#include <ArduinoJson.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <Update.h>
#include <WiFiClient.h>
#include <esp_bt_main.h>
#include <freertos/task.h>
#include "SDCardManager.h"


#define SERVICE_UUID "85253ceb-b0b7-4cc2-8e81-c22affa36a43"
#define WIFI_CHARACTERISTIC_UUID "586f7454-dc36-442b-8a87-7e5368a5c42a"
#define MESSAGE_CHARACTERISTIC_UUID "a1303310-cd55-4c46-8140-61b17f22bf01"

unsigned long previousMillis = 0;
unsigned long interval = 3000;

//#define LED_PIN 12
SDCardManager sdCardManager;

const int versionArray[]={0,1,1};

String ssid="hoshizora",password="zteztezte";

//Network
AsyncUDP Udp;
WiFiUDP UDP2;
WiFiClient client;
bool Updating=false;
int localUdpPort=8888;
bool WifiStarted=false;

//BLE
BLEServer *pServer = NULL;

BLECharacteristic *wifi_characteristic = NULL;
String wifiValue="";
BLECharacteristic *message_characteristic = NULL;
String messageValue="";
//

//Facial Expressions
String expTxt="";
DynamicJsonDocument expJSON(32768);

const char* id_matrix_txt="[{\"0\":-1,\"1\":-1,\"2\":38,\"3\":39,\"4\":70,\"5\":71,\"6\":102,\"7\":103,\"8\":134,\"9\":135,\"10\":166,\"11\":167,\"12\":198,\"13\":199,\"14\":230,\"15\":231,\"16\":-1,\"17\":-1},{\"0\":-1,\"1\":10,\"2\":37,\"3\":40,\"4\":69,\"5\":72,\"6\":101,\"7\":104,\"8\":133,\"9\":136,\"10\":165,\"11\":168,\"12\":197,\"13\":200,\"14\":229,\"15\":232,\"16\":259,\"17\":-1},{\"0\":9,\"1\":11,\"2\":36,\"3\":41,\"4\":68,\"5\":73,\"6\":100,\"7\":105,\"8\":132,\"9\":137,\"10\":164,\"11\":169,\"12\":196,\"13\":201,\"14\":228,\"15\":233,\"16\":258,\"17\":260},{\"0\":8,\"1\":12,\"2\":35,\"3\":42,\"4\":67,\"5\":74,\"6\":99,\"7\":106,\"8\":131,\"9\":138,\"10\":163,\"11\":170,\"12\":195,\"13\":202,\"14\":227,\"15\":234,\"16\":257,\"17\":261},{\"0\":7,\"1\":13,\"2\":34,\"3\":43,\"4\":66,\"5\":75,\"6\":98,\"7\":107,\"8\":130,\"9\":139,\"10\":162,\"11\":171,\"12\":194,\"13\":203,\"14\":226,\"15\":235,\"16\":256,\"17\":262},{\"0\":6,\"1\":14,\"2\":33,\"3\":44,\"4\":65,\"5\":76,\"6\":97,\"7\":108,\"8\":129,\"9\":140,\"10\":161,\"11\":172,\"12\":193,\"13\":204,\"14\":225,\"15\":236,\"16\":255,\"17\":263},{\"0\":5,\"1\":15,\"2\":32,\"3\":45,\"4\":64,\"5\":77,\"6\":96,\"7\":109,\"8\":128,\"9\":141,\"10\":160,\"11\":173,\"12\":192,\"13\":205,\"14\":224,\"15\":237,\"16\":254,\"17\":264},{\"0\":4,\"1\":16,\"2\":31,\"3\":46,\"4\":63,\"5\":78,\"6\":95,\"7\":110,\"8\":127,\"9\":142,\"10\":159,\"11\":174,\"12\":191,\"13\":206,\"14\":223,\"15\":238,\"16\":253,\"17\":265},{\"0\":3,\"1\":17,\"2\":30,\"3\":47,\"4\":62,\"5\":79,\"6\":94,\"7\":111,\"8\":126,\"9\":143,\"10\":158,\"11\":175,\"12\":190,\"13\":207,\"14\":222,\"15\":239,\"16\":252,\"17\":266},{\"0\":2,\"1\":18,\"2\":29,\"3\":48,\"4\":61,\"5\":80,\"6\":93,\"7\":112,\"8\":125,\"9\":144,\"10\":157,\"11\":176,\"12\":189,\"13\":208,\"14\":221,\"15\":240,\"16\":251,\"17\":267},{\"0\":1,\"1\":19,\"2\":28,\"3\":49,\"4\":60,\"5\":81,\"6\":92,\"7\":113,\"8\":124,\"9\":145,\"10\":156,\"11\":177,\"12\":188,\"13\":209,\"14\":220,\"15\":241,\"16\":250,\"17\":268},{\"0\":0,\"1\":20,\"2\":27,\"3\":50,\"4\":59,\"5\":82,\"6\":91,\"7\":114,\"8\":123,\"9\":146,\"10\":155,\"11\":178,\"12\":187,\"13\":210,\"14\":219,\"15\":242,\"16\":249,\"17\":269},{\"0\":-1,\"1\":21,\"2\":26,\"3\":51,\"4\":58,\"5\":83,\"6\":90,\"7\":115,\"8\":122,\"9\":147,\"10\":154,\"11\":179,\"12\":186,\"13\":211,\"14\":218,\"15\":243,\"16\":248,\"17\":-1},{\"0\":-1,\"1\":22,\"2\":25,\"3\":52,\"4\":57,\"5\":84,\"6\":89,\"7\":116,\"8\":121,\"9\":148,\"10\":153,\"11\":180,\"12\":185,\"13\":212,\"14\":217,\"15\":244,\"16\":247,\"17\":-1},{\"0\":-1,\"1\":23,\"2\":24,\"3\":53,\"4\":56,\"5\":85,\"6\":88,\"7\":117,\"8\":120,\"9\":149,\"10\":152,\"11\":181,\"12\":184,\"13\":213,\"14\":216,\"15\":245,\"16\":246,\"17\":-1},{\"0\":-1,\"1\":-1,\"2\":-1,\"3\":54,\"4\":55,\"5\":86,\"6\":87,\"7\":118,\"8\":119,\"9\":150,\"10\":151,\"11\":182,\"12\":183,\"13\":214,\"14\":215,\"15\":-1,\"16\":-1,\"17\":-1}]";
DynamicJsonDocument id_matrix(6144);

int exp_now[5]={1,1,1,1,0};
String catNameList[5]={"eye_left","eye_right","cheek","mouth","full_face"};
//

//Settings
int Brightness=40;

class MyServerCallbacks : public BLEServerCallbacks
{
  void onConnect(BLEServer *pServer)
  {
    Serial.println("BLE Connected");
  };

  void onDisconnect(BLEServer *pServer)
  {
    Serial.println("BLE Disconnected,re-advertising");
    pServer->getAdvertising()->start();
  }
};

void StartWifi();

void setPixel(int pixelId,int tp){
    if(pixelId<0) return;
    #ifdef __Enable_FastLED
        if(tp) leds[pixelId]=CRGB(255,0,255);
        else leds[pixelId]=CRGB::Black;
    #endif
    #ifndef __Enable_FastLED
        if(tp) pixels.setPixelColor(pixelId,pixels.Color(255,0,255));
        else pixels.setPixelColor(pixelId,pixels.Color(0,0,0));
    #endif
}

void setFace(String catName,int expid,int tp){
    for(int i=0;i<expJSON[catName][expid].size();i++){
        setPixel(expJSON[catName][expid][i],tp);
    }
}
const int numbers[][30]={
    {98,107,130,139,97,140,96,141,95,142,94,143,93,144,92,113,124,145},
    {139,140,141,142,143,144,145},
    {98,107,130,139,140,141,95,110,127,142,94,93,92,113,124,145},
    {98,107,130,139,140,141,95,110,127,142,143,144,92,113,124,145},
    {98,139,97,140,96,141,95,110,127,142,143,144,145},
    {98,107,130,139,97,96,95,110,127,142,143,144,92,113,124,145},
    {98,107,130,139,97,96,95,110,127,142,94,143,93,144,92,113,124,145},
    {98,107,130,139,140,141,142,143,144,145},
    {98,107,130,139,97,140,96,141,95,110,127,142,94,143,93,144,92,113,124,145},
    {98,107,130,139,97,140,96,141,95,110,127,142,143,144,92,113,124,145}
};
void setNumber(int num,int tp){
    for(int i=0;i<30;i++){
        if(numbers[num][i]==0) break;
        setPixel(numbers[num][i],tp);
    }
}
void showFrame(){
    #ifdef __Enable_FastLED
        FastLED.show();
    #endif
    #ifndef __Enable_FastLED
        pixels.show();
    #endif
}
void setLedBrightness(int brtns){
    #ifdef __Enable_FastLED
        FastLED.setBrightness(brtns);
    #endif
    #ifndef __Enable_FastLED
        pixels.setBrightness(brtns);
    #endif
}

void numStr_to_numArray(const char * numStr, int * numArr, int numArrLen) {
    if (nullptr == numStr || nullptr == numArr) {
        Serial.println("nullptr");
        return;
    }
    boolean flag = false;
    for (int i = 0; i < 40; i++) {
        if ('\0' == numStr[i]) {
            flag = true;
        }
    }
    if (false == flag) {
        Serial.println("numStr too long");
        return;
    }
    int i = 0;
    char temp[40];
    strcpy(temp, numStr);
    char * cp = temp;
    int face_part_index = 0;
    while (temp[i] != '\0') {
        if (',' == temp[i]) {
            temp[i] = '\0';
            numArr[face_part_index] = atoi(cp);
            face_part_index++;
            if (face_part_index > (numArrLen - 1)) {
                return;
            }
            cp = & temp[i + 1];
        }
        i++;
    }
}

void execOTA(String bin_name);

bool allwords[16][16*52+5];
int nowleft=0;
bool nowplaying=0;
int pl_intv=100;
void AppendWord(String hexstr){
	Serial.println(hexstr);
	char tmpbuf[5];
	memset(tmpbuf,0,sizeof(tmpbuf));
    for(int i=0;i<hexstr.length();i+=4){
		tmpbuf[0]=hexstr[i];tmpbuf[1]=hexstr[i+1];
		int code1=strtol(tmpbuf,0,16);
		tmpbuf[0]=hexstr[i+2];tmpbuf[1]=hexstr[i+3];
		int code2=strtol(tmpbuf,0,16);
        int tmp_code=(code1<<8)|code2;
        for(int j=15;j>=0;j--){
			if((tmp_code>>j)&1){
                allwords[i>>2][nowleft+15-j]=1;
            }
        }
    }
}
void setByCor(int x,int y,int tp){
    //Serial.print(x); Serial.print(' ');
    //Serial.print(y); Serial.print(' ');
    //Serial.println((int)id_matrix[x][std::to_string(y)]);
    setPixel(id_matrix[x][std::to_string(y)],tp);
}
void word_display_loop(void * pvParameters){
    //Serial.println(lft);
    int lft=0;
    while(nowplaying){
        if(lft>=nowleft) lft=0;
        //if(lft>=nowleft) return;
        for(int i=0;i<16;i++){
            for(int j=0;j<16;j++){
                if(allwords[i][j+lft]) setByCor(i,j,1);
                else setByCor(i,j,0);
            }
        }
        showFrame();
        delay(pl_intv);
        lft++;
    }
}

TaskHandle_t dispWd_handle=NULL;

void clearDispMessage(){
    if(!nowplaying) return;
    nowleft=0;
    nowplaying=0;
    memset(allwords,0,sizeof(allwords));
    if(dispWd_handle!=NULL){
        vTaskDelete(dispWd_handle);
        dispWd_handle=NULL;
    }
    for(int i=0;i<NUM_LEDS;i++){
        setPixel(i,0);
    }
    showFrame();
}

void handleMessage(const char* buf){
    if(buf[0]=='A'){
        String tmpadd=buf+1;
        //Serial.println(tmpadd);
        expTxt=expTxt+tmpadd;
        //Serial.println(expTxt);
    }else if(buf[0]=='B'){
        deserializeJson(expJSON,expTxt);
        Serial.println(expTxt.length());
        //Serial.println(expTxt);
        if((int)expJSON["mouth"][2][2]>0){
            for(int i=0;i<5;i++){
                setFace(catNameList[i],exp_now[i],1);
            }
            showFrame();
        }
    }else if(buf[0]=='C'){
        expTxt="";
    }else if(buf[0]=='e'){
        clearDispMessage();
        for(int i=0;i<5;i++){
            setFace(catNameList[i],exp_now[i],0);
        }
        numStr_to_numArray(buf+1,exp_now,5);
        Serial.println(buf);
        for(int i=0;i<5;i++){
            setFace(catNameList[i],exp_now[i],1);
        }
        showFrame();
    }else if(buf[0]=='U'){
        clearDispMessage();
        //更新固件
        Updating=true;
        String get_bin_name=buf+2;
        execOTA(get_bin_name);
    }else if(buf[0]=='S'){
        //设置亮度
        String BrtnsStr=buf+2;
        Brightness=atoi(BrtnsStr.c_str());
        setLedBrightness(Brightness);
        showFrame();
    }else if(buf[0]=='T'){
        String bufstr_tmp=buf+1;
        AppendWord(bufstr_tmp);
        nowleft+=16;
    }else if(buf[0]=='P'){
        nowplaying=1;
        xTaskCreate(word_display_loop,"word_display_loop",4096,NULL,2,&dispWd_handle);
    }else if(buf[0]=='t'){
        Serial.println('Clearing all words');
        clearDispMessage();
    }else if(buf[0]=='p'){
        String pl_intv_txt=buf+1;
        pl_intv=atoi(pl_intv_txt.c_str());
    }
}

class CharacteristicsCallbacks : public BLECharacteristicCallbacks{
    void onWrite(BLECharacteristic *pCharacteristic){
        //Serial.println(pCharacteristic->getValue().c_str());
        if(pCharacteristic==wifi_characteristic){
            wifiValue = pCharacteristic->getValue().c_str();
        }
        if(pCharacteristic==message_characteristic){
            handleMessage(pCharacteristic->getValue().c_str());
        }
    }
};

void StartWifi(){
    Serial.println("[APP] Free memory: " + String(esp_get_free_heap_size()) + " bytes");
    pServer->getAdvertising()->stop();
    btStop();
    //esp_bluedroid_disable();
    Serial.println("[APP] Free memory: " + String(esp_get_free_heap_size()) + " bytes");
    delay(1000);
    Serial.print("WIFI Mode: ");
    Serial.println(WiFi.getMode());  // 显示当前WIFI的模式
    Serial.print("Connecting to ");
    Serial.println(ssid);
    Serial.println(password);
    Serial.println("[APP] Free memory: " + String(esp_get_free_heap_size()) + " bytes");
    WiFi.begin(ssid.c_str(), password.c_str());
    Serial.println("[APP] Free memory: " + String(esp_get_free_heap_size()) + " bytes");
    while (WiFi.status() != WL_CONNECTED) { // 等待连接WIFI 直到连接成功 退出循环
        delay(500);
        Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi connected."); //  WIFI 已经连接
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());  // 显示连接WIFI后的IP地址
    Serial.println(WiFi.RSSI());  // 显示连接WIFI后的IP地址
    Serial.print("WIFI Mode: ");
    Serial.println(WiFi.getMode());  // // 显示当前WIFI的模式
    //while(!Udp.listen(localUdpPort)){}
    Udp.broadcastTo(WiFi.localIP().toString().c_str(),23333);
    Udp.close();
    //delay(1000);
    UDP2.begin(localUdpPort);
    WifiStarted=true;

    //execOTA("0.0.5.bin");
}

void StartBLE(){
    BLEDevice::init("RinaChanBoard");
    pServer=BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());
    BLEService *pService = pServer->createService(SERVICE_UUID);
    delay(100);
    wifi_characteristic = pService->createCharacteristic(
      WIFI_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_WRITE |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);
    message_characteristic = pService->createCharacteristic(
      MESSAGE_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_WRITE |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);
    pService->start();
    pServer->getAdvertising()->start();
    message_characteristic->setValue("Connected!");
    message_characteristic->setCallbacks(new CharacteristicsCallbacks());
    wifi_characteristic->setValue("ExampleSSID;ExamplePWD");
    wifi_characteristic->setCallbacks(new CharacteristicsCallbacks());

    Serial.println("BLE Waiting for a client connection to notify...");
}
void read_usart(){
    int i = Serial1.available();
    if(i != 0){
        Serial.print("串口接收到的数据量为:");
        Serial.println(Serial1.available());
        while(i--){
            int temp = Serial1.read();
            Serial.print(temp);
            for(int i=0;i<5;i++){
                setFace(catNameList[i],exp_now[i],0);
                exp_now[i]=0;
            }
            exp_now[4]=temp;
            for(int i=0;i<5;i++){
                setFace(catNameList[i],exp_now[i],1);
            }
            showFrame();
        }
        Serial.println("");
    }
}
void setup() {
    // delay(5000);
    // sdCardManager.initialize();
    deserializeJson(id_matrix,id_matrix_txt);
    #ifdef __Enable_FastLED
        FastLED.addLeds<NEOPIXEL, LED_PIN>(leds, NUM_LEDS);
    #endif
    #ifndef __Enable_FastLED
        pixels.begin();
    #endif
    setLedBrightness(Brightness);
    /*
    for(int i=0;i<NUM_LEDS/2;i++){
        setPixel(i,1);
        showFrame();
        delay(20);
        setPixel(i,0);
    }
    showFrame();*/
    for(int i=0;i<3;i++){
        setNumber(versionArray[i],1);
        showFrame();
        delay(600);
        setNumber(versionArray[i],0);
        showFrame();
        delay(200);
    }
    //Connect to Wifi
    {
    Serial.begin(9600);
    Serial.println();
    Serial.println();

    Serial1.begin(9600,SERIAL_8E1,GPIO_NUM_44,GPIO_NUM_43);

    //SerialBT.end();
    }
    //StartBLE
    StartBLE();
    //delay(10000);
    //StartWifi();
    //StartBLE();
}

void loop() {
    read_usart();
    if(wifiValue!=""){
      ssid=wifiValue.substring(0,wifiValue.indexOf(';'));
      password=wifiValue.substring(wifiValue.indexOf(';')+1);
      wifiValue="";
      StartWifi();
    }
    if(WifiStarted&&!Updating){
        int packetSize=UDP2.parsePacket();
        if(packetSize){
            char buf[packetSize];
            memset(buf,'\0',sizeof(buf));
            int n=UDP2.read(buf,packetSize);
            buf[n]='\0';
            Serial.println("Received: ");
            Serial.println(buf[0]);
            handleMessage(buf);
            //if(buf[0]=='e') Serial.print("setting expressions");
            //deserializeJson(expJSON,buf);
        }
    }
    /*
    unsigned long currentMillis = millis();
    if (WifiStarted&&(!Updating)&&(WiFi.status() != WL_CONNECTED) && (currentMillis - previousMillis >=interval)) {
        Serial.print(millis());
        Serial.println("Reconnecting to WiFi...");
        WiFi.disconnect();
        WiFi.reconnect();
        previousMillis = currentMillis;
    }*/
}


// Variables to validate
int contentLength = 0;
bool isValidContentType = false;
 
// Server Config
const String host = "101.133.137.243"; // Host => bucket-name.s3.region.amazonaws.com
const int port = 1101; // Non https. For HTTPS 443. As of today, HTTPS doesn't work.
const String url_pre="http://101.133.137.243:1101";
const String bin_prefix = "/RinaChanBoard_FirmwareRelease/"; // bin file name with a slash in front.

// Utility to extract header value from headers
String getHeaderValue(String header, String headerName) {
  return header.substring(strlen(headerName.c_str()));
}
 
// OTA Logic 
void execOTA(String bin_name) {
    String bin=bin_prefix+bin_name;
  Serial.println("Connecting to: " + String(host));
  // Connect to S3
  if (client.connect(host.c_str(), port)) {
    // Connection Succeed.
    // Fecthing the bin
    Serial.println("Fetching Bin: " + String(bin));
 
    // Get the contents of the bin file
    
    client.print(String("GET ") + bin + " HTTP/1.1\r\n" +
                 "Host: " + host + "\r\n" +
                 "Cache-Control: no-cache\r\n" +
                 "Connection: close\r\n\r\n");
    /*
    client.print(String("GET ") + url_pre + bin + " HTTP/1.1\n" +
                 "Host: " + host + ":1101\n");
    Serial.print(String("GET ") + url_pre + bin + " HTTP/1.1\n" +
                 "Host: " + host + ":1101\n");*/
 
    // Check what is being sent
        Serial.print(String("GET ") + bin + " HTTP/1.1\r\n" +
                     "Host: " + host + "\r\n" +
                     "Cache-Control: no-cache\r\n" +
                     "Connection: close\r\n\r\n");
 
    unsigned long timeout = millis();
    while (client.available() == 0) {
      if (millis() - timeout > 5000) {
        Serial.println("Client Timeout !");
        client.stop();
        return;
      }
    }
    // Once the response is available,
    // check stuff
   Serial.println("Download Start(Add)");
    while (client.available()) {
      // read line till /n
      String line = client.readStringUntil('\n');
      // remove space, to check if the line is end of headers
      line.trim();
 
      // if the the line is empty,
      // this is end of headers
      // break the while and feed the
      // remaining `client` to the
      // Update.writeStream();
      if (!line.length()) {
        //headers ended
        break; // and get the OTA started
      }
 
      // Check if the HTTP Response is 200
      // else break and Exit Update
      if (line.startsWith("HTTP/1.1")) {
        if (line.indexOf("200") < 0) {
          Serial.println("Got a non 200 status code from server. Exiting OTA Update.");
          break;
        }
      }
 
      // extract headers here
      // Start with content length
      if (line.startsWith("Content-Length: ")) {
        contentLength = atoi((getHeaderValue(line, "Content-Length: ")).c_str());
        Serial.println("Got " + String(contentLength) + " bytes from server");
      }
 
      // Next, the content type
      if (line.startsWith("Content-Type: ")) {
        String contentType = getHeaderValue(line, "Content-Type: ");
        Serial.println("Got " + contentType + " payload.");
        if (contentType == "application/octet-stream") {
          isValidContentType = true;
        }
      }
    }
  } else {
    // Connect to S3 failed
    // May be try?
    // Probably a choppy network?
    Serial.println("Connection to " + String(host) + " failed. Please check your setup");
    // retry??
    execOTA(bin_name);
    return;
  }
 
  // Check what is the contentLength and if content type is `application/octet-stream`
  Serial.println("contentLength : " + String(contentLength) + ", isValidContentType : " + String(isValidContentType));
 
  // check contentLength and content type
  if (contentLength && isValidContentType) {

    // Check if there is enough to OTA Update
    bool canBegin = Update.begin(contentLength,U_FLASH);
 
    // If yes, begin
    if (canBegin) {
        for(int i=0;i<10;i++){
            setPixel(i,1);
            showFrame();
            delay(1000);
            setPixel(i,0);
        }
        showFrame();
      Serial.println("Begin OTA. This may take 2 - 5 mins to complete. Things might be quite for a while.. Patience!");
      // No activity would appear on the Serial monitor
      // So be patient. This may take 2 - 5mins to complete
      size_t written = Update.writeStream(client);
 
      if (written == contentLength) {
        Serial.println("Written : " + String(written) + " successfully");
        for(int i=0;i<10;i++){
            setPixel(i,1);
            showFrame();
            delay(20);
            setPixel(i,0);
        }
        showFrame();
      } else {
        Serial.println("Written only : " + String(written) + "/" + String(contentLength) + ". Retry?" );
        for(int i=NUM_LEDS-10;i<NUM_LEDS;i++){
            setPixel(i,1);
            showFrame();
            delay(20);
            setPixel(i,0);
        }
        showFrame();
        // retry??
        // execOTA();
      }
 
      if (Update.end()) {
        Serial.println("OTA done!");
        if (Update.isFinished()) {
          Serial.println("Update successfully completed. Rebooting.");
          ESP.restart();
        } else {
          Serial.println("Update not finished? Something went wrong!");
        }
      } else {
        Serial.println("Error Occurred. Error #: " + String(Update.getError()));
      }
    } else {
      // not enough space to begin OTA
      // Understand the partitions and
      // space availability
      Serial.println("Not enough space to begin OTA");
      client.flush();
    }
  } else {
    Serial.println("There was no content in the response");
    client.flush();
  }
}

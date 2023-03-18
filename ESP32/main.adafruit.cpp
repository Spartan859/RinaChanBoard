#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
#include <WiFi.h>
#include <AsyncUDP.h>
#include <WiFiUdp.h>
#include <ArduinoJson.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#define SERVICE_UUID "85253ceb-b0b7-4cc2-8e81-c22affa36a43"
#define WIFI_CHARACTERISTIC_UUID "586f7454-dc36-442b-8a87-7e5368a5c42a"
#define MESSAGE_CHARACTERISTIC_UUID "a1303310-cd55-4c46-8140-61b17f22bf01"
#define LED_PIN 26
//#define LED_PIN 12
#define NUM_LEDS 270
String ssid="Redmi K30i 5G",password="zteztezte";
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(270, LED_PIN, NEO_GRB + NEO_KHZ800);//初始化2812

AsyncUDP Udp;
WiFiUDP UDP2;
int localUdpPort=8888;
bool WifiStarted=false;

//BLE
BLEServer *pServer = NULL;

BLECharacteristic *wifi_characteristic = NULL;
String wifiValue="";
BLECharacteristic *message_characteristic = NULL;
//

class MyServerCallbacks : public BLEServerCallbacks
{
  void onConnect(BLEServer *pServer)
  {
    Serial.println("BLE Connected");
  };

  void onDisconnect(BLEServer *pServer)
  {
    Serial.println("BLE Disconnected");
  }
};

void StartWifi();
class CharacteristicsCallbacks : public BLECharacteristicCallbacks
{
  void onWrite(BLECharacteristic *pCharacteristic)
  {
    Serial.print("BLE Value Written ");
    Serial.println(pCharacteristic->getValue().c_str());
    
    if (pCharacteristic == wifi_characteristic)
    {
      wifiValue = pCharacteristic->getValue().c_str();
        ssid=wifiValue.substring(0,wifiValue.indexOf(';'));
        password=wifiValue.substring(wifiValue.indexOf(';')+1);
      wifi_characteristic->setValue(const_cast<char *>(wifiValue.c_str()));
      //wifi_characteristic->notify();
      StartWifi();
    }
  }
};

String expTxt="";
DynamicJsonDocument expJSON(65536);

int exp_now[4]={1,1,1,1};
String catNameList[4]={"eye_left","eye_right","cheek","mouth"};

void setPixel(int pixelId,int tp){
    if(tp) pixels.setPixelColor(pixelId,pixels.Color(255,0,255));
    else pixels.setPixelColor(pixelId,pixels.Color(0,0,0));
}

void setFace(String catName,int expid,int tp){
    for(int i=0;i<expJSON[catName][expid].size();i++){
        setPixel(expJSON[catName][expid][i],tp);
    }
}

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

void StartWifi(){
    pServer->getAdvertising()->stop();
    btStop();
    delay(1000);
    Serial.print("WIFI Mode: ");
    Serial.println(WiFi.getMode());  // 显示当前WIFI的模式
    Serial.print("Connecting to ");
    Serial.println(ssid);
    Serial.println(password);
    WiFi.begin(ssid.c_str(), password.c_str());
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
void setup() {
    //
    pixels.begin();
    pixels.setBrightness(40);
    
    for(int i=0;i<269;i++){
        setPixel(i,1);
        pixels.show();
        delay(40);
    }
    for(int i=0;i<269;i++){
        setPixel(i,0);
        pixels.show();
        delay(40);
    }
    //Connect to Wifi
    {
    Serial.begin(9600);
    Serial.println();
    Serial.println();
    //SerialBT.end();
    }
    //StartBLE
    //StartWifi();
    StartBLE();
}

void loop() {
    if(WifiStarted){
        int packetSize=UDP2.parsePacket();
        if(packetSize){
            char buf[packetSize];
            memset(buf,'\0',sizeof(buf));
            int n=UDP2.read(buf,packetSize);
            buf[n]='\0';
            Serial.println("Received: ");
            //Serial.println(buf[0]);
            if(buf[0]=='A'){
                String tmpadd=buf+1;
                //Serial.println(tmpadd);
                expTxt=expTxt+tmpadd;
                //Serial.println(expTxt);
            }else if(buf[0]=='B'){
                deserializeJson(expJSON,expTxt);
                Serial.println(expTxt);
                if((int)expJSON["mouth"][2][2]>0){
                    for(int i=0;i<4;i++){
                        setFace(catNameList[i],exp_now[i],1);
                    }
                    pixels.show();
                }
            }else if(buf[0]=='C'){
                expTxt="";
            }else if(buf[0]=='e'){
                Serial.println(buf);
                for(int i=0;i<4;i++){
                    setFace(catNameList[i],exp_now[i],0);
                }
                numStr_to_numArray(buf+1,exp_now,4);
                for(int i=0;i<4;i++){
                    setFace(catNameList[i],exp_now[i],1);
                }
                pixels.show();
            }
            //if(buf[0]=='e') Serial.print("setting expressions");
            //deserializeJson(expJSON,buf);
        }
    }
}
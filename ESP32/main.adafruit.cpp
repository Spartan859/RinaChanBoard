#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
#include <WiFi.h>
#include <AsyncUDP.h>
#include <WiFiUdp.h>
#include <ArduinoJson.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <Update.h>
#include <WiFiClient.h>
#include <esp_log.h>
#include "esp_heap_caps.h"
#include "esp_task_wdt.h"
#include "esp_log.h"
#define SERVICE_UUID "85253ceb-b0b7-4cc2-8e81-c22affa36a43"
#define WIFI_CHARACTERISTIC_UUID "586f7454-dc36-442b-8a87-7e5368a5c42a"
#define MESSAGE_CHARACTERISTIC_UUID "a1303310-cd55-4c46-8140-61b17f22bf01"
#define LED_PIN 26
//#define LED_PIN 12
#define NUM_LEDS 269
String ssid="Redmi K30i 5G",password="zteztezte";
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(270, LED_PIN, NEO_GRB + NEO_KHZ800);//初始化2812

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

String expTxt="";
DynamicJsonDocument expJSON(32768);

int exp_now[4]={1,1,1,1};
String catNameList[4]={"eye_left","eye_right","cheek","mouth"};

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

void setPixel(int pixelId,int tp){
    if(tp) pixels.setPixelColor(pixelId,pixels.Color(255,0,255));
    else pixels.setPixelColor(pixelId,pixels.Color(0,0,0));
}

void setFace(String catName,int expid,int tp){
    for(int i=0;i<expJSON[catName][expid].size();i++){
        setPixel(expJSON[catName][expid][i],tp);
    }
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
int log_to_serial(const char *fmt, va_list args) {
        char buf[128];
        vsnprintf(buf, sizeof(buf), fmt, args);
        Serial.println(buf); // 将输出内容写入串口
        return 0;
}
void setup() {
    pixels.begin();
    pixels.setBrightness(40);
    
    for(int i=0;i<NUM_LEDS;i++){
        setPixel(i,1);
        pixels.show();
        delay(20);
        setPixel(i,0);
    }
    pixels.show();
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
    if(WifiStarted&&!Updating){
        int packetSize=UDP2.parsePacket();
        if(packetSize){
            char buf[packetSize];
            memset(buf,'\0',sizeof(buf));
            int n=UDP2.read(buf,packetSize);
            buf[n]='\0';
            Serial.println("Received: ");
            Serial.println(buf[0]);
            if(buf[0]=='A'){
                String tmpadd=buf+1;
                //Serial.println(tmpadd);
                expTxt=expTxt+tmpadd;
                //Serial.println(expTxt);
            }else if(buf[0]=='B'){
                deserializeJson(expJSON,expTxt);
                //Serial.println(expTxt);
                if((int)expJSON["mouth"][2][2]>0){
                    for(int i=0;i<4;i++){
                        setFace(catNameList[i],exp_now[i],1);
                    }
                    pixels.show();
                }
            }else if(buf[0]=='C'){
                expTxt="";
            }else if(buf[0]=='e'){
                for(int i=0;i<4;i++){
                    setFace(catNameList[i],exp_now[i],0);
                }
                numStr_to_numArray(buf+1,exp_now,4);
                for(int i=0;i<4;i++){
                    setFace(catNameList[i],exp_now[i],1);
                }
                pixels.show();
            }else if(buf[0]=='U'){
                //更新固件
                Updating=true;
                String get_bin_name=buf+2;
                execOTA(get_bin_name);
            }
            //if(buf[0]=='e') Serial.print("setting expressions");
            //deserializeJson(expJSON,buf);
        }
    }
}


// Variables to validate
// response from S3
int contentLength = 0;
bool isValidContentType = false;
 
// S3 Bucket Config
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
      Serial.println("Begin OTA. This may take 2 - 5 mins to complete. Things might be quite for a while.. Patience!");
      // No activity would appear on the Serial monitor
      // So be patient. This may take 2 - 5mins to complete
      size_t written = Update.writeStream(client);
 
      if (written == contentLength) {
        Serial.println("Written : " + String(written) + " successfully");
      } else {
        Serial.println("Written only : " + String(written) + "/" + String(contentLength) + ". Retry?" );
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
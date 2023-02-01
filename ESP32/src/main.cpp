#include <Arduino.h>
#include <FastLED.h>
#include <WiFi.h>
#include <WiFiUdp.h>
#include <ArduinoJson.h>
#define LED_PIN 26
const char* ssid="Redmi K30i 5G";
const char* password="zteztezte";

WiFiUDP Udp;
int localUdpPort=8888;


void setup() {
    //Connect to Wifi
    {
    Serial.begin(9600);
    Serial.println();
    Serial.println();
    Serial.print("WIFI Mode: ");
    Serial.println(WiFi.getMode());  // 显示当前WIFI的模式
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);
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
    }
    Udp.begin(localUdpPort);
}
DynamicJsonDocument expJSON(65536);

void loop() {
    int packetSize=Udp.parsePacket();
    if(packetSize){
        char buf[packetSize];
        Udp.read(buf,packetSize);
        Serial.print("Received: ");
        Serial.println(buf);
        deserializeJson(expJSON,buf);
        for(int i=0;i<expJSON["eyes"].size();i++){
            for(int j=0;j<expJSON["eyes"][i].size();j++){
                Serial.print((int)expJSON["eyes"][i][j]);
                Serial.print(' ');
            }
            Serial.println();
        }
    }
}
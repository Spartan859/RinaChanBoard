#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
#include <WiFi.h>
#include <AsyncUDP.h>
#include <WiFiUdp.h>
#include <ArduinoJson.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(270, 12, NEO_GRB + NEO_KHZ800);

BLEServer *pServer = NULL;

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


void StartBLE(){
    BLEDevice::init("RinaChanBoard");
    pServer=BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());
    //BLEService *pService = pServer->createService(SERVICE_UUID);
    delay(100);
    /*
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
          BLECharacteristic::PROPERTY_INDICATE);*/
    //pService->start();
    pServer->getAdvertising()->start();
    /*
    message_characteristic->setValue("Connected!");
    message_characteristic->setCallbacks(new CharacteristicsCallbacks());

    wifi_characteristic->setValue("ExampleSSID;ExamplePWD");
    wifi_characteristic->setCallbacks(new CharacteristicsCallbacks());*/

    Serial.println("BLE Waiting for a client connection to notify...");
}

void setup(){
    pixels.begin();
    Serial.begin(9600);
    pixels.setBrightness(1);
    StartBLE();
}

void loop(){
    /*
    Serial.print("starting");
    for(int i=0;i<10;i++){
        pixels.setPixelColor(i, pixels.Color(0, 150, 0));
        pixels.show();
        delay(40);
    }
    for(int i=0;i<10;i++){
        pixels.setPixelColor(i, pixels.Color(150, 0, 0));
        pixels.show();
        delay(40);
    }*/
}

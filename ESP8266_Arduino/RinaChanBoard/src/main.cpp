#include <FastLED.h>
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <ESP8266HTTPClient.h>
#define LED_PIN     D7
#define NUM_LEDS    270
CRGB leds[NUM_LEDS];
void setup() {
  FastLED.addLeds<NEOPIXEL, LED_PIN>(leds, NUM_LEDS);
  FastLED.setBrightness(10);
}
void loop() {
    /*
  // Red
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[i] = CRGB ( 255, 0, 0);
    FastLED.show();
    delay(40);
  }

  // Green
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[i] = CRGB ( 0, 255, 0);
    FastLED.show();
    delay(40);
  }

  //  Blue
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[i] = CRGB ( 0, 0, 255);
    FastLED.show();
    delay(40);
  }
    */
    leds[200] = CRGB::White; FastLED.show(); delay(30);
    leds[200] = CRGB::Black; FastLED.show(); delay(30);
}

#include <FastLED.h>
#include <Arduino.h>

#define LED_PIN     2
#define NUM_LEDS    10
CRGB leds[NUM_LEDS];

int LED=2;
void setup() {
    pinMode(LED,OUTPUT);
  FastLED.addLeds<WS2812, LED_PIN, GRB>(leds, NUM_LEDS);
  FastLED.setBrightness(255);
}
void loop() {
    
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
  digitalWrite(LED, HIGH);
  delay(1000);
    digitalWrite(LED, LOW);
    delay(1000);
}

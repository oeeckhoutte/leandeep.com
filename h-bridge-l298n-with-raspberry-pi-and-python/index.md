# H-Bridge L298N with Raspberry Pi and Python

- Canonical URL: https://leandeep.com/h-bridge-l298n-with-raspberry-pi-and-python/
- Author: Olivier Eeckhoutte
- Published: 2025-04-28T21:49:00+02:00
- Updated: 2025-04-28T21:49:00+02:00
- Language: fr
- Tags: python, Pi, raspberry
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


In the article we are going to see how to control a H-bridge L298N connected to a Raspberry Pi using Python.

<br/>

## Prerequisites

**Connect the bridge L298N to the raspberry pi**

![image](/images/rsapberry-3b-gpio.svg)

<br/>

* Connect the pin IN1 of the L298N to GPIO7 (pin 26) of the Raspberry Pi (so GPIO4).
* Connect the pin IN2 of the L298N to GPIO8 (pin 24) of the Raspberry Pi.
* Connect the pin ENA of the L298N to GPIO25 (pin 22) of the Raspberry Pi.
* Connect the pin VCC of the L298N to the pin 2 of the Raspberry Pi.
* Connect the pin GND of the L298N to the pin 6 of the Raspberry Pi.

<br/>

**Install dependency**
```
sudo apt-get install python3-rpi.gpio
```

<br/>

## Code

```
import RPi.GPIO as GPIO
import time

# Connect Pi GPIO to L298N
IN1 = 7 
IN2 = 8
ENA = 25  # To control the speed

GPIO.setmode(GPIO.BCM)
GPIO.setup(IN1, GPIO.OUT)
GPIO.setup(IN2, GPIO.OUT)
GPIO.setup(ENA, GPIO.OUT)

pwm = GPIO.PWM(ENA, 1000)  # 1 kHz
pwm.start(100)  # 100% of the speed

try:
    while True:
        GPIO.output(IN1, GPIO.HIGH)
        GPIO.output(IN2, GPIO.LOW)
        print("Extension...")
        time.sleep(5)  # Wait 5s

        GPIO.output(IN1, GPIO.LOW)
        GPIO.output(IN2, GPIO.LOW)
        print("Stop")
        time.sleep(2)

        GPIO.output(IN1, GPIO.LOW)
        GPIO.output(IN2, GPIO.HIGH)
        print("Contraction...")
        time.sleep(5)

        GPIO.output(IN1, GPIO.LOW)
        GPIO.output(IN2, GPIO.LOW)
        print("Stop")
        time.sleep(2)

except KeyboardInterrupt:
    pass

# Nettoyage des broches GPIO
pwm.stop()
GPIO.cleanup()
```


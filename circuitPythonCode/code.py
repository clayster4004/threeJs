"""
Author: Clay Beal
Date: 04/09/25
Title: Semester Project
Description: This project is to be ran with the source code at https://github.com/clayster4004/threeJs
The bluefruit device will broadcast its BLE signal for the web API to pick up and connect to. Then 
you can use the tilt angle controls on the device to move the character (block) and play the online game.
"""
# Imports 
from adafruit_ble import BLERadio
from adafruit_ble.advertising.standard import ProvideServicesAdvertisement
from adafruit_ble.services.nordic import UARTService
import board
import digitalio
import time
from adafruit_circuitplayground import cp

# Important connection variables
ble = BLERadio()
uart = UARTService()
advertisement = ProvideServicesAdvertisement(uart)

# Define the buttons to be used in the application
btnA = digitalio.DigitalInOut(board.BUTTON_A)
btnA.switch_to_input(pull=digitalio.Pull.DOWN)
btnB = digitalio.DigitalInOut(board.BUTTON_B)
btnB.switch_to_input(pull=digitalio.Pull.DOWN)

# Colors to show whether the user is connected or not
RED = (255, 0, 0)
GREEN = (0, 255, 0)

# Define the number of LEDs, the pixels and set the brightness
NUM_LEDS = 10
pixels = cp.pixels
pixels.brightness = (0.05)

# Make all the LEDs red at the beginning of the program
for i in range(NUM_LEDS):
    pixels[i] = RED
pixels.show()

while True:
    # Advertise until a connection is made
    if not ble.connected:
        # Make the Bluetooth connection available
        ble.start_advertising(advertisement)
        # Just wait until a connection is made
        while not ble.connected:
            time.sleep(0.1)
        # Stop advertisiting your connection
        ble.stop_advertising()
        
    # Set the LEDs to green
    for i in range(NUM_LEDS):
        pixels[i] = GREEN
    pixels.show()
    
    # Accelerometer Values
    x, y, z = cp.acceleration

    # When connected, check for button presses
    if btnA.value:  # Button A pressed
        time.sleep(0.1)  # Debounce delay

    if btnB.value:  # Button B pressed
        # Send the x and z accelerometer values to the connected BLE
        uart.write(f"{x},{z}\n")
        time.sleep(0.1)  # Debounce delay

    # Small delay to avoid locked device
    time.sleep(0.05)

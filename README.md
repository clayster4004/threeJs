# Welcome to my fun little circuit python web project!
Thanks for coming by :)
## What is the application?
For this application I made an extremely simple front-end react app that has a button allowing the user to connect to a Circuit Playground Bluefruit device. Once connected via bluetooth, the gyroscope values from the device are utilized to move the on-screen character. In other words, the way you tilt the device is how you move the character. Your goal is to dodge the moving blocks approaching you. 

HINT: Hold the device with the microusb facing towards the sky, and hold the 'B' button when you tilt the device to send the commands. The 'A' button will reset the game.

## How do I run this application?
### Prerequisites
* Circuit python installed and a Circuit Playground Bluefruit device
* Node.js and npm installed
* Chrome Browser (or another browser capable of using the Web Bluetooth API, you can see if your borwser is supported [here](https://caniuse.com/web-bluetooth).

### To run the react app
* Clone the repository
* cd into the cloned repo root
* run 'npm install'
* if you haven't installed threeJs you may have to also run 'npm install three'
* run 'npm run dev'

### To run the circuit python code on your bluefruit device
* Open up editor of your choice
* Run the code located at threeJs/curcuitPythonCode/code.py

### Additional notes
* The source code shows all BLE devices when you click the 'Connect' button, which may be a lot depending on your location
* If you know the name of your Bluefruit device which you can find using your mobile phone like [this](https://learn.adafruit.com/bluefruit-le-connect/scan-for-devices), then you can comment out line 21 in page.js and uncomment line 20 and fill in the name of your device in place of the name of my device. It should look something like "CIRCUITPYXXXX", mine is "CIRCUITPY3073".

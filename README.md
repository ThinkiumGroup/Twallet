# Description

## 1、Tools needed
Hbuilder (2.8.13)   AndroidStudio    Xcode

## 2、About the project
### （1）Project address
https://github.com/ThinkiumGroup/Twallet.git
### （2）Project directory
![项目目录](https://thinkium-data.s3-us-west-2.amazonaws.com/twallet-eng.png "项目目录")
## 3、start up
### （1） start h5 
- Import the project into Hbuilder.
- Select any file in the project on the left file directory.
- In the menu bar, select Run -> Run to browser -> Select the browser installed on the computer.
- Wait for the compiler to compile (if the browser does not open automatically, please check ‘App running at:’ on the HBuilder console, which indicates the domain name and port of the project start).

### （2） start android/iOS
- Connect the data cable to the mobile phone, or start the mobile phone simulator on the computer
- Select Run in the menu bar -> Run to phone or emulator -> select the phone or emulator to start

### （3）Configure request domain name and port
#### Related file location Twallet-app/utils/host.js
#### Configure data request domain name
- Default: test environment domain name + port
- Method 1: Set key:'baseUrl', value: your domain name + interface in storage, use uni.getStorageSync('baseUrl', your domain name + port);
- Method 2: Set key:'env', value:'dev'/'pro' in storage, (dev: test environment, pro: formal environment)
- Method 3: If it is h5, match the test or official environment domain name through the domain name and port of the webpage
- Method 4: If it is h5 and method 3 does not match the configured domain name, then the domain name and port configured on the web page will be automatically obtained to call the interface
#### Configure rpc domain name
- Default: test environment rpc
- Method 1: Set key:'rpcUrl', value: your rpc in storage, use uni.getStorageSync('rpcUrl', your domain name + port);
- Method 2: Set key:'env', value:'dev'/'pro' in storage, (dev: test environment, pro: formal environment);
- Method 3: If it is h5, match the test through the domain name and port of the webpage or the official environment domain name rpc

### （4）Configure internationalization
#### File location Framework/language
- The method of obtaining the system language contained in the folder, in English, Japanese and Korean
- The $lan method is globally configured, and the language translation is called through the this.$lan(text) method on the vue page and components, and the $lan(text) is used directly in the template
## 4、Bale
### （1）android
- Download AndroidStudio
- Download android package dock   https://thinkium-data.s3-us-west-2.amazonaws.com/Twallet-android.zip
#### Operations in HBuilder
- Obtain the AppID of the uni-app in HBuilder. The basic configuration in manifest.json is clicked to obtain again. After obtaining it once, the subsequent AppID does not need to be obtained again.
- In the HBuilder menu bar, select Release -> Native APP-Local Packaging -> Generate Local Packaged APP Resources -> Waiting for Packaging -> Click the local link to generate APP resources on the console.
#### Operation in AndroidStudio
- Import the Android packaging base.
- Change the AppID in the project, the file location is app/src/main/assets/data/dcloud_control.xml, and change the id in it to the appid obtained in hbuilder.
- The folders under app/src/main/assets/apps are replaced with app resources packaged in HBuilder.
- Changing the package name and app name needs to be set in the packaging dock.
- Select Build->Build Bundle(s)/APK(s) -> Build APK(s) in the menu bar.
- Wait for the packaging result, click ‘locate’ under Event Log, the file app-debug.apk, which is the packaging result, which can be sent to the android phone for installation.

### （2）IOS
- Download Xcode
- Download the iOS packaging dock https://thinkium-data.s3-us-west-2.amazonaws.com/Twallet-iOS.zip
#### Operations in HBuilder
- Obtain the AppID of uni-app in HBuilder. The basic configuration in manifest.json, click to get it again. After obtaining it once, the subsequent AppID does not need to be obtained again
- In the HBuilder menu bar, select Release -> Native APP-Local Packaging -> Generate Local Packaged APP Resources -> Waiting for Packaging -> Click the local link to generate APP resources on the console
#### Operations in xCode
- Double click the file Twallet.xcodeproj to import the iOS packaging dock in xCode
- Configure Xcode project private key
- Change the AppID in the project, the file location is HBuilder-Hello/pandora/Supporting Files/control.xml, and change the appid to the AppID obtained in HBuilder
- Replace the folders under HBuilder-Hello/pandora/apps with the app resources packaged in HBuilder
- Xcode selects Generic IOS Device, and selects Product->archive in the menu bar to wait for packaging.
- In the pop-up dialog box, select the file you just packaged, and click Distribute APP-> Ad Hoc -> next and continue to next, enter the password, and you can export the ipa file

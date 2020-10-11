# MVP for sleep sensing

The first version of sleep of MVP will involve installing the Aware app on the phone. And, then inside you can join the study by scanning QR code described below.




## Installing AWARE

The installation instructions are different for the Android and iOS version of AWARE. 


### iOS
Open the 'App Store' app on your phone and search "Aware." The correct version of the app is "AWARE Client V2". Install the app.  


### Android
Android version of AWARE isn't available in the android play store. The app is available on the aware framework's website as an apk (apk's are android's executatble file fomrat). You will need to download the apk and directly install it. The exact steps are below:

1. There are two methods to install the apk: 

     
     - **Method 1 (easier)**: Click on this [link](http://jenkins.awareframework.com/job/com.aware.phone/lastSuccessfulBuild/artifact/aware-phone/build/outputs/apk/release/aware-phone-armeabi-release.apk) to download the **apk** from AWARE website. 
     - **Method 2**: Go to AWARE website [awareframework.com](https://awareframework.com/) and scroll down to find the link for `AWARE for Android`.  

2. The installation may ask you to enable the installation of apks from **unknown sources**. Android is asking this because the apk is not distributed through the play store, so Google can't verify if the app obeys all app store rules and is not malicous. AWARE isn't a malicious app, but it uses some permissions for background recording that Google recently disabled. The official statement from AWARE website is the following:

    > *You won’t find AWARE on the Google Play Store. Being an application to conduct user-studies, we use many permissions that current developer guidelines do not allow AWARE Client to be published. We are now hosting the client. This allows us to provide you with the tool you are used to without restrictions and allows us to better support the platform going forward.*


<br>

## Subscribing to sleep data collection study
We have already configured a study specific to the Harvard component of SARA. The study data is currently collected in a MySQL database located in an Amazon EC2 server.

Steps to join this study is the following:
- Open the aware app. Right at the top you'll see a QR code icon.
- Scan the following **QR** code. The app will automatically ask you to join the study called `aware-sara-harvard`.
<br>
> <img src="https://temp-files-for-mash.s3.amazonaws.com/aware-harvard-qr-code.png" alt="drawing" width="300"/>
<br>

- Once the study is configured, the icon at the top will change. 
- **Important**: At the top of the app, you will see a `Device ID` as follows. The device ID ideanties in the backend that the data is from you. Please send us the first 8 digits of the device id.


## How do I check that I joined the right study?

### iOS 
Go to the `settings` tab in the AWARE app. You will see the study URL right at the top. (See screenshot below)
<br>
> <img src="https://temp-files-for-mash.s3.amazonaws.com/aware-study-ios-successful-study.jpg" alt="drawing" width="400"/>
<br>

### Android 
On the main page of the app, scroll down until you see the 'AWARE study' tab (Screen shot #1). Click on it. You will be in a new page and you will see the study URL (Screen shot #2). 
<br>
> <img src="https://temp-files-for-mash.s3.amazonaws.com/aware-study-android-successful-study-1.png" alt="drawing" width="300"/>
> <img src="https://temp-files-for-mash.s3.amazonaws.com/aware-study-android-successful-study-2.png" alt="drawing" width="300"/>
<br>

You are all set for the MVP!!! Thank you for helping.








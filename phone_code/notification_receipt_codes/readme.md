## Overview

We use onesignal notification library to push notifications to phones. Onesignal is a widely cross-platform notification library. However, a limitation of onesignal is, it doesn't provide anyway to track notifications (i.e., when notification was received, and when notification was clicked). 

The files in this folder provide extra code to track these notifications.<br/><br/><br/>

## Steps to install the files on iOS and Android

### Android
- Make sure android version of the app already exist. If not run `ionic cordova platform add android` from main `phone_code` directory.
- Open `platform/android` with Android Studio.
- Copy the `android/NotificationExtenderOneSignal.java` to the `edu.harvard.srl.SARA.V2` package
- Change server address and port to the `onNotificationProcessing` function in `edu.harvard.srl.SARA.NotificationExtenderOneSignal`. Once you make the changes, notifications will be tracked once they are  received. *(Note, you have to change the server address/port, and install a flask server script).*
- In Android studo open the file, `com.plugin.gcm.OneSignalPush` and `CordovaNotificationOpenedHandler`. Copy changes from `android/OneSignalPush.java`. Once you make the changes, we will be able to track like and dislike. 
- Once you make the changes, you can use `ionic cordova run android` to see the changes. It is not necessary to use Android studio.
- Test onesignal push by running the python script `python test_notification_tracking.py`
<br/>
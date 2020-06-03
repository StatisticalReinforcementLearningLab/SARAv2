## Overview

We use onesignal notification library to push notifications to phones. Onesignal is a great library and it is widely used. 
However, a limitation of onesignal is, it doesn't provide anyway to track notifications (when notification was
received, and when notification was clicked). 

The files in this folder provide extra code to track these notifications.<br/><br/><br/>


## Steps to install the files on iOS and Andriod
For the following changes, files in the platforms directory have to changed directly. You can use Xcode and Android Studio to make this changes.<br/>



### Android
- Follow instruction from the Onesignal website on how to add `NotificationExtenderService`

- `android/NotificationExtenderOneSignal.java`: make changes to the `onNotificationProcessing` function in `edu.harvard.srl.SARA.NotificationExtenderOneSignal`. Once you make the changes, notifications will be tracked once they are  received. *(Note, you have to change the server address/port, and install a flask server script).*

- `android/NotificationExtenderOneSignal.java`: make changes to the `onNotificationProcessing` function in `com.plugin.gcm.OneSignalPush` and `CordovaNotificationOpenedHandler`. Once you make the changes, we will be able to track like and dislike. *(Note, you have to change the server address/port, and install a flask server script).*

- Once you make the changes, you can use `ionic cordova run android` to see the changes. It is not necessary to use Android studio.<br/>



### iOS 

- Note onesignal uses objective C

- Follow the exact steps from Onesignal website to push notification for iOS using Ionic. It is necessary to include the extra step of `Onesignal Service Extension`


- `ios/NotificationService.m`: This file should be used to change the `NotificationService.m` file in `OnesignalNotificationServiceExtension` directory. Change the function  `didReceiveNotificationRequest`.  Once you make the changes, notification will be tracked once the notification is received.

- `ios/OneSignalPush.m`:  This file should be used to change the `OneSignalPush.m` file in the `Plugins` directory. Change the function  `processNotificationOpened`.  Once you make the changes, we will be able to track like and dislike.<br/><br/><br/> 


## Steps to install the Flask server, MySQL, and 'send notification codes'<br/>

### Flask
Inside the `flask_server` directory, there is a flask app. The `requirements.txt` will install all the dependencies, when called using `pip.` There flask server is responsible to (i) track 4PM notifications and 'like/nope' responses, (ii) send 8PM notifications if surveys are not completed (iii) list all 4PM to populate the 'inspirational_quote' view.<br/>

### notification_send_codes
The `notification_send_codes` folder contains all the quotes, python scripts to send 4PM/6PM/8PM notifications.<br>

### MySQL
Inside the `mysql` directory, there are server create table statement in the `create_table.sql` file. We will need these tables to get flask server and notification_send_codes to work.<br/>

## Overview of this folder.

We use onesignal notification library to push notifications to phones. Onesignal is a great library and it is widely used. 
However, a limitation of onesignal is, it doesn't provide anyway to track notifications (when notification was
received, and when notification was clicked). 

The files in this folder provide extra code to track these notifications.


## Steps to install the files on iOS and Andriod


### Android




### iOS 

- Note onesignal uses objective C

- Follow the exact steps from Onesignal website to push notification for iOS using Ionic. It is necessary to include the extra step of `Onesignal Service Extension`


- `ios/NotificationService.m`: This file should be used to change the `NotificationService.m` file in `OnesignalNotificationServiceExtension` directory. Change the function  `didReceiveNotificationRequest`.  Once you make the changes, notification will be tracked once the notification is received.

- `ios/OneSignalPush.m`:  This file should be used to change the `OneSignalPush.m` file in the `Plugins` directory. Change the function  `processNotificationOpened`.  Once you make the changes, we will be able to track like and dislike. 


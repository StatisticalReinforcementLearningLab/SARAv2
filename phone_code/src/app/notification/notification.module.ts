/*

Install following, then this module shall work.
ionic cordova plugin add onesignal-cordova-plugin
npm install @ionic-native/onesignal

This module can handle notificationReceive/Open when app is not killed.
otherwise:

Implement in android/ios platform if need to receive notification
when app is killed.

Copy MyNotificationExtenderBareBones.java file to src.io.ionic folder
add below to androidmanifest.xml 

        <service
            android:name="io.ionic.MyNotificationExtenderBareBones"
            android:permission="android.permission.BIND_JOB_SERVICE"
            android:exported="false">
            <intent-filter>
                <action android:name="com.onesignal.NotificationExtender" />
            </intent-filter>
        </service>

*/


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OneSignalService } from './one-signal.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ OneSignalService ]

})
export class NotificationModule { }

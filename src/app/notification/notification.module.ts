/*

Install following, then this module shall work.
ionic cordova plugin add onesignal-cordova-plugin
npm install @ionic-native/onesignal

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

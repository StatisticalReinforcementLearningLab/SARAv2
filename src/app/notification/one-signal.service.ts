import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AlertController } from '@ionic/angular';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class OneSignalService {
  time;
  formattedTime;

  constructor(
    private oneSignal: OneSignal,
    private alertCtrl: AlertController
  ) { }


  initOneSignal(){
      //link for one signal tutorial ==========> https://devdactic.com/push-notifications-ionic-onesignal/
      
      //this.oneSignal.startInit('YOUR ONESIGNAL APP ID', 'YOUR ANDROID ID');
      this.oneSignal.startInit('f9c4370d-cbcb-4e6f-ab1f-25d1c41b8f3a', '851185487102');

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
      //this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
    
      //Sets a notification received handler. Only called if the app is 
      //running in the foreground at the time the notification was received.
      this.oneSignal.handleNotificationReceived().subscribe(data => {
        this.time = new Date().getTime();
        this.formattedTime = moment().format('MMMM Do YYYY, h:mm:ss a Z');
        console.log("notification is received at: "+this.time+" formatted: "+this.formattedTime);

        let title = data.payload.title;
        let msg = data.payload.body;
        //let additionalData = data.payload.additionalData;
        //this.showAlert(title, msg, additionalData.task);
        //this.showAlert(title+" "+msg, "notification is received at: "+this.time+" formatted: "+this.formattedTime);

      });
      
      //Sets a notification opened handler. The instance will be called when 
      //a notification is tapped on from the notification shade (ANDROID) or 
      //notification center (iOS), or when closing an Alert notification shown in the app 
      //(if InAppAlert is enabled in inFocusDisplaying, below).

      this.oneSignal.handleNotificationOpened().subscribe(data => {
        // do something when a notification is opened
        this.time = new Date().getTime();
        this.formattedTime = moment().format('MMMM Do YYYY, h:mm:ss a Z');
        console.log("notification is opened at: "+this.time+" formatted: "+this.formattedTime);
        let additionalData = data.notification.payload.additionalData;
        //this.showAlert('Notification opened', 'You already read this before', additionalData.task);     
        //this.showAlert('Notification opened',  "notification is opened at: "+this.time+" formatted: "+this.formattedTime);     


      });

      //--- clearOneSignalNotifications
      //--- https://documentation.onesignal.com/docs/cordova-sdk
      
      this.oneSignal.endInit();      
  }

  async showAlert(title, msg) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
          'OK'
 /*        {
          text: `Action: ${task}`,
          handler: () => {
            // E.g: Navigate to a specific screen
          }
        } */
      ]
    })
    alert.present();
  }  
}

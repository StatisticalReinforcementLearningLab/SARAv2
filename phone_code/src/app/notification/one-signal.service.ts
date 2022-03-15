import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AlertController } from '@ionic/angular';

import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserProfileService } from '../user/user-profile/user-profile.service';

@Injectable({
  providedIn: 'root'
})
export class OneSignalService {
  time;
  formattedTime;

  constructor(
    private oneSignal: OneSignal,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private userProfileService: UserProfileService
  ) { }


  initOneSignal(){
      //link for one signal tutorial ==========> https://devdactic.com/push-notifications-ionic-onesignal/
      
      //this.oneSignal.startInit('YOUR ONESIGNAL APP ID', 'YOUR ANDROID ID');
      console.log("--Onesignal-- " + "init called");
      this.oneSignal.startInit(environment.oneSignalAppId, environment.firebaseConfig.messagingSenderId);

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

      // iOS - Prompts the user for notification permissions.
      //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 6) to better communicate to your users what notifications they will get.
      // https://ionicframework.com/docs/v3/native/onesignal/
      // https://stackoverflow.com/questions/69276816/is-ionic-3-incompatible-w-onesignal
      this.oneSignal.promptForPushNotificationsWithUserResponse();

      //--- clearOneSignalNotifications
      //--- https://documentation.onesignal.com/docs/cordova-sdk
      
      this.oneSignal.endInit();    
      
      this.oneSignal.getPermissionSubscriptionState().then(status=>{
        console.log("--Onesignal-- " + JSON.stringify(status));
        window.localStorage.setItem("oneSignalPlayerId", ""+status.subscriptionStatus.userId);  
        this.userProfileService.userProfile.oneSignalPlayerId  = status.subscriptionStatus.userId;
        this.userProfileService.saveProfileToDevice();
        this.userProfileService.saveToServer();
      });  
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

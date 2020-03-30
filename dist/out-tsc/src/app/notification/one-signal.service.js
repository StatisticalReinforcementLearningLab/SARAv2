import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
var OneSignalService = /** @class */ (function () {
    function OneSignalService(oneSignal, alertCtrl) {
        this.oneSignal = oneSignal;
        this.alertCtrl = alertCtrl;
    }
    OneSignalService.prototype.initOneSignal = function () {
        //link for one signal tutorial ==========> https://devdactic.com/push-notifications-ionic-onesignal/
        var _this = this;
        //this.oneSignal.startInit('YOUR ONESIGNAL APP ID', 'YOUR ANDROID ID');
        this.oneSignal.startInit(environment.oneSignalAppId, environment.firebaseConfig.messagingSenderId);
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
        //this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
        //Sets a notification received handler. Only called if the app is 
        //running in the foreground at the time the notification was received.
        this.oneSignal.handleNotificationReceived().subscribe(function (data) {
            _this.time = new Date().getTime();
            _this.formattedTime = moment().format('MMMM Do YYYY, h:mm:ss a Z');
            console.log("notification is received at: " + _this.time + " formatted: " + _this.formattedTime);
            var title = data.payload.title;
            var msg = data.payload.body;
            //let additionalData = data.payload.additionalData;
            //this.showAlert(title, msg, additionalData.task);
            //this.showAlert(title+" "+msg, "notification is received at: "+this.time+" formatted: "+this.formattedTime);
        });
        //Sets a notification opened handler. The instance will be called when 
        //a notification is tapped on from the notification shade (ANDROID) or 
        //notification center (iOS), or when closing an Alert notification shown in the app 
        //(if InAppAlert is enabled in inFocusDisplaying, below).
        this.oneSignal.handleNotificationOpened().subscribe(function (data) {
            // do something when a notification is opened
            _this.time = new Date().getTime();
            _this.formattedTime = moment().format('MMMM Do YYYY, h:mm:ss a Z');
            console.log("notification is opened at: " + _this.time + " formatted: " + _this.formattedTime);
            var additionalData = data.notification.payload.additionalData;
            //this.showAlert('Notification opened', 'You already read this before', additionalData.task);     
            //this.showAlert('Notification opened',  "notification is opened at: "+this.time+" formatted: "+this.formattedTime);     
        });
        //--- clearOneSignalNotifications
        //--- https://documentation.onesignal.com/docs/cordova-sdk
        this.oneSignal.endInit();
    };
    OneSignalService.prototype.showAlert = function (title, msg) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertCtrl.create({
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
                        })];
                    case 1:
                        alert = _a.sent();
                        alert.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    OneSignalService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [OneSignal,
            AlertController])
    ], OneSignalService);
    return OneSignalService;
}());
export { OneSignalService };
//# sourceMappingURL=one-signal.service.js.map
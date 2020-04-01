//this component will register/login a user
import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserProfileService } from '../user-profile/user-profile.service';
import { tap } from 'rxjs/operators';
import { OneSignal } from '@ionic-native/onesignal/ngx';
var AuthComponent = /** @class */ (function () {
    function AuthComponent(authService, router, userProfileService, oneSignal) {
        this.authService = authService;
        this.router = router;
        this.userProfileService = userProfileService;
        this.oneSignal = oneSignal;
        this.isLoginMode = true;
        this.isLoading = false;
        this.error = null;
    }
    // was used to switch mode between login and register
    // onSwitchMode(){
    //   this.isLoginMode = !this.isLoginMode;
    // }
    AuthComponent.prototype.ngOnInit = function () {
        console.log(environment.userServer);
    };
    //login button was clicked
    AuthComponent.prototype.onSubmit = function (form) {
        var _this = this;
        console.log("auth.component.ts - onSubmit method - begin");
        if (!form.valid) {
            console.log('invalid');
            return;
        }
        var userName = form.value.userName;
        var password = form.value.password;
        var authObs;
        this.isLoading = true;
        // if(this.isLoginMode){
        // login returns an observable
        authObs = this.authService.login(userName, password);
        // }else{
        //   authObs =  this.authService.signup(userName, password);
        // }
        this.authSub = authObs.subscribe(function (resData) {
            console.log("auth.component.ts - onSubmit method - authService.login response: " + JSON.stringify(resData));
            if (resData.hasOwnProperty('access_token') && resData.hasOwnProperty('refresh_token')) {
                // the response contains an access token and refresh token
                console.log("auth.component.ts - onSubmit method - has access token");
                // userProfileService.initializeObs returns an observable, 
                // then below we can get the OneSignal Player id when UserProfile has been intialized 
                _this.userSub = _this.userProfileService.initializeObs()
                    .pipe(tap(function () {
                    _this.oneSignal.getIds().then(function (id) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var playerId;
                        return tslib_1.__generator(this, function (_a) {
                            playerId = id.userId;
                            this.userProfileService.userProfile.oneSignalPlayerId = id.userId;
                            console.log("onesignal player id: " + id);
                            this.userProfileService.saveProfileToDevice();
                            this.userProfileService.saveToServer();
                            return [2 /*return*/];
                        });
                    }); });
                }))
                    .subscribe(function () {
                    //this.router.navigateByUrl('/home');
                    _this.router.navigate(['home']);
                    _this.isLoading = false;
                });
            }
            else {
                _this.isLoading = false;
                _this.authService.loggedInUser.next(null);
                //for testing purposes.
                // this.router.navigateByUrl('/home');
                // console.log("log in did not succeed");
                if (resData.hasOwnProperty('message')) {
                    _this.error = resData.message;
                }
                else {
                    _this.error = "Unknown error\n" + JSON.stringify(resData);
                }
            }
            // console.log(resData);
        }, function (errorMessage) {
            console.log(errorMessage);
            _this.error = errorMessage;
            _this.isLoading = false;
        });
        form.reset();
    };
    AuthComponent.prototype.ngOnDestroy = function () {
        if (this.userSub) {
            this.userSub.unsubscribe();
        }
        if (this.authSub) {
            this.authSub.unsubscribe();
        }
    };
    AuthComponent = tslib_1.__decorate([
        Component({
            selector: 'app-auth',
            templateUrl: './auth.component.html',
            styleUrls: ['./auth.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AuthService,
            Router,
            UserProfileService,
            OneSignal])
    ], AuthComponent);
    return AuthComponent;
}());
export { AuthComponent };
//# sourceMappingURL=auth.component.js.map
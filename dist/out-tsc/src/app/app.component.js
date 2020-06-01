import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignalService } from './notification/one-signal.service';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd, NavigationStart, NavigationEnd } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { UserProfileService } from './user/user-profile/user-profile.service';
import { AuthService } from './user/auth/auth.service';
var AppComponent = /** @class */ (function () {
    function AppComponent(router, platform, splashScreen, statusBar, oneSignalService, authService, userProfileService, loadingController) {
        var _this = this;
        this.router = router;
        this.platform = platform;
        this.splashScreen = splashScreen;
        this.statusBar = statusBar;
        this.oneSignalService = oneSignalService;
        this.authService = authService;
        this.userProfileService = userProfileService;
        this.loadingController = loadingController;
        this.isLoading = true;
        this.agreeToTerms = JSON.parse(localStorage.getItem("agreeToTerms"));
        this.initializeApp();
        router.events.subscribe(function (event) {
            //this.isShowingRouteLoadIndicator = false;
            var asyncLoadCount = 0;
            if (event instanceof RouteConfigLoadStart) {
                asyncLoadCount++;
                console.log("Routing started");
                //console.log(event);
                //this.survey_text = "Loading Survey";
                console.log(event.route.path);
                // if(event.route.path == "survey")
                //    this.showLaoding();
            }
            else if (event instanceof RouteConfigLoadEnd) {
                asyncLoadCount--;
                console.log("Routing ended");
                console.log(event.route.path);
                // if(event.route.path == "survey")
                //    this.dismissLoading();
                //console.log(event);
                //this.survey_text = "Start survey";
                //console.log(this.router.url);
            }
            else if (event instanceof NavigationStart) {
                console.log("Navigation started");
                //this.survey_text = "Start survey";
            }
            else if (event instanceof NavigationEnd) {
                asyncLoadCount--;
                console.log("Navigation ended");
                //this.survey_text = "Start survey";
            }
            // If there is at least one pending asynchronous config load request,
            // then let's show the loading indicator.
            // --
            // CAUTION: I'm using CSS to include a small delay such that this loading
            // indicator won't be seen by people with sufficiently fast connections.
            _this.isShowingRouteLoadIndicator = !!asyncLoadCount;
        });
    }
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent.prototype.ngOnDestroy = function () {
        if (this.userSub) {
            this.userSub.unsubscribe();
        }
    };
    AppComponent.prototype.initializeApp = function () {
        var _this = this;
        this.authService.autoLogin();
        if (this.authService.isLoggedIn()) {
            this.showLoading();
            this.userSub = this.userProfileService.initializeObs().subscribe(function () {
                _this.dismissLoading();
                _this.isLoading = false;
                console.log("successfully logged in");
            });
            // this.userProfileService.initialize();
            // if we can for things to wait to progress in here
            // then, we'll only need to load user profile here and at login in Auth component
        }
        else {
            console.log("log in unsuccessful.");
            this.dismissLoading();
            this.isLoading = false;
        }
        this.platform.ready().then(function () {
            //this.statusBar.styleDefault();
            // let status bar overlay webview
            //this.statusBar.overlaysWebView(true);
            // set status bar to white
            //this.statusBar.backgroundColorByHexString('#ffffff');
            if (_this.platform.is('android')) {
                _this.statusBar.styleLightContent();
                _this.statusBar.backgroundColorByHexString("#004166");
            }
            _this.splashScreen.hide();
            _this.oneSignalService.initOneSignal();
        });
        //window.localStorage.setItem("TotalPoints", "0");
        // let status bar overlay webview
        //this.statusBar.overlaysWebView(true);
        // set status bar to white
        //this.statusBar.backgroundColorByHexString('#ffffff');
    };
    AppComponent.prototype.showLoading = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.loadingController.create({
                                message: "Loading...",
                                spinner: "lines",
                                duration: 5000
                            })];
                    case 1:
                        _a.loading = _b.sent();
                        this.loading.onDidDismiss(function () {
                            console.log('Dismissed loading after 5 seconds');
                        });
                        this.loading.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    AppComponent.prototype.dismissLoading = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.loading.dismiss();
                return [2 /*return*/];
            });
        });
    };
    AppComponent.prototype.presentLoading = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading, _a, role, data;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.loadingController.create({
                            message: 'Hellooo',
                            duration: 2000
                        })];
                    case 1:
                        loading = _b.sent();
                        return [4 /*yield*/, loading.present()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, loading.onDidDismiss()];
                    case 3:
                        _a = _b.sent(), role = _a.role, data = _a.data;
                        console.log('Loading dismissed!');
                        return [2 /*return*/];
                }
            });
        });
    };
    AppComponent.prototype.presentLoadingWithOptions = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadingController.create({
                            spinner: null,
                            duration: 5000,
                            message: 'Please wait...',
                            translucent: true,
                            cssClass: 'custom-class custom-loading'
                        })];
                    case 1:
                        loading = _a.sent();
                        return [4 /*yield*/, loading.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppComponent = tslib_1.__decorate([
        Component({
            selector: 'app-root',
            templateUrl: 'app.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [Router,
            Platform,
            SplashScreen,
            StatusBar,
            OneSignalService,
            AuthService,
            UserProfileService,
            LoadingController])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map
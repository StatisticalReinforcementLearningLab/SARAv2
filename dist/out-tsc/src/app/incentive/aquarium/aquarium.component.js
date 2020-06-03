import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { DemoAquariumComponent } from '../../incentive/aquarium/demo-aquarium/demo-aquarium.component';
import { Platform, AlertController, ModalController, NavController, MenuController } from '@ionic/angular';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../../user/user-profile/user-profile.service';
import { myEnterAnimation } from '../../animations/modal_enter';
import { ModalUnlockedPageComponent } from '../../incentive/aquarium/modal-unlocked-page/modal-unlocked-page.component';
import { myLeaveAnimation } from '../../animations/modal_leave';
import { Store, select } from '@ngrx/store';
import { isIncentivesUnlockedForTheDay } from '../../incentive/incentive.selectors';
import { unlockedScreenShownAlready } from '../incentive.actions';
var AquariumComponent = /** @class */ (function () {
    function AquariumComponent(platform, alertCtrl, router, route, modalController, store, navController, menu, userProfileService) {
        var _this = this;
        this.platform = platform;
        this.alertCtrl = alertCtrl;
        this.router = router;
        this.route = route;
        this.modalController = modalController;
        this.store = store;
        this.navController = navController;
        this.menu = menu;
        this.userProfileService = userProfileService;
        this.money = 0;
        this.modalObjectNavigationExtras = {};
        this.title = "";
        this.isIOS = false;
        console.log("Constructor called");
        this.sub1$ = this.platform.pause.subscribe(function () {
            console.log('****UserdashboardPage PAUSED****');
            _this.child.pauseGameRendering();
        });
        this.sub2$ = this.platform.resume.subscribe(function () {
            console.log('****UserdashboardPage RESUMED****');
            _this.child.resumeGameRendering();
        });
        if (window.localStorage['AwardDollar'] == undefined)
            this.money = 0;
        else {
            try {
                this.money = parseInt(window.localStorage['AwardDollar']);
            }
            catch (error) {
                window.localStorage.setItem("AwardDollar", "" + 0);
                this.money = 0;
            }
        }
        if (this.platform.is('ios')) {
            this.isIOS = true;
        }
        this.sideMenu();
    }
    Object.defineProperty(AquariumComponent.prototype, "isActive", {
        get: function () {
            //return false;
            if (this.userProfileService == undefined)
                return true;
            else
                return this.userProfileService.isActive;
        },
        enumerable: true,
        configurable: true
    });
    AquariumComponent.prototype.startCheatPage = function () {
        //this.router.navigate(['incentive/tundra']);
        this.navController.navigateRoot(['incentive/cheatpoints']);
    };
    AquariumComponent.prototype.startInfoPage = function () {
        this.navController.navigateRoot(['incentive/infopage']);
    };
    AquariumComponent.prototype.sideMenu = function () {
        this.navigate =
            [
                {
                    title: "Home",
                    url: "/home",
                    icon: "home"
                },
                {
                    title: "Chat",
                    url: "/chat",
                    icon: "chatboxes"
                },
                {
                    title: "Contacts",
                    url: "/contacts",
                    icon: "contacts"
                },
            ];
    };
    //show side menu
    AquariumComponent.prototype.showSideMenu = function () {
        console.log("side menu called");
        this.menu.enable(true, 'first');
        this.menu.open('first');
    };
    AquariumComponent.prototype.ionViewDidLeaveFunction = function () {
        this.child.ionViewDidLeaveFunction();
        //unsubscribe from model view.
        this.modalDataSubscription$.unsubscribe();
    };
    AquariumComponent.prototype.ionViewDidLeave = function () {
        console.log("ionDidLeave");
        this.ionViewDidLeaveFunction();
    };
    AquariumComponent.prototype.ionViewDidEnter = function () {
        console.log("ionViewDidEnter");
        this.child.loadFunction();
        //decide if we want to show the modal view with unlockables.
        this.subscribeForModalView();
    };
    AquariumComponent.prototype.ionViewWillUnload = function () {
    };
    AquariumComponent.prototype.ngOnInit = function () {
        /*
        this.route.queryParams.subscribe(params => {
          if (this.router.getCurrentNavigation().extras.state) {
            //throw new Error("Method not implemented.");
            //show modal on awards
            this.modalObjectNavigationExtras = this.router.getCurrentNavigation().extras.state.modalObjectNavigationExtras;
            console.log("home.page.ts --- modalObjectNavigationExtras: " + JSON.stringify(this.modalObjectNavigationExtras));
            if(this.modalObjectNavigationExtras['IsModalShownYet'] == false)
              this.showModal();
    
            
            //this.date = this.router.getCurrentNavigation().extras.state.date;
            //this.reinforcementObj['prob'] = this.router.getCurrentNavigation().extras.state.prob;
            //this.reinforcement_data = this.router.getCurrentNavigation().extras.state.reinforcement_data;
            //console.log("Inside AwardAltruism, date is: " +this.date+" prob is: "+this.reinforcementObj['prob']);
          }
        });
        */
        this.title = "ADAPTS";
        console.log("aquarium.component.ts --- start");
        //this.menu.enable(true);
    };
    AquariumComponent.prototype.ngOnDestroy = function () {
        this.sub1$.unsubscribe();
        this.sub2$.unsubscribe();
        this.ionViewDidLeaveFunction();
        console.log("aquarium.component.ts --- destroy");
    };
    AquariumComponent.prototype.subscribeForModalView = function () {
        var _this = this;
        //this.unlockedItems$ = 
        this.modalDataSubscription$ = this.store.pipe(select(isIncentivesUnlockedForTheDay))
            .subscribe(function (params) {
            if (params == undefined)
                console.log("---params: undefined---" + JSON.stringify(params));
            else {
                console.log("---params: ---" + JSON.stringify(params));
                var unlockedIncentive = params;
                //computeUnlockedReinforcements(currentPoints, previousPoints, awardedDollar)
                if (unlockedIncentive["isUnlockedViewShown"] == false)
                    _this.computeUnlockedReinforcements(unlockedIncentive["current_point"], unlockedIncentive["current_point"] - unlockedIncentive["unlocked_points"], unlockedIncentive["unlocked_money"]);
            }
        });
    };
    AquariumComponent.prototype.startSurvey = function () {
        console.log('start survey');
        var currentTime = moment();
        var startTime = moment({ hour: 18 }); // 6pm
        var endTime = moment({ hour: 23, minute: 59 }); // 11:59pm
        if (!currentTime.isBetween(startTime, endTime)) {
            this.presentAlert('Please come back between 6 PM and midnight');
        }
        else if (this.userProfileService.surveyTakenForCurrentDay()) {
            this.presentAlert('You have already completed the survey for the day.');
        }
        else {
            if (this.userProfileService.isParent) {
                this.navController.navigateRoot(['survey/samplesurvey']); //caregiversurvey
            }
            else {
                this.navController.navigateRoot(['survey/samplesurvey2']); //aya
            }
        }
    };
    AquariumComponent.prototype.openSurvey = function (location) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.navController.navigateRoot([location]);
                return [2 /*return*/];
            });
        });
    };
    AquariumComponent.prototype.presentAlert = function (alertMessage) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertCtrl.create({
                            //<div style="font-size: 20px;line-height: 25px;padding-bottom:10px;text-align:center">Thank you for completing the survey. You have unlocked a meme.</div>
                            //header: '<div style="line-height: 25px;padding-bottom:10px;text-align:center">Daily survey unavilable</div>',
                            header: 'Daily survey unavilable',
                            //subHeader: "Survey is not avaibable!",
                            message: alertMessage,
                            //defined in theme/variables.scss
                            //buttons: [{text: 'OK', cssClass: 'secondary'}]
                            buttons: [{ text: 'OK' }]
                        })];
                    case 1:
                        alert = _a.sent();
                        /*
                          let alert = this.alertCtrl.create({
                            title: 'Low battery',
                            subTitle: '10% of battery remaining',
                            buttons: ['Dismiss']
                          });
                        */
                        //----
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        /*
                          let alert = this.alertCtrl.create({
                            title: 'Low battery',
                            subTitle: '10% of battery remaining',
                            buttons: ['Dismiss']
                          });
                        */
                        //----
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AquariumComponent.prototype.dispalySurveyPausedMsg = function () {
        this.presentAlert('This account has been temporarily paused by the research administrators.');
    };
    AquariumComponent.prototype.showMemeDemo = function () {
        this.router.navigate(['incentive/award-memes']);
    };
    AquariumComponent.prototype.showAltruisticDemo = function () {
        this.router.navigate(['incentive/award-altruism']);
    };
    AquariumComponent.prototype.showModalDemo = function () {
        var reinforcements = [];
        reinforcements.push({ 'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?" });
        reinforcements.push({ 'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?" });
        reinforcements.push({ 'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?" });
        //reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
        //reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
        //reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
        //reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
        //reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
        this.presentModal(reinforcements);
    };
    //show unlocked pages, using a modal
    AquariumComponent.prototype.presentModal = function (reinforcements) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: ModalUnlockedPageComponent,
                            componentProps: {
                                'reinforcements': reinforcements
                            },
                            enterAnimation: myEnterAnimation,
                            leaveAnimation: myLeaveAnimation,
                            //,
                            cssClass: 'my-default-2'
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AquariumComponent.prototype.showModal = function () {
        //if(window.localStorage['IsModalShown'] == undefined)
        //  return;
        //if(window.localStorage['IsModalShown'] == "false"){
        //
        var todaysDate = moment().format('YYYYMMDD');
        var storedDate = this.modalObjectNavigationExtras["LastSurveyCompletionDate"];
        //
        if (todaysDate == storedDate) {
            //this.computeUnlockedReinforcements();
        }
        //
        //window.localStorage.setItem("IsModalShown", "true");
        //}
    };
    AquariumComponent.prototype.isFirstDayInTheStudy = function () {
        var daily_survey = this.userProfileService.userProfile.survey_data.daily_survey;
        var first_date = moment().format('YYYYMMDD');
        var first_date_moment_js = moment(first_date, "YYYYMMDD");
        var key_moment_js;
        for (var key in daily_survey) {
            key_moment_js = moment(key, "YYYYMMDD");
            //takes the first day only. But it may not be the first date.
            if (key_moment_js < first_date_moment_js) {
                first_date = key;
                first_date_moment_js = moment(first_date, "YYYYMMDD");
            }
        }
        var todays_date = moment().format('YYYYMMDD');
        if (todays_date == first_date)
            return true;
        else
            return false;
    };
    AquariumComponent.prototype.computeUnlockedReinforcements = function (currentPoints, previousPoints, awardedDollar) {
        var _this = this;
        //var currentPoints = this.modalObjectNavigationExtras["CurrentPoints"];
        //var previousPoints = this.modalObjectNavigationExtras["PreviousPoints"];
        //var awardedDollar = this.modalObjectNavigationExtras["AwardedDollar"];
        var reinforcements = [];
        console.log("computeUnlockedReinforcements: called");
        //get if money is awarded.
        if (awardedDollar > 0) {
            if (this.isFirstDayInTheStudy())
                reinforcements.push({ 'img': 'assets/img/1dollar.jpg', 'header': 'You earned ' + awardedDollar + ' dollar(s)', 'text': 'Thanks for being a participant in the study. You earned 2 dollar.' });
            else
                reinforcements.push({ 'img': 'assets/img/1dollar.jpg', 'header': 'You earned ' + awardedDollar + ' dollar(s)', 'text': 'You earned 1 dollar for completing surveys 3-days in a row' });
        }
        //get if fish is alotted
        previousPoints = currentPoints - 60;
        console.log(currentPoints + ", " + previousPoints);
        fetch('../../../assets/game/fishpoints.json').then(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fish_data, img, header, text, i;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, res.json()];
                    case 1:
                        fish_data = _a.sent();
                        for (i = 0; i < fish_data.length; i++) {
                            if ((fish_data[i].points > previousPoints) && (fish_data[i].points <= currentPoints)) {
                                img = "assets/" + fish_data[i].img.substring(0, fish_data[i].img.length - 4) + '_tn.jpg';
                                header = "You unlocked " + fish_data[i].name;
                                text = fish_data[i].trivia;
                                reinforcements.push({ 'img': img, 'header': header, 'text': text });
                            }
                        }
                        console.log("reinforcements: " + JSON.stringify(reinforcements));
                        if (reinforcements.length > 0) //means some rainforcement was provided.
                            this.presentModal(reinforcements);
                        return [2 /*return*/];
                }
            });
        }); });
        //update the state reinforcement
        this.store.dispatch(unlockedScreenShownAlready({ isUnlockedScreenShown: true }));
    };
    tslib_1.__decorate([
        ViewChild(DemoAquariumComponent, { static: true }),
        tslib_1.__metadata("design:type", Object)
    ], AquariumComponent.prototype, "child", void 0);
    AquariumComponent = tslib_1.__decorate([
        Component({
            selector: 'app-aquarium',
            templateUrl: './aquarium.component.html',
            styleUrls: ['./aquarium.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [Platform, AlertController,
            Router,
            ActivatedRoute,
            ModalController,
            Store,
            NavController,
            MenuController,
            UserProfileService])
    ], AquariumComponent);
    return AquariumComponent;
}());
export { AquariumComponent };
//# sourceMappingURL=aquarium.component.js.map
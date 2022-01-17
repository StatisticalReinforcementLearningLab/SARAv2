import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { UserProfile } from './user-profile.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';
var UserProfileService = /** @class */ (function () {
    function UserProfileService(http) {
        this.http = http;
        this.me = this;
        this.initialLoading = new BehaviorSubject(true);
    }
    //returns Observable that we can subsrbie to so as to trigger an action after 
    //user profile has been initialized
    UserProfileService.prototype.initializeObs = function () {
        var _this = this;
        //get profile from server
        // 
        console.log("user-profile.service.ts - initializeObs method");
        var getProfile = this.http.post(environment.userServer + '/userinfo', { "empty": "empty" });
        var getProfileFixed = this.http.get(environment.userServer + '/userinfofixed');
        // forkJoin will return an observable that waits till both http requests have received responses
        return forkJoin([getProfile, getProfileFixed])
            .pipe(tap(function (response) {
            console.log("in response of forkjoin");
            var response1 = response[0];
            var response2 = response[1];
            console.log("initializeObs response1: " + JSON.stringify(response1));
            console.log("initializeObs response2: " + JSON.stringify(response2));
            console.log("initializeOb - response1.username: " + response1.username);
            console.log("initializeOb - !response1.username: " + !response1.username);
            console.log("initializeOb - !response1.hasOwnProperty('username'): " + !response1.hasOwnProperty('username'));
            if (!response1.username || !response1.hasOwnProperty('username')) {
                console.log("blank or empty user_name");
                var username = localStorage.getItem('loggedInUser');
                var currenttime = new Date();
                var dateString = moment(currenttime).format('MMMM Do YYYY, h:mm:ss a Z');
                _this.userProfile = new UserProfile(username, [], 0, 0, currenttime.getTime(), dateString);
            }
            else {
                _this.userProfile = response1;
                if (_this.userProfile.hasOwnProperty("AwardDollarDates")) {
                    localStorage.setItem("AwardDollarDates", JSON.stringify(_this.userProfile.AwardDollarDates));
                }
                localStorage.setItem("AwardDollar", JSON.stringify(_this.userProfile.dollars));
            }
            _this.userProfileFixed = response2;
            _this.saveProfileToDevice();
            _this.initialLoading.next(false);
        }));
    };
    /*
    addReinforcementData returns true if successful at adding the element (it doesn't already exist for the given date)
    date is a string of the format YYYYMMDD (e.g. "20170430")
    
    reinforcementObj is an object of the form:
    {
        "ds": 1, //means participants completed the survey
        "prob": 0.23,
        "Like": "yes", //no if participants hated it.
        "reward": 1,  //0 means users were not randomized
        "reward_type": "meme", //'altruistic message'
        "reward_img_link": "img/reinforcements/memes/IM25.jpg"
    }
    */
    UserProfileService.prototype.addReinforcementData = function (date, reinforcementObj) {
        if (!(date in this.userProfile.reinfrocement_data)) {
            this.userProfile.reinfrocement_data[date] = reinforcementObj;
            return true;
        }
        else {
            return false;
        }
    };
    // not currenlty using below method (wich calcs dollars based on days survey is taken in UserProfile)
    // instead allowing award-dollar.service to calc streaks
    UserProfileService.prototype.calcDollars = function () {
        //this method calculates the number of three day streaks
        //then sets dollars = to number of three day streaks
        var previousDate = new Date("1970-01-01");
        var numStreaks = 0;
        var streak = 1;
        // console.log("calcDollars, # dates: " + this.userProfile.datesTaken.length);
        for (var i = 0; i < this.userProfile.datesTaken.length; i++) {
            var currentDateStr = this.userProfile.datesTaken[i];
            var currentDate = new Date(currentDateStr.substr(0, 4) + "-" + currentDateStr.substr(4, 2) + "-" + currentDateStr.substr(6, 2));
            // console.log("calcDollars: " + currentDate);
            var daysDiff = Math.round((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff == 0) {
                continue;
            }
            if (daysDiff == 1) {
                streak++;
                // console.log("streak: "+ streak);
                if (streak == 3) {
                    numStreaks++;
                    // reset
                    previousDate = new Date("1970-01-01"); //set previousDate to 1970-01-01
                    streak = 1;
                }
            }
            else {
                //reset
                streak = 1;
            }
            previousDate = currentDate;
        }
        console.log("numStreaks: " + numStreaks);
        this.userProfile.dollars = numStreaks;
    };
    Object.defineProperty(UserProfileService.prototype, "isActive", {
        get: function () {
            //console.log("user-profile.service.ts - isActive getter - begin");
            return this.userProfileFixed.isActive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserProfileService.prototype, "isParent", {
        get: function () {
            console.log("user-profile.service.ts - isParent getter - begin");
            return this.userProfileFixed.isParent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserProfileService.prototype, "points", {
        get: function () {
            console.log("user-profile.service.ts - points getter - begin");
            if (this.userProfile == undefined)
                this.loadProfileFromDevice();
            return this.userProfile.points;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserProfileService.prototype, "username", {
        get: function () {
            //console.log("user-profile.service.ts - username getter - begin");
            if (this.userProfile == undefined)
                this.loadProfileFromDevice();
            return this.userProfile.username;
        },
        set: function (username) {
            console.log("user-profile.service.ts - isActive setter - begin");
            this.userProfile.username = username;
            this.saveProfileToDevice();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserProfileService.prototype, "versionNumber", {
        get: function () {
            if (this.userProfile == undefined)
                this.loadProfileFromDevice();
            return this.userProfile.versionNumber;
        },
        set: function (versionNumber) {
            this.userProfile.versionNumber = versionNumber;
            this.saveProfileToDevice();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserProfileService.prototype, "oneSignalPlayerId", {
        get: function () {
            return this.userProfile.oneSignalPlayerId;
        },
        enumerable: true,
        configurable: true
    });
    UserProfileService.prototype.saveToServer = function () {
        this.loadProfileFromDevice();
        var userProfile = this.userProfile;
        this.http
            .post(environment.userServer + '/setuserinfo', userProfile)
            .subscribe(function (response) {
            console.log(response);
        });
        console.log("saveToServer userProfile: " + JSON.stringify(userProfile));
    };
    UserProfileService.prototype.retrieve = function (userID) {
    };
    UserProfileService.prototype.getProfile = function () {
    };
    UserProfileService.prototype.initTestProfile = function () {
        var currenttime = new Date();
        var dateString = moment(currenttime).format('MMMM Do YYYY, h:mm:ss a Z');
        var userProfile = new UserProfile('testy', [], 0, 3, currenttime.getTime(), dateString);
        this.userProfile = userProfile;
        this.saveProfileToDevice();
        //STORE ON DEVICE
    };
    UserProfileService.prototype.saveProfileToDevice = function () {
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
        // maybe use this logic in case it's undefined:  https://stackoverflow.com/questions/37417012/unexpected-token-u-in-json-at-position-0
        localStorage.setItem('userProfileFixed', JSON.stringify(this.userProfileFixed));
    };
    UserProfileService.prototype.profileIsOnDevice = function () {
        if (localStorage.getItem('userProfile') !== null) {
            return true;
        }
        else {
            return false;
        }
    };
    UserProfileService.prototype.loadProfileFromDevice = function () {
        this.userProfile = JSON.parse(localStorage.getItem('userProfile'));
        //temporarily commenting out below line (see other instance for more info)
        // this.userProfileFixed = JSON.parse(localStorage.getItem('userProfileFixed'));
    };
    // below method can be called when a survey has been completed
    // it does all the needed accounting
    // adds current date to dict (and array)
    UserProfileService.prototype.surveyCompleted = function () {
        console.log("user-profile.service.ts - surveyCompleted method - begin");
        var username = localStorage.getItem('loggedInUser'); //this.authService.loggedInUser.getValue()
        // check if survey has already been take for the current day or admin is contained in the username
        // console.log('surveyCompleted - before if loop');
        if (!this.surveyTakenForCurrentDay() || username.indexOf('admin') >= 0) {
            // console.log('surveyCompleted - in if loop');
            this.addDateTaken();
            this.addSurveyPoints();
            //this.calcDollars();
            this.userProfile.lastupdate = this.numericCurrenDateTime;
            var dateString = moment(this.userProfile.lastupdate).format('MMMM Do YYYY, h:mm:ss a Z');
            this.userProfile.readable_ts = dateString;
            // console.log("in SurveyCompleted, AwardDollarDates: "+ localStorage.getItem("AwardDollarDates"));
            this.userProfile.AwardDollarDates = JSON.parse(localStorage.getItem("AwardDollarDates")); //fetch AwardDollarDates from local storage and add it to the UserProfile
            try {
                this.userProfile.dollars = JSON.parse(localStorage.getItem("AwardDollar"));
            }
            catch (error) {
                window.localStorage.setItem("AwardDollar", "" + 0);
                this.userProfile.dollars = 0;
            }
            this.saveProfileToDevice();
            this.saveToServer();
        }
    };
    Object.defineProperty(UserProfileService.prototype, "stringCurrenDate", {
        get: function () {
            console.log("user-profile.service.ts - stringCurrenDate getter - begin");
            //shift hours back by 2, so that 2am, will register as 12am
            var hoursShift = 2;
            var currentDateTime = new Date();
            currentDateTime.setHours(currentDateTime.getHours() - hoursShift);
            //now, set hours, min, sec to zero
            currentDateTime.setHours(0, 0, 0, 0);
            return currentDateTime.getFullYear()
                + "" + ('0' + (currentDateTime.getMonth() + 1)).slice(-2)
                + "" + ('0' + currentDateTime.getDate()).slice(-2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserProfileService.prototype, "numericCurrenDateTime", {
        get: function () {
            console.log("user-profile.service.ts - numericCurrenDateTime getter - begin");
            //shift hours back by 2, so that 2am, will register as 12am
            var hoursShift = 2;
            var currentDateTime = new Date();
            currentDateTime.setHours(currentDateTime.getHours() - hoursShift);
            //now, set hours, min, sec to zero
            currentDateTime.setHours(0, 0, 0, 0);
            return currentDateTime.getTime();
        },
        enumerable: true,
        configurable: true
    });
    UserProfileService.prototype.addDateTaken = function () {
        console.log("user-profile.service.ts - addDateTaken method - begin");
        this.loadProfileFromDevice();
        var stringCurrenDate = this.stringCurrenDate;
        this.userProfile.datesTaken.push(stringCurrenDate);
        this.userProfile.survey_data.daily_survey[stringCurrenDate] = 1;
        this.saveProfileToDevice();
    };
    // boolean function, checks if survey has been taken for the current date.
    UserProfileService.prototype.surveyTakenForCurrentDay = function () {
        console.log("user-profile.service.ts - surveyTakenForCurrentDay method - begin");
        this.loadProfileFromDevice();
        //check if date already exists in dict of dates, otherwise add the date to dict    
        // var hasMatch = false;
        if (this.stringCurrenDate in this.userProfile.survey_data.daily_survey) {
            return true;
        }
        else {
            return false;
        }
    };
    UserProfileService.prototype.addSurveyPoints = function () {
        console.log("user-profile.service.ts - addSurveyPoints method - begin");
        var pointsPerSurvey = 60;
        this.addPoints(pointsPerSurvey);
    };
    UserProfileService.prototype.addPoints = function (points) {
        console.log("user-profile.service.ts - addPoints method - begin");
        this.userProfile.points += points;
        this.userProfile.survey_data.points += points;
        this.saveProfileToDevice();
        this.saveToServer();
    };
    UserProfileService.prototype.cheatPoints = function (points) {
        console.log("user-profile.service.ts - cheatPoints method - begin");
        this.userProfile.points = points;
        this.userProfile.survey_data.points = points;
        this.saveProfileToDevice();
        this.saveToServer();
    };
    UserProfileService.prototype.removeUserProfile = function () {
        localStorage.removeItem('userProfile');
    };
    UserProfileService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient])
    ], UserProfileService);
    return UserProfileService;
}());
export { UserProfileService };
//# sourceMappingURL=user-profile.service.js.map
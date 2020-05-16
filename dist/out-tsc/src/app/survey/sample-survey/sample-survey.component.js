import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
//import { PreLoad } from '../../PreLoad';
import { DatabaseService } from 'src/app/monitor/database.service';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
var SampleSurveyComponent = /** @class */ (function () {
    function SampleSurveyComponent(userProfileService, db) {
        this.userProfileService = userProfileService;
        this.db = db;
        this.pageTitle = "Survey_caregiver";
    }
    SampleSurveyComponent.prototype.ngOnInit = function () {
    };
    SampleSurveyComponent.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.db.getDatabaseState().subscribe(function (rdy) {
            if (rdy) {
                _this.db.addTrack(_this.pageTitle, "Enter", _this.userProfileService.username, Object.keys(_this.userProfileService.userProfile.survey_data.daily_survey).length);
            }
        });
    };
    SampleSurveyComponent.prototype.ionViewDidLeave = function () {
        var _this = this;
        console.log(this.pageTitle + ": ionViewDidLeave");
        this.db.getDatabaseState().subscribe(function (rdy) {
            if (rdy) {
                _this.db.addTrack(_this.pageTitle, "Leave", _this.userProfileService.username, Object.keys(_this.userProfileService.userProfile.survey_data.daily_survey).length);
            }
        });
    };
    SampleSurveyComponent = tslib_1.__decorate([
        Component({
            selector: 'app-sample-survey',
            templateUrl: './sample-survey.component.html',
            styleUrls: ['./sample-survey.component.scss'],
        })
        //@PreLoad('life-insights')
        ,
        tslib_1.__metadata("design:paramtypes", [UserProfileService,
            DatabaseService])
    ], SampleSurveyComponent);
    return SampleSurveyComponent;
}());
export { SampleSurveyComponent };
//# sourceMappingURL=sample-survey.component.js.map
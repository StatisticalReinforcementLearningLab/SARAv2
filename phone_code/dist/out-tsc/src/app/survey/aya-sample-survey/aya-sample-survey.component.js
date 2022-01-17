import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/monitor/database.service';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
var AyaSampleSurveyComponent = /** @class */ (function () {
    function AyaSampleSurveyComponent(userProfileService, db) {
        this.userProfileService = userProfileService;
        this.db = db;
        this.pageTitle = "Survey_aya";
    }
    AyaSampleSurveyComponent.prototype.ngOnInit = function () {
    };
    AyaSampleSurveyComponent.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.db.getDatabaseState().subscribe(function (rdy) {
            if (rdy) {
                _this.db.addTrack(_this.pageTitle, "Enter", _this.userProfileService.username, Object.keys(_this.userProfileService.userProfile.survey_data.daily_survey).length);
            }
        });
    };
    AyaSampleSurveyComponent.prototype.ionViewDidLeave = function () {
        var _this = this;
        console.log(this.pageTitle + ": ionViewDidLeave");
        this.db.getDatabaseState().subscribe(function (rdy) {
            if (rdy) {
                _this.db.addTrack(_this.pageTitle, "Leave", _this.userProfileService.username, Object.keys(_this.userProfileService.userProfile.survey_data.daily_survey).length);
            }
        });
    };
    AyaSampleSurveyComponent = tslib_1.__decorate([
        Component({
            selector: 'app-aya-sample-survey',
            templateUrl: './aya-sample-survey.component.html',
            styleUrls: ['./aya-sample-survey.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [UserProfileService,
            DatabaseService])
    ], AyaSampleSurveyComponent);
    return AyaSampleSurveyComponent;
}());
export { AyaSampleSurveyComponent };
//# sourceMappingURL=aya-sample-survey.component.js.map
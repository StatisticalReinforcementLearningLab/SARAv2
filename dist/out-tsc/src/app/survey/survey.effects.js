import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SurveyActions } from './action-types';
import { UserProfileService } from '../user/user-profile/user-profile.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { environment } from '../../environments/environment';


var SurveyEffects = /** @class */ (function () {
    function SurveyEffects(actions$, router, userProfileService, httpClient) {
        var _this = this;
        this.actions$ = actions$;
        this.router = router;
        this.userProfileService = userProfileService;
        this.httpClient = httpClient;
        this.flaskServerAPIEndpoint = environment.flaskServerForIncentives;

        this.login$ = createEffect(function () {
            return _this.actions$.pipe(ofType(SurveyActions.surveyCompleted), tap(function (action) {
                //store on a server
                localStorage.setItem('surveyTimeline', JSON.stringify(action.surveyTimeline));
                //
                var username = _this.userProfileService.username;
                var currentTimeTs = Date.now();
                var currentTimeReadableTs = moment().format("MMMM Do YYYY, h:mm:ss a Z");
                var dataString = moment().format("YYYYMMDD");
                var headers = { "Content-Type": "application/json;charset=UTF-8" };
                var body = { "user_id": username, "dataString": dataString, "whenCompletedTs": currentTimeTs, "whenCompletedReadableTs": currentTimeReadableTs };
                /*
                this.httpClient.post<any>("http://ec2-54-91-131-166.compute-1.amazonaws.com:56733/store-onesignal-id", body, { headers }).subscribe({
                next: data => console.log(data),
                error: error => console.error('There was an error!', error)
                });
                */
                _this.httpClient.post(this.flaskServerAPIEndpoint + "/store-survey-completed", body)
                    .subscribe({
                    next: function (data) { return console.log("--survey_completed-- " + JSON.stringify(data)); },
                    error: function (error) { return console.error('There was an error!', error); }
                });
            }));
        }, { dispatch: false });
    }
    SurveyEffects = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Actions,
            Router,
            UserProfileService,
            HttpClient])
    ], SurveyEffects);
    return SurveyEffects;
}());
export { SurveyEffects };
//# sourceMappingURL=survey.effects.js.map
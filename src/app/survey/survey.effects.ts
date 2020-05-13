import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import { SurveyActions } from './action-types';
import { UserProfileService } from '../user/user-profile/user-profile.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Injectable()
export class SurveyEffects {
    
    login$ = createEffect(() =>
        this.actions$.pipe(
                ofType(SurveyActions.surveyCompleted),
                tap(action => {
                    //store on a server
                    localStorage.setItem('surveyTimeline',
                        JSON.stringify(action.surveyTimeline));


                    //
                    var username = this.userProfileService.username;
                    var currentTimeTs = Date.now();
                    var currentTimeReadableTs = moment().format("MMMM Do YYYY, h:mm:ss a Z");
                    var dataString = moment().format("YYYYMMDD");
                    const headers = { "Content-Type": "application/json;charset=UTF-8"};
                    const body = {"user_id": username, "dataString": dataString, "whenCompletedTs": currentTimeTs, "whenCompletedReadableTs": currentTimeReadableTs};
                    /*
                    this.httpClient.post<any>("http://ec2-54-91-131-166.compute-1.amazonaws.com:56733/store-onesignal-id", body, { headers }).subscribe({
                    next: data => console.log(data),
                    error: error => console.error('There was an error!', error)
                    });
                    */
                    this.httpClient.post("http://ec2-54-91-131-166.compute-1.amazonaws.com:56733/store-survey-completed", body)
                    .subscribe({
                        next: data => console.log("--survey_completed-- " + JSON.stringify(data)),
                        error: error => console.error('There was an error!', error)
                    });    
                })
            )
    ,
    {dispatch: false});


    constructor(private actions$: Actions,
                private router: Router,
                private userProfileService: UserProfileService,
                private httpClient: HttpClient) {

    }

}
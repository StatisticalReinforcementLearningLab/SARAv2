import { SurveyTimeline } from '../model/surveyTimeline';
import { createReducer, on } from '@ngrx/store';
import { SurveyActions } from '../action-types';
import * as moment from 'moment';

export interface SurveyState{
    surveyTimeLine : SurveyTimeline
}


export const initialSurveyState: SurveyState = {
    surveyTimeLine: undefined 
}


export const surveyReducer = createReducer(

    initialSurveyState,
    on(SurveyActions.surveyCompleted, (state, action) => {
        var currentDate = moment().format('YYYYMMDD');
        var surveyObject = {};
        surveyObject[currentDate] = action.surveyTimeline;
        return surveyObject;
    })

    /*
    on(AuthActions.login, (state, action) => {
        return {
            user: action.user
        }
    }),

    on(AuthActions.logout, (state, action) => {
        return {
            user: undefined
        }
    })
    */



);
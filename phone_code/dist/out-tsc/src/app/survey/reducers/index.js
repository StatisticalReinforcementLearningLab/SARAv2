import { createReducer, on } from '@ngrx/store';
import { SurveyActions } from '../action-types';
import * as moment from 'moment';
export var initialSurveyState = {
    surveyTimeLine: undefined
};
export var surveyReducer = createReducer(initialSurveyState, on(SurveyActions.surveyCompleted, function (state, action) {
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
//# sourceMappingURL=index.js.map
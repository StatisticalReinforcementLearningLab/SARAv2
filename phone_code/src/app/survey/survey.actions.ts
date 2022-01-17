import {createAction, props} from '@ngrx/store';
import { SurveyTimeline } from './model/surveyTimeline';


export const surveyCompleted = createAction(
    "[Survey Page] Survey Completed",
    props<{surveyTimeline: SurveyTimeline}>()
);
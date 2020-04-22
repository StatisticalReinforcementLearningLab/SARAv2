import {createAction, props} from '@ngrx/store';
import { UnlockedIncentives } from './model/unlocked-incentives';


export const surveyCompletedRegisterUnlocked = createAction(
    "[Survey Page] Survey Completed. Register Unlocked.",
    props<{payload: Object}>()
);

export const unlockedScreenShownAlready = createAction(
    "[Main Page] Survey already shown.",
    props<{isUnlockedScreenShown: boolean}>()
);
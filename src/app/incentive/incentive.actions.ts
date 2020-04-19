import {createAction, props} from '@ngrx/store';
import { UnlockedIncentives } from './model/unlocked-incentives';


export const surveyCompletedRegisterUnlocked = createAction(
    "[Survey Page] Survey Completed. Register Unlocked.",
    props<{unlockedIncentives: UnlockedIncentives}>()
);
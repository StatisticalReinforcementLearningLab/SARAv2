import { UnlockedIncentives } from '../model/unlocked-incentives';
import { createReducer, on } from '@ngrx/store';
import { IncentiveActions } from '../action-types';
import * as moment from 'moment';

export interface UnlockecIncentiveState{
    unlockedIncentives : UnlockedIncentives
}


export const initialUnlockedIncentiveState: UnlockecIncentiveState = {
    unlockedIncentives: undefined 
}


export const incentiveReducer = createReducer(

    initialUnlockedIncentiveState,
    on(IncentiveActions.surveyCompletedRegisterUnlocked, (state, action) => {
        var currentDate = moment().format('YYYYMMDD');
        var unlockedIncentiveObject = {};
        unlockedIncentiveObject[currentDate] = action.unlockedIncentives;
        return unlockedIncentiveObject;
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
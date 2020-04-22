import {createFeatureSelector, createSelector} from '@ngrx/store';
import { UnlockecIncentiveState } from './reducers';
import * as moment from 'moment';



export const selectAuthState =
    createFeatureSelector<UnlockecIncentiveState>("incentive");


export const isIncentivesUnlockedForTheDay = createSelector(
    selectAuthState,
    incentive =>  {
        var currentDate = moment().format('YYYYMMDD');
        if(incentive["timeline"] == undefined)
            return undefined;
        else if(currentDate in incentive["timeline"])
            return  incentive["timeline"][currentDate];
        else
            return undefined;
    }
);

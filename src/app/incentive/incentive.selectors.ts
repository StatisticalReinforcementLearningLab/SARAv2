import {createFeatureSelector, createSelector} from '@ngrx/store';
import { UnlockecIncentiveState } from './reducers';
import * as moment from 'moment';



export const selectAuthState =
    createFeatureSelector<UnlockecIncentiveState>("incentive");


export const isIncentivesUnlockedForTheDay = createSelector(
    selectAuthState,
    incentive =>  {
        var currentDate = moment().format('YYYYMMDD');
        if(currentDate in incentive)
            return  incentive[currentDate]["timeline"][0];
        else
            return undefined;
    }

);

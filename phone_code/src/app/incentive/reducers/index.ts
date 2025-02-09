import { UnlockedIncentives } from '../model/unlocked-incentives';
import { createReducer, on } from '@ngrx/store';
import { IncentiveActions } from '../action-types';
import * as moment from 'moment';

export interface UnlockecIncentiveState{
    unlockedIncentives? : UnlockedIncentives
}

export const initialUnlockedIncentiveState: UnlockecIncentiveState = {
    unlockedIncentives: undefined 
}

export function incentiveReducer(state, action) {
    return _incentiveReducer(state, action)
}

export const _incentiveReducer = createReducer(

    initialUnlockedIncentiveState,
    on(IncentiveActions.surveyCompletedRegisterUnlocked, (state, payload) => {
        console.log("Incentive State: " + JSON.stringify(state));
        console.log("Incentive payload: " + JSON.stringify(payload));
        var currentDate = moment().format('YYYYMMDD');
        var unlockedIncentiveObject = {};

        let  new_state = {};
        let  payload_data = payload["payload"]
        new_state['user_id'] = payload_data["user_id"];
        new_state['last_date'] = payload_data["last_date"];
        
        let currentIncentiveTimeline: Object = Object.assign({},state["timeline"]);
        if(currentIncentiveTimeline == undefined) //means initial state with no  timeline
            currentIncentiveTimeline = {};
        
        let key = currentDate;
        let value = {
                     unlocked_points: payload_data["unlocked_points"], 
                     unlocked_money: payload_data["unlocked_money"], 
                     current_point: payload_data["current_point"],
                     date: moment().format('YYYYMMDD'),
                     isUnlockedViewShown: payload_data["isUnlockedViewShown"],
                     isBaselineSurvey: payload_data['isBaselineSurvey'],
                    }
        currentIncentiveTimeline[key] = value;
        new_state["timeline"] = currentIncentiveTimeline;
        console.log("Incentive State: " + JSON.stringify(new_state));
        return new_state;
    }),


    on(IncentiveActions.unlockedScreenShownAlready, (state, payload) => {
        var currentDate = moment().format('YYYYMMDD');

        //let clone = Object.assign({}, obj);
        let currentIncentiveTimeline: Object = Object.assign({},state["timeline"]);
        currentIncentiveTimeline[currentDate] = {...currentIncentiveTimeline[currentDate],
            isUnlockedViewShown: true};
        
        return {
            ...state, 
            timeline: currentIncentiveTimeline
        }; 
    })


    //this.store.dispatch(surveyCompletedRegisterUnlocked({unlockedIncentives}));

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
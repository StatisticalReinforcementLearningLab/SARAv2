import * as tslib_1 from "tslib";
import { createReducer, on } from '@ngrx/store';
import { IncentiveActions } from '../action-types';
import * as moment from 'moment';
export var initialUnlockedIncentiveState = {
    unlockedIncentives: undefined
};
export var incentiveReducer = createReducer(initialUnlockedIncentiveState, on(IncentiveActions.surveyCompletedRegisterUnlocked, function (state, payload) {
    console.log("Incentive State: " + JSON.stringify(state));
    console.log("Incentive payload: " + JSON.stringify(payload));
    var currentDate = moment().format('YYYYMMDD');
    var unlockedIncentiveObject = {};
    var new_state = {};
    var payload_data = payload["payload"];
    new_state['user_id'] = payload_data["user_id"];
    new_state['last_date'] = payload_data["last_date"];
    var currentIncentiveTimeline = Object.assign({}, state["timeline"]);
    if (currentIncentiveTimeline == undefined) //means initial state with no  timeline
        currentIncentiveTimeline = {};
    var key = currentDate;
    var value = {
        unlocked_points: payload_data["unlocked_points"],
        unlocked_money: payload_data["unlocked_money"],
        current_point: payload_data["current_point"],
        date: moment().format('YYYYMMDD'),
        isUnlockedViewShown: payload_data["isUnlockedViewShown"],
    };
    currentIncentiveTimeline[key] = value;
    new_state["timeline"] = currentIncentiveTimeline;
    console.log("Incentive State: " + JSON.stringify(new_state));
    return new_state;
}), on(IncentiveActions.unlockedScreenShownAlready, function (state, payload) {
    var currentDate = moment().format('YYYYMMDD');
    //let clone = Object.assign({}, obj);
    var currentIncentiveTimeline = Object.assign({}, state["timeline"]);
    currentIncentiveTimeline[currentDate] = tslib_1.__assign({}, currentIncentiveTimeline[currentDate], { isUnlockedViewShown: true });
    return tslib_1.__assign({}, state, { timeline: currentIncentiveTimeline });
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
//# sourceMappingURL=index.js.map
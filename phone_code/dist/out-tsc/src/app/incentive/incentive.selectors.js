import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as moment from 'moment';
export var selectAuthState = createFeatureSelector("incentive");
export var isIncentivesUnlockedForTheDay = createSelector(selectAuthState, function (incentive) {
    var currentDate = moment().format('YYYYMMDD');
    if (incentive["timeline"] == undefined)
        return undefined;
    else if (currentDate in incentive["timeline"])
        return incentive["timeline"][currentDate];
    else
        return undefined;
});
//# sourceMappingURL=incentive.selectors.js.map
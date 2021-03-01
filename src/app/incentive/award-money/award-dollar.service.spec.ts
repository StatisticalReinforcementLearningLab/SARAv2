import { TestBed } from '@angular/core/testing';

import { AwardDollarService } from './award-dollar.service';
import * as moment from 'moment';


let awardMoneyService = null;
let oldValueOf_AwardDollar: any;
let oldValueOf_AwardDollarDates: any;
describe('Money service: ', () => {


    //npm run test -- --include src/app/incentive/award-money

    beforeEach(() => {
        awardMoneyService = new AwardDollarService(null);
        oldValueOf_AwardDollarDates = window.localStorage["AwardDollarDates"];
        oldValueOf_AwardDollar = window.localStorage['AwardDollar'];
    });

    afterEach(() => {
        //console.log("--Test: AwardDollarDates: afterAll: pre-restore--" + JSON.stringify(window.localStorage["AwardDollarDates"]));
        window.localStorage["AwardDollarDates"] = oldValueOf_AwardDollarDates;
        window.localStorage['AwardDollar'] = oldValueOf_AwardDollar;
        //console.log("--Test: AwardDollarDates: afterAll: post-restore--" + JSON.stringify(window.localStorage["AwardDollarDates"]));
    });


    it('FirstDay2Dollar: check first day we are giving 2 dollars', () => {
        /*
         * Check if we are giving 2 dollar on first day
         */


        //set AwardDollar
        window.localStorage.setItem("AwardDollar", "" + 0);

        //set streak data; setting; 'AwardDollarDates' should be undefined initially 
        window.localStorage.removeItem('AwardDollarDates');


        var dailySurveyHistory = {}; //history is just today's survey completion.
        dailySurveyHistory[moment().format('YYYYMMDD')] = 1;



        var onDatesSurveyIsTurnedOn = {};
        onDatesSurveyIsTurnedOn[moment().format("DD-MM-YYYY")] = 1; //on date is only today.

        //
        var awardedMoney = awardMoneyService.giveDollarsWithoutDependency(dailySurveyHistory, onDatesSurveyIsTurnedOn);
        expect(awardedMoney).toBe(2);

    });


    it('FirstDay2Dollar: No streak or no-14-day-break. Don\'t give 2 dollars on a non-first day. ', () => {
        /*
         * Check if we are giving 0 dollar on 2nd day, and lastOnDate was 1 day ago.
         */

        // participant completed survey last 2-days 
        var dailySurveyHistory = {}; //no history
        dailySurveyHistory[moment().format('YYYYMMDD')] = 1;
        dailySurveyHistory[moment().subtract(1, "days").format('YYYYMMDD')] = 1;


        //set AwardDollar
        window.localStorage.setItem("AwardDollar", "" + 0);

        //set streak data in like June. So, no recent streak
        var users3DayStreakHistory = {};
        users3DayStreakHistory['dates'] = ["13-06-2020", "14-06-2020"];
        window.localStorage.setItem("AwardDollarDates", JSON.stringify(users3DayStreakHistory));


        //survey was on yesterday. So, no 14-day break
        var onDatesSurveyIsTurnedOn = {};
        onDatesSurveyIsTurnedOn[moment().subtract(1, "days").format("DD-MM-YYYY")] = 1;

        //
        var awardedMoney = awardMoneyService.giveDollarsWithoutDependency(dailySurveyHistory, onDatesSurveyIsTurnedOn);
        expect(awardedMoney).toBe(0);
    });


    it('After14DayBreak: lastOnDate="2020-07-04". Give money after >=14 day break', () => {
        /*
        * Check if we are giving 2 dollar after people came back after a >= 14-day break.
        */
        //set AwardDollar
        window.localStorage.setItem("AwardDollar", "" + 14);


        //set streak data, so that no 3-day streak 
        var users3DayStreakHistory = {};
        users3DayStreakHistory['dates'] = ["13-06-2020", "14-06-2020"];
        window.localStorage.setItem("AwardDollarDates", JSON.stringify(users3DayStreakHistory));

        //set survey history for 2-days, so that it is not first day 
        var dailySurveyHistory = {};
        dailySurveyHistory[moment().format('YYYYMMDD')] = 1;
        dailySurveyHistory[moment().subtract(1, "days").format('YYYYMMDD')] = 1;


        var onDatesSurveyIsTurnedOn = {
            "2020-02-04": 1,
            "2020-02-05": 1,
            "2020-07-04": 1
        };
        var awardedMoney = awardMoneyService.giveDollarsWithoutDependency(dailySurveyHistory, onDatesSurveyIsTurnedOn);
        expect(awardedMoney).toBe(16);
    });


    it('After14DayBreak: lastOnDate is (today-12). Don\'t give money after <=14 day break', () => {
        /*
        * Check if we are giving 2 dollar after people came back after a >= 14-day break.
        */
        //set AwardDollar
        window.localStorage.setItem("AwardDollar", "" + 14);


        //set streak data, so that no 3-day streak 
        var users3DayStreakHistory = {};
        users3DayStreakHistory['dates'] = ["13-06-2020", "14-06-2020"];
        window.localStorage.setItem("AwardDollarDates", JSON.stringify(users3DayStreakHistory));

        //set survey history for 2-days, so that it is not first day 
        var dailySurveyHistory = {};
        dailySurveyHistory[moment().format('YYYYMMDD')] = 1;
        dailySurveyHistory[moment().subtract(1, "days").format('YYYYMMDD')] = 1;


        var onDatesSurveyIsTurnedOn = {
            "2020-02-04": 1,
            "2020-02-05": 1,
            "2020-07-04": 1
        };
        onDatesSurveyIsTurnedOn[moment().subtract(12, "days").format("YYYY-MM-DD")] = 1;
        var awardedMoney = awardMoneyService.giveDollarsWithoutDependency(dailySurveyHistory, onDatesSurveyIsTurnedOn);
        expect(awardedMoney).toBe(14);

    });

    it('After14DayBreak: lastOnDate is (today-14). Don\'t give money after <=14 day break', () => {
        /*
        * Check if we are giving 2 dollar after people came back after a >= 14-day break.
        */
        //set AwardDollar
        window.localStorage.setItem("AwardDollar", "" + 14);


        //set streak data, so that no 3-day streak 
        var users3DayStreakHistory = {};
        users3DayStreakHistory['dates'] = ["13-06-2020", "14-06-2020"];
        window.localStorage.setItem("AwardDollarDates", JSON.stringify(users3DayStreakHistory));

        //set survey history for 2-days, so that it is not first day 
        var dailySurveyHistory = {};
        dailySurveyHistory[moment().format('YYYYMMDD')] = 1;
        dailySurveyHistory[moment().subtract(1, "days").format('YYYYMMDD')] = 1;


        var onDatesSurveyIsTurnedOn = {
            "2020-02-04": 1,
            "2020-02-05": 1,
            "2020-07-04": 1
        };
        onDatesSurveyIsTurnedOn[moment().subtract(14, "days").format("YYYY-MM-DD")] = 1;
        var awardedMoney = awardMoneyService.giveDollarsWithoutDependency(dailySurveyHistory, onDatesSurveyIsTurnedOn);
        expect(awardedMoney).toBe(14);

    });


    it('After14DayBreak: lastOnDate is (today-15). Give money after >14 day break', () => {
        /*
        * Check if we are giving 2 dollar after people came back after a >= 14-day break.
        */
        //set AwardDollar
        window.localStorage.setItem("AwardDollar", "" + 14);


        //set streak data, so that no 3-day streak 
        var users3DayStreakHistory = {};
        users3DayStreakHistory['dates'] = ["13-06-2020", "14-06-2020"];
        window.localStorage.setItem("AwardDollarDates", JSON.stringify(users3DayStreakHistory));

        //set survey history for 2-days, so that it is not first day 
        var dailySurveyHistory = {};
        dailySurveyHistory[moment().format('YYYYMMDD')] = 1;
        dailySurveyHistory[moment().subtract(1, "days").format('YYYYMMDD')] = 1;


        var onDatesSurveyIsTurnedOn = {
            "2020-02-04": 1,
            "2020-02-05": 1,
            "2020-07-04": 1
        };
        onDatesSurveyIsTurnedOn[moment().subtract(15, "days").format("YYYY-MM-DD")] = 1;
        var awardedMoney = awardMoneyService.giveDollarsWithoutDependency(dailySurveyHistory, onDatesSurveyIsTurnedOn);
        expect(awardedMoney).toBe(16);

    });


    it('Streak: No existing streak, so update AwardDollarDates and no money', () => {
        //set survey history for 2-days, so that it is not first day 
        var dailySurveyHistory = {};
        dailySurveyHistory[moment().format('YYYYMMDD')] = 1;
        dailySurveyHistory[moment().subtract(1, "days").format('YYYYMMDD')] = 1;

        //survey was on yesterday. So, no 14-day break
        var onDatesSurveyIsTurnedOn = {};
        onDatesSurveyIsTurnedOn[moment().subtract(1, "days").format("DD-MM-YYYY")] = 1;


        /*
        * Check if we are giving 1 dollar on a 3-day streak.
        */
        //set AwardDollar
        window.localStorage.setItem("AwardDollar", "" + 5);

        //set streak data; setting; 'AwardDollarDates' should be undefined initially 
        window.localStorage.removeItem('AwardDollarDates');


        var awardedMoney = awardMoneyService.giveDollarsWithoutDependency(dailySurveyHistory, onDatesSurveyIsTurnedOn);
        expect(awardedMoney).toBe(5);
        var users3DayStreakHistory = JSON.parse(window.localStorage["AwardDollarDates"]);
        //should start a new streak, only contain todays date
        expect(users3DayStreakHistory['dates'].length).toBe(1);
        expect(users3DayStreakHistory['dates']).toContain(moment().format("DD-MM-YYYY"));

    });


    it('Streak: One record in streak data (i.e., AwardDollarDates) and it is previous date', () => {


        //set survey history for 2-days, so that it is not first day 
        var dailySurveyHistory = {};
        dailySurveyHistory[moment().format('YYYYMMDD')] = 1;
        dailySurveyHistory[moment().subtract(1, "days").format('YYYYMMDD')] = 1;

        //survey was on yesterday. So, no 14-day break
        var onDatesSurveyIsTurnedOn = {};
        onDatesSurveyIsTurnedOn[moment().subtract(1, "days").format("DD-MM-YYYY")] = 1;


        /*
        * Check if we are giving 1 dollar on a 3-day streak.
        */
        //set AwardDollar
        window.localStorage.setItem("AwardDollar", "" + 5);

        //set streak data; setting; 'AwardDollarDates' is undefined 
        var users3DayStreakHistory = {};
        users3DayStreakHistory['dates'] = [moment().subtract(1, "days").format("DD-MM-YYYY")];
        window.localStorage.setItem("AwardDollarDates", JSON.stringify(users3DayStreakHistory));


        var awardedMoney = awardMoneyService.giveDollarsWithoutDependency(dailySurveyHistory, onDatesSurveyIsTurnedOn);
        expect(awardedMoney).toBe(5);
        users3DayStreakHistory = JSON.parse(window.localStorage["AwardDollarDates"]);
        //continue the streak
        expect(users3DayStreakHistory['dates'].length).toBe(2);
        expect(users3DayStreakHistory['dates']).toContain(moment().format("DD-MM-YYYY"));
        expect(users3DayStreakHistory['dates']).toContain(moment().subtract(1, "days").format("DD-MM-YYYY"));
    });


    it('Streak: One record in streak data (i.e., AwardDollarDates) and it is not previous date', () => {


        //set survey history for 2-days, so that it is not first day 
        var dailySurveyHistory = {};
        dailySurveyHistory[moment().format('YYYYMMDD')] = 1;
        dailySurveyHistory[moment().subtract(1, "days").format('YYYYMMDD')] = 1;

        //survey was on yesterday. So, no 14-day break
        var onDatesSurveyIsTurnedOn = {};
        onDatesSurveyIsTurnedOn[moment().subtract(1, "days").format("DD-MM-YYYY")] = 1;


        /*
        * Check if we are giving 1 dollar on a 3-day streak.
        */
        //set AwardDollar
        window.localStorage.setItem("AwardDollar", "" + 5);

        //set streak data; setting; 'AwardDollarDates' is undefined 
        var users3DayStreakHistory = {};
        users3DayStreakHistory['dates'] = [moment().subtract(10, "days").format("DD-MM-YYYY")];
        window.localStorage.setItem("AwardDollarDates", JSON.stringify(users3DayStreakHistory));


        var awardedMoney = awardMoneyService.giveDollarsWithoutDependency(dailySurveyHistory, onDatesSurveyIsTurnedOn);
        expect(awardedMoney).toBe(5);
        users3DayStreakHistory = JSON.parse(window.localStorage["AwardDollarDates"]);
        //should start a new streak, only contain todays date
        expect(users3DayStreakHistory['dates'].length).toBe(1);
        expect(users3DayStreakHistory['dates']).toContain(moment().format("DD-MM-YYYY"));
        expect(users3DayStreakHistory['dates']).not.toContain(moment().subtract(1, "days").format("DD-MM-YYYY"));

    });


    it('Streak: More than one record in streak data (i.e., AwardDollarDates) and it has last two days. So give money', () => {


        //set survey history for 2-days, so that it is not first day 
        var dailySurveyHistory = {};
        dailySurveyHistory[moment().format('YYYYMMDD')] = 1;
        dailySurveyHistory[moment().subtract(1, "days").format('YYYYMMDD')] = 1;

        //survey was on yesterday. So, no 14-day break
        var onDatesSurveyIsTurnedOn = {};
        onDatesSurveyIsTurnedOn[moment().subtract(1, "days").format("DD-MM-YYYY")] = 1;


        /*
        * Check if we are giving 1 dollar on a 3-day streak.
        */
        //set AwardDollar
        window.localStorage.setItem("AwardDollar", "" + 5);

        //set streak data; setting; 'AwardDollarDates' is undefined 
        var users3DayStreakHistory = {};
        users3DayStreakHistory['dates'] = [moment().subtract(1, "days").format("DD-MM-YYYY"), moment().subtract(2, "days").format("DD-MM-YYYY")];
        window.localStorage.setItem("AwardDollarDates", JSON.stringify(users3DayStreakHistory));


        var awardedMoney = awardMoneyService.giveDollarsWithoutDependency(dailySurveyHistory, onDatesSurveyIsTurnedOn);
        expect(awardedMoney).toBe(6);
        users3DayStreakHistory = window.localStorage["AwardDollarDates"];
        //money given so, award should be empty.
        expect(users3DayStreakHistory).toBe(undefined);
        
    });

    it('Streak: More than one record in streak data (i.e., AwardDollarDates) and it does not have last two days. So give no money', () => {


        //set survey history for 2-days, so that it is not first day 
        var dailySurveyHistory = {};
        dailySurveyHistory[moment().format('YYYYMMDD')] = 1;
        dailySurveyHistory[moment().subtract(1, "days").format('YYYYMMDD')] = 1;

        //survey was on yesterday. So, no 14-day break
        var onDatesSurveyIsTurnedOn = {};
        onDatesSurveyIsTurnedOn[moment().subtract(1, "days").format("DD-MM-YYYY")] = 1;


        /*
        * Check if we are giving 1 dollar on a 3-day streak.
        */
        //set AwardDollar
        window.localStorage.setItem("AwardDollar", "" + 5);

        //set streak data; setting; 'AwardDollarDates' is undefined 
        var users3DayStreakHistory = {};
        users3DayStreakHistory['dates'] = [moment().subtract(10, "days").format("DD-MM-YYYY"), moment().subtract(9, "days").format("DD-MM-YYYY")];
        window.localStorage.setItem("AwardDollarDates", JSON.stringify(users3DayStreakHistory));


        var awardedMoney = awardMoneyService.giveDollarsWithoutDependency(dailySurveyHistory, onDatesSurveyIsTurnedOn);
        expect(awardedMoney).toBe(5);
        users3DayStreakHistory = JSON.parse(window.localStorage["AwardDollarDates"]);
        //should start a new streak, only contain todays date
        expect(users3DayStreakHistory['dates'].length).toBe(1);
        expect(users3DayStreakHistory['dates']).toContain(moment().format("DD-MM-YYYY"));
        
    });


    it('Check first day of study', () => {
        //checks the function 'getFirstDaySurveyIsCompleted'
        //This function is used to see if we should give 2 dollars on first day. 

        var dailySurveyHistory: any = {
            "20200216": 1,
            "20200217": 1,
            "20200218": 1,
            "20200219": 1,
            "20200221": 1,
            "20200222": 1
        };
        var firstDateSurveyIsCompleted = awardMoneyService.getFirstDaySurveyIsCompleted(dailySurveyHistory);
        expect(firstDateSurveyIsCompleted).toBe('20200216');


        dailySurveyHistory = { '20200722': 1 };
        firstDateSurveyIsCompleted = awardMoneyService.getFirstDaySurveyIsCompleted(dailySurveyHistory);
        expect(firstDateSurveyIsCompleted).toBe('20200722');


        dailySurveyHistory = {};
        firstDateSurveyIsCompleted = awardMoneyService.getFirstDaySurveyIsCompleted(dailySurveyHistory);
        expect(firstDateSurveyIsCompleted).toBe(moment().format('YYYYMMDD'));


        dailySurveyHistory = {};
        dailySurveyHistory[moment().format('YYYYMMDD')] = 1;
        firstDateSurveyIsCompleted = awardMoneyService.getFirstDaySurveyIsCompleted(dailySurveyHistory);
        expect(firstDateSurveyIsCompleted).toBe(moment().format('YYYYMMDD'));

    });



    it('14DayOnCheck: check if lastOnDate="2020-07-04", then 14-day ago check is returning true', () => {

        var onDatesSurveyIsTurnedOn: any = {
            "2020-02-04": 1,
            "2020-02-05": 1,
            "2020-07-04": 1
        };
        var isSurveyTurnedOnAfter14Days = awardMoneyService.isLastTurnOnDateWas14DayAgo(onDatesSurveyIsTurnedOn);
        expect(isSurveyTurnedOnAfter14Days).toBeTruthy();


    });

    it('14DayOnCheck: check if lastOnDate="2021-02-24", then 14-day ago check is returning true', () => {

        var onDatesSurveyIsTurnedOn: any = {
            "2020-02-04": 1,
            "2020-02-05": 1,
            "2021-02-24": 1
        };
        var isSurveyTurnedOnAfter14Days = awardMoneyService.isLastTurnOnDateWas14DayAgo(onDatesSurveyIsTurnedOn);
        expect(isSurveyTurnedOnAfter14Days).toBeTruthy();


    });


    it('14DayOnCheck: check if lastOnDate is (today-12), then 14-day ago check is returning false', () => {


        //add an On date that is 12 days from now.
        var lastOnDate = moment().subtract(12, "days").format("YYYY-MM-DD");
        var onDatesSurveyIsTurnedOn = {
            "2020-02-04": 1,
            "2020-02-05": 1
        };
        onDatesSurveyIsTurnedOn[lastOnDate] = 1;


        var isSurveyTurnedOnAfter14Days = awardMoneyService.isLastTurnOnDateWas14DayAgo(onDatesSurveyIsTurnedOn);
        expect(isSurveyTurnedOnAfter14Days).toBeFalsy();

    });


    it('14DayOnCheck: check if lastOnDate is (today-15), then 14-day ago check is returning true', () => {

        //add an On date that is 12 days from now.
        var lastOnDate = moment().subtract(15, "days").format("YYYY-MM-DD");
        var onDatesSurveyIsTurnedOn = {
            "2020-02-04": 1,
            "2020-02-05": 1
        };
        onDatesSurveyIsTurnedOn[lastOnDate] = 1;


        var isSurveyTurnedOnAfter14Days = awardMoneyService.isLastTurnOnDateWas14DayAgo(onDatesSurveyIsTurnedOn);
        expect(isSurveyTurnedOnAfter14Days).toBeTruthy();

    });





});

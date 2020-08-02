import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';

@Injectable({
    providedIn: 'root'
})
export class AwardDollarService {
    
    usersCurrentDollars;
    users3DayStreakHistory;
    
    constructor(private userProfileService: UserProfileService) { 

        /*
        *  
        *  load current dollar amount user earned from local storage, 
        *  and if "undefined" (i.e.,user likely didn't earn anything) then assign value to zero.
        * 
        */

        if(window.localStorage['AwardDollar'] == undefined)
            this.usersCurrentDollars = 0;
        else
            this.usersCurrentDollars = parseInt(window.localStorage['AwardDollar']);
    }
    
    
    getCurrentlyEarnedDollars(){
        /*
        * 
        *  This function is called from dynamic-survey to update the current dollar amount.
        * 
        */
        
        
       
        
        
        return this.usersCurrentDollars;
    }
    
    giveDollars(){
        var dailySurveyHistory = this.userProfileService.userProfile.survey_data.daily_survey;
        var onDatesSurveyIsTurnedOn = this.userProfileService.userProfileFixed.onDates;
        return this.giveDollarsWithoutDependency(dailySurveyHistory, onDatesSurveyIsTurnedOn);
    }


    giveDollarsWithoutDependency(pDailySurveyHistory, pOnDatesSurveyIsTurnedOn){
        
        /*
        *  
        * Called after survey is completed.
        * Gives participants money, based on three cretia.
        *  
        * Returns the total amount user has currently earned in total amount.
        * 
        */
        
        
        var dailySurveyHistory = pDailySurveyHistory;
        
        /*
        *
        * Scenario 1:
        * 
        * If user completed survey on the first day of the study then reward 2 dollars.
        *  
        * Since this case can't include a 3-day streak or a pause, so return this current amount
        * 
        */

        //get the first date, by iterating through all dates and find the smallest one.
        var firstDateSurveyIsCompleted = this.getFirstDaySurveyIsCompleted(dailySurveyHistory);
        // If today is the first day then award 2 dollars for survey completion; 
        //  else load the last day, current amout user earned
        var todaysDate = moment().format('YYYYMMDD');
        if(todaysDate == firstDateSurveyIsCompleted){
            this.usersCurrentDollars = 2;
            //save the dollar ammount in local storage
            window.localStorage.setItem("AwardDollar", ""+this.usersCurrentDollars); 
            return this.usersCurrentDollars;
        }else
            this.usersCurrentDollars = parseInt(window.localStorage['AwardDollar']);
        
        


        /*
        *
        * Scenario 2:
        * 
        * If survey is paused, and user comes back after >= 14 days, then give then extra 2 dollars
        * after they complete the survey.
        * 
        */


        //
        // Get the dates when survey  is turned on. This only contains days
        // that the survey on button was physically clicked.
        //  
        var onDatesSurveyIsTurnedOn = pOnDatesSurveyIsTurnedOn;
        

        if(this.isLastTurnOnDateWas14DayAgo(onDatesSurveyIsTurnedOn)){
            this.usersCurrentDollars = this.usersCurrentDollars + 2; 
            //save the dollar ammount in local storage
            window.localStorage.setItem("AwardDollar", ""+this.usersCurrentDollars); 
            return this.usersCurrentDollars;
        }



        /*
        *
        * Scenario 3:
        * 
        * Give money for  a three-day streak of survey completion, that does not include
        * scenario 1 and 2. (Ideally scenario 1,2,3 are mutually exclusive).
        * 
        */

        
        
        this.users3DayStreakHistory = window.localStorage["AwardDollarDates"];


        if((this.users3DayStreakHistory == undefined) || (JSON.parse(this.users3DayStreakHistory) == null)){
            /*
            * Means, no history exist for 3-day, so start a streak with the current date.
            */
            this.users3DayStreakHistory = {};
            this.users3DayStreakHistory['dates'] = [moment().format("DD-MM-YYYY")];      
            window.localStorage.setItem("AwardDollarDates", JSON.stringify(this.users3DayStreakHistory));

        } else { 
            this.users3DayStreakHistory = JSON.parse(window.localStorage["AwardDollarDates"]);
            if(this.users3DayStreakHistory['dates'].length < 2) {
                
                /*
                 * see if previous date exist in the current 'users3DayStreakHistory'
                 * If not then clean 'users3DayStreakHistory' and start a new streak.
                 */
                var previousDate = moment().subtract(1, "days").format("DD-MM-YYYY");
                var dates = this.users3DayStreakHistory["dates"];
                var dateIndex = dates.indexOf(previousDate);
                
                
                if( dateIndex > -1) {
                    //previous date exist, we will pushing the current date and extend the streak.
                    this.users3DayStreakHistory['dates'].push(moment().format("DD-MM-YYYY"));
                } else {
                    // if the date saved is not the previous day of today, remove it 
                    // save current date to users3DayStreakHistory. This means a new streak has started.
                    this.users3DayStreakHistory['dates'] = [moment().format("DD-MM-YYYY")];          
                }
                window.localStorage.setItem("AwardDollarDates", JSON.stringify(this.users3DayStreakHistory));

                // no money here now since the streak length it most 2 here. 

            } else {
                
                /*
                 * see if previous date exist in the current 'users3DayStreakHistory'
                 * If not then clean 'users3DayStreakHistory' and start a new streak.
                 */
                var previousDate = moment().subtract(1, "days").format("DD-MM-YYYY");
                var dates = this.users3DayStreakHistory["dates"];
                var dateIndex = dates.indexOf(previousDate);
                
                if( dateIndex > -1 ) {
                    //means a streak has been completed, so award one dollar, remove all dates
                    this.usersCurrentDollars = this.usersCurrentDollars + 1;
                    //empty users3DayStreakHistory by making it null, and we will start a new streak.
                    window.localStorage.removeItem('AwardDollarDates'); 
                } else {
                    //the previous day is not in the array, means that we must have skipped the previous day,
                    //Save current date to AwardDollarDates to start a new streak.
                    this.users3DayStreakHistory['dates'] = [moment().format("DD-MM-YYYY")];          
                    window.localStorage.setItem("AwardDollarDates", JSON.stringify(this.users3DayStreakHistory));
                }
                
            }
            
        }    
        
        //save the dollar ammount in local storage
        window.localStorage.setItem("AwardDollar", ""+this.usersCurrentDollars);    
        
        return this.usersCurrentDollars;
    }


    

    getFirstDaySurveyIsCompleted(dailySurveyHistory: {}) {
        //get first day of survey completed.

        //start first day from today, which is the lowest. Then find the older date values.
        var firstDateSurveyIsCompleted = moment().format('YYYYMMDD');
        var unixTimestampeForFirstDataSurveyIsCompleted = moment(firstDateSurveyIsCompleted, "YYYYMMDD"); //unix time for 

        var unixTimestampDateForASurveyCompleted;
        for (var dateForASurveyIsCompleted in dailySurveyHistory) {
            unixTimestampDateForASurveyCompleted = moment(dateForASurveyIsCompleted,"YYYYMMDD");

            //an existing survey completed before current first date. Set that date for current date.
            if (unixTimestampDateForASurveyCompleted < unixTimestampeForFirstDataSurveyIsCompleted) {
                firstDateSurveyIsCompleted = dateForASurveyIsCompleted;
                unixTimestampeForFirstDataSurveyIsCompleted = moment(firstDateSurveyIsCompleted,"YYYYMMDD");
            }
            
        }
        return firstDateSurveyIsCompleted;
    }

    isLastTurnOnDateWas14DayAgo(onDatesSurveyIsTurnedOn: {}) {
        //
        // set the last date to today, if 'onDatesSurveyPauseStarted' are not empty, will set it 
        // to be the last date in 'onDatesSurveyPauseStarted'.
        // 
        var maxDateInOnDatesSurveyIsTurnedOn = moment().format('YYYY-MM-DD');;
        
        var unixTimestampForLastOnDate = moment("1970-01-01", "YYYY-MM-DD");

        var unixtTimeOfADaySurveyIsTurnedOn;
        for (var dateOfADaySurveyIsTurnedOn in onDatesSurveyIsTurnedOn) {
            unixtTimeOfADaySurveyIsTurnedOn = moment(dateOfADaySurveyIsTurnedOn,"YYYY-MM-DD");
            if (unixtTimeOfADaySurveyIsTurnedOn > unixTimestampForLastOnDate) {
                maxDateInOnDatesSurveyIsTurnedOn = dateOfADaySurveyIsTurnedOn;
                unixTimestampForLastOnDate = moment(maxDateInOnDatesSurveyIsTurnedOn, "YYYY-MM-DD");
            }
        }
        
        var day14BeforeToday = moment().subtract(14,"days").format("YYYY-MM-DD");
        var unixTimestampDay14BeforeToday = moment(day14BeforeToday,"YYYY-MM-DD");
        var unixTimestampMaxDateInOnDatesSurveyIsTurnedOn = moment(maxDateInOnDatesSurveyIsTurnedOn,"YYYY-MM-DD");

        // if 14-day before today is more than (i.e., after) timestampMaxDateInOnDatesSurveyIsTurnedOn
        // then user has come back after 14 days.
        if(unixTimestampDay14BeforeToday.isAfter(unixTimestampMaxDateInOnDatesSurveyIsTurnedOn))
            return true;
        else
            return false;
    }
}

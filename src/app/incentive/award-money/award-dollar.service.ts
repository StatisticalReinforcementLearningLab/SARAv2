import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';

@Injectable({
  providedIn: 'root'
})
export class AwardDollarService {

  awardDollar;
  awardDollarObj;
  //userProfileService: UserProfileService;;

  constructor(private userProfileService: UserProfileService) { 
    //this.userProfileService = userProfileService2;
  }


  getDollars(){
      //---- load dollar amount from local storage, and if "undefined" then assign value to zero.
      if(window.localStorage['AwardDollar'] == undefined)
        this.awardDollar = 0;
      else
        this.awardDollar = parseInt(window.localStorage['AwardDollar']);

      //
      return this.awardDollar;
  }

  giveDollars(){
    var daily_survey = this.userProfileService.userProfile.survey_data.daily_survey;

    //get the first date
    var first_date = moment().format('YYYYMMDD');
    var first_date_moment_js = moment(first_date,"YYYYMMDD");
    var key_moment_js;
    for (var key in daily_survey) {
        key_moment_js = moment(key,"YYYYMMDD");
        //takes the first day only. But it may not be the first date.
        if (key_moment_js < first_date_moment_js) {
            first_date = key;
            first_date_moment_js = moment(first_date,"YYYYMMDD");
        }
    }

    var todays_date = moment().format('YYYYMMDD');
    if(todays_date == first_date){
      this.awardDollar = 2;
    } else {
      this.awardDollar = parseInt(window.localStorage['AwardDollar']);
    }

    // If survey is pause and start after 14 days, will get $2.
    var onDates = this.userProfileService.userProfileFixed.onDates;
    //set the last date to today, if onDates are not empty, will set it 
    //to be the last date in onDates.
    var last_date = moment().format('YYYY-MM-DD');;

    var last_date_moment_js = moment("1970-01-01", "YYYY-MM-DD")
    var key_moment_js;
    for (var key in onDates) {
        key_moment_js = moment(key,"YYYY-MM-DD");
        //takes the first day only. But it may not be the first date.
        if (key_moment_js > last_date_moment_js) {
          last_date = key;
          last_date_moment_js = moment(last_date, "YYYY-MM-DD");
        }
    }

    console.log("last_date: "+last_date);
    var day_14beforeToday = moment().subtract(14,"days").format("YYYY-MM-DD");
    console.log("day_14beforeToday: "+day_14beforeToday);
    var day_14beforeToday_moment = moment(day_14beforeToday,"YYYY-MM-DD");
    var last_date_moment = moment(last_date,"YYYY-MM-DD");
    if(day_14beforeToday_moment.isAfter(last_date_moment)){
      //console.log("Pause and start: Add");
      this.awardDollar = this.awardDollar + 2; 
    }

    //If participate submits survey continuously for 3 days, will get $1.
    this.awardDollarObj = window.localStorage["AwardDollarDates"];
    console.log("awardDollarObj: "+JSON.stringify(this.awardDollarObj));
    if((this.awardDollarObj == undefined) || (JSON.parse(this.awardDollarObj) == null)){
        this.awardDollarObj = {};
        this.awardDollarObj['dates'] = [moment().format("DD-MM-YYYY")];      
        window.localStorage.setItem("AwardDollarDates", JSON.stringify(this.awardDollarObj));
    } else { 
        this.awardDollarObj = JSON.parse(window.localStorage["AwardDollarDates"]);
        if(this.awardDollarObj['dates'].length < 2) {

          //compute previous date, and see if it exist
          var previousdate = moment().subtract(1, "days").format("DD-MM-YYYY");
          var dates = this.awardDollarObj["dates"];
          var dateIndex = dates.indexOf(previousdate);

          //
          if( dateIndex > -1) {
            //previous date exist, we will pushing the current date to the "survey-completed" dates.
            this.awardDollarObj['dates'].push(moment().format("DD-MM-YYYY"));
          } else {
            // if the date saved is not the previous day of today, remove it 
            // save current date to AwardDollarDates. This means a new streak has started.
            this.awardDollarObj['dates'] = [moment().format("DD-MM-YYYY")];          
          }
          window.localStorage.setItem("AwardDollarDates", JSON.stringify(this.awardDollarObj));
        } else {
          //compute previous date, and check by index if it exists in dates array,
          //the date before previous will exist as we already checked when length is 1.
          var previousdate = moment().subtract(1, "days").format("DD-MM-YYYY");
          var dates = this.awardDollarObj["dates"];
          var dateIndex = dates.indexOf(previousdate);

          if( dateIndex > -1 ) {
            //means a streak has been completed, so award one dollar, remove all dates
            this.awardDollar = this.awardDollar + 1;
            //remove it to make it null and we will start a new streak.
            window.localStorage.removeItem('AwardDollarDates'); 
          } else {
            //the previous day is not in the array, means that we must have skipped the previous day,
            //Save current date to AwardDollarDates to count all over/
            this.awardDollarObj['dates'] = [moment().format("DD-MM-YYYY")];          
            window.localStorage.setItem("AwardDollarDates", JSON.stringify(this.awardDollarObj));
          }

         }

    }    
    console.log("awardDollarObj: "+JSON.stringify(this.awardDollarObj));

    //save the dollar ammount in local storage
    window.localStorage.setItem("AwardDollar", ""+this.awardDollar);    

    return this.awardDollar;
  }
}

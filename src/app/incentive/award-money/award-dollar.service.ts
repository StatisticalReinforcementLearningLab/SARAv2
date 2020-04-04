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
      this.awardDollar = 1;
      //---- save the dollar ammount
      window.localStorage.setItem("AwardDollar", ""+this.awardDollar);    
      return this.awardDollar;
    }



    //---- load dollar amount from local storage, and if "undefined" then assign value to zero.
    if(window.localStorage['AwardDollar'] == undefined)
      this.awardDollar = 0;
    else
      this.awardDollar = parseInt(window.localStorage['AwardDollar']);

    //console.log(window.localStorage["AwardDollarDates"]);
    this.awardDollarObj = window.localStorage["AwardDollarDates"];
    if((this.awardDollarObj == undefined) || (JSON.parse(this.awardDollarObj) == null)){
        this.awardDollarObj = {};
        this.awardDollarObj['dates'] = [moment().format("DD-MM-YYYY")];      
        window.localStorage.setItem("AwardDollarDates", JSON.stringify(this.awardDollarObj));
    } else {
        console.log(window.localStorage["AwardDollarDates"]);
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
          //means a streak has been completed, so awad one dollar, remove all dates.
          this.awardDollar = this.awardDollar + 1;
          //next time, it will be undefined and we will start a new streak next time.
          window.localStorage.removeItem('AwardDollarDates'); 
        }
    }
 
    
    console.log("awardDollarObj: "+JSON.stringify(this.awardDollarObj));

    //---- save the dollar ammount
    window.localStorage.setItem("AwardDollar", ""+this.awardDollar);    

    return this.awardDollar;
  }
}

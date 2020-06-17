import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class LifeInsightsProfileService {
  lifeInsightProfile: any;

  constructor() { }

  //import life insight questions for aya or caregiver
  importLifeInsightProfile(fileLink){
    fetch('../../../assets/data/life_insight_'+fileLink+'.json').then(async res => {
      this.lifeInsightProfile = await res.json();
    });
  }

   //Save 7-day date and value for each question in localStorage to generate lifeInsight chart
   saveLifeInsightInfo(survey){
     /*var lifeInsightProfile = {
      "questions":["Q3d","Q4d","Q5d","Q8d"],
      "qimgs": ["assets/img/stress.png","assets/img/freetime.png","assets/img/dance2.png","assets/img/social.png"],
      "lifeInsightsTitle": ["How much <b>pain</b> are you currently experiencing?", 
          "How much <b>fatigue</b> are you currently experiencing?", 
          "How much <b>nausea</b> are you currently experiencing?", 
          "How <b>motivated</b> are you to take 6MP today?"],
      "qYaxis": ["Pain level","Fatigue level","Nausea level","Degree of motivation"],
      "qSubText": ["0 = low pain, 4 = severe pain", 
              "0 = low fatigue, 4 = severe fatigue",
              "0 = low nausea, 4 = severe nausea",
              "0 = less motivated, 4 = highly motivated"],
      "lifeInsightsHighStress": [
          "Stressed <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>", 
          "Fatigued <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>", 
          "Nausea <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>",
          "Motivated <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>"],
      "lifeInsightsLowStress": [
          "Relaxed <i class='em em-sunglasses'></i><i class='em em-boat'></i>",  
          "Fatigued <i class='em em-sunglasses'></i><i class='em em-boat'></i>", 
          "Nausea <i class='em em-sunglasses'></i><i class='em em-boat'></i>", 
          "Motivated <i class='em em-sunglasses'></i><i class='em em-boat'></i>"]          
    };*/
      var lifeInsightObj = {};
      var questionsArray = this.lifeInsightProfile.questions;  //["Q3d","Q4d","Q5d","Q8d"]
      if(window.localStorage['lifeInsight'] == undefined) {

        for (let question of questionsArray) {          
          lifeInsightObj[question] = {};
          lifeInsightObj[question]['dates'] = [moment().format("DD-MM-YYYY")];
          if(survey.hasOwnProperty(question)) {
            lifeInsightObj[question]['data'] = [parseInt(survey[question])];
          }
          else {
            lifeInsightObj[question]['data'] = [null];
          }
        }         
      } else {
          lifeInsightObj= JSON.parse(window.localStorage["lifeInsight"]);

          for (let question of questionsArray) {   
          var dateslength = lifeInsightObj[question]['dates'].length;
          if(dateslength == 7) {
            lifeInsightObj[question]['dates'].shift();
            lifeInsightObj[question]['data'].shift();
          }      
          var currentdate = moment().format("DD-MM-YYYY");
          var dates = lifeInsightObj[question]["dates"];
          var dateIndex = dates.indexOf(currentdate);
          console.log("Current date exist? "+dateIndex);
          if( dateIndex > -1 ) {
            lifeInsightObj[question]['dates'][dateIndex] =currentdate;
            if(survey.hasOwnProperty(question)) {
              lifeInsightObj[question]['data'][dateIndex]=(parseInt(survey[question]));
            }
            else {
              lifeInsightObj[question][dateIndex]=null;
            }
          } else {
            lifeInsightObj[question]['dates'].push(currentdate);
            if(survey.hasOwnProperty(question)) {
              lifeInsightObj[question]['data'].push(parseInt(survey[question]));
            }
            else {
              lifeInsightObj[question]['data'].push(null);
            }
            } 
        }
    }
    //console.log("lifeInsightObj: "+JSON.stringify(this.lifeInsightObj));
    window.localStorage.setItem("lifeInsight", JSON.stringify(lifeInsightObj));
  }

}

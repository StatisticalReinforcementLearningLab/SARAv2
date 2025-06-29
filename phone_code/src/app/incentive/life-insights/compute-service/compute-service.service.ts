import { Injectable } from '@angular/core';
import { EncrDecrService } from 'src/app/storage/encrdecrservice.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComputeServiceService {

  constructor(private EncrDecr: EncrDecrService) { 

  }

  getDatesForLast7days() {
      var dateArray = [];
      for (let i = 0; i < 6; i++) {
          var previousdate = moment().subtract(6 - i, "days").format("MM/DD");
          dateArray.push(previousdate);
      }
      dateArray.push("Today");
      //console.log("=== date array ===: " + date_array);
      return dateArray;
  }

  getSurveyData() {

      let dateArray =  this.getDatesForLast7days(); 
      var locallyStoredSurvey = {};
      if (window.localStorage['localSurvey'] != undefined)
          locallyStoredSurvey = JSON.parse(window.localStorage.getItem('localSurvey'));

      var dateArray2 = [];
      for (let i = 0; i < 7; i++) {
          var previousdate = moment().subtract(6 - i, "days").format("YYYYMMDD");
          dateArray2.push(previousdate);
      }
      console.log("----vega-viz: dateArray2 ", dateArray2);
      
      var sevenDaySurveyDataFromatted = {};
      
      sevenDaySurveyDataFromatted['pain'] = {"dateArray": dateArray, "data": [null, null, null, null, null, null, null]};
      sevenDaySurveyDataFromatted['fatigue'] = {"dateArray": dateArray, "data": [null, null, null, null, null, null, null]};
      sevenDaySurveyDataFromatted['nausea'] = {"dateArray": dateArray, "data": [null, null, null, null, null, null, null]};
      sevenDaySurveyDataFromatted['positive'] = {"dateArray": dateArray, "data": [null, null, null, null, null, null, null]};
      sevenDaySurveyDataFromatted['lonely'] = {"dateArray": dateArray, "data": [null, null, null, null, null, null, null]};
      sevenDaySurveyDataFromatted['motivation'] = {"dateArray": dateArray, "data": [null, null, null, null, null, null, null]};

      if("alex_survey_aya" in locallyStoredSurvey){
          var surveyData = {};
          //unencrypt dictionaries
          for(let i=0; i<locallyStoredSurvey['alex_survey_aya']['history'].length; i++){
              let surveyHistoryI = locallyStoredSurvey['alex_survey_aya']['history'][i];
              surveyData[surveyHistoryI['date']] = JSON.parse(this.EncrDecr.decrypt(surveyHistoryI['encrypted'], environment.encyptString)); //decrypted
          }
          // console.log("----vega-viz: ", JSON.stringify(surveyData));
          // console.log("----vega-viz: keys ", Object.keys(surveyData));
          // console.log("----vega-viz: ", JSON.stringify(locallyStoredSurvey['alex_survey_aya']));
 
          //
          

          for(let i=0; i< dateArray2.length; i++){
              let dateStr = dateArray2[i];
              // console.log("----vega-viz: ", dateStr + ", " + Object.keys(surveyData));
              if(Object.keys(surveyData).includes(dateStr)){
                  sevenDaySurveyDataFromatted['pain']['data'][i] = parseInt(surveyData[dateStr]["Q3"]);
                  sevenDaySurveyDataFromatted['fatigue']['data'][i] = parseInt(surveyData[dateStr]["Q4"]);
                  sevenDaySurveyDataFromatted['nausea']['data'][i] = parseInt(surveyData[dateStr]["Q5"]);
                  sevenDaySurveyDataFromatted['positive']['data'][i] = parseInt(surveyData[dateStr]["Q6"]);
                  sevenDaySurveyDataFromatted['lonely']['data'][i] = parseInt(surveyData[dateStr]["Q8"]);
                  sevenDaySurveyDataFromatted['motivation']['data'][i] = parseInt(surveyData[dateStr]["Q9"]);
              }
          }
          console.log("----vega-viz: ", JSON.stringify(sevenDaySurveyDataFromatted));
      }
      window.localStorage['sevenDaySurveyDataFromatted'] = JSON.stringify(sevenDaySurveyDataFromatted);
      return sevenDaySurveyDataFromatted;
  }
}

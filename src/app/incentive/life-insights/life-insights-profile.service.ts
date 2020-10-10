import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LifeInsightsProfileService {
    lifeInsightProfile: any;

    constructor() { }

    //import life insight questions for aya or caregiver
    importLifeInsightProfile(fileLink) {
        //fileLink = "aya";
        fetch('../../../assets/data/life_insight_' + fileLink + '.json').then(async res => {
            this.lifeInsightProfile = await res.json();
        });
    }

    //observable version of lifeinsight load
    importLifeInsightProfileUsingObservable(fileLink) {
        fileLink = "harvard_survey";
        var url = '../../../assets/data/life_insight_' + fileLink + '.json';

        return Observable.create(observer => {
            //Make use of Fetch API to get data from URL                              
            fetch(url)
                .then(async res => {
                    /*The response.json() doesn't return json, it returns a "readable stream" which is a promise which needs to be resolved to get the actual data.*/
                    this.lifeInsightProfile = await res.json();
                    return this.lifeInsightProfile;
                })
                .then(body => {
                    observer.next(body);
                    /*Complete the Observable as it won't produce any more event */
                    observer.complete();
                })
                //Handle error
                .catch(err => observer.error(err));
        })
    }

    //Save 7-day date and value for each question in localStorage to generate lifeInsight chart
    saveLifeInsightInfo(survey, typeOfSurvey) {
        /*
        
        var lifeInsightProfile = {
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
       };

       */
        var lifeInsightObj = {};
        console.log(JSON.stringify(this.lifeInsightProfile));

        //all the questions in life insight profile. 
        var questionsArray = this.lifeInsightProfile.questions; //["Q3d","Q4d","Q5d","Q8d"]
         
        if (window.localStorage['lifeInsight'] == undefined) {

            for (let question of questionsArray) {
                lifeInsightObj[question] = {};
                lifeInsightObj[question]['dates'] = [moment().format("DD-MM-YYYY")];

                //checks if the question is available in the survey. If it then add it the data
                if (survey.hasOwnProperty(question)) {

                    //ToDO: problem here is it is converting to an int.
                    // Add question type here.
                    lifeInsightObj[question]['data'] = [survey[question]]; //[parseInt(survey[question])];
                    lifeInsightObj[question]['data_type'] = "data_type";
                }
                else {
                    lifeInsightObj[question]['data'] = [null];
                    lifeInsightObj[question]['data_type'] = "not available";
                }
            }

        } else {

            //
            lifeInsightObj = JSON.parse(window.localStorage["lifeInsight"]);

            //
            for (let question of questionsArray) {

                //
                console.log("lifeInsightObj: " + JSON.stringify(lifeInsightObj) + ", question: " 
                        + question + ", survey: "+  JSON.stringify(survey));
                var dateslength = lifeInsightObj[question]['dates'].length;

                //-- trims before last 7-days
                if (dateslength == 7) {
                    lifeInsightObj[question]['dates'].shift();
                    lifeInsightObj[question]['data'].shift();
                }

                //-- 
                var currentdate = moment().format("DD-MM-YYYY");
                var dates = lifeInsightObj[question]["dates"];
                var dateIndex = dates.indexOf(currentdate);
                //console.log("Current date exist? " + dateIndex);

                //-- 
                if (dateIndex > -1) {
                    lifeInsightObj[question]['dates'][dateIndex] = currentdate;
                    if (survey.hasOwnProperty(question)) {
                        //console.log(lifeInsightObj[question]['data'][dateIndex] + ", " + survey[question]);
                        lifeInsightObj[question]['data'][dateIndex] = survey[question]; //(parseInt(survey[question]));
                    }
                    else {
                        lifeInsightObj[question][dateIndex] = null;
                    }
                } else {
                    lifeInsightObj[question]['dates'].push(currentdate);
                    if (survey.hasOwnProperty(question)) {
                        //lifeInsightObj[question]['data'].push(parseInt(survey[question]));
                        lifeInsightObj[question]['data'].push(survey[question]);
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
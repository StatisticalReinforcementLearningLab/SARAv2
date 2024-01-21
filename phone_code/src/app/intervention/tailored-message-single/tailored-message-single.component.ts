import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { EncrDecrService } from 'src/app/storage/encrdecrservice.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-tailored-message-single',
  templateUrl: './tailored-message-single.component.html',
  styleUrls: ['./tailored-message-single.component.scss'],
})

export class TailoredMessageSingleComponent implements OnInit {

  message: string;
  survey_responses: any;
  selected_bucket_id: any;
  selected_bucket_messages: any;
  all_buckets: string;
  isSurveyDone = false;
  date;
  modalObjectNavigationExtras = {};
  containsNavigationExtras = false;

  constructor(private EncrDecr: EncrDecrService,
    private httpClient: HttpClient,
    private route: ActivatedRoute, 
    private router: Router) { 
      this.message="loading..";
      this.survey_responses = ["loading", "loading"];
      this.all_buckets = "Loading";
    }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.containsNavigationExtras = true;
        this.date = this.router.getCurrentNavigation().extras.state.date;
        this.modalObjectNavigationExtras = this.router.getCurrentNavigation().extras.state.modalObjectNavigationExtras;
      }else{
        this.containsNavigationExtras = false;
      }
    }); 
    this.loadTailoredMessage();
  }

  goHome(){
    if(this.containsNavigationExtras == true){
      let navigationExtras: NavigationExtras = {
        state: {
          modalObjectNavigationExtras: this.modalObjectNavigationExtras
        }
      };
      this.router.navigate(['home'], navigationExtras);
    }else{
      //this.router.navigate(['home']);
      this.router.navigate(['home']);
    }
  }

  loadTailoredMessage() {
    let ayaSurvey = this.getTodaysSurveyData();
    console.log("==survey==" + JSON.stringify(ayaSurvey));

    if(ayaSurvey == undefined){
      this.isSurveyDone = false;


    }else{
      this.isSurveyDone = true;
      
      //
      let requestDataJson = ayaSurvey;
      let flaskServerAPIEndpoint = environment.flaskServerForTailoredInterventions; //'http://ec2-18-205-212-4.compute-1.amazonaws.com:5002';
      this.httpClient.post(flaskServerAPIEndpoint + '/get_message', requestDataJson).subscribe({
          next: data => {
            // console.log(JSON.stringify(data));
            console.log("==response==" + JSON.stringify(data));
            this.message = data["sampled_message"]

            
            //populate the rest of the view
            this.survey_responses = [];
            for (const key in data["survey_processed"]){
              // console.log("" + key + ": " + data["survey_processed"][key]);
              this.survey_responses.push("" + key + ": " + data["survey_processed"][key]);
            }

            this.selected_bucket_id = data['sampled_bucket']['message_bucket_id'];
            this.selected_bucket_messages = data['sampled_bucket']['messages'];

            //
            this.all_buckets = JSON.stringify(data['all_relevant_buckets'], null, 2);
            

          },
          error: error => console.error('There was an error!', error)
      }); 
    }
  }

  getTodaysSurveyData() {
    /*
    If sleep data is available for today, then add is to the request
    Otherwise, return the same object
    */
    var requestDataJson = undefined;
    if (window.localStorage['localSurvey'] != undefined){
        let locallyStoredSurvey = JSON.parse(window.localStorage.getItem('localSurvey'));
        if (locallyStoredSurvey.hasOwnProperty('alex_survey_aya')) {
          if(locallyStoredSurvey['alex_survey_aya']["date"] == moment().format('YYYYMMDD')){
            //decrypt the data and add to the requestDataJson
            var decrypted = this.EncrDecr.decrypt(locallyStoredSurvey['alex_survey_aya']["encrypted"], environment.encyptString);
            let decryptedAYASurvey = JSON.parse(decrypted);
            requestDataJson = decryptedAYASurvey;
          } 
        }
    }
    console.log("requestDataJson: " + JSON.stringify(requestDataJson));
    return requestDataJson;
  }

}

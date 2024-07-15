import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { EncrDecrService } from 'src/app/storage/encrdecrservice.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tailored-messages',
  templateUrl: './tailored-messages.component.html',
  styleUrls: ['./tailored-messages.component.scss'],
})
export class TailoredMessagesComponent implements OnInit {
  message: string;
  survey_responses: any;
  selected_bucket_id: any;
  selected_bucket_messages: any;
  all_buckets: string;
  isSurveyDone = false;
  date;
  modalObjectNavigationExtras = {};
  containsNavigationExtras = false;
  whichImage: string;
  reinforcements;
  interventionImage: string;

  constructor(private EncrDecr: EncrDecrService,
    private httpClient: HttpClient,
    private route: ActivatedRoute, 
    private router: Router) { 
      this.message="loading..";
      this.survey_responses = ["loading", "loading"];
      this.all_buckets = "Loading";
    }

  ngOnInit() {
    this.whichImage = './assets/altruism/altruism_1.png';
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

    var reinforcements = [];
    reinforcements.push({ 'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?" });
    reinforcements.push({ 'img': 'assets/img/1dollar.jpg', 'header': 'You earned a dollar', 'text': 'Thanks for surveys three days in a row! You earned 1 dollar.' });
    this.reinforcements = reinforcements;
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
            this.interventionImage = this.loadInterventionImage(data);

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
  loadInterventionImage(data: Object): string {
    return './assets/intervention_messages/Generic_3.jpg'; //ask kevin to put a transparnt image.
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

  ratingChanged(rating){
    /*
    if(rating==0) {
      //console.log("thumbs down");
      this.reinforcementObj['Like'] = "No";
      this.reinforcement_data['Like'] = "No";
      window.localStorage.setItem("Like", "No");
      this.awsS3Service.upload('reinforcement_data', this.reinforcement_data); 
    } else {
      //console.log("thumbs up");
      this.reinforcementObj['Like'] = "Yes";
      this.reinforcement_data['Like'] = "Yes";
      window.localStorage.setItem("Like", "Yes");
      this.awsS3Service.upload('reinforcement_data', this.reinforcement_data); 
    }
    
    this.userProfileService.addReinforcementData(this.date, this.reinforcementObj);
    
    let navigationExtras: NavigationExtras = {
      state: {
        modalObjectNavigationExtras: this.modalObjectNavigationExtras
      }
    };
    */
    this.router.navigate(['home']);
  }

}


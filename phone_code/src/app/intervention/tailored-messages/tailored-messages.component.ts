import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import * as moment from 'moment';
import { tap } from 'rxjs/operators';
import { EncrDecrService } from 'src/app/storage/encrdecrservice.service';
import { UploadItem } from 'src/app/storage/queue';
import { UploadserviceService } from 'src/app/storage/uploadservice.service';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
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
  interventionProbability;
  intervention_data;

  constructor(private EncrDecr: EncrDecrService,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private http: HttpClient,
    private uploadService: UploadserviceService,
    private userProfileService: UserProfileService,
    private appVersion: AppVersion,
    private router: Router) {
    this.message = "loading..";
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
        this.interventionProbability = this.router.getCurrentNavigation().extras.state.interventionRandomizationProb;
      } else {
        this.containsNavigationExtras = false;
      }
    });
    
    this.intervention_data = {};
    var intervention_data = {};
    intervention_data['userName'] = this.userProfileService.username;
    //intervention_data['appVersion'] = this.versionNumber;
    intervention_data['Prob'] = this.interventionProbability;
    intervention_data['day_count'] = Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length;
    intervention_data['unix_ts'] = new Date().getTime();
    intervention_data['readable_ts'] = moment().format('MMMM Do YYYY, h:mm:ss a Z');
    intervention_data['date'] = moment().format('YYYYMMDD');
    intervention_data['interventionGiven'] = 1;
    // intervention_data['data'] = data;
    this.intervention_data = intervention_data;

    var reinforcements = [];
    reinforcements.push({ 'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?" });
    reinforcements.push({ 'img': 'assets/img/1dollar.jpg', 'header': 'You earned a dollar', 'text': 'Thanks for surveys three days in a row! You earned 1 dollar.' });
    this.reinforcements = reinforcements;

    //this.uploadService.executeCallbackFunction(this.loadTailoredMessage);
    // const accessToken$ = 
    this.uploadService.getAccessToken().subscribe(
      accessToken => this.loadTailoredMessage(accessToken)
    );
  }

  goHome() {
    if (this.containsNavigationExtras == true) {
      let navigationExtras: NavigationExtras = {
        state: {
          modalObjectNavigationExtras: this.modalObjectNavigationExtras
        }
      };
      this.router.navigate(['home'], navigationExtras);
    } else {
      //this.router.navigate(['home']);
      this.router.navigate(['home']);
    }
  }

  loadTailoredMessage2() {
    //I can callback function
    console.log("Call back function called");
  }
  loadTailoredMessage(accessToken) {

    //this is not returning in the call back
    //Note we will not address the 

    let ayaSurvey = this.getTodaysSurveyData();
    console.log("==survey==" + JSON.stringify(ayaSurvey));

    if (ayaSurvey == undefined) {
      this.isSurveyDone = false;
    } else {
      this.isSurveyDone = true;
      if (accessToken == undefined)
        accessToken = localStorage.getItem('ACCESS_TOKEN');//If this expires we can't do anything
      // const token = this.uploadService.getRefreshToken();
      console.log("AccessToken: " + accessToken);
      const token = accessToken;
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      };

      //
      console.log("==ayaSurvey===" + JSON.stringify(ayaSurvey));
      let requestDataJson = ayaSurvey;
      //let flaskServerAPIEndpoint = environment.flaskServerForTailoredInterventions; //'http://ec2-18-205-212-4.compute-1.amazonaws.com:5002';
      let flaskServerAPIEndpoint = "https://adapts.fsm.northwestern.edu/tailored-messages/get-message.json";
      this.httpClient.post(flaskServerAPIEndpoint, requestDataJson, httpOptions).subscribe({
        next: data => {
          // console.log(JSON.stringify(data));
          console.log("==response==" + JSON.stringify(data));
          this.message = data["sampled_message"];
          this.interventionImage = data["sampled_message_image"];//this.loadInterventionImage(data);

          // save the intervention image for future
          var already_shown_intervention_messages = window.localStorage["already_shown_intervention_messages"];
          if (already_shown_intervention_messages == undefined) {
            already_shown_intervention_messages = {
              "last_updated": Date.now(),
              "last_updated_readable_ts": moment().format("MMMM Do YYYY, h:mm:ss a Z"),
              "unlocked_messages": []
            };
          }
          else
            already_shown_intervention_messages = JSON.parse(already_shown_intervention_messages);

          already_shown_intervention_messages["last_updated"] = Date.now();
          already_shown_intervention_messages["last_updated_readable_ts"] = moment().format("MMMM Do YYYY, h:mm:ss a Z");
          already_shown_intervention_messages["unlocked_messages"].push({ "filename": this.interventionImage, "unlock_date": moment().format('MM/DD/YYYY') });
          window.localStorage["already_shown_intervention_messages"] = JSON.stringify(already_shown_intervention_messages);

          /*
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
          */
          this.intervention_data['data'] = data;
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
    if (window.localStorage['localSurvey'] != undefined) {
      let locallyStoredSurvey = JSON.parse(window.localStorage.getItem('localSurvey'));
      if (locallyStoredSurvey.hasOwnProperty('alex_survey_aya')) {
        if (locallyStoredSurvey['alex_survey_aya']["date"] == moment().format('YYYYMMDD')) {
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

  ratingChanged(rating) {

    if (rating == 0) {
      //console.log("thumbs down");
      this.intervention_data['data']['Like'] = "No";
      // window.localStorage.setItem("Like", "No");
      //this.awsS3Service.upload('reinforcement_data', this.reinforcement_data);
    } 
    if (rating == 1) {
      //console.log("thumbs up");
      this.intervention_data['data']['Like'] = "Yes";
      //window.localStorage.setItem("Like", "Yes");
      //this.awsS3Service.upload('reinforcement_data', this.reinforcement_data);
    }
    if (rating == 2) {
      //console.log("thumbs up");
      this.intervention_data['data']['Like'] = "Favorited";
      //window.localStorage.setItem("Like", "Yes");
      //this.awsS3Service.upload('reinforcement_data', this.reinforcement_data);
    }

    // this.userProfileService.addReinforcementData(this.date, this.reinforcementObj);

    // let navigationExtras: NavigationExtras = {
    //   state: {
    //     modalObjectNavigationExtras: this.modalObjectNavigationExtras
    //   }
    // };


    //reinforcement data upload
    var item = new UploadItem();
    item.isEncrypted = true;
    item.data = this.intervention_data;
    item.typeOfData = 'intervention_data';
    item.uploadURLLocation = '';
    this.uploadService.addToUploadQueue(item);

    // this.router.navigate(['home']);
    let navigationExtras: NavigationExtras = {
      state: {
        modalObjectNavigationExtras: this.modalObjectNavigationExtras
      }
    };
    this.router.navigate(['home'], navigationExtras);
  }

  // refreshToken() {
  //   console.log("tailored_messages.component.ts - refreshToken method - begin");
  //   const token = this.getRefreshToken();
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Authorization': `Bearer ${token}`
  //     })
  //   };

  //   // this.httpClient.post(flaskServerAPIEndpoint + '/get_message', requestDataJson).subscribe({
  //   //       next: data => {
  //   //         // console.log(JSON.stringify(data));
  //   //         console.log("==response==" + JSON.stringify(data));
  //   //         this.message = data["sampled_message"]
  //   //         this.interventionImage = this.loadInterventionImage(data);

  //   //         //populate the rest of the view
  //   //         this.survey_responses = [];
  //   //         for (const key in data["survey_processed"]){
  //   //           // console.log("" + key + ": " + data["survey_processed"][key]);
  //   //           this.survey_responses.push("" + key + ": " + data["survey_processed"][key]);
  //   //         }

  //   //         this.selected_bucket_id = data['sampled_bucket']['message_bucket_id'];
  //   //         this.selected_bucket_messages = data['sampled_bucket']['messages'];

  //   //         //
  //   //         this.all_buckets = JSON.stringify(data['all_relevant_buckets'], null, 2);


  //   //       },
  //   //       error: error => console.error('There was an error!', error)
  //   //   }); 
  //   // }
  //   let me = this;
  //   this.http.post<any>(`${environment.userServer}/token/refresh`, { 
  //     'refreshToken': this.getRefreshToken() 
  //   }, httpOptions).subscribe(data => {
  //       console.log(JSON.stringify(data));
  //       me.storeAccessToken(data.access_token, data.access_expires);
  //   });  

  //   // return this.http.post<any>(`${environment.userServer}/token/refresh`, {
  //   //   'refreshToken': this.getRefreshToken() 
  //   // },httpOptions ).pipe(tap((
  //   //     resData: {
  //   //       "access_token": string, 
  //   //       "access_expires": string}) => {
  //   //     console.log("====refreshed token====");
  //   //     console.log(resData);
  //   //     this.storeAccessToken(resData.access_token, resData.access_expires);
  //   // }));


  // }

  // private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  // private getRefreshToken() {
  //   console.log("tailored_messages.component.ts - getRefreshToken method - begin " + localStorage.getItem(this.REFRESH_TOKEN));
  //   return localStorage.getItem(this.REFRESH_TOKEN);
  // }

  // private readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
  // private storeAccessToken(token: string, expires: string) {
  //   console.log("tailored_messages.component.ts - storeAccessToken method - begin");
  //   localStorage.setItem(this.ACCESS_TOKEN, token);
  //   const expirationDate = new Date(new Date().getTime() + +expires * 1000);
  //   localStorage.ACCESS_TOKEN_EXPIRATION = expirationDate;
  //   this.loadTailoredMessage();
  // }
  // getAccessToken() {
  //   console.log("auth.service.ts - getAccessToken method - begin");
  //   return localStorage.getItem(this.ACCESS_TOKEN);
  // }


}


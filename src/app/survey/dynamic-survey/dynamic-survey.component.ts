//
//--- The goal of this file is to dynamically generate a survey from a JSON file. 
//--- Example JSON files are located in assets/survey folder. 
//
//--- At a high level, this file does the following:
//      (i) reads a JSON file in the "ngAfterViewInit" 
//      (ii) calls the "generateSurvey" function to create html codes for the survey
//      (iii) creates a component dynamically and attached it to the "vc" component.

import { Component, OnInit, ViewChild, ViewContainerRef, NgModule, Compiler, Injector, NgModuleRef, Input, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AwsS3Service } from '../../storage/aws-s3.service';
import { EncrDecrService } from '../../storage/encrdecrservice.service';

import { Platform, AlertController } from '@ionic/angular';
import { Router, NavigationExtras} from '@angular/router';
import * as moment from 'moment';
import { AppVersion } from '@ionic-native/app-version/ngx';

//import * as lifeInsightProfile from "../../../assets/data/life_insight.json";
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { AwardDollarService } from 'src/app/incentive/award-money/award-dollar.service';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { surveyCompleted } from '../survey.actions';
import { SurveyTimeline } from '../model/surveyTimeline';
import { UnlockedIncentives } from '../../incentive/model/unlocked-incentives';
import { surveyCompletedRegisterUnlocked } from 'src/app/incentive/incentive.actions';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-dynamic-survey',
  templateUrl: './dynamic-survey.component.html',
  styleUrls: ['./dynamic-survey.component.scss']
})

export class DynamicSurveyComponent implements OnInit {
  //inputs the json file used to generate a survey
  @Input() fileLink: string;

  title = "mash is here";
  public isLoading = true;
  public loadingComplete = false;
  
  survey_string = "";
  survey = {};
  survey_data: any;
  versionNumber;

  display_flag = {};
  dependentQuestionsArray;  //list of questions listed in dependency entry with elements beinng questions deoends on
  dependencyExpression;  //dependency condition generated when survey depends on the answer of the other survey
  showArrayForEachDependency;  // Handle the case when entry "show" has space, for example, "With someone"
                               // save show entry for each dependent case
  choices;  //extra choices

  affect;  //moodgrid
  rand_index;  //used for random-type survey
  randomq;    //used for random-type survey
  autocomplete_options; //used for autocomplete-type survey



  //"vc" is the div tag where the dynamic survey will be added.
  @ViewChild('vc', { read: ViewContainerRef, static: false}) vc: ViewContainerRef;

  constructor(private _compiler: Compiler,
    private _injector: Injector,
    private _m: NgModuleRef<any>, 
    private awsS3Service: AwsS3Service,
    //private storeToFirebaseService: StoreToFirebaseService,
    private EncrDecr: EncrDecrService,
    private router: Router,
    private changeDetector : ChangeDetectorRef,
    private appVersion: AppVersion,
    private alertCtrl: AlertController,
    public plt: Platform,
    private userProfileService: UserProfileService,
    private store: Store<AppState>,
    private awardDollarService:AwardDollarService) {
      this.appVersion.getVersionNumber().then(value => {
        this.versionNumber = value;
        console.log("VersionNumber: "+this.versionNumber);
      }).catch(err => {
        console.log(err);
      });
  }

  ngOnInit() { }

  ngAfterViewInit() {
      console.log('Reading local json files: ' + this.fileLink);

      //fetch JSON file and once the file is fetched called "generateSurvey" to create the survey.
      fetch('../../../assets/data/'+this.fileLink+'.json').then(async res => {
        this.survey_data = await res.json();
        this.generateSurvey();
      });
  }

  generateSurvey() {  

    //go through the questions
    this.survey = {};
    for (var i = 0; i < this.survey_data.length; i++) {
      var obj = this.survey_data[i];
      //console.log("Done " + obj.text);
      this.survey[obj.name] = "";
      this.survey_string = this.process_survey(obj, this.survey_string, obj.name);
    }
    this.survey_string = this.survey_string + '<div class="ion-padding"><button class="buttonold button-positive" (click)="submitSurvey()">Submit</button></div>';

    //---
    //--- Generate a survey component dynamically from the "survey_string."
    //--- The "survey_string" contains all the HTML for the template for dynamic component
    //--- 
    const surveyComponent = Component({ template: this.survey_string })(class implements OnInit{
      
      survey2 = {};
      isQuestionIncomplete = {};
      fileLink;
      versionNumber;
      lifeInsightObj = {};
      //storeToFirebaseService: StoreToFirebaseService;
      
      EncrDecr: EncrDecrService;
      awsS3Service: AwsS3Service;
      totalPoints = 0;
      plt: Platform;
      router: Router;
      userProfileService: UserProfileService;
      awardDollarService: AwardDollarService;
      survey_data = [];
      alertCtrl;
      store: Store<AppState>;

      display_flag = {};
      dependentQuestionsArray;  //list of questions listed in dependency entry with elements beinng questions deoends on
      dependencyExpression;  //dependency condition generated when survey depends on the answer of the other survey
      showArrayForEachDependency;  // Handle the case when entry "show" has space, for example, "With someone"
                                  // save show entry for each dependent case
        
      affect: any; //moodgrid

      constructor() {
      }

      ngOnInit() {
        this.survey2['starttimeUTC'] = new Date().getTime();
        this.survey2['reponse_ts']={};
        for (var i = 0; i < this.survey_data.length; i++) {
          var obj = this.survey_data[i];
          this.isQuestionIncomplete[obj.name] = {"tag": obj.tag};
        }
      }

      ngAfterViewInit() {
        setTimeout(e => this.drawMoodGrid(this), 200);
      }

      drawMoodGrid(self2){
        
        var c = <HTMLCanvasElement>document.getElementById("myCanvas");
        if (c == null){
          console.log("is null");
          return;
        }
        
        c.style.width = '100%';
        c.width = c.offsetWidth;
        c.height = c.width;

        var ctx = c.getContext("2d");
        var imageObj = new Image();
        imageObj.src = 'assets/pics/affect_grid.png';
        imageObj.onload = function () {
          ctx.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height, // source rectangle
            0, 0, c.width, c.height); // destination rectangle
        }

        //corner points
        var top_x = (42.0/354.0)*c.width;
        var top_y = (32.0/354.0)*c.height;
        var bottom_x = (320.0/354.0)*c.width;
        var bottom_y = (320.0/354.0)*c.height;

        c.addEventListener("click", function (e) {
          //drawing = true;
          var rect = c.getBoundingClientRect();
          var lastPos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          };
          //console.log("x:" + lastPos.x + ", y:" + lastPos.y + ":::: " + c.width + "," + c.height);

          var x = -1;
          var y = -1;
          if((lastPos.x >= top_x) && (lastPos.y >= top_y) && (lastPos.x <= bottom_x) && (lastPos.y <= bottom_y)){
              x = 10 * (lastPos.x - top_x) / (bottom_x - top_x) - 5;
              y = 5 - 10 * (lastPos.y - top_y) / (bottom_y - top_y) - 5;
              console.log("x:" + x + ", y:" + y);
              self2.survey2['QMood'] = "" + x + ":" + y;

              //
              self2.inputchanged("QMood");
          }else{
              return;
          }
          
          var rect = c.getBoundingClientRect();
          ctx.beginPath();
          ctx.clearRect(0, 0, rect.right-rect.left, rect.bottom-rect.top);
          ctx.closePath();
          
          //
          ctx.drawImage(imageObj, 0, 0, imageObj.width,    imageObj.height, // source rectangle
                     0, 0, c.width, c.height); // destination rectangle
          
          //ctx.drawImage(imageObj, 0, 0);
          ctx.beginPath();
          ctx.arc(lastPos.x,lastPos.y,10,0,2*Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'red';
          ctx.stroke();
        }, false);
        
      }
      
      //This function tracks if users clicked on a survey question
      modelChanged(newObj) {
        console.log('holla' + newObj);
      }

      inputchangedtimepicker(question, $event){
        console.log(question);
        //pickedTime = moment(pickedTime).format('h:mm a')
        console.log(moment($event.detail.value).format('h:mm a'));
        this.survey2[question]=moment($event.detail.value).format('h:mm a');
        console.log(this.survey2);
      }

      //This function tracks if users clicked on a survey question and reacts.       
      inputchanged(question) {
        //console.log('holla: ' + questions);

        this.survey2['reponse_ts'][question] = {};
        this.survey2['reponse_ts'][question].ts = Date.now();
        this.survey2['reponse_ts'][question].readable_ts = moment().format("MMMM Do YYYY, h:mm:ss a Z");

        this.processExtraCondition(question);
        delete this.isQuestionIncomplete[question]; //remove the key from isQuestionIncomplete
        //console.log(JSON.stringify(this.survey2));
      }

      inputChangedForCheckBox(question, item, $event){
        console.log('holla: ' + question+" "+JSON.stringify($event.detail));
        this.survey2[item] = $event.detail.checked;
        console.log(JSON.stringify(this.survey2));
  
        this.processExtraCondition(question);
      }
      
      inputChangedWithEvent(question, $event) {
        //console.log("Qs:" + questions + ", ts:" + Date.now() + ", readable_time:" + moment().format("MMMM Do YYYY, h:mm:ss a"));
        console.log('holla: ' + question+" "+JSON.stringify($event.detail));
        this.survey2[question] = $event.detail.value;
        console.log(JSON.stringify(this.survey2));
  
        this.processExtraCondition(question);
  
       }    
  
       processExtraCondition(question){
  
        console.log("processDisplayCondition for "+question);
        console.log(JSON.stringify(this.dependentQuestionsArray));
        if(this.dependentQuestionsArray[question] != null) {
            for (var j = 0; j < this.dependentQuestionsArray[question].length; j++){
                var dependentQuestion= this.dependentQuestionsArray[question][j];
                if(this.dependencyExpression!=undefined && this.dependencyExpression[dependentQuestion+question]!=undefined) {
                    console.log(JSON.stringify(this.dependencyExpression));
                    this.getDisplayFlagForDependentSurvey(this.dependencyExpression[dependentQuestion+question],dependentQuestion+question);
                }
    
                //handle the case when there is empty space in answer when clicked, for example, "With someone"
                if(this.showArrayForEachDependency!=undefined && this.showArrayForEachDependency[dependentQuestion+question]!=undefined) {
                    console.log(JSON.stringify(this.showArrayForEachDependency));
                    this.getDisplayFlagForDependentSurveyWithSpaceInShowEntry(this.showArrayForEachDependency[dependentQuestion+question],dependentQuestion+question,question);
                }
            }
        }
        //this.update.next("");
      }      

      getDisplayFlagForDependentSurvey(conditionExpression, label){
        console.log(conditionExpression+" "+label);
        this.display_flag[label+ "Show"] = eval(conditionExpression);
        console.log("getDisplayFlagForDependentSurvey "+label + "Show "+this.display_flag[label + "Show"]);
      }

      getDisplayFlagForDependentSurveyWithSpaceInShowEntry(conditionExpression,label,questions){
            //console.log("True " +  ($scope.survey.Q3d==undefined || $scope.survey.Q3d=='0' || $scope.survey.Q3d=='0.5'));
            var sel = this.survey2[questions]; 
            var dep = conditionExpression ;
            //console.log("compareSelectionWithDependency "+questions+" "+sel+" "+s);
            if(sel!=undefined && conditionExpression!= undefined){
              sel = sel.replace(/\s+/g, "");
              dep = conditionExpression.replace(/\s+/g, "");
            }
            this.display_flag[label + "Show"] = false;
            if(sel === dep)
            { 
              this.display_flag[label + "Show"]=true;
            }

            console.log("getDisplayFlagForDependentSurveyWithSpaceInShowEntry "+name+" for "+questions+" "+this.display_flag[label + "Show"]);

      }        

      submitSurvey(){
        if(this.isEmpty(this.isQuestionIncomplete))//means all questions have been removed
          this.storeData();
        else{
          var incompleteQuestions = "";
          for(var prop in this.isQuestionIncomplete) {
            incompleteQuestions = incompleteQuestions + " " + this.isQuestionIncomplete[prop]["tag"] + ",";
          }
          incompleteQuestions = incompleteQuestions.substring(0, incompleteQuestions.length - 1);
          this. presentAlert("You haven't completed questions:" + incompleteQuestions);
        }
      }


      async presentAlert(alertMessage) {
    
        const alert = await this.alertCtrl.create({
          //<div style="font-size: 20px;line-height: 25px;padding-bottom:10px;text-align:center">Thank you for completing the survey. You have unlocked a meme.</div>
          //header: '<div style="line-height: 25px;padding-bottom:10px;text-align:center">Daily survey unavilable</div>',
          header: 'Oops! You missed a question',
          //subHeader: "Survey is not avaibable!",
          message: alertMessage,
          //defined in theme/variables.scss
          buttons: [{text: 'OK', cssClass: 'secondary'}]
        });
        
        /*
        let alert = this.alertCtrl.create({
          title: 'Low battery',
          subTitle: '10% of battery remaining',
          buttons: ['Dismiss']
        });
        */
    
        await alert.present();
      }

      isEmpty(obj) {      
        return JSON.stringify(obj) === JSON.stringify({});
      }

      storeData(){
        //console.log("Inside storeData");
        //console.log(JSON.stringify(this.survey2));
         
        var endTime = new Date().getTime();
        var readable_time = moment().format('MMMM Do YYYY, h:mm:ss a Z');
        this.survey2['endtimeUTC'] = endTime;
        this.survey2['userName'] = this.userProfileService.username;
        this.survey2['ts'] = readable_time;

        this.survey2['devicInfo'] = this.plt.platforms();

        //Store app version number
        this.survey2['appVersion'] = this.versionNumber;
        this.userProfileService.versionNumber = this.versionNumber;

        var encrypted = this.EncrDecr.encrypt(JSON.stringify(this.survey2), environment.encyptString);
        //var encrypted = this.EncrDecr.encrypt("holla", "Z&wz=BGw;%q49/<)");
        var decrypted = this.EncrDecr.decrypt(encrypted, environment.encyptString);

        var survey3 = {};
        survey3['encrypted'] = encrypted;

        //console.log('Encrypted :' + encrypted);
        //console.log('Decrypted :' + decrypted);
        this.survey2['encrypted'] = encrypted;
        
        //compute and store "TotalPoints" to localStorage
        if(window.localStorage['TotalPoints'] == undefined)
          this.totalPoints = 0;
        else
          this.totalPoints = parseInt(window.localStorage['TotalPoints']);
        this.totalPoints = this.totalPoints + 60;
        window.localStorage.setItem("TotalPoints", ""+this.totalPoints);

        //get "awardDollars"
        var pastDollars = this.awardDollarService.getCurrentlyEarnedDollars();
        var dollars = this.awardDollarService.giveDollars();
        //console.log("Dollars: " + dollars);

        this.userProfileService.surveyCompleted(); 


         //Save 7-day date and value for each question in localStorage to generate lifeInsight chart
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
        
        var questionsArray = lifeInsightProfile.questions;  //["Q3d","Q4d","Q5d","Q8d"]
        if(window.localStorage['lifeInsight'] == undefined) {

          for (let question of questionsArray) {          
            this.lifeInsightObj[question] = {};
            this.lifeInsightObj[question]['dates'] = [moment().format("DD-MM-YYYY")];
            if(this.survey2.hasOwnProperty(question)) {
              this.lifeInsightObj[question]['data'] = [parseInt(this.survey2[question])];
            }
            else {
              this.lifeInsightObj[question]['data'] = [null];
            }
          }         
        } else {
           this.lifeInsightObj= JSON.parse(window.localStorage["lifeInsight"]);

           for (let question of questionsArray) {   
            var dateslength = this.lifeInsightObj[question]['dates'].length;
            if(dateslength == 7) {
              this.lifeInsightObj[question]['dates'].shift();
              this.lifeInsightObj[question]['data'].shift();
            }      
            var currentdate = moment().format("DD-MM-YYYY");
            var dates = this.lifeInsightObj[question]["dates"];
            var dateIndex = dates.indexOf(currentdate);
            console.log("Current date exist? "+dateIndex);
            if( dateIndex > -1 ) {
              this.lifeInsightObj[question]['dates'][dateIndex] =currentdate;
              if(this.survey2.hasOwnProperty(question)) {
                this.lifeInsightObj[question]['data'][dateIndex]=(parseInt(this.survey2[question]));
              }
              else {
                this.lifeInsightObj[question][dateIndex]=null;
              }
            } else {
              this.lifeInsightObj[question]['dates'].push(currentdate);
              if(this.survey2.hasOwnProperty(question)) {
                this.lifeInsightObj[question]['data'].push(parseInt(this.survey2[question]));
              }
              else {
                this.lifeInsightObj[question]['data'].push(null);
              }
             } 
          }
      }
      //console.log("lifeInsightObj: "+JSON.stringify(this.lifeInsightObj));
      window.localStorage.setItem("lifeInsight", JSON.stringify(this.lifeInsightObj));

      //save to Amazon AWS S3
      this.awsS3Service.upload(this.fileLink, survey3);
      //console.log("End of storeData");

      //navigate to award-memes/award-altruism with equal probability after submit survey
      var currentProb = Math.random();
      window.localStorage.setItem("Prob", ""+currentProb);
      var currentDate = moment().format('YYYYMMDD');
      let navigationExtras: NavigationExtras = {
        state: {
          date: currentDate,
          prob: currentProb          
        }
      };

      //prepare reinforcement data to upload to AWS S3
      var reinforcement_data = {};
      reinforcement_data['userName'] = this.userProfileService.username;
      reinforcement_data['appVersion'] = this.versionNumber;
      reinforcement_data['Prob'] = currentProb;
      reinforcement_data['day_count'] = Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length;
      reinforcement_data['isRandomized'] = 1;//what is this one??
      reinforcement_data['unix_ts'] = endTime;
      reinforcement_data['readable_ts'] = readable_time;
      reinforcement_data['date'] =  currentDate;
      //save to Amazon AWS S3


      //add for the  modal object
      var modalObjectNavigationExtras = {};
      modalObjectNavigationExtras["LastSurveyCompletionDate"] = moment().format('YYYYMMDD');
      modalObjectNavigationExtras["CurrentPoints"] = this.userProfileService.points;
      modalObjectNavigationExtras["PreviousPoints"] = this.userProfileService.points-60;
      modalObjectNavigationExtras["AwardedDollar"] = dollars-pastDollars;
      modalObjectNavigationExtras["IsModalShownYet"] = false;
      
      
      //currentProb = 0.8;
      if(this.fileLink.includes('caregiver') || currentProb <= 0.4 ) {
        var reinforcementObj = {};
        reinforcementObj['ds'] = 1;
        reinforcementObj['reward'] = 0;
        reinforcementObj['prob'] = currentProb;
        reinforcement_data['reward'] = "No push"; 
        reinforcement_data['reward_img_link'] = ""; 
        reinforcement_data['Like'] = ""; 
        this.awsS3Service.upload('reinforcement_data', reinforcement_data);  
        this.userProfileService.addReinforcementData(currentDate, reinforcementObj);    
        navigationExtras['state']['modalObjectNavigationExtras'] = modalObjectNavigationExtras;
        this.router.navigate(['home'], navigationExtras);        
      } else if((currentProb > 0.4)  &&  (currentProb <=0.7)){
        reinforcement_data['reward'] = "Meme"; 
        navigationExtras['state']['reinforcement_data'] = reinforcement_data;
        navigationExtras['state']['modalObjectNavigationExtras'] = modalObjectNavigationExtras;
        this.router.navigate(['incentive/award-memes'], navigationExtras);
      } else if(currentProb > 0.7){
        reinforcement_data['reward'] = "Altruistic message"; 
        navigationExtras['state']['reinforcement_data'] = reinforcement_data;
        navigationExtras['state']['modalObjectNavigationExtras'] = modalObjectNavigationExtras;
        this.router.navigate(['incentive/award-altruism'],  navigationExtras);
      }
      
      
      let surveyTimeline: SurveyTimeline = {user_id: this.userProfileService.username, 
            timeline: [{dateOfCompletion: currentDate, timestamp: endTime, readableTimestamp: readable_time}]};
      this.store.dispatch(surveyCompleted({surveyTimeline}));

      

      var payload: Object = {user_id: this.userProfileService.username, 
                     last_date: moment().format('YYYYMMDD'),
                     unlocked_points: 60, 
                     unlocked_money: dollars-pastDollars, 
                     current_point: this.userProfileService.points, 
                     date: moment().format('YYYYMMDD'),
                     isUnlockedViewShown: false};
      this.store.dispatch(surveyCompletedRegisterUnlocked({payload}));
     }

    });

    const tmpModule = NgModule({ declarations: [surveyComponent], imports: [FormsModule, BrowserModule], schemas: [CUSTOM_ELEMENTS_SCHEMA]})(class {
    });

    this._compiler.compileModuleAndAllComponentsAsync(tmpModule)
      .then((factories) => {
        this.isLoading = false;
        this.loadingComplete = true;
        //setTimeout(function(){ console.log("holla") }, 3000);
        this.changeDetector.detectChanges();
        const f = factories.componentFactories[0];
        const cmpRef = this.vc.createComponent(f);
        cmpRef.instance.awsS3Service = this.awsS3Service;
        cmpRef.instance.survey2 = this.survey;
        cmpRef.instance.fileLink = this.fileLink;  
        cmpRef.instance.versionNumber= this.versionNumber;      
        cmpRef.instance.survey_data = this.survey_data;    
        cmpRef.instance.dependencyExpression = this.dependencyExpression;
        cmpRef.instance.showArrayForEachDependency = this.showArrayForEachDependency;
        cmpRef.instance.dependentQuestionsArray = this.dependentQuestionsArray;
        cmpRef.instance.display_flag = this.display_flag;
        cmpRef.instance.affect = this.affect;
        //cmpRef.instance.storeToFirebaseService = this.storeToFirebaseService;
        cmpRef.instance.alertCtrl = this.alertCtrl;   
        cmpRef.instance.userProfileService = this.userProfileService;
        cmpRef.instance.awardDollarService = this.awardDollarService;
        cmpRef.instance.EncrDecr = this.EncrDecr;
        cmpRef.instance.plt = this.plt;
        cmpRef.instance.router = this.router;// Router,
        cmpRef.instance.store = this.store;
        cmpRef.instance.name = 'dynamic';
        //console.log('called');
    });
  }

  getTitle() {
    return this.title;
  }

  // process survey if obj type is radiobutton
  process_survey_radiobutton(obj, survey_string, i){
      //------------------------------------------------------ 
      //radio button, vertical     
      //------------------------------------------------------   
      
      if (obj.extra.orientation == "vertical") {
          survey_string = survey_string + '<div class="radiovertical"><ul>';

          for (var j = 0; j < obj.extra.choices.length; j++) {

              survey_string = [survey_string,
                  '<li><input type="radio" id="option' + i + "I" + j + '" name="' + i + '" [(ngModel)]="survey2.' + i + '" value="' + obj.extra.choices[j] + '" (change)="inputchanged(\'' + i + '\')">',
                  '<label for="option' + i + "I" + j + '">' + obj.extra.choices[j] + '</label>',
                  '<div class="check"></div></li>'
              ].join(" ");

          }

          //if(this.choices == undefined) this.choices = {};
          //this.choices[obj.name]= obj.extra.choices;
          survey_string = survey_string + '</ul></div>';
      }

      //------------------------------------------------------ 
      //radio button, horizontal     
      //------------------------------------------------------
      //console.log("Here: " + JSON.stringify(obj.extra.orientation) + ", " + obj.extra.choices.length);
      if (obj.extra.orientation == "horizontal") {

          survey_string = survey_string + '<div class="radiohorizontal"><ul>';

          //starting text
          survey_string = survey_string + '<li><p>' + obj.extra.choices[0] + '</p></li>';

          //middle text
          for (var j = 0; j < obj.extra.levels; j++) {
              survey_string = [survey_string,
                  '<li><input type="radio" id="option' + i + "I" + j + '" name="' + i + '" [(ngModel)]="survey2.' + i + '" value="' + j + '" (change)="inputchanged(\'' + i + '\')">',
                  '<label for="option' + i + "I" + j + '"></label>',
                  '<div class="check"></div></li>'
              ].join(" ");
              //console.log("" + j + ", " + obj.extra.choices.length);
          }

          //ending text
          survey_string = survey_string + '<li><p>' + obj.extra.choices[obj.extra.choices.length-1] + '</p></li>';
          survey_string = survey_string + '</ul></div>';
      }


      return survey_string;
  }

  //
  // process survey for all types of objects
  // Our current questionaire only has radio buttons. We have codes for other types of inputs, which we will gradually add.
  //

  process_survey(obj, survey_string, i) {

        /*survey_string = [survey_string,
          '<div class="card"><div class="quetiontextstyle">',
          obj.text,
          '</div>'
        ].join(" "); */
    
        if (obj.type == 'random') {
          //this.process_survey_random(obj, survey_string, i);
    
        } else {
          
           /*if (obj.type == "captcha") {    
              survey_string = this.process_survey_captcha(obj, survey_string);    
           } else */{
            if (("extra" in obj) && ("dependency" in obj.extra)) {
                survey_string = this.process_survey_captcha_2(obj, survey_string, i);
             } else {
                survey_string = [survey_string,
                    '<div class="card"><div class="quetiontextstyle">',
                    obj.text,
                    '</div>'
                ].join(" ");
                
             }
          }
              
          //------------------------------------------------------                  
          //text box  working
          //------------------------------------------------------                 
          if (obj.type == "textbox") {
              survey_string = this.process_survey_textbox(survey_string, i);
          }
    
        //------------------------------------------------------                  
          //time picker working
          //------------------------------------------------------                 
          if (obj.type == "timepicker") {
              survey_string = this.process_survey_timepicker(survey_string, i);
          }
    
          //------------------------------------------------------                  
          //paragraph working
          //------------------------------------------------------                 
          if (obj.type == "comment") {
              //survey_string = this.process_survey_comment(survey_string);
          }
    
          //------------------------------------------------------                  
          //image
          //------------------------------------------------------  
          if (obj.type == "image") {
              //survey_string = this.process_survey_image(obj, survey_string);
          }
    
    
          //------------------------------------------------------
          //  mood
          //------------------------------------------------------
          if (obj.type == 'mood') {
              //survey_string = this.process_survey_mood(survey_string, i);
          }
    
    
          //------------------------------------------------------
          //  mood-grid
          //------------------------------------------------------
          if (obj.type == 'moodgrid') {
              //survey_string = this.process_survey_moodgrid(survey_string, i);
          }
    
          if (obj.type == "moodgrid2") {
              //survey_string = this.process_survey_moodgrid2(survey_string);
          }
    
    
    
          //------------------------------------------------------                  
          // Autocomplete 
          //------------------------------------------------------   
          // 'component-id="Q' + i + '" ' + 
          if (obj.type == 'autocomplete') {
              //survey_string = this.process_survey_autocomplete(obj, survey_string, i);
          }
    
    
          //------------------------------------------------------ 
          // radio button working     
          //------------------------------------------------------            
          if (obj.type == "radiobutton") {
              survey_string = this.process_survey_radiobutton(obj, survey_string, i);
          }
    
          //------------------------------------------------------                  
          // range working
          //------------------------------------------------------                 
          if (obj.type == "range") {
              survey_string = this.process_survey_range(obj, survey_string, i);
          }   
    
          //------------------------------------------------------                  
          //checkbox working
          //------------------------------------------------------                 
          if (obj.type == "checkbox") {
              survey_string = this.process_survey_checkbox(obj, survey_string, i);
          }
    
          survey_string = survey_string + '</div>';
        }
        return survey_string;
  }

  //get random integer
  getRandomInt(range){
    return Math.floor(Math.random() * range) + 1;
  }

  // process survey if obj type is random    
  process_survey_random(obj, survey_string, i){
      var filename = obj.extra;
      console.log("location: " + filename);
      var has_returned = 0;
      survey_string = survey_string + '<p compile="randomq""></p>';
  /*       $http.get(filename).success(function(data2) {
          var obj_random_q = data2;
          var rand_index = this.getRandomInt(obj_random_q.length - 1)
          this.randomq = this.process_survey(obj_random_q[rand_index], "", i);
          this.rand_index = rand_index;
      }); */

      fetch(filename).then(async res => {
        var obj_random_q = await res.json();
        this.rand_index = this.getRandomInt(obj_random_q.length - 1)
        this.randomq = this.process_survey(obj_random_q[this.rand_index], "", i);
      });
        
      return survey_string;

  }

  // process survey if obj type is textbox
  process_survey_textbox(survey_string, i){
      this.survey[i] = "";
      survey_string = [survey_string,
          '<ion-item>',
          '<ion-input ngDefaultControl type="text" placeholder="Enter here" (ionChange)="inputChangedWithEvent(\'' + i + '\', $event)"></ion-input></ion-item>'
      ].join(" ");
      return survey_string;

  }
    
  // process survey if obj type is timepicker
  process_survey_timepicker(survey_string, i){
    this.survey[i] = moment(new Date()).format('h:mm a');
    survey_string = [survey_string,
        // '<div class="item item-icon-left" ion-datetime-picker time am-pm [(ngModel)]="survey2.' + i + '"', ' (ionChange)="inputchangedtimepicker(\'' + i + '\')">',
        // '<i class="icon ion-ios-clock positive"></i>',
        // '<strong>{{survey.' + i + '| date: "h:mm a"}}</strong>',
        // '</div>'
        
        //'<ion-datetime ngDefaultControl display-format="h:mm a" pickerFormat="h:mm a" [(ngModel)]="survey2.' + i + '"', ' (ionChange)="inputchangedtimepicker(survey2.' + i + ')">',
        '<ion-datetime ngDefaultControl display-format="h:mm a" (ionChange)="inputchangedtimepicker(\'' + i + '\', $event)">',
        '</ion-datetime>'
        ].join(" ");
    return survey_string;
  }

  // process survey if obj type is comment
  process_survey_comment(survey_string){
      survey_string = [survey_string,
          '<div>',
          '<p>',
          "",
          '</p>',
          '</div>'
      ].join(" ");
      return survey_string;
  }

  // process survey if obj type is image
  process_survey_image(obj, survey_string){
      survey_string = [survey_string,
          '<div>',
          '<p>',
          "",
          '</p>',
          '<img style="height: 100%; width: 100%; object-fit: contain" src="' + obj.image_location + '">',
          '</div>'
      ].join(" ");

      return survey_string;
  }

  // process survey if obj type is mood
  process_survey_mood(survey_string, i){
      survey_string = [survey_string,
          '<div class="radioimages">',
          '<label><input ngDefaultControl type="radio" [(ngModel)]="survey2.' + i + '" value="high-sad" (ionChange)="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/5.png></label>',
          '<label><input ngDefaultControl type="radio" [(ngModel)]="survey2.' + i + '" value="low-sad" (ionChange)="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/4.png></label>',
          '<label><input ngDefaultControl type="radio" [(ngModel)]="survey2.' + i + '" value="neutral" (ionChange)="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/3.png></label>',
          '<label><input ngDefaultControl type="radio" [(ngModel)]="survey2.' + i + '" value="low-happy"  (ionChange)="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/2.png></label>',
          '<label><input ngDefaultControl type="radio" [(ngModel)]="survey2.' + i + '" value="high-happy"  (ionChange)="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/1.png></label>',
          '</label></div>'
      ].join(" ");

      return survey_string;
  }

  // process survey if obj type is moodgrid
  process_survey_moodgrid(survey_string, i){
      this.affect = ['Afraid', 'Tense', 'Excited', 'Delighted', 'Frustrated', 'Angry', 'Happy', 'Glad', 'Miserable', 'Sad', 'Calm', 'Satisfied', 'Gloomy', 'Tired', 'Sleepy', 'Serene'];

      var affect = this.affect;
      var colors = ['#ff99a3', '#ff99a3', '#ffc266', '#ffc266', '#ffb3ba', '#ffb3ba', '#FFE0B2', '#FFE0B2', '#BBDEFB', '#BBDEFB', '#C8E6C9', '#C8E6C9', '#e7f3fe', '#e7f3fe', '#eef7ee', '#eef7ee'];

      var html_string = [];
      for (var j = 0; j < 4; j++) {

          html_string.push('<div class = "row">');

          for (var ii = 0; ii < 4; ii++) {
              var index = j * 4 + ii;
              html_string.push('<div (click)="affectclick(' + (index + 1) + ',\'' + i + '\'' + ',\'' + affect[index] + '\')" class = "col col-25"><div style="width:100%;padding-bottom:15%;padding-top:25%;background-color:' + colors[index] + '" align="center">' +
                  '<p ng-bind-html="affect[' + index + ']"></p></div></div>');
          }
          html_string.push('</div>');
      }
      var str = html_string.join(" ");
      survey_string = [survey_string, str].join(" ");

      return survey_string;
  }

  // process survey if obj type is moodgrid2
  process_survey_moodgrid2(survey_string){
      survey_string = [survey_string,
          '<canvas id="myCanvas" width="310" height="310" style="border:0px solid #000000;padding:10px;">',
          'Your browser does not support the HTML5 canvas tag.',
          '</canvas>'
      ].join(" ");

      return survey_string;
  }
      
  // process survey if obj type is autocomplete
  process_survey_autocomplete(obj, survey_string, i){
      survey_string = survey_string +
      '<label class="item item-input">' +
      '<input ion-autocomplete type="text" readonly="readonly" ' +
      'class="ion-autocomplete" autocomplete="on" [(ngModel)]="survey2.' + i +
      '" max-selected-items="1" items-method-value-key="items" ' +
      'items-method="callbackMethod(query,isInitializing,componentId)" ' +
      'items-clicked-method="clickedMethod(callback)" ' +
      'title-text = "' + obj.text + '" ' +
      'id="Q' + i + '" ' +
      'component-id="' + i + '"' +
      ' (change)="inputchanged(\'' + i + '\')"/>' +
      '</label>';
      var options = obj.extra;


      //if i have records for the question load from there. 
      this.autocomplete_options = JSON.parse(window.localStorage['ema_ac_' + i] || '[]');
      if (this.autocomplete_options.length == 0) {
          for (var k = 0; k < options.length; k++) {
              this.autocomplete_options.push({
                  "text": options[k],
                  "times": 1
              });
          }
          window.localStorage['ema_ac_' + i] = JSON.stringify(this.autocomplete_options);
      } else {
          options = [];

          this.autocomplete_options.sort(function(a, b) {
              return b.times - a.times;
          });

          for (var k = 0; k < this.autocomplete_options.length; k++) {
              options.push(this.autocomplete_options[k].text);

              //  
              //console.log("Item " + k + ": " + $scope.autocomplete_options[k].text + " " + $scope.autocomplete_options[k].times);
          }
          //
      }

      this.autocomplete_options[i] = options;

      //auto complete assigned
      console.log("Autocomplete options: " + this.autocomplete_options[i]);
      if(this.choices == undefined) this.choices = {};
      this.choices[obj.name]= this.autocomplete_options[i];

      return survey_string;
  }



  // process survey if obj type is range
  process_survey_range(obj, survey_string, i){
      var min = obj.extra.choices[2];
      var max = obj.extra.choices[3];
      var step = obj.extra.choices[4];
      this.survey[i] = 0;
      survey_string = [survey_string,
/*           '<div class = "row" style="margin-bottom=0px;">',
          '<div class = "col col-10"><p align="center" style="padding-top:2px;padding-bottom:2px;margin:0px;border-radius:5px;background:#4e5dca;color:white;">' + min + '</p></div>',
          '<div class = "col col-10"></div>',
          '<div class = "col col-20 col-offset-20"><p align="center" style="padding-top:2px;padding-bottom:2px;margin:0px;border-radius:25px;background:#303F9F;color:white;"><b>{{survey.' + i + '}}</b></p></div>',
          '<div class = "col col-10"></div>',
          '<div class = "col col-10 col-offset-20"><p align="center" style="padding-top:2px;padding-bottom:2px;margin:0px;border-radius:5px;background:#4e5dca;color:white;">' + max + '</p></div>',
          '</div>',
          '<div class="item range range-balanced" style="padding:10px;padding-top:1px;border-width:0px;">',
          '<p style="text-align: center;color: black;">' + obj.extra.choices[0] + "</p>",
          '<input type="range" min="' + min + '" max="' + max + '" value="' + min + '" step="' + step + '" [(ngModel)]="survey2.' + i + '" name="' + i + '" (change)="inputchanged(\'' + i + '\')"' + '>',
          '<p style="text-align: center;color:black;">' + obj.extra.choices[1] + "</p>",
          '</div>', */
          
          //'<ion-item><ion-range ngDefaultControl min="' + min + '" max="' + max + '" value="' + min + '" step="' + step + '" [(ngModel)]="survey2.' + i + '" name="' + i + '" (ionChange)="inputchanged(\'' + i + '\')"' + '>',
          '<ion-item><ion-range ngDefaultControl min="' + min + '" max="' + max + '" value="' + min + '" step="' + step + '" name="' + i + '" (ionChange)="inputChangedWithEvent(\'' + i + '\', $event)"' + '>',
          '<ion-label slot="start">'+obj.extra.choices[0]+'</ion-label>',
          '<ion-label slot="end">'+ obj.extra.choices[1]+'</ion-label>',
          '</ion-range>',
          '</ion-item>',

      ].join(" ");

      return survey_string;
  }    


  //process survey if obj type is checkbox
  process_survey_checkbox(obj, survey_string, i){
      survey_string = survey_string + '<ion-list>';
      for (var j = 0; j < obj.extra.choices.length; j++) {
          survey_string = [survey_string, 
              '<ion-item>',
              '<ion-label>'+ obj.extra.choices[j]+'</ion-label>',
            // '<ion-checkbox ngDefaultControl color="light" [(ngModel)]="survey2.' + i + 'O' + j + '" (ionChange)="inputChangedWithEvent(\'' + i + '\')"' + '></ion-checkbox>',
              '<ion-checkbox ngDefaultControl color="light" (ionChange)="inputChangedForCheckBox(\'' + i + '\', \'' + i + 'O' + j +'\', $event)"' + '></ion-checkbox>',
              '</ion-item>'
            ].join(" ");
      }
      survey_string = survey_string + '</ion-list>';
      if(this.choices == undefined) this.choices = {};
      this.choices[obj.name]= obj.extra.choices;

      return survey_string; 
  }   

  // process survey if obj type is captcha
  process_survey_captcha(obj, survey_string){
      survey_string = [survey_string,
          '<div class="card"><div class="quetiontextstyle">',
          obj.text + "<br><b>" + '<img src="js/captcha_images/{{survey.q7answer}}" alt="Smiley face" height="60" width="auto">' + "</b>",
          '</div>'
      ].join(" ");

      var filename = obj.extra.filesnames;
      var dir_loc = obj.extra.captchdir;

  /*       $http.get(filename).success(function(data3) {
          var obj_captcha_q = data3[0].data;
          console.log("captcha data: " + obj_captcha_q + ", length: " + obj_captcha_q.length);
          $scope.survey.q7answer = data3[0].data[getRandomInt(0, obj_captcha_q.length - 1)];
      });
  */
      fetch(filename).then(res => res.json())
      .then(data3 => {
          var obj_captcha_q  = data3[0].data;
          console.log("captcha data: " + obj_captcha_q + ", length: " + obj_captcha_q.length);
          this.survey['q7answer'] = data3[0].data[this.getRandomInt(obj_captcha_q.length - 1)];          
      });
            

      obj.type = "textbox";

      return survey_string;
  }   
    
  //process survey where there is dependency
  process_survey_captcha_2(obj, survey_string, i){
      
      if(this.dependentQuestionsArray == undefined) this.dependentQuestionsArray = {};

      if(this.dependentQuestionsArray[obj.extra.dependency.question] == undefined)
      this.dependentQuestionsArray[obj.extra.dependency.question] = [];

      this.dependentQuestionsArray[obj.extra.dependency.question].push(i);

      console.log(obj.name);

      //entry "show" in the json obj survey
      var show_array = obj.extra.dependency.show;

      if(show_array == undefined) {

        //console.log(obj.extra.dependency.question);
        //console.log($scope.choices[obj.extra.dependency.question]);
        if(this.choices[obj.extra.dependency.question] instanceof Array ) {
            show_array = this.choices[obj.extra.dependency.question].slice();
        }

        for (var j = 0; j < obj.extra.dependency.hide.length; j++){
            //console.log(obj.extra.dependency.hide[j]);

            var index = show_array.indexOf(obj.extra.dependency.hide[j]);
            show_array.splice(index, 1);
        }
        //console.log(show_array);

      }


      console.log(show_array);
      if(show_array instanceof Array){

          console.log("blah"+show_array);
          var does_exist = "";
          for (var j = 0; j < show_array.length; j++){

            if(j>0) {
                does_exist = does_exist + "||";
            }

            does_exist = does_exist + "this.survey2['" + obj.extra.dependency.question + "'] =='" + show_array[j] + "'";

        }
        console.log(obj.extra.dependency.question);
        console.log(does_exist);

        if(this.dependencyExpression == undefined) this.dependencyExpression = {};

        this.dependencyExpression[i+obj.extra.dependency.question] = does_exist;
        //initialize: don't display
        this.display_flag[i + obj.extra.dependency.question + "Show"] = false;

          survey_string = [survey_string,
            '<div class="card" *ngIf="display_flag.'+ i + obj.extra.dependency.question + "Show" +'">',
              //'<div class="card" ng-show='+false + '>', 
              '<div class="quetiontextstyle">',
              obj.text,
              '</div>'
          ].join(" ");

      } else if(show_array.indexOf(' ') >= 0){
          // Handle the case when entry "show" has space, for example, "With someone"
          // save show entry for each dependent case
          if(this.showArrayForEachDependency == undefined) this.showArrayForEachDependency = {};

          this.showArrayForEachDependency[i+obj.extra.dependency.question] = show_array;

          console.log(i + obj.extra.dependency.question + "Show "+show_array);
          this.display_flag[i + obj.extra.dependency.question + "Show"] = false;

          survey_string = [survey_string,
              '<div class="card" *ngIf="display_flag.'+ i + obj.extra.dependency.question + "Show" +'">',
              //'<div class="card" ng-show=' + false + '>', 
              //'<div class="card" ng-show="compareSelectionWithDependency(\'' + i + '\', \''+ obj.extra.dependency.show + '\')">', 
              '<div class="quetiontextstyle">',
              obj.text,
              '</div>'
              ].join(" ");
          //console.log(survey_string);

      } else {
          console.log(JSON.stringify(this.survey)+" "+obj.extra.dependency.show);

          survey_string = [survey_string,
              '<div class="card" *ngIf="' + "survey2." + obj.extra.dependency.question + " =='"+ obj.extra.dependency.show + "'" + '">',
              //'<div class="card" ng-show=' + false + '>', 
              '<div class="quetiontextstyle">',
              obj.text,
              '</div>'
          ].join(" ");
          //console.log(survey_string);
      }
      return survey_string;
  }   


}

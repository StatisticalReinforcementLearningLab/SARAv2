//
//--- The goal of this file is to dynamically generate a survey from a JSON file. 
//--- Example JSON files are located in assets/survey folder. 
//--- For more details on how to create a survey please see: https://github.com/StatisticalReinforcementLearningLab/SARAv2/tree/master/src/app/survey
//--- At a high level, this file does the following:
//      (i) reads a JSON file in the "ngAfterViewInit" 
//      (ii) calls the "generateSurvey" function to create html codes for the survey
//      (iii) creates a component dynamically and attached it to the "vc" component.
//

import { Component, OnInit, ViewChild, ViewContainerRef, NgModule, Compiler, Injector, NgModuleRef, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AwsS3Service } from '../../storage/aws-s3.service';
import { EncrDecrService } from '../../storage/encrdecrservice.service';

import { Platform, AlertController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { AwardDollarService } from 'src/app/incentive/award-money/award-dollar.service';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { surveyCompleted } from '../survey.actions';
import { SurveyTimeline } from '../model/surveyTimeline';
import { UnlockedIncentives } from '../../incentive/model/unlocked-incentives';
import { surveyCompletedRegisterUnlocked } from 'src/app/incentive/incentive.actions';
import { JSONOutput } from 'aws-sdk/clients/s3';

@Component({
    selector: 'app-dynamic-survey',
    templateUrl: './dynamic-survey.component.html',
    styleUrls: ['./dynamic-survey.component.scss']
})


export class DynamicSurveyComponent implements OnInit {


    @Input() jsonFileLinkForSurvey: string; //inputs the json file used to generate a survey
    public isLoading = true;
    public loadingComplete = false;

    //surveyQuestionsInHTMLString = "";
    surveyQuestionsDict = {};
    surveyQuestionsInJSONDictFormat: any;
    versionNumber;

    @ViewChild('vc', { read: ViewContainerRef }) vc: ViewContainerRef;

    constructor(private _compiler: Compiler,
        private _injector: Injector,
        private _m: NgModuleRef<any>,
        private awsS3Service: AwsS3Service,
        private EncrDecr: EncrDecrService,
        private router: Router,
        private changeDetector: ChangeDetectorRef,
        private appVersion: AppVersion,
        private alertCtrl: AlertController,
        public plt: Platform,
        private userProfileService: UserProfileService,
        //private lifeInsightsProfileService: LifeInsightsProfileService,
        private store: Store<AppState>,
        private awardDollarService: AwardDollarService) {

    }

    ngOnInit() { }

    ngAfterViewInit() {
        this.fetchSurveyQuestionsAndGenerateSurvey();
        this.getAppVersionNumber(); // to track which users has the latest version of the app.

        //initiate the life-insight object
        //this.lifeInsightsProfileService.importLifeInsightProfile(this.jsonFileLinkForSurvey);
    }


    fetchSurveyQuestionsAndGenerateSurvey() {
        fetch('../../../assets/data/' + this.jsonFileLinkForSurvey + '.json').then(async res => {
            let surveyQuestionsInJSONDictFormat = await res.json();
            let surveyQuestionsInHTMLString = this.generateHTMLCodeForSurveyFromJSON(surveyQuestionsInJSONDictFormat);
            this.surveyQuestionsInJSONDictFormat = surveyQuestionsInJSONDictFormat;
            this.generateDynamicSurveyComponentFromHTML(surveyQuestionsInHTMLString);
        });
    }


    generateHTMLCodeForSurveyFromJSON(surveyQuestionsInJSONDictFormat: any): string {
        // This function takes the JSON object with questions
        // and generate HTML codes for the survey. 
        // The HTML code is later used in a dynamically generated component to 
        // show it to the user.
        this.surveyQuestionsDict = {};
        let surveyQuestionsInHTMLString: string;

        //questions JSON format are a list. This loop goes through each questions and adds it to the HTML string
        for (var i = 0; i < surveyQuestionsInJSONDictFormat.length; i++) {
            var singleSurveyQuestionObj = surveyQuestionsInJSONDictFormat[i];
            this.surveyQuestionsDict[singleSurveyQuestionObj.name] = "";

            //the following line crates a html string for the survey.
            surveyQuestionsInHTMLString = this.process_survey(singleSurveyQuestionObj, surveyQuestionsInHTMLString, singleSurveyQuestionObj.name);
        }

        // the final step to create HTML from JSON file. It adds a submit button right at the end.
        surveyQuestionsInHTMLString = surveyQuestionsInHTMLString + '<div class="ion-padding"><button class="buttonold button-positive" (click)="submitSurvey()">Submit</button></div>';

        return surveyQuestionsInHTMLString;
    }


    generateDynamicSurveyComponentFromHTML(surveyQuestionsInHTMLString: string) {

        //---
        //--- Generate a survey component dynamically from the "surveyQuestionsInHTMLString."
        //--- The "surveyQuestionsInHTMLString" contains all the HTML for the template for dynamic component
        //--- 
        const surveyComponent = Component({ template: surveyQuestionsInHTMLString })(class implements OnInit {

            //IMPORTANT: contains all the questions in the 
            surveyAnswersJSONObject = {};


            isQuestionIncomplete = {};
            fileLink: string;
            versionNumber: string;
            lifeInsightObj = {};
            //storeToFirebaseService: StoreToFirebaseService;

            EncrDecr: EncrDecrService;
            awsS3Service: AwsS3Service;
            totalPoints = 0;
            plt: Platform;
            router: Router;
            userProfileService: UserProfileService;
            awardDollarService: AwardDollarService;
            surveyQuestionsInJSONDictFormat = [];
            alertCtrl;
            store: Store<AppState>;

            constructor() {
            }

            ngOnInit() {
                this.initializeSurveyAnswersJSONObject();
            }

            

            initializeSurveyAnswersJSONObject() {

                //set start time when participants started the survey.
                this.surveyAnswersJSONObject['surveyStartTimeUTC'] = new Date().getTime();

                //isQuestionIncomplete list tracks if questions are answered or not.
                for (var i = 0; i < this.surveyQuestionsInJSONDictFormat.length; i++)
                    if(this.surveyQuestionsInJSONDictFormat[i].type !== 'sleeptextbox')
                        this.isQuestionIncomplete[this.surveyQuestionsInJSONDictFormat[i].name] = { "tag": this.surveyQuestionsInJSONDictFormat[i].tag };

                //initialize when different survey questions are clicked
                this.surveyAnswersJSONObject['onclickTimeForDifferentQuestions'] = {};

            }


            inputchanged(question) {
                //This function tracks if users clicked on a survey question and reacts.   
                console.log("Clicked on question: " + question);

                //store in the answer object when `question` has been clicked.
                this.surveyAnswersJSONObject['onclickTimeForDifferentQuestions'][question] = {};
                this.surveyAnswersJSONObject['onclickTimeForDifferentQuestions'][question].ts = Date.now();
                this.surveyAnswersJSONObject['onclickTimeForDifferentQuestions'][question].readable_ts = moment().format("MMMM Do YYYY, h:mm:ss a Z");

                //console.log(JSON.stringify(this.surveyAnswersJSONObject));
                delete this.isQuestionIncomplete[question]; //remove the key from isQuestionIncomplete
            }

            inputchangedRangeTime(question, startTime){
                /*
                    "question" is the question id; Q1, Q2, Q3, etc.
                    "startTime", is the string when time is starting. Different questions have a different start time.
                */

                //--- console.log('holla: ' + question+" "+JSON.stringify($event.detail));
                //
                startTime = startTime.replace("<br>", " ");
                var startTimeSplit = startTime.split(" ");
                var startTimeHour = parseInt(startTimeSplit[0]);
                var amPmPart =  startTimeSplit[1];
                if(amPmPart == 'PM')
                    startTimeHour = startTimeHour + 12;


                //console.log("Clicked on question: " + question);
                //console.log("Time: " + startTime + ", startTimeHour: " + startTimeHour);


                var changedHourAfterInput;
                var changedMinuteAfterInput;
                var changedAMPMAfterInput;
                if((this.surveyAnswersJSONObject[question]*100)%100 == 50){
                    changedHourAfterInput = startTimeHour + this.surveyAnswersJSONObject[question] - 0.5;
                    changedMinuteAfterInput = "30";
                }else if((this.surveyAnswersJSONObject[question]*100)%100 == 25){
                    changedHourAfterInput = startTimeHour + this.surveyAnswersJSONObject[question] - 0.25;
                    changedMinuteAfterInput = "15";
                }else if((this.surveyAnswersJSONObject[question]*100)%100 == 75){
                    changedHourAfterInput = startTimeHour + this.surveyAnswersJSONObject[question] - 0.75;
                    changedMinuteAfterInput = "45";
                }else{
                    changedHourAfterInput = startTimeHour + this.surveyAnswersJSONObject[question];
                    changedMinuteAfterInput = "00";
                }

                changedHourAfterInput = changedHourAfterInput%24; //if goes above 24 then change to zero.

                if(changedHourAfterInput == 0){
                    changedHourAfterInput = 12;
                    changedAMPMAfterInput = "AM";
                }else if(changedHourAfterInput>0 && changedHourAfterInput<12)
                    changedAMPMAfterInput = "AM";
                else if(changedHourAfterInput == 12){
                    changedAMPMAfterInput = "PM";
                    changedHourAfterInput = 12;
                }else{
                    changedAMPMAfterInput = "PM";
                    changedHourAfterInput = changedHourAfterInput - 12;
                }
                this.surveyAnswersJSONObject[question + "_modified"] = "" + changedHourAfterInput + ":" + changedMinuteAfterInput + " " + changedAMPMAfterInput;
                
                /*
                //
                //
                if(this.surveyAnswersJSONObject[question] < 4){
                    if((this.surveyAnswersJSONObject[question]*10)%10 == 5)
                        this.surveyAnswersJSONObject[question + "_modified"] = "" + (8 + this.surveyAnswersJSONObject[question]  - 0.5) + ":30 PM";
                    else
                        this.surveyAnswersJSONObject[question + "_modified"] = "" + (8 + this.surveyAnswersJSONObject[question]) + ":00 PM";
                }else if((this.surveyAnswersJSONObject[question]>=4) || (this.surveyAnswersJSONObject[question]<5)){
                    if((this.surveyAnswersJSONObject[question]*10)%10 == 5)
                        this.surveyAnswersJSONObject[question + "_modified"] = "12:30 AM";
                    else
                        this.surveyAnswersJSONObject[question + "_modified"] = "12:00 AM";
                }else{
                    if((this.surveyAnswersJSONObject[question]*10)%10 == 5)
                        this.surveyAnswersJSONObject[question + "_modified"] = "" + (8 + this.surveyAnswersJSONObject[question]  - 0.5 - 12) + ":30 AM";
                    else
                        this.surveyAnswersJSONObject[question + "_modified"] = "" + (8 + this.surveyAnswersJSONObject[question] - 12) + ":00 AM";
                }
                //console.log(JSON.stringify(this.surveyAnswersJSONObject));
                */
                
                this.inputchanged(question);
            }

            inputChangedForCheckBox2(question, item, $event) {
                /*
                Currently not used
                */
                console.log('holla: ' + question+" "+JSON.stringify($event.detail));
                this.surveyAnswersJSONObject[item] = $event.detail.checked;
                //console.log(JSON.stringify(this.surveyAnswersJSONObject));

                //this.processExtraCondition(question);
            }

            inputChangedForCheckBox(question, item, value, event) {
                console.log('holla: ' + question+", "+item + ", " + value);
                this.inputchanged(question);
                console.log('holla: ' + question+" "+JSON.stringify(event));
                if(""+this.surveyAnswersJSONObject[item]=='true')
                    this.surveyAnswersJSONObject[item + "_value"] = value;
                else{
                    delete this.surveyAnswersJSONObject[item];
                    delete this.surveyAnswersJSONObject[item + "_value"];
                }
                console.log(JSON.stringify(this.surveyAnswersJSONObject));

                //this.processExtraCondition(question);
            }

            inputChangedWithEvent(question, $event) {
                //console.log("Qs:" + questions + ", ts:" + Date.now() + ", readable_time:" + moment().format("MMMM Do YYYY, h:mm:ss a"));
                console.log('holla: ' + question + " " + JSON.stringify($event.detail));
                this.surveyAnswersJSONObject[question] = $event.detail.value;
                console.log(JSON.stringify(this.surveyAnswersJSONObject));
                //this.processExtraCondition(question);
            }

            /*
            processExtraCondition(question) {

                console.log("processDisplayCondition for " + question);
                console.log(JSON.stringify(this.dependentQuestionsArray));
                if (this.dependentQuestionsArray[question] != null) {
                    for (var j = 0; j < this.dependentQuestionsArray[question].length; j++) {
                        var dependentQuestion = this.dependentQuestionsArray[question][j];
                        if (this.dependencyExpression != undefined && this.dependencyExpression[dependentQuestion + question] != undefined) {
                            console.log(JSON.stringify(this.dependencyExpression));
                            this.getDisplayFlagForDependentSurvey(this.dependencyExpression[dependentQuestion + question], dependentQuestion + question);
                        }

                        //handle the case when there is empty space in answer when clicked, for example, "With someone"
                        if (this.showArrayForEachDependency != undefined && this.showArrayForEachDependency[dependentQuestion + question] != undefined) {
                            console.log(JSON.stringify(this.showArrayForEachDependency));
                            this.getDisplayFlagForDependentSurveyWithSpaceInShowEntry(this.showArrayForEachDependency[dependentQuestion + question], dependentQuestion + question, question);
                        }
                    }
                }
                //this.update.next("");
            }

            getDisplayFlagForDependentSurvey(conditionExpression, label) {
                console.log(conditionExpression + " " + label);
                this.display_flag[label + "Show"] = eval(conditionExpression);
                console.log("getDisplayFlagForDependentSurvey " + label + "Show " + this.display_flag[label + "Show"]);
            }

            getDisplayFlagForDependentSurveyWithSpaceInShowEntry(conditionExpression, label, questions) {
                //console.log("True " +  ($scope.survey.Q3d==undefined || $scope.survey.Q3d=='0' || $scope.survey.Q3d=='0.5'));
                var sel = this.survey2[questions];
                var dep = conditionExpression;
                //console.log("compareSelectionWithDependency "+questions+" "+sel+" "+s);
                if (sel != undefined && conditionExpression != undefined) {
                    sel = sel.replace(/\s+/g, "");
                    dep = conditionExpression.replace(/\s+/g, "");
                }
                this.display_flag[label + "Show"] = false;
                if (sel === dep) {
                    this.display_flag[label + "Show"] = true;
                }

                console.log("getDisplayFlagForDependentSurveyWithSpaceInShowEntry " + name + " for " + questions + " " + this.display_flag[label + "Show"]);

            }
            */

            submitSurvey() {

                // This function is called when user presses the "Submit button"
                // We first check if participant completed all the questions. If they do submit the survey.
                // If participant did not complete all the survey then show a prompt which questions they forgot to complete.

                if (this.isEmpty(this.isQuestionIncomplete)) //--- means all questions has been completed
                    this.storeData();
                else { //--- means all questions has been completed
                    var incompleteQuestions = "";
                    for (var incompleteQuestion in this.isQuestionIncomplete)
                        incompleteQuestions = incompleteQuestions + " " + this.isQuestionIncomplete[incompleteQuestion]["tag"] + ",";

                    incompleteQuestions = incompleteQuestions.substring(0, incompleteQuestions.length - 1);
                    this.presentAlertForIncompleteQuestions("You haven't completed questions:" + incompleteQuestions);
                }
            }


            async presentAlertForIncompleteQuestions(alertMessage: string) {
                const alert = await this.alertCtrl.create({
                    header: 'Oops! You missed some questions',
                    message: alertMessage,
                    buttons: [{ text: 'OK', cssClass: 'secondary' }]
                });
                await alert.present();
            }

            isEmpty(obj: {}) {
                return JSON.stringify(obj) === JSON.stringify({});
            }


            storeData() {

                //--- add meta information to the survey, which could be interesting for data science
                this.addMetaTagsToSurvey();

                //--- encrypt the survey and upload it to S3.
                this.enycryptSurveyDataAndUploadToS3();

                //--- save an encrypted copy of the survey
                this.saveEncryptedSurveyLocally();

                //--save sensitive data locally
                this.saveSensitiveDataLocally();

                //-- store survey completed into ngrx to send to server and any other listener.
                this.storeToNgrxAndUpdateState();

                //start giving all the incentives from here
                this.provideIncentives();
            }

            saveSensitiveDataLocally(){
                //local store
                var locallyStoredSensitiveData = {};
                if(window.localStorage['locallyStoredSensitiveData'] != undefined)
                    locallyStoredSensitiveData = JSON.parse(window.localStorage.getItem('locallyStoredSensitiveData'));
                else{
                    locallyStoredSensitiveData["survey"] = [];
                    locallyStoredSensitiveData["medication_data"] = [];
                }
                locallyStoredSensitiveData["survey"].push({"date": moment().format('YYYYMMDD'), "survey_type": this.fileLink,"survey_data": this.surveyAnswersJSONObject});
                window.localStorage.setItem('locallyStoredSensitiveData', JSON.stringify(locallyStoredSensitiveData));
            }

            saveEncryptedSurveyLocally() {
                /*
                Keeps a local copy of the survey in encrypted form.
                The name of the key of the survey will be the this.fileLink.
                */
                var locallyStoredSurvey = {};
                if (window.localStorage['localSurvey'] != undefined)
                    locallyStoredSurvey = JSON.parse(window.localStorage.getItem('localSurvey'));

                locallyStoredSurvey[this.fileLink] = {}
                locallyStoredSurvey[this.fileLink]["encrypted"] = this.surveyAnswersJSONObject['encrypted'];
                locallyStoredSurvey[this.fileLink]["date"] = moment().format('YYYYMMDD');
                window.localStorage.setItem('localSurvey', JSON.stringify(locallyStoredSurvey));
            }

            addMetaTagsToSurvey() {
                var surveyEndTime = new Date().getTime();
                this.surveyAnswersJSONObject['endtimeUTC'] = surveyEndTime;
                var readableSurveyEndTime = moment().format('MMMM Do YYYY, h:mm:ss a Z');
                this.surveyAnswersJSONObject['ts'] = readableSurveyEndTime;
                this.surveyAnswersJSONObject['userName'] = this.userProfileService.username;
                this.surveyAnswersJSONObject['devicInfo'] = this.plt.platforms(); //Type of device; iOS or Android
                this.surveyAnswersJSONObject['appVersion'] = this.versionNumber;
            }

            enycryptSurveyDataAndUploadToS3() {
                var encrypted = this.EncrDecr.encrypt(JSON.stringify(this.surveyAnswersJSONObject), environment.encyptString);
                var surveyEncrypted = {};
                surveyEncrypted['encrypted'] = encrypted;
                this.surveyAnswersJSONObject['encrypted'] = encrypted;
                this.awsS3Service.upload(this.fileLink, surveyEncrypted);
            }

            storeToNgrxAndUpdateState() {

                //update survey timeline in ngrx store.
                let surveyTimeline: SurveyTimeline = {
                    user_id: this.userProfileService.username,
                    timeline: [{ dateOfCompletion: moment().format('YYYYMMDD'), timestamp: new Date().getTime(), readableTimestamp: moment().format('MMMM Do YYYY, h:mm:ss a Z') }]
                };
                this.store.dispatch(surveyCompleted({ surveyTimeline }));
            }


            provideIncentives() {

                // if (this.fileLink.includes('baseline')){
                //     //navigationExtras['state']['modalObjectNavigationExtras'] = modalObjectNavigationExtras;
                //     this.router.navigate(['home']);
                // }

                // incremenet point. Points automatically update the aquarium.
                if (this.fileLink.includes('baseline')){
                    this.awardANdUpdatePoints(0);
                }else{
                    this.awardANdUpdatePoints(60);
                }
                


                //compute new money and store it in local storage.
                let { pastTotalDollars, awardedTotalDollarAfterCurrentSurvey } = this.awardAndUpdateMoney();

                // ToDo: change this. Dan is saving user profile here to save the money to server.
                this.userProfileService.surveyCompleted();


                //TODO: needs to add fix from Liying.
                this.lifeInsightCodesUnfinished();


                //todo
                //-- 1. Compute probability of reinforcement
                //navigate to award-memes/award-altruism with equal probability after submit survey
                var reinforcementRandomizationProb = Math.random();
                window.localStorage.setItem("Prob", "" + reinforcementRandomizationProb);
                var currentDate = moment().format('YYYYMMDD');
                let navigationExtras: NavigationExtras = {
                    state: {
                        date: currentDate,
                        prob: reinforcementRandomizationProb
                    }
                };
                //prepare reinforcement data to upload to AWS S3
                var reinforcement_data = {};
                reinforcement_data['userName'] = this.userProfileService.username;
                reinforcement_data['appVersion'] = this.versionNumber;
                reinforcement_data['Prob'] = reinforcementRandomizationProb;
                reinforcement_data['day_count'] = Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length;
                reinforcement_data['isRandomized'] = 1;//what is this one??
                reinforcement_data['unix_ts'] = new Date().getTime();
                reinforcement_data['readable_ts'] = moment().format('MMMM Do YYYY, h:mm:ss a Z');
                reinforcement_data['date'] = currentDate;
                reinforcement_data['randomization_prob'] = reinforcementRandomizationProb;


                //
                reinforcementRandomizationProb = 0.7;
                if(reinforcementRandomizationProb >=0.4){
                    // randomly pick an incentive
                    // select between life-insight, meme, thank you
                    // save for today. Do not save for caregiver or baseline.
                    let select_reward = 'meme';

                    if(select_reward == 'meme'){
                        fetch('./assets/memes/memefile.json').then(async res => {
                            var meme_data = await res.json();
                            reinforcement_data['type_of_rewards'] = 'meme';
                            meme_data = this.shuffle(meme_data);//will do a shuffle unless it is already shufffled before
                            // this.showmemes();
                            var picked_meme = this.pick_meme(meme_data); // for the shuffled, pick the top. Remove from the shuffled list
                            // this.whichImage = "./assets/memes/"+picked_meme[0]["filename"];
                            reinforcement_data['reward_file_link'] = "./assets/memes/"+picked_meme[0]["filename"];
                            window.localStorage['reinforcement_data'] = JSON.stringify(reinforcement_data);
                        });  
                    }

                }else{
                    //otherwise do nothing.
                    reinforcement_data['type_of_rewards'] = 'No reward';
                    reinforcement_data['reward_file_link'] = '';
                    window.localStorage['reinforcement_data'] = JSON.stringify(reinforcement_data);
                }
                



                //add for the  modal object
                var modalObjectNavigationExtras = {};
                modalObjectNavigationExtras["LastSurveyCompletionDate"] = moment().format('YYYYMMDD');
                modalObjectNavigationExtras["CurrentPoints"] = this.userProfileService.points;
                modalObjectNavigationExtras["PreviousPoints"] = this.userProfileService.points - 60;
                modalObjectNavigationExtras["AwardedDollar"] = awardedTotalDollarAfterCurrentSurvey - pastTotalDollars;
                modalObjectNavigationExtras["IsModalShownYet"] = false;

                

                //-- 2. Compute probability of tailored message

                /*
                if (this.fileLink.includes('caregiver') || currentProb <= 0.4) {
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
                } else if ((currentProb > 0.4) && (currentProb <= 0.7)) {
                    reinforcement_data['reward'] = "Meme";
                    navigationExtras['state']['reinforcement_data'] = reinforcement_data;
                    navigationExtras['state']['modalObjectNavigationExtras'] = modalObjectNavigationExtras;
                    this.router.navigate(['incentive/award-memes'], navigationExtras);
                } else if (currentProb > 0.7) {
                    reinforcement_data['reward'] = "Altruistic message";
                    navigationExtras['state']['reinforcement_data'] = reinforcement_data;
                    navigationExtras['state']['modalObjectNavigationExtras'] = modalObjectNavigationExtras;
                    this.router.navigate(['incentive/award-altruism'], navigationExtras);
                }
                */
                

                if (this.fileLink.includes('caregiver')){
                    //20240715: Caregiver receives no incentive or message.
                    navigationExtras['state']['modalObjectNavigationExtras'] = modalObjectNavigationExtras;
                    this.router.navigate(['home'], navigationExtras);
                }else if (this.fileLink.includes('baseline')){
                    //20240715: Is the baseline survey available?
                    navigationExtras['state']['modalObjectNavigationExtras'] = modalObjectNavigationExtras;
                    this.router.navigate(['home'], navigationExtras);
                }else{
                    this.router.navigate(['intervention/tailored-message'], navigationExtras);
                }



                //update unlocked incentive data in ngrx store.
                //This ngrx store state is used to show unlocked incentives at
                //the start of aquarium reload
                if(this.fileLink.includes('baseline')){
                    //we will be giving zero money for the baseline survey
                    this.updataUnlockedIncentiveInNgrxStore(0, true);
                }else{
                    this.updataUnlockedIncentiveInNgrxStore(awardedTotalDollarAfterCurrentSurvey - pastTotalDollars, false);
                }
            }

            /**
             * Shuffles array in place if it is not already shuffled
             * @param {Array} a items An array containing the items.
             */
            pick_meme(a) {
                var picked_meme = a.splice(0,1);
                a.push(picked_meme[0]);
                window.localStorage['meme_shuffle6'] = JSON.stringify(a);
                return picked_meme;
            }
            
            /**
             * Shuffles array in place if it is not already shuffled
             * @param {Array} a items An array containing the items.
             */
            shuffle(a) {

                //
                //console.log(window.localStorage['meme_shuffle5']);
                if(window.localStorage['meme_shuffle6'] == undefined){
                    //
                    var j: number, x: number, i: number;
                    for (i = a.length - 1; i > 0; i--) {
                        j = Math.floor(Math.random() * (i + 1));
                        x = a[i];
                        a[i] = a[j];
                        a[j] = x;
                        //console.log(JSON.stringify(a[i][0]) + "," + JSON.stringify(a[j][0]));
                        //console.log('Meme data: ' + i + ", " + JSON.stringify(a));
                    }
                    //
                    window.localStorage['meme_shuffle6'] = JSON.stringify(a);
                    return a;
                }else{
                    a  = JSON.parse(window.localStorage['meme_shuffle6']);
                    return a;
                }

            }

            awardANdUpdatePoints(points) {
                //get current points from local storage, update, and store it back.
                //TODO: rather than storage use the Ngrx store to store points and update.
                if (window.localStorage['TotalPoints'] == undefined)
                    this.totalPoints = 0;
                else
                    this.totalPoints = parseInt(window.localStorage['TotalPoints']);

                this.totalPoints = this.totalPoints + points; //
                window.localStorage.setItem("TotalPoints", "" + this.totalPoints);
            }

            awardAndUpdateMoney() {
                //get current dollars, 
                let pastTotalDollars = this.awardDollarService.getCurrentlyEarnedDollars();
                let awardedTotalDollarAfterCurrentSurvey = this.awardDollarService.giveDollars();
                return {
                    pastTotalDollars,
                    awardedTotalDollarAfterCurrentSurvey
                };

            }

            updataUnlockedIncentiveInNgrxStore(unlockedMoney, isBaselineSurvey) {
                var unlockedPoints = 60;
                if(isBaselineSurvey == true)
                    unlockedPoints = 0;

                var payload: Object = {
                    user_id: this.userProfileService.username,
                    last_date: moment().format('YYYYMMDD'),
                    unlocked_points: unlockedPoints,
                    unlocked_money: unlockedMoney,
                    current_point: this.userProfileService.points,
                    date: moment().format('YYYYMMDD'),
                    isUnlockedViewShown: false,
                    isBaselineSurvey: isBaselineSurvey
                };
                this.store.dispatch(surveyCompletedRegisterUnlocked({ payload }));
            }





            lifeInsightCodesUnfinished() {
                //Save 7-day date and value for each question in localStorage to generate lifeInsight chart
                var lifeInsightProfile = {
                    "questions": ["Q3d", "Q4d", "Q5d", "Q8d"],
                    "qimgs": ["assets/img/stress.png", "assets/img/freetime.png", "assets/img/dance2.png", "assets/img/social.png"],
                    "lifeInsightsTitle": ["How much <b>pain</b> are you currently experiencing?",
                        "How much <b>fatigue</b> are you currently experiencing?",
                        "How much <b>nausea</b> are you currently experiencing?",
                        "How <b>motivated</b> are you to take 6MP today?"],
                    "qYaxis": ["Pain level", "Fatigue level", "Nausea level", "Degree of motivation"],
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
                if (window.localStorage['lifeInsight'] == undefined) {

                    for (let question of questionsArray) {
                        this.lifeInsightObj[question] = {};
                        this.lifeInsightObj[question]['dates'] = [moment().format("DD-MM-YYYY")];
                        if (this.surveyAnswersJSONObject.hasOwnProperty(question)) {
                            this.lifeInsightObj[question]['data'] = [parseInt(this.surveyAnswersJSONObject[question])];
                        }
                        else {
                            this.lifeInsightObj[question]['data'] = [null];
                        }
                    }
                } else {
                    this.lifeInsightObj = JSON.parse(window.localStorage["lifeInsight"]);

                    for (let question of questionsArray) {
                        var dateslength = this.lifeInsightObj[question]['dates'].length;
                        if (dateslength == 7) {
                            this.lifeInsightObj[question]['dates'].shift();
                            this.lifeInsightObj[question]['data'].shift();
                        }
                        var currentdate = moment().format("DD-MM-YYYY");
                        var dates = this.lifeInsightObj[question]["dates"];
                        var dateIndex = dates.indexOf(currentdate);
                        console.log("Current date exist? " + dateIndex);
                        if (dateIndex > -1) {
                            this.lifeInsightObj[question]['dates'][dateIndex] = currentdate;
                            if (this.surveyAnswersJSONObject.hasOwnProperty(question)) {
                                this.lifeInsightObj[question]['data'][dateIndex] = (parseInt(this.surveyAnswersJSONObject[question]));
                            }
                            else {
                                this.lifeInsightObj[question][dateIndex] = null;
                            }
                        } else {
                            this.lifeInsightObj[question]['dates'].push(currentdate);
                            if (this.surveyAnswersJSONObject.hasOwnProperty(question)) {
                                this.lifeInsightObj[question]['data'].push(parseInt(this.surveyAnswersJSONObject[question]));
                            }
                            else {
                                this.lifeInsightObj[question]['data'].push(null);
                            }
                        }
                    }
                }
                //console.log("lifeInsightObj: "+JSON.stringify(this.lifeInsightObj));
                window.localStorage.setItem("lifeInsight", JSON.stringify(this.lifeInsightObj));
            }

            ngAfterViewInit() {
                setTimeout(e => this.drawMoodGrid(this), 200);
            }

            drawMoodGrid(self2) {

                var c = <HTMLCanvasElement>document.getElementById("myCanvas");
                if (c == null) {
                    //console.log("is null");
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
                var top_x = (42.0 / 354.0) * c.width;
                var top_y = (32.0 / 354.0) * c.height;
                var bottom_x = (320.0 / 354.0) * c.width;
                var bottom_y = (320.0 / 354.0) * c.height;

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
                    if ((lastPos.x >= top_x) && (lastPos.y >= top_y) && (lastPos.x <= bottom_x) && (lastPos.y <= bottom_y)) {
                        x = 10 * (lastPos.x - top_x) / (bottom_x - top_x) - 5;
                        y = 5 - 10 * (lastPos.y - top_y) / (bottom_y - top_y) - 5;
                        console.log("x:" + x + ", y:" + y);

                        //self2.survey2['QMood'] = "" + x + ":" + y;
                        self2.surveyAnswersJSONObject['QMood'] = "" + x + ":" + y;


                        //
                        self2.inputchanged("QMood");
                    } else {
                        return;
                    }

                    var rect = c.getBoundingClientRect();
                    ctx.beginPath();
                    ctx.clearRect(0, 0, rect.right - rect.left, rect.bottom - rect.top);
                    ctx.closePath();

                    //
                    ctx.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height, // source rectangle
                        0, 0, c.width, c.height); // destination rectangle

                    //ctx.drawImage(imageObj, 0, 0);
                    ctx.beginPath();
                    ctx.arc(lastPos.x, lastPos.y, 10, 0, 2 * Math.PI);
                    ctx.fillStyle = 'red';
                    ctx.fill();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'red';
                    ctx.stroke();
                }, false);
            }

        });

        const tmpModule = NgModule({ declarations: [surveyComponent], imports: [FormsModule] })(class {
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
                //cmpRef.instance.surveyAnswersJSONObject = this.surveyQuestionsDict;
                cmpRef.instance.surveyAnswersJSONObject = this.surveyQuestionsDict;
                cmpRef.instance.fileLink = this.jsonFileLinkForSurvey;
                cmpRef.instance.versionNumber = this.versionNumber;
                cmpRef.instance.surveyQuestionsInJSONDictFormat = this.surveyQuestionsInJSONDictFormat;
                cmpRef.instance.alertCtrl = this.alertCtrl;
                cmpRef.instance.userProfileService = this.userProfileService;
                cmpRef.instance.awardDollarService = this.awardDollarService;
                cmpRef.instance.EncrDecr = this.EncrDecr;
                cmpRef.instance.plt = this.plt;
                cmpRef.instance.router = this.router;// Router,
                cmpRef.instance.store = this.store;
                cmpRef.instance.name = 'dynamic';
            });
    }


    //
    // process survey for all types of objects
    // Our current questionaire only has radio buttons. We have codes for other types of inputs, which we will gradually add.
    //

    process_survey(obj: { text: any; type: string; }, survey_string: string, i: any) {

        survey_string = [survey_string,
            '<div class="card"><div class="quetiontextstyle">',
            obj.text,
            '</div>'
        ].join(" ");

        if (obj.type == 'random') {
            //this.process_survey_random(obj, survey_string, i);

        } else {
            //
            if (obj.type == "captcha") {

                //survey_string = this.process_survey_captcha(obj, survey_string);

            }


            //------------------------------------------------------                  
            //text box  
            //------------------------------------------------------                 
            if (obj.type == "textbox") {
                //survey_string = this.process_survey_textbox(survey_string, i);
                /*
                survey_string = [survey_string,
                    '<label class="item item-input">',
                    '<input type="text" style="display:block;" [(ngModel)]="surveyAnswersJSONObject.' + i + '"', 
                    '(change)="inputchanged(\'' + i + '\')"></label>'
                ].join(" ");
                */
                //return survey_string;
            }

            if (obj.type == "sleeptextbox") {
                //survey_string = this.process_survey_textbox(survey_string, i);
                /*
                survey_string = [survey_string,
                    '<label class="item item-input">',
                    '<input type="text" style="display:block;" [(ngModel)]="surveyAnswersJSONObject.' + i + '"', 
                    '(change)="inputchanged(\'' + i + '\')"></label>'
                ].join(" ");
                */
                survey_string = [survey_string,
                    '<div class="form-floating" style="margin:0px;">',
                        '<input type="number" class="form-control" ', 
                        'style="border-radius:0rem;" id="hours" placeholder="Enter hours" name="hours">', 
                        '<label for="hours">Hours</label>',
                    '</div>'
                ].join(" ");
                survey_string = [survey_string,
                    '<div class="form-floating">',
                        '<select class="form-select" id="minutes" name="minutes" style="border-radius:0rem;">', 
                            '<option>0</option>',
                            '<option>15</option>',
                            '<option>30</option>',
                            '<option>45</option>',
                        '</select>',
                        '<label for="minutes" class="form-label">Minutes</label>',
                    '</div>'
                ].join(" ");
                //return survey_string;
            }



            //------------------------------------------------------                  
            //time picker
            //------------------------------------------------------                 
            if (obj.type == "timepicker") {
                //survey_string = this.process_survey_timepicker(survey_string, i);
            }

            //------------------------------------------------------                  
            //paragraph
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
                survey_string = this.process_survey_mood(obj, survey_string, i);
            }


            //------------------------------------------------------
            //  mood-grid
            //------------------------------------------------------
            if (obj.type == 'moodgrid') {
                //survey_string = this.process_survey_moodgrid(survey_string, i);
            }

            if (obj.type == "moodgrid2") {
                survey_string = this.process_survey_moodgrid2(survey_string);
            }



            //------------------------------------------------------                  
            // Autocomplete 
            //------------------------------------------------------   
            // 'component-id="Q' + i + '" ' + 
            if (obj.type == 'autocomplete') {
                //survey_string = this.process_survey_autocomplete(obj, survey_string, i);
            }


            //------------------------------------------------------ 
            // radio button       
            //------------------------------------------------------            
            if (obj.type == "radiobutton") {
                survey_string = this.process_survey_radiobutton(obj, survey_string, i);
            }

            //------------------------------------------------------                  
            // range
            //------------------------------------------------------                 
            if (obj.type == "range") {
                //survey_string = this.process_survey_range(obj, survey_string, i);
            }

            if (obj.type == "range_time") {
                survey_string = this.process_survey_range_time(obj, survey_string, i);
            }

            if (obj.type == "range2") {
                //survey_string = this.process_survey_range2(obj, survey_string, i);
            }


            //------------------------------------------------------                  
            //checkbox  
            //------------------------------------------------------                 
            if (obj.type == "checkbox") {
                //survey_string = this.process_survey_checkbox(obj, survey_string, i);
                survey_string = this.process_survey_checkbox(obj, survey_string, i);
            }

            survey_string = survey_string + '</div>';
        }
        return survey_string;
    }

    process_survey_checkbox(obj: any, survey_string: string, i: any): string {
        // survey_string = survey_string + '<div class="radiovertical"><ul>';
        // /*
        // survey_string = [survey_string,
        //         '<li><input type="radio" id="option' + i + "I" + j + '" name="' + i + '" [(ngModel)]="surveyAnswersJSONObject.' + i + '" value=" ' + obj.extra.choices[j] + '" (change)="inputchanged(\'' + i + '\')">',
        //         '<label for="option' + i + "I" + j + '">' + obj.extra.choices[j] + '</label>',
        //         '<div class="check"></div></li>'
        //     ].join(" ");
        // */
        // for (var j = 0; j < obj.extra.choices.length; j++) {
        //     //survey_string = [survey_string, '<ion-checkbox style="border-color:#fff;border-width: 0px;" ng-model="survey.' + i + 'O' + j + '" ng-change="inputchanged(\'' + i + '\')"' + '>' + obj.extra.choices[j] + '</ion-checkbox>'].join(" ");
        //     //survey_string = [survey_string, '<ion-checkbox labelPlacement="end" [(ngModel)]="surveyAnswersJSONObject.' + i + 'O' + j + '"  (change)="inputChangedForCheckBox(\'' + i + '\')"' + '>' + obj.extra.choices[j] + '</ion-checkbox>'].join(" ");
        //     survey_string = [survey_string, 
        //         '<li><input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"><label for="vehicle1">' + obj.extra.choices[j] + '</label></li><br>'
        //     ].join(" ");
        // }
        // survey_string = survey_string + '</ul></div>';

        survey_string = survey_string + '<div class="checkboxvertical"><ul>';

        for (var j = 0; j < obj.extra.choices.length; j++) {
            survey_string = [survey_string,
                '<li><input type="checkbox" id="option' + i + "I" + j + '" name="' + i + 'O' + j + '" [(ngModel)]="surveyAnswersJSONObject.' + i + 'I' + j, 
                '" value=" ' + obj.extra.choices[j] + '" (change)="inputChangedForCheckBox(\'' + i + '\',\'' + i + 'I' + j + '\',\'' + obj.extra.choices[j] + '\', $event)">',
                '<label for="option' + i + "I" + j + '">' + obj.extra.choices[j] + '</label>',
                '<div class="checkb"></div></li>'
            ].join(" ");
        }

        // for (var j = 0; j < obj.extra.choices.length; j++) {
        //     survey_string = [survey_string,
        //         // '<input type="checkbox" id="option' + i + "I" + j + '" name="' + i + 'O' + j + '" [(ngModel)]="surveyAnswersJSONObject.' + i + 'O' + j + '" value=" ' + obj.extra.choices[j] + '" (change)="inputchanged(\'' + i + '\')">',
        //         // '<label for="option' + i + "I" + j + '">' + obj.extra.choices[j] + '</label>',
        //         // '<div class="checkb">',
        //         '<input type="checkbox">',
        //         '<label>',
        //             obj.extra.choices[j],
        //         '</label>'
        //     ].join(" ");
        // }

        survey_string = survey_string + '</ul></div>';


        return survey_string;
    }

    process_survey_range_time(obj: any, survey_string: string, i: any): string {
        //throw new Error("Method not implemented.");
        
        // "i" is the question string, i.e., Q1, Q2, etc.
        //
        var min = obj.extra.choices[2];
        var max = obj.extra.choices[3];
        var step = obj.extra.choices[4];
        this.surveyQuestionsDict[i + "_modified"] = obj.extra.choices[5]; //"12:00 AM";
        this.surveyQuestionsDict[i] = min;
        survey_string = [survey_string,
                    '<div class = "row" style="margin-bottom=0px;">',
                        /*
                        '<div class = "col col-10"><p align="center" style="padding-top:2px;padding-bottom:2px;margin:0px;border-radius:25px;background:#4e5dca;color:white;">' + min + '</p></div>',
                        */
                        '<div class = "col col-33"></div>',
                        '<div class = "col col-33 col-offset-8"><p align="center" style="padding-top:2px;padding-bottom:2px;margin:0px;border-radius:25px;background:#303F9F;color:white;"><b>{{surveyAnswersJSONObject.' + i + '_modified}}</b></p></div>',
                        '<div class = "col col-33"></div>',
                        /*
                        '<div class = "col col-10 col-offset-20"><p align="center" style="padding-top:2px;padding-bottom:2px;margin:0px;border-radius:25px;background:#4e5dca;color:white;">' + max + '</p></div>',
                        */
                    '</div>',
                    
                    '<div class="item range range-balanced" style="padding:10px;padding-top:1px;border-width:0px;">',
                        '<p style="text-align: center;color: black;">' + obj.extra.choices[0] + "</p>",
                        '<input type="range" min="' + min + '" max="' + max + '" value="' + min + '" step="' + step + '" [(ngModel)]="surveyAnswersJSONObject.' + i + '" name="' + i + '" (ngModelChange)="inputchangedRangeTime(\'' + i + '\',\'' + obj.extra.choices[0] + '\')"' + '>',
                        //'<input type="range" min="' + min + '" max="' + max + '" value="' + 0 + '" step="' + step + '" [(ngModel)]="surveyAnswersJSONObject.' + i + '" name="' + i + '" (ngModelChange)="inputchangedRangeTime(\'' + i + '\',\'' + obj.extra.choices[0] + '\')"' + '>',
                        //'<input type="range" min="' + min + '" max="' + max + '" value="' + min + '" step="' + step + '" name="' + i + '" (change)="inputchangedRangeTime(\'' + i + '\')"' + '>',
                        '<p style="text-align: center;color:black;">' + obj.extra.choices[1] + "</p>",
                    '</div>', 

            //'<ion-item><ion-range ngDefaultControl min="' + min + '" max="' + max + '" value="' + min + '" step="' + step + '" [(ngModel)]="survey2.' + i + '" name="' + i + '" (ionChange)="inputchanged(\'' + i + '\')"' + '>',
            //'<ion-item><ion-range ngDefaultControl min="' + min + '" max="' + max + '" value="' + min + '" step="' + step + '" name="' + i + '" (ionChange)="inputChangedWithEvent(\'' + i + '\', $event)"' + '>',
            
            /*
            '<ion-item><ion-range ngDefaultControl min="' + min + '" max="' + max + '" value="' + min + '" step="' + step + '" name="' + i + '" (change)="inputchanged(\'' + i + '\')"' + '>',
            
            '<ion-label slot="start">' + obj.extra.choices[0] + '</ion-label>',
            '<ion-label slot="end">' + obj.extra.choices[1] + '</ion-label>',
            '</ion-range>',
            '</ion-item>',
            */
          
        ].join(" ");
        console.log("process_survey_range_time" + JSON.stringify(obj));

        return survey_string;
    }


    // process survey if obj type is radiobutton
    process_survey_radiobutton(obj, survey_string, i) {
        //------------------------------------------------------ 
        //radio button, vertical     
        //------------------------------------------------------   

        if (obj.extra.orientation == "vertical") {
            survey_string = survey_string + '<div class="radiovertical"><ul>';

            for (var j = 0; j < obj.extra.choices.length; j++) {

                survey_string = [survey_string,
                    '<li><input type="radio" id="option' + i + "I" + j + '" name="' + i + '" [(ngModel)]="surveyAnswersJSONObject.' + i + '" value=" ' + obj.extra.choices[j] + '" (change)="inputchanged(\'' + i + '\')">',
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
                    '<li><input type="radio" id="option' + i + "I" + j + '" name="' + i + '" [(ngModel)]="surveyAnswersJSONObject.' + i + '" value="' + j + '" (change)="inputchanged(\'' + i + '\')">',
                    '<label for="option' + i + "I" + j + '"></label>',
                    '<div class="check"></div></li>'
                ].join(" ");
                //console.log("" + j + ", " + obj.extra.choices.length);
            }

            //ending text
            survey_string = survey_string + '<li><p>' + obj.extra.choices[obj.extra.choices.length - 1] + '</p></li>';
            survey_string = survey_string + '</ul></div>';
        }


        return survey_string;
    }

    process_survey_mood(obj, survey_string, i) {
        
        survey_string = [ survey_string, 
            '<div class="radioimages" style="display: inline;">',
            '<label style="display:inline;"><input type="radio" [(ngModel)]="surveyAnswersJSONObject.' + i + '" value="high-sad" (change)="inputchanged(\'' + i + '\')"/><img style="width:18%;" src="assets/img/5.png"></label>',
            '<label style="display:inline;"><input type="radio" [(ngModel)]="surveyAnswersJSONObject.' + i + '" value="low-sad" (change)="inputchanged(\'' + i + '\')"/><img style="width:18%;" src="assets/img/4.png"></label>',
            '<label style="display:inline;"><input type="radio" [(ngModel)]="surveyAnswersJSONObject.' + i + '" value="neutral" (change)="inputchanged(\'' + i + '\')"/><img style="width:18%;" src="assets/img/3.png"></label>',
            '<label style="display:inline;"><input type="radio" [(ngModel)]="surveyAnswersJSONObject.' + i + '" value="low-happy"  (change)="inputchanged(\'' + i + '\')"/><img style="width:18%;" src="assets/img/2.png"></label>',
            '<label style="display:inline;"><input type="radio" [(ngModel)]="surveyAnswersJSONObject.' + i + '" value="high-happy"  (change)="inputchanged(\'' + i + '\')"/><img style="width:18%;" src="assets/img/1.png"></label>',
            '</div>'].join(" ");
        
        // console.log("before\n" + survey_string)
        /*
        survey_string = [ survey_string, 
            '<img style="width:18%;" src="assets/img/5.png">'].join(" ");
        */
        // console.log("after\n" + survey_string)
        return survey_string;
    }

    process_survey_moodgrid2(survey_string: string): string {
        survey_string = [survey_string,
            '<canvas id="myCanvas" width="310" height="310" style="border:0px solid #000000;padding:10px;">',
                'Your browser does not support the HTML5 canvas tag.',
            '</canvas>'
          ].join(" ");

          return survey_string;
    }

    



    getAppVersionNumber() {
        //Get the app version to put inside the survey data. 
        //The goal of this app version number is to track in the backend that 
        //participants has the latest version of the app.
        this.appVersion.getVersionNumber().then(value => {
            this.versionNumber = value;
            console.log("VersionNumber: " + this.versionNumber);

            //store the version number to the userProfile
            this.userProfileService.versionNumber = this.versionNumber;
        }).catch(err => {
            console.log(err);
        });
    }

}

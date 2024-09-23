import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DemoAquariumComponent } from '../../incentive/aquarium/demo-aquarium/demo-aquarium.component';
import { Platform, AlertController, ModalController, NavController, MenuController } from '@ionic/angular';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../../user/user-profile/user-profile.service';
//import { myEnterAnimation } from '../../animations/modal_enter';
import { ModalUnlockedPageComponent } from '../../incentive/aquarium/modal-unlocked-page/modal-unlocked-page.component';
//import { myLeaveAnimation } from '../../animations/modal_leave';
import { AppState } from '../../reducers';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { isIncentivesUnlockedForTheDay } from '../../incentive/incentive.selectors';
import { UnlockedIncentive } from '../../incentive/model/unlocked-incentives';
import { unlockedScreenShownAlready } from '../incentive.actions';
import { DatabaseService } from 'src/app/monitor/database.service';
import { AwsS3Service } from '../../storage/aws-s3.service';
import embed from 'vega-embed';
import { Swiper } from 'swiper/types';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-aquarium',
    templateUrl: './aquarium.component.html',
    styleUrls: ['./aquarium.component.css']
})
export class AquariumComponent implements OnInit {

    private sub1$: any;
    private sub2$: any;
    money = 0;
    modalObjectNavigationExtras = {};
    pageTitle = "Aquarium";

    @ViewChild(DemoAquariumComponent, { static: true }) child;

    unlockedItems$: Observable<any>;
    modalDataSubscription$: any;
    title = "";
    isIOS = false;
    navigate: any;
    weeklyMed: any;
    altMsgsImages: any;
    memeImages: any;
    isAYA = true;

    @ViewChild('swiperContainer') swiperRefRewards: ElementRef | undefined;


    get isActive() {
        return true;
        /*
        // Disabling the isActive for Harvard study.
        if(this.userProfileService == undefined)
          return true;
        else
          return this.userProfileService.isActive;
        */
    }

    startCheatPage() {
        //this.router.navigate(['incentive/tundra']);
        this.navController.navigateRoot(['incentive/cheatpoints']);
    }

    startInfoPage() {
        this.navController.navigateRoot(['incentive/infopage']);
    }

    constructor(private platform: Platform, private alertCtrl: AlertController,
        private router: Router,
        private route: ActivatedRoute,
        private modalController: ModalController,
        private store: Store<AppState>,
        public navController: NavController,
        private menu: MenuController,
        private appUsageDb: DatabaseService,
        private awsS3Service: AwsS3Service,
        private userProfileService: UserProfileService,
        public httpClient: HttpClient) {
        console.log("Constructor called");
        this.sub1$ = this.platform.pause.subscribe(() => {
            console.log('****UserdashboardPage PAUSED****');
            this.child.pauseGameRendering();
        });
        this.sub2$ = this.platform.resume.subscribe(() => {
            console.log('****UserdashboardPage RESUMED****');
            this.child.resumeGameRendering();
        });


        if (window.localStorage['AwardDollar'] == undefined)
            this.money = 0;
        else {
            try {
                this.money = parseInt(window.localStorage['AwardDollar']);
            } catch (error) {
                window.localStorage.setItem("AwardDollar", "" + 0);
                this.money = 0;
            }
        }

        if (this.platform.is('ios')) {
            this.isIOS = true;
        }

        this.isAYA = true;
        if(this.userProfileService.isParent == true)
            this.isAYA = false;

        this.sideMenu();

        // //
        // this.weeklyMed = [
        //     {
        //         day: "Tue",
        //         date: 30,
        //         icon: "checkmark-circle",
        //         color: "green",
        //     },
        //     {
        //         day: "Wed",
        //         date: 1,
        //         icon: "checkmark-circle",
        //         color: "green",
        //     },
        //     {
        //         day: "Thu",
        //         date: 2,
        //         icon: "close-circle",
        //         color: "red",
        //     },
        //     {
        //         day: "Fri",
        //         date: 3,
        //         icon: "checkmark-circle",
        //         color: "green",
        //     },
        //     {
        //         day: "Sat",
        //         date: 4,
        //         icon: "checkmark-circle",
        //         color: "green",
        //     },
        //     {
        //         day: "Sun",
        //         date: 5,
        //         icon: "checkmark-circle",
        //         color: "green",
        //     },
        //     {
        //         day: "Today",
        //         date: 6,
        //         icon: "add-circle",
        //         color: "rebeccapurple",
        //     },
        // ];
    }

    fillMedicationWidget() {
        /*
        //
        this.weeklyMed = [
            {
                day: "Tu",
                date: 30,
                icon: "checkmark-circle",
                color: "green",
            },
            {
                day: "W",
                date: 1,
                icon: "checkmark-circle",
                color: "green",
            },
            {
                day: "Th",
                date: 2,
                icon: "close-circle",
                color: "red",
            },
            {
                day: "F",
                date: 3,
                icon: "checkmark-circle",
                color: "green",
            },
            {
                day: "Sa",
                date: 4,
                icon: "checkmark-circle",
                color: "green",
            },
            {
                day: "Su",
                date: 5,
                icon: "checkmark-circle",
                color: "green",
            },
            {
                day: "Today",
                date: 6,
                icon: "add-circle",
                color: "rebeccapurple",
            },
        ];
        */
        var events = [];
        var eventDateStrings = [];
        var eventDateIntakeStatus = [];

        // var lowestDate = 
        if (window.localStorage.getItem("eventSource") === null) {
            console.log("no events found");
            events = [];
            //this.createRandomEvents();
            console.log("--events: []");
        } else {
            console.log("events found");
            let events = JSON.parse(window.localStorage.getItem('eventSource'));
            var countData = events.length;
            for (var i = 0; i < countData; i++) {
                //convert string back to date objects.
                events[i].startTime = new Date(events[i].startTime);
                events[i].endTime = new Date(events[i].endTime);
                events[i].medicationIntakeTime = new Date(events[i].medicationIntakeTime);
                eventDateStrings.push(moment(events[i].endTime).format("YYYYMMDD"));
                eventDateIntakeStatus.push(events[i].symbolType);
            }
            console.log("--events: " + JSON.stringify(events[0]));
            console.log("--eventDateStrings: " + eventDateStrings);
            console.log("--eventDateIntakeStatus: " + eventDateIntakeStatus);
            //this.updateMedicationList();
        }

        //We will fill until the maxDateInEvents
        var maxDateInEvents = new Date("1970-01-01");
        for (var i = 0; i < events.length; i += 1) {
            if (maxDateInEvents.getTime() < events[i].startTime.getTime()) {
                maxDateInEvents = events[i].startTime;
            }
        }
        if (events.length == 0) {
            //get first day of survey as set as maxDateInEvents
            var dailySurveyHistory = this.userProfileService.userProfile.survey_data.daily_survey;
            if (Object.keys(dailySurveyHistory).length > 0) {//Survey is not empty
                var firstDateSurveyIsCompleted = moment().format('YYYYMMDD');
                var timestampeForFirstDataSurveyIsCompleted = moment(firstDateSurveyIsCompleted, "YYYYMMDD");
                var timestampDateForASurveyCompleted;
                for (var dateForASurveyCompleted in dailySurveyHistory) {
                    timestampDateForASurveyCompleted = moment(dateForASurveyCompleted, "YYYYMMDD");
                    if (timestampDateForASurveyCompleted < timestampeForFirstDataSurveyIsCompleted) {
                        firstDateSurveyIsCompleted = dateForASurveyCompleted;
                        timestampeForFirstDataSurveyIsCompleted = moment(firstDateSurveyIsCompleted, "YYYYMMDD");
                    }
                }
                maxDateInEvents = new Date(moment(firstDateSurveyIsCompleted, "YYYYMMDD").toDate().setHours(1, 1, 0, 0));
            } else {
                maxDateInEvents = new Date(new Date().setHours(0, 1, 0, 0));
            }
            //else set current date as maxDateInEvents; this is first day in study
        }
        console.log("--maxDateInEvents: " + maxDateInEvents);

        this.weeklyMed = []
        var ithDayFromCurrentdayMidnightUTC;
        let dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (var i = 6; i >= 0; i--) {
            ithDayFromCurrentdayMidnightUTC = new Date(new Date().setHours(-1 * 24 * i, 1, 0, 0));
            // console.log(ithDayFromCurrentdayMidnightUTC + ", " + ithDayFromCurrentdayMidnightUTC.getDate());
            // getDay()
            var med_obj = {
                day: dayName[ithDayFromCurrentdayMidnightUTC.getDay()],
                date: ithDayFromCurrentdayMidnightUTC.getDate(),
                icon: "ellipse",
                color: "gainsboro",
            };
            if (i == 0)
                med_obj['day'] = "Today";
            if (ithDayFromCurrentdayMidnightUTC > maxDateInEvents) {
                med_obj['icon'] = "close-circle";
                med_obj['color'] = "red";
            }
            if (i <= 2) {
                //ToDo: Handle study start day
                med_obj['icon'] = "add-circle";
                med_obj['color'] = "rebeccapurple";
            }
            let todaysDateString = moment(ithDayFromCurrentdayMidnightUTC).format("YYYYMMDD"); //ithDayFromCurrentdayMidnightUTC
            var elementPos = eventDateStrings.indexOf(todaysDateString);// eventDateStrings.map(function(x) {return x.id; }).indexOf(todaysDateString);
            //will return -1, if elementPos is not found.
            console.log("-- date to search: " + todaysDateString + ", " + elementPos);
            if (elementPos != -1) {
                console.log("-- date found: " + todaysDateString);
                let typeOfMark = eventDateIntakeStatus[elementPos];
                if (typeOfMark == 'checkmark') {
                    med_obj['icon'] = "checkmark-circle";
                    med_obj['color'] = "green";
                }
                if (typeOfMark == 'cross') {
                    med_obj['icon'] = "close-circle";
                    med_obj['color'] = "red";
                }
            }
            this.weeklyMed.push(med_obj);
        }
    }


    sideMenu() {
        this.navigate =
            [
                {
                    title: "Home",
                    url: "/home",
                    icon: "home"
                },
                {
                    title: "Chat",
                    url: "/chat",
                    icon: "chatboxes"
                },
                {
                    title: "Contacts",
                    url: "/contacts",
                    icon: "contacts"
                },
            ]
    }

    //show side menu
    showSideMenu() {
        console.log("side menu called");
        this.menu.enable(true, 'first');
        this.menu.open('first');
    }

    ionViewDidLeaveFunction() {
        this.child.ionViewDidLeaveFunction();

        //unsubscribe from model view.
        this.modalDataSubscription$.unsubscribe();
    }

    ionViewDidLeave() {
        console.log("aqarium.ts --- ionDidLeave");
        this.ionViewDidLeaveFunction();

        //If "Leave Aquarium" is already tracked in demo-aquarium, duplication?
        this.appUsageDb.saveAppUsageExit("aquarium_tab");
    }

    ionViewDidEnter() {

        console.log("aqarium.ts --- ionViewDidEnter");
        this.child.loadFunction();

        //
        // const value = window.localStorage.getItem("IsOnboarded");
        // if (typeof value === 'string') {
        //     console.log("--- Already onboarded ---");
        // }else{
        //     this.child.showBaselineDialog();
        //     window.localStorage.setItem('IsOnboarded', "Onboarded");
        // }

        //decide if we want to show the modal view with unlockables.
        this.subscribeForModalView();

        //If "Enter Aquarium" is already tracked in demo-aquarium, duplication?
        this.appUsageDb.saveAppUsageEnter("aquarium_tab");
        this.fillMedicationWidget();
        //
        this.userProfileService.saveToServer();
        this.userProfileService.saveProfileToDevice();
        this.saveDbToAWS();//This call is failing



        new Swiper(this.swiperRefRewards.nativeElement, {
            // Swiper options
            pagination: true
        });


    }

    async loadVegaDemoPlot() {
        console.log("===Vega called 2===");
        const spec = "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json";
        const result = await embed('#vis', spec);
        console.log(result.view);
    }

    //Upload SQLite database to AWS in ionViewWillEnter which happens
    //before "ionViewDidEnter" in demo-aquarium, thus the table will 
    //be empty first visit aquarium, will not be empty if user 
    //"come back" to aquarium after visit other pages and will 
    // be exported to AWS.
    //
    // --- Moving to ionViewDidEnter()
    //
    saveDbToAWS() {
        this.appUsageDb.isTableEmpty().then(tableEmpty => {
            console.log("tableEmpty: " + tableEmpty);
            if (!tableEmpty) {
                this.exportDatabase();
            }
        }).catch(e => {
            console.log("In ionViewWillEnter at Aqarium:" + e);
        });
    }

    exportDatabase() {
        console.log("exportTable at Aquarium Page!");
        this.appUsageDb.exportDatabaseToJson().then((res) => {
            console.log("upload to AWS at Aquarium Page: " + JSON.stringify(res));
            this.awsS3Service.upload("Tracking", res);

            //Empty table to prepare another round of tracking
            this.appUsageDb.emptyTable();

        });
    }

    ionViewWillUnload() {

    }

    ngOnInit(): void {

        /*
        this.route.queryParams.subscribe(params => {
          if (this.router.getCurrentNavigation().extras.state) {
            //throw new Error("Method not implemented.");
            //show modal on awards
            this.modalObjectNavigationExtras = this.router.getCurrentNavigation().extras.state.modalObjectNavigationExtras;
            console.log("home.page.ts --- modalObjectNavigationExtras: " + JSON.stringify(this.modalObjectNavigationExtras));
            if(this.modalObjectNavigationExtras['IsModalShownYet'] == false)
              this.showModal();
    
            
            //this.date = this.router.getCurrentNavigation().extras.state.date;
            //this.reinforcementObj['prob'] = this.router.getCurrentNavigation().extras.state.prob;
            //this.reinforcement_data = this.router.getCurrentNavigation().extras.state.reinforcement_data;         
            //console.log("Inside AwardAltruism, date is: " +this.date+" prob is: "+this.reinforcementObj['prob']);
          }
        }); 
        */


        this.title = "ADAPTS";
        //this.title = "SARA";
        console.log("aquarium.component.ts --- start");
        //this.menu.enable(true);

        //load vega demo plot (test)
        console.log("===Vega called 1===");
        //this.loadVegaDemoPlot();

        var dateArray = this.getDatesForLast7days();
        this.loadVegaDemoPlotMotivation(dateArray);

        //here load the memes and altruistic messages
        this.showAltMsgSwiper();
        this.showMemeSwiper();

    }

    showAltMsgSwiper() {
        
        var already_shown = window.localStorage["already_shown_alt_msg4"];
        if(already_shown == undefined){
            already_shown = {
                "last_updated": Date.now(),
                "last_updated_readable_ts": moment().format("MMMM Do YYYY, h:mm:ss a Z"),
                "unlocked_alt_msgs":[{"filename": "assets/altruism/altruism_1.png", "unlock_date": moment().format('MM/DD/YYYY')}]
            };
            window.localStorage["already_shown_alt_msg4"] = JSON.stringify(already_shown);
        }
        else
            already_shown = JSON.parse(window.localStorage["already_shown_alt_msg4"]);

        this.altMsgsImages = [];
        for(var i=0; i < already_shown['unlocked_alt_msgs'].length; i++){
            this.altMsgsImages.push(already_shown['unlocked_alt_msgs'][i]["filename"]);
        }
        if(already_shown['unlocked_alt_msgs'].length < 2){
            this.altMsgsImages.push("assets/img/less_alt_msg.png");
        } 

        // Write a for loop, add images, if short of 2 message then ask to complete more self-reports
        //this.altMsgsImages = ["./assets/memes/1.jpg", "./assets/memes/2.png", "./assets/memes/3.png", "./assets/memes/4.jpg"];
        
    }

    showMemeSwiper() {
        
        var already_shown = window.localStorage["already_shown_memes4"];
        if(already_shown == undefined)
            already_shown = {
                "last_updated": Date.now(),
                "last_updated_readable_ts": moment().format("MMMM Do YYYY, h:mm:ss a Z"),
                "unlocked_memes":[{"filename": "assets/memes/4.jpg", "unlock_date": moment().format('MM/DD/YYYY')}]
            };
        else
            already_shown = JSON.parse(window.localStorage["already_shown_memes4"]);

        this.memeImages = [];
        for(var i=0; i < already_shown['unlocked_memes'].length; i++){
            this.memeImages.push(already_shown['unlocked_memes'][i]["filename"]);
        }
        if(already_shown['unlocked_memes'].length < 2){
            this.memeImages.push("assets/img/less_memes.png");
        } 

        // Write a for loop, add images, if short of 2 message then ask to complete more self-reports
        //this.altMsgsImages = ["./assets/memes/1.jpg", "./assets/memes/2.png", "./assets/memes/3.png", "./assets/memes/4.jpg"];
        
    }

    async loadVegaDemoPlotMotivation(dateArray) {
        let x = window.innerWidth;
        let y = Math.ceil((24 / 20) * (x - 390) + 305);
        if (y < 200) {
            //this means the height is higher. The canvas will be skewed.
            y = y + 30;
        }
        if (y < 300) {
            //this means the width is lower than 300. The canvas will be skewed.
            y = y + 30;
        }
        console.log("width:x " + x);
        console.log("width:y " + y);
        console.log("window.devicePixelRatio " + window.devicePixelRatio);

        var opt = {
            actions: false,
            width: y + 10,
            height: 100
        };

        console.log("===Vega called 2===");
        const spec = "/assets/vegaspecs/demo_motivation.json";
        this.httpClient.get(spec)
            .subscribe(async (res: any) => {
                console.log("==========");
                for (let i = 0; i < 7; i++)
                    res["datasets"]["data-aac2a29e1b23308d5471fb5222ef6c6c"][i]["Date"] = dateArray[i];
                //console.log(res);
                const result = await embed('#vis2', res, opt);
                console.log(result.view);
            });
    }

    ngAfterViewInit(): void {
        // var swiper = new Swiper(this.swiperRefRewards?.nativeElement, {
        //     effect: "coverflow",
        //     grabCursor: true,
        //     centeredSlides: true,
        //     slidesPerView: "auto",
        //     coverflowEffect: {
        //       rotate: 50,
        //       stretch: 0,
        //       depth: 100,
        //       modifier: 1,
        //       slideShadows: true,
        //     },
        //     pagination: {
        //       el: ".swiper-pagination",
        //     },
        //   });

    }

    ngOnDestroy() {
        this.sub1$.unsubscribe();
        this.sub2$.unsubscribe();

        this.ionViewDidLeaveFunction();
        console.log("aquarium.component.ts --- destroy");
    }

    subscribeForModalView() {
        //this.unlockedItems$ = 
        this.modalDataSubscription$ = this.store.pipe(select(isIncentivesUnlockedForTheDay))
            .subscribe(params => {
                if (params == undefined)
                    console.log("---params: undefined---" + JSON.stringify(params))
                else {
                    console.log("---params: ---" + JSON.stringify(params))
                    var unlockedIncentive: UnlockedIncentive = params;
                    //computeUnlockedReinforcements(currentPoints, previousPoints, awardedDollar)

                    if (unlockedIncentive['isBaselineSurvey'] == true)
                        return; //we will not be giving any reinforcement. Nor, will we say, isUnlockedViewShown is true;

                    if (unlockedIncentive["isUnlockedViewShown"] == false)
                        this.computeUnlockedReinforcements(unlockedIncentive["current_point"],
                            unlockedIncentive["current_point"] - unlockedIncentive["unlocked_points"],
                            unlockedIncentive["unlocked_money"]);
                }
            }
            );
    }

    startSurveySleep() {
        this.navController.navigateRoot(['survey/sleepsurvey']);
    }

    startSurveyEvening() {
        this.navController.navigateRoot(['survey/sleepeveningsurvey']);
    }

    startAYASurvey() {
        this.navController.navigateRoot(['survey/samplesurvey2']);
    }

    startSurvey() {
        console.log('start survey');
        var currentTime = moment();
        var startTime = moment({ hour: 18 });  // 6pm
        var endTime = moment({ hour: 23, minute: 59 });  // 11:59pm
        var firstLogin = this.userProfileService.userProfile.firstlogin;
        if (firstLogin == undefined) firstLogin = true;
        this.userProfileService.userProfile.firstlogin = false;
        this.userProfileService.saveProfileToDevice();
        this.userProfileService.saveToServer();
        if (!currentTime.isBetween(startTime, endTime) && !firstLogin) {
            this.presentAlert('Please come back between 6 PM and midnight');
        } else if (this.userProfileService.surveyTakenForCurrentDay()) {
            this.presentAlert('You have already completed the survey for the day.');
        } else {
            if (this.userProfileService.isParent) {
                this.navController.navigateRoot(['survey/samplesurvey']);  //caregiversurvey
            } else {
                this.navController.navigateRoot(['survey/samplesurvey2']);  //aya
            }

        }
    }

    startSurveyTimeUnrestricted() {
        if (this.userProfileService.isParent) {
            this.navController.navigateRoot(['survey/samplesurvey']);  //caregiversurvey
        } else {
            this.navController.navigateRoot(['survey/samplesurvey2']);  //aya
        }
    }



    startSleepSurvey() {
        console.log('start survey');
        var currentTime = moment();
        let startTimeSleep = moment({ hour: 8 });  // 8am
        let endTimeSleep = moment({ hour: 17, minute: 59 });  // 1:59pm
        let startTimeEveningReflection = moment({ hour: 18 });  // 6pm
        let endTimeEveningReflection = moment({ hour: 23, minute: 59 });  // 11:59pm

        var firstLogin = this.userProfileService.userProfile.firstlogin;
        if (firstLogin == undefined) firstLogin = true;
        this.userProfileService.userProfile.firstlogin = false;
        this.userProfileService.saveProfileToDevice();
        this.userProfileService.saveToServer();


        if (!currentTime.isBetween(startTimeSleep, endTimeSleep) &&
            !currentTime.isBetween(startTimeEveningReflection, endTimeEveningReflection) &&
            !firstLogin) {
            this.presentAlert('We are outside of a time-window to complete surveys. Sleep surveys are open between 8am and 6pm. Evening self-reflections are open between 6pm and midnight.');
            // } 
            // Disabling the following since we don't have any surveyTakenForCurrentDay for
            // two surveys.
            //else if(this.userProfileService.surveyTakenForCurrentDay()) {
            //  this.presentAlert('You have already completed the survey for the day.');
        } else {
            if (currentTime.isBetween(startTimeSleep, endTimeSleep)) {
                this.navController.navigateRoot(['survey/sleepsurvey']);
                //this.navController.navigateRoot(['survey/sleepeveningsurvey']);
                //this.navController.navigateRoot(['survey/sleepsurveywithprediction']);
            } else if (currentTime.isBetween(startTimeEveningReflection, endTimeEveningReflection)) {
                this.navController.navigateRoot(['survey/sleepeveningsurvey']);
            } else {
                //means we are at first login and outside of the window
                //ideally this can happen only between 2-6pm. 
                //We show the sleep survey in this case.
                this.navController.navigateRoot(['survey/sleepsurvey']);
            }
        }
    }

    async openSurvey(location) {
        this.navController.navigateRoot([location]);
    }

    async presentAlert(alertMessage) {

        const alert = await this.alertCtrl.create({
            //<div style="font-size: 20px;line-height: 25px;padding-bottom:10px;text-align:center">Thank you for completing the survey. You have unlocked a meme.</div>
            //header: '<div style="line-height: 25px;padding-bottom:10px;text-align:center">Daily survey unavilable</div>',
            header: 'Daily survey unavailable',
            //subHeader: "Survey is not avaibable!",
            message: alertMessage,
            //defined in theme/variables.scss
            //buttons: [{text: 'OK', cssClass: 'secondary'}]
            buttons: [{ text: 'OK' }]
        });

        /*
          let alert = this.alertCtrl.create({
            title: 'Low battery',
            subTitle: '10% of battery remaining',
            buttons: ['Dismiss']
          });
        */

        //----
        await alert.present();
    }

    dispalySurveyPausedMsg() {
        this.presentAlert('This account has been temporarily paused by the research administrators.');
    }


    showMemeDemo() {
        this.router.navigate(['incentive/award-memes']);
    }

    showAltruisticDemo() {
        this.router.navigate(['incentive/award-altruism']);
    }

    //showHarvardSurvey(){
    //  this.navController.navigateRoot(['survey/harvardsurvey']);
    //}

    showSleepSurvey() {
        this.navController.navigateRoot(['survey/sleepsurvey']);
    }

    showDogsSurvey() {
        this.navController.navigateRoot(['survey/dogssurvey']);
    }


    showHarvardArcApps() {
        this.router.navigate(['intervention/arcappsfrontpage']);
    }

    showPythonLifeInsight() {
        this.router.navigate(['incentive/pythonlifeinsightsammple']);
    }

    showModalDemo() {
        var reinforcements = [];
        reinforcements.push({ 'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?" });
        reinforcements.push({ 'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?" });
        reinforcements.push({ 'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?" });
        //reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
        //reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
        //reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
        //reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
        //reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
        reinforcements.push(
            {
                'img': './assets/altruism/message_3.png',
                'header': 'reinforcement_data',
                'text': 'This is the meme/life-insight/thank you message data.'
            }
        );
        this.presentModal(reinforcements);
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


    //show unlocked pages, using a modal
    /*
    async presentModal(reinforcements) {
      const modal = await this.modalController.create({
        component: ModalUnlockedPageComponent,
        componentProps: {
          'reinforcements': reinforcements
        },
        enterAnimation: myEnterAnimation,
        leaveAnimation: myLeaveAnimation,
        //,
        cssClass: 'my-default-2'
      });
      return await modal.present();
    }
    */
    async presentModal(reinforcements) {
        const modal = await this.modalController.create({
            component: ModalUnlockedPageComponent,
            componentProps: {
                'reinforcements': reinforcements
            },
            //,
            cssClass: 'unloacked-incentives'
        });
        return await modal.present();
    }


    showModal() {
        //if(window.localStorage['IsModalShown'] == undefined)
        //  return;

        //if(window.localStorage['IsModalShown'] == "false"){

        //
        var todaysDate = moment().format('YYYYMMDD');
        var storedDate = this.modalObjectNavigationExtras["LastSurveyCompletionDate"];

        //
        if (todaysDate == storedDate) {
            //this.computeUnlockedReinforcements();
        }

        //
        //window.localStorage.setItem("IsModalShown", "true");
        //}
    }



    isFirstDayInTheStudy() {

        var daily_survey = this.userProfileService.userProfile.survey_data.daily_survey;
        var first_date = moment().format('YYYYMMDD');
        var first_date_moment_js = moment(first_date, "YYYYMMDD");
        var key_moment_js;
        for (var key in daily_survey) {
            key_moment_js = moment(key, "YYYYMMDD");
            //takes the first day only. But it may not be the first date.
            if (key_moment_js < first_date_moment_js) {
                first_date = key;
                first_date_moment_js = moment(first_date, "YYYYMMDD");
            }
        }

        var todays_date = moment().format('YYYYMMDD');
        if (todays_date == first_date)
            return true;
        else
            return false;
    }

    computeUnlockedReinforcements(currentPoints, previousPoints, awardedDollar) {

        //var currentPoints = this.modalObjectNavigationExtras["CurrentPoints"];
        //var previousPoints = this.modalObjectNavigationExtras["PreviousPoints"];
        //var awardedDollar = this.modalObjectNavigationExtras["AwardedDollar"];
        var reinforcements = [];
        console.log("computeUnlockedReinforcements: called");

        //get if money is awarded.
        if (awardedDollar > 0) {
            if (this.isFirstDayInTheStudy())
                //reinforcements.push({'img': 'assets/img/1dollar.jpg', 'header': 'You earned ' + awardedDollar + ' dollar(s)', 'text': 'Thanks for being a participant in the study. You earned 2 dollar.'});
                reinforcements.push({ 'img': 'assets/img/1dollar.jpg', 'header': 'You earned money', 'text': 'Thanks for completing your first survey! You earned 2 dollars.' });
            else {
                if (awardedDollar == 1) //hack, 1 dollar is only awarded after a three-day streak.
                    reinforcements.push({ 'img': 'assets/img/1dollar.jpg', 'header': 'You earned money', 'text': 'Thanks for surveys three days in a row! You earned 1 dollar.' });

                if (awardedDollar == 2) //hack, 2 dollar is only awarded after a break.
                    reinforcements.push({ 'img': 'assets/img/1dollar.jpg', 'header': 'You earned money', 'text': 'Thanks for coming back after a break! You earned 2 dollars.' });
            }
        }

        //get reinforcement data
        var reinforcementData = JSON.parse(window.localStorage['reinforcement_data']);
        let currentDate = moment().format('YYYYMMDD');
        if ((currentDate == reinforcementData["date"]) && (reinforcementData['type_of_rewards'] != 'No reward')) {
            reinforcements.push(
                {
                    'img': reinforcementData['reward_file_link'],
                    'header': 'reinforcement_data',
                    'text': 'This is the meme/life-insight/thank you message data.'
                }
            );
        }

        //get if fish is alotted
        previousPoints = currentPoints - 60;
        console.log(currentPoints + ", " + previousPoints);

        fetch('../../../assets/game/fishpoints.json').then(async res => {
            //console.log("Fishes: " + data);

            var fish_data = await res.json();
            var img;
            var header;
            var text;
            for (var i = 0; i < fish_data.length; i++) {
                if ((fish_data[i].points > previousPoints) && (fish_data[i].points <= currentPoints)) {
                    img = "assets/" + fish_data[i].img.substring(0, fish_data[i].img.length - 4) + '_tn.jpg';
                    header = "You have now unlocked the " + fish_data[i].name;
                    text = fish_data[i].trivia;
                    reinforcements.push({ 'img': img, 'header': header, 'text': text });
                }
            }
            console.log("reinforcements: " + JSON.stringify(reinforcements));
            if (reinforcements.length > 0)//means some rainforcement was provided.
                this.presentModal(reinforcements);
        });

        //update the state reinforcement
        this.store.dispatch(unlockedScreenShownAlready({ isUnlockedScreenShown: true }));
    }



}

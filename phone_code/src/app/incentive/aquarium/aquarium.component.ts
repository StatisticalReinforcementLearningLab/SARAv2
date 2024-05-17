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

        this.sideMenu();

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
        const value = window.localStorage.getItem("IsOnboarded");
        if (typeof value === 'string') {
            console.log("--- Already onboarded ---");
        }else{
            this.child.showBaselineDialog();
            window.localStorage.setItem('IsOnboarded', "Onboarded");
        }

        //decide if we want to show the modal view with unlockables.
        this.subscribeForModalView();

        //If "Enter Aquarium" is already tracked in demo-aquarium, duplication?
        this.appUsageDb.saveAppUsageEnter("aquarium_tab");

        //
        this.userProfileService.saveToServer();
        this.userProfileService.saveProfileToDevice();
        this.saveDbToAWS();

        

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
                for(let i=0; i<7; i++)
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

                    if (unlockedIncentive["isUnlockedViewShown"] == false)
                        this.computeUnlockedReinforcements(unlockedIncentive["current_point"],
                            unlockedIncentive["current_point"] - unlockedIncentive["unlocked_points"],
                            unlockedIncentive["unlocked_money"]);
                }
            }
            );
    }

    startSurveySleep(){
        this.navController.navigateRoot(['survey/sleepsurvey']);
    }

    startSurveyEvening(){
        this.navController.navigateRoot(['survey/sleepeveningsurvey']);
    }

    startAYASurvey(){
        this.navController.navigateRoot(['survey/samplesurvey2']);
    }


    startSurvey() {
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
        this.presentModal(reinforcements);
    }

    getDatesForLast7days(){
        var dateArray = [];
        for (let i = 0; i < 6; i++) {
            var previousdate = moment().subtract(6-i, "days").format("MM/DD");
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
        console.log("computeUnlockedReinforcements: called")

        //get if money is awarded.
        if(awardedDollar > 0){
            if(this.isFirstDayInTheStudy())
                //reinforcements.push({'img': 'assets/img/1dollar.jpg', 'header': 'You earned ' + awardedDollar + ' dollar(s)', 'text': 'Thanks for being a participant in the study. You earned 2 dollar.'});
                reinforcements.push({'img': 'assets/img/1dollar.jpg', 'header': 'You earned money', 'text': 'Thanks for completing your first survey! You earned 2 dollars.'});
            else{
                if(awardedDollar == 1) //hack, 1 dollar is only awarded after a three-day streak.
                    reinforcements.push({'img': 'assets/img/1dollar.jpg', 'header': 'You earned money', 'text': 'Thanks for surveys three days in a row! You earned 1 dollar.'});

                if(awardedDollar == 2) //hack, 2 dollar is only awarded after a break.
                    reinforcements.push({'img': 'assets/img/1dollar.jpg', 'header': 'You earned money', 'text': 'Thanks for coming back after a break! You earned 2 dollars.'});
            }
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

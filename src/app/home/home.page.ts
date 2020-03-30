import { Component, ViewChild, OnInit } from '@angular/core';
import { DemoAquariumComponent } from '../incentive/aquarium/demo-aquarium/demo-aquarium.component';
import { Platform, AlertController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../user/user-profile/user-profile.service';
import { myEnterAnimation } from '../animations/modal_enter';
import { ModalUnlockedPageComponent } from '../incentive/aquarium/modal-unlocked-page/modal-unlocked-page.component';
import { myLeaveAnimation } from '../animations/modal_leave';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

//@PreLoad('aquarium')
export class HomePage implements OnInit {

  private sub1$:any;
  private sub2$:any;
  money = 0;

  @ViewChild(DemoAquariumComponent, {static: true}) child;



  get isActive(){
    //return false;
    if(this.userProfileService == undefined)
      return true;
    else
      return this.userProfileService.isActive;
  }

  startCheatPage(){
    //this.router.navigate(['incentive/tundra']);
    this.router.navigate(['incentive/cheatpoints']);
  }

  constructor(private platform: Platform, private alertCtrl: AlertController, 
    private router: Router, 
    private route: ActivatedRoute, 
    private modalController: ModalController,
    private userProfileService: UserProfileService) { 
    console.log("Constructor called");
    this.sub1$=this.platform.pause.subscribe(() => {        
      console.log('****UserdashboardPage PAUSED****');
      this.child.pauseGameRendering();
    });  
    this.sub2$=this.platform.resume.subscribe(() => {      
      console.log('****UserdashboardPage RESUMED****');
      this.child.resumeGameRendering();
    });


    if(window.localStorage['AwardDollar'] == undefined)
        this.money = 0;
    else
        this.money = parseInt(window.localStorage['AwardDollar']);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        //throw new Error("Method not implemented.");
        //show modal on awards
        if(this.router.getCurrentNavigation().extras.state.IsShowModal == true)
          this.showModal();
        //this.date = this.router.getCurrentNavigation().extras.state.date;
        //this.reinforcementObj['prob'] = this.router.getCurrentNavigation().extras.state.prob;
        //this.reinforcement_data = this.router.getCurrentNavigation().extras.state.reinforcement_data;         
        //console.log("Inside AwardAltruism, date is: " +this.date+" prob is: "+this.reinforcementObj['prob']);
      }
    }); 
      
  }

  ionViewDidLeave(){
    console.log("ionDidLeave");
    this.child.ionViewDidLeaveFunction();
  }

  ionViewDidEnter() {
    this.child.loadFunction();
  }

  ionViewWillUnload() {
    this.sub1$.unsubscribe();
    this.sub2$.unsubscribe();
  }

  ngOnInit(): void {
    
  }


  startSurvey(){
    console.log('start survey');
    var currentTime = moment(); 
    var startTime = moment({hour: 18});  // 6pm
    var endTime = moment({hour: 23, minute: 59});  // 11:59pm
    if(!currentTime.isBetween(startTime, endTime)) {
      this.presentAlert('Survey is only available between 6PM and midnight');
    } else if(this.userProfileService.surveyTakenForCurrentDay()) {
      this.presentAlert('You have already completed the survey for the day.');
    } else {
      if (this.userProfileService.isParent){
        this.router.navigate(['survey/samplesurvey']);  //caregiversurvey
      } else{
        this.router.navigate(['survey/samplesurvey2']);  //aya
      }
      /*
      this.ga.trackEvent('Start survey Button', 'Tapped Action', 'Loading survey', 0)
      .then(() => {console.log("trackEvent for Start survey Button!")})
      .catch(e => alert("trackEvent for Start survey Button=="+e));
      */
    } 
  }

  async openSurvey(location){
    this.router.navigate([location]);
  }

  async presentAlert(alertMessage) {
    
    const alert = await this.alertCtrl.create({
      //<div style="font-size: 20px;line-height: 25px;padding-bottom:10px;text-align:center">Thank you for completing the survey. You have unlocked a meme.</div>
      //header: '<div style="line-height: 25px;padding-bottom:10px;text-align:center">Daily survey unavilable</div>',
      header: 'Daily survey unavilable',
      //subHeader: "Survey is not avaibable!",
      message: alertMessage,
      //defined in theme/variables.scss
      //buttons: [{text: 'OK', cssClass: 'secondary'}]
      buttons: [{text: 'OK'}]
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

  dispalySurveyPausedMsg(){
    this.presentAlert('This account has been temporarily paused by the research administrators.');    
  }


  showMemeDemo(){
    this.router.navigate(['incentive/award-memes']);
  }

  showAltruisticDemo(){
    this.router.navigate(['incentive/award-altruism']);
  }

  showModalDemo(){
    var reinforcements =  [];
    reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
    reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
    reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
    //reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
    //reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
    //reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
    //reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
    //reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});
    this.presentModal(reinforcements);
  }


  //show unlocked pages, using a modal
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


  showModal(){
    //if(window.localStorage['IsModalShown'] == undefined)
    //  return;

    //if(window.localStorage['IsModalShown'] == "false"){

    //
    var todaysDate = moment().format('YYYYMMDD');
    var storedDate = window.localStorage['LastSurveyCompletionDate'];

    //
    if(todaysDate == storedDate){
      this.computeUnlockedReinforcements();
    } 

    //
    //window.localStorage.setItem("IsModalShown", "true");
    //}
  }

  

  isFirstDayInTheStudy(){

    var daily_survey = this.userProfileService.userProfile.survey_data.daily_survey;
    var first_date = moment().format('YYYYMMDD');
    var first_date_moment_js = moment(first_date,"YYYYMMDD");
    var key_moment_js;
    for (var key in daily_survey) {
        key_moment_js = moment(key,"YYYYMMDD");
        //takes the first day only. But it may not be the first date.
        if (key_moment_js < first_date_moment_js) {
            first_date = key;
            first_date_moment_js = moment(first_date,"YYYYMMDD");
        }
    }

    var todays_date = moment().format('YYYYMMDD');
    if(todays_date == first_date)
      return true;
    else
      return false;
  }

  computeUnlockedReinforcements(){

    var currentPoints = parseInt(window.localStorage['CurrentPoints']);
    var previousPoints = parseInt(window.localStorage['PreviousPoints']);
    var awardedDollar = parseInt(window.localStorage['AwardedDollar']);
    var reinforcements = [];

    //get if money is awarded.
    if(awardedDollar > 0){
      if(this.isFirstDayInTheStudy())
        reinforcements.push({'img': 'assets/img/1dollar.jpg', 'header': 'You earned ' + awardedDollar + ' dollar(s)', 'text': 'Thanks for being a participant in the study. You earned 2 dollar.'});
      else
        reinforcements.push({'img': 'assets/img/1dollar.jpg', 'header': 'You earned ' + awardedDollar + ' dollar(s)', 'text': 'You earned 1 dollar for completing surveys 3-days in a row'});
    }
      
    //get if fish is alotted
    var previous_point = currentPoints - 60;

    fetch('../../../assets/game/fishpoints.json').then(async res => {
      //console.log("Fishes: " + data);

      var fish_data = await res.json();
      var img; 
      var header;
      var text;
      for(var i = 0; i < fish_data.length; i++) {
          if ((fish_data[i].points > previous_point) && (fish_data[i].points <= currentPoints)) {
            img = "assets/" + fish_data[i].img.substring(0, fish_data[i].img.length-4) + '_tn.jpg';
            header =  "You unlocked " + fish_data[i].name;
            text = fish_data[i].trivia;
            reinforcements.push({'img': img, 'header': header, 'text': text});
          }
      }
      console.log(JSON.stringify(reinforcements));
      if(reinforcements.length > 0)//means some rainforcement was provided.
        this.presentModal(reinforcements);
    });
  }


  
}

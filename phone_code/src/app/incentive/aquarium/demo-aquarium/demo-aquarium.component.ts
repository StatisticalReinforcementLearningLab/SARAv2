import { Component, OnInit, Input } from '@angular/core';

import { BootL1 } from '../levels/FishBowlL1/Boot';
import { PreloaderL1 } from '../levels/FishBowlL1/Preloader';
import { FishBowlL1 } from '../levels/FishBowlL1/Game';


import { BootL2 } from '../levels/FishBowlL2/Boot';
import { PreloaderL2 } from '../levels/FishBowlL2/Preloader';
import { FishBowlL2 } from '../levels/FishBowlL2/Game';


import { BootL3 } from '../levels/SeaLevelL3/Boot';
import { PreloaderL3 } from '../levels/SeaLevelL3/Preloader';
import { SeaLevelL3 } from '../levels/SeaLevelL3/Game';


import { BootL4 } from '../levels/SeaLevelL4/Boot';
import { PreloaderL4 } from '../levels/SeaLevelL4/Preloader';
import { SeaLevelL4 } from '../levels/SeaLevelL4/Game';


import { BootGameOver } from '../levels/GameOver/Boot';
import { PreloaderGameOver } from '../levels/GameOver/Preloader';
import { GameOver } from '../levels/GameOver/GameOver';


import { BootTundraL5 } from '../levels/TundraLevelL5/Boot';
import { PreloaderTundraL5 } from '../levels/TundraLevelL5/Preloader';
import { GameTundraL5 } from '../levels/TundraLevelL5/Game';


import { BootTundraL51 } from '../levels/TundraLevelL51/Boot';
import { PreloaderTundraL51 } from '../levels/TundraLevelL51/Preloader';
import { GameTundraL51 } from '../levels/TundraLevelL51/Game';

import { BootRainforestL6 } from '../levels/RainforestL6/Boot';
import { PreloaderRainforestL6 } from '../levels/RainforestL6/Preloader';
import { GameRainforestL6 } from '../levels/RainforestL6/Game';


import { ActivatedRoute, Router, RouterEvent, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
//import { PreLoad } from '../../../PreLoad';
import { Platform, ModalController } from '@ionic/angular';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';
import { ModalUnlockedPageComponent } from '../modal-unlocked-page/modal-unlocked-page.component';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

declare let Phaser: any;

@Component({
  selector: 'app-demo-aquarium',
  templateUrl: './demo-aquarium.component.html',
  styleUrls: ['./demo-aquarium.component.less'],
})

//@PreLoad('survey')
export class DemoAquariumComponent implements OnInit {
  

  game;
  pickedGame;
  isLoaded = false;
  public isShowingRouteLoadIndicator: boolean;
  survey_text; 
  fishFunFactListViewItems = [];
  @Input() isPreview: string;
  debugText: String;
  
  // totalPoints = 0;
  get totalPoints(){
    return this.userProfileService.points;
  }

  get username(){
    if(this.userProfileService == undefined)
      return "test";
    else{
      return this.userProfileService.username;
    }
  }

  get oneSignalId(){
    if(this.userProfileService == undefined)
      return "oneSignalId: null";
    else{
      return "oneSignalId: " + this.userProfileService.oneSignalPlayerId;
    }
  }
  
  //Get total submitted survey
  getTotalSurveyCount(){
    return Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length;
  }

  /* Get last seven days of indicator for survey completion, 
  return an array of 7 elements like [0, 1, 0, 0, 0, 1, 0] 
  with 1 indicating submitted survey, 0 otherwise, the first
  element is current day. */

  getIndicatorForSurveyDone(){
    var daily_survey = this.userProfileService.userProfile.survey_data.daily_survey;

    console.log("daily_survey:");
    console.log(JSON.stringify(daily_survey));
    var indicatorArray = [];

    //daily_survey = {};
    if(Object.keys(daily_survey).length == 0){
      indicatorArray.push(0);
      return indicatorArray;
    }
      
    const orderedDatesKeys = Object.keys(daily_survey).sort()
    var first_date = orderedDatesKeys[0];
    //first_date = "20200515";

    for(let i = 0; i < 7; i++) {
      var previousdate = moment().subtract(i, "days").format("YYYYMMDD");
      //console.log(JSON.stringify(this.userProfileService.userProfile.survey_data.daily_survey));
      var indicator = 0;
      if(previousdate in daily_survey){
        indicator = 1;
      }
      indicatorArray.push(indicator);

      // as may days user is in in the study. no blank filling
      if(first_date == previousdate)
        break;
    }


    return indicatorArray;

  }

/*   get surveyPath(){
    if (this.userProfileService.isParent){
      return "survey/samplesurvey"; //"/survey/caregiversurvey"
    } else{
      return "survey/samplesurvey2"; //"/survey/ayasurvey"
    }
  } */


  constructor(private router: Router, 
    private alertCtrl: AlertController,
    private modalController: ModalController,
    //private pickGameService: PickGameService,
    private platform: Platform,
    private route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private httpClient: HttpClient) { 
    console.log("Constructor called");
    
    /*    
      this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.totalPoints = this.router.getCurrentNavigation().extras.state.totalPoints;
        console.log("Pass totalPoints: "+this.totalPoints);
      }
    }); 
    */

    this.survey_text = "Start Survey";
    this.debugText = "";
    //this.username = "test";
  }




  showInfoModal(text){
    console.log("rewards page");
    var header_text = "Survey Completion Bar";
    text = " Shows the number of surveys you have completed in the past week (shown as green) and the ones you missed (shown as gray)."
    this.presentAlert(text, header_text);
  }


  goToRewardsPage(){
    console.log("rewards page");
    //this.router.navigate(['/home']);
    this.router.navigate(['incentive/treasurechest']);
  }

  

  //preload the images
  preload(){
    console.log("Preload called");
    this.game.load.image('einstein','assets/pics/ra_einstein.png');
  }

  //gets executed after preload
  create(){
    console.log(window.localStorage['TotalPoints']);
    //this.totalPoints = parseInt(window.localStorage['TotalPoints'] || "0");

    /*
    if(window.localStorage['TotalPoints'] == undefined)
        this.totalPoints = 0;
    else
        this.totalPoints = parseInt(window.localStorage['TotalPoints']);
    */

    console.log("Inside Aquarium totalPoints: "+this.totalPoints);

    console.log("create called");
    var s = this.game.add.sprite(80,9,'einstein');
    s.rotation = 0.14;
  }

  

  ngOnInit() {
     //this.loadFunction();
    
    this.sendUserIdToServerFor8PMNotification();


    this.addFishFunFactsBelow();

    //get inspirational quotes
    this.getInspirationalQuotes();
  }


  getInspirationalQuotes() {
    var flaskServerAPIEndpoint = environment.flaskServerForIncentives;
    this.httpClient.post(flaskServerAPIEndpoint + '/get-inspirational-quote', { "user_id": 'mash_aya' }).subscribe({
        next: data => console.log("Inspirational quote: " + JSON.stringify(data)),
        error: error => console.error('There was an error!', error)
    });
  }



  addFishFunFactsBelow() {
    //add the fish fun facts below:


    if(this.totalPoints <1060 && this.totalPoints >= 0) //fishbowl
      this.addFishFunFactsBetween(0, this.totalPoints);
    
    else if(this.totalPoints >=1060 && this.totalPoints <2120) //sea
      this.addFishFunFactsBetween(1060, this.totalPoints);

    else if(this.totalPoints >=2120 && this.totalPoints <3020) //tundra
      this.addFishFunFactsBetween(2120, this.totalPoints);

    else if(this.totalPoints >= 3020) //rainforest
      this.addFishFunFactsBetween(3020, this.totalPoints);

  }

  addFishFunFactsBetween(startPoint: number, totalPoints: number) {

    fetch('../../../../assets/game/fishpoints.json').then(async res => {
      //console.log("Fishes: " + data);

      var data = await res.json();
      var current_points = 700;
      var fishFunFactListViewItem = {};
      for(var i = 0; i < data.length; i++) {

          if(data[i].points < startPoint)
            continue;

          if(totalPoints < data[i].points)
            continue;
          // break;

          fishFunFactListViewItem = {
              funFact: data[i].trivia,
              image: "assets/" + data[i].img.substring(0, data[i].img.length-4) + '_tn.jpg',
              fishName: data[i].name
          };

          this.fishFunFactListViewItems.push(fishFunFactListViewItem);
          
      }
      this.fishFunFactListViewItems = this.fishFunFactListViewItems.reverse();
    });
  }

  async sendUserIdToServerFor8PMNotification(){
    // Simple POST request with a JSON body and response type <any>

    console.log("--aquarium-- " + "sendUserIdToServerFor8PMNotification");
    var oneSignalPlayerId = window.localStorage['oneSignalPlayerId']; //this.userProfileService.oneSignalPlayerId;
    if(oneSignalPlayerId=="null" || oneSignalPlayerId==null || oneSignalPlayerId==undefined){
      console.log("oneSignalId is null, " + oneSignalPlayerId);
      return;
    }
      

    var username = this.userProfileService.username;
    var currentTimeTs = Date.now();
    var currentTimeReadableTs = moment().format("MMMM Do YYYY, h:mm:ss a Z");
    const headers = { "Content-Type": "application/json;charset=UTF-8"};
    const body = {"user_id": username, "oneSignalPlayerId": oneSignalPlayerId, "currentTimeTs": currentTimeTs, "currentTimeReadableTs": currentTimeReadableTs};
    /*
    this.httpClient.post<any>("http://ec2-54-91-131-166.compute-1.amazonaws.com:56733/store-onesignal-id", body, { headers }).subscribe({
      next: data => console.log(data),
      error: error => console.error('There was an error!', error)
    });
    */
    var flaskServerAPIEndpoint = environment.flaskServerForIncentives;
    this.httpClient.post(flaskServerAPIEndpoint + "/store-onesignal-id", body)
      .subscribe({
        next: data => console.log("--aquarium-- " + JSON.stringify(data)),
        error: error => console.error('There was an error!', error)
    });
  }

  ionViewDidEnter(){
    //if(this.isLoaded == true)
    //    this.loadFunction();
    this.survey_text = "Start survey";
  }

  //this function gets called from the above the "aquarium.component.ts"
  loadFunction(){

    //console.log(window.localStorage['TotalPoints']);

    /*
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {     
        this.db.addTrack(this.pageTitle, "Enter", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
      }
    }); 
    */

    //this.totalPoints = parseInt(window.localStorage['TotalPoints'] || "0");
    /*
     if(window.localStorage['TotalPoints'] == undefined)
        this.totalPoints = 0;
    else
        this.totalPoints = parseInt(window.localStorage['TotalPoints']);
    */
    //console.log("Inside Aquarium totalPoints: "+this.totalPoints);
    //this.game.destroy();

    //height adjustment for different phone types
    var GameApp = GameApp || {};
    GameApp.CANVAS_WIDTH = 382.0;
    console.log("w: " + window.innerWidth + ", h: " + window.innerHeight + ", dp: " + window.devicePixelRatio);
    if(window.innerWidth > GameApp.CANVAS_WIDTH)
        GameApp.CANVAS_WIDTH = window.innerWidth;
    GameApp.CANVAS_HEIGHT = window.innerHeight - 35;

    //var game;
    if(this.platform.is('ios')){
        if(GameApp.CANVAS_HEIGHT < 642.0){//iphone SE fix.
            GameApp.CANVAS_HEIGHT += 30;
            GameApp.CANVAS_WIDTH = window.innerWidth;
        }
        if(GameApp.CANVAS_HEIGHT > 800){//iphone XR fix.
          GameApp.CANVAS_HEIGHT -= 40;
          GameApp.CANVAS_WIDTH = window.innerWidth;
        }
        this.game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT - 45*window.devicePixelRatio, Phaser.AUTO, 'gameDiv');
    }else if(this.platform.is('android'))
        this.game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT - 74, Phaser.AUTO, 'gameDiv');    
    else
        this.game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT - 100, Phaser.AUTO, 'gameDiv');

    this.debugText = "" + GameApp.CANVAS_HEIGHT + ", " + window.innerHeight + ", " + window.devicePixelRatio;
    
    //this.totalPoints = 2125;

    if(this.isPreview == "false"){
      if(this.totalPoints < 0){
        this.game.state.add('Boot', BootGameOver);
        this.pickedGame = 'GameOver';
        var preLoader = new PreloaderGameOver();
        this.game.state.add('Preloader', preLoader);
        var gameover = new GameOver();
        this.game.state.add('GameOver', gameover);

      } else if(this.totalPoints <770 && this.totalPoints >= 0){

        this.game.state.add('Boot', BootL1);
        this.pickedGame = 'FishBowlL1';
        var preLoader = new PreloaderL1();
        this.game.state.add('Preloader', preLoader);
        var fishBowlL1 = new FishBowlL1();
        fishBowlL1.setTotalPoints(this.totalPoints);
        var surveyCompletionHistory = this.getIndicatorForSurveyDone();
        fishBowlL1.setSurveyHistory(surveyCompletionHistory);
        this.game.state.add('FishBowlL1', fishBowlL1);


      } else if ( this.totalPoints >=770 && this.totalPoints <1060 ){

        this.game.state.add('Boot', BootL2);
        this.pickedGame = 'FishBowlL2';
        var preLoader = new PreloaderL2();
        this.game.state.add('Preloader', preLoader);
        var fishBowlL2 = new FishBowlL2();
        fishBowlL2.setTotalPoints(this.totalPoints);
        var surveyCompletionHistory = this.getIndicatorForSurveyDone();
        fishBowlL2.setSurveyHistory(surveyCompletionHistory);
        this.game.state.add('FishBowlL2', fishBowlL2);


      } else if( this.totalPoints >=1060 && this.totalPoints <1710 ){

        this.game.state.add('Boot', BootL3);
        this.pickedGame = 'SeaLevelL3';
        var preLoader = new PreloaderL3();
        this.game.state.add('Preloader', preLoader);
        var seaLevelL3 = new SeaLevelL3();
        seaLevelL3.setTotalPoints(this.totalPoints);
        var surveyCompletionHistory = this.getIndicatorForSurveyDone();
        seaLevelL3.setSurveyHistory(surveyCompletionHistory);
        this.game.state.add('SeaLevelL3', seaLevelL3);

      } else if( this.totalPoints >=1710 && this.totalPoints <2120){

        this.game.state.add('Boot', BootL4);
        this.pickedGame = 'SeaLevelL4';
        var preLoader = new PreloaderL4();
        this.game.state.add('Preloader', preLoader);
        var seaLevelL4 = new SeaLevelL4();
        seaLevelL4.setTotalPoints(this.totalPoints);
        var surveyCompletionHistory = this.getIndicatorForSurveyDone();
        seaLevelL4.setSurveyHistory(surveyCompletionHistory);
        this.game.state.add('SeaLevelL4', seaLevelL4);

      } else if( this.totalPoints >=2120 && this.totalPoints <2720){

        this.game.state.add('Boot', BootTundraL5);
        this.pickedGame = "TundraLevel1";
        var preLoader = new PreloaderTundraL5();
        this.game.state.add('Preloader', preLoader);
        var level5 = new GameTundraL5();
        level5.setTotalPoints(this.totalPoints);
        var surveyCompletionHistory = this.getIndicatorForSurveyDone();
        level5.setSurveyHistory(surveyCompletionHistory);
        this.game.state.add('TundraLevel1', level5);

      }else if( this.totalPoints >=2720 && this.totalPoints <3020){

        this.game.state.add('Boot', BootTundraL51);
        this.pickedGame = "TundraLevel2";
        var preLoader = new PreloaderTundraL51();
        this.game.state.add('Preloader', preLoader);
        var level51 = new GameTundraL51();
        level51.setTotalPoints(this.totalPoints);
        var surveyCompletionHistory = this.getIndicatorForSurveyDone();
        level51.setSurveyHistory(surveyCompletionHistory);
        this.game.state.add('TundraLevel2', level51
        );

      }else if( this.totalPoints >=3020){

          this.game.state.add('Boot', BootRainforestL6);
          this.pickedGame = "RainforestLevel6";
          var preLoader = new PreloaderRainforestL6();
          this.game.state.add('Preloader', preLoader);
          var level6 = new GameRainforestL6();
          level6.setTotalPoints(this.totalPoints);
          var surveyCompletionHistory = this.getIndicatorForSurveyDone();
          level6.setSurveyHistory(surveyCompletionHistory);
          this.game.state.add('RainforestLevel6', level6);

      } else {
        //---
        var preLoader = new PreloaderL1();
        preLoader.setGameName(this.pickedGame = "GameOver");
        this.game.state.add('Preloader', preLoader);
      }
    }


    if(this.isPreview == "true"){
      
    }

    //this.game.state.add('GameOver', GameOver);
    this.game.state.start('Boot');
    //self = this;

    this.game.state.states[this.pickedGame].assignscope(this);

    //this.pickGameService.currentGame.subscribe(game => this.pickedGame = game)
  }
 
  ionViewDidLeaveFunction(){
    console.log("Aquarium, ionDidLeave");
    //this.survey_text = "Start survey";
    /*
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {     
        this.db.addTrack(this.pageTitle, "Leave", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
      }
    }); 
    */
    this.game.destroy();
  }

  pauseGameRendering(){
    this.game.state.states[this.pickedGame].yourGamePausedFunc();
  }

  resumeGameRendering(){
    this.game.state.states[this.pickedGame].yourGameResumedFunc();
  }

  ngAfterViewInit(){
        
  }  

  async presentAlert(alertMessage, header_text) {
    
    const alert = await this.alertCtrl.create({
      //<div style="font-size: 20px;line-height: 25px;padding-bottom:10px;text-align:center">Thank you for completing the survey. You have unlocked a meme.</div>
      //header: '<div style="line-height: 25px;padding-bottom:10px;text-align:center">Daily survey unavilable</div>',
      header: header_text,
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
}

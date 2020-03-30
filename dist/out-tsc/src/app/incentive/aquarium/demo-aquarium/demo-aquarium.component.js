import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
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
import { GameTundraL5 } from '../levels/TundraLevelL5//Game';
import { BootRainforestL6 } from '../levels/RainforestL6/Boot';
import { PreloaderRainforestL6 } from '../levels/RainforestL6/Preloader';
import { GameRainforestL6 } from '../levels/RainforestL6/Game';
//import { FormsModule } from '@angular/forms';
//import { PickGameService } from './pick-game.service';
import { ActivatedRoute, Router } from '@angular/router';
//import { PreLoad } from '../../../PreLoad';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { Platform, ModalController } from '@ionic/angular';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { AlertController } from '@ionic/angular';
var DemoAquariumComponent = /** @class */ (function () {
    /*   get surveyPath(){
        if (this.userProfileService.isParent){
          return "survey/samplesurvey"; //"/survey/caregiversurvey"
        } else{
          return "survey/samplesurvey2"; //"/survey/ayasurvey"
        }
      } */
    function DemoAquariumComponent(router, alertCtrl, modalController, 
    //private pickGameService: PickGameService,
    ga, platform, route, userProfileService) {
        this.router = router;
        this.alertCtrl = alertCtrl;
        this.modalController = modalController;
        this.ga = ga;
        this.platform = platform;
        this.route = route;
        this.userProfileService = userProfileService;
        this.isLoaded = false;
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
        //this.username = "test";
    }
    Object.defineProperty(DemoAquariumComponent.prototype, "totalPoints", {
        // totalPoints = 0;
        get: function () {
            return this.userProfileService.points;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DemoAquariumComponent.prototype, "username", {
        get: function () {
            if (this.userProfileService == undefined)
                return "test";
            else {
                //console.log("User profile -- username -- called from here");
                return this.userProfileService.username;
            }
        },
        enumerable: true,
        configurable: true
    });
    DemoAquariumComponent.prototype.goToRewardsPage = function () {
        console.log("rewards page");
        //this.router.navigate(['/home']);
        this.router.navigate(['incentive/treasurechest']);
    };
    //preload the images
    DemoAquariumComponent.prototype.preload = function () {
        console.log("Preload called");
        this.game.load.image('einstein', 'assets/pics/ra_einstein.png');
    };
    //gets executed after preload
    DemoAquariumComponent.prototype.create = function () {
        console.log(window.localStorage['TotalPoints']);
        //this.totalPoints = parseInt(window.localStorage['TotalPoints'] || "0");
        /*
        if(window.localStorage['TotalPoints'] == undefined)
            this.totalPoints = 0;
        else
            this.totalPoints = parseInt(window.localStorage['TotalPoints']);
        */
        console.log("Inside Aquarium totalPoints: " + this.totalPoints);
        console.log("create called");
        var s = this.game.add.sprite(80, 9, 'einstein');
        s.rotation = 0.14;
    };
    DemoAquariumComponent.prototype.ngOnInit = function () {
        this.ga.trackView('Aquarium')
            .then(function () { console.log("trackView at Aquarium!"); })
            .catch(function (e) { return console.log(e); });
        //this.loadFunction();
    };
    DemoAquariumComponent.prototype.ionViewDidEnter = function () {
        //if(this.isLoaded == true)
        //    this.loadFunction();
        this.survey_text = "Start survey";
    };
    DemoAquariumComponent.prototype.loadFunction = function () {
        console.log(window.localStorage['TotalPoints']);
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
        if (window.innerWidth > GameApp.CANVAS_WIDTH)
            GameApp.CANVAS_WIDTH = window.innerWidth;
        GameApp.CANVAS_HEIGHT = window.innerHeight;
        //var game;
        if (this.platform.is('ios')) {
            if (GameApp.CANVAS_HEIGHT < 642.0) { //iphone SE fix.
                GameApp.CANVAS_HEIGHT += 30;
                GameApp.CANVAS_WIDTH = window.innerWidth;
            }
            this.game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT - 36 * window.devicePixelRatio, Phaser.AUTO, 'gameDiv');
        }
        else if (this.platform.is('android'))
            this.game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT - 74, Phaser.AUTO, 'gameDiv');
        else
            this.game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT - 100, Phaser.AUTO, 'gameDiv');
        //this.totalPoints = 2125;
        if (this.totalPoints < 0) {
            this.game.state.add('Boot', BootGameOver);
            this.pickedGame = 'GameOver';
            var preLoader = new PreloaderGameOver();
            this.game.state.add('Preloader', preLoader);
            var gameover = new GameOver();
            this.game.state.add('GameOver', gameover);
        }
        else if (this.totalPoints < 770 && this.totalPoints >= 0) {
            this.game.state.add('Boot', BootL1);
            this.pickedGame = 'FishBowlL1';
            var preLoader = new PreloaderL1();
            this.game.state.add('Preloader', preLoader);
            var fishBowlL1 = new FishBowlL1();
            fishBowlL1.setTotalPoints(this.totalPoints);
            this.game.state.add('FishBowlL1', fishBowlL1);
        }
        else if (this.totalPoints >= 770 && this.totalPoints < 1060) {
            this.game.state.add('Boot', BootL2);
            this.pickedGame = 'FishBowlL2';
            var preLoader = new PreloaderL2();
            this.game.state.add('Preloader', preLoader);
            var fishBowlL2 = new FishBowlL2();
            fishBowlL2.setTotalPoints(this.totalPoints);
            this.game.state.add('FishBowlL2', fishBowlL2);
        }
        else if (this.totalPoints >= 1060 && this.totalPoints < 1710) {
            this.game.state.add('Boot', BootL3);
            this.pickedGame = 'SeaLevelL3';
            var preLoader = new PreloaderL3();
            this.game.state.add('Preloader', preLoader);
            var seaLevelL3 = new SeaLevelL3();
            seaLevelL3.setTotalPoints(this.totalPoints);
            this.game.state.add('SeaLevelL3', seaLevelL3);
        }
        else if (this.totalPoints >= 1710 && this.totalPoints < 2120) {
            this.game.state.add('Boot', BootL4);
            this.pickedGame = 'SeaLevelL4';
            var preLoader = new PreloaderL4();
            this.game.state.add('Preloader', preLoader);
            var seaLevelL4 = new SeaLevelL4();
            seaLevelL4.setTotalPoints(this.totalPoints);
            this.game.state.add('SeaLevelL4', seaLevelL4);
        }
        else if (this.totalPoints >= 2120 && this.totalPoints < 3020) {
            this.game.state.add('Boot', BootTundraL5);
            this.pickedGame = "TundraLevel1";
            var preLoader = new PreloaderTundraL5();
            this.game.state.add('Preloader', preLoader);
            var level5 = new GameTundraL5();
            level5.setTotalPoints(this.totalPoints);
            this.game.state.add('TundraLevel1', level5);
        }
        else if (this.totalPoints >= 3020) {
            this.game.state.add('Boot', BootRainforestL6);
            this.pickedGame = "RainforestLevel6";
            var preLoader = new PreloaderRainforestL6();
            this.game.state.add('Preloader', preLoader);
            var level6 = new GameRainforestL6();
            level6.setTotalPoints(this.totalPoints);
            this.game.state.add('RainforestLevel6', level6);
        }
        else {
            //---
            var preLoader = new PreloaderL1();
            preLoader.setGameName(this.pickedGame = "GameOver");
            this.game.state.add('Preloader', preLoader);
        }
        //this.game.state.add('GameOver', GameOver);
        this.game.state.start('Boot');
        //self = this;
        this.game.state.states[this.pickedGame].assignscope(this);
        //this.pickGameService.currentGame.subscribe(game => this.pickedGame = game)
    };
    DemoAquariumComponent.prototype.ionViewDidLeaveFunction = function () {
        console.log("Aquarium, ionDidLeave");
        this.survey_text = "Start survey";
        this.game.destroy();
    };
    DemoAquariumComponent.prototype.pauseGameRendering = function () {
        this.game.state.states[this.pickedGame].yourGamePausedFunc();
    };
    DemoAquariumComponent.prototype.resumeGameRendering = function () {
        this.game.state.states[this.pickedGame].yourGameResumedFunc();
    };
    DemoAquariumComponent.prototype.ngAfterViewInit = function () {
        this.ga.trackView('Aquarium')
            .then(function () { console.log("trackView at Aquarium!"); })
            .catch(function (e) { return console.log(e); });
    };
    DemoAquariumComponent.prototype.ionViewDidLeave = function () {
        this.game.destroy();
    };
    DemoAquariumComponent = tslib_1.__decorate([
        Component({
            selector: 'app-demo-aquarium',
            templateUrl: './demo-aquarium.component.html',
            styleUrls: ['./demo-aquarium.component.less'],
        })
        //@PreLoad('survey')
        ,
        tslib_1.__metadata("design:paramtypes", [Router,
            AlertController,
            ModalController,
            GoogleAnalytics,
            Platform,
            ActivatedRoute,
            UserProfileService])
    ], DemoAquariumComponent);
    return DemoAquariumComponent;
}());
export { DemoAquariumComponent };
//# sourceMappingURL=demo-aquarium.component.js.map
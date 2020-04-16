import { Component, OnInit } from '@angular/core';

import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { AwsS3Service } from 'src/app/storage/aws-s3.service';
import { DatabaseService } from 'src/app/monitor/database.service';


@Component({
  selector: 'app-award-memes',
  templateUrl: './award-memes.component.html',
  styleUrls: ['./award-memes.component.scss'],
})

//declare let confetti: any;

export class AwardMemesComponent implements OnInit {

  whichImage: string;
  meme_data: any;
  date;
  reinforcementObj = {};
  reinforcement_data = {};
  pageTitle = " Award_Meme";

  viewWidth = 512;
  viewHeight = 350;
  ctx;
  timeStep = (1/60);
  modalObjectNavigationExtras = {};


  //src="{{whichImage}}"
  constructor(private ga: GoogleAnalytics,
    private route: ActivatedRoute,   
    private userProfileService: UserProfileService,  
    private awsS3Service: AwsS3Service,
    private db: DatabaseService,
    private router: Router) {
      this.reinforcementObj['ds'] = 1;
      this.reinforcementObj['reward'] = 1;
      this.reinforcementObj['reward_type'] = 'meme';

      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.date = this.router.getCurrentNavigation().extras.state.date;
          this.reinforcementObj['prob'] = this.router.getCurrentNavigation().extras.state.prob;
          this.reinforcement_data = this.router.getCurrentNavigation().extras.state.reinforcement_data;
          this.modalObjectNavigationExtras = this.router.getCurrentNavigation().extras.state.modalObjectNavigationExtras;
          console.log("Inside AwardMemes, date is: " +this.date+" prob is: "+this.reinforcementObj['prob']);
        }
      });    
    }

  ngOnInit() {
    this.ga.trackView('Life-insight')
    .then(() => {console.log("trackView at Life-insight!")})
    .catch(e => console.log(e));
  }
  

  ngAfterViewInit() {

    //var randomInt = Math.floor(Math.random() * 5) + 1;
    //this.whichImage = "./assets/memes/"+randomInt+".jpg";
    //console.log('Reading local json files: ' + this.fileLink);
    fetch('./assets/memes/memefile.json').then(async res => {
      this.meme_data = await res.json();
      this.showmemes();
    });   
    
  }

  ionViewDidEnter(){
    this.db.getDatabaseState().subscribe(rdy => {
     if (rdy) {     
       this.db.addTrack(this.pageTitle, "Enter", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
     }
    }); 
  }  

  ionViewDidLeave(){
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {     
        this.db.addTrack(this.pageTitle, "Leave", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
      }
    });     
  }


  showmemes(){
    //window.localStorage['meme_shuffle5'] = "[]";
    //var randomInt = Math.floor(Math.random() * this.meme_data.length);
    //this.whichImage = "./assets/memes/"+this.meme_data[randomInt]["filename"];
    //console.log('Meme data: ' + JSON.stringify(this.meme_data));
    this.meme_data = this.shuffle(this.meme_data);
    //console.log('Meme suffled: ' + JSON.stringify(this.meme_data));
    var picked_meme = this.pick_meme(this.meme_data);
    //console.log('picked_meme: ' + JSON.stringify(picked_meme));
    this.whichImage = "./assets/memes/"+picked_meme[0]["filename"];
    this.reinforcementObj['reward_img_link'] = "/memes/"+picked_meme[0]["filename"];
    this.reinforcement_data['reward_img_link'] = "/memes/"+picked_meme[0]["filename"];
    setTimeout(e => this.drawImageOnCanvas(this.whichImage), 200);
  }
  
  ratingChanged(rating){
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
    this.router.navigate(['home'], navigationExtras);
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


  //
  initDrawingCanvas() {
    /*
    this.drawingCanvas.style.width = '100%';
    this.drawingCanvas.width = this.drawingCanvas.offsetWidth;
    this.drawingCanvas.style.height = '90%';
    this.ctx = this.drawingCanvas.getContext('2d');
    */

    //createLoader();
    //createExploader();
    //createParticles();
  }

  

  drawImageOnCanvas(imageF_file_path) {

    /*
    //
    var imageObj = new Image();
    imageObj.src = imageF_file_path;
    
    //
    var drawingCanvas = <HTMLCanvasElement>document.getElementById("drawing_canvas");
    drawingCanvas.style.width = '100%';
    drawingCanvas.width = drawingCanvas.offsetWidth;
   
    var ctx = drawingCanvas.getContext('2d');
   
    //
    imageObj.onload = function () {
      console.log("print: " + (imageObj.height/imageObj.width));
      drawingCanvas.height = Math.abs(drawingCanvas.width*(imageObj.height/imageObj.width));

      ctx.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height, // source rectangle
        0, 0, drawingCanvas.width, drawingCanvas.height); // destination rectangle

      //
      
    }
    */
    //this.HeartsBackground.initialize(drawingCanvas);
    this.drawConfetti();
  }


  //draws confetti 
  drawConfetti(){
    var canvas = <HTMLCanvasElement>document.getElementById("hearts_canvas"); //$('#canvas')[0]; hearts_canvas
    //https://www.kirilv.com/canvas-confetti/
    // you should  only initialize a canvas once, so save this function
    // we'll save it to the canvas itself for the purpose of this demo

    //@ts-ignore
    canvas.confetti = canvas.confetti || confetti.create(canvas, { resize: true });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 170;

    /*
    canvas.confetti({
      angle: this.randomInRange(55, 125),
      spread: this.randomInRange(50, 70),
      particleCount: this.randomInRange(50, 100),
      origin: { y: 0.6, x: 0.5 }
    });
    */
   //
   
    if(Math.random()>0.5)
        this.drawRealisticConfetti(canvas);
    else
        this.drawConfettiFireworks(canvas);
  
  }

  drawConfettiFireworks(canvas){
    var duration = 1 * 1200;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 100, ticks: 60, zIndex: 0 };
    
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
    
    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
    
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
    
      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      canvas.confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.2, 0.4), y: Math.random() - 0.0}}));
      canvas.confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.6, 0.8), y: Math.random() - 0.0}}));
    }, 250);
  }

  drawConfettiVanillaDirection(canvas){
    canvas.confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5, x: 0.5 }
    });
  }

  drawConfettiRandomDirection(canvas){
    canvas.confetti({
      angle: this.randomInRange(55, 125),
      spread: this.randomInRange(50, 70),
      particleCount: this.randomInRange(50, 100),
      origin: { y: 0.5, x: 0.5 }
    });
  }

  drawRealisticConfetti(canvas){
    this.confettiFire(0.25, {
      spread: 26,
      startVelocity: 100,
    },canvas);
    this.confettiFire(0.2, {
      spread: 60,
    },canvas);
    this.confettiFire(0.35, {
      spread: 100,
      decay: 0.99,
    },canvas);
    this.confettiFire(0.1, {
      spread: 120,
      startVelocity: 100,
      decay: 0.99,
    },canvas);
    this.confettiFire(0.1, {
      spread: 120,
      startVelocity: 100,
    },canvas);

    //
    setTimeout(() => {
      canvas.confetti.reset();
    }, 1200);
    
  }

  confettiFire(particleRatio, opts, canvas) {
    var count = 200;
    var defaults = {
      origin: { y: 0.8 }
    };
    canvas.confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  }
  randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }
}

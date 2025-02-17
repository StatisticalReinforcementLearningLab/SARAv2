import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { AwsS3Service } from 'src/app/storage/aws-s3.service';
import * as moment from 'moment';
import { DatabaseService } from 'src/app/monitor/database.service';
import { UploadserviceService } from 'src/app/storage/uploadservice.service';

@Component({
  selector: 'app-award-altruism',
  templateUrl: './award-altruism.component.html',
  styleUrls: ['./award-altruism.component.scss'],
})
export class AwardAltruismComponent implements OnInit {

  whichImage: string;
  altruism_data: any;
  date;
  reinforcementObj = {};
  reinforcement_data = {};
  modalObjectNavigationExtras = {};
  pageTitle = " Award_Altruism";

  constructor(    
    private route: ActivatedRoute, 
    private userProfileService: UserProfileService,
    private awsS3Service: AwsS3Service,
    private uploadService: UploadserviceService,
    private router: Router) { 
      this.reinforcementObj['ds'] = 1;
      this.reinforcementObj['reward'] = 2;
      this.reinforcementObj['reward_type'] = 'altruistic message';     
    }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.date = this.router.getCurrentNavigation().extras.state.date;
        this.reinforcementObj['prob'] = this.router.getCurrentNavigation().extras.state.prob;
        this.reinforcement_data = this.router.getCurrentNavigation().extras.state.reinforcement_data;         
        this.modalObjectNavigationExtras = this.router.getCurrentNavigation().extras.state.modalObjectNavigationExtras;
        console.log("Inside AwardAltruism, date is: " +this.date+" prob is: "+this.reinforcementObj['prob']);
      }
    }); 
  }

  ngAfterViewInit() {
    fetch('./assets/altruism/altruism_list.json').then(async res => {
      this.altruism_data = await res.json();
      this.showaltruism();
    });

  }

  ionViewDidEnter(){
    /*
    this.db.getDatabaseState().subscribe(rdy => {
     if (rdy) {     
       this.db.addTrack(this.pageTitle, "Enter", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
     }
   });
   */
   this.uploadService.saveAppUsageEnter("award_altruism_msg"); 
 }  
 
 ionViewDidLeave(){
    /*
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {     
        this.db.addTrack(this.pageTitle, "Leave", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
      }
    }); 
    */
    this.uploadService.saveAppUsageExit("award_altruism_msg");    
  }

  showaltruism(){
    console.log('Altruism data: ' + JSON.stringify(this.altruism_data));
    this.altruism_data = this.shuffle(this.altruism_data);
    //console.log('Altruism images suffled: ' + JSON.stringify(this.altruism_data));
    var picked_altruism_image = this.pick_altrusim(this.altruism_data);
    //console.log('picked_altruism_image: ' + JSON.stringify(picked_altruism_image));

    var already_shown = window.localStorage["already_shown_alt_msg4"];
    if(already_shown == undefined)
        already_shown = {
          "last_updated": Date.now(),
          "last_updated_readable_ts": moment().format("MMMM Do YYYY, h:mm:ss a Z"),
          "unlocked_alt_msgs":[{"filename": "assets/altruism/altruism_1.png", "unlock_date": moment().format('MM/DD/YYYY')}]
        };
    else
        already_shown = JSON.parse(window.localStorage["already_shown_alt_msg4"]);

    console.log("already_shown: " + already_shown);
    already_shown["last_updated"] = Date.now();
    already_shown["last_updated_readable_ts"] = moment().format("MMMM Do YYYY, h:mm:ss a Z");
    already_shown["unlocked_alt_msgs"].push({"filename": "assets/altruism/"+picked_altruism_image[0]["filename"], "unlock_date": moment().format('MM/DD/YYYY')});
    window.localStorage["already_shown_alt_msg4"] = JSON.stringify(already_shown);



    this.whichImage = "./assets/altruism/"+picked_altruism_image[0]["filename"];
    this.reinforcementObj['reward_img_link'] = "/altruism/"+picked_altruism_image[0]["filename"];
    this.reinforcement_data['reward_img_link'] = "/altruism/"+picked_altruism_image[0]["filename"];
    setTimeout(e => this.drawImageOnCanvas(this.whichImage), 200);
    
  }
  
  ratingChanged(rating){
    if(rating==0) {
      console.log("thumbs down");
      this.reinforcementObj['Like'] = "No";
      this.reinforcement_data['Like'] = "No";
      window.localStorage.setItem("Like", "No");
      this.awsS3Service.upload('reinforcement_data', this.reinforcement_data); 
    } else {
      console.log("thumbs up");
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

        if(window.localStorage['altruism_shuffle6'] == undefined){
          //
          var j: number, x: number, i: number;
          for (i = a.length - 1; i > 0; i--) {
              j = Math.floor(Math.random() * (i + 1));
              x = a[i];
              a[i] = a[j];
              a[j] = x;
          }
          //
          window.localStorage['altruism_shuffle6'] = JSON.stringify(a);
          return a;
        }else{
          a  = JSON.parse(window.localStorage['altruism_shuffle6']);
          return a;
        }

    }

    /**
     * Shuffles array in place if it is not already shuffled
     * @param {Array} a items An array containing the items.
    */
    pick_altrusim(a) {
        var picked_altruism = a.splice(0,1);
        a.push(picked_altruism[0]);
        window.localStorage['altruism_shuffle6'] = JSON.stringify(a);
        return picked_altruism;
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
      this.HeartsBackground.initialize();
    }



    HeartsBackground = {
      heartHeight: 60,
      heartWidth: 64,
      hearts: [],
      imageNames: ['valentinesheart.png','blueflower.png','yellowrose.png','redflower.png','yellowflower.png'],
      heartImage: './assets/img/',
      //heartImage: './assets/img/petal.png',
      maxHearts: 60,
      minScale: 0.4,
      draw: function() {
        //this.setCanvasSize();
        this.ctx.clearRect(0, 0, this.w, this.h);
        //console.log("Hearts draw function called");
        var ctx = this.ctx;
        for (var i = 0; i < this.hearts.length; i++) {
          var heart = this.hearts[i];
          heart.image = new Image();
          heart.image.style.height = heart.height;
          heart.image.src = this.heartImage;
          ctx.drawImage(heart.image, heart.x, heart.y, heart.width, heart.height);
        }
        this.move();
      },
      move: function() {
        //console.log("Move function called");
        for(var b = 0; b < this.hearts.length; b++) {
          var heart = this.hearts[b];
          heart.y += heart.ys;
          if(heart.y > this.h) {
            //heart.x = Math.random() * this.w;
            //heart.y = -1 * this.heartHeight;
          }
        }
      },
      angularDraw: function() {
        //this.setCanvasSize();
        this.ctx.clearRect(0, 0, this.w, this.h);
        //console.log("Hearts draw function called");
        var ctx = this.ctx;
        for (var i = 0; i < this.hearts.length; i++) {
          
          var heart = this.hearts[i];
          /*
          heart.image = new Image();
          heart.image.style.height = heart.height;
          heart.image.src = this.heartImage;
          */
          ctx.drawImage(heart.image, heart.angle_x, heart.angle_y, heart.width, heart.height);
        }
        this.angularMove();
      },
      angularMove: function() {
        //console.log("Move function called");
        for(var b = 0; b < this.hearts.length; b++) {
          var heart = this.hearts[b];
          //heart.y += heart.ys;
          //console.log("" + heart.angle_x + "," + heart.angle_y);
          //console.log(heart.angle);
          //console.log("" + heart.angle_x + "," + heart.angle_y + ", " + heart.angle_deltax + ", " + heart.angle_deltay);
          heart.angle_x += heart.angle_deltax;
          heart.angle_y += heart.angle_deltay;
          //console.log("" + heart.angle_x + "," + heart.angle_y);
          if(heart.y > this.h) {
            //heart.x = Math.random() * this.w;
            //heart.y = -1 * this.heartHeight;
          }
        }
      },
      setCanvasSize: function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - 170;
        console.log("Set canvas size function called");
        this.w = this.canvas.width;
        this.h = this.canvas.height;
      },
      initialize: function() {
        console.log("Initialize hearts");
        this.canvas = <HTMLCanvasElement>document.getElementById("hearts_canvas"); //$('#canvas')[0]; hearts_canvas
        if(!this.canvas.getContext)
          return;
  
        this.setCanvasSize();
        this.ctx = this.canvas.getContext('2d'); 
  
        this.canvas.addEventListener("touchstart",  function(event) {event.preventDefault()});
        this.canvas.addEventListener("touchmove",   function(event) {event.preventDefault()});
        this.canvas.addEventListener("touchend",    function(event) {event.preventDefault()});
        this.canvas.addEventListener("touchcancel", function(event) {event.preventDefault()});
        // Attach an event handler to the document
        //this.canvas.addEventListener("mousemove",   function(event) {event.preventDefault()});
    
        for(var a = 0; a < this.maxHearts; a++) {
          var scale = (Math.random() * (1 - this.minScale)) + this.minScale;
          this.hearts.push({
            x: Math.random() * this.w,
            y: Math.random() * this.h,
            ys: Math.random() + 8,
            height: scale * this.heartHeight,
            width: scale * this.heartWidth,
            angle_x: this.w/2,
            angle_y: this.h/2,
            angle_deltax: this.getRandomArbitraryMoreThanX(-10,10,6),
            angle_deltay: this.getRandomArbitraryMoreThanX(-10,10,6),
            opacity: scale
          });
        }

        
    
        //setInterval($.proxy(this.draw, this), 30);
        //setTimeout(e => this.draw, 30);
        //this.draw();
        var intervalVar;
        if(Math.random()>0.5){
            //intervalVar = setInterval(e => this.angularDraw(), 30);
            this.heartImage = this.heartImage + 'valentinesheart.png';
        }else{
            //intervalVar = setInterval(e => this.draw(), 30);
            //choose an heart image everytime
            const randomElement = this.imageNames[Math.floor(Math.random() * this.imageNames.length)];
            this.heartImage = this.heartImage + randomElement;
        }

        var image = new Image();
        image.src = this.heartImage;
        var hearts = this.hearts;
        var self_this = this;
        image.onload = function () {
          for(var a = 0; a < hearts.length; a++) {
            hearts[a].image = image;
            hearts[a].image.style.height = hearts[a].height;
          }
          intervalVar = setInterval(e => self_this.angularDraw(), 15);
        }

        setTimeout(e => this.stopInterval(intervalVar), 800);
  
      },
      stopInterval(intervalVar) {
        this.ctx.clearRect(0, 0, this.w, this.h);
        clearInterval(intervalVar);
      },
      getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
      },
      getRandomArbitraryMoreThanX(min, max, X) {
        var rand_var =  this.getRandomArbitrary(min, max);
        if(Math.abs(rand_var) < X){
          if(rand_var < X)
            return  rand_var-X;
          if(rand_var > X)
            return  rand_var+X;
        }else{
          return rand_var;
        }
      }
    };

}

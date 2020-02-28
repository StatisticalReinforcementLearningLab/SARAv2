import { Component, OnInit } from '@angular/core';

import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { DatabaseService } from 'src/app/monitor/database.service';

@Component({
  selector: 'app-award-memes',
  templateUrl: './award-memes.component.html',
  styleUrls: ['./award-memes.component.scss'],
})

export class AwardMemesComponent implements OnInit {

  whichImage: string;
  meme_data: any;
  date;
  reinforcementObj = {};
  pageTitle = " Award_Meme";

  viewWidth = 512;
  viewHeight = 350;
  drawingCanvas = <HTMLCanvasElement>document.getElementById("drawing_canvas");
  ctx;
  timeStep = (1/60);


  //src="{{whichImage}}"
  constructor(private ga: GoogleAnalytics,
    private route: ActivatedRoute,   
    private userProfileService: UserProfileService,  
    private db: DatabaseService,
    private router: Router) {
      this.reinforcementObj['ds'] = 1;
      this.reinforcementObj['reward'] = 1;
      this.reinforcementObj['reward_type'] = 'meme';
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.date = this.router.getCurrentNavigation().extras.state.date;
          this.reinforcementObj['prob'] = this.router.getCurrentNavigation().extras.state.prob;
          console.log("Inside AwardMemes, date is: " +this.date+" prob is: "+this.reinforcementObj['prob']);
        }
      });    
    }

  ngOnInit() {
    this.ga.trackView('Life-insight')
    .then(() => {console.log("trackView at Life-insight!")})
    .catch(e => console.log(e));


    //this.drawConfetti();
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
       this.db.addTrack(this.pageTitle, "Enter", this.userProfileService.username); 
     }
    }); 
  }  

  ionViewDidLeave(){
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {     
        this.db.addTrack(this.pageTitle, "Leave", this.userProfileService.username); 
      }
    });     
  }


  showmemes(){
    //window.localStorage['meme_shuffle5'] = "[]";
    //var randomInt = Math.floor(Math.random() * this.meme_data.length);
    //this.whichImage = "./assets/memes/"+this.meme_data[randomInt]["filename"];
    console.log('Meme data: ' + JSON.stringify(this.meme_data));
    this.meme_data = this.shuffle(this.meme_data);
    console.log('Meme suffled: ' + JSON.stringify(this.meme_data));
    var picked_meme = this.pick_meme(this.meme_data);
    console.log('picked_meme: ' + JSON.stringify(picked_meme));
    this.whichImage = "./assets/memes/"+picked_meme[0]["filename"];
    this.reinforcementObj['reward_img_link'] = "/memes/"+picked_meme[0]["filename"];
  }
  
  ratingChanged(rating){
    if(rating==0) {
      console.log("thumbs down");
      this.reinforcementObj['Like'] = "No";
      window.localStorage.setItem("Like", "No");
    } else {
      console.log("thumbs up");
      this.reinforcementObj['Like'] = "Yes";
      window.localStorage.setItem("Like", "Yes");
    }
    
    //this.userProfileService.addReinforcementData(this.date, this.reinforcementObj);    
    window.location.href = '/home';
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
    this.drawingCanvas.style.width = '100%';
    this.drawingCanvas.width = this.drawingCanvas.offsetWidth;
    this.drawingCanvas.style.height = '90%';
    this.ctx = this.drawingCanvas.getContext('2d');

    //createLoader();
    //createExploader();
    //createParticles();
  }

  //draws confetti 
  drawConfetti(){
    this.initDrawingCanvas();
  }
}

import { Component, OnInit, ViewChild, ViewContainerRef, NgModule, Compiler, Injector, NgModuleRef, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { StoreToFirebaseService } from '../../storage/store-to-firebase.service';
import { AwsS3Service } from '../../storage/aws-s3.service';
import { EncrDecrService } from '../../storage/encrdecrservice.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';
//import { PreLoad } from '../../PreLoad';

//import * as lifeInsightProfile from "../../../assets/data/life_insight.json";
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';

@Component({
  selector: 'app-dynamic-survey',
  templateUrl: './dynamic-survey.component.html',
  styleUrls: ['./dynamic-survey.component.scss'],
  providers: [UserProfileService], //try commenting out
})

//@PreLoad('life-insights')
export class DynamicSurveyComponent implements OnInit {

  @Input() fileLink: string;

  title = "mash is here";
  public isLoading = true;
  public loadingComplete = false;
  
  /*
  survey_data = [
    {
      "name": "Q1d",
      "text": "How stressed are you today?",
      "type": "radiobutton",
      "extra": {
        "choices": ["Not<br>at all", "A<br>lot"],
        "orientation": "horzontal",
        "levels": 5
      }
    },
    {
      "name": "Q3",
      "text": "This past week, did you concentrate easily?",
      "type": "radiobutton",
      "extra": {
        "choices": ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"],
        "orientation": "vertical"
      }
    },
    {
      "name": "Q2d",
      "text": "How are you feeling today? Please click on the spot that best represents your mood",
      "type": "moodgrid2"
    },
    {
      "name": "Q3d",
      "text": "How much free time have you had today?",
      "type": "range2",
      "extra": {
        "choices": ["0<br>hour", "600<br>min", 0, 1440, 60]
      }
    }
  ];
  */
  survey_string = "";
  survey = {};
  survey_data: any;

  @ViewChild('vc', { read: ViewContainerRef }) vc: ViewContainerRef;

  //private vc: ViewContainerRef;

  constructor(private _compiler: Compiler,
    private _injector: Injector,
    private _m: NgModuleRef<any>, 
    private awsS3Service: AwsS3Service,
    //private storeToFirebaseService: StoreToFirebaseService,
    private EncrDecr: EncrDecrService,
    private router: Router,
    private ga: GoogleAnalytics,
    private changeDetector : ChangeDetectorRef,
    public plt: Platform,
    private userProfileService: UserProfileService) {
  }

  ngOnInit() { }

  ngAfterViewInit() {
      console.log('Reading local json files: ' + this.fileLink);
      fetch('../../../assets/data/'+this.fileLink+'.json').then(async res => {
        this.survey_data = await res.json();
        this.init();
      });
  }

  //
  init() {  

    //TODO: Two-way binding, and call functions. Multiple choice/affect-grid.
    //TODO: Ask Liying to do the JSON.

    //const template = '<span>generated on the fly: {{name}}</span>';
    const template = '<div class="card"><div class="quetiontextstyle">' +
      'This is the question' +
      '</div>' +
      '<div class="radiovertical">' +
      '<ul>' +
      '<li>' +
      '<input type="radio" id="f-option" name="selector" (click)="modelChanged(0)">' +
      '<label for="f-option">Pizza</label>' +
      '<div class="check"></div>' +
      '</li>' +
      '<li>' +
      '<input type="radio" id="s-option" name="selector" (click)="modelChanged(1)">' +
      '<label for="s-option">Coke</label>' +
      '<div class="check"></div>' +
      '</li>' +
      '</ul>' +
      '</div></div>';


    //const template2 = '<ion-card><ion-card-content>Nine Inch Nails Live</ion-card-content></ion-card>';

    //go through the questions
    for (var i = 0; i < this.survey_data.length; i++) {
      var obj = this.survey_data[i];
      //console.log("Done " + obj.text);
      this.survey_string = this.process_survey(obj, this.survey_string, obj.name);
    }
    this.survey_string = this.survey_string + '<div class="ion-padding"><button class="buttonold button-positive" (click)="storeData()">Submit</button></div>';


    const tmpCmp = Component({ template: this.survey_string })(class implements OnInit{
      
      survey2 = {};
      lifeInsightObj = {};
      //storeToFirebaseService: StoreToFirebaseService;
      ga: GoogleAnalytics;
      EncrDecr: EncrDecrService;
      awsS3Service: AwsS3Service;
      totalPoints = 0;
      plt: Platform;
      router: Router;
      userProfileService: UserProfileService;

      constructor() {
        //self2=this;
        this.survey2['starttimeUTC'] = new Date().getTime();
      }
      ngOnInit() {}

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
      modelChanged(newObj) {
        // do something with new value
        console.log('holla' + newObj);
      }
      inputchanged(questions) {
        //console.log('holla: ' + questions);
        console.log(JSON.stringify(this.survey2));
      }

      storeData(){
        //console.log("Inside storeData");
        console.log(JSON.stringify(this.survey2));
        this.ga.trackEvent('Submit Button', 'Tapped Action', 'Submit the completed survey', 0);
  

        //this.saveDataService.saveData("SurveyResult", this.question);
    
        //var jsonString = JSON.stringify(surveyResult);
        //var fileDir = cordova.file.externalApplicationStorageDirectory; 
        //var filename = "result.json";
        //var file = new File([jsonString], fileDir+filename, {type: "text/plain;charset=utf-8"});
        //this.file.writeFile(fileDir, filename, jsonString, {replace: true}) ; 
        //this.file.readAsArrayBuffer(fileDir, filename).then(async(buffer) => {
        //  await this.upload(buffer, filename);
        //});
        
        //this.storeToFirebaseService.initFirebase();
        //this.storeToFirebaseService.storeTofirebase(this.survey2);
        
        //var encrypted = this.EncrDecr.set('123456$#@$^@1ERF', 'password@123456');
        //var decrypted = this.EncrDecr.get('123456$#@$^@1ERF', encrypted);
        //data = JSON.stringify(data);
        //var encrypted = encrypt(data, "Z&wz=BGw;%q49/<)");
        //var decrypted = decrypt(encrypted, "Z&wz=BGw;%q49/<)");

        this.survey2['endtimeUTC'] = new Date().getTime();
        this.survey2['ts'] = moment().format('MMMM Do YYYY, h:mm:ss a Z');

        // Get a key for a new Post.
        //var newPostKey = firebase.database().ref().child('SARA').child('Daily').push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        //var updates = {};
        //$scope.survey.reponse_ts = $scope.reponse_ts;
        this.survey2['devicInfo'] = this.plt.platforms();
        //$scope.survey.id = $scope.email;


        var encrypted = this.EncrDecr.encrypt(JSON.stringify(this.survey2), "Z&wz=BGw;%q49/<)");
        //var encrypted = this.EncrDecr.encrypt("holla", "Z&wz=BGw;%q49/<)");
        var decrypted = this.EncrDecr.decrypt(encrypted, "Z&wz=BGw;%q49/<)");

        console.log('Encrypted :' + encrypted);
        console.log('Decrypted :' + decrypted);
        this.survey2['encrypted'] = encrypted;

        this.userProfileService.surveyCompleted(); 

        if(window.localStorage['TotalPoints'] == undefined)
          this.totalPoints = 0;
        else
          this.totalPoints = parseInt(window.localStorage['TotalPoints']);
        this.totalPoints = this.totalPoints + 100;
        window.localStorage.setItem("TotalPoints", ""+this.totalPoints);

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

          // this.lifeInsightObj['Q4d'] = {};
          // this.lifeInsightObj['Q4d']['dates'] = [moment().format("DD-MM-YYYY")];
          // if(this.survey2.hasOwnProperty('Q4d')) {
          //   this.lifeInsightObj['Q4d']['data'] = [parseInt(this.survey2['Q4d'])];
          // }
          // else {
          //   this.lifeInsightObj['Q4d']['data'] = [null];
          // }
         
        }
        else {
           this.lifeInsightObj= JSON.parse(window.localStorage["lifeInsight"]);

           for (let question of questionsArray) {          
              this.lifeInsightObj[question]['dates'].push(moment().format("DD-MM-YYYY"));
              if(this.survey2.hasOwnProperty(question)) {
                  this.lifeInsightObj[question]['data'].push(parseInt(this.survey2[question]));
                }
                else {
                  this.lifeInsightObj[question]['data'].push(null);
                }
           }

            // this.lifeInsightObj['Q4d']['dates'].push(moment().format("DD-MM-YYYY"));
            // if(this.survey2.hasOwnProperty('Q4d')) {
            //    this.lifeInsightObj['Q4d']['data'].push(parseInt(this.survey2['Q4d']));
            //  }
            //  else {
            //    this.lifeInsightObj['Q4d']['data'].push(null);
            //  }
        }
        console.log("lifeInsightObj: "+JSON.stringify(this.lifeInsightObj));
        window.localStorage.setItem("lifeInsight", JSON.stringify(this.lifeInsightObj));

        //this.storeToFirebaseService.addSurvey('/results',this.survey2);
        //console.log("End of storeData");
        //console.log(this.survey2);
        
        //save to Amazon AWS S3
        this.awsS3Service.upload(this.survey2);
        //console.log("End of storeData");
       
        /*
        if(Math.random() > 0.5 ){
            this.router.navigate(['incentive/award-memes']);
        } else {
            this.router.navigate(['incentive/award-memes']);
          //this.router.navigate(['incentive/aquarium/aquariumone']);
          //this.router.navigate(['/home']);
        }
        */

        if(Math.random() > 0.5 ){
            this.router.navigate(['incentive/award-memes']);
            //this.router.navigate(['incentive/sample-life-insight']);
        } else {
            //this.router.navigate(['incentive/aquarium/aquariumone']);         
            //this.router.navigate(['incentive/sample-life-insight']);
            this.router.navigate(['incentive/award-altruism']);
        }
           
        //save to azure 
        //this.azureService.upload(this.question.getData());
    
        //this.saveDataService.browseToReward('/incentive/award');
        //this.saveDataService.browseToReward('incentive/visualization');
      }

    });

    const tmpModule = NgModule({ declarations: [tmpCmp], imports: [FormsModule]})(class {
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
        //cmpRef.instance.storeToFirebaseService = this.storeToFirebaseService;
        cmpRef.instance.userProfileService = this.userProfileService;
        cmpRef.instance.EncrDecr = this.EncrDecr;
        cmpRef.instance.ga = this.ga;
        cmpRef.instance.plt = this.plt;
        cmpRef.instance.router = this.router;// Router,
        cmpRef.instance.name = 'dynamic';
        //console.log('called');
    });
  }

  getTitle() {
    return this.title;
  }

  /*
  process_survey(obj, survey_string, i) {

    survey_string = [survey_string,
      '<div class="card"><div class="quetiontextstyle">',
      obj.text,
      '</div>'
    ].join(" ");


    //------------------------------------------------------ 
    // radio button       
    //------------------------------------------------------            
    if (obj.type == "radiobutton") {

      //------------------------------------------------------ 
      //radio button, vertical     
      //------------------------------------------------------   
      if (obj.extra.orientation == "vertical") {
        survey_string = survey_string + '<div class="radiovertical"><ul>';

        for (var j = 0; j < obj.extra.choices.length; j++) {

          survey_string = [survey_string,
            '<li><input type="radio" id="option' + i + "I" + j + '" name="' + i + '" [(ngModel)]="survey2.' + i + '" value="' + obj.extra.choices[j] + '"  (change)="inputchanged(\'' + i + '\')">',
            '<label for="option' + i + "I" + j + '">' + obj.extra.choices[j] + '</label>',
            '<div class="check"></div></li>'
          ].join(" ");

        }
        survey_string = survey_string + '</ul></div>';
      }

      //------------------------------------------------------ 
      //radio button, vertical     
      //------------------------------------------------------
      if (obj.extra.orientation == "horizontal") {

        survey_string = survey_string + '<div class="radiohorizontal"><ul>';

        //starting text
        survey_string = survey_string + '<li><p>' + obj.extra.choices[0] + '</p></li>';

        //middle text
        for (var j = 0; j < obj.extra.levels; j++) {
          survey_string = [survey_string,
            '<li><input type="radio" id="option' + i + "I" + j + '" name="Q' + i + '" [(ngModel)]="survey2.' + i + '" value="' + j + '"  (change)="inputchanged(\'' + i + '\')">',
            '<label for="option' + i + "I" + j + '"></label>',
            '<div class="check"></div></li>'
          ].join(" ");
        }

        //ending text
        survey_string = survey_string + '<li><p>' + obj.extra.choices[1] + '</p></li>';

        survey_string = survey_string + '</ul></div>';
      }

    }


    if (obj.type == "moodgrid2") {
      survey_string = [survey_string,
        '<canvas id="myCanvas" width="310" height="310" style="border:0px solid #000000;padding:10px;">',
        'Your browser does not support the HTML5 canvas tag.',
        '</canvas>'
      ].join(" ");
    }


    survey_string = survey_string + '</div>';
    return survey_string;
  }
  */

  // process survey if obj type is radiobutton
  process_survey_radiobutton(obj, survey_string, i){
      //------------------------------------------------------ 
      //radio button, vertical     
      //------------------------------------------------------   
      
      if (obj.extra.orientation == "vertical") {
          survey_string = survey_string + '<div class="radiovertical"><ul>';

          for (var j = 0; j < obj.extra.choices.length; j++) {

              survey_string = [survey_string,
                  '<li><input type="radio" id="option' + i + "I" + j + '" name="' + i + '" [(ngModel)]="survey2.' + i + '" value=" ' + obj.extra.choices[j] + '" (change)="inputchanged(\'' + i + '\')">',
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


  process_survey(obj, survey_string, i) {

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
    
          if (obj.type == "range2") {
              //survey_string = this.process_survey_range2(obj, survey_string, i);
          }
    
    
          //------------------------------------------------------                  
          //checkbox  
          //------------------------------------------------------                 
          if (obj.type == "checkbox") {
              //survey_string = this.process_survey_checkbox(obj, survey_string, i);
          }
    
          survey_string = survey_string + '</div>';
        }
        return survey_string;
  }

}

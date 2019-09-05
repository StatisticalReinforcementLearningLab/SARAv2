import { Component, OnInit, ViewChild, ViewContainerRef, NgModule, Compiler, Injector, NgModuleRef, ElementRef, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { StoreToFirebaseService } from '../../storage/store-to-firebase.service';
import { EncrDecrService } from '../../storage/encrdecrservice.service';
import { Platform } from '@ionic/angular';
import * as moment from 'moment';
//import survey_data from '../../../assets/data/data.json'; //conflict with moment

@Component({
  selector: 'app-dynamic-survey',
  templateUrl: './dynamic-survey.component.html',
  styleUrls: ['./dynamic-survey.component.scss'],
})
export class DynamicSurveyComponent implements OnInit {

  title = "mash is here";

  //survey_data: any;
  survey_data = [
    {
      "name": "Q1d",
      "text": "How stressed are you today?",
      "type": "radiobutton",
      "extra": {
        "choices": ["Not<br>at all", "A<br>lot"],
        "orientation": "horizontal",
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
    }
    /*,{
      "name": "Q3d",
      "text": "How much free time have you had today?",
      "type": "range2",
      "extra": {
        "choices": ["0<br>hour", "600<br>min", 0, 1440, 60]
      }
    }*/
  ];
  survey_string = "";
  
  survey: {};
  surveydependency;
  namedependency;
  survey_cond = {};
  name;
  affect;

  rand_index;
  randomq;
  autocomplete_options;
  choices;

  @ViewChild('vc', { read: ViewContainerRef }) vc: ViewContainerRef;

  constructor(private _compiler: Compiler,
    private _injector: Injector,
    private _m: NgModuleRef<any>, 
    private storeToFirebaseService: StoreToFirebaseService,
    private EncrDecr: EncrDecrService,
    public plt: Platform) {
      console.log('Reading local json files');
      /*
      fetch('../../../assets/data/temp_survey.json').then(async res => {
        this.survey_data = await res.json();
        this.init();
      });
      */
      //this.survey_data = await res.json();
      this.init();
    }

  ngOnInit() {
  }

  // ngAfterViewInit() {
  init() {
    //TODO: Two-way binding, and call functions. Multiple choice/affect-grid.
    //TODO: Ask Liying to do the JSON.

    //go through the questions, survey_data is an array

    this.survey = {};
    this.survey_string = "";
    for (let obj of this.survey_data) {
      this.survey[obj.name] = "";
      this.survey_string = this.process_survey(obj, this.survey_string, obj.name);
      console.log("Done " + this.survey_string);
    }
    this.survey_string = this.survey_string + '<div class="ion-padding"><button class="buttonold button-positive" (click)="storeData()">Submit</button></div>';


    const tmpCmp = Component({ template: this.survey_string })(class implements OnInit{
      
      survey2 = {};
      affect: any;
      reponse_ts = {};
      survey_cond = {};
      name;
      surveydependency;
      namedependency;
    
      storeToFirebaseService: StoreToFirebaseService;
      EncrDecr: EncrDecrService;
      plt: Platform;

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

      /*inputchanged(questions) {
        //console.log('holla: ' + questions);
        console.log(JSON.stringify(this.survey2));
      }*/

      storeData(){
        console.log("Inside storeData");
        console.log(JSON.stringify(this.survey2));
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

        this.storeToFirebaseService.addSurvey('/results',this.survey2,true);
        
        //save to Amazon AWS S3
        //this.awsS3Service.upload(this.question.getData());
        //console.log("End of storeData");
    
        //save to azure 
        //this.azureService.upload(this.question.getData());
    
        //this.saveDataService.browseToReward('/incentive/award');
        //this.saveDataService.browseToReward('incentive/visualization');
      }

    
      affectclick(index, q, mood) {
        console.log("" + index + ", " + mood);
    
        //
        //if(index == 1){
        if (this.affect[index - 1].includes("<u>"))
          this.affect[index - 1] = this.affect[index - 1].replace('<u><b>', '').replace('</b></u>', '');
        else
          this.affect[index - 1] = '<u><b>' + this.affect[index - 1] + '</b></u>';
        //}
    
        for (var i = 0; i < this.affect.length; i++) {
            if ((i + 1) == index)
                continue;
            else {
                this.affect[i] = this.affect[i].replace('<u><b>', '');
                this.affect[i] = this.affect[i].replace('</b></u>', '');
                //console.log($scope.affect);
            }
        }
    
        this.reponse_ts[q] = {};
        this.reponse_ts[q].ts = Date.now();
        this.reponse_ts[q].readable_ts = moment().format("MMMM Do YYYY, h:mm:ss a");
    
        this.survey2[q] = mood;
        //console.log(JSON.stringify(this.survey));
      }
  
     hackQ3d(s,label){
          //console.log("True " +  ($scope.survey.Q3d==undefined || $scope.survey.Q3d=='0' || $scope.survey.Q3d=='0.5'));
          this.survey_cond[label+ "Show"] = eval(s);
           console.log("hackQ3d "+label + "Show "+this.survey_cond[label + "Show"]);
     }
  
     hackQ10d(s,label,questions){
          //console.log("True " +  ($scope.survey.Q3d==undefined || $scope.survey.Q3d=='0' || $scope.survey.Q3d=='0.5'));
          var sel = this.survey2[questions];
          var dep = s ;
          //console.log("compareSelectionWithDependency "+questions+" "+sel+" "+s);
          if(sel!=undefined && s!= undefined){
             sel = sel.replace(/\s+/g, "");
             dep = s.replace(/\s+/g, "");
          }
          this.survey_cond[label + "Show"] = false;
          if(sel === dep)
          { 
            this.survey_cond[label + "Show"]=true;
          }
  
          console.log("hackQ10d "+name+" for "+questions+" "+this.survey_cond[label + "Show"]);
  
      }

      inputchanged(questions) {
        //console.log("Qs:" + questions + ", ts:" + Date.now() + ", readable_time:" + moment().format("MMMM Do YYYY, h:mm:ss a"));
        console.log('holla: ' + questions+" "+this.survey2["Q18O1"]);
        console.log(JSON.stringify(this.survey2));

        this.reponse_ts[questions] = {};
        this.reponse_ts[questions].ts = Date.now();
        this.reponse_ts[questions].readable_ts = moment().format("MMMM Do YYYY, h:mm:ss a");

        //console.log(JSON.stringify($scope.survey));
        if(this.name[questions] != null) {
            for (var j = 0; j < this.name[questions].length; j++){
                var name= this.name[questions][j];
                if(this.surveydependency!=undefined && this.surveydependency[name+questions]!=undefined) {
                    //console.log(JSON.stringify($scope.surveydependency));
                    this.hackQ3d(this.surveydependency[name+questions],name+questions);
                }
    
                //handle the case when there is empty space in the show array
                if(this.namedependency!=undefined && this.namedependency[name+questions]!=undefined) {
                    console.log(JSON.stringify(this.namedependency));
                    this.hackQ10d(this.namedependency[name+questions],name+questions,questions);
                }
            }
        }
    }      
      
  /*   inputchangedtimepicker(questions) {
      var x = this.survey2[questions];
      console.log(this.survey2[questions]);
      this.survey2[questions] = moment(x).format('h:mm a');
      this.survey2[questions + "_tz"] = moment(x).format('h:mma Z');
      this.inputchanged(questions);
    }
 */
      inputchangedtimepicker(pickedTime){
        console.log(JSON.stringify(this.survey2));
        //pickedTime = moment(pickedTime).format('h:mm a')
        console.log(pickedTime);
       }


    });

    const tmpModule = NgModule({ declarations: [tmpCmp], imports: [FormsModule, BrowserModule], providers: [StoreToFirebaseService], schemas: [CUSTOM_ELEMENTS_SCHEMA]})(class {
    });

    this._compiler.compileModuleAndAllComponentsAsync(tmpModule)
      .then((factories) => {
        const f = factories.componentFactories[0];
        const cmpRef = this.vc.createComponent(f);
        cmpRef.instance.storeToFirebaseService = this.storeToFirebaseService;
        cmpRef.instance.EncrDecr = this.EncrDecr;
        cmpRef.instance.survey2 = this.survey;
        cmpRef.instance.surveydependency = this.surveydependency;
        cmpRef.instance.namedependency = this.namedependency;
        cmpRef.instance.name = this.name;
        cmpRef.instance.survey_cond = this.survey_cond;
        cmpRef.instance.affect = this.affect;
        cmpRef.instance.plt = this.plt;
        cmpRef.instance.name = 'dynamic';
        //console.log('called');
    })
  }

  getTitle() {
    return this.title;
  }

     //get random integer
  getRandomInt(range){
    return Math.floor(Math.random() * range) + 1;
  }
  // process survey if obj type is random

  process_survey_random(obj, survey_string, i){
      var filename = obj.extra;
      console.log("location: " + filename);
      var has_returned = 0;
      survey_string = survey_string + '<p compile="randomq""></p>';
/*       $http.get(filename).success(function(data2) {
          var obj_random_q = data2;
          var rand_index = this.getRandomInt(obj_random_q.length - 1)
          this.randomq = this.process_survey(obj_random_q[rand_index], "", i);
          this.rand_index = rand_index;
      }); */

      fetch(filename).then(async res => {
        var obj_random_q = await res.json();
        this.rand_index = this.getRandomInt(obj_random_q.length - 1)
        this.randomq = this.process_survey(obj_random_q[this.rand_index], "", i);
     });
       
      return survey_string;

  }

  // process survey if obj type is textbox
  process_survey_textbox(survey_string, i){
      this.survey[i] = "";
      survey_string = [survey_string,
          '<ion-item>',
          '<ion-input ngDefaultControl type="text" placeholder="Enter here" [(ngModel)]="survey2.' + i + '"', ' (ionChange)="inputchanged(\'' + i + '\')"></ion-input></ion-item>'
      ].join(" ");
      return survey_string;

  }

    // process survey if obj type is timepicker
  process_survey_timepicker(survey_string, i){
    this.survey[i] = moment(new Date()).format('h:mm a');
    survey_string = [survey_string,
        // '<div class="item item-icon-left" ion-datetime-picker time am-pm [(ngModel)]="survey2.' + i + '"', ' (ionChange)="inputchangedtimepicker(\'' + i + '\')">',
        // '<i class="icon ion-ios-clock positive"></i>',
        // '<strong>{{survey.' + i + '| date: "h:mm a"}}</strong>',
        // '</div>'
        
        '<ion-datetime ngDefaultControl display-format="h:mm a" pickerFormat="h:mm a" [(ngModel)]="survey2.' + i + '"', ' (ionChange)="inputchangedtimepicker(survey2.' + i + ')">',
        '</ion-datetime>'
        ].join(" ");
    return survey_string;
  }

  // process survey if obj type is comment
  process_survey_comment(survey_string){
      survey_string = [survey_string,
          '<div>',
          '<p>',
          "",
          '</p>',
          '</div>'
      ].join(" ");
      return survey_string;
  }

  // process survey if obj type is image
  process_survey_image(obj, survey_string){
      survey_string = [survey_string,
          '<div>',
          '<p>',
          "",
          '</p>',
          '<img style="height: 100%; width: 100%; object-fit: contain" src="' + obj.image_location + '">',
          '</div>'
      ].join(" ");

      return survey_string;
  }

  // process survey if obj type is mood
  process_survey_mood(survey_string, i){
      survey_string = [survey_string,
          '<div class="radioimages">',
          '<label><input ngDefaultControl type="radio" [(ngModel)]="survey2.' + i + '" value="high-sad" (ionChange)="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/5.png></label>',
          '<label><input ngDefaultControl type="radio" [(ngModel)]="survey2.' + i + '" value="low-sad" (ionChange)="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/4.png></label>',
          '<label><input ngDefaultControl type="radio" [(ngModel)]="survey2.' + i + '" value="neutral" (ionChange)="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/3.png></label>',
          '<label><input ngDefaultControl type="radio" [(ngModel)]="survey2.' + i + '" value="low-happy"  (ionChange)="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/2.png></label>',
          '<label><input ngDefaultControl type="radio" [(ngModel)]="survey2.' + i + '" value="high-happy"  (ionChange)="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/1.png></label>',
          '</label></div>'
      ].join(" ");

      return survey_string;
  }

  // process survey if obj type is moodgrid
  process_survey_moodgrid(survey_string, i){
      this.affect = ['Afraid', 'Tense', 'Excited', 'Delighted', 'Frustrated', 'Angry', 'Happy', 'Glad', 'Miserable', 'Sad', 'Calm', 'Satisfied', 'Gloomy', 'Tired', 'Sleepy', 'Serene'];

      var affect = this.affect;
      var colors = ['#ff99a3', '#ff99a3', '#ffc266', '#ffc266', '#ffb3ba', '#ffb3ba', '#FFE0B2', '#FFE0B2', '#BBDEFB', '#BBDEFB', '#C8E6C9', '#C8E6C9', '#e7f3fe', '#e7f3fe', '#eef7ee', '#eef7ee'];

      var html_string = [];
      for (var j = 0; j < 4; j++) {

          html_string.push('<div class = "row">');

          for (var ii = 0; ii < 4; ii++) {
              var index = j * 4 + ii;
              html_string.push('<div (click)="affectclick(' + (index + 1) + ',\'' + i + '\'' + ',\'' + affect[index] + '\')" class = "col col-25"><div style="width:100%;padding-bottom:15%;padding-top:25%;background-color:' + colors[index] + '" align="center">' +
                  '<p ng-bind-html="affect[' + index + ']"></p></div></div>');
          }
          html_string.push('</div>');
      }
      var str = html_string.join(" ");
      survey_string = [survey_string, str].join(" ");

      return survey_string;
  }

  // process survey if obj type is moodgrid2
  process_survey_moodgrid2(survey_string){
      survey_string = [survey_string,
          '<canvas id="myCanvas" width="310" height="310" style="border:0px solid #000000;padding:10px;">',
          'Your browser does not support the HTML5 canvas tag.',
          '</canvas>'
      ].join(" ");

      return survey_string;
  }
      
  // process survey if obj type is autocomplete
  process_survey_autocomplete(obj, survey_string, i){
      survey_string = survey_string +
      '<label class="item item-input">' +
      '<input ion-autocomplete type="text" readonly="readonly" ' +
      'class="ion-autocomplete" autocomplete="on" [(ngModel)]="survey2.' + i +
      '" max-selected-items="1" items-method-value-key="items" ' +
      'items-method="callbackMethod(query,isInitializing,componentId)" ' +
      'items-clicked-method="clickedMethod(callback)" ' +
      'title-text = "' + obj.text + '" ' +
      'id="Q' + i + '" ' +
      'component-id="' + i + '"' +
      ' (change)="inputchanged(\'' + i + '\')"/>' +
      '</label>';
      var options = obj.extra;


      //if i have records for the question load from there. 
      this.autocomplete_options = JSON.parse(window.localStorage['ema_ac_' + i] || '[]');
      if (this.autocomplete_options.length == 0) {
          for (var k = 0; k < options.length; k++) {
              this.autocomplete_options.push({
                  "text": options[k],
                  "times": 1
              });
          }
          window.localStorage['ema_ac_' + i] = JSON.stringify(this.autocomplete_options);
      } else {
          options = [];

          this.autocomplete_options.sort(function(a, b) {
              return b.times - a.times;
          });

          for (var k = 0; k < this.autocomplete_options.length; k++) {
              options.push(this.autocomplete_options[k].text);

              //  
              //console.log("Item " + k + ": " + $scope.autocomplete_options[k].text + " " + $scope.autocomplete_options[k].times);
          }
          //
      }

      this.autocomplete_options[i] = options;

      //auto complete assigned
      console.log("Autocomplete options: " + this.autocomplete_options[i]);
      if(this.choices == undefined) this.choices = {};
      this.choices[obj.name]= this.autocomplete_options[i];

      return survey_string;
  }

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

          if(this.choices == undefined) this.choices = {};
          this.choices[obj.name]= obj.extra.choices;
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

  // process survey if obj type is range
  process_survey_range(obj, survey_string, i){
      var min = obj.extra.choices[2];
      var max = obj.extra.choices[3];
      var step = obj.extra.choices[4];
      this.survey[i] = 0;
      survey_string = [survey_string,
/*           '<div class = "row" style="margin-bottom=0px;">',
          '<div class = "col col-10"><p align="center" style="padding-top:2px;padding-bottom:2px;margin:0px;border-radius:5px;background:#4e5dca;color:white;">' + min + '</p></div>',
          '<div class = "col col-10"></div>',
          '<div class = "col col-20 col-offset-20"><p align="center" style="padding-top:2px;padding-bottom:2px;margin:0px;border-radius:25px;background:#303F9F;color:white;"><b>{{survey.' + i + '}}</b></p></div>',
          '<div class = "col col-10"></div>',
          '<div class = "col col-10 col-offset-20"><p align="center" style="padding-top:2px;padding-bottom:2px;margin:0px;border-radius:5px;background:#4e5dca;color:white;">' + max + '</p></div>',
          '</div>',
          '<div class="item range range-balanced" style="padding:10px;padding-top:1px;border-width:0px;">',
          '<p style="text-align: center;color: black;">' + obj.extra.choices[0] + "</p>",
          '<input type="range" min="' + min + '" max="' + max + '" value="' + min + '" step="' + step + '" [(ngModel)]="survey2.' + i + '" name="' + i + '" (change)="inputchanged(\'' + i + '\')"' + '>',
          '<p style="text-align: center;color:black;">' + obj.extra.choices[1] + "</p>",
          '</div>', */
          '<ion-item><ion-range ngDefaultControl min="' + min + '" max="' + max + '" value="' + min + '" step="' + step + '" [(ngModel)]="survey2.' + i + '" name="' + i + '" (ionChange)="inputchanged(\'' + i + '\')"' + '>',
          '<ion-label slot="start">'+obj.extra.choices[0]+'</ion-label>',
          '<ion-label slot="end">'+ obj.extra.choices[1]+'</ion-label>',
          '</ion-range>',
          '</ion-item>',

      ].join(" ");

      return survey_string;
  }    

  // process survey if obj type is range2
  process_survey_range2(obj, survey_string, i){
      var min = obj.extra.choices[2];
      var max = obj.extra.choices[3];
      var step = obj.extra.choices[4];
      this.survey[i] = 25*60;
      survey_string = [survey_string,
          '<div class = "row">',
          '<div class = "col col-33 col-offset-67"><p align="center" style="padding:5px;border-radius:25px;background:#303F9F;color:white;"><b>{{survey.' + i + '/60}} hours</b></p></div>',
          '</div>',
          '<div class="item range range-balanced" style="padding:10px;border-width:0px;">',
          '<p style="text-align: center;color: black;">' + obj.extra.choices[0] + "</p>",
          '<input ngDefaultControl type="range" min="' + min + '" max="' + max + '" value="' + min + '" step="' + step + '" [(ngModel)]="survey2.' + i + '" name="' + i + '" (change)="inputchanged(\'' + i + '\')"' + '>',
          '<p style="text-align: center;color:black;">' + "24<br>hours" + "</p>",
          '</div>',
      ].join(" ");

      return survey_string;
  }   

  // process survey if obj type is checkbox
  process_survey_checkbox(obj, survey_string, i){
      survey_string = survey_string + '<ion-list>';
      for (var j = 0; j < obj.extra.choices.length; j++) {
          survey_string = [survey_string, 
             '<ion-item>',
             '<ion-label>'+ obj.extra.choices[j]+'</ion-label>',
             '<ion-checkbox ngDefaultControl color="light" [(ngModel)]="survey2.' + i + 'O' + j + '" (ionChange)="inputchanged(\'' + i + '\')"' + '></ion-checkbox>',
             '</ion-item>'
            ].join(" ");
      }
      survey_string = survey_string + '</ion-list>';
      if(this.choices == undefined) this.choices = {};
      this.choices[obj.name]= obj.extra.choices;

      return survey_string; 
  }   

  // process survey if obj type is captcha
  process_survey_captcha(obj, survey_string){
      survey_string = [survey_string,
          '<div class="card"><div class="quetiontextstyle">',
          obj.text + "<br><b>" + '<img src="js/captcha_images/{{survey.q7answer}}" alt="Smiley face" height="60" width="auto">' + "</b>",
          '</div>'
      ].join(" ");

      var filename = obj.extra.filesnames;
      var dir_loc = obj.extra.captchdir;

/*       $http.get(filename).success(function(data3) {
          var obj_captcha_q = data3[0].data;
          console.log("captcha data: " + obj_captcha_q + ", length: " + obj_captcha_q.length);
          $scope.survey.q7answer = data3[0].data[getRandomInt(0, obj_captcha_q.length - 1)];
      });
 */
      fetch(filename).then(res => res.json())
      .then(data3 => {
          var obj_captcha_q  = data3[0].data;
          console.log("captcha data: " + obj_captcha_q + ", length: " + obj_captcha_q.length);
          this.survey['q7answer'] = data3[0].data[this.getRandomInt(obj_captcha_q.length - 1)];          
      });
            

      obj.type = "textbox";

      return survey_string;
  }   

  // process survey where there is dependency
  process_survey_captcha_2(obj, survey_string, i){
      //$scope.survey.test = obj.extra.dependency.question == obj.extra.dependency.show;
      //'<div class="card" ng-show=' + '{{survey.' + obj.extra.dependency.question + '=="' + obj.extra.dependency.show + '"}}' +'>', 
      if(this.name == undefined) this.name = {};

      if(this.name[obj.extra.dependency.question] == undefined)
      this.name[obj.extra.dependency.question] = [];

     this.name[obj.extra.dependency.question].push(i);

      console.log(obj.name);
      var show_array = obj.extra.dependency.show;

      if(show_array == undefined) {

        //console.log(obj.extra.dependency.question);
        //console.log($scope.choices[obj.extra.dependency.question]);
        if(this.choices[obj.extra.dependency.question] instanceof Array ) {
            show_array = this.choices[obj.extra.dependency.question].slice();
        }

        for (var j = 0; j < obj.extra.dependency.hide.length; j++){
            //console.log(obj.extra.dependency.hide[j]);

            var index = show_array.indexOf(obj.extra.dependency.hide[j]);
            show_array.splice(index, 1);
        }
        //console.log(show_array);

      }


      console.log(show_array);
      if(show_array instanceof Array){

          console.log("blah"+show_array);
          var does_exist = "";
          for (var j = 0; j < show_array.length; j++){

              if(j>0) {
                  does_exist = does_exist + "||";
              }

              does_exist = does_exist + "survey." + obj.extra.dependency.question + ' =="' + show_array[j] + '"';

          }
          console.log(obj.extra.dependency.question);
          console.log(does_exist);

          // var does_exist = "";

          //  does_exist = does_exist + "$scope.survey." + obj.extra.dependency.question + '=="' + show_array[0] + '"';
          //  does_exist = does_exist + " || ";
          //  does_exist = does_exist + "$scope.survey." + obj.extra.dependency.question + '=="' + show_array[1] + '"';
          // console.log($scope.survey[obj.extra.dependency.question] + " " + does_exist);


          if(this.surveydependency == undefined) this.surveydependency = {};

          this.surveydependency[i+obj.extra.dependency.question] = does_exist;
          this.survey_cond[i + obj.extra.dependency.question + "Show"] = false;

          survey_string = [survey_string,
              '<div class="card" ng-show="survey_cond.'+ i + obj.extra.dependency.question + "Show" +'">',
              //'<div class="card" ng-show='+false + '>', 
              '<div class="quetiontextstyle">',
              obj.text,
              '</div>'
          ].join(" ");

      } else if(show_array.indexOf(' ') >= 0){

          if(this.namedependency == undefined) this.namedependency = {};

          this.namedependency[i+obj.extra.dependency.question] = show_array;

          console.log(i + obj.extra.dependency.question + "Show "+show_array);
          this.survey_cond[i + obj.extra.dependency.question + "Show"] = false;
          survey_string = [survey_string,
              '<div class="card" ng-show="survey_cond.'+ i + obj.extra.dependency.question + "Show" +'">',
              //'<div class="card" ng-show=' + false + '>', 
              //'<div class="card" ng-show="compareSelectionWithDependency(\'' + i + '\', \''+ obj.extra.dependency.show + '\')">', 
              '<div class="quetiontextstyle">',
              obj.text,
              '</div>'
              ].join(" ");
          //console.log(survey_string);

      } else {
          console.log(JSON.stringify(this.survey)+" "+obj.extra.dependency.show);

          survey_string = [survey_string,
              '<div class="card" ng-show=(' + "survey2." + obj.extra.dependency.question + ' =="'+ obj.extra.dependency.show + '"' + ')>',
              //'<div class="card" ng-show=' + false + '>', 
              '<div class="quetiontextstyle">',
              obj.text,
              '</div>'
          ].join(" ");
          //console.log(survey_string);
      }
      return survey_string;
  }   

  process_survey(obj, survey_string, i) {

/*     survey_string = [survey_string,
      '<div class="card"><div class="quetiontextstyle">',
      obj.text,
      '</div>'
    ].join(" "); */

    if (obj.type == 'random') {
      this.process_survey_random(obj, survey_string, i);

    } else {
      //
       if (obj.type == "captcha") {

          survey_string = this.process_survey_captcha(obj, survey_string);

      } else {
          if (("extra" in obj) && ("dependency" in obj.extra)) {
              survey_string = this.process_survey_captcha_2(obj, survey_string, i);
           } else {
              survey_string = [survey_string,
                  '<div class="card"><div class="quetiontextstyle">',
                  obj.text,
                  '</div>'
              ].join(" ");
              
           }
      }
 
      //------------------------------------------------------                  
      //text box  
      //------------------------------------------------------                 
      if (obj.type == "textbox") {
          survey_string = this.process_survey_textbox(survey_string, i);
      }

    //------------------------------------------------------                  
      //time picker
      //------------------------------------------------------                 
      if (obj.type == "timepicker") {
          survey_string = this.process_survey_timepicker(survey_string, i);
      }

      //------------------------------------------------------                  
      //paragraph
      //------------------------------------------------------                 
      if (obj.type == "comment") {
          survey_string = this.process_survey_comment(survey_string);
      }

      //------------------------------------------------------                  
      //image
      //------------------------------------------------------  
      if (obj.type == "image") {
          survey_string = this.process_survey_image(obj, survey_string);
      }


      //------------------------------------------------------
      //  mood
      //------------------------------------------------------
      if (obj.type == 'mood') {
          survey_string = this.process_survey_mood(survey_string, i);
      }


      //------------------------------------------------------
      //  mood-grid
      //------------------------------------------------------
      if (obj.type == 'moodgrid') {
          survey_string = this.process_survey_moodgrid(survey_string, i);
      }

      if (obj.type == "moodgrid2") {
          survey_string = this.process_survey_moodgrid2(survey_string);
      }



      //------------------------------------------------------                  
      // Autocomplete 
      //------------------------------------------------------   
      // 'component-id="Q' + i + '" ' + 
      if (obj.type == 'autocomplete') {
          survey_string = this.process_survey_autocomplete(obj, survey_string, i);
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
          survey_string = this.process_survey_range(obj, survey_string, i);
      }

      if (obj.type == "range2") {
          survey_string = this.process_survey_range2(obj, survey_string, i);
      }


      //------------------------------------------------------                  
      //checkbox  
      //------------------------------------------------------                 
      if (obj.type == "checkbox") {
          survey_string = this.process_survey_checkbox(obj, survey_string, i);
      }

      survey_string = survey_string + '</div>';
    }
    return survey_string;
  }


}

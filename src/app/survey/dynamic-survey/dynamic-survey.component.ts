import { Component, OnInit, ViewChild, ViewContainerRef, NgModule, Compiler, Injector, NgModuleRef, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreToFirebaseService } from '../../storage/store-to-firebase.service';
import { EncrDecrService } from '../../storage/encrdecrservice.service';
import { Platform } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-dynamic-survey',
  templateUrl: './dynamic-survey.component.html',
  styleUrls: ['./dynamic-survey.component.scss'],
})
export class DynamicSurveyComponent implements OnInit {

  title = "mash is here";
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
  survey_string = "";
  survey = {};

  @ViewChild('vc', { read: ViewContainerRef }) vc: ViewContainerRef;



  constructor(private _compiler: Compiler,
    private _injector: Injector,
    private _m: NgModuleRef<any>, 
    private storeToFirebaseService: StoreToFirebaseService,
    private EncrDecr: EncrDecrService,
    public plt: Platform) {
  }

  ngOnInit() { }

  ngAfterViewInit() {

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
      console.log("Done " + obj.text);
      this.survey_string = this.process_survey(obj, this.survey_string, obj.name);
    }
    this.survey_string = this.survey_string + '<div class="ion-padding"><button class="buttonold button-positive" (click)="storeData()">Submit</button></div>';


    const tmpCmp = Component({ template: this.survey_string })(class implements OnInit{
      
      survey2 = {};
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
      inputchanged(questions) {
        //console.log('holla: ' + questions);
        console.log(JSON.stringify(this.survey2));
      }

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

        this.storeToFirebaseService.addSurvey('/results',this.survey2);
        
        //save to Amazon AWS S3
        //this.awsS3Service.upload(this.question.getData());
        //console.log("End of storeData");
    
        //save to azure 
        //this.azureService.upload(this.question.getData());
    
        //this.saveDataService.browseToReward('/incentive/award');
        //this.saveDataService.browseToReward('incentive/visualization');
      }

    });

    const tmpModule = NgModule({ declarations: [tmpCmp], imports: [FormsModule], providers: [StoreToFirebaseService] })(class {
    });

    this._compiler.compileModuleAndAllComponentsAsync(tmpModule)
      .then((factories) => {
        const f = factories.componentFactories[0];
        const cmpRef = this.vc.createComponent(f);
        cmpRef.instance.storeToFirebaseService = this.storeToFirebaseService;
        cmpRef.instance.EncrDecr = this.EncrDecr;
        cmpRef.instance.plt = this.plt;
        cmpRef.instance.name = 'dynamic';
        //console.log('called');
    })
  }

  getTitle() {
    return this.title;
  }

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

          /*  
          survey_string = survey_string + '<li><input type="radio" id="optionQ' + 
            i + "I" + j + '" name="Q' + i + '"><label for="optionQ' + i + "I" + 
            j + '">' + obj.extra.choices[j] + 
            '</label><div class="check"></div></li>';
          */

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
      if (obj.extra.orientation == "horzontal") {

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

}

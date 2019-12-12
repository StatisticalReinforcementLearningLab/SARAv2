//
//--- The goal of this file is to dynamically generate a survey from a JSON file. 
//--- Example JSON files are located in assets/survey folder. 
//
//--- At a high level, this file does the following:
//      (i) reads a JSON file in the "ngAfterViewInit" 
//      (ii) calls the "generateSurvey" function to create html codes for the survey
//      (iii) creates a component dynamically and attached it to the "vc" component.


import { Component, OnInit, ViewChild, ViewContainerRef, NgModule, Compiler, Injector, NgModuleRef, ElementRef, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreToFirebaseService } from '../../storage/store-to-firebase.service';
import { EncrDecrService } from '../../storage/encrdecrservice.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-dynamic-survey',
  templateUrl: './dynamic-survey.component.html',
  styleUrls: ['./dynamic-survey.component.scss'],
})
export class DynamicSurveyComponent implements OnInit {

  @Input() fileLink: string;

  survey_string = "";
  survey = {};
  survey_data: any;

  //"vc" is the div tag where the dynamic survey will be added.
  @ViewChild('vc', { read: ViewContainerRef }) vc: ViewContainerRef;

  constructor(private _compiler: Compiler,
    private _injector: Injector,
    private _m: NgModuleRef<any>, 
    private storeToFirebaseService: StoreToFirebaseService,
    private EncrDecr: EncrDecrService,
    private router: Router,
    public plt: Platform) {
  }

  ngOnInit() { }

  ngAfterViewInit() {
      console.log('Reading local json files: ' + this.fileLink);

      //fetch JSON file and once the file is fetched called "generateSurvey" to create the survey.
      fetch('../../../assets/survey/'+this.fileLink+'.json').then(async res => {
        this.survey_data = await res.json();
        this.generateSurvey();
      });
  }


  generateSurvey() {  

    //go through each question in the JSON file. 
    for (var i = 0; i < this.survey_data.length; i++) {
      var obj = this.survey_data[i]; // this is one object from the JSON file
      console.log("Done " + obj.text);
      this.survey_string = this.process_survey(obj, this.survey_string, obj.name); //here, the object is converted to a question.
    }
    this.survey_string = this.survey_string + '<div class="ion-padding"><button class="buttonold button-positive" (click)="storeData()">Submit</button></div>';


    //---
    //--- Generate a survey component dynamically from the "survey_string."
    //--- The "survey_string" contains all the HTML for the template for dynamic component
    //--- 
    const surveyComponent = Component({ template: this.survey_string })(class implements OnInit{
      
      survey2 = {};
      storeToFirebaseService: StoreToFirebaseService;
      EncrDecr: EncrDecrService;
      plt: Platform;
      router: Router;

      constructor() {
        this.survey2['starttimeUTC'] = new Date().getTime();
      }

      //storeData function is called when user presses the "submit" button
      //This function also encrypts the survey and stores it into a demo firebase table.
      storeData(){
        console.log("Inside storeData");
        console.log(JSON.stringify(this.survey2));


        this.survey2['endtimeUTC'] = new Date().getTime();
        this.survey2['ts'] = moment().format('MMMM Do YYYY, h:mm:ss a Z');

        this.survey2['devicInfo'] = this.plt.platforms();


        var encrypted = this.EncrDecr.encrypt(JSON.stringify(this.survey2), "Z&wz=BGw;%q49/<)");
        var decrypted = this.EncrDecr.decrypt(encrypted, "Z&wz=BGw;%q49/<)");

        console.log('Encrypted :' + encrypted);
        console.log('Decrypted :' + decrypted);
        this.survey2['encrypted'] = encrypted;

        this.storeToFirebaseService.addSurvey('/results',this.survey2);

        this.router.navigate(['/home']);
        
      }

      ngOnInit() {}

      ngAfterViewInit() {
        setTimeout(e => this.drawMoodGrid(this), 200);
      }


      //This function tracks if users clicked on a survey question
      modelChanged(newObj) {
        //console.log('holla' + newObj);
      }

      //This function tracks if users clicked on a survey question and reacts. 
      //Currently this function is use-used
      //ToDo: Add the timestamp when the user clicked the input
      inputchanged(questions) {
        //console.log(JSON.stringify(this.survey2));
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
          var rect = c.getBoundingClientRect();
          var lastPos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          };

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

    });

    const surveyModule = NgModule({ declarations: [surveyComponent], imports: [FormsModule], providers: [StoreToFirebaseService] })(class {
    });

    this._compiler.compileModuleAndAllComponentsAsync(surveyModule)
      .then((factories) => {
        const f = factories.componentFactories[0];
        const cmpRef = this.vc.createComponent(f);
        cmpRef.instance.storeToFirebaseService = this.storeToFirebaseService;
        cmpRef.instance.EncrDecr = this.EncrDecr;
        cmpRef.instance.plt = this.plt;
        cmpRef.instance.router = this.router;// Router,
        cmpRef.instance.name = 'dynamic';
      })
    }

 


    //
    // process survey for all types of objects
    // Our current questionaire only has radio buttons. We have codes for other types of inputs, which we will gradually add.
    //
    process_survey(obj, survey_string, i) {

          survey_string = [survey_string,
            '<div class="card"><div class="quetiontextstyle">',
            obj.text,
            '</div>'
          ].join(" "); 
      
          if (obj.type == 'random') {
      
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
            survey_string = survey_string + '</ul></div>';
        }

        //------------------------------------------------------ 
        //radio button, horizontal     
        //------------------------------------------------------
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
            }

            //ending text
            survey_string = survey_string + '<li><p>' + obj.extra.choices[obj.extra.choices.length-1] + '</p></li>';
            survey_string = survey_string + '</ul></div>';
        }


        return survey_string;
    }

}

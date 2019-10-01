import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sample-life-insights',
  templateUrl: './sample-life-insights.component.html',
  styleUrls: ['./sample-life-insights.component.scss'],
})
export class SampleLifeInsightsComponent implements OnInit {

  questions;
  qimgs;
  lifeInsightsTitle;
  qYaxis;
  qSubText;
  lifeInsightsHighStress;
  lifeInsightsLowStress;

  inputJson = {};
  //inputString;

  constructor() {
    this.questions = ["Q1d","Q3d","Q4d","Q5d","Q6d"];// ,"Q7d"];
    this.qimgs = ["assets/img/stress.png","assets/img/freetime.png","assets/img/dance2.png","assets/img/social.png","assets/img/exciting.png"];
    this.lifeInsightsTitle = ["How <b>relaxed</b> did you feel this week?", 
                "How much <b>free time</b> did you have this week?", 
                "How much <b>fun</b> did you have this week?  <i class='em em-tada'></i>", 
                "How <b>lonely</b> did you feel this week?", 
                "How <b>new</b> and <b>exciting</b> was your week?"];

    this.qYaxis = ["Stress level","Hours free","Level of fun","Degree of loneliness","Level of exicitement"];        
    this.qSubText = ["0 = low stress, 4 = high stress", 
                    "Hours of free time everyday",
                    "0 = low fun, 4 = a lot of fun",
                    "0 = very social, 4 = very lonely",
                    "0 = low excitment, 4 = very exciting"];   

    this.lifeInsightsHighStress = ["Stressed <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>", 
                                    "15 hours <i class='em em-clock10'></i>", 
                                    "day was fun <i class='em em-balloon'></i>", 
                                    "day was like <i class='em em-person_frowning'></i", 
                                    "day was like <i class='em em-fire'></i><i class='em em-dancers'></i><i class='em em-palm_tree'></i>"];

    this.lifeInsightsLowStress = ["Relaxed <i class='em em-sunglasses'></i><i class='em em-boat'></i>", 
                                    "0 hour <i class='em em-clock12'></i>", 
                                    "day was lame  <i class='em em--1'></i>", 
                                    "day was like <i class='em em-two_women_holding_hands'>", 
                                    "day was like <i class='em em-zzz'></i>"];
    
    this.inputJson["imgloc"] = this.qimgs[0];
    this.inputJson["title"] = this.lifeInsightsTitle[0];
    this.inputJson["subtext"] = this.qSubText[0];
    this.inputJson["topSubtext"] = this.lifeInsightsHighStress[0];
    this.inputJson["bottomSubtext"] = this.lifeInsightsLowStress[0];
    this.inputJson["label"] = this.questions[0];
    this.inputJson["data"] = [0, 1, 3, 4, null, 3, 1];
    //this.inputString = JSON.stringify(this.inputJson);
    //console.log(JSON.stringify(this.inputJson));

   }

  ngOnInit() {
  
  }

}

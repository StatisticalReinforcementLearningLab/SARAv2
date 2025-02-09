import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/monitor/database.service';
import { UploadserviceService } from 'src/app/storage/uploadservice.service';

@Component({
  selector: 'app-treasurechest',
  templateUrl: './treasurechest.component.html',
  styleUrls: ['./treasurechest.component.scss'],
})
export class TreasurechestComponent implements OnInit {

  amount_earned = "$0";
  pearlsAndGems = [];
  pointsdata = [];


  constructor(private uploadService: UploadserviceService) { 
  }

  ngOnInit() {

    //load reward data
    var badges;
    //badges = JSON.parse(window.localStorage['badges'] || "{}");
    var user_data = JSON.parse(window.localStorage['user_data'] || "{}");
    badges = user_data['badges'] || {};
    if('money' in badges){ //means things are empty.
    }else{
          badges['daily_survey'] = [0,0,0,0,0,0];
          badges['weekly_survey'] = [0,0,0,0];
          badges['active_tasks'] = [0,0,0,0,0,0];
          badges['money'] = 10;
    }


    //add the money
    this.amount_earned = "$" + badges['money']

    //
    if(window.localStorage['AwardDollar'] == undefined)
        this.amount_earned = "$" + 0;
    else
        this.amount_earned = "$" + parseInt(window.localStorage['AwardDollar']);



    //add the badges for daily survey
    var daily_survey_tasks = [2,1,0,3,1,1];//badges['daily_survey'];
    //daily_survey_tasks = [3,2,0,2,2,1]; 
    //daily_survey_tasks = [0,0,0,0,0];
    //badges['weekly_survey'] = [0,0,0,0];
    var daily_width = [50,30,42,30,42,40,46];
    var ds_tasks_badges = ['img/backgroud_daily.png','img/green.png','img/blue.png','img/red.png','img/bronze.png','img/silver.png','img/gold.png'];
    for(var i = 1; i < ds_tasks_badges.length; i++){
      if(daily_survey_tasks[i-1] > 0){
        for(var q = 0; q < daily_survey_tasks[i-1]; q++)
          this.pearlsAndGems.push({"img": "assets/" + ds_tasks_badges[i], "count": daily_survey_tasks[i-1], "width": daily_width[i]*3/2});
      }
    }



    fetch('../../../assets/game/fishpoints.json').then(async res => {
      //console.log("Fishes: " + data);

      var data = await res.json();
      var current_points = 700;

      var survey_string = "";
      var isNextAvailableStillMasked = false;
      for(var i = 0; i < data.length; i++) {
          data[i].class = 'nonshade';
          data[i].img = "assets/" + data[i].img.substring(0, data[i].img.length-4) + '_tn.jpg';
          data[i].fish_index = i; 
          data[i].show_trivia = 1;
          
          /*
          if(current_points < data[i].points){
            if(isNextAvailableStillMasked == false){
               //
               data[i].img = data[i].img.substring(0, data[i].img.length-7) + '-grey_tn.jpg';
               isNextAvailableStillMasked = true;
               //data[i].class = 'shade';
            }
            else{
              data[i].img = 'assets/img/cryptocoin_tn.jpg';
            }

            data[i].show_trivia = 0; 
          }

          if(data[i].name === 'Sea environment'){
            data[i].show_trivia = 0; 
          }
          */
      }
       
      this.pointsdata = data;
      //console.log("Fishes: " + JSON.stringify(this.pointsdata));


      //console.log("Fishes: " + JSON.stringify($scope.pointsdata));
      //$scope.$apply();
    });

    

    //add the fish to be unlocked


  }

  sum(arr){
    var total=0;
    for(var i in arr){
      total += arr[i]; 
    }
    return total;
  }

  ionViewDidEnter() {
    //
    this.uploadService.saveAppUsageEnter("treasure_chest"); 
  }

  ionViewDidLeave(){
    this.uploadService.saveAppUsageExit("treasure_chest");     
  }

}

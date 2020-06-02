import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-unlocked-inspirational-quotes',
  templateUrl: './unlocked-inspirational-quotes.component.html',
  styleUrls: ['./unlocked-inspirational-quotes.component.css']
})
export class UnlockedInspirationalQuotesComponent implements OnInit {

  unlockedInspirationalQuotes = [];

  constructor(
    private userProfileService: UserProfileService,
    private httpClient: HttpClient
  ) { }


  get username(){
    if(this.userProfileService == undefined)
      return "test";
    else{
      return this.userProfileService.username;
    }
  }

  ngOnInit() {
    
  }

  ionViewDidEnter() {
    //pre-populate
    this.unlockedInspirationalQuotes = JSON.parse(window.localStorage.getItem("saved_quotes") || '[]');
    this.getInspirationalQuotes();
  }

  getInspirationalQuotes() {
    
    var flaskServerAPIEndpoint = environment.flaskServerForIncentives;
    this.httpClient.post(flaskServerAPIEndpoint + '/get-inspirational-quote', { "user_id": this.username }).subscribe({
        next: data => {
          //console.log("Inspirational quote: " + JSON.stringify(data));
          var json_data = JSON.parse(JSON.stringify(data));
          this.unlockedInspirationalQuotes = [];
          for(var i=0; i < json_data.length;  i++){
            this.unlockedInspirationalQuotes.push({
              "image": "https://aws-website-sara-ubicomp-h28yp.s3.amazonaws.com/sarapp/engagement_images/"  + json_data[i].image,
              "author": json_data[i].author,
              "quote_text": json_data[i].quote_text
            });
          }
          window.localStorage.setItem('saved_quotes', JSON.stringify(this.unlockedInspirationalQuotes));
        },
        error: error => console.error('There was an error!', error)
    });
  }

}

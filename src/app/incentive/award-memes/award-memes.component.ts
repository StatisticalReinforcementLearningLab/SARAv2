import { Component, OnInit } from '@angular/core';

import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-award-memes',
  templateUrl: './award-memes.component.html',
  styleUrls: ['./award-memes.component.scss'],
})
export class AwardMemesComponent implements OnInit {

  whichImage: string;
  //src="{{whichImage}}"
  constructor(private ga: GoogleAnalytics,
    private router: Router) {
  }

  ngOnInit() {
    this.ga.trackView('Life-insight')
    .then(() => {console.log("trackView at Life-insight!")})
    .catch(e => console.log(e));

    var randomInt = Math.floor(Math.random() * 5) + 1;
    this.whichImage = "./assets/memes/"+randomInt+".jpg";
  }

  ratingChanged(rating){
    if(rating==0)
      console.log("thumbs down");
    else
      console.log("thumbs up");
    
    this.router.navigate(['incentive/aquarium/aquariumone']);
  }

}

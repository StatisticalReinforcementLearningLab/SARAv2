import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-award-altruism',
  templateUrl: './award-altruism.component.html',
  styleUrls: ['./award-altruism.component.scss'],
})
export class AwardAltruismComponent implements OnInit {


  whichImage: string;
  altruism_data: any;


  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {

    //var randomInt = Math.floor(Math.random() * 5) + 1;
    //this.whichImage = "./assets/memes/"+randomInt+".jpg";
    //console.log('Reading local json files: ' + this.fileLink);
    fetch('./assets/altruism/altruism_list.json').then(async res => {
      this.altruism_data = await res.json();
      this.showaltruism();
    });
  }

  showaltruism(){
    var randomInt = Math.floor(Math.random() * this.altruism_data.length);
    this.whichImage = "./assets/altruism/"+this.altruism_data[randomInt]["filename"];
  }
  
  ratingChanged(rating){
    if(rating==0)
      console.log("thumbs down");
    else
      console.log("thumbs up");
    
    //this.router.navigate(['incentive/aquarium/aquariumone']);
    //this.router.navigate(['/home']);

    //
    window.location.href = '/home';
  }

}

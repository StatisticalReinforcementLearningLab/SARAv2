import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-award-memes',
  templateUrl: './award-memes.component.html',
  styleUrls: ['./award-memes.component.scss'],
})
export class AwardMemesComponent implements OnInit {

  whichImage: string;
  //src="{{whichImage}}"
  constructor() { }

  ngOnInit() {
    var randomInt = Math.floor(Math.random() * 5) + 1;
    this.whichImage = "./assets/memes/"+randomInt+".jpg";
  }

}

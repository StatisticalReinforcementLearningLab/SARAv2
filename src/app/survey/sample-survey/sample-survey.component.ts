import { Component, OnInit } from '@angular/core';
//import { PreLoad } from '../../PreLoad';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@Component({
  selector: 'app-sample-survey',
  templateUrl: './sample-survey.component.html',
  styleUrls: ['./sample-survey.component.scss'],
})

//@PreLoad('life-insights')
export class SampleSurveyComponent implements OnInit {

  constructor(private ga: GoogleAnalytics) { }

  ngOnInit() {
    this.ga.trackView('Survey')
    .then(() => {console.log("trackView at Survey!")})
    .catch(e => console.log('Error starting GoogleAnalytics == '+ e));

  }

}

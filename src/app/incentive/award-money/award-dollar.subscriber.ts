import { SurveySubscriber } from '../../survey/survey-subscriber';

import { AwardDollarService } from './award-dollar.service';

export class AwardDollarSubscriber implements SurveySubscriber {

  constructor(private ads: AwardDollarService){}

  surveyCompleted(data, store) { console.log("Called!");
this.ads.giveDollars(); }
}

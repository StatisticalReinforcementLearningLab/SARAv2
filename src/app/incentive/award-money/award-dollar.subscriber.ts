import { NgxPubSubService } from '@pscoped/ngx-pub-sub';

import { SurveySubscriber } from '../../survey/survey-subscriber';

import { AwardDollarService } from './award-dollar.service';

export class AwardDollarSubscriber implements SurveySubscriber {

  static readonly EventTypes = { dollarsAwarded: 'dollarsAwarded' };

  constructor(private pubSub: NgxPubSubService, private ads: AwardDollarService){}

  surveyCompleted(data, store) {
    var pastDollars = this.ads.getDollars();
    var dollars = this.ads.giveDollars();
    this.pubSub.publishEvent(AwardDollarSubscriber.EventTypes.dollarsAwarded, dollars - pastDollars);
  }
}

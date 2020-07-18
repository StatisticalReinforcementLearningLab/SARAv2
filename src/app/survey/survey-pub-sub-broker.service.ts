import { Injectable } from '@angular/core';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import { SurveySubscriber } from './survey-subscriber';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers/index';

import { AwardDollarSubscriber } from '../incentive/award-money/award-dollar.subscriber';
import { AwardDollarService } from '../incentive/award-money/award-dollar.service'; // TODO: Eventually, award-dollar.service will disappear.  For now, I'm just focusing on the pub/sub without changing anything else.

@Injectable({
  providedIn: 'root'
})
export class SurveyPubSubBrokerService {

  readonly EventTypes = { surveyCompleted: 'surveyCompleted' };

  subscribers: SurveySubscriber[];

  constructor(private pubSub: NgxPubSubService, private store: Store<AppState>, private ads: AwardDollarService) { 
    this.subscribers = [ new AwardDollarSubscriber(this.pubSub, this.ads) ];
    const _store = this.store;
    for (var i = 0; i < this.subscribers.length; i++){
      const subscriber = this.subscribers[i];
      this.pubSub.subscribe(this.EventTypes.surveyCompleted, function(data){
        subscriber.surveyCompleted(data, _store);
      });
    }
  }
}

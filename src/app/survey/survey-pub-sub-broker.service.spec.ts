import { TestBed } from '@angular/core/testing';

import { SurveyPubSubBrokerService } from './survey-pub-sub-broker.service';

describe('SurveyPubSubBrokerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SurveyPubSubBrokerService = TestBed.get(SurveyPubSubBrokerService);
    expect(service).toBeTruthy();
  });
});

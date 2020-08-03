import { TestBed } from '@angular/core/testing';

import { AwardDollarService } from './award-dollar.service';

xdescribe('AwardDollarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: AwardDollarService = TestBed.get(AwardDollarService);
    expect(service).toBeTruthy();
  });

  
});

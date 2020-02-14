import { TestBed } from '@angular/core/testing';

import { AwardDollarService } from './award-dollar.service';

describe('AwardDollarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AwardDollarService = TestBed.get(AwardDollarService);
    expect(service).toBeTruthy();
  });
});

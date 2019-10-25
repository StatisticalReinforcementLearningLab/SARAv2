import { TestBed } from '@angular/core/testing';

import { OneSignalService } from './one-signal.service';

describe('OneSignalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OneSignalService = TestBed.get(OneSignalService);
    expect(service).toBeTruthy();
  });
});

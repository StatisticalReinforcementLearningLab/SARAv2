import { TestBed } from '@angular/core/testing';

import { ComputeServiceService } from './compute-service.service';

describe('ComputeServiceService', () => {
  let service: ComputeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComputeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

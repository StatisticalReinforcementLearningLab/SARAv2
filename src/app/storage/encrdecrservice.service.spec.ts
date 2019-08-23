import { TestBed } from '@angular/core/testing';

import { EncrdecrserviceService } from './encrdecrservice.service';

describe('EncrdecrserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EncrdecrserviceService = TestBed.get(EncrdecrserviceService);
    expect(service).toBeTruthy();
  });
});

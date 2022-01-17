import { TestBed } from '@angular/core/testing';

import { EncrDecrService } from './encrdecrservice.service';

describe('EncrdecrserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EncrDecrService = TestBed.get(EncrDecrService);
    expect(service).toBeTruthy();
  });
});

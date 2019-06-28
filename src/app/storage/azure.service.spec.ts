import { TestBed } from '@angular/core/testing';

import { AzureService } from './azure.service';

describe('AzureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AzureService = TestBed.get(AzureService);
    expect(service).toBeTruthy();
  });
});

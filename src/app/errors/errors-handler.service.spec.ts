import { TestBed } from '@angular/core/testing';

import { ErrorsHandler } from './errors-handler.service';

describe('ErrorsHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ErrorsHandler = TestBed.get(ErrorsHandler);
    expect(service).toBeTruthy();
  });
});

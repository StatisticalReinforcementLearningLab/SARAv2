import { TestBed } from '@angular/core/testing';

import { StoreToFirebaseService } from './store-to-firebase.service';

describe('StoreToFirebaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StoreToFirebaseService = TestBed.get(StoreToFirebaseService);
    expect(service).toBeTruthy();
  });
});

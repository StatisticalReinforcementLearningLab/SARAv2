import { TestBed } from '@angular/core/testing';

import { AwsS3Service } from './aws-s3.service';

describe('AwsS3Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AwsS3Service = TestBed.get(AwsS3Service);
    expect(service).toBeTruthy();
  });
});

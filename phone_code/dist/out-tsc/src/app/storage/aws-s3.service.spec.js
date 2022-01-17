import { TestBed } from '@angular/core/testing';
import { AwsS3Service } from './aws-s3.service';
describe('AwsS3Service', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(AwsS3Service);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=aws-s3.service.spec.js.map
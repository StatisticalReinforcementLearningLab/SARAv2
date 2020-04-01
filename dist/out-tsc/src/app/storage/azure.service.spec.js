import { TestBed } from '@angular/core/testing';
import { AzureService } from './azure.service';
describe('AzureService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(AzureService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=azure.service.spec.js.map
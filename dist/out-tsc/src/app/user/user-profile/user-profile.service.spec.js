import { TestBed } from '@angular/core/testing';
import { UserProfileService } from './user-profile.service';
describe('UserProfileService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(UserProfileService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=user-profile.service.spec.js.map
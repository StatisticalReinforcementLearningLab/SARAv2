import { async, TestBed } from '@angular/core/testing';
import { UnlockedMemesComponent } from './unlocked-memes.component';
describe('UnlockedMemesComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [UnlockedMemesComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(UnlockedMemesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=unlocked-memes.component.spec.js.map
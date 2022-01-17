import { async, TestBed } from '@angular/core/testing';
import { UnlockedAltuisticMessagesComponent } from './unlocked-altuistic-messages.component';
describe('UnlockedAltuisticMessagesComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [UnlockedAltuisticMessagesComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(UnlockedAltuisticMessagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=unlocked-altuistic-messages.component.spec.js.map
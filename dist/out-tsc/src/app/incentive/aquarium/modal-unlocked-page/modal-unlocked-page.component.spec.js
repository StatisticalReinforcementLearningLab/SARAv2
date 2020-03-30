import { async, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalUnlockedPageComponent } from './modal-unlocked-page.component';
describe('ModalUnlockedPageComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ModalUnlockedPageComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();
        fixture = TestBed.createComponent(ModalUnlockedPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=modal-unlocked-page.component.spec.js.map
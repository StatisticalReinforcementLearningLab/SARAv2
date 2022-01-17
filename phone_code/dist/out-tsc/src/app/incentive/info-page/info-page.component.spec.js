import { async, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { InfoPageComponent } from './info-page.component';
describe('InfoPageComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [InfoPageComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();
        fixture = TestBed.createComponent(InfoPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=info-page.component.spec.js.map
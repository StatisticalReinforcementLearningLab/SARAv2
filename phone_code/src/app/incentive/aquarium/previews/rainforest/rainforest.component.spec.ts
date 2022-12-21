import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RainforestComponent } from './rainforest.component';

describe('RainforestComponent', () => {
  let component: RainforestComponent;
  let fixture: ComponentFixture<RainforestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RainforestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RainforestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardAltruismComponent } from './award-altruism.component';

describe('AwardAltruismComponent', () => {
  let component: AwardAltruismComponent;
  let fixture: ComponentFixture<AwardAltruismComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardAltruismComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardAltruismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

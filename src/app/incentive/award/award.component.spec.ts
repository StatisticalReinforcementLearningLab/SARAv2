import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardComponent } from './award.component';

describe('AwardComponent', () => {
  let component: AwardComponent;
  let fixture: ComponentFixture<AwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

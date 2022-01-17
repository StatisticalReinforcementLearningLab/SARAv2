import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Q1MotivatedComponent } from './q1-motivated.component';

describe('Q1MotivatedComponent', () => {
  let component: Q1MotivatedComponent;
  let fixture: ComponentFixture<Q1MotivatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Q1MotivatedComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Q1MotivatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTask2Component } from './active-task2.component';

describe('ActiveTask2Component', () => {
  let component: ActiveTask2Component;
  let fixture: ComponentFixture<ActiveTask2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveTask2Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveTask2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

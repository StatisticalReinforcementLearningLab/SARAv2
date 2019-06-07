import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivetaskComponent } from './activetask.component';

describe('ActivetaskComponent', () => {
  let component: ActivetaskComponent;
  let fixture: ComponentFixture<ActivetaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivetaskComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivetaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

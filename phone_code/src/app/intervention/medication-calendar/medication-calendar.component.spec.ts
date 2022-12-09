import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MedicationCalendarComponent } from './medication-calendar.component';

describe('MedicationCalendarComponent', () => {
  let component: MedicationCalendarComponent;
  let fixture: ComponentFixture<MedicationCalendarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicationCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicationCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

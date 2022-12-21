import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SleepSurveyComponent } from './sleep-survey.component';

describe('SleepSurveyComponent', () => {
  let component: SleepSurveyComponent;
  let fixture: ComponentFixture<SleepSurveyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SleepSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SleepSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

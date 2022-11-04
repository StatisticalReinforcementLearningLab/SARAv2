import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SleepSurveyWithPredictionComponent } from './sleep-survey-with-prediction.component';

describe('SleepSurveyWithPredictionComponent', () => {
  let component: SleepSurveyWithPredictionComponent;
  let fixture: ComponentFixture<SleepSurveyWithPredictionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SleepSurveyWithPredictionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SleepSurveyWithPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

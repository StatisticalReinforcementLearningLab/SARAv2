import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SleepStudyEveningSurveyComponent } from './sleep-study-evening-survey.component';

describe('SleepStudyEveningSurveyComponent', () => {
  let component: SleepStudyEveningSurveyComponent;
  let fixture: ComponentFixture<SleepStudyEveningSurveyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SleepStudyEveningSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SleepStudyEveningSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

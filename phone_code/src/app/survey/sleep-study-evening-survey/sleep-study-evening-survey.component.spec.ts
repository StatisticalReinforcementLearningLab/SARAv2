import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SleepStudyEveningSurveyComponent } from './sleep-study-evening-survey.component';

describe('SleepStudyEveningSurveyComponent', () => {
  let component: SleepStudyEveningSurveyComponent;
  let fixture: ComponentFixture<SleepStudyEveningSurveyComponent>;

  beforeEach(async(() => {
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

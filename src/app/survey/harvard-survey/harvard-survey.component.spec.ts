import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvardSurveyComponent } from './harvard-survey.component';

describe('HarvardSurveyComponent', () => {
  let component: HarvardSurveyComponent;
  let fixture: ComponentFixture<HarvardSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarvardSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvardSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

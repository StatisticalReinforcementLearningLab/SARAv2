import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DogsSurveyComponent } from './dogs-survey.component';

describe('DogsSurveyComponent', () => {
  let component: DogsSurveyComponent;
  let fixture: ComponentFixture<DogsSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DogsSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DogsSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

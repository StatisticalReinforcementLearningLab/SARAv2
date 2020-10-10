import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAllLifeInsightsComponent } from './show-all-life-insights.component';

describe('ShowAllLifeInsightsComponent', () => {
  let component: ShowAllLifeInsightsComponent;
  let fixture: ComponentFixture<ShowAllLifeInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowAllLifeInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAllLifeInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidingBaselineComponent } from './sliding-baseline.component';

describe('SlidingBaselineComponent', () => {
  let component: SlidingBaselineComponent;
  let fixture: ComponentFixture<SlidingBaselineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidingBaselineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidingBaselineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

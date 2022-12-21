import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SleepMonitoringComponent } from './sleep-monitoring.component';

describe('SleepMonitoringComponent', () => {
  let component: SleepMonitoringComponent;
  let fixture: ComponentFixture<SleepMonitoringComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SleepMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SleepMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

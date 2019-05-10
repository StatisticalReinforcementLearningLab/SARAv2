import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MorningReportComponent } from './morning-report.component';

describe('MorningReportComponent', () => {
  let component: MorningReportComponent;
  let fixture: ComponentFixture<MorningReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MorningReportComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MorningReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

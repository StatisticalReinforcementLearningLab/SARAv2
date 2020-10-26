import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplePythonViewComponent } from './sample-python-view.component';

describe('SamplePythonViewComponent', () => {
  let component: SamplePythonViewComponent;
  let fixture: ComponentFixture<SamplePythonViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamplePythonViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplePythonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

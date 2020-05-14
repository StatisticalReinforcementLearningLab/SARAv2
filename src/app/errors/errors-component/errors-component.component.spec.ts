import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorsComponentComponent } from './errors-component.component';

describe('ErrorsComponentComponent', () => {
  let component: ErrorsComponentComponent;
  let fixture: ComponentFixture<ErrorsComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorsComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

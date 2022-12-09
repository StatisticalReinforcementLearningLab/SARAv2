import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SeaComponent } from './sea.component';

describe('SeaComponent', () => {
  let component: SeaComponent;
  let fixture: ComponentFixture<SeaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SeaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TundraComponent } from './tundra.component';

describe('TundraComponent', () => {
  let component: TundraComponent;
  let fixture: ComponentFixture<TundraComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TundraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TundraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

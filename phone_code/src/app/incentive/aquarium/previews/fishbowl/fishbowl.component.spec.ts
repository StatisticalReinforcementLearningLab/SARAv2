import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FishbowlComponent } from './fishbowl.component';

describe('FishbowlComponent', () => {
  let component: FishbowlComponent;
  let fixture: ComponentFixture<FishbowlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FishbowlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FishbowlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AquariumComponent } from './aquarium.component';

describe('AquariumComponent', () => {
  let component: AquariumComponent;
  let fixture: ComponentFixture<AquariumComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AquariumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AquariumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

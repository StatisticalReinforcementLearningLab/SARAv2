import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RainforestComponent } from './rainforest.component';

describe('RainforestComponent', () => {
  let component: RainforestComponent;
  let fixture: ComponentFixture<RainforestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RainforestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RainforestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

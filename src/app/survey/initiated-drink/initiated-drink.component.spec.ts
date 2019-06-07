import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiatedDrinkComponent } from './initiated-drink.component';


describe('InitiatedDrinkComponent', () => {
  let component: InitiatedDrinkComponent;
  let fixture: ComponentFixture<InitiatedDrinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiatedDrinkComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiatedDrinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

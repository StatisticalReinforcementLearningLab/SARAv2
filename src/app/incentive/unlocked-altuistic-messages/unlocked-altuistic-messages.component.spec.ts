import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockedAltuisticMessagesComponent } from './unlocked-altuistic-messages.component';

describe('UnlockedAltuisticMessagesComponent', () => {
  let component: UnlockedAltuisticMessagesComponent;
  let fixture: ComponentFixture<UnlockedAltuisticMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnlockedAltuisticMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockedAltuisticMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

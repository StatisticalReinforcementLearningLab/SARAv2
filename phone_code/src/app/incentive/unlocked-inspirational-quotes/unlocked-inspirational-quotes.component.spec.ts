import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnlockedInspirationalQuotesComponent } from './unlocked-inspirational-quotes.component';

describe('UnlockedInspirationalQuotesComponent', () => {
  let component: UnlockedInspirationalQuotesComponent;
  let fixture: ComponentFixture<UnlockedInspirationalQuotesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UnlockedInspirationalQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockedInspirationalQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

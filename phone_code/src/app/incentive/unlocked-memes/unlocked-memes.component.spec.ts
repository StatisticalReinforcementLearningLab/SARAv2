import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnlockedMemesComponent } from './unlocked-memes.component';

describe('UnlockedMemesComponent', () => {
  let component: UnlockedMemesComponent;
  let fixture: ComponentFixture<UnlockedMemesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UnlockedMemesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockedMemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

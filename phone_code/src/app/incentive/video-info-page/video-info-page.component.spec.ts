import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VideoInfoPageComponent } from './video-info-page.component';

describe('VideoInfoPageComponent', () => {
  let component: VideoInfoPageComponent;
  let fixture: ComponentFixture<VideoInfoPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

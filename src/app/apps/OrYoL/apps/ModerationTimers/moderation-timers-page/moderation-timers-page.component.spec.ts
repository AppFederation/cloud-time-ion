import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModerationTimersPageComponent } from './moderation-timers-page.component';

describe('ModerationTimersPageComponent', () => {
  let component: ModerationTimersPageComponent;
  let fixture: ComponentFixture<ModerationTimersPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModerationTimersPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModerationTimersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

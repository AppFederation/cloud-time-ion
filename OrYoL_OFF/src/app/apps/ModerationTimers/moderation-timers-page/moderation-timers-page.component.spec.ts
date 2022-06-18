import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationTimersPageComponent } from './moderation-timers-page.component';

describe('ModerationTimersPageComponent', () => {
  let component: ModerationTimersPageComponent;
  let fixture: ComponentFixture<ModerationTimersPageComponent>;

  beforeEach(async(() => {
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

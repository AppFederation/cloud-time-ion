import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTrackingMenuComponent } from './time-tracking-menu.component';

describe('TimeTrackingMenuComponent', () => {
  let component: TimeTrackingMenuComponent;
  let fixture: ComponentFixture<TimeTrackingMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeTrackingMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeTrackingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

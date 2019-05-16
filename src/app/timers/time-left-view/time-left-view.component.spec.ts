import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLeftViewComponent } from './time-left-view.component';

describe('TimeLeftViewComponent', () => {
  let component: TimeLeftViewComponent;
  let fixture: ComponentFixture<TimeLeftViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeLeftViewComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLeftViewComponent);
    component = fixture.componentInstance;
    component.endTime = new Date()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

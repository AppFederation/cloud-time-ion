import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimePassingComponent } from './time-passing.component';

describe('TimeLeftViewComponent', () => {
  let component: TimePassingComponent;
  let fixture: ComponentFixture<TimePassingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimePassingComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePassingComponent);
    component = fixture.componentInstance;
    component.referenceTime = new Date()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

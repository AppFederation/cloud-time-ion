import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimersListComponent } from './timers-list.component';

xdescribe('TimersListComponent', () => {
  let component: TimersListComponent;
  let fixture: ComponentFixture<TimersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimersListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

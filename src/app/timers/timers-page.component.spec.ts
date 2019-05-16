import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimersPageComponent } from './timers-page.component';

xdescribe('TimersPageComponent', () => {
  let component: TimersPageComponent;
  let fixture: ComponentFixture<TimersPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimersPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

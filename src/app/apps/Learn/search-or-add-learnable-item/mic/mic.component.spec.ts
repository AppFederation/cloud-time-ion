import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicComponent } from './mic.component';

describe('MicComponent', () => {
  let component: MicComponent;
  let fixture: ComponentFixture<MicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

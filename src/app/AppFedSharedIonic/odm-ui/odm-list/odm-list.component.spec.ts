import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdmListComponent } from './odm-list.component';

describe('OdmListComponent', () => {
  let component: OdmListComponent;
  let fixture: ComponentFixture<OdmListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdmListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

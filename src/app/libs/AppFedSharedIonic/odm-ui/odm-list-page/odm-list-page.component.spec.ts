import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdmListPageComponent } from './odm-list-page.component';

describe('OdmListPageComponent', () => {
  let component: OdmListPageComponent;
  let fixture: ComponentFixture<OdmListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdmListPageComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdmListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

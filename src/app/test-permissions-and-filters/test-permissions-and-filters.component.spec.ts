import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPermissionsAndFiltersComponent } from './test-permissions-and-filters.component';

describe('TestPermissionsAndFiltersComponent', () => {
  let component: TestPermissionsAndFiltersComponent;
  let fixture: ComponentFixture<TestPermissionsAndFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestPermissionsAndFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPermissionsAndFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

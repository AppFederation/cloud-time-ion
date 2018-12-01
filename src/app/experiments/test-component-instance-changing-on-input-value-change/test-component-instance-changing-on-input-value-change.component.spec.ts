import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestComponentInstanceChangingOnInputValueChangeComponent } from './test-component-instance-changing-on-input-value-change.component';

describe('TestComponentInstanceChangingOnInputValueChangeComponent', () => {
  let component: TestComponentInstanceChangingOnInputValueChangeComponent;
  let fixture: ComponentFixture<TestComponentInstanceChangingOnInputValueChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestComponentInstanceChangingOnInputValueChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponentInstanceChangingOnInputValueChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

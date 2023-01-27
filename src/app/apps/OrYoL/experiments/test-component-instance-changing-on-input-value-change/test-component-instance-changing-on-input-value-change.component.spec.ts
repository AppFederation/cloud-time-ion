import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TestComponentInstanceChangingOnInputValueChangeComponent } from './test-component-instance-changing-on-input-value-change.component';

xdescribe('TestComponentInstanceChangingOnInputValueChangeComponent', () => {
  let component: TestComponentInstanceChangingOnInputValueChangeComponent;
  let fixture: ComponentFixture<TestComponentInstanceChangingOnInputValueChangeComponent>;

  beforeEach(waitForAsync(() => {
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

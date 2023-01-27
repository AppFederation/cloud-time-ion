import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NestedTreeNodeComponent } from './nested-tree-node.component';

xdescribe('NestedTreeNodeComponent', () => {
  let component: NestedTreeNodeComponent;
  let fixture: ComponentFixture<NestedTreeNodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NestedTreeNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedTreeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

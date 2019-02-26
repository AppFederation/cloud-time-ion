import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedTreeNodeComponent } from './nested-tree-node.component';

describe('NestedTreeNodeComponent', () => {
  let component: NestedTreeNodeComponent;
  let fixture: ComponentFixture<NestedTreeNodeComponent>;

  beforeEach(async(() => {
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteTreeNodeComponent } from './confirm-delete-tree-node.component';

describe('ConfirmDeleteTreeNodeComponent', () => {
  let component: ConfirmDeleteTreeNodeComponent;
  let fixture: ComponentFixture<ConfirmDeleteTreeNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteTreeNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteTreeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeNodeMenuComponent } from './tree-node-menu.component';

describe('TreeNodeMenuComponent', () => {
  let component: TreeNodeMenuComponent;
  let fixture: ComponentFixture<TreeNodeMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeNodeMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeNodeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

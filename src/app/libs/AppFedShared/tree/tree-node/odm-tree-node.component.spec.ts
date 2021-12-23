import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdmTreeNodeComponent } from './odm-tree-node.component';

describe('TreeNodeComponent', () => {
  let component: OdmTreeNodeComponent;
  let fixture: ComponentFixture<OdmTreeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdmTreeNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdmTreeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

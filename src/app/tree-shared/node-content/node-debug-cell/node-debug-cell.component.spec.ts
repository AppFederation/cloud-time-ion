import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeDebugCellComponent } from './node-debug-cell.component';

describe('NodeDebugCellComponent', () => {
  let component: NodeDebugCellComponent;
  let fixture: ComponentFixture<NodeDebugCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeDebugCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeDebugCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

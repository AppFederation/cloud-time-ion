import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeCellComponent } from './node-cell.component';

describe('NodeCellComponent', () => {
  let component: NodeCellComponent;
  let fixture: ComponentFixture<NodeCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

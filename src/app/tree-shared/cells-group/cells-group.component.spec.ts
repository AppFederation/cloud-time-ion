import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellsGroupComponent } from './cells-group.component';

describe('CellsGroupComponent', () => {
  let component: CellsGroupComponent;
  let fixture: ComponentFixture<CellsGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellsGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

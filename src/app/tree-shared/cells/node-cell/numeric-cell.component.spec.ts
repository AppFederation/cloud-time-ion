import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericCellComponent } from './numeric-cell.component';

describe('NodeCellComponent', () => {
  let component: NumericCellComponent;
  let fixture: ComponentFixture<NumericCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumericCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumericCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

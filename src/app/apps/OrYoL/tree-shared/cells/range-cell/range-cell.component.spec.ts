import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RangeCellComponent } from './range-cell.component';

describe('RangeCellComponent', () => {
  let component: RangeCellComponent;
  let fixture: ComponentFixture<RangeCellComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

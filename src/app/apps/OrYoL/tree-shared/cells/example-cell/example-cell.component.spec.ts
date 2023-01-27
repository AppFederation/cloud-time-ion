import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExampleCellComponent } from './example-cell.component';

describe('ExampleCellComponent', () => {
  let component: ExampleCellComponent;
  let fixture: ComponentFixture<ExampleCellComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExampleCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

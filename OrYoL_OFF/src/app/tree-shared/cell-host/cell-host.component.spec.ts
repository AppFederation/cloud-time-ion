import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellHostComponent } from './cell-host.component';

describe('CellHostComponent', () => {
  let component: CellHostComponent;
  let fixture: ComponentFixture<CellHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

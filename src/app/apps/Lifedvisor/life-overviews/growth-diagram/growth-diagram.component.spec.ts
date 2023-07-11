import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthDiagramComponent } from './growth-diagram.component';

describe('GrowthDiagramComponent', () => {
  let component: GrowthDiagramComponent;
  let fixture: ComponentFixture<GrowthDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowthDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowthDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

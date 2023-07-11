import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IkigaiDiagramComponent } from './ikigai-diagram.component';

describe('IkigaiDiagramComponent', () => {
  let component: IkigaiDiagramComponent;
  let fixture: ComponentFixture<IkigaiDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IkigaiDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IkigaiDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

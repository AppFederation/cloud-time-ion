import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeHostComponent } from './tree-host.component';

describe('TreeHostComponent', () => {
  let component: TreeHostComponent;
  let fixture: ComponentFixture<TreeHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

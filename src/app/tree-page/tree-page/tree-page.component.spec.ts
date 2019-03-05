import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreePageComponent } from './tree-page.component';

describe('TreePageComponent', () => {
  let component: TreePageComponent;
  let fixture: ComponentFixture<TreePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

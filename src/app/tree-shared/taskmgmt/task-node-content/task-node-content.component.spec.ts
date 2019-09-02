import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskNodeContentComponent } from './task-node-content.component';

describe('TaskNodeContentComponent', () => {
  let component: TaskNodeContentComponent;
  let fixture: ComponentFixture<TaskNodeContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskNodeContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskNodeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

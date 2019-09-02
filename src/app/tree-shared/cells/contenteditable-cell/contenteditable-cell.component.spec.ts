import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenteditableCellComponent } from './contenteditable-cell.component';

describe('ContenteditableCellComponent', () => {
  let component: ContenteditableCellComponent;
  let fixture: ComponentFixture<ContenteditableCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContenteditableCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContenteditableCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

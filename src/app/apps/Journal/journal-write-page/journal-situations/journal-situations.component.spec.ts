import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalSituationsComponent } from './journal-situations.component';

describe('JournalSituationsComponent', () => {
  let component: JournalSituationsComponent;
  let fixture: ComponentFixture<JournalSituationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalSituationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalSituationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JournalEntriesListPage } from './journal-entries-list.page';

describe('JournalEntriesListPage', () => {
  let component: JournalEntriesListPage;
  let fixture: ComponentFixture<JournalEntriesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalEntriesListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JournalEntriesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

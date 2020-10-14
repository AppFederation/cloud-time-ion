import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JournalNumFieldsViewComponent } from './journal-num-fields-view.component';

describe('JournalNumFieldsViewComponent', () => {
  let component: JournalNumFieldsViewComponent;
  let fixture: ComponentFixture<JournalNumFieldsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalNumFieldsViewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JournalNumFieldsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

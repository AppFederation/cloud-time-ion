import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchOrAddTextEditorComponent } from './search-or-add-text-editor.component';

describe('SearchOrAddTextEditorComponent', () => {
  let component: SearchOrAddTextEditorComponent;
  let fixture: ComponentFixture<SearchOrAddTextEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchOrAddTextEditorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchOrAddTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

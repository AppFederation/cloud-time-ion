import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RichTextEditCellComponent } from './rich-text-edit-cell.component';

describe('RichTextEditCellComponent', () => {
  let component: RichTextEditCellComponent;
  let fixture: ComponentFixture<RichTextEditCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RichTextEditCellComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RichTextEditCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

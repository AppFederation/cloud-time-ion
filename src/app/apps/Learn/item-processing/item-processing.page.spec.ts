import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItemProcessingPage } from './item-processing.page';

describe('ItemProcessingPage', () => {
  let component: ItemProcessingPage;
  let fixture: ComponentFixture<ItemProcessingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemProcessingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemProcessingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MindfulnessPage } from './mindfulness.page';

describe('MindfulnessPage', () => {
  let component: MindfulnessPage;
  let fixture: ComponentFixture<MindfulnessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MindfulnessPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MindfulnessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

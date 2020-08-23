import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowAnswerAndRateComponent } from './show-answer-and-rate.component';

describe('ShowAnswerAndRateComponent', () => {
  let component: ShowAnswerAndRateComponent;
  let fixture: ComponentFixture<ShowAnswerAndRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowAnswerAndRateComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowAnswerAndRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

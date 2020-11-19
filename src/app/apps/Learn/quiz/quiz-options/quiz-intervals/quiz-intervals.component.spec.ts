import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuizIntervalsComponent } from './quiz-intervals.component';

describe('QuizIntervalsComponent', () => {
  let component: QuizIntervalsComponent;
  let fixture: ComponentFixture<QuizIntervalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizIntervalsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizIntervalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

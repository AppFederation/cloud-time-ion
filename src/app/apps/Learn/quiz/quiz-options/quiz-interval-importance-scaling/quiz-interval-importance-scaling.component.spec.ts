import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuizIntervalImportanceScalingComponent } from './quiz-interval-importance-scaling.component';

describe('QuizIntervalImportanceScalingComponent', () => {
  let component: QuizIntervalImportanceScalingComponent;
  let fixture: ComponentFixture<QuizIntervalImportanceScalingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizIntervalImportanceScalingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizIntervalImportanceScalingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

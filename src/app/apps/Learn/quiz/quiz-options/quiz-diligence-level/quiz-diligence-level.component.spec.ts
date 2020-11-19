import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuizDiligenceLevelComponent } from './quiz-diligence-level.component';

describe('QuizDiligenceLevelComponent', () => {
  let component: QuizDiligenceLevelComponent;
  let fixture: ComponentFixture<QuizDiligenceLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizDiligenceLevelComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizDiligenceLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuizItemsLeftComponent } from './quiz-items-left.component';

describe('QuizItemsLeftComponent', () => {
  let component: QuizItemsLeftComponent;
  let fixture: ComponentFixture<QuizItemsLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizItemsLeftComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizItemsLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

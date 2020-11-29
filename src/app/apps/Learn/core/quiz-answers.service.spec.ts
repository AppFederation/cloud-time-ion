import { TestBed } from '@angular/core/testing';

import { QuizAnswersService } from './quiz-answers.service';

describe('QuizAnswersService', () => {
  let service: QuizAnswersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizAnswersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

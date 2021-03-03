import { TestBed } from '@angular/core/testing';

import { QuizHistoryService } from './quiz-history.service';

describe('QuizHistoryService', () => {
  let service: QuizHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { LearnDoService } from './learn-do.service';

describe('LearnDoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LearnDoService = TestBed.get(LearnDoService);
    expect(service).toBeTruthy();
  });
});

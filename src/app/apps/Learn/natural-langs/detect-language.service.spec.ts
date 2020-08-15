import { TestBed } from '@angular/core/testing';

import { DetectLanguageService } from './detect-language.service';

describe('DetectLanguageService', () => {
  let service: DetectLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetectLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

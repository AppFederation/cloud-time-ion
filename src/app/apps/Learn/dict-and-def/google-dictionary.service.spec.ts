import { TestBed } from '@angular/core/testing';

import { GoogleDictionaryService } from './google-dictionary.service';

describe('GoogleDictionaryService', () => {
  let service: GoogleDictionaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleDictionaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

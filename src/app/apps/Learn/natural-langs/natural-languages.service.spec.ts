import { TestBed } from '@angular/core/testing';

import { NaturalLanguagesService } from './natural-languages.service';

describe('NaturalLanguagesService', () => {
  let service: NaturalLanguagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NaturalLanguagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
